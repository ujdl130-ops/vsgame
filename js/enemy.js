// Enemy data, behavior, and rendering.

const STAGE1_ENEMY_SPRITE = {
  columns: 6,
  rowCount: 3,
  rows: { walk: 0, attack: 1, death: 2 },
  frames: { walk: 6, attack: 6, death: 6 },
  fps: { walk: 8, attack: 11, death: 8 },
  drawW: 150,
  drawH: 94,
  healthBarOffsetY: 96,
  offsets: {
    walk: [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    attack: [
      { x: 0, y: 0 },
      { x: -3, y: 0 },
      { x: -6, y: 0 },
      { x: -9, y: 0 },
      { x: -5, y: 0 },
      { x: -2, y: 0 },
    ],
    death: [
      { x: 0, y: 0 },
      { x: 0, y: 2 },
      { x: 1, y: 4 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },
      { x: 3, y: 5 },
    ],
  },
};

const EVILEYE_SPRITE = {
  columns: 6,
  rowCount: 5,
  rows: { fly: 1, attack: 2, death: 4 },
  frames: { fly: 6, attack: 6, death: 6 },
  fps: { fly: 8, attack: 11, death: 8 },
  drawW: 168,
  drawH: 112,
  flightOffsetY: 92,
  healthBarOffsetY: 186,
};

const KARON_SPRITE = {
  columns: 6,
  rowCount: 5,
  rows: { idle: 0, walk: 1, attack: 2, death: 4 },
  frames: { idle: 6, walk: 6, attack: 6, death: 6 },
  fps: { idle: 6, walk: 8, attack: 10, death: 8 },
  attackFrameMap: [0, 1, 1, 4, 4, 0],
  drawW: 172,
  drawH: 172,
  healthBarOffsetY: 144,
  swordWaveReleaseProgress: 0.58,
};


function createGoblinEnemy(wave, isStageOne) {
  return {
    type: "normal",
    name: "goblin",
    x: ENEMY_BASE_X - 45,
    y: COMBAT_LINE_Y,
    w: 34,
    h: 54,
    hp: 55 + wave * 8,
    maxHp: 55 + wave * 8,
    speed: 43 + wave * 3,
    damage: 10 + wave * 2,
    range: 38,
    cooldown: 0,
    attackSpeed: 0.78,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: isStageOne ? 0.48 : 0.48,
    paralyzeTimer: 0,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: isStageOne ? 0.8 : 0.8,
    deathRewarded: false,
  };
}

function createEvileyeEnemy(wave) {
  const hp = 48 + wave * 7;
  return {
    type: "evileye",
    name: "evileye",
    airborne: true,
    x: ENEMY_BASE_X - 45,
    y: COMBAT_LINE_Y,
    w: 42,
    h: 84,
    hp,
    maxHp: hp,
    speed: 34 + wave * 2,
    damage: 8 + wave * 2,
    range: 190,
    cooldown: 0,
    attackSpeed: 1.45,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.78,
    laserTarget: null,
    laserHitPending: false,
    paralyzeTimer: 0,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.8,
    deathRewarded: false,
  };
}

function shouldSpawnEvileye(wave) {
  const spawnIndex = gameState.spawnedInWave || 0;
  return spawnIndex % 4 === 2 || (wave >= 2 && Math.random() < 0.34);
}

function createKaronBoss(wave) {
  const hp = 520 + wave * 90;
  return {
    type: "karon",
    name: "karon",
    isBoss: true,
    x: ENEMY_BASE_X - 58,
    y: COMBAT_LINE_Y,
    w: 60,
    h: 92,
    hp,
    maxHp: hp,
    speed: 24,
    damage: 28 + wave * 4,
    range: 275,
    cooldown: 0.45,
    attackSpeed: 1.55,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.82,
    swordWaveTarget: null,
    swordWavePending: false,
    paralyzeTimer: 0,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.95,
    deathRewarded: false,
  };
}

function shouldSpawnKaronBoss(wave) {
  if (gameState.karonBossSpawned) return false;
  return Number(gameState.stage) === 3
    && wave >= gameState.maxWave
    && gameState.spawnedInWave >= gameState.enemiesToSpawn - 1;
}

function spawnEnemy() {
  const wave = gameState.wave;
  const stage = Number(gameState.stage);
  const isStageOne = stage === 1;

  if (stage === 2) {
    gameState.enemies.push(shouldSpawnEvileye(wave) ? createEvileyeEnemy(wave) : createGoblinEnemy(wave, false));
    return;
  }

  if (stage === 3) {
    if (shouldSpawnKaronBoss(wave)) {
      gameState.karonBossSpawned = true;
      gameState.enemies.push(createKaronBoss(wave));
      return;
    }

    gameState.enemies.push(shouldSpawnEvileye(wave) ? createEvileyeEnemy(wave) : createGoblinEnemy(wave, false));
    return;
  }

  const isBrute = stage >= 3 && wave >= 2 && Math.random() < 0.32;
  const isFast = stage >= 3 && wave >= 3 && Math.random() < 0.25;

  if (isBrute) {
    gameState.enemies.push({
      type: "brute",
      x: ENEMY_BASE_X - 45,
      y: COMBAT_LINE_Y,
      w: 44,
      h: 66,
      hp: 95 + wave * 8,
      maxHp: 95 + wave * 8,
      speed: 28 + wave * 2,
      damage: 16 + wave * 2,
      range: 45,
      cooldown: 0,
      attackSpeed: 0.9,
      animTime: 0,
      moving: false,
      attackAnimTimer: 0,
      attackAnimDuration: 0.34,
      paralyzeTimer: 0,
      dead: false,
      deathAnimTimer: 0,
      deathAnimDuration: 0.55,
      deathRewarded: false,
    });
    return;
  }

  if (!isFast) {
    gameState.enemies.push(createGoblinEnemy(wave, isStageOne));
    return;
  }

  gameState.enemies.push({
    type: "fast",
    x: ENEMY_BASE_X - 45,
    y: COMBAT_LINE_Y,
    w: 30,
    h: 46,
    hp: 36 + wave * 6,
    maxHp: 36 + wave * 6,
    speed: 74 + wave * 3,
    damage: 7 + wave,
    range: 38,
    cooldown: 0,
    attackSpeed: 0.52,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.34,
    paralyzeTimer: 0,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.55,
    deathRewarded: false,
  });
}

function updateEnemies(dt) {
  for (const enemy of gameState.enemies) {
    enemy.animTime = (enemy.animTime || 0) + dt;

    if (enemy.hp <= 0 || enemy.dead) {
      startEnemyDeath(enemy);
      enemy.deathAnimTimer = Math.max(0, (enemy.deathAnimTimer || 0) - dt);
      continue;
    }

    enemy.cooldown = Math.max(0, enemy.cooldown - dt);
    enemy.attackAnimTimer = Math.max(0, (enemy.attackAnimTimer || 0) - dt);
    enemy.paralyzeTimer = Math.max(0, (enemy.paralyzeTimer || 0) - dt);
    enemy.moving = false;

    if (enemy.paralyzeTimer > 0) {
      enemy.animTime = Math.max(0, (enemy.animTime || 0) - dt);
      enemy.attackAnimTimer = 0;
      continue;
    }

    if (enemy.type === "karon") {
      const attackDuration = enemy.attackAnimDuration || 0.82;
      const attackProgress = enemy.attackAnimTimer > 0
        ? 1 - enemy.attackAnimTimer / attackDuration
        : 1;

      if (enemy.swordWavePending && (attackProgress >= KARON_SPRITE.swordWaveReleaseProgress || enemy.attackAnimTimer <= 0)) {
        spawnKaronSwordWave(enemy);
        enemy.swordWavePending = false;
        enemy.swordWaveTarget = null;
      }

      const target = findNearestAlly(enemy.x, enemy.range);

      if (target) {
        if (enemy.cooldown <= 0 && enemy.attackAnimTimer <= 0) {
          enemy.cooldown = enemy.attackSpeed;
          enemy.attackAnimTimer = attackDuration;
          enemy.swordWaveTarget = target;
          enemy.swordWavePending = true;
        }
      } else {
        enemy.x -= enemy.speed * dt;
        enemy.moving = true;
      }

      if (enemy.x < PLAYER_BASE_X + 42) {
        gameState.playerBaseHp -= enemy.damage * dt * 0.55;
        enemy.x = PLAYER_BASE_X + 42;
        enemy.moving = false;
      }

      continue;
    }

    if (enemy.type === "evileye") {
      const attackDuration = enemy.attackAnimDuration || 0.78;
      const attackProgress = enemy.attackAnimTimer > 0
        ? 1 - enemy.attackAnimTimer / attackDuration
        : 1;

      if (enemy.laserHitPending && (attackProgress >= 0.58 || enemy.attackAnimTimer <= 0)) {
        const laserTarget = isCombatAlive(enemy.laserTarget)
          ? enemy.laserTarget
          : findNearestAlly(enemy.x, enemy.range + 20);

        if (laserTarget) {
          laserTarget.hp -= enemy.damage;
          spawnHit(laserTarget.x, laserTarget.y - 44, "#c56dff");
        }

        enemy.laserHitPending = false;
        enemy.laserTarget = null;
      }

      const target = findNearestAlly(enemy.x, enemy.range);

      if (target) {
        if (enemy.cooldown <= 0 && enemy.attackAnimTimer <= 0) {
          enemy.cooldown = enemy.attackSpeed;
          enemy.attackAnimTimer = attackDuration;
          enemy.laserTarget = target;
          enemy.laserHitPending = true;
        }
      } else {
        enemy.x -= enemy.speed * dt;
        enemy.moving = true;
      }

      if (enemy.x < PLAYER_BASE_X + 28) {
        gameState.playerBaseHp -= enemy.damage * dt * 0.65;
        enemy.x = PLAYER_BASE_X + 28;
        enemy.moving = false;
      }

      continue;
    }

    const target = findNearestAlly(enemy.x, enemy.range);

    if (target) {
      if (enemy.cooldown <= 0) {
        enemy.cooldown = enemy.attackSpeed;
        enemy.attackAnimTimer = enemy.attackAnimDuration || 0.34;
        target.hp -= enemy.damage;

        // 피격 시스템은 메인 영웅에게만 적용합니다.
        if (target.type === "hero") {
          spawnHit(target.x, target.y - 38, "#ff9090");
        }
      }
    } else {
      enemy.x -= enemy.speed * dt;
      enemy.moving = true;
    }

    if (enemy.x < PLAYER_BASE_X + 28) {
      gameState.playerBaseHp -= enemy.damage * dt * 0.8;
      enemy.x = PLAYER_BASE_X + 28;
      enemy.moving = false;
    }
  }
}


function canDrawStage1EnemySprite(enemy) {
  return stage1EnemySpriteReady
    && enemy.type === "normal";
}

function canDrawEvileyeSprite(enemy) {
  return stage2EvileyeSpriteReady && enemy.type === "evileye";
}

function canDrawKaronSprite(enemy) {
  return karonPhase1SpriteReady && enemy.type === "karon";
}

function drawKaronSprite(enemy) {
  if (!canDrawKaronSprite(enemy)) return false;

  let anim = "idle";
  if (enemy.dead || enemy.hp <= 0) anim = "death";
  else if (enemy.attackAnimTimer > 0) anim = "attack";
  else if (enemy.moving) anim = "walk";

  const frameCount = KARON_SPRITE.frames[anim] || 1;
  const fps = KARON_SPRITE.fps[anim] || 8;
  let frame = Math.floor((enemy.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = enemy.attackAnimDuration || 0.82;
    const progress = 1 - Math.max(0, enemy.attackAnimTimer || 0) / duration;
    const mappedFrame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
    frame = KARON_SPRITE.attackFrameMap[mappedFrame] ?? mappedFrame;
  } else if (anim === "death") {
    const duration = enemy.deathAnimDuration || 0.95;
    const progress = 1 - Math.max(0, enemy.deathAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const frameW = karonPhase1Sprite.naturalWidth / KARON_SPRITE.columns;
  const frameH = karonPhase1Sprite.naturalHeight / KARON_SPRITE.rowCount;
  const sx = frame * frameW;
  const sy = KARON_SPRITE.rows[anim] * frameH;
  const dw = KARON_SPRITE.drawW;
  const dh = KARON_SPRITE.drawH;
  const bob = anim === "death" || enemy.paralyzeTimer > 0
    ? 0
    : Math.sin((enemy.animTime || 0) * 7) * 1.2;

  ctx.save();
  ctx.translate(enemy.x, enemy.y + bob);

  ctx.fillStyle = "rgba(0,0,0,0.26)";
  ctx.beginPath();
  ctx.ellipse(0, 6, 42, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  if (anim === "death") {
    const duration = enemy.deathAnimDuration || 0.95;
    const progress = 1 - Math.max(0, enemy.deathAnimTimer || 0) / duration;
    ctx.globalAlpha = Math.max(0.18, 1 - progress * 0.55);
  }

  ctx.scale(-1, 1);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(
    karonPhase1Sprite,
    sx,
    sy,
    frameW,
    frameH,
    -dw / 2,
    -dh + 22,
    dw,
    dh
  );

  ctx.restore();
  return true;
}

function drawEvileyeSprite(enemy) {
  if (!canDrawEvileyeSprite(enemy)) return false;

  let anim = "fly";
  if (enemy.dead || enemy.hp <= 0) anim = "death";
  else if (enemy.attackAnimTimer > 0) anim = "attack";

  const frameCount = EVILEYE_SPRITE.frames[anim] || 1;
  const fps = EVILEYE_SPRITE.fps[anim] || 8;
  let frame = Math.floor((enemy.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = enemy.attackAnimDuration || 0.78;
    const progress = 1 - Math.max(0, enemy.attackAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  } else if (anim === "death") {
    const duration = enemy.deathAnimDuration || 0.8;
    const progress = 1 - Math.max(0, enemy.deathAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const frameW = stage2EvileyeSprite.naturalWidth / EVILEYE_SPRITE.columns;
  const frameH = stage2EvileyeSprite.naturalHeight / EVILEYE_SPRITE.rowCount;
  const sx = frame * frameW;
  const sy = EVILEYE_SPRITE.rows[anim] * frameH;
  const dw = EVILEYE_SPRITE.drawW;
  const dh = EVILEYE_SPRITE.drawH;
  const hover = anim === "death" || enemy.paralyzeTimer > 0
    ? 0
    : Math.sin((enemy.animTime || 0) * 9) * 4;

  ctx.save();
  ctx.translate(enemy.x, enemy.y);

  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 4, 30, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(0, -EVILEYE_SPRITE.flightOffsetY + hover);

  if (anim === "death") {
    const duration = enemy.deathAnimDuration || 0.8;
    const progress = 1 - Math.max(0, enemy.deathAnimTimer || 0) / duration;
    ctx.globalAlpha = Math.max(0.2, 1 - progress * 0.45);
  }

  ctx.scale(-1, 1);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    stage2EvileyeSprite,
    sx,
    sy,
    frameW,
    frameH,
    -dw / 2,
    -dh + 8,
    dw,
    dh
  );

  ctx.restore();
  return true;
}

function drawStage1EnemySprite(enemy) {
  if (!canDrawStage1EnemySprite(enemy)) return false;

  let anim = "walk";
  if (enemy.dead || enemy.hp <= 0) anim = "death";
  else if (enemy.attackAnimTimer > 0) anim = "attack";

  const frameCount = STAGE1_ENEMY_SPRITE.frames[anim] || 1;
  const fps = STAGE1_ENEMY_SPRITE.fps[anim] || 8;
  let frame = Math.floor((enemy.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = enemy.attackAnimDuration || 0.48;
    const progress = 1 - Math.max(0, enemy.attackAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  } else if (anim === "death") {
    const duration = enemy.deathAnimDuration || 0.8;
    const progress = 1 - Math.max(0, enemy.deathAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const frameW = stage1EnemySprite.naturalWidth / STAGE1_ENEMY_SPRITE.columns;
  const frameH = stage1EnemySprite.naturalHeight / STAGE1_ENEMY_SPRITE.rowCount;
  const sx = frame * frameW;
  const sy = STAGE1_ENEMY_SPRITE.rows[anim] * frameH;
  const dw = STAGE1_ENEMY_SPRITE.drawW;
  const dh = STAGE1_ENEMY_SPRITE.drawH;
  const frameOffset = (STAGE1_ENEMY_SPRITE.offsets[anim] && STAGE1_ENEMY_SPRITE.offsets[anim][frame]) || { x: 0, y: 0 };

  ctx.save();
  ctx.translate(enemy.x, enemy.y);

  if (anim === "death") {
    const duration = enemy.deathAnimDuration || 0.8;
    const progress = 1 - Math.max(0, enemy.deathAnimTimer || 0) / duration;
    ctx.globalAlpha = Math.max(0.25, 1 - progress * 0.35);
  }

  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, 4, anim === "death" ? 34 : 28, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(-1, 1);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    stage1EnemySprite,
    sx,
    sy,
    frameW,
    frameH,
    -dw / 2 + frameOffset.x,
    -dh + 8 + frameOffset.y,
    dw,
    dh
  );

  ctx.restore();
  return true;
}

function drawEnemy(enemy) {
  const usedKaronSprite = drawKaronSprite(enemy);
  if (usedKaronSprite) {
    const isDying = enemy.dead || enemy.hp <= 0;
    if (!isDying) {
      drawHealthBar(
        enemy.x,
        enemy.y - KARON_SPRITE.healthBarOffsetY,
        88,
        enemy.hp,
        enemy.maxHp,
        "#ff4f78"
      );
    }
    return;
  }

  const usedEvileyeSprite = drawEvileyeSprite(enemy);
  if (usedEvileyeSprite) {
    const isDying = enemy.dead || enemy.hp <= 0;
    if (!isDying) {
      drawHealthBar(
        enemy.x,
        enemy.y - EVILEYE_SPRITE.healthBarOffsetY,
        48,
        enemy.hp,
        enemy.maxHp,
        "#ff6868"
      );
    }
    return;
  }

  const usedStage1Sprite = drawStage1EnemySprite(enemy);
  if (usedStage1Sprite) {
    const isDying = enemy.dead || enemy.hp <= 0;
    if (!isDying) {
      drawHealthBar(
        enemy.x,
        enemy.y - STAGE1_ENEMY_SPRITE.healthBarOffsetY,
        46,
        enemy.hp,
        enemy.maxHp,
        "#ff6868"
      );
    }
    return;
  }

  ctx.save();
  ctx.translate(enemy.x, enemy.y);

  const isDying = enemy.dead || enemy.hp <= 0;
  const duration = enemy.deathAnimDuration || 0.55;
  const deathProgress = isDying ? 1 - Math.max(0, enemy.deathAnimTimer || 0) / duration : 0;
  const bob = isDying || enemy.paralyzeTimer > 0 ? 0 : Math.sin((performance.now() + enemy.x * 11) * 0.012) * 2;

  if (isDying) {
    ctx.globalAlpha = Math.max(0.1, 1 - deathProgress * 0.85);
    ctx.translate(0, deathProgress * 20);
    ctx.scale(1, Math.max(0.25, 1 - deathProgress * 0.65));
  } else {
    ctx.translate(0, bob);
  }

  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, 4, enemy.w * 0.75, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  if (enemy.type === "brute") {
    ctx.fillStyle = "#714a80";
    ctx.fillRect(-22, -60, 44, 48);
    ctx.fillStyle = "#d3a3ff";
    ctx.fillRect(-17, -78, 34, 22);
    ctx.fillStyle = "#2c1635";
    ctx.fillRect(-26, -28, 52, 20);
  } else if (enemy.type === "fast") {
    ctx.fillStyle = "#cf5e5e";
    ctx.fillRect(-14, -38, 28, 28);
    ctx.fillStyle = "#ffe0e0";
    ctx.fillRect(-11, -54, 22, 17);
  } else {
    ctx.fillStyle = "#8b5aaf";
    ctx.fillRect(-16, -44, 32, 34);
    ctx.fillStyle = "#e7c4ff";
    ctx.fillRect(-12, -62, 24, 19);
  }

  ctx.fillStyle = "#1a0d23";
  ctx.fillRect(-7, -52, 5, 4);
  ctx.fillRect(4, -52, 5, 4);

  ctx.restore();
  if (!isDying) drawHealthBar(enemy.x, enemy.y - enemy.h - 18, 44, enemy.hp, enemy.maxHp, "#ff6868");
}
