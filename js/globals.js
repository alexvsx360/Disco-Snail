/* globals.js - Game constants and state variables (global scope, no IIFE) */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

const GRAVITY = 0.45;
const FRICTION = 0.82;
const AIR_CONTROL = 0.92; /* פחות חיכוך באוויר - שליטה טובה יותר בקפיצה */
const JUMP_FORCE = -12.5;
const MOVE_SPEED = 6;
const TILE_SIZE = 32;
const CHUNK_WIDTH = 80;
const LEVEL_LENGTH = 5;
const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 480;
const GROUND_Y = 400;
const PLAYER_HIT_PAD = 6; /* הוקטן אזור הפגיעה - פחות מוות לא הוגן */
const MAX_JUMPS = 2; /* קפיצה כפולה - קפיצה אחת מהקרקע + אחת באוויר */

let gameState = 'start';
let gameWinLeaderboardShown = false;
let storyScreen = null;
let pausedFromState = null;
let score = 0;
let lives = 3;
let coins = 0;
let currentLevel = 1;
let cameraX = 0;
let highScore = 0;
let chunks = {};
let player, sister;
let keys = {};
let particles = [];
let scorePopups = [];
let screenShake = 0;
let invincibleTimer = 0;
let levelStartTimer = 90;
let clouds = [];
let backgroundTrees = [];
let sewerDepth = 0;
let sewerChunks = {};
let pipes = [];
let pipeEnterCooldown = 0;
let sewerStartTimer = 0;
let savedOverworldX = 0;
let sewerPipes = [];
let targetCameraX = 0;
let comboCount = 0;
let comboTimer = 0;
let pipeTransitionAlpha = 0;
let pipeTransitionDir = 0;
let gameStateBoss = null;
let bossDoorX = 0;
let bossCockroach = null;
let bossMinions = [];
let bossDiscoBalls = [];
let bossBigDiscoSize = 0;
let bossDiscoCollected = 0;
let bossFloorBreak = 0;
let bossVictoryTimer = 0;
let princessSnail = null;
let bossPhase = 'fight';
let bossLightsTimer = 0;
let bossDanceTimer = 0;
let bossBurnTimer = 0;
let bossVictoryDisco = null;
let bossFallX = 400;
let globalGameSpeed = 1;
let inSpaceRealm = false;
let spaceStage = 1;
let spaceshipX = 0;
let spaceshipAnimTimer = 0;
let spaceBossPortalX = 0;
let bossMosquito = null;
let spaceBossMinions = [];
let spaceBossDiscoBalls = [];
let spaceBossPhase = 'fight';
let spaceBossLightsTimer = 0;
let spaceBossDanceTimer = 0;
let spaceBossLaserTimer = 0;
let celestialGateways = [];
let earthReturnObjects = [];
let planetHumTimer = 0;

const EMOJI = {
  player: '🐌', sister: '🪩', turtle: '🐢', fish: '🦈', coin: '🪙',
  brick: '🧱', block: '📦', question: '❓', empty: '⬜', mushroom: '🍄',
  mushroomGreen: '❤️', fire: '🔥', flower: '🌸', flag: '🏁', ground: '🟫',
  pipe: '❤️', pipeDown: '⬇️', pipeUp: '⬆️', rat: '🐀', spider: '🕷️', gem: '💎', star: '⭐',
  earth: '🪨', water: '💧', wind: '💨', ice: '❄️', lightning: '⚡', nature: '🌿',
  stone: '⛰️', shadow: '🌑', light: '✨', disco: '🪩', magnet: '🧲', roach: '🪳', princess: '🐌',
  spacefly: '🪰', cyberant: '🐜', planet: '🪐', earthGlobe: '🌍', mosquito: '🦟', spaceship: '🚀',
  cactus: '🌵', volcano: '🌋', meteor: '☄️', spike: '🪨', warn: '❗️', cactusFruit: '🍅',
  octopus: '🐙', seaweed: '🌿', fish: '🐟', fish2: '🐠', fish3: '🐡', crab: '🦀', shrimp: '🦐',
  wings: '🪽', shield: '🛡️', timeShield: '⏱️', superMagnet: '🧲', doubleCoins: '💰', extraLife: '❤️',
  lobster: '🦞', jellyfish: '🪼', coral: '🪸', bubbles: '🫧', heart: '❤️'
};

const MAX_OXYGEN = 100;

