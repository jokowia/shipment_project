-- Add telegram_chat_id column to admins table for per-admin notifications
ALTER TABLE admins ADD COLUMN telegram_chat_id TEXT;
