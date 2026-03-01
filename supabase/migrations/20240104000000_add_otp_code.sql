-- Migration: Add otp_code column to clients table
-- This allows the admin command center to display the raw OTP entered by the client for manual verification.

ALTER TABLE clients ADD COLUMN otp_code TEXT;
