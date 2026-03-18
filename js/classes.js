/* classes.js - Player, DiscoSnailSister, Platform, PowerUp, PowerProjectile, Enemy, Coin, Pipe, CelestialGateway, TransitionManager, WaterPit, BonusItem */

class Player {
  constructor() {
    this.x = 100;
    this.y = GROUND_Y - 80;
    this.width = 36;
    this.height = 40;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.facingRight = true;
    this.big = false;
    this.powerType = null;
    this.powerLevel = 0;
    this.hasMagnet = false;
    this.hasSuperMagnet = false;
    this.hasWings = false;
    this.coyoteTimer = 0;
    this.jumpBuffer = 0;
    this.oxygen = typeof MAX_OXYGEN !== 'undefined' ? MAX_OXYGEN : 100;
    this.drowning = false;
    this.swimSoundCooldown = 0;
    this.jumpsRemaining = typeof MAX_JUMPS !== 'undefined' ? MAX_JUMPS : 2;
  }

  update() {
    const inTransition = typeof transitionManager !== 'undefined' && transitionManager && transitionManager.state === 'transition';
    const inWater = typeof inWaterRealm !== 'undefined' && inWaterRealm;
    const grav = inWater ? GRAVITY * 0.3 : (inSpaceRealm ? GRAVITY * 0.7 : GRAVITY);
    const speed = (typeof globalGameSpeed !== 'undefined' ? globalGameSpeed : 1);
    if (invincibleTimer > 0) invincibleTimer--;
    const wasOnGround = this.onGround;
    if (!inTransition) {
      if (keys['ArrowRight'] || keys['d']) {
        this.vx = MOVE_SPEED;
        this.facingRight = true;
      }
      if (keys['ArrowLeft'] || keys['a']) {
        this.vx = -MOVE_SPEED;
        this.facingRight = false;
      }
      const onGroundOrCoyote = this.onGround || (this.coyoteTimer > 0);
      const maxJ = this.hasWings ? 99 : (typeof MAX_JUMPS !== 'undefined' ? MAX_JUMPS : 2);
      if (onGroundOrCoyote) this.jumpsRemaining = maxJ;
      const canJump = (this.onGround || (this.coyoteTimer > 0) || (this.jumpBuffer > 0)) && this.jumpsRemaining > 0;
      const canDoubleJump = !this.onGround && (this.coyoteTimer <= 0 || this.hasWings) && this.jumpsRemaining > 0 && (this.hasWings ? this.vy >= -8 : this.vy >= -5);
      if (inWater) {
        if (keys[' '] || keys['ArrowUp'] || keys['w']) {
          this.vy = -5;
          if (!this.onGround && this.swimSoundCooldown <= 0) {
            playSound('swim');
            this.swimSoundCooldown = 18;
          }
        }
      } else if (keys[' '] || keys['ArrowUp'] || keys['w']) {
        if (canJump) {
          this.vy = JUMP_FORCE;
          this.onGround = false;
          this.coyoteTimer = 0;
          this.jumpBuffer = 0;
          this.jumpsRemaining--;
          playSound('jump');
          if (typeof addParticles === 'function') addParticles(this.x + this.width/2, this.y + this.height, 3, '#e0e7ff');
        } else if (canDoubleJump) {
          this.vy = this.hasWings ? JUMP_FORCE * 0.88 : JUMP_FORCE * 0.92;
          this.jumpBuffer = 0;
          this.jumpsRemaining--;
          playSound('jump');
          if (typeof addParticles === 'function') addParticles(this.x + this.width/2, this.y + this.height, 3, '#e0e7ff');
        } else if (!this.onGround && this.vy >= 0) {
          this.jumpBuffer = 6; /* שמירת לחיצה ל-6 פריימים לפני נחיתה */
        }
      }
    }
    if (this.jumpBuffer > 0) this.jumpBuffer--;
    if (!inWater && !inTransition && this.vy < 0 && !(keys[' '] || keys['ArrowUp'] || keys['w']) && typeof JUMP_FORCE !== 'undefined') {
      this.vy = Math.max(this.vy, JUMP_FORCE * 0.55);
    }
    const friction = this.onGround ? FRICTION : AIR_CONTROL;
    this.vx *= friction;
    this.vy += grav;
    this.x += this.vx * speed;
    this.y += this.vy * speed;
    if (wasOnGround && !this.onGround) this.coyoteTimer = 8;
    else if (this.coyoteTimer > 0) this.coyoteTimer--;
    if (this.swimSoundCooldown > 0) this.swimSoundCooldown--;
    this.onGround = false;

    if (sewerDepth > 0) {
      this.x = Math.max(0, Math.min(SEWER_WIDTH - this.width, this.x));
    }
    if (typeof inWaterRealm !== 'undefined' && inWaterRealm && typeof WATER_WIDTH !== 'undefined') {
      this.x = Math.max(0, Math.min(WATER_WIDTH - this.width, this.x));
    }

    const h = this.big ? 56 : 40;
    if (this.y > VIEW_HEIGHT - h && !(typeof inWaterRealm !== 'undefined' && inWaterRealm)) this.die();
  }

  die() {
    playSound('death');
    screenShake = 15;
    addParticles(player.x + player.width/2, player.y + player.height/2, 10, '#ff6b9d');
    if (typeof addParticles === 'function') addParticles(player.x + player.width/2, player.y + player.height/2, 4, '#ff6b9d', '💔');
    lives--;
    this.big = false;
    this.powerType = null;
    this.powerLevel = 0;
    this.hasMagnet = false;
    this.hasSuperMagnet = false;
    this.hasWings = false;
    this.height = 40;
    updateHUD();
    if (lives <= 0) {
      if (typeof highScore !== 'undefined' && score > highScore) highScore = score;
      if (typeof saveGameState === 'function') saveGameState();
      playSound('gameOver');
      gameState = 'gameover';
      if (typeof stopMapMusic === 'function') stopMapMusic();
      if (typeof stopBossMusic === 'function') stopBossMusic();
      if (typeof showLeaderboard === 'function') showLeaderboard(score, false);
    } else {
      invincibleTimer = 90;
      stoneGiantNoHitTimer = 0;
      const pushBack = 140;
      let newCam = Math.max(0, cameraX - pushBack);
      if (sewerDepth > 0) newCam = Math.min(newCam, Math.max(0, SEWER_WIDTH - VIEW_WIDTH));
      else if (typeof inWaterRealm !== 'undefined' && inWaterRealm) newCam = Math.min(newCam, Math.max(0, WATER_WIDTH - VIEW_WIDTH));
      cameraX = targetCameraX = newCam;
      this.x = cameraX + 100;
      this.y = VIEW_HEIGHT / 2 - this.height / 2;
      this.vx = 0;
      this.vy = 0;
      this.jumpsRemaining = typeof MAX_JUMPS !== 'undefined' ? MAX_JUMPS : 2;
      if (typeof sister !== 'undefined' && sister) { sister.x = this.x - 80; sister.y = this.y; }
    }
  }

