'use strict';

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

/* =====================================================================
   1. Campus data (buildings, places, issue types, statuses)
   ===================================================================== */
const BUILDINGS = [
  { code:'CVA', name:'Campus Village A',             type:'dorm', group:'Residence halls', alias:['cva', 'campus village a'] },
  { code:'CVB', name:'Campus Village B',             type:'dorm', group:'Residence halls', alias:['cvb', 'campus village b'] },
  { code:'CVC', name:'Campus Village C',             type:'dorm', group:'Residence halls', alias:['cvc', 'campus village c'] },
  { code:'CV2', name:'Campus Village 2',             type:'dorm', group:'Residence halls', alias:['cv2', 'campus village 2'] },
  { code:'Joe West', name:'Joe West Hall',           type:'dorm', group:'Residence halls', alias:['jw', 'jwh', 'joe west', 'joe west hall'] },
  { code:'Washburn', name:'Washburn Hall',           type:'dorm', group:'Residence halls', alias:['wsh', 'washburn', 'washburn hall'], noElevator:true },
  { code:'SVP', name:'Spartan Village on the Paseo', type:'dorm', group:'Residence halls', alias:['svp', 'spartan village', 'spartan village on the paseo'] },
  // The codes of the three study buildings are the keys already stored in the database, so they stay. Only what is shown changes.
  { code:'Macquarrie Hall', name:'MacQuarrie Hall',  type:'academic', group:'Study buildings', alias:['mh', 'macquarrie', 'macquarrie hall'] },
  { code:'Sweeney Building', name:'Sweeney Hall',    type:'academic', group:'Study buildings', alias:['sh', 'sweeney', 'sweeney hall', 'sweeney building'] },
  { code:'Clarke Hall', name:'Clark Hall',           type:'academic', group:'Study buildings', alias:['cl', 'clark', 'clark hall', 'clarke', 'clarke hall'] }
];
// What the page shows for a building: the code for a residence hall (CVA), the full name for a study building (MacQuarrie Hall).
const bShort = x => { const b = typeof x === 'string' ? BUILDINGS.find(y => y.code === x) : x; return b ? (b.type === 'dorm' ? b.code : b.name) : String(x == null ? '' : x); };
const bFull = x => { const b = typeof x === 'string' ? BUILDINGS.find(y => y.code === x) : x; return b ? b.name : String(x == null ? '' : x); };
// One matcher for the search box, Enter-to-select, the location helper and the SDK. Letters and digits only, so "cv 2", "CV2" and "campus village 2" agree.
const norm = t => String(t).toLowerCase().replace(/[^a-z0-9]/g, '');
const aliasNorm = b => b.alias.map(norm);
// Exact alias first ("sh" is Sweeney Hall, not Washburn); only when nothing is exact do longer typing and partial names match.
function searchBuildings(q) {
  const nq = norm(q);
  if (!nq) return BUILDINGS.map((b, i) => i);
  const exact = BUILDINGS.map((b, i) => i).filter(i => aliasNorm(BUILDINGS[i]).includes(nq) || norm(BUILDINGS[i].code) === nq);
  if (exact.length) return exact;
  const starts = BUILDINGS.map((b, i) => i).filter(i => aliasNorm(BUILDINGS[i]).some(a => a.startsWith(nq) && nq.length >= 2));
  if (starts.length) return starts;
  const group = ['study', 'studybuilding', 'studybuildings', 'academic'].includes(nq) ? 'academic' : ['dorm', 'dorms', 'residence', 'residencehall', 'residencehalls'].includes(nq) ? 'dorm' : null;
  if (group) return BUILDINGS.map((b, i) => i).filter(i => BUILDINGS[i].type === group);       // browsing a whole group; never used to pick a building for a sentence
  return nq.length >= 3 ? BUILDINGS.map((b, i) => i).filter(i => aliasNorm(BUILDINGS[i]).some(a => a.includes(nq))) : [];
}
// A building named inside a sentence: whole words only, and two different buildings named means no answer.
function findBuildingInText(text) {
  const t = ' ' + String(text).toLowerCase().replace(/[^a-z0-9]+/g, ' ') + ' ';
  const found = [];
  BUILDINGS.forEach((b, i) => {
    const best = b.alias.map(a => a.replace(/[^a-z0-9]+/g, ' ')).filter(a => t.includes(' ' + a + ' ')).sort((x, y) => y.length - x.length)[0];
    if (best) found.push({ i, len: best.length });
  });
  return found.length === 1 ? found[0].i : -1;                              // two buildings named (one may be only a landmark): the student chooses
}
const buildingByCode = code => BUILDINGS.find(b => b.code === code);

/* ---------- Places ----------
   Every building has its own list, because the spaces differ: a Campus Village A bathroom is inside an apartment and may be
   shared with apartmentmates, a Campus Village 2 bathroom is shared by a whole floor, and so on.
   g = which group the place sits in on the "Where is the problem?" screen:
     mine   inside my room or unit (it may still be shared with roommates, apartmentmates or suitemates)
     shared a shared space on a floor or in the building
     common building and common areas
     rooms  rooms and spaces in a study building
   unit / floor / detail say what the person must tell us so staff can find the spot (req:true = required).
   kw = strong words (the Ask AI guesses a place only when exactly one place matches strongly), kw2 = weak words
   (only used when nothing matches strongly and exactly one place matches). */
const GROUP_LABEL = { mine:'Inside my room or unit', shared:'Shared spaces', common:'Building and common areas', rooms:'Rooms and spaces' };
const GENERIC = ['electrical', 'hvac', 'structure', 'furniture', 'cleaning', 'plumbing', 'other'];
const MINE_PHOTO = 'Photograph only the damaged item. Keep roommates, apartmentmates, suitemates and personal belongings out of frame.';
const TPL = {
  room:      { label:'Room', short:'Room / unit', kw:/\bbed\b|bedroom|my room|dorm room|closet|mattress/i, kw2:/\bdesks?\b|\bac\b|air ?condition|heater|window|outlet/i,
               cats:['electrical', 'hvac', 'structure', 'furniture', 'plumbing', 'cleaning', 'other'], photoNote:MINE_PHOTO },
  bathroom:  { label:'Bathroom', short:'Bathroom / restroom', noPhoto:true, kw:/toilet|shower|bath ?room|restroom|urinal|bath ?tub/i, kw2:/\bsinks?\b|drain|faucet/i,
               cats:['plumbing', 'electrical', 'hvac', 'structure', 'cleaning', 'other'] },
  unitkitchen:{ label:'Kitchen', short:'Kitchen in my unit', kw:/kitchen|stove|oven|microwave|fridge|refrigerator|burner|dishwasher/i, kw2:/\bsinks?\b|cabinet|disposal/i,
               cats:['furniture', 'plumbing', 'electrical', 'hvac', 'structure', 'cleaning', 'other'], photoNote:MINE_PHOTO },
  living:    { label:'Living / dining area', short:'Living / dining area', kw:/living (room|area)|dining (room|table|area)/i,
               cats:['furniture', 'electrical', 'hvac', 'structure', 'cleaning', 'other'], photoNote:MINE_PHOTO },
  unitlaundry:{ label:'Washer / dryer in my unit', short:'Washer / dryer in my unit', kw:/\b(washers?|dryers?|laundry)\b/i,
               cats:['laundry', 'plumbing', 'electrical', 'cleaning', 'other'], photoNote:MINE_PHOTO },
  study:     { label:'Study area', short:'Study area / room', kw:/study|studying/i, cats:['furniture', 'electrical', 'hvac', 'structure', 'cleaning', 'other'] },
  lounge:    { label:'Common lounge', short:'Lounge', kw:/lounge|\btv\b|couch|ping ?pong|pool table|foosball|game room/i, cats:['furniture', 'electrical', 'hvac', 'structure', 'cleaning', 'other'] },
  kitchen:   { label:'Community kitchen', short:'Community kitchen', kw:/kitchen(?!ette)|stove|oven|microwave|fridge|refrigerator|burner|dishwasher/i, kw2:/\bsinks?\b|cabinet|disposal/i,
               cats:['furniture', 'plumbing', 'electrical', 'hvac', 'structure', 'cleaning', 'other'] },
  laundry:   { label:'Laundry room', short:'Laundry room', kw:/\b(washers?|dryers?|laundry)\b/i, cats:['laundry', 'plumbing', 'electrical', 'cleaning', 'other'],
               photoNote:'Photograph only the machine or damage. Keep other people and their clothes out of frame.' },
  hallway:   { label:'Hallway / corridor', short:'Hallway', kw:/hallway|corridor/i, cats:['electrical', 'structure', 'hvac', 'plumbing', 'cleaning', 'other'] },
  stairs:    { label:'Stairs / stairwell', short:'Stairs', kw:/stairs?\b|stairwell|staircase/i, cats:['structure', 'electrical', 'cleaning', 'other'] },
  elevator:  { label:'Elevator', short:'Elevator', kw:/elevator|\blift\b/i, cats:['structure', 'electrical', 'cleaning', 'other'] },
  lobby:     { label:'Entrance / lobby', short:'Entrance / lobby', kw:/lobby|entrance|front door|card reader|door reader/i, cats:['structure', 'electrical', 'hvac', 'furniture', 'cleaning', 'other'] },
  outside:   { label:'Outside / building approach', short:'Outside', kw:/sidewalk|outside|courtyard|parking|patio/i, cats:['structure', 'electrical', 'cleaning', 'other'] },
  mail:      { label:'Mailbox / package area', short:'Mail / packages', kw:/mail|package|parcel/i, cats:['structure', 'electrical', 'furniture', 'cleaning', 'other'] },
  trash:     { label:'Trash / recycling area', short:'Trash / recycling', kw:/trash|garbage|recycl|dumpster/i, cats:['cleaning', 'structure', 'other'] },
  desk:      { label:'Courtesy desk', short:'Courtesy / front desk', kw:/courtesy desk|front desk|reception/i, cats:['furniture', 'electrical', 'structure', 'cleaning', 'other'] },
  bike:      { label:'Bike enclosure', short:'Bike enclosure', kw:/\bbikes?\b|bike (cage|enclosure|rack)/i, cats:['structure', 'electrical', 'cleaning', 'other'] },
  activity:  { label:'Activity area', short:'Activity area', kw:/activity (area|room)/i, cats:['furniture', 'electrical', 'hvac', 'structure', 'cleaning', 'other'] },
  gametv:    { label:'Game / TV room', short:'Game / TV room', kw:/game room|tv room|\btv\b|ping ?pong|pool table|foosball/i, cats:['furniture', 'electrical', 'hvac', 'structure', 'cleaning', 'other'] },
  fitness:   { label:'Fitness room', short:'Fitness room', kw:/fitness|gym|treadmill|weights?\b/i, cats:['furniture', 'electrical', 'hvac', 'structure', 'cleaning', 'other'] },
  dining:    { label:'Dining area / cafeteria', short:'Dining area', kw:/dining|cafeteria/i, cats:['furniture', 'electrical', 'hvac', 'structure', 'cleaning', 'plumbing', 'other'] },
  rac:       { label:'Recreation center (RAC) / game area', short:'Recreation center (RAC)', kw:/\brac\b(?! (meeting|study))|recreation|game area/i, cats:GENERIC },
  racrooms:  { label:'RAC meeting / study room', short:'RAC meeting / study room', kw:/\brac (meeting|study)|meeting room/i, cats:GENERIC },
  lab:       { label:'Computer lab', short:'Computer lab', kw:/\blab\b|computer lab/i, cats:['electrical', 'hvac', 'structure', 'furniture', 'cleaning', 'other'],
               photoNote:'Photograph only the equipment. Keep screens, other people and their belongings out of frame.' },
  hub:       { label:'Spartan Study Hub', short:'Spartan Study Hub', kw:/spartan (study )?hub|study hub/i, cats:GENERIC },
  market:    { label:'Village Market', short:'Village Market', kw:/village market|\bmarket\b/i, cats:GENERIC },
  office:    { label:'Housing Office visitor area', short:'Housing Office visitor area', kw:/housing office|visitor area/i, cats:GENERIC },
  multi:     { label:'Multi-purpose room', short:'Multi-purpose room', kw:/multi-?purpose/i, cats:GENERIC },
  classroom: { label:'Classroom', short:'Classroom', kw:/classroom|whiteboard|lecture|\bchairs?\b/i, kw2:/projector|desktop|computer|charger/i,
               cats:['furniture', 'electrical', 'hvac', 'structure', 'cleaning', 'other'] },
  other:     { label:'Other place', short:'Other place', hint:'Not on this list. You will say where.', kw:null }
};
const UNIT = (label, word, hint) => ({ label, word, hint, req:true });
const FLOOR_REQ = { label:'Floor', req:true }, FLOOR_OPT = { label:'Floor (if you know it)', req:false };
const DETAIL_BATH = { label:'Wing, bathroom number or a landmark nearby', ph:'e.g. east wing, by room 412', req:true };
// Words must start where a word starts: "sparking" is not "parking". Plumbing (a leak) and technology problems can be reported from any place.
const wordStart = re => (re && !re.__ws) ? Object.assign(new RegExp('\\b(?:' + re.source + ')', re.flags), { __ws:true }) : re;
const widenCats = cats => { const out = cats.filter(c => c !== 'other'); for (const c of ['plumbing', 'tech']) if (!out.includes(c)) out.push(c); out.push('other'); return out; };
const A = (id, g, o) => {
  const a = Object.assign({ id, g, unit:null, floor:null, detail:{ label:'Anything else that helps staff find it', ph:'e.g. near the south door', req:false } }, TPL[id], o || {});
  a.kw = wordStart(a.kw); a.kw2 = wordStart(a.kw2);
  if (a.cats) a.cats = widenCats(a.cats);
  a.entry = g === 'mine';                                   // "okay to enter if I am not there" only for the person's own room or unit
  if (id === 'other') a.detail = { label:'Where is it? Building area, floor, room or landmark', ph:'e.g. patio behind the dining area', req:true };
  return a;
};
const aptUnit = UNIT('Apartment number', 'Apt', 'The number on your apartment door');
const suiteUnit = UNIT('Suite number', 'Suite', 'The number on your suite door');
const roomUnit = UNIT('Room number', 'Room');
const DORM_TAIL = [A('hallway', 'common', { floor:FLOOR_REQ }), A('stairs', 'common', { floor:FLOOR_OPT }), A('elevator', 'common', { floor:FLOOR_OPT }),
                   A('lobby', 'common'), A('outside', 'common'), A('other', 'common')];
const noElev = list => list.filter(a => a.id !== 'elevator');
const sharedBath = () => A('bathroom', 'shared', { label:'Shared bathroom / shower', hint:'Shared with your floor or wing', floor:FLOOR_REQ, detail:DETAIL_BATH });

const BUILDING_AREAS = {
  CVA: [
    A('room', 'mine', { label:'Bedroom / efficiency room', unit:UNIT('Apartment and room number', 'Apt') }),
    A('bathroom', 'mine', { label:'Apartment bathroom', hint:'May be shared with your apartmentmates', unit:aptUnit,
      detail:{ label:'Which bathroom or fixture?', ph:'e.g. second bathroom, tub drain', req:false } }),
    A('unitkitchen', 'mine', { label:'Apartment kitchen', unit:aptUnit }),
    A('living', 'mine', { label:'Living / dining area', unit:aptUnit }),
    A('unitlaundry', 'mine', { hint:'Only if your apartment has one', unit:aptUnit }),
    A('mail', 'common'), A('trash', 'common'), ...DORM_TAIL
  ],
  CVB: [
    A('room', 'mine', { label:'Bedroom / studio', unit:UNIT('Apartment or studio number', 'Apt') }),
    A('bathroom', 'mine', { label:'Apartment bathroom', hint:'Inside your apartment. The RAC is listed under Shared spaces.', unit:aptUnit,
      detail:{ label:'Which bathroom or fixture?', ph:'e.g. second bathroom, tub drain', req:false } }),
    A('unitkitchen', 'mine', { label:'Apartment kitchen / studio kitchenette', unit:aptUnit }),
    A('living', 'mine', { hint:'Where your unit has a separate one', unit:aptUnit }),
    A('laundry', 'shared'), A('rac', 'shared'), A('racrooms', 'shared'), A('lab', 'shared'), A('hub', 'shared', { hint:'Floor 1' }), A('market', 'shared'),
    A('office', 'shared'), A('desk', 'shared'),
    A('mail', 'common'), A('trash', 'common'), ...DORM_TAIL
  ],
  CVC: [
    A('room', 'mine', { label:'Bedroom', unit:UNIT('Suite and room number', 'Suite') }),
    A('bathroom', 'mine', { label:'Suite bathroom', hint:'Shared within your suite', unit:suiteUnit,
      detail:{ label:'Which fixture? (sink, toilet, shower…)', ph:'e.g. shower drain', req:false } }),
    A('living', 'mine', { label:'Suite living / dining area', unit:suiteUnit }),
    A('unitkitchen', 'mine', { label:'Suite kitchenette', hint:'Inside your suite. What it contains varies.', unit:suiteUnit, kw:/kitchen|microwave|fridge|refrigerator/i, explicit:/kitchenette|suite kitchen/i }),
    A('kitchen', 'shared', { label:'Community kitchen (7th floor)', hint:'Not your suite kitchenette', explicit:/community kitchen|(7th|seventh) floor kitchen/i }),
    A('laundry', 'shared'), A('study', 'shared', { label:'Shared study area / lounge', floor:FLOOR_OPT }), A('desk', 'shared'),
    A('trash', 'common'), ...DORM_TAIL
  ],
  CV2: [
    A('room', 'mine', { label:'Dorm room', unit:roomUnit }),
    sharedBath(), A('study', 'shared', { label:'Study room', floor:FLOOR_OPT }), A('lounge', 'shared', { floor:FLOOR_OPT }),
    A('study10', 'shared', { label:'10th-floor study lounge', kw:/(10th|tenth) floor study/i, cats:TPL.study.cats, short:'10th-floor study lounge', named:true, defaults:{ floor:'10' }, floor:FLOOR_OPT }),
    A('multi', 'shared'), A('rec', 'shared', { label:'CV2 recreation space', short:'CV2 recreation space', kw:/recreation|rec room/i, cats:GENERIC }),
    A('kitchen', 'shared', { floor:FLOOR_OPT }), A('laundry', 'shared'), A('desk', 'shared'),
    A('trash', 'common'), A('bike', 'common'), ...DORM_TAIL
  ],
  'Joe West': [
    A('room', 'mine', { label:'Dorm room', unit:roomUnit }),
    sharedBath(), A('study', 'shared', { floor:FLOOR_OPT }), A('lounge', 'shared', { floor:FLOOR_OPT }),
    A('activity', 'shared'), A('kitchen', 'shared', { floor:FLOOR_OPT }), A('laundry', 'shared'),
    A('mail', 'shared', { label:'Resident mailroom / package pickup' }), A('desk', 'shared'),
    A('trash', 'common', { label:'Floor trash / recycling area', floor:FLOOR_OPT }), A('bike', 'common'), ...DORM_TAIL
  ],
  Washburn: [
    A('room', 'mine', { label:'Dorm room', unit:roomUnit }),
    sharedBath(), A('lounge', 'shared', { label:'Formal lounge', floor:FLOOR_OPT }), A('study', 'shared', { label:'Study lounge', floor:FLOOR_OPT }),
    A('activity', 'shared'), A('kitchen', 'shared', { floor:FLOOR_OPT }), A('laundry', 'shared'), A('desk', 'shared'),
    A('trash', 'common', { label:'Outdoor trash / recycling containers' }), ...noElev(DORM_TAIL)           // Washburn has no elevators
  ],
  SVP: [
    A('room', 'mine', { label:'Room / sleeping area', unit:roomUnit }),
    A('bathroom', 'mine', { label:'Bathroom in my room or suite', hint:'May be shared with others in your suite', unit:UNIT('Room or suite number', 'Room'),
      detail:{ label:'Which bathroom?', ph:'e.g. the one off the living area', req:false } }),
    A('living', 'mine', { label:'Living area', hint:'Only for quads and suites that have one', unit:UNIT('Room or suite number', 'Room') }),
    A('study', 'shared', { label:'Study lounge', floor:FLOOR_OPT }), A('gametv', 'shared'), A('fitness', 'shared'), A('kitchen', 'shared', { floor:FLOOR_OPT }),
    A('dining', 'shared'), A('laundry', 'shared'), A('mail', 'shared', { label:'Mail / parcel area' }), A('desk', 'shared', { label:'Reception / front desk' }),
    ...DORM_TAIL.slice(0, -1), A('other', 'common', { hint:'Sky Lounge, Flex Room, private rooms and similar. You will say where.' })
  ]
};
// The three study buildings share one short list. A dedicated computer lab is not listed because it is not confirmed for each building;
// a lab or special room is reported under Study area or Other place with its real room number.
const STUDY_AREAS = code => [
  A('classroom', 'rooms', { unit:UNIT('Room number', 'Room') }),
  A('bathroom', 'rooms', { label:'Restroom', floor:FLOOR_REQ, detail:{ label:'Which restroom? (optional)', ph:'e.g. men’s, near the east stairs', req:false } }),
  A('study', 'rooms', { label:'Study / teaching area', short:'Study / teaching area', floor:FLOOR_OPT, unit:{ label:'Room number (if you know it)', word:'Room', req:false },
    hint:code === 'Macquarrie Hall' ? 'Includes the CS Study Lab (MH 226)' : undefined }),
  A('hallway', 'common', { floor:FLOOR_REQ }),
  A('stairs', 'common', { label:'Stairs / elevator', short:'Stairs / elevator', kw:/stairs?\b|stairwell|staircase|elevator/i, floor:FLOOR_OPT }),
  A('lobby', 'common'), A('outside', 'common'), A('other', 'common')
];
for (const b of BUILDINGS) if (b.type === 'academic') BUILDING_AREAS[b.code] = STUDY_AREAS(b.code);
const areasFor = b => BUILDING_AREAS[b.code];

