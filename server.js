'use strict';
/**
 * SpartanFix server: one Node file, no npm packages (Node 22.13 or newer).
 *
 *   node server.js                       local demo on http://localhost:3000 (demo sign-in, data in ./eaiser.db)
 *   NODE_ENV=production ... node server.js   real use, see DEPLOY.md
 *
 * What it does
 *   - serves index.html, app.js and styles.css (optional: the page can also live on another host and call this API)
 *   - keeps every report, event, photo, worker profile and sign-in session in ONE SQLite file (DB_FILE)
 *   - checks who is calling on every request: students see and change only their own reports; staff see all and
 *     update tickets; admins also manage the staff list and download backups
 *   - writes history (who did what, when) itself, from the signed-in person, never from what the browser claims
 *   - backs the database up before every schema change and on a schedule
 *
 * Settings (environment variables), all optional for a local demo:
 *   PORT, HOST, DB_FILE, BACKUP_DIR, BACKUP_EVERY_HOURS, BACKUP_KEEP
 *   GOOGLE_CLIENT_ID                     turns on "Sign in with Google" (SJSU accounts only)
 *   EMAIL_API_KEY, EMAIL_FROM [, EMAIL_API_URL]   turns on email-code sign-in (Resend-style JSON API)
 *   DEMO_AUTH=1                          anyone can sign in as anyone (demo only; off by default when real sign-in exists)
 *   ADMIN_EMAILS, STAFF_EMAILS           comma lists; admins are always staff
 *   TRIAGE_EMAILS                        comma list of triage coordinators (admins are triage coordinators too)
 *   ALLOWED_DOMAINS (default sjsu.edu)
 *   ALLOW_ORIGINS                        comma list of page origins allowed to call the API from another host, or *
 *   TRUST_PROXY=1                        read the caller's address from X-Forwarded-For (behind a host's proxy)
 *   SESSION_DAYS (30), REPORTS_PER_HOUR (20)
 */
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { DatabaseSync } = require('node:sqlite');

/* ---------- Settings ---------- */
const env = process.env;
const flag = (v, d) => (v === undefined || v === '' ? d : /^(1|true|yes|on)$/i.test(String(v)));
const words = v => String(v || '').split(/[\s,;]+/).map(s => s.trim()).filter(Boolean);
const lower = v => words(v).map(s => s.toLowerCase());
const PRODUCTION = env.NODE_ENV === 'production';
const PORT = Number(env.PORT) || 3000;
const HOST = env.HOST || (PRODUCTION ? '0.0.0.0' : '127.0.0.1');
const DB_FILE = path.resolve(env.DB_FILE || path.join(__dirname, 'eaiser.db'));
const BACKUP_DIR = path.resolve(env.BACKUP_DIR || path.join(path.dirname(DB_FILE), 'backups'));
const BACKUP_EVERY_MS = Math.max(0.05, Number(env.BACKUP_EVERY_HOURS) || 6) * 36e5;
const BACKUP_KEEP = Math.max(1, Number(env.BACKUP_KEEP) || 14);
const GOOGLE_CLIENT_ID = (env.GOOGLE_CLIENT_ID || '').trim();
const GOOGLE_JWKS_URL = env.GOOGLE_JWKS_URL || 'https://www.googleapis.com/oauth2/v3/certs';
const EMAIL_API_KEY = (env.EMAIL_API_KEY || '').trim(), EMAIL_FROM = (env.EMAIL_FROM || '').trim();
const EMAIL_API_URL = env.EMAIL_API_URL || 'https://api.resend.com/emails';
const EMAIL_CODE = !!(EMAIL_API_KEY && EMAIL_FROM);
const REAL_AUTH = !!(GOOGLE_CLIENT_ID || EMAIL_CODE);
const DEMO_AUTH = flag(env.DEMO_AUTH, !REAL_AUTH && !PRODUCTION);
const ALLOWED_DOMAINS = lower(env.ALLOWED_DOMAINS || 'sjsu.edu');
const ADMIN_EMAILS = lower(env.ADMIN_EMAILS), STAFF_EMAILS = lower(env.STAFF_EMAILS), TRIAGE_EMAILS = lower(env.TRIAGE_EMAILS);
const ALLOW_ORIGINS = words(env.ALLOW_ORIGINS || env.ALLOW_ORIGIN);
const TRUST_PROXY = flag(env.TRUST_PROXY, false);
const SESSION_DAYS = Math.max(1, Number(env.SESSION_DAYS) || 30);
const REPORTS_PER_HOUR = Math.max(1, Number(env.REPORTS_PER_HOUR) || 20);   // per student
const MAX_BODY = 4 * 1024 * 1024;
const MAX_PHOTO_BYTES = 2.5 * 1024 * 1024;
const LIST_LIMIT = 5000;
const BUILD = '2026-10-24c';

if (PRODUCTION && !REAL_AUTH && !DEMO_AUTH) {
  console.error('Refusing to start: NODE_ENV=production needs real sign-in (GOOGLE_CLIENT_ID, or EMAIL_API_KEY with EMAIL_FROM). For a public demo only, set DEMO_AUTH=1.');
  process.exit(1);
}

/* ---------- Logging ---------- */
const log = (level, msg, extra) => {
  const line = JSON.stringify({ t:new Date().toISOString(), level, msg, ...(extra || {}) });
  (level === 'error' || level === 'warn' ? process.stderr : process.stdout).write(line + '\n');
};

/* ---------- Small helpers ---------- */
const now = () => new Date().toISOString();
function fail(status, message, extra) { const e = new Error(message); e.status = status; if (extra) e.extra = extra; return e; }
const str = (v, max, name, required) => {
  if (v == null || v === '') { if (required) throw fail(400, name + ' is required'); return null; }
  if (typeof v !== 'string') throw fail(400, name + ' must be text');
  if (v.length > max) throw fail(400, name + ' is too long');
  return v;
};
const oneOf = (v, list, name) => { if (!list.includes(v)) throw fail(400, 'bad ' + name); return v; };
const int = (v, name) => { if (v == null) return null; if (!Number.isInteger(v)) throw fail(400, 'bad ' + name); return v; };
const dec = s => { try { return decodeURIComponent(s); } catch { throw fail(400, 'bad id'); } };
const sha = s => crypto.createHash('sha256').update(String(s)).digest('hex');
const emailOk = e => typeof e === 'string' && e.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && ALLOWED_DOMAINS.includes(e.split('@')[1].toLowerCase());
const nameFromEmail = e => e.split('@')[0].split(/[._-]+/).filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(' ').slice(0, 120) || 'Student';

/* A simple sliding-window limiter kept in memory (one server process). */
const hits = new Map();
function limited(key, max, windowMs) {
  const t = Date.now(), arr = (hits.get(key) || []).filter(x => t - x < windowMs);
  if (arr.length >= max) { hits.set(key, arr); return Math.ceil((windowMs - (t - arr[0])) / 1000); }
  arr.push(t); hits.set(key, arr); return 0;
}
setInterval(() => { const t = Date.now(); for (const [k, a] of hits) { const f = a.filter(x => t - x < 3.6e6); if (f.length) hits.set(k, f); else hits.delete(k); } }, 60000).unref();
const waitText = secs => secs < 90 ? secs + ' seconds' : secs < 5400 ? 'about ' + Math.ceil(secs / 60) + ' minutes' : 'about ' + Math.ceil(secs / 3600) + ' hours';
const tooMany = secs => fail(429, 'That is more than usual. Please try again in ' + waitText(secs) + '.', { retryAfter:secs });

/* ---------- Database ---------- */
fs.mkdirSync(path.dirname(DB_FILE), { recursive:true });
const db = new DatabaseSync(DB_FILE);
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
const bindable = v => (v === undefined ? null : typeof v === 'boolean' ? (v ? 1 : 0) : v);
const get = (sql, ...a) => db.prepare(sql).get(...a.map(bindable));
const all = (sql, ...a) => db.prepare(sql).all(...a.map(bindable));
const run = (sql, ...a) => db.prepare(sql).run(...a.map(bindable));
function tx(fn) {
  db.exec('BEGIN IMMEDIATE');
  try { const out = fn(); db.exec('COMMIT'); return out; }
  catch (e) { try { db.exec('ROLLBACK'); } catch { /* already rolled back */ } throw e; }
}
const hasTable = n => !!get("SELECT 1 x FROM sqlite_master WHERE type = 'table' AND name = ?", n);
const columnsOf = t => new Set(all(`PRAGMA table_info(${t})`).map(c => c.name));
const addColumn = (t, col, def) => { if (!columnsOf(t).has(col)) db.exec(`ALTER TABLE ${t} ADD COLUMN ${col} ${def}`); };