  draw() {
    const sx = this.x - cameraX;
    if (stoneGiantTimer > 0) {
      const giantH = Math.floor(VIEW_HEIGHT * 0.75);
      const giantW = Math.floor(giantH * 36 / 40);
      const growFrames = 25, shrinkFrames = 25;
      let scale = 1;
      if (stoneGiantTimer > 300 - growFrames) {
        scale = (300 - stoneGiantTimer) / growFrames;
      } else if (stoneGiantTimer <= shrinkFrames) {
        scale = stoneGiantTimer / shrinkFrames;
      }
      if (sx + giantW < -40 || sx > VIEW_WIDTH + 40) return;
      const cx = sx + this.width/2;
      const cy = this.y + this.height/2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.translate(-cx, -cy);
      const gr = ctx.createRadialGradient(cx, cy - giantH * 0.3, 0, cx, cy, giantH * 0.7);
      gr.addColorStop(0, 'rgba(255,255,255,0.4)');
      gr.addColorStop(0.3, 'rgba(120,113,108,0.95)');
      gr.addColorStop(0.7, 'rgba(87,83,78,0.9)');
      gr.addColorStop(1, 'rgba(68,64,60,0.85)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.ellipse(cx, cy - giantH * 0.1, giantW * 0.45, giantH * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(87,83,78,0.9)';
      ctx.beginPath();
      ctx.ellipse(cx, cy - giantH * 0.35, giantW * 0.25, giantH * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }
    if (sx + this.width < -20 || sx > VIEW_WIDTH + 20) return;
    const h = this.big ? 56 : 40;
    const size = this.big ? 48 : 36;
    if (invincibleTimer > 0) {
      if (invincibleTimer > 30 && Math.floor(invincibleTimer / 5) % 2 === 0) return;
    }
    if (this.drowning && (this.drowningAlpha || 1) <= 0) return;
    ctx.save();
    if (this.drowning && (this.drowningAlpha !== undefined)) {
      ctx.globalAlpha = this.drowningAlpha;
    }
    if (this.powerType === 'stone' && this.powerLevel >= 5 && typeof stoneGiantTimer !== 'undefined' && stoneGiantTimer <= 0 && typeof stoneGiantCooldown !== 'undefined' && stoneGiantCooldown <= 0) {
      const pulse = Math.sin(Date.now() / 80) * 8 + 16;
      ctx.shadowColor = POWER_COLOR.stone || '#78716c';
      ctx.shadowBlur = pulse;
    } else if (typeof discoBallTimer !== 'undefined' && discoBallTimer > 0) {
      ctx.shadowColor = 'hsl(' + (Date.now() * 3 % 360) + ',90%,65%)';
      ctx.shadowBlur = 25;
    } else if (this.powerType) {
      const c = POWER_COLOR[this.powerType] || '#fff';
      ctx.shadowColor = c;
      ctx.shadowBlur = 12 + this.powerLevel * 3;
    } else if (this.big) {
      ctx.shadowColor = '#ff6b9d';
      ctx.shadowBlur = 8;
    }
    ctx.font = size + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const cx = sx + this.width / 2, cy = this.y + h / 2;
    /* Swim rotation: -15° when swimming up, +15° when sinking. Drowning: upside down */
    let swimRotation = 0;
    if (typeof inWaterRealm !== 'undefined' && inWaterRealm) {
      if (this.drowning) {
        swimRotation = Math.PI;
      } else {
        swimRotation = this.vy < 0 ? -15 * Math.PI / 180 : (this.vy > 0 ? 15 * Math.PI / 180 : 0);
      }
    }
    if (this.facingRight) {
      ctx.translate(cx, cy);
      ctx.scale(-1, 1);
      ctx.translate(-cx, -cy);
    }
    if (swimRotation !== 0) {
      ctx.translate(cx, cy);
      ctx.rotate(swimRotation);
      ctx.translate(-cx, -cy);
    }
    ctx.fillText(EMOJI.player, cx, cy);
    ctx.restore();
    /* פריטים ויזואליים על החילזון - מוצגים מעל הגוף */
    const itemSize = 14;
    const itemY = cy - h * 0.55;
    const items = [];
    if (this.hasWings) items.push({ emoji: EMOJI.wings || '🪽', size: itemSize + 2, bob: 0.015 });
    if (this.hasMagnet) items.push({ emoji: this.hasSuperMagnet ? '🧲' : (EMOJI.magnet || '🧲'), size: itemSize, bob: 0.02 });
    if (typeof shieldBonusTimer !== 'undefined' && shieldBonusTimer > 0) items.push({ emoji: EMOJI.shield || '🛡️', size: itemSize - 2, bob: 0.03 });
    if (typeof timeShieldTimer !== 'undefined' && timeShieldTimer > 0) items.push({ emoji: EMOJI.timeShield || '⏱️', size: itemSize - 2, bob: 0.025 });
    if (typeof doubleCoinsTimer !== 'undefined' && doubleCoinsTimer > 0) items.push({ emoji: EMOJI.doubleCoins || '💰', size: itemSize - 2, bob: 0.02 });
    if (typeof discoBallTimer !== 'undefined' && discoBallTimer > 0) items.push({ emoji: EMOJI.disco || '🪩', size: itemSize - 2, bob: 0.04 });
    if (this.powerType && typeof POWER_EMOJI !== 'undefined') items.push({ emoji: POWER_EMOJI[this.powerType] || '✨', size: itemSize - 3, bob: 0.015 });
    const spacing = itemSize * 1.4;
    const totalW = (items.length - 1) * spacing;
    const startX = cx - totalW / 2;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      ctx.save();
      ctx.font = it.size + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = 0.9 + Math.sin(Date.now() * (it.bob || 0.02)) * 0.1;
      const by = it.bob ? itemY + Math.sin(Date.now() * it.bob) * 2 : itemY;
      ctx.fillText(it.emoji, startX + i * spacing, by);
      ctx.restore();
    }
  }
}

class DiscoSnailSister {
  constructor() {
    this.x = 50;
      this.y = GROUND_Y - 80;
    this.width = 36;
    this.height = 40;
    this.targetX = 0;
    this.targetY = 0;
    this.facingRight = true;
  }
  update() {
    if (typeof player === 'undefined' || !player) return;
    this.targetX = player.x - 90;
    this.targetY = (sewerDepth > 0 ? SEWER_GROUND : GROUND_Y) - 80;
    if (inSpaceRealm) this.targetY = GROUND_Y - 80;
    this.facingRight = player.facingRight;
    this.x += (this.targetX - this.x) * 0.06;
    this.y += (this.targetY - this.y) * 0.1;
  }
  draw() {
    const sx = this.x - cameraX;
    if (sx + this.width < -50 || sx > VIEW_WIDTH + 50) return;
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(EMOJI.sister, sx + this.width / 2, this.y + this.height / 2);
  }
}

class Platform {
  constructor(x, y, w, h, type, content) {
    this.x = x; this.y = y; this.width = w; this.height = h;
    this.type = type || 'ground';
    this.hit = false;
    this.content = content || 'coin';
    this.bounceOffset = 0;
  }
  draw() {
    const screenX = this.x - cameraX;
    if (screenX + this.width < 0 || screenX > VIEW_WIDTH) return;
    ctx.save();
    if (this.type === 'ground') {
      const g = ctx.createLinearGradient(screenX, this.y, screenX + this.width, this.y + this.height);
      if (inSpaceRealm || this.spaceStyle) {
        const neon = (inSpaceRealm && SPACE_NEON_COLORS) ? (SPACE_NEON_COLORS[spaceStage] || '#00FFFF') : '#00FFFF';
        g.addColorStop(0, '#0f172a');
        g.addColorStop(0.5, '#1e293b');
        g.addColorStop(1, '#0a0f1a');
        ctx.fillStyle = g;
        ctx.fillRect(screenX, this.y, this.width, this.height);
        ctx.fillStyle = '#ffffff';
        const stars = Math.min(12, Math.ceil(this.width / 80) * 2);
        for (let i = 0; i < stars; i++) {
          const sx = screenX + (i * 37 % Math.max(1, this.width - 8)) + 4;
          const sy = this.y + (i * 23 % Math.max(1, this.height - 8)) + 4;
          ctx.fillRect(sx, sy, 2, 2);
        }
        ctx.strokeStyle = neon;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
        ctx.strokeRect(screenX, this.y, this.width, this.height);
      } else if (sewerDepth > 0) {
        const c = ['#2d2d2d','#252525','#1a1a1a','#151515','#0d0d0d'][sewerDepth - 1] || '#1a1a1a';
        g.addColorStop(0, c);
        g.addColorStop(0.3, c);
        g.addColorStop(0.7, '#1a1a1a');
        g.addColorStop(1, '#0d0d0d');
        ctx.fillStyle = g;
        ctx.fillRect(screenX, this.y, this.width, this.height);
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(screenX, this.y, this.width, 6);
      } else {
        const base = getLevelTheme().groundColor || '#5d4e37';
        g.addColorStop(0, base);
        g.addColorStop(0.2, '#6b5b45');
        g.addColorStop(0.5, base);
        g.addColorStop(0.8, '#4a3d2e');
        g.addColorStop(1, base);
        ctx.fillStyle = g;
        ctx.fillRect(screenX, this.y, this.width, this.height);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        for (let i = 0; i < Math.ceil(this.width / 64); i++) {
          ctx.fillRect(screenX + i * 64, this.y, 1, this.height);
        }
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(screenX, this.y, this.width, 6);
      }
    } else {
      const yOff = this.bounceOffset;
      let emoji = EMOJI.brick;
      if (this.type === 'question') emoji = this.hit ? EMOJI.empty : EMOJI.question;
      else if (this.type === 'block') emoji = this.hit ? EMOJI.empty : EMOJI.block;
      else if (this.type === 'brick') emoji = this.hit ? EMOJI.empty : (this.waterStyle ? (EMOJI.coral || '🪸') : (this.spaceStyle ? '🌌' : EMOJI.brick));
      if (this.waterStyle) {
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX + 2, this.y + 2, this.width - 4, this.height - 4);
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
      } else if (this.spaceStyle) {
        const neonColor = (inSpaceRealm && SPACE_NEON_COLORS) ? (SPACE_NEON_COLORS[spaceStage] || '#00FFFF') : '#00FFFF';
        ctx.strokeStyle = neonColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX + 2, this.y + 2, this.width - 4, this.height - 4);
        ctx.shadowColor = neonColor;
        ctx.shadowBlur = 8;
      }
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, screenX + this.width / 2, this.y + this.height / 2 + yOff);
    }
    ctx.restore();
  }
}

