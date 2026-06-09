-- Enable Row Level Security (RLS) on remaining tables if not already enabled
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;

-- =========================================
-- 1. CHAT ROOMS POLICIES
-- =========================================

-- View chat rooms: members of the order or admins
DROP POLICY IF EXISTS "Users can view chat rooms of their orders" ON chat_rooms;
CREATE POLICY "Users can view chat rooms of their orders" ON chat_rooms
  FOR SELECT USING (
    auth.uid() IN (SELECT pm.user_id FROM project_members pm WHERE pm.project_id = chat_rooms.project_id)
    OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin')
  );

-- Create chat rooms: members of the order or admins
DROP POLICY IF EXISTS "Users can create chat rooms for their orders" ON chat_rooms;
CREATE POLICY "Users can create chat rooms for their orders" ON chat_rooms
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT pm.user_id FROM project_members pm WHERE pm.project_id = chat_rooms.project_id)
    OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin')
  );

-- =========================================
-- 2. MESSAGES POLICIES
-- =========================================

-- View messages: members of the order or admins
DROP POLICY IF EXISTS "Users can view messages in their order chats" ON messages;
CREATE POLICY "Users can view messages in their order chats" ON messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT pm.user_id FROM project_members pm
      JOIN chat_rooms cr ON cr.project_id = pm.project_id
      WHERE cr.id = room_id
    )
    OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin')
  );

-- Send messages: members of the order or admins
DROP POLICY IF EXISTS "Users can send messages in their order chats" ON messages;
CREATE POLICY "Users can send messages in their order chats" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND (
      auth.uid() IN (
        SELECT pm.user_id FROM project_members pm
        JOIN chat_rooms cr ON cr.project_id = pm.project_id
        WHERE cr.id = room_id
      )
      OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin')
    )
  );

-- Delete messages: message sender or admins
DROP POLICY IF EXISTS "Users can delete own messages or admin can delete any" ON messages;
CREATE POLICY "Users can delete own messages or admin can delete any" ON messages
  FOR DELETE USING (
    auth.uid() = sender_id
    OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin')
  );

-- =========================================
-- 3. PROJECT MEMBERS POLICIES
-- =========================================

-- View members: member of the project or admin
DROP POLICY IF EXISTS "Users can view order members" ON project_members;
CREATE POLICY "Users can view order members" ON project_members
  FOR SELECT USING (
    auth.uid() = user_id
    OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin')
  );

-- Add members: admins only or users adding themselves
DROP POLICY IF EXISTS "Admins can add order members" ON project_members;
CREATE POLICY "Admins can add order members" ON project_members
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin')
    OR auth.uid() = user_id
  );

-- =========================================
-- 4. PROJECT DOCUMENTS POLICIES
-- =========================================

-- View documents: member of order or admin
DROP POLICY IF EXISTS "Users can view order documents" ON project_documents;
CREATE POLICY "Users can view order documents" ON project_documents
  FOR SELECT USING (
    auth.uid() IN (SELECT pm.user_id FROM project_members pm WHERE pm.project_id = project_documents.project_id)
    OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin')
  );

-- Upload documents: member of order or admin
DROP POLICY IF EXISTS "Members can upload order documents" ON project_documents;
CREATE POLICY "Members can upload order documents" ON project_documents
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT pm.user_id FROM project_members pm WHERE pm.project_id = project_documents.project_id)
    OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin')
  );

-- =========================================
-- 5. PUBLIC ORDER TRACKING READ POLICIES
-- =========================================
DROP POLICY IF EXISTS "Allow public select on projects" ON projects;
CREATE POLICY "Allow public select on projects" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select on project_documents" ON project_documents;
CREATE POLICY "Allow public select on project_documents" ON project_documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select on dispatches" ON dispatches;
CREATE POLICY "Allow public select on dispatches" ON dispatches FOR SELECT USING (true);

-- =========================================
-- 6. ORDER UPDATE POLICIES
-- =========================================
DROP POLICY IF EXISTS "Allow project updates" ON projects;
CREATE POLICY "Allow project updates" ON projects
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin')
    OR auth.uid() IN (SELECT user_id FROM project_members WHERE project_id = id)
  );

-- =========================================
-- 7. PUBLIC CHAT READ/WRITE POLICIES FOR TRACKING PORTAL
-- =========================================
DROP POLICY IF EXISTS "Allow public select on chat_rooms" ON chat_rooms;
CREATE POLICY "Allow public select on chat_rooms" ON chat_rooms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select on messages" ON messages;
CREATE POLICY "Allow public select on messages" ON messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on messages" ON messages;
CREATE POLICY "Allow public insert on messages" ON messages FOR INSERT WITH CHECK (true);