// One list of every place id, for the worker setup screen.
const PLACES = [];
for (const b of BUILDINGS) {
  for (const a of BUILDING_AREAS[b.code]) {
    let p = PLACES.find(x => x.id === a.id);
    if (!p) { p = { id:a.id, label:a.short || a.label, codes:new Set() }; PLACES.push(p); }
    p.codes.add(b.code);
  }
}
PLACES.push(...PLACES.splice(PLACES.findIndex(p => p.id === 'other'), 1));          // Other place always last
const areaLabel = (b, a) => a.label;

// What the server also checks for each place: r = [unit, floor, detail] (0 not asked, 1 optional, 2 required), the label it writes down,
// whether photos and an entry preference apply, and which issue types fit. build/genloc.js copies this table into server.js.
const locationRules = () => Object.fromEntries(BUILDINGS.map(b => [b.code, Object.fromEntries(BUILDING_AREAS[b.code].map(a =>
  [a.id, { r:[a.unit ? (a.unit.req ? 2 : 1) : 0, a.floor ? (a.floor.req ? 2 : 1) : 0, a.detail.req ? 2 : 1], label:a.label, noPhoto:!!a.noPhoto, entry:!!a.entry, cats:a.cats || CATEGORIES.map(c => c.id) }]))]));
const buildingNames = () => Object.fromEntries(BUILDINGS.map(b => [b.code, b.name]));
// A short fingerprint of text, used to tell one send from another (not a security feature).
function hash53(str, seed) {
  let h1 = 0xdeadbeef ^ (seed || 0), h2 = 0x41c6ce57 ^ (seed || 0);
  for (let i = 0; i < str.length; i++) { const ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
const SENSITIVE_TEXT = /toilet|shower|bath ?room|restroom|locker room|changing room/i;
const sendFingerprint = i => hash53(JSON.stringify([i.building, i.area, String(i.unit || '').trim(), String(i.floor || '').trim(), String(i.detail || '').trim(),
  String(i.description || '').trim(), i.category, i.entry || null, i.photo ? hash53(i.photo) : null]));
// Where a report is, in words: building, place, then unit, floor and detail when given.
function whereExtra(r) {
  const b = buildingByCode(r.building), a = b && areasFor(b).find(x => x.id === r.area);
  const word = a && a.unit && a.unit.word || 'Unit', unit = r.unit && (new RegExp('^' + word + '\\b', 'i').test(r.unit) ? r.unit : word + ' ' + r.unit);
  const floor = r.floor && (/^\d+$/.test(r.floor) ? 'Floor ' + r.floor : r.floor);
  return [unit, floor, r.detail].filter(Boolean).join(' • ');
}
const buildingTitle = r => buildingByCode(r.building) ? bFull(r.building) : (r.buildingName || r.building);           // an old record of a building outside the ten keeps its own words
const whereText = r => [buildingTitle(r), r.areaLabel, whereExtra(r)].filter(Boolean).join(' • ');
/* Is this report about the very same spot as another? The unit (apartment, suite, room) and the floor must both match when the place asks for them,
   so two different apartment bathrooms in one building are never offered as duplicates. An old report that lacks the number never matches. */
const normLoc = v => String(v == null ? '' : v).toLowerCase().replace(/\b(apt|apartment|suite|room|rm|floor|fl|unit)\b/g, '').replace(/(\d+)(st|nd|rd|th)\b/g, '$1').replace(/[^a-z0-9]/g, '');
function sameSpotPlace(r, x) {
  if (r.id === x.id || r.building !== x.building || r.area !== x.area) return false;
  const b = buildingByCode(r.building), a = b && areasFor(b).find(p => p.id === r.area);
  if (!a) return false;
  for (const key of ['unit', 'floor']) {
    if (!a[key]) continue;
    const p = normLoc(r[key]), q = normLoc(x[key]);
    if (p !== q || (!p && a[key].req)) return false;
  }
  if (a.id === 'other' || (a.detail.req && a.floor)) { const p = normLoc(r.detail), q = normLoc(x.detail); if (p !== q) return false; }   // a place named in words must be named the same way
  return true;
}
/* Two reports in one place can still be about different things: the second bathroom, the shower and not the sink, washer 123ABC and not 456DEF.
   Items are read from what the student wrote (the detail box and the description). Nothing is merged by this; staff decide. */
const ITEM_WORDS = [['toilet', /toilets?|urinals?/], ['sink', /sinks?|faucets?|taps?/], ['shower', /showers?/], ['tub', /bath ?tubs?|tubs?/], ['mirror', /mirrors?|vanity/],
  ['fridge', /fridge|refrigerators?|freezer/], ['stove', /stoves?|ovens?|burners?|range/], ['microwave', /microwaves?/], ['dishwasher', /dishwashers?/], ['disposal', /disposals?/],
  ['washer', /washers?|washing machines?/], ['dryer', /dryers?/], ['outlet', /outlets?|plugs?|sockets?/], ['light', /lights?|lamps?|bulbs?/], ['fan', /fans?/], ['vent', /vents?/],
  ['window', /windows?/], ['door', /doors?|locks?/], ['heat', /heater|thermostat|heating|ac|air ?condition\w*/], ['couch', /couch(es)?|sofa|cushions?/], ['bed', /beds?|mattress/], ['desk', /desks?/]]
  .map(([k, re]) => [k, new RegExp('\\b(?:' + re.source + ')\\b', 'i')]);
const ORDINALS = { first:'first', '1st':'first', second:'second', '2nd':'second', third:'third', '3rd':'third', master:'master', main:'main', guest:'guest', hall:'hall', upstairs:'upstairs', downstairs:'downstairs' };
function itemsOf(r, laundry) {
  const t = String(r.detail || '') + ' ' + String(r.description || ''), items = new Set(), machines = new Set();
  for (const [k, re] of ITEM_WORDS) if (re.test(t)) items.add(k);
  if (laundry) for (const m of t.matchAll(/\b(\d{3})[\s-]?([a-z]{3})\b/gi)) if (!/\b(apt|apartment|room|rm|unit|suite|floor)\s*$/i.test(t.slice(0, m.index))) machines.add(m[1] + m[2].toUpperCase());
  const o = /\b(first|1st|second|2nd|third|3rd|master|main|guest|hall|upstairs|downstairs)\b/i.exec(r.detail || '');
  return { items, machines, ordinal:o ? ORDINALS[o[1].toLowerCase()] : null };
}
/* null: not the same place, or certainly a different item. Otherwise how sure we are:
   level 'same' = both reports name the same fixture or machine; 'related' = same place but the fixture or machine is not pinned down. */
function spotMatch(r, x) {
  if (!sameSpotPlace(r, x)) return null;
  const laundry = r.area === 'laundry' || r.area === 'unitlaundry', p = itemsOf(r, laundry), q = itemsOf(x, laundry);
  if (p.ordinal && q.ordinal && p.ordinal !== q.ordinal) return null;                                       // the first bathroom is not the second
  if (p.machines.size && q.machines.size) {
    const both = [...p.machines].filter(m => q.machines.has(m));
    return both.length ? { level:'same', why:'Same place, and both name machine ' + both[0] + '.' } : null;    // two different machine ids are two machines
  }
  const shared = [...p.items].filter(k => q.items.has(k));
  if (p.items.size && q.items.size) {
    if (!shared.length) return null;                                                                       // the sink and the shower are different jobs
    return { level:catKey(r) === catKey(x) ? 'same' : 'related', why:'Same place, and both mention the ' + shared[0] + (catKey(r) === catKey(x) ? '.' : ', but they were filed under different types.') };
  }
  return { level:'related', why:'Same place, but ' + (p.items.size || q.items.size || p.machines.size || q.machines.size ? 'only one report says which fixture or machine it is.' : 'neither report says which fixture or machine it is.') + ' Check before merging.' };
}
const sameSpot = (r, x) => !!spotMatch(r, x);

// Issue types decide which team gets the ticket. Phone numbers and routes come from the team's housing research;
// confirm them with Housing before launch.
// Wi-Fi, computers and classroom equipment are not building repairs. They have their own type, which points the student to IT.
const IT_RE = /wi-?fi|internet|network|computer|desktop|laptop|printer|projector|monitor|hdmi|usb|software|password|smart ?board|microphone|classroom (display|screen|speakers?|sound|audio)/i;
const CATEGORIES = [
  { id:'plumbing',   label:'Plumbing / leak',          team:'Maintenance (FD&O)',
    kw:/leak|flood|toilet|sink|drain|clog|pipe|faucet|shower|water pressure|hot water|sewage|overflow|drip\w*|seep\w*|water (is )?(coming|running|pouring)/i,
    route:'FD&O maintenance. Urgent: call work control, 408-924-1990 (Mon-Fri, 8 a.m.-5 p.m.). After hours: University Police, 408-924-2222.' },
  { id:'electrical', label:'Power / lights',           team:'Maintenance (FD&O)',
    kw:/outlet|power|light|lamp|bulb|breaker|spark|electric|flicker|wiring/i,
    route:'FD&O maintenance. Urgent: call work control, 408-924-1990. After hours: University Police, 408-924-2222.' },
  { id:'hvac',       label:'Heating / AC',             team:'Maintenance (FD&O)',
    kw:/\bac\b|a\/c|air ?condition|heater|heating|thermostat|\bvents?\b|no heat|too (hot|cold)/i,
    route:'FD&O maintenance. Heating and AC are listed separately from appliance requests.' },
  { id:'structure',  label:'Door, lock, window, wall', team:'Maintenance (FD&O)',
    kw:/\bdoors?\b|\block(s|ed)?\b|\bkeys?\b|window|\bwalls?\b|ceiling|hinge|\btiles?\b|panel|card reader|latch|handle|elevator/i,
    route:'FD&O maintenance. A broken window or lock is a security risk; an elevator problem is urgent.' },
  { id:'furniture',  label:'Furniture / appliance',    team:'Housing custodial and facilities',
    kw:/\bbeds?\b|\bdesks?\b|chair|couch|\btable\b|fridge|refrigerator|stove|burner|oven|microwave|appliance|ping ?pong|pool table|cabinet|shelf|closet|mattress/i,
    route:'Housing "Custodial and Facilities Request" portal, not the maintenance request. If an appliance has no power, check for an electrical cause.' },
  { id:'cleaning',   label:'Cleaning / trash / pests', team:'Housing custodial and facilities',
    kw:/trash|garbage|recycl|dirty|spill|smell|odor|clean|pest|roach|\bants?\b|\bmice\b|mouse|\bbugs?\b|mold/i,
    route:'Housing "Custodial and Facilities Request" portal (cleanup, furniture movement, pests).' },
  { id:'laundry',    label:'Laundry machine',          team:'CSC ServiceWorks (outside company)',
    kw:/\b(washers?|dryers?|washing machines?|laundry machines?)\b/i,
    route:'Housing does not service laundry machines. Report to CSC ServiceWorks, 844-272-9675, with the machine ID (three numbers and three letters).' },
  { id:'tech',       label:'Wi-Fi, computer or classroom tech', team:'IT Service Desk (referral)', kw:IT_RE,
    route:'Not a building repair. To get it fixed, call the IT Service Desk at 408-924-1530. This report only leaves a note for staff: it is not sent to IT. A wall outlet that powers the equipment is a Power / lights problem.' },
  { id:'other',      label:'Other',                    team:'Triage coordinator (demo)', kw:null,
    route:'Not sorted yet. The triage coordinator reads it and routes it, or you can pick the closest type.' }
];
for (const c of CATEGORIES) if (c.kw) c.kw = wordStart(c.kw);
const CAT = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
const LOC_RULES = locationRules(), BUILD_NAMES = buildingNames();            // what the server also checks (see build/genloc.js)
const CAT_ORDER = ['laundry','plumbing','hvac','electrical','structure','cleaning','furniture','tech'];      // tech is last: an outlet that powers a projector is electrical

const STATUS = {
  new:          { label:'Submitted',                  open:true },
  reopened:     { label:'Reopened',                   open:true },
  acknowledged: { label:'Seen',                       open:true },
  in_progress:  { label:'In progress',                open:true },
  waiting:      { label:'Waiting on parts or vendor', open:true },
  other:        { label:'Other',                      open:true },
  referred:     { label:'Referred out',               open:true },   // retired: no longer offered, kept so old tickets still show
  resolved:     { label:'Resolved',                   open:false },
  duplicate:    { label:'Merged (duplicate)',         open:false }
};
const PRIORITY = {
  urgent: { label:'Urgent', rank:0, agingHours:4 },
  high:   { label:'High',   rank:1, agingHours:24 },
  normal: { label:'Normal', rank:2, agingHours:72 },
  low:    { label:'Low',    rank:3, agingHours:168 }   // demo thresholds, tune with Housing and FD&O
};
const prio = id => PRIORITY[id] || PRIORITY.normal;     // an unknown stored priority counts as Normal instead of crashing a screen
const isOpen = r => (STATUS[r.status] || { open:true }).open;
// Older data or a retired type must never crash a screen: an unknown type counts as Other.
const catKey = r => (CAT[r.category] ? r.category : 'other');
const catOf = r => CAT[catKey(r)];
// Joe West has no air conditioning, so its heating and cooling type is not called "AC". Too much heat, no heat and poor airflow are all still reportable.
const catText = (id, building) => (id === 'hvac' && building === 'Joe West' ? 'Heating / ventilation' : (CAT[id] || CAT.other).label);
const catLabel = r => (catKey(r) === 'other' && r.categoryText ? r.categoryText : catText(catKey(r), r.building));

/* Who a report goes to and what to do about it. The ONE place that decides, used by the form hint, the confirmation, My reports and the staff ticket,
   so no two screens can name different owners. It looks at the kind of building, the place and the problem. */
function routeFor(r) {
  const c = catKey(r), cat = CAT[c], b = buildingByCode(r.building), study = !!b && b.type === 'academic';
  const out = (team, how, kind, extra) => Object.assign({ team, how, kind }, extra || {});
  if (c === 'tech') return out(cat.team, cat.route, 'referral', { phone:'408-924-1530' });
  if (c === 'other') return out(cat.team, cat.route, 'triage');
  if (c === 'hvac' && r.building === 'Joe West') return out(cat.team, 'FD&O maintenance. Joe West has no air conditioning: report too much heat, no heat or poor airflow here.', 'maintenance');
  if (c === 'furniture' || c === 'cleaning') {
    if (study) return out('Campus facilities or whoever manages the room', 'Not a Housing request. Furniture in a University Lecture Room and furniture managed by a college or department have different owners, so triage staff confirm which before anyone is sent. Contact details for this have not been verified in this demo.', 'campus');
    return out(cat.team, cat.route, 'custodial');
  }
  if (c === 'laundry') {
    if (r.area === 'laundry') return out(cat.team, cat.route, 'vendor');
    if (r.area === 'unitlaundry') return out('Housing (triage)', 'A washer or dryer inside an apartment is not covered by the shared laundry-room instructions, so Housing staff confirm who services it. If you know the machine ID (3 numbers and 3 letters on the metal plate), put it in the description.', 'triage');
    return out('Triage coordinator (demo)', 'Say which machine and where it is. If you do not know the machine ID, write "not sure": the triage coordinator will route it.', 'triage');
  }
  return out(cat.team, cat.route, 'maintenance');                    // plumbing, electrical, heating, doors and walls: FD&O maintenance, in a residence or a study building
}
const statusText = r => (r.status === 'other' && r.statusText ? r.statusText : (STATUS[r.status] || { label:r.status }).label);

/* =====================================================================
   2. Small helpers
   ===================================================================== */
const $ = id => document.getElementById(id);

// Builds DOM safely. User text always goes in as text nodes, never as HTML.
function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'style') e.style.cssText = v;           // set through the style object so a strict CSP can block inline style attributes
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat(Infinity)) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(String(c)));
  return e;
}
const clear = el => { while (el.firstChild) el.removeChild(el.firstChild); return el; };
const nowIso = () => new Date().toISOString();
const hoursSince = iso => (Date.now() - new Date(iso).getTime()) / 36e5;
function ago(iso) {
  const m = Math.max(0, (Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return Math.floor(m) + 'm ago';
  if (m < 2880) return Math.floor(m / 60) + 'h ago';
  return Math.floor(m / 1440) + 'd ago';
}
function fmtDay(s) {
  const d = new Date(String(s).length === 10 ? s + 'T12:00:00' : s);
  if (isNaN(d)) return '';
  const opts = { weekday:'short', month:'short', day:'numeric' };
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric';      // a date in another year needs its year
  return d.toLocaleDateString(undefined, opts);
}
const fmtTime = iso => new Date(iso).toLocaleString(undefined, { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' });
// Demo accounts that have a profile photo. Everyone else gets their initials. The pictures live in styles.css.
const DEMO_PHOTO = { 'sam.spartan@sjsu.edu':'photo-sam', 'dev.patel@sjsu.edu':'photo-dev' };
const avatar = (email, name, size) => { const p = DEMO_PHOTO[String(email || '').toLowerCase()];
  return h('span', { class:'avatar' + (size ? ' ' + size : '') + (p ? ' photo ' + p : ''), 'aria-hidden':'true' }, initials(name)); };
const initials = n => n.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
const firstName = n => String(n || '').split(/\s+/)[0];
const nameFromEmail = e => e.split('@')[0].split(/[._-]+/).filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
const todayStr = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const safePhoto = p => (typeof p === 'string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(p)) ? p : null;
const blobToDataUrl = blob => new Promise((res, rej) => { const f = new FileReader(); f.onload = () => res(f.result); f.onerror = () => rej(f.error); f.readAsDataURL(blob); });

let toastTimer;
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
}

/* Suggestions from the description. Workers can always change them. */
// Only the words decide, and only the words about something that is wrong. "The washer works" says the washer is fine.
const WORKS_RE = /\b(works?|working|fine|okay|ok|good|normal)\b/i;
const FAULT_RE = /\b(not|no|won'?t|can'?t|cannot|doesn'?t|isn'?t|stopped|broken|broke|fails?|failed|dead|out|sometimes|intermittent|flicker\w*)\b|n't\b/i;
const clausesOf = text => String(text).split(/[.;!?\n]+|,\s*(?:but|and|while|although)\b|\b(?:but|while|although)\b/i).map(x => x.trim()).filter(Boolean);
function suggestCategory(text, areaId, allowed) {
  const ok = id => !allowed || allowed.includes(id);
  const body = clausesOf(text).filter(c => !(WORKS_RE.test(c) && !FAULT_RE.test(c))).join('. ');
  for (const id of CAT_ORDER) if (ok(id) && CAT[id].kw.test(body)) return id;
  return null;
}
// Hazard words count unless something in the same clause says they are not there: "no fire or smoke" is not a fire.
const NEGATOR_RE = /\b(no|not|without|never|nothing|isn'?t|aren'?t|wasn'?t|weren'?t|don'?t|doesn'?t|didn'?t|ruled out)\b/i;
function hasPositive(re, text) {
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  for (const m of String(text).matchAll(g)) {
    const clause = text.slice(0, m.index).split(/[.;!?,\n]|\b(?:but|just|however|although)\b/i).pop();
    if (!NEGATOR_RE.test(clause)) return true;
  }
  return false;
}
const HAZARD_RE = /\b(?:flood|burst|sparking|sparks?|smoke|smoking|burning|fire|gas|exposed wire|sewage)\b/i;
const URGENT_RE = /no power|power (is )?out|stuck in|trapped|won'?t lock|can'?t lock|cannot lock|broken lock|broken window|shattered/i;
const HIGH_RE = /\b(?:leak\w*|no (hot )?water|elevator|no heat|clog\w*|overflow\w*|mold|roach\w*|mice|mouse|fell off|falling|detached|collapsed|hanging|unlock\w*|card reader)\b/i;
const LOW_RE = /scratch|paint|cosmetic|chipped|stain|squeak/i;
function suggestPriority(text) {
  if (hasPositive(HAZARD_RE, text) || URGENT_RE.test(text)) return 'urgent';
  if (hasPositive(HIGH_RE, text)) return 'high';
  if (LOW_RE.test(text)) return 'low';
  return 'normal';
}

/* =====================================================================
   3. Database layer
      RemoteStore = the shared server (server.js + SQLite). This is the real app: every device sees the same reports,
                    and the server decides who may see or change what.
      LocalStore  = IndexedDB in this browser (or memory if the browser blocks it). A device-only DEMO: it is never chosen
                    automatically, because a silent fallback to it is how reports ended up on one phone only.
      Both expose the same async API, so the screens never know which one is in use. The rules (who may do what, which fields a
      student or staff member may change, how history is written) live in the server; LocalStore repeats them for the demo.

      Tables
        users(id, role, email, name, createdAt, lastLoginAt)
        profiles(userId, buildings[], places[], categories[], setupDone, updatedAt)   worker scope
        reports(id, rev, reporterId, building, area, category, priority, status, assigneeId, eta, ...)
        events(id, reportId, at, actor, type, from, to, text, visibility)             full history, written by the server
   ===================================================================== */
const KEY_FIELD = { users:'id', profiles:'userId', reports:'id', events:'id' };
const TABLES = Object.keys(KEY_FIELD);

class MemKV {
  constructor() { this.t = {}; this.seq = {}; for (const s of TABLES) { this.t[s] = new Map(); this.seq[s] = 0; } }
  async get(s, k) { const v = this.t[s].get(k); return v ? structuredClone(v) : undefined; }
  async getAll(s) { return [...this.t[s].values()].map(v => structuredClone(v)); }
  async put(s, v) { this.t[s].set(v[KEY_FIELD[s]], structuredClone(v)); }
  async add(s, v) { const id = ++this.seq[s]; this.t[s].set(id, { ...structuredClone(v), id }); return id; }
  async clear(s) { this.t[s].clear(); this.seq[s] = 0; }
  async count(s) { return this.t[s].size; }
  // Several writes that happen together or not at all. work() gets { add(store, value, then), put(store, value) }.
  async transact(stores, work) {
    const saved = stores.map(s => [s, new Map(this.t[s]), this.seq[s]]);
    try {
      work({ put: (s, v) => { this.t[s].set(v[KEY_FIELD[s]], structuredClone(v)); },
             add: (s, v, then) => { const id = ++this.seq[s]; this.t[s].set(id, { ...structuredClone(v), id }); if (then) then(id); } });
    } catch (e) { for (const [s, m, q] of saved) { this.t[s] = m; this.seq[s] = q; } throw e; }
  }
}

class IdbKV {
  static open() {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('IndexedDB timed out')), 2500);
      let req;
      try { req = indexedDB.open('eaiser-campus', 1); } catch (e) { clearTimeout(timer); reject(e); return; }
      req.onupgradeneeded = () => {
        const db = req.result;
        db.createObjectStore('users', { keyPath:'id' });
        db.createObjectStore('profiles', { keyPath:'userId' });
        db.createObjectStore('reports', { keyPath:'id', autoIncrement:true });
        db.createObjectStore('events', { keyPath:'id', autoIncrement:true });
      };
      req.onsuccess = () => { clearTimeout(timer); resolve(new IdbKV(req.result)); };
      req.onerror = () => { clearTimeout(timer); reject(req.error); };
      req.onblocked = () => { clearTimeout(timer); reject(new Error('IndexedDB blocked')); };
    });
  }
  constructor(db) { this.db = db; }
  _run(store, mode, fn) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(store, mode);
      const req = fn(tx.objectStore(store));
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = tx.onabort = () => reject(tx.error);
    });
  }
  get(s, k) { return this._run(s, 'readonly', o => o.get(k)); }
  getAll(s) { return this._run(s, 'readonly', o => o.getAll()); }
  put(s, v) { return this._run(s, 'readwrite', o => o.put(v)); }
  add(s, v) { return this._run(s, 'readwrite', o => o.add(v)); }
  clear(s) { return this._run(s, 'readwrite', o => o.clear()); }
  count(s) { return this._run(s, 'readonly', o => o.count()); }
  // One IndexedDB transaction: a report and its first history entry are both saved, or neither is.
  transact(stores, work) {
    return new Promise((resolve, reject) => {
      let tx;
      try { tx = this.db.transaction(stores, 'readwrite'); } catch (e) { reject(e); return; }
      tx.oncomplete = () => resolve();
      tx.onerror = tx.onabort = () => reject(tx.error || new Error('The write did not complete.'));
      try {
        work({ put: (s, v) => { tx.objectStore(s).put(v); },
               add: (s, v, then) => { const q = tx.objectStore(s).add(v); if (then) q.onsuccess = () => then(q.result); } });
      } catch (e) { try { tx.abort(); } catch (x) { /* already finished */ } reject(e); }
    });
  }
}

