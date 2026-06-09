-- Drop foreign key constraint on profiles referencing auth.users to allow sandbox profile creation
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Create technician_credentials table
CREATE TABLE IF NOT EXISTS technician_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE technician_credentials ENABLE ROW LEVEL SECURITY;

-- Public RLS Policies to match simplified bypass auth model
DROP POLICY IF EXISTS "Allow public select on technician_credentials" ON technician_credentials;
CREATE POLICY "Allow public select on technician_credentials" ON technician_credentials
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on technician_credentials" ON technician_credentials;
CREATE POLICY "Allow public insert on technician_credentials" ON technician_credentials
  FOR INSERT WITH CHECK (true);

-- Ensure profiles table allows public inserts and updates
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on profiles" ON profiles;
CREATE POLICY "Allow public insert on profiles" ON profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on profiles" ON profiles;
CREATE POLICY "Allow public update on profiles" ON profiles FOR UPDATE USING (true);
