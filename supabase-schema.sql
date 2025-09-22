-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code VARCHAR(6) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  genre_id INTEGER,
  status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed')),
  user_a_id UUID NOT NULL,
  user_b_id UUID
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  is_ready BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create swipes table
CREATE TABLE IF NOT EXISTS swipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  movie_id INTEGER NOT NULL,
  action VARCHAR(10) NOT NULL CHECK (action IN ('like', 'pass')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, user_id, movie_id)
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, movie_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(code);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_users_session_id ON users(session_id);
CREATE INDEX IF NOT EXISTS idx_swipes_session_id ON swipes(session_id);
CREATE INDEX IF NOT EXISTS idx_swipes_user_id ON swipes(user_id);
CREATE INDEX IF NOT EXISTS idx_swipes_movie_id ON swipes(movie_id);
CREATE INDEX IF NOT EXISTS idx_matches_session_id ON matches(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Sessions: Allow read access to all, but only allow inserts
CREATE POLICY "Allow read access to sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Allow insert access to sessions" ON sessions FOR INSERT WITH CHECK (true);

-- Users: Allow read and insert access
CREATE POLICY "Allow read access to users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow insert access to users" ON users FOR INSERT WITH CHECK (true);

-- Swipes: Allow read and insert access
CREATE POLICY "Allow read access to swipes" ON swipes FOR SELECT USING (true);
CREATE POLICY "Allow insert access to swipes" ON swipes FOR INSERT WITH CHECK (true);

-- Matches: Allow read and insert access
CREATE POLICY "Allow read access to matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Allow insert access to matches" ON matches FOR INSERT WITH CHECK (true);

-- Create a function to clean up old sessions (optional)
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions 
  WHERE created_at < NOW() - INTERVAL '24 hours' 
  AND status = 'waiting';
END;
$$ LANGUAGE plpgsql;

-- Create a function to get session with users
CREATE OR REPLACE FUNCTION get_session_with_users(session_code TEXT)
RETURNS TABLE (
  session_id UUID,
  code VARCHAR(6),
  created_at TIMESTAMP WITH TIME ZONE,
  genre_id INTEGER,
  status VARCHAR(20),
  user_a_id UUID,
  user_b_id UUID,
  user_a_name VARCHAR(100),
  user_b_name VARCHAR(100)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.code,
    s.created_at,
    s.genre_id,
    s.status,
    s.user_a_id,
    s.user_b_id,
    ua.name as user_a_name,
    ub.name as user_b_name
  FROM sessions s
  LEFT JOIN users ua ON s.user_a_id = ua.id
  LEFT JOIN users ub ON s.user_b_id = ub.id
  WHERE s.code = session_code;
END;
$$ LANGUAGE plpgsql;
