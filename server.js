'use strict';
/**
 * SpartanFix demo server.
 *
 *   node server.js            (Node 22.13 or newer, no npm install needed)
 *   open http://localhost:3000   (for a phone on the same Wi-Fi: HOST=0.0.0.0 node server.js, then http://<your-laptop-ip>:3000)
 *
 * It serves index.html, app.js and styles.css (keep all four files in one folder) and a small JSON API
 * backed by one SQLite file (eaiser.db). index.html detects the API automatically and switches from browser storage to this database,
 * so a student's phone and a worker's laptop see the same reports.
 *
 * DEMO ONLY: the API has no authentication, so anyone who can reach it can read and change every report. It listens on this computer only
 * unless you set HOST=0.0.0.0. Before real use, put it behind SJSU single sign-on
 * and check the caller's role on every route.
 */
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const PORT = Number(process.env.PORT) || 3000;
// Only this computer by default. The demo API has no sign-in, so do not open it to the Wi-Fi unless you mean to: HOST=0.0.0.0 node server.js
const HOST = process.env.HOST || '127.0.0.1';
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'eaiser.db');
// The only files this server will hand out. Nothing else on disk is reachable.
const STATIC = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8'],
  '/styles.css': ['styles.css', 'text/css; charset=utf-8']
};
const CSP = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; " +
  "connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'self'";
const MAX_BODY = 4 * 1024 * 1024;
const MAX_PHOTO = 2.5 * 1024 * 1024;

// ---------- Schema ----------
const db = new DatabaseSync(DB_FILE);
db.exec(`
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,                       -- 'student:sam@sjsu.edu' or 'worker:dev@sjsu.edu'
  role        TEXT NOT NULL CHECK (role IN ('student','worker')),
  email       TEXT NOT NULL,
  name        TEXT NOT NULL,
  createdAt   TEXT NOT NULL,
  lastLoginAt TEXT NOT NULL
);

-- What a worker is responsible for. Lists are JSON arrays of building codes, place ids, issue types.
CREATE TABLE IF NOT EXISTS worker_profiles (
  userId     TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  buildings  TEXT NOT NULL,
  places     TEXT NOT NULL,
  categories TEXT NOT NULL,
  setupDone  INTEGER NOT NULL DEFAULT 0,
  updatedAt  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reports (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  createdAt      TEXT NOT NULL,
  updatedAt      TEXT NOT NULL,
  reporterId     TEXT NOT NULL REFERENCES users(id),
  reporterName   TEXT NOT NULL,
  building       TEXT NOT NULL,
  buildingName   TEXT,
  area           TEXT NOT NULL,
  areaLabel      TEXT NOT NULL,
  category       TEXT NOT NULL,
  priority       TEXT NOT NULL,
  prioritySource TEXT NOT NULL DEFAULT 'auto',
  status         TEXT NOT NULL,
  unit           TEXT,                                -- room, apartment or suite number
  floor          TEXT,
  detail         TEXT,
  description    TEXT,
  photo          TEXT,                                -- data URL, only returned by GET /api/reports/:id
  entry          TEXT,                                -- 'ok' | 'contact' | null
  assigneeId     TEXT,
  assigneeName   TEXT,
  eta            TEXT,
  dupOf          INTEGER,
  awaitingStaff  INTEGER NOT NULL DEFAULT 0,
  lastActorRole  TEXT,
  resolvedAt     TEXT,
  confirmedAt    TEXT,
  categoryText   TEXT,                                -- what staff typed when the type is 'other'
  statusText     TEXT,                                -- what staff typed when the status is 'other'
  publicAt       TEXT                                 -- last change the student can see (staff-only notes do not move it)
);
CREATE INDEX IF NOT EXISTS idx_reports_scope ON reports (building, area, status);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON reports (reporterId);

-- Every change to a report is an event. Staff-only notes use visibility = 'staff'.
CREATE TABLE IF NOT EXISTS events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  reportId   INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  at         TEXT NOT NULL,
  actorId    TEXT,
  actorName  TEXT,
  actorRole  TEXT,
  type       TEXT NOT NULL,
  fromVal    TEXT,
  toVal      TEXT,
  text       TEXT,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','staff'))
);
CREATE INDEX IF NOT EXISTS idx_events_report ON events (reportId, at);
`);

