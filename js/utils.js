/* utils.js - Sound, random, URL helpers */
const SOUNDS = {
  /* Movement & Action */
  jump: 'sound/swing.wav',
  swim: 'sound/bubble.wav',
  stomp: 'sound/Hit1.wav',
  fire: 'sound/Shoot.wav',
  brick: 'sound/Random.wav',
  /* Collectibles & Powerups */
  coin: 'sound/coin.wav',
  pickup: 'sound/Pickup1.wav',
  powerup: 'sound/magic1.wav',
  powerup_spawn: 'sound/PowerUp.wav',
  bonus: 'sound/magic1.wav',
  /* Enemies & Danger */
  death: 'sound/mnstr1.wav',
  enemy_hurt: 'sound/mnstr10.wav',
  drowning: 'sound/bubble3.wav',
  octopus_grab: 'sound/slime2.wav',
  /* Atmosphere & Music */
  start: 'sound/level up sound.mp3',
  gameOver: 'sound/game over music.mp3',
  boss_intro: 'sound/enenmy encounter sound.mp3',
  lava_splash: 'sound/Boom.wav',
  /* Cinematic & Legacy */
  levelComplete: 'sound/door.wav',
  pipe: 'sound/door.wav',
  water: 'sound/slime4.wav',
  flag: 'sound/door.wav',
  pause: 'sound/spell.wav',
  spell: 'sound/spell.wav',
  disco: 'Disco Snails _ Vulfmon & Zachary Barker.mp3',
  planet_hum: 'sound/spell.wav',
  /* Cinematic one-shots */
  octopus_slime: 'sound/slime5.wav',
  octopus_giant: 'sound/giant1.wav',
  jellyfish_fire: 'sound/spell.wav',
  supernova_boom: 'sound/Boom2.wav',
  supernova_metal: 'sound/metal-ringing.wav',
  underwater_bubble: 'sound/bubble2.wav'
};

/* Sound variants for variety - if name has variants, randomly pick one */
const SOUND_VARIANTS = {
  coin: ['coin', 'coin2', 'coin3'],
  stomp: ['stomp', 'stomp2'],
  jump: ['jump', 'jump2']
};
const SOUND_VARIANT_FILES = {
  coin2: 'sound/coin.wav',
  coin3: 'sound/coin.wav',
  stomp2: 'sound/Hit1.wav',
  jump2: 'sound/swing.wav'
};

const audioCache = {};
let discoMusic = null;
let underwaterBubbleTimer = 0;

function playSound(name) {
  let src = SOUNDS[name];
  const variants = SOUND_VARIANTS[name];
  if (variants && variants.length > 0) {
    const pick = variants[Math.floor(Math.random() * variants.length)];
    src = SOUND_VARIANT_FILES[pick] || SOUNDS[pick] || src;
  }
  if (!src) return;
  try {
    let a = audioCache[src];
    if (!a) { a = new Audio(src); audioCache[src] = a; }
    a.currentTime = 0;
    a.volume = 0.4;
    a.play().catch(() => {});
  } catch (e) {}
}

function preloadSounds() {
  const allSrc = new Set([...Object.values(SOUNDS), ...Object.values(SOUND_VARIANT_FILES)]);
  for (const src of allSrc) {
    try {
      const a = new Audio(src);
      a.preload = 'auto';
      a.load();
      audioCache[src] = a;
    } catch (e) {}
  }
}

function updateUnderwaterAmbience() {
  if (typeof inWaterRealm === 'undefined' || !inWaterRealm) return;
  underwaterBubbleTimer = (underwaterBubbleTimer || 0) + 1;
  if (underwaterBubbleTimer >= 180) {
    underwaterBubbleTimer = 0;
    try {
      const a = new Audio(SOUNDS.underwater_bubble);
      a.volume = 0.15;
      a.play().catch(() => {});
    } catch (e) {}
  }
}

function playDiscoMusic() {
  try {
    if (discoMusic) { discoMusic.currentTime = 0; discoMusic.play().catch(() => {}); return; }
    discoMusic = new Audio(SOUNDS.disco);
    discoMusic.volume = 0.5;
    discoMusic.loop = true;
    discoMusic.play().catch(() => {});
  } catch (e) {}
}

function stopDiscoMusic() {
  try {
    if (discoMusic) { discoMusic.pause(); discoMusic.currentTime = 0; }
  } catch (e) {}
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function showStoryScreen(textArray, onComplete) {
  if (!textArray || textArray.length === 0) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }
  storyScreen = {
    lines: textArray,
    lineIndex: 0,
    charIndex: 0,
    timer: 0,
    onComplete: onComplete
  };
  gameState = 'story';
}

function getUrlParam(name) {
  try {
    const s = (window.location.search || '').slice(1);
    for (const part of s.split('&')) {
      const eq = part.indexOf('=');
      if (eq > 0) {
        let k, v;
        try { k = decodeURIComponent((part.slice(0, eq) || '').trim()).toUpperCase(); } catch (_) { k = (part.slice(0, eq) || '').trim().toUpperCase(); }
        try { v = decodeURIComponent((part.slice(eq + 1) || '').trim()); } catch (_) { v = (part.slice(eq + 1) || '').trim(); }
        if (k === String(name).toUpperCase()) return v;
      }
    }
  } catch (e) {}
  return null;
}

const SAVE_KEY = 'discoSnailState';
function saveGameState() {
  try {
    if (typeof player === 'undefined' || !player) return;
    const state = {
      score, lives, coins, currentLevel, highScore,
      powerType: player.powerType, powerLevel: player.powerLevel || 0,
      hasMagnet: player.hasMagnet || false, big: player.big || false,
      sewerDepth, inSpaceRealm, spaceStage, levelPowers: levelPowers || {}
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {}
}
function loadGameState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const s = JSON.parse(raw);
    if (s.score !== undefined) score = s.score;
    if (s.lives !== undefined) lives = s.lives;
    if (s.coins !== undefined) coins = s.coins;
    if (s.currentLevel !== undefined) currentLevel = s.currentLevel;
    if (s.highScore !== undefined) highScore = Math.max(highScore || 0, s.highScore);
    if (s.levelPowers) levelPowers = s.levelPowers;
    if (player) {
      if (s.powerType) player.powerType = s.powerType;
      if (s.powerLevel) player.powerLevel = s.powerLevel;
      if (s.hasMagnet) player.hasMagnet = s.hasMagnet;
      if (s.big) { player.big = s.big; player.height = s.big ? 56 : 40; }
    }
    return true;
  } catch (e) { return false; }
}
function clearMemoryForTransition() {
  particles.length = 0;
  scorePopups.length = 0;
  if (typeof powerProjectiles !== 'undefined') powerProjectiles = powerProjectiles.filter(pp => pp.active && pp.x > cameraX - 100 && pp.x < cameraX + VIEW_WIDTH + 100);
  if (typeof powerUps !== 'undefined') powerUps = powerUps.filter(p => !p.collected);
}
