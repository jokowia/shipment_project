-- Migration: Email Templates structure for Phase 2

-- Email Templates Table
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL, -- Storing HTML for Resend
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(admin_id, name)
);

-- RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view own templates" 
    ON email_templates FOR SELECT 
    USING (auth.uid() = admin_id);

CREATE POLICY "Admins can insert own templates" 
    ON email_templates FOR INSERT 
    WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Admins can update own templates" 
    ON email_templates FOR UPDATE 
    USING (auth.uid() = admin_id);

CREATE POLICY "Admins can delete own templates" 
    ON email_templates FOR DELETE 
    USING (auth.uid() = admin_id);

-- Ensure only one default template per admin
CREATE UNIQUE INDEX idx_default_template ON email_templates(admin_id) WHERE is_default = true;