// Database files made by an older version lack the newest columns. Add them once, keeping the data.
const haveCols = new Set(db.prepare('PRAGMA table_info(reports)').all().map(c => c.name));
for (const [col, type] of [['categoryText', 'TEXT'], ['statusText', 'TEXT'], ['publicAt', 'TEXT'], ['unit', 'TEXT'], ['floor', 'TEXT'], ['idemKey', 'TEXT']]) {
  if (!haveCols.has(col)) db.exec(`ALTER TABLE reports ADD COLUMN ${col} ${type}`);
}

// Where a report may be, building by building: area id -> [unit, floor, detail], 0 = not asked, 1 = optional, 2 = required.
// Generated from locationRules() in app.js. The sync test fails if the two ever differ (GET /api/locations).
const LOCATIONS = {
  "CVA": {
    room: [2,0,1],
    bathroom: [2,0,1],
    unitkitchen: [2,0,1],
    living: [2,0,1],
    unitlaundry: [2,0,1],
    mail: [0,0,1],
    trash: [0,0,1],
    hallway: [0,2,1],
    stairs: [0,1,1],
    elevator: [0,1,1],
    lobby: [0,0,1],
    outside: [0,0,1],
    other: [0,0,2]
  },
  "CVB": {
    room: [2,0,1],
    bathroom: [2,0,1],
    unitkitchen: [2,0,1],
    living: [2,0,1],
    laundry: [0,0,1],
    rac: [0,0,1],
    racrooms: [0,0,1],
    lab: [0,0,1],
    hub: [0,0,1],
    market: [0,0,1],
    office: [0,0,1],
    desk: [0,0,1],
    mail: [0,0,1],
    trash: [0,0,1],
    hallway: [0,2,1],
    stairs: [0,1,1],
    elevator: [0,1,1],
    lobby: [0,0,1],
    outside: [0,0,1],
    other: [0,0,2]
  },
  "CVC": {
    room: [2,0,1],
    bathroom: [2,0,1],
    living: [2,0,1],
    unitkitchen: [2,0,1],
    kitchen: [0,0,1],
    laundry: [0,0,1],
    study: [0,1,1],
    desk: [0,0,1],
    trash: [0,0,1],
    hallway: [0,2,1],
    stairs: [0,1,1],
    elevator: [0,1,1],
    lobby: [0,0,1],
    outside: [0,0,1],
    other: [0,0,2]
  },
  "CV2": {
    room: [2,0,1],
    bathroom: [0,2,2],
    study: [0,1,1],
    lounge: [0,1,1],
    study10: [0,0,1],
    multi: [0,0,1],
    rec: [0,0,1],
    kitchen: [0,1,1],
    laundry: [0,0,1],
    desk: [0,0,1],
    trash: [0,0,1],
    bike: [0,0,1],
    hallway: [0,2,1],
    stairs: [0,1,1],
    elevator: [0,1,1],
    lobby: [0,0,1],
    outside: [0,0,1],
    other: [0,0,2]
  },
  "Joe West": {
    room: [2,0,1],
    bathroom: [0,2,2],
    study: [0,1,1],
    lounge: [0,1,1],
    activity: [0,0,1],
    kitchen: [0,1,1],
    laundry: [0,0,1],
    mail: [0,0,1],
    desk: [0,0,1],
    trash: [0,1,1],
    bike: [0,0,1],
    hallway: [0,2,1],
    stairs: [0,1,1],
    elevator: [0,1,1],
    lobby: [0,0,1],
    outside: [0,0,1],
    other: [0,0,2]
  },
  "Washburn": {
    room: [2,0,1],
    bathroom: [0,2,2],
    lounge: [0,0,1],
    study: [0,1,1],
    activity: [0,0,1],
    kitchen: [0,1,1],
    laundry: [0,0,1],
    desk: [0,0,1],
    trash: [0,0,1],
    hallway: [0,2,1],
    stairs: [0,1,1],
    lobby: [0,0,1],
    outside: [0,0,1],
    other: [0,0,2]
  },
  "SVP": {
    room: [2,0,1],
    bathroom: [2,0,1],
    living: [2,0,1],
    study: [0,1,1],
    gametv: [0,0,1],
    fitness: [0,0,1],
    kitchen: [0,1,1],
    dining: [0,0,1],
    laundry: [0,0,1],
    mail: [0,0,1],
    desk: [0,0,1],
    hallway: [0,2,1],
    stairs: [0,1,1],
    elevator: [0,1,1],
    lobby: [0,0,1],
    outside: [0,0,1],
    other: [0,0,2]
  },
  "Macquarrie Hall": {
    classroom: [2,0,1],
    bathroom: [0,2,1],
    study: [0,1,1],
    lab: [1,0,1],
    hallway: [0,2,1],
    stairs: [0,1,1],
    lobby: [0,0,1],
    outside: [0,0,1],
    other: [0,0,2]
  },
  "Sweeney Building": {
    classroom: [2,0,1],
    bathroom: [0,2,1],
    study: [0,1,1],
    lab: [1,0,1],
    hallway: [0,2,1],
    stairs: [0,1,1],
    lobby: [0,0,1],
    outside: [0,0,1],
    other: [0,0,2]
  },
  "Clarke Hall": {
    classroom: [2,0,1],
    bathroom: [0,2,1],
    study: [0,1,1],
    lab: [1,0,1],
    hallway: [0,2,1],
    stairs: [0,1,1],
    lobby: [0,0,1],
    outside: [0,0,1],
    other: [0,0,2]
  }
};