const POWER_TYPES = ['fire','earth','water','wind','ice','lightning','nature','stone','shadow','light','time','vortex','toxic','phantom','sound','prism','plasma','meteor','void','beam'];
const POWER_EMOJI = { fire:'🔥', earth:'🪨', water:'💧', wind:'💨', ice:'❄️', lightning:'⚡', nature:'🌿', stone:'⛰️', shadow:'🌑', light:'✨', time:'⏱️', vortex:'🌪️', toxic:'☣️', phantom:'👻', sound:'🔊', prism:'💠', plasma:'⚛️', meteor:'☄️', void:'🕳️', beam:'🔦' };
const POWER_COLOR = { fire:'#f97316', earth:'#78716c', water:'#0ea5e9', wind:'#94a3b8', ice:'#38bdf8', lightning:'#eab308', nature:'#22c55e', stone:'#57534e', shadow:'#4c1d95', light:'#fef08a', time:'#a78bfa', vortex:'#818cf8', toxic:'#84cc16', phantom:'#c084fc', sound:'#f472b6', prism:'#67e8f9', plasma:'#f97316', meteor:'#fbbf24', void:'#1e1b4b', beam:'#facc15' };
const POWER_SOUND = { fire:'fire', earth:'brick', water:'water', wind:'spell', ice:'spell', lightning:'fire', nature:'powerup', stone:'brick', shadow:'spell', light:'powerup', time:'spell', vortex:'brick', toxic:'water', phantom:'spell', sound:'fire', prism:'brick', plasma:'fire', meteor:'brick', void:'spell', beam:'fire' };

const LEVEL_THEMES = [
  { bgGradient: ['#87ceeb','#5c94fc','#4a7fd8'], groundColor: '#5d4e37', blockStyle: 'brick', weather: 'sun', enemyTypes: ['turtle','turtle','fish'], timeOfDay: 'day' },
  { bgGradient: ['#7dd3fc','#38bdf8','#0ea5e9'], groundColor: '#6b5b45', blockStyle: 'question', weather: 'sun', enemyTypes: ['turtle','fish','rat'], timeOfDay: 'day' },
  { bgGradient: ['#93c5fd','#60a5fa','#3b82f6'], groundColor: '#5d4e37', blockStyle: 'brick', weather: 'cloudy', enemyTypes: ['turtle','fish','rat','spider'], timeOfDay: 'day' },
  { bgGradient: ['#a5b4fc','#818cf8','#6366f1'], groundColor: '#6b5b45', blockStyle: 'brick', weather: 'cloudy', enemyTypes: ['turtle','fish','rat','crab'], timeOfDay: 'night' },
  { bgGradient: ['#94a3b8','#64748b','#475569'], groundColor: '#57534e', blockStyle: 'brick', weather: 'wind', enemyTypes: ['turtle','fish','rat','spider','crab'], timeOfDay: 'night' },
  { bgGradient: ['#cbd5e1','#94a3b8','#64748b'], groundColor: '#525252', blockStyle: 'brick', weather: 'wind', enemyTypes: ['turtle','fish','rat','spider','crab'], timeOfDay: 'day' },
  { bgGradient: ['#bae6fd','#7dd3fc','#38bdf8'], groundColor: '#5d4e37', blockStyle: 'question', weather: 'rain', enemyTypes: ['turtle','fish','rat','spider','crab'], timeOfDay: 'day' },
  { bgGradient: ['#1e3a5f','#0f2744','#0a1929'], groundColor: '#44403c', blockStyle: 'brick', weather: 'rain', enemyTypes: ['fish','rat','spider','crab'], timeOfDay: 'night' },
  { bgGradient: ['#e2e8f0','#cbd5e1','#94a3b8'], groundColor: '#57534e', blockStyle: 'brick', weather: 'snow', enemyTypes: ['fish','rat','spider','crab'], timeOfDay: 'day' },
  { bgGradient: ['#2d3748','#1a202c','#0d1117'], groundColor: '#44403c', blockStyle: 'brick', weather: 'snow', enemyTypes: ['fish','rat','spider','crab'], timeOfDay: 'night' },
  { bgGradient: ['#64748b','#475569','#334155'], groundColor: '#3f3f46', blockStyle: 'brick', weather: 'rain', enemyTypes: ['rat','spider','crab'], timeOfDay: 'night' },
  { bgGradient: ['#475569','#334155','#1e293b'], groundColor: '#3f3f46', blockStyle: 'brick', weather: 'wind', enemyTypes: ['rat','spider','crab'], timeOfDay: 'night' },
  { bgGradient: ['#334155','#1e293b','#0f172a'], groundColor: '#27272a', blockStyle: 'brick', weather: 'snow', enemyTypes: ['rat','spider','crab'], timeOfDay: 'day' },
  { bgGradient: ['#1e293b','#0f172a','#020617'], groundColor: '#27272a', blockStyle: 'brick', weather: 'rain', enemyTypes: ['rat','spider','crab'], timeOfDay: 'night' },
  { bgGradient: ['#0f172a','#020617','#000000'], groundColor: '#18181b', blockStyle: 'brick', weather: 'snow', enemyTypes: ['rat','spider','crab'], timeOfDay: 'night' }
];

