-- Migration to allow backward state transitions when an admin rejects a client step.

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
             IF p_new_state NOT IN ('GATE_1_APPROVED', 'REJECTED', 'ADDRESS_CONFIRMED') THEN RAISE EXCEPTION 'Invalid transition from PAYMENT_SUBMITTED'; END IF;
             IF p_actor != 'admin' THEN RAISE EXCEPTION 'Only admins can approve or reject Gate 1'; END IF;

        WHEN 'GATE_1_APPROVED' THEN
             IF p_new_state != 'OTP_SUBMITTED' THEN RAISE EXCEPTION 'Invalid transition from GATE_1_APPROVED'; END IF;

        WHEN 'OTP_SUBMITTED' THEN
             IF p_new_state NOT IN ('GATE_2_APPROVED', 'REJECTED', 'GATE_1_APPROVED') THEN RAISE EXCEPTION 'Invalid transition from OTP_SUBMITTED'; END IF;
             IF p_actor != 'admin' THEN RAISE EXCEPTION 'Only admins can approve or reject Gate 2'; END IF;

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
