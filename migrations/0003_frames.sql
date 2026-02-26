CREATE TABLE IF NOT EXISTS frames (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  frame_order INTEGER NOT NULL,
  duration_ms INTEGER DEFAULT 83,
  layer_data_r2_key TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_frames_project ON frames(project_id, frame_order);