/* Does a worker's saved area cover this report, as the given type? A worker who has not finished setup covers nothing. */
const profileCovers = (p, r, cat) => !!p && p.setupDone !== false && p.buildings.includes(r.building) && p.places.includes(r.area) && p.categories.includes(cat);

class LocalStore {
  constructor(kv) {
    this.kv = kv; this.subs = []; this.bc = null; this.cur = null;
    try { this.bc = new BroadcastChannel('eaiser-campus'); this.bc.onmessage = () => this._emit(); } catch (e) { /* tabs just will not sync */ }
  }
  onChange(cb) { this.subs.push(cb); }
  _emit() { for (const f of this.subs) { try { f(); } catch (e) { console.error(e); } } }
  _changed() { this._emit(); try { if (this.bc) this.bc.postMessage(1); } catch (e) { /* ignore */ } }
  // Read-then-write steps run one at a time across every open tab, so two tabs cannot overwrite each other.
  async _lock(fn) {
    if (navigator.locks && navigator.locks.request) {
      let started = false;
      try { return await navigator.locks.request('eaiser-db', () => { started = true; return fn(); }); }
      catch (e) { if (started) throw e; /* locks are not usable in this page, run without */ }
    }
    return fn();
  }

  /* ----- who is using this device store ----- */
  async demoSignIn(role, email) {
    const id = role + ':' + email, old = await this.kv.get('users', id), t = nowIso();
    const user = { id, role, email, name: old ? old.name : nameFromEmail(email), createdAt: old ? old.createdAt : t, lastLoginAt: t };
    await this.kv.put('users', user); this.cur = user;
    return { user, isAdmin:false, isTriage:true, token:null };       // on one device the person using it plays every part
  }
  async restore(s) { const u = await this.kv.get('users', s.id); if (!u) throw new ApiError(401, 'Please sign in again.'); this.cur = u; return u; }
  async me() {
    const u = this.cur && await this.kv.get('users', this.cur.id);
    if (!u) throw new ApiError(401, 'Please sign in again.');
    return { user:u, isAdmin:false, isTriage:true, demo:true, profile: u.role === 'worker' ? ((await this.kv.get('profiles', u.id)) || null) : null };
  }
  async signOut() { this.cur = null; }
  setToken() { /* a device store has no token */ }
  _need(role) {
    if (!this.cur) throw new ApiError(401, 'Please sign in again.');
    if (role && this.cur.role !== role) throw new ApiError(403, 'You do not have access to that.');
    return this.cur;
  }
  _can(r) { return this.cur.role === 'worker' || r.reporterId === this.cur.id; }
  _out(r) { const { photo, idemKey, idemFp, ...rest } = r; return { ...rest, rev:rest.rev || 1, hasPhoto:!!photo }; }
  _ev(reportId, actor, type, o) {
    const e = o || {};
    return { reportId, at:e.at || nowIso(), actorId:actor.id, actorName:actor.name, actorRole:actor.role, type, from:e.from == null ? null : e.from, to:e.to == null ? null : e.to, text:e.text || null, visibility:e.visibility || 'public' };
  }

  async getProfile(userId) { return (await this.kv.get('profiles', userId)) || null; }
  async saveProfile(p) {
    const me = this._need('worker');
    if (p.userId !== me.id) throw new ApiError(403, 'You can only change your own area.');
    const profile = { userId:p.userId, buildings:[...new Set(p.buildings)], places:[...new Set(p.places)], categories:[...new Set(p.categories)], setupDone:!!p.setupDone, updatedAt:nowIso() };
    await this.kv.put('profiles', profile); this._changed(); return profile;
  }
  async listWorkers() {
    this._need('worker');
    const out = [];
    for (const user of (await this.kv.getAll('users')).filter(u => u.role === 'worker')) {
      const profile = await this.kv.get('profiles', user.id);
      if (profile && profile.setupDone) out.push({ user, profile });
    }
    return out.sort((a, b) => a.user.name.localeCompare(b.user.name));
  }

  // The same rules the server applies, for the device-only demo.
  _checkNew(i) {
    const areas = Object.hasOwn(LOC_RULES, i.building) ? LOC_RULES[i.building] : null;
    if (!areas) throw new ApiError(400, 'unknown building');
    const rule = Object.hasOwn(areas, i.area) ? areas[i.area] : null;
    if (!rule) throw new ApiError(400, 'that place is not in this building');
    ['unit', 'floor', 'detail'].forEach((k, n) => {
      const v = String(i[k] || '').trim();
      if (rule.r[n] === 2 && !v) throw new ApiError(400, k + ' is required for this place');
      if (rule.r[n] === 0 && v) throw new ApiError(400, k + ' is not used for this place');
    });
    if (String(i.description || '').trim().length < 4) throw new ApiError(400, 'Describe the problem so the right person can fix it.');
    if (!CAT[i.category]) throw new ApiError(400, 'category is not one of the allowed values');
    if (i.category !== 'other' && !rule.cats.includes(i.category)) throw new ApiError(400, 'That type of problem does not fit this place. Pick another type, or Other.');
    if (i.entry && !rule.entry) throw new ApiError(400, 'An entry preference only applies inside your own room or unit.');
    if (i.photo && rule.noPhoto) throw new ApiError(400, 'Photos are not accepted for bathrooms, restrooms and showers.');
    if (i.photo && SENSITIVE_TEXT.test(i.description + ' ' + (i.detail || ''))) throw new ApiError(400, 'Photos are not accepted when the description mentions a bathroom or shower.');
    return rule;
  }
  async createReport(input) {
    const me = this._need('student'), t = nowIso();
    const rule = this._checkNew(input), fp = sendFingerprint(input);
    const r = { createdAt:t, updatedAt:t, publicAt:t, reporterId:me.id, reporterName:me.name, building:input.building, buildingName:BUILD_NAMES[input.building],
      area:input.area, areaLabel:rule.label, unit:String(input.unit || '').trim(), floor:String(input.floor || '').trim(), detail:String(input.detail || '').trim(),
      category:input.category, priority:input.priority, prioritySource:'auto', status:'new', description:String(input.description || '').trim(), photo:input.photo || null,
      entry:input.entry || null, assigneeId:null, assigneeName:null, eta:null, dupOf:null, awaitingStaff:true, lastActorRole:'student', resolvedAt:null, confirmedAt:null,
      categoryText:null, statusText:null, rev:1, idemKey:input.idemKey || null, idemFp:fp };
    return this._lock(async () => {
      if (r.idemKey) {                                           // the same send again: hand back the report already saved; other content under the same key is a conflict
        const seen = (await this.kv.getAll('reports')).find(x => x.reporterId === me.id && x.idemKey === r.idemKey);
        if (seen) {
          if (seen.idemFp && seen.idemFp !== fp) throw new ApiError(409, 'A report with different details was already saved under this send. Look under My reports before sending again.');
          return this._out(seen);
        }
      }
      let id = null;
      await this.kv.transact(['reports', 'events'], w => w.add('reports', r, newId => { id = newId; w.add('events', this._ev(newId, me, 'created', { text:'Report saved in this browser.', at:t })); }));
      this._changed();
      return this._out({ ...r, id });
    });
  }
  // What a merged report can follow: the original's public progress, never its messages (same shape the server sends).
  async _tracking(r, events) {
    if (r.status !== 'duplicate' || !r.dupOf) return null;
    let o = null, id = r.dupOf;
    for (let hop = 0; hop < 6 && id; hop += 1) { o = await this.kv.get('reports', Number(id)); if (!o) return null; if (o.status !== 'duplicate') break; id = o.dupOf; o = null; }
    if (!o) return null;
    const evs = (events || await this.kv.getAll('events')).filter(e => e.reportId === o.id && (e.type === 'status' || e.type === 'eta') && e.visibility === 'public').map(e => e.at).sort();
    return { id:o.id, status:o.status, statusText:o.statusText || null, eta:o.eta || null, resolvedAt:o.resolvedAt || null, changedAt:evs.length ? evs[evs.length - 1] : null };
  }
  async getReport(id) {
    this._need();
    const r = await this.kv.get('reports', Number(id));
    if (!r || !this._can(r)) return null;
    const { idemKey, idemFp, ...rest } = r, tracking = await this._tracking(r);
    return { ...rest, rev:rest.rev || 1, hasPhoto:!!r.photo, ...(tracking ? { tracking } : {}) };
  }
  async listReports() {
    this._need();
    const rows = (await this.kv.getAll('reports')).filter(r => this._can(r)), events = rows.some(r => r.status === 'duplicate') ? await this.kv.getAll('events') : null;
    return Promise.all(rows.map(async r => { const t = await this._tracking(r, events); return t ? { ...this._out(r), tracking:t } : this._out(r); }));
  }
  async listEvents(reportId) {
    this._need();
    const r = await this.kv.get('reports', Number(reportId));
    if (!r || !this._can(r)) throw new ApiError(404, 'report not found');
    return (await this.kv.getAll('events')).filter(e => e.reportId === Number(reportId) && (this.cur.role === 'worker' || e.visibility === 'public'))
      .sort((a, b) => a.at.localeCompare(b.at) || a.id - b.id);
  }
  // One change to one ticket: runs alone, bumps the revision, writes the history.
  async _mutate(id, fn) {
    return this._lock(async () => {
      const r = await this.kv.get('reports', Number(id));
      if (!r || !this._can(r)) throw new ApiError(404, 'report not found');
      const fields = {}, evs = [];
      await fn(r, fields, evs);
      const n = { ...r, ...fields, updatedAt:nowIso(), rev:(r.rev || 1) + 1 };
      if (evs.some(e => e.visibility !== 'staff')) n.publicAt = n.updatedAt;      // the student can see this change
      await this.kv.transact(['reports', 'events'], w => { w.put('reports', n); for (const e of evs) w.add('events', { ...e, reportId:r.id, at:e.at || n.updatedAt }); });
      this._changed();
      return this._out(n);
    });
  }
  async studentAction(id, b) {
    const me = this._need('student');
    return this._mutate(id, async (r, f, evs) => {
      if (r.reporterId !== me.id) throw new ApiError(404, 'report not found');
      const E = (type, o) => evs.push(this._ev(r.id, me, type, o));
      if (b.action === 'confirm') {
        if (r.status !== 'resolved' || r.confirmedAt) throw new ApiError(409, 'This report is not waiting for your confirmation.');
        f.confirmedAt = nowIso(); f.lastActorRole = 'student'; E('confirmed');
      } else if (b.action === 'reopen') {
        if (r.status !== 'resolved') throw new ApiError(409, 'Only a resolved report can be reopened.');
        Object.assign(f, { status:'reopened', statusText:null, resolvedAt:null, confirmedAt:null, awaitingStaff:true, lastActorRole:'student' });
        E('status', { from:r.status, to:'reopened' }); E('reopened');
      } else if (b.action === 'message') {
        const text = String(b.text || '').trim().slice(0, 1000);
        if (!text) throw new ApiError(400, 'Type a message first.');
        if (!isOpen(r)) throw new ApiError(409, 'This report is closed. Use "Still broken" if it is not fixed.');
        Object.assign(f, { awaitingStaff:true, lastActorRole:'student' }); E('message', { text });
      } else if (b.action === 'ai') {
        if (Date.now() - Date.parse(r.createdAt) > 15 * 60000) throw new ApiError(409, 'Too late to add an assistant note.');
        if ((await this.kv.getAll('events')).some(e => e.reportId === r.id && e.type === 'ai')) throw new ApiError(409, 'The assistant note is already there.');
        const text = String(b.text || '').trim().slice(0, 800);
        if (!text) throw new ApiError(400, 'text is required');
        if (b.priority && PRIORITY[b.priority] && r.prioritySource === 'auto' && PRIORITY[b.priority].rank < prio(r.priority).rank) f.priority = b.priority;
        evs.push(this._ev(r.id, { id:null, name:'AI assistant', role:'system' }, 'ai', { text, visibility:'staff' }));
      } else throw new ApiError(400, 'bad action');
    });
  }
  async staffUpdate(id, b) {
    const me = this._need('worker'), patch = b.patch || {}, msg = String(b.message || '').trim().slice(0, 1500), note = String(b.note || '').trim().slice(0, 1500);
    return this._mutate(id, async (r, f, evs) => {
      if ((r.rev || 1) !== b.rev) throw new ApiError(409, 'Someone else just changed this ticket.', { current:this._out(r) });
      const E = (type, o) => evs.push(this._ev(r.id, me, type, o));
      let status = r.status, statusText = r.statusText || '';
      if ('status' in patch) {
        if (!STATUS[patch.status]) throw new ApiError(400, 'bad status');
        if (patch.status !== r.status && !['acknowledged', 'in_progress', 'waiting', 'resolved', 'other'].includes(patch.status)) throw new ApiError(400, 'That status cannot be set by hand.');
        status = patch.status;
      }
      if (status === 'other') { statusText = String('statusText' in patch ? patch.statusText : statusText).trim().slice(0, 60); if (!statusText) throw new ApiError(400, 'Type the status so the student knows what is happening.'); } else statusText = '';
      if (status !== r.status || statusText !== (r.statusText || '')) {
        if (status === 'resolved' && !msg) throw new ApiError(400, 'Add a short message saying what was done.');
        if (status === 'waiting' && !msg) throw new ApiError(400, 'Say what you are waiting for so the student knows.');
        f.status = status; f.statusText = statusText || null;
        E('status', { from:r.status === 'other' ? 'other:' + (r.statusText || '') : r.status, to:status === 'other' ? 'other:' + statusText : status });
        if (status === 'resolved') { f.resolvedAt = nowIso(); f.confirmedAt = null; } else if (r.status === 'resolved') { f.resolvedAt = null; f.confirmedAt = null; }
      }
      /* Type first, because it decides who covers the ticket (same rules as the server). */
      const curCat = catKey(r), cat = 'category' in patch ? patch.category : curCat;
      if (!CAT[cat]) throw new ApiError(400, 'bad category');
      const catText = cat === 'other' ? String('categoryText' in patch ? patch.categoryText : (r.categoryText || '')).trim().slice(0, 60) : '';
      const catChanged = cat !== curCat || catText !== (r.categoryText || '');
      const cur = r.assigneeId || null;
      let want = cur, explicit = false;
      if (b.claim) {
        if (cur) throw new ApiError(409, 'Someone else just took this ticket.', { current:this._out(r) });
        want = me.id; explicit = true;
      } else if ('assigneeId' in patch) { want = patch.assigneeId || null; explicit = true; }
      if (want !== cur) {
        let name = null;
        if (want) { const u = await this.kv.get('users', want); if (!u || u.role !== 'worker') throw new ApiError(400, 'That person is not on the staff list.'); name = u.name; }
        f.assigneeId = want; f.assigneeName = name; E('assigned', { from:r.assigneeName || null, to:name });
      }
      if ('priority' in patch && patch.priority !== r.priority) {
        if (!PRIORITY[patch.priority]) throw new ApiError(400, 'bad priority');
        f.priority = patch.priority; f.prioritySource = 'worker'; E('priority', { from:r.priority, to:patch.priority, visibility:'staff' });
      }
      if (catChanged) {
        f.category = cat; f.categoryText = catText || null;
        E('category', { from:curCat === 'other' && r.categoryText ? 'other:' + r.categoryText : curCat, to:cat === 'other' && catText ? 'other:' + catText : cat, visibility:'staff' });
        if (!explicit && cur && cur !== me.id && !profileCovers(await this.kv.get('profiles', cur), r, cat)) {
          f.assigneeId = null; f.assigneeName = null;
          E('assigned', { from:r.assigneeName || null, to:null, visibility:'staff',
            text:'Unassigned because the type is now ' + (cat === 'other' && catText ? catText : CAT[cat].label) + ' and ' + (r.assigneeName || 'the assignee') + ' does not cover it. It is back in the open list for the team that does.' });
        }
      }
      if ('eta' in patch) {
        const eta = patch.eta || null;
        if (eta !== null && !/^\d{4}-\d{2}-\d{2}$/.test(eta)) throw new ApiError(400, 'bad eta');
        if (eta !== (r.eta || null)) { f.eta = eta; E('eta', { to:eta }); }
      }
      if (msg) E('message', { text:msg });
      if (note) E('note', { text:note, visibility:'staff' });
      if (!evs.length) throw new ApiError(400, 'Nothing to save yet. Change a field or add a message.');
      // Only an answer to the student ends "the student is waiting": a message, a status change or a planned date.
      if (msg || 'status' in f || 'eta' in f) f.awaitingStaff = false;
      if (evs.some(e => e.visibility !== 'staff')) f.lastActorRole = 'worker';
    });
  }
  // Reports no worker's saved area covers (same answer the server gives). On one device every part is played by the person using it.
  async triage() {
    this._need('worker');
    const workers = await this.listWorkers(), out = { noWorkers:!workers.length, unrouted:[], assignedElsewhere:[], historical:[] };
    for (const r of await this.kv.getAll('reports')) {
      if (!isOpen(r)) continue;
      if (!Object.hasOwn(LOC_RULES, r.building)) { out.historical.push(r.id); continue; }
      const cat = catKey(r), covering = workers.filter(w => profileCovers(w.profile, r, cat));
      if (r.assigneeId) { if (!covering.some(w => w.user.id === r.assigneeId)) out.assignedElsewhere.push(r.id); }
      else if (!covering.length) out.unrouted.push(r.id);
    }
    return out;
  }
  async mergeReport(id, b) {
    const me = this._need('worker');
    return this._lock(async () => {
      const r = await this.kv.get('reports', Number(id)), o = await this.kv.get('reports', Number(b.into));
      if (!r || !o) throw new ApiError(404, 'report not found');
      if (o.id === r.id) throw new ApiError(400, 'A ticket cannot be merged into itself.');
      if ((r.rev || 1) !== b.rev) throw new ApiError(409, 'Someone else just changed this ticket.', { current:this._out(r) });
      if (!isOpen(r)) throw new ApiError(409, 'This ticket is already closed.');
      if (!isOpen(o)) throw new ApiError(409, 'The other ticket is already closed.');
      const t = nowIso();
      const n = { ...r, status:'duplicate', statusText:null, dupOf:o.id, awaitingStaff:false, lastActorRole:'worker', updatedAt:t, publicAt:t, rev:(r.rev || 1) + 1 };
      await this.kv.transact(['reports', 'events'], w => {
        w.put('reports', n);
        w.add('events', this._ev(r.id, me, 'duplicate', { to:String(o.id), at:t }));
        w.put('reports', { ...o, updatedAt:t, rev:(o.rev || 1) + 1 });
        w.add('events', this._ev(o.id, me, 'note', { text:'Report #' + r.id + ' (' + r.reporterName + ') described the same problem and was merged into this ticket.', visibility:'staff', at:t }));
      });
      this._changed();
      return this._out(n);
    });
  }
  async markDistinct(id, otherId) {
    const me = this._need('worker');
    return this._mutate(id, async (r, f, evs) => { evs.push(this._ev(r.id, me, 'distinct', { to:String(otherId), visibility:'staff' })); });
  }