// ---------- Helpers ----------
let version = 0;                       // bumped on every write; clients poll it to refresh
const bump = () => { version += 1; };
const bindable = v => (v === undefined ? null : typeof v === 'boolean' ? (v ? 1 : 0) : v);
const get = (sql, ...a) => db.prepare(sql).get(...a.map(bindable));
const all = (sql, ...a) => db.prepare(sql).all(...a.map(bindable));
const run = (sql, ...a) => db.prepare(sql).run(...a.map(bindable));

function tx(fn) {
  db.exec('BEGIN IMMEDIATE');
  try { const out = fn(); db.exec('COMMIT'); return out; }
  catch (e) { db.exec('ROLLBACK'); throw e; }
}
function fail(status, message) { const e = new Error(message); e.status = status; return e; }

// 'referred' is retired in the app but still valid, so older tickets keep working.
const STATUSES = ['new', 'reopened', 'acknowledged', 'in_progress', 'waiting', 'referred', 'resolved', 'duplicate', 'other'];
const PRIORITIES = ['urgent', 'high', 'normal', 'low'];
const CATEGORIES = ['plumbing', 'electrical', 'hvac', 'structure', 'furniture', 'cleaning', 'laundry', 'other'];
const EVENT_TYPES = ['created', 'status', 'priority', 'category', 'assigned', 'eta', 'message', 'note', 'duplicate', 'reopened', 'confirmed', 'ai', 'distinct'];
const ETA_RE = /^\d{4}-\d{2}-\d{2}$/;
const PATCHABLE = ['status', 'statusText', 'priority', 'prioritySource', 'category', 'categoryText', 'assigneeId', 'assigneeName', 'eta', 'dupOf',
  'awaitingStaff', 'lastActorRole', 'resolvedAt', 'confirmedAt'];
const REPORT_COLS = ['createdAt', 'updatedAt', 'reporterId', 'reporterName', 'building', 'buildingName', 'area', 'areaLabel',
  'category', 'priority', 'prioritySource', 'status', 'unit', 'floor', 'detail', 'description', 'photo', 'entry', 'assigneeId', 'assigneeName',
  'eta', 'dupOf', 'awaitingStaff', 'lastActorRole', 'resolvedAt', 'confirmedAt', 'categoryText', 'statusText', 'publicAt', 'idemKey'];

const str = (v, max, name, required) => {
  if (v == null || v === '') { if (required) throw fail(400, name + ' is required'); return null; }
  if (typeof v !== 'string') throw fail(400, name + ' must be text');
  if (v.length > max) throw fail(400, name + ' is too long');
  return v;
};
const oneOf = (v, list, name) => { if (!list.includes(v)) throw fail(400, 'bad ' + name); return v; };
const now = () => new Date().toISOString();
const int = (v, name) => { if (v == null) return null; if (!Number.isInteger(v)) throw fail(400, 'bad ' + name); return v; };
const dec = s => { try { return decodeURIComponent(s); } catch { throw fail(400, 'bad id'); } };

const toReport = (row, withPhoto) => {
  const { photo, awaitingStaff, idemKey, ...r } = row;
  r.awaitingStaff = !!awaitingStaff;
  if (withPhoto) r.photo = photo; else r.hasPhoto = !!photo;
  return r;
};
const toEvent = row => {
  const { fromVal, toVal, ...e } = row;
  return { ...e, from: fromVal, to: toVal };
};

