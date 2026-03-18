transitionManager = new TransitionManager();

      function updateHUD() {
        document.getElementById('score').textContent = score;
        document.getElementById('lives').textContent = lives;
        document.getElementById('coins').textContent = coins;
        document.getElementById('level').textContent = inWaterRealm ? ('Water ' + waterStage) : (inSpaceRealm ? ('Space ' + spaceStage) : (sewerDepth > 0 ? 'Sewer ' + sewerDepth : currentLevel));
        const pw = document.getElementById('powerUpDisplay');
        const ob = document.getElementById('oxygenBar');
        if (player) {
          let txt = '';
          if (player.powerType) {
            txt = (POWER_EMOJI[player.powerType] || '') + ' ' + (player.powerType.charAt(0).toUpperCase() + player.powerType.slice(1)) + ' Lv' + player.powerLevel;
            if (typeof powerCooldown !== 'undefined' && powerCooldown > 0) txt += ' ⏳';
          } else if (player.big) txt = '🍄 Big';
          if (player.hasMagnet) txt = (txt ? txt + ' | ' : '') + (player.hasSuperMagnet ? '🧲+' : EMOJI.magnet);
          if (player.hasWings) txt = (txt ? txt + ' | ' : '') + (EMOJI.wings || '🪽');
          if (shieldBonusTimer > 0) txt = (txt ? txt + ' | ' : '') + '🛡️';
          if (timeShieldTimer > 0) txt = (txt ? txt + ' | ' : '') + '⏱️';
          if (doubleCoinsTimer > 0) txt = (txt ? txt + ' | ' : '') + '💰x2';
          if (discoBallTimer > 0) txt = (txt ? txt + ' | ' : '') + '🪩 ' + Math.ceil(discoBallTimer/60) + 's';
          if (inWaterRealm) {
            if (player.oxygen === undefined) player.oxygen = MAX_OXYGEN;
            txt = (txt ? txt + ' | ' : '') + '🫧 ' + Math.ceil(player.oxygen) + '%';
            pw.classList.toggle('oxygen-low', player.oxygen < MAX_OXYGEN * 0.25);
            if (ob) {
              ob.classList.add('visible');
              ob.classList.toggle('oxygen-low', player.oxygen < MAX_OXYGEN * 0.25);
              const fill = ob.querySelector('.oxygen-fill-inner');
              if (fill) fill.style.width = Math.max(0, Math.min(100, player.oxygen)) + '%';
            }
          } else {
            pw.classList.remove('oxygen-low');
            if (ob) ob.classList.remove('visible');
          }
          pw.textContent = txt || '';
        }
        if (score > highScore) highScore = score;
      }

      function init(keepScore) {
        chunks = {};
        sewerChunks = {};
        powerProjectiles = [];
        particles = [];
        spaceBossMinions = [];
        waterPits = [];
        sewerSpikes = [];
        fireColumns = [];
        pipes = [];
        powerUps = [];
        scorePopups = [];
        beamPillars = [];
        iceTrail = [];
        snowParticles = [];
        lightningBolts = [];
        electricArcs = [];
        shadowClone = null;
        blackHole = null;
        flowerProjectiles = [];
        if (!keepScore) {
          discoBallTimer = 0;
          enemiesDanceFromDisco = false;
          stopDiscoMusic();
          if (typeof stopMapMusic === 'function') stopMapMusic();
          if (typeof stopBossMusic === 'function') stopBossMusic();
        } else if (discoBallTimer > 0) {
          playDiscoMusic();
        }
        discoRays = [];
        discoCollectParticles = [];
        discoCollectFlash = 0;
        windParticles = [];
        lightAuraBursts = [];
        earthCracks = [];
        levelWeatherParticles = [];
        soundWaves = [];
        poisonClouds = [];
        phantomGhost = null;
        vortexWinds = [];
        vortexSpawnTimer = 0;
        voidHoles = [];
        voidSpawnTimer = 0;
        plasmaPulses = [];
        plasmaPulseTimer = 0;
        prismGems = [];
        meteors = [];
        earthShockwaves = [];
        windPushEffects = [];
        soundHitEffects = [];
        lightKillBeams = [];
        voidSuckParticles = [];
        prismLiftBeams = [];
        shieldBonusTimer = 0;
        timeShieldTimer = 0;
        doubleCoinsTimer = 0;
        enemyTimeSlow = 1;
        celestialGateways = [];
        earthReturnObjects = [];
        inSpaceRealm = false;
        spaceStage = 1;
        inWaterRealm = false;
        waterStage = 1;
        octopusTrapPit = null;
        octopusTransition = null;
        octopusPoolIdle = null;
        jellyfishBoss = null;
        jellyfishMinions = [];
        jellyfishDiscoBalls = [];
        jellyfishBossBubbles = [];
        jellyfishBossPhase = 'fight';
        waterBossPortalX = 0;
        drowningTimer = 0;
        if (typeof transitionManager !== 'undefined') {
          transitionManager.state = 'idle';
          transitionManager.t = 0;
        }
        spaceshipX = 0;
        spaceshipAnimTimer = 0;
        spaceBossPortalX = 0;
        bossMosquito = null;
        spaceBossDiscoBalls = [];
        spaceBossPhase = 'fight';
        spaceBossLightsTimer = 0;
        spaceBossDanceTimer = 0;
        spaceBossLaserTimer = 0;
        globalGameSpeed = 1;
        waterOrbitAngle = 0;
        stoneGiantTimer = 0;
        stoneGiantNoHitTimer = 0;
        stoneGiantCooldown = 0;
        lightningStrikeTimer = 0;
        windPushTimer = 0;
        lightAuraTimer = 0;
        flagX = 0;
        cactusBossPortalX = 0;
        sewerDepth = 0;
        bossDoorX = 0;
        bossCockroach = null;
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
        pausedFromState = null;
        screenShake = 0;
        levelStartTimer = 45;
        pipeEnterCooldown = 0;
        if (!keepScore) {
          score = 0;
          lives = 3;
          coins = 0;
          currentLevel = 1;
          levelPowers = {};
          gameWinLeaderboardShown = false;
        }
        cameraX = 0;
        targetCameraX = 0;
        player = new Player();
        sister = new DiscoSnailSister();
        const urlPower = getUrlParam('POWER');
        if (urlPower && POWER_TYPES.includes(urlPower.toLowerCase())) {
          player.powerType = urlPower.toLowerCase();
          player.powerLevel = 5;
        } else if (keepScore) {
          loadGameState();
        }
        const urlLevel = getUrlParam('LEVEL');
        if (urlLevel && urlLevel.length >= 2) {
          const type = urlLevel.charAt(0).toUpperCase();
          const num = parseInt(urlLevel.slice(1), 10);
          if (!isNaN(num) && num >= 1) {
            if (type === 'R') {
              inSpaceRealm = false;
              sewerDepth = 0;
              currentLevel = num;
            } else if (type === 'S') {
              enterSewer(num);
            } else if (type === 'O') {
              inSpaceRealm = true;
              spaceStage = Math.min(num, 3);
            }
          }
        }
        const urlBoss = getUrlParam('BOSS');
        if (urlBoss) {
          const b = String(urlBoss).toLowerCase();
          if (b === 'roach') {
            gameState = 'boss';
            enterBossRoom();
          } else if (b === 'mosquito') {
            gameState = 'space_boss';
            enterSpaceBossRoom();
          } else if (b === 'cactus') {
            gameState = 'cactus_boss';
            enterCactusBossRoom();
          } else if (b === 'jelly') {
            inWaterRealm = true;
            waterStage = 5;
            enterJellyfishBoss();
          }
        }
        if (!urlBoss) {
          if (inSpaceRealm) {
            generateSpaceChunk(-1);
            generateSpaceChunk(0);
            backgroundTrees = [];
          } else {
            generateChunk(-1);
            generateChunk(0);
            if (sewerDepth === 0) initTrees();
            else backgroundTrees = [];
          }
          initClouds();
        }
        if (typeof preloadSounds === 'function') preloadSounds();
      }

      function enterWaterRealm() {
        chunks = {};
        waterChunks = {};
        waterPits = [];
        waterSeaweed = [];
        waterFish = [];
        waterCoral = [];
        sludgePits = [];
        waterEnemies = [];
        cameraX = 0;
        targetCameraX = 0;
        player.x = 200;
        player.y = VIEW_HEIGHT - 150;
        player.vx = 0;
        player.vy = 0;
        player.onGround = false;
        player.oxygen = MAX_OXYGEN;
        player.drowning = false;
        player.oxygenWarnPlayed = false;
        drowningTimer = 0;
        if (typeof sister !== 'undefined' && sister) { sister.x = player.x - 80; sister.y = player.y; }
        generateWaterChunk(0);
        generateWaterChunk(1);
        playSound('water');
      }

      function enterJellyfishBoss() {
        gameState = 'jellyfish_boss';
        playSound('boss_intro');
        cameraX = 0;
        targetCameraX = 0;
        player.x = 150;
        player.y = WATER_GROUND - 80;
        player.vx = 0;
        player.vy = 0;
        player.onGround = true;
        player.oxygen = MAX_OXYGEN;
        player.powerType = null;
        player.powerLevel = 0;
        jellyfishBoss = { x: 350, y: 60, w: 120, h: 100, shootTimer: 0 };
        jellyfishMinions = [];
        jellyfishDiscoBalls = [];
        jellyfishBossBubbles = [];
        jellyfishBossBubbleTimer = 0;
        powerProjectiles = [];
        powerCooldown = 0;
        bossDiscoCollected = 0;
        bossBigDiscoSize = 0;
        jellyfishBossPhase = 'fight';
        bossCutsceneMode = false;
        playSound('pipe');
        if (typeof stopMapMusic === 'function') stopMapMusic();
        if (typeof playBossMusic === 'function') setTimeout(playBossMusic, 500);
      }

      function enterSewer(targetDepth) {
        sewerDepth = targetDepth;
        backgroundTrees = [];
        savedOverworldX = player.x;
        cameraX = 0;
        targetCameraX = 0;
        player.x = 200;
        player.y = SEWER_GROUND - 95;
        player.vx = 0;
        player.vy = 0;
        player.onGround = true;
        sister.x = player.x - 90;
        sister.y = player.y;
        pipeEnterCooldown = 30;
        sewerStartTimer = 45;
        waterPits = [];
        sewerSpikes = [];
        fireColumns = [];
        generateSewerPipes(sewerDepth);
        generateSewerChunk(sewerDepth, 0);
        generateSewerChunk(sewerDepth, 1);
      }

      function enterBossRoom() {
        gameState = 'boss';
        sewerDepth = 0;
        playSound('boss_intro');
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
        playSound('pipe');
        if (typeof stopMapMusic === 'function') stopMapMusic();
        if (typeof playBossMusic === 'function') setTimeout(playBossMusic, 500);
      }

      function enterSpaceBossRoom() {
        gameState = 'space_boss';
        playSound('boss_intro');
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
        playSound('pipe');
        if (typeof stopMapMusic === 'function') stopMapMusic();
        if (typeof playBossMusic === 'function') setTimeout(playBossMusic, 500);
      }

      function exitSewer() {
        if (sewerDepth <= 1) {
          sewerDepth = 0;
          sewerStartTimer = 0;
          initTrees();
          player.x = savedOverworldX;
          player.y = GROUND_Y - 80;
          cameraX = targetCameraX = Math.max(0, savedOverworldX - 200);
          sister.x = player.x - 90;
          sister.y = player.y;
        } else {
          const oldDepth = sewerDepth;
          sewerDepth--;
          waterPits = [];
          sewerSpikes = [];
          fireColumns = [];
          for (const k in sewerChunks) { if (k.startsWith(oldDepth + '_')) delete sewerChunks[k]; }
          player.x = 200;
          player.y = SEWER_GROUND - 95;
          player.vx = 0;
          player.vy = 0;
          player.onGround = true;
          sister.x = player.x - 90;
          sister.y = player.y;
          sewerStartTimer = 45;
          generateSewerPipes(sewerDepth);
          for (let i = 0; i <= 3; i++) generateSewerChunk(sewerDepth, i);
        }
        pipeEnterCooldown = 30;
      }

      function drawBackground() {
        const shakeX = screenShake ? (Math.random() - 0.5) * screenShake : 0;
        const shakeY = screenShake ? (Math.random() - 0.5) * screenShake : 0;
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.translate(shakeX, shakeY);

        if (inWaterRealm) {
          ctx.save();
          ctx.globalAlpha = 0.95;
          const stage = typeof waterStage !== 'undefined' ? waterStage : 1;
          const waterColors = [
            ['#0c4a6e','#075985','#0369a1','#0e7490'],
            ['#0a3d5c','#065a78','#025a8a','#0c6085'],
            ['#082e4a','#054b6b','#014a73','#0a4d6a'],
            ['#062238','#043c5a','#013a5c','#083a55'],
            ['#041626','#032d49','#012a45','#062740']
          ];
          const idx = Math.min(stage - 1, 4);
          const [c0,c1,c2,c3] = waterColors[idx];
          const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
          gradient.addColorStop(0, c0);
          gradient.addColorStop(0.4, c1);
          gradient.addColorStop(0.8, c2);
          gradient.addColorStop(1, c3);
          ctx.fillStyle = gradient;
          ctx.fillRect(-50, -50, VIEW_WIDTH + 100, VIEW_HEIGHT + 100);
          ctx.globalAlpha = 0.4;
          for (let i = 0; i < 40; i++) {
            const sx = ((i * 97 + cameraX * 0.3) % (VIEW_WIDTH + 150)) - 50;
            const sy = (i * 73 % VIEW_HEIGHT);
            ctx.font = '24px sans-serif';
            ctx.fillText(EMOJI.seaweed || '🌿', sx, sy);
          }
          const fishEmojis = [EMOJI.fish || '🐟', EMOJI.fish2 || '🐠', EMOJI.fish3 || '🐡'];
          for (let i = 0; i < 8; i++) {
            const sx = ((i * 131 + cameraX * 0.2) % (VIEW_WIDTH + 100)) - 30;
            const sy = 80 + (i * 47 % (VIEW_HEIGHT - 100));
            ctx.globalAlpha = 0.35;
            ctx.font = '18px sans-serif';
            ctx.fillText(fishEmojis[(i + stage) % fishEmojis.length], sx, sy);
          }
          ctx.restore();
        } else if (sewerDepth > 0) {
          const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
          gradient.addColorStop(0, '#1a1a2e');
          gradient.addColorStop(0.5, '#0d1b2a');
          gradient.addColorStop(1, '#1b263b');
          ctx.fillStyle = gradient;
          ctx.fillRect(-50, -50, VIEW_WIDTH + 100, VIEW_HEIGHT + 100);
        } else if (inSpaceRealm) {
          const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
          if (spaceStage === 1) {
            gradient.addColorStop(0, '#020617');
            gradient.addColorStop(0.4, '#0f172a');
            gradient.addColorStop(1, '#030712');
          } else if (spaceStage === 2) {
            gradient.addColorStop(0, '#2a0a0a');
            gradient.addColorStop(0.4, '#1a0505');
            gradient.addColorStop(1, '#000000');
          } else {
            gradient.addColorStop(0, '#022c22');
            gradient.addColorStop(0.4, '#011a14');
            gradient.addColorStop(1, '#000000');
          }
          ctx.fillStyle = gradient;
          ctx.fillRect(-50, -50, VIEW_WIDTH + 100, VIEW_HEIGHT + 100);
          ctx.fillStyle = '#ffffff';
          for (let i = 0; i < 80; i++) {
            const sx = (i * 137 % (VIEW_WIDTH + 100)) - 50;
            const sy = (i * 89 % VIEW_HEIGHT);
            ctx.globalAlpha = 1;
            ctx.fillRect(sx, sy, 2, 2);
          }
          const planetEmojis = ['🪐', '🌍', '🌎', '🌏', '🔴', '🟠', '🌑', '🌒'];
          const seed = (spaceStage || 1) * 12345;
          for (let i = 0; i < 12; i++) {
            const worldX = 200 + (i * 450 + (seed % 300)) % (LEVEL_LENGTH * CHUNK_WIDTH * TILE_SIZE);
            const px = worldX - cameraX * 0.15;
            if (px + 80 < 0 || px > VIEW_WIDTH + 80) continue;
            const py = 40 + ((i * 89 + seed * 2) % (VIEW_HEIGHT - 80));
            const size = 24 + ((i + seed) % 3) * 12;
            ctx.globalAlpha = 0.5 + 0.3 * (i % 3) / 3;
            ctx.font = size + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(planetEmojis[(i + spaceStage) % planetEmojis.length], px, py);
          }
          ctx.globalAlpha = 1;
        } else {
          const theme = getLevelTheme();
          const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
          gradient.addColorStop(0, theme.bgGradient[0]);
          gradient.addColorStop(0.5, theme.bgGradient[1]);
          gradient.addColorStop(1, theme.bgGradient[2]);
          ctx.fillStyle = gradient;
          ctx.fillRect(-50, -50, VIEW_WIDTH + 100, VIEW_HEIGHT + 100);

          const isNight = (theme.timeOfDay || 'day') === 'night';
          const sunMoonX = VIEW_WIDTH / 2;
          const sunMoonY = 75;
          ctx.save();
          if (isNight) {
            ctx.shadowColor = '#e0e7ff';
            ctx.shadowBlur = 40;
            ctx.globalAlpha = 1;
            const moonPhase = 1 + Math.sin(Date.now() * 0.001) * 0.08;
            ctx.font = (56 * moonPhase) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🌙', sunMoonX, sunMoonY);
            ctx.globalAlpha = 1;
            ctx.font = '28px sans-serif';
            for (let s = 0; s < 8; s++) {
              const a = (s / 8) * Math.PI * 2 + Date.now() * 0.0003;
              ctx.fillText('✨', sunMoonX + Math.cos(a) * 120, sunMoonY + Math.sin(a) * 50);
            }
          } else {
            ctx.shadowColor = '#fef08a';
            ctx.shadowBlur = 50;
            const sunPulse = 1 + Math.sin(Date.now() * 0.002) * 0.06;
            ctx.font = (64 * sunPulse) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('☀️', sunMoonX, sunMoonY);
          }
          ctx.restore();

          for (const t of backgroundTrees) {
            const sx = t.x - cameraX * 0.97;
            if (sx + 120 < 0 || sx > VIEW_WIDTH + 120) continue;
            const baseY = GROUND_Y + 5;
            const size = 72 * t.scale;
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.font = size + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            const treeEmoji = ['🌲', '🌳', '🌴'][t.variant] || '🌲';
            ctx.fillText(treeEmoji, sx, baseY);
            ctx.restore();
          }

          if (theme.weather !== 'rain' && theme.weather !== 'snow' && theme.weather !== 'wind') {
            ctx.fillStyle = isNight ? 'rgba(200,210,255,1)' : 'rgba(255,255,255,1)';
            for (const c of clouds) {
              const sx = (c.x - cameraX * 0.3) % (VIEW_WIDTH + 200) - 100;
              ctx.beginPath();
              ctx.arc(sx, c.y, c.size * 0.5, 0, Math.PI * 2);
              ctx.arc(sx + c.size * 0.4, c.y - 10, c.size * 0.4, 0, Math.PI * 2);
              ctx.arc(sx + c.size * 0.8, c.y, c.size * 0.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          if (theme.weather === 'cloudy') {
            ctx.fillStyle = isNight ? 'rgba(100,110,150,1)' : 'rgba(200,200,220,1)';
            for (const c of clouds) {
              const sx = (c.x - cameraX * 0.3) % (VIEW_WIDTH + 200) - 100;
              ctx.beginPath();
              ctx.arc(sx, c.y, c.size * 0.5, 0, Math.PI * 2);
              ctx.arc(sx + c.size * 0.4, c.y - 10, c.size * 0.4, 0, Math.PI * 2);
              ctx.arc(sx + c.size * 0.8, c.y, c.size * 0.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        ctx.restore();
      }

      function updateLevelWeatherParticles(theme) {
        if (!theme || sewerDepth > 0) return;
        const weather = theme.weather || 'sun';
        if (Math.floor(Date.now() / 80) % 2 === 0) {
          const maxWeather = 60;
          if (weather === 'rain' && levelWeatherParticles.length < maxWeather) {
            for (let i = 0; i < 3; i++) {
              levelWeatherParticles.push({
                x: cameraX + Math.random() * (VIEW_WIDTH + 100) - 50,
                y: -5, vy: 8 + Math.random() * 4, vx: 1, life: 80, type: 'rain'
              });
            }
          } else if (weather === 'snow' && levelWeatherParticles.length < maxWeather) {
            for (let i = 0; i < 2; i++) {
              levelWeatherParticles.push({
                x: cameraX + Math.random() * (VIEW_WIDTH + 100) - 50,
                y: -5, vy: 1.5 + Math.random(), vx: (Math.random() - 0.5) * 2, life: 150, type: 'snow'
              });
            }
          } else if (weather === 'wind' && levelWeatherParticles.length < maxWeather) {
            for (let i = 0; i < 2; i++) {
              levelWeatherParticles.push({
                x: cameraX + Math.random() * (VIEW_WIDTH + 100) - 50,
                y: 50 + Math.random() * 200, vx: -4 - Math.random() * 4, vy: (Math.random() - 0.5) * 2, life: 60, type: 'wind'
              });
            }
          }
        }
        levelWeatherParticles = levelWeatherParticles.filter(p => {
          p.x += (p.vx || 0);
          p.y += (p.vy || 0);
          p.life--;
          return p.life > 0 && p.y < VIEW_HEIGHT + 30;
        });
        if (levelWeatherParticles.length > 40) levelWeatherParticles = levelWeatherParticles.slice(-40);
      }

      function drawLevelWeatherParticles() {
        const theme = sewerDepth === 0 ? getLevelTheme() : null;
        if (theme) updateLevelWeatherParticles(theme);
        for (const p of levelWeatherParticles) {
          const sx = p.x - cameraX;
          if (sx < -20 || sx > VIEW_WIDTH + 20) continue;
          ctx.save();
          ctx.globalAlpha = Math.min(1, p.life / 40);
          if (p.type === 'rain') {
            ctx.strokeStyle = 'rgba(150,200,255,0.8)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(sx, p.y);
            ctx.lineTo(sx - 2, p.y + 12);
            ctx.stroke();
          } else if (p.type === 'snow') {
            const gr = ctx.createRadialGradient(sx, p.y, 0, sx, p.y, 6);
            gr.addColorStop(0, 'rgba(255,255,255,0.9)');
            gr.addColorStop(0.6, 'rgba(224,247,255,0.6)');
            gr.addColorStop(1, 'rgba(186,230,253,0)');
            ctx.fillStyle = gr;
            ctx.beginPath();
            ctx.arc(sx, p.y, 5, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'wind') {
            ctx.strokeStyle = 'rgba(148,163,184,0.7)';
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 2; i++) {
              ctx.beginPath();
              ctx.arc(sx + i * 3, p.y, 4 + i * 2, 0, Math.PI);
              ctx.stroke();
            }
          }
          ctx.restore();
        }
      }

      document.addEventListener('keydown', function(e) {
        const lbEl = document.getElementById('leaderboardOverlay');
        const lbVisible = lbEl && lbEl.style.display === 'flex';
        const nameInput = document.getElementById('leaderboardName');
        const focusInInput = nameInput && document.activeElement === nameInput;
        if (lbVisible) {
          if ((e.key === 'r' || e.key === 'R' || e.code === 'KeyR') && !focusInInput) {
            if (typeof hideLeaderboard === 'function') hideLeaderboard();
            gameState = 'playing';
            init();
            initClouds();
            if (getUrlParam('BOSS') === 'GO') enterBossRoom();
            else if (typeof playMapMusic === 'function') playMapMusic();
            if (typeof stopBossMusic === 'function') stopBossMusic();
            updateHUD();
            e.preventDefault();
          }
          return;
        }
        keys[e.key] = true;
        if (e.code) keys[e.code] = true;
        if ((e.key === ' ' || e.key === 'Enter') && gameState === 'start') {
          playSound('start');
          gameState = 'playing';
          init(true);
          initClouds();
          if (lives <= 0) { gameState = 'gameover'; if (typeof showLeaderboard === 'function') showLeaderboard(score, false); }
          else {
            if (getUrlParam('BOSS') === 'GO') enterBossRoom();
            else if (typeof playMapMusic === 'function') playMapMusic();
          }
          updateHUD();
          e.preventDefault();
          return;
        }
        if (e.key === 'p' || e.key === 'P' || e.code === 'KeyP') {
          if (gameState === 'playing' || gameState === 'boss' || gameState === 'space_boss' || gameState === 'cactus_boss' || gameState === 'jellyfish_boss' || gameState === 'story') {
            if (gameState === 'paused') { gameState = pausedFromState || 'playing'; pausedFromState = null; }
            else { pausedFromState = gameState; gameState = 'paused'; playSound('pause'); }
          } else if (gameState === 'paused') { gameState = pausedFromState || 'playing'; pausedFromState = null; }
          e.preventDefault();
          return;
        }
        if (e.key === 'r' || e.key === 'R' || e.code === 'KeyR') {
          if (gameState === 'gameover' || gameState === 'playing' || gameState === 'paused' || gameState === 'boss' || gameState === 'space_boss' || gameState === 'cactus_boss' || gameState === 'jellyfish_boss' || gameState === 'bossVictory' || gameState === 'gameWin') {
            if (typeof hideLeaderboard === 'function') hideLeaderboard();
            gameState = 'playing';
            init();
            initClouds();
            if (getUrlParam('BOSS') === 'GO') enterBossRoom();
            else if (typeof playMapMusic === 'function') playMapMusic();
            if (typeof stopBossMusic === 'function') stopBossMusic();
            updateHUD();
            e.preventDefault();
            return;
          }
        }
        if (e.key === ' ' && gameState === 'levelcomplete') {
          gameState = 'playing';
          currentLevel++;
          saveGameState();
          clearMemoryForTransition();
          levelStartTimer = 45;
          init(true);
          if (typeof playMapMusic === 'function') playMapMusic();
          updateHUD();
        }
        e.preventDefault();
      });

      document.addEventListener('keyup', function(e) {
        keys[e.key] = false;
        if (e.code) keys[e.code] = false;
      });

      function setupTouchControls() {
        const btns = document.querySelectorAll('#touchControls .touch-btn');
        const dispatchKey = (key, code, down) => {
          keys[key] = down;
          if (code) keys[code] = down;
          if (down && (key === 'p' || key === 'P' || key === 'r' || key === 'R' || key === ' ' || key === 'Enter')) {
            document.dispatchEvent(new KeyboardEvent('keydown', { key, code, bubbles: true }));
          }
        };
        const onDown = (e) => {
          e.preventDefault();
          const btn = e.target.closest('.touch-btn');
          if (!btn) return;
          const key = btn.dataset.key;
          const code = btn.dataset.code || '';
          dispatchKey(key, code, true);
        };
        const onUp = (e) => {
          e.preventDefault();
          const btn = e.target.closest('.touch-btn');
          if (!btn) return;
          const key = btn.dataset.key;
          const code = btn.dataset.code || '';
          dispatchKey(key, code, false);
        };
        btns.forEach(btn => {
          btn.addEventListener('touchstart', onDown, { passive: false });
          btn.addEventListener('touchend', onUp, { passive: false });
          btn.addEventListener('touchcancel', onUp, { passive: false });
          btn.addEventListener('mousedown', onDown);
          btn.addEventListener('mouseup', onUp);
          btn.addEventListener('mouseleave', onUp);
        });
      }
      setupTouchControls();

      init();
      initClouds();
      initTrees();
      updateHUD();
      const targetFps = 60;
      let lastTime = performance.now();
      (function loop(now) {
        requestAnimationFrame(loop);
        const elapsed = now - lastTime;
        if (elapsed >= 1000 / targetFps) {
          lastTime = now - (elapsed % (1000 / targetFps));
          gameLoop();
        }
      })(performance.now());
      if (canvas) {
        canvas.addEventListener('click', () => canvas.focus());
        canvas.focus();
      }

      function gameLoop() {
        if (!ctx) return;
        ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.filter = 'none';
        if (screenShake > 0) { screenShake = Math.min(20, screenShake); screenShake--; }

        particles = particles.filter(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2;
          p.life--;
          if (p.life > 0) {
            ctx.save();
            ctx.globalAlpha = Math.min(1, p.life / 30);
            const sx = p.x - cameraX;
            if (p.emoji) {
              ctx.font = '24px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(p.emoji, sx, p.y);
            } else {
              ctx.fillStyle = p.color || '#fff';
              ctx.fillRect(sx - 2, p.y - 2, 4, 4);
            }
            ctx.restore();
            return true;
          }
          return false;
        });

        /* Aggressive array cleanup - cap at 50 to prevent FPS drops */
        if (snowParticles.length > 35) snowParticles = snowParticles.slice(-35);
        if (windParticles.length > 35) windParticles = windParticles.slice(-35);
        if (voidSuckParticles.length > 40) voidSuckParticles = voidSuckParticles.slice(-40);
        if (particles.length > 70) particles = particles.slice(-70);

        scorePopups = scorePopups.filter(sp => {
          sp.life--;
          if (sp.life > 0) {
            const sx = sp.x - cameraX;
            if (sx > -50 && sx < VIEW_WIDTH + 50) {
              ctx.save();
              const alpha = Math.min(1, sp.life / 45);
              const initLife = sp.initLife || 75;
              const age = initLife - sp.life;
              const scale = Math.min(1.25, 0.85 + (age / 12) * 0.4);
              ctx.globalAlpha = alpha;
              ctx.translate(sx, sp.y - sp.life * 0.5);
              ctx.scale(scale, scale);
              ctx.font = 'bold 20px Nunito';
              ctx.fillStyle = sp.color || '#fff';
              ctx.textAlign = 'center';
              ctx.fillText(sp.text, 0, 0);
              ctx.restore();
            }
            return true;
          }
          return false;
        });

        if (transitionManager && transitionManager.state === 'transition') {
          transitionManager.update();
          transitionManager.draw(ctx);
          updateHUD();
          return;
        }

        if (gameState === 'story' && storyScreen) {
          ctx.save();
          ctx.fillStyle = 'rgba(0,0,0,0.92)';
          ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
          const line = storyScreen.lines[storyScreen.lineIndex] || '';
          storyScreen.timer++;
          if (keys[' '] || keys['Enter']) {
            storyScreen.charIndex = line.length;
            storyScreen.timer = 999;
          }
          if (storyScreen.timer % 3 === 0 && storyScreen.charIndex < line.length) {
            storyScreen.charIndex++;
          }
          const visible = line.substring(0, storyScreen.charIndex);
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 24px Nunito';
          ctx.textAlign = 'center';
          const yBase = VIEW_HEIGHT / 2 - 60 + storyScreen.lineIndex * 40;
          ctx.fillText(visible, VIEW_WIDTH / 2, yBase);
          if (storyScreen.charIndex >= line.length) {
            if (storyScreen.lineIndex < storyScreen.lines.length - 1) {
              storyScreen.lineIndex++;
              storyScreen.charIndex = 0;
              storyScreen.timer = 0;
            } else if (storyScreen.timer > 30) {
              if (keys[' '] || keys['Enter'] || storyScreen.timer > 120) {
                const fn = storyScreen.onComplete;
                storyScreen = null;
                if (typeof fn === 'function') fn();
              }
            }
          }
          ctx.font = '18px Nunito';
          ctx.fillStyle = '#ffd700';
          ctx.fillText('Press SPACE to continue', VIEW_WIDTH / 2, VIEW_HEIGHT - 50);
          ctx.restore();
          updateHUD();
          return;
        }

        if (gameState === 'start') {
          ctx.globalAlpha = 1;
          const g = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
          const h = (Date.now() * 0.03) % 360;
          g.addColorStop(0, 'hsl(' + h + ',45%,18%)');
          g.addColorStop(0.4, 'hsl(' + ((h + 40) % 360) + ',50%,12%)');
          g.addColorStop(0.7, 'hsl(' + ((h + 80) % 360) + ',55%,8%)');
          g.addColorStop(1, '#050508');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
          for (let i = 0; i < 24; i++) {
            const x = (i * 137 + Date.now() * 0.02) % (VIEW_WIDTH + 80) - 40;
            const y = (i * 89 + Date.now() * 0.015) % (VIEW_HEIGHT + 60) - 30;
            ctx.globalAlpha = 0.12 + Math.sin(Date.now() * 0.002 + i) * 0.06;
            ctx.font = (20 + (i % 4) * 8) + 'px sans-serif';
            ctx.fillText(['🪩','🐌','⭐','💎'][i % 4], x, y);
          }
          ctx.globalAlpha = 1;
          const pulse = 1 + Math.sin(Date.now() * 0.006) * 0.08;
          ctx.save();
          ctx.font = 'bold ' + (56 * pulse) + 'px Fredoka One';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'hsl(' + ((h + 180) % 360) + ',80%,60%)';
          ctx.shadowBlur = 30;
          ctx.fillStyle = '#fff';
          ctx.fillText('Disco Snail', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 - 55);
          ctx.restore();
          ctx.save();
          ctx.font = 'bold 32px Nunito';
          ctx.fillStyle = 'rgba(255,255,255,0.95)';
          ctx.shadowColor = '#ff6b9d';
          ctx.shadowBlur = 15;
          ctx.fillText('Adventure', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 - 15);
          ctx.restore();
          ctx.font = '28px sans-serif';
          ctx.fillText('🐌 🪩', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 25);
          ctx.font = '18px Nunito';
          ctx.fillStyle = '#ffd700';
          ctx.shadowBlur = 0;
          const blink = Math.floor(Date.now() / 500) % 2;
          ctx.globalAlpha = blink ? 1 : 0.7;
          ctx.fillText('Press SPACE or ENTER to Start', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 75);
          ctx.globalAlpha = 1;
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.font = '20px Nunito';
          ctx.fillText('High Score: ' + highScore, VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 110);
          ctx.font = '14px Nunito';
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.fillText('← → Move  |  Space Jump  |  X Fire  |  P Pause', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 145);
          const snailX = VIEW_WIDTH/2 + Math.sin(Date.now() * 0.002) * 60;
          const snailY = VIEW_HEIGHT - 100 + Math.sin(Date.now() * 0.003) * 8;
          ctx.save();
          ctx.font = '48px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = '#ff6b9d';
          ctx.shadowBlur = 20;
          ctx.fillText('🐌', snailX, snailY);
          ctx.restore();
          return;
        }

        if (gameState === 'paused') {
          ctx.globalAlpha = 1;
          ctx.filter = 'blur(2px)';
          drawBackground();
          ctx.filter = 'none';
          ctx.fillStyle = 'rgba(0,0,0,0.52)';
          ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
          ctx.save();
          ctx.shadowColor = '#94a3b8';
          ctx.shadowBlur = 18;
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 48px Fredoka One';
          ctx.textAlign = 'center';
          ctx.fillText('PAUSED', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 - 20);
          ctx.restore();
          ctx.font = '20px Nunito';
          const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
          ctx.fillText(isTouch ? 'Tap P to Resume' : 'Press P to Resume', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 30);
          return;
        }

        if (gameState === 'gameover') {
          ctx.globalAlpha = 1;
          drawBackground();
          if (score >= highScore && score > 0 && Math.floor(Date.now() / 100) % 4 < 2) {
            addParticles(VIEW_WIDTH/2, VIEW_HEIGHT/2 + 40, 2, '#ffd700');
          }
          ctx.fillStyle = 'rgba(0,0,0,0.72)';
          ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
          ctx.save();
          ctx.shadowColor = '#ff6b6b';
          ctx.shadowBlur = 25;
          ctx.fillStyle = '#ff6b6b';
          ctx.font = 'bold 52px Fredoka One';
          ctx.textAlign = 'center';
          ctx.fillText('GAME OVER', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 - 40);
          ctx.restore();
          ctx.fillStyle = '#fff';
          ctx.font = '24px Nunito';
          ctx.fillText('Score: ' + score, VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 10);
          if (score >= highScore && score > 0) {
            const pulse = 1 + Math.sin(Date.now() * 0.008) * 0.12;
            ctx.save();
            ctx.translate(VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 50);
            ctx.scale(pulse, pulse);
            ctx.fillStyle = '#ffd700';
            ctx.font = '24px Nunito';
            ctx.textAlign = 'center';
            ctx.fillText('★ NEW HIGH SCORE! ★', 0, 0);
            ctx.restore();
          }
          ctx.fillStyle = '#ffd700';
          ctx.font = '20px Nunito';
          const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
          ctx.fillText(isTouch ? 'Tap R to Restart' : 'Press R to Restart', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 90);
          return;
        }

        if (gameState === 'levelcomplete') {
          ctx.globalAlpha = 1;
          ctx.filter = 'blur(1px)';
          drawBackground();
          ctx.filter = 'none';
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
          ctx.save();
          ctx.shadowColor = '#4ade80';
          ctx.shadowBlur = 20;
          ctx.fillStyle = '#4ade80';
          ctx.font = 'bold 44px Fredoka One';
          ctx.textAlign = 'center';
          ctx.fillText('LEVEL ' + currentLevel + ' COMPLETE!', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 - 50);
          ctx.restore();
          ctx.fillStyle = '#fff';
          ctx.font = '22px Nunito';
          ctx.fillText('Score: ' + score + '  •  Coins: ' + coins, VIEW_WIDTH / 2, VIEW_HEIGHT / 2);
          ctx.fillStyle = '#ffd700';
          ctx.font = '20px Nunito';
          const isTouchLc = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
          ctx.fillText(isTouchLc ? 'Tap SPACE for Next Level' : 'Press SPACE for Next Level', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 50);
          return;
        }

        if (gameState === 'boss') {
          const BOSS_GROUND = 400;
          const bossBlockW = 40;
          const bossBreakProgress = Math.min(1, (bossFloorBreak || 0) / 3600);
          bossCutsceneMode = (bossPhase !== 'fight');
          bossCutsceneTargetX = 200;
          let bossPlatforms = [];
          if (bossPhase === 'fight' || bossPhase === 'lights') {
            bossPlatforms = [{ x: 0, y: BOSS_GROUND, width: VIEW_WIDTH, height: VIEW_HEIGHT - BOSS_GROUND }];
          } else {
            const bossBlockCount = Math.ceil(VIEW_WIDTH / bossBlockW);
            for (let i = 0; i < bossBlockCount; i++) {
              const bx = i * bossBlockW;
              if (bx <= 400) {
                bossPlatforms.push({ x: bx, y: BOSS_GROUND, width: bossBlockW - 2, height: VIEW_HEIGHT - BOSS_GROUND });
              } else {
                const blockIdx = (bx - VIEW_WIDTH/2 + 200) / bossBlockW;
                const centerDist = Math.abs(blockIdx);
                const breakAt = 0.15 + centerDist * 0.04;
                const health = Math.max(0, 1 - (bossBreakProgress - breakAt) * 3);
                if (health > 0) {
                  bossPlatforms.push({ x: bx, y: BOSS_GROUND, width: bossBlockW - 2, height: VIEW_HEIGHT - BOSS_GROUND });
                }
              }
            }
          }
          player.update();
          player.x = Math.max(0, Math.min(VIEW_WIDTH - player.width, player.x));
          let landed = false;
          for (const p of bossPlatforms) {
            const overlapX = player.x + player.width > p.x + 4 && player.x < p.x + p.width - 4;
            if (player.vy > 0 && overlapX) {
              const prevBottom = player.y + player.height - player.vy;
              const currBottom = player.y + player.height;
              if (prevBottom <= p.y + 12 && currBottom >= p.y - 6) {
                if (!player.onGround && player.vy > 2) addLandingDust(player.x + player.width/2, player.y + player.height);
                player.y = p.y - player.height;
                player.vy = 0;
                player.onGround = true;
                landed = true;
                break;
              }
            }
          }
          if (bossCockroach && bossPhase === 'fight') {
            bossCockroach.shootTimer = (bossCockroach.shootTimer || 0) + 1;
            bossCockroach.jumpTimer = (bossCockroach.jumpTimer || 0) + 1;
            if (bossCockroach.jumpTimer >= 60 && Math.random() < 0.03) {
              bossCockroach.jumpTimer = 0;
              bossCockroach.jumpY = 28;
            }
            if (bossCockroach.jumpY > 0) {
              bossCockroach.jumpY -= 1.8;
              if (bossCockroach.jumpY < 0) bossCockroach.jumpY = 0;
            }
            bossCockroach.y = bossCockroach.baseY - bossCockroach.jumpY;
            if (bossCockroach.shootTimer >= 70) {
              bossCockroach.shootTimer = 0;
              const isFly = Math.random() < 0.4;
              const px = player.x + player.width / 2;
              const py = player.y + player.height / 2;
              const bx = bossCockroach.x + bossCockroach.w / 2;
              const by = bossCockroach.y + (isFly ? 20 : bossCockroach.h - 24);
              const dx = px - bx;
              const dy = py - by;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const spread = 0.4 + Math.random() * 0.4;
              const vx = (dx / dist) * (4 + Math.random() * 3) + (Math.random() - 0.5) * spread * 6;
              const vy = isFly ? (dy / dist) * 4 - 2 - Math.random() * 2 : (dy / dist) * 2 + (Math.random() - 0.3) * 4;
              bossMinions.push({
                x: bx - 16, y: by, w: 32, h: 24, vx, vy,
                fly: isFly, alive: true, deathTimer: 0, landed: false, jumpCooldown: 0
              });
            }
          }
          for (const m of bossMinions) {
            if (!m.alive) continue;
            if (m.fly) {
              if (m.landed) {
                const px = player.x + player.width / 2;
                const mx = m.x + m.w / 2;
                const dir = px > mx ? 1 : -1;
                m.vx = dir * (1.8 + Math.random() * 0.6);
                m.jumpCooldown = (m.jumpCooldown || 0) - 1;
                if (m.jumpCooldown <= 0 && Math.random() < 0.015) {
                  m.vy = -5 - Math.random() * 2;
                  m.jumpCooldown = 50 + Math.random() * 30;
                }
              }
              m.x += m.vx;
              m.y += m.vy;
              m.vy += m.landed ? 0.4 : 0.08;
              if (m.y + m.h > BOSS_GROUND) {
                m.y = BOSS_GROUND - m.h;
                m.vy = 0;
                if (!m.landed) m.landed = true;
              }
              if (m.x < 0 || m.x > VIEW_WIDTH) m.vx *= -1;
            } else {
              if (m.landed) {
                const px = player.x + player.width / 2;
                const mx = m.x + m.w / 2;
                const dir = px > mx ? 1 : -1;
                m.vx = dir * (2.2 + Math.random() * 0.8);
                m.jumpCooldown = (m.jumpCooldown || 0) - 1;
                if (m.jumpCooldown <= 0 && Math.random() < 0.02) {
                  m.vy = -6 - Math.random() * 2;
                  m.jumpCooldown = 40 + Math.random() * 40;
                }
              }
              m.x += m.vx;
              m.y += m.vy;
              m.vy += 0.4;
              if (m.y + m.h > BOSS_GROUND) {
                m.y = BOSS_GROUND - m.h;
                m.vy = 0;
                if (!m.landed) m.landed = true;
              }
              if (m.x < 0 || m.x > VIEW_WIDTH) m.vx *= -1;
            }
            const prevBottom = player.y + player.height - player.vy;
            const currBottom = player.y + player.height;
            const overlapX = player.x + player.width > m.x + 4 && player.x < m.x + m.w - 4;
            if (overlapX && prevBottom <= m.y + 12 && currBottom >= m.y - 4 && player.vy > 0) {
              m.alive = false;
              m.deathTimer = 15;
              playSound('stomp');
              score += 50;
              for (let i = 0; i < 3; i++) {
                bossDiscoBalls.push({
                  x: m.x + m.w / 2 - 8 + (Math.random() - 0.5) * 20,
                  y: m.y, w: 16, h: 16, collected: false
                });
              }
            } else if (overlapX && player.vy <= 0 && currBottom > m.y + 4 && checkPlayerDamageCollision(player, m)) {
              if (invincibleTimer <= 0 && stoneGiantTimer <= 0) {
                if (player.big) { player.big = false; player.height = 40; invincibleTimer = 120; playSound('brick'); addParticles(player.x + player.width/2, player.y + player.height/2, 6, '#ff6b9d'); }
                else player.die();
              }
            }
          }
          if ((bossPhase === 'dance' || bossPhase === 'falling' || bossPhase === 'burning' || bossPhase === 'discoSpawn') &&
              player.y + player.height > BOSS_GROUND + 60 && invincibleTimer <= 0 && !bossCutsceneMode) {
            playSound('fire');
            player.die();
          }
          if (bossCockroach && (bossPhase === 'fight' || bossPhase === 'lights' || bossPhase === 'dance')) {
            const bossRect = { x: bossCockroach.x, y: bossCockroach.y, width: bossCockroach.w, height: bossCockroach.h };
            const overlapBoss = player.x + player.width > bossRect.x + 20 && player.x < bossRect.x + bossRect.width - 20 &&
              player.y + player.height > bossRect.y + 10 && player.y < bossRect.y + bossRect.height - 10;
            if (overlapBoss) {
              const dx = (player.x + player.width/2) - (bossCockroach.x + bossCockroach.w/2);
              if (dx !== 0) player.x += Math.sign(dx) * 5;
            }
          }
          for (const db of bossDiscoBalls) {
            if (db.collected) continue;
            if (player.x + player.width > db.x && player.x < db.x + db.w &&
                player.y + player.height > db.y && player.y < db.y + db.h) {
              db.collected = true;
              bossDiscoCollected++;
              bossBigDiscoSize = Math.min(50, bossBigDiscoSize + 1);
              playSound('coin');
              addParticles(db.x + db.w / 2, db.y + db.h / 2, 6, '#ffd700');
            }
          }
          bossDiscoBalls = bossDiscoBalls.filter(db => !db.collected);
          if (bossDiscoCollected >= 50 && bossPhase === 'fight') {
            bossPhase = 'lights';
            bossLightsTimer = 180;
            bossMinions = [];
            bossCutsceneMode = true;
          }
          if (bossPhase === 'lights') {
            bossLightsTimer--;
            if (bossLightsTimer <= 0) {
              bossPhase = 'dance';
              bossDanceTimer = 60 * 60;
              playDiscoMusic();
            }
          }
          if (bossPhase === 'dance' && bossCockroach) {
            bossDanceTimer--;
            bossFloorBreak = (bossFloorBreak || 0) + 15;
            if (bossDanceTimer <= 0 || bossFloorBreak >= 3600) {
              bossPhase = 'falling';
            }
          }
          if (bossPhase === 'falling' && bossCockroach) {
            bossCockroach.y += 8;
            bossCockroach.rotation = (bossCockroach.rotation || 0) + 0.2;
            const fallDepth = bossCockroach.y - BOSS_GROUND;
            bossCockroach.scale = Math.max(0.4, 1 - fallDepth / 400);
            if (bossCockroach.y > BOSS_GROUND + 60) {
              bossFallX = bossCockroach.x + bossCockroach.w / 2;
              bossPhase = 'burning';
              bossBurnTimer = 90;
              for (let i = 0; i < 120 && bossSplashParticles.length < 120; i++) {
                const a = (i / 120) * Math.PI * 2 + Math.random() * 0.5;
                const spd = 4 + Math.random() * 12;
                bossSplashParticles.push({
                  x: bossFallX, y: BOSS_GROUND + 70,
                  vx: Math.cos(a) * spd, vy: -Math.abs(Math.sin(a)) * spd - 4,
                  life: 40 + Math.random() * 40, color: Math.random() < 0.5 ? '#ff4500' : '#ff6600'
                });
              }
              screenShake = 30;
              playSound('fire');
            }
          }
          if (bossPhase === 'burning') {
            bossBurnTimer--;
            for (const p of bossSplashParticles) {
              p.x += p.vx;
              p.y += p.vy;
              p.vy += 0.3;
              p.life--;
            }
            bossSplashParticles = bossSplashParticles.filter(p => p.life > 0);
            if (bossBurnTimer <= 0) {
              bossPhase = 'discoSpawn';
              bossVictoryDisco = { x: bossFallX - 24, y: -60, w: 48, h: 48, collected: false };
              bossCockroach = null;
            }
          }
          if (bossPhase === 'discoSpawn' && bossVictoryDisco && !bossVictoryDisco.collected) {
            const targetX = player.x + player.width / 2 - bossVictoryDisco.w / 2;
            const targetY = player.y - bossVictoryDisco.h;
            bossVictoryDisco.x += (targetX - bossVictoryDisco.x) * 0.05;
            bossVictoryDisco.y += (targetY - bossVictoryDisco.y) * 0.05;
            const dx = (bossVictoryDisco.x + bossVictoryDisco.w / 2) - (player.x + player.width / 2);
            const dy = (bossVictoryDisco.y + bossVictoryDisco.h / 2) - (player.y + player.height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 30) {
              bossVictoryDisco.collected = true;
              if (typeof playVictoryMusic === 'function') playVictoryMusic();
              showStoryScreen(['The underground empire is blinded by the lights!', 'The surface awaits...'], () => { playSound('levelComplete'); gameState = 'gameWin'; });
            }
          }
          cameraX = 0;
          targetCameraX = 0;

          ctx.globalAlpha = 1;
          ctx.fillStyle = '#0a0a12';
          ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
          const grad = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
          grad.addColorStop(0, '#1a1a2e');
          grad.addColorStop(1, '#0d0d15');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
          const floorBreakProgress = Math.min(1, (bossFloorBreak || 0) / 3600);
          const floorBlockW = 40;
          const floorBlockCount = Math.ceil(VIEW_WIDTH / floorBlockW);
          const lavaY = BOSS_GROUND + 30;
          ctx.fillStyle = floorBreakProgress > 0 ? '#6b0000' : '#2d2d2d';
          ctx.fillRect(0, lavaY, VIEW_WIDTH, VIEW_HEIGHT - lavaY);
          if (floorBreakProgress > 0) {
            ctx.save();
            const grad = ctx.createLinearGradient(0, lavaY, 0, lavaY + 120);
            grad.addColorStop(0, 'rgba(255,100,30,0.95)');
            grad.addColorStop(0.3, 'rgba(255,60,10,0.9)');
            grad.addColorStop(0.7, 'rgba(200,40,0,0.85)');
            grad.addColorStop(1, 'rgba(120,20,0,0.8)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, lavaY, VIEW_WIDTH, 120);
            for (let i = 0; i < 40; i++) {
              const bx = (i * 53 + Date.now() * 0.02) % (VIEW_WIDTH + 40) - 20;
              const by = lavaY + (Math.sin(Date.now() * 0.005 + i * 0.7) * 0.5 + 0.5) * 40 + (i * 17) % 50;
              const bubble = 0.6 + Math.sin(Date.now() * 0.008 + i) * 0.2;
              ctx.fillStyle = 'rgba(255,180,80,' + (0.4 + bubble * 0.3) + ')';
              ctx.beginPath();
              ctx.ellipse(bx, by, 12 * bubble, 8 * bubble, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          }
          for (let i = 0; i < floorBlockCount; i++) {
            const bx = i * floorBlockW;
            let blockHealth = 1;
            if (bx > 400) {
              const blockIdx = (bx - VIEW_WIDTH/2 + 200) / floorBlockW;
              const centerDist = Math.abs(blockIdx);
              const breakAt = 0.15 + centerDist * 0.04;
              blockHealth = Math.max(0, 1 - (floorBreakProgress - breakAt) * 3);
            }
            if (blockHealth <= 0 && (bossPhase === 'dance' || bossPhase === 'falling' || bossPhase === 'burning' || bossPhase === 'discoSpawn')) continue;
            const alpha = Math.min(1, blockHealth * 1.5);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = blockHealth > 0.5 ? '#8B4513' : '#6b3410';
            ctx.fillRect(bx, BOSS_GROUND, floorBlockW - 2, 88);
            ctx.fillStyle = blockHealth > 0.5 ? '#A0522D' : '#7a4a1a';
            ctx.fillRect(bx + 2, BOSS_GROUND + 2, floorBlockW - 6, 28);
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.brick, bx + floorBlockW/2 - 1, BOSS_GROUND + 44);
            ctx.globalAlpha = 1;
          }
          const bigDiscoX = 400, bigDiscoY = 150;
          if (bossBigDiscoSize > 0) {
            const r = 20 + (bossBigDiscoSize / 50) * 80;
            ctx.save();
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 25;
            const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.1;
            ctx.beginPath();
            ctx.arc(bigDiscoX, bigDiscoY, r * pulse, 0, Math.PI * 2);
            ctx.fillStyle = bossDiscoCollected >= 50 ? 'rgba(255,215,0,0.9)' : 'rgba(255,215,0,0.5)';
            ctx.fill();
            ctx.font = (r * 1.2) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.disco, bigDiscoX, bigDiscoY);
            const rayCount = bossPhase === 'lights' ? 24 : 8;
            if (bossDiscoCollected >= 50) {
              for (let i = 0; i < rayCount; i++) {
                const a = (Date.now() * 0.003 + i * (Math.PI * 2 / rayCount)) % (Math.PI * 2);
                const colors = ['#ff6b6b','#4ecdc4','#ffe66d','#95e1d3','#f38181','#aa96da','#ff9f43','#54a0ff'];
                ctx.strokeStyle = colors[i % colors.length];
                ctx.lineWidth = bossPhase === 'lights' ? 6 : 4;
                const rayLen = bossPhase === 'lights' ? 220 : 150;
                ctx.beginPath();
                ctx.moveTo(bigDiscoX, bigDiscoY);
                ctx.lineTo(bigDiscoX + Math.cos(a) * rayLen, bigDiscoY + Math.sin(a) * rayLen * 0.7);
                ctx.stroke();
              }
            }
            ctx.restore();
          }
          for (const db of bossDiscoBalls) {
            if (db.collected) continue;
            ctx.save();
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.disco, db.x + db.w / 2, db.y + db.h / 2);
            ctx.restore();
          }
          if (bossCockroach && (bossPhase === 'falling' || bossPhase === 'dance' || bossPhase === 'fight' || bossPhase === 'lights')) {
            const bx = bossCockroach.x;
            const by = bossCockroach.y;
            const bounce = bossPhase === 'dance' ? Math.sin(Date.now() * 0.015) * 8 : 0;
            const rot = bossPhase === 'falling' ? (bossCockroach.rotation || 0) : 0;
            const scale = bossPhase === 'falling' ? (bossCockroach.scale || 1) : 1;
            ctx.save();
            ctx.translate(bx + bossCockroach.w / 2, by + bossCockroach.h / 2 + bounce);
            ctx.rotate(rot);
            ctx.scale(scale, scale);
            ctx.translate(-(bx + bossCockroach.w / 2), -(by + bossCockroach.h / 2 + bounce));
            ctx.font = '96px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.roach, bx + bossCockroach.w / 2, by + bossCockroach.h / 2 + bounce);
            ctx.restore();
          }
          for (const p of bossSplashParticles) {
            if (p.life > 0) {
              ctx.save();
              ctx.globalAlpha = p.life / 80;
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }
          if (bossPhase === 'burning') {
            ctx.save();
            ctx.globalAlpha = 0.5 + (bossBurnTimer / 90) * 0.5;
            const by = BOSS_GROUND + 75;
            const gr = ctx.createRadialGradient(bossFallX, by - 25, 0, bossFallX, by, 50);
            gr.addColorStop(0, 'rgba(255,220,150,0.9)');
            gr.addColorStop(0.4, 'rgba(249,115,22,0.7)');
            gr.addColorStop(0.8, 'rgba(234,88,12,0.3)');
            gr.addColorStop(1, 'rgba(234,88,12,0)');
            ctx.fillStyle = gr;
            ctx.beginPath();
            ctx.ellipse(bossFallX, by, 28, 45, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          if (bossPhase === 'discoSpawn' && bossVictoryDisco && !bossVictoryDisco.collected) {
            ctx.save();
            const pulse = 1 + Math.sin(Date.now() * 0.008) * 0.15;
            ctx.font = (48 * pulse) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 20;
            ctx.fillText(EMOJI.disco, bossVictoryDisco.x + bossVictoryDisco.w/2, bossVictoryDisco.y + bossVictoryDisco.h/2);
            ctx.restore();
            ctx.fillStyle = '#ffd700';
            ctx.font = '18px Nunito';
            ctx.textAlign = 'center';
            ctx.fillText('Victory disco incoming!', VIEW_WIDTH/2, 60);
          }
          if (bossPhase === 'walk' && princessSnail) {
            princessSnail.dancePhase = (princessSnail.dancePhase || 0) + 0.03;
            const bounce = Math.sin(princessSnail.dancePhase) * 4;
            ctx.save();
            ctx.font = '48px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.sister, princessSnail.x, princessSnail.y + bounce);
            ctx.restore();
            ctx.fillStyle = '#ffd700';
            ctx.font = '18px Nunito';
            ctx.textAlign = 'center';
            ctx.fillText('→ Walk to the princess!', VIEW_WIDTH / 2, 60);
          }
          for (const m of bossMinions) {
            if (!m.alive) continue;
            ctx.font = (m.fly ? '24px' : '28px') + ' sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.roach, m.x + m.w / 2, m.y + m.h / 2);
          }
          player.draw();
          updateHUD();
          return;
        }

        if (gameState === 'space_boss') {
          const SPACE_BOSS_GROUND = 400;
          const spaceBossSidePlatforms = [
            { x: 30, y: 300, width: 100, height: 24, oneWay: true },
            { x: VIEW_WIDTH - 130, y: 300, width: 100, height: 24, oneWay: true }
          ];
          const bossPlatforms = [
            { x: 0, y: SPACE_BOSS_GROUND, width: VIEW_WIDTH, height: VIEW_HEIGHT - SPACE_BOSS_GROUND },
            ...spaceBossSidePlatforms
          ];
          bossCutsceneMode = (spaceBossPhase !== 'fight');
          bossCutsceneTargetX = 200;
          player.update();
          player.x = Math.max(0, Math.min(VIEW_WIDTH - player.width, player.x));
          let landed = false;
          const sortedPlatforms = [...bossPlatforms].sort((a, b) => a.y - b.y);
          for (const p of sortedPlatforms) {
            const overlapX = player.x + player.width > p.x + 4 && player.x < p.x + p.width - 4;
            if (player.vy > 0 && overlapX) {
              const prevBottom = player.y + player.height - player.vy;
              const currBottom = player.y + player.height;
              if (prevBottom <= p.y + 12 && currBottom >= p.y - 6) {
                if (!player.onGround && player.vy > 2) addLandingDust(player.x + player.width/2, player.y + player.height);
                player.y = p.y - player.height;
                player.vy = 0;
                player.onGround = true;
                landed = true;
                break;
              }
            }
          }
          if (bossMosquito && spaceBossPhase === 'fight') {
            bossMosquito.attackTimer = (bossMosquito.attackTimer || 0) + 1;
            if (bossMosquito.state === 'hover') {
              bossMosquito.minionSpawnTimer = (bossMosquito.minionSpawnTimer || 0) + 1;
              const discoX = 400, discoY = 150;
              if (bossBigDiscoSize > 15) {
                bossMosquito.orbitAngle = (bossMosquito.orbitAngle || 0) + 0.015;
                const orbitRadius = 120 + bossBigDiscoSize;
                bossMosquito.x = discoX + Math.cos(bossMosquito.orbitAngle) * orbitRadius - bossMosquito.w / 2;
                bossMosquito.y = discoY + Math.sin(bossMosquito.orbitAngle) * orbitRadius * 0.6 - bossMosquito.h / 2;
                bossMosquito.rotation = bossMosquito.orbitAngle - Math.PI / 2;
              } else {
                bossMosquito.y = 100 + Math.sin(Date.now() * 0.003) * 50;
                bossMosquito.x += Math.sin(Date.now() * 0.008) * 5;
                bossMosquito.x = Math.max(150, Math.min(650, bossMosquito.x));
              }
              if (bossMosquito.attackTimer >= 300) {
                bossMosquito.state = 'swoop_charge';
                bossMosquito.attackTimer = 0;
                bossMosquito.targetX = player.x + player.width / 2;
                bossMosquito.targetY = player.y + player.height / 2;
              }
              if (bossMosquito.minionSpawnTimer >= 90 && spaceBossMinions.length < 8) {
                bossMosquito.minionSpawnTimer = 0;
                const riseTargetY = 80 + Math.random() * 150;
                spaceBossMinions.push({
                  x: bossMosquito.x + bossMosquito.w / 2 - 12, y: bossMosquito.y + bossMosquito.h / 2 - 10,
                  w: 24, h: 20, phase: 'rise', riseTargetY: riseTargetY, vy: -2.8,
                  fly: true, alive: true, flyTimer: 0, targetY: 260 + Math.random() * 90
                });
              }
            } else if (bossMosquito.state === 'swoop_charge') {
              bossMosquito.attackTimer = (bossMosquito.attackTimer || 0) + 1;
              if (bossMosquito.attackTimer >= 90) {
                bossMosquito.state = 'swoop';
                const dx = bossMosquito.targetX - (bossMosquito.x + bossMosquito.w / 2);
                const dy = bossMosquito.targetY - (bossMosquito.y + bossMosquito.h / 2);
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const swoopSpeed = 8.4;
                bossMosquito.swoopVx = (dx / dist) * swoopSpeed;
                bossMosquito.swoopVy = (dy / dist) * swoopSpeed;
              }
            } else if (bossMosquito.state === 'swoop') {
              bossMosquito.swoopFrames = (bossMosquito.swoopFrames || 0) + 1;
              bossMosquito.x += bossMosquito.swoopVx;
              bossMosquito.y += bossMosquito.swoopVy;
              bossMosquito.rotation = Math.atan2(bossMosquito.swoopVy, bossMosquito.swoopVx) - Math.PI / 2;
              addParticles(bossMosquito.x + bossMosquito.w / 2, bossMosquito.y + bossMosquito.h / 2, 2, '#94a3b8');
              const overlapBoss = checkPlayerDamageCollision(player, { x: bossMosquito.x + 10, y: bossMosquito.y + 10, width: bossMosquito.w - 20, height: bossMosquito.h - 20 });
              if (overlapBoss && invincibleTimer <= 0 && stoneGiantTimer <= 0) {
                player.die();
              }
              const cx = bossMosquito.x + bossMosquito.w / 2, cy = bossMosquito.y + bossMosquito.h / 2;
              const passedTarget = (bossMosquito.swoopVx > 0 && cx > bossMosquito.targetX) || (bossMosquito.swoopVx < 0 && cx < bossMosquito.targetX) ||
                (bossMosquito.swoopVy > 0 && cy > bossMosquito.targetY) || (bossMosquito.swoopVy < 0 && cy < bossMosquito.targetY);
              const hitBoundary = bossMosquito.y > SPACE_BOSS_GROUND - 20 || bossMosquito.y < -50 || bossMosquito.x < -50 || bossMosquito.x > VIEW_WIDTH + 50;
              const swoopTimeout = (bossMosquito.swoopFrames || 0) >= 55;
              if (hitBoundary || passedTarget || swoopTimeout) {
                bossMosquito.state = 'return_up';
                bossMosquito.swoopFrames = 0;
                if (spaceBossMinions.length < 8) {
                  const riseTargetY = 80 + Math.random() * 150;
                  spaceBossMinions.push({
                    x: bossMosquito.x + bossMosquito.w / 2 - 12, y: bossMosquito.y + bossMosquito.h / 2 - 10,
                    w: 24, h: 20, phase: 'rise', riseTargetY: riseTargetY, vy: -2.8,
                    fly: true, alive: true, flyTimer: 0, targetY: 260 + Math.random() * 90
                  });
                }
              }
            } else if (bossMosquito.state === 'return_up') {
              bossMosquito.y -= 4;
              bossMosquito.x += (400 - bossMosquito.x) * 0.05;
              bossMosquito.rotation = Math.atan2(-1, 0) - Math.PI / 2;
              if (bossMosquito.y <= 100) {
                bossMosquito.state = 'hover';
                bossMosquito.y = 100;
                bossMosquito.x = Math.max(200, Math.min(600, bossMosquito.x));
                bossMosquito.attackTimer = 0;
                bossMosquito.minionSpawnTimer = 0;
                if (bossBigDiscoSize > 15) {
                  bossMosquito.orbitAngle = Math.atan2(bossMosquito.y + bossMosquito.h/2 - 150, bossMosquito.x + bossMosquito.w/2 - 400);
                }
              }
            }
          }
          for (const m of spaceBossMinions) {
            if (!m.alive) continue;
            if ((m.phase || 'fly') === 'rise') {
              m.y += m.vy;
              if (m.y <= (m.riseTargetY || 150)) {
                m.phase = 'fly';
              }
            } else if (m.fly || !m.phase) {
              m.flyTimer = (m.flyTimer || 0) + 1;
              const targetX = player.x + player.width / 2;
              const dx = targetX - (m.x + m.w / 2);
              m.vx = (m.vx || 0) + (dx > 0 ? 0.03 : -0.03);
              m.vx = Math.max(-3, Math.min(3, m.vx));
              m.x += m.vx;
              const baseY = m.targetY !== undefined ? m.targetY : 260 + Math.random() * 90;
              if (m.targetY === undefined) m.targetY = baseY;
              m.y = baseY + Math.sin(m.flyTimer * 0.12) * 30;
              m.y = Math.max(50, Math.min(SPACE_BOSS_GROUND - 50, m.y));
            }
            const overlapX = player.x + player.width > m.x + 4 && player.x < m.x + m.w - 4;
            const prevBottom = player.y + player.height - player.vy;
            const currBottom = player.y + player.height;
            if (overlapX && prevBottom <= m.y + 12 && currBottom >= m.y - 4 && player.vy > 0) {
              m.alive = false;
              playSound('stomp');
              score += 50;
              for (let i = 0; i < 3; i++) {
                spaceBossDiscoBalls.push({
                  x: m.x + m.w / 2 - 8 + (Math.random() - 0.5) * 20, y: m.y, w: 16, h: 16, collected: false
                });
              }
            } else if (overlapX && player.vy <= 0 && currBottom > m.y + 4 && invincibleTimer <= 0 && checkPlayerDamageCollision(player, m)) {
              if (player.big) { player.big = false; player.height = 40; invincibleTimer = 120; playSound('brick'); addParticles(player.x + player.width/2, player.y + player.height/2, 6, '#ff6b9d'); }
              else player.die();
            }
          }
          spaceBossMinions = spaceBossMinions.filter(m => m.alive);
          if (powerCooldown > 0) powerCooldown--;
          if ((keys['x'] || keys['X'] || keys['KeyX']) && player.powerType && powerCooldown <= 0 && spaceBossPhase === 'fight') {
            const h = player.big ? 56 : 40;
            const py = player.y + h/2 - 12;
            const px = player.x + (player.facingRight ? player.width : 0);
            const right = player.facingRight;
            const lv = player.powerLevel;
            const maxProj = Math.min(8, 2 + lv);
            if (powerProjectiles.length < maxProj) {
              const angles = (player.powerType === 'fire' && lv >= 5) ? [-90,-45,0,45,90] : (player.powerType === 'fire' && lv >= 4) ? [-30,0,30] : (player.powerType === 'fire' && lv >= 3) ? [0] : (player.powerType === 'earth' && lv >= 4) ? [-15,15] : (player.powerType === 'earth' && lv >= 3) ? [0] : (player.powerType === 'water' && lv >= 4) ? [-25,0,25] : (player.powerType === 'wind' && lv >= 5) ? [-60,-30,0,30,60] : (player.powerType === 'wind' && lv >= 4) ? [-30,0,30] : (player.powerType === 'ice' && lv >= 5) ? [-45,-22,0,22,45] : (player.powerType === 'ice' && lv >= 4) ? [-20,0,20] : (player.powerType === 'lightning' && lv >= 5) ? [-30,-15,0,15,30] : (player.powerType === 'lightning' && lv >= 4) ? [-15,0,15] : (player.powerType === 'nature' && lv >= 5) ? [-40,-20,0,20,40] : (player.powerType === 'nature' && lv >= 4) ? [-25,0,25] : (player.powerType === 'stone' && lv >= 5) ? [-25,-10,10,25] : (player.powerType === 'stone' && lv >= 4) ? [-10,10] : (player.powerType === 'shadow' && lv >= 5) ? [-35,-15,0,15,35] : (player.powerType === 'shadow' && lv >= 4) ? [-20,0,20] : (player.powerType === 'light' && lv >= 5) ? [-50,-25,0,25,50] : (player.powerType === 'light' && lv >= 4) ? [-30,0,30] : (player.powerType === 'time' && lv >= 4) ? [-20,0,20] : (player.powerType === 'time' && lv >= 3) ? [0] : (player.powerType === 'vortex' && lv >= 4) ? [-25,-10,10,25] : (player.powerType === 'toxic' && lv >= 4) ? [-30,0,30] : (player.powerType === 'phantom' && lv >= 4) ? [-25,0,25] : (player.powerType === 'sound' && lv >= 4) ? [-35,-15,0,15,35] : (player.powerType === 'prism' && lv >= 4) ? [-15,15] : (player.powerType === 'plasma' && lv >= 4) ? [-30,0,30] : (player.powerType === 'meteor' && lv >= 4) ? [-20,-10,0,10,20] : (player.powerType === 'void' && lv >= 4) ? [-25,0,25] : (player.powerType === 'beam' && lv >= 4) ? [-20,0,20] : [0];
              for (const ang of angles) {
                if (powerProjectiles.length < maxProj) {
                  powerProjectiles.push(new PowerProjectile(px, py, player.powerType, lv, right, ang));
                }
              }
              powerCooldown = Math.max(5, 16 - lv * 2);
              playSound(POWER_SOUND[player.powerType] || 'fire');
            }
          }
          for (const pp of powerProjectiles) pp.update(bossPlatforms);
          for (const m of spaceBossMinions) {
            if (!m.alive) continue;
            for (const pp of powerProjectiles) {
              if (pp.active) {
                const hit = pp.x + pp.width > m.x && pp.x < m.x + m.w && pp.y + pp.height > m.y && pp.y < m.y + m.h;
                if (hit) {
                  m.alive = false;
                  pp.active = false;
                  playSound('stomp');
                  score += 50;
                  for (let i = 0; i < 3; i++) {
                    spaceBossDiscoBalls.push({ x: m.x + m.w/2 - 8 + (Math.random()-0.5)*20, y: m.y, w: 16, h: 16, collected: false });
                  }
                  addParticles(m.x + m.w/2, m.y + m.h/2, 6, POWER_COLOR[pp.type] || '#fff');
                }
              }
            }
          }
          powerProjectiles = powerProjectiles.filter(pp => pp.active);
          for (const db of spaceBossDiscoBalls) {
            if (db.collected) continue;
            if (player.x + player.width > db.x && player.x < db.x + db.w && player.y + player.height > db.y && player.y < db.y + db.h) {
              db.collected = true;
              bossDiscoCollected++;
              bossBigDiscoSize = Math.min(50, bossBigDiscoSize + 1);
              playSound('coin');
              addParticles(db.x + db.w / 2, db.y + db.h / 2, 6, '#ffd700');
            }
          }
          spaceBossDiscoBalls = spaceBossDiscoBalls.filter(db => !db.collected);
          if (bossDiscoCollected >= 50 && spaceBossPhase === 'fight') {
            spaceBossPhase = 'lights';
            spaceBossLightsTimer = 180;
            spaceBossMinions = [];
            powerProjectiles = powerProjectiles.filter(() => false);
            bossCutsceneMode = true;
          }
          if (spaceBossPhase === 'lights') {
            spaceBossLightsTimer--;
            if (spaceBossLightsTimer <= 0) {
              spaceBossPhase = 'laser';
              spaceBossLaserTimer = 120;
              playDiscoMusic();
            }
          }
          if (spaceBossPhase === 'laser' && bossMosquito) {
            spaceBossLaserTimer--;
            spaceBossMosquitoStunned = true;
            bossMosquito.x += (Math.random() - 0.5) * 10;
            bossMosquito.y += (Math.random() - 0.5) * 10;
            bossMosquito.rotation += 0.5;
            bossMosquito.scale = Math.max(0.1, (bossMosquito.scale || 1) - 0.01);
            bossMosquito.y -= 4;
            if (spaceBossLaserTimer <= 0 || bossMosquito.y < -150) {
              spaceBossPhase = 'supernova';
              spaceBossSupernovaFlashTimer = 5;
              playSound('supernova_boom');
              playSound('supernova_metal');
              const mx = bossMosquito.x + bossMosquito.w / 2;
              const my = bossMosquito.y + bossMosquito.h / 2;
              for (let i = 0; i < 150 && spaceBossSupernovaParticles.length < 150; i++) {
                const a = (i / 150) * Math.PI * 2 + Math.random() * 0.3;
                const spd = 3 + Math.random() * 14;
                const colors = ['#ffffff', '#00ffff', '#c084fc', '#a78bfa', '#f0abfc'];
                spaceBossSupernovaParticles.push({
                  x: mx, y: my, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
                  life: 50 + Math.random() * 40, color: colors[i % colors.length]
                });
              }
              bossMosquito = null;
            }
          }
          if (spaceBossPhase === 'supernova') {
            spaceBossSupernovaFlashTimer--;
            for (const p of spaceBossSupernovaParticles) {
              p.x += p.vx;
              p.y += p.vy;
              p.life--;
            }
            spaceBossSupernovaParticles = spaceBossSupernovaParticles.filter(p => p.life > 0);
            if (spaceBossSupernovaFlashTimer <= 0 && spaceBossSupernovaParticles.length < 50) {
              spaceBossPhase = 'walk';
              princessSnail = { x: 400, y: 100, dancePhase: 0, targetY: SPACE_BOSS_GROUND - 40, floatTimer: 0 };
              spaceBossVictoryDisco = { x: 380, y: 50, w: 48, h: 48, collected: false };
            }
          }
          if (spaceBossPhase === 'walk') {
            princessSnail.floatTimer = (princessSnail.floatTimer || 0) + 1;
            const t = Math.min(1, (princessSnail.floatTimer || 0) / 90);
            princessSnail.y = 100 + ((princessSnail.targetY || 360) - 100) * (1 - Math.pow(1 - t, 1.2));
            if (spaceBossVictoryDisco && !spaceBossVictoryDisco.collected) {
              const targetX = player.x + player.width / 2 - spaceBossVictoryDisco.w / 2;
              const targetY = player.y - spaceBossVictoryDisco.h;
              spaceBossVictoryDisco.x += (targetX - spaceBossVictoryDisco.x) * 0.05;
              spaceBossVictoryDisco.y += (targetY - spaceBossVictoryDisco.y) * 0.05;
              const dx = (spaceBossVictoryDisco.x + spaceBossVictoryDisco.w / 2) - (player.x + player.width / 2);
              const dy = (spaceBossVictoryDisco.y + spaceBossVictoryDisco.h / 2) - (player.y + player.height / 2);
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 30) {
                spaceBossVictoryDisco.collected = true;
                gameState = 'bossVictory';
                bossVictoryTimer = 180 * 60;
                if (typeof playVictoryMusic === 'function') playVictoryMusic();
              }
            }
          }
          cameraX = 0;
          targetCameraX = 0;

          ctx.globalAlpha = 1;
          const grad = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
          grad.addColorStop(0, '#022c22');
          grad.addColorStop(0.4, '#011a14');
          grad.addColorStop(1, '#000000');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
          ctx.fillStyle = '#022c22';
          ctx.fillRect(0, SPACE_BOSS_GROUND, VIEW_WIDTH, VIEW_HEIGHT - SPACE_BOSS_GROUND);
          for (const p of spaceBossSidePlatforms) {
            ctx.fillStyle = '#334155';
            ctx.fillRect(p.x, p.y, p.width, p.height);
            ctx.fillStyle = '#475569';
            ctx.fillRect(p.x + 2, p.y + 2, p.width - 4, p.height - 4);
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.brick, p.x + p.width / 2, p.y + p.height / 2);
          }
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          for (let i = 0; i < 60; i++) {
            ctx.fillRect((i * 37 % (VIEW_WIDTH + 50)) - 25, (i * 29 % VIEW_HEIGHT), 2, 2);
          }
          const bigDiscoX = 400, bigDiscoY = 150;
          if (bossBigDiscoSize > 0) {
            const r = 20 + (bossBigDiscoSize / 50) * 80;
            ctx.save();
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 25;
            const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.1;
            ctx.beginPath();
            ctx.arc(bigDiscoX, bigDiscoY, r * pulse, 0, Math.PI * 2);
            ctx.fillStyle = bossDiscoCollected >= 50 ? 'rgba(255,215,0,0.9)' : 'rgba(255,215,0,0.5)';
            ctx.fill();
            ctx.font = (r * 1.2) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.disco, bigDiscoX, bigDiscoY);
            if (bossDiscoCollected >= 50 && spaceBossPhase !== 'fight' && bossMosquito) {
              const pulse = 1 + Math.sin(Date.now() * 0.02) * 0.3;
              for (let i = 0; i < 5; i++) {
                const laserHue = (Date.now() * 0.2 + i * 72) % 360;
                ctx.strokeStyle = 'hsl(' + laserHue + ',100%,60%)';
                ctx.lineWidth = (8 + i * 2) * pulse;
                ctx.shadowColor = 'hsl(' + laserHue + ',100%,80%)';
                ctx.shadowBlur = 25 + i * 5;
                ctx.beginPath();
                ctx.moveTo(bigDiscoX, bigDiscoY);
                ctx.lineTo(bossMosquito.x + bossMosquito.w/2, bossMosquito.y + bossMosquito.h/2);
                ctx.stroke();
              }
            }
            ctx.restore();
          }
          for (const db of spaceBossDiscoBalls) {
            if (db.collected) continue;
            ctx.save();
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.disco, db.x + db.w / 2, db.y + db.h / 2);
            ctx.restore();
          }
          if (spaceBossSupernovaFlashTimer > 0) {
            ctx.save();
            ctx.fillStyle = 'rgba(255,255,255,1)';
            ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
            ctx.restore();
          }
          for (const p of spaceBossSupernovaParticles) {
            if (p.life > 0) {
              ctx.save();
              ctx.globalAlpha = p.life / 90;
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }
          if (bossMosquito && spaceBossPhase !== 'laser' && spaceBossPhase !== 'walk' && spaceBossPhase !== 'supernova') {
            const bx = bossMosquito.x;
            const by = bossMosquito.y;
            const glow = bossMosquito.state === 'swoop_charge' ? 'rgba(255,0,0,0.6)' : 'transparent';
            ctx.save();
            if (glow !== 'transparent') {
              ctx.shadowColor = '#ff0000';
              ctx.shadowBlur = 30;
            }
            ctx.translate(bx + bossMosquito.w/2, by + bossMosquito.h/2);
            ctx.rotate(bossMosquito.rotation || 0);
            ctx.scale(bossMosquito.scale || 1, bossMosquito.scale || 1);
            ctx.translate(-(bx + bossMosquito.w/2), -(by + bossMosquito.h/2));
            ctx.font = '100px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.mosquito, bx + bossMosquito.w/2, by + bossMosquito.h/2);
            ctx.restore();
          }
          if (bossMosquito && spaceBossPhase === 'laser') {
            const bx = bossMosquito.x;
            const by = bossMosquito.y;
            const flash = Math.floor(Date.now() / 80) % 2 === 0 ? '#ffffff' : '#ff4444';
            ctx.save();
            ctx.shadowColor = flash;
            ctx.shadowBlur = 25;
            ctx.globalAlpha = 0.9 + Math.sin(Date.now() * 0.2) * 0.1;
            ctx.translate(bx + bossMosquito.w/2, by + bossMosquito.h/2);
            ctx.rotate(bossMosquito.rotation || 0);
            ctx.scale(bossMosquito.scale || 1, bossMosquito.scale || 1);
            ctx.translate(-(bx + bossMosquito.w/2), -(by + bossMosquito.h/2));
            ctx.font = '100px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = flash;
            ctx.fillText(EMOJI.mosquito, bx + bossMosquito.w/2, by + bossMosquito.h/2);
            ctx.restore();
          }
          if (spaceBossPhase === 'walk' && princessSnail) {
            princessSnail.dancePhase = (princessSnail.dancePhase || 0) + 0.03;
            const bounce = Math.sin(princessSnail.dancePhase) * 4;
            ctx.save();
            ctx.font = '48px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.sister, princessSnail.x, princessSnail.y + bounce);
            ctx.restore();
            if (spaceBossVictoryDisco && !spaceBossVictoryDisco.collected) {
              ctx.save();
              const pulse = 1 + Math.sin(Date.now() * 0.008) * 0.15;
              ctx.font = (48 * pulse) + 'px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.shadowColor = '#ffd700';
              ctx.shadowBlur = 20;
              ctx.fillText(EMOJI.disco, spaceBossVictoryDisco.x + spaceBossVictoryDisco.w / 2, spaceBossVictoryDisco.y + spaceBossVictoryDisco.h / 2);
              ctx.restore();
            }
            ctx.fillStyle = '#84ff00';
            ctx.font = '18px Nunito';
            ctx.textAlign = 'center';
            ctx.fillText('Victory disco incoming!', VIEW_WIDTH / 2, 60);
          }
          for (const m of spaceBossMinions) {
            if (!m.alive) continue;
            ctx.font = '20px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.mosquito, m.x + m.w/2, m.y + m.h/2);
          }
          ctx.fillStyle = '#84ff00';
          ctx.font = '16px Nunito';
          ctx.textAlign = 'center';
          ctx.fillText('Disco: ' + bossDiscoCollected + ' / 50', VIEW_WIDTH / 2, 35);
          for (const pp of powerProjectiles) pp.draw();
          player.draw();
          updateHUD();
          return;
        }

        if (gameState === 'cactus_boss') {
          const CACTUS_GROUND = GROUND_Y;
          bossCutsceneMode = (cactusBossPhase !== 'fight');
          bossCutsceneTargetX = 200;
          cactusGroundColorMix = Math.min(1, cactusGroundColorMix + (['lights', 'laser', 'bloom', 'walk'].includes(cactusBossPhase) ? 0.015 : 0));
          const grad = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
          grad.addColorStop(0, '#fef08a');
          grad.addColorStop(0.5, '#eab308');
          grad.addColorStop(1, '#b45309');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
          const r1 = parseInt('92', 16), g1 = parseInt('40', 16), b1 = parseInt('0e', 16);
          const r2 = parseInt('22', 16), g2 = parseInt('c5', 16), b2 = parseInt('5e', 16);
          const mix = cactusGroundColorMix;
          const gr = Math.round(r1 + (r2 - r1) * mix);
          const gg = Math.round(g1 + (g2 - g1) * mix);
          const gb = Math.round(b1 + (b2 - b1) * mix);
          ctx.fillStyle = 'rgb(' + gr + ',' + gg + ',' + gb + ')';
          ctx.fillRect(0, CACTUS_GROUND, VIEW_WIDTH, VIEW_HEIGHT - CACTUS_GROUND);

          player.update();
          player.x = Math.max(0, Math.min(VIEW_WIDTH - player.width, player.x));
          if (player.y + player.height >= CACTUS_GROUND) {
            player.y = CACTUS_GROUND - player.height;
            player.vy = 0;
            player.onGround = true;
          }

          if (cactusBossPhase === 'fight' && bossCactus) {
            bossCactus.rootTimer = (bossCactus.rootTimer || 0) + 1;
            bossCactus.needleTimer = (bossCactus.needleTimer || 0) + 1;

            if (bossCactus.rootTimer >= 120) {
              bossCactus.rootTimer = 0;
              cactusRoots.push({ x: player.x + player.width / 2, y: CACTUS_GROUND, phase: 'warn', timer: 0, riseProgress: 0, retractProgress: 1 });
            }
            if (bossCactus.needleTimer >= 260) {
              bossCactus.needleTimer = 0;
              for (let i = 0; i < 3; i++) {
                const offsetX = -55 - i * 25;
                cactusNeedles.push({
                  x: bossCactus.x + bossCactus.w / 2 - 24 + offsetX, y: bossCactus.y + bossCactus.h * 0.5,
                  vx: rand(-4, -1.5), vy: rand(-5, -2.5), w: 48, h: 48
                });
              }
            }
          }

          cactusRoots = cactusRoots.filter(r => {
            r.timer++;
            if (r.phase === 'warn' && r.timer >= 90) {
              r.phase = 'rise';
              r.timer = 0;
            }
            if (r.phase === 'rise') {
              r.riseProgress = Math.min(1, (r.timer || 0) / 50);
              if (r.riseProgress >= 1) {
                r.phase = 'attack';
                r.timer = 0;
                playSound('brick');
              }
            }
            if (r.phase === 'attack' && r.timer >= 40) {
              r.phase = 'retract';
              r.timer = 0;
            }
            if (r.phase === 'retract') {
              r.retractProgress = Math.max(0, 1 - (r.timer || 0) / 50);
              if (r.retractProgress <= 0) return false;
            }
            if (r.phase === 'attack') {
              const hitW = 60, hitH = 100;
              const hitX = r.x - hitW / 2;
              const hitY = CACTUS_GROUND - hitH;
              const overlap = checkPlayerDamageCollision(player, { x: hitX, y: hitY, width: hitW, height: hitH });
              if (overlap && invincibleTimer <= 0) player.die();
            }
            return true;
          });

          for (const n of cactusNeedles) {
            n.x += n.vx;
            n.y += n.vy;
            n.vy += GRAVITY * 0.35;
            if (n.y + n.h >= CACTUS_GROUND) {
              cactusDiscoBalls.push({
                x: n.x + n.w / 2 - 8 + (Math.random() - 0.5) * 16, y: CACTUS_GROUND - 16, w: 16, h: 16, collected: false
              });
              addParticles(n.x + n.w / 2, CACTUS_GROUND - 10, 6, '#ffd700');
              playSound('brick');
              continue;
            }
            if (n.y > VIEW_HEIGHT) continue;
            const hit = checkPlayerDamageCollision(player, { x: n.x, y: n.y, width: n.w, height: n.h });
            if (hit && invincibleTimer <= 0) player.die();
          }
          cactusNeedles = cactusNeedles.filter(n => n.y + n.h < CACTUS_GROUND && n.y <= VIEW_HEIGHT);

          for (const db of cactusDiscoBalls) {
            if (db.collected) continue;
            if (player.x + player.width > db.x && player.x < db.x + db.w && player.y + player.height > db.y && player.y < db.y + db.h) {
              db.collected = true;
              bossDiscoCollected++;
              bossBigDiscoSize = Math.min(50, bossBigDiscoSize + 1);
              playSound('coin');
              addParticles(db.x + db.w / 2, db.y + db.h / 2, 6, '#ffd700');
            }
          }
          cactusDiscoBalls = cactusDiscoBalls.filter(db => !db.collected);

          if (powerCooldown > 0) powerCooldown--;
          if (cactusBossPhase === 'fight' && (keys['x'] || keys['X'] || keys['KeyX']) && player.powerType && powerCooldown <= 0) {
            const h = player.big ? 56 : 40;
            const py = player.y + h / 2 - 12;
            const px = player.x + (player.facingRight ? player.width : 0);
            const right = player.facingRight;
            const lv = player.powerLevel;
            const maxProj = Math.min(8, 2 + lv);
            if (powerProjectiles.length < maxProj) {
              const angles = (player.powerType === 'fire' && lv >= 5) ? [-90,-45,0,45,90] : (player.powerType === 'fire' && lv >= 4) ? [-30,0,30] : (player.powerType === 'fire' && lv >= 3) ? [0] : (player.powerType === 'earth' && lv >= 4) ? [-15,15] : (player.powerType === 'earth' && lv >= 3) ? [0] : (player.powerType === 'water' && lv >= 4) ? [-25,0,25] : (player.powerType === 'wind' && lv >= 5) ? [-60,-30,0,30,60] : (player.powerType === 'wind' && lv >= 4) ? [-30,0,30] : (player.powerType === 'ice' && lv >= 5) ? [-45,-22,0,22,45] : (player.powerType === 'ice' && lv >= 4) ? [-20,0,20] : (player.powerType === 'lightning' && lv >= 5) ? [-30,-15,0,15,30] : (player.powerType === 'lightning' && lv >= 4) ? [-15,0,15] : (player.powerType === 'nature' && lv >= 5) ? [-40,-20,0,20,40] : (player.powerType === 'nature' && lv >= 4) ? [-25,0,25] : (player.powerType === 'stone' && lv >= 5) ? [-25,-10,10,25] : (player.powerType === 'stone' && lv >= 4) ? [-10,10] : (player.powerType === 'shadow' && lv >= 5) ? [-35,-15,0,15,35] : (player.powerType === 'shadow' && lv >= 4) ? [-20,0,20] : (player.powerType === 'light' && lv >= 5) ? [-50,-25,0,25,50] : (player.powerType === 'light' && lv >= 4) ? [-30,0,30] : (player.powerType === 'time' && lv >= 4) ? [-20,0,20] : (player.powerType === 'time' && lv >= 3) ? [0] : (player.powerType === 'vortex' && lv >= 4) ? [-25,-10,10,25] : (player.powerType === 'toxic' && lv >= 4) ? [-30,0,30] : (player.powerType === 'phantom' && lv >= 4) ? [-25,0,25] : (player.powerType === 'sound' && lv >= 4) ? [-35,-15,0,15,35] : (player.powerType === 'prism' && lv >= 4) ? [-15,15] : (player.powerType === 'plasma' && lv >= 4) ? [-30,0,30] : (player.powerType === 'meteor' && lv >= 4) ? [-20,-10,0,10,20] : (player.powerType === 'void' && lv >= 4) ? [-25,0,25] : (player.powerType === 'beam' && lv >= 4) ? [-20,0,20] : [0];
              for (const ang of angles) {
                if (powerProjectiles.length < maxProj) {
                  powerProjectiles.push(new PowerProjectile(px, py, player.powerType, lv, right, ang));
                }
              }
              powerCooldown = Math.max(5, 16 - lv * 2);
              playSound(POWER_SOUND[player.powerType] || 'fire');
            }
          }
          const cactusBossPlatforms = [{ x: 0, y: CACTUS_GROUND, width: VIEW_WIDTH, height: VIEW_HEIGHT - CACTUS_GROUND }];
          for (const pp of powerProjectiles) pp.update(cactusBossPlatforms);
          powerProjectiles = powerProjectiles.filter(pp => pp.active);

          if (bossDiscoCollected >= 50 && cactusBossPhase === 'fight') {
            cactusBossPhase = 'lights';
            cactusLightsTimer = 120;
            stopDiscoMusic();
            cactusRoots = [];
            cactusNeedles = [];
            powerProjectiles = powerProjectiles.filter(() => false);
            bossCutsceneMode = true;
          }

          if (cactusBossPhase === 'lights') {
            cactusLightsTimer--;
            if (cactusLightsTimer <= 0) {
              cactusBossPhase = 'laser';
              cactusLaserTimer = 100;
              playDiscoMusic();
            }
          }

          if (cactusBossPhase === 'laser') {
            cactusLaserTimer--;
            const bigDiscoX = 400, bigDiscoY = 150;
            ctx.save();
            const r = 60 + Math.sin(Date.now() * 0.02) * 10;
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 30;
            ctx.beginPath();
            ctx.arc(bigDiscoX, bigDiscoY, r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,215,0,0.9)';
            ctx.fill();
            ctx.font = (r * 1.2) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.disco, bigDiscoX, bigDiscoY);
            if (bossCactus) {
              for (let i = 0; i < 5; i++) {
                const laserHue = (Date.now() * 0.2 + i * 72) % 360;
                ctx.strokeStyle = 'hsl(' + laserHue + ',100%,60%)';
                ctx.lineWidth = 8 + i * 2;
                ctx.shadowColor = 'hsl(' + laserHue + ',100%,80%)';
                ctx.shadowBlur = 25;
                ctx.beginPath();
                ctx.moveTo(bigDiscoX, bigDiscoY);
                ctx.lineTo(bossCactus.x + bossCactus.w / 2, bossCactus.y + bossCactus.h / 2);
                ctx.stroke();
              }
            }
            ctx.restore();
            if (cactusLaserTimer <= 0) {
              cactusBossPhase = 'bloom';
              cactusBloomTimer = 120;
            }
          }

          if (cactusBossPhase === 'bloom' && bossCactus) {
            cactusBloomTimer--;
            bossCactus.rotation = (bossCactus.rotation || 0) + 0.5;
            const bloomProgress = 1 - cactusBloomTimer / 120;
            if (bloomProgress < 0.3) {
              bossCactus.scale = Math.min(1.2, (bossCactus.scale || 1) + 0.02);
            } else {
              bossCactus.scale = Math.max(0, (bossCactus.scale || 1) - 0.04);
            }
            bossCactus.x += (Math.random() - 0.5) * 4;
            for (let i = 0; i < rand(25, 40) && cactusBloomParticles.length < 350; i++) {
              const angle = Math.random() * Math.PI * 2;
              const spd = 4 + Math.random() * 14;
              cactusBloomParticles.push({
                x: bossCactus.x + bossCactus.w / 2 + (Math.random() - 0.5) * 80,
                y: bossCactus.y + bossCactus.h * 0.6,
                vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
                life: 100 + Math.random() * 60, emoji: EMOJI.meteor
              });
            }
              for (const p of cactusBloomParticles) {
              p.x += p.vx;
              p.y += p.vy;
              p.life--;
            }
            cactusBloomParticles = cactusBloomParticles.filter(p => p.life > 0);
            if (bossCactus.scale <= 0) {
              cactusBossPhase = 'walk';
              princessSnail = { x: 650, y: CACTUS_GROUND - 40, dancePhase: 0, syncedJump: 0 };
            }
          }

          if (cactusBossPhase === 'walk') {
            if (player.x >= princessSnail.x - 80) {
              princessSnail.syncedJump = (princessSnail.syncedJump || 0) + 1;
              if (princessSnail.syncedJump === 1) {
                player.vy = -7;
                player.onGround = false;
                princessSnail.jumpVy = -7;
              }
              if (princessSnail.jumpVy !== undefined) {
                princessSnail.jumpVy += 0.4;
                princessSnail.y += princessSnail.jumpVy;
                if (princessSnail.y >= CACTUS_GROUND - 40) {
                  princessSnail.y = CACTUS_GROUND - 40;
                  princessSnail.jumpVy = 0;
                }
              }
              if (princessSnail.syncedJump > 90) {
                gameState = 'bossVictory';
                bossVictoryTimer = 180 * 60;
                if (typeof playVictoryMusic === 'function') playVictoryMusic();
              }
            }
          }

          cameraX = 0;
          targetCameraX = 0;

          const bigDiscoX = 400, bigDiscoY = 150;
          if (bossBigDiscoSize > 0 && cactusBossPhase === 'fight') {
            ctx.save();
            const r = 20 + (bossBigDiscoSize / 50) * 80;
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 25;
            const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.1;
            ctx.beginPath();
            ctx.arc(bigDiscoX, bigDiscoY, r * pulse, 0, Math.PI * 2);
            ctx.fillStyle = bossDiscoCollected >= 50 ? 'rgba(255,215,0,0.9)' : 'rgba(255,215,0,0.5)';
            ctx.fill();
            ctx.font = (r * 1.2) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.disco, bigDiscoX, bigDiscoY);
            ctx.restore();
          }

          for (const r of cactusRoots) {
            ctx.save();
            if (r.phase === 'warn') {
              ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.02) * 0.5;
              ctx.font = '64px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.shadowColor = '#ff0000';
              ctx.shadowBlur = 20;
              ctx.fillText(EMOJI.fire, r.x, CACTUS_GROUND - 30);
            } else if (r.phase === 'rise') {
              const prog = r.riseProgress || 0;
              const fontSize = 40 + prog * 60;
              ctx.globalAlpha = 0.6 + prog * 0.4;
              ctx.font = fontSize + 'px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              ctx.fillText(EMOJI.fire, r.x, CACTUS_GROUND);
            } else if (r.phase === 'retract') {
              const prog = r.retractProgress || 1;
              const fontSize = 40 + prog * 60;
              ctx.globalAlpha = 0.6 + prog * 0.4;
              ctx.font = fontSize + 'px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              ctx.fillText(EMOJI.fire, r.x, CACTUS_GROUND);
            } else {
              ctx.font = '100px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(EMOJI.fire, r.x, CACTUS_GROUND - 50);
            }
            ctx.restore();
          }

          for (const n of cactusNeedles) {
            ctx.save();
            ctx.font = '48px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#78716c';
            ctx.shadowBlur = 12;
            ctx.fillText(EMOJI.spike, n.x + n.w / 2, n.y + n.h / 2);
            ctx.restore();
          }

          for (const p of cactusBloomParticles) {
            if (p.life > 0) {
              ctx.save();
              ctx.globalAlpha = p.life / 160;
              ctx.font = '36px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.shadowColor = '#fbbf24';
              ctx.shadowBlur = 15;
              ctx.fillText(EMOJI.meteor, p.x, p.y);
              ctx.restore();
            }
          }
          if (bossCactus && cactusBossPhase !== 'walk') {
            ctx.save();
            const bx = bossCactus.x, by = bossCactus.y;
            ctx.translate(bx + bossCactus.w / 2, by + bossCactus.h / 2);
            ctx.rotate(bossCactus.rotation || 0);
            ctx.scale(bossCactus.scale || 1, bossCactus.scale || 1);
            ctx.translate(-(bx + bossCactus.w / 2), -(by + bossCactus.h / 2));
            ctx.font = '270px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.volcano, bx + bossCactus.w / 2, by + bossCactus.h / 2);
            ctx.restore();
          }

          for (const db of cactusDiscoBalls) {
            if (db.collected) continue;
            ctx.save();
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.disco, db.x + db.w / 2, db.y + db.h / 2);
            ctx.restore();
          }

          if (cactusBossPhase === 'walk' && princessSnail) {
            princessSnail.dancePhase = (princessSnail.dancePhase || 0) + 0.03;
            const bounce = Math.sin(princessSnail.dancePhase) * 4;
            ctx.save();
            ctx.font = '48px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.sister, princessSnail.x, princessSnail.y + bounce);
            ctx.restore();
            ctx.fillStyle = '#84ff00';
            ctx.font = '18px Nunito';
            ctx.textAlign = 'center';
            ctx.fillText('→ Walk to the princess!', VIEW_WIDTH / 2, 60);
          }

          ctx.fillStyle = '#84ff00';
          ctx.font = '16px Nunito';
          ctx.textAlign = 'center';
          ctx.fillText('Disco: ' + bossDiscoCollected + ' / 50', VIEW_WIDTH / 2, 35);
          if (cactusBossPhase === 'lights') {
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,' + (1 - cactusLightsTimer / 120) * 0.85 + ')';
            ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
            ctx.restore();
          }
          for (const pp of powerProjectiles) pp.draw();
          player.draw();
          updateHUD();
          return;
        }

        if (gameState === 'jellyfish_boss') {
          const JELLY_GROUND = 420;
          ctx.save();
          const grad = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
          grad.addColorStop(0, '#0c4a6e');
          grad.addColorStop(0.6, '#075985');
          grad.addColorStop(1, '#0e7490');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
          ctx.restore();
          ctx.save();
          ctx.fillStyle = '#0d4f6e';
          ctx.fillRect(0, JELLY_GROUND, VIEW_WIDTH, VIEW_HEIGHT - JELLY_GROUND);
          ctx.fillStyle = '#0a3d52';
          ctx.fillRect(0, JELLY_GROUND, VIEW_WIDTH, 12);
          ctx.strokeStyle = 'rgba(165,243,252,0.5)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, JELLY_GROUND);
          ctx.lineTo(VIEW_WIDTH, JELLY_GROUND);
          ctx.stroke();
          for (let i = 0; i < Math.ceil(VIEW_WIDTH / 40); i++) {
            ctx.fillStyle = 'rgba(14,165,233,0.15)';
            ctx.fillRect(i * 40, JELLY_GROUND + 2, 38, 8);
          }
          ctx.restore();

          player.update();
          player.x = Math.max(0, Math.min(VIEW_WIDTH - player.width, player.x));
          if (player.y + player.height >= JELLY_GROUND) {
            player.y = JELLY_GROUND - player.height;
            player.vy = 0;
            player.onGround = true;
          }

          if (jellyfishBoss && jellyfishBossPhase === 'fight') {
            jellyfishBoss.shootTimer = (jellyfishBoss.shootTimer || 0) + 1;
            jellyfishBoss.x = 350 + Math.sin(Date.now() * 0.004) * 80;
            if (jellyfishBoss.shootTimer >= 90) {
              jellyfishBoss.shootTimer = 0;
              playSound('jellyfish_fire');
              const dx = (player.x + player.width/2) - (jellyfishBoss.x + jellyfishBoss.w/2);
              const dy = (player.y + player.height/2) - (jellyfishBoss.y + jellyfishBoss.h/2);
              const dist = Math.sqrt(dx*dx + dy*dy) || 1;
              jellyfishMinions.push({
                x: jellyfishBoss.x + jellyfishBoss.w/2 - 12, y: jellyfishBoss.y + jellyfishBoss.h - 10,
                w: 24, h: 24, vx: (dx/dist)*0.85, vy: (dy/dist)*0.85, alive: true, chase: true
              });
            }
          }

          jellyfishBossBubbleTimer = (jellyfishBossBubbleTimer || 0) + 1;
          if (jellyfishBossBubbleTimer >= 120 && jellyfishBossPhase === 'fight') {
            jellyfishBossBubbleTimer = 0;
            const powerTypes = ['fire','water','ice','lightning','nature','stone','wind','light'];
            const power = powerTypes[Math.floor(Math.random() * powerTypes.length)];
            jellyfishBossBubbles.push({
              x: 80 + Math.random() * (VIEW_WIDTH - 160), y: JELLY_GROUND + 20,
              vy: -1.8, w: 36, h: 36, powerType: power, collected: false
            });
          }
          for (const b of jellyfishBossBubbles) {
            if (b.collected) continue;
            b.y += b.vy;
            if (b.y < -50) b.collected = true;
            const overlap = player.x + player.width > b.x + 4 && player.x < b.x + b.w - 4 &&
              player.y + player.height > b.y && player.y < b.y + b.h;
            if (overlap) {
              b.collected = true;
              player.powerType = b.powerType;
              player.powerLevel = Math.min(3, (player.powerLevel || 0) + 1);
              playSound('powerup_spawn');
              addParticles(b.x + b.w/2, b.y + b.h/2, 8, POWER_COLOR[b.powerType] || '#fff');
            }
          }
          jellyfishBossBubbles = jellyfishBossBubbles.filter(b => !b.collected);

          for (const m of jellyfishMinions) {
            if (!m.alive) continue;
            if (m.chase) {
              const dx = (player.x + player.width/2) - (m.x + m.w/2);
              const dy = (player.y + player.height/2) - (m.y + m.h/2);
              const dist = Math.sqrt(dx*dx + dy*dy) || 1;
              const speed = 0.85;
              m.vx = (dx/dist) * speed;
              m.vy = (dy/dist) * speed;
            }
            m.x += m.vx;
            m.y += m.vy;
            if (m.y > VIEW_HEIGHT + 20 || m.x < -30 || m.x > VIEW_WIDTH + 30) m.alive = false;
            const hit = player.x + player.width > m.x + 4 && player.x < m.x + m.w - 4 && player.y + player.height > m.y && player.y < m.y + m.h;
            if (hit && invincibleTimer <= 0) {
              if (player.big) { player.big = false; player.height = 40; invincibleTimer = 120; playSound('brick'); addParticles(player.x + player.width/2, player.y + player.height/2, 6, '#ff6b9d'); }
              else player.die();
            }
          }
          jellyfishMinions = jellyfishMinions.filter(m => m.alive);

          if (powerCooldown > 0) powerCooldown--;
          if ((keys['x'] || keys['X'] || keys['KeyX'] || keys['z'] || keys['Z'] || keys['KeyZ']) && player.powerType && powerCooldown <= 0) {
            const h = player.big ? 56 : 40;
            const py = player.y + h/2 - 12;
            const px = player.x + (player.facingRight ? player.width : 0);
            const right = player.facingRight;
            const lv = player.powerLevel;
            const maxProj = Math.min(8, 2 + lv);
            if (powerProjectiles.length < maxProj) {
              const angles = [0];
              for (const ang of angles) {
                if (powerProjectiles.length < maxProj) {
                  powerProjectiles.push(new PowerProjectile(px, py, player.powerType, lv, right, ang));
                }
              }
              powerCooldown = Math.max(5, 16 - lv * 2);
              playSound(POWER_SOUND[player.powerType] || 'fire');
            }
          }
          const jellyPlatforms = [{ x: 0, y: JELLY_GROUND, width: VIEW_WIDTH, height: VIEW_HEIGHT - JELLY_GROUND }];
          for (const pp of powerProjectiles) pp.update(jellyPlatforms);
          powerProjectiles = powerProjectiles.filter(pp => pp.active);

          for (const db of jellyfishDiscoBalls) {
            if (db.collected) continue;
            if (player.x + player.width > db.x && player.x < db.x + db.w && player.y + player.height > db.y && player.y < db.y + db.h) {
              db.collected = true;
              bossDiscoCollected++;
              bossBigDiscoSize = Math.min(50, bossBigDiscoSize + 1);
              playSound('coin');
              addParticles(db.x + db.w/2, db.y + db.h/2, 6, '#ffd700');
            }
          }
          jellyfishDiscoBalls = jellyfishDiscoBalls.filter(db => !db.collected);

          for (const m of jellyfishMinions) {
            if (!m.alive) continue;
            for (const pp of powerProjectiles) {
              if (pp.active && pp.x + pp.width > m.x && pp.x < m.x + m.w && pp.y + pp.height > m.y && pp.y < m.y + m.h) {
                m.alive = false;
                pp.active = false;
                playSound('stomp');
                score += 50;
                jellyfishDiscoBalls.push({ x: m.x + m.w/2 - 8, y: m.y, w: 16, h: 16, collected: false });
              }
            }
          }

          if (bossDiscoCollected >= 50 && jellyfishBossPhase === 'fight') {
            jellyfishBossPhase = 'jellyfish_fall';
            jellyfishBoss.vy = 0;
          }

          if (jellyfishBossPhase === 'jellyfish_fall' && jellyfishBoss) {
            jellyfishBoss.vy = (jellyfishBoss.vy || 0) + 0.45;
            jellyfishBoss.y += jellyfishBoss.vy;
            const floorY = JELLY_GROUND - jellyfishBoss.h;
            if (jellyfishBoss.y >= floorY) {
              jellyfishBoss.y = floorY;
              jellyfishBoss.vy = 0;
              jellyfishBoss.squishTimer = 8;
              screenShake = 12;
              playSound('stomp');
              addParticles(jellyfishBoss.x + jellyfishBoss.w/2, JELLY_GROUND, 10, '#0ea5e9');
              jellyfishBossPhase = 'stomp';
              jellyfishBossStompHits = 0;
              jellyfishStompDiscoBall = { x: VIEW_WIDTH/2 - 40, y: 0, w: 80, h: 80, vy: 0, phase: 'fall' };
            }
          }

          if (jellyfishBossPhase === 'stomp' && jellyfishStompDiscoBall && jellyfishBoss) {
            const db = jellyfishStompDiscoBall;
            const targetY = jellyfishBoss.y + jellyfishBoss.h/2 - 20;
            if (db.phase === 'fall') {
              db.vy += 0.65;
              db.y += db.vy;
              if (db.y + db.h >= targetY) {
                db.y = targetY - db.h;
                db.phase = 'impact';
                screenShake = 18;
                playSound('stomp');
                jellyfishBoss.squishTimer = 12;
                jellyfishBossStompHits++;
                jellyfishBoss.scale = Math.pow(0.72, jellyfishBossStompHits);
                addParticles(db.x + db.w/2, db.y + db.h/2, 12, '#ffd700');
              }
            } else if (db.phase === 'impact') {
              db.impactTimer = (db.impactTimer || 0) + 1;
              if (db.impactTimer >= 50) {
                if (jellyfishBossStompHits >= 3) {
                  jellyfishBossPhase = 'octopus_hero';
                  jellyfishBoss.scale = jellyfishBoss.scale || 0.37;
                  jellyfishOctopus = { x: -80, y: 250, phase: 'swim_in', timer: 0, mouthOpen: 0, heartsSent: false };
                  jellyfishStompDiscoBall = null;
                } else {
                  db.phase = 'fall';
                  db.vy = 0;
                  db.y = 0;
                  db.impactTimer = 0;
                }
              }
            }
          }

          if (jellyfishBoss && jellyfishBoss.squishTimer > 0) {
            jellyfishBoss.squishTimer--;
          }

          if (jellyfishBossPhase === 'octopus_hero' && jellyfishOctopus) {
            const jo = jellyfishOctopus;
            jo.timer++;
            if (jo.phase === 'swim_in') {
              jo.x += 2.8;
              if (jo.x >= 380) {
                jo.phase = 'descend';
                jo.timer = 0;
                jo.targetY = (jellyfishBoss ? jellyfishBoss.y + jellyfishBoss.h/2 - 60 : 320);
              }
            } else if (jo.phase === 'descend') {
              jo.y = (jo.y || 250) + (jo.targetY - (jo.y || 250)) * 0.04;
              if (Math.abs((jo.y || 250) - jo.targetY) < 8) {
                jo.phase = 'eat';
                jo.timer = 0;
                if (jellyfishBoss) {
                  jo.eatJellyX = jellyfishBoss.x + jellyfishBoss.w/2;
                  jo.eatJellyY = jellyfishBoss.y + jellyfishBoss.h/2;
                  jo.eatJellyScale = 1;
                }
              }
            } else if (jo.phase === 'eat') {
              jo.mouthOpen = Math.min(1, (jo.timer || 0) / 35);
              jo.eatJellyScale = Math.max(0, 1 - (jo.timer || 0) / 55);
              if (jo.timer >= 55) {
                jellyfishBoss = null;
                jo.phase = 'hearts';
                jo.timer = 0;
              }
            } else if (jo.phase === 'hearts') {
              if (!jo.heartsSent && jo.timer >= 15) jo.heartsSent = true;
              if (jo.timer >= 90) {
                jo.phase = 'place_disco';
                jo.timer = 0;
              }
            } else if (jo.phase === 'place_disco') {
              if (jo.timer === 15) {
                jellyfishVictoryDisco = { x: jo.x - 24, y: (jo.y || 280) - 70, w: 48, h: 48, collected: false };
              }
              if (jellyfishVictoryDisco && !jellyfishVictoryDisco.collected) {
                const tx = player.x + player.width/2 - jellyfishVictoryDisco.w/2;
                const ty = player.y - jellyfishVictoryDisco.h - 10;
                jellyfishVictoryDisco.x += (tx - jellyfishVictoryDisco.x) * 0.04;
                jellyfishVictoryDisco.y += (ty - jellyfishVictoryDisco.y) * 0.04;
              }
              if (jo.timer >= 130) {
                jo.phase = 'wave';
                jo.timer = 0;
              }
            } else if (jo.phase === 'wave') {
              if (jo.timer >= 70) {
                jellyfishBossPhase = 'victory';
                inWaterRealm = false;
                gameState = 'bossVictory';
                bossVictoryTimer = 180;
                jellyfishOctopus = null;
                if (typeof playVictoryMusic === 'function') playVictoryMusic();
                princessSnail = { x: 400, y: 320, dancePhase: 0 };
              }
            }
          }

          const jellyBigDiscoX = 400, jellyBigDiscoY = 120;
          if (bossBigDiscoSize > 0 && (jellyfishBossPhase === 'fight' || jellyfishBossPhase === 'jellyfish_fall')) {
            ctx.save();
            const r = 20 + (bossBigDiscoSize / 50) * 80;
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 25;
            const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.1;
            ctx.beginPath();
            ctx.arc(jellyBigDiscoX, jellyBigDiscoY, r * pulse, 0, Math.PI * 2);
            ctx.fillStyle = bossDiscoCollected >= 50 ? 'rgba(255,215,0,0.9)' : 'rgba(255,215,0,0.5)';
            ctx.fill();
            ctx.font = (r * 1.2) + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.disco, jellyBigDiscoX, jellyBigDiscoY);
            if (bossDiscoCollected >= 50) {
              for (let i = 0; i < 8; i++) {
                const a = (Date.now() * 0.003 + i * (Math.PI * 2 / 8)) % (Math.PI * 2);
                const colors = ['#ff6b6b','#4ecdc4','#ffe66d','#95e1d3','#f38181','#aa96da','#ff9f43','#54a0ff'];
                ctx.strokeStyle = colors[i % colors.length];
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(jellyBigDiscoX, jellyBigDiscoY);
                ctx.lineTo(jellyBigDiscoX + Math.cos(a) * 150, jellyBigDiscoY + Math.sin(a) * 100);
                ctx.stroke();
              }
            }
            ctx.restore();
          }
          if (jellyfishBoss && !(jellyfishOctopus && jellyfishOctopus.phase === 'eat')) {
            ctx.save();
            const scaleX = jellyfishBoss.squishTimer > 0 ? 1.5 : (jellyfishBoss.scale || 1);
            const scaleY = jellyfishBoss.squishTimer > 0 ? 0.5 : (jellyfishBoss.scale || 1);
            const jx = jellyfishBoss.x + jellyfishBoss.w/2, jy = jellyfishBoss.y + jellyfishBoss.h/2;
            ctx.translate(jx, jy);
            ctx.scale(scaleX, scaleY);
            ctx.translate(-jx, -jy);
            ctx.font = '120px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.jellyfish || '🪼', jx, jy);
            ctx.restore();
          }
          if (jellyfishOctopus && jellyfishOctopus.phase === 'eat' && jellyfishOctopus.eatJellyScale > 0) {
            ctx.save();
            const jx = jellyfishOctopus.eatJellyX || 400;
            const jy = jellyfishOctopus.eatJellyY || 360;
            const s = jellyfishOctopus.eatJellyScale || 1;
            ctx.translate(jx, jy);
            ctx.scale(s, s);
            ctx.translate(-jx, -jy);
            ctx.globalAlpha = s;
            ctx.font = '100px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.jellyfish || '🪼', jx, jy);
            ctx.restore();
          }
          if (jellyfishStompDiscoBall && jellyfishStompDiscoBall.phase !== 'impact') {
            ctx.save();
            ctx.font = '80px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.disco, jellyfishStompDiscoBall.x + jellyfishStompDiscoBall.w/2, jellyfishStompDiscoBall.y + jellyfishStompDiscoBall.h/2);
            ctx.restore();
          }
          if (jellyfishOctopus) {
            const jo = jellyfishOctopus;
            const octSize = 60 + (jo.mouthOpen || 0) * 30;
            const drawY = (jo.phase === 'descend' || jo.phase === 'eat' || jo.phase === 'hearts') ? (jo.y || 250) : 250;
            ctx.save();
            ctx.font = octSize + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.octopus, jo.x, drawY);
            if (jo.phase === 'eat') {
              ctx.font = '16px Nunito';
              ctx.fillStyle = 'rgba(255,255,255,0.95)';
              ctx.fillText('The octopus eats the jellyfish!', VIEW_WIDTH/2, 55);
            }
            if (jo.phase === 'hearts' && jo.heartsSent) {
              ctx.font = '16px Nunito';
              ctx.fillStyle = 'rgba(255,255,255,0.95)';
              ctx.fillText('The octopus sends love!', VIEW_WIDTH/2, 55);
              for (let h = 0; h < 3; h++) {
                const t = (jo.timer - 15 - h * 15) / 50;
                if (t >= 0 && t <= 1) {
                  const hx = jo.x + (player.x + player.width/2 - jo.x) * t;
                  const hy = drawY - 50 + (player.y - 80 - (drawY - 50)) * t;
                  ctx.font = (28 + Math.sin(Date.now() * 0.01 + h) * 4) + 'px sans-serif';
                  ctx.globalAlpha = 1 - t * 0.3;
                  ctx.fillText(EMOJI.heart || '❤️', hx, hy);
                }
              }
            }
            if (jo.phase === 'place_disco') {
              ctx.font = '16px Nunito';
              ctx.fillStyle = 'rgba(255,255,255,0.95)';
              ctx.fillText('The octopus brings the disco ball!', VIEW_WIDTH/2, 55);
              ctx.font = '32px sans-serif';
              ctx.fillText(EMOJI.heart || '❤️', jo.x, drawY - 55);
            }
            ctx.restore();
          }
          if (jellyfishVictoryDisco && !jellyfishVictoryDisco.collected) {
            if (player.x + player.width > jellyfishVictoryDisco.x && player.x < jellyfishVictoryDisco.x + jellyfishVictoryDisco.w &&
                player.y + player.height > jellyfishVictoryDisco.y && player.y < jellyfishVictoryDisco.y + jellyfishVictoryDisco.h) {
              jellyfishVictoryDisco.collected = true;
              playSound('coin');
              addParticles(jellyfishVictoryDisco.x + jellyfishVictoryDisco.w/2, jellyfishVictoryDisco.y + jellyfishVictoryDisco.h/2, 8, '#ffd700');
            }
            ctx.save();
            ctx.font = '48px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.disco, jellyfishVictoryDisco.x + jellyfishVictoryDisco.w/2, jellyfishVictoryDisco.y + jellyfishVictoryDisco.h/2);
            ctx.restore();
          }
          for (const m of jellyfishMinions) {
            if (!m.alive) continue;
            ctx.save();
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.jellyfish || '🪼', m.x + m.w/2, m.y + m.h/2);
            ctx.restore();
          }
          for (const db of jellyfishDiscoBalls) {
            if (db.collected) continue;
            ctx.save();
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.disco, db.x + db.w/2, db.y + db.h/2);
            ctx.restore();
          }
          for (const b of jellyfishBossBubbles) {
            if (b.collected) continue;
            ctx.save();
            ctx.globalAlpha = 0.9 + Math.sin(Date.now() * 0.008) * 0.1;
            ctx.font = '28px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const emoji = POWER_EMOJI[b.powerType] || '🫧';
            ctx.fillText(emoji, b.x + b.w/2, b.y + b.h/2);
            ctx.restore();
          }
          ctx.fillStyle = '#84ff00';
          ctx.font = '16px Nunito';
          ctx.textAlign = 'center';
          ctx.fillText('Disco: ' + bossDiscoCollected + ' / 50', VIEW_WIDTH/2, 28);
          if (jellyfishBossPhase === 'jellyfish_fall') {
            ctx.font = '14px Nunito';
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillText('The jellyfish falls to the floor!', VIEW_WIDTH/2, 55);
          } else if (jellyfishBossPhase === 'stomp') {
            ctx.font = '14px Nunito';
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillText('The disco ball crushes the jellyfish!', VIEW_WIDTH/2, 55);
          } else if (jellyfishOctopus && jellyfishOctopus.phase === 'swim_in') {
            ctx.font = '14px Nunito';
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillText('The octopus arrives...', VIEW_WIDTH/2, 55);
          } else if (jellyfishOctopus && jellyfishOctopus.phase === 'descend') {
            ctx.font = '14px Nunito';
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillText('The octopus descends to the jellyfish...', VIEW_WIDTH/2, 55);
          }
          if (jellyfishBossPhase === 'fight') {
            ctx.font = '12px Nunito';
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.fillText(player.powerType ? ('Power: ' + (POWER_EMOJI[player.powerType] || '') + ' [X/Z]') : 'Collect bubbles for power!', VIEW_WIDTH/2, 48);
          }
          for (const pp of powerProjectiles) pp.draw();
          player.draw();
          updateHUD();
          return;
        }

        if (gameState === 'bossVictory') {
          bossVictoryTimer--;
          if (bossVictoryTimer <= 0) {
            gameState = 'gameWin';
            if (typeof playVictoryMusic === 'function') playVictoryMusic();
            playSound('levelComplete');
            stopDiscoMusic();
          }
          ctx.fillStyle = '#1a0a2e';
          ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
          const grad = ctx.createRadialGradient(400, 240, 0, 400, 240, 400);
          grad.addColorStop(0, 'rgba(255,215,0,0.3)');
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
          const bigDiscoX = 400, bigDiscoY = 120;
          ctx.save();
          ctx.shadowColor = '#ffd700';
          ctx.shadowBlur = 30;
          const pulse = 1 + Math.sin(Date.now() * 0.008) * 0.08;
          ctx.font = (90 * pulse) + 'px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(EMOJI.disco, bigDiscoX, bigDiscoY);
          for (let i = 0; i < 12; i++) {
            const a = (Date.now() * 0.002 + i * 0.52) % (Math.PI * 2);
            const colors = ['#ff6b6b','#4ecdc4','#ffe66d','#95e1d3','#f38181','#aa96da'];
            ctx.strokeStyle = colors[i % colors.length];
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(bigDiscoX, bigDiscoY);
            ctx.lineTo(bigDiscoX + Math.cos(a) * 180, bigDiscoY + Math.sin(a) * 120);
            ctx.stroke();
          }
          ctx.restore();
          if (princessSnail) {
            princessSnail.dancePhase = (princessSnail.dancePhase || 0) + 0.05;
            const bounce = Math.sin(princessSnail.dancePhase) * 10;
            ctx.save();
            ctx.font = '64px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.sister, princessSnail.x - 60, 320 + bounce);
            ctx.fillText(EMOJI.player, princessSnail.x + 60, 320 + bounce);
            ctx.restore();
          }
          ctx.fillStyle = '#ffd700';
          ctx.font = 'bold 28px Fredoka One';
          ctx.textAlign = 'center';
          ctx.fillText('YOU WIN!', VIEW_WIDTH / 2, 80);
          ctx.font = '18px Nunito';
          ctx.fillStyle = '#fff';
          const secs = Math.ceil(bossVictoryTimer / 60);
          ctx.fillText('Dancing with the princess... ' + Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0'), VIEW_WIDTH / 2, 420);
          updateHUD();
          return;
        }

        if (gameState === 'gameWin') {
          if (typeof gameWinLeaderboardShown === 'undefined' || !gameWinLeaderboardShown) {
            gameWinLeaderboardShown = true;
            if (typeof showLeaderboard === 'function') showLeaderboard(score, true);
          }
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#0a0a1a';
          ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
          const grad = ctx.createRadialGradient(400, 240, 0, 400, 240, 500);
          grad.addColorStop(0, 'rgba(255,215,0,0.4)');
          grad.addColorStop(0.5, 'rgba(255,107,157,0.2)');
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
          ctx.fillStyle = '#ffd700';
          ctx.font = 'bold 48px Fredoka One';
          ctx.textAlign = 'center';
          ctx.fillText('🐌 VICTORY! 🐌', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 - 60);
          ctx.fillStyle = '#fff';
          ctx.font = '24px Nunito';
          ctx.fillText('The Disco Snail saved the princess!', VIEW_WIDTH / 2, VIEW_HEIGHT / 2);
          ctx.fillText('Score: ' + score, VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 40);
          ctx.fillStyle = '#ffd700';
          ctx.font = '20px Nunito';
          ctx.fillText('Press SPACE or R to Play Again', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 100);
          if (keys[' '] || keys['r'] || keys['R']) {
            if (typeof hideLeaderboard === 'function') hideLeaderboard();
            gameState = 'playing';
            init();
            initClouds();
            if (getUrlParam('BOSS') === 'GO') enterBossRoom();
          }
          return;
        }

        if (gameState === 'playing') {
          if (shieldBonusTimer > 0) { invincibleTimer = Math.max(invincibleTimer, 2); shieldBonusTimer--; }
          if (timeShieldTimer > 0) { enemyTimeSlow = 0.42; timeShieldTimer--; } else { enemyTimeSlow = 1; }
          if (!(typeof transitionManager !== 'undefined' && transitionManager && transitionManager.state === 'transition')) globalGameSpeed = 1;
          if (doubleCoinsTimer > 0) doubleCoinsTimer--;
          updateHUD();
          if (levelStartTimer > 0) {
            levelStartTimer--;
            if (levelStartTimer === 0) initClouds();
          }

          for (const c of clouds) {
            c.x += c.speed;
            if (c.x > cameraX + VIEW_WIDTH + 100) c.x = cameraX - 100;
          }

          for (const fc of fireColumns) {
            fc.x += fc.vx;
            fc.y += fc.vy;
            fc.phase = (fc.phase || 0) + 0.1;
            fc.life--;
          }
          fireColumns = fireColumns.filter(fc => fc.life > 0 && fc.x > cameraX - 100);

          cleanupTimer = (cleanupTimer || 0) + 1;
          if (cleanupTimer >= 120) {
            cleanupTimer = 0;
            if (typeof removeDeadEnemiesFromChunks === 'function') removeDeadEnemiesFromChunks();
            const farChunk = Math.floor((cameraX - 800) / (CHUNK_WIDTH * TILE_SIZE));
            if (sewerDepth === 0 && !inSpaceRealm && farChunk > 0) {
              for (let k in chunks) { if (parseInt(k, 10) < farChunk) delete chunks[k]; }
            } else if (sewerDepth > 0) {
              for (let k in sewerChunks) {
                const [d, c] = k.split('_').map(Number);
                if (d === sewerDepth && c < Math.floor((cameraX - 600) / (CHUNK_WIDTH * TILE_SIZE))) delete sewerChunks[k];
              }
            }
          }
          if (inWaterRealm) {
            const currentChunk = Math.floor(cameraX / (CHUNK_WIDTH * TILE_SIZE));
            const maxChunk = Math.floor(WATER_WIDTH / (CHUNK_WIDTH * TILE_SIZE)) - 1;
            const ahead = 2;
            let generated = 0;
            for (let i = Math.max(-1, currentChunk - 1); i <= Math.min(maxChunk, currentChunk + ahead) && generated < 2; i++) {
              if (!waterChunks['w_' + i]) { generateWaterChunk(i); generated++; }
            }
          } else if (sewerDepth === 0 && !inSpaceRealm) {
            const currentChunk = Math.floor(cameraX / (CHUNK_WIDTH * TILE_SIZE));
            const maxChunk = Math.floor((LEVEL_LENGTH * CHUNK_WIDTH * TILE_SIZE) / (CHUNK_WIDTH * TILE_SIZE)) - 1;
            const ahead = 2;
            let generated = 0;
            for (let i = Math.max(-1, currentChunk - 1); i <= Math.min(maxChunk, currentChunk + ahead) && generated < 2; i++) {
              if (!chunks[i]) { generateChunk(i); if (typeof addTreesForChunk === 'function') addTreesForChunk(i); generated++; }
            }
            for (const gw of celestialGateways) gw.update();
          } else if (inSpaceRealm) {
            const currentChunk = Math.floor(cameraX / (CHUNK_WIDTH * TILE_SIZE));
            const ahead = 2;
            let generated = 0;
            for (let i = Math.max(-1, currentChunk - 1); i <= currentChunk + ahead && generated < 2; i++) {
              if (!chunks[i]) { generateSpaceChunk(i); generated++; }
            }
          } else {
            const sewerChunkIdx = Math.floor(cameraX / (CHUNK_WIDTH * TILE_SIZE));
            const ahead = 2;
            let generated = 0;
            for (let i = Math.max(0, sewerChunkIdx - 1); i <= Math.min(SEWER_LENGTH - 1, sewerChunkIdx + ahead) && generated < 2; i++) {
              const key = sewerDepth + '_' + i;
              if (!sewerChunks[key]) { generateSewerChunk(sewerDepth, i); generated++; }
            }
          }

          if (pipeEnterCooldown > 0) pipeEnterCooldown--;
          if (pipeEnterCooldown === 0 && (player.onGround || inWaterRealm)) {
            if (inWaterRealm && waterStage < 5 && player.x + player.width >= WATER_WIDTH - 150 && player.x <= WATER_WIDTH - 50) {
              waterStage++;
              playSound('flag');
              playSound('levelComplete');
              saveGameState();
              pipeEnterCooldown = 30;
              waterChunks = {};
              waterPits = [];
              waterCoral = [];
              sludgePits = [];
              waterBossPortalX = 0;
              cameraX = 0;
              targetCameraX = 0;
              player.x = 200;
              player.y = VIEW_HEIGHT - 150;
              player.vx = 0;
              player.vy = 0;
              player.oxygen = MAX_OXYGEN;
              for (let i = -1; i <= 4; i++) generateWaterChunk(i);
            } else if (inWaterRealm && waterStage === 5 && waterBossPortalX > 0 && player.x + player.width >= waterBossPortalX - 20 && player.x <= waterBossPortalX + 120 &&
                (keys['ArrowUp'] || keys['w'])) {
              saveGameState();
              clearMemoryForTransition();
              pipeEnterCooldown = 30;
              showStoryScreen(['The depths hold a secret...', 'The Jellyfish Queen guards the final disco!'], enterJellyfishBoss);
            } else if (!inSpaceRealm && sewerDepth === 0 && !inWaterRealm) {
              for (const gw of celestialGateways) {
                const dist = Math.abs((player.x + player.width/2) - (gw.x + gw.width/2));
                if (dist < 100) {
                  planetHumTimer = (planetHumTimer || 0) + 1;
                  if (planetHumTimer === 1 || planetHumTimer % 180 === 0) playSound('planet_hum', 0.15);
                } else planetHumTimer = 0;
                const onPlanet = player.x + player.width > gw.x + 8 && player.x < gw.x + gw.width - 8 &&
                  player.y + player.height >= gw.y + gw.height - 25;
                if (onPlanet) {
                  saveGameState();
                  clearMemoryForTransition();
                  pipeEnterCooldown = 30;
                  savedOverworldX = player.x;
                  transitionManager.start(true);
                  playSound('planet_hum', 0.15);
                  break;
                }
              }
            }
            if (inSpaceRealm) {
              for (const earth of earthReturnObjects) {
                const onEarth = player.x + player.width > earth.x + 10 && player.x < earth.x + earth.width - 10 &&
                  player.y + player.height >= earth.y + earth.height - 25;
                if (onEarth && (keys['ArrowDown'] || keys['s'])) {
                  saveGameState();
                  clearMemoryForTransition();
                  pipeEnterCooldown = 30;
                  transitionManager.start(false);
                  playSound('planet_hum', 0.15);
                  break;
                }
              }
            }
            if (inSpaceRealm && spaceStage === 3 && spaceBossPortalX > 0 && player.x + player.width >= spaceBossPortalX - 20 && player.x <= spaceBossPortalX + 120 &&
                (keys['ArrowUp'] || keys['w'])) {
              saveGameState();
              clearMemoryForTransition();
              pipeEnterCooldown = 30;
              showStoryScreen(['The Galactic Mosquito is destroying the universe\'s melody.', 'Save the princess!'], enterSpaceBossRoom);
            } else if (sewerDepth === 5 && bossDoorX > 0 && player.x + player.width >= bossDoorX - 20 && player.x <= bossDoorX + 80 &&
                (keys['ArrowUp'] || keys['w'])) {
              saveGameState();
              clearMemoryForTransition();
              pipeEnterCooldown = 30;
              showStoryScreen(['Deep underground...', 'The Dark Cockroach hoards the city\'s disco balls.', 'Time to teach him some groove!'], enterBossRoom);
            } else if (!transitionManager || transitionManager.state !== 'transition') {
              const currentPipes = getCurrentPipes();
              for (const pipe of currentPipes) {
                const onPipe = player.x + player.width > pipe.x + 10 && player.x < pipe.x + pipe.width - 10 &&
                  player.y + player.height >= pipe.y && player.y + player.height <= pipe.y + 25;
                if (onPipe) {
                  if (pipe.type === 'cactus_boss' && (keys['ArrowUp'] || keys['w'])) {
                    saveGameState();
                    clearMemoryForTransition();
                    pipeEnterCooldown = 30;
                    showStoryScreen(['The desert is dry.', 'Don Cactus has stolen the rhythm.', 'Watch out for his roots!'], enterCactusBossRoom);
                    break;
                  }
                  if (pipe.type === 'entrance' && (keys['ArrowDown'] || keys['s'])) {
                    saveGameState();
                    clearMemoryForTransition();
                    playSound('pipe');
                    enterSewer(pipe.targetDepth);
                    break;
                  }
                  if (pipe.type === 'exit' && (keys['ArrowUp'] || keys['w'])) {
                    playSound('pipe');
                    exitSewer();
                    break;
                  }
                }
              }
            }
          }

          if (sewerDepth === 0 && !inWaterRealm && currentLevel === 1 && octopusTrapPit) {
            if (!octopusTransition) {
              if (!octopusPoolIdle) octopusPoolIdle = { timer: 0, phase: 'underwater', popY: 0 };
              const op = octopusPoolIdle;
              op.timer++;
              if (op.phase === 'underwater') {
                if (op.timer >= 180) { op.phase = 'rising'; op.timer = 0; }
              } else if (op.phase === 'rising') {
                op.popY = Math.max(-40, -40 * (op.timer / 25));
                if (op.timer >= 25) { op.phase = 'up'; op.timer = 0; op.popY = -40; }
              } else if (op.phase === 'up') {
                op.popY = -40;
                const ox = octopusTrapPit.x + octopusTrapPit.w/2 - 30;
                const oy = octopusTrapPit.y + op.popY;
                const ow = 80; const oh = 90;
                const overlap = player.x + player.width > ox - 35 && player.x < ox + ow + 35 && player.y + player.height > oy - 25 && player.y < oy + oh + 35;
                if (overlap) {
                  octopusTransition = { phase: 'capture', timer: 0, x: ox, y: oy, w: ow, h: oh };
                  bossCutsceneMode = true;
                  playSound('octopus_slime');
                  setTimeout(() => { if (typeof playSound === 'function') playSound('octopus_giant'); }, 200);
                  octopusPoolIdle = null;
                } else if (op.timer >= 90) {
                  op.phase = 'down';
                  op.timer = 0;
                }
              } else if (op.phase === 'down') {
                op.popY = -40 + 40 * (op.timer / 25);
                if (op.timer >= 25) { op.phase = 'underwater'; op.timer = 0; }
              }
            } else {
              const ot = octopusTransition;
              ot.timer++;
              if (ot.phase === 'spawn') {
                ot.y -= 3;
                if (ot.y <= octopusTrapPit.y + 100) ot.phase = 'reach';
              } else if (ot.phase === 'reach') {
                const dx = (player.x + player.width/2) - (ot.x + ot.w/2);
                ot.x += Math.sign(dx) * 2;
                ot.x = Math.max(octopusTrapPit.x, Math.min(octopusTrapPit.x + octopusTrapPit.w - ot.w, ot.x));
                const overlap = player.x + player.width > ot.x + 20 && player.x < ot.x + ot.w - 20 && player.y + player.height > ot.y && player.y < ot.y + ot.h;
                if (overlap) {
                  ot.phase = 'capture';
                  bossCutsceneMode = true;
                  playSound('octopus_slime');
                  setTimeout(() => { if (typeof playSound === 'function') playSound('octopus_giant'); }, 200);
                }
              } else if (ot.phase === 'capture') {
                player.x = ot.x + ot.w/2 - player.width/2;
                player.y = ot.y + ot.h - player.height - 10;
                player.vx = 0; player.vy = 0;
                ot.phase = 'drag';
              } else if (ot.phase === 'drag') {
                ot.y += 4;
                player.y = ot.y + ot.h - player.height - 10;
                /* Emit bubbles from snail during descent */
                if (typeof addParticles === 'function') addParticles(player.x + player.width/2, player.y + player.height/2, 2, '#a5f3fc', EMOJI.bubbles || '🫧');
                const OCEAN_FLOOR_Y = VIEW_HEIGHT - 60;
                if (ot.y >= OCEAN_FLOOR_Y) {
                  ot.y = OCEAN_FLOOR_Y;
                  ot.phase = 'love';
                  ot.timer = 0;
                  ot.loveHearts = [];
                }
              } else if (ot.phase === 'love') {
                ot.timer++;
                if (ot.timer === 30) playSound('coin');
                /* Emit 3 pulsing hearts */
                if (!ot.loveHearts || ot.loveHearts.length < 3) {
                  ot.loveHearts = ot.loveHearts || [];
                  for (let h = 0; h < 3; h++) {
                    if (!ot.loveHearts[h]) ot.loveHearts[h] = { phase: h * 0.33, y: ot.y - 30 };
                  }
                }
                for (let h = 0; h < 3; h++) {
                  ot.loveHearts[h].phase += 0.04;
                  ot.loveHearts[h].y = ot.y - 40 - Math.sin(ot.loveHearts[h].phase) * 15;
                }
                if (ot.timer >= 90) {
                  ot.phase = 'release';
                  ot.timer = 0;
                  ot.inkParticles = [];
                }
              } else if (ot.phase === 'release') {
                ot.timer++;
                player.y = ot.y + ot.h - player.height - 10;
                /* Ink cloud effect - dark particles */
                if (ot.timer <= 45 && typeof addParticles === 'function') {
                  addParticles(ot.x + ot.w/2, ot.y + ot.h/2, 3, '#0a0a1a');
                }
                /* power2.in easing: t^2 - zoom away */
                const t = Math.min(1, ot.timer / 90);
                const easeT = t * t;
                ot.zoomScale = 1 + easeT * 3;
                ot.zoomX = ot.x - easeT * 400;
                ot.zoomY = ot.y - easeT * 200;
                if (ot.timer >= 90) {
                  bossCutsceneMode = false;
                  inWaterRealm = true;
                  waterStage = 1;
                  player.oxygen = MAX_OXYGEN;
                  octopusTransition = null;
                  octopusTrapPit = null;
                  enterWaterRealm();
                }
              }
            }
          }

          if (spaceshipAnimTimer > 0) {
            spaceshipAnimTimer++;
            if (spaceshipAnimTimer >= 120) {
              spaceStage++;
              cameraX = 0;
              targetCameraX = 0;
          player.x = 150;
          player.y = GROUND_Y - 160;
              player.vx = 0;
              player.vy = 0;
              player.onGround = false;
              chunks = {};
              spaceshipX = 0;
              spaceBossPortalX = 0;
              spaceshipAnimTimer = 0;
              const levelW = LEVEL_LENGTH * CHUNK_WIDTH * TILE_SIZE;
              for (let i = -1; i <= Math.ceil(levelW / (CHUNK_WIDTH * TILE_SIZE)) + 2; i++) generateSpaceChunk(i);
            }
          } else if (!octopusTransition && !player.drowning) {
            player.update();
            sister.update();
          }

          if (inWaterRealm && !player.drowning) {
            if (typeof updateUnderwaterAmbience === 'function') updateUnderwaterAmbience();
            if (player.oxygen === undefined) player.oxygen = MAX_OXYGEN;
            player.oxygen -= 0.0625;
            for (const c of waterCoral) {
              const pad = 72;
              const overlapX = player.x + player.width > c.x - pad && player.x < c.x + c.w + pad;
              const overlapY = player.y + player.height > c.y - pad && player.y < c.y + c.h + pad;
              if (overlapX && overlapY) {
                player.oxygen = Math.min(MAX_OXYGEN, (player.oxygen || 0) + 3.5);
                if (Math.floor(Date.now()/80) % 3 === 0) addParticles(c.x + c.w/2, c.y + c.h * 0.3, 3, '#a5f3fc', EMOJI.bubbles || '🫧');
              }
            }
            if (player.oxygen < MAX_OXYGEN * 0.25 && !player.oxygenWarnPlayed) {
              playSound('drowning');
              player.oxygenWarnPlayed = true;
            }
            if (player.oxygen > MAX_OXYGEN * 0.35) player.oxygenWarnPlayed = false;
            if (player.oxygen <= 0) {
              player.drowning = true;
              drowningTimer = 0;
              playSound('drowning');
            }
            for (const pit of sludgePits) {
              pit.timer = (pit.timer || 0) + 1;
              pit.anticipationTimer = pit.anticipationTimer || 0;
              if (pit.lobsterVy === undefined || pit.lobsterVy === 0) {
                if (pit.timer >= 90) {
                  pit.anticipationTimer++;
                  if (pit.anticipationTimer >= 30) {
                    pit.timer = 0;
                    pit.anticipationTimer = 0;
                    pit.lobsterY = pit.y;
                    pit.lobsterVy = -14;
                    if (typeof playSound === 'function') playSound('stomp');
                  }
                } else {
                  pit.anticipationTimer = 0;
                }
              }
              if (pit.lobsterVy !== undefined && pit.lobsterVy !== 0) {
                pit.lobsterVy += 0.4;
                pit.lobsterY += pit.lobsterVy;
                if (pit.lobsterY >= pit.y) {
                  pit.lobsterY = pit.y;
                  pit.lobsterVy = 0;
                }
                const lx = pit.x + pit.w/2 - 16;
                const ly = pit.lobsterY - 24;
                if (invincibleTimer <= 0 && player.x + player.width > lx && player.x < lx + 32 && player.y + player.height > ly && player.y < ly + 32) {
                  player.die();
                }
              }
            }
          }
          if (player.drowning) {
            drowningTimer++;
            player.y -= 1.5;
            player.drowningAlpha = Math.max(0, 1 - drowningTimer / 90);
            if (drowningTimer >= 90) {
              player.drowning = false;
              drowningTimer = 0;
              player.drowningAlpha = 1;
              player.die();
              if (lives > 0) {
                player.oxygen = MAX_OXYGEN;
                enterWaterRealm();
              }
            }
          }

          const allPlatforms = getPlatforms();
          const platforms = allPlatforms.filter(p => p.type !== 'ground').sort((a, b) => b.y - a.y);
          const groundPlatforms = allPlatforms.filter(p => p.type === 'ground');
          let landed = false;

          for (const p of platforms) {
            const overlapX = player.x + player.width > p.x + 4 && player.x < p.x + p.width - 4;
            const hittable = (p.type === 'question' || p.type === 'brick');
            if (player.vy < 0 && overlapX && hittable) {
              const prevTop = player.y - player.vy;
              const currTop = player.y;
              if (prevTop >= p.y + p.height - 4 && currTop <= p.y + p.height + 8) {
                player.y = p.y + p.height;
                player.vy = 4;
                p.bounceOffset = 4;
                if (p.type === 'brick') {
                  addParticles(p.x + p.width/2, p.y + p.height/2, 8, p.spaceStyle ? '#94a3b8' : '#78716c');
                  playSound('brick');
                  p.broken = true;
                  removePlatformFromChunks(p);
                  continue;
                }
                if (p.type === 'question' && !p.hit) {
                  p.hit = true;
                  let reward = p.content;
                  if (reward === 'random') {
                    const r = Math.random();
                    if (r < 0.005) reward = 'disco';           /* 0.5% - ממש נדיר */
                    else if (r < 0.012) reward = 'wings';      /* 0.7% - כנפיים */
                    else if (r < 0.022) reward = 'shield';    /* 1% - מגן */
                    else if (r < 0.032) reward = 'timeShield'; /* 1% - האטת זמן */
                    else if (r < 0.042) reward = 'superMagnet'; /* 1% - מגנט סופר */
                    else if (r < 0.052) reward = 'doubleCoins'; /* 1% - מטבעות כפולים */
                    else if (r < 0.062) reward = 'extraLife';   /* 1% - חיים נוספים */
                    else if (r < 0.082) reward = '1up';        /* 2% */
                    else if (r < 0.122) reward = 'super';     /* 5% */
                    else if (r < 0.292) reward = getLevelPower(); /* 17% כוח */
                    else reward = 'coin';                     /* ~70.8% מטבעות */
                  }
                  const BONUS_ITEM_TYPES = ['disco','wings','shield','timeShield','superMagnet','doubleCoins','extraLife'];
                  if (BONUS_ITEM_TYPES.includes(reward)) {
                    const bonusItem = new BonusItem(p.x + (p.width - 28) / 2, p.y - 32, reward);
                    const cIdx = Math.floor(p.x / (CHUNK_WIDTH * TILE_SIZE));
                    if (inWaterRealm && typeof waterChunks !== 'undefined') {
                      const key = 'w_' + cIdx;
                      if (!waterChunks[key]) waterChunks[key] = [];
                      waterChunks[key].push(bonusItem);
                    } else {
                      if (!chunks[cIdx]) chunks[cIdx] = [];
                      chunks[cIdx].push(bonusItem);
                    }
                  } else if (reward === 'super' || reward === '1up' || POWER_TYPES.includes(reward)) {
                    playSound('powerup_spawn');
                    powerUps.push(new PowerUp(p.x + (p.width - 28) / 2, p.y - 28, reward, player.facingRight));
                  } else {
                    const coinCount = 1 + rand(0, 2);
                    const mult = doubleCoinsTimer > 0 ? 2 : 1;
                    for (let i = 0; i < coinCount; i++) {
                      coins += mult;
                      score += 50 * mult;
                      playSound('coin');
                      addScorePopup(p.x + p.width/2, p.y, mult > 1 ? '+100' : '+50');
                    }
                  }
                }
              }
            }
          }

          for (const p of platforms) {
            if (p.broken) continue;
            const overlapX = player.x + player.width > p.x + 4 && player.x < p.x + p.width - 4;
            if (player.vy > 0 && overlapX) {
              const prevBottom = player.y + player.height - player.vy;
              const currBottom = player.y + player.height;
              if (prevBottom <= p.y + 12 && currBottom >= p.y - 6) {
                if (!player.onGround && player.vy > 2) addLandingDust(player.x + player.width/2, player.y + player.height);
                player.y = p.y - player.height;
                player.vy = 0;
                player.onGround = true;
                if (player.jumpBuffer !== undefined) player.jumpBuffer = 0;
                landed = true;
                if (p.bounceOffset > 0) p.bounceOffset = Math.max(0, p.bounceOffset - 0.5);
                break;
              }
            }
          }
          if (!landed) {
            for (const p of groundPlatforms) {
              const overlapX = player.x + player.width > p.x && player.x < p.x + p.width;
              if (player.vy > 0 && overlapX) {
                const prevBottom = player.y + player.height - player.vy;
                const currBottom = player.y + player.height;
                if (prevBottom <= p.y + 12 && currBottom >= p.y - 6) {
                  if (!player.onGround && player.vy > 2) addLandingDust(player.x + player.width/2, player.y + player.height);
                  player.y = p.y - player.height;
                  player.vy = 0;
                  player.onGround = true;
                  if (player.jumpBuffer !== undefined) player.jumpBuffer = 0;
                  landed = true;
                  break;
                }
              }
            }
          }
          if (!landed) {
            for (const pipe of getCurrentPipes()) {
              const overlapX = player.x + player.width > pipe.x + 10 && player.x < pipe.x + pipe.width - 10;
              if (player.vy > 0 && overlapX) {
                const prevBottom = player.y + player.height - player.vy;
                const currBottom = player.y + player.height;
                if (prevBottom <= pipe.y + 12 && currBottom >= pipe.y - 6) {
                  if (!player.onGround && player.vy > 2) addLandingDust(player.x + player.width/2, player.y + player.height);
                  player.y = pipe.y - player.height;
                  player.vy = 0;
                  player.onGround = true;
                  if (player.jumpBuffer !== undefined) player.jumpBuffer = 0;
                  landed = true;
                  break;
                }
              }
            }
          }

          for (let i = platforms.length - 1; i >= 0; i--) {
            if (platforms[i].bounceOffset > 0) {
              platforms[i].bounceOffset = Math.max(0, platforms[i].bounceOffset - 0.3);
            }
          }

          const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };
          for (const m of powerUps) {
            if (player.hasMagnet && !m.collected) {
              const dx = (player.x + player.width/2) - (m.x + m.width/2);
              const dy = (player.y + player.height/2) - (m.y + m.height/2);
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < 220 && dist > 0) {
                m.x += dx * 0.12 / dist * 5;
                m.y += dy * 0.12 / dist * 5;
              }
            }
            m.update(allPlatforms);
            if (checkCollision(playerRect, m)) {
              m.collected = true;
              if (m.type === 'super') {
                player.big = true;
                const oldHeight = player.height;
                player.height = 56;
                player.y -= (56 - oldHeight);
                score += 100;
                playSound('powerup');
                addScorePopup(m.x + 14, m.y, '+100');
                addParticles(m.x + 14, m.y, 8, '#ff6b9d');
              } else if (m.type === '1up') {
                lives++;
                score += 200;
                playSound('powerup');
                addScorePopup(m.x + 14, m.y, '+1 UP!');
                addParticles(m.x + 14, m.y, 8, '#4ade80');
              } else if (POWER_TYPES.includes(m.type)) {
                const wasSame = player.powerType === m.type;
                const newLevel = wasSame ? Math.min(5, player.powerLevel + 1) : 1;
                player.powerType = m.type;
                player.powerLevel = newLevel;
                score += 100 + newLevel * 25;
                playSound(POWER_SOUND[m.type] || 'powerup');
                addScorePopup(m.x + 14, m.y, (m.type.toUpperCase()) + ' Lv' + newLevel + '!');
                addParticles(m.x + 14, m.y, 6 + newLevel * 2, POWER_COLOR[m.type] || '#fff');
              }
              updateHUD();
            }
          }
          powerUps = powerUps.filter(m => !m.collected && m.y < VIEW_HEIGHT + 50 && (m.lifeTimer === undefined || m.lifeTimer > 0));

          if (powerCooldown > 0) powerCooldown--;
          if ((keys['x'] || keys['X'] || keys['KeyX']) && player.powerType && powerCooldown === 0) {
            const h = player.big ? 56 : 40;
            const py = player.y + h/2 - 12;
            const px = player.x + (player.facingRight ? player.width : 0);
            const right = player.facingRight;
            const lv = player.powerLevel;
            const maxProj = Math.min(8, 2 + lv);
            if (powerProjectiles.length < maxProj) {
              const angles = (player.powerType === 'fire' && lv >= 5) ? [-90,-45,0,45,90] :
                (player.powerType === 'fire' && lv >= 4) ? [-30,0,30] :
                (player.powerType === 'fire' && lv >= 3) ? [0] :
                (player.powerType === 'earth' && lv >= 4) ? [-15,15] :
                (player.powerType === 'earth' && lv >= 3) ? [0] :
                (player.powerType === 'water' && lv >= 4) ? [-25,0,25] :
                (player.powerType === 'wind' && lv >= 5) ? [-60,-30,0,30,60] :
                (player.powerType === 'wind' && lv >= 4) ? [-30,0,30] :
                (player.powerType === 'ice' && lv >= 5) ? [-45,-22,0,22,45] :
                (player.powerType === 'ice' && lv >= 4) ? [-20,0,20] :
                (player.powerType === 'lightning' && lv >= 5) ? [-30,-15,0,15,30] :
                (player.powerType === 'lightning' && lv >= 4) ? [-15,0,15] :
                (player.powerType === 'nature' && lv >= 5) ? [-40,-20,0,20,40] :
                (player.powerType === 'nature' && lv >= 4) ? [-25,0,25] :
                (player.powerType === 'stone' && lv >= 5) ? [-25,-10,10,25] :
                (player.powerType === 'stone' && lv >= 4) ? [-10,10] :
                (player.powerType === 'shadow' && lv >= 5) ? [-35,-15,0,15,35] :
                (player.powerType === 'shadow' && lv >= 4) ? [-20,0,20] :
                (player.powerType === 'light' && lv >= 5) ? [-50,-25,0,25,50] :
                (player.powerType === 'light' && lv >= 4) ? [-30,0,30] :
                (player.powerType === 'time' && lv >= 4) ? [-20,0,20] :
                (player.powerType === 'time' && lv >= 3) ? [0] :
                (player.powerType === 'vortex' && lv >= 4) ? [-25,-10,10,25] :
                (player.powerType === 'toxic' && lv >= 4) ? [-30,0,30] :
                (player.powerType === 'phantom' && lv >= 4) ? [-25,0,25] :
                (player.powerType === 'sound' && lv >= 4) ? [-35,-15,0,15,35] :
                (player.powerType === 'prism' && lv >= 4) ? [-15,15] :
                (player.powerType === 'plasma' && lv >= 4) ? [-30,0,30] :
                (player.powerType === 'meteor' && lv >= 4) ? [-20,-10,0,10,20] :
                (player.powerType === 'void' && lv >= 4) ? [-25,0,25] :
                (player.powerType === 'beam' && lv >= 4) ? [-20,0,20] : [0];
              for (const ang of angles) {
                if (powerProjectiles.length < maxProj) {
                  powerProjectiles.push(new PowerProjectile(px, py, player.powerType, lv, right, ang));
                }
              }
              powerCooldown = Math.max(5, 16 - lv * 2);
              playSound(POWER_SOUND[player.powerType] || 'fire');
            }
          }
          for (const pp of powerProjectiles) pp.update(allPlatforms);
          for (const e of getEnemies()) {
            if (!e.alive) continue;
            for (const pp of powerProjectiles) {
              if (pp.active && checkCollision(pp, e)) {
                if (pp.type === 'toxic' && player.powerLevel >= 4) {
                  const sickDuration = player.powerLevel >= 5 ? 30 : 30 + (5 - player.powerLevel) * 20;
                  e.sickTimer = Math.max(e.sickTimer || 0, sickDuration);
                  e.sickMaxTimer = sickDuration;
                  pp.active = false;
                } else {
                  e.deathTimer = 15;
                  e.alive = false;
                  pp.active = false;
                  playSound('stomp');
                  score += 100;
                  addParticles(e.x + e.width/2, e.y + e.height/2, 6, POWER_COLOR[pp.type] || '#fff');
                  addScorePopup(e.x + e.width/2, e.y, '+100');
                }
              }
            }
          }
          powerProjectiles = powerProjectiles.filter(pp => pp.active);

          waterOrbitAngle += 0.12;
          if (player.powerType === 'water' && player.powerLevel >= 3) {
            const layers = player.powerLevel >= 5 ? 2 : 1;
            const radii = player.powerLevel >= 5 ? [35, 65] : [45 + player.powerLevel * 5];
            const counts = player.powerLevel >= 5 ? [4, 6] : [3 + player.powerLevel];
            const sizes = player.powerLevel >= 5 ? [24, 20] : [16];
            for (let L = 0; L < layers; L++) {
              const r = radii[L], dropCount = counts[L], off = L * 0.5;
              for (let i = 0; i < dropCount; i++) {
                const a = waterOrbitAngle + off + (i / dropCount) * Math.PI * 2;
                const dx = player.x + player.width/2 + Math.cos(a) * r - sizes[L]/2;
                const dy = player.y + player.height/2 + Math.sin(a) * r - sizes[L]/2;
                const hitSize = sizes[L] + 8;
                for (const e of getEnemies()) {
                  if (!e.alive || e.deathTimer > 0) continue;
                  if (dx + hitSize > e.x && dx < e.x + e.width && dy + hitSize > e.y && dy < e.y + e.height) {
                    e.deathTimer = 15;
                    e.alive = false;
                    playSound('water');
                    score += 100;
                    addParticles(e.x + e.width/2, e.y + e.height/2, 6, POWER_COLOR.water);
                    addScorePopup(e.x + e.width/2, e.y, '+100');
                  }
                }
              }
            }
          }

          if (stoneGiantTimer > 0) {
            if (stoneGiantTimer === 1) stoneGiantCooldown = 300;
            stoneGiantTimer--;
          } else if (stoneGiantCooldown > 0) stoneGiantCooldown--;
          if (player.powerType === 'stone' && player.powerLevel >= 5 && stoneGiantTimer <= 0 && stoneGiantCooldown <= 0) {
            stoneGiantNoHitTimer++;
            if (stoneGiantNoHitTimer >= 3600) {
              stoneGiantTimer = 300;
              stoneGiantNoHitTimer = 0;
              playSound('brick');
            }
          } else stoneGiantNoHitTimer = 0;
          if ((keys['c'] || keys['C'] || keys['KeyC']) && player.powerType === 'stone' && player.powerLevel >= 5 && stoneGiantTimer <= 0 && stoneGiantCooldown <= 0) {
            stoneGiantTimer = 300;
            stoneGiantNoHitTimer = 0;
            playSound('brick');
          }
          if (stoneGiantTimer > 0) {
            const giantPh = Math.floor(VIEW_HEIGHT * 0.75);
            const giantPw = Math.floor(giantPh * 36 / 40);
            const gpx = player.x + player.width/2 - giantPw/2;
            const gpy = player.y + player.height/2 - giantPh/2;
            for (const e of getEnemies()) {
              if (!e.alive || e.deathTimer > 0) continue;
              if (gpx + giantPw > e.x && gpx < e.x + e.width && gpy + giantPh > e.y && gpy < e.y + e.height) {
                e.deathTimer = 15;
                e.alive = false;
                playSound('stomp');
                score += 150;
                addParticles(e.x + e.width/2, e.y + e.height/2, 6, POWER_COLOR.stone);
                addScorePopup(e.x + e.width/2, e.y, '+150');
              }
            }
            for (const p of getPlatforms()) {
              if (p.type === 'ground' || p.broken) continue;
              const overlapX = gpx + giantPw > p.x + 2 && gpx < p.x + p.width - 2;
              const overlapY = gpy + giantPh > p.y && gpy < p.y + p.height;
              if (overlapX && overlapY) {
                addParticles(p.x + p.width/2, p.y + p.height/2, 6, p.spaceStyle ? '#94a3b8' : '#78716c');
                playSound('brick');
                p.broken = true;
                removePlatformFromChunks(p);
              }
            }
          }

          lightningStrikeTimer++;
          const groundY = sewerDepth > 0 ? SEWER_GROUND : GROUND_Y;
          if (player.powerType === 'lightning' && player.powerLevel >= 4 && lightningStrikeTimer > 45 && lightningBolts.length < 2) {
            lightningStrikeTimer = 0;
            const rx = cameraX + 100 + Math.random() * (VIEW_WIDTH - 100);
            lightningBolts.push({ x: rx, y: -20, targetY: groundY - 10, life: 30, spread: false });
            playSound('fire');
          }
          for (let i = lightningBolts.length - 1; i >= 0; i--) {
            const lb = lightningBolts[i];
            lb.y += 20;
            if (lb.y >= lb.targetY && !lb.spread) {
              lb.spread = true;
            }
            if (lb.spread) {
              for (const e of getEnemies()) {
                if (!e.alive) continue;
                if (Math.abs((e.x + e.width/2) - lb.x) < 45 && Math.abs((e.y + e.height) - lb.targetY) < 50) {
                  e.deathTimer = 15;
                  e.alive = false;
                  score += 100;
                  addParticles(e.x + e.width/2, e.y + e.height/2, 4, POWER_COLOR.lightning);
                  addScorePopup(e.x + e.width/2, e.y, '+100');
                }
              }
              if (electricArcs.length < 3) electricArcs.push({ x: lb.x, y: lb.targetY, left: -60, right: 60, life: 35 });
              lightningBolts.splice(i, 1);
            }
          }
          if (electricArcs.length > 4) electricArcs = electricArcs.slice(-4);
          for (let i = electricArcs.length - 1; i >= 0; i--) {
            const ea = electricArcs[i];
            ea.life--;
            if (ea.left > -140) ea.left -= 10;
            if (ea.right < 140) ea.right += 10;
            if (ea.life <= 0) { electricArcs.splice(i, 1); continue; }
            for (const e of getEnemies()) {
              if (!e.alive) continue;
              const ex = e.x + e.width/2;
              if (ex >= ea.x + ea.left && ex <= ea.x + ea.right && Math.abs((e.y + e.height) - ea.y) < 40) {
                e.deathTimer = 15;
                e.alive = false;
                score += 100;
                addParticles(e.x + e.width/2, e.y + e.height/2, 4, POWER_COLOR.lightning);
                addScorePopup(e.x + e.width/2, e.y, '+100');
              }
            }
          }

          fireOrbitAngle += 0.12;
          if (player.powerType === 'fire' && player.powerLevel >= 3) {
            const lv = player.powerLevel;
            const radii = lv >= 5 ? [30, 55] : lv >= 4 ? [40] : [35];
            const layers = lv >= 5 ? 2 : 1;
            const countsPerLayer = lv >= 5 ? [3, 3] : lv >= 4 ? [4] : [3];
            const enemies = getEnemies();
            for (let L = 0; L < layers; L++) {
              const r = radii[L], dropCount = countsPerLayer[L], off = L * 0.7;
              for (let i = 0; i < dropCount; i++) {
                const a = fireOrbitAngle + off + (i / dropCount) * Math.PI * 2;
                const dx = player.x + player.width/2 + Math.cos(a) * r - 12;
                const dy = player.y + player.height/2 + Math.sin(a) * r - 12;
                const hitSize = 26;
                for (const e of enemies) {
                  if (!e.alive || e.deathTimer > 0) continue;
                  if (dx + hitSize > e.x && dx < e.x + e.width && dy + hitSize > e.y && dy < e.y + e.height) {
                    e.deathTimer = 15;
                    e.alive = false;
                    playSound('fire');
                    score += 100;
                    addParticles(e.x + e.width/2, e.y + e.height/2, 4, POWER_COLOR.fire);
                    addScorePopup(e.x + e.width/2, e.y, '+100');
                  }
                }
              }
            }
          }
          if (player.powerType === 'wind' && player.powerLevel >= 4) {
            windPushTimer++;
            if (windPushTimer > 60) {
              windPushTimer = 0;
              const px = player.x + player.width/2;
              const gY = sewerDepth > 0 ? SEWER_GROUND : GROUND_Y;
              for (let i = 0; i < 8 && windParticles.length < 35; i++) {
                windParticles.push({ x: px + (Math.random() - 0.5) * 180, y: gY - 100 - Math.random() * 180, vx: (Math.random() - 0.5) * 7, life: 22 });
              }
              for (const e of getEnemies()) {
                if (!e.alive || e.deathTimer > 0) continue;
                const dx = e.x + e.width/2 - (player.x + player.width/2);
                if (Math.abs(dx) < 150) {
                  const dir = Math.sign(dx);
                  e.x += dir * 25;
                  e.vx = dir * 4;
                  windPushEffects.push({ x: e.x + e.width/2, y: e.y + e.height/2, dir, life: 20 });
                  for (let j = 0; j < 3 && windParticles.length < 35; j++) {
                    windParticles.push({ x: e.x + e.width/2, y: e.y + e.height/2, vx: dir * (5 + Math.random()*3), vy: (Math.random()-0.5)*3, life: 16 });
                  }
                }
              }
            }
            windParticles = windParticles.filter(w => { w.x += w.vx; w.y += (w.vy||0); w.life--; return w.life > 0; });
            windPushEffects = windPushEffects.filter(w => { w.life--; return w.life > 0; });
          } else windParticles = [];
          windPushEffects = windPushEffects.filter(w => { w.life--; return w.life > 0; });
          if (player.powerType === 'ice' && player.powerLevel >= 4) {
            for (const e of getEnemies()) {
              if (!e.alive || e.deathTimer > 0) continue;
              const dx = (e.x + e.width/2) - (player.x + player.width/2);
              const dy = (e.y + e.height/2) - (player.y + player.height/2);
              if (Math.abs(dx) < 120 + player.powerLevel * 20 && Math.abs(dy) < 100) {
                e.freezeTimer = Math.max(e.freezeTimer || 0, 90 + player.powerLevel * 15);
              }
            }
            if (Math.floor(Date.now() / 100) % 2 === 0) {
              for (let i = 0; i < 2 && snowParticles.length < 35; i++) {
                snowParticles.push({
                  x: cameraX + Math.random() * (VIEW_WIDTH + 80) - 40,
                  y: -10,
                  vy: 1.5 + Math.random() * 1.5,
                  life: 120,
                  size: 12 + Math.random() * 10
                });
              }
            }
            snowParticles = snowParticles.filter(s => { s.y += s.vy; s.life--; return s.life > 0 && s.y < VIEW_HEIGHT + 20; });
          } else {
            iceTrail = [];
            snowParticles = snowParticles.filter(s => { s.life--; return s.life > 0; });
          }
          if (player.powerType === 'light' && player.powerLevel >= 5) {
            lightAuraTimer++;
            if (lightAuraTimer > 60) {
              lightAuraTimer = 0;
              const px = player.x + player.width/2, py = player.y + player.height/2;
              lightAuraBursts.push({ x: px, y: py, r: 0, life: 25 });
              for (const e of getEnemies()) {
                if (!e.alive || e.deathTimer > 0) continue;
                const dx = (e.x + e.width/2) - px, dy = (e.y + e.height/2) - py;
                if (Math.sqrt(dx*dx + dy*dy) < 80 && lightKillBeams.length < 6) {
                  lightKillBeams.push({ px, py, ex: e.x + e.width/2, ey: e.y + e.height/2, life: 30 });
                  e.deathTimer = 15;
                  e.alive = false;
                  score += 100;
                  addParticles(e.x + e.width/2, e.y + e.height/2, 4, POWER_COLOR.light);
                  addScorePopup(e.x + e.width/2, e.y, '+100');
                }
              }
            }
            lightAuraBursts = lightAuraBursts.filter(b => { b.r += 5; b.life--; return b.life > 0; });
          } else lightAuraBursts = [];
          lightKillBeams = lightKillBeams.filter(b => { b.life--; return b.life > 0; });
          if (player.powerType === 'earth' && player.powerLevel >= 5 && player.onGround && earthCracks.length < 5) {
            const gY = sewerDepth > 0 ? SEWER_GROUND : GROUND_Y;
            earthCracks.push({ x: player.x + player.width/2 - 40, y: gY, w: 80, life: 20 });
            for (const e of getEnemies()) {
              if (!e.alive || e.deathTimer > 0) continue;
              if (Math.abs((e.x + e.width/2) - (player.x + player.width/2)) < 60 && e.y + e.height > player.y) {
                e.earthStunned = 15;
                e.vx *= 0.3;
                e.vy -= 2;
                if (earthShockwaves.length < 8) earthShockwaves.push({ x: e.x + e.width/2, y: e.y + e.height, r: 0, maxR: 50, life: 25 });
                addParticles(e.x + e.width/2, e.y + e.height, 4, '#78716c');
              }
            }
            earthCracks = earthCracks.filter(c => { c.life--; return c.life > 0; });
            earthShockwaves = earthShockwaves.filter(s => { s.r += 4; s.life--; return s.life > 0; });
          } else {
            earthCracks = earthCracks.filter(c => { c.life--; return c.life > 0; });
            earthShockwaves = earthShockwaves.filter(s => { s.r += 4; s.life--; return s.life > 0; });
          }
          if (player.powerType === 'nature' && player.powerLevel >= 4) {
            for (const e of getEnemies()) {
              if (!e.alive || e.deathTimer > 0) continue;
              const dx = (e.x + e.width/2) - (player.x + player.width/2);
              const dy = (e.y + e.height/2) - (player.y + player.height/2);
              if (Math.abs(dx) < 140 && Math.abs(dy) < 120) e.flowerForm = true;
              if (e.flowerForm) {
                e.vx = 0; e.vy = 0;
                e.flowerShootTimer = (e.flowerShootTimer || 0) + 1;
                if (e.flowerShootTimer > 40) {
                  e.flowerShootTimer = 0;
                  const targets = getEnemies().filter(t => t.alive && t.deathTimer <= 0 && t !== e && !t.flowerForm);
                  if (targets.length > 0) {
                    const t = targets.reduce((a, b) => {
                      const da = Math.hypot(a.x + a.width/2 - (e.x + e.width/2), a.y - e.y);
                      const db = Math.hypot(b.x + b.width/2 - (e.x + e.width/2), b.y - e.y);
                      return da < db ? a : b;
                    });
                    const tx = t.x + t.width/2, ty = t.y + t.height/2;
                    const ex = e.x + e.width/2, ey = e.y + e.height/2;
                    const ang = Math.atan2(ty - ey, tx - ex);
                    if (flowerProjectiles.length < 10) flowerProjectiles.push({ x: ex, y: ey, vx: Math.cos(ang) * 6, vy: Math.sin(ang) * 6, life: 55 });
                  }
                }
              }
            }
            flowerProjectiles = flowerProjectiles.filter(fp => {
              fp.x += fp.vx; fp.y += fp.vy; fp.life--;
              if (fp.life <= 0) return false;
              for (const e of getEnemies()) {
                if (!e.alive || e.flowerForm) continue;
                if (fp.x > e.x && fp.x < e.x + e.width && fp.y > e.y && fp.y < e.y + e.height) {
                  e.deathTimer = 15;
                  e.alive = false;
                  score += 100;
                  addParticles(e.x + e.width/2, e.y + e.height/2, 4, POWER_COLOR.nature);
                  addScorePopup(e.x + e.width/2, e.y, '+100');
                  return false;
                }
              }
              return true;
            });
          } else {
            for (const e of getEnemies()) e.flowerForm = false;
            flowerProjectiles = [];
          }
          if (player.powerType === 'shadow' && player.powerLevel >= 5) {
            const bhX = cameraX + VIEW_WIDTH / 2;
            const bhY = 100;
            if (!blackHole) blackHole = { x: bhX, y: bhY, radius: 50, pulse: 0 };
            blackHole.x = bhX;
            blackHole.y = bhY;
            blackHole.pulse += 0.08;
            const px = player.x + player.width / 2, py = player.y + player.height / 2;
            const SUCTION_RADIUS = 400;
            const KILL_RADIUS = 50;
            const PULL_STRENGTH = 14;
            for (const e of getEnemies()) {
              if (!e.alive || e.deathTimer > 0) continue;
              const ex = e.x + e.width / 2, ey = e.y + e.height / 2;
              const distToPlayer = Math.sqrt((ex - px) ** 2 + (ey - py) ** 2);
              if (distToPlayer > SUCTION_RADIUS) continue;
              const dx = blackHole.x - ex, dy = blackHole.y - ey;
              const distToBH = Math.sqrt(dx * dx + dy * dy) || 1;
              if (distToBH < KILL_RADIUS) {
                e.deathTimer = 15;
                e.alive = false;
                score += 100;
                addParticles(e.x + e.width / 2, e.y + e.height / 2, 4, POWER_COLOR.shadow);
                addScorePopup(e.x + e.width / 2, e.y, '+100');
              } else {
                const pull = Math.min(PULL_STRENGTH, 200 / (distToBH + 1));
                e.x += (dx / distToBH) * pull;
                e.y += (dy / distToBH) * pull;
              }
            }
          } else blackHole = null;

          if (player.powerType === 'time' && player.powerLevel >= 3) {
            const timeRange = 180 + player.powerLevel * 25;
            const timeVert = 120 + player.powerLevel * 20;
            for (const e of getEnemies()) {
              if (!e.alive || e.deathTimer > 0) continue;
              const dx = (e.x + e.width/2) - (player.x + player.width/2);
              const dy = (e.y + e.height/2) - (player.y + player.height/2);
              if (Math.abs(dx) < timeRange && Math.abs(dy) < timeVert) {
                e.timeSlowed = true;
                e.vx *= 0.88;
                e.vy *= 0.88;
              } else e.timeSlowed = false;
            }
          } else { for (const e of getEnemies()) e.timeSlowed = false; }
          if (player.powerType !== 'vortex' || player.powerLevel < 4) {
            for (const vw of vortexWinds) if (vw.enemy) vw.enemy.vortexLifted = false;
            vortexWinds = [];
            vortexSpawnTimer = 0;
          }
          if (player.powerType === 'vortex' && player.powerLevel >= 4) {
            const lv = player.powerLevel;
            const vortexRange = 220 + lv * 30;
            const spawnInterval = lv >= 5 ? 85 : 110;
            vortexSpawnTimer++;
            if (vortexSpawnTimer >= spawnInterval) {
              vortexSpawnTimer = 0;
              for (const e of getEnemies()) {
                if (!e.alive || e.deathTimer > 0 || e.vortexLifted) continue;
                const dx = (e.x + e.width/2) - (player.x + player.width/2);
                const dy = (e.y + e.height/2) - (player.y + player.height/2);
                if (Math.abs(dx) < vortexRange && Math.abs(dy) < 150 && vortexWinds.length < 2) {
                  vortexWinds.push({
                    enemy: e, phase: 'spiral', timer: 0,
                    startX: e.x + e.width/2, startY: e.y + e.height,
                    angle: 0, spiralRadius: 25 + lv * 5, liftSpeed: 4 + lv * 0.8
                  });
                  e.vortexLifted = true;
                  playSound('spell');
                  break;
                }
              }
            }
            vortexWinds = vortexWinds.filter(vw => {
              const e = vw.enemy;
              if (!e.alive) { e.vortexLifted = false; return false; }
              vw.timer++;
              if (vw.phase === 'spiral') {
                vw.angle += 0.38;
                const spiralH = vw.timer * vw.liftSpeed;
                const spiralX = Math.cos(vw.angle) * vw.spiralRadius;
                const spiralY = Math.sin(vw.angle) * vw.spiralRadius * 0.6;
                e.x = vw.startX - e.width/2 + spiralX;
                e.y = vw.startY - e.height - spiralH + spiralY;
                e.vx = 0; e.vy = 0;
                if (vw.timer >= 32) {
                  vw.phase = 'throw';
                  vw.timer = 0;
                }
              } else if (vw.phase === 'throw') {
                const px = player.x + player.width/2;
                const dx = (e.x + e.width/2) - px;
                const throwPower = lv >= 5 ? 18 : 14;
                e.vx = (dx > 0 ? 1 : -1) * throwPower;
                e.vy = -9 - lv;
                e.vortexLifted = false;
                addParticles(e.x + e.width/2, e.y + e.height/2, 8, POWER_COLOR.vortex);
                playSound('brick');
                return false;
              }
              return true;
            });
          }
          if (player.powerType === 'toxic' && player.powerLevel >= 4) {
            if (Math.floor(Date.now()/90) % 2 === 0) {
              const tx = player.x + player.width/2 + (Math.random() - 0.5) * 150;
              const ty = player.y + player.height/2 - 50 - Math.random() * 80;
              addParticles(tx, ty, 5, '#84cc16');
              const sickDur = player.powerLevel >= 5 ? 30 : 30 + (5 - player.powerLevel) * 20;
              for (const e of getEnemies()) {
                if (!e.alive || e.deathTimer > 0) continue;
                if (Math.abs((e.x + e.width/2) - tx) < 50 && Math.abs((e.y + e.height/2) - ty) < 50) {
                  e.sickTimer = Math.max(e.sickTimer || 0, sickDur);
                  e.sickMaxTimer = sickDur;
                }
              }
            }
          }
          if (player.powerType === 'phantom' && player.powerLevel >= 4 && invincibleTimer <= 0) {
            if (Math.floor(Date.now()/120) % 3 === 0) invincibleTimer = 8;
          }
          if (player.powerType === 'phantom' && player.powerLevel >= 3) {
            const lv = player.powerLevel;
            const ghostSize = lv === 3 ? 24 : lv === 4 ? 32 : 40;
            const ghostSpeed = lv === 3 ? 5 : lv === 4 ? 7 : 10;
            const detectRange = lv === 3 ? 120 : lv === 4 ? 160 : 220;
            const hitRadius = lv === 3 ? 28 : lv === 4 ? 38 : 50;
            const px = player.x + player.width/2, py = player.y + player.height/2 - 35;
            if (!phantomGhost) {
              phantomGhost = { x: px, y: py, targetX: null, targetY: null, state: 'above', returnTimer: 0 };
            }
            if (phantomGhost.state === 'above') {
              phantomGhost.x += (px - phantomGhost.x) * 0.15;
              phantomGhost.y += (py - phantomGhost.y) * 0.15;
              let nearest = null, nearestDist = detectRange;
              for (const e of getEnemies()) {
                if (!e.alive || e.deathTimer > 0) continue;
                const dx = (e.x + e.width/2) - phantomGhost.x, dy = (e.y + e.height/2) - phantomGhost.y;
                const d = Math.sqrt(dx*dx + dy*dy);
                if (d < nearestDist) { nearestDist = d; nearest = e; }
              }
              if (nearest) {
                phantomGhost.targetX = nearest.x + nearest.width/2;
                phantomGhost.targetY = nearest.y + nearest.height/2;
                phantomGhost.state = 'attacking';
              }
            } else if (phantomGhost.state === 'attacking') {
              let tx = phantomGhost.targetX, ty = phantomGhost.targetY;
              let nearest = null, nearestDist = 9999;
              for (const e of getEnemies()) {
                if (!e.alive || e.deathTimer > 0) continue;
                const ex = e.x + e.width/2, ey = e.y + e.height/2;
                const d = Math.hypot(ex - phantomGhost.x, ey - phantomGhost.y);
                if (d < nearestDist && d < detectRange * 1.5) { nearestDist = d; nearest = e; }
              }
              if (nearest) {
                tx = nearest.x + nearest.width/2;
                ty = nearest.y + nearest.height/2;
                phantomGhost.targetX = tx;
                phantomGhost.targetY = ty;
              }
              const dx = tx - phantomGhost.x, dy = ty - phantomGhost.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < hitRadius) {
                for (const e of getEnemies()) {
                  if (!e.alive || e.deathTimer > 0) continue;
                  const ex = e.x + e.width/2, ey = e.y + e.height/2;
                  if (Math.abs(ex - phantomGhost.x) < hitRadius && Math.abs(ey - phantomGhost.y) < hitRadius) {
                    e.deathTimer = 15;
                    e.alive = false;
                    playSound('stomp');
                    score += 100;
                    addParticles(e.x + e.width/2, e.y + e.height/2, 6, POWER_COLOR.phantom);
                    addScorePopup(e.x + e.width/2, e.y, '+100');
                    hit = true;
                    break;
                  }
                }
                phantomGhost.state = 'returning';
                phantomGhost.returnTimer = 20;
              } else if (dist > 0) {
                phantomGhost.x += (dx / dist) * ghostSpeed;
                phantomGhost.y += (dy / dist) * ghostSpeed;
              }
            } else if (phantomGhost.state === 'returning') {
              phantomGhost.returnTimer--;
              const dx = px - phantomGhost.x, dy = py - phantomGhost.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist > 5 && phantomGhost.returnTimer > 0) {
                phantomGhost.x += (dx / dist) * ghostSpeed * 1.2;
                phantomGhost.y += (dy / dist) * ghostSpeed * 1.2;
              } else {
                phantomGhost.state = 'above';
                phantomGhost.x = px;
                phantomGhost.y = py;
              }
            }
          } else phantomGhost = null;
          if (player.powerType === 'sound' && player.powerLevel >= 4 && Math.floor(Date.now()/90) % 3 === 0) {
            soundWaves.push({ x: player.x + player.width/2, y: player.y + player.height/2, r: 0, life: 50 });
          }
          soundWaves = soundWaves.filter(sw => {
            sw.r += 6;
            sw.life--;
            if (sw.life <= 0) return false;
            for (const e of getEnemies()) {
              if (!e.alive || e.deathTimer > 0) continue;
              const dx = (e.x + e.width/2) - sw.x, dy = (e.y + e.height/2) - sw.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist > sw.r - 25 && dist < sw.r + 25 && dist > 10) {
                const push = 8 / (dist * 0.02 + 1);
                e.x += (dx / dist) * push;
                e.y += (dy / dist) * push;
                e.vx = (dx / dist) * 4;
                e.vy = (dy / dist) * 4;
                soundHitEffects.push({ x: e.x + e.width/2, y: e.y + e.height/2, r: 0, life: 25 });
              }
            }
            return sw.r < 350;
          });
          soundHitEffects = soundHitEffects.filter(sh => { sh.r += 8; sh.life--; return sh.life > 0; });
          if (player.powerType === 'prism' && player.powerLevel >= 4) {
            const px = player.x + player.width/2;
            const prismRange = 140;
            if (Math.floor(Date.now()/90) % 2 === 0) {
              for (const e of getEnemies()) {
                if (!e.alive || e.deathTimer > 0 || e.prismLifted) continue;
                const dx = (e.x + e.width/2) - px;
                if (Math.abs(dx) < prismRange) {
                  e.prismLifted = true;
                  e.vx = 0; e.vy = 0;
                }
              }
            }
            for (const e of getEnemies()) {
              if (!e.alive || !e.prismLifted) continue;
              e.y -= 4;
              if (Math.floor(Date.now()/5) % 4 === 0 && prismLiftBeams.length < 12) {
                prismLiftBeams.push({ x: e.x + e.width/2, y: e.y + e.height, h: 0, maxH: 80, life: 25 });
              }
              if (e.y + e.height/2 <= VIEW_HEIGHT / 2) {
                e.deathTimer = 15;
                e.alive = false;
                e.prismLifted = false;
                score += 100;
                playSound('brick');
                addParticles(e.x + e.width/2, e.y + e.height/2, 6, POWER_COLOR.prism);
                addScorePopup(e.x + e.width/2, e.y, '+100');
                const ex = e.x + e.width/2, ey = e.y + e.height/2;
                for (let i = 0; i < 6; i++) {
                  const a = (i / 6) * Math.PI * 2;
                  const spd = 6 + (player.powerLevel >= 5 ? 2 : 0);
                  prismGems.push({ x: ex, y: ey, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 2, life: 40 });
                }
              }
            }
            prismGems = prismGems.filter(g => {
              g.vy += GRAVITY * 0.3;
              g.x += g.vx; g.y += g.vy; g.life--;
              if (g.life <= 0) return false;
              for (const oe of getEnemies()) {
                if (!oe.alive || oe.deathTimer > 0 || oe.prismLifted) continue;
                if (Math.abs((oe.x + oe.width/2) - g.x) < 25 && Math.abs((oe.y + oe.height/2) - g.y) < 25) {
                  oe.deathTimer = 15;
                  oe.alive = false;
                  score += 100;
                  addParticles(oe.x + oe.width/2, oe.y + oe.height/2, 6, POWER_COLOR.prism);
                  addScorePopup(oe.x + oe.width/2, oe.y, '+100');
                  return false;
                }
              }
              return true;
            });
          } else {
            for (const e of getEnemies()) e.prismLifted = false;
            prismGems = [];
          }
          if (player.powerType === 'plasma' && player.powerLevel >= 4) {
            plasmaPulseTimer++;
            const spawnInterval = player.powerLevel >= 5 ? 45 : 55;
            if (plasmaPulseTimer >= spawnInterval && plasmaPulses.length < 4) {
              plasmaPulseTimer = 0;
              plasmaPulses.push({
                x: player.x + player.width/2,
                y: player.y + player.height/2,
                r: 0,
                life: 55,
                expandSpeed: player.powerLevel >= 5 ? 4 : 3.2
              });
            }
            plasmaPulses = plasmaPulses.filter(pp => {
              pp.r += pp.expandSpeed;
              pp.life--;
              if (pp.life <= 0) return false;
              const px = pp.x, py = pp.y;
              for (const e of getEnemies()) {
                if (!e.alive || e.deathTimer > 0) continue;
                const dx = (e.x + e.width/2) - px, dy = (e.y + e.height/2) - py;
                if (Math.sqrt(dx*dx + dy*dy) < pp.r + 25) {
                  e.deathTimer = 15;
                  e.alive = false;
                  score += 100;
                  addParticles(e.x + e.width/2, e.y + e.height/2, 4, POWER_COLOR.plasma);
                  addScorePopup(e.x + e.width/2, e.y, '+100');
                  playSound('stomp');
                }
              }
              return true;
            });
          } else { plasmaPulses = []; plasmaPulseTimer = 0; }
          if (player.powerType === 'meteor' && player.powerLevel >= 4) {
            const maxMeteors = player.powerLevel >= 5 ? 3 : 2;
            if (meteors.length < maxMeteors && Math.floor(Date.now()/80) % 4 === 0) {
              const targets = getEnemies().filter(e => e.alive && e.deathTimer <= 0 && e.y + e.height < VIEW_HEIGHT - 60);
              if (targets.length > 0) {
                const t = targets[Math.floor(Math.random() * targets.length)];
                meteors.push({
                  x: t.x + t.width/2 - 20, y: -60, targetX: t.x + t.width/2, targetY: t.y + t.height,
                  vy: 12 + player.powerLevel * 2, size: 36, life: 60, enemy: t, hit: false
                });
              }
            }
            meteors = meteors.filter(m => {
              if (!m.enemy) return false;
              m.targetY = m.enemy.y + m.enemy.height;
              m.x += (m.enemy.x + m.enemy.width/2 - 20 - m.x) * 0.08;
              m.y += m.vy;
              m.life--;
              if (m.y >= m.targetY - 20 && !m.hit && m.enemy.alive) {
                m.hit = true;
                m.enemy.deathTimer = 15;
                m.enemy.alive = false;
                score += 100;
                playSound('brick');
                addParticles(m.enemy.x + m.enemy.width/2, m.enemy.y + m.enemy.height/2, 4, POWER_COLOR.meteor);
                addScorePopup(m.enemy.x + m.enemy.width/2, m.enemy.y, '+100');
                addParticles(m.enemy.x + m.enemy.width/2, m.enemy.y + m.enemy.height/2, 4, '#fbbf24');
              }
              return m.life > 0 && m.y < VIEW_HEIGHT + 80;
            });
          } else meteors = [];
          if (player.powerType !== 'void' || player.powerLevel < 4) {
            voidHoles = [];
            voidSpawnTimer = 0;
          } else if (player.powerType === 'void' && player.powerLevel >= 4) {
            const lv = player.powerLevel;
            const maxHoles = 1;
            const spawnInterval = lv >= 5 ? 70 : 100;
            voidSpawnTimer++;
            if (voidHoles.length < maxHoles && voidSpawnTimer >= spawnInterval) {
              voidSpawnTimer = 0;
              const px = player.x + player.width/2 + (player.facingRight ? 100 : -100);
              const py = player.y + player.height/2 - 20;
              const maxR = lv >= 5 ? 95 : 75;
              voidHoles.push({ x: px, y: py, r: 0, phase: 'expand', timer: 0, maxR, spin: 0 });
              playSound('spell');
            }
            voidHoles = voidHoles.filter(vh => {
              vh.timer++;
              vh.spin += 0.18;
              if (vh.phase === 'expand') {
                vh.r += (vh.maxR - vh.r) * 0.14;
                if (vh.r >= vh.maxR * 0.95) { vh.phase = 'active'; vh.activeTimer = 0; }
              } else if (vh.phase === 'active') {
                vh.activeTimer = (vh.activeTimer || 0) + 1;
                if (vh.activeTimer > 45) vh.phase = 'shrink';
              } else if (vh.phase === 'shrink') {
                vh.r *= 0.88;
                if (vh.r < 4) return false;
              }
              for (const e of getEnemies()) {
                if (!e.alive || e.deathTimer > 0) continue;
                const ex = e.x + e.width/2, ey = e.y + e.height/2;
                const dx = ex - vh.x, dy = ey - vh.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const pullRange = vh.r + 70;
                if (dist < pullRange && dist > 5) {
                  const pull = Math.min(8, 120 / (dist + 1));
                  e.x += (dx / dist) * pull;
                  e.y += (dy / dist) * pull;
                  if (Math.floor(Date.now()/2) % 3 === 0 && voidSuckParticles.length < 50) {
                    voidSuckParticles.push({ x: ex, y: ey, vx: -(dx/dist)*4, vy: -(dy/dist)*4, life: 18, phase: 'suck' });
                  }
                }
                if (dist < vh.r + 20) {
                  e.deathTimer = 15;
                  e.alive = false;
                  score += 100;
                  for (let i = 0; i < 14; i++) {
                    const a = (i/14) * Math.PI * 2 + vh.spin;
                    if (voidSuckParticles.length < 50) voidSuckParticles.push({ x: ex, y: ey, vx: Math.cos(a)*4, vy: Math.sin(a)*4, life: 22, phase: 'implode' });
                  }
                  addParticles(ex, ey, 6, '#1e1b4b');
                  addParticles(ex, ey, 6, '#4c1d95');
                  addScorePopup(ex, ey, '+100');
                  playSound('stomp');
                }
              }
              return true;
            });
          }
          if (player.powerType === 'beam' && player.powerLevel >= 4) {
            const px = player.x + player.width/2, py = player.y + player.height/2;
            const beamRange = 180 + player.powerLevel * 20;
            for (const e of getEnemies()) {
              if (!e.alive || e.deathTimer > 0) continue;
              const dx = (e.x + e.width/2) - px, dy = (e.y + e.height/2) - py;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < beamRange) {
                let pillar = beamPillars.find(bp => bp.enemy === e);
                if (!pillar && beamPillars.length < 8) {
                  pillar = { enemy: e, x: e.x + e.width/2, y: e.y, progress: 0, maxProgress: 1 };
                  beamPillars.push(pillar);
                }
                pillar.x = e.x + e.width/2;
                pillar.y = e.y + e.height;
                pillar.progress = Math.min(1, pillar.progress + (player.powerLevel >= 5 ? 0.04 : 0.025));
                if (pillar.progress >= 1) {
                  e.deathTimer = 15;
                  e.alive = false;
                  score += 100;
                  playSound('fire');
                  addParticles(e.x + e.width/2, e.y + e.height/2, 8, POWER_COLOR.beam);
                  addScorePopup(e.x + e.width/2, e.y, '+100');
                  pillar.done = true;
                }
              }
            }
            beamPillars = beamPillars.filter(bp => {
              if (bp.done || !bp.enemy.alive) return false;
              const edx = (bp.enemy.x + bp.enemy.width/2) - px, edy = (bp.enemy.y + bp.enemy.height/2) - py;
              return Math.sqrt(edx*edx + edy*edy) < beamRange;
            });
          } else beamPillars = [];

          if (discoBallTimer > 0) {
            discoBallTimer--;
            if (discoBallTimer <= 0) { stopDiscoMusic(); discoCollectParticles = []; }
            if (discoBallTimer % 45 === 0) {
              const cx = VIEW_WIDTH/2 + cameraX;
              const cy = 50;
              for (let i = 0; i < 4; i++) {
                const ang = (Date.now() * 0.02 + i * 90) * Math.PI / 180;
                discoRays.push({ x: cx, y: cy, angle: ang, dist: 0, life: 25, hue: (i * 90 + Date.now() * 1) % 360, thick: 2 });
              }
            }
            if (discoRays.length > 20) discoRays = discoRays.slice(-20);
            discoRays = discoRays.filter(r => {
              r.dist += 16;
              r.life--;
              if (r.life <= 0) return false;
              const rx = r.x + Math.cos(r.angle) * r.dist - cameraX;
              const ry = r.y + Math.sin(r.angle) * r.dist;
              for (const e of getEnemies()) {
                if (!e.alive) continue;
                const ex = e.x + e.width/2 - cameraX, ey = e.y + e.height/2;
                if (Math.abs(ex - rx) < 45 && Math.abs(ey - ry) < 45 && r.dist > 25) {
                  e.deathTimer = 15;
                  e.alive = false;
                  score += 100;
                  addParticles(e.x + e.width/2, e.y + e.height/2, 6, 'hsl(' + r.hue + ',90%,65%)');
                  addScorePopup(e.x + e.width/2, e.y, '+100');
                }
              }
              return r.dist < 650;
            });
          } else discoRays = [];
          if (sewerDepth === 0 && !inWaterRealm && flagX > 0 && player.x + player.width >= flagX && player.x <= flagX + 80) {
            if (inSpaceRealm && spaceStage < 3 && spaceshipX > 0 && player.x + player.width >= spaceshipX - 20 && player.x <= spaceshipX + 100) {
              if (spaceshipAnimTimer === 0) {
                spaceshipAnimTimer = 1;
                invincibleTimer = 120;
                playSound('flag');
              }
            } else if (!inSpaceRealm) {
              if (discoBallTimer > 0) { discoBallTimer = 0; stopDiscoMusic(); discoRays = []; }
              playSound('flag');
              playSound('levelComplete');
              saveGameState();
              gameState = 'levelcomplete';
              addParticles(player.x + player.width/2, VIEW_HEIGHT/2, 8, '#ffd700');
              addParticles(player.x + player.width/2, VIEW_HEIGHT/2, 5, '#ffd700', '⭐');
            }
          }

          for (const b of getBonusItemsInSewer()) {
            if (!b.collected && player.hasMagnet) {
              const dx = (player.x + player.width/2) - (b.x + b.width/2);
              const dy = (player.y + player.height/2) - (b.y + b.height/2);
              const dist = Math.sqrt(dx*dx + dy*dy);
              const bonusMagnetRange = player.hasSuperMagnet ? 320 : 220;
              if (dist < bonusMagnetRange && dist > 0) {
                const pull = player.hasSuperMagnet ? 0.2 : 0.15;
                b.x += dx * pull / dist * 5;
                b.y += dy * pull / dist * 5;
              }
            }
            if (!b.collected && checkCollision(player, b)) {
              b.collected = true;
              if (b.type === 'magnet') {
                player.hasMagnet = true;
                score += 200;
                addParticles(b.x + 14, b.y + 14, 6, '#60a5fa');
                addScorePopup(b.x + 14, b.y, '+200');
              } else if (b.type === 'superMagnet') {
                player.hasMagnet = true;
                player.hasSuperMagnet = true;
                score += 300;
                addParticles(b.x + 14, b.y + 14, 6, '#818cf8');
                addScorePopup(b.x + 14, b.y, '+300');
              } else if (b.type === 'disco') {
                discoBallTimer = 90 * 60;
                enemiesDanceFromDisco = true;
                discoCollectFlash = 25;
                for (let i = 0; i < 6; i++) {
                  const a = (i / 6) * Math.PI * 2;
                  discoCollectParticles.push({ x: b.x + 14, y: b.y + 14, vx: Math.cos(a) * 4, vy: Math.sin(a) * 4 - 3, life: 24, hue: (i * 60) % 360 });
                }
                playDiscoMusic();
                score += 400;
                addParticles(b.x + 14, b.y + 14, 8, '#ff6b9d');
                addScorePopup(b.x + 14, b.y, '+400');
              } else if (b.type === 'wings') {
                player.hasWings = true;
                score += 350;
                addParticles(b.x + 14, b.y + 14, 6, '#93c5fd');
                addScorePopup(b.x + 14, b.y, '+350');
              } else if (b.type === 'shield') {
                shieldBonusTimer = 360; /* 6 שניות */
                score += 250;
                addParticles(b.x + 14, b.y + 14, 6, '#60a5fa');
                addScorePopup(b.x + 14, b.y, '+250');
              } else if (b.type === 'timeShield') {
                timeShieldTimer = 240; /* 4 שניות */
                score += 280;
                addParticles(b.x + 14, b.y + 14, 6, '#a78bfa');
                addScorePopup(b.x + 14, b.y, '+280');
              } else if (b.type === 'doubleCoins') {
                doubleCoinsTimer = 600; /* 10 שניות */
                score += 220;
                addParticles(b.x + 14, b.y + 14, 6, '#fbbf24');
                addScorePopup(b.x + 14, b.y, '+220');
              } else if (b.type === 'extraLife') {
                lives++;
                score += 200;
                addParticles(b.x + 14, b.y + 14, 6, '#ef4444');
                addScorePopup(b.x + 14, b.y, '+1 UP!');
              } else {
                score += b.type === 'gem' ? 300 : 500;
                addParticles(b.x + 14, b.y + 14, 6, b.type === 'gem' ? '#a78bfa' : '#fbbf24');
                addScorePopup(b.x + 14, b.y, b.type === 'gem' ? '+300' : '+500');
              }
              playSound('bonus');
            }
          }

          const sickDurationFromCloud = 30;
          for (const e of getEnemies()) {
            if (!e.alive || e.deathTimer > 0) continue;
            if ((e.sickTimer || 0) > 0) {
              e.sickTimer--;
              if (e.sickTimer <= 0) {
                e.deathTimer = 15;
                e.alive = false;
                score += 100;
                playSound('water');
                addParticles(e.x + e.width/2, e.y + e.height/2, 8, POWER_COLOR.toxic);
                addScorePopup(e.x + e.width/2, e.y, '+100');
                poisonClouds.push({ x: e.x + e.width/2, y: e.y + e.height/2, r: 0, life: 35, infectTimer: 0 });
              }
            }
          }
          poisonClouds = poisonClouds.filter(pc => {
            pc.r += 5;
            pc.life--;
            pc.infectTimer++;
            if (pc.life <= 0) return false;
            if (pc.infectTimer > 2) {
              for (const e of getEnemies()) {
                if (!e.alive || e.deathTimer > 0 || (e.sickTimer || 0) > 0) continue;
                const dx = (e.x + e.width/2) - pc.x, dy = (e.y + e.height/2) - pc.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < pc.r + 35 && dist > pc.r - 45) {
                  e.sickTimer = sickDurationFromCloud;
                  e.sickMaxTimer = sickDurationFromCloud;
                }
              }
            }
            return pc.r < 200;
          });

          if (comboTimer > 0) comboTimer--;
          else comboCount = 0;
          const enemies = getEnemies();
          let stompedAny = false;
          for (const e of enemies) {
            if (!e.alive && e.deathTimer <= 0) continue;
            if ((e.sickTimer || 0) > 0) continue;
            if (discoBallTimer <= 0) e.update(allPlatforms);
            if (invincibleTimer > 0 && e.deathTimer <= 0 && e.alive && !e.flowerForm && checkCollision(player, e)) {
              const dx = (player.x + player.width/2) - (e.x + e.width/2);
              if (dx !== 0) player.x += Math.sign(dx) * 6;
            }
            if (invincibleTimer <= 0 && stoneGiantTimer <= 0 && e.deathTimer <= 0 && !e.flowerForm && checkCollision(player, e)) {
              const stompThreshold = ['fish','spider','jellyfish'].includes(e.type) ? e.y + e.height * 0.65 : e.y + e.height * 0.55;
              if (player.vy > 0 && player.y + player.height - 14 <= stompThreshold) {
                player.y = e.y - player.height + 2;
                e.deathTimer = 15;
                e.alive = false;
                stompedAny = true;
                comboCount = comboTimer > 0 ? comboCount + 1 : 1;
                comboTimer = COMBO_TIMEOUT;
                const baseScore = 100;
                const comboBonus = (comboCount - 1) * 50;
                const totalScore = baseScore + comboBonus;
                score += totalScore;
                addParticles(e.x + e.width/2, e.y + e.height/2, 6, '#ffd700');
                if (comboCount >= 3) addParticles(e.x + e.width/2, e.y + e.height/2, 6, '#ffd700', '⭐');
                addScorePopup(e.x + e.width/2, e.y, comboCount > 1 ? '+' + totalScore + ' x' + comboCount : '+100', comboCount > 1 ? '#ffd700' : undefined);
              }
            }
          }
          if (stompedAny) {
            player.vy = -9.5;
            player.onGround = false;
            player.coyoteTimer = 6;
            playSound('stomp');
          } else {
            for (const e of enemies) {
              if (!e.alive || e.deathTimer > 0) continue;
              if (invincibleTimer <= 0 && stoneGiantTimer <= 0 && e.deathTimer <= 0 && !e.flowerForm && checkPlayerDamageCollision(player, e)) {
                if (player.big) {
                  player.big = false;
                  player.height = 40;
                  invincibleTimer = 120;
                  playSound('brick');
                  addParticles(player.x + player.width/2, player.y + player.height/2, 6, '#ff6b9d');
                } else {
                  player.die();
                }
                break;
              }
            }
          }

          if (player.hasMagnet) {
            const enemyMagnetRange = player.hasSuperMagnet ? 450 : 350;
            for (const e of getEnemies()) {
              if (!e.alive || e.deathTimer > 0) continue;
              const dx = (player.x + player.width/2) - (e.x + e.width/2);
              const dy = (player.y + player.height/2) - (e.y + e.height/2);
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < enemyMagnetRange && dist > 15) {
                const pull = (player.hasSuperMagnet ? 3.2 : 2.5) / (dist * 0.02 + 1);
                e.x += (dx / dist) * pull;
                e.y += (dy / dist) * pull;
              }
            }
          }
          const magnetRange = player.hasSuperMagnet ? 520 : (player.hasMagnet ? 380 : COIN_MAGNET_RANGE);
          const collectibles = getCoins();
          for (const c of collectibles) {
            if (c.collected) continue;
            const dx = (player.x + player.width/2) - (c.x + c.width/2);
            const dy = (player.y + player.height/2) - (c.y + c.height/2);
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < magnetRange && dist > 0) {
              const pull = player.hasSuperMagnet ? 0.52 : (player.hasMagnet ? 0.38 : 0.15);
              c.x += (dx / dist) * pull * 4;
              c.y += (dy / dist) * pull * 4;
            }
            if (checkCollision(player, c)) {
              c.collected = true;
              const mult = doubleCoinsTimer > 0 ? 2 : 1;
              coins += mult;
              score += 50 * mult;
              playSound('coin');
              addParticles(c.x + 12, c.y + 12, 4, '#ffd700');
              addScorePopup(c.x + 12, c.y, mult > 1 ? '+100' : '+50');
            }
          }

          if (inWaterRealm) {
            targetCameraX = Math.max(0, Math.min(player.x - 200, WATER_WIDTH - VIEW_WIDTH));
          } else if (sewerDepth === 0) {
            targetCameraX = Math.max(0, player.x - 200);
          } else {
            targetCameraX = Math.max(0, Math.min(player.x - 200, SEWER_WIDTH - VIEW_WIDTH));
          }
          cameraX += (targetCameraX - cameraX) * 0.14;

          if ((sewerDepth > 0 || inWaterRealm) && invincibleTimer <= 0 && stoneGiantTimer <= 0) {
            for (const pit of getWaterPits()) {
              const inPitX = player.x + player.width > pit.x && player.x < pit.x + pit.width;
              let shouldDie = false;
              if (inWaterRealm) {
                const fallenBelowFloor = player.y + player.height > WATER_GROUND;
                shouldDie = inPitX && fallenBelowFloor;
              } else {
                shouldDie = inPitX && player.y + player.height > pit.y && player.y < pit.y + pit.height;
              }
              if (shouldDie) {
                playSound(pit.type === 'lava' ? 'lava_splash' : (pit.type === 'poison' ? 'water' : 'water'));
                player.die();
                break;
              }
            }
            if (sewerDepth > 0) {
              for (const spike of sewerSpikes) {
                if (player.x + player.width > spike.x && player.x < spike.x + spike.width &&
                    player.y + player.height > spike.y - 4 && player.y + player.height < spike.y + spike.height + 4) {
                  playSound('death');
                  player.die();
                  break;
                }
              }
              for (const fc of fireColumns) {
                const fw = 24, fh = 60;
                if (player.x + player.width > fc.x - fw/2 && player.x < fc.x + fw/2 &&
                    player.y + player.height > fc.y && player.y < fc.y + fh) {
                  playSound('death');
                  player.die();
                  break;
                }
              }
            }
          }

        ctx.globalAlpha = 1;

        const octCutsceneEl = document.getElementById('octopusCutscene');
        const octCanvas = document.getElementById('octopusCutsceneCanvas');
        if (octopusTransition && octCutsceneEl && octCanvas) {
          octCutsceneEl.style.display = 'flex';
          const octCtx = octCanvas.getContext('2d');
          if (octCtx) {
            const ot = octopusTransition;
            octCtx.fillStyle = '#051a2d';
            octCtx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
            const grad = octCtx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
            grad.addColorStop(0, '#0a2540');
            grad.addColorStop(0.4, '#063550');
            grad.addColorStop(0.8, '#042a3d');
            grad.addColorStop(1, '#021a28');
            octCtx.fillStyle = grad;
            octCtx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
            for (let i = 0; i < 25; i++) {
              octCtx.globalAlpha = 0.15 + Math.sin(Date.now() * 0.0015 + i * 0.4) * 0.05;
              octCtx.fillStyle = '#0ea5e9';
              octCtx.fillRect((i * 38 + Date.now() * 0.015 % 60) % (VIEW_WIDTH + 50) - 25, 40 + i * 18, 35, 10);
            }
            octCtx.globalAlpha = 1;
            const centerX = VIEW_WIDTH / 2;
            const centerY = VIEW_HEIGHT / 2;
            const drawScale = ot.phase === 'release' ? (ot.zoomScale || 1) : 1;
            const drawX = ot.phase === 'release' ? centerX + ((ot.zoomX || ot.x) - ot.x) * 0.3 : centerX;
            const drawY = ot.phase === 'release' ? centerY + ((ot.zoomY || ot.y) - ot.y) * 0.3 : centerY;
            const octSize = (ot.phase === 'capture' || ot.phase === 'drag') ? 100 : (ot.phase === 'love' ? 110 : 90);
            octCtx.font = (octSize * drawScale) + 'px sans-serif';
            octCtx.textAlign = 'center';
            octCtx.textBaseline = 'middle';
            const octEmoji = ot.phase === 'love' ? '😍' : EMOJI.octopus;
            octCtx.fillText(octEmoji, drawX, drawY);
            if (ot.phase === 'love' && ot.loveHearts) {
              for (let h = 0; h < 3; h++) {
                const heart = ot.loveHearts[h];
                const pulse = 0.9 + Math.sin(heart.phase) * 0.25;
                octCtx.font = (48 * pulse) + 'px sans-serif';
                octCtx.fillText(EMOJI.heart, drawX + (h - 1) * 55, drawY - 85 - Math.sin(heart.phase) * 20);
              }
            }
            const snailY = drawY + (ot.phase === 'capture' || ot.phase === 'drag' ? 55 : (ot.phase === 'love' ? 50 : 0));
            octCtx.font = '52px sans-serif';
            octCtx.fillText(EMOJI.player || '🐌', drawX, snailY);
            if (ot.phase === 'drag') {
              octCtx.font = '18px Nunito';
              octCtx.fillStyle = 'rgba(165,243,252,0.9)';
              octCtx.fillText('Descending to the depths...', centerX, VIEW_HEIGHT - 80);
            } else if (ot.phase === 'love') {
              octCtx.font = '18px Nunito';
              octCtx.fillStyle = 'rgba(255,182,193,0.95)';
              octCtx.fillText('The octopus sends love!', centerX, VIEW_HEIGHT - 80);
            } else if (ot.phase === 'release') {
              octCtx.font = '18px Nunito';
              octCtx.fillStyle = 'rgba(165,243,252,0.9)';
              octCtx.fillText('The octopus swims away...', centerX, VIEW_HEIGHT - 80);
            }
          }
        } else if (octCutsceneEl) {
          octCutsceneEl.style.display = 'none';
        }

        if (!octopusTransition) {
        drawBackground();
        if (discoBallTimer > 0) {
          ctx.save();
          const dh = (Date.now() * 0.5) % 360;
          const g = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
          g.addColorStop(0, 'hsla(' + dh + ',60%,50%,0.08)');
          g.addColorStop(0.5, 'hsla(' + ((dh + 60) % 360) + ',50%,45%,0.04)');
          g.addColorStop(1, 'hsla(' + ((dh + 120) % 360) + ',40%,40%,0.02)');
          ctx.fillStyle = g;
          ctx.fillRect(-50, -50, VIEW_WIDTH + 100, VIEW_HEIGHT + 100);
          ctx.restore();
        }
        drawLevelWeatherParticles();
        ctx.globalAlpha = 1;

        if (sewerDepth > 0 || waterPits.length > 0) {
          for (const pit of waterPits) pit.draw();
        }
        if (octopusPoolIdle && octopusTrapPit && !octopusTransition && (octopusPoolIdle.phase === 'rising' || octopusPoolIdle.phase === 'up' || octopusPoolIdle.phase === 'down')) {
          const op = octopusPoolIdle;
          const ox = octopusTrapPit.x + octopusTrapPit.w/2 - 30;
          const oy = octopusTrapPit.y + op.popY;
          const sx = ox - cameraX;
          if (sx > -80 && sx < VIEW_WIDTH + 80) {
            ctx.save();
            ctx.font = '60px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(EMOJI.octopus, sx + 30, oy + 25);
            ctx.restore();
          }
        }

        for (const vw of vortexWinds) {
          if (!vw.enemy || !vw.enemy.alive) continue;
          const vx = (vw.enemy.x + vw.enemy.width/2) - cameraX;
          const vy = vw.enemy.y + vw.enemy.height + 15;
          if (vx > -60 && vx < VIEW_WIDTH + 60) {
            ctx.save();
            for (let ring = 0; ring < 2; ring++) {
              const baseR = 14 + ring * 16 + Math.sin(Date.now() * 0.02 + ring) * 5;
              for (let i = 0; i < 5; i++) {
                const off = (vw.angle * 1.8 + i * 1.2 + ring * 0.6) % (Math.PI * 2);
                const r = baseR + Math.sin(Date.now() * 0.015 + i) * 3;
                const wx = vx + Math.cos(off) * r;
                const wy = vy + Math.sin(off) * r * 0.7;
                ctx.globalAlpha = 0.85 + Math.sin(Date.now() * 0.01 + i) * 0.1;
                const gr = ctx.createRadialGradient(wx, wy, 0, wx, wy, 12 + ring * 4);
                gr.addColorStop(0, 'rgba(255,255,255,0.6)');
                gr.addColorStop(0.4, 'rgba(129,140,248,0.5)');
                gr.addColorStop(0.8, 'rgba(99,102,241,0.2)');
                gr.addColorStop(1, 'rgba(99,102,241,0)');
                ctx.fillStyle = gr;
                ctx.beginPath();
                ctx.ellipse(wx, wy, 8 + ring * 3, 10 + ring * 4, off, 0, Math.PI * 2);
                ctx.fill();
              }
            }
            ctx.strokeStyle = 'rgba(129,140,248,0.5)';
            ctx.lineWidth = 2;
            for (let s = 0; s < 2; s++) {
              ctx.beginPath();
              for (let t = 0; t <= 12; t++) {
                const a = vw.angle * 2.2 + t * 0.5 + s * 2.1;
                const rr = 8 + t * 4 + Math.sin(a) * 4;
                const xx = vx + Math.cos(a) * rr;
                const yy = vy + Math.sin(a) * rr * 0.6;
                if (t === 0) ctx.moveTo(xx, yy);
                else ctx.lineTo(xx, yy);
              }
              ctx.stroke();
            }
            ctx.restore();
          }
        }

        const allItems = [];
        if (sewerDepth > 0) {
          allItems.push(...getSewerItems());
        } else if (inWaterRealm && typeof getWaterItems === 'function') {
          allItems.push(...getWaterItems());
        } else {
          for (const key in chunks) allItems.push(...chunks[key]);
        }
        allItems.sort((a, b) => (a.y || 0) - (b.y || 0));
        ctx.globalAlpha = 1;
        for (const item of allItems) item.draw && item.draw();

        if (inWaterRealm) {
          for (const c of waterCoral) {
            const sx = c.x - cameraX;
            if (sx > -60 && sx < VIEW_WIDTH + 60) {
              ctx.save();
              const pad = 72;
              const overlapX = player.x + player.width > c.x - pad && player.x < c.x + c.w + pad;
              const overlapY = player.y + player.height > c.y - pad && player.y < c.y + c.h + pad;
              if (overlapX && overlapY) {
                const pulse = 0.4 + Math.sin(Date.now() * 0.008) * 0.15;
                const grad = ctx.createRadialGradient(sx + c.w/2, c.y + c.h/2, 0, sx + c.w/2, c.y + c.h/2, c.w + 50);
                grad.addColorStop(0, 'rgba(165,243,252,' + pulse * 0.5 + ')');
                grad.addColorStop(0.5, 'rgba(165,243,252,' + pulse * 0.2 + ')');
                grad.addColorStop(1, 'rgba(165,243,252,0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(sx + c.w/2, c.y + c.h/2, c.w + 50, 0, Math.PI * 2);
                ctx.fill();
              }
              ctx.font = (c.w || 48) + 'px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              ctx.fillText(EMOJI.coral || '🪸', sx + c.w/2, c.y + c.h);
              ctx.restore();
            }
          }
          for (const pit of sludgePits) {
            const psx = pit.x - cameraX;
            if (psx + pit.w < 0 || psx > VIEW_WIDTH) continue;
            ctx.save();
            /* Bubbling sludge texture - dark green sine waves */
            const t = Date.now() * 0.003;
            ctx.fillStyle = '#1a2e24';
            ctx.fillRect(psx, pit.y, pit.w, pit.h);
            ctx.fillStyle = '#2d4a3e';
            for (let i = 0; i < pit.w; i += 8) {
              for (let j = 0; j < pit.h; j += 6) {
                const wave = Math.sin(i * 0.15 + t) * 4 + Math.sin(j * 0.2 + t * 1.2) * 3;
                const bubble = pit.anticipationTimer > 15 ? (Math.sin(i * 0.3 + t * 4) * 2 + Math.sin(j * 0.4 + t * 3) * 2) : wave;
                ctx.globalAlpha = 0.6 + bubble * 0.15;
                ctx.fillRect(psx + i, pit.y + j, 6, 4);
              }
            }
            ctx.globalAlpha = 1;
            if (pit.anticipationTimer > 0 && pit.anticipationTimer < 30) {
              ctx.fillStyle = 'rgba(80,120,60,' + (0.3 + Math.sin(t * 8) * 0.2) + ')';
              ctx.fillRect(psx + 2, pit.y + 2, pit.w - 4, pit.h - 4);
            }
            if (pit.lobsterVy !== undefined && pit.lobsterVy !== 0) {
              ctx.font = '28px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(EMOJI.lobster || '🦞', psx + pit.w/2, pit.lobsterY - 12);
            }
            ctx.restore();
          }
        }

        if (sewerDepth > 0) {
          for (const spike of sewerSpikes) {
            const sx = spike.x - cameraX;
            if (sx + spike.width < 0 || sx > VIEW_WIDTH) continue;
            ctx.fillStyle = '#4a4a4a';
            ctx.fillRect(sx, spike.y, spike.width, spike.height);
            ctx.fillStyle = '#2a2a2a';
            for (let i = 0; i < Math.ceil(spike.width / 16); i++) {
              ctx.beginPath();
              ctx.moveTo(sx + i * 16 + 8, spike.y);
              ctx.lineTo(sx + i * 16 + 2, spike.y + spike.height);
              ctx.lineTo(sx + i * 16 + 14, spike.y + spike.height);
              ctx.closePath();
              ctx.fill();
            }
          }
          for (const fc of fireColumns) {
            const fsx = fc.x - cameraX;
            if (fsx < -30 || fsx > VIEW_WIDTH + 30) continue;
            ctx.save();
            ctx.globalAlpha = 0.7 + Math.sin(fc.phase || 0) * 0.2;
            const cy = fc.y + 30;
            const gr = ctx.createRadialGradient(fsx, cy - 20, 0, fsx, cy, 35);
            gr.addColorStop(0, 'rgba(255,220,150,0.95)');
            gr.addColorStop(0.4, 'rgba(249,115,22,0.8)');
            gr.addColorStop(0.7, 'rgba(234,88,12,0.4)');
            gr.addColorStop(1, 'rgba(234,88,12,0)');
            ctx.fillStyle = gr;
            ctx.beginPath();
            ctx.ellipse(fsx, cy, 18, 28, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        for (const m of meteors) {
          const mx = m.x + 20 - cameraX;
          if (mx > -50 && mx < VIEW_WIDTH + 50) {
            ctx.save();
            const sz = m.size * 0.5;
            const trail = ctx.createLinearGradient(mx, m.y + sz, mx, m.y - sz * 3);
            trail.addColorStop(0, 'rgba(251,191,36,0.5)');
            trail.addColorStop(0.4, 'rgba(249,115,22,0.2)');
            trail.addColorStop(1, 'rgba(249,115,22,0)');
            ctx.fillStyle = trail;
            ctx.beginPath();
            ctx.ellipse(mx, m.y - sz, sz * 1.5, sz * 2.5, 0, 0, Math.PI * 2);
            ctx.fill();
            const gr = ctx.createRadialGradient(mx, m.y, 0, mx, m.y, sz * 1.5);
            gr.addColorStop(0, 'rgba(255,255,255,0.95)');
            gr.addColorStop(0.3, 'rgba(251,191,36,0.9)');
            gr.addColorStop(0.7, 'rgba(249,115,22,0.5)');
            gr.addColorStop(1, 'rgba(234,88,12,0)');
            ctx.fillStyle = gr;
            ctx.globalAlpha = 0.95;
            ctx.beginPath();
            ctx.arc(mx, m.y, sz, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
        for (const s of earthShockwaves) {
          const sx = s.x - cameraX;
          if (sx + s.r > -30 && sx - s.r < VIEW_WIDTH + 30) {
            ctx.save();
            ctx.globalAlpha = (s.life / 25) * 0.6;
            ctx.strokeStyle = '#78716c';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(sx, s.y, s.r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        }
        for (const w of windPushEffects) {
          const wx = w.x - cameraX;
          if (wx > -30 && wx < VIEW_WIDTH + 30) {
            ctx.save();
            ctx.globalAlpha = w.life / 20;
            ctx.strokeStyle = 'rgba(148,163,184,0.8)';
            ctx.lineWidth = 4;
            const dir = w.dir > 0 ? 1 : -1;
            ctx.beginPath();
            ctx.moveTo(wx - dir * 15, w.y - 8);
            ctx.lineTo(wx + dir * 15, w.y);
            ctx.lineTo(wx - dir * 15, w.y + 8);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
          }
        }
        for (const sh of soundHitEffects) {
          const shx = sh.x - cameraX;
          if (shx + sh.r > -50 && shx - sh.r < VIEW_WIDTH + 50) {
            ctx.save();
            ctx.globalAlpha = (sh.life / 25) * 0.8;
            ctx.strokeStyle = 'rgba(244,114,182,0.9)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(shx, sh.y, sh.r, 0, Math.PI * 2);
            ctx.stroke();
            const gr = ctx.createRadialGradient(shx, sh.y, 0, shx, sh.y, 12);
            gr.addColorStop(0, 'rgba(251,207,232,0.8)');
            gr.addColorStop(0.5, 'rgba(244,114,182,0.5)');
            gr.addColorStop(1, 'rgba(236,72,153,0)');
            ctx.fillStyle = gr;
            ctx.beginPath();
            ctx.arc(shx, sh.y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
        for (const b of lightKillBeams) {
          const bpx = b.px - cameraX, bpy = b.py;
          const bex = b.ex - cameraX, bey = b.ey;
          if ((bpx > -50 && bpx < VIEW_WIDTH + 50) || (bex > -50 && bex < VIEW_WIDTH + 50)) {
            ctx.save();
            ctx.globalAlpha = b.life / 30;
            ctx.strokeStyle = 'rgba(254,240,138,0.9)';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#fef08a';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.moveTo(bpx, bpy);
            ctx.lineTo(bex, bey);
            ctx.stroke();
            ctx.restore();
          }
        }
        voidSuckParticles = voidSuckParticles.filter(vp => {
          vp.x += vp.vx;
          vp.y += vp.vy;
          vp.life--;
          if (vp.life <= 0) return false;
          const vpx = vp.x - cameraX;
          if (vpx > -20 && vpx < VIEW_WIDTH + 20) {
            ctx.save();
            ctx.globalAlpha = vp.life / 22;
            ctx.fillStyle = vp.phase === 'implode' ? '#4c1d95' : '#1e1b4b';
            ctx.shadowColor = '#4c1d95';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(vpx, vp.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          return true;
        });
        for (const pb of prismLiftBeams) {
          pb.h += 6;
          const pbx = pb.x - cameraX;
          if (pbx > -30 && pbx < VIEW_WIDTH + 30) {
            ctx.save();
            ctx.globalAlpha = (pb.life / 20) * 0.7;
            const gradient = ctx.createLinearGradient(pbx, pb.y, pbx, pb.y - pb.h);
            gradient.addColorStop(0, 'rgba(103,232,249,0.9)');
            gradient.addColorStop(1, 'rgba(103,232,249,0.1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(pbx - 8, pb.y - pb.h, 16, pb.h);
            ctx.restore();
          }
          pb.life--;
        }
        prismLiftBeams = prismLiftBeams.filter(pb => pb.life > 0);
        for (const p of getCurrentPipes()) p.draw();
        for (const gw of celestialGateways) gw.draw();
        for (const earth of earthReturnObjects) {
          const ex = earth.x - cameraX;
          if (ex + earth.width < -50 || ex > VIEW_WIDTH + 50) continue;
          ctx.save();
          ctx.shadowColor = '#22c55e';
          ctx.shadowBlur = 20;
          ctx.font = '64px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText('🌍', ex + earth.width/2, earth.y + earth.height);
          ctx.font = '12px Nunito';
          ctx.fillStyle = '#4ade80';
          ctx.fillText('↓ Return', ex + earth.width/2, earth.y + earth.height + 18);
          ctx.restore();
        }
        if (sewerDepth === 5 && bossDoorX > 0) {
          const doorX = bossDoorX - cameraX;
          if (doorX > -80 && doorX < VIEW_WIDTH + 80) {
            ctx.save();
            ctx.fillStyle = '#2d1f0f';
            ctx.fillRect(doorX, SEWER_GROUND - 100, 80, 100);
            ctx.fillStyle = '#4a3520';
            ctx.fillRect(doorX + 4, SEWER_GROUND - 96, 72, 92);
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 12;
            ctx.font = '48px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🚪', doorX + 40, SEWER_GROUND - 50);
            ctx.font = '14px Nunito';
            ctx.fillStyle = '#ffd700';
            ctx.fillText('↑ BOSS', doorX + 40, SEWER_GROUND - 85);
            ctx.restore();
          }
        }
        for (const m of powerUps) m.draw();
        if (inSpaceRealm && spaceshipX > 0) {
          if (spaceshipAnimTimer > 0) {
            const flyY = GROUND_Y - 80 - (spaceshipAnimTimer - 1) * 5;
            const sx = spaceshipX - cameraX;
            if (sx > -80 && sx < VIEW_WIDTH + 80) {
              ctx.save();
              ctx.font = '72px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(EMOJI.spaceship, sx + 40, flyY + 40);
              ctx.font = '28px sans-serif';
              ctx.globalAlpha = 0.9;
              ctx.fillText(EMOJI.player, sx + 40, flyY + 20);
              ctx.restore();
            }
          } else {
            const sx = spaceshipX - cameraX;
            if (sx > -80 && sx < VIEW_WIDTH + 80) {
              ctx.save();
              ctx.font = '64px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              ctx.fillText(EMOJI.spaceship, sx + 40, GROUND_Y);
              ctx.font = '12px Nunito';
              ctx.fillStyle = '#4ade80';
              ctx.textBaseline = 'top';
              ctx.fillText('↑ Next Stage', sx + 40, GROUND_Y + 8);
              ctx.restore();
            }
          }
        }
        if (inSpaceRealm && spaceStage === 3 && spaceBossPortalX > 0) {
          const px = spaceBossPortalX - cameraX;
          if (px > -100 && px < VIEW_WIDTH + 100) {
            ctx.save();
            ctx.fillStyle = '#022c22';
            ctx.fillRect(px, GROUND_Y - 120, 100, 120);
            ctx.strokeStyle = '#84ff00';
            ctx.lineWidth = 3;
            ctx.strokeRect(px, GROUND_Y - 120, 100, 120);
            ctx.font = '48px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🚪', px + 50, GROUND_Y - 60);
            ctx.font = '14px Nunito';
            ctx.fillStyle = '#84ff00';
            ctx.fillText('↑ BOSS', px + 50, GROUND_Y - 95);
            ctx.restore();
          }
        }
        if (inWaterRealm && waterStage < 5) {
          const stageFlagX = WATER_WIDTH - 100;
          const sx = stageFlagX - cameraX;
          if (sx > -80 && sx < VIEW_WIDTH + 80) {
            ctx.save();
            ctx.fillStyle = 'rgba(14,165,233,0.6)';
            ctx.fillRect(sx, WATER_GROUND - 80, 80, 80);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            ctx.strokeRect(sx, WATER_GROUND - 80, 80, 80);
            ctx.font = '48px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('➡️', sx + 40, WATER_GROUND - 40);
            ctx.font = '14px Nunito';
            ctx.fillStyle = '#a5f3fc';
            ctx.fillText('Next Stage', sx + 40, WATER_GROUND - 65);
            ctx.restore();
          }
        }
        if (inWaterRealm && waterStage === 5 && waterBossPortalX > 0) {
          const px = waterBossPortalX - cameraX;
          if (px > -100 && px < VIEW_WIDTH + 100) {
            ctx.save();
            ctx.fillStyle = 'rgba(14,165,233,0.5)';
            ctx.fillRect(px, WATER_GROUND - 120, 100, 120);
            ctx.strokeStyle = '#84ff00';
            ctx.lineWidth = 3;
            ctx.strokeRect(px, WATER_GROUND - 120, 100, 120);
            ctx.font = '48px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🚪', px + 50, WATER_GROUND - 60);
            ctx.font = '14px Nunito';
            ctx.fillStyle = '#84ff00';
            ctx.fillText('↑ BOSS', px + 50, WATER_GROUND - 95);
            ctx.restore();
          }
        }
        if (sewerDepth === 0 && !inSpaceRealm && !inWaterRealm && flagX > 0) {
          const sx = flagX - cameraX;
          if (sx > -50 && sx < VIEW_WIDTH + 50) {
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(sx + 30, 200, 8, GROUND_Y - 200);
            ctx.fillStyle = '#fff';
            ctx.font = '64px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(EMOJI.flag, sx + 40, GROUND_Y);
          }
        }
        for (const pp of powerProjectiles) pp.draw();
        for (const fp of flowerProjectiles) {
          const fpx = fp.x - cameraX;
          if (fpx > -30 && fpx < VIEW_WIDTH + 30) {
            ctx.save();
            ctx.globalAlpha = 0.9 + Math.sin(Date.now() * 0.008) * 0.1;
            const cy = fp.y + Math.sin(Date.now() * 0.01) * 3;
            const gr = ctx.createRadialGradient(fpx, cy - 4, 0, fpx, cy, 14);
            gr.addColorStop(0, 'rgba(255,255,255,0.95)');
            gr.addColorStop(0.3, 'rgba(251,207,232,0.9)');
            gr.addColorStop(0.6, 'rgba(236,72,153,0.7)');
            gr.addColorStop(1, 'rgba(219,39,119,0)');
            ctx.fillStyle = gr;
            for (let p = 0; p < 5; p++) {
              const a = (p / 5) * Math.PI * 2 + Date.now() * 0.003;
              ctx.beginPath();
              ctx.ellipse(fpx + Math.cos(a) * 6, cy + Math.sin(a) * 6, 5, 8, a, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.fillStyle = 'rgba(254,240,138,0.9)';
            ctx.beginPath();
            ctx.arc(fpx, cy, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
        for (const g of prismGems) {
          const gx = g.x - cameraX;
          if (gx > -30 && gx < VIEW_WIDTH + 30) {
            ctx.save();
            ctx.globalAlpha = g.life / 40;
            const gr = ctx.createRadialGradient(gx, g.y - 5, 0, gx, g.y, 14);
            gr.addColorStop(0, 'rgba(255,255,255,0.95)');
            gr.addColorStop(0.3, 'rgba(103,232,249,0.8)');
            gr.addColorStop(0.6, 'rgba(147,51,234,0.5)');
            gr.addColorStop(1, 'rgba(99,102,241,0)');
            ctx.fillStyle = gr;
            ctx.beginPath();
            ctx.moveTo(gx, g.y - 10);
            ctx.lineTo(gx + 8, g.y + 6);
            ctx.lineTo(gx, g.y + 10);
            ctx.lineTo(gx - 8, g.y + 6);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.6)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
          }
        }
        if (player.powerType === 'water' && player.powerLevel >= 3) {
          const layers = player.powerLevel >= 5 ? 2 : 1;
          const radii = player.powerLevel >= 5 ? [35, 65] : [45 + player.powerLevel * 5];
          const counts = player.powerLevel >= 5 ? [4, 6] : [3 + player.powerLevel];
          const sizes = player.powerLevel >= 5 ? [10, 8] : [9];
          const px = player.x + player.width/2 - cameraX;
          const py = player.y + player.height/2;
          for (let L = 0; L < layers; L++) {
            const r = radii[L], dropCount = counts[L], off = L * 0.5, sz = sizes[L] || sizes[0];
            for (let i = 0; i < dropCount; i++) {
              const a = waterOrbitAngle + off + (i / dropCount) * Math.PI * 2;
              const wobble = Math.sin(Date.now() * 0.006 + i) * 3;
              const dx = px + Math.cos(a) * (r + wobble);
              const dy = py + Math.sin(a) * (r + wobble * 0.5);
              if (dx > -25 && dx < VIEW_WIDTH + 25) {
                ctx.save();
                ctx.globalAlpha = 0.85 + Math.sin(Date.now() * 0.008 + i * 2) * 0.12;
                const gr = ctx.createRadialGradient(dx, dy - sz * 0.3, 0, dx, dy, sz * 1.8);
                gr.addColorStop(0, 'rgba(255,255,255,0.9)');
                gr.addColorStop(0.3, 'rgba(165,243,252,0.8)');
                gr.addColorStop(0.6, 'rgba(14,165,233,0.6)');
                gr.addColorStop(1, 'rgba(2,132,199,0)');
                ctx.fillStyle = gr;
                ctx.beginPath();
                ctx.ellipse(dx, dy, sz * 0.85, sz * 1.2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
              }
            }
          }
        }
        for (const lb of lightningBolts) {
          const sx = lb.x - cameraX;
          if (sx > -30 && sx < VIEW_WIDTH + 30) {
            const endY = lb.targetY || lb.y + 60;
            ctx.save();
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 4;
            const zigzag = (t) => Math.sin(t * 0.4) * 10;
            ctx.beginPath();
            ctx.moveTo(sx, lb.y);
            for (let py = lb.y + 14; py < endY; py += 14) {
              ctx.lineTo(sx + zigzag(py), py);
            }
            ctx.lineTo(sx + zigzag(endY), endY);
            ctx.stroke();
            const midY = lb.y + (endY - lb.y) * 0.4;
            const gr = ctx.createRadialGradient(sx, midY, 0, sx, midY, 18);
            gr.addColorStop(0, 'rgba(254,240,138,0.95)');
            gr.addColorStop(0.5, 'rgba(250,204,21,0.5)');
            gr.addColorStop(1, 'rgba(234,179,8,0)');
            ctx.fillStyle = gr;
            ctx.globalAlpha = 0.9 + Math.sin(Date.now() * 0.12) * 0.1;
            ctx.beginPath();
            ctx.arc(sx, midY, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
        for (const ea of electricArcs) {
          const ex = ea.x - cameraX;
          if (ex + ea.right < -20 || ex + ea.left > VIEW_WIDTH + 20) continue;
          ctx.save();
          const lifeRatio = ea.life / 35;
          ctx.globalAlpha = lifeRatio;
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(ex + ea.left, ea.y);
          for (let j = ea.left + 28; j < ea.right; j += 28) {
            const jitter = Math.sin(j * 0.15 + Date.now() * 0.04) * 5;
            ctx.lineTo(ex + j, ea.y + jitter);
          }
          ctx.lineTo(ex + ea.right, ea.y);
          ctx.stroke();
          const step = 45;
          for (let j = ea.left; j <= ea.right; j += step) {
            ctx.globalAlpha = lifeRatio * (0.85 + Math.sin(Date.now() * 0.08 + j) * 0.15);
            const gr = ctx.createRadialGradient(ex + j, ea.y, 0, ex + j, ea.y, 8);
            gr.addColorStop(0, 'rgba(254,240,138,0.9)');
            gr.addColorStop(0.6, 'rgba(250,204,21,0.4)');
            gr.addColorStop(1, 'rgba(234,179,8,0)');
            ctx.fillStyle = gr;
            ctx.beginPath();
            ctx.arc(ex + j, ea.y, 6, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
        for (const pp of plasmaPulses) {
          const ppx = pp.x - cameraX;
          if (ppx + pp.r > -50 && ppx - pp.r < VIEW_WIDTH + 50) {
            ctx.save();
            ctx.globalAlpha = pp.life / 55;
            const gradient = ctx.createRadialGradient(ppx, pp.y, 0, ppx, pp.y, pp.r + 20);
            gradient.addColorStop(0, 'rgba(249,115,22,0.8)');
            gradient.addColorStop(0.4, 'rgba(249,115,22,0.4)');
            gradient.addColorStop(0.8, 'rgba(251,191,36,0.2)');
            gradient.addColorStop(1, 'rgba(249,115,22,0)');
            ctx.beginPath();
            ctx.arc(ppx, pp.y, pp.r + 20, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.shadowColor = '#f97316';
            ctx.shadowBlur = 15;
            ctx.strokeStyle = 'rgba(249,115,22,0.9)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(ppx, pp.y, pp.r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        }
        if (player.powerType === 'fire' && player.powerLevel >= 3) {
          const lv = player.powerLevel;
          const radii = lv >= 5 ? [30, 55] : lv >= 4 ? [40] : [35];
          const layers = lv >= 5 ? 2 : 1;
          const countsPerLayer = lv >= 5 ? [3, 3] : lv >= 4 ? [4] : [3];
          const px = player.x + player.width/2 - cameraX;
          const py = player.y + player.height/2;
          for (let L = 0; L < layers; L++) {
            const r = radii[L], dropCount = countsPerLayer[L], off = L * 0.7;
            for (let i = 0; i < dropCount; i++) {
              const a = fireOrbitAngle + off + (i / dropCount) * Math.PI * 2;
              const wobble = Math.sin(Date.now() * 0.006 + i) * 2;
              const dx = px + Math.cos(a) * (r + wobble);
              const dy = py + Math.sin(a) * (r + wobble * 0.5);
              if (dx > -25 && dx < VIEW_WIDTH + 25) {
                ctx.save();
                const alpha = 0.85 + Math.sin(Date.now() * 0.008 + i) * 0.12;
                ctx.globalAlpha = alpha;
                const gr = ctx.createRadialGradient(dx, dy, 0, dx, dy, 12);
                gr.addColorStop(0, 'rgba(255,200,100,0.95)');
                gr.addColorStop(0.5, 'rgba(249,115,22,0.7)');
                gr.addColorStop(1, 'rgba(234,88,12,0)');
                ctx.fillStyle = gr;
                ctx.beginPath();
                ctx.arc(dx, dy, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
              }
            }
          }
        }
        for (const bp of beamPillars) {
          if (!bp.enemy.alive) continue;
          const bpx = bp.x - cameraX;
          if (bpx < -30 || bpx > VIEW_WIDTH + 30) continue;
          const topY = 0;
          const bottomY = bp.y;
          const beamHeight = bottomY - topY;
          const currentHeight = beamHeight * bp.progress;
          ctx.save();
          ctx.globalAlpha = 0.5 + bp.progress * 0.5;
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 14;
          const gradient = ctx.createLinearGradient(bpx, topY, bpx, bottomY);
          gradient.addColorStop(0, 'rgba(254,240,138,0.1)');
          gradient.addColorStop(0.3, 'rgba(250,204,21,0.4)');
          gradient.addColorStop(0.7, 'rgba(250,204,21,0.7)');
          gradient.addColorStop(1, 'rgba(254,240,138,0.95)');
          ctx.fillStyle = gradient;
          ctx.fillRect(bpx - 12, topY, 24, currentHeight);
          ctx.strokeStyle = 'rgba(254,240,138,0.9)';
          ctx.lineWidth = 2;
          ctx.strokeRect(bpx - 12, topY, 24, currentHeight);
          ctx.restore();
        }
        for (const w of windParticles) {
          const wx = w.x - cameraX;
          if (wx > -20 && wx < VIEW_WIDTH + 20) {
            ctx.save();
            ctx.globalAlpha = w.life / 25;
            const swirl = Math.sin(Date.now() * 0.015 + w.x * 0.01) * 6;
            const cx = wx + swirl, cy = w.y + Math.cos(Date.now() * 0.012) * 3;
            ctx.strokeStyle = 'rgba(148,163,184,' + (0.5 + w.life/50) + ')';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
              const r = 6 + i * 4 + Math.sin(Date.now() * 0.02 + i) * 2;
              ctx.beginPath();
              ctx.arc(cx - r * 0.3, cy, r, 0, Math.PI);
              ctx.stroke();
            }
            ctx.restore();
          }
        }
        for (const b of lightAuraBursts) {
          const bx = b.x - cameraX;
          if (bx > -50 && bx < VIEW_WIDTH + 50) {
            ctx.save();
            ctx.globalAlpha = b.life / 25;
            ctx.shadowColor = '#fef08a';
            ctx.shadowBlur = 20;
            ctx.strokeStyle = 'rgba(254,240,138,' + (0.6 + b.life/50) + ')';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(bx, b.y, b.r, 0, Math.PI * 2);
            ctx.stroke();
            for (let i = 0; i < 8; i++) {
              const a = (i / 8) * Math.PI * 2 + Date.now() * 0.01;
              ctx.beginPath();
              ctx.moveTo(bx, b.y);
              ctx.lineTo(bx + Math.cos(a) * b.r, b.y + Math.sin(a) * b.r);
              ctx.stroke();
            }
            ctx.restore();
          }
        }
        for (const sw of soundWaves) {
          const swx = sw.x - cameraX;
          if (swx + sw.r > -50 && swx - sw.r < VIEW_WIDTH + 50) {
            ctx.save();
            ctx.globalAlpha = sw.life / 50;
            ctx.shadowColor = '#f472b6';
            ctx.shadowBlur = 15;
            for (let ring = 0; ring < 3; ring++) {
              const r = sw.r - ring * 8 + (Math.sin(Date.now() * 0.03 + ring) * 4);
              if (r > 5) {
                ctx.strokeStyle = 'rgba(244,114,182,' + (0.4 + ring * 0.2) + ')';
                ctx.lineWidth = 3 + ring;
                ctx.beginPath();
                ctx.arc(swx, sw.y, r, 0, Math.PI * 2);
                ctx.stroke();
              }
            }
            ctx.restore();
          }
        }
        for (const pc of poisonClouds) {
          const pcx = pc.x - cameraX;
          if (pcx + pc.r > -50 && pcx - pc.r < VIEW_WIDTH + 50) {
            ctx.save();
            ctx.globalAlpha = pc.life / 35;
            ctx.shadowColor = '#84cc16';
            ctx.shadowBlur = 20;
            const gradient = ctx.createRadialGradient(pcx, pc.y, 0, pcx, pc.y, pc.r);
            gradient.addColorStop(0, 'rgba(132,204,22,0.6)');
            gradient.addColorStop(0.5, 'rgba(132,204,22,0.35)');
            gradient.addColorStop(1, 'rgba(132,204,22,0.1)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(pcx, pc.y, pc.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(132,204,22,0.8)';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.restore();
          }
        }
        for (const c of earthCracks) {
          const cx = c.x - cameraX;
          if (cx + c.w > -20 && cx < VIEW_WIDTH + 20) {
            ctx.save();
            ctx.globalAlpha = c.life / 20;
            ctx.strokeStyle = '#78716c';
            ctx.lineWidth = 3;
            for (let i = 0; i < 5; i++) {
              const bx = cx + i * 18 + Math.sin(i * 1.3) * 4;
              const by = c.y + (i % 2) * 6;
              ctx.beginPath();
              ctx.moveTo(bx, by);
              for (let seg = 0; seg < 4; seg++) {
                ctx.lineTo(bx + seg * 6 + Math.sin(seg) * 3, by + seg * 8 + (seg % 2) * 4);
              }
              ctx.stroke();
            }
            ctx.restore();
          }
        }
        for (const s of snowParticles) {
          const sx = s.x - cameraX;
          if (sx > -20 && sx < VIEW_WIDTH + 20) {
            ctx.save();
            ctx.globalAlpha = (s.life / 120) * (0.8 + Math.sin(Date.now() * 0.005 + s.x) * 0.2);
            const sz = (s.size || 18) * 0.4;
            const px = sx + Math.sin(Date.now() * 0.003) * 3;
            const gr = ctx.createRadialGradient(px, s.y, 0, px, s.y, sz * 1.5);
            gr.addColorStop(0, 'rgba(255,255,255,0.95)');
            gr.addColorStop(0.5, 'rgba(224,247,255,0.7)');
            gr.addColorStop(1, 'rgba(186,230,253,0)');
            ctx.fillStyle = gr;
            ctx.beginPath();
            ctx.arc(px, s.y, sz, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
        for (const vh of voidHoles) {
          const vhx = vh.x - cameraX;
          if (vhx + vh.r > -50 && vhx - vh.r < VIEW_WIDTH + 50) {
            ctx.save();
            ctx.translate(vhx, vh.y);
            const outerR = vh.r + 25;
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, outerR);
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(0.3, '#0a0015');
            gradient.addColorStop(0.6, 'rgba(30,27,75,0.8)');
            gradient.addColorStop(0.85, 'rgba(76,29,149,0.4)');
            gradient.addColorStop(1, 'rgba(76,29,149,0)');
            ctx.beginPath();
            ctx.arc(0, 0, outerR, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            for (let i = 0; i < 8; i++) {
              const a = vh.spin + (i / 8) * Math.PI * 2;
              ctx.save();
              ctx.rotate(a);
              ctx.strokeStyle = 'rgba(76,29,149,' + (0.5 + Math.sin(Date.now()*0.02 + i) * 0.3) + ')';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(0, 0, vh.r * 0.9, 0, Math.PI * 0.6);
              ctx.stroke();
              ctx.restore();
            }
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(0, 0, vh.r * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowColor = '#4c1d95';
            ctx.shadowBlur = 20;
            ctx.strokeStyle = 'rgba(76,29,149,0.9)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, vh.r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.restore();
          }
        }
        if (blackHole) {
          const bhx = blackHole.x - cameraX;
          if (bhx > -80 && bhx < VIEW_WIDTH + 80) {
            ctx.save();
            const pulse = 0.9 + Math.sin(blackHole.pulse) * 0.15;
            ctx.translate(bhx, blackHole.y);
            ctx.scale(pulse, pulse);
            ctx.beginPath();
            ctx.arc(0, 0, 50, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
            gradient.addColorStop(0, '#000');
            gradient.addColorStop(0.5, '#1a0a2e');
            gradient.addColorStop(1, 'rgba(76,29,149,0.4)');
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.strokeStyle = '#4c1d95';
            ctx.lineWidth = 2;
            ctx.stroke();
            for (let arm = 0; arm < 4; arm++) {
              const baseA = (arm / 4) * Math.PI * 2 + Date.now() * 0.015;
              ctx.beginPath();
              for (let t = 0; t <= 8; t++) {
                const a = baseA + t * 0.4;
                const r = 8 + t * 5 + Math.sin(t) * 3;
                const x = Math.cos(a) * r;
                const y = Math.sin(a) * r * 0.8;
                if (t === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.strokeStyle = 'rgba(76,29,149,' + (0.6 + Math.sin(Date.now()*0.02 + arm) * 0.2) + ')';
              ctx.lineWidth = 2;
              ctx.stroke();
            }
            ctx.restore();
          }
        }
        ctx.globalAlpha = 1;
        sister.draw();
        if (spaceshipAnimTimer <= 0) player.draw();
        if (phantomGhost && player.powerType === 'phantom' && player.powerLevel >= 3) {
          const lv = player.powerLevel;
          const ghostR = lv === 3 ? 14 : lv === 4 ? 18 : 22;
          const gx = phantomGhost.x - cameraX;
          if (gx > -40 && gx < VIEW_WIDTH + 40) {
            ctx.save();
            ctx.globalAlpha = 0.85 + Math.sin(Date.now() * 0.008) * 0.1;
            const gy = phantomGhost.y;
            const gr = ctx.createRadialGradient(gx, gy - ghostR * 0.5, 0, gx, gy, ghostR * 1.8);
            gr.addColorStop(0, 'rgba(255,255,255,0.5)');
            gr.addColorStop(0.4, 'rgba(192,132,252,0.6)');
            gr.addColorStop(0.7, 'rgba(147,51,234,0.4)');
            gr.addColorStop(1, 'rgba(147,51,234,0)');
            ctx.fillStyle = gr;
            ctx.beginPath();
            ctx.ellipse(gx, gy, ghostR * 0.85, ghostR * 1.1, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(30,27,75,0.7)';
            ctx.beginPath();
            ctx.arc(gx - ghostR * 0.3, gy - ghostR * 0.15, ghostR * 0.2, 0, Math.PI * 2);
            ctx.arc(gx + ghostR * 0.3, gy - ghostR * 0.15, ghostR * 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
        if (discoBallTimer > 0) {
          if (discoCollectFlash > 0) discoCollectFlash--;
          discoCollectParticles = discoCollectParticles.filter(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life--;
            if (p.life <= 0) return false;
            const sx = p.x - cameraX;
            if (sx < -30 || sx > VIEW_WIDTH + 30) return true;
            ctx.save();
            ctx.globalAlpha = p.life / 24;
            ctx.fillStyle = 'hsl(' + p.hue + ',90%,65%)';
            ctx.beginPath();
            ctx.arc(sx, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            return true;
          });
          if (discoCollectFlash > 0) {
            ctx.save();
            ctx.globalAlpha = discoCollectFlash / 25;
            ctx.fillStyle = '#ff6b9d';
            ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
            ctx.restore();
          }
          ctx.save();
          const gr = ctx.createRadialGradient(VIEW_WIDTH/2, 50, 0, VIEW_WIDTH/2, 50, 35);
          gr.addColorStop(0, 'rgba(255,255,255,0.9)');
          gr.addColorStop(0.4, 'hsl(' + (Date.now() * 0.5 % 360) + ',80%,70%)');
          gr.addColorStop(1, 'rgba(255,107,157,0.3)');
          ctx.fillStyle = gr;
          ctx.beginPath();
          ctx.arc(VIEW_WIDTH/2, 50, 28, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          for (const r of discoRays) {
            const rx = r.x + Math.cos(r.angle) * r.dist - cameraX;
            const ry = r.y + Math.sin(r.angle) * r.dist;
            if (rx < -20 || rx > VIEW_WIDTH + 20) continue;
            ctx.save();
            ctx.strokeStyle = 'hsla(' + r.hue + ',95%,75%,' + (r.life/25) * 0.6 + ')';
            ctx.lineWidth = r.thick || 2;
            ctx.beginPath();
            ctx.moveTo(VIEW_WIDTH/2, 50);
            ctx.lineTo(rx, ry);
            ctx.stroke();
            ctx.restore();
          }
          ctx.save();
          ctx.strokeStyle = 'rgba(255,107,157,0.12)';
          ctx.lineWidth = 2;
          const r1 = 55 + Math.sin(Date.now() * 0.005) * 8;
          ctx.beginPath();
          ctx.arc(VIEW_WIDTH/2, 50, r1, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        if ((levelStartTimer > 0 || sewerStartTimer > 0) && gameState === 'playing') {
          if (sewerStartTimer > 0) sewerStartTimer--;
          ctx.globalAlpha = 1;
          const t = levelStartTimer || sewerStartTimer || 1;
          const overlayAlpha = 0.08 * (t / 45);
          ctx.fillStyle = 'rgba(0,0,0,' + overlayAlpha + ')';
          ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 36px Fredoka One';
          ctx.textAlign = 'center';
          const levelName = inSpaceRealm ? 'SPACE' : (sewerDepth > 0 ? 'SEWER ' + sewerDepth : 'LEVEL ' + currentLevel);
          ctx.fillText(levelName, VIEW_WIDTH / 2, VIEW_HEIGHT / 2 - 25);
          const pwr = getLevelPower();
          ctx.font = '20px Nunito';
          ctx.fillStyle = POWER_COLOR[pwr] || '#ffd700';
          ctx.fillText((POWER_EMOJI[pwr] || '') + ' Power: ' + (pwr.charAt(0).toUpperCase() + pwr.slice(1)), VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 15);
          ctx.font = '18px Nunito';
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.fillText('Get ready!', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 45);
        }
        }
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
      }
