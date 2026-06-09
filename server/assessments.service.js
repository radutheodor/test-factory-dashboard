// ════════════════════════════════════════════════════════════════
// Assessments Service (SQLite-backed)
// ════════════════════════════════════════════════════════════════
// Persists maturity assessment results to a SQLite database file.
//
// Why SQLite (better-sqlite3):
//   - Single-file storage, zero configuration, no separate DB server
//   - Concurrent-safe reads + serialised writes out of the box
//   - Synchronous API: faster than async drivers for this workload
//   - Production-grade: battle-tested, used by major projects
//   - SQL queries for "latest per team", "last 30 days", etc.
//   - Data survives server restarts / container rebuilds
//   - Backups = copy the .db file
//
// Schema:
//   assessments (
//     id          TEXT PRIMARY KEY     -- unique result id
//     team_id     INTEGER NOT NULL     -- FK to teams.config.js
//     team_name   TEXT NOT NULL        -- denormalised for convenience
//     assessed_by TEXT NOT NULL        -- assessor name/email
//     assessed_at TEXT NOT NULL        -- ISO 8601 timestamp
//     overall     REAL NOT NULL        -- weighted overall score
//     level       TEXT NOT NULL        -- maturity level name
//     result_json TEXT NOT NULL        -- full result JSON (answers, dimScores, ...)
//   )
// ════════════════════════════════════════════════════════════════

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'assessments.db');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_FILE);
db.pragma('journal_mode = WAL'); // Concurrent reads while writing

db.exec(`
  CREATE TABLE IF NOT EXISTS assessments (
    id          TEXT PRIMARY KEY,
    team_id     INTEGER NOT NULL,
    team_name   TEXT NOT NULL,
    assessed_by TEXT NOT NULL,
    assessed_at TEXT NOT NULL,
    overall     REAL NOT NULL,
    level       TEXT NOT NULL,
    result_json TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_assessments_team_id     ON assessments(team_id);
  CREATE INDEX IF NOT EXISTS idx_assessments_assessed_at ON assessments(assessed_at);
`);

console.log(`[DB] SQLite database ready at ${DB_FILE}`);

// Prepared statements (reused for performance)
const insertStmt = db.prepare(`
  INSERT INTO assessments (id, team_id, team_name, assessed_by, assessed_at, overall, level, result_json)
  VALUES (@id, @team_id, @team_name, @assessed_by, @assessed_at, @overall, @level, @result_json)
`);
const selectAllStmt           = db.prepare(`SELECT * FROM assessments ORDER BY assessed_at DESC`);
const selectByIdStmt          = db.prepare(`SELECT * FROM assessments WHERE id = ?`);
const selectLatestByTeamStmt  = db.prepare(`SELECT * FROM assessments WHERE team_id = ? ORDER BY assessed_at DESC LIMIT 1`);
const deleteStmt              = db.prepare(`DELETE FROM assessments WHERE id = ?`);

function rowToResult(row) {
  if (!row) return null;
  return JSON.parse(row.result_json);
}

function saveAssessment(result) {
  insertStmt.run({
    id:          result.id,
    team_id:     result.teamId,
    team_name:   result.team,
    assessed_by: result.by,
    assessed_at: result.date,
    overall:     result.overall,
    level:       result.level,
    result_json: JSON.stringify(result),
  });
  console.log(`[DB] Saved assessment ${result.id} for team "${result.team}"`);
  return result;
}

function getAllAssessments() {
  return selectAllStmt.all().map(rowToResult);
}

function getAssessmentById(id) {
  return rowToResult(selectByIdStmt.get(id));
}

function getLatestForTeam(teamId) {
  return rowToResult(selectLatestByTeamStmt.get(teamId));
}

function deleteAssessment(id) {
  return deleteStmt.run(id).changes > 0;
}

module.exports = {
  saveAssessment,
  getAllAssessments,
  getAssessmentById,
  getLatestForTeam,
  deleteAssessment,
};
