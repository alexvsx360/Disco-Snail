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
  stomp: ['stomp', 'stomp2', 'stomp3', 'enemy_hurt'],
  jump: ['jump', 'jump2', 'jump3'],
  death: ['death', 'death2', 'death3'],
  powerup: ['powerup', 'powerup2', 'powerup3'],
  brick: ['brick', 'brick2', 'brick3'],
  fire: ['fire', 'fire2', 'fire3'],
  pickup: ['pickup', 'pickup2', 'pickup3'],
  pipe: ['pipe', 'pipe2'],
  drowning: ['drowning', 'drowning2', 'drowning3'],
  lava_splash: ['lava_splash', 'lava_splash2'],
  levelComplete: ['levelComplete', 'levelComplete_victory'],
  powerup_spawn: ['powerup_spawn', 'powerup_spawn2']
};
const SOUND_VARIANT_FILES = {
  coin2: 'sound/coin2.wav',
  coin3: 'sound/coin3.wav',
  stomp2: 'sound/Hit2.wav',
  stomp3: 'sound/Hit.wav',
  enemy_hurt: 'sound/mnstr10.wav',
  jump2: 'sound/swing2.wav',
  jump3: 'sound/swing3.wav',
  death2: 'sound/mnstr2.wav',
  death3: 'sound/mnstr3.wav',
  powerup2: 'sound/PowerUp1.wav',
  powerup3: 'sound/PowerUp.wav',
  brick2: 'sound/Random1.wav',
  brick3: 'sound/Random2.wav',
  fire2: 'sound/Shoot1.wav',
  fire3: 'sound/Shoot2.wav',
  pickup2: 'sound/Pickup2.wav',
  pickup3: 'sound/Pickup3.wav',
  pipe2: 'sound/Blip.wav',
  drowning2: 'sound/bubble.wav',
  drowning3: 'sound/bubble2.wav',
  lava_splash2: 'sound/Boom1.wav',
  levelComplete_victory: 'sound/battle victory sound.mp3',
  powerup_spawn2: 'sound/PowerUp.wav'
};

const audioCache = {};
let discoMusic = null;
let mapMusic = null;
let bossMusic = null;
let underwaterBubbleTimer = 0;
const lastPlayedSound = {};
const SOUND_COOLDOWN_MS = 80;

