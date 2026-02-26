CREATE TABLE IF NOT EXISTS shares (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  token TEXT UNIQUE NOT NULL,
  permission TEXT DEFAULT 'view',
  expires_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_shares_token ON shares(token);