  async demoSeed(b) {
    // The lock stops two tabs opened at the same moment from both adding the demo reports.
    const did = await this._lock(async () => {
      if ((await this.kv.count('users')) || (await this.kv.count('reports'))) return false;
      for (const u of b.users) await this.kv.put('users', u);
      for (const p of b.profiles) await this.kv.put('profiles', p);
      for (const { report, events } of b.reports) {
        const id = await this.kv.add('reports', { ...report, rev:1 });
        for (const e of events) await this.kv.add('events', { ...e, reportId:id });
      }
      return true;
    });
    if (did) this._changed();
    return did;
  }
  async demoReset(b) {
    const keep = this.cur;
    for (const s of TABLES) await this.kv.clear(s);
    this._changed();
    await this.demoSeed(b);
    if (keep && !(await this.kv.get('users', keep.id))) await this.kv.put('users', keep);
    return { reset:true };
  }
  // A browser that once opened the larger 74-location build holds data in its ids. Converted once (the markers are cleared), nothing deleted.
  async repairOldData() {
    return this._lock(async () => {
      let n = 0;
      for (const p of await this.kv.getAll('profiles')) { const fix = legacyProfile(p); if (fix) { await this.kv.put('profiles', { ...p, ...fix }); n += 1; } }
      for (const r of await this.kv.getAll('reports')) { const fix = legacyReport(r); if (fix) { await this.kv.put('reports', { ...r, ...fix }); n += 1; } }
      if (n) this._changed();
      return n;
    });
  }
}

/* A failed request. status 0 means the server could not be reached at all. */
class ApiError extends Error {
  constructor(status, message, data) { super(message); this.status = status; this.data = data || {}; }
}

class RemoteStore {
  constructor(base, token) {
    this.base = base; this.token = token || null; this.subs = []; this.v = null; this.fails = 0; this.down = false; this.onAuthLost = null;
    this._poll();
    setInterval(() => { if (!document.hidden) this._poll(); }, 2500);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) this._poll(); });
    window.addEventListener('online', () => this._poll());
  }
  onChange(cb) { this.subs.push(cb); }
  setToken(t) { this.token = t || null; }
  _emit() { for (const f of this.subs) { try { f(); } catch (e) { console.error(e); } } }
  async _poll() {
    try {
      const { v } = await this._j('GET', '/api/version');
      this.fails = 0;
      if (this.down) { this.down = false; toast('Back online'); this._emit(); }
      else if (this.v !== null && v !== this.v) this._emit();
      this.v = v;
    } catch (e) {
      this.fails += 1;                                        // two misses in a row means the server is really gone
      if (this.fails === 2) { this.down = true; toast('Lost the connection to the server. Trying again...'); }
    }
  }
  async _j(method, url, body) {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (this.token) headers.Authorization = 'Bearer ' + this.token;
    let r;
    try {
      r = await fetch(this.base + url, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(25000) : undefined });
    } catch (e) { throw new ApiError(0, 'You are offline or the server is not answering.'); }
    const j = await r.json().catch(() => null);
    if (r.status === 401 && this.token && !url.startsWith('/api/auth/') && this.onAuthLost) this.onAuthLost((j && j.error) || '');
    if (!r.ok) throw new ApiError(r.status, (j && j.error) || 'Something went wrong (' + r.status + ').', j || {});
    if (method !== 'GET') { const v = Number(r.headers.get('x-version')); if (!Number.isNaN(v)) this.v = v; this._emit(); }
    return j;
  }
  async _signedIn(p) { const res = await p; this.token = res.token; return res; }
  demoSignIn(role, email) { return this._signedIn(this._j('POST', '/api/auth/demo', { role, email })); }
  googleSignIn(role, credential) { return this._signedIn(this._j('POST', '/api/auth/google', { role, credential })); }
  emailStart(email) { return this._j('POST', '/api/auth/email/start', { email }); }
  emailVerify(role, email, code) { return this._signedIn(this._j('POST', '/api/auth/email/verify', { role, email, code })); }
  me() { return this._j('GET', '/api/me'); }
  async signOut() { try { await this._j('POST', '/api/auth/logout', {}); } catch (e) { /* the token is dropped either way */ } this.token = null; }
  async getProfile(userId) { try { return await this._j('GET', '/api/profiles/' + encodeURIComponent(userId)); } catch (e) { if (e.status === 404) return null; throw e; } }
  saveProfile(p) { return this._j('PUT', '/api/profiles/' + encodeURIComponent(p.userId), p); }
  listWorkers() { return this._j('GET', '/api/workers'); }
  triage() { return this._j('GET', '/api/triage'); }
  createReport(report) { return this._j('POST', '/api/reports', { report }); }
  async getReport(id) { try { return await this._j('GET', '/api/reports/' + Number(id)); } catch (e) { if (e.status === 404) return null; throw e; } }
  listReports() { return this._j('GET', '/api/reports'); }
  listEvents(reportId) { return this._j('GET', '/api/reports/' + Number(reportId) + '/events'); }
  studentAction(id, body) { return this._j('POST', '/api/reports/' + Number(id) + '/actions', body); }
  staffUpdate(id, body) { return this._j('PATCH', '/api/reports/' + Number(id), body); }
  mergeReport(id, body) { return this._j('POST', '/api/reports/' + Number(id) + '/merge', body); }
  markDistinct(id, otherId) { return this._j('POST', '/api/reports/' + Number(id) + '/distinct', { otherId }); }
  async demoSeed(b) { return (await this._j('POST', '/api/demo/seed', b)).seeded; }
  demoReset(b) { return this._j('POST', '/api/demo/reset', b); }
  listStaff() { return this._j('GET', '/api/staff'); }
  addStaff(email, isAdmin, isTriage) { return this._j('PUT', '/api/staff', { email, isAdmin, isTriage }); }
  removeStaff(email) { return this._j('DELETE', '/api/staff/' + encodeURIComponent(email)); }
  backupNow() { return this._j('POST', '/api/admin/backup', {}); }
  async downloadBackup() {
    let r;
    try { r = await fetch(this.base + '/api/admin/backup/download', { headers:{ Authorization:'Bearer ' + this.token } }); } catch (e) { throw new ApiError(0, 'You are offline or the server is not answering.'); }
    if (!r.ok) { const j = await r.json().catch(() => null); throw new ApiError(r.status, (j && j.error) || 'Could not download the backup.'); }
    return r.blob();
  }
}

/* Where the shared server is. Empty means the same address that served this page. Set it in index.html when the page is hosted elsewhere:
   <meta name="spartanfix-api" content="https://your-server.example.com">  It is read only from the page itself, never from the address bar. */
function apiBase() {
  const m = document.querySelector('meta[name="spartanfix-api"]'), v = m ? String(m.content || '').trim().replace(/\/+$/, '') : '';
  return /^https?:\/\/[^\s/]+$/.test(v) ? v : '';
}
// Asks the server who it is and what sign-in it offers. Returns null when it cannot be reached.
async function connectServer() {
  const base = apiBase();
  for (let i = 0; i < 2; i++) {
    try {
      const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 5000);
      const r = await fetch(base + '/api/config', { signal:ctl.signal });
      clearTimeout(timer);
      const j = await r.json();
      if (j && j.eaiser) return { base, config:j };
    } catch (e) { /* try once more, then give up */ }
  }
  return null;
}
// The device-only demo. Never chosen automatically: a person has to ask for it, and the screen says so all the time.
async function openDeviceStore() {
  try {
    const store = new LocalStore(await IdbKV.open());
    try { await store.repairOldData(); } catch (e) { console.warn('Could not convert older saved data', e); }
    return { store, mode:'device' };
  } catch (e) { /* IndexedDB blocked */ }
  return { store:new LocalStore(new MemKV()), mode:'memory' };
}

/* =====================================================================
   3b. EAiSER College SDK (optional)
       The Studio provides window.EAiSER. When it is there we use it to spot the building and to write
       a short AI summary for staff. When it is missing, slow or failing, the report still saves to our
       own database: the SDK never blocks a report. Only the campus is told, never the city or a landlord.
   ===================================================================== */
const SDK_TIMEOUT = 8000;
const withTimeout = (p, ms) => Promise.race([Promise.resolve(p), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
const sdkReady = () => { const s = window.EAiSER; return !!(s && s.reports && typeof s.reports.create === 'function'); };
const sdkState = { campus:null, buildings:[], hintIndex:null };
const sdkSeen = new Set();                                  // reports the assistant has already been asked about (a retry that returns the same report does not ask again)
const clip = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

// Maps whatever severity word the SDK returns onto our four priorities. A word we do not know maps to nothing.
function sdkPriority(sev) {
  const t = String(sev == null ? '' : sev).toLowerCase();
  if (/critical|urgent|emergency/.test(t)) return 'urgent';
  if (/high|severe|major/.test(t)) return 'high';
  if (/medium|moderate|normal/.test(t)) return 'normal';
  if (/low|minor/.test(t)) return 'low';
  return null;
}

async function sdkDetect() {
  const S = window.EAiSER;
  if (!S || !S.campus || typeof S.campus.detect !== 'function') return;
  try {
    const here = await withTimeout(S.campus.detect(), 4000);
    sdkState.campus = (here && here.campus) || null;
    if (sdkState.campus && typeof S.campus.buildings === 'function') {
      const out = await withTimeout(S.campus.buildings(sdkState.campus.id), 4000);
      sdkState.buildings = out && Array.isArray(out.buildings) ? out.buildings : [];
    }
    const near = here && here.building;
    if (near) { const i = findBuildingInText(String(near.name || '')); if (i >= 0) sdkState.hintIndex = i; }
  } catch (e) { console.warn('EAiSER campus lookup skipped', e); }
}

async function sdkTriage(desc, b, areaText, photoBlob) {
  if (!sdkReady()) return null;
  const S = window.EAiSER;
  const location = { campus: sdkState.campus ? sdkState.campus.id : undefined };
  const sb = sdkState.buildings.find(x => findBuildingInText(String(x.name || '')) === BUILDINGS.indexOf(b));
  if (sb) location.building = sb.id;
  const input = { description: bShort(b) + ', ' + areaText + '. ' + desc, location };
  if (photoBlob && typeof S.photo === 'function') input.photo = await withTimeout(S.photo(new File([photoBlob], 'photo.jpg', { type:'image/jpeg' })), SDK_TIMEOUT);
  const draft = await withTimeout(S.reports.create(input), SDK_TIMEOUT);
  if (!draft) return null;
  // Writing a summary is all this does. It never calls reports.send(): handing a report to an outside service needs a delivery integration that
  // has been verified and chosen on purpose, and nothing in this build proves the SDK's contract or that anyone receives it.
  return { title:clip(draft.title, 120), summary:clip(draft.summary, 600), severity:clip(String(draft.severity == null ? '' : draft.severity), 40) };
}

// Runs after the report is already saved. Adds a staff-only AI summary, and can raise the priority (never lower it).
async function sdkFollowUp(saved, desc, b, areaText, photoBlob) {
  const store = app.store, uid = app.user && app.user.id;
  const ai = await sdkTriage(desc, b, areaText, photoBlob);
  if (!ai || (!ai.title && !ai.summary)) return;
  if (app.store !== store || !app.user || app.user.id !== uid) return;        // signed out or switched while the assistant was thinking: the note is not for this session
  const want = sdkPriority(ai.severity);
  const raise = !!want && saved.prioritySource === 'auto' && PRIORITY[want].rank < prio(saved.priority).rank;
  const text = 'AI summary: ' + [ai.title, ai.summary].filter(Boolean).join('. ').replace(/\.\.$/, '.') +
    (ai.severity ? ' Severity: ' + ai.severity + '.' : '') + (raise ? ' Priority raised to ' + PRIORITY[want].label + '.' : '');
  await app.store.studentAction(saved.id, { action:'ai', text, priority:raise ? want : null });
}

/* =====================================================================
   4. Demo data (inserted once, only when the database is empty)
   ===================================================================== */
function buildSeed() {
  const t = hrs => new Date(Date.now() - hrs * 36e5).toISOString();
  const U = (role, email, name) => ({ id:role + ':' + email, role, email, name, createdAt:t(24 * 30), lastLoginAt:t(24 * 3) });
  const sam = U('student', 'sam.spartan@sjsu.edu', 'Sam Spartan'), jordan = U('student', 'jordan.lee@sjsu.edu', 'Jordan Lee');
  const priya = U('student', 'priya.nair@sjsu.edu', 'Priya Nair'), alex = U('student', 'alex.kim@sjsu.edu', 'Alex Kim');
  const dev = U('worker', 'dev.patel@sjsu.edu', 'Dev Patel'), luis = U('worker', 'luis.romero@sjsu.edu', 'Luis Romero');
  const rosa = U('worker', 'rosa.nguyen@sjsu.edu', 'Rosa Nguyen'), tom = U('worker', 'tom.ibarra@sjsu.edu', 'Tom Ibarra');
  const placesIn = codes => [...new Set(codes.flatMap(c => BUILDING_AREAS[c].map(a => a.id)))];
  const dormCodes = BUILDINGS.filter(b => b.type === 'dorm').map(b => b.code);
  const prof = (u, buildings, places, categories) => ({ userId:u.id, buildings, places, categories, setupDone:true, updatedAt:t(24 * 20) });
  const profiles = [
    prof(dev,  ['CVA', 'CVB', 'CVC', 'CV2'], placesIn(['CVA', 'CVB', 'CVC', 'CV2']), ['plumbing', 'electrical', 'hvac', 'structure', 'other']),
    prof(luis, ['Joe West', 'Washburn', 'SVP'], placesIn(['Joe West', 'Washburn', 'SVP']), ['plumbing', 'electrical', 'hvac', 'structure', 'other']),
    prof(rosa, dormCodes, placesIn(dormCodes), ['furniture', 'cleaning', 'laundry', 'other']),
    prof(tom,  ['Macquarrie Hall', 'Sweeney Building', 'Clarke Hall'], placesIn(['Macquarrie Hall', 'Sweeney Building', 'Clarke Hall']), ['electrical', 'furniture', 'structure', 'other'])
  ];
  const ev = (type, age, who, extra) => ({ type, at:t(age), actorId:who.id, actorName:who.name, actorRole:who.role, visibility:'public', ...extra });
  const tomorrow = new Date(Date.now() + 864e5), eta = tomorrow.getFullYear() + '-' + String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + String(tomorrow.getDate()).padStart(2, '0');

  function rep(o) {
    const b = buildingByCode(o.building), a = areasFor(b).find(x => x.id === o.area);
    return {
      createdAt:t(o.age), updatedAt:t(o.upd == null ? o.age : o.upd), publicAt:t(o.upd == null ? o.age : o.upd), reporterId:o.by.id, reporterName:o.by.name,
      building:b.code, buildingName:b.name, area:o.area, areaLabel:areaLabel(b, a), category:o.cat,
      priority:suggestPriority(o.desc), prioritySource:'auto', status:o.status || 'new', unit:o.unit || '', floor:o.floor || '', detail:o.detail || '', description:o.desc, photo:null,
      entry:o.entry || null, assigneeId:o.who ? o.who.id : null, assigneeName:o.who ? o.who.name : null, eta:o.eta || null, dupOf:null,
      awaitingStaff:!!o.awaiting, lastActorRole:o.last || 'student', resolvedAt:o.resolvedAt || null, confirmedAt:null
    };
  }
  const created = (o) => ev('created', o.age, o.by, { text:'Report saved.' });
  const R = (o, events) => ({ report:rep(o), events:[created(o), ...(events || [])] });

  const o1 = { age:96, upd:48, by:jordan, building:'CV2', area:'lounge', cat:'furniture', status:'acknowledged', who:rosa, last:'worker',
    desc:'Sample report (made-up demo data): the lounge couch cushions are torn. Can they be repaired or replaced?' };
  const o2 = { age:3, by:sam, building:'CV2', area:'room', cat:'hvac', unit:'812', floor:'', entry:'contact', awaiting:true,
    desc:'The air conditioner panel fell off. The screws were loose.' };
  const o3 = { age:30, by:priya, building:'Macquarrie Hall', area:'classroom', cat:'electrical', unit:'210', detail:'2nd floor', awaiting:true,
    desc:'Two ceiling lights are out and the outlet at the front desk is dead.' };
  const o4 = { age:20, by:alex, building:'CVB', area:'laundry', cat:'laundry', awaiting:true,
    desc:'Washer 108-QRS took my coins and never started.' };
  const o5 = { age:60, upd:5, by:jordan, building:'CVC', area:'kitchen', cat:'furniture', status:'in_progress', who:rosa, eta, last:'worker',
    desc:'The back left stove burner does not heat up.' };
  const o6 = { age:120, upd:96, by:alex, building:'Washburn', area:'bathroom', cat:'plumbing', floor:'2', detail:'West wing, by room 215', status:'acknowledged', who:luis, last:'worker',
    desc:'The sink keeps clogging and drains slowly.', entry:null };
  const o7 = { age:8, by:priya, building:'SVP', area:'lobby', cat:'structure', awaiting:true,
    desc:'The card reader at the main entrance sometimes does not unlock the door.' };
  const o8 = { age:80, upd:26, by:sam, building:'CVB', area:'hallway', cat:'electrical', floor:'4', detail:'Near the elevator', status:'resolved', who:dev, last:'worker', resolvedAt:t(26),
    desc:'The hallway light flickers.' };

  const reports = [
    R(o1, [ev('status', 48, rosa, { from:'new', to:'acknowledged' }), ev('assigned', 48, rosa, { to:rosa.name }),
           ev('message', 47, rosa, { text:'Thanks for reporting this. We are checking on a repair or a replacement.' })]),
    R(o2), R(o3), R(o4),
    R(o5, [ev('status', 50, rosa, { from:'new', to:'acknowledged' }), ev('assigned', 50, rosa, { to:rosa.name }),
           ev('status', 20, rosa, { from:'acknowledged', to:'in_progress' }), ev('eta', 5, rosa, { to:eta }),
           ev('message', 5, rosa, { text:'A replacement part is ordered. Please do not use that burner until it is fixed.' })]),
    R(o6, [ev('status', 100, luis, { from:'new', to:'acknowledged' }), ev('assigned', 100, luis, { to:luis.name }),
           ev('note', 96, luis, { text:'Snake the line and check the P-trap. Bring the long auger.', visibility:'staff' })]),
    R(o7),
    R(o8, [ev('status', 50, dev, { from:'new', to:'in_progress' }), ev('assigned', 50, dev, { to:dev.name }),
           ev('status', 26, dev, { from:'in_progress', to:'resolved' }), ev('message', 26, dev, { text:'Replaced the bulb and the starter.' })])
  ];
  return { users:[sam, jordan, priya, alex, dev, luis, rosa, tom], profiles, reports };
}

/* =====================================================================
   5. App state, session, navigation
   ===================================================================== */
const app = { store:null, mode:'', config:null, isAdmin:false, isTriage:false, user:null, profile:null, tab:null, open:null, prevCount:null, ready:null, loginRole:null };
const stack = [];                                  // screen history for Back
const activeScreen = () => document.querySelector('.screen.active').id;

/* The session stays until the person logs out. */
const SESSION_KEYS = { server:'eaiser.session.v2', device:'eaiser.session.device.v1' };   // the two kinds never mix
const sessionKey = which => SESSION_KEYS[which || (app.mode === 'server' ? 'server' : 'device')];
let memSession = null;
// Stored data is never trusted. A session is used only if it has exactly the shape we wrote.
const validSession = v => !!v && typeof v === 'object' && (v.role === 'student' || v.role === 'worker') && typeof v.email === 'string' &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) && typeof v.name === 'string' && v.id === v.role + ':' + v.email &&
  (v.token == null || /^sf_[A-Za-z0-9_-]{20,80}$/.test(v.token));
const session = {
  get(which) {
    let v = memSession;
    try { const raw = localStorage.getItem(sessionKey(which)); if (raw) v = JSON.parse(raw); } catch (e) { /* storage blocked or corrupt */ }
    if (!validSession(v)) return null;
    const server = (which || (app.mode === 'server' ? 'server' : 'device')) === 'server';
    return server === !!v.token ? v : null;                          // a server sign-in carries a token, a device sign-in never does
  },
  set(v) { memSession = v; try { localStorage.setItem(sessionKey(), JSON.stringify(v)); } catch (e) { /* storage blocked */ } },
  clear() { memSession = null; try { localStorage.removeItem(sessionKey()); } catch (e) { /* ignore */ } }
};
/* Which updates a student has already looked at. */
const memSeen = {};
function getSeen() {
  try { return JSON.parse(localStorage.getItem('eaiser.seen.' + app.user.id)) || {}; } catch (e) { return memSeen[app.user.id] || {}; }
}
function markSeen(r) {
  const s = getSeen(); s[r.id] = [r.publicAt || r.updatedAt, r.tracking && r.tracking.changedAt].filter(Boolean).sort().pop(); memSeen[app.user.id] = s;
  try { localStorage.setItem('eaiser.seen.' + app.user.id, JSON.stringify(s)); } catch (e) { /* ignore */ }
}
// publicAt moves only when the student could see the change. A staff-only note must not light up the badge.
const isUnread = (r, seen) => (r.lastActorRole === 'worker' && (r.publicAt || r.updatedAt) > (seen[r.id] || '')) || !!(r.tracking && r.tracking.changedAt && r.tracking.changedAt > (seen[r.id] || ''));

const RENDER_ON_SHOW = { 's-mine':() => renderMine(), 's-tickets':() => renderTickets() };
function show(id) {
  const same = activeScreen() === id;              // true when a screen is only being redrawn, for example by a live update
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  $('back').hidden = stack.length === 0;
  $('topbar').hidden = id === 's-landing';
  $('main').classList.toggle('wide', !!app.user && app.user.role === 'worker');
  if (!same) {
    window.scrollTo(0, 0);
    const heading = $(id).querySelector('h1');     // focus moves to the new screen's title so screen readers announce it
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll:true }); }
  }
  if (RENDER_ON_SHOW[id]) RENDER_ON_SHOW[id]().catch(failSoft);
}
function go(id, replace) {
  const cur = activeScreen();
  if (!replace && cur !== id) stack.push(cur);
  show(id);
}
function back() { if (stack.length) show(stack.pop()); }
function failSoft(e) {
  console.error(e);
  if (e instanceof ApiError) {
    if (e.status === 401) return;                                            // the sign-out message is already on its way
    if (e.status === 0) return toast('You are offline, or the server is not answering. Check your connection and try again.');
    if (e.status === 429) return toast(e.message);
    if (e.status >= 400 && e.status < 500) return toast(e.message);          // the server's own words: "That report is closed", "No access"
  }
  toast('Something went wrong. Please try again.');
}

