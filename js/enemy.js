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

const KARON_HUMAN_SPRITE = {
  columns: 6,
  rowCount: 5,
  frameW: 256,
  frameH: 204,
  rows: { idle: 0, walk: 1, attack: 2, death: 4 },
  frames: { idle: 6, walk: 6, attack: 6, death: 6 },
  fps: { idle: 6, walk: 8, attack: 10, death: 7 },
  drawW: 204,
  drawH: 164,
  baseOffsetY: 10,
  healthBarOffsetY: 150,
  healthBarWidth: 92,
  swordWaveReleaseProgress: 0.58,
  shadowW: 46,
  shadowH: 11,
  drawOffsets: {
    idle: { x: 0, y: 0 },
    walk: { x: 0, y: 0 },
    attack: { x: 13, y: 24 },
    death: { x: 0, y: 0 },
  },
  frameOverrides: {
    attack: {
      2: {
        sourceX: 1536,
        sourceY: 408,
        sourceW: 512,
        sourceH: 204,
        drawW: 408,
      },
      3: {
        sourceX: 2048,
        sourceY: 408,
        sourceW: 512,
        sourceH: 204,
        drawW: 408,
      },
      5: {
        sourceFrame: 4,
        sourceFrameSpan: 2,
        drawW: 408,
      },
    },
  },
};

const KARON_TRANSFORM_SPRITE = {
  columns: 6,
  rowCount: 5,
  frameW: 256,
  frameH: 204,
  totalFrames: 12,
  fps: { transform: 15 },
  drawW: 236,
  drawH: 188,
  baseOffsetY: 24,
  visualBottoms: [182, 203, 203, 203, 203, 203, 167, 169, 171, 171, 167, 171],
  shadowW: 60,
  shadowH: 13,
  transformDuration: 2.0,
};

const KARON_WEREWOLF_SPRITE = {
  columns: 6,
  rowCount: 3,
  frameW: 256,
  frameH: 341,
  rows: { idle: 0, walk: 0, attack: 1, death: 2 },
  frames: { idle: 6, walk: 6, attack: 6, death: 6 },
  fps: { idle: 6, walk: 8, attack: 10, death: 7 },
  drawW: 280,
  drawH: 374,
  baseOffsetY: 18,
  healthBarOffsetY: 226,
  healthBarWidth: 112,
  clawHitReleaseProgress: 0.55,
  shadowW: 74,
  shadowH: 15,
  drawOffsets: {
    idle: { x: 0, y: 0 },
    walk: { x: 0, y: 0 },
    attack: { x: 0, y: 0 },
    death: { x: 0, y: 0 },
  },
  visualBottomsByAnim: {
    idle: [268, 268, 267, 268, 267, 268],
    walk: [268, 268, 267, 268, 267, 268],
    attack: [246, 246, 253, 255, 254, 255],
    death: [245, 241, 247, 250, 252, 253],
  },
  frameOverrides: {
    attack: {
      4: {
        sourceCrop: { left: 52 },
      },
      5: {
        sourceCrop: { left: 36 },
      },
    },
  },
};

const GOBLIN_STAGE_STATS = {
  1: { hp: 70, damage: 13 },
  2: { hp: 71, damage: 13 },
  3: { hp: 128, damage: 24 },
};

const EVILEYE_STAGE_STATS = {
  2: { hp: 66, damage: 12 },
  3: { hp: 124, damage: 23 },
};

function getEnemyPlayerBaseDamageScale(enemy) {
  return enemy && enemy.type === "evileye" ? 0.65 : 0.8;
}

function getEnemyPlayerBaseReleaseProgress(enemy) {
  return enemy && enemy.type === "evileye" ? 0.58 : 0.5;
}

function getEnemyPlayerBaseHitY(enemy) {
  return enemy && enemy.type === "evileye" ? GROUND_Y - 118 : GROUND_Y - 76;
}

