-- Add payment_payload to clients table to capture raw card details manually
ALTER TABLE clients ADD COLUMN payment_payload JSONB;