function buildNav() {
  const inner = clear($('nav-inner'));
  const tabs = app.user.role === 'student' ? [{ id:'report', label:'Report' }, { id:'mine', label:'My reports' }] : [{ id:'tickets', label:'Tickets' }];
  for (const t of tabs) {
    inner.append(h('button', { class:'tab', type:'button', 'data-tab':t.id, onclick:() => openTab(t.id) }, t.label,
      h('span', { class:'badge', id:'badge-' + t.id, hidden:true })));
  }
  inner.append(h('button', { class:'profile-btn', type:'button', 'aria-label':'Profile and log out', onclick:openProfile },
    avatar(app.user.email, app.user.name)));
  const tag = $('who-tag'); tag.textContent = app.user.role === 'student' ? 'Student' : 'Staff'; tag.hidden = false;
  $('nav').hidden = false;
}
function setTab(id) {
  app.tab = id;
  document.querySelectorAll('.tab').forEach(b => { if (b.dataset.tab === id) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
}
function openTab(id) {
  stack.length = 0; setTab(id);
  if (id === 'report') { $('b-search').value = ''; renderBuildings(); show('s-building'); }       // the draft is kept, so a stray tap never loses typing
  else if (id === 'mine') show('s-mine');
  else if (id === 'tickets') show('s-tickets');
}

/* ---------- Sign-in ----------
   Real use: Google (SJSU account) and/or an emailed code, checked by the server. Demo use: any @sjsu.edu address, no password.
   The server decides which of these exist (GET /api/config); the page only shows what is on offer. */
const domainsOf = () => (app.config && app.config.domains && app.config.domains.length ? app.config.domains : ['sjsu.edu']);
const emailOkClient = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && domainsOf().includes(e.split('@')[1]);
const demoOffered = () => app.mode !== 'server' || !!(app.config && app.config.demo);

function openLogin(role) {
  app.loginRole = role;
  const cfg = app.config || {}, server = app.mode === 'server', google = server && !!cfg.google, code = server && !!cfg.emailCode, demo = demoOffered();
  $('h-login').textContent = role === 'student' ? 'Student sign in' : 'Worker / Faculty sign in';
  const info = clear($('login-info'));
  if (demo) {
    info.append(h('b', {}, 'Demo sign-in. '), 'There is no password and no real SJSU account is checked. ', h('b', {}, 'Do not enter your real SJSU password. '), 'Any @' + domainsOf()[0] + ' address works.' +
      (server ? '' : ' Everything you do is saved on this device only.'));
  } else {
    info.append('Sign in with your @' + domainsOf()[0] + ' account.' + (role === 'worker' ? ' Staff accounts are added by a SpartanFix admin. If you cannot get in, ask them to add your email.' : ''));
  }
  $('google-box').hidden = !google; $('code-form').hidden = !code; $('demo-block').hidden = !demo;
  $('login-email').value = ''; $('login-msg').textContent = ''; $('code-email').value = ''; $('code-input').value = ''; $('code-msg').textContent = '';
  $('code-step').hidden = true; $('code-go').textContent = 'Email me a code'; $('code-email').disabled = false;
  const box = clear($('demo-accounts'));
  if (demo) {
    const demos = role === 'student'
      ? [{ email:'sam.spartan@sjsu.edu', sub:'Has a fixed report to confirm' }]
      : [{ email:'dev.patel@sjsu.edu', sub:'Maintenance, already set up' }, { email:'maria.lopez@sjsu.edu', sub:'New staff, shows the first-login setup' }];
    for (const d of demos) {
      box.append(h('button', { class:'card', type:'button', onclick:() => doLogin(role, d.email) },
        h('div', { class:'demo' }, avatar(d.email, nameFromEmail(d.email), 'sm'),
          h('div', {}, h('b', {}, nameFromEmail(d.email)), h('div', { class:'muted' }, d.email + ' • ' + d.sub)))));
    }
  }
  go('s-login');
  if (google) setupGoogle();
  const first = demo ? $('login-email') : code ? $('code-email') : null;
  if (first) first.focus();
}

/* Google's own button. The page never sees a password; it only passes Google's signed proof to our server, which checks it. */
let gisReady = false;
function loadGis() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.accounts && window.google.accounts.id) return resolve();
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.onload = () => resolve(); s.onerror = () => reject(new Error('Google script blocked'));
    document.head.append(s);
  });
}
async function setupGoogle() {
  try {
    await loadGis();
    if (!gisReady) {
      window.google.accounts.id.initialize({ client_id:app.config.google, hd:domainsOf()[0], callback:r => signInWith(() => app.store.googleSignIn(app.loginRole, r.credential), $('login-msg')) });
      gisReady = true;
    }
    window.google.accounts.id.renderButton(clear($('google-btn')), { theme:'outline', size:'large', text:'signin_with', shape:'pill', width:280 });
  } catch (e) {
    console.warn(e);
    $('google-box').hidden = true;
    $('login-msg').textContent = 'Google sign-in could not load here.' + (app.config.emailCode ? ' Use an emailed code instead.' : '');
  }
}

let signingIn = false;
async function signInWith(fn, msgEl) {
  if (signingIn) return;                                               // ignore a second tap while the first is working
  signingIn = true; msgEl.textContent = '';
  try {
    await app.ready;
    await finishSignIn(await fn());
  } catch (e) {
    console.error(e);
    msgEl.textContent = e instanceof ApiError ? e.message : 'Could not sign in. Please try again.';
  } finally { signingIn = false; }
}
async function finishSignIn(res) {
  app.user = res.user;
  session.set({ id:res.user.id, role:res.user.role, email:res.user.email, name:res.user.name, token:res.token || undefined });
  await enterApp();
}
async function doLogin(role, rawEmail) {
  const email = String(rawEmail).trim().toLowerCase();
  if (!emailOkClient(email)) { $('login-msg').textContent = 'Use your @' + domainsOf()[0] + ' email address.'; return; }
  await signInWith(() => app.store.demoSignIn(role, email), $('login-msg'));
}
// Emailed code: first tap sends it, second tap checks it.
async function doCode() {
  const email = $('code-email').value.trim().toLowerCase(), msg = $('code-msg');
  if (!emailOkClient(email)) { msg.textContent = 'Use your @' + domainsOf()[0] + ' email address.'; return; }
  if ($('code-step').hidden) {
    if (signingIn) return; signingIn = true; msg.textContent = '';
    try {
      await app.store.emailStart(email);
      $('code-step').hidden = false; $('code-email').disabled = true; $('code-go').textContent = 'Sign in'; $('code-input').focus();
      msg.textContent = ''; toast('Code sent. Check your inbox.');
    } catch (e) { msg.textContent = e instanceof ApiError ? e.message : 'Could not send the code.'; }
    finally { signingIn = false; }
    return;
  }
  const code = $('code-input').value.replace(/\s/g, '');
  if (!/^\d{6}$/.test(code)) { msg.textContent = 'Enter the 6-digit code from the email.'; return; }
  await signInWith(() => app.store.emailVerify(app.loginRole, email, code), msg);
}

async function enterApp() {
  const me = await app.store.me();                                   // the server says who this is and whether the sign-in is still good
  app.user = me.user; app.isAdmin = !!me.isAdmin; app.isTriage = !!me.isTriage;
  applyPrefs(userPrefs(app.user.id));                                // this person's look comes with them
  buildNav(); stack.length = 0; app.prevCount = null;
  tix.tab = 'open'; tix.q = ''; $('tix-search').value = '';        // a new person never inherits the last person's filters
  if (app.user.role === 'student') { openTab(livePrefs.start === 'mine' ? 'mine' : 'report'); }
  else {
    tix.tab = ['open', 'mine', 'done'].includes(livePrefs.start) ? livePrefs.start : 'open';
    app.profile = me.profile || null;
    if (!app.profile || !app.profile.setupDone) openSetup(true); else openTab('tickets');
  }
  refreshBadges().catch(() => {});
}

function signedOutUi() {
  closeProfile();
  session.clear();
  app.user = null; app.profile = null; app.tab = null; app.open = null; app.prevCount = null; app.isAdmin = false; app.isTriage = false;
  stack.length = 0; resetDraft();
  applyPrefs(devicePrefs());
  $('nav').hidden = true; $('who-tag').hidden = true;
  show('s-landing');
}
function logout() { const store = app.store; signedOutUi(); store.signOut().catch(() => {}); }
// The server said the sign-in is no longer good (expired, or staff access removed).
function forceSignOut(why) {
  if (!app.user) return;
  app.store.setToken(null);
  signedOutUi();
  toast(why || 'Please sign in again.');
}

/* ---------- Settings: look, text size and where the app opens ----------
   Saved per person on this device. On the signed-out screens, the last theme and text size used on this device apply. */
const PREF_DEFAULTS = { theme:'system', text:'standard', contrast:'normal', motion:'system', start:'' };
const PREF_ALLOWED = { theme:['system', 'light', 'dark'], text:['standard', 'large', 'xlarge'], contrast:['normal', 'high'], motion:['system', 'reduce'],
  start:['', 'report', 'mine', 'open', 'done'] };
const memPrefs = {};
const prefIO = {
  get(k) { try { const r = localStorage.getItem(k); if (r !== null) return JSON.parse(r); } catch (e) { /* blocked or corrupt */ } return memPrefs[k] || null; },
  set(k, v) { memPrefs[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked, kept in memory */ } }
};
// Stored data is never trusted: every field must be one of the known values.
const cleanPrefs = raw => { const o = raw && typeof raw === 'object' ? raw : {}, out = {};
  for (const k of Object.keys(PREF_DEFAULTS)) out[k] = PREF_ALLOWED[k].includes(o[k]) ? o[k] : PREF_DEFAULTS[k];
  return out; };
const devicePrefs = () => cleanPrefs(prefIO.get('spartanfix.device.v1'));
// A person who has never changed a setting gets the defaults (theme System, so a dark device is still dark). Nobody inherits the last person's choices.
const userPrefs = id => cleanPrefs(prefIO.get('spartanfix.prefs.' + id));
const darkQuery = (() => { try { return window.matchMedia('(prefers-color-scheme: dark)'); } catch (e) { return null; } })();
let livePrefs = { ...PREF_DEFAULTS };
function applyPrefs(p) {
  livePrefs = p;
  const root = document.documentElement;
  const theme = p.theme === 'system' ? (darkQuery && darkQuery.matches ? 'dark' : 'light') : p.theme;
  root.dataset.theme = theme; root.dataset.text = p.text; root.dataset.contrast = p.contrast; root.dataset.motion = p.motion;
  const meta = $('meta-theme'); if (meta) meta.content = theme === 'dark' ? '#07172e' : '#0b2545';
}
if (darkQuery) { const again = () => { if (livePrefs.theme === 'system') applyPrefs(livePrefs); };
  if (darkQuery.addEventListener) darkQuery.addEventListener('change', again); else if (darkQuery.addListener) darkQuery.addListener(again); }
function setPref(key, value) {
  if (!PREF_ALLOWED[key].includes(value)) return;
  const next = { ...livePrefs, [key]: value };
  applyPrefs(next);
  if (app.user) prefIO.set('spartanfix.prefs.' + app.user.id, next);
  if (key !== 'start') prefIO.set('spartanfix.device.v1', { ...devicePrefs(), [key]: value });   // signed-out screens keep the last look
}
const THEME_LABEL = { system:'System', light:'Light', dark:'Dark' };
function openSettings() {
  closeProfile();
  const u = app.user, body = clear($('settings-body'));
  $('settings-sub').textContent = 'Saved for ' + u.name + ' on this device. Changes apply right away.';
  const choice = (key, options, label) => {
    const seg = h('div', { class:'seg', role:'group', 'aria-label':label });
    const paint = () => seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === livePrefs[key])));
    for (const [v, text] of options) seg.append(h('button', { type:'button', 'data-v':v, onclick:() => { setPref(key, v); paint(); } }, text));
    paint(); return seg;
  };
  const toggle = (key, on, off, label, hint) => {
    const box = h('input', { type:'checkbox', id:'pref-' + key });
    box.checked = livePrefs[key] === on;
    box.addEventListener('change', () => setPref(key, box.checked ? on : off));
    return h('div', {}, h('label', { class:'check', for:'pref-' + key }, box, label), hint ? h('p', { class:'muted small' }, hint) : null);
  };
  const isStudent = u.role === 'student';
  const startOptions = isStudent ? [['report', 'Report a problem'], ['mine', 'My reports']] : [['open', 'Open'], ['mine', 'Mine'], ['done', 'Done']];
  if (!startOptions.some(([v]) => v === livePrefs.start)) livePrefs = { ...livePrefs, start:startOptions[0][0] };
  body.append(
    h('div', { class:'setting' }, h('h2', {}, 'Appearance'),
      h('p', { class:'muted' }, 'System follows your phone or computer.'),
      choice('theme', Object.entries(THEME_LABEL), 'Theme')),
    h('div', { class:'setting' }, h('h2', {}, 'Text size'),
      choice('text', [['standard', 'Standard'], ['large', 'Large'], ['xlarge', 'Extra large']], 'Text size'),
      h('div', { class:'preview' }, 'Sample: The sink in CV2 keeps running.')),
    h('div', { class:'setting' }, h('h2', {}, 'Accessibility'),
      toggle('contrast', 'high', 'normal', 'Higher contrast', 'Stronger borders and darker secondary text.'),
      toggle('motion', 'reduce', 'system', 'Reduce motion', 'Turns off sliding and fading. Off means follow your device setting.')),
    h('div', { class:'setting' }, h('h2', {}, isStudent ? 'Open the app on' : 'Open tickets on'),
      choice('start', startOptions, 'Starting view')),
    h('button', { class:'link', type:'button', onclick:() => { const keep = u.role; setPref('theme', 'system'); setPref('text', 'standard'); setPref('contrast', 'normal');
      setPref('motion', 'system'); setPref('start', keep === 'student' ? 'report' : 'open'); openSettings(); toast('Settings reset'); } }, 'Reset to defaults'));
  go('s-settings');
}

/* ---------- Profile sheet (bottom right of the bar) ---------- */
function openProfile() {
  const u = app.user, card = clear($('sheet-card'));
  const demoOn = !!(app.config && app.config.demo);
  const modeText = app.mode === 'server'
    ? 'Shared database. Every device sees the same reports.' + (demoOn ? ' Demo sign-in is on, so anyone can sign in as anyone.' : '')
    : app.mode === 'device' ? 'Device-only demo. Reports are saved in this browser and nobody else can see them.'
    : 'Temporary memory only. Reports are lost when this page closes.';
  card.append(
    h('div', { class:'who' }, avatar(u.email, u.name, 'big'),
      h('div', {}, h('b', {}, u.name), h('span', { class:'muted' }, u.email), h('div', {}, h('span', { class:'tag st-new' }, u.role === 'student' ? 'Student' : 'Worker / Faculty')))),
    h('p', { class:'muted' }, modeText));
  if (u.role === 'worker' && app.profile) {
    card.append(h('div', { class:'info' }, h('b', {}, 'Your area'), h('div', {}, scopeSummary(app.profile))),
      h('button', { class:'secondary block', type:'button', onclick:() => { closeProfile(); openSetup(false); } }, 'Edit my buildings and places'));
  }
  const canReset = app.mode !== 'server' || (demoOn && u.role === 'worker');          // on a real server there is nothing to reset
  const resetBtn = canReset ? h('button', { class:'danger', type:'button' }, 'Reset demo data') : null;
  if (resetBtn) resetBtn.addEventListener('click', () => {
    if (resetBtn.dataset.sure !== '1') { resetBtn.dataset.sure = '1'; resetBtn.textContent = 'Tap again to erase all reports and restore the demo'; return; }
    resetDemo().catch(failSoft);
  });
  card.append(h('button', { class:'secondary block mt', type:'button', onclick:openSettings }, 'Settings'),
    app.isAdmin ? h('button', { class:'secondary block mt', type:'button', onclick:() => { closeProfile(); openStaffAdmin().catch(failSoft); } }, 'Staff list and backups') : null,
    resetBtn,
    h('button', { class:'primary', type:'button', onclick:logout }, 'Log out'),
    h('button', { class:'link block', type:'button', onclick:closeProfile }, 'Close'));
  profileReturn = document.activeElement;
  $('sheet').hidden = false;
  card.querySelector('.primary').focus();
}
let profileReturn = null;
function closeProfile() {
  const wasOpen = !$('sheet').hidden;
  $('sheet').hidden = true;
  if (wasOpen && profileReturn && document.contains(profileReturn)) profileReturn.focus();   // hand focus back to where it was
  profileReturn = null;
}
async function resetDemo() {
  await app.store.demoReset(buildSeed());
  closeProfile(); toast('Demo data restored'); await enterApp();
}
function scopeSummary(p) {
  const nb = p.buildings.length, np = p.places.length;                       // (building codes are shown by bShort)
  const nc = p.categories.filter(c => CAT[c]).length;
  return (nb > 4 ? nb + ' buildings' : p.buildings.map(bShort).join(', ')) + ' • ' + np + ' place' + (np === 1 ? '' : 's') +
    ' • ' + (nc >= CATEGORIES.length ? 'all issue types' : nc + ' issue types');
}

/* =====================================================================
   6. Student: report a problem
   ===================================================================== */
const state = { building:null, place:null, fromAI:false, photo:null, photoUrl:null, category:null, catManual:false, draftId:1, submitting:false };
const currentArea = () => areasFor(BUILDINGS[state.building]).find(x => x.id === state.place);

// Photos are off for private spaces (area flag) or when the description mentions one (text check).
const DEFAULT_PHOTO_NOTE = 'Photograph only the damage. Keep people, faces, ID cards, screens and personal belongings out of frame.';
const MAX_SIDE = 1280;

function makeOpt(title, sub, onclick, extraClass) {
  const btn = h('button', { type:'button', class:'opt' + (extraClass ? ' ' + extraClass : '') }, title, sub ? h('small', {}, sub) : null);
  btn.addEventListener('click', onclick);
  return btn;
}

// Going back, picking the same place again or using the helper never throws the report away. Only a send or "Discard this draft" starts a new one.
// Picking a different place keeps the description and the issue type, and clears only what belonged to the old place.
function resetLocationFields(area, sameBuilding) {
  if (!sameBuilding || !area || !area.unit) $('unit').value = '';
  if (!sameBuilding || !area || !area.floor) $('floor').value = '';
  $('detail').value = ''; $('entry-ok').checked = false; $('form-msg').textContent = '';
}
function pickBuilding(i) {
  if (i !== state.building) { state.building = i; state.place = null; resetLocationFields(null, false); }
  state.fromAI = false; $('area-note').hidden = true; openAreas();
}
function renderBuildings() {
  const el = clear($('building-list'));
  const q = $('b-search').value.trim();
  const near = sdkState.hintIndex;
  const hits = new Set(searchBuildings(q));
  if (!q && near !== null && BUILDINGS[near]) {
    el.append(h('div', { class:'suggest' }, h('span', {}, 'You look to be at ' + bShort(BUILDINGS[near]) + '.'),
      h('button', { class:'secondary', type:'button', onclick:() => pickBuilding(near) }, 'Use ' + bShort(BUILDINGS[near]))));
  }
  let lastGroup = null, shown = 0;
  BUILDINGS.forEach((b, i) => {
    if (!hits.has(i)) return;
    shown += 1;
    if (b.group !== lastGroup) { el.append(h('div', { class:'group' }, b.group)); lastGroup = b.group; }
    el.append(makeOpt(bShort(b), b.type === 'dorm' ? b.name : null, () => pickBuilding(i), 'plate' + (i === near ? ' near' : '')));
  });
  if (!shown) el.append(h('p', { class:'empty' }, 'No building matches "' + q + '". Try a code like CV2, or a name like Clark Hall, or tap Ask AI.'));
  el.append(makeOpt('Unsure which section? Ask AI', null, openAssist, 'ask'));
}