/* Snapshot of the whole database into one file (safe while the server runs). */
function snapshot(file) {
  fs.mkdirSync(path.dirname(file), { recursive:true });
  if (fs.existsSync(file)) fs.unlinkSync(file);
  db.exec("VACUUM INTO '" + file.replace(/'/g, "''") + "'");
  return file;
}
const stamp = () => new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);

/*LEGACY-BEGIN*/
/* One-time conversion of data written by the larger 74-location build. Nothing is deleted.
   b = old building code -> code used now, rev = old place id -> place id used now, cur = place ids used now, curLabels = their labels,
   labels = labels of old places that have no equivalent now, names = display name of each building.
   A record is converted once: the old-build markers (catalogVersion, origArea) are cleared when it is, so running this again changes nothing.
   A place id that is valid today is never translated. A building the ten do not include is left exactly as it is. */
const LEG = {"b":{"CVA":"CVA","CVB":"CVB","CVC":"CVC","CV2":"CV2","SVP":"SVP","JWH":"Joe West","WSH":"Washburn","MH":"Macquarrie Hall","SH":"Sweeney Building","CL":"Clarke Hall"},"rev":{"CVA":{"bedroom":"room","apt-bath":"bathroom","apt-kitchen":"unitkitchen","living":"living","laundry":null,"lobby-hallway":"hallway","other":"other"},"CVB":{"bedroom":"room","apt-bath":"bathroom","apt-kitchen":"unitkitchen","living":"living","laundry":"laundry","rac":"rac","rac-meeting":"racrooms","computer-lab":"lab","village-market":"market","lobby-hallway":"hallway","other":"other"},"CVC":{"bedroom":"room","suite-bath":"bathroom","suite-living":"living","suite-kitchenette":"unitkitchen","community-kitchen":"kitchen","laundry":"laundry","lobby-hallway":"hallway","other":"other"},"CV2":{"bedroom":"room","wing-bath":"bathroom","study":"study","lounge":"lounge","community-kitchen":"kitchen","laundry":"laundry","lobby-desk":"desk","hallway":"hallway","other":"other"},"SVP":{"bedroom":"room","room-bath":"bathroom","study":"study","fitness":"fitness","gaming":"gametv","community-kitchen":"kitchen","dining":"dining","laundry":"laundry","lobby-mail":"mail","hallway":"hallway","other":"other"},"Joe West":{"bedroom":"room","shared-bath":"bathroom","lounge":"lounge","community-kitchen":"kitchen","laundry":"laundry","lobby-desk":"desk","hallway":"hallway","stairs":"stairs","elevator":"elevator","other":"other"},"Washburn":{"bedroom":"room","wing-bath":"bathroom","lobby-activity":"lounge","laundry":"laundry","courtesy-desk":"desk","hallway":"hallway","stairs":"stairs","other":"other"},"Macquarrie Hall":{"classroom":"classroom","study":"study","office":null,"market":null,"restroom":"bathroom","hallway":"hallway","entrance":"lobby","other":"other"},"Sweeney Building":{"classroom":"classroom","clinic":null,"student-support-area":null,"department-office":null,"restroom":"bathroom","hallway":"hallway","entrance":"lobby","kay-armstead-center-for-communicative-disorders":null,"healthy-development-community-clinic":null,"other":"other"},"Clarke Hall":{"classroom":"classroom","service":null,"office":null,"meeting":null,"restroom":"bathroom","hallway":"hallway","entrance":"lobby","other":"other"}},"cur":{"CVA":["room","bathroom","unitkitchen","living","unitlaundry","mail","trash","hallway","stairs","elevator","lobby","outside","other"],"CVB":["room","bathroom","unitkitchen","living","laundry","rac","racrooms","lab","hub","market","office","desk","mail","trash","hallway","stairs","elevator","lobby","outside","other"],"CVC":["room","bathroom","living","unitkitchen","kitchen","laundry","study","desk","trash","hallway","stairs","elevator","lobby","outside","other"],"CV2":["room","bathroom","study","lounge","study10","multi","rec","kitchen","laundry","desk","trash","bike","hallway","stairs","elevator","lobby","outside","other"],"SVP":["room","bathroom","living","study","gametv","fitness","kitchen","dining","laundry","mail","desk","hallway","stairs","elevator","lobby","outside","other"],"Joe West":["room","bathroom","study","lounge","activity","kitchen","laundry","mail","desk","trash","bike","hallway","stairs","elevator","lobby","outside","other"],"Washburn":["room","bathroom","lounge","study","activity","kitchen","laundry","desk","trash","hallway","stairs","lobby","outside","other"],"Macquarrie Hall":["classroom","bathroom","study","lab","hallway","stairs","lobby","outside","other"],"Sweeney Building":["classroom","bathroom","study","lab","hallway","stairs","lobby","outside","other"],"Clarke Hall":["classroom","bathroom","study","lab","hallway","stairs","lobby","outside","other"]},"labels":{"CVA:laundry":"Laundry room","Macquarrie Hall:office":"Department office","Macquarrie Hall:market":"Ginger Market","Sweeney Building:clinic":"Clinic / consultation room","Sweeney Building:student-support-area":"Student support area","Sweeney Building:department-office":"Department office","Sweeney Building:kay-armstead-center-for-communicative-disorders":"Kay Armstead Center for Communicative Disorders","Sweeney Building:healthy-development-community-clinic":"Healthy Development Community Clinic","Clarke Hall:service":"Career Center","Clarke Hall:office":"Office / advising area","Clarke Hall:meeting":"Meeting room"},"curLabels":{"CVA":{"room":"Bedroom / efficiency room","bathroom":"Apartment bathroom","unitkitchen":"Apartment kitchen","living":"Living / dining area","unitlaundry":"Washer / dryer in my unit","mail":"Mailbox / package area","trash":"Trash / recycling area","hallway":"Hallway / corridor","stairs":"Stairs / stairwell","elevator":"Elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"CVB":{"room":"Bedroom / studio","bathroom":"Apartment bathroom","unitkitchen":"Apartment kitchen / studio kitchenette","living":"Living / dining area","laundry":"Laundry room","rac":"Recreation center (RAC) / game area","racrooms":"RAC meeting / study room","lab":"Computer lab","hub":"Spartan Hub","market":"Village Market","office":"Housing Office visitor area","desk":"Courtesy desk","mail":"Mailbox / package area","trash":"Trash / recycling area","hallway":"Hallway / corridor","stairs":"Stairs / stairwell","elevator":"Elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"CVC":{"room":"Bedroom","bathroom":"Suite bathroom","living":"Suite living / dining area","unitkitchen":"Suite kitchenette","kitchen":"Community kitchen (7th floor)","laundry":"Laundry room","study":"Shared study area / lounge","desk":"Courtesy desk","trash":"Trash / recycling area","hallway":"Hallway / corridor","stairs":"Stairs / stairwell","elevator":"Elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"CV2":{"room":"Dorm room","bathroom":"Shared bathroom / shower","study":"Study room","lounge":"Common lounge","study10":"10th-floor study lounge","multi":"Multi-purpose room","rec":"CV2 recreation space","kitchen":"Community kitchen","laundry":"Laundry room","desk":"Courtesy desk","trash":"Trash / recycling area","bike":"Bike enclosure","hallway":"Hallway / corridor","stairs":"Stairs / stairwell","elevator":"Elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"Joe West":{"room":"Dorm room","bathroom":"Shared bathroom / shower","study":"Study area","lounge":"Common lounge","activity":"Activity area","kitchen":"Community kitchen","laundry":"Laundry room","mail":"Resident mailroom / package pickup","desk":"Courtesy desk","trash":"Floor trash / recycling area","bike":"Bike enclosure","hallway":"Hallway / corridor","stairs":"Stairs / stairwell","elevator":"Elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"Washburn":{"room":"Dorm room","bathroom":"Shared bathroom / shower","lounge":"Formal lounge (1st floor)","study":"Study lounge (2nd and 3rd floor)","activity":"Activity area","kitchen":"Community kitchen","laundry":"Laundry room","desk":"Courtesy desk","trash":"Outdoor trash / recycling containers","hallway":"Hallway / corridor","stairs":"Stairs / stairwell","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"SVP":{"room":"Room / sleeping area","bathroom":"Bathroom in my room or suite","living":"Living area","study":"Study lounge","gametv":"Game / TV room","fitness":"Fitness room","kitchen":"Community kitchen","dining":"Dining area / cafeteria","laundry":"Laundry room","mail":"Mail / parcel area","desk":"Reception / front desk","hallway":"Hallway / corridor","stairs":"Stairs / stairwell","elevator":"Elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"Macquarrie Hall":{"classroom":"Classroom","bathroom":"Restroom","study":"Study area","lab":"Computer lab","hallway":"Hallway / corridor","stairs":"Stairs / elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"Sweeney Building":{"classroom":"Classroom","bathroom":"Restroom","study":"Study area","lab":"Computer lab","hallway":"Hallway / corridor","stairs":"Stairs / elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"Clarke Hall":{"classroom":"Classroom","bathroom":"Restroom","study":"Study area","lab":"Computer lab","hallway":"Hallway / corridor","stairs":"Stairs / elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"}},"names":{"CVA":"Campus Village A","CVB":"Campus Village B","CVC":"Campus Village C","CV2":"Campus Village 2","Joe West":"Joe West Hall","Washburn":"Washburn Hall","SVP":"Spartan Village on the Paseo","Macquarrie Hall":"MacQuarrie Hall","Sweeney Building":"Sweeney Hall","Clarke Hall":"Clark Hall"}};
const legArr = v => Array.isArray(v) ? v : [];
function legacyReport(r) {
  const code = LEG.cur[r.building] ? r.building : LEG.b[r.building];
  if (!code || !LEG.cur[code]) return null;
  const marked = !!(r.catalogVersion || r.origArea);
  if (!marked && code === r.building) return null;
  const ids = LEG.cur[code], out = {}, was = {};
  let area = r.area, detail = r.detail || '';
  if (marked && area === 'other' && /^Was: /.test(detail)) {                       // undo the damage an earlier build did by converting twice
    const body = detail.slice(5), cut = body.indexOf(' - '), label = cut < 0 ? body : body.slice(0, cut);
    const hit = ids.filter(id => id !== 'other' && LEG.curLabels[code][id] === label);
    detail = cut < 0 ? '' : body.slice(cut + 3);
    out.detail = detail; was.areaLabel = label;
    if (hit.length === 1) area = hit[0];
  }
  if (!ids.includes(area)) {
    if (r.origArea && ids.includes(r.origArea)) area = r.origArea;
    else {
      const t = LEG.rev[code] && LEG.rev[code][r.area];
      if (t && ids.includes(t)) area = t;
      else { area = 'other'; was.area = r.area; was.areaLabel = LEG.labels[code + ':' + r.area] || r.areaLabel || r.area; }
    }
  }
  if (area !== r.area) { out.area = area; was.area = was.area || r.area; was.areaLabel = was.areaLabel || r.areaLabel; }
  if (code !== r.building) { out.building = code; was.building = r.building; }
  const label = LEG.curLabels[code][area]; if (label && r.areaLabel !== label) out.areaLabel = label;
  if (r.buildingName !== LEG.names[code]) out.buildingName = LEG.names[code];
  if (r.catalogVersion) { out.catalogVersion = null; was.catalogVersion = r.catalogVersion; }
  if (r.origArea) { out.origArea = null; was.origArea = r.origArea; }
  if (Object.keys(was).length) out.legacy = was;
  return Object.keys(out).length ? out : null;
}
function legacyProfile(p) {
  const blds = [], places = new Set(), lost = [];
  let changed = false;
  for (const x of legArr(p.buildings)) {
    const c = LEG.cur[x] ? x : LEG.b[x];
    if (c && LEG.cur[c]) { if (!blds.includes(c)) blds.push(c); if (c !== x) changed = true; } else { lost.push(x); changed = true; }
  }
  for (const x of legArr(p.places)) {
    const s = String(x);
    if (s.includes(':')) {
      const [bp, ap] = s.split(':'), c = LEG.cur[bp] ? bp : LEG.b[bp], t = c && LEG.rev[c] && LEG.rev[c][ap];
      changed = true;
      if (t && blds.includes(c)) places.add(t); else lost.push(s);
    } else if (blds.some(c => LEG.cur[c].includes(s))) places.add(s);
    else { lost.push(s); changed = true; }
  }
  if (!changed) return null;
  const out = { buildings:blds, places:[...places], legacy:{ buildings:legArr(p.buildings), places:legArr(p.places) } };
  if (!blds.length || !places.size) out.setupDone = false;                          // nothing usable left: the worker picks a scope again
  return out;
}
/*LEGACY-END*/

let LEGACY_DONE = { reports:0, profiles:0 };

/* Schema changes run in order, once each, recorded in PRAGMA user_version. An existing database is copied first. */
const MIGRATIONS = [
  function base() {                                           // everything older builds created, including their later ALTERs
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, role TEXT NOT NULL CHECK (role IN ('student','worker')), email TEXT NOT NULL,
        name TEXT NOT NULL, createdAt TEXT NOT NULL, lastLoginAt TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS worker_profiles (userId TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, buildings TEXT NOT NULL,
        places TEXT NOT NULL, categories TEXT NOT NULL, setupDone INTEGER NOT NULL DEFAULT 0, updatedAt TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS reports (id INTEGER PRIMARY KEY AUTOINCREMENT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL,
        reporterId TEXT NOT NULL REFERENCES users(id), reporterName TEXT NOT NULL, building TEXT NOT NULL, buildingName TEXT,
        area TEXT NOT NULL, areaLabel TEXT NOT NULL, category TEXT NOT NULL, priority TEXT NOT NULL, prioritySource TEXT NOT NULL DEFAULT 'auto',
        status TEXT NOT NULL, unit TEXT, floor TEXT, detail TEXT, description TEXT, photo TEXT, entry TEXT, assigneeId TEXT, assigneeName TEXT,
        eta TEXT, dupOf INTEGER, awaitingStaff INTEGER NOT NULL DEFAULT 0, lastActorRole TEXT, resolvedAt TEXT, confirmedAt TEXT,
        categoryText TEXT, statusText TEXT, publicAt TEXT);
      CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, reportId INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
        at TEXT NOT NULL, actorId TEXT, actorName TEXT, actorRole TEXT, type TEXT NOT NULL, fromVal TEXT, toVal TEXT, text TEXT,
        visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','staff')));
      CREATE INDEX IF NOT EXISTS idx_events_report ON events (reportId, at);`);
    for (const [c, t] of [['categoryText', 'TEXT'], ['statusText', 'TEXT'], ['publicAt', 'TEXT'], ['unit', 'TEXT'], ['floor', 'TEXT'], ['idemKey', 'TEXT']]) addColumn('reports', c, t);
  },
  function revisionsAndIndexes() {
    addColumn('reports', 'rev', 'INTEGER NOT NULL DEFAULT 1');
    // a retried send must find the report it already made; duplicates from older builds keep only the first key
    db.exec(`UPDATE reports SET idemKey = NULL WHERE idemKey IS NOT NULL AND id NOT IN (SELECT MIN(id) FROM reports WHERE idemKey IS NOT NULL GROUP BY reporterId, idemKey);
      CREATE UNIQUE INDEX IF NOT EXISTS ux_reports_idem ON reports (reporterId, idemKey) WHERE idemKey IS NOT NULL;
      CREATE INDEX IF NOT EXISTS ix_reports_reporter ON reports (reporterId, id);
      CREATE INDEX IF NOT EXISTS ix_reports_status ON reports (status, updatedAt);
      CREATE INDEX IF NOT EXISTS ix_reports_dup ON reports (dupOf) WHERE dupOf IS NOT NULL;`);
  },
  function photosApart() {                                    // photos leave the reports table so listing reports never reads picture bytes
    db.exec('CREATE TABLE IF NOT EXISTS report_photos (reportId INTEGER PRIMARY KEY REFERENCES reports(id) ON DELETE CASCADE, data TEXT NOT NULL, bytes INTEGER NOT NULL)');
    db.exec("INSERT OR IGNORE INTO report_photos (reportId, data, bytes) SELECT id, photo, length(photo) FROM reports WHERE photo IS NOT NULL AND photo <> ''");
    db.exec('UPDATE reports SET photo = NULL WHERE photo IS NOT NULL');
  },
  function accounts() {
    db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, userId TEXT NOT NULL, role TEXT NOT NULL, createdAt TEXT NOT NULL, expiresAt TEXT NOT NULL,
        lastSeenAt TEXT NOT NULL, ip TEXT, ua TEXT);
      CREATE INDEX IF NOT EXISTS ix_sessions_user ON sessions (userId);
      CREATE TABLE IF NOT EXISTS staff (email TEXT PRIMARY KEY, isAdmin INTEGER NOT NULL DEFAULT 0, addedBy TEXT, addedAt TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS login_codes (email TEXT PRIMARY KEY, codeHash TEXT NOT NULL, expiresAt TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, createdAt TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT NOT NULL, actor TEXT, action TEXT NOT NULL, target TEXT, detail TEXT);`);
  },
  function legacyLocations() {                                // the one and only conversion of data from the larger build; runs inside a copy-first migration
    addColumn('reports', 'legacy', 'TEXT');                   // where the record said it was before it was converted
    addColumn('worker_profiles', 'legacy', 'TEXT');
    addColumn('reports', 'idemFp', 'TEXT');                  // what a send contained, so the same key with other content is told apart from a retry
    for (const row of all('SELECT * FROM reports')) {
      const fix = legacyReport(row);
      if (!fix) continue;
      if (fix.legacy) fix.legacy = JSON.stringify(fix.legacy);
      const keys = Object.keys(fix);
      run('UPDATE reports SET ' + keys.map(k => k + ' = ?').join(', ') + ' WHERE id = ?', ...keys.map(k => fix[k]), row.id);
      LEGACY_DONE.reports += 1;
    }
    for (const row of all('SELECT * FROM worker_profiles')) {
      const fix = legacyProfile({ buildings:JSON.parse(row.buildings), places:JSON.parse(row.places) });
      if (!fix) continue;
      run('UPDATE worker_profiles SET buildings = ?, places = ?, legacy = ?' + (fix.setupDone === false ? ', setupDone = 0' : '') + ' WHERE userId = ?',
        JSON.stringify(fix.buildings), JSON.stringify(fix.places), JSON.stringify(fix.legacy), row.userId);
      LEGACY_DONE.profiles += 1;
    }
  },
  function triageRole() {                                      // a named triage coordinator: sees the reports no worker's saved area covers
    addColumn('staff', 'triage', 'INTEGER NOT NULL DEFAULT 0');
  }
];
function migrate() {
  const from = get('PRAGMA user_version').user_version;
  const known = hasTable('reports') || hasTable('users');
  if (from >= MIGRATIONS.length) return { from, to:from, backup:null };
  let backup = null;
  if (known) {
    try { backup = snapshot(path.join(BACKUP_DIR, 'before-migration-v' + from + '-' + stamp() + '.db')); }
    catch (e) { throw new Error('Could not back up the database before changing it, so nothing was changed: ' + e.message); }
  }
  for (let v = from; v < MIGRATIONS.length; v += 1) {
    tx(() => { MIGRATIONS[v](); db.exec('PRAGMA user_version = ' + (v + 1)); });
  }
  return { from, to:MIGRATIONS.length, backup };
}
const MIGRATED = migrate();

/* ---------- Where a report may be, building by building ----------
   area id -> [unit, floor, detail], 0 = not asked, 1 = optional, 2 = required. Generated from locationRules() in app.js; GET /api/locations lets a test compare the two. */
/*LOCATIONS-BEGIN*/
const LOCATIONS = {
  "CVA": {
    "room": {"r":[2,0,1],"label":"Bedroom / efficiency room","noPhoto":false,"entry":true,"cats":["electrical","hvac","structure","furniture","plumbing","cleaning","tech","other"]},
    "bathroom": {"r":[2,0,1],"label":"Apartment bathroom","noPhoto":true,"entry":true,"cats":["plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "unitkitchen": {"r":[2,0,1],"label":"Apartment kitchen","noPhoto":false,"entry":true,"cats":["furniture","plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "living": {"r":[2,0,1],"label":"Living / dining area","noPhoto":false,"entry":true,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "unitlaundry": {"r":[2,0,1],"label":"Washer / dryer in my unit","noPhoto":false,"entry":true,"cats":["laundry","plumbing","electrical","cleaning","tech","other"]},
    "mail": {"r":[0,0,1],"label":"Mailbox / package area","noPhoto":false,"entry":false,"cats":["structure","electrical","furniture","cleaning","plumbing","tech","other"]},
    "trash": {"r":[0,0,1],"label":"Trash / recycling area","noPhoto":false,"entry":false,"cats":["cleaning","structure","plumbing","tech","other"]},
    "hallway": {"r":[0,2,1],"label":"Hallway / corridor","noPhoto":false,"entry":false,"cats":["electrical","structure","hvac","plumbing","cleaning","tech","other"]},
    "stairs": {"r":[0,1,1],"label":"Stairs / stairwell","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "elevator": {"r":[0,1,1],"label":"Elevator","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "lobby": {"r":[0,0,1],"label":"Entrance / lobby","noPhoto":false,"entry":false,"cats":["structure","electrical","hvac","furniture","cleaning","plumbing","tech","other"]},
    "outside": {"r":[0,0,1],"label":"Outside / building approach","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "other": {"r":[0,0,2],"label":"Other place","noPhoto":false,"entry":false,"cats":["plumbing","electrical","hvac","structure","furniture","cleaning","laundry","tech","other"]}
  },
  "CVB": {
    "room": {"r":[2,0,1],"label":"Bedroom / studio","noPhoto":false,"entry":true,"cats":["electrical","hvac","structure","furniture","plumbing","cleaning","tech","other"]},
    "bathroom": {"r":[2,0,1],"label":"Apartment bathroom","noPhoto":true,"entry":true,"cats":["plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "unitkitchen": {"r":[2,0,1],"label":"Apartment kitchen / studio kitchenette","noPhoto":false,"entry":true,"cats":["furniture","plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "living": {"r":[2,0,1],"label":"Living / dining area","noPhoto":false,"entry":true,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "laundry": {"r":[0,0,1],"label":"Laundry room","noPhoto":false,"entry":false,"cats":["laundry","plumbing","electrical","cleaning","tech","other"]},
    "rac": {"r":[0,0,1],"label":"Recreation center (RAC) / game area","noPhoto":false,"entry":false,"cats":["electrical","hvac","structure","furniture","cleaning","plumbing","tech","other"]},
    "racrooms": {"r":[0,0,1],"label":"RAC meeting / study room","noPhoto":false,"entry":false,"cats":["electrical","hvac","structure","furniture","cleaning","plumbing","tech","other"]},
    "lab": {"r":[0,0,1],"label":"Computer lab","noPhoto":false,"entry":false,"cats":["electrical","hvac","structure","furniture","cleaning","plumbing","tech","other"]},
    "hub": {"r":[0,0,1],"label":"Spartan Study Hub","noPhoto":false,"entry":false,"cats":["electrical","hvac","structure","furniture","cleaning","plumbing","tech","other"]},
    "market": {"r":[0,0,1],"label":"Village Market","noPhoto":false,"entry":false,"cats":["electrical","hvac","structure","furniture","cleaning","plumbing","tech","other"]},
    "office": {"r":[0,0,1],"label":"Housing Office visitor area","noPhoto":false,"entry":false,"cats":["electrical","hvac","structure","furniture","cleaning","plumbing","tech","other"]},
    "desk": {"r":[0,0,1],"label":"Courtesy desk","noPhoto":false,"entry":false,"cats":["furniture","electrical","structure","cleaning","plumbing","tech","other"]},
    "mail": {"r":[0,0,1],"label":"Mailbox / package area","noPhoto":false,"entry":false,"cats":["structure","electrical","furniture","cleaning","plumbing","tech","other"]},
    "trash": {"r":[0,0,1],"label":"Trash / recycling area","noPhoto":false,"entry":false,"cats":["cleaning","structure","plumbing","tech","other"]},
    "hallway": {"r":[0,2,1],"label":"Hallway / corridor","noPhoto":false,"entry":false,"cats":["electrical","structure","hvac","plumbing","cleaning","tech","other"]},
    "stairs": {"r":[0,1,1],"label":"Stairs / stairwell","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "elevator": {"r":[0,1,1],"label":"Elevator","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "lobby": {"r":[0,0,1],"label":"Entrance / lobby","noPhoto":false,"entry":false,"cats":["structure","electrical","hvac","furniture","cleaning","plumbing","tech","other"]},
    "outside": {"r":[0,0,1],"label":"Outside / building approach","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "other": {"r":[0,0,2],"label":"Other place","noPhoto":false,"entry":false,"cats":["plumbing","electrical","hvac","structure","furniture","cleaning","laundry","tech","other"]}
  },
  "CVC": {
    "room": {"r":[2,0,1],"label":"Bedroom","noPhoto":false,"entry":true,"cats":["electrical","hvac","structure","furniture","plumbing","cleaning","tech","other"]},
    "bathroom": {"r":[2,0,1],"label":"Suite bathroom","noPhoto":true,"entry":true,"cats":["plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "living": {"r":[2,0,1],"label":"Suite living / dining area","noPhoto":false,"entry":true,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "unitkitchen": {"r":[2,0,1],"label":"Suite kitchenette","noPhoto":false,"entry":true,"cats":["furniture","plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "kitchen": {"r":[0,0,1],"label":"Community kitchen (7th floor)","noPhoto":false,"entry":false,"cats":["furniture","plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "laundry": {"r":[0,0,1],"label":"Laundry room","noPhoto":false,"entry":false,"cats":["laundry","plumbing","electrical","cleaning","tech","other"]},
    "study": {"r":[0,1,1],"label":"Shared study area / lounge","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "desk": {"r":[0,0,1],"label":"Courtesy desk","noPhoto":false,"entry":false,"cats":["furniture","electrical","structure","cleaning","plumbing","tech","other"]},
    "trash": {"r":[0,0,1],"label":"Trash / recycling area","noPhoto":false,"entry":false,"cats":["cleaning","structure","plumbing","tech","other"]},
    "hallway": {"r":[0,2,1],"label":"Hallway / corridor","noPhoto":false,"entry":false,"cats":["electrical","structure","hvac","plumbing","cleaning","tech","other"]},
    "stairs": {"r":[0,1,1],"label":"Stairs / stairwell","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "elevator": {"r":[0,1,1],"label":"Elevator","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "lobby": {"r":[0,0,1],"label":"Entrance / lobby","noPhoto":false,"entry":false,"cats":["structure","electrical","hvac","furniture","cleaning","plumbing","tech","other"]},
    "outside": {"r":[0,0,1],"label":"Outside / building approach","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "other": {"r":[0,0,2],"label":"Other place","noPhoto":false,"entry":false,"cats":["plumbing","electrical","hvac","structure","furniture","cleaning","laundry","tech","other"]}
  },
  "CV2": {
    "room": {"r":[2,0,1],"label":"Dorm room","noPhoto":false,"entry":true,"cats":["electrical","hvac","structure","furniture","plumbing","cleaning","tech","other"]},
    "bathroom": {"r":[0,2,2],"label":"Shared bathroom / shower","noPhoto":true,"entry":false,"cats":["plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "study": {"r":[0,1,1],"label":"Study room","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "lounge": {"r":[0,1,1],"label":"Common lounge","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "study10": {"r":[0,1,1],"label":"10th-floor study lounge","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "multi": {"r":[0,0,1],"label":"Multi-purpose room","noPhoto":false,"entry":false,"cats":["electrical","hvac","structure","furniture","cleaning","plumbing","tech","other"]},
    "rec": {"r":[0,0,1],"label":"CV2 recreation space","noPhoto":false,"entry":false,"cats":["electrical","hvac","structure","furniture","cleaning","plumbing","tech","other"]},
    "kitchen": {"r":[0,1,1],"label":"Community kitchen","noPhoto":false,"entry":false,"cats":["furniture","plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "laundry": {"r":[0,0,1],"label":"Laundry room","noPhoto":false,"entry":false,"cats":["laundry","plumbing","electrical","cleaning","tech","other"]},
    "desk": {"r":[0,0,1],"label":"Courtesy desk","noPhoto":false,"entry":false,"cats":["furniture","electrical","structure","cleaning","plumbing","tech","other"]},
    "trash": {"r":[0,0,1],"label":"Trash / recycling area","noPhoto":false,"entry":false,"cats":["cleaning","structure","plumbing","tech","other"]},
    "bike": {"r":[0,0,1],"label":"Bike enclosure","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "hallway": {"r":[0,2,1],"label":"Hallway / corridor","noPhoto":false,"entry":false,"cats":["electrical","structure","hvac","plumbing","cleaning","tech","other"]},
    "stairs": {"r":[0,1,1],"label":"Stairs / stairwell","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "elevator": {"r":[0,1,1],"label":"Elevator","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "lobby": {"r":[0,0,1],"label":"Entrance / lobby","noPhoto":false,"entry":false,"cats":["structure","electrical","hvac","furniture","cleaning","plumbing","tech","other"]},
    "outside": {"r":[0,0,1],"label":"Outside / building approach","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "other": {"r":[0,0,2],"label":"Other place","noPhoto":false,"entry":false,"cats":["plumbing","electrical","hvac","structure","furniture","cleaning","laundry","tech","other"]}
  },
  "Joe West": {
    "room": {"r":[2,0,1],"label":"Dorm room","noPhoto":false,"entry":true,"cats":["electrical","hvac","structure","furniture","plumbing","cleaning","tech","other"]},
    "bathroom": {"r":[0,2,2],"label":"Shared bathroom / shower","noPhoto":true,"entry":false,"cats":["plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "study": {"r":[0,1,1],"label":"Study area","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "lounge": {"r":[0,1,1],"label":"Common lounge","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "activity": {"r":[0,0,1],"label":"Activity area","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "kitchen": {"r":[0,1,1],"label":"Community kitchen","noPhoto":false,"entry":false,"cats":["furniture","plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "laundry": {"r":[0,0,1],"label":"Laundry room","noPhoto":false,"entry":false,"cats":["laundry","plumbing","electrical","cleaning","tech","other"]},
    "mail": {"r":[0,0,1],"label":"Resident mailroom / package pickup","noPhoto":false,"entry":false,"cats":["structure","electrical","furniture","cleaning","plumbing","tech","other"]},
    "desk": {"r":[0,0,1],"label":"Courtesy desk","noPhoto":false,"entry":false,"cats":["furniture","electrical","structure","cleaning","plumbing","tech","other"]},
    "trash": {"r":[0,1,1],"label":"Floor trash / recycling area","noPhoto":false,"entry":false,"cats":["cleaning","structure","plumbing","tech","other"]},
    "bike": {"r":[0,0,1],"label":"Bike enclosure","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "hallway": {"r":[0,2,1],"label":"Hallway / corridor","noPhoto":false,"entry":false,"cats":["electrical","structure","hvac","plumbing","cleaning","tech","other"]},
    "stairs": {"r":[0,1,1],"label":"Stairs / stairwell","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "elevator": {"r":[0,1,1],"label":"Elevator","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "lobby": {"r":[0,0,1],"label":"Entrance / lobby","noPhoto":false,"entry":false,"cats":["structure","electrical","hvac","furniture","cleaning","plumbing","tech","other"]},
    "outside": {"r":[0,0,1],"label":"Outside / building approach","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "other": {"r":[0,0,2],"label":"Other place","noPhoto":false,"entry":false,"cats":["plumbing","electrical","hvac","structure","furniture","cleaning","laundry","tech","other"]}
  },
  "Washburn": {
    "room": {"r":[2,0,1],"label":"Dorm room","noPhoto":false,"entry":true,"cats":["electrical","hvac","structure","furniture","plumbing","cleaning","tech","other"]},
    "bathroom": {"r":[0,2,2],"label":"Shared bathroom / shower","noPhoto":true,"entry":false,"cats":["plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "lounge": {"r":[0,1,1],"label":"Formal lounge","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "study": {"r":[0,1,1],"label":"Study lounge","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "activity": {"r":[0,0,1],"label":"Activity area","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "kitchen": {"r":[0,1,1],"label":"Community kitchen","noPhoto":false,"entry":false,"cats":["furniture","plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "laundry": {"r":[0,0,1],"label":"Laundry room","noPhoto":false,"entry":false,"cats":["laundry","plumbing","electrical","cleaning","tech","other"]},
    "desk": {"r":[0,0,1],"label":"Courtesy desk","noPhoto":false,"entry":false,"cats":["furniture","electrical","structure","cleaning","plumbing","tech","other"]},
    "trash": {"r":[0,0,1],"label":"Outdoor trash / recycling containers","noPhoto":false,"entry":false,"cats":["cleaning","structure","plumbing","tech","other"]},
    "hallway": {"r":[0,2,1],"label":"Hallway / corridor","noPhoto":false,"entry":false,"cats":["electrical","structure","hvac","plumbing","cleaning","tech","other"]},
    "stairs": {"r":[0,1,1],"label":"Stairs / stairwell","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "lobby": {"r":[0,0,1],"label":"Entrance / lobby","noPhoto":false,"entry":false,"cats":["structure","electrical","hvac","furniture","cleaning","plumbing","tech","other"]},
    "outside": {"r":[0,0,1],"label":"Outside / building approach","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "other": {"r":[0,0,2],"label":"Other place","noPhoto":false,"entry":false,"cats":["plumbing","electrical","hvac","structure","furniture","cleaning","laundry","tech","other"]}
  },
  "SVP": {
    "room": {"r":[2,0,1],"label":"Room / sleeping area","noPhoto":false,"entry":true,"cats":["electrical","hvac","structure","furniture","plumbing","cleaning","tech","other"]},
    "bathroom": {"r":[2,0,1],"label":"Bathroom in my room or suite","noPhoto":true,"entry":true,"cats":["plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "living": {"r":[2,0,1],"label":"Living area","noPhoto":false,"entry":true,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "study": {"r":[0,1,1],"label":"Study lounge","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "gametv": {"r":[0,0,1],"label":"Game / TV room","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "fitness": {"r":[0,0,1],"label":"Fitness room","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "kitchen": {"r":[0,1,1],"label":"Community kitchen","noPhoto":false,"entry":false,"cats":["furniture","plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "dining": {"r":[0,0,1],"label":"Dining area / cafeteria","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "laundry": {"r":[0,0,1],"label":"Laundry room","noPhoto":false,"entry":false,"cats":["laundry","plumbing","electrical","cleaning","tech","other"]},
    "mail": {"r":[0,0,1],"label":"Mail / parcel area","noPhoto":false,"entry":false,"cats":["structure","electrical","furniture","cleaning","plumbing","tech","other"]},
    "desk": {"r":[0,0,1],"label":"Reception / front desk","noPhoto":false,"entry":false,"cats":["furniture","electrical","structure","cleaning","plumbing","tech","other"]},
    "hallway": {"r":[0,2,1],"label":"Hallway / corridor","noPhoto":false,"entry":false,"cats":["electrical","structure","hvac","plumbing","cleaning","tech","other"]},
    "stairs": {"r":[0,1,1],"label":"Stairs / stairwell","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "elevator": {"r":[0,1,1],"label":"Elevator","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "lobby": {"r":[0,0,1],"label":"Entrance / lobby","noPhoto":false,"entry":false,"cats":["structure","electrical","hvac","furniture","cleaning","plumbing","tech","other"]},
    "outside": {"r":[0,0,1],"label":"Outside / building approach","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "other": {"r":[0,0,2],"label":"Other place","noPhoto":false,"entry":false,"cats":["plumbing","electrical","hvac","structure","furniture","cleaning","laundry","tech","other"]}
  },
  "Macquarrie Hall": {
    "classroom": {"r":[2,0,1],"label":"Classroom","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "bathroom": {"r":[0,2,1],"label":"Restroom","noPhoto":true,"entry":false,"cats":["plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "study": {"r":[1,1,1],"label":"Study / teaching area","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "hallway": {"r":[0,2,1],"label":"Hallway / corridor","noPhoto":false,"entry":false,"cats":["electrical","structure","hvac","plumbing","cleaning","tech","other"]},
    "stairs": {"r":[0,1,1],"label":"Stairs / elevator","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "lobby": {"r":[0,0,1],"label":"Entrance / lobby","noPhoto":false,"entry":false,"cats":["structure","electrical","hvac","furniture","cleaning","plumbing","tech","other"]},
    "outside": {"r":[0,0,1],"label":"Outside / building approach","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "other": {"r":[0,0,2],"label":"Other place","noPhoto":false,"entry":false,"cats":["plumbing","electrical","hvac","structure","furniture","cleaning","laundry","tech","other"]}
  },
  "Sweeney Building": {
    "classroom": {"r":[2,0,1],"label":"Classroom","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "bathroom": {"r":[0,2,1],"label":"Restroom","noPhoto":true,"entry":false,"cats":["plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "study": {"r":[1,1,1],"label":"Study / teaching area","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "hallway": {"r":[0,2,1],"label":"Hallway / corridor","noPhoto":false,"entry":false,"cats":["electrical","structure","hvac","plumbing","cleaning","tech","other"]},
    "stairs": {"r":[0,1,1],"label":"Stairs / elevator","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "lobby": {"r":[0,0,1],"label":"Entrance / lobby","noPhoto":false,"entry":false,"cats":["structure","electrical","hvac","furniture","cleaning","plumbing","tech","other"]},
    "outside": {"r":[0,0,1],"label":"Outside / building approach","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "other": {"r":[0,0,2],"label":"Other place","noPhoto":false,"entry":false,"cats":["plumbing","electrical","hvac","structure","furniture","cleaning","laundry","tech","other"]}
  },
  "Clarke Hall": {
    "classroom": {"r":[2,0,1],"label":"Classroom","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "bathroom": {"r":[0,2,1],"label":"Restroom","noPhoto":true,"entry":false,"cats":["plumbing","electrical","hvac","structure","cleaning","tech","other"]},
    "study": {"r":[1,1,1],"label":"Study / teaching area","noPhoto":false,"entry":false,"cats":["furniture","electrical","hvac","structure","cleaning","plumbing","tech","other"]},
    "hallway": {"r":[0,2,1],"label":"Hallway / corridor","noPhoto":false,"entry":false,"cats":["electrical","structure","hvac","plumbing","cleaning","tech","other"]},
    "stairs": {"r":[0,1,1],"label":"Stairs / elevator","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "lobby": {"r":[0,0,1],"label":"Entrance / lobby","noPhoto":false,"entry":false,"cats":["structure","electrical","hvac","furniture","cleaning","plumbing","tech","other"]},
    "outside": {"r":[0,0,1],"label":"Outside / building approach","noPhoto":false,"entry":false,"cats":["structure","electrical","cleaning","plumbing","tech","other"]},
    "other": {"r":[0,0,2],"label":"Other place","noPhoto":false,"entry":false,"cats":["plumbing","electrical","hvac","structure","furniture","cleaning","laundry","tech","other"]}
  }
};
const BUILDING_NAMES = {"CVA":"Campus Village A","CVB":"Campus Village B","CVC":"Campus Village C","CV2":"Campus Village 2","Joe West":"Joe West Hall","Washburn":"Washburn Hall","SVP":"Spartan Village on the Paseo","Macquarrie Hall":"MacQuarrie Hall","Sweeney Building":"Sweeney Hall","Clarke Hall":"Clark Hall"};
/*LOCATIONS-END*/

/* ---------- Vocabulary ---------- */
// 'referred' is retired in the app but still valid, so older tickets keep working.
const STATUSES = ['new', 'reopened', 'acknowledged', 'in_progress', 'waiting', 'referred', 'resolved', 'duplicate', 'other'];
const STAFF_STATUSES = ['acknowledged', 'in_progress', 'waiting', 'resolved', 'other'];   // what staff may move a ticket to by hand
const OPEN_STATUS = s => !['resolved', 'duplicate'].includes(s);
const PRIORITIES = ['urgent', 'high', 'normal', 'low'];
const PRIORITY_RANK = { urgent:0, high:1, normal:2, low:3 };
const CATEGORIES = ['plumbing', 'electrical', 'hvac', 'structure', 'furniture', 'cleaning', 'laundry', 'tech', 'other'];
const EVENT_TYPES = ['created', 'status', 'priority', 'category', 'assigned', 'eta', 'message', 'note', 'duplicate', 'reopened', 'confirmed', 'ai', 'distinct'];
const ETA_RE = /^\d{4}-\d{2}-\d{2}$/;
const REPORT_COLS = ['createdAt', 'updatedAt', 'reporterId', 'reporterName', 'building', 'buildingName', 'area', 'areaLabel',
  'category', 'priority', 'prioritySource', 'status', 'unit', 'floor', 'detail', 'description', 'entry', 'assigneeId', 'assigneeName',
  'eta', 'dupOf', 'awaitingStaff', 'lastActorRole', 'resolvedAt', 'confirmedAt', 'categoryText', 'statusText', 'publicAt', 'idemKey', 'idemFp', 'rev'];
const SELECT_REPORT = 'SELECT r.*, EXISTS (SELECT 1 FROM report_photos p WHERE p.reportId = r.id) AS hasPhoto FROM reports r';

let version = 0;                       // bumped on every write; clients poll it to refresh
const bump = () => { version += 1; };

/* A report that was merged into another can still follow it: the original's public progress (status, planned date, resolution), never its messages. */
function trackingOf(dupOf) {
  let o = null, id = dupOf;
  for (let hop = 0; hop < 6 && id; hop += 1) {                       // the original may itself have been merged since
    o = get('SELECT id, status, statusText, eta, resolvedAt, dupOf FROM reports WHERE id = ?', id);
    if (!o || o.status !== 'duplicate') break;
    id = o.dupOf; o = null;
  }
  if (!o) return null;
  const c = get("SELECT MAX(at) AS at FROM events WHERE reportId = ? AND type IN ('status', 'eta') AND visibility = 'public'", o.id);
  return { id:o.id, status:o.status, statusText:o.statusText || null, eta:o.eta || null, resolvedAt:o.resolvedAt || null, changedAt:(c && c.at) || null };
}
const toReport = row => {
  const { photo, awaitingStaff, idemKey, idemFp, hasPhoto, catalogVersion, origArea, legacy, ...r } = row;
  if (legacy) { try { r.legacy = JSON.parse(legacy); } catch { /* an unreadable note is not worth failing a list */ } }
  r.awaitingStaff = !!awaitingStaff;
  r.hasPhoto = !!hasPhoto;
  if (r.status === 'duplicate' && r.dupOf) { const t = trackingOf(r.dupOf); if (t) r.tracking = t; }
  return r;
};
const toEvent = row => { const { fromVal, toVal, ...e } = row; return { ...e, from:fromVal, to:toVal }; };
const toUser = u => u && ({ id:u.id, role:u.role, email:u.email, name:u.name, createdAt:u.createdAt, lastLoginAt:u.lastLoginAt });
const reportRow = id => get(SELECT_REPORT + ' WHERE r.id = ?', id);

/* ---------- Photos: the bytes are checked, not just the label ----------
   A JPEG is read segment by segment. Metadata segments (EXIF with GPS, XMP, IPTC, comments) are dropped, a missing or broken structure is
   refused, and the picture must really have a frame header and an end marker. The app already redraws photos on a canvas; this is the second line. */
function cleanJpegDataUrl(url) {
  const m = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(String(url));
  if (!m) throw fail(400, 'The photo must be a JPEG.');
  const buf = Buffer.from(m[1], 'base64');
  if (buf.length < 125 || buf.length > MAX_PHOTO_BYTES) throw fail(400, buf.length < 125 ? 'The photo is empty or damaged.' : 'The photo is too large.');
  if (buf[0] !== 0xFF || buf[1] !== 0xD8 || buf[2] !== 0xFF) throw fail(400, 'That file is not a JPEG picture.');
  const out = [buf.subarray(0, 2)];
  let i = 2, frame = false, scan = false;
  const KEEP = new Set([0xE0, 0xE2, 0xEE]);                          // JFIF, ICC colour profile, Adobe colour flag. Everything else in APP/COM goes.
  while (i + 1 < buf.length) {
    if (buf[i] !== 0xFF) throw fail(400, 'The photo is damaged.');
    let mk = buf[i + 1];
    while (mk === 0xFF && i + 2 < buf.length) { i += 1; mk = buf[i + 1]; }
    if (mk === 0xD9) { i += 2; break; }
    if (mk === 0xDA) { if (!frame) throw fail(400, 'The photo is damaged.'); scan = true; out.push(buf.subarray(i)); i = buf.length; break; }
    if (mk === 0x01 || (mk >= 0xD0 && mk <= 0xD7)) { out.push(buf.subarray(i, i + 2)); i += 2; continue; }
    if (i + 4 > buf.length) throw fail(400, 'The photo is damaged.');
    const len = buf.readUInt16BE(i + 2);
    if (len < 2 || i + 2 + len > buf.length) throw fail(400, 'The photo is damaged.');
    if ((mk >= 0xC0 && mk <= 0xCF) && ![0xC4, 0xC8, 0xCC].includes(mk)) {
      if (len < 11) throw fail(400, 'The photo is damaged.');
      const hgt = buf.readUInt16BE(i + 5), wid = buf.readUInt16BE(i + 7);
      if (!hgt || !wid || hgt > 8000 || wid > 8000) throw fail(400, 'The photo has an unusual size.');
      frame = true;
    }
    const drop = (mk >= 0xE0 && mk <= 0xEF && !KEEP.has(mk)) || mk === 0xFE;
    if (!drop) out.push(buf.subarray(i, i + 2 + len));
    i += 2 + len;
  }
  if (!frame || !scan) throw fail(400, 'The photo is damaged.');
  const cleaned = Buffer.concat(out);
  if (cleaned[cleaned.length - 2] !== 0xFF || cleaned[cleaned.length - 1] !== 0xD9) throw fail(400, 'The photo is damaged.');
  return 'data:image/jpeg;base64,' + cleaned.toString('base64');
}


/* =====================================================================
   Who is calling: staff list, sessions, Google and email-code sign-in
   ===================================================================== */
function audit(action, actor, target, detail) {
  try { run('INSERT INTO audit_log (at, actor, action, target, detail) VALUES (?,?,?,?,?)', now(), actor || null, action, target == null ? null : String(target).slice(0, 200), detail == null ? null : String(detail).slice(0, 500)); }
  catch (e) { log('warn', 'audit write failed', { error:e.message }); }
}

const staffRow = email => get('SELECT * FROM staff WHERE email = ?', email);
const isAdminEmail = email => ADMIN_EMAILS.includes(email) || !!(staffRow(email) || {}).isAdmin;
const isStaffEmail = email => isAdminEmail(email) || STAFF_EMAILS.includes(email) || TRIAGE_EMAILS.includes(email) || !!staffRow(email);
/* The triage coordinator sees reports that no worker's saved area covers. Admins are coordinators. In demo sign-in, where anyone can be staff, everyone is a
   coordinator until somebody is named, so a fresh demo works. Once a coordinator is named, only they are. */
const triageNamed = () => ADMIN_EMAILS.length > 0 || TRIAGE_EMAILS.length > 0 || !!get('SELECT 1 x FROM staff WHERE triage = 1 OR isAdmin = 1');
const isTriageEmail = email => isAdminEmail(email) || TRIAGE_EMAILS.includes(email) || !!(staffRow(email) || {}).triage || (DEMO_AUTH && !triageNamed());
// Demo sign-in lets anyone be staff. Real sign-in lets only the staff list be staff.
const mayBeStaff = email => DEMO_AUTH || isStaffEmail(email);

function ensureUser(role, email, name) {
  const id = role + ':' + email, t = now();
  const old = get('SELECT * FROM users WHERE id = ?', id);
  if (old) {
    run('UPDATE users SET lastLoginAt = ?, name = ? WHERE id = ?', t, name && name !== old.name && !DEMO_AUTH ? name.slice(0, 120) : old.name, id);
  } else {
    run('INSERT INTO users (id, role, email, name, createdAt, lastLoginAt) VALUES (?,?,?,?,?,?)', id, role, email, (name || nameFromEmail(email)).slice(0, 120), t, t);
  }
  return get('SELECT * FROM users WHERE id = ?', id);
}

function newSession(user, req) {
  const token = 'sf_' + crypto.randomBytes(32).toString('base64url'), t = now();
  tx(() => {
    run('INSERT INTO sessions (id, userId, role, createdAt, expiresAt, lastSeenAt, ip, ua) VALUES (?,?,?,?,?,?,?,?)',
      sha(token), user.id, user.role, t, new Date(Date.now() + SESSION_DAYS * 864e5).toISOString(), t, clientIp(req), String(req.headers['user-agent'] || '').slice(0, 200));
    // at most 10 live sign-ins per person; the oldest go first
    run('DELETE FROM sessions WHERE userId = ? AND id NOT IN (SELECT id FROM sessions WHERE userId = ? ORDER BY createdAt DESC LIMIT 10)', user.id, user.id);
  });
  return token;
}
function assertMayUse(role, email) {
  if (role === 'worker' && !mayBeStaff(email)) {
    audit('signin_denied', email, 'worker', 'not on the staff list');
    throw fail(403, 'This account is not on the staff list. Ask a SpartanFix admin to add your email, or sign in as a student.');
  }
}
function signIn(role, email, name, req) {
  assertMayUse(role, email);
  const user = tx(() => ensureUser(role, email, name));
  const token = newSession(user, req);
  audit('signin', user.id, role, null);
  return { token, user:toUser(user), isAdmin:role === 'worker' && isAdminEmail(email), isTriage:role === 'worker' && isTriageEmail(email), expiresInDays:SESSION_DAYS };
}

function clientIp(req) {
  if (TRUST_PROXY) {
    const xf = String(req.headers['x-forwarded-for'] || '').split(',').map(s => s.trim()).filter(Boolean);
    if (xf.length) return xf[xf.length - 1];                         // the address the host's own proxy saw; earlier entries can be forged by the caller
  }
  return req.socket.remoteAddress || 'unknown';
}

/* Reads the Bearer token. Returns null when there is none; throws 401 when it is present but not valid. */
function authenticate(req) {
  const h = String(req.headers.authorization || '');
  const m = /^Bearer\s+(sf_[A-Za-z0-9_-]{20,80})$/.exec(h);
  if (!m) { if (h) throw fail(401, 'Please sign in again.'); return null; }
  const id = sha(m[1]);
  const s = get('SELECT s.*, u.email AS email, u.name AS name FROM sessions s JOIN users u ON u.id = s.userId WHERE s.id = ?', id);
  if (!s || s.expiresAt < now()) { if (s) run('DELETE FROM sessions WHERE id = ?', id); throw fail(401, 'Your sign-in expired. Please sign in again.'); }
  if (s.role === 'worker' && !mayBeStaff(s.email)) { run('DELETE FROM sessions WHERE id = ?', id); throw fail(401, 'Your staff access was removed.'); }
  if (Date.now() - Date.parse(s.lastSeenAt) > 36e5) {              // keep an active person signed in; touch the row at most once an hour
    run('UPDATE sessions SET lastSeenAt = ?, expiresAt = ? WHERE id = ?', now(), new Date(Date.now() + SESSION_DAYS * 864e5).toISOString(), id);
  }
  return { sessionId:id, id:s.userId, role:s.role, email:s.email, name:s.name, isStaff:s.role === 'worker', isAdmin:s.role === 'worker' && isAdminEmail(s.email), isTriage:s.role === 'worker' && isTriageEmail(s.email) };
}

/* ---------- Google sign-in: the ID token is verified here, never trusted from the page ---------- */
let jwks = { keys:[], at:0 };
async function loadJwks(force) {
  if (!force && jwks.keys.length && Date.now() - jwks.at < 36e5) return jwks.keys;
  const r = await fetch(GOOGLE_JWKS_URL, { signal:AbortSignal.timeout(5000) });
  if (!r.ok) throw new Error('JWKS HTTP ' + r.status);
  const j = await r.json();
  if (!j || !Array.isArray(j.keys)) throw new Error('bad JWKS');
  jwks = { keys:j.keys, at:Date.now() };
  return jwks.keys;
}
const b64json = s => JSON.parse(Buffer.from(s, 'base64url').toString('utf8'));
async function verifyGoogleToken(idToken) {
  if (!GOOGLE_CLIENT_ID) throw fail(404, 'Google sign-in is not turned on.');
  if (typeof idToken !== 'string' || idToken.length > 4000 || idToken.split('.').length !== 3) throw fail(400, 'bad token');
  const [h, p, s] = idToken.split('.');
  let head, claims;
  try { head = b64json(h); claims = b64json(p); } catch { throw fail(400, 'bad token'); }
  if (head.alg !== 'RS256' || typeof head.kid !== 'string') throw fail(401, 'Google sign-in failed.');
  let keys;
  try { keys = await loadJwks(false); if (!keys.some(k => k.kid === head.kid)) keys = await loadJwks(true); }
  catch (e) { log('error', 'could not load Google keys', { error:e.message }); throw fail(503, 'Could not reach Google to check your sign-in. Try again in a minute.'); }
  const jwk = keys.find(k => k.kid === head.kid);
  if (!jwk) throw fail(401, 'Google sign-in failed.');
  let ok = false;
  try { ok = crypto.verify('RSA-SHA256', Buffer.from(h + '.' + p), crypto.createPublicKey({ key:jwk, format:'jwk' }), Buffer.from(s, 'base64url')); } catch { ok = false; }
  const t = Math.floor(Date.now() / 1000);
  if (!ok || !['accounts.google.com', 'https://accounts.google.com'].includes(claims.iss) || claims.aud !== GOOGLE_CLIENT_ID ||
      typeof claims.exp !== 'number' || claims.exp < t - 60 || (typeof claims.iat === 'number' && claims.iat > t + 300)) throw fail(401, 'Google sign-in failed.');
  const email = String(claims.email || '').toLowerCase();
  if (claims.email_verified !== true || !emailOk(email)) throw fail(403, 'Use your @' + ALLOWED_DOMAINS[0] + ' Google account.');
  if (claims.hd && !ALLOWED_DOMAINS.includes(String(claims.hd).toLowerCase())) throw fail(403, 'Use your @' + ALLOWED_DOMAINS[0] + ' Google account.');
  return { email, name:typeof claims.name === 'string' && claims.name.trim() ? claims.name.trim().slice(0, 120) : nameFromEmail(email) };
}

/* ---------- Email one-time code (for people whose school blocks Google sign-in) ---------- */
const codeHash = (email, code) => sha(email + '|' + code + '|' + (GOOGLE_CLIENT_ID || EMAIL_API_KEY || 'spartanfix'));
async function startEmailCode(email, req) {
  if (!EMAIL_CODE) throw fail(404, 'Email sign-in is not turned on.');
  if (!emailOk(email)) throw fail(400, 'Use your @' + ALLOWED_DOMAINS[0] + ' email address.');
  const wait = limited('code:e:' + email, 3, 36e5) || limited('code:i:' + clientIp(req), 20, 36e5);
  if (wait) throw tooMany(wait);
  const prior = get('SELECT createdAt FROM login_codes WHERE email = ?', email);
  if (prior && Date.now() - Date.parse(prior.createdAt) < 30000) throw tooMany(30);
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  run(`INSERT INTO login_codes (email, codeHash, expiresAt, attempts, createdAt) VALUES (?,?,?,0,?)
       ON CONFLICT(email) DO UPDATE SET codeHash = excluded.codeHash, expiresAt = excluded.expiresAt, attempts = 0, createdAt = excluded.createdAt`,
    email, codeHash(email, code), new Date(Date.now() + 10 * 60000).toISOString(), now());
  try {
    const r = await fetch(EMAIL_API_URL, { method:'POST', signal:AbortSignal.timeout(8000),
      headers:{ 'Content-Type':'application/json', Authorization:'Bearer ' + EMAIL_API_KEY },
      body:JSON.stringify({ from:EMAIL_FROM, to:[email], subject:'Your SpartanFix sign-in code', text:'Your SpartanFix code is ' + code + '. It works for 10 minutes. If you did not ask for it, ignore this email.' }) });
    if (!r.ok) throw new Error('email API HTTP ' + r.status);
  } catch (e) {
    run('DELETE FROM login_codes WHERE email = ?', email);
    log('error', 'could not send sign-in code', { error:e.message });
    throw fail(502, 'We could not send the code. Try again in a minute.');
  }
  audit('code_sent', email, null, null);
  return { sent:true };
}
function checkEmailCode(email, code) {
  if (!EMAIL_CODE) throw fail(404, 'Email sign-in is not turned on.');
  if (!emailOk(email) || typeof code !== 'string' || !/^\d{6}$/.test(code)) throw fail(400, 'Enter the 6-digit code.');
  const row = get('SELECT * FROM login_codes WHERE email = ?', email);
  if (!row || row.expiresAt < now()) throw fail(401, 'That code expired. Ask for a new one.');
  if (row.attempts >= 5) { run('DELETE FROM login_codes WHERE email = ?', email); throw fail(401, 'Too many wrong tries. Ask for a new code.'); }
  const a = Buffer.from(row.codeHash), b = Buffer.from(codeHash(email, code));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) { run('UPDATE login_codes SET attempts = attempts + 1 WHERE email = ?', email); throw fail(401, 'That code is not right.'); }
  run('DELETE FROM login_codes WHERE email = ?', email);
  return { email, name:nameFromEmail(email) };
}

/* Expired sessions and codes are removed once an hour. */
function housekeeping() {
  try {
    run('DELETE FROM sessions WHERE expiresAt < ?', now());
    run('DELETE FROM login_codes WHERE expiresAt < ?', new Date(Date.now() - 36e5).toISOString());
    run('DELETE FROM audit_log WHERE at < ?', new Date(Date.now() - 400 * 864e5).toISOString());
  } catch (e) { log('warn', 'housekeeping failed', { error:e.message }); }
}

/* =====================================================================
   Operations. Each one receives the signed-in person and decides what that person may do.
   Nothing here trusts a name, a role or a time sent by the page.
   ===================================================================== */
const actorOf = u => ({ id:u.id, name:u.name, role:u.role });
const SYSTEM = { id:null, name:'AI assistant', role:'system' };

function addEvent(reportId, actor, type, o) {
  const e = o || {};
  run(`INSERT INTO events (reportId, at, actorId, actorName, actorRole, type, fromVal, toVal, text, visibility) VALUES (?,?,?,?,?,?,?,?,?,?)`,
    reportId, e.at || now(), actor.id, actor.name, actor.role, oneOf(type, EVENT_TYPES, 'event type'),
    e.from == null ? null : String(e.from).slice(0, 200), e.to == null ? null : String(e.to).slice(0, 200),
    e.text == null ? null : String(e.text).slice(0, 2000), oneOf(e.visibility || 'public', ['public', 'staff'], 'visibility'));
}
// Change a ticket and bump its revision. "visible" means the student can see the change (staff-only notes do not move publicAt).
function writeReport(id, fields, visible) {
  const keys = Object.keys(fields), t = now();
  run(`UPDATE reports SET ${keys.map(k => k + ' = ?').join(', ')}${keys.length ? ', ' : ''}updatedAt = ?, rev = rev + 1${visible ? ', publicAt = ?' : ''} WHERE id = ?`,
    ...keys.map(k => fields[k]), t, ...(visible ? [t] : []), id);
}
const rawReport = id => get('SELECT * FROM reports WHERE id = ?', id);
const need = (row, what) => { if (!row) throw fail(404, (what || 'report') + ' not found'); return row; };
const validDay = v => ETA_RE.test(v) && new Date(v + 'T00:00:00Z').toISOString().slice(0, 10) === v;
const trimmed = (v, max, name) => (str(v, max, name) || '').trim();
const CAT_LABEL = { plumbing:'Plumbing / leak', electrical:'Power / lights', hvac:'Heating / AC', structure:'Door, lock, window, wall', furniture:'Furniture / appliance', cleaning:'Cleaning / trash / pests', laundry:'Laundry machine', tech:'Wi-Fi, computer or classroom tech', other:'Other' };

// A report must name a real place in a real building, with the unit and floor that place asks for.
function checkLocation(row) {
  const areas = Object.hasOwn(LOCATIONS, row.building) ? LOCATIONS[row.building] : null;
  if (!areas) throw fail(400, 'unknown building');
  const rule = Object.hasOwn(areas, row.area) ? areas[row.area] : null;
  if (!rule) throw fail(400, 'that place is not in this building');
  ['unit', 'floor', 'detail'].forEach((k, i) => {
    const v = row[k] && String(row[k]).trim();
    if (rule.r[i] === 2 && !v) throw fail(400, k + ' is required for this place');
    if (rule.r[i] === 0 && v) throw fail(400, k + ' is not used for this place');
  });
  return rule;
}
const SENSITIVE_TEXT = /toilet|shower|bath ?room|restroom|locker room|changing room/i;          // the same words the page uses to switch photos off

/* The one place a report row is written. "full" is true only for the demo seed, which may set any state. */
function insertReport(row, events, photo) {
  checkLocation(row);
  const res = run(`INSERT INTO reports (${REPORT_COLS.join(',')}) VALUES (${REPORT_COLS.map(() => '?').join(',')})`, ...REPORT_COLS.map(c => row[c]));
  const id = Number(res.lastInsertRowid);
  for (const e of events || []) addEvent(id, { id:e.actorId == null ? null : str(e.actorId, 200, 'actorId'), name:str(e.actorName, 120, 'actorName'),
    role:oneOf(e.actorRole || 'student', ['student', 'worker', 'system'], 'actorRole') }, e.type, { at:str(e.at, 40, 'at'), from:e.from, to:e.to, text:e.text, visibility:e.visibility });
  if (photo) run('INSERT INTO report_photos (reportId, data, bytes) VALUES (?,?,?)', id, photo, photo.length);
  return id;
}

/* ---------- Students ---------- */
function createReport(user, b) {
  if (user.role !== 'student') throw fail(403, 'Only students send reports.');
  const r = b && b.report;
  if (!r || typeof r !== 'object') throw fail(400, 'report required');
  const idemKey = str(r.idemKey, 80, 'idemKey') || null;
  const t = now();
  const row = {
    createdAt:t, updatedAt:t, publicAt:t, reporterId:user.id, reporterName:user.name,
    building:str(r.building, 60, 'building', true), buildingName:null,
    area:str(r.area, 60, 'area', true), areaLabel:null,
    unit:trimmed(r.unit, 40, 'unit'), floor:trimmed(r.floor, 40, 'floor'), detail:trimmed(r.detail, 300, 'detail'),
    category:oneOf(r.category, CATEGORIES, 'category'), priority:oneOf(r.priority, PRIORITIES, 'priority'), prioritySource:'auto', status:'new',
    description:trimmed(r.description, 2000, 'description'), entry:r.entry ? oneOf(r.entry, ['ok', 'contact'], 'entry') : null,
    assigneeId:null, assigneeName:null, eta:null, dupOf:null, awaitingStaff:1, lastActorRole:'student', resolvedAt:null, confirmedAt:null,
    categoryText:null, statusText:null, idemKey, rev:1
  };
  const rule = checkLocation(row);
  row.buildingName = BUILDING_NAMES[row.building]; row.areaLabel = rule.label;                  // the words written down are ours, not whatever the page sent
  if (row.description.length < 4) throw fail(400, 'Describe the problem so the right person can fix it.');
  if (row.category !== 'other' && !rule.cats.includes(row.category)) throw fail(400, 'That type of problem does not fit this place. Pick another type, or Other.');
  if (row.entry && !rule.entry) throw fail(400, 'An entry preference only applies inside your own room or unit.');
  const photo = r.photo ? cleanJpegDataUrl(r.photo) : null;
  if (photo && rule.noPhoto) throw fail(400, 'Photos are not accepted for bathrooms, restrooms and showers.');
  if (photo && SENSITIVE_TEXT.test(row.description + ' ' + row.detail)) throw fail(400, 'Photos are not accepted when the description mentions a bathroom or shower.');
  const fp = sha(JSON.stringify([row.building, row.area, row.unit, row.floor, row.detail, row.description, row.category, row.entry, photo ? sha(photo) : null]));
  row.idemFp = fp;
  // A retry of the same send (the first answer was lost) returns the saved report. The same key with different content is not a retry.
  const sameSend = () => {
    if (!idemKey) return null;
    const seen = get('SELECT id, idemFp FROM reports WHERE reporterId = ? AND idemKey = ?', user.id, idemKey);
    if (!seen) return null;
    if (seen.idemFp && seen.idemFp !== fp) throw fail(409, 'A report with different details was already saved under this send. Look under My reports before sending again.');
    return seen.id;
  };
  const again = sameSend();
  if (again) return toReport(reportRow(again));
  const wait = limited('mk:' + user.id, REPORTS_PER_HOUR, 36e5);
  if (wait) throw tooMany(wait);
  const id = tx(() => {
    const seen = sameSend(); if (seen) return seen;
    const newId = insertReport(row, [], photo);
    addEvent(newId, actorOf(user), 'created', { text:'Report saved in the shared queue.', at:t });
    bump();
    return newId;
  });
  return toReport(reportRow(id));
}

function studentAction(user, id, b) {
  if (user.role !== 'student') throw fail(403, 'Only the student who sent a report can do this.');
  const action = oneOf(b && b.action, ['confirm', 'reopen', 'message', 'ai'], 'action');
  if (action === 'message') { const w = limited('msg:' + user.id, 40, 36e5); if (w) throw tooMany(w); }
  return tx(() => {
    const r = rawReport(id);
    if (!r || r.reporterId !== user.id) throw fail(404, 'report not found');   // someone else's report looks the same as one that does not exist
    const me = actorOf(user);
    if (action === 'confirm') {
      if (r.status !== 'resolved' || r.confirmedAt) throw fail(409, 'This report is not waiting for your confirmation.');
      writeReport(id, { confirmedAt:now(), lastActorRole:'student' }, true);
      addEvent(id, me, 'confirmed');
    } else if (action === 'reopen') {
      if (r.status !== 'resolved') throw fail(409, 'Only a resolved report can be reopened.');
      writeReport(id, { status:'reopened', statusText:null, resolvedAt:null, confirmedAt:null, awaitingStaff:1, lastActorRole:'student' }, true);
      addEvent(id, me, 'status', { from:r.status, to:'reopened' });
      addEvent(id, me, 'reopened');
    } else if (action === 'message') {
      const text = trimmed(b.text, 1000, 'text');
      if (!text) throw fail(400, 'Type a message first.');
      if (!OPEN_STATUS(r.status)) throw fail(409, 'This report is closed. Use "Still broken" if it is not fixed.');
      writeReport(id, { awaitingStaff:1, lastActorRole:'student' }, true);
      addEvent(id, me, 'message', { text });
    } else {                                                        // 'ai': the optional campus assistant's note, once, right after the report is sent
      if (Date.now() - Date.parse(r.createdAt) > 15 * 60000) throw fail(409, 'Too late to add an assistant note.');
      if (get("SELECT 1 x FROM events WHERE reportId = ? AND type = 'ai'", id)) throw fail(409, 'The assistant note is already there.');
      const text = trimmed(b.text, 800, 'text');
      if (!text) throw fail(400, 'text is required');
      const fields = {};
      if (b.priority != null) {                                     // may raise an automatic priority, never lower it, never touch one staff set
        oneOf(b.priority, PRIORITIES, 'priority');
        if (r.prioritySource === 'auto' && PRIORITY_RANK[b.priority] < (PRIORITY_RANK[r.priority] ?? 2)) fields.priority = b.priority;
      }
      writeReport(id, fields, false);
      addEvent(id, SYSTEM, 'ai', { text, visibility:'staff' });
    }
    bump();
    return toReport(reportRow(id));
  });
}

/* ---------- Staff ---------- */
function staffUpdate(user, id, b) {
  const patch = b && b.patch && typeof b.patch === 'object' && !Array.isArray(b.patch) ? b.patch : {};
  for (const k of Object.keys(patch)) if (!['status', 'statusText', 'priority', 'category', 'categoryText', 'assigneeId', 'eta'].includes(k)) throw fail(400, 'cannot change ' + k);
  const rev = int(b && b.rev, 'rev');
  if (rev == null) throw fail(400, 'rev is required');
  const msg = trimmed(b.message, 1500, 'message'), note = trimmed(b.note, 1500, 'note');
  return tx(() => {
    const r = need(rawReport(id));
    if (r.rev !== rev) throw fail(409, 'Someone else just changed this ticket.', { current:toReport(reportRow(id)) });
    const me = actorOf(user), fields = {}, evs = [];

    let status = r.status, statusText = r.statusText || '';
    if ('status' in patch) {
      oneOf(patch.status, STATUSES, 'status');
      if (patch.status !== r.status && !STAFF_STATUSES.includes(patch.status)) throw fail(400, 'That status cannot be set by hand.');
      status = patch.status;
    }
    if (status === 'other') {
      statusText = ('statusText' in patch ? trimmed(patch.statusText, 60, 'statusText') : statusText).trim();
      if (!statusText) throw fail(400, 'Type the status so the student knows what is happening.');
    } else statusText = '';
    if (status !== r.status || statusText !== (r.statusText || '')) {
      if (status === 'resolved' && !msg) throw fail(400, 'Add a short message saying what was done.');
      if (status === 'waiting' && !msg) throw fail(400, 'Say what you are waiting for so the student knows.');
      fields.status = status; fields.statusText = statusText || null;
      evs.push(['status', { from:r.status === 'other' ? 'other:' + (r.statusText || '') : r.status, to:status === 'other' ? 'other:' + statusText : status }]);
      if (status === 'resolved') { fields.resolvedAt = now(); fields.confirmedAt = null; }
      else if (r.status === 'resolved') { fields.resolvedAt = null; fields.confirmedAt = null; }
    }

    /* Type first, because it decides who covers the ticket. */
    const curCat = CATEGORIES.includes(r.category) ? r.category : 'other';
    const cat = 'category' in patch ? oneOf(patch.category, CATEGORIES, 'category') : curCat;
    const catText = cat === 'other' ? ('categoryText' in patch ? trimmed(patch.categoryText, 60, 'categoryText') : (r.categoryText || '')).trim() : '';
    const catChanged = cat !== curCat || catText !== (r.categoryText || '');
    const covers = p => !!(p && p.setupDone && p.buildings.includes(r.building) && p.places.includes(r.area) && p.categories.includes(cat));
    const profileOf = uid => toProfile(get('SELECT * FROM worker_profiles WHERE userId = ?', uid));

    /* Who owns it. Taking or moving a ticket that belongs to someone else is for the assignee or a triage coordinator.
       An unassigned ticket can be taken by someone whose saved area covers it, or by a triage coordinator. */
    const cur = r.assigneeId || null;
    let want = cur, explicit = false;
    if (b.claim) {
      if (cur) throw fail(409, 'Someone else just took this ticket.', { current:toReport(reportRow(id)) });
      want = user.id; explicit = true;
    } else if ('assigneeId' in patch) { want = patch.assigneeId || null; explicit = true; }
    if (want !== cur) {
      if (cur && cur !== user.id && !user.isTriage) throw fail(403, 'This ticket is assigned to ' + (r.assigneeName || 'someone else') + '. Ask them, or a triage coordinator, to reassign it.');
      if (!cur && !user.isTriage && !covers(profileOf(user.id))) throw fail(403, 'This ticket is outside your saved area. A triage coordinator can assign it.');
      let name = null;
      if (want) {
        const u = get("SELECT * FROM users WHERE id = ? AND role = 'worker'", str(want, 200, 'assigneeId'));
        if (!u || !mayBeStaff(u.email)) throw fail(400, 'That person is not on the staff list.');
        name = u.name;
      }
      fields.assigneeId = want; fields.assigneeName = name;
      evs.push(['assigned', { from:r.assigneeName || null, to:name }]);
    }
    if ('priority' in patch && patch.priority !== r.priority) {
      oneOf(patch.priority, PRIORITIES, 'priority');
      fields.priority = patch.priority; fields.prioritySource = 'worker';
      evs.push(['priority', { from:r.priority, to:patch.priority, visibility:'staff' }]);
    }

    if (catChanged) {
      fields.category = cat; fields.categoryText = catText || null;
      evs.push(['category', { from:curCat === 'other' && r.categoryText ? 'other:' + r.categoryText : curCat, to:cat === 'other' && catText ? 'other:' + catText : cat, visibility:'staff' }]);
      // The new type may be another team's job. If the person holding it does not cover it, it goes back to that team's open list, and the history says so.
      if (!explicit && cur && cur !== user.id && !covers(profileOf(cur))) {
        fields.assigneeId = null; fields.assigneeName = null;
        evs.push(['assigned', { from:r.assigneeName || null, to:null, visibility:'staff',
          text:'Unassigned because the type is now ' + (cat === 'other' && catText ? catText : CAT_LABEL[cat]) + ' and ' + (r.assigneeName || 'the assignee') + ' does not cover it. It is back in the open list for the team that does.' }]);
      }
    }

    if ('eta' in patch) {
      const eta = patch.eta || null;
      if (eta !== null && (typeof eta !== 'string' || !validDay(eta))) throw fail(400, 'bad eta');
      if (eta !== (r.eta || null)) { fields.eta = eta; evs.push(['eta', { to:eta }]); }
    }
    if (msg) evs.push(['message', { text:msg }]);
    if (note) evs.push(['note', { text:note, visibility:'staff' }]);
    if (!evs.length) throw fail(400, 'Nothing to save yet. Change a field or add a message.');

    // Only an answer to the student ends "the student is waiting": a message, a status change or a planned date. An internal note, a priority,
    // a type or an assignment alone does not. Only student-visible events count as a staff update the student should be told about.
    const visible = evs.some(e => (e[1].visibility || 'public') !== 'staff');
    if (msg || 'status' in fields || 'eta' in fields) fields.awaitingStaff = 0;
    if (visible) fields.lastActorRole = 'worker';
    writeReport(id, fields, visible);
    for (const [type, o] of evs) addEvent(id, me, type, o);
    bump();
    return toReport(reportRow(id));
  });
}

function mergeReport(user, id, b) {
  const into = int(b && b.into, 'into'), rev = int(b && b.rev, 'rev');
  if (into == null || rev == null) throw fail(400, 'into and rev are required');
  return tx(() => {
    const r = need(rawReport(id)), o = need(rawReport(into), 'original report');
    if (o.id === r.id) throw fail(400, 'A ticket cannot be merged into itself.');
    if (r.rev !== rev) throw fail(409, 'Someone else just changed this ticket.', { current:toReport(reportRow(id)) });
    if (!OPEN_STATUS(r.status)) throw fail(409, 'This ticket is already closed.');
    if (!OPEN_STATUS(o.status)) throw fail(409, 'The other ticket is already closed.');
    const me = actorOf(user);
    writeReport(r.id, { status:'duplicate', statusText:null, dupOf:o.id, awaitingStaff:0, lastActorRole:'worker' }, true);
    addEvent(r.id, me, 'duplicate', { to:String(o.id) });
    writeReport(o.id, {}, false);
    addEvent(o.id, me, 'note', { text:'Report #' + r.id + ' (' + r.reporterName + ') described the same problem and was merged into this ticket.', visibility:'staff' });
    bump();
    return toReport(reportRow(r.id));
  });
}

function markDistinct(user, id, b) {
  const other = int(b && b.otherId, 'otherId');
  if (other == null) throw fail(400, 'otherId is required');
  return tx(() => {
    need(rawReport(id)); need(rawReport(other), 'other report');
    if (other === id) throw fail(400, 'A ticket is always the same as itself.');
    writeReport(id, {}, false);
    addEvent(id, actorOf(user), 'distinct', { to:String(other), visibility:'staff' });
    bump();
    return toReport(reportRow(id));
  });
}

/* ---------- Reading ---------- */
let staffList = { v:-1, rows:null };
function listReports(user) {
  // Every staff page asks for the same list after every change, so it is built once per change and shared.
  if (user.isStaff && staffList.v === version) return staffList.rows;
  const out = listReportsNow(user);
  if (user.isStaff) staffList = { v:version, rows:out };
  return out;
}
function listReportsNow(user) {
  // The newest LIST_LIMIT reports, oldest first. Past that, the oldest closed tickets drop out of the lists (they stay in the database).
  const rows = user.isStaff ? all(`SELECT * FROM (${SELECT_REPORT} ORDER BY r.id DESC LIMIT ${LIST_LIMIT}) ORDER BY id`)
    : all(`SELECT * FROM (${SELECT_REPORT} WHERE r.reporterId = ? ORDER BY r.id DESC LIMIT ${LIST_LIMIT}) ORDER BY id`, user.id);
  if (rows.length >= LIST_LIMIT && !listReportsNow.warned) { listReportsNow.warned = true; log('warn', 'report list is at its size limit; older reports are no longer listed', { limit:LIST_LIMIT }); }
  return rows.map(toReport);
}
function readReport(user, id) {
  const row = reportRow(id);
  if (!row || (!user.isStaff && row.reporterId !== user.id)) return null;
  const photo = get('SELECT data FROM report_photos WHERE reportId = ?', id);
  return { ...toReport(row), photo:photo ? photo.data : null };
}
function listEvents(user, id) {
  const row = get('SELECT reporterId FROM reports WHERE id = ?', id);
  if (!row || (!user.isStaff && row.reporterId !== user.id)) return null;
  return all(`SELECT * FROM events WHERE reportId = ? ${user.isStaff ? '' : "AND visibility = 'public'"} ORDER BY at, id`, id).map(toEvent);
}

/* ---------- Worker profiles ---------- */
const toProfile = row => row && ({ userId:row.userId, buildings:JSON.parse(row.buildings), places:JSON.parse(row.places),
  categories:JSON.parse(row.categories), setupDone:!!row.setupDone, updatedAt:row.updatedAt });
function cleanList(v, name, allowed) {
  if (!Array.isArray(v) || v.length > 200 || v.some(x => typeof x !== 'string' || x.length > 60)) throw fail(400, 'bad ' + name);
  const out = [...new Set(v)];
  for (const x of out) if (!allowed.has(x)) throw fail(400, 'Unknown ' + name.replace(/s$/, '') + ': ' + x);
  return out;
}
function saveProfile(userId, b) {
  if (!get('SELECT 1 x FROM users WHERE id = ?', userId)) throw fail(404, 'unknown user');
  const buildings = cleanList(b.buildings, 'buildings', new Set(Object.keys(LOCATIONS)));
  const areaIds = new Set(buildings.flatMap(c => Object.keys(LOCATIONS[c])));
  const places = cleanList(b.places, 'places', areaIds), categories = cleanList(b.categories, 'categories', new Set(CATEGORIES));
  run(`INSERT INTO worker_profiles (userId, buildings, places, categories, setupDone, updatedAt) VALUES (?,?,?,?,?,?)
       ON CONFLICT(userId) DO UPDATE SET buildings = excluded.buildings, places = excluded.places, categories = excluded.categories,
         setupDone = excluded.setupDone, updatedAt = excluded.updatedAt`,
    userId, JSON.stringify(buildings), JSON.stringify(places), JSON.stringify(categories), b.setupDone ? 1 : 0, now());
  bump();
  return toProfile(get('SELECT * FROM worker_profiles WHERE userId = ?', userId));
}
function listWorkers() {
  return all(`SELECT u.* FROM users u JOIN worker_profiles w ON w.userId = u.id WHERE u.role = 'worker' AND w.setupDone = 1 ORDER BY u.name`)
    .filter(u => mayBeStaff(u.email))
    .map(u => ({ user:toUser(u), profile:toProfile(get('SELECT * FROM worker_profiles WHERE userId = ?', u.id)) }));
}

/* ---------- Triage: reports no worker's saved area covers ---------- */
let triageCache = { v:-1, out:null };
function triageQueue(user) {
  if (!user.isTriage) throw fail(403, 'Only a triage coordinator can open this.');
  if (triageCache.v === version) return triageCache.out;
  const workers = listWorkers();
  const out = { noWorkers:workers.length === 0, unrouted:[], assignedElsewhere:[], historical:[] };
  for (const r of all("SELECT id, building, area, category, assigneeId FROM reports WHERE status NOT IN ('resolved', 'duplicate') ORDER BY id")) {
    if (!Object.hasOwn(LOCATIONS, r.building)) { out.historical.push(r.id); continue; }            // from a building outside the ten: kept, listed apart, never routed
    const cat = CATEGORIES.includes(r.category) ? r.category : 'other';
    const covering = workers.filter(w => w.profile.buildings.includes(r.building) && w.profile.places.includes(r.area) && w.profile.categories.includes(cat));
    if (r.assigneeId) { if (!covering.some(w => w.user.id === r.assigneeId)) out.assignedElsewhere.push(r.id); }   // held by someone whose saved area no longer matches
    else if (!covering.length) out.unrouted.push(r.id);
  }
  triageCache = { v:version, out };
  return out;
}

/* ---------- Admin: the staff list, backups ---------- */
function listStaff() {
  const rows = new Map();
  const add = (email, o) => rows.set(email, { email, isAdmin:false, isTriage:false, source:'table', addedBy:null, addedAt:null, ...(rows.get(email) || {}), ...o });
  for (const e of STAFF_EMAILS) add(e, { source:'setting' });
  for (const e of ADMIN_EMAILS) add(e, { source:'setting', isAdmin:true });
  for (const e of TRIAGE_EMAILS) add(e, { source:'setting', isTriage:true });
  for (const s of all('SELECT * FROM staff ORDER BY email')) { const cur = rows.get(s.email); add(s.email, { isAdmin:!!s.isAdmin || !!(cur && cur.isAdmin), isTriage:!!s.triage || !!(cur && cur.isTriage), addedBy:s.addedBy, addedAt:s.addedAt, source:cur ? 'setting' : 'table' }); }
  for (const r of rows.values()) { const u = get("SELECT name, lastLoginAt FROM users WHERE id = ?", 'worker:' + r.email); r.name = u ? u.name : null; r.lastLoginAt = u ? u.lastLoginAt : null; }
  return [...rows.values()].sort((a, b) => a.email.localeCompare(b.email));
}
function addStaff(user, b) {
  const email = String(b && b.email || '').trim().toLowerCase();
  if (!emailOk(email)) throw fail(400, 'Use an @' + ALLOWED_DOMAINS[0] + ' email address.');
  const isAdmin = b.isAdmin ? 1 : 0;
  if (ADMIN_EMAILS.includes(email) && !isAdmin) throw fail(400, 'That person is an admin set in the server settings.');
  const triage = b.isTriage ? 1 : 0;
  run(`INSERT INTO staff (email, isAdmin, triage, addedBy, addedAt) VALUES (?,?,?,?,?) ON CONFLICT(email) DO UPDATE SET isAdmin = excluded.isAdmin, triage = excluded.triage`, email, isAdmin, triage, user.email, now());
  audit('staff_set', user.id, email, (isAdmin ? 'admin' : 'staff') + (triage ? ' + triage' : ''));
  bump();
  return listStaff();
}
function removeStaff(user, emailRaw) {
  const email = String(emailRaw).trim().toLowerCase();
  if (email === user.email) throw fail(400, 'You cannot remove your own access.');
  if (ADMIN_EMAILS.includes(email) || STAFF_EMAILS.includes(email) || TRIAGE_EMAILS.includes(email)) throw fail(400, 'That person is set in the server settings. Change the setting to remove them.');
  if (!staffRow(email)) throw fail(404, 'not on the staff list');
  tx(() => {
    run('DELETE FROM staff WHERE email = ?', email);
    run("DELETE FROM sessions WHERE userId = ?", 'worker:' + email);                // signed out everywhere, right now
    const u = get('SELECT * FROM users WHERE id = ?', 'worker:' + email);
    if (u) for (const r of all("SELECT id, assigneeName FROM reports WHERE assigneeId = ? AND status NOT IN ('resolved','duplicate')", u.id)) {
      writeReport(r.id, { assigneeId:null, assigneeName:null }, true);              // their open tickets go back to the queue
      addEvent(r.id, { id:user.id, name:user.name, role:'worker' }, 'assigned', { from:r.assigneeName, to:null });
    }
    bump();
  });
  audit('staff_removed', user.id, email, null);
  return listStaff();
}

/* ---------- Backups ---------- */
function makeBackup(label) {
  const file = path.join(BACKUP_DIR, (label || 'backup') + '-' + stamp() + '.db');
  snapshot(file);
  return file;
}
function pruneBackups() {
  try {
    const files = fs.readdirSync(BACKUP_DIR).filter(f => /^scheduled-.*\.db$/.test(f)).sort();
    for (const f of files.slice(0, Math.max(0, files.length - BACKUP_KEEP))) fs.unlinkSync(path.join(BACKUP_DIR, f));
  } catch (e) { log('warn', 'could not prune backups', { error:e.message }); }
}
function scheduledBackup() {
  try { const f = makeBackup('scheduled'); pruneBackups(); log('info', 'backup written', { file:f }); return f; }
  catch (e) { log('error', 'backup failed', { error:e.message }); return null; }
}

/* ---------- Demo only: sample data and reset ---------- */
function seedRows(b) {
  for (const u of b.users || []) {
    run(`INSERT INTO users (id, role, email, name, createdAt, lastLoginAt) VALUES (?,?,?,?,?,?)
         ON CONFLICT(id) DO UPDATE SET email = excluded.email, name = excluded.name`,
      str(u.id, 200, 'id', true), oneOf(u.role, ['student', 'worker'], 'role'), str(u.email, 200, 'email', true), str(u.name, 120, 'name', true), str(u.createdAt, 40, 'createdAt') || now(), str(u.lastLoginAt, 40, 'lastLoginAt') || now());
  }
  for (const p of b.profiles || []) saveProfile(str(p.userId, 200, 'userId', true), p);
  for (const item of b.reports || []) {
    const r = item && item.report;
    if (!r || typeof r !== 'object') throw fail(400, 'report required');
    const t = now();
    const row = {
      createdAt:str(r.createdAt, 40, 'createdAt') || t, updatedAt:str(r.updatedAt, 40, 'updatedAt') || r.createdAt || t, publicAt:str(r.publicAt, 40, 'publicAt') || r.createdAt || t,
      reporterId:str(r.reporterId, 200, 'reporterId', true), reporterName:str(r.reporterName, 120, 'reporterName', true),
      building:str(r.building, 60, 'building', true), buildingName:str(r.buildingName, 120, 'buildingName'), area:str(r.area, 60, 'area', true), areaLabel:str(r.areaLabel, 120, 'areaLabel', true),
      unit:str(r.unit, 40, 'unit'), floor:str(r.floor, 40, 'floor'), detail:str(r.detail, 300, 'detail'),
      category:oneOf(r.category, CATEGORIES, 'category'), priority:oneOf(r.priority, PRIORITIES, 'priority'), prioritySource:oneOf(r.prioritySource || 'auto', ['auto', 'worker'], 'prioritySource'),
      status:oneOf(r.status || 'new', STATUSES, 'status'), description:str(r.description, 2000, 'description'), entry:r.entry ? oneOf(r.entry, ['ok', 'contact'], 'entry') : null,
      assigneeId:str(r.assigneeId, 200, 'assigneeId'), assigneeName:str(r.assigneeName, 120, 'assigneeName'), eta:r.eta && validDay(r.eta) ? r.eta : null, dupOf:int(r.dupOf, 'dupOf'),
      awaitingStaff:r.awaitingStaff ? 1 : 0, lastActorRole:r.lastActorRole ? oneOf(r.lastActorRole, ['student', 'worker'], 'lastActorRole') : null,
      resolvedAt:str(r.resolvedAt, 40, 'resolvedAt'), confirmedAt:str(r.confirmedAt, 40, 'confirmedAt'), categoryText:str(r.categoryText, 60, 'categoryText'), statusText:str(r.statusText, 60, 'statusText'),
      idemKey:null, rev:1
    };
    insertReport(row, item.events, null);
  }
}
function demoSeed(b) {
  return tx(() => {
    if (get('SELECT COUNT(*) c FROM users').c || get('SELECT COUNT(*) c FROM reports').c) return { seeded:false };
    seedRows(b || {}); bump(); return { seeded:true };
  });
}
function demoReset(user, b) {
  return tx(() => {
    for (const t of ['events', 'report_photos', 'reports', 'worker_profiles']) run('DELETE FROM ' + t);
    run('DELETE FROM users WHERE id NOT IN (SELECT userId FROM sessions)');
    run("DELETE FROM sqlite_sequence WHERE name IN ('reports','events')");
    seedRows(b || {});
    ensureUser(user.role, user.email, user.name);
    audit('demo_reset', user.id, null, null);
    bump();
    return { reset:true };
  });
}

if (MIGRATED.to > MIGRATED.from) {
  log('info', 'database ready', { schemaFrom:MIGRATED.from, schemaTo:MIGRATED.to, backup:MIGRATED.backup, convertedReports:LEGACY_DONE.reports, convertedProfiles:LEGACY_DONE.profiles });
}

/* =====================================================================
   HTTP
   ===================================================================== */
const STATIC = {
  '/': ['index.html', 'text/html; charset=utf-8'], '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8'], '/styles.css': ['styles.css', 'text/css; charset=utf-8']
};
const G = 'https://accounts.google.com/gsi/';
const CSP = "default-src 'self'; script-src 'self'" + (GOOGLE_CLIENT_ID ? ' ' + G + 'client' : '') +
  "; style-src 'self'" + (GOOGLE_CLIENT_ID ? ' ' + G + 'style' : '') + "; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'" + (GOOGLE_CLIENT_ID ? ' ' + G : '') +
  (GOOGLE_CLIENT_ID ? '; frame-src ' + G : "; frame-src 'none'") + "; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'self'";
const fileCache = new Map();
function readStatic(name) {
  const file = path.join(__dirname, name), st = fs.statSync(file), hit = fileCache.get(name);
  if (hit && hit.mtime === st.mtimeMs) return hit;
  const body = fs.readFileSync(file), entry = { mtime:st.mtimeMs, body, etag:'"' + sha(body).slice(0, 20) + '"' };
  fileCache.set(name, entry);
  return entry;
}

function corsHeaders(req, res) {
  const origin = req.headers.origin;
  if (!origin || !ALLOW_ORIGINS.length) return false;
  if (ALLOW_ORIGINS.includes('*') || ALLOW_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGINS.includes('*') ? '*' : origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Expose-Headers', 'X-Version, Retry-After');
    res.setHeader('Access-Control-Max-Age', '600');
    return true;
  }
  return false;
}
// Big answers (the ticket lists) are compressed when the browser accepts it: about a tenth of the size on a phone connection.
// An answer that is the very same object as last time (the shared staff list) is encoded once, not once per page.
const encoded = new WeakMap();
function send(res, status, body, type, extraHeaders) {
  res.setHeader('X-Version', String(version));
  const headers = { 'Content-Type':type || 'application/json; charset=utf-8', 'Cache-Control':'no-store', ...(extraHeaders || {}) };
  const obj = body !== null && typeof body === 'object' && !Buffer.isBuffer(body);
  let e = obj ? encoded.get(body) : null;
  if (!e) { e = { plain:Buffer.isBuffer(body) || typeof body === 'string' ? Buffer.from(body) : Buffer.from(JSON.stringify(body)), gz:null }; if (obj) encoded.set(body, e); }
  const v = res.getHeader('Vary'); res.setHeader('Vary', v ? v + ', Accept-Encoding' : 'Accept-Encoding');
  let out = e.plain;
  if (out.length > 1024 && /\bgzip\b/.test(String(res.req && res.req.headers['accept-encoding'] || ''))) {
    if (!e.gz) e.gz = zlib.gzipSync(e.plain, { level:4 });
    out = e.gz; headers['Content-Encoding'] = 'gzip';
  }
  headers['Content-Length'] = out.length;
  res.writeHead(status, headers);
  res.end(res.req && res.req.method === 'HEAD' ? undefined : out);
}
function readJson(req) {
  return new Promise((resolve, reject) => {
    if (Number(req.headers['content-length']) > MAX_BODY) { req.resume(); return reject(fail(413, 'That is too large to send.')); }
    let size = 0, tooBig = false; const chunks = [];
    req.on('data', c => {
      if (tooBig) return;                               // keep draining so the 413 can be sent back on the same connection
      size += c.length;
      if (size > MAX_BODY) { tooBig = true; chunks.length = 0; reject(fail(413, 'That is too large to send.')); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (tooBig) return;
      if (!chunks.length) return resolve({});
      try { const j = JSON.parse(Buffer.concat(chunks).toString('utf8')); resolve(j && typeof j === 'object' && !Array.isArray(j) ? j : {}); }
      catch { reject(fail(400, 'invalid JSON')); }
    });
    req.on('error', reject);
  });
}

const needRole = (ctx, ...roles) => {
  if (!ctx.user) throw ctx.authErr || fail(401, 'Please sign in.');
  for (const r of roles) {
    if (r === 'staff' && ctx.user.isStaff) return;
    if (r === 'student' && ctx.user.role === 'student') return;
    if (r === 'admin' && ctx.user.isAdmin) return;
  }
  throw fail(403, 'You do not have access to that.');
};
const authLimit = (req, extra) => {
  const w = limited('auth:' + clientIp(req), 60, 600000) || (extra ? limited('auth:e:' + extra, 12, 600000) : 0);
  if (w) throw tooMany(w);
};
const roleOf = v => oneOf(v, ['student', 'worker'], 'role');
const emailOf = v => { const e = String(v == null ? '' : v).trim().toLowerCase(); if (!emailOk(e)) throw fail(400, 'Use your @' + ALLOWED_DOMAINS[0] + ' email address.'); return e; };

/* Each route: [method, pattern, handler]. Public routes check nothing; the others call needRole first. */
const ROUTES = [
  ['GET', /^\/healthz$|^\/api\/health$/, () => { get('SELECT 1 x'); return { ok:true, build:BUILD, uptime:Math.round(process.uptime()), v:version }; }],
  ['GET', /^\/api\/version$/, () => ({ eaiser:true, v:version })],
  ['GET', /^\/api\/config$/, () => ({ eaiser:true, build:BUILD, v:version, demo:DEMO_AUTH, google:GOOGLE_CLIENT_ID || null, emailCode:EMAIL_CODE, domains:ALLOWED_DOMAINS })],
  ['GET', /^\/api\/locations$/, () => LOCATIONS],

  ['POST', /^\/api\/auth\/google$/, async c => {
    authLimit(c.req);
    const g = await verifyGoogleToken(c.body.credential);
    return signIn(roleOf(c.body.role), g.email, g.name, c.req);
  }],
  ['POST', /^\/api\/auth\/email\/start$/, async c => startEmailCode(emailOf(c.body.email), c.req)],
  ['POST', /^\/api\/auth\/email\/verify$/, c => {
    const email = emailOf(c.body.email); authLimit(c.req, email);
    const role = roleOf(c.body.role);
    assertMayUse(role, email);                                       // before the code is checked, so a wrong button does not use the code up
    const who = checkEmailCode(email, c.body.code);
    return signIn(role, who.email, who.name, c.req);
  }],
  ['POST', /^\/api\/auth\/demo$/, c => {
    if (!DEMO_AUTH) throw fail(404, 'not found');
    const email = emailOf(c.body.email); authLimit(c.req, email);
    return signIn(roleOf(c.body.role), email, nameFromEmail(email), c.req);
  }],
  ['POST', /^\/api\/auth\/logout$/, c => {
    if (c.user) { run('DELETE FROM sessions WHERE id = ?', c.user.sessionId); audit('signout', c.user.id, null, null); }
    return { ok:true };
  }],
  ['GET', /^\/api\/me$/, c => {
    needRole(c, 'student', 'staff');
    return { user:toUser(get('SELECT * FROM users WHERE id = ?', c.user.id)), isAdmin:c.user.isAdmin, isTriage:c.user.isTriage, demo:DEMO_AUTH,
      profile:c.user.isStaff ? toProfile(get('SELECT * FROM worker_profiles WHERE userId = ?', c.user.id)) : null };
  }],

  ['GET', /^\/api\/reports$/, c => { needRole(c, 'student', 'staff'); return listReports(c.user); }],
  ['POST', /^\/api\/reports$/, c => { needRole(c, 'student'); return createReport(c.user, c.body); }],
  ['GET', /^\/api\/reports\/(\d+)$/, c => { needRole(c, 'student', 'staff'); return readReport(c.user, Number(c.m[1])); }],
  ['GET', /^\/api\/reports\/(\d+)\/events$/, c => { needRole(c, 'student', 'staff'); const e = listEvents(c.user, Number(c.m[1])); if (!e) throw fail(404, 'report not found'); return e; }],
  ['POST', /^\/api\/reports\/(\d+)\/actions$/, c => { needRole(c, 'student'); return studentAction(c.user, Number(c.m[1]), c.body); }],
  ['PATCH', /^\/api\/reports\/(\d+)$/, c => { needRole(c, 'staff'); return staffUpdate(c.user, Number(c.m[1]), c.body); }],
  ['POST', /^\/api\/reports\/(\d+)\/merge$/, c => { needRole(c, 'staff'); return mergeReport(c.user, Number(c.m[1]), c.body); }],
  ['POST', /^\/api\/reports\/(\d+)\/distinct$/, c => { needRole(c, 'staff'); return markDistinct(c.user, Number(c.m[1]), c.body); }],

  ['GET', /^\/api\/triage$/, c => { needRole(c, 'staff'); return triageQueue(c.user); }],
  ['GET', /^\/api\/workers$/, c => { needRole(c, 'staff'); return listWorkers(); }],
  ['GET', /^\/api\/profiles\/(.+)$/, c => { needRole(c, 'staff'); return toProfile(get('SELECT * FROM worker_profiles WHERE userId = ?', dec(c.m[1]))) || null; }],
  ['PUT', /^\/api\/profiles\/(.+)$/, c => {
    needRole(c, 'staff');
    if (dec(c.m[1]) !== c.user.id) throw fail(403, 'You can only change your own area.');
    const p = saveProfile(c.user.id, c.body);
    audit('profile_saved', c.user.id, null, p.buildings.length + ' buildings, ' + p.places.length + ' places');
    return p;
  }],

  ['GET', /^\/api\/staff$/, c => { needRole(c, 'admin'); return listStaff(); }],
  ['PUT', /^\/api\/staff$/, c => { needRole(c, 'admin'); return addStaff(c.user, c.body); }],
  ['DELETE', /^\/api\/staff\/(.+)$/, c => { needRole(c, 'admin'); return removeStaff(c.user, dec(c.m[1])); }],
  ['GET', /^\/api\/admin\/audit$/, c => { needRole(c, 'admin'); return all('SELECT * FROM audit_log ORDER BY id DESC LIMIT 200'); }],
  ['POST', /^\/api\/admin\/backup$/, c => { needRole(c, 'admin'); const f = makeBackup('manual'); audit('backup', c.user.id, path.basename(f), null); return { file:path.basename(f), bytes:fs.statSync(f).size }; }],
  ['GET', /^\/api\/admin\/backup\/download$/, c => {
    needRole(c, 'admin');
    const f = path.join(os.tmpdir(), 'spartanfix-download-' + crypto.randomBytes(6).toString('hex') + '.db');
    snapshot(f); audit('backup_download', c.user.id, null, null);
    c.res.setHeader('Content-Disposition', 'attachment; filename="spartanfix-' + stamp() + '.db"');
    return { __file:f };
  }],

  ['POST', /^\/api\/demo\/seed$/, c => { if (!DEMO_AUTH) throw fail(404, 'not found'); return demoSeed(c.body); }],
  ['POST', /^\/api\/demo\/reset$/, c => { if (!DEMO_AUTH) throw fail(404, 'not found'); needRole(c, 'staff'); return demoReset(c.user, c.body); }]
];

const server = http.createServer(async (req, res) => {
  const started = Date.now();
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  if (PRODUCTION) res.setHeader('Strict-Transport-Security', 'max-age=15552000');
  const cors = corsHeaders(req, res);
  let status = 500, who = null, p = '';
  res.on('finish', () => {
    status = res.statusCode;
    if (p === '/api/version' || p === '/healthz') return;
    log(status >= 500 ? 'error' : 'info', 'request', { m:req.method, p, s:status, ms:Date.now() - started, u:who, ip:clientIp(req) });
  });
  try {
    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
    p = new URL(req.url, 'http://localhost').pathname;
    const asset = req.method === 'GET' || req.method === 'HEAD' ? STATIC[p] : undefined;
    if (asset) {
      let f;
      try { f = readStatic(asset[0]); }
      catch (e) { if (e.code === 'ENOENT') throw fail(404, asset[0] + ' is missing. Keep index.html, app.js and styles.css next to server.js.'); throw e; }
      if (asset[1].startsWith('text/html')) res.setHeader('Content-Security-Policy', CSP);
      if (req.headers['if-none-match'] === f.etag) { res.writeHead(304, { ETag:f.etag, 'Cache-Control':'no-cache' }); return res.end(); }
      const h = { 'Content-Type':asset[1], ETag:f.etag, 'Cache-Control':'no-cache' };
      if (!f.gz) f.gz = zlib.gzipSync(f.body, { level:9 });          // compressed once per file version
      const v = res.getHeader('Vary'); res.setHeader('Vary', v ? v + ', Accept-Encoding' : 'Accept-Encoding');
      const zipped = /\bgzip\b/.test(String(req.headers['accept-encoding'] || ''));
      if (zipped) h['Content-Encoding'] = 'gzip';
      const out = zipped ? f.gz : f.body;
      h['Content-Length'] = out.length;
      res.writeHead(200, h);
      return res.end(req.method === 'HEAD' ? undefined : out);
    }
    if (req.method === 'GET' && p === '/favicon.ico') { res.writeHead(204); return res.end(); }
    if (!p.startsWith('/api/') && p !== '/healthz') return send(res, 404, { error:'not found' });

    // Everyone is limited, signed in or not. Signed-in people are counted by account, so a shared campus address is not punished for its neighbours.
    let user = null, authErr = null;
    try { user = authenticate(req); } catch (e) { if (e.status !== 401) throw e; authErr = e; }   // a stale token only matters on routes that need a person
    who = user ? user.id : null;
    if (p !== '/api/version') { const w = limited(user ? 'u:' + user.id : 'ip:' + clientIp(req), user ? 600 : 240, 60000); if (w) throw tooMany(w); }

    let m = null;
    const route = ROUTES.find(r => r[0] === req.method && (m = r[1].exec(p)));
    if (!route) return send(res, 404, { error:'not found' });
    const body = req.method === 'GET' || req.method === 'DELETE' ? {} : await readJson(req);
    const out = await route[2]({ req, res, user, authErr, body, m, p });
    if (out && out.__file) {
      const size = fs.statSync(out.__file).size;
      res.writeHead(200, { 'Content-Type':'application/octet-stream', 'Content-Length':size, 'Cache-Control':'no-store', 'Content-Disposition':res.getHeader('Content-Disposition') });
      const s = fs.createReadStream(out.__file);
      s.on('close', () => fs.unlink(out.__file, () => {}));
      return s.pipe(res);
    }
    if (out === null && req.method === 'GET') return send(res, 404, { error:'not found' });
    send(res, 200, out === undefined ? { ok:true } : out);
  } catch (e) {
    if (!e.status) log('error', 'unhandled', { m:req.method, p, error:e.stack || String(e) });
    const headers = e.extra && e.extra.retryAfter ? { 'Retry-After':String(e.extra.retryAfter) } : undefined;
    if (!res.headersSent) send(res, e.status || 500, { error:e.status ? e.message : 'Something went wrong on the server. Please try again.', ...(e.extra || {}) }, undefined, headers);
    else res.end();
  }
});
server.requestTimeout = 30000; server.headersTimeout = 15000; server.keepAliveTimeout = 5000;

/* =====================================================================
   Start, stop
   ===================================================================== */
let timers = [];
function start() {
  server.on('error', e => {
    if (e.code === 'EADDRINUSE') log('error', `Port ${PORT} is already in use. Close the other server, or run it on another port: PORT=3001 node server.js`);
    else log('error', 'server error', { error:String(e) });
    process.exit(1);
  });
  for (const f of ['index.html', 'app.js', 'styles.css']) if (!fs.existsSync(path.join(__dirname, f))) log('warn', f + ' is not next to server.js');
  server.listen(PORT, HOST, () => {
    const lines = [`SpartanFix ${BUILD} is running. Database: ${DB_FILE}`, `  This computer:  http://localhost:${PORT}`,
      '  Sign-in:        ' + [GOOGLE_CLIENT_ID && 'Google', EMAIL_CODE && 'email code', DEMO_AUTH && 'DEMO (anyone can sign in as anyone)'].filter(Boolean).join(', ')];
    if (HOST === '0.0.0.0' || HOST === '::') {
      for (const list of Object.values(os.networkInterfaces())) for (const n of list || []) if (n.family === 'IPv4' && !n.internal) lines.push(`  Same Wi-Fi:     http://${n.address}:${PORT}`);
    } else if (HOST === '127.0.0.1') lines.push('  Only this computer can reach it. For a phone on your Wi-Fi: HOST=0.0.0.0 node server.js');
    for (const l of lines) console.log(l);
    if (!DEMO_AUTH && !ADMIN_EMAILS.length && !STAFF_EMAILS.length && !all('SELECT 1 x FROM staff LIMIT 1').length) log('warn', 'No staff are set up yet. Set ADMIN_EMAILS (comma list) so someone can sign in as staff.');
    if (DEMO_AUTH && HOST !== '127.0.0.1') log('warn', 'DEMO sign-in is on and the server is open to the network: anyone who can reach it can read and change everything.');
  });
  timers = [setInterval(housekeeping, 36e5), setInterval(scheduledBackup, BACKUP_EVERY_MS)];
  timers.forEach(t => t.unref());
  housekeeping();
  try {                                                   // a server that restarts often must still back up
    const last = fs.existsSync(BACKUP_DIR) ? fs.readdirSync(BACKUP_DIR).filter(f => /^scheduled-/.test(f)).sort().pop() : null;
    if (!last || Date.now() - fs.statSync(path.join(BACKUP_DIR, last)).mtimeMs > BACKUP_EVERY_MS) setTimeout(scheduledBackup, 2000).unref();
  } catch (e) { log('warn', 'backup check failed', { error:e.message }); }
}
let stopping = false;
function stop(signal) {
  if (stopping) return; stopping = true;
  log('info', 'shutting down', { signal });
  timers.forEach(clearInterval);
  const done = () => { try { db.exec('PRAGMA wal_checkpoint(TRUNCATE)'); db.close(); } catch (e) { log('warn', 'close failed', { error:e.message }); } process.exit(0); };
  server.close(done);
  server.closeIdleConnections();
  setTimeout(() => { server.closeAllConnections(); done(); }, 8000).unref();
}
if (require.main === module) {
  process.on('SIGTERM', () => stop('SIGTERM')); process.on('SIGINT', () => stop('SIGINT'));
  process.on('unhandledRejection', e => log('error', 'unhandled rejection', { error:String(e && e.stack || e) }));
  process.on('uncaughtException', e => { log('error', 'uncaught exception', { error:String(e && e.stack || e) }); process.exit(1); });
  start();
}
module.exports = { server, db, start, stop, cleanJpegDataUrl, LOCATIONS, BUILD, scheduledBackup, housekeeping };