// ---------- Operations ----------
function upsertUser(b) {
  const id = str(b.id, 200, 'id', true);
  const role = oneOf(b.role, ['student', 'worker'], 'role');
  const email = str(b.email, 200, 'email', true);
  const name = str(b.name, 120, 'name', true);
  const t = now();
  run(`INSERT INTO users (id, role, email, name, createdAt, lastLoginAt) VALUES (?,?,?,?,?,?)
       ON CONFLICT(id) DO UPDATE SET email = excluded.email, name = excluded.name, lastLoginAt = excluded.lastLoginAt`,
    id, role, email, name, b.createdAt || t, t);
  bump();
  return get('SELECT * FROM users WHERE id = ?', id);
}

const toProfile = row => row && ({
  userId: row.userId, buildings: JSON.parse(row.buildings), places: JSON.parse(row.places),
  categories: JSON.parse(row.categories), setupDone: !!row.setupDone, updatedAt: row.updatedAt
});

function saveProfile(userId, b) {
  const list = (v, name) => {
    if (!Array.isArray(v) || v.length > 100 || v.some(x => typeof x !== 'string' || x.length > 60)) throw fail(400, 'bad ' + name);
    return JSON.stringify(v);
  };
  if (!get('SELECT 1 FROM users WHERE id = ?', userId)) throw fail(404, 'unknown user');
  run(`INSERT INTO worker_profiles (userId, buildings, places, categories, setupDone, updatedAt) VALUES (?,?,?,?,?,?)
       ON CONFLICT(userId) DO UPDATE SET buildings = excluded.buildings, places = excluded.places,
         categories = excluded.categories, setupDone = excluded.setupDone, updatedAt = excluded.updatedAt`,
    userId, list(b.buildings, 'buildings'), list(b.places, 'places'), list(b.categories, 'categories'), b.setupDone ? 1 : 0, now());
  bump();
  return toProfile(get('SELECT * FROM worker_profiles WHERE userId = ?', userId));
}