function openAreas(replace) {
  const b = BUILDINGS[state.building];
  $('area-sub').textContent = bShort(b) + (b.type === 'dorm' ? ' • ' + b.name : '');
  const el = clear($('area-list'));
  let lastGroup = null;
  for (const a of areasFor(b)) {
    if (a.g !== lastGroup) { el.append(h('div', { class:'group' }, GROUP_LABEL[a.g])); lastGroup = a.g; }
    el.append(makeOpt(areaLabel(b, a), a.hint, () => { if (state.place !== a.id) { state.place = a.id; resetLocationFields(a, true); } state.fromAI = false; openDetails(); }));
  }
  el.append(makeOpt('Unsure which section? Ask AI', null, openAssist, 'ask'));
  go('s-area', replace);
}

/* Ask AI: keyword stub. Swap runAssist() for a real model call later. */
const assistCtx = { fixed:null };                       // the building the student already chose, if any
function openAssist() {
  assistCtx.fixed = activeScreen() === 's-building' ? null : state.building;       // from the building list nothing is chosen yet
  const box = $('assist-text');
  if (!box.value.trim() && $('what').value.trim()) box.value = $('what').value;      // carry on with the same description
  $('assist-msg').textContent = ''; go('s-assist');
}
/* Pick a place from the words only when it is clear. Strong words (kitchen, shower, elevator) must match exactly one place in this
   building; weak words (sink, desk) are used only when nothing matches strongly. Two candidates means no guess: the student picks. */
function guessArea(b, text) {
  const list = areasFor(b).filter(a => a.kw);
  const strong = list.filter(a => a.kw.test(text));
  if (strong.length > 1) {                                                                        // two places match: a place the words name outright beats a generic word
    const named = strong.filter(a => (a.explicit && a.explicit.test(text)) || (a.named && a.kw.test(text)));
    return named.length === 1 ? named[0] : null;
  }
  if (strong.length) return strong[0];
  const weak = list.filter(a => a.kw2 && a.kw2.test(text));
  return weak.length === 1 ? weak[0] : null;
}
const mentionsPlace = text => Object.values(TPL).some(t => (t.kw && t.kw.test(text)) || (t.kw2 && t.kw2.test(text)));
function runAssist() {
  const text = $('assist-text').value.trim();
  if (!text) { $('assist-msg').textContent = 'Type a few words about the problem first.'; return; }
  // Nothing in the draft changes until there is something to suggest. A building the student already chose is never replaced by one named in the words.
  const fixed = assistCtx.fixed;
  const bi = fixed !== null ? fixed : findBuildingInText(text);
  const b = bi !== null && bi >= 0 ? BUILDINGS[bi] : null;
  const hit = b ? guessArea(b, text) : null;
  const useful = hit || (b && fixed === null) || mentionsPlace(text);
  if (!useful && ($('what').value.trim() || !b)) { $('assist-msg').textContent = 'Could not tell yet. Mention the building or what is broken.'; return; }     // nothing in the draft is touched
  $('what').value = text;
  if (b && bi !== state.building) { state.building = bi; state.place = null; resetLocationFields(null, false); }
  state.fromAI = true;
  if (!b) { stack.length = 0; show('s-building'); return; }
  if (hit && hit.id !== state.place) { state.place = hit.id; resetLocationFields(hit, true); }
  $('area-note').hidden = true;
  if (!hit) {
    const missing = Object.entries(TPL).filter(([id, t]) => t.kw && t.kw.test(text) && !areasFor(b).some(a => a.id === id)).map(([, t]) => t.label.toLowerCase());
    if (missing.length) { $('area-note').textContent = bShort(b) + ' has no ' + missing[0] + ' in the list. Please pick the place yourself, or Other place.'; $('area-note').hidden = false; }
    openAreas(true); return;
  }
  openDetails(true);
}

/* ---------- Type of problem (decides which team gets it) ---------- */
const areaCats = () => { const a = state.building !== null && state.place ? currentArea() : null; return ((a && a.cats) || CATEGORIES.map(c => c.id)).map(id => CAT[id]); };
const formRoute = () => routeFor({ building:state.building !== null ? BUILDINGS[state.building].code : '', area:state.place, category:state.category });
function renderCatChips() {
  const el = clear($('cat-chips'));
  for (const c of areaCats()) {
    el.append(h('button', { type:'button', class:'chip' + (state.category === c.id ? ' sel' : ''), 'aria-pressed':String(state.category === c.id),
      onclick:() => { state.category = c.id; state.catManual = true; renderCatChips(); updateItNote(); } }, catText(c.id, state.building !== null ? BUILDINGS[state.building].code : '')));
  }
  const rt = state.category ? formRoute() : null;
  $('cat-hint').textContent = rt
    ? (state.catManual ? '' : 'Suggested from your description. ') + 'Usually handled by: ' + rt.team + '.' + (rt.kind === 'maintenance' || rt.kind === 'custodial' ? '' : ' ' + rt.how) + (state.catManual ? '' : ' Tap another to change it.')
    : 'Pick the closest match so staff can sort it. Nothing fits? Pick Other or skip this.';
}
const updateItNote = () => { $('it-note').hidden = state.category !== 'tech'; };
function autoCategory() {
  if (state.catManual) return;
  const a = currentArea();
  state.category = suggestCategory($('what').value, state.place, a && a.cats);
  renderCatChips(); updateItNote();
}

/* ---------- Photo handling ---------- */
// Every photo, taken or uploaded, is redrawn on a canvas and saved as a new JPEG.
// That drops EXIF metadata such as GPS location and shrinks the file.
function toJpeg(source, w, h) {
  const scale = Math.min(1, MAX_SIDE / Math.max(w, h));
  const c = document.createElement('canvas');
  c.width = Math.round(w * scale); c.height = Math.round(h * scale);
  c.getContext('2d').drawImage(source, 0, 0, c.width, c.height);
  return new Promise((res, rej) => c.toBlob(b => b ? res(b) : rej(new Error('encode failed')), 'image/jpeg', 0.8));
}
async function cleanPhoto(file) {
  const bmp = await createImageBitmap(file, { imageOrientation:'from-image' });
  try { return await toJpeg(bmp, bmp.width, bmp.height); } finally { if (bmp.close) bmp.close(); }
}
function clearPhoto(msg) {
  if (state.photoUrl) URL.revokeObjectURL(state.photoUrl);
  state.photo = null; state.photoUrl = null;
  $('photo').value = ''; $('photo-ok').checked = false;
  $('photo-preview').hidden = true; $('photo-img').removeAttribute('src');
  $('photo-msg').textContent = msg || '';
  updateSubmit();
}
async function setPhoto(makeBlob) {
  const draft = state.draftId;
  try {
    const blob = await makeBlob();
    if (draft !== state.draftId || state.submitting) return;                                   // a different draft started while this picture was being read
    const a = state.building !== null && state.place ? currentArea() : null;
    if (a && a.noPhoto) { updatePhotoUI(); return; }                                             // the place changed to one where photos are off
    if (state.photoUrl) URL.revokeObjectURL(state.photoUrl);
    state.photo = blob; state.photoUrl = URL.createObjectURL(blob);
    $('photo-img').src = state.photoUrl;
    $('photo-ok').checked = false;                // confirm again for every new photo
    $('photo-preview').hidden = false; $('photo-msg').textContent = '';
  } catch (e) {
    // Never fall back to the original file: it may still carry location data.
    clearPhoto('Could not read that photo. Try another one.');
  }
  updateSubmit();
}
async function onPhotoPicked(e) {
  const input = e.target, f = input.files[0];
  if (!f) return;                                  // picker was cancelled, keep the current photo
  await setPhoto(() => cleanPhoto(f));
  input.value = '';
}

function updatePhotoUI() {
  if (state.building === null || !state.place) return;
  const a = currentArea(), byArea = !!a.noPhoto, byText = !byArea && SENSITIVE_TEXT.test($('what').value), blocked = byArea || byText;
  $('photo-block').hidden = blocked; $('no-photo').hidden = !blocked;
  if (blocked) {
    $('no-photo').textContent = (byArea
      ? 'Photos are turned off for bathrooms, restrooms and showers to protect everyone’s privacy. Describe the problem and where it is in words.'
      : 'Photos are turned off because your description mentions a bathroom or shower. Describe the problem in words instead.')
      + (state.photo ? ' The photo you added was removed.' : '');
    clearPhoto();
  } else $('photo-note').textContent = a.photoNote || DEFAULT_PHOTO_NOTE;
  updateSubmit();
}
// A photo can only be sent after the user confirms nobody or nothing private is in it.
function updateSubmit() { $('send').disabled = state.submitting || (!!state.photo && !$('photo-ok').checked); }

/* ---------- Details and submit ---------- */
function openDetails(replace) {
  const b = BUILDINGS[state.building], a = currentArea();
  $('summary').textContent = bShort(b) + ' • ' + areaLabel(b, a);
  $('ai-note').hidden = !state.fromAI;
  // Each place says what staff need in order to find it: a room / apartment / suite number, a floor, and a landmark or fixture.
  const req = f => f && f.req ? ' (required)' : '';
  $('unit-block').hidden = !a.unit; $('floor-block').hidden = !a.floor;
  for (const [k, v] of Object.entries(a.defaults || {})) if (!$(k).value) $(k).value = v;                 // a named place knows its floor
  if (a.unit) { $('unit-label').textContent = a.unit.label + req(a.unit); $('unit-hint').textContent = a.unit.hint || ''; $('unit-hint').hidden = !a.unit.hint; }
  if (a.floor) $('floor-label').textContent = a.floor.label + req(a.floor);
  document.querySelector('label[for=detail]').textContent = a.detail.label + req(a.detail);
  $('detail').placeholder = a.detail.ph;
  const note = a.g === 'mine' ? 'This space may be shared with ' + (a.id === 'room' ? 'roommates' : 'apartmentmates or suitemates') + '. Identify the affected fixture or part of the room.' : '';
  $('loc-note').textContent = note; $('loc-note').hidden = !note;
  $('sdk-note').hidden = !sdkReady();
  updateItNote();
  $('form-msg').textContent = '';
  if (state.catManual && state.category && areaCats().some(c => c.id === state.category)) renderCatChips();      // the student's own choice stays while it fits this place
  else { state.category = null; state.catManual = false; autoCategory(); }
  $('entry-block').hidden = !a.entry;                                    // only inside the person's own room or unit, never a shared space
  updatePhotoUI();
  go('s-details', replace);
}

/* ---------- Sending ----------
   One tap makes one attempt: the words, place, entry choice and photo are copied once, and the form is locked until the answer comes back.
   A retry of the same attempt (same content) reuses the same key, so the server hands back the report it already saved. The key is kept in this
   browser, so the same words sent again after a reload are recognised too. Changed content is a new attempt with a new key. */
const PENDING_KEY = 'eaiser.pending.v1';
const newKey = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'k' + Date.now() + Math.random().toString(36).slice(2);
function keyFor(userId, mode, fp) {
  try {
    const rec = JSON.parse(localStorage.getItem(PENDING_KEY) || 'null');
    if (rec && rec.u === userId && rec.m === mode && rec.fp === fp && Date.now() - rec.at < 864e5) return rec.key;
  } catch (e) { /* no storage: the key then lives only for this page */ }
  const key = newKey();
  try { localStorage.setItem(PENDING_KEY, JSON.stringify({ u:userId, m:mode, fp, key, at:Date.now() })); } catch (e) { /* ignore */ }
  return key;
}
const forgetKey = () => { try { localStorage.removeItem(PENDING_KEY); } catch (e) { /* ignore */ } };
function lockForm(on) {
  for (const el of document.querySelectorAll('#s-details input, #s-details textarea, #s-details button')) {
    if (on) { if (!el.disabled) { el.disabled = true; el.dataset.lockedBySend = '1'; } }
    else if (el.dataset.lockedBySend) { el.disabled = false; delete el.dataset.lockedBySend; }
  }
}
async function submitReport() {
  if (state.submitting) return;
  updatePhotoUI();                       // re-check in case the text changed after the photo was added
  if ($('send').disabled) return;
  const desc = $('what').value.trim();
  if (desc.length < 4) { $('form-msg').textContent = 'Describe the problem so the right person can fix it.'; return; }
  const b = BUILDINGS[state.building], a = currentArea();
  for (const [key, f] of [['unit', a.unit], ['floor', a.floor], ['detail', a.detail]]) {
    if (f && f.req && $(key).value.trim().length < (key === 'detail' ? 3 : 1)) {
      $('form-msg').textContent = key === 'detail' && a.id === 'other' ? 'Say where it is, so staff can find it.' : 'Add the ' + f.label.toLowerCase() + ', so staff can find it.';
      $(key).focus(); return;
    }
  }
  state.submitting = true; lockForm(true); updateSubmit(); $('form-msg').textContent = 'Sending...';     // before the first await: nothing can start a second attempt
  const run = { draft:state.draftId, store:app.store, user:app.user && app.user.id, mode:app.mode, photoBlob:state.photo, areaText:a.label, bld:b };
  try {
    const photo = state.photo ? await blobToDataUrl(state.photo) : null;
    const payload = {                                                                           // copied once; the attempt never reads the form again
      building:b.code, area:a.id, category:state.category || 'other', priority:suggestPriority(desc),
      unit:a.unit ? $('unit').value.trim() : '', floor:a.floor ? $('floor').value.trim() : '', detail:$('detail').value.trim(), description:desc, photo,
      entry:!$('entry-block').hidden ? ($('entry-ok').checked ? 'ok' : 'contact') : null
    };
    payload.idemKey = keyFor(run.user, run.mode, sendFingerprint(payload));
    // Who sent it, when, the names written down and the starting status are set by the server from the signed-in account, not by this page.
    const saved = await run.store.createReport(payload);
    if (app.store !== run.store || !app.user || app.user.id !== run.user) return;               // signed out or switched while waiting: this page is not theirs any more
    forgetKey();
    markSeen(saved);
    if (state.draftId !== run.draft) { toast('Report #' + saved.id + ' was saved. See My reports.'); return; }     // a different draft has been started since: leave it alone
    app.lastId = saved.id;
    if (!sdkSeen.has(saved.id)) { sdkSeen.add(saved.id); sdkFollowUp(saved, desc, run.bld, run.areaText, run.photoBlob).catch(e => console.warn('EAiSER follow-up skipped', e)); }   // once per report, never waits, never blocks
    // Say what really happened: only the shared server holds a report that staff on other devices can see.
    const shared = run.mode === 'server';
    $('h-done').textContent = 'Report #' + saved.id + ' saved';
    $('done').textContent = whereText(saved) + '. ' + (shared
      ? 'It is in the shared SpartanFix queue, where staff can read it. It is normally handled by ' + routeFor(saved).team + '. Nobody has acknowledged it yet, and this is not an official work order or a promise of a repair.'
      : 'Device-only demo: it is saved ' + (run.mode === 'memory' ? 'in temporary memory and is lost when this page closes' : 'in this browser only') + '. It has not been sent to ' + routeFor(saved).team + ' or anyone else.')
      + ' You will see updates under My reports.';
    state.submitting = false; resetDraft();                                  // sent, so the form starts empty next time
    go('s-done');
  } catch (e) {
    console.error(e);
    if (app.store !== run.store || !app.user || app.user.id !== run.user) return;
    if (e instanceof ApiError && e.status === 409) { forgetKey(); $('form-msg').textContent = e.message; }
    else if (e instanceof ApiError && e.status >= 400 && e.status < 500 && e.status !== 401 && e.status !== 408) { forgetKey(); $('form-msg').textContent = e.message; }   // the server said why: nothing was saved
    else $('form-msg').textContent = 'We could not confirm that your report was saved. Check My reports first. If it is not there, tap Send again. If you change nothing, it will not be saved twice.';
  } finally {
    if (state.submitting) { state.submitting = false; lockForm(false); updateSubmit(); }
  }
}

// Starts a new, empty draft. Only a sent report, "Discard this draft" or signing out gets here; going back does not.
function resetDraft() {
  state.draftId += 1; state.submitting = false;
  state.building = null; state.place = null; state.fromAI = false; state.category = null; state.catManual = false;
  lockForm(false);
  for (const id of ['unit', 'floor', 'detail', 'what', 'assist-text', 'b-search']) $(id).value = '';
  $('entry-ok').checked = false; $('form-msg').textContent = ''; $('it-note').hidden = true; $('area-note').hidden = true;
  clearPhoto();
  renderBuildings();
}

/* ---------- Timeline shared by students and workers ---------- */
// A status or type that staff typed themselves is stored in events as "other:their words".
const statusLabel = s => { const k = String(s == null ? '' : s); return k.startsWith('other:') ? (k.slice(6) || 'Other') : (STATUS[k] || { label:k }).label; };
const catName = k => { const t = String(k == null ? '' : k); return t.startsWith('other:') ? (t.slice(6) || 'Other') : (CAT[t] ? CAT[t].label : t); };
function eventText(ev, viewer) {
  const person = n => viewer === 'student' ? firstName(n) : n;
  switch (ev.type) {
    case 'created':   return ev.text && !/^report sent\.?$/i.test(ev.text) ? ev.text.replace(/\.$/, '') : 'Report saved';      // says where it was saved: the shared queue or this browser
    case 'status':    return 'Status: ' + statusLabel(ev.to);
    case 'priority':  return 'Priority: ' + (PRIORITY[ev.from] || PRIORITY.normal).label + ' to ' + (PRIORITY[ev.to] || PRIORITY.normal).label;
    case 'category':  return 'Type changed: ' + catName(ev.from) + ' to ' + catName(ev.to);
    case 'distinct':  return 'Marked #' + ev.to + ' as a different problem';
    case 'assigned':  return ev.to ? 'Assigned to ' + person(ev.to) : 'Unassigned';
    case 'eta':       return ev.to ? 'Planned fix date: ' + fmtDay(ev.to) : 'Planned fix date cleared';
    case 'duplicate': return viewer === 'student' ? 'Merged into report #' + ev.to + ', the same problem' : 'Merged into report #' + ev.to;
    case 'reopened':  return 'Reopened';
    case 'ai':        return 'AI summary';
    case 'confirmed': return 'Fix confirmed';
    default:          return '';
  }
}
function timeline(events, viewer) {
  const list = events.filter(e => viewer === 'worker' || e.visibility === 'public').slice().reverse();
  return h('ul', { class:'timeline' }, list.map(e => {
    const who = e.actorRole === 'system' ? 'AI assistant'
      : e.actorRole === 'student' ? (viewer === 'student' ? 'You' : e.actorName)
      : (viewer === 'student' ? firstName(e.actorName) : e.actorName);
    const line = eventText(e, viewer);
    return h('li', { class:e.visibility === 'staff' ? 'staff' : '' },
      h('div', { class:'ev-head' }, h('b', {}, who), ' • ' + fmtTime(e.at) + (e.visibility === 'staff' ? ' • Staff only' : '')),
      line ? h('div', {}, line) : null,
      e.text && e.type !== 'created' ? h('div', { class:'bubble' }, e.text) : null);
  }));
}