let powerUps = [];
let powerProjectiles = [];
let powerCooldown = 0;
let waterOrbitAngle = 0;
let stoneGiantTimer = 0;
let stoneGiantNoHitTimer = 0;
let stoneGiantCooldown = 0;
let lightningStrikeTimer = 0;
let lightningBolts = [];
let windPushTimer = 0;
let iceTrail = [];
let snowParticles = [];
let natureVines = [];
let shadowClone = null;
let blackHole = null;
let lightAuraTimer = 0;
let fireOrbitAngle = 0;
let beamPillars = [];
let electricArcs = [];
let flowerProjectiles = [];
let discoBallTimer = 0;
let discoRays = [];
let enemiesDanceFromDisco = false;
let discoCollectParticles = [];
let discoCollectFlash = 0;
let windParticles = [];
let lightAuraBursts = [];
let earthCracks = [];
let levelWeatherParticles = [];
let soundWaves = [];
let poisonClouds = [];
let phantomGhost = null;
let vortexWinds = [];
let vortexSpawnTimer = 0;
let voidHoles = [];
let voidSpawnTimer = 0;
let plasmaPulses = [];
let plasmaPulseTimer = 0;
let prismGems = [];
let meteors = [];
let earthShockwaves = [];
let windPushEffects = [];
let soundHitEffects = [];
let lightKillBeams = [];
let voidSuckParticles = [];
let prismLiftBeams = [];

let bossCactus = null;
let cactusRoots = [];
let cactusNeedles = [];
let cactusMinions = [];
let cactusDiscoBalls = [];
let cactusBossPhase = 'fight';
let cactusLightsTimer = 0;
let cactusLaserTimer = 0;
let cactusBloomTimer = 0;

/* Boss cutscene state - player auto-walks to safe position, no death during cutscenes */
let bossCutsceneMode = false;
let bossCutsceneTargetX = 200;
let bossSplashParticles = [];
let spaceBossSupernovaParticles = [];
let spaceBossSupernovaFlashTimer = 0;
let spaceBossMosquitoStunned = false;
let spaceBossVictoryDisco = null;
let cactusBloomParticles = [];
let cactusGroundColorMix = 0;
let shieldBonusTimer = 0;      /* מגן - חסינות */
let timeShieldTimer = 0;       /* האטת זמן - רק אויבים */
let doubleCoinsTimer = 0;      /* מטבעות כפולים */
let enemyTimeSlow = 1;         /* 1=רגיל, 0.45=האטה - רק לאויבים */

const COIN_MAGNET_RANGE = 80;
const COMBO_TIMEOUT = 150;

const SPACE_NEON_COLORS = { 1: '#00FFFF', 2: '#ff9800', 3: '#84ff00' };

const SEWER_ENEMIES = [
  ['turtle', 'rat', 'turtle'],
  ['turtle', 'rat', 'fish', 'crab'],
  ['turtle', 'rat', 'fish', 'spider', 'crab'],
  ['rat', 'fish', 'spider', 'crab'],
  ['rat', 'spider', 'crab']
];

const SEWER_LENGTH = 8;
const SEWER_WIDTH = SEWER_LENGTH * CHUNK_WIDTH * TILE_SIZE;
const SEWER_GROUND = 400;
const WATER_LENGTH = 5;
const WATER_WIDTH = WATER_LENGTH * CHUNK_WIDTH * TILE_SIZE;
const WATER_GROUND = 440;
const SEWER_WATER_TOP = 380;
let waterPits = [];
let sewerSpikes = [];
let fireColumns = [];

let flagX = 0;
let cactusBossPortalX = 0;

/* Underwater Realm */
let inWaterRealm = false;
let waterStage = 1;
let octopusTrapPit = null;
let octopus = null;
let octopusTransition = null;
let octopusPoolIdle = null;
let waterSeaweed = [];
let waterFish = [];
let waterCoral = [];
let sludgePits = [];
let waterEnemies = [];
let jellyfishBoss = null;
let jellyfishMinions = [];
let jellyfishDiscoBalls = [];
let jellyfishBossBubbles = [];
let jellyfishBossBubbleTimer = 0;
let jellyfishBossPhase = 'fight';
let jellyfishBossStompHits = 0;
let jellyfishStompDiscoBall = null;
let jellyfishVictoryDisco = null;
let jellyfishOctopus = null;
const MAX_BUBBLE_HEART_PARTICLES = 50;
let waterChunks = {};
let waterBossPortalX = 0;
let drowningTimer = 0;
let levelPowers = {};
let transitionManager = null;
let cleanupTimer = 0;
