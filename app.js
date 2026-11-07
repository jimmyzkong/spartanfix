'use strict';

/*REVERT-BEGIN*/
/* Data written by the larger 74-location build is converted back to this build's building codes and place ids. Nothing is deleted. */
const REVERT = {"b":{"CVA":"CVA","CVB":"CVB","CVC":"CVC","CV2":"CV2","SVP":"SVP","JWH":"Joe West","WSH":"Washburn","MH":"Macquarrie Hall","SH":"Sweeney Building","CL":"Clarke Hall"},"rev":{"CVA":{"bedroom":"room","apt-bath":"bathroom","apt-kitchen":"unitkitchen","living":"living","laundry":null,"lobby-hallway":"hallway","other":"other"},"CVB":{"bedroom":"room","apt-bath":"bathroom","apt-kitchen":"unitkitchen","living":"living","laundry":"laundry","rac":"rac","rac-meeting":"racrooms","computer-lab":"lab","village-market":"market","lobby-hallway":"hallway","other":"other"},"CVC":{"bedroom":"room","suite-bath":"bathroom","suite-living":"living","suite-kitchenette":"unitkitchen","community-kitchen":"kitchen","laundry":"laundry","lobby-hallway":"hallway","other":"other"},"CV2":{"bedroom":"room","wing-bath":"bathroom","study":"study","lounge":"lounge","community-kitchen":"kitchen","laundry":"laundry","lobby-desk":"desk","hallway":"hallway","other":"other"},"SVP":{"bedroom":"room","room-bath":"bathroom","study":"study","fitness":"fitness","gaming":"gametv","community-kitchen":"kitchen","dining":"dining","laundry":"laundry","lobby-mail":"mail","hallway":"hallway","other":"other"},"Joe West":{"bedroom":"room","shared-bath":"bathroom","lounge":"lounge","community-kitchen":"kitchen","laundry":"laundry","lobby-desk":"desk","hallway":"hallway","stairs":"stairs","elevator":"elevator","other":"other"},"Washburn":{"bedroom":"room","wing-bath":"bathroom","lobby-activity":"lounge","laundry":"laundry","courtesy-desk":"desk","hallway":"hallway","stairs":"stairs","other":"other"},"Macquarrie Hall":{"classroom":"classroom","study":"study","office":null,"market":null,"restroom":"bathroom","hallway":"hallway","entrance":"lobby","other":"other"},"Sweeney Building":{"classroom":"classroom","clinic":null,"student-support-area":null,"department-office":null,"restroom":"bathroom","hallway":"hallway","entrance":"lobby","kay-armstead-center-for-communicative-disorders":null,"healthy-development-community-clinic":null,"other":"other"},"Clarke Hall":{"classroom":"classroom","service":null,"office":null,"meeting":null,"restroom":"bathroom","hallway":"hallway","entrance":"lobby","other":"other"}},"labels":{"CVA:laundry":"Laundry room","Macquarrie Hall:office":"Department office","Macquarrie Hall:market":"Ginger Market","Sweeney Building:clinic":"Clinic / consultation room","Sweeney Building:student-support-area":"Student support area","Sweeney Building:department-office":"Department office","Sweeney Building:kay-armstead-center-for-communicative-disorders":"Kay Armstead Center for Communicative Disorders","Sweeney Building:healthy-development-community-clinic":"Healthy Development Community Clinic","Clarke Hall:service":"Career Center","Clarke Hall:office":"Office / advising area","Clarke Hall:meeting":"Meeting room"},"oldAreas":{"CVA":["room","bathroom","unitkitchen","living","unitlaundry","mail","trash","hallway","stairs","elevator","lobby","outside","other"],"CVB":["room","bathroom","unitkitchen","living","laundry","rac","racrooms","lab","hub","market","office","desk","mail","trash","hallway","stairs","elevator","lobby","outside","other"],"CVC":["room","bathroom","living","unitkitchen","kitchen","laundry","study","desk","trash","hallway","stairs","elevator","lobby","outside","other"],"CV2":["room","bathroom","study","lounge","study10","multi","rec","kitchen","laundry","desk","trash","bike","hallway","stairs","elevator","lobby","outside","other"],"SVP":["room","bathroom","living","study","gametv","fitness","kitchen","dining","laundry","mail","desk","hallway","stairs","elevator","lobby","outside","other"],"Joe West":["room","bathroom","study","lounge","activity","kitchen","laundry","mail","desk","trash","bike","hallway","stairs","elevator","lobby","outside","other"],"Washburn":["room","bathroom","lounge","study","activity","kitchen","laundry","desk","trash","hallway","stairs","lobby","outside","other"],"Macquarrie Hall":["classroom","bathroom","study","lab","hallway","stairs","lobby","outside","other"],"Sweeney Building":["classroom","bathroom","study","lab","hallway","stairs","lobby","outside","other"],"Clarke Hall":["classroom","bathroom","study","lab","hallway","stairs","lobby","outside","other"]},"oldLabels":{"CVA":{"room":"Bedroom / efficiency room","bathroom":"Apartment bathroom","unitkitchen":"Apartment kitchen","living":"Living / dining area","unitlaundry":"Washer / dryer in my unit","mail":"Mailbox / package area","trash":"Trash / recycling area","hallway":"Hallway / corridor","stairs":"Stairs / stairwell","elevator":"Elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"CVB":{"room":"Bedroom / studio","bathroom":"Apartment bathroom","unitkitchen":"Apartment kitchen / studio kitchenette","living":"Living / dining area","laundry":"Laundry room","rac":"Recreation center (RAC) / game area","racrooms":"RAC meeting / study room","lab":"Computer lab","hub":"Spartan Hub","market":"Village Market","office":"Housing Office visitor area","desk":"Courtesy desk","mail":"Mailbox / package area","trash":"Trash / recycling area","hallway":"Hallway / corridor","stairs":"Stairs / stairwell","elevator":"Elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"CVC":{"room":"Bedroom","bathroom":"Suite bathroom","living":"Suite living / dining area","unitkitchen":"Suite kitchenette","kitchen":"Community kitchen (7th floor)","laundry":"Laundry room","study":"Shared study area / lounge","desk":"Courtesy desk","trash":"Trash / recycling area","hallway":"Hallway / corridor","stairs":"Stairs / stairwell","elevator":"Elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"CV2":{"room":"Dorm room","bathroom":"Shared bathroom / shower","study":"Study room","lounge":"Common lounge","study10":"10th-floor study lounge","multi":"Multi-purpose room","rec":"CV2 recreation space","kitchen":"Community kitchen","laundry":"Laundry room","desk":"Courtesy desk","trash":"Trash / recycling area","bike":"Bike enclosure","hallway":"Hallway / corridor","stairs":"Stairs / stairwell","elevator":"Elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"Joe West":{"room":"Dorm room","bathroom":"Shared bathroom / shower","study":"Study area","lounge":"Common lounge","activity":"Activity area","kitchen":"Community kitchen","laundry":"Laundry room","mail":"Resident mailroom / package pickup","desk":"Courtesy desk","trash":"Floor trash / recycling area","bike":"Bike enclosure","hallway":"Hallway / corridor","stairs":"Stairs / stairwell","elevator":"Elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"Washburn":{"room":"Dorm room","bathroom":"Shared bathroom / shower","lounge":"Formal lounge (1st floor)","study":"Study lounge (2nd and 3rd floor)","activity":"Activity area","kitchen":"Community kitchen","laundry":"Laundry room","desk":"Courtesy desk","trash":"Outdoor trash / recycling containers","hallway":"Hallway / corridor","stairs":"Stairs / stairwell","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"SVP":{"room":"Room / sleeping area","bathroom":"Bathroom in my room or suite","living":"Living area","study":"Study lounge","gametv":"Game / TV room","fitness":"Fitness room","kitchen":"Community kitchen","dining":"Dining area / cafeteria","laundry":"Laundry room","mail":"Mail / parcel area","desk":"Reception / front desk","hallway":"Hallway / corridor","stairs":"Stairs / stairwell","elevator":"Elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"Macquarrie Hall":{"classroom":"Classroom","bathroom":"Restroom","study":"Study area","lab":"Computer lab","hallway":"Hallway / corridor","stairs":"Stairs / elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"Sweeney Building":{"classroom":"Classroom","bathroom":"Restroom","study":"Study area","lab":"Computer lab","hallway":"Hallway / corridor","stairs":"Stairs / elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"},"Clarke Hall":{"classroom":"Classroom","bathroom":"Restroom","study":"Study area","lab":"Computer lab","hallway":"Hallway / corridor","stairs":"Stairs / elevator","lobby":"Entrance / lobby","outside":"Outside / building approach","other":"Other place"}},"oldNames":{"CVA":"Campus Village A","CVB":"Campus Village B","CVC":"Campus Village C","CV2":"Campus Village 2","Joe West":"Joe West Hall","Washburn":"Washburn Hall","SVP":"Spartan Village on the Paseo","Macquarrie Hall":"Macquarrie Hall","Sweeney Building":"Sweeney Building","Clarke Hall":"Clarke Hall"}};
const revertArr = v => Array.isArray(v) ? v : [];
function revertProfile(p) {
  const oldCodes = Object.keys(REVERT.oldAreas), blds = [], places = new Set();
  let changed = false;
  for (const x of revertArr(p.buildings)) {
    const oc = REVERT.b[x] || (oldCodes.includes(x) ? x : null);
    if (oc !== x) changed = true;
    if (oc && !blds.includes(oc)) blds.push(oc);
    if (!oc) changed = true;
  }
  for (const x of revertArr(p.places)) {
    const s = String(x);
    if (!s.includes(':')) { if (blds.some(c => REVERT.oldAreas[c].includes(s))) places.add(s); else changed = true; continue; }
    changed = true;
    const [bp, ap] = s.split(':'), oc = REVERT.b[bp] || (oldCodes.includes(bp) ? bp : null), a = oc && REVERT.rev[oc] && REVERT.rev[oc][ap];
    if (a) places.add(a);
  }
  return changed ? { buildings:blds, places:[...places] } : null;
}
function revertReport(r) {
  const oldCodes = Object.keys(REVERT.oldAreas), oc = REVERT.b[r.building] || (oldCodes.includes(r.building) ? r.building : null);
  if (!oc) return null;                                    // a building this build does not have: left exactly as it is
  const ids = REVERT.oldAreas[oc], out = {};
  let area = r.area;
  if (r.origArea && ids.includes(r.origArea)) area = r.origArea;
  else if (r.catalogVersion || !ids.includes(r.area)) area = REVERT.rev[oc] ? REVERT.rev[oc][r.area] : null;
  if (!area || !ids.includes(area)) {
    const was = REVERT.labels[oc + ':' + r.area] || r.areaLabel || r.area;
    area = 'other'; if (!(r.detail || '').includes(was)) out.detail = ('Was: ' + was + (r.detail ? ' - ' + r.detail : '')).slice(0, 200);
  }
  if (r.building !== oc) out.building = oc;
  if (r.area !== area) out.area = area;
  const label = REVERT.oldLabels[oc][area]; if (label && r.areaLabel !== label) out.areaLabel = label;
  if (r.buildingName !== REVERT.oldNames[oc]) out.buildingName = REVERT.oldNames[oc];
  return Object.keys(out).length ? out : null;
}
/*REVERT-END*/

/* =====================================================================
   1. Campus data (buildings, places, issue types, statuses)
   ===================================================================== */
const BUILDINGS = [
  { code:'CVA', name:'Campus Village A',             type:'dorm', group:'Residence halls', match:/\bcva\b|campus village a\b/i },
  { code:'CVB', name:'Campus Village B',             type:'dorm', group:'Residence halls', match:/\bcvb\b|campus village b\b/i },
  { code:'CVC', name:'Campus Village C',             type:'dorm', group:'Residence halls', match:/\bcvc\b|campus village c\b/i },
  { code:'CV2', name:'Campus Village 2',             type:'dorm', group:'Residence halls', match:/\bcv2\b|campus village 2\b/i },
  { code:'Joe West', name:'Joe West Hall',           type:'dorm', group:'Residence halls', match:/joe west|\bjw\b/i },
  { code:'Washburn', name:'Washburn Hall',           type:'dorm', group:'Residence halls', match:/washburn/i, noElevator:true },
  { code:'SVP', name:'Spartan Village on the Paseo', type:'dorm', group:'Residence halls', match:/\bsvp\b|spartan village/i },
  { code:'Macquarrie Hall', name:'Study building',   type:'academic', group:'Study buildings', match:/macquarrie/i },
  { code:'Sweeney Building', name:'Study building',  type:'academic', group:'Study buildings', match:/sweeney/i },
  { code:'Clarke Hall', name:'Study building',       type:'academic', group:'Study buildings', match:/clarke/i }
];
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
  kitchen:   { label:'Community kitchen', short:'Community kitchen', kw:/kitchen|stove|oven|microwave|fridge|refrigerator|burner|dishwasher/i, kw2:/\bsinks?\b|cabinet|disposal/i,
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
  hub:       { label:'Spartan Hub', short:'Spartan Hub', kw:/spartan hub/i, cats:GENERIC },
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
const A = (id, g, o) => {
  const a = Object.assign({ id, g, unit:null, floor:null, detail:{ label:'Anything else that helps staff find it', ph:'e.g. near the south door', req:false } }, TPL[id], o || {});
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
    A('laundry', 'shared'), A('rac', 'shared'), A('racrooms', 'shared'), A('lab', 'shared'), A('hub', 'shared'), A('market', 'shared'),
    A('office', 'shared'), A('desk', 'shared'),
    A('mail', 'common'), A('trash', 'common'), ...DORM_TAIL
  ],
  CVC: [
    A('room', 'mine', { label:'Bedroom', unit:UNIT('Suite and room number', 'Suite') }),
    A('bathroom', 'mine', { label:'Suite bathroom', hint:'Shared within your suite', unit:suiteUnit,
      detail:{ label:'Which fixture? (sink, toilet, shower…)', ph:'e.g. shower drain', req:false } }),
    A('living', 'mine', { label:'Suite living / dining area', unit:suiteUnit }),
    A('unitkitchen', 'mine', { label:'Suite kitchenette', hint:'Inside your suite', unit:suiteUnit }),
    A('kitchen', 'shared', { label:'Community kitchen (7th floor)', hint:'Not your suite kitchenette' }),
    A('laundry', 'shared'), A('study', 'shared', { label:'Shared study area / lounge', floor:FLOOR_OPT }), A('desk', 'shared'),
    A('trash', 'common'), ...DORM_TAIL
  ],
  CV2: [
    A('room', 'mine', { label:'Dorm room', unit:roomUnit }),
    sharedBath(), A('study', 'shared', { label:'Study room', floor:FLOOR_OPT }), A('lounge', 'shared', { floor:FLOOR_OPT }),
    A('study10', 'shared', { label:'10th-floor study lounge', kw:/10th floor study|tenth floor study/i, cats:TPL.study.cats, short:'10th-floor study lounge' }),
    A('multi', 'shared'), A('rec', 'shared', { label:'CV2 recreation space', short:'CV2 recreation space', kw:/recreation|rec room/i, cats:GENERIC }),
    A('kitchen', 'shared', { floor:FLOOR_OPT }), A('laundry', 'shared'), A('desk', 'shared'),
    A('trash', 'common'), A('bike', 'common'), ...DORM_TAIL
  ],
  'Joe West': [
    A('room', 'mine', { label:'Dorm room', unit:roomUnit }),
    sharedBath(), A('study', 'shared', { hint:'On every floor except 4, 7 and 10', floor:FLOOR_OPT }), A('lounge', 'shared', { floor:FLOOR_OPT }),
    A('activity', 'shared'), A('kitchen', 'shared', { floor:FLOOR_OPT }), A('laundry', 'shared'),
    A('mail', 'shared', { label:'Resident mailroom / package pickup' }), A('desk', 'shared'),
    A('trash', 'common', { label:'Floor trash / recycling area', floor:FLOOR_OPT }), A('bike', 'common'), ...DORM_TAIL
  ],
  Washburn: [
    A('room', 'mine', { label:'Dorm room', unit:roomUnit }),
    sharedBath(), A('lounge', 'shared', { label:'Formal lounge (1st floor)' }), A('study', 'shared', { label:'Study lounge (2nd and 3rd floor)', floor:FLOOR_OPT }),
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
const STUDY_AREAS = () => [
  A('classroom', 'rooms', { unit:UNIT('Room number', 'Room') }),
  A('bathroom', 'rooms', { label:'Restroom', floor:FLOOR_REQ, detail:{ label:'Which restroom? (optional)', ph:'e.g. men’s, near the east stairs', req:false } }),
  A('study', 'rooms', { floor:FLOOR_OPT }),
  A('lab', 'rooms', { unit:{ label:'Room number (if you know it)', word:'Room', req:false } }),
  A('hallway', 'common', { floor:FLOOR_REQ }),
  A('stairs', 'common', { label:'Stairs / elevator', short:'Stairs / elevator', kw:/stairs?\b|stairwell|staircase|elevator/i, floor:FLOOR_OPT }),
  A('lobby', 'common'), A('outside', 'common'), A('other', 'common')
];
for (const b of BUILDINGS) if (b.type === 'academic') BUILDING_AREAS[b.code] = STUDY_AREAS();
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

// What the person must fill in for a place, in the form the server also checks.
const locationRules = () => Object.fromEntries(BUILDINGS.map(b => [b.code, Object.fromEntries(BUILDING_AREAS[b.code].map(a =>
  [a.id, { unit:a.unit ? (a.unit.req ? 2 : 1) : 0, floor:a.floor ? (a.floor.req ? 2 : 1) : 0, detail:a.detail.req ? 2 : 1 }]))]));
// Where a report is, in words: building, place, then unit, floor and detail when given.
function whereExtra(r) {
  const b = buildingByCode(r.building), a = b && areasFor(b).find(x => x.id === r.area);
  const word = a && a.unit && a.unit.word || 'Unit', unit = r.unit && (new RegExp('^' + word + '\\b', 'i').test(r.unit) ? r.unit : word + ' ' + r.unit);
  const floor = r.floor && (/^\d+$/.test(r.floor) ? 'Floor ' + r.floor : r.floor);
  return [unit, floor, r.detail].filter(Boolean).join(' • ');
}
const whereText = r => [r.buildingName || r.building, r.areaLabel, whereExtra(r)].filter(Boolean).join(' • ');
/* Is this report about the very same spot as another? The unit (apartment, suite, room) and the floor must both match when the place asks for them,
   so two different apartment bathrooms in one building are never offered as duplicates. An old report that lacks the number never matches. */
const normLoc = v => String(v == null ? '' : v).toLowerCase().replace(/\b(apt|apartment|suite|room|rm|floor|fl|unit)\b/g, '').replace(/(\d+)(st|nd|rd|th)\b/g, '$1').replace(/[^a-z0-9]/g, '');
function sameSpot(r, x) {
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

// Issue types decide which team gets the ticket. Phone numbers and routes come from the team's housing research;
// confirm them with Housing before launch.
const CATEGORIES = [
  { id:'plumbing',   label:'Plumbing / leak',          team:'Maintenance (FD&O)',
    kw:/leak|flood|toilet|sink|drain|clog|pipe|faucet|shower|water pressure|hot water|sewage|overflow/i,
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
  { id:'other',      label:'Other',                    team:'Any team', kw:null,
    route:'Not sorted yet. Read the description and pick the right type, or type your own.' }
];
const CAT = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
const CAT_ORDER = ['laundry','plumbing','hvac','electrical','structure','cleaning','furniture'];

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
const catLabel = r => (catKey(r) === 'other' && r.categoryText ? r.categoryText : catOf(r).label);
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
// Only the words decide. Being in the laundry room is not a reason to send a broken light to the laundry-machine company.
function suggestCategory(text, areaId, allowed) {
  const ok = id => !allowed || allowed.includes(id);
  for (const id of CAT_ORDER) if (ok(id) && CAT[id].kw.test(text)) return id;
  return null;
}
// Computer, Wi-Fi and projector problems are not building repairs. We point the student to IT instead of misrouting them.
const IT_RE = /wi-?fi|internet|network|computer|desktop|laptop|printer|projector|monitor|hdmi|usb|software|password/i;
const URGENT_RE = /flood|burst|sparking|sparks|smoke|burning|\bfire\b|\bgas\b|exposed wire|no power|power (is )?out|stuck in|trapped|won'?t lock|can'?t lock|cannot lock|broken lock|broken window|shattered|sewage/i;
const HIGH_RE = /leak|no (hot )?water|elevator|no heat|clog|overflow|mold|roach|\bmice\b|mouse|fell off|falling|detached|collapsed|hanging|unlock|card reader/i;
const LOW_RE = /scratch|paint|cosmetic|chipped|stain|squeak/i;
function suggestPriority(text) {
  if (URGENT_RE.test(text)) return 'urgent';
  if (HIGH_RE.test(text)) return 'high';
  if (LOW_RE.test(text)) return 'low';
  return 'normal';
}

/* =====================================================================
   3. Database layer
      LocalStore  = IndexedDB in this browser (or memory if the browser blocks it)
      RemoteStore = the optional server.js with SQLite, shared by every device
      Both expose the same async API, so the screens never know which one is in use.

      Tables
        users(id, role, email, name, createdAt, lastLoginAt)
        profiles(userId, buildings[], places[], categories[], setupDone, updatedAt)   worker scope
        reports(id, reporterId, building, area, category, priority, status, assigneeId, eta, ...)
        events(id, reportId, at, actor, type, from, to, text, visibility)             full history
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
}

const withoutPhoto = r => { const { photo, ...rest } = r; return { ...rest, hasPhoto: !!photo }; };

class LocalStore {
  constructor(kv) {
    this.kv = kv; this.subs = []; this.bc = null;
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

  async upsertUser(u) {
    const old = await this.kv.get('users', u.id), t = nowIso();
    const user = { ...old, ...u, createdAt: old ? old.createdAt : t, lastLoginAt: t };
    await this.kv.put('users', user);
    return user;
  }
  async getUser(id) { return (await this.kv.get('users', id)) || null; }
  async getProfile(userId) { return (await this.kv.get('profiles', userId)) || null; }
  async saveProfile(p) {
    const profile = { userId:p.userId, buildings:[...p.buildings], places:[...p.places], categories:[...p.categories], setupDone:!!p.setupDone, updatedAt:nowIso() };
    await this.kv.put('profiles', profile); this._changed(); return profile;
  }
  async listWorkers() {
    const out = [];
    for (const user of (await this.kv.getAll('users')).filter(u => u.role === 'worker')) {
      const profile = await this.kv.get('profiles', user.id);
      if (profile && profile.setupDone) out.push({ user, profile });
    }
    return out.sort((a, b) => a.user.name.localeCompare(b.user.name));
  }
  async createReport(report, events) {
    const t = nowIso(), r = { ...report, createdAt: report.createdAt || t, updatedAt: report.updatedAt || report.createdAt || t };
    r.publicAt = r.publicAt || r.createdAt;
    delete r.id;
    return this._lock(async () => {
      if (r.idemKey) {                                           // the same send again: hand back the report already saved
        const seen = (await this.kv.getAll('reports')).find(x => x.reporterId === r.reporterId && x.idemKey === r.idemKey);
        if (seen) { const { idemKey, ...rest } = seen; return withoutPhoto(rest); }
      }
      const id = await this.kv.add('reports', r);
      for (const e of events || []) await this.kv.add('events', { ...e, reportId:id, at: e.at || r.createdAt });
      this._changed();
      const { idemKey, ...rest } = r;
      return withoutPhoto({ ...rest, id });
    });
  }
  async getReport(id) { return (await this.kv.get('reports', Number(id))) || null; }
  async listReports() { return (await this.kv.getAll('reports')).map(withoutPhoto); }
  async updateReport(id, patch, events) {
    const next = await this._lock(async () => {
      const r = await this.kv.get('reports', Number(id));
      if (!r) throw new Error('Report not found');
      const n = { ...r, ...patch, updatedAt: nowIso() };
      if ((events || []).some(e => e.visibility !== 'staff')) n.publicAt = n.updatedAt;       // the student can see this change
      await this.kv.put('reports', n);
      for (const e of events || []) await this.kv.add('events', { ...e, reportId:r.id, at: e.at || n.updatedAt });
      return n;
    });
    this._changed();
    return withoutPhoto(next);
  }
  async listEvents(reportId) {
    return (await this.kv.getAll('events')).filter(e => e.reportId === Number(reportId))
      .sort((a, b) => a.at.localeCompare(b.at) || a.id - b.id);
  }
  async seed(b) {
    // The lock stops two tabs opened at the same moment from both adding the demo reports.
    const did = await this._lock(async () => {
      if ((await this.kv.count('users')) || (await this.kv.count('reports'))) return false;
      for (const u of b.users) await this.kv.put('users', u);
      for (const p of b.profiles) await this.kv.put('profiles', p);
      for (const { report, events } of b.reports) {
        const id = await this.kv.add('reports', { ...report });
        for (const e of events) await this.kv.add('events', { ...e, reportId:id });
      }
      return true;
    });
    if (did) this._changed();
    return did;
  }
  // A browser that once opened the larger 74-location build holds data in its ids. Convert it back once, keep everything.
  async repairOldData() {
    return this._lock(async () => {
      let n = 0;
      for (const p of await this.kv.getAll('profiles')) { const fix = revertProfile(p); if (fix) { await this.kv.put('profiles', { ...p, ...fix }); n += 1; } }
      for (const r of await this.kv.getAll('reports')) { const fix = revertReport(r); if (fix) { await this.kv.put('reports', { ...r, ...fix }); n += 1; } }
      if (n) this._changed();
      return n;
    });
  }
  async clearAll() { for (const s of TABLES) await this.kv.clear(s); this._changed(); }
}

class RemoteStore {
  constructor(base) {
    this.base = base; this.subs = []; this.v = null; this.fails = 0; this.down = false;
    this._poll();
    setInterval(() => { if (!document.hidden) this._poll(); }, 2500);
  }
  onChange(cb) { this.subs.push(cb); }
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
    const r = await fetch(this.base + url, {
      method, headers: body !== undefined ? { 'Content-Type':'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
    const j = await r.json().catch(() => null);
    if (!r.ok) throw new Error((j && j.error) || 'HTTP ' + r.status);
    if (method !== 'GET') { const v = Number(r.headers.get('x-version')); if (!Number.isNaN(v)) this.v = v; this._emit(); }
    return j;
  }
  upsertUser(u) { return this._j('POST', '/api/users', u); }
  getUser(id) { return this._j('GET', '/api/users/' + encodeURIComponent(id)); }
  getProfile(userId) { return this._j('GET', '/api/profiles/' + encodeURIComponent(userId)); }
  saveProfile(p) { return this._j('PUT', '/api/profiles/' + encodeURIComponent(p.userId), p); }
  listWorkers() { return this._j('GET', '/api/workers'); }
  createReport(report, events) { return this._j('POST', '/api/reports', { report, events }); }
  getReport(id) { return this._j('GET', '/api/reports/' + Number(id)); }
  listReports() { return this._j('GET', '/api/reports'); }
  updateReport(id, patch, events) { return this._j('PATCH', '/api/reports/' + Number(id), { patch, events }); }
  listEvents(reportId) { return this._j('GET', '/api/reports/' + Number(reportId) + '/events'); }
  async seed(b) { return (await this._j('POST', '/api/seed', b)).seeded; }
  async clearAll() { await this._j('POST', '/api/clear', {}); }
}

async function openStore() {
  // 1) The shared server, if this page is served by server.js (or ?api=http://host:3000 is given).
  const forced = new URLSearchParams(location.search).get('api');
  const base = forced ? forced.replace(/\/$/, '') : '';
  try {
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 1500);
    const r = await fetch(base + '/api/version', { signal: ctl.signal });
    clearTimeout(timer);
    const j = await r.json();
    if (j && j.eaiser) return { store:new RemoteStore(base), mode:'server' };
  } catch (e) { /* no server, fall through */ }
  // 2) IndexedDB in this browser.
  try {
    const store = new LocalStore(await IdbKV.open());
    try { await store.repairOldData(); } catch (e) { console.warn('Could not convert older saved data', e); }
    return { store, mode:'browser' };
  } catch (e) { /* blocked */ }
  // 3) Memory only.
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
    if (near) { const i = BUILDINGS.findIndex(b => b.match.test(String(near.name || ''))); if (i >= 0) sdkState.hintIndex = i; }
  } catch (e) { console.warn('EAiSER campus lookup skipped', e); }
}

async function sdkTriage(desc, b, areaText, photoBlob) {
  if (!sdkReady()) return null;
  const S = window.EAiSER;
  const location = { campus: sdkState.campus ? sdkState.campus.id : undefined };
  const sb = sdkState.buildings.find(x => b.match.test(String(x.name || '')));
  if (sb) location.building = sb.id;
  const input = { description: b.code + ', ' + areaText + '. ' + desc, location };
  if (photoBlob && typeof S.photo === 'function') input.photo = await withTimeout(S.photo(new File([photoBlob], 'photo.jpg', { type:'image/jpeg' })), SDK_TIMEOUT);
  const draft = await withTimeout(S.reports.create(input), SDK_TIMEOUT);
  if (!draft) return null;
  if (draft.id != null && typeof S.reports.send === 'function') {
    try { await withTimeout(S.reports.send(draft.id, { university:!!draft.campus, city:false, landlord:false }), SDK_TIMEOUT); }
    catch (e) { console.warn('EAiSER send skipped', e); }
  }
  return { title:clip(draft.title, 120), summary:clip(draft.summary, 600), severity:clip(String(draft.severity == null ? '' : draft.severity), 40) };
}

// Runs after the report is already saved. Adds a staff-only AI summary, and can raise the priority (never lower it).
async function sdkFollowUp(saved, desc, b, areaText, photoBlob) {
  const ai = await sdkTriage(desc, b, areaText, photoBlob);
  if (!ai || (!ai.title && !ai.summary)) return;
  const cur = await app.store.getReport(saved.id);
  if (!cur) return;
  const want = sdkPriority(ai.severity);
  const raise = !!want && cur.prioritySource === 'auto' && PRIORITY[want].rank < PRIORITY[cur.priority].rank;
  const text = 'AI summary: ' + [ai.title, ai.summary].filter(Boolean).join('. ').replace(/\.\.$/, '.') +
    (ai.severity ? ' Severity: ' + ai.severity + '.' : '') + (raise ? ' Priority raised to ' + PRIORITY[want].label + '.' : '');
  await app.store.updateReport(saved.id, raise ? { priority:want } : {},
    [{ type:'ai', at:nowIso(), actorId:null, actorName:'AI assistant', actorRole:'system', visibility:'staff', text }]);
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
      building:b.code, buildingName:b.type === 'dorm' ? b.name : b.code, area:o.area, areaLabel:areaLabel(b, a), category:o.cat,
      priority:suggestPriority(o.desc), prioritySource:'auto', status:o.status || 'new', unit:o.unit || '', floor:o.floor || '', detail:o.detail || '', description:o.desc, photo:null,
      entry:o.entry || null, assigneeId:o.who ? o.who.id : null, assigneeName:o.who ? o.who.name : null, eta:o.eta || null, dupOf:null,
      awaitingStaff:!!o.awaiting, lastActorRole:o.last || 'student', resolvedAt:o.resolvedAt || null, confirmedAt:null
    };
  }
  const created = (o) => ev('created', o.age, o.by, { text:'Report sent.' });
  const R = (o, events) => ({ report:rep(o), events:[created(o), ...(events || [])] });

  const o1 = { age:96, upd:48, by:jordan, building:'CV2', area:'lounge', cat:'furniture', status:'acknowledged', who:rosa, last:'worker',
    desc:'The pool table and ping pong equipment kept getting broken. Housing took it away for now. Can it be fixed or replaced?' };
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
const app = { store:null, mode:'', user:null, profile:null, tab:null, open:null, prevCount:null, ready:null, loginRole:null };
const stack = [];                                  // screen history for Back
const activeScreen = () => document.querySelector('.screen.active').id;

/* The session stays until the person logs out. */
const SESSION_KEY = 'eaiser.session.v1';
let memSession = null;
// Stored data is never trusted. A session is used only if it has exactly the shape we wrote.
const validSession = v => !!v && typeof v === 'object' && (v.role === 'student' || v.role === 'worker') && typeof v.email === 'string' &&
  /^[^\s@]+@sjsu\.edu$/.test(v.email) && typeof v.name === 'string' && v.id === v.role + ':' + v.email;
const session = {
  get() {
    let v = memSession;
    try { const raw = localStorage.getItem(SESSION_KEY); if (raw) v = JSON.parse(raw); } catch (e) { /* storage blocked or corrupt */ }
    return validSession(v) ? v : null;
  },
  set(v) { memSession = v; try { localStorage.setItem(SESSION_KEY, JSON.stringify(v)); } catch (e) { /* storage blocked */ } },
  clear() { memSession = null; try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ } }
};
/* Which updates a student has already looked at. */
const memSeen = {};
function getSeen() {
  try { return JSON.parse(localStorage.getItem('eaiser.seen.' + app.user.id)) || {}; } catch (e) { return memSeen[app.user.id] || {}; }
}
function markSeen(r) {
  const s = getSeen(); s[r.id] = r.publicAt || r.updatedAt; memSeen[app.user.id] = s;
  try { localStorage.setItem('eaiser.seen.' + app.user.id, JSON.stringify(s)); } catch (e) { /* ignore */ }
}
// publicAt moves only when the student could see the change. A staff-only note must not light up the badge.
const isUnread = (r, seen) => r.lastActorRole === 'worker' && (r.publicAt || r.updatedAt) > (seen[r.id] || '');

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
function failSoft(e) { console.error(e); toast('Something went wrong. Please try again.'); }

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

/* ---------- Demo sign-in ---------- */
function openLogin(role) {
  app.loginRole = role;
  $('h-login').textContent = role === 'student' ? 'Student sign in' : 'Worker / Faculty sign in';
  $('login-email').value = ''; $('login-msg').textContent = '';
  const box = clear($('demo-accounts'));
  const demos = role === 'student'
    ? [{ email:'sam.spartan@sjsu.edu', sub:'Has a fixed report to confirm' }]
    : [{ email:'dev.patel@sjsu.edu', sub:'Maintenance, already set up' }, { email:'maria.lopez@sjsu.edu', sub:'New staff, shows the first-login setup' }];
  for (const d of demos) {
    box.append(h('button', { class:'card', type:'button', onclick:() => doLogin(role, d.email) },
      h('div', { class:'demo' }, avatar(d.email, nameFromEmail(d.email), 'sm'),
        h('div', {}, h('b', {}, nameFromEmail(d.email)), h('div', { class:'muted' }, d.email + ' • ' + d.sub)))));
  }
  go('s-login');
  $('login-email').focus();
}

async function doLogin(role, rawEmail) {
  const email = String(rawEmail).trim().toLowerCase();
  if (!/^[^\s@]+@sjsu\.edu$/.test(email)) { $('login-msg').textContent = 'Use your @sjsu.edu email address.'; return; }
  try {
    await app.ready;
    const user = await app.store.upsertUser({ id:role + ':' + email, role, email, name:nameFromEmail(email) });
    app.user = user;
    session.set({ id:user.id, role:user.role, email:user.email, name:user.name });
    await enterApp();
  } catch (e) { console.error(e); $('login-msg').textContent = 'Could not sign in. Please try again.'; }
}

async function enterApp() {
  applyPrefs(userPrefs(app.user.id));                                // this person's look comes with them
  buildNav(); stack.length = 0; app.prevCount = null;
  tix.tab = 'open'; tix.q = ''; $('tix-search').value = '';        // a new person never inherits the last person's filters
  if (app.user.role === 'student') { openTab(livePrefs.start === 'mine' ? 'mine' : 'report'); }
  else {
    tix.tab = ['open', 'mine', 'done'].includes(livePrefs.start) ? livePrefs.start : 'open';
    app.profile = await app.store.getProfile(app.user.id);
    if (!app.profile || !app.profile.setupDone) openSetup(true); else openTab('tickets');
  }
  refreshBadges().catch(() => {});
}

function logout() {
  closeProfile();
  session.clear();
  app.user = null; app.profile = null; app.tab = null; app.open = null; app.prevCount = null;
  stack.length = 0; resetDraft();
  applyPrefs(devicePrefs());
  $('nav').hidden = true; $('who-tag').hidden = true;
  show('s-landing');
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
  const modeText = { server:'Shared database (SQLite server). Every device sees the same reports.',
    browser:'Database in this browser only. Open the student and worker views in this same browser to demo.',
    memory:'Temporary memory only. Reports are lost when this page closes.' }[app.mode];
  card.append(
    h('div', { class:'who' }, avatar(u.email, u.name, 'big'),
      h('div', {}, h('b', {}, u.name), h('span', { class:'muted' }, u.email), h('div', {}, h('span', { class:'tag st-new' }, u.role === 'student' ? 'Student' : 'Worker / Faculty')))),
    h('p', { class:'muted' }, modeText));
  if (u.role === 'worker' && app.profile) {
    card.append(h('div', { class:'info' }, h('b', {}, 'Your area'), h('div', {}, scopeSummary(app.profile))),
      h('button', { class:'secondary block', type:'button', onclick:() => { closeProfile(); openSetup(false); } }, 'Edit my buildings and places'));
  }
  const resetBtn = h('button', { class:'danger', type:'button' }, 'Reset demo data');
  resetBtn.addEventListener('click', () => {
    if (resetBtn.dataset.sure !== '1') { resetBtn.dataset.sure = '1'; resetBtn.textContent = 'Tap again to erase all reports and restore the demo'; return; }
    resetDemo().catch(failSoft);
  });
  card.append(h('button', { class:'secondary block mt', type:'button', onclick:openSettings }, 'Settings'), resetBtn,
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
  const u = app.user;
  await app.store.clearAll();
  await app.store.seed(buildSeed());
  app.user = await app.store.upsertUser({ id:u.id, role:u.role, email:u.email, name:u.name });
  closeProfile(); toast('Demo data restored'); await enterApp();
}
function scopeSummary(p) {
  const nb = p.buildings.length, np = p.places.length;
  const nc = p.categories.filter(c => CAT[c]).length;
  return (nb > 4 ? nb + ' buildings' : p.buildings.join(', ')) + ' • ' + np + ' place' + (np === 1 ? '' : 's') +
    ' • ' + (nc >= CATEGORIES.length ? 'all issue types' : nc + ' issue types');
}

/* =====================================================================
   6. Student: report a problem
   ===================================================================== */
const state = { building:null, place:null, fromAI:false, photo:null, photoUrl:null, category:null, catManual:false };
const currentArea = () => areasFor(BUILDINGS[state.building]).find(x => x.id === state.place);

// Photos are off for private spaces (area flag) or when the description mentions one (text check).
const SENSITIVE_TEXT = /toilet|shower|bathroom|restroom|locker room|changing room/i;
const DEFAULT_PHOTO_NOTE = 'Photograph only the damage. Keep people, faces, ID cards, screens and personal belongings out of frame.';
const MAX_SIDE = 1280;

function makeOpt(title, sub, onclick, extraClass) {
  const btn = h('button', { type:'button', class:'opt' + (extraClass ? ' ' + extraClass : '') }, title, sub ? h('small', {}, sub) : null);
  btn.addEventListener('click', onclick);
  return btn;
}

// What the student typed belongs to one place. Picking a different place starts a clean form.
function clearForm() {
  for (const id of ['unit', 'floor', 'detail', 'what']) $(id).value = '';
  $('entry-ok').checked = false; $('form-msg').textContent = ''; $('it-note').hidden = true;
  clearPhoto();
}
function pickBuilding(i) {
  if (i !== state.building) { if (!state.fromAI) clearForm(); state.place = null; }   // text from Ask AI is kept
  state.building = i; state.fromAI = false; openAreas();
}
// Search ignores case, spaces and punctuation, so "cv 2", "CV2" and "campus village 2" all find Campus Village 2.
const norm = t => String(t).toLowerCase().replace(/[^a-z0-9]/g, '');
function buildingMatches(b, q) {
  const nq = norm(q);
  if (!nq) return true;
  const words = b.type === 'dorm' ? 'dorm residence hall' : 'study academic building';
  return norm(b.code + b.name + words).includes(nq) || b.match.test(q);
}
function renderBuildings() {
  const el = clear($('building-list'));
  const q = $('b-search').value.trim();
  const near = sdkState.hintIndex;
  if (!q && near !== null && BUILDINGS[near]) {
    el.append(h('div', { class:'suggest' }, h('span', {}, 'You look to be at ' + BUILDINGS[near].code + '.'),
      h('button', { class:'secondary', type:'button', onclick:() => pickBuilding(near) }, 'Use ' + BUILDINGS[near].code)));
  }
  let lastGroup = null, shown = 0;
  BUILDINGS.forEach((b, i) => {
    if (!buildingMatches(b, q)) return;
    shown += 1;
    if (b.group !== lastGroup) { el.append(h('div', { class:'group' }, b.group)); lastGroup = b.group; }
    el.append(makeOpt(b.code, b.type === 'dorm' ? b.name : null, () => pickBuilding(i), 'plate' + (i === near ? ' near' : '')));
  });
  if (!shown) el.append(h('p', { class:'empty' }, 'No building matches "' + q + '". Try a code like CV2, or tap Ask AI.'));
  el.append(makeOpt('Unsure which section? Ask AI', null, openAssist, 'ask'));
}

function openAreas(replace) {
  const b = BUILDINGS[state.building];
  $('area-sub').textContent = b.code + (b.type === 'dorm' ? ' • ' + b.name : '');
  const el = clear($('area-list'));
  let lastGroup = null;
  for (const a of areasFor(b)) {
    if (a.g !== lastGroup) { el.append(h('div', { class:'group' }, GROUP_LABEL[a.g])); lastGroup = a.g; }
    el.append(makeOpt(areaLabel(b, a), a.hint, () => { if (state.place !== a.id && !state.fromAI) clearForm(); state.place = a.id; state.fromAI = false; openDetails(); }));
  }
  el.append(makeOpt('Unsure which section? Ask AI', null, openAssist, 'ask'));
  go('s-area', replace);
}

/* Ask AI: keyword stub. Swap runAssist() for a real model call later. */
function openAssist() {
  if (activeScreen() === 's-building') { state.building = null; state.place = null; }     // from the building list nothing is chosen yet; do not reuse an earlier pick
  $('assist-msg').textContent = ''; go('s-assist');
}
/* Pick a place from the words only when it is clear. Strong words (kitchen, shower, elevator) must match exactly one place in this
   building; weak words (sink, desk) are used only when nothing matches strongly. Two candidates means no guess: the student picks. */
function guessArea(b, text) {
  const list = areasFor(b).filter(a => a.kw);
  const strong = list.filter(a => a.kw.test(text));
  if (strong.length) return strong.length === 1 ? strong[0] : null;
  const weak = list.filter(a => a.kw2 && a.kw2.test(text));
  return weak.length === 1 ? weak[0] : null;
}
const mentionsPlace = text => Object.values(TPL).some(t => (t.kw && t.kw.test(text)) || (t.kw2 && t.kw2.test(text)));
function runAssist() {
  const text = $('assist-text').value.trim();
  if (!text) { $('assist-msg').textContent = 'Type a few words about the problem first.'; return; }
  clearForm();
  const bi = BUILDINGS.findIndex(b => b.match.test(text));
  if (bi >= 0) state.building = bi;
  const b = state.building !== null ? BUILDINGS[state.building] : null;
  const hit = b ? guessArea(b, text) : null;
  state.place = hit ? hit.id : null;
  state.fromAI = true;
  $('what').value = text;
  if (!b && !mentionsPlace(text)) { $('assist-msg').textContent = 'Could not tell yet. Mention the building or what is broken.'; return; }
  if (!b) { stack.length = 0; show('s-building'); return; }
  if (!hit) { openAreas(true); return; }
  openDetails(true);
}

/* ---------- Type of problem (decides which team gets it) ---------- */
const areaCats = () => { const a = state.building !== null && state.place ? currentArea() : null; return ((a && a.cats) || CATEGORIES.map(c => c.id)).map(id => CAT[id]); };
function renderCatChips() {
  const el = clear($('cat-chips'));
  for (const c of areaCats()) {
    el.append(h('button', { type:'button', class:'chip' + (state.category === c.id ? ' sel' : ''), 'aria-pressed':String(state.category === c.id),
      onclick:() => { state.category = c.id; state.catManual = true; renderCatChips(); } }, c.label));
  }
  $('cat-hint').textContent = state.category
    ? (state.catManual ? 'Goes to: ' + CAT[state.category].team + '.' : 'Suggested from your description. Goes to: ' + CAT[state.category].team + '. Tap another to change it.')
    : 'Pick the closest match so the right team gets it. Nothing fits? Pick Other or skip this.';
}
const updateItNote = () => { $('it-note').hidden = !IT_RE.test($('what').value); };
function autoCategory() {
  if (state.catManual) return;
  const a = currentArea();
  state.category = suggestCategory($('what').value, state.place, a && a.cats);
  renderCatChips();
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
  try {
    const blob = await makeBlob();
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
    $('no-photo').textContent = byArea
      ? 'Photos are turned off for bathrooms, restrooms and showers to protect everyone’s privacy. Describe the problem and where it is in words.'
      : 'Photos are turned off because your description mentions a bathroom or shower. Describe the problem in words instead.';
    clearPhoto();
  } else $('photo-note').textContent = a.photoNote || DEFAULT_PHOTO_NOTE;
  updateSubmit();
}
// A photo can only be sent after the user confirms nobody or nothing private is in it.
function updateSubmit() { $('send').disabled = !!state.photo && !$('photo-ok').checked; }

/* ---------- Details and submit ---------- */
function openDetails(replace) {
  const b = BUILDINGS[state.building], a = currentArea();
  $('summary').textContent = b.code + ' • ' + areaLabel(b, a);
  $('ai-note').hidden = !state.fromAI;
  // Each place says what staff need in order to find it: a room / apartment / suite number, a floor, and a landmark or fixture.
  const req = f => f && f.req ? ' (required)' : '';
  $('unit-block').hidden = !a.unit; $('floor-block').hidden = !a.floor;
  if (a.unit) { $('unit-label').textContent = a.unit.label + req(a.unit); $('unit-hint').textContent = a.unit.hint || ''; $('unit-hint').hidden = !a.unit.hint; }
  if (a.floor) $('floor-label').textContent = a.floor.label + req(a.floor);
  document.querySelector('label[for=detail]').textContent = a.detail.label + req(a.detail);
  $('detail').placeholder = a.detail.ph;
  const note = a.g === 'mine' ? 'This space may be shared with ' + (a.id === 'room' ? 'roommates' : 'apartmentmates or suitemates') + '. Tell staff which one so they go to the right place.' : '';
  $('loc-note').textContent = note; $('loc-note').hidden = !note;
  $('sdk-note').hidden = !sdkReady();
  updateItNote();
  $('form-msg').textContent = '';
  state.category = null; state.catManual = false; autoCategory();
  $('entry-block').hidden = !a.entry;                                    // only inside the person's own room or unit, never a shared space
  updatePhotoUI();
  go('s-details', replace);
}

const evt = (type, extra) => ({ type, at:nowIso(), actorId:app.user.id, actorName:app.user.name, actorRole:app.user.role, visibility:'public', ...extra });

async function submitReport() {
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
  $('send').disabled = true; $('form-msg').textContent = '';
  try {
    const photo = state.photo ? await blobToDataUrl(state.photo) : null;
    const category = state.category || 'other', t = nowIso();
    // Same words and place again (a retry after a lost answer) reuse one key, so the report can never be saved twice. Changed words get a new key.
    const sig = JSON.stringify([b.code, a.id, desc, $('unit').value, $('floor').value, $('detail').value, category, state.photo ? state.photo.size : 0]);
    if (state.sendSig !== sig) { state.sendSig = sig; state.sendKey = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'k' + Date.now() + Math.random().toString(36).slice(2); }
    const entry = !$('entry-block').hidden ? ($('entry-ok').checked ? 'ok' : 'contact') : null;
    const saved = await app.store.createReport({
      reporterId:app.user.id, reporterName:app.user.name, building:b.code, buildingName:b.type === 'dorm' ? b.name : b.code,
      area:a.id, areaLabel:areaLabel(b, a), category, priority:suggestPriority(desc), prioritySource:'auto', status:'new',
      unit:a.unit ? $('unit').value.trim() : '', floor:a.floor ? $('floor').value.trim() : '', detail:$('detail').value.trim(), description:desc, photo, entry, awaitingStaff:true, lastActorRole:'student', createdAt:t, updatedAt:t, idemKey:state.sendKey
    }, [evt('created', { text:'Report sent.', at:t })]);
    markSeen(saved);
    app.lastId = saved.id;
    sdkFollowUp(saved, desc, b, areaLabel(b, a), state.photo).catch(e => console.warn('EAiSER follow-up skipped', e));   // never waits, never blocks
    // Say what really happened: only the shared server holds a report that staff on other devices can see.
    const shared = app.mode === 'server';
    $('h-done').textContent = 'Report #' + saved.id + (shared ? ' sent' : ' saved');
    $('done').textContent = whereText(saved) + '. ' + (shared
      ? 'It is in the shared queue for ' + CAT[category].team + '.'
      : 'Demo mode: it is saved ' + (app.mode === 'memory' ? 'in temporary memory and is lost when this page closes' : 'in this browser only') + '. It has not been sent to ' + CAT[category].team + '.')
      + ' You will see updates under My reports.';
    resetDraft();                                  // sent, so the form starts empty next time
    go('s-done');
  } catch (e) {
    console.error(e);
    $('form-msg').textContent = 'We could not confirm that your report was saved. Tap Send again: it will not make a second copy. You can also look under My reports.';
  } finally { updateSubmit(); }
}

function resetDraft() {
  state.building = null; state.place = null; state.fromAI = false; state.category = null; state.catManual = false; state.sendSig = null; state.sendKey = null;
  clearForm();
  for (const id of ['assist-text', 'b-search']) $(id).value = '';
  renderBuildings();
}

/* ---------- Timeline shared by students and workers ---------- */
// A status or type that staff typed themselves is stored in events as "other:their words".
const statusLabel = s => { const k = String(s == null ? '' : s); return k.startsWith('other:') ? (k.slice(6) || 'Other') : (STATUS[k] || { label:k }).label; };
const catName = k => { const t = String(k == null ? '' : k); return t.startsWith('other:') ? (t.slice(6) || 'Other') : (CAT[t] ? CAT[t].label : t); };
function eventText(ev, viewer) {
  const person = n => viewer === 'student' ? firstName(n) : n;
  switch (ev.type) {
    case 'created':   return 'Report sent';
    case 'status':    return 'Status: ' + statusLabel(ev.to);
    case 'priority':  return 'Priority: ' + (PRIORITY[ev.from] || PRIORITY.normal).label + ' to ' + (PRIORITY[ev.to] || PRIORITY.normal).label;
    case 'category':  return 'Type changed: ' + catName(ev.from) + ' to ' + catName(ev.to);
    case 'distinct':  return 'Marked #' + ev.to + ' as a different problem';
    case 'assigned':  return ev.to ? 'Assigned to ' + person(ev.to) : 'Unassigned';
    case 'eta':       return ev.to ? 'Planned fix date: ' + fmtDay(ev.to) : 'Planned fix date cleared';
    case 'duplicate': return 'Merged into report #' + ev.to + ', which is already being handled';
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
      h('div', { class:'t-top' }, h('b', {}, '#' + r.id + ' • ' + r.building + ' • ' + r.areaLabel), h('span', { class:'muted' }, ago(r.updatedAt))),
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
  app.open = { id:r.id, updatedAt:r.updatedAt };
  markSeen(r); refreshBadges().catch(() => {});
  const box = clear($('mine-body'));
  const photo = safePhoto(r.photo);
  box.append(
    h('div', { class:'t-head' }, h('h1', {}, 'Report #' + r.id), h('span', { class:'tag st-' + r.status }, statusText(r))),
    h('p', { class:'muted' }, whereText(r)),
    h('div', { class:'card' }, h('div', { class:'pre' }, r.description),
      photo ? h('img', { class:'thumb', src:photo, alt:'Photo you attached' }) : null),
    h('dl', { class:'facts' },
      h('dt', {}, 'Sent'), h('dd', {}, fmtTime(r.createdAt)),
      h('dt', {}, 'Goes to'), h('dd', {}, catOf(r).team),
      r.assigneeName ? [h('dt', {}, 'Assigned to'), h('dd', {}, firstName(r.assigneeName))] : null,
      r.eta ? [h('dt', {}, 'Planned fix'), h('dd', {}, fmtDay(r.eta))] : null));

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
    if (kind === 'confirm') {
      await app.store.updateReport(r.id, { confirmedAt:nowIso(), lastActorRole:'student' }, [evt('confirmed')]);
    } else if (kind === 'reopen') {
      await app.store.updateReport(r.id, { status:'reopened', resolvedAt:null, confirmedAt:null, awaitingStaff:true, lastActorRole:'student' },
        [evt('status', { from:r.status, to:'reopened' }), evt('reopened')]);
    } else {
      const text = $('student-msg').value.trim();
      if (!text) { $('student-msg-err').textContent = 'Type a message first.'; return; }
      await app.store.updateReport(r.id, { awaitingStaff:true, lastActorRole:'student' }, [evt('message', { text })]);
      $('student-msg').value = '';                                      // sent, so do not bring it back on the redraw
    }
    toast('Sent'); await openMine(r.id);
  } catch (e) { failSoft(e); } finally { studentBusy = false; }
}

/* =====================================================================
   7. Worker: setup, tickets, ticket form
   ===================================================================== */
const inScope = (r, p) => !!p && p.buildings.includes(r.building) && p.places.includes(r.area) && p.categories.includes(catKey(r));
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
    chipGroup('1. Buildings', BUILDINGS.map(b => ({ id:b.code, label:b.code })), setupSel.buildings, renderSetup),
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
async function renderTickets() {
  const p = app.profile;
  if (!p) return;
  const [all, workers] = await Promise.all([app.store.listReports(), app.store.listWorkers().catch(() => [])]);
  const scoped = all.filter(r => inScope(r, p));
  const openList = scoped.filter(isOpen);
  // Safety net: an open report that nobody's saved area covers would otherwise be invisible to every worker. Everyone sees it here.
  const covered = r => workers.some(w => w.profile && w.profile.setupDone && inScope(r, w.profile));
  const unrouted = all.filter(r => isOpen(r) && r.status !== 'duplicate' && !covered(r));
  const mine = all.filter(r => r.assigneeId === app.user.id && isOpen(r));
  const done = scoped.filter(r => !isOpen(r));
  $('scope-line').textContent = scopeSummary(p);
  const stats = clear($('stats'));
  for (const [n, label] of [[openList.length, 'Open'], [openList.filter(r => r.priority === 'urgent').length, 'Urgent'],
    [openList.filter(r => !r.assigneeId).length, 'Unassigned'], [openList.filter(isAging).length, 'Aging']]) {
    stats.append(h('div', { class:'stat' + (n > 0 && (label === 'Urgent' || label === 'Aging') ? ' hot' : '') }, h('b', {}, n), h('span', {}, label)));
  }
  const seg = clear($('tix-seg'));
  for (const [id, label, n] of [['open', 'Open', openList.length], ['mine', 'Mine', mine.length], ...(unrouted.length || tix.tab === 'unrouted' ? [['unrouted', 'Unrouted', unrouted.length]] : []), ['done', 'Done', done.length]]) {
    seg.append(h('button', { type:'button', 'aria-pressed':String(tix.tab === id), onclick:() => { tix.tab = id; renderTickets().catch(failSoft); } }, label + ' (' + n + ')'));
  }
  let list = tix.tab === 'open' ? openList : tix.tab === 'mine' ? mine : tix.tab === 'unrouted' ? unrouted : done;
  const q = tix.q.trim().toLowerCase();
  if (q) list = list.filter(r => ('#' + r.id + ' ' + r.building + ' ' + r.areaLabel + ' ' + r.description + ' ' + (r.unit || '') + ' ' + (r.floor || '') + ' ' + (r.detail || '') + ' ' + r.reporterName + ' ' + catLabel(r) + ' ' + statusText(r)).toLowerCase().includes(q));
  list = list.slice().sort(tix.tab === 'done'
    ? (a, b) => b.updatedAt.localeCompare(a.updatedAt)
    : (a, b) => prio(a.priority).rank - prio(b.priority).rank || a.createdAt.localeCompare(b.createdAt));
  const box = clear($('tix-list'));
  if (tix.tab === 'unrouted' && list.length) box.append(h('p', { class:'muted small' }, 'No worker’s saved area covers these reports, so nobody else sees them. Open one and assign it to yourself.'));
  if (!list.length) {
    box.append(h('div', { class:'empty' }, q ? 'No tickets match your search.' : tix.tab === 'open' ? 'Nothing open for your area. Nice.' : tix.tab === 'mine' ? 'You have no open tickets assigned to you.' : tix.tab === 'unrouted' ? 'Every open report is covered by someone’s area.' : 'No finished tickets yet.'));
    return;
  }
  for (const r of list) {
    box.append(h('button', { class:'card pc-' + r.priority, type:'button', onclick:() => openTicket(r.id).catch(failSoft) },
      h('div', { class:'t-top' }, h('b', {}, '#' + r.id + ' • ' + r.building + ' • ' + r.areaLabel), h('span', { class:'muted' }, ago(r.createdAt))),
      whereExtra(r) ? h('div', { class:'muted small' }, whereExtra(r)) : null,
      h('div', { class:'t-desc' }, r.description || '(no description)'),
      h('div', { class:'tags' },
        h('span', { class:'tag pr-' + (PRIORITY[r.priority] ? r.priority : 'normal') }, prio(r.priority).label),
        h('span', { class:'tag st-' + r.status }, statusText(r)),
        h('span', { class:'tag' }, r.assigneeName ? firstName(r.assigneeName) : 'Unassigned'),
        isAging(r) ? h('span', { class:'tag warn' }, 'Aging') : null,
        r.awaitingStaff && r.status !== 'new' ? h('span', { class:'tag dot' }, 'Student replied') : null,
        r.hasPhoto ? h('span', { class:'tag' }, 'Photo') : null)));
  }
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
  app.open = { id:r.id, updatedAt:r.updatedAt };
  const box = clear($('ticket-body')), cat = catOf(r), photo = safePhoto(r.photo);
  const liveBanner = h('div', { class:'live', id:'ticket-live', hidden:true }, h('span', {}, 'This ticket was just updated by someone else.'),
    h('button', { class:'secondary', type:'button', onclick:() => openTicket(r.id).catch(failSoft) }, 'Refresh'));

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
      r.entry ? [h('dt', {}, 'Entering'), h('dd', {}, r.entry === 'ok' ? 'The student allows entry when they are away.' : 'Contact the student before you enter.')] : null,
      h('dt', {}, 'Type'), h('dd', {}, catLabel(r)),
      h('dt', {}, 'Goes to'), h('dd', {}, cat.team),
      h('dt', {}, 'How to route'), h('dd', {}, cat.route),
      h('dt', {}, 'Priority'), h('dd', {}, prio(r.priority).label + (r.prioritySource === 'auto' ? ' (suggested from the description, change it if needed)' : ' (set by staff)')),
      r.eta ? [h('dt', {}, 'Planned fix'), h('dd', {}, fmtDay(r.eta))] : null));

  /* Other open reports in the same place. Staff can merge them, or say they are different so they stop showing. */
  const candidates = isOpen(r) ? all.filter(x => isOpen(x) && sameSpot(r, x)).slice(0, 8) : [];
  const theirEvents = await Promise.all(candidates.map(x => app.store.listEvents(x.id)));
  const markedDifferent = (x, xEvents) =>
    evs.some(e => e.type === 'distinct' && String(e.to) === String(x.id)) || xEvents.some(e => e.type === 'distinct' && String(e.to) === String(r.id));
  const similar = candidates.filter((x, i) => !markedDifferent(x, theirEvents[i])).slice(0, 4);
  if (similar.length) {
    box.append(h('div', { class:'info' }, h('b', {}, 'Other open reports in this place'),
      h('p', { class:'muted small' }, 'Is it the same problem? Merge it, or mark it as different so it stops showing here.'),
      similar.map(x => h('div', { class:'similar' },
        h('div', {}, '#' + x.id + ' • ' + ago(x.createdAt) + ' • ' + (x.description || '').slice(0, 70)),
        h('div', { class:'row' },
          h('button', { class:'secondary', type:'button', onclick:() => mergeDuplicate(r, x).catch(failSoft) }, 'Same problem as #' + x.id),
          h('button', { class:'secondary', type:'button', 'aria-label':'#' + x.id + ' is a different problem', onclick:() => markDifferent(r, x).catch(failSoft) }, 'Not the same problem'))))));
  }

  /* Update form */
  const me = { id:app.user.id, name:app.user.name };
  const staff = workers.filter(w => w.user.id !== me.id && inScope(r, w.profile)).map(w => ({ id:w.user.id, name:w.user.name }));
  const assignees = [{ id:'', name:'Unassigned' }, { id:me.id, name:me.name + ' (me)' }, ...staff];
  if (r.assigneeId && !assignees.some(a => a.id === r.assigneeId)) assignees.push({ id:r.assigneeId, name:r.assigneeName || 'Assigned' });
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
  const fEta = h('input', { type:'date', id:'f-eta', min:todayStr(), value:r.eta || '' });
  const fMsg = h('textarea', { id:'f-msg', maxlength:'1500' });
  const fNote = h('textarea', { id:'f-note', maxlength:'1500', placeholder:'Parts, access codes, who to call. The student never sees this.' });
  const statusTextWrap = field('Your status', fStatusText, 'The student sees this as the status.', 'f-status-text');
  const catTextWrap = field('Type of problem, in your words', fCatText, 'Staff only.', 'f-cat-text');
  const err = h('p', { class:'msg', id:'f-err', role:'status' });
  const saveBtn = h('button', { class:'primary', type:'button' }, 'Save update');

  const hints = { resolved:'What was done? (required)', waiting:'What are you waiting for, and when do you expect it? (required)' };
  const syncForm = () => {
    fMsg.placeholder = hints[fStatus.value] || 'Visible to the student, e.g. "Tech comes Thursday morning. Please clear the area."';
    statusTextWrap.hidden = fStatus.value !== 'other';
    catTextWrap.hidden = fCategory.value !== 'other';
  };
  fStatus.addEventListener('change', syncForm); fCategory.addEventListener('change', syncForm); syncForm();

  const quick = (!r.assigneeId && isOpen(r))
    ? h('button', { class:'secondary block mt', type:'button', onclick:() => { fAssignee.value = me.id; if (['new', 'reopened', 'acknowledged'].includes(fStatus.value)) fStatus.value = 'in_progress'; syncForm(); saveBtn.click(); } }, 'Claim and start')
    : null;

  box.append(h('div', { class:'card' }, h('h2', {}, 'Update this ticket'), quick,
    h('div', { class:'form-grid' },
      field('Status', fStatus, null, 'f-status'), statusTextWrap,
      field('Type of problem', fCategory, 'Changing it can move the ticket to another team.', 'f-category'), catTextWrap,
      field('Assigned to', fAssignee, null, 'f-assignee'),
      field('Priority', fPriority, 'Urgent goes first in everyone’s list.', 'f-priority'),
      field('Planned fix date', fEta, 'The student sees this.', 'f-eta')),
    field('Message to the student', fMsg, 'Visible to the student.', 'f-msg'),
    field('Internal note', fNote, 'Staff only.', 'f-note'),
    err, saveBtn));

  saveBtn.addEventListener('click', () => saveTicket(r, { fStatus, fStatusText, fPriority, fCategory, fCatText, fAssignee, fEta, fMsg, fNote, assignees, err, saveBtn }).catch(failSoft));
  box.append(h('h2', { class:'mt-lg' }, 'History'), timeline(evs, 'worker'));
  go('s-ticket', activeScreen() === 's-ticket');
}

// Wrapper: the button is locked before anything is awaited, so a double tap cannot save twice.
async function saveTicket(r, f) {
  if (f.saveBtn.disabled) return;
  f.saveBtn.disabled = true;
  try { await saveTicketNow(r, f); } finally { f.saveBtn.disabled = false; }
}
async function saveTicketNow(r, f) {
  f.err.textContent = '';
  const fresh = await app.store.getReport(r.id);
  if (fresh && fresh.updatedAt !== r.updatedAt) {                    // somebody changed it since this form was opened
    const live = $('ticket-live'); if (live) live.hidden = false;
    f.err.textContent = 'Someone else just changed this ticket. Tap Refresh at the top, check it, then save again.';
    return;
  }
  const v = { status:f.fStatus.value, priority:f.fPriority.value, category:f.fCategory.value, assignee:f.fAssignee.value, eta:f.fEta.value,
    msg:f.fMsg.value.trim(), note:f.fNote.value.trim(), statusText:f.fStatusText.value.trim(), catText:f.fCatText.value.trim() };
  const patch = {}, events = [];

  // Status. "Other" carries the words staff typed, and a change of those words counts as a change of status.
  const newStatusText = v.status === 'other' ? v.statusText : '';
  if (v.status === 'other' && !newStatusText) { f.err.textContent = 'Type the status so the student knows what is happening.'; return; }
  const statusChanged = v.status !== r.status || newStatusText !== (r.statusText || '');
  if (statusChanged) {
    if (v.status === 'resolved' && !v.msg) { f.err.textContent = 'Add a short message saying what was done.'; return; }
    if (v.status === 'waiting' && !v.msg) { f.err.textContent = 'Say what you are waiting for so the student knows.'; return; }
  }
  // Moving a ticket to in progress or resolved with nobody on it means the person saving it owns it.
  let assignee = v.assignee;
  if (!assignee && !r.assigneeId && statusChanged && (v.status === 'in_progress' || v.status === 'resolved')) assignee = app.user.id;

  if (statusChanged) {
    patch.status = v.status; patch.statusText = newStatusText || null;
    events.push(evt('status', { from:r.status === 'other' ? 'other:' + (r.statusText || '') : r.status, to:v.status === 'other' ? 'other:' + newStatusText : v.status }));
    if (v.status === 'resolved') { patch.resolvedAt = nowIso(); patch.confirmedAt = null; }
    else if (r.status === 'resolved') { patch.resolvedAt = null; patch.confirmedAt = null; }
  }
  if (assignee !== (r.assigneeId || '')) {
    const a = f.assignees.find(x => x.id === assignee);
    const name = assignee === app.user.id ? app.user.name : (a ? a.name : null);
    patch.assigneeId = assignee || null; patch.assigneeName = assignee ? name : null;
    events.push(evt('assigned', { from:r.assigneeName || null, to:patch.assigneeName }));
  }
  if (v.priority !== r.priority) { patch.priority = v.priority; patch.prioritySource = 'worker'; events.push(evt('priority', { from:r.priority, to:v.priority, visibility:'staff' })); }
  // Type. Compared with the cleaned-up type, so opening an old ticket never creates a change by itself.
  const curCat = catKey(r), newCatText = v.category === 'other' ? v.catText : '';
  if (v.category !== curCat || newCatText !== (r.categoryText || '')) {
    patch.category = v.category; patch.categoryText = newCatText || null;
    events.push(evt('category', { from:curCat === 'other' && r.categoryText ? 'other:' + r.categoryText : curCat, to:v.category === 'other' && newCatText ? 'other:' + newCatText : v.category, visibility:'staff' }));
  }
  if (v.eta !== (r.eta || '')) { patch.eta = v.eta || null; events.push(evt('eta', { to:v.eta || null })); }
  if (v.msg) events.push(evt('message', { text:v.msg }));
  if (v.note) events.push(evt('note', { text:v.note, visibility:'staff' }));

  if (!events.length) { f.err.textContent = 'Nothing to save yet. Change a field or add a message.'; return; }
  patch.awaitingStaff = false; patch.lastActorRole = 'worker';
  const updated = await app.store.updateReport(r.id, patch, events);
  const moved = !inScope(updated, app.profile) && assignee !== app.user.id;
  toast(moved ? 'Saved. It moved to ' + catOf(updated).team + '.' : 'Saved');
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
    await app.store.updateReport(r.id, {}, [evt('distinct', { to:String(x.id), visibility:'staff' })]);
    toast('Marked as a different problem');
    await openTicket(r.id);
  } finally { marking = false; }
}
async function mergeNow(r, original) {
  await app.store.updateReport(r.id, { status:'duplicate', dupOf:original.id, awaitingStaff:false, lastActorRole:'worker' },
    [evt('duplicate', { to:String(original.id) })]);
  await app.store.updateReport(original.id, {}, [evt('note', { text:'Report #' + r.id + ' (' + r.reporterName + ') described the same problem and was merged into this ticket.', visibility:'staff' })]);
  toast('Merged into #' + original.id);
  back();
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
  } else if (app.profile) {
    n = all.filter(r => inScope(r, app.profile) && isOpen(r) && (r.status === 'new' || r.awaitingStaff)).length; id = 'tickets';
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
    if (r && r.updatedAt !== app.open.updatedAt) {
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
  $('assist-go').addEventListener('click', runAssist);
  $('b-search').addEventListener('input', renderBuildings);
  $('b-search').addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const q = $('b-search').value.trim();
    const hits = q ? BUILDINGS.map((b, i) => i).filter(i => buildingMatches(BUILDINGS[i], q)) : [];
    if (hits.length === 1) pickBuilding(hits[0]);                          // Enter opens the building when only one matches
  });
  $('photo').addEventListener('change', onPhotoPicked);
  $('photo-pick').addEventListener('click', () => $('photo').click());   // phones offer the camera and the photo library in one menu
  $('photo-remove').addEventListener('click', () => clearPhoto());
  $('photo-ok').addEventListener('change', updateSubmit);
  $('what').addEventListener('input', () => { updatePhotoUI(); autoCategory(); updateItNote(); });
  $('send').addEventListener('click', submitReport);
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

async function boot() {
  const { store, mode } = await openStore();
  app.store = store; app.mode = mode;
  try { await store.seed(buildSeed()); } catch (e) { console.warn('Could not add the demo data', e); }
  store.onChange(refreshSoon);
  sdkDetect().then(renderBuildings).catch(() => {});                // optional, runs in the background
  const s = session.get();                       // stay signed in until the person logs out
  if (s) {
    app.user = await store.upsertUser({ id:s.id, role:s.role, email:s.email, name:s.name });
    await enterApp();
  }
  $('boot-msg').hidden = true;
}

applyPrefs(devicePrefs());                       // the last look used on this device, before anyone signs in
const BUILD = '2026-10-24a';
if ($('build-tag')) $('build-tag').textContent = 'Build ' + BUILD;
wire();
app.ready = boot().catch(e => {
  console.error(e);
  $('boot-msg').textContent = 'Could not start the app. Reload the page to try again.';
});