/* ---------- My reports ---------- */
async function renderMine() {
  const box = clear($('mine-list'));
  const mine = (await app.store.listReports()).filter(r => r.reporterId === app.user.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  if (!mine.length) { box.append(h('div', { class:'empty' }, 'No reports yet. Tap Report to send your first one.')); return; }
  const seen = getSeen();
  for (const r of mine) {
    box.append(h('button', { class:'card', type:'button', onclick:() => openMine(r.id).catch(failSoft) },
      h('div', { class:'t-top' }, h('b', {}, '#' + r.id + ' • ' + bShort(r.building) + ' • ' + r.areaLabel), h('span', { class:'muted' }, ago(r.updatedAt))),
      whereExtra(r) ? h('div', { class:'muted small' }, whereExtra(r)) : null,
      h('div', { class:'t-desc' }, r.description || '(no description)'),
      h('div', { class:'tags' }, h('span', { class:'tag st-' + r.status }, statusText(r)),
        isUnread(r, seen) ? h('span', { class:'tag dot' }, 'New update') : null)));
  }
}

async function openMine(id) {
  const [r, evs] = await Promise.all([app.store.getReport(id), app.store.listEvents(id)]);
  if (!r) { toast('That report no longer exists.'); return; }
  const draftMsg = app.open && app.open.id === r.id && $('student-msg') ? $('student-msg').value : '';   // keep what the student was typing
  app.open = { id:r.id, rev:r.rev };
  markSeen(r); refreshBadges().catch(() => {});
  const box = clear($('mine-body'));
  const photo = safePhoto(r.photo);
  box.append(
    h('div', { class:'t-head' }, h('h1', {}, 'Report #' + r.id), h('span', { class:'tag st-' + r.status }, statusText(r))),
    h('p', { class:'muted' }, whereText(r)),
    h('div', { class:'card' }, h('div', { class:'pre' }, r.description),
      photo ? h('img', { class:'thumb', src:photo, alt:'Photo you attached' }) : null),
    h('dl', { class:'facts' },
      h('dt', {}, 'Saved'), h('dd', {}, fmtTime(r.createdAt) + (app.mode === 'server' ? ' in the shared queue' : ' in this browser only')),
      h('dt', {}, 'Normally handled by'), h('dd', {}, routeFor(r).team + (app.mode === 'server' ? '' : ' (not sent to them in this demo)')),
      r.assigneeName ? [h('dt', {}, 'Assigned to'), h('dd', {}, firstName(r.assigneeName))] : null,
      r.eta ? [h('dt', {}, 'Planned fix'), h('dd', {}, fmtDay(r.eta))] : null));

  if (r.status === 'duplicate' && r.tracking) {
    const t = r.tracking, now = t.status === 'resolved' ? 'Resolved' + (t.resolvedAt ? ' on ' + fmtDay(t.resolvedAt.slice(0, 10)) : '') : t.status === 'other' && t.statusText ? t.statusText : statusLabel(t.status);
    box.append(h('div', { class:'info' }, h('b', {}, 'Staff are following this as report #' + t.id),
      h('p', { class:'muted' }, 'Yours described the same problem, so the two were merged. Where it stands now: ' + now + (t.eta && t.status !== 'resolved' ? '. Planned fix: ' + fmtDay(t.eta) : '') + '.'),
      h('p', { class:'muted small' }, 'This page updates as that report does. If the problem is still there after it is marked resolved, send a new report.')));
  }
  if (r.status === 'resolved' && !r.confirmedAt) {
    box.append(h('div', { class:'info' }, h('b', {}, 'Is it fixed?'), h('p', { class:'muted' }, 'Staff marked this resolved. Let them know if it is still broken.'),
      h('div', { class:'row' },
        h('button', { class:'secondary', type:'button', onclick:() => studentAction(r, 'confirm') }, 'Yes, it is fixed'),
        h('button', { class:'secondary', type:'button', onclick:() => studentAction(r, 'reopen') }, 'Still broken'))));
  } else if (r.status === 'resolved') {
    box.append(h('div', { class:'info' }, 'You confirmed this was fixed. Thank you.'));
  }
  if (isOpen(r)) {
    const msgBox = h('textarea', { id:'student-msg', maxlength:'1000', placeholder:'e.g. It is getting worse, or the best time to come by' });
    msgBox.value = draftMsg;
    box.append(h('label', { for:'student-msg' }, 'Add an update'), msgBox,
      h('p', { class:'msg', id:'student-msg-err', role:'status' }),
      h('button', { class:'primary', type:'button', onclick:() => studentAction(r, 'message') }, 'Send update'));
  }
  box.append(h('h2', { class:'mt-lg' }, 'History'), timeline(evs, 'student'));
  go('s-mine-detail', activeScreen() === 's-mine-detail');
}

let studentBusy = false;
async function studentAction(r, kind) {
  if (studentBusy) return;                                            // ignore a second tap while the first is saving
  studentBusy = true;
  try {
    if (kind === 'confirm') await app.store.studentAction(r.id, { action:'confirm' });
    else if (kind === 'reopen') await app.store.studentAction(r.id, { action:'reopen' });
    else {
      const text = $('student-msg').value.trim();
      if (!text) { $('student-msg-err').textContent = 'Type a message first.'; return; }
      await app.store.studentAction(r.id, { action:'message', text });
      $('student-msg').value = '';                                      // sent, so do not bring it back on the redraw
    }
    toast('Saved'); await openMine(r.id);
  } catch (e) {
    failSoft(e);
    if (e instanceof ApiError && e.status === 409) openMine(r.id).catch(() => {});   // the report changed under us: show what it looks like now
  } finally { studentBusy = false; }
}

/* =====================================================================
   7. Worker: setup, tickets, ticket form
   ===================================================================== */
const inScope = (r, p) => profileCovers(p, r, catKey(r));
const isAging = r => isOpen(r) && hoursSince(r.createdAt) > prio(r.priority).agingHours;

/* ---------- First login: which buildings and places? ---------- */
let setupSel = null;
function openSetup(first) {
  const p = app.profile || { buildings:[], places:[], categories:CATEGORIES.map(c => c.id) };
  setupSel = { buildings:new Set(p.buildings), places:new Set(p.places), categories:new Set(p.categories), first };
  $('h-setup').textContent = first ? 'Set up your area' : 'Edit your area';
  $('setup-sub').textContent = first
    ? 'Welcome, ' + firstName(app.user.name) + '. Tell us what you are responsible for. You will only see tickets that match.'
    : 'Change what you are responsible for. Your tickets update right away.';
  $('setup-msg').textContent = '';
  renderSetup();
  if (first) { stack.length = 0; setTab(null); show('s-setup'); } else go('s-setup');
}
function availablePlaces() {
  return PLACES.filter(p => [...setupSel.buildings].some(c => p.codes.has(c)));      // every place in at least one chosen building
}
function chipGroup(title, items, set, onToggle, all) {
  const row = h('div', { class:'chips' }, items.map(it => h('button', { type:'button', class:'chip' + (set.has(it.id) ? ' sel' : ''), 'aria-pressed':String(set.has(it.id)),
    onclick:() => { if (set.has(it.id)) set.delete(it.id); else set.add(it.id); onToggle(); } }, it.label)));
  const toggleAll = h('button', { type:'button', class:'link', onclick:() => {
    const every = items.every(i => set.has(i.id)); items.forEach(i => every ? set.delete(i.id) : set.add(i.id)); onToggle(); } },
    items.every(i => set.has(i.id)) ? 'Clear all' : (all || 'Select all'));
  return h('div', {}, h('div', { class:'head-row' }, h('h2', {}, title), toggleAll), row);
}
function renderSetup() {
  const places = availablePlaces();
  for (const id of [...setupSel.places]) if (!places.some(p => p.id === id)) setupSel.places.delete(id);   // drop places that no longer apply
  const box = clear($('setup-body'));
  box.append(
    chipGroup('1. Buildings', BUILDINGS.map(b => ({ id:b.code, label:bShort(b) })), setupSel.buildings, renderSetup),
    setupSel.buildings.size
      ? chipGroup('2. Places you take care of', places, setupSel.places, renderSetup)
      : h('div', {}, h('div', { class:'head-row' }, h('h2', {}, '2. Places you take care of')), h('p', { class:'muted' }, 'Pick at least one building first.')),
    chipGroup('3. Issue types', CATEGORIES.map(c => ({ id:c.id, label:c.label })), setupSel.categories, renderSetup),
    h('p', { class:'muted small' }, 'Pick Other place and Other to also get the reports that do not fit the lists. If nobody picks them, those reports have no one to see them.'));
}
async function saveSetup() {
  if (!setupSel.buildings.size) { $('setup-msg').textContent = 'Pick at least one building.'; return; }
  if (!setupSel.places.size) { $('setup-msg').textContent = 'Pick at least one place.'; return; }
  if (!setupSel.categories.size) { $('setup-msg').textContent = 'Pick at least one issue type.'; return; }
  try {
    app.profile = await app.store.saveProfile({ userId:app.user.id, buildings:[...setupSel.buildings], places:[...setupSel.places],
      categories:[...setupSel.categories], setupDone:true });
    toast('Saved. ' + scopeSummary(app.profile));
    openTab('tickets');
    refreshBadges().catch(() => {});
  } catch (e) { failSoft(e); }
}

/* ---------- Ticket list ---------- */
const tix = { tab:'open', q:'' };
function ticketCard(r) {
  return h('button', { class:'card pc-' + r.priority, type:'button', onclick:() => openTicket(r.id).catch(failSoft) },
    h('div', { class:'t-top' }, h('b', {}, '#' + r.id + ' • ' + bShort(r.building) + ' • ' + r.areaLabel), h('span', { class:'muted' }, ago(r.createdAt))),
    whereExtra(r) ? h('div', { class:'muted small' }, whereExtra(r)) : null,
    h('div', { class:'t-desc' }, r.description || '(no description)'),
    h('div', { class:'tags' },
      h('span', { class:'tag pr-' + (PRIORITY[r.priority] ? r.priority : 'normal') }, prio(r.priority).label),
      h('span', { class:'tag st-' + r.status }, statusText(r)),
      h('span', { class:'tag' }, r.assigneeName ? firstName(r.assigneeName) : 'Unassigned'),
      isAging(r) ? h('span', { class:'tag warn' }, 'Aging') : null,
      r.awaitingStaff && r.status !== 'new' ? h('span', { class:'tag dot' }, 'Student replied') : null,
      r.hasPhoto ? h('span', { class:'tag' }, 'Photo') : null));
}
async function renderTickets() {
  const p = app.profile;
  if (!p) return;
  const all = await app.store.listReports();
  const scoped = all.filter(r => inScope(r, p));
  const openList = scoped.filter(isOpen);
  /* Reports nobody's saved area covers are the triage coordinator's. Everyone else never sees this list. If the check itself fails, say so:
     an unanswered question must not turn every open report into an "unrouted" one. */
  let tri = null, triFailed = false;
  if (app.isTriage) { try { tri = await app.store.triage(); } catch (e) { triFailed = true; } }
  const byId = new Map(all.map(r => [r.id, r])), pick = ids => (ids || []).map(id => byId.get(id)).filter(Boolean);
  const unrouted = tri ? pick(tri.unrouted) : [];
  const mine = all.filter(r => r.assigneeId === app.user.id && isOpen(r));
  const done = scoped.filter(r => !isOpen(r));
  $('scope-line').textContent = scopeSummary(p);
  const stats = clear($('stats'));
  for (const [n, label] of [[openList.length, 'Open'], [openList.filter(r => r.priority === 'urgent').length, 'Urgent'],
    [openList.filter(r => !r.assigneeId).length, 'Unassigned'], [openList.filter(isAging).length, 'Aging']]) {
    stats.append(h('div', { class:'stat' + (n > 0 && (label === 'Urgent' || label === 'Aging') ? ' hot' : '') }, h('b', {}, n), h('span', {}, label)));
  }
  if (!app.isTriage && tix.tab === 'unrouted') tix.tab = 'open';
  const seg = clear($('tix-seg'));
  const tabs = [['open', 'Open', String(openList.length)], ['mine', 'Mine', String(mine.length)],
    ...(app.isTriage ? [['unrouted', 'Unrouted', triFailed ? '?' : String(unrouted.length)]] : []), ['done', 'Done', String(done.length)]];
  for (const [id, label, n] of tabs) {
    seg.append(h('button', { type:'button', 'aria-pressed':String(tix.tab === id), onclick:() => { tix.tab = id; renderTickets().catch(failSoft); } }, label + ' (' + n + ')'));
  }
  const q = tix.q.trim().toLowerCase();
  const match = r => ('#' + r.id + ' ' + r.building + ' ' + bFull(r.building) + ' ' + r.areaLabel + ' ' + r.description + ' ' + (r.unit || '') + ' ' + (r.floor || '') + ' ' + (r.detail || '') + ' ' + r.reporterName + ' ' + catLabel(r) + ' ' + statusText(r)).toLowerCase().includes(q);
  const order = tix.tab === 'done' ? (a, b) => b.updatedAt.localeCompare(a.updatedAt) : (a, b) => prio(a.priority).rank - prio(b.priority).rank || a.createdAt.localeCompare(b.createdAt);
  const box = clear($('tix-list'));

  if (tix.tab === 'unrouted') {
    if (triFailed) {
      box.append(h('div', { class:'note' }, h('b', {}, 'Could not check which reports have no one covering them. '), 'Nothing is shown as unrouted until this loads.',
        h('div', { class:'row' }, h('button', { class:'secondary', type:'button', onclick:() => renderTickets().catch(failSoft) }, 'Try again'))));
      return;
    }
    const section = (title, text, list) => {
      const rows = (q ? list.filter(match) : list).slice().sort(order);
      if (!list.length) return;
      box.append(h('h2', { class:'mt' }, title + ' (' + list.length + ')'), h('p', { class:'muted small' }, text));
      if (!rows.length) box.append(h('div', { class:'empty' }, 'No tickets match your search.'));
      for (const r of rows) box.append(ticketCard(r));
    };
    if (tri.noWorkers) box.append(h('div', { class:'note' }, 'No worker has saved an area yet, so every open report is unrouted. Workers set their area from their profile.'));
    section('No one covers these', 'No worker’s saved area includes this building, place and type, and nobody is assigned. You are the triage coordinator: open one and assign it, or ask a worker to add it to their area.', unrouted);
    section('Assigned, but outside the assignee’s area', 'Someone holds these, but their saved area no longer covers them. Other workers cannot take them. Reassign from the ticket if needed.', pick(tri.assignedElsewhere));
    section('From buildings outside SpartanFix', 'Kept as history from an earlier version. They are not routed to anyone.', pick(tri.historical));
    if (!box.children.length) box.append(h('div', { class:'empty' }, 'Every open report is covered by someone’s area.'));
    return;
  }

  let list = tix.tab === 'open' ? openList : tix.tab === 'mine' ? mine : done;
  if (q) list = list.filter(match);
  list = list.slice().sort(order);
  if (!list.length) {
    box.append(h('div', { class:'empty' }, q ? 'No tickets match your search.' : tix.tab === 'open' ? 'Nothing open for your area. Nice.' : tix.tab === 'mine' ? 'You have no open tickets assigned to you.' : 'No finished tickets yet.'));
    return;
  }
  for (const r of list) box.append(ticketCard(r));
}

/* ---------- Ticket detail and update form ---------- */
function mkSelect(id, options, value) {
  const s = h('select', { id }, options.map(o => h('option', { value:o.value }, o.label)));
  s.value = value; return s;
}
const field = (label, control, hint, id) => h('div', {}, h('label', { for:id }, label), control, hint ? h('p', { class:'muted small' }, hint) : null);

async function openTicket(id) {
  const [r, evs, all, workers] = await Promise.all([app.store.getReport(id), app.store.listEvents(id), app.store.listReports(), app.store.listWorkers()]);
  if (!r) { toast('That ticket no longer exists.'); return; }
  app.open = { id:r.id, rev:r.rev };
  const box = clear($('ticket-body')), cat = catOf(r), photo = safePhoto(r.photo);
  const liveBanner = h('div', { class:'live', id:'ticket-live', hidden:true }, h('span', {}, 'This ticket was just updated by someone else.'),
    h('button', { class:'secondary', type:'button', onclick:() => { stashStaffDraft(r.id); openTicket(r.id).catch(failSoft); } }, 'Refresh'));

  box.append(liveBanner,
    h('div', { class:'t-head' }, h('h1', {}, 'Ticket #' + r.id), h('span', { class:'tag pr-' + (PRIORITY[r.priority] ? r.priority : 'normal') }, prio(r.priority).label),
      h('span', { class:'tag st-' + r.status }, statusText(r)), isAging(r) ? h('span', { class:'tag warn' }, 'Aging') : null),
    h('p', { class:'muted' }, whereText(r)));
  if (r.awaitingStaff && r.status !== 'new') box.append(h('div', { class:'note' }, h('b', {}, 'The student replied or reopened this. '), 'Answer in the message box below.'));

  box.append(
    h('div', { class:'card' }, h('div', { class:'pre' }, r.description || '(no description)'),
      photo ? h('img', { class:'thumb', src:photo, alt:'Photo attached by the student' }) : null),
    h('dl', { class:'facts' },
      h('dt', {}, 'Reported'), h('dd', {}, fmtTime(r.createdAt) + ' (' + ago(r.createdAt) + ')'),
      h('dt', {}, 'Reporter'), h('dd', {}, r.reporterName),
      r.entry ? [h('dt', {}, 'Entry preference'), h('dd', {}, r.entry === 'ok' ? 'Okay to enter when the student is away. This is the reporter’s preference only, not confirmed for others who share the space.' : 'Contact the student before entering.')] : null,
      h('dt', {}, 'Type'), h('dd', {}, catLabel(r)),
      h('dt', {}, 'Normally handled by'), h('dd', {}, routeFor(r).team),
      h('dt', {}, 'How to route'), h('dd', {}, routeFor(r).how),
      h('dt', {}, 'Priority'), h('dd', {}, prio(r.priority).label + (r.prioritySource === 'auto' ? ' (suggested from the description, change it if needed)' : ' (set by staff)')),
      r.eta ? [h('dt', {}, 'Planned fix'), h('dd', {}, fmtDay(r.eta))] : null));

  /* Other open reports in the same place. Staff can merge them, or say they are different so they stop showing. */
  const candidates = isOpen(r) ? all.filter(x => isOpen(x) && sameSpot(r, x)).slice(0, 12) : [];
  const theirEvents = await Promise.all(candidates.map(x => app.store.listEvents(x.id)));
  const markedDifferent = (x, xEvents) =>
    evs.some(e => e.type === 'distinct' && String(e.to) === String(x.id)) || xEvents.some(e => e.type === 'distinct' && String(e.to) === String(r.id));
  const similar = candidates.filter((x, i) => !markedDifferent(x, theirEvents[i])).map(x => ({ x, m:spotMatch(r, x) }))
    .sort((a, b) => (a.m.level === 'same' ? 0 : 1) - (b.m.level === 'same' ? 0 : 1)).slice(0, 4);
  if (similar.length) {
    box.append(h('div', { class:'info' }, h('b', {}, 'Other open reports in this place'),
      h('p', { class:'muted small' }, 'Suggestions only. Nothing is merged unless you do it. Merge it if it is the same problem, or mark it as different so it stops showing here.'),
      similar.map(({ x, m }) => {
        const merge = h('button', { class:'secondary', type:'button' }, 'Same problem as #' + x.id);
        merge.addEventListener('click', () => {
          if (m.level !== 'same' && merge.dataset.sure !== '1') { merge.dataset.sure = '1'; merge.textContent = 'Not sure yet. Tap again to merge into #' + x.id; return; }
          mergeDuplicate(r, x).catch(failSoft);
        });
        return h('div', { class:'similar' },
          h('div', {}, h('span', { class:'tag' + (m.level === 'same' ? ' st-new' : '') }, m.level === 'same' ? 'Likely the same' : 'Possibly related'), ' #' + x.id + ' • ' + ago(x.createdAt) + ' • ' + catLabel(x)),
          whereExtra(x) ? h('div', { class:'muted small' }, whereExtra(x)) : null,
          h('div', {}, (x.description || '').slice(0, 90)),
          h('div', { class:'muted small' }, m.why),
          h('div', { class:'row' }, merge,
            h('button', { class:'secondary', type:'button', 'aria-label':'#' + x.id + ' is a different problem', onclick:() => markDifferent(r, x).catch(failSoft) }, 'Not the same problem')));
      })));
  }

  /* Update form */
  const me = { id:app.user.id, name:app.user.name };
  /* Who may be picked: workers whose saved area covers the ticket. A triage coordinator may pick anyone, with a note where their area does not include it. */
  const covers = w => profileCovers(w.profile, r, catKey(r));
  const staff = workers.filter(w => w.user.id !== me.id && (covers(w) || app.isTriage)).map(w => ({ id:w.user.id, name:w.user.name + (covers(w) ? '' : ' (area does not include this)') }));
  const assignees = [{ id:'', name:'Unassigned' }, { id:me.id, name:me.name + ' (me)' }, ...staff];
  if (r.assigneeId && !assignees.some(a => a.id === r.assigneeId)) assignees.push({ id:r.assigneeId, name:r.assigneeName || 'Assigned' });
  // Taking or moving a ticket that someone else holds is for them or a triage coordinator. An unassigned one is for workers whose area covers it, or a coordinator.
  const heldByOther = !!r.assigneeId && r.assigneeId !== me.id;
  const mayAssign = app.isTriage || !heldByOther && (!!r.assigneeId || inScope(r, app.profile));
  const mayClaim = isOpen(r) && !r.assigneeId && (app.isTriage || inScope(r, app.profile));
  const statusList = ['acknowledged', 'in_progress', 'waiting', 'resolved', 'other'];
  if (!statusList.includes(r.status)) statusList.unshift(r.status);                       // keep showing a status that is no longer offered
  // Problem types: the ones that fit this place, plus whatever the ticket has now, and Other last.
  const bldg = buildingByCode(r.building), place = bldg && areasFor(bldg).find(x => x.id === r.area);
  const typeIds = [...((place && place.cats) || CATEGORIES.map(c => c.id))];
  const curCat = catKey(r);
  if (!typeIds.includes(curCat)) typeIds.splice(typeIds.length - 1, 0, curCat);

  const fStatus = mkSelect('f-status', statusList.map(s => ({ value:s, label:s === 'other' ? 'Other (type your own)' : statusLabel(s) })), r.status);
  const fStatusText = h('input', { type:'text', id:'f-status-text', maxlength:'60', placeholder:'e.g. Waiting for budget approval', value:r.statusText || '' });
  const fPriority = mkSelect('f-priority', Object.keys(PRIORITY).map(k => ({ value:k, label:PRIORITY[k].label })), PRIORITY[r.priority] ? r.priority : 'normal');
  const fCategory = mkSelect('f-category', typeIds.map(id => ({ value:id, label:id === 'other' ? 'Other (type your own)' : CAT[id].label })), curCat);
  const fCatText = h('input', { type:'text', id:'f-cat-text', maxlength:'60', placeholder:'e.g. Fence, signage, pest control', value:r.categoryText || '' });
  const fAssignee = mkSelect('f-assignee', assignees.map(a => ({ value:a.id, label:a.name })), r.assigneeId || '');
  if (!mayAssign) fAssignee.disabled = true;
  const fEta = h('input', { type:'date', id:'f-eta', min:todayStr(), value:r.eta || '' });
  const fMsg = h('textarea', { id:'f-msg', maxlength:'1500' });
  const fNote = h('textarea', { id:'f-note', maxlength:'1500', placeholder:'Parts, access codes, who to call. The student never sees this.' });
  const statusTextWrap = field('Your status', fStatusText, 'The student sees this as the status.', 'f-status-text');
  const catTextWrap = field('Type of problem, in your words', fCatText, 'Staff only.', 'f-cat-text');
  const err = h('p', { class:'msg', id:'f-err', role:'status' });
  const saveBtn = h('button', { class:'primary', type:'button' }, 'Save update');

  const hints = { resolved:'What was done? (required)', waiting:'What are you waiting for, and when do you expect it? (required)' };
  const catWarn = h('p', { class:'note small', role:'status', hidden:true });
  const syncForm = () => {
    fMsg.placeholder = hints[fStatus.value] || 'Visible to the student, e.g. "Tech comes Thursday morning. Please clear the area."';
    statusTextWrap.hidden = fStatus.value !== 'other';
    catTextWrap.hidden = fCategory.value !== 'other';
    catWarn.textContent = transferNote(r, fCategory.value, fAssignee.value, me, workers);
    catWarn.hidden = !catWarn.textContent;
  };
  fStatus.addEventListener('change', syncForm); fCategory.addEventListener('change', syncForm); fAssignee.addEventListener('change', syncForm); syncForm();

  let claiming = false;                                                 // "Claim and start" only works while the ticket is still unassigned
  const quick = mayClaim
    ? h('button', { class:'secondary block mt', type:'button', onclick:() => { claiming = true; fAssignee.value = me.id; if (['new', 'reopened', 'acknowledged'].includes(fStatus.value)) fStatus.value = 'in_progress'; syncForm(); saveBtn.click(); } }, 'Claim and start')
    : null;
  const ownNote = heldByOther && !app.isTriage ? h('p', { class:'note small' }, 'Assigned to ' + (r.assigneeName || 'someone else') + '. Ask them, or a triage coordinator, to reassign it.')
    : !r.assigneeId && isOpen(r) && !mayClaim ? h('p', { class:'note small' }, 'This ticket is outside your saved area. A triage coordinator can assign it.') : null;

  box.append(h('div', { class:'card' }, h('h2', {}, 'Update this ticket'), quick,
    ownNote,
    h('div', { class:'form-grid' },
      field('Status', fStatus, null, 'f-status'), statusTextWrap,
      field('Type of problem', fCategory, 'Changing it can move the ticket to another team.', 'f-category'), catTextWrap, catWarn,
      field('Assigned to', fAssignee, null, 'f-assignee'),
      field('Priority', fPriority, 'Urgent goes first in everyone’s list.', 'f-priority'),
      field('Planned fix date', fEta, 'The student sees this.', 'f-eta')),
    field('Message to the student', fMsg, 'Visible to the student.', 'f-msg'),
    field('Internal note', fNote, 'Staff only.', 'f-note'),
    err, saveBtn));

  saveBtn.addEventListener('click', () => { const claim = claiming; claiming = false; saveTicket(r, { fStatus, fStatusText, fPriority, fCategory, fCatText, fAssignee, fEta, fMsg, fNote, assignees, err, saveBtn, claim, mayClaim }).catch(failSoft); });
  const kept = takeStaffDraft(r.id);
  if (kept) { fMsg.value = kept.msg; fNote.value = kept.note; err.textContent = 'Refreshed. What you had typed is still here. Check the ticket, then save again.'; }
  box.append(h('h2', { class:'mt-lg' }, 'History'), timeline(evs, 'worker'));
  go('s-ticket', activeScreen() === 's-ticket');
}

/* What staff typed and have not saved survives a Refresh of the same ticket (it is read back when the ticket is drawn again). */
function stashStaffDraft(id) {
  const m = $('f-msg'), n = $('f-note');
  app.staffDraft = (m && n && (m.value.trim() || n.value.trim())) ? { id, msg:m.value, note:n.value } : null;
}
function takeStaffDraft(id) { const d = app.staffDraft; app.staffDraft = null; return d && d.id === id ? d : null; }
/* When the type changes, say who the ticket will belong to. */
function transferNote(r, newCat, newAssignee, me, workers) {
  if (newCat === catKey(r) || newAssignee !== (r.assigneeId || '') || !r.assigneeId) return '';
  const w = workers.find(x => x.user.id === r.assigneeId), cover = r.assigneeId === me.id || (w && profileCovers(w.profile, r, newCat));
  const team = routeFor({ ...r, category:newCat }).team;
  if (r.assigneeId === me.id) return 'This is now a job for ' + team + '. It stays assigned to you unless you pick someone else or Unassigned.';
  return cover ? ''
    : firstName(r.assigneeName) + ' does not cover this type. Saving takes it off them and returns it to the open list for ' + team + '. To hand it to a person, pick them under Assigned to.';
}
// Wrapper: the button is locked before anything is awaited, so a double tap cannot save twice.
async function saveTicket(r, f) {
  if (f.saveBtn.disabled) return;
  f.saveBtn.disabled = true;
  try { await saveTicketNow(r, f); } finally { f.saveBtn.disabled = false; }
}
async function saveTicketNow(r, f) {
  f.err.textContent = '';
  const v = { status:f.fStatus.value, priority:f.fPriority.value, category:f.fCategory.value, assignee:f.fAssignee.value, eta:f.fEta.value,
    msg:f.fMsg.value.trim(), note:f.fNote.value.trim(), statusText:f.fStatusText.value.trim(), catText:f.fCatText.value.trim() };
  const patch = {};
  let changed = false;

  // Status. "Other" carries the words staff typed, and a change of those words counts as a change of status.
  const newStatusText = v.status === 'other' ? v.statusText : '';
  if (v.status === 'other' && !newStatusText) { f.err.textContent = 'Type the status so the student knows what is happening.'; return; }
  const statusChanged = v.status !== r.status || newStatusText !== (r.statusText || '');
  if (statusChanged) {
    if (v.status === 'resolved' && !v.msg) { f.err.textContent = 'Add a short message saying what was done.'; return; }
    if (v.status === 'waiting' && !v.msg) { f.err.textContent = 'Say what you are waiting for so the student knows.'; return; }
  }
  // Moving a ticket to in progress or resolved with nobody on it means the person saving it owns it.
  let assignee = v.assignee, claim = !!f.claim;
  if (!assignee && !r.assigneeId && statusChanged && (v.status === 'in_progress' || v.status === 'resolved') && f.mayClaim) { assignee = app.user.id; claim = true; }
  if (claim && r.assigneeId) claim = false;                      // it was taken since the form was drawn: the server will say so if it matters

  // Only the changes are sent. The server writes the history, with the signed-in person as the author.
  if (statusChanged) { patch.status = v.status; patch.statusText = newStatusText || null; changed = true; }
  if (assignee !== (r.assigneeId || '')) { if (claim && assignee === app.user.id) changed = true; else patch.assigneeId = assignee || null; changed = true; }
  if (v.priority !== r.priority) { patch.priority = v.priority; changed = true; }
  // Type. Compared with the cleaned-up type, so opening an old ticket never creates a change by itself.
  const curCat = catKey(r), newCatText = v.category === 'other' ? v.catText : '';
  if (v.category !== curCat || newCatText !== (r.categoryText || '')) { patch.category = v.category; patch.categoryText = newCatText || null; changed = true; }
  if (v.eta !== (r.eta || '')) { patch.eta = v.eta || null; changed = true; }
  if (!changed && !v.msg && !v.note) { f.err.textContent = 'Nothing to save yet. Change a field or add a message.'; return; }

  let updated;
  try { updated = await app.store.staffUpdate(r.id, { rev:r.rev, patch, message:v.msg, note:v.note, ...(claim && assignee === app.user.id ? { claim:true } : {}) }); }
  catch (e) {
    if (e instanceof ApiError && e.status === 409) {                  // somebody changed it since this form was opened
      const live = $('ticket-live'); if (live) live.hidden = false;
      f.err.textContent = 'Someone else just changed this ticket. Tap Refresh at the top, check it, then save again. What you typed is kept.';
      return;
    }
    if (e instanceof ApiError && e.status >= 400 && e.status < 500 && e.status !== 401) { f.err.textContent = e.message; return; }   // the server said what to fix
    throw e;
  }
  const moved = !inScope(updated, app.profile) && assignee !== app.user.id;
  const handedBack = r.assigneeId && r.assigneeId !== app.user.id && !updated.assigneeId && !('assigneeId' in patch);       // the type change took it off them
  toast(handedBack ? 'Saved. ' + firstName(r.assigneeName) + ' no longer has it. It is back in the open list for ' + routeFor(updated).team + '.'
    : moved ? 'Saved. It moved to ' + routeFor(updated).team + '.' : 'Saved');
  if (moved) { stack.length = 0; show('s-tickets'); } else await openTicket(r.id);
  window.scrollTo(0, 0);
}

let merging = false;
async function mergeDuplicate(r, original) {
  if (merging) return;                                                // ignore a second tap
  merging = true;
  try { await mergeNow(r, original); } finally { merging = false; }
}
// "Not the same problem": remembered on the ticket, so neither ticket suggests the other again.
let marking = false;
async function markDifferent(r, x) {
  if (marking) return;
  marking = true;
  try {
    await app.store.markDistinct(r.id, x.id);
    toast('Marked as a different problem');
    await openTicket(r.id);
  } finally { marking = false; }
}
// One request: the server moves this ticket into the other one and leaves the note, together or not at all.
async function mergeNow(r, original) {
  try { await app.store.mergeReport(r.id, { into:original.id, rev:r.rev }); }
  catch (e) {
    if (e instanceof ApiError && e.status === 409) { toast(e.message); await openTicket(r.id); return; }
    throw e;
  }
  toast('Merged into #' + original.id);
  back();
}

/* =====================================================================
   7b. Admin: who is staff, and backups
   ===================================================================== */
async function openStaffAdmin() { go('s-staff'); await renderStaffAdmin(); }
async function renderStaffAdmin() {
  const box = clear($('staff-body'));
  const list = await app.store.listStaff();
  const email = h('input', { type:'email', id:'staff-email', placeholder:'name@' + domainsOf()[0], autocomplete:'off', autocapitalize:'none', spellcheck:'false' });
  const adm = h('input', { type:'checkbox', id:'staff-admin' }), tri = h('input', { type:'checkbox', id:'staff-triage' });
  const msg = h('p', { class:'msg', id:'staff-msg', role:'status' });
  const add = h('button', { class:'primary', type:'button' }, 'Add to staff');
  add.addEventListener('click', async () => {
    add.disabled = true; msg.textContent = '';
    try { await app.store.addStaff(email.value.trim().toLowerCase(), adm.checked, tri.checked); toast('Saved'); await renderStaffAdmin(); }
    catch (e) { msg.textContent = e instanceof ApiError ? e.message : 'Could not save that.'; }
    finally { add.disabled = false; }
  });
  box.append(
    h('div', { class:'card' }, h('h2', {}, 'Add a staff member'),
      h('label', { for:'staff-email' }, 'SJSU email'), email,
      h('label', { class:'check', for:'staff-admin' }, adm, 'Can also manage this list and backups (admins are also triage coordinators)'),
      h('label', { class:'check', for:'staff-triage' }, tri, 'Triage coordinator: sees reports no worker’s area covers, and can assign any ticket'),
      msg, add),
    h('h2', { class:'mt-lg' }, 'Staff (' + list.length + ')'),
    ...(list.length ? list.map(p => {
      const rm = h('button', { class:'secondary', type:'button' }, 'Remove');
      rm.addEventListener('click', async () => {
        if (rm.dataset.sure !== '1') { rm.dataset.sure = '1'; rm.textContent = 'Tap again: signs them out and unassigns their tickets'; return; }
        rm.disabled = true;
        try { await app.store.removeStaff(p.email); toast('Removed'); await renderStaffAdmin(); } catch (e) { rm.disabled = false; failSoft(e); }
      });
      const canRemove = p.source === 'table' && p.email !== app.user.email;
      return h('div', { class:'card' },
        h('div', { class:'t-top' }, h('b', {}, p.name || p.email), p.isAdmin ? h('span', { class:'tag st-new' }, 'Admin') : p.isTriage ? h('span', { class:'tag st-new' }, 'Triage') : null),
        h('div', { class:'muted small' }, p.email + (p.lastLoginAt ? ' • last signed in ' + ago(p.lastLoginAt) : ' • has not signed in yet')),
        p.source === 'setting' ? h('div', { class:'muted small' }, 'Set in the server settings. Change the setting to remove them.') : null,
        canRemove ? h('div', { class:'row' }, rm) : null);
    }) : [h('div', { class:'empty' }, 'Nobody has been added here yet.')]),
    h('h2', { class:'mt-lg' }, 'Backups'),
    h('p', { class:'muted' }, 'The server also backs itself up on a schedule and before any update to the database.'),
    h('div', { class:'row' },
      h('button', { class:'secondary', type:'button', onclick:async () => { try { const r = await app.store.backupNow(); toast('Backup saved: ' + r.file); } catch (e) { failSoft(e); } } }, 'Back up now'),
      h('button', { class:'secondary', type:'button', onclick:async () => {
        try {
          const blob = await app.store.downloadBackup(), url = URL.createObjectURL(blob), a = h('a', { href:url, download:'spartanfix-backup.db' });
          document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
        } catch (e) { failSoft(e); }
      } }, 'Download a copy')),
    h('p', { class:'muted small' }, 'A downloaded copy holds every report, name and photo. Keep it somewhere private.'));
}

/* =====================================================================
   8. Live updates and badges
   ===================================================================== */
async function refreshBadges() {
  if (!app.user) return;
  const all = await app.store.listReports();
  let n = 0, id = null;
  if (app.user.role === 'student') {
    const seen = getSeen();
    n = all.filter(r => r.reporterId === app.user.id && isUnread(r, seen)).length; id = 'mine';
    if (app.prevCount !== null && n > app.prevCount) toast('One of your reports was updated');
  } else if (app.profile || app.isTriage) {
    n = app.profile ? all.filter(r => inScope(r, app.profile) && isOpen(r) && (r.status === 'new' || r.awaitingStaff)).length : 0;
    // A triage coordinator's badge also counts the reports nobody covers, the same list the Unrouted tab shows. If it cannot be read, the badge counts what it can.
    if (app.isTriage) { try { n += (await app.store.triage()).unrouted.length; } catch (e) { /* the Unrouted tab says so */ } }
    id = 'tickets';
    if (app.prevCount !== null && n > app.prevCount) toast('New ticket for your area');
  }
  app.prevCount = n;
  const b = id && $('badge-' + id);
  if (b) { b.textContent = n; b.hidden = n === 0; }
}

let refreshTimer;
function refreshSoon() { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => refreshNow().catch(() => {}), 250); }
async function refreshNow() {
  if (!app.user) return;
  await refreshBadges();
  const cur = activeScreen();
  if (RENDER_ON_SHOW[cur]) await RENDER_ON_SHOW[cur]();
  else if ((cur === 's-ticket' || cur === 's-mine-detail') && app.open) {
    const r = await app.store.getReport(app.open.id);
    const live = $('ticket-live');
    if (r && r.rev !== app.open.rev) {
      if (cur === 's-ticket' && live) live.hidden = false;
      else if (cur === 's-mine-detail') await openMine(r.id);          // students only read here, so refresh in place
    }
  }
}

