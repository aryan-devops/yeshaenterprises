-- =========================================
-- FIX: Public RLS Policies for Projects & Related Tables
-- This app uses a custom auth model (yesha_session cookie, not Supabase Auth).
-- auth.uid() is always NULL for these requests, so all auth.uid()-based
-- policies fail. We replace them with open policies that match how the app works.
-- Application-layer security (role checks, session guards) protects these routes.
-- =========================================

-- 1. PROJECTS TABLE
-- Allow anyone to insert projects (admin-only in UI via role guard)
DROP POLICY IF EXISTS "Super admins can insert projects" ON projects;
DROP POLICY IF EXISTS "Allow public insert on projects" ON projects;
CREATE POLICY "Allow public insert on projects" ON projects
  FOR INSERT WITH CHECK (true);

-- Fix the UPDATE policy (auth.uid() always null → replace with open policy)
DROP POLICY IF EXISTS "Allow project updates" ON projects;
CREATE POLICY "Allow project updates" ON projects
  FOR UPDATE USING (true);

-- Also replace the auth.uid()-based SELECT policy with the already existing public one
-- (The public select was added in migration 001, ensure no conflict)
DROP POLICY IF EXISTS "Projects are viewable by members or via share token" ON projects;

-- 2. PROJECT_MEMBERS TABLE
-- Allow public insert/delete so admin can assign members & technicians
DROP POLICY IF EXISTS "Allow public insert on project_members" ON project_members;
CREATE POLICY "Allow public insert on project_members" ON project_members
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can add order members" ON project_members;

DROP POLICY IF EXISTS "Allow public delete on project_members" ON project_members;
CREATE POLICY "Allow public delete on project_members" ON project_members
  FOR DELETE USING (true);

-- Also add public SELECT so the duplicate-member pre-check works without Supabase Auth
DROP POLICY IF EXISTS "Users can view order members" ON project_members;
DROP POLICY IF EXISTS "Allow public select on project_members" ON project_members;
CREATE POLICY "Allow public select on project_members" ON project_members
  FOR SELECT USING (true);

-- 3. CHAT_ROOMS TABLE
-- Allow public insert (admin creates chat rooms when order is created)
DROP POLICY IF EXISTS "Users can create chat rooms for their orders" ON chat_rooms;
DROP POLICY IF EXISTS "Allow public insert on chat_rooms" ON chat_rooms;
CREATE POLICY "Allow public insert on chat_rooms" ON chat_rooms
  FOR INSERT WITH CHECK (true);

-- 4. DISPATCHES TABLE
-- Allow admin to create/update dispatch records
DROP POLICY IF EXISTS "Allow public insert on dispatches" ON dispatches;
CREATE POLICY "Allow public insert on dispatches" ON dispatches
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on dispatches" ON dispatches;
CREATE POLICY "Allow public update on dispatches" ON dispatches
  FOR UPDATE USING (true);

-- 5. ACTIVITY_LOGS TABLE (if RLS enabled, ensure it allows inserts)
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select on activity_logs" ON activity_logs;
CREATE POLICY "Allow public select on activity_logs" ON activity_logs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on activity_logs" ON activity_logs;
CREATE POLICY "Allow public insert on activity_logs" ON activity_logs
  FOR INSERT WITH CHECK (true);

-- 6. PROJECT_DOCUMENTS TABLE
-- Allow public insert for document uploads
DROP POLICY IF EXISTS "Members can upload order documents" ON project_documents;
DROP POLICY IF EXISTS "Allow public insert on project_documents" ON project_documents;
CREATE POLICY "Allow public insert on project_documents" ON project_documents
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on project_documents" ON project_documents;
CREATE POLICY "Allow public delete on project_documents" ON project_documents
  FOR DELETE USING (true);