function damageEnemyPlayerBase(enemy) {
  const damageScale = getEnemyPlayerBaseDamageScale(enemy);
  const attackInterval = enemy.attackSpeed || 1;
  gameState.playerBaseHp -= enemy.damage * damageScale * attackInterval;
  spawnHit(PLAYER_BASE_ATTACK_HIT_X, getEnemyPlayerBaseHitY(enemy), enemy.type === "evileye" ? "#c56dff" : "#ff9090");
  enemy.playerGateHitPending = false;
}

function updateEnemyPlayerBaseAttackHit(enemy, attackProgress) {
  if (!enemy.playerGateHitPending) return;
  if (attackProgress >= getEnemyPlayerBaseReleaseProgress(enemy) || enemy.attackAnimTimer <= 0) {
    damageEnemyPlayerBase(enemy);
  }
}

function startEnemyPlayerBaseAttack(enemy, attackDuration) {
  enemy.cooldown = enemy.attackSpeed;
  enemy.attackAnimTimer = attackDuration;
  enemy.playerGateHitPending = true;
  enemy.laserTarget = null;
  enemy.laserHitPending = false;
  enemy.moving = false;
}

function advanceEnemyTowardPlayerBase(enemy, dt, attackDuration) {
  if (enemy.x <= PLAYER_BASE_ATTACK_X) {
    enemy.x = PLAYER_BASE_ATTACK_X;
    enemy.moving = false;
    if (enemy.cooldown <= 0 && enemy.attackAnimTimer <= 0) {
      startEnemyPlayerBaseAttack(enemy, attackDuration);
    }
    return;
  }

  enemy.x -= enemy.speed * dt;
  enemy.moving = true;

  if (enemy.x <= PLAYER_BASE_ATTACK_X) {
    enemy.x = PLAYER_BASE_ATTACK_X;
    enemy.moving = false;
    if (enemy.cooldown <= 0 && enemy.attackAnimTimer <= 0) {
      startEnemyPlayerBaseAttack(enemy, attackDuration);
    }
  }
}

function getStageMonsterStats(table, fallbackStage) {
  const stage = Number(gameState && gameState.stage) || fallbackStage;
  return table[stage] || table[fallbackStage];
}

