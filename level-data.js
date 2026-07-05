var LEVEL_THRESHOLDS = [];
for (var _i = 0; _i < 100; _i++) LEVEL_THRESHOLDS.push(Math.round(100 * _i * _i + 400 * _i));

var LEVEL_TITLES = [
  'Novice','Apprentice','Explorer','Scholar','Adept',
  'Expert','Master','Sage','Virtuoso','Luminary',
  'Legend','Champion','Conqueror','Titan','Monarch',
  'Sovereign','Emperor','Overlord','Warlord','Chieftain',
  'Seeker','Voyager','Pioneer','Pathfinder','Trailblazer',
  'Adventurer','Discoverer','Navigator','Wayfarer','Roamer',
  'Thinker','Savant','Polymath','Intellectual','Academic',
  'Logophile','Linguist','Philologist','Lexicographer','Wordsmith',
  'Artisan','Architect','Author','Scribe','Poet',
  'Orator','Rhetorician','Elocutionist','Storyteller','Dramatist',
  'Guardian','Sentinel','Warden','Keeper','Defender',
  'Paladin','Cavalier','Knight','Baron','Lord',
  'Duke','Prince','King','Ruler','Commander',
  'General','Marshal','Admiral','Captain','Hero',
  'Mystic','Seer','Oracle','Prophet','Visionary',
  'Enlightened','Awakened','Ascended','Transformed','Evolved',
  'Cosmic','Astral','Celestial','Nebula','Galactic',
  'Stellar','Solar','Lunar','Nova','Supernova',
  'Mythic','Legendary','Immortal','Eternal','Infinite',
  'Transcendent','Omniscient','Omnipotent','Absolute','Finale'
];

function getLevelTitle(level) {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)] || 'Novice';
}
