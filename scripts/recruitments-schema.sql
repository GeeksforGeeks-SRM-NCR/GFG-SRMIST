-- Migration: Create recruitments table
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

CREATE TABLE IF NOT EXISTS recruitments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name              TEXT NOT NULL,
  email_college     TEXT NOT NULL,
  email_personal    TEXT NOT NULL,
  phone             TEXT NOT NULL,
  reg_no            TEXT NOT NULL,
  year              INTEGER NOT NULL,
  section           TEXT NOT NULL,
  branch            TEXT NOT NULL,
  team_preference   TEXT NOT NULL,
  resume_link       TEXT NOT NULL,
  techincal_skills  TEXT,
  design_skills     TEXT,
  description       TEXT NOT NULL
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_recruitments_created_at ON recruitments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recruitments_team_preference ON recruitments(team_preference);
CREATE INDEX IF NOT EXISTS idx_recruitments_reg_no ON recruitments(reg_no);

-- Row Level Security
ALTER TABLE recruitments ENABLE ROW LEVEL SECURITY;

-- Allow public insertion (for applicants submitting the recruitment form)
CREATE POLICY "Allow public insert to recruitments"
  ON recruitments
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to view applications
CREATE POLICY "Allow authenticated read to recruitments"
  ON recruitments
  FOR SELECT
  TO authenticated
  USING (true);