function createGoblinEnemy(wave, isStageOne) {
  const stats = getStageMonsterStats(GOBLIN_STAGE_STATS, isStageOne ? 1 : 2);
  return {
    type: "normal",
    name: "goblin",
    x: ENEMY_BASE_X - 45,
    y: COMBAT_LINE_Y,
    w: 34,
    h: 54,
    hp: stats.hp,
    maxHp: stats.hp,
    speed: 43 + wave * 3,
    damage: stats.damage,
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
  const stats = getStageMonsterStats(EVILEYE_STAGE_STATS, 2);
  return {
    type: "evileye",
    name: "evileye",
    airborne: true,
    x: ENEMY_BASE_X - 45,
    y: COMBAT_LINE_Y,
    w: 42,
    h: 84,
    hp: stats.hp,
    maxHp: stats.hp,
    speed: 34 + wave * 2,
    damage: stats.damage,
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
  const phaseOneHp = 900 + wave * 150;
  const phaseTwoHp = 1850 + wave * 280;
  return {
    type: "karon",
    name: "karon",
    isBoss: true,
    bossPhase: "human",
    hasTransformed: false,
    transforming: false,
    x: ENEMY_BASE_X - 58,
    y: COMBAT_LINE_Y,
    w: 60,
    h: 92,
    phaseOneHp,
    phaseTwoHp,
    hp: phaseOneHp,
    maxHp: phaseOneHp,
    speed: 24,
    damage: 44 + wave * 9,
    range: 295,
    cooldown: 0.35,
    attackSpeed: 1.35,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.82,
    swordWaveTarget: null,
    swordWavePending: false,
    swordWaveSplashRadius: 76,
    clawTarget: null,
    clawHitPending: false,
    playerGateHitPending: false,
    transformAnimTimer: 0,
    transformAnimDuration: KARON_TRANSFORM_SPRITE.transformDuration,
    paralyzeTimer: 0,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.95,
    deathRewarded: false,
  };
}

function shouldSpawnKaronBoss(wave) {
  if (gameState.karonBossSpawned) return false;
  return Number(gameState.stage) === 3 && wave === gameState.maxWave && gameState.spawnedInWave === 0;
}

function isKaronWerewolf(enemy) {
  return enemy && enemy.type === "karon" && enemy.bossPhase === "werewolf";
}

function getKaronSpriteSpec(enemy) {
  if (!enemy || enemy.type !== "karon") return KARON_HUMAN_SPRITE;
  if (enemy.transforming || enemy.bossPhase === "transform") return KARON_TRANSFORM_SPRITE;
  if (isKaronWerewolf(enemy)) return KARON_WEREWOLF_SPRITE;
  return KARON_HUMAN_SPRITE;
}

function getKaronSpriteSource(enemy) {
  if (!enemy || enemy.type !== "karon") return { image: null, ready: false };
  if (enemy.transforming || enemy.bossPhase === "transform") {
    return { image: karonTransformSprite, ready: karonTransformSpriteReady };
  }
  if (isKaronWerewolf(enemy)) {
    return { image: karonWerewolfSprite, ready: karonWerewolfSpriteReady };
  }
  return { image: karonHumanSprite, ready: karonHumanSpriteReady };
}

function startKaronTransformation(enemy) {
  if (!enemy || enemy.type !== "karon" || enemy.dead || enemy.hasTransformed) return false;

  enemy.bossPhase = "transform";
  enemy.hasTransformed = true;
  enemy.transforming = true;
  enemy.hp = 1;
  enemy.maxHp = enemy.phaseTwoHp || enemy.maxHp;
  enemy.moving = false;
  enemy.cooldown = 0;
  enemy.attackAnimTimer = 0;
  enemy.swordWaveTarget = null;
  enemy.swordWavePending = false;
  enemy.clawTarget = null;
  enemy.clawHitPending = false;
  enemy.playerGateHitPending = false;
  enemy.paralyzeTimer = 0;
  enemy.transformAnimDuration = KARON_TRANSFORM_SPRITE.transformDuration;
  enemy.transformAnimTimer = 0;
  enemy.animTime = 0;
  enemy.deathAnimTimer = 0;

  gameState.message = "카론 변신!";
  gameState.messageTimer = 1.2;
  return true;
}

function finishKaronTransformation(enemy) {
  if (!enemy || enemy.type !== "karon") return;

  const wave = gameState.wave || 1;
  enemy.bossPhase = "werewolf";
  enemy.transforming = false;
  enemy.animTime = 0;
  enemy.hp = enemy.phaseTwoHp || 880;
  enemy.maxHp = enemy.hp;
  enemy.w = 88;
  enemy.h = 120;
  enemy.speed = 36;
  enemy.damage = 120 + wave * 18;
  enemy.range = 92;
  enemy.cooldown = 0.35;
  enemy.attackSpeed = 0.96;
  enemy.attackAnimTimer = 0;
  enemy.attackAnimDuration = 0.82;
  enemy.deathAnimDuration = 1.05;
  enemy.swordWaveTarget = null;
  enemy.swordWavePending = false;
  enemy.clawTarget = null;
  enemy.clawHitPending = false;
  enemy.playerGateHitPending = false;
}

function updateKaronTransformation(enemy, dt) {
  enemy.moving = false;
  enemy.cooldown = 0;
  enemy.attackAnimTimer = 0;
  enemy.transformAnimTimer = (enemy.transformAnimTimer || 0) + dt;

  if (enemy.transformAnimTimer >= (enemy.transformAnimDuration || KARON_TRANSFORM_SPRITE.transformDuration)) {
    finishKaronTransformation(enemy);
  }
}

function damageKaronClawTarget(enemy) {
  const target = isCombatAlive(enemy.clawTarget)
    ? enemy.clawTarget
    : findNearestAlly(enemy.x, enemy.range + 18);

  if (target) {
    damageCombatant(target, enemy.damage);
    spawnHit(target.x, target.y - Math.max(38, target.h * 0.65), "#ff3b79");
  }

  enemy.clawHitPending = false;
  enemy.clawTarget = null;
}

function getKaronPlayerGateStopX(werewolf) {
  return werewolf ? PLAYER_BASE_ATTACK_X + 12 : PLAYER_BASE_ATTACK_X;
}

function getKaronPlayerGateDamageScale(werewolf) {
  return werewolf ? 0.75 : 0.55;
}

function damageKaronPlayerGate(enemy, werewolf) {
  const damageScale = getKaronPlayerGateDamageScale(werewolf);
  const attackInterval = enemy.attackSpeed || 1;
  gameState.playerBaseHp -= enemy.damage * damageScale * attackInterval;
  spawnHit(PLAYER_BASE_ATTACK_HIT_X, GROUND_Y - (werewolf ? 90 : 78), werewolf ? "#ff3b79" : "#ff6d4a");
  enemy.playerGateHitPending = false;
}

function startKaronPlayerGateAttack(enemy, attackDuration) {
  enemy.cooldown = enemy.attackSpeed;
  enemy.attackAnimTimer = attackDuration;
  enemy.playerGateHitPending = true;
  enemy.swordWaveTarget = null;
  enemy.swordWavePending = false;
  enemy.clawTarget = null;
  enemy.clawHitPending = false;
  enemy.moving = false;
}

function updateKaronEnemy(enemy, dt) {
  if (enemy.transforming || enemy.bossPhase === "transform") {
    updateKaronTransformation(enemy, dt);
    return;
  }

  if (enemy.paralyzeTimer > 0) {
    enemy.animTime = Math.max(0, (enemy.animTime || 0) - dt);
    enemy.attackAnimTimer = 0;
    enemy.swordWavePending = false;
    enemy.clawHitPending = false;
    enemy.playerGateHitPending = false;
    return;
  }

  const werewolf = isKaronWerewolf(enemy);
  const spriteSpec = werewolf ? KARON_WEREWOLF_SPRITE : KARON_HUMAN_SPRITE;
  const attackDuration = enemy.attackAnimDuration || 0.82;
  const attackProgress = enemy.attackAnimTimer > 0
    ? 1 - enemy.attackAnimTimer / attackDuration
    : 1;

  if (!werewolf && enemy.swordWavePending && (attackProgress >= spriteSpec.swordWaveReleaseProgress || enemy.attackAnimTimer <= 0)) {
    spawnKaronSwordWave(enemy);
    enemy.swordWavePending = false;
    enemy.swordWaveTarget = null;
  }

  if (werewolf && enemy.clawHitPending && (attackProgress >= spriteSpec.clawHitReleaseProgress || enemy.attackAnimTimer <= 0)) {
    damageKaronClawTarget(enemy);
  }

  if (enemy.playerGateHitPending && (attackProgress >= (werewolf ? spriteSpec.clawHitReleaseProgress : spriteSpec.swordWaveReleaseProgress) || enemy.attackAnimTimer <= 0)) {
    damageKaronPlayerGate(enemy, werewolf);
  }

  const target = findNearestAlly(enemy.x, enemy.range);
  const baseStopX = getKaronPlayerGateStopX(werewolf);

  if (target) {
    if (enemy.cooldown <= 0 && enemy.attackAnimTimer <= 0) {
      enemy.cooldown = enemy.attackSpeed;
      enemy.attackAnimTimer = attackDuration;
      if (werewolf) {
        enemy.clawTarget = target;
        enemy.clawHitPending = true;
      } else {
        enemy.swordWaveTarget = target;
        enemy.swordWavePending = true;
      }
    }
  } else if (enemy.x <= baseStopX) {
    enemy.x = baseStopX;
    enemy.moving = false;
    if (enemy.cooldown <= 0 && enemy.attackAnimTimer <= 0) {
      startKaronPlayerGateAttack(enemy, attackDuration);
    }
  } else {
    enemy.x -= enemy.speed * dt;
    enemy.moving = true;
    if (enemy.x <= baseStopX) {
      enemy.x = baseStopX;
      enemy.moving = false;
      if (enemy.cooldown <= 0 && enemy.attackAnimTimer <= 0) {
        startKaronPlayerGateAttack(enemy, attackDuration);
      }
    }
  }
}

function createBruteEnemy(wave, stageThreeTuned = false) {
  const hp = stageThreeTuned ? 112 + wave * 14 : 95 + wave * 8;
  return {
    type: "brute",
    x: ENEMY_BASE_X - 45,
    y: COMBAT_LINE_Y,
    w: 44,
    h: 66,
    hp,
    maxHp: hp,
    speed: (stageThreeTuned ? 30 : 28) + wave * 2,
    damage: stageThreeTuned ? 19 + wave * 3 : 16 + wave * 2,
    range: 45,
    cooldown: 0,
    attackSpeed: stageThreeTuned ? 0.86 : 0.9,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.34,
    paralyzeTimer: 0,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.55,
    deathRewarded: false,
  };
}

function createFastEnemy(wave, stageThreeTuned = false) {
  const hp = stageThreeTuned ? 50 + wave * 8 : 36 + wave * 6;
  return {
    type: "fast",
    x: ENEMY_BASE_X - 45,
    y: COMBAT_LINE_Y,
    w: 30,
    h: 46,
    hp,
    maxHp: hp,
    speed: stageThreeTuned ? 78 + wave * 4 : 74 + wave * 3,
    damage: stageThreeTuned ? 9 + wave * 2 : 7 + wave,
    range: 38,
    cooldown: 0,
    attackSpeed: stageThreeTuned ? 0.5 : 0.52,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.34,
    paralyzeTimer: 0,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.55,
    deathRewarded: false,
  };
}

function createStageThreeMinion(wave) {
  const spawnIndex = gameState.spawnedInWave || 0;

  if (wave >= 2 && (spawnIndex % 3 === 1 || Math.random() < (wave >= 3 ? 0.35 : 0.22))) {
    return createEvileyeEnemy(wave);
  }

  return createGoblinEnemy(wave, false);
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
    gameState.enemies.push(createStageThreeMinion(wave));
    return;
  }

  const isBrute = stage >= 3 && wave >= 2 && Math.random() < 0.32;
  const isFast = stage >= 3 && wave >= 3 && Math.random() < 0.25;

  if (isBrute) {
    gameState.enemies.push(createBruteEnemy(wave));
    return;
  }

  if (!isFast) {
    gameState.enemies.push(createGoblinEnemy(wave, isStageOne));
    return;
  }

  gameState.enemies.push(createFastEnemy(wave));
}

function updateEnemies(dt) {
  for (const enemy of gameState.enemies) {
    enemy.animTime = (enemy.animTime || 0) + dt;

    if (enemy.type === "karon" && enemy.hp <= 0 && !enemy.dead && startKaronTransformation(enemy)) {
      continue;
    }

    if (enemy.hp <= 0 || enemy.dead) {
      startEnemyDeath(enemy);
      enemy.deathAnimTimer = Math.max(0, (enemy.deathAnimTimer || 0) - dt);
      continue;
    }

    enemy.cooldown = Math.max(0, enemy.cooldown - dt);
    enemy.attackAnimTimer = Math.max(0, (enemy.attackAnimTimer || 0) - dt);
    enemy.paralyzeTimer = Math.max(0, (enemy.paralyzeTimer || 0) - dt);
    enemy.moving = false;

    if (enemy.type === "karon") {
      updateKaronEnemy(enemy, dt);
      continue;
    }

    if (enemy.paralyzeTimer > 0) {
      enemy.animTime = Math.max(0, (enemy.animTime || 0) - dt);
      enemy.attackAnimTimer = 0;
      enemy.playerGateHitPending = false;
      continue;
    }

    if (enemy.type === "evileye") {
      const attackDuration = enemy.attackAnimDuration || 0.78;
      const attackProgress = enemy.attackAnimTimer > 0
        ? 1 - enemy.attackAnimTimer / attackDuration
        : 1;

      updateEnemyPlayerBaseAttackHit(enemy, attackProgress);

      if (enemy.laserHitPending && (attackProgress >= 0.58 || enemy.attackAnimTimer <= 0)) {
        const laserTarget = isCombatAlive(enemy.laserTarget)
          ? enemy.laserTarget
          : findNearestAlly(enemy.x, enemy.range + 20);

        if (laserTarget) {
          damageCombatant(laserTarget, enemy.damage);
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
        advanceEnemyTowardPlayerBase(enemy, dt, attackDuration);
      }

      continue;
    }

    const attackDuration = enemy.attackAnimDuration || 0.34;
    const attackProgress = enemy.attackAnimTimer > 0
      ? 1 - enemy.attackAnimTimer / attackDuration
      : 1;
    updateEnemyPlayerBaseAttackHit(enemy, attackProgress);

    const target = findNearestAlly(enemy.x, enemy.range);

    if (target) {
      if (enemy.cooldown <= 0) {
        enemy.cooldown = enemy.attackSpeed;
        enemy.attackAnimTimer = attackDuration;
        damageCombatant(target, enemy.damage);

        // 피격 시스템은 메인 영웅에게만 적용합니다.
        if (target.type === "hero") {
          spawnHit(target.x, target.y - 38, "#ff9090");
        }
      }
    } else {
      advanceEnemyTowardPlayerBase(enemy, dt, attackDuration);
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
  const source = getKaronSpriteSource(enemy);
  return Boolean(enemy && enemy.type === "karon" && source.ready && source.image);
}

function drawKaronSprite(enemy) {
  if (!canDrawKaronSprite(enemy)) return false;

  const source = getKaronSpriteSource(enemy);
  const sprite = source.image;
  const spec = getKaronSpriteSpec(enemy);
  let anim = "idle";
  if (enemy.transforming || enemy.bossPhase === "transform") anim = "transform";
  else if (enemy.dead || enemy.hp <= 0) anim = "death";
  else if (enemy.attackAnimTimer > 0) anim = "attack";
  else if (enemy.moving) anim = "walk";

  const frameCount = spec.frames ? spec.frames[anim] || 1 : spec.totalFrames || 1;
  const fps = spec.fps ? spec.fps[anim] || 8 : 8;
  let frame = Math.floor((enemy.animTime || 0) * fps) % frameCount;

  if (anim === "transform") {
    const totalFrames = spec.totalFrames || 1;
    const duration = enemy.transformAnimDuration || spec.transformDuration || 1;
    const progress = Math.min(1, Math.max(0, (enemy.transformAnimTimer || 0) / duration));
    frame = Math.min(totalFrames - 1, Math.max(0, Math.floor(progress * totalFrames)));
  } else if (anim === "attack") {
    const duration = enemy.attackAnimDuration || 0.82;
    const progress = 1 - Math.max(0, enemy.attackAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  } else if (anim === "death") {
    const duration = enemy.deathAnimDuration || 0.95;
    const progress = 1 - Math.max(0, enemy.deathAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const frameOverride = ((spec.frameOverrides && spec.frameOverrides[anim]) || {})[frame] || {};
  const frameW = spec.frameW || sprite.naturalWidth / spec.columns;
  const frameH = spec.frameH || sprite.naturalHeight / spec.rowCount;
  const sourceFrame = frameOverride.sourceFrame ?? frame;
  const sourceFrameSpan = frameOverride.sourceFrameSpan || 1;
  const sourceW = frameOverride.sourceW || frameW * sourceFrameSpan;
  const sourceH = frameOverride.sourceH || frameH;
  const sx = frameOverride.sourceX ?? (sourceFrame % spec.columns) * frameW;
  const sy = frameOverride.sourceY ?? (anim === "transform"
    ? Math.floor(sourceFrame / spec.columns) * frameH
    : (spec.rows[anim] || 0) * frameH);
  const dw = frameOverride.drawW || spec.drawW;
  const dh = frameOverride.drawH || spec.drawH;
  const baseDrawOffset = (spec.drawOffsets && spec.drawOffsets[anim]) || { x: 0, y: 0 };
  const extraDrawOffset = frameOverride.drawOffset || { x: 0, y: 0 };
  const drawOffset = {
    x: baseDrawOffset.x + (extraDrawOffset.x || 0),
    y: baseDrawOffset.y + (extraDrawOffset.y || 0),
  };
  const baseSourceCrop = (spec.sourceCrops && spec.sourceCrops[anim]) || {};
  const frameSourceCrop = frameOverride.sourceCrop || {};
  const cropLeft = frameSourceCrop.left ?? baseSourceCrop.left ?? 0;
  const cropRight = frameSourceCrop.right ?? baseSourceCrop.right ?? 0;
  const cropTop = frameSourceCrop.top ?? baseSourceCrop.top ?? 0;
  const cropBottom = frameSourceCrop.bottom ?? baseSourceCrop.bottom ?? 0;
  const croppedFrameW = Math.max(1, sourceW - cropLeft - cropRight);
  const croppedFrameH = Math.max(1, sourceH - cropTop - cropBottom);
  const scaleX = dw / sourceW;
  const scaleY = dh / sourceH;
  const animVisualBottoms = spec.visualBottomsByAnim && spec.visualBottomsByAnim[anim];
  const visualBottom = frameOverride.visualBottom
    ?? (animVisualBottoms && animVisualBottoms[frame])
    ?? (spec.visualBottoms && spec.visualBottoms[frame]);
  const visualBottomOffset = typeof visualBottom === "number"
    ? Math.max(0, sourceH - 1 - visualBottom) * scaleY
    : 0;
  const destX = -dw / 2 + drawOffset.x + cropLeft * scaleX;
  const destY = -dh + (spec.baseOffsetY || 0) + drawOffset.y + cropTop * scaleY + visualBottomOffset;
  const destW = croppedFrameW * scaleX;
  const destH = croppedFrameH * scaleY;
  const bob = anim === "death" || anim === "attack" || anim === "transform" || enemy.paralyzeTimer > 0
    ? 0
    : Math.sin((enemy.animTime || 0) * 7) * 1.2;

  ctx.save();
  ctx.translate(enemy.x, enemy.y + bob);

  ctx.fillStyle = "rgba(0,0,0,0.26)";
  ctx.beginPath();
  ctx.ellipse(0, 6, spec.shadowW || 42, spec.shadowH || 11, 0, 0, Math.PI * 2);
  ctx.fill();

  if (anim === "death") {
    const duration = enemy.deathAnimDuration || 0.95;
    const progress = 1 - Math.max(0, enemy.deathAnimTimer || 0) / duration;
    ctx.globalAlpha = Math.max(0.18, 1 - progress * 0.55);
  }

  ctx.scale(-1, 1);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(
    sprite,
    sx + cropLeft,
    sy + cropTop,
    croppedFrameW,
    croppedFrameH,
    destX,
    destY,
    destW,
    destH
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
    const isDying = enemy.dead || (enemy.hp <= 0 && enemy.bossPhase === "werewolf");
    const isTransforming = enemy.transforming || enemy.bossPhase === "transform";
    const spec = getKaronSpriteSpec(enemy);
    if (!isDying && !isTransforming) {
      drawHealthBar(
        enemy.x,
        enemy.y - spec.healthBarOffsetY,
        spec.healthBarWidth || 88,
        enemy.hp,
        enemy.maxHp,
        isKaronWerewolf(enemy) ? "#ff375c" : "#ff4f78"
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
  const isAttacking = !isDying && enemy.attackAnimTimer > 0;
  const attackDuration = enemy.attackAnimDuration || 0.34;
  const attackProgress = isAttacking ? 1 - Math.max(0, enemy.attackAnimTimer || 0) / attackDuration : 0;
  const attackLunge = isAttacking ? -Math.sin(Math.min(1, Math.max(0, attackProgress)) * Math.PI) * 8 : 0;
  const bob = isDying || isAttacking || enemy.paralyzeTimer > 0 ? 0 : Math.sin((performance.now() + enemy.x * 11) * 0.012) * 2;

  if (isDying) {
    ctx.globalAlpha = Math.max(0.1, 1 - deathProgress * 0.85);
    ctx.translate(0, deathProgress * 20);
    ctx.scale(1, Math.max(0.25, 1 - deathProgress * 0.65));
  } else {
    ctx.translate(attackLunge, bob);
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
