CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL DEFAULT 'Untitled',
  canvas_width INTEGER NOT NULL,
  canvas_height INTEGER NOT NULL,
  fps INTEGER DEFAULT 12,
  is_public INTEGER DEFAULT 0,
  forked_from TEXT REFERENCES projects(id),
  tags TEXT,
  thumbnail_r2_key TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_public ON projects(is_public, updated_at);