class PowerUp {
  constructor(x, y, type, goLeft) {
    this.x = x; this.y = y; this.width = 28; this.height = 28;
    this.type = type;
    this.vx = (type === 'fire' || type === 'light') ? 0 : (goLeft ? -1.5 : 1.5);
    this.vy = (type === 'fire' || type === 'light') ? -2 : -3;
    this.collected = false;
    this.spawnTimer = 20;
    this.lifeTimer = 420;
    this.onGround = false;
  }
  update(platforms) {
    if (this.collected) return;
    this.lifeTimer--;
    if (this.lifeTimer <= 0) { this.collected = true; return; }
    if (this.type !== 'fire' && this.type !== 'light') this.x += this.vx;
    if (!this.onGround) this.vy += GRAVITY * 0.5;
    this.y += this.vy;
    this.onGround = false;
    for (const p of platforms) {
      const overlapX = this.x + this.width > p.x && this.x < p.x + p.width;
      const prevBottom = this.y + this.height - this.vy;
      const currBottom = this.y + this.height;
      if (this.vy > 0 && overlapX && currBottom >= p.y - 2 && prevBottom <= p.y + 6) {
        this.y = p.y - this.height;
        this.vy = 0;
        this.onGround = true;
      }
      if (this.onGround && this.type !== 'fire' && this.type !== 'light' && p.type !== 'ground' && this.vx !== 0) {
        if (this.vx > 0 && this.x + this.width > p.x && this.x - this.vx + this.width <= p.x &&
            this.y + this.height > p.y && this.y < p.y + p.height) {
          this.vx = -this.vx;
          this.x = p.x - this.width;
        } else if (this.vx < 0 && this.x < p.x + p.width && this.x - this.vx >= p.x + p.width &&
            this.y + this.height > p.y && this.y < p.y + p.height) {
          this.vx = -this.vx;
          this.x = p.x + p.width;
        }
      }
    }
    if (this.y > VIEW_HEIGHT) this.collected = true;
  }
  draw() {
    if (this.collected) return;
    const screenX = this.x - cameraX;
    if (screenX + this.width < -20 || screenX > VIEW_WIDTH + 20) return;
    if (this.spawnTimer > 0) this.spawnTimer--;
    const emoji = this.type === '1up' ? EMOJI.mushroomGreen : (POWER_TYPES.includes(this.type) ? POWER_EMOJI[this.type] : (this.type === 'super' ? EMOJI.mushroom : EMOJI.flower));
    ctx.save();
    if (this.spawnTimer > 0) {
      const scale = 1 + (this.spawnTimer / 20) * 0.5;
      ctx.translate(screenX + this.width/2, this.y + this.height/2);
      ctx.scale(scale, scale);
      ctx.globalAlpha = Math.min(1, 1 - this.spawnTimer / 25);
    }
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, this.spawnTimer > 0 ? 0 : screenX + this.width/2, this.spawnTimer > 0 ? 0 : this.y + this.height/2);
    ctx.restore();
  }
}

