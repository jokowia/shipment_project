-- Migration: Add full_name to clients table

ALTER TABLE public.clients
ADD COLUMN full_name TEXT;
