/* bosses.js - enterBossRoom, enterSpaceBossRoom */

function enterBossRoom() {
  gameState = 'boss';
  sewerDepth = 0;
  cameraX = 0;
  targetCameraX = 0;
  player.x = 150;
  player.y = 350;
  player.vx = 0;
  player.vy = 0;
  player.onGround = true;
  bossCockroach = { x: 550, baseY: 320, y: 320, w: 120, h: 80, shootTimer: 0, jumpTimer: 0, jumpY: 0 };
  bossMinions = [];
  bossDiscoBalls = [];
  bossBigDiscoSize = 0;
  bossDiscoCollected = 0;
  bossFloorBreak = 0;
  bossVictoryTimer = 0;
  princessSnail = null;
  bossPhase = 'fight';
  bossLightsTimer = 0;
  bossDanceTimer = 0;
  bossBurnTimer = 0;
  bossVictoryDisco = null;
  bossFallX = 400;
  bossSplashParticles = [];
  bossCutsceneMode = false;
  playSound('boss_intro');
  playSound('pipe');
  if (typeof stopMapMusic === 'function') stopMapMusic();
  if (typeof playBossMusic === 'function') setTimeout(playBossMusic, 500);
}

function enterSpaceBossRoom() {
  gameState = 'space_boss';
  cameraX = 0;
  targetCameraX = 0;
  player.x = 150;
  player.y = 350;
  player.vx = 0;
  player.vy = 0;
  player.onGround = true;
  bossMosquito = { x: 600, y: 100, w: 100, h: 100, state: 'hover', attackTimer: 0, rotation: 0, scale: 1, swoopVx: 0, swoopVy: 0, targetX: 0, targetY: 0 };
  spaceBossMinions = [];
  spaceBossDiscoBalls = [];
  bossDiscoCollected = 0;
  bossBigDiscoSize = 0;
  spaceBossPhase = 'fight';
  spaceBossLightsTimer = 0;
  spaceBossDanceTimer = 0;
  spaceBossLaserTimer = 0;
  spaceBossSupernovaParticles = [];
  spaceBossSupernovaFlashTimer = 0;
  spaceBossVictoryDisco = null;
  bossCutsceneMode = false;
  playSound('boss_intro');
  playSound('pipe');
  if (typeof stopMapMusic === 'function') stopMapMusic();
  if (typeof playBossMusic === 'function') setTimeout(playBossMusic, 500);
}

function enterCactusBossRoom() {
  gameState = 'cactus_boss';
  cameraX = 0;
  targetCameraX = 0;
  player.x = 150;
  player.y = GROUND_Y - 40;
  player.vx = 0;
  player.vy = 0;
  player.onGround = true;

  bossCactus = { x: 550, y: GROUND_Y - 200, w: 300, h: 200, rootTimer: 0, needleTimer: 0, scale: 1, rotation: 0 };
  cactusRoots = [];
  cactusNeedles = [];
  cactusMinions = [];
  cactusDiscoBalls = [];
  bossDiscoCollected = 0;
  bossBigDiscoSize = 0;
  cactusBossPhase = 'fight';
  cactusLightsTimer = 0;
  cactusLaserTimer = 0;
  cactusBloomTimer = 120;
  cactusBloomParticles = [];
  cactusGroundColorMix = 0;
  bossCutsceneMode = false;
  playSound('boss_intro');
  playSound('pipe');
  if (typeof stopMapMusic === 'function') stopMapMusic();
  if (typeof playBossMusic === 'function') setTimeout(playBossMusic, 500);
}