/* =====================================================================
   9. Start up
   ===================================================================== */
function wire() {
  $('back').addEventListener('click', back);
  $('btn-student').addEventListener('click', () => openLogin('student'));
  $('btn-worker').addEventListener('click', () => openLogin('worker'));
  $('login-form').addEventListener('submit', e => { e.preventDefault(); doLogin(app.loginRole, $('login-email').value); });
  $('code-form').addEventListener('submit', e => { e.preventDefault(); doCode(); });
  $('offline-retry').addEventListener('click', () => { $('offline-retry').disabled = true; app.ready = boot().catch(bootFailed).finally(() => { $('offline-retry').disabled = false; }); });
  $('offline-device').addEventListener('click', () => { app.ready = startDeviceMode().catch(bootFailed); });
  $('assist-go').addEventListener('click', runAssist);
  $('b-search').addEventListener('input', renderBuildings);
  $('b-search').addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const q = $('b-search').value.trim();
    const hits = q ? searchBuildings(q) : [];
    if (hits.length === 1) pickBuilding(hits[0]);                          // Enter opens the building when only one matches
  });
  $('photo').addEventListener('change', onPhotoPicked);
  $('photo-pick').addEventListener('click', () => $('photo').click());   // phones offer the camera and the photo library in one menu
  $('photo-remove').addEventListener('click', () => clearPhoto());
  $('photo-ok').addEventListener('change', updateSubmit);
  $('what').addEventListener('input', () => { updatePhotoUI(); autoCategory(); updateItNote(); });
  $('send').addEventListener('click', submitReport);
  $('discard-draft').addEventListener('click', () => { if (state.submitting) return; resetDraft(); stack.length = 0; show('s-building'); toast('Draft discarded.'); });
  $('done-track').addEventListener('click', () => { openTab('mine'); openMine(app.lastId).catch(failSoft); });
  $('done-again').addEventListener('click', () => openTab('report'));
  $('setup-save').addEventListener('click', saveSetup);
  $('tix-search').addEventListener('input', e => { tix.q = e.target.value; renderTickets().catch(failSoft); });
  $('sheet').addEventListener('click', e => { if (e.target === $('sheet')) closeProfile(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeProfile(); return; }
    if (e.key !== 'Tab') return;
    const dlg = !$('sheet').hidden ? $('sheet') : null;       // keep Tab inside an open dialog
    if (!dlg) return;
    const f = [...dlg.querySelectorAll('button, input, select, textarea')].filter(x => !x.disabled && !x.hidden && x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (!dlg.contains(document.activeElement) || (e.shiftKey && document.activeElement === first)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  renderBuildings();
}

/* Talks to the shared server. If it cannot be reached the page says so and waits: it never quietly saves on this device instead. */
async function boot() {
  $('boot-msg').hidden = false; $('boot-msg').textContent = 'Starting up...';
  const link = await connectServer();
  if (!link) { showOffline(); return; }
  await startServerMode(link);
}
function bootFailed(e) {
  console.error(e);
  $('boot-msg').hidden = false; $('boot-msg').textContent = 'Could not start the app. Reload the page to try again.';
}
function showOffline() {
  $('boot-msg').hidden = true; $('roles').hidden = true; $('landing-note').textContent = ''; $('offline').hidden = false;
  app.store = null; app.mode = ''; setBanner();
}
function setBanner() {
  const b = $('mode-banner');
  b.textContent = app.mode === 'device' ? 'Device-only demo: reports stay on this device and nobody else can see them.'
    : app.mode === 'memory' ? 'Temporary demo: everything is lost when this page closes.' : '';
  b.hidden = !b.textContent;
}
function setLandingNote() {
  $('landing-note').textContent = app.mode !== 'server' ? 'Device-only demo. Nothing you do here is shared with anyone else.'
    : app.config.demo ? 'Demo build. Sign-in is simulated, so no real SJSU password is used or stored.'
    : 'Sign in with your SJSU account.';
}
async function startServerMode(link) {
  const s = session.get('server');                                   // a sign-in from an earlier visit, if the server still honours it
  const store = new RemoteStore(link.base, s && s.token);
  store.onAuthLost = why => forceSignOut(why || 'Your sign-in expired. Please sign in again.');
  store.onChange(refreshSoon);
  app.store = store; app.mode = 'server'; app.config = link.config;
  if (app.config.demo) { try { await store.demoSeed(buildSeed()); } catch (e) { console.warn('Could not add the demo data', e); } }
  $('offline').hidden = true; $('roles').hidden = false; setBanner(); setLandingNote();
  sdkDetect().then(renderBuildings).catch(() => {});                // optional, runs in the background
  if (s && s.token) {
    try { await enterApp(); }
    catch (e) {
      if (e instanceof ApiError && e.status === 0) { showOffline(); return; }   // flaky connection: keep the sign-in and let the person retry
      session.clear(); store.setToken(null); app.user = null;                    // the server no longer knows this sign-in
    }
  } else if (s) session.clear();
  $('boot-msg').hidden = true;
}
async function startDeviceMode() {
  const { store, mode } = await openDeviceStore();
  store.onChange(refreshSoon);
  app.store = store; app.mode = mode; app.config = null;
  try { await store.demoSeed(buildSeed()); } catch (e) { console.warn('Could not add the demo data', e); }
  $('offline').hidden = true; $('roles').hidden = false; $('boot-msg').hidden = true; setBanner(); setLandingNote();
  sdkDetect().then(renderBuildings).catch(() => {});
  const s = session.get('device');
  if (s) {
    try { await store.restore(s); await enterApp(); } catch (e) { session.clear(); app.user = null; }
  }
}

applyPrefs(devicePrefs());                       // the last look used on this device, before anyone signs in
const BUILD = '2026-10-24c';
if ($('build-tag')) $('build-tag').textContent = 'Build ' + BUILD;
wire();
app.ready = boot().catch(bootFailed);
