CREATE TABLE IF NOT EXISTS palettes (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  name TEXT NOT NULL,
  colors TEXT NOT NULL,
  is_public INTEGER DEFAULT 0,
  is_preset INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