function playSound(name, volume) {
  let src = SOUNDS[name];
  const variants = SOUND_VARIANTS[name];
  if (variants && variants.length > 0) {
    const pick = variants[Math.floor(Math.random() * variants.length)];
    src = SOUND_VARIANT_FILES[pick] || SOUNDS[pick] || src;
  }
  if (!src) return;
  const now = Date.now();
  if (lastPlayedSound[src] && now - lastPlayedSound[src] < SOUND_COOLDOWN_MS) return;
  lastPlayedSound[src] = now;
  try {
    let a = audioCache[src];
    if (!a) { a = new Audio(src); audioCache[src] = a; }
    a.currentTime = 0;
    a.volume = volume !== undefined ? Math.max(0.1, Math.min(1, volume)) : 0.4;
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
      let a = audioCache[SOUNDS.underwater_bubble];
      if (!a) { a = new Audio(SOUNDS.underwater_bubble); audioCache[SOUNDS.underwater_bubble] = a; }
      a.currentTime = 0;
      a.volume = 0.1;
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

const SOUND_MAP_MUSIC = 'sound/map music.mp3';
const SOUND_BOSS_MUSIC = 'sound/battel music.mp3';
const SOUND_VICTORY_MUSIC = 'sound/battle victory sound.mp3';

function playMapMusic() {
  try {
    if (mapMusic) { mapMusic.currentTime = 0; mapMusic.play().catch(() => {}); return; }
    mapMusic = new Audio(SOUND_MAP_MUSIC);
    mapMusic.volume = 0.25;
    mapMusic.loop = true;
    mapMusic.play().catch(() => {});
  } catch (e) {}
}

function stopMapMusic() {
  try {
    if (mapMusic) { mapMusic.pause(); mapMusic.currentTime = 0; }
  } catch (e) {}
}

function playBossMusic() {
  try {
    stopMapMusic();
    if (bossMusic) { bossMusic.currentTime = 0; bossMusic.play().catch(() => {}); return; }
    bossMusic = new Audio(SOUND_BOSS_MUSIC);
    bossMusic.volume = 0.3;
    bossMusic.loop = true;
    bossMusic.play().catch(() => {});
  } catch (e) {}
}

function stopBossMusic() {
  try {
    if (bossMusic) { bossMusic.pause(); bossMusic.currentTime = 0; }
  } catch (e) {}
}

function playVictoryMusic() {
  try {
    stopBossMusic();
    const a = new Audio(SOUND_VICTORY_MUSIC);
    a.volume = 0.4;
    a.play().catch(() => {});
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

const SAVE_COOKIE = 'discoSnail';
const LEADER_COOKIE = 'discoSnailLB';
const COOKIE_DAYS = 365;

function setCookie(name, value, days) {
  try {
    const d = new Date();
    d.setTime(d.getTime() + (days || COOKIE_DAYS) * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + encodeURIComponent(value) + ';path=/;max-age=' + (days * 24 * 60 * 60) + ';SameSite=Lax';
  } catch (e) {}
}
function getCookie(name) {
  try {
    const n = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1);
      if (c.indexOf(n) === 0) return decodeURIComponent(c.substring(n.length));
    }
  } catch (e) {}
  return null;
}

function saveGameState() {
  try {
    if (typeof player === 'undefined' || !player) return;
    const state = {
      score, lives, coins, currentLevel, highScore,
      powerType: player.powerType, powerLevel: player.powerLevel || 0,
      hasMagnet: player.hasMagnet || false, hasSuperMagnet: player.hasSuperMagnet || false,
      hasWings: player.hasWings || false, big: player.big || false,
      sewerDepth: typeof sewerDepth !== 'undefined' ? sewerDepth : 0,
      inSpaceRealm: typeof inSpaceRealm !== 'undefined' ? inSpaceRealm : false,
      spaceStage: typeof spaceStage !== 'undefined' ? spaceStage : 1,
      inWaterRealm: typeof inWaterRealm !== 'undefined' ? inWaterRealm : false,
      waterStage: typeof waterStage !== 'undefined' ? waterStage : 1,
      savedOverworldX: typeof savedOverworldX !== 'undefined' ? savedOverworldX : 0,
      shieldBonusTimer: typeof shieldBonusTimer !== 'undefined' ? shieldBonusTimer : 0,
      timeShieldTimer: typeof timeShieldTimer !== 'undefined' ? timeShieldTimer : 0,
      doubleCoinsTimer: typeof doubleCoinsTimer !== 'undefined' ? doubleCoinsTimer : 0,
      levelPowers: typeof levelPowers !== 'undefined' ? (levelPowers || {}) : {}
    };
    setCookie(SAVE_COOKIE, JSON.stringify(state), COOKIE_DAYS);
  } catch (e) {}
}
function loadGameState() {
  try {
    const raw = getCookie(SAVE_COOKIE);
    if (!raw) return false;
    const s = JSON.parse(raw);
    if (s.score !== undefined) score = s.score;
    if (s.lives !== undefined) lives = s.lives;
    if (s.coins !== undefined) coins = s.coins;
    if (s.currentLevel !== undefined) currentLevel = s.currentLevel;
    if (s.highScore !== undefined) highScore = Math.max(highScore || 0, s.highScore);
    if (s.levelPowers) levelPowers = s.levelPowers;
    if (s.sewerDepth !== undefined) sewerDepth = s.sewerDepth;
    if (s.inSpaceRealm !== undefined) inSpaceRealm = s.inSpaceRealm;
    if (s.spaceStage !== undefined) spaceStage = s.spaceStage;
    if (s.inWaterRealm !== undefined) inWaterRealm = s.inWaterRealm;
    if (s.waterStage !== undefined) waterStage = s.waterStage;
    if (s.savedOverworldX !== undefined) savedOverworldX = s.savedOverworldX;
    if (s.shieldBonusTimer !== undefined) shieldBonusTimer = s.shieldBonusTimer;
    if (s.timeShieldTimer !== undefined) timeShieldTimer = s.timeShieldTimer;
    if (s.doubleCoinsTimer !== undefined) doubleCoinsTimer = s.doubleCoinsTimer;
    if (player) {
      if (s.powerType) player.powerType = s.powerType;
      if (s.powerLevel !== undefined) player.powerLevel = s.powerLevel;
      if (s.hasMagnet) player.hasMagnet = s.hasMagnet;
      if (s.hasSuperMagnet) player.hasSuperMagnet = s.hasSuperMagnet;
      if (s.hasWings) player.hasWings = s.hasWings;
      if (s.big) { player.big = s.big; player.height = s.big ? 56 : 40; }
    }
    return true;
  } catch (e) { return false; }
}

function getLeaderboard() {
  try {
    const raw = getCookie(LEADER_COOKIE);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}
function saveLeaderboard(arr) {
  try {
    setCookie(LEADER_COOKIE, JSON.stringify(arr), COOKIE_DAYS);
  } catch (e) {}
}
function addToLeaderboard(name, sc) {
  const lb = getLeaderboard();
  const entry = { name: String(name || 'Player').slice(0, 20), score: sc || 0, date: Date.now() };
  lb.push(entry);
  lb.sort((a, b) => (b.score || 0) - (a.score || 0));
  const top = lb.slice(0, 10);
  saveLeaderboard(top);
  return top;
}

function showLeaderboard(finalScore, isVictory, afterAdd) {
  const el = document.getElementById('leaderboardOverlay');
  const body = document.getElementById('leaderboardBody');
  const nameIn = document.getElementById('leaderboardName');
  const addBtn = document.getElementById('leaderboardAddBtn');
  const addForm = document.getElementById('leaderboardAddForm');
  const hint = document.getElementById('leaderboardHint');
  if (!el || !body) return;
  const lb = getLeaderboard();
  body.innerHTML = '';
  lb.forEach((e, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td>' + (i + 1) + '</td><td>' + (e.name || '-') + '</td><td>' + (e.score || 0) + '</td>';
    body.appendChild(tr);
  });
  if (afterAdd) {
    if (addForm) addForm.style.display = 'none';
    if (hint) hint.textContent = 'Added! Press R to play again.';
    if (nameIn) { nameIn.value = ''; nameIn.blur(); }
  } else {
    if (addForm) addForm.style.display = 'flex';
    if (nameIn) { nameIn.value = ''; nameIn.disabled = false; nameIn.readOnly = false; nameIn.removeAttribute('readonly'); }
    if (hint) hint.textContent = isVictory ? 'You won! Add your name to the leaderboard.' : 'Add your score to the leaderboard.';
    const doAdd = () => {
      const n = (nameIn && nameIn.value.trim()) || 'Player';
      addToLeaderboard(n, finalScore);
      showLeaderboard(finalScore, isVictory, true);
    };
    if (addBtn) { addBtn.onclick = doAdd; addBtn.disabled = false; }
    if (nameIn) {
      nameIn.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); doAdd(); } };
    }
    setTimeout(function() { if (nameIn) nameIn.focus(); }, 150);
  }
  el.style.display = 'flex';
  el.style.visibility = 'visible';
  el.style.pointerEvents = 'auto';
  const gc = document.getElementById('gameContainer');
  if (gc) gc.classList.add('leaderboard-visible');
  const canvas = document.getElementById('gameCanvas');
  if (canvas) canvas.blur();
}
function hideLeaderboard() {
  const el = document.getElementById('leaderboardOverlay');
  if (el) el.style.display = 'none';
  const gc = document.getElementById('gameContainer');
  if (gc) gc.classList.remove('leaderboard-visible');
}
function clearMemoryForTransition() {
  particles.length = 0;
  scorePopups.length = 0;
  if (typeof powerProjectiles !== 'undefined') powerProjectiles = powerProjectiles.filter(pp => pp.active && pp.x > cameraX - 100 && pp.x < cameraX + VIEW_WIDTH + 100);
  if (typeof powerUps !== 'undefined') powerUps = powerUps.filter(p => !p.collected);
}
