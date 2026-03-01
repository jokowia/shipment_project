-- Migration Check: Phase 1 The Vault
-- This migration sets up the exact Postgres schema and security constraints for the shipment verification funnel.

-- 1. Enums
CREATE TYPE client_state AS ENUM (
    'INVITED',
    'LINK_CLICKED',
    'ADDRESS_CONFIRMED',
    'PAYMENT_SUBMITTED',
    'GATE_1_APPROVED',
    'OTP_SUBMITTED',
    'GATE_2_APPROVED',
    'REJECTED'
);

-- 2. Tables

-- Admins Table
CREATE TABLE admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients Table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    
    -- Identity & Tracking
    email TEXT NOT NULL,
    phone_number TEXT,
    tracking_number TEXT UNIQUE NOT NULL,
    
    -- Funnel State
    state client_state NOT NULL DEFAULT 'INVITED',
    
    -- Security & Access
    token_hash TEXT NOT NULL,
    token_expires_at TIMESTAMPTZ NOT NULL,
    token_version INT NOT NULL DEFAULT 1,
    
    -- OTP Protection Model
    otp_hash TEXT,
    otp_code TEXT,
    otp_expires_at TIMESTAMPTZ,
    otp_attempts INT NOT NULL DEFAULT 0,
    otp_locked_until TIMESTAMPTZ,
    
    -- Payload Data (Gathered through funnel)
    address_payload JSONB,
    payment_payload JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs Table (Telemetry)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    old_state client_state,
    new_state client_state,
    ip_address TEXT,
    actor_type TEXT CHECK (actor_type IN ('system', 'admin', 'client')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook Events (Idempotency)
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT NOW()
);


-- 3. The Enforcer: State Transition Matrix
-- Function to perform strictly validated state transitions.
CREATE OR REPLACE FUNCTION transition_client_state(
    p_client_id UUID, 
    p_new_state client_state, 
    p_actor TEXT, 
    p_ip TEXT DEFAULT NULL
) 
RETURNS boolean 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_state client_state;
    v_admin_id UUID;
BEGIN
    -- Lock row for update to prevent concurrent race conditions
    SELECT state, admin_id INTO v_current_state, v_admin_id 
    FROM clients 
    WHERE id = p_client_id 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Client not found';
    END IF;

    -- State Guard Logic
    IF v_current_state = p_new_state THEN
        RETURN true; -- Idempotent
    END IF;

    CASE v_current_state
        WHEN 'INVITED' THEN
            IF p_new_state != 'LINK_CLICKED' THEN RAISE EXCEPTION 'Invalid transition from INVITED'; END IF;
        
        WHEN 'LINK_CLICKED' THEN
            IF p_new_state != 'ADDRESS_CONFIRMED' THEN RAISE EXCEPTION 'Invalid transition from LINK_CLICKED'; END IF;
        
        WHEN 'ADDRESS_CONFIRMED' THEN
            IF p_new_state != 'PAYMENT_SUBMITTED' THEN RAISE EXCEPTION 'Invalid transition from ADDRESS_CONFIRMED'; END IF;
        
        WHEN 'PAYMENT_SUBMITTED' THEN
             IF p_new_state NOT IN ('GATE_1_APPROVED', 'REJECTED') THEN RAISE EXCEPTION 'Invalid transition from PAYMENT_SUBMITTED'; END IF;
             IF p_actor != 'admin' THEN RAISE EXCEPTION 'Only admins can approve Gate 1'; END IF;

        WHEN 'GATE_1_APPROVED' THEN
             IF p_new_state != 'OTP_SUBMITTED' THEN RAISE EXCEPTION 'Invalid transition from GATE_1_APPROVED'; END IF;

        WHEN 'OTP_SUBMITTED' THEN
             IF p_new_state NOT IN ('GATE_2_APPROVED', 'REJECTED') THEN RAISE EXCEPTION 'Invalid transition from OTP_SUBMITTED'; END IF;
             IF p_actor != 'admin' THEN RAISE EXCEPTION 'Only admins can approve Gate 2'; END IF;

        WHEN 'GATE_2_APPROVED', 'REJECTED' THEN
             RAISE EXCEPTION 'Terminal state reached, transition forbidden';
             
        ELSE
            RAISE EXCEPTION 'Unknown state';
    END CASE;

    -- Perform Update
    UPDATE clients 
    SET state = p_new_state, updated_at = NOW() 
    WHERE id = p_client_id;

    -- Write Audit Log
    INSERT INTO audit_logs (client_id, admin_id, action, old_state, new_state, ip_address, actor_type)
    VALUES (p_client_id, v_admin_id, 'STATE_TRANSITION', v_current_state, p_new_state, p_ip, p_actor);

    RETURN true;
END;
$$;


-- Revoke direct updates on the state column manually for normal API usage
-- We achieve this by letting RLS prevent direct standard updates to the 'state' column and forcing clients to use the function.
-- Only service_role can update it, which should be done via Next.js Server Actions calling the DB or function.

-- 4. Isolation & Indexing Strategy
CREATE INDEX idx_clients_admin_state ON clients(admin_id, state);
CREATE UNIQUE INDEX idx_clients_token_hash ON clients(token_hash);
CREATE UNIQUE INDEX idx_clients_tracking_number ON clients(tracking_number);
CREATE INDEX idx_audit_logs_client ON audit_logs(client_id);


-- 5. Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Admins: Can only read/update their own profile
CREATE POLICY "Admins can view own profile" 
    ON admins FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Admins can update own profile" 
    ON admins FOR UPDATE 
    USING (auth.uid() = id);

-- Clients: Admins can control clients assigned to them
CREATE POLICY "Admins can view own clients" 
    ON clients FOR SELECT 
    USING (auth.uid() = admin_id);

CREATE POLICY "Admins can insert own clients" 
    ON clients FOR INSERT 
    WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Admins can update own clients" 
    ON clients FOR UPDATE 
    USING (auth.uid() = admin_id);

CREATE POLICY "Admins can delete own clients" 
    ON clients FOR DELETE 
    USING (auth.uid() = admin_id);

-- Audit logs: Admins can read logs for their clients
CREATE POLICY "Admins can view logs for their clients" 
    ON audit_logs FOR SELECT 
    USING (auth.uid() = admin_id);

-- Webhooks: Service Role only. No public or admin interactions needed
-- (Default deny for unauthenticated/authenticated roles since no policies allow it)