function insertEvent(reportId, ev) {
  run(`INSERT INTO events (reportId, at, actorId, actorName, actorRole, type, fromVal, toVal, text, visibility)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
    reportId, ev.at || now(), str(ev.actorId, 200, 'actorId'), str(ev.actorName, 120, 'actorName'),
    oneOf(ev.actorRole || 'student', ['student', 'worker', 'system'], 'actorRole'), oneOf(ev.type, EVENT_TYPES, 'event type'),
    str(ev.from == null ? null : String(ev.from), 200, 'from'), str(ev.to == null ? null : String(ev.to), 200, 'to'),
    str(ev.text, 2000, 'text'), oneOf(ev.visibility || 'public', ['public', 'staff'], 'visibility'));
}

// A report must name a real place in a real building, with the unit and floor that place asks for.
function checkLocation(row) {
  const areas = Object.hasOwn(LOCATIONS, row.building) ? LOCATIONS[row.building] : null;
  if (!areas) throw fail(400, 'unknown building');
  const rule = Object.hasOwn(areas, row.area) ? areas[row.area] : null;
  if (!rule) throw fail(400, 'that place is not in this building');
  ['unit', 'floor', 'detail'].forEach((k, i) => {
    const v = row[k] && row[k].trim();
    if (rule[i] === 2 && !v) throw fail(400, k + ' is required for this place');
    if (rule[i] === 0 && v) throw fail(400, k + ' is not used for this place');
  });
}

function createReportRow(r, events) {
  if (!r || typeof r !== 'object') throw fail(400, 'report required');
  const t = now();
  const row = {
    createdAt: r.createdAt || t, updatedAt: r.updatedAt || r.createdAt || t,
    reporterId: str(r.reporterId, 200, 'reporterId', true), reporterName: str(r.reporterName, 120, 'reporterName', true),
    building: str(r.building, 60, 'building', true), buildingName: str(r.buildingName, 120, 'buildingName'),
    area: str(r.area, 60, 'area', true), areaLabel: str(r.areaLabel, 120, 'areaLabel', true),
    unit: str(r.unit, 40, 'unit'), floor: str(r.floor, 40, 'floor'),
    category: oneOf(r.category, CATEGORIES, 'category'), priority: oneOf(r.priority, PRIORITIES, 'priority'),
    prioritySource: oneOf(r.prioritySource || 'auto', ['auto', 'worker'], 'prioritySource'),
    status: oneOf(r.status || 'new', STATUSES, 'status'),
    detail: str(r.detail, 300, 'detail'), description: str(r.description, 2000, 'description'),
    photo: r.photo ? str(r.photo, MAX_PHOTO, 'photo') : null,
    entry: r.entry ? oneOf(r.entry, ['ok', 'contact'], 'entry') : null,
    assigneeId: str(r.assigneeId, 200, 'assigneeId'), assigneeName: str(r.assigneeName, 120, 'assigneeName'),
    eta: str(r.eta, 20, 'eta'), dupOf: int(r.dupOf, 'dupOf'),
    awaitingStaff: r.awaitingStaff ? 1 : 0, lastActorRole: r.lastActorRole ? oneOf(r.lastActorRole, ['student', 'worker'], 'lastActorRole') : null,
    resolvedAt: str(r.resolvedAt, 40, 'resolvedAt'), confirmedAt: str(r.confirmedAt, 40, 'confirmedAt'),
    categoryText: str(r.categoryText, 60, 'categoryText'), statusText: str(r.statusText, 60, 'statusText'),
    publicAt: str(r.publicAt, 40, 'publicAt') || r.createdAt || t,
    idemKey: str(r.idemKey, 80, 'idemKey') || null
  };
  checkLocation(row);
  // A retry of the same send (the first answer was lost) returns the report that is already saved instead of making a second one.
  if (row.idemKey) { const seen = get('SELECT id FROM reports WHERE reporterId = ? AND idemKey = ?', row.reporterId, row.idemKey); if (seen) return seen.id; }
  if (row.eta && !ETA_RE.test(row.eta)) throw fail(400, 'bad eta');
  if (row.photo && !/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(row.photo)) throw fail(400, 'photo must be a JPEG data URL');
  if (!get('SELECT 1 FROM users WHERE id = ?', row.reporterId)) throw fail(400, 'unknown reporter');
  const res = run(`INSERT INTO reports (${REPORT_COLS.join(',')}) VALUES (${REPORT_COLS.map(() => '?').join(',')})`,
    ...REPORT_COLS.map(c => row[c]));
  const id = Number(res.lastInsertRowid);
  for (const ev of events || []) insertEvent(id, ev);
  return id;
}

function updateReport(id, b) {
  const patch = b.patch || {};
  const keys = Object.keys(patch);
  for (const k of keys) if (!PATCHABLE.includes(k)) throw fail(400, 'cannot change ' + k);
  if ('status' in patch) oneOf(patch.status, STATUSES, 'status');
  if ('priority' in patch) oneOf(patch.priority, PRIORITIES, 'priority');
  if ('category' in patch) oneOf(patch.category, CATEGORIES, 'category');
  if ('prioritySource' in patch) oneOf(patch.prioritySource, ['auto', 'worker'], 'prioritySource');
  for (const k of ['assigneeId', 'assigneeName', 'eta', 'resolvedAt', 'confirmedAt']) if (k in patch) str(patch[k], 200, k);
  for (const k of ['categoryText', 'statusText']) if (k in patch) str(patch[k], 60, k);
  if ('eta' in patch && patch.eta !== null && !ETA_RE.test(patch.eta)) throw fail(400, 'bad eta');
  if ('dupOf' in patch) int(patch.dupOf, 'dupOf');
  if ('awaitingStaff' in patch && typeof patch.awaitingStaff !== 'boolean') throw fail(400, 'bad awaitingStaff');
  if ('lastActorRole' in patch && patch.lastActorRole !== null) oneOf(patch.lastActorRole, ['student', 'worker'], 'lastActorRole');
  return tx(() => {
    if (!get('SELECT 1 FROM reports WHERE id = ?', id)) throw fail(404, 'unknown report');
    const t = now();
    const sets = keys.map(k => k + ' = ?');
    // publicAt moves only when the student could see the change, so a staff-only note never marks a report as updated.
    const visible = (b.events || []).some(e => (e.visibility || 'public') !== 'staff');
    run(`UPDATE reports SET ${[...sets, 'updatedAt = ?', ...(visible ? ['publicAt = ?'] : [])].join(', ')} WHERE id = ?`,
      ...keys.map(k => patch[k]), t, ...(visible ? [t] : []), id);
    for (const ev of b.events || []) insertEvent(id, ev);
    bump();
    return toReport(get('SELECT * FROM reports WHERE id = ?', id), false);
  });
}

function seed(b) {
  return tx(() => {
    if (get('SELECT COUNT(*) c FROM users').c || get('SELECT COUNT(*) c FROM reports').c) return { seeded: false };
    for (const u of b.users || []) {
      run('INSERT INTO users (id, role, email, name, createdAt, lastLoginAt) VALUES (?,?,?,?,?,?)',
        str(u.id, 200, 'id', true), oneOf(u.role, ['student', 'worker'], 'role'), str(u.email, 200, 'email', true),
        str(u.name, 120, 'name', true), u.createdAt || now(), u.lastLoginAt || now());
    }
    for (const p of b.profiles || []) saveProfile(p.userId, p);
    for (const item of b.reports || []) createReportRow(item.report, item.events);
    bump();
    return { seeded: true };
  });
}

function clearAll() {
  return tx(() => {
    for (const t of ['events', 'reports', 'worker_profiles', 'users']) run('DELETE FROM ' + t);
    run("DELETE FROM sqlite_sequence WHERE name IN ('reports','events')");
    bump();
    return { cleared: true };
  });
}

// ---------- Routing ----------
function route(method, p, b) {
  let m;
  if (method === 'GET' && p === '/api/locations') return LOCATIONS;
  if (method === 'GET' && p === '/api/version') return { eaiser: true, v: version };

  if (method === 'POST' && p === '/api/users') return upsertUser(b || {});
  if (method === 'GET' && (m = p.match(/^\/api\/users\/(.+)$/))) return get('SELECT * FROM users WHERE id = ?', dec(m[1])) || null;

  if (method === 'GET' && p === '/api/workers') {
    return all(`SELECT u.id, u.role, u.email, u.name, u.createdAt, u.lastLoginAt FROM users u
                JOIN worker_profiles w ON w.userId = u.id WHERE u.role = 'worker' AND w.setupDone = 1 ORDER BY u.name`)
      .map(user => ({ user, profile: toProfile(get('SELECT * FROM worker_profiles WHERE userId = ?', user.id)) }));
  }
  if ((m = p.match(/^\/api\/profiles\/(.+)$/))) {
    const userId = dec(m[1]);
    if (method === 'GET') return toProfile(get('SELECT * FROM worker_profiles WHERE userId = ?', userId)) || null;
    if (method === 'PUT') return saveProfile(userId, b || {});
  }

  if (method === 'GET' && p === '/api/reports') return all('SELECT * FROM reports ORDER BY id').map(r => toReport(r, false));
  if (method === 'POST' && p === '/api/reports') {
    return tx(() => {
      const id = createReportRow(b && b.report, b && b.events);
      bump();
      return toReport(get('SELECT * FROM reports WHERE id = ?', id), false);
    });
  }
  if ((m = p.match(/^\/api\/reports\/(\d+)$/))) {
    const id = Number(m[1]);
    if (method === 'GET') { const r = get('SELECT * FROM reports WHERE id = ?', id); return r ? toReport(r, true) : null; }
    if (method === 'PATCH') return updateReport(id, b || {});
  }
  if (method === 'GET' && (m = p.match(/^\/api\/reports\/(\d+)\/events$/))) {
    return all('SELECT * FROM events WHERE reportId = ? ORDER BY at, id', Number(m[1])).map(toEvent);
  }

  if (method === 'POST' && p === '/api/seed') return seed(b || {});
  if (method === 'POST' && p === '/api/clear') return clearAll();
  return undefined;
}

// ---------- HTTP ----------
function send(res, status, body, type) {
  res.setHeader('X-Version', String(version));
  res.writeHead(status, { 'Content-Type': type || 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(type ? body : JSON.stringify(body));
}
function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0, tooBig = false; const chunks = [];
    req.on('data', c => {
      if (tooBig) return;                               // keep draining so the 413 can be sent back on the same connection
      size += c.length;
      if (size > MAX_BODY) { tooBig = true; chunks.length = 0; reject(fail(413, 'body too large')); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch { reject(fail(400, 'invalid JSON')); }
    });
    req.on('error', reject);
  });
}

/* ---------- Repair data written by the larger 74-location build ----------
   That build rewrote building codes and place ids in this same database file. Convert them back, keep every report, and keep a copy of the file first. */
function repairOldData() {
  let R;
  try {
    const src = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8'), a = src.indexOf('/*REVERT-BEGIN*/'), z = src.indexOf('/*REVERT-END*/');
    if (a < 0 || z < 0) return { reports:0, profiles:0 };
    R = require('node:vm').runInNewContext(src.slice(a, z) + ';({ revertProfile, revertReport })', {});
  } catch (e) { console.warn('Could not load the repair rules:', e.message); return { reports:0, profiles:0 }; }
  const reportFixes = all('SELECT * FROM reports').map(r => [r.id, R.revertReport(r)]).filter(x => x[1]);
  const profileFixes = all('SELECT * FROM worker_profiles').map(row => [row.userId, R.revertProfile({ buildings:JSON.parse(row.buildings), places:JSON.parse(row.places) })]).filter(x => x[1]);
  if (!reportFixes.length && !profileFixes.length) return { reports:0, profiles:0 };
  if (DB_FILE !== ':memory:') {
    try { db.exec('PRAGMA wal_checkpoint(TRUNCATE)'); fs.copyFileSync(DB_FILE, DB_FILE + '.before-repair-' + new Date().toISOString().replace(/[:.]/g, '-')); }
    catch (e) { console.warn('Could not copy the database before repairing it:', e.message); }
  }
  tx(() => {
    for (const [id, fix] of reportFixes) { const keys = Object.keys(fix); run('UPDATE reports SET ' + keys.map(k => k + ' = ?').join(', ') + ' WHERE id = ?', ...keys.map(k => fix[k]), id); }
    for (const [uid, fix] of profileFixes) run('UPDATE worker_profiles SET buildings = ?, places = ? WHERE userId = ?', JSON.stringify(fix.buildings), JSON.stringify(fix.places), uid);
  });
  return { reports:reportFixes.length, profiles:profileFixes.length };
}
const REPAIRED = repairOldData();
if (REPAIRED.reports || REPAIRED.profiles) console.log('  Converted data from the larger build back to this one: ' + REPAIRED.reports + ' reports, ' + REPAIRED.profiles + ' worker profiles. A copy of the old file was saved next to it.');

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Expose-Headers', 'X-Version');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  try {
    const p = new URL(req.url, 'http://localhost').pathname;
    const asset = req.method === 'GET' ? STATIC[p] : undefined;
    if (asset) {
      let body;
      try { body = fs.readFileSync(path.join(__dirname, asset[0])); }
      catch (e) { if (e.code === 'ENOENT') throw fail(404, asset[0] + ' is missing. Keep index.html, app.js and styles.css next to server.js.'); throw e; }
      if (asset[1].startsWith('text/html')) res.setHeader('Content-Security-Policy', CSP);
      return send(res, 200, body, asset[1]);
    }
    if (req.method === 'GET' && p === '/favicon.ico') { res.writeHead(204); return res.end(); }
    if (!p.startsWith('/api/')) return send(res, 404, { error: 'not found' });
    const body = req.method === 'GET' ? null : await readJson(req);
    const out = route(req.method, p, body);
    if (out === undefined) return send(res, 404, { error: 'not found' });
    send(res, 200, out);
  } catch (e) {
    if (!e.status) console.error(e);
    send(res, e.status || 500, { error: e.status ? e.message : 'server error' });
  }
});

if (require.main === module) {
  server.on('error', e => {
    if (e.code === 'EADDRINUSE') console.error(`Port ${PORT} is already in use. Close the other server, or run it on another port: PORT=3001 node server.js`);
    else console.error(e);
    process.exit(1);
  });
  for (const f of ['index.html', 'app.js', 'styles.css']) if (!fs.existsSync(path.join(__dirname, f))) console.warn(`Warning: ${f} is not next to server.js`);
  server.listen(PORT, HOST, () => {
    console.log(`SpartanFix server running. Database file: ${DB_FILE}`);
    console.log(`  This computer:  http://localhost:${PORT}`);
    if (HOST === '0.0.0.0' || HOST === '::') {
      console.log('  Open to the network. The demo API has no sign-in, so use this only on a network you trust.');
      for (const list of Object.values(os.networkInterfaces())) {
        for (const n of list || []) if (n.family === 'IPv4' && !n.internal) console.log(`  Same Wi-Fi:     http://${n.address}:${PORT}`);
      }
    } else console.log('  Only this computer can reach it. For a phone on your Wi-Fi: HOST=0.0.0.0 node server.js');
  });
}
module.exports = { server, db };