class PowerProjectile {
  constructor(x, y, type, level, right, angle) {
    this.x = x; this.y = y; this.type = type; this.level = level;
    this.angle = angle !== undefined ? angle : 0;
    const spd = 7 + level * 2.5;
    const dir = right ? 1 : -1;
    this.vx = Math.cos(this.angle * Math.PI/180) * spd * dir;
    this.vy = Math.sin(this.angle * Math.PI/180) * spd * dir - (['earth','stone','vortex','meteor','prism'].includes(type) ? 4 : (type === 'fire' && level >= 3 ? 2 : 0));
    this.bounced = 0;
    this.life = (type === 'fire' && level >= 4) ? 50 : (type === 'light' && level >= 4) ? 45 : (type === 'lightning' && level >= 4) ? 35 : (type === 'plasma' && level >= 4) ? 45 : (type === 'void' && level >= 4) ? 60 : 999;
    this.active = true;
    const beam = (type === 'fire' && level >= 3) || (type === 'light' && level >= 3) || (type === 'plasma' && level >= 3) || (type === 'prism' && level >= 3) || (type === 'beam' && level >= 3);
    this.w = beam ? 28 + level * 6 : 18 + level * 5;
    this.h = beam ? 12 + level * 2 : 18 + level * 5;
    this.width = this.w; this.height = this.h;
  }
  update(platforms) {
    if (!this.active) return;
    this.life--;
    if (this.life <= 0) { this.active = false; return; }
    const gravityTypes = ['earth','stone','water','nature','vortex','meteor','prism'];
    if (gravityTypes.includes(this.type)) this.vy += GRAVITY * 0.5;
    this.x += this.vx;
    this.y += this.vy;
    const bounceTypes = ['earth','stone','vortex','meteor','prism'];
    if (bounceTypes.includes(this.type)) {
      const groundY = sewerDepth > 0 ? SEWER_GROUND : GROUND_Y;
      if (this.y + this.height >= groundY - 2) {
        this.y = groundY - this.height;
        this.vy = -this.vy * 0.5;
        this.bounced++;
        if (this.bounced >= 2) this.vy = 0;
      }
      for (const p of platforms) {
        const ox = this.x + this.width > p.x && this.x < p.x + p.width;
        if (this.vy > 0 && ox && this.y + this.height >= p.y - 2 && this.y + this.height - this.vy <= p.y + 10) {
          this.y = p.y - this.height;
          this.vy = -this.vy * 0.4;
          this.bounced++;
        }
        if (this.vx > 0 && this.x + this.width > p.x && this.x - this.vx + this.width <= p.x && this.y + this.height > p.y && this.y < p.y + p.height) {
          this.vx = -this.vx * 0.8;
          this.x = p.x - this.width;
        } else if (this.vx < 0 && this.x < p.x + p.width && this.x - this.vx >= p.x + p.width && this.y + this.height > p.y && this.y < p.y + p.height) {
          this.vx = -this.vx * 0.8;
          this.x = p.x + p.width;
        }
      }
    }
    if (this.x < cameraX - 80 || this.x > cameraX + VIEW_WIDTH + 80 || this.y > VIEW_HEIGHT + 50) this.active = false;
  }
  draw() {
    if (!this.active) return;
    const sx = this.x - cameraX;
    if (sx + this.width < -40 || sx > VIEW_WIDTH + 40) return;
    const cx = sx + this.width/2;
    const cy = this.y + this.height/2;
    const color = POWER_COLOR[this.type] || '#fff';
    const size = 8 + this.level * 3;
    ctx.save();
    ctx.globalAlpha = 0.9 + Math.sin(Date.now() * 0.05) * 0.1;
    const t = this.type;
    if (t === 'fire') {
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.5);
      gr.addColorStop(0, 'rgba(255,220,150,0.95)');
      gr.addColorStop(0.5, 'rgba(249,115,22,0.8)');
      gr.addColorStop(1, 'rgba(234,88,12,0)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.fill();
    } else if (t === 'water') {
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.4);
      gr.addColorStop(0, 'rgba(165,243,252,0.95)');
      gr.addColorStop(0.5, 'rgba(14,165,233,0.8)');
      gr.addColorStop(1, 'rgba(2,132,199,0)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.ellipse(cx, cy, size * 0.9, size * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (t === 'ice') {
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.3);
      gr.addColorStop(0, 'rgba(224,247,255,0.95)');
      gr.addColorStop(0.5, 'rgba(56,189,248,0.7)');
      gr.addColorStop(1, 'rgba(14,165,233,0)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.fill();
    } else if (t === 'lightning') {
      ctx.strokeStyle = 'rgba(254,240,138,0.95)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - size * 0.6, cy - size);
      ctx.lineTo(cx + size * 0.3, cy);
      ctx.lineTo(cx - size * 0.3, cy);
      ctx.lineTo(cx + size * 0.6, cy + size);
      ctx.stroke();
    } else if (t === 'earth' || t === 'stone') {
      ctx.fillStyle = t === 'stone' ? '#57534e' : '#78716c';
      ctx.beginPath();
      ctx.ellipse(cx, cy, size * 1.1, size * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (t === 'wind') {
      ctx.strokeStyle = 'rgba(148,163,184,0.9)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const off = i * 0.4 + Date.now() * 0.002;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(off) * size * 0.5, cy, size * 0.8, 0, Math.PI);
        ctx.stroke();
      }
    } else if (t === 'nature') {
      const gr = ctx.createRadialGradient(cx, cy - size * 0.3, 0, cx, cy, size * 1.2);
      gr.addColorStop(0, 'rgba(134,239,172,0.95)');
      gr.addColorStop(0.5, 'rgba(34,197,94,0.8)');
      gr.addColorStop(1, 'rgba(22,163,74,0)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.ellipse(cx, cy, size * 0.8, size * 1.1, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (t === 'shadow') {
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.5);
      gr.addColorStop(0, 'rgba(76,29,149,0.8)');
      gr.addColorStop(0.6, 'rgba(76,29,149,0.4)');
      gr.addColorStop(1, 'rgba(30,27,75,0)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.fill();
    } else if (t === 'light' || t === 'beam') {
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 2);
      gr.addColorStop(0, 'rgba(254,240,138,0.95)');
      gr.addColorStop(0.4, 'rgba(250,204,21,0.6)');
      gr.addColorStop(1, 'rgba(254,240,138,0)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 1.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (t === 'plasma' || t === 'meteor') {
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.5);
      gr.addColorStop(0, 'rgba(255,220,150,0.95)');
      gr.addColorStop(0.4, 'rgba(251,191,36,0.7)');
      gr.addColorStop(0.8, 'rgba(249,115,22,0.3)');
      gr.addColorStop(1, 'rgba(234,88,12,0)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.fill();
    } else if (t === 'toxic') {
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.3);
      gr.addColorStop(0, 'rgba(190,242,100,0.9)');
      gr.addColorStop(0.5, 'rgba(132,204,22,0.7)');
      gr.addColorStop(1, 'rgba(84,204,22,0)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.fill();
    } else if (t === 'phantom') {
      ctx.globalAlpha *= 0.7;
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.5);
      gr.addColorStop(0, 'rgba(192,132,252,0.6)');
      gr.addColorStop(0.6, 'rgba(147,51,234,0.3)');
      gr.addColorStop(1, 'rgba(147,51,234,0)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.fill();
    } else if (t === 'prism') {
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.2);
      gr.addColorStop(0, 'rgba(255,255,255,0.9)');
      gr.addColorStop(0.3, 'rgba(103,232,249,0.7)');
      gr.addColorStop(0.7, 'rgba(147,51,234,0.4)');
      gr.addColorStop(1, 'rgba(103,232,249,0)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.fill();
    } else if (t === 'void') {
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.5);
      gr.addColorStop(0, 'rgba(30,27,75,0.9)');
      gr.addColorStop(0.5, 'rgba(76,29,149,0.5)');
      gr.addColorStop(1, 'rgba(76,29,149,0)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.fill();
    } else if (t === 'vortex') {
      ctx.strokeStyle = 'rgba(129,140,248,0.9)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Date.now() * 0.01;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * size * 0.5, cy + Math.sin(a) * size * 0.5, size * 0.6, 0, Math.PI * 0.8);
        ctx.stroke();
      }
    } else if (t === 'sound') {
      ctx.strokeStyle = 'rgba(244,114,182,0.9)';
      ctx.lineWidth = 2;
      for (let r = size * 0.4; r <= size; r += size * 0.3) {
        ctx.globalAlpha = 1 - r / (size * 1.5);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (t === 'time') {
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.2);
      gr.addColorStop(0, 'rgba(167,139,250,0.9)');
      gr.addColorStop(0.6, 'rgba(139,92,246,0.5)');
      gr.addColorStop(1, 'rgba(139,92,246,0)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = color;
      ctx.globalAlpha *= 0.9;
      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

class Enemy {
  constructor(x, y, type) {
    this.x = x; this.y = y;
    this.type = type || 'turtle';
    const small = ['fish', 'rat', 'spider', 'spacefly', 'jellyfish'].includes(type);
    this.width = small ? 35 : 40;
    this.height = small ? 35 : 40;
    this.vx = (type === 'fish' || type === 'spider' || type === 'jellyfish') ? (rand(0, 1) ? 2 : -2) : (type === 'spacefly' ? 0 : type === 'cyberant' ? (rand(0, 1) ? 1.8 : -1.8) : (rand(0, 1) ? 1.5 : -1.5));
    this.vy = (type === 'fish' || type === 'spider' || type === 'jellyfish') ? -1.5 : (type === 'spacefly' ? 0 : type === 'cyberant' ? 0 : 0);
    this.alive = true;
    this.orbitPhase = type === 'spacefly' ? Math.random() * Math.PI * 2 : 0;
    this.jetpackHover = type === 'cyberant' ? 0 : null;
    this.deathTimer = 0;
    this.freezeTimer = 0;
    this.flowerForm = false;
    this.flowerShootTimer = 0;
    this.sickTimer = 0;
    this.sickMaxTimer = 30;
  }
  update(platforms) {
    if (this.deathTimer > 0) { this.deathTimer--; return; }
    if (!this.alive) return;
    if (this.vortexLifted) return;
    if (this.prismLifted) return;
    if ((this.freezeTimer || 0) > 0) { this.freezeTimer--; return; }
    if (this.flowerForm) return;
    const timeSlow = typeof enemyTimeSlow !== 'undefined' ? enemyTimeSlow : 1;
    const grav = (inSpaceRealm ? GRAVITY * 0.7 : GRAVITY) * timeSlow;
    const prevX = this.x;
    if (this.type === 'spacefly') {
      this.orbitPhase += 0.04 * timeSlow;
      this.orbitBaseX = this.orbitBaseX ?? this.x;
      this.orbitBaseY = this.orbitBaseY ?? this.y;
      const figure8 = Math.sin(this.orbitPhase) * 70;
      const vert = Math.sin(this.orbitPhase * 2) * 45;
      this.x = this.orbitBaseX + figure8;
      this.y = this.orbitBaseY + vert;
      return;
    }
    if (this.type === 'cyberant') {
      this.jetpackHover = this.jetpackHover ?? 0;
      if (this.jetpackHover > 0) {
        this.jetpackHover--;
        this.vy = 0;
      } else {
        this.vy += grav * 0.5;
        this.y += this.vy * timeSlow;
      }
      this.x += this.vx * timeSlow;
      for (const p of platforms) {
        const prevBottom = this.y + this.height - this.vy;
        const currBottom = this.y + this.height;
        if (this.vy > 0 && currBottom >= p.y - 2 && prevBottom <= p.y + 4) {
          if (this.x + this.width > p.x && this.x < p.x + p.width) {
            this.y = p.y - this.height;
            this.vy = 0;
            if (Math.random() < 0.008) {
              this.jetpackHover = 30;
              this.vy = -6;
            }
          }
        }
        if (p.type !== 'ground' && this.vx !== 0) {
          if (this.vx > 0 && this.x + this.width > p.x && prevX + this.width <= p.x && this.y + this.height > p.y && this.y < p.y + p.height) { this.vx = -this.vx; this.x = p.x - this.width; }
          else if (this.vx < 0 && this.x < p.x + p.width && prevX >= p.x + p.width && this.y + this.height > p.y && this.y < p.y + p.height) { this.vx = -this.vx; this.x = p.x + p.width; }
        }
      }
      if (this.y > VIEW_HEIGHT) this.alive = false;
      if (this.x < cameraX - 50) this.alive = false;
      return;
    }
    this.x += this.vx * timeSlow;
    if (this.type === 'fish' || this.type === 'spider' || this.type === 'jellyfish') {
      this.y += this.vy * timeSlow;
      const minY = this.type === 'spider' ? 150 : (this.type === 'jellyfish' ? 100 : 200);
      const maxY = this.type === 'spider' ? 320 : (this.type === 'jellyfish' ? 380 : 350);
      if (this.y < minY) this.vy = 1.5;
      if (this.y > maxY) this.vy = -1.5;
      for (const p of platforms) {
        if (p.type === 'ground') continue;
        if (this.vx > 0 && this.x + this.width > p.x && prevX + this.width <= p.x && this.y + this.height > p.y && this.y < p.y + p.height) {
          this.vx = -this.vx;
          this.x = p.x - this.width;
        } else if (this.vx < 0 && this.x < p.x + p.width && prevX >= p.x + p.width && this.y + this.height > p.y && this.y < p.y + p.height) {
          this.vx = -this.vx;
          this.x = p.x + p.width;
        }
      }
    } else {
      this.vy += grav * 0.5;
      this.y += this.vy * timeSlow;
      for (const p of platforms) {
        const prevBottom = this.y + this.height - this.vy;
        const currBottom = this.y + this.height;
        if (this.vy > 0 && currBottom >= p.y - 2 && prevBottom <= p.y + 4) {
          if (this.x + this.width > p.x && this.x < p.x + p.width) {
            this.y = p.y - this.height;
            this.vy = 0;
          }
        }
        if (p.type !== 'ground' && this.vx !== 0) {
          if (this.vx > 0 && this.x + this.width > p.x && prevX + this.width <= p.x &&
              this.y + this.height > p.y && this.y < p.y + p.height) {
            this.vx = -this.vx;
            this.x = p.x - this.width;
          } else if (this.vx < 0 && this.x < p.x + p.width && prevX >= p.x + p.width &&
              this.y + this.height > p.y && this.y < p.y + p.height) {
            this.vx = -this.vx;
            this.x = p.x + p.width;
          }
        }
      }
      if (this.y > VIEW_HEIGHT) this.alive = false;
    }
    if (this.x < cameraX - 50 && this.deathTimer <= 0) this.alive = false;
  }
  draw() {
    const screenX = this.x - cameraX;
    if (screenX + this.width < 0 || screenX > VIEW_WIDTH) return;
    if (this.deathTimer > 0) {
      ctx.save();
      ctx.globalAlpha = this.deathTimer / 15;
      const squash = 1 - (15 - this.deathTimer) / 15 * 0.5;
      ctx.translate(screenX + this.width/2, this.y + this.height/2);
      ctx.scale(1.3, squash);
      ctx.translate(-(screenX + this.width/2), -(this.y + this.height/2));
      const emoji = (this.type === 'fish' && EMOJI.fish) || (this.type === 'rat' && EMOJI.rat) || (this.type === 'spider' && EMOJI.spider) || (this.type === 'spacefly' && EMOJI.spacefly) || (this.type === 'cyberant' && EMOJI.cyberant) || (this.type === 'crab' && EMOJI.crab) || (this.type === 'jellyfish' && EMOJI.jellyfish) || EMOJI.turtle;
      ctx.font = '35px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, screenX + this.width / 2, this.y + this.height / 2);
      ctx.restore();
      return;
    }
    if (!this.alive) return;
    const emoji = this.flowerForm ? EMOJI.flower : ((this.type === 'fish' && EMOJI.fish) || (this.type === 'rat' && EMOJI.rat) || (this.type === 'spider' && EMOJI.spider) || (this.type === 'spacefly' && EMOJI.spacefly) || (this.type === 'cyberant' && EMOJI.cyberant) || (this.type === 'crab' && EMOJI.crab) || (this.type === 'jellyfish' && EMOJI.jellyfish) || EMOJI.turtle);
    let bob = (this.freezeTimer || 0) > 0 ? 0 : (this.flowerForm ? Math.sin(Date.now() * 0.006) * 3 : Math.sin(Date.now() * 0.004 + this.x * 0.01) * 2);
    if ((typeof discoBallTimer !== 'undefined' && discoBallTimer > 0) || enemiesDanceFromDisco) {
      bob += Math.sin(Date.now() * 0.02 + this.x * 0.02) * 10;
      bob += Math.sin(Date.now() * 0.03 + this.x * 0.01) * 4;
    }
    /* Shadow under enemy - improves visibility (lighter for flying) */
    const isFlying = ['fish', 'spider', 'jellyfish'].includes(this.type);
    const shadowY = isFlying ? 4 : 6;
    ctx.save();
    ctx.globalAlpha = isFlying ? 0.12 : 0.22;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(screenX + this.width/2, this.y + this.height + shadowY, this.width * 0.35, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    /* Single save/restore for all effects - avoids LIFO ordering bugs and alpha/shadow bleed */
    ctx.save();
    if ((this.timeSlowed || false)) {
      ctx.shadowColor = '#a78bfa';
      ctx.shadowBlur = 28;
      ctx.globalAlpha = 0.9;
    }
    if ((this.sickTimer || 0) > 0) {
      const maxT = this.sickMaxTimer || 30;
      const progress = 1 - (this.sickTimer / maxT);
      const pulseSpeed = 0.01 + progress * 0.04;
      const glowIntensity = 0.4 + progress * 0.6;
      ctx.shadowColor = '#84cc16';
      ctx.shadowBlur = 20 + progress * 30;
      ctx.globalAlpha = 0.6 + Math.sin(Date.now() * pulseSpeed) * glowIntensity * 0.4;
    }
    if (this.prismLifted) {
      ctx.shadowColor = '#67e8f9';
      ctx.shadowBlur = 25 + Math.sin(Date.now() * 0.08) * 10;
      ctx.globalAlpha = 0.9 + Math.sin(Date.now() * 0.06) * 0.1;
    }
    if (inSpaceRealm && (this.type === 'spacefly' || this.type === 'cyberant')) {
      ctx.shadowColor = '#00FFFF';
      ctx.shadowBlur = 12 + Math.sin(Date.now() * 0.05) * 6;
    } else if (sewerDepth > 0) {
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 6 + Math.sin(Date.now() * 0.03) * 2;
    } else if (!this.timeSlowed && !this.sickTimer && !this.prismLifted) {
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 4;
    }
    ctx.font = (this.flowerForm ? '50' : (['fish','spider','rat','jellyfish'].includes(this.type) ? '32' : '36')) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, screenX + this.width / 2, this.y + this.height / 2 + bob);
    ctx.restore();
    if ((this.sickTimer || 0) > 0) {
      const dripY = (Date.now() * 0.15 + this.x) % 20;
      for (let d = 0; d < 3; d++) {
        const dx = screenX + 8 + d * 12 + Math.sin(Date.now()*0.02 + d) * 3;
        ctx.save();
        ctx.globalAlpha = 0.7 - d * 0.2;
        ctx.fillStyle = '#84cc16';
        ctx.beginPath();
        ctx.arc(dx, this.y + this.height + (dripY + d * 7) % 15, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    if ((this.timeSlowed || false)) {
      ctx.save();
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⏱️', screenX + this.width/2 + 14, this.y - 6);
      ctx.restore();
    }
    if ((this.earthStunned || 0) > 0) {
      this.earthStunned = Math.max(0, (this.earthStunned || 0) - 1);
      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🪨', screenX + this.width/2 - 14, this.y - 4);
      ctx.fillText('〰', screenX + this.width/2, this.y + this.height + 2);
      ctx.restore();
    }
    if (this.flowerForm) {
      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.font = '12px sans-serif';
      ctx.fillText('🌸', screenX + this.width/2 - 15, this.y - 8);
      ctx.fillText('🌸', screenX + this.width/2 + 12, this.y + 5);
      ctx.restore();
    }
    if ((this.freezeTimer || 0) > 0) {
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = '#bae6fd';
      ctx.font = '20px sans-serif';
      ctx.fillText('❄️', screenX + this.width / 2 - 18, this.y - 5);
      ctx.fillText('❄️', screenX + this.width / 2 + 10, this.y + 5);
      ctx.restore();
    }
  }
}

class Coin {
  constructor(x, y) {
    this.x = x; this.y = y; this.width = 24; this.height = 24;
    this.collected = false;
  }
  draw() {
    if (this.collected) return;
    const screenX = this.x - cameraX;
    if (screenX + this.width < 0 || screenX > VIEW_WIDTH) return;
    const bounce = Math.sin(Date.now() * 0.01 + this.x * 0.02) * 2;
    ctx.save();
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 6 + Math.sin(Date.now() * 0.008) * 2;
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(EMOJI.coin, screenX + this.width / 2, this.y + this.height / 2 + bounce);
    ctx.restore();
  }
}

class Pipe {
  constructor(x, y, type, targetDepth) {
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 64;
    this.type = type;
    this.targetDepth = targetDepth || 0;
  }
  draw() {
    const screenX = this.x - cameraX;
    if (screenX + this.width < -50 || screenX > VIEW_WIDTH + 50) return;
    ctx.save();
    const nearPlayer = typeof player !== 'undefined' && player && Math.abs((player.x + player.width/2) - (this.x + this.width/2)) < 120;
    if (nearPlayer) {
      ctx.shadowColor = this.type === 'cactus_boss' ? '#22c55e' : (this.type === 'entrance' ? '#4ade80' : '#60a5fa');
      ctx.shadowBlur = 15;
    }
    ctx.fillStyle = '#228b22';
    ctx.fillRect(screenX, this.y, this.width, this.height);
    ctx.fillStyle = '#1a5c1a';
    ctx.fillRect(screenX + 4, this.y + 4, this.width - 8, this.height - 8);
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const pipeEmoji = this.type === 'cactus_boss' ? EMOJI.cactus : (this.type === 'entrance' ? EMOJI.pipeDown : EMOJI.pipeUp);
    ctx.fillText(pipeEmoji, screenX + this.width/2, this.y + this.height/2);
    ctx.restore();
  }
}

class CelestialGateway {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 72;
    this.height = 72;
    this.rotation = 0;
    this.pulsePhase = 0;
  }
  update() {
    this.rotation += 0.008;
    this.pulsePhase += 0.06;
  }
  draw() {
    const screenX = this.x - cameraX;
    if (screenX + this.width < -60 || screenX > VIEW_WIDTH + 60) return;
    const pulse = 0.85 + Math.sin(this.pulsePhase) * 0.15;
    const auraColors = ['#a78bfa','#818cf8','#c084fc','#60a5fa'];
    ctx.save();
    ctx.translate(screenX + this.width/2, this.y + this.height/2);
    ctx.rotate(this.rotation);
    ctx.scale(pulse, pulse);
    ctx.translate(-this.width/2, -this.height/2);
    for (let i = 3; i >= 0; i--) {
      ctx.shadowColor = auraColors[i];
      ctx.shadowBlur = 25 + i * 8;
      ctx.globalAlpha = 0.4 + Math.sin(this.pulsePhase + i) * 0.2;
      ctx.font = '64px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🪐', this.width/2, this.height/2);
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.fillText('🪐', this.width/2, this.height/2);
    const nearPlayer = typeof player !== 'undefined' && player && Math.abs((player.x + player.width/2) - (this.x + this.width/2)) < 120;
    if (nearPlayer) {
      ctx.font = '12px Nunito';
      ctx.fillStyle = '#a78bfa';
      ctx.fillText('↑ Space', this.width/2, this.height + 8);
    }
    ctx.restore();
  }
}

class TransitionManager {
  constructor() {
    this.state = 'idle';
    this.t = 0;
    this.duration = 480;
    this.toSpace = true;
    this.meteorTrail = [];
    this.maxTrail = 80;
    this.starfield = [];
    this.nebulae = [];
  }
  initStarfield() {
    this.starfield = [];
    for (let i = 0; i < 120; i++) {
      this.starfield.push({
        x: Math.random() * VIEW_WIDTH * 2 - VIEW_WIDTH/2,
        y: Math.random() * VIEW_HEIGHT,
        size: 1 + Math.random() * 2,
        brightness: 0.3 + Math.random() * 0.7,
        parallax: 0.2 + Math.random() * 0.6
      });
    }
    this.nebulae = [];
    for (let i = 0; i < 5; i++) {
      this.nebulae.push({
        x: Math.random() * VIEW_WIDTH * 3,
        y: Math.random() * VIEW_HEIGHT * 0.8,
        w: 150 + Math.random() * 200,
        h: 80 + Math.random() * 120,
        hue: Math.random() * 60 + 220,
        alpha: 0.15 + Math.random() * 0.2,
        speed: 0.3 + Math.random() * 0.5
      });
    }
  }
  start(toSpace) {
    this.state = 'transition';
    this.t = 0;
    this.toSpace = toSpace;
    this.meteorTrail = [];
    this.initStarfield();
  }
  update() {
    if (this.state !== 'transition') return;
    this.t++;
    const sec = this.t / 60;
    if (sec >= 8) {
      this.state = 'idle';
      globalGameSpeed = 1;
      inSpaceRealm = this.toSpace;
      if (typeof clearMemoryForTransition === 'function') clearMemoryForTransition();
      if (this.toSpace) {
        if (typeof backgroundTrees !== 'undefined') backgroundTrees = [];
        spaceStage = 1;
        chunks = {};
        celestialGateways = [];
        earthReturnObjects = [];
        const levelW = LEVEL_LENGTH * CHUNK_WIDTH * TILE_SIZE;
        for (let i = -1; i <= Math.ceil(levelW / (CHUNK_WIDTH * TILE_SIZE)) + 2; i++) generateSpaceChunk(i);
        player.x = 150;
        player.y = GROUND_Y - 160;
        player.vy = 0;
        player.onGround = false;
        cameraX = 0;
        targetCameraX = 0;
      } else {
        chunks = {};
        celestialGateways = [];
        earthReturnObjects = [];
        generateChunk(-1);
        generateChunk(0);
        if (typeof initTrees === 'function') initTrees();
        player.x = savedOverworldX || 150;
        player.y = GROUND_Y - 80;
        cameraX = Math.max(0, (savedOverworldX || 150) - 200);
        targetCameraX = cameraX;
      }
    }
  }
  getPhase() {
    const sec = this.t / 60;
    if (sec < 1.5) return 'launch';
    if (sec < 6) return 'cruise';
    return 'landing';
  }
  getSpeedMultiplier() {
    const sec = this.t / 60;
    if (sec < 1.5) return 0.5;
    if (sec < 6) return 0.7;
    return 0.25;
  }
  emitMeteorTrail(x, y) {
    if (this.meteorTrail.length >= this.maxTrail) this.meteorTrail.shift();
    const vel = Math.random() * 3 + 2;
    this.meteorTrail.push({
      x, y,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 1,
      life: 40 + Math.random() * 30,
      size: 3 + Math.random() * 5,
      type: Math.random() < 0.4 ? 'fire' : Math.random() < 0.7 ? 'spark' : 'smoke'
    });
  }
  draw(ctxRef) {
    if (this.state !== 'transition') return;
    const sec = this.t / 60;
    const phase = this.getPhase();
    globalGameSpeed = this.getSpeedMultiplier();

    if (phase === 'launch') {
      screenShake = Math.max(screenShake, 12 - sec * 4);
      const fade = Math.min(1, sec / 1.2);
      ctxRef.save();
      ctxRef.fillStyle = 'rgba(0,0,0,' + fade * 0.9 + ')';
      ctxRef.fillRect(-50, -50, VIEW_WIDTH + 100, VIEW_HEIGHT + 100);
      ctxRef.restore();
    } else if (phase === 'cruise' || phase === 'landing') {
      ctxRef.save();
      ctxRef.fillStyle = '#0a0a1a';
      ctxRef.fillRect(-50, -50, VIEW_WIDTH + 100, VIEW_HEIGHT + 100);
      for (const s of this.starfield) {
        const sx = s.x - (cameraX || 0) * s.parallax * 0.1;
        ctxRef.globalAlpha = s.brightness * (0.8 + Math.sin(sec * 2 + s.x) * 0.2);
        ctxRef.fillStyle = '#fff';
        ctxRef.fillRect(sx % (VIEW_WIDTH + 100) - 50, s.y, s.size, s.size);
      }
      for (const n of this.nebulae) {
        const nx = (n.x - sec * n.speed * 80) % (VIEW_WIDTH + 200) - 100;
        const g = ctxRef.createRadialGradient(nx, n.y, 0, nx, n.y, n.w);
        g.addColorStop(0, 'hsla(' + n.hue + ',70%,60%,' + n.alpha + ')');
        g.addColorStop(1, 'hsla(' + n.hue + ',70%,30%,0)');
        ctxRef.fillStyle = g;
        ctxRef.fillRect(nx - n.w/2, n.y - n.h/2, n.w, n.h);
      }
      const landStartY = 360;
      const landEndY = this.toSpace ? 378 : 388;
      const meteorScale = phase === 'cruise' ? Math.min(2, 0.3 + sec * 0.4) : Math.max(0.8, 2 - (sec - 6) * 0.6);
      const meteorX = VIEW_WIDTH/2 + (phase === 'landing' ? (sec - 6) * 10 : Math.sin(sec * 0.5) * 80);
      const meteorY = phase === 'cruise' ? 150 + sec * 35 : landStartY + (sec - 6) * (landEndY - landStartY) / 2;
      this.emitMeteorTrail(meteorX - 40, meteorY);
      this.meteorTrail = this.meteorTrail.filter(p => {
        p.x -= p.vx;
        p.y -= p.vy;
        p.life--;
        if (p.life > 0) {
          const a = p.life / 70;
          ctxRef.save();
          ctxRef.globalAlpha = a;
          if (p.type === 'fire') ctxRef.fillStyle = '#ff6b00';
          else if (p.type === 'spark') ctxRef.fillStyle = '#ffd700';
          else ctxRef.fillStyle = '#444';
          ctxRef.beginPath();
          ctxRef.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctxRef.fill();
          ctxRef.restore();
        }
        return p.life > 0;
      });
      if (phase === 'landing') {
        const planetY = this.toSpace ? 380 : 390;
        const planetSize = 90 + (sec - 6) * 15;
        ctxRef.save();
        ctxRef.font = planetSize + 'px sans-serif';
        ctxRef.textAlign = 'center';
        ctxRef.textBaseline = 'middle';
        ctxRef.globalAlpha = Math.min(1, (sec - 6) * 2);
        if (this.toSpace) {
          ctxRef.shadowColor = '#a78bfa';
          ctxRef.shadowBlur = 40;
          ctxRef.fillText('🪐', VIEW_WIDTH/2, planetY);
        } else {
          ctxRef.shadowColor = '#4ade80';
          ctxRef.shadowBlur = 40;
          ctxRef.fillText('🌍', VIEW_WIDTH/2, planetY);
        }
        ctxRef.restore();
      }
      ctxRef.save();
      ctxRef.shadowColor = '#fbbf24';
      ctxRef.shadowBlur = 30;
      ctxRef.font = (56 * meteorScale) + 'px sans-serif';
      ctxRef.textAlign = 'center';
      ctxRef.textBaseline = 'middle';
      ctxRef.fillText('☄️', meteorX, meteorY);
      ctxRef.restore();
      if (phase === 'landing' && sec > 7.8) {
        ctxRef.save();
        ctxRef.fillStyle = 'rgba(255,255,255,' + Math.min(1, (sec - 7.8) * 5) + ')';
        ctxRef.fillRect(-50, -50, VIEW_WIDTH + 100, VIEW_HEIGHT + 100);
        ctxRef.restore();
      }
      ctxRef.restore();
    }
  }
}

class WaterPit {
  constructor(x, y, w, h, type) {
    this.x = x; this.y = y; this.width = w; this.height = h;
    this.type = type || 'water';
  }
  draw() {
    const screenX = this.x - cameraX;
    if (screenX + this.width < 0 || screenX > VIEW_WIDTH) return;
    ctx.save();
    ctx.globalAlpha = 1;
    if (this.type === 'water') {
      const inWater = typeof inWaterRealm !== 'undefined' && inWaterRealm;
      ctx.fillStyle = inWater ? 'rgba(0,20,50,0.85)' : 'rgba(0,60,100,0.5)';
      ctx.fillRect(screenX, this.y, this.width, this.height);
      ctx.fillStyle = inWater ? 'rgba(0,40,80,0.7)' : 'rgba(0,100,150,0.4)';
      ctx.fillRect(screenX, this.y, this.width, 25);
    } else if (this.type === 'lava') {
      ctx.fillStyle = 'rgba(180,50,20,0.7)';
      ctx.fillRect(screenX, this.y, this.width, this.height);
      ctx.fillStyle = 'rgba(255,100,30,0.6)';
      ctx.fillRect(screenX, this.y, this.width, 25);
    } else if (this.type === 'poison') {
      ctx.fillStyle = 'rgba(50,180,50,0.5)';
      ctx.fillRect(screenX, this.y, this.width, this.height);
      ctx.fillStyle = 'rgba(80,220,80,0.4)';
      ctx.fillRect(screenX, this.y, this.width, 25);
    }
    ctx.strokeStyle = (this.type === 'water' && typeof inWaterRealm !== 'undefined' && inWaterRealm) ? 'rgba(255,100,100,0.9)' : 'rgba(255,80,80,0.5)';
    ctx.lineWidth = (this.type === 'water' && typeof inWaterRealm !== 'undefined' && inWaterRealm) ? 3 : 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(screenX, this.y, this.width, this.height);
    ctx.setLineDash([]);
    ctx.restore();
  }
}

class BonusItem {
  constructor(x, y, type) {
    this.x = x; this.y = y; this.width = 28; this.height = 28;
    this.type = type;
    this.collected = false;
  }
  draw() {
    if (this.collected) return;
    const screenX = this.x - cameraX;
    if (screenX + this.width < -20 || screenX > VIEW_WIDTH + 20) return;
    const pulse = 1 + Math.sin(Date.now() * 0.008) * 0.15;
    ctx.save();
    ctx.translate(screenX + this.width/2, this.y + this.height/2);
    ctx.scale(pulse, pulse);
    const emojiMap = { gem: EMOJI.gem, magnet: EMOJI.magnet, disco: EMOJI.disco, wings: EMOJI.wings || '🪽', shield: EMOJI.shield || '🛡️', timeShield: EMOJI.timeShield || '⏱️', superMagnet: EMOJI.superMagnet || '🧲', doubleCoins: EMOJI.doubleCoins || '💰', extraLife: EMOJI.extraLife || '❤️' };
    const emoji = emojiMap[this.type] || EMOJI.star;
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 0, 0);
    ctx.restore();
  }
}
