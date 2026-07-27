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

const CHAPTER2_SKELETON_SPRITE = {
  columns: 6,
  rowCount: 3,
  rows: { walk: 0, attack: 1, death: 2 },
  frames: { walk: 6, attack: 6, death: 6 },
  fps: { walk: 8, attack: 10, death: 7 },
  drawW: 62,
  drawH: 82,
  healthBarOffsetY: 70,
};

const SKELETON_CURSE_DURATION = 8;
const SKELETON_CURSE_TICK_INTERVAL = 1;
const SKELETON_CURSE_MAX_HP_DAMAGE_RATIO = 0.06;
const CHAPTER2_SKELETON_STAT_MULTIPLIER = 1.1;
const LEVEL15_GUARD_STATS = { hp: 193, damage: 14 };
const LEVEL20_GUARD_STATS = { hp: 221, damage: 15 };
const CHAPTER2_STAGE2_GOBLIN_STAT_MULTIPLIER = 1.1;
const LEVEL15_MAGE_DAMAGE = 23;
const CHAPTER2_BAT_HP = LEVEL15_MAGE_DAMAGE * 2;
const CHAPTER2_BAT_SWARM_SIZE = 4;

const CHAPTER2_BAT_SPRITE = {
  drawW: 64,
  drawH: 44,
  flightOffsetY: 76,
  healthBarWidth: 30,
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

const KARON_RAGE_HP_STEP = 0.1;
const KARON_RAGE_MAX_STACKS = 6;
const KARON_RAGE_STACK_BONUS = 0.05;
const KARON_GATE_TRIGGER_HP_RATIO = 0.5;
const KARON_HERO_COUNTER_RELEASE_DISTANCE = 340;
const KARON_BACK_ATTACK_MIN_DISTANCE = 14;

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
  if (window.GameAudio) window.GameAudio.playEnemyAttackSfx(enemy);
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

function createChapter2SkeletonEnemy(wave) {
  const waveBonus = Math.max(0, (Number(wave) || 1) - 1);
  const hp = LEVEL15_GUARD_STATS.hp * CHAPTER2_SKELETON_STAT_MULTIPLIER + waveBonus * 10;
  const damage = LEVEL15_GUARD_STATS.damage * CHAPTER2_SKELETON_STAT_MULTIPLIER + waveBonus * 2;
  return {
    type: "skeleton",
    name: "skeleton soldier",
    x: ENEMY_BASE_X - 45,
    y: COMBAT_LINE_Y,
    w: 38,
    h: 92,
    hp,
    maxHp: hp,
    speed: 39 + wave * 3,
    damage,
    range: 42,
    cooldown: 0,
    attackSpeed: 0.9,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.6,
    paralyzeTimer: 0,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.86,
    deathRewarded: false,
    canApplyCurse: true,
  };
}

function createChapter2Stage2GoblinEnemy(wave) {
  const hp = Math.round(LEVEL20_GUARD_STATS.hp * CHAPTER2_STAGE2_GOBLIN_STAT_MULTIPLIER);
  const damage = Math.round(LEVEL20_GUARD_STATS.damage * CHAPTER2_STAGE2_GOBLIN_STAT_MULTIPLIER);
  const goblin = createGoblinEnemy(wave, false);
  goblin.hp = hp;
  goblin.maxHp = hp;
  goblin.damage = damage;
  goblin.speed = 40 + wave * 2;
  return goblin;
}

function createChapter2BatEnemy(wave, swarmIndex = 0) {
  const formationOffsets = [
    { x: -18, y: -8 },
    { x: -6, y: 7 },
    { x: 6, y: -5 },
    { x: 18, y: 9 },
  ];
  const offset = formationOffsets[swarmIndex % formationOffsets.length];

  return {
    type: "bat",
    name: "swarm bat",
    airborne: true,
    x: ENEMY_BASE_X - 62 + offset.x,
    y: COMBAT_LINE_Y,
    w: 42,
    h: 44,
    hp: CHAPTER2_BAT_HP,
    maxHp: CHAPTER2_BAT_HP,
    speed: 53 + wave * 2,
    damage: 7 + wave,
    range: 34,
    cooldown: 0,
    attackSpeed: 0.82,
    animTime: swarmIndex * 0.17,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.34,
    paralyzeTimer: 0,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.48,
    deathRewarded: false,
    runestoneReward: 3,
    flightOffset: CHAPTER2_BAT_SPRITE.flightOffsetY + offset.y,
    swarmIndex,
  };
}

function spawnChapter2BatSwarm(wave) {
  for (let index = 0; index < CHAPTER2_BAT_SWARM_SIZE; index += 1) {
    gameState.enemies.push(createChapter2BatEnemy(wave, index));
  }
}

function isFriendlyUnitForSkeletonCurse(unit) {
  return Boolean(
    unit
    && gameState
    && Array.isArray(gameState.units)
    && gameState.units.includes(unit)
    && isCombatAlive(unit)
  );
}

function applySkeletonDeathCurse(enemy) {
  if (!enemy || enemy.type !== "skeleton" || enemy.canApplyCurse === false) return false;

  const target = enemy.lastDamageSource;
  if (!isFriendlyUnitForSkeletonCurse(target)) return false;

  target.skeletonCurseTimer = SKELETON_CURSE_DURATION;
  target.skeletonCurseTickTimer = Math.min(
    Number(target.skeletonCurseTickTimer) || SKELETON_CURSE_TICK_INTERVAL,
    0.45
  );
  target.skeletonCurseDamage = Math.max(
    1,
    Math.ceil((Number(target.maxHp) || 1) * SKELETON_CURSE_MAX_HP_DAMAGE_RATIO)
  );
  target.curseDeathEligible = false;

  gameState.message = "CURSE! 스켈레톤을 처치한 병사의 생명력이 감소합니다.";
  gameState.messageTimer = 1.35;
  return true;
}

function updateSkeletonCurse(unit, dt) {
  if (!unit || unit.dead || unit.hp <= 0 || !(unit.skeletonCurseTimer > 0)) return;

  unit.skeletonCurseTimer = Math.max(0, unit.skeletonCurseTimer - dt);
  unit.skeletonCurseTickTimer = (Number(unit.skeletonCurseTickTimer) || SKELETON_CURSE_TICK_INTERVAL) - dt;

  while (unit.skeletonCurseTickTimer <= 0 && unit.hp > 0) {
    unit.hp -= Math.max(1, Number(unit.skeletonCurseDamage) || 1);
    unit.skeletonCurseTickTimer += SKELETON_CURSE_TICK_INTERVAL;
  }

  if (unit.hp <= 0) {
    unit.curseDeathEligible = true;
    return;
  }

  if (unit.skeletonCurseTimer <= 0) {
    unit.skeletonCurseTimer = 0;
    unit.skeletonCurseTickTimer = 0;
    unit.skeletonCurseDamage = 0;
    unit.curseDeathEligible = false;
  }
}

function shouldTransformCursedUnit(unit) {
  if (!unit || unit.curseTransformSpawned) return false;
  if (!gameState || Number(gameState.chapter) !== 2) return false;
  return Boolean(unit.curseDeathEligible || unit.skeletonCurseTimer > 0);
}

function spawnCursedSkeletonFromUnit(unit) {
  if (!unit || !gameState || !Array.isArray(gameState.enemies)) return false;

  const skeleton = createChapter2SkeletonEnemy(Math.max(1, Number(gameState.wave) || 1));
  const convertedHp = Math.max(skeleton.maxHp, Math.round((Number(unit.maxHp) || 1) * 0.8));
  skeleton.x = Math.max(
    PLAYER_BASE_ATTACK_X + 24,
    Math.min(ENEMY_BASE_X - 48, Number(unit.x) || (PLAYER_BASE_ATTACK_X + 24))
  );
  skeleton.y = Number(unit.y) || COMBAT_LINE_Y;
  skeleton.hp = convertedHp;
  skeleton.maxHp = convertedHp;
  skeleton.damage = Math.max(skeleton.damage, Math.round((Number(unit.damage) || 1) * 0.65));
  skeleton.canApplyCurse = false;
  skeleton.deathRewarded = true;
  skeleton.isConvertedAlly = true;
  skeleton.convertedFromUnitType = unit.type || "unit";
  gameState.enemies.push(skeleton);

  gameState.message = "저주받은 병사가 적 스켈레톤으로 되살아났습니다!";
  gameState.messageTimer = 1.5;
  return true;
}

function drawSkeletonCurseEffect(unit) {
  if (!unit || !(unit.skeletonCurseTimer > 0)) return;

  const pulse = 0.5 + Math.sin(performance.now() * 0.009) * 0.5;
  ctx.save();
  ctx.globalAlpha = 0.5 + pulse * 0.25;
  ctx.strokeStyle = "#b44cff";
  ctx.fillStyle = "rgba(84, 15, 125, 0.18)";
  ctx.shadowColor = "#d77aff";
  ctx.shadowBlur = 9;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, -28, 24 + pulse * 3, 34 + pulse * 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.globalAlpha = 0.9;
  ctx.shadowBlur = 4;
  ctx.font = "700 9px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f2c4ff";
  ctx.fillText(`CURSE ${Math.max(1, Math.ceil(unit.skeletonCurseTimer))}`, 0, -79);
  ctx.restore();
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
  const phaseTwoHp = 1400 + wave * 200;
  const baseDamage = 44 + wave * 9;
  const baseAttackSpeed = 1.35;
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
    damage: baseDamage,
    baseDamage,
    range: 295,
    cooldown: 0.35,
    attackSpeed: baseAttackSpeed,
    baseAttackSpeed,
    rageStacks: 0,
    rageMultiplier: 1,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.82,
    face: -1,
    swordWaveTarget: null,
    swordWavePending: false,
    swordWaveSplashRadius: 76,
    clawTarget: null,
    clawHitPending: false,
    karonCounterTarget: null,
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

function shouldTriggerKaronBossByEnemyGate() {
  if (!gameState || gameState.karonBossSpawned || Number(gameState.stage) !== 3) return false;
  const enemyBaseMaxHp = Math.max(1, Number(gameState.enemyBaseMaxHp) || 0);
  return Math.max(0, Number(gameState.enemyBaseHp) || 0) <= enemyBaseMaxHp * KARON_GATE_TRIGGER_HP_RATIO;
}

function spawnKaronBoss(trigger = "wave") {
  if (!gameState || gameState.karonBossSpawned || Number(gameState.stage) !== 3) return false;
  const bossWave = Math.max(Number(gameState.wave) || 1, Number(gameState.maxWave) || 1);
  gameState.karonBossSpawned = true;
  gameState.karonBossTrigger = trigger;
  gameState.enemies.push(createKaronBoss(bossWave));
  if (typeof spawnStageThreeBossOpeningMinions === "function") {
    spawnStageThreeBossOpeningMinions();
  }
  return true;
}

function trySpawnKaronBossByEnemyGate() {
  if (!shouldTriggerKaronBossByEnemyGate()) return false;
  return spawnKaronBoss("gate");
}

function isKaronWerewolf(enemy) {
  return enemy && enemy.type === "karon" && enemy.bossPhase === "werewolf";
}

function isKaronAtPlayerGate(enemy) {
  if (!enemy || enemy.type !== "karon") return false;
  const baseStopX = getKaronPlayerGateStopX(isKaronWerewolf(enemy));
  return Boolean(enemy.playerGateHitPending || enemy.x <= baseStopX + 18);
}

function isHeroBehindKaron(enemy, hero = gameState && gameState.hero) {
  if (!enemy || !hero) return false;
  const face = enemy.face || -1;
  return face < 0
    ? hero.x > enemy.x + KARON_BACK_ATTACK_MIN_DISTANCE
    : hero.x < enemy.x - KARON_BACK_ATTACK_MIN_DISTANCE;
}

function clearKaronCounterTarget(enemy) {
  if (!enemy || enemy.type !== "karon") return;
  enemy.karonCounterTarget = null;
}

function notifyKaronHitByHero(enemy) {
  if (!enemy || enemy.type !== "karon" || enemy.dead || enemy.transforming) return;

  const hero = gameState && gameState.hero;
  if (!isCombatAlive(hero)) return;
  if (!isKaronAtPlayerGate(enemy) || !isHeroBehindKaron(enemy, hero)) return;

  enemy.karonCounterTarget = hero;
  enemy.face = hero.x >= enemy.x ? 1 : -1;
  enemy.playerGateHitPending = false;
  enemy.swordWaveTarget = null;
  enemy.swordWavePending = false;
  enemy.clawTarget = null;
  enemy.clawHitPending = false;
  enemy.attackAnimTimer = 0;
  enemy.cooldown = Math.min(enemy.cooldown || 0, 0.18);
}

function getKaronCounterTarget(enemy) {
  if (!enemy || enemy.type !== "karon") return null;

  const target = isCombatAlive(enemy.karonCounterTarget)
    ? enemy.karonCounterTarget
    : null;

  if (!target) {
    clearKaronCounterTarget(enemy);
    return null;
  }

  if (Math.abs(target.x - enemy.x) > KARON_HERO_COUNTER_RELEASE_DISTANCE) {
    clearKaronCounterTarget(enemy);
    return null;
  }

  return target;
}

function getKaronTargetDirection(enemy, target) {
  return target && target.x >= enemy.x ? 1 : -1;
}

function moveKaronTowardTarget(enemy, target, dt) {
  const direction = getKaronTargetDirection(enemy, target);
  enemy.face = direction;
  enemy.x += direction * enemy.speed * dt;
  enemy.moving = true;
}

function getKaronRageStacks(enemy) {
  if (!enemy || enemy.type !== "karon" || enemy.transforming || enemy.bossPhase === "transform") return 0;
  const maxHp = Math.max(1, Number(enemy.maxHp) || 1);
  const hp = Math.max(0, Number(enemy.hp) || 0);
  const lostRatio = Math.max(0, 1 - hp / maxHp);
  return Math.min(KARON_RAGE_MAX_STACKS, Math.floor((lostRatio + 1e-9) / KARON_RAGE_HP_STEP));
}

function setKaronBaseCombatStats(enemy, damage, attackSpeed) {
  if (!enemy || enemy.type !== "karon") return;
  enemy.baseDamage = Math.max(1, Math.round(Number(damage) || 1));
  enemy.baseAttackSpeed = Math.max(0.1, Number(attackSpeed) || 1);
  applyKaronRageStats(enemy);
}

function applyKaronRageStats(enemy) {
  if (!enemy || enemy.type !== "karon") return;

  const previousStacks = Math.max(0, Number(enemy.rageStacks) || 0);
  const rageStacks = getKaronRageStacks(enemy);
  const multiplier = 1 + rageStacks * KARON_RAGE_STACK_BONUS;
  const baseDamage = Math.max(1, Math.round(Number(enemy.baseDamage ?? enemy.damage) || 1));
  const baseAttackSpeed = Math.max(0.1, Number(enemy.baseAttackSpeed ?? enemy.attackSpeed) || 1);

  enemy.rageStacks = rageStacks;
  enemy.rageMultiplier = multiplier;
  enemy.damage = Math.max(1, Math.round(baseDamage * multiplier));
  enemy.attackSpeed = Math.max(0.1, baseAttackSpeed / multiplier);

  if (rageStacks > previousStacks && typeof enemy.cooldown === "number") {
    enemy.cooldown = Math.min(enemy.cooldown, enemy.attackSpeed);
  }
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
  clearKaronCounterTarget(enemy);
  enemy.playerGateHitPending = false;
  enemy.paralyzeTimer = 0;
  enemy.transformAnimDuration = KARON_TRANSFORM_SPRITE.transformDuration;
  enemy.transformAnimTimer = 0;
  enemy.animTime = 0;
  enemy.deathAnimTimer = 0;

  gameState.message = "카론 변신!";
  gameState.messageTimer = 1.2;
  if (window.GameAudio) window.GameAudio.playSfx("wolfChange", { cooldown: 1000, volume: 0.9 });
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
  enemy.range = 92;
  enemy.cooldown = 0.35;
  enemy.attackAnimTimer = 0;
  enemy.attackAnimDuration = 0.82;
  enemy.deathAnimDuration = 1.05;
  setKaronBaseCombatStats(enemy, 120 + wave * 18, 0.96);
  enemy.swordWaveTarget = null;
  enemy.swordWavePending = false;
  enemy.clawTarget = null;
  enemy.clawHitPending = false;
  clearKaronCounterTarget(enemy);
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
  const attackInterval = enemy.baseAttackSpeed || enemy.attackSpeed || 1;
  gameState.playerBaseHp -= enemy.damage * damageScale * attackInterval;
  spawnHit(PLAYER_BASE_ATTACK_HIT_X, GROUND_Y - (werewolf ? 90 : 78), werewolf ? "#ff3b79" : "#ff6d4a");
  enemy.playerGateHitPending = false;
}

function startKaronPlayerGateAttack(enemy, attackDuration) {
  enemy.cooldown = enemy.attackSpeed;
  enemy.attackAnimTimer = attackDuration;
  enemy.face = -1;
  enemy.playerGateHitPending = true;
  enemy.swordWaveTarget = null;
  enemy.swordWavePending = false;
  enemy.clawTarget = null;
  enemy.clawHitPending = false;
  enemy.moving = false;
  if (window.GameAudio) window.GameAudio.playEnemyAttackSfx(enemy);
}

function updateKaronEnemy(enemy, dt) {
  if (enemy.transforming || enemy.bossPhase === "transform") {
    updateKaronTransformation(enemy, dt);
    return;
  }

  applyKaronRageStats(enemy);

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

  const counterTarget = getKaronCounterTarget(enemy);
  const target = counterTarget || findNearestAlly(enemy.x, enemy.range);
  const baseStopX = getKaronPlayerGateStopX(werewolf);

  if (target) {
    const distanceToTarget = Math.abs(target.x - enemy.x);
    const targetInRange = counterTarget ? distanceToTarget <= enemy.range : true;
    enemy.face = getKaronTargetDirection(enemy, target);

    if (!targetInRange) {
      moveKaronTowardTarget(enemy, target, dt);
    } else if (enemy.cooldown <= 0 && enemy.attackAnimTimer <= 0) {
      enemy.cooldown = enemy.attackSpeed;
      enemy.attackAnimTimer = attackDuration;
      if (window.GameAudio) window.GameAudio.playEnemyAttackSfx(enemy);
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
    enemy.face = -1;
    if (enemy.cooldown <= 0 && enemy.attackAnimTimer <= 0) {
      startKaronPlayerGateAttack(enemy, attackDuration);
    }
  } else {
    enemy.face = -1;
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
  const chapter = Number(gameState.chapter) || 1;
  const isStageOne = stage === 1;

  if (chapter === 2 && stage === 1) {
    gameState.enemies.push(createChapter2SkeletonEnemy(wave));
    return;
  }

  if (chapter === 2 && stage === 2) {
    const spawnIndex = Math.max(0, Number(gameState.spawnedInWave) || 0);
    if (spawnIndex % 2 === 0) {
      spawnChapter2BatSwarm(wave);
    } else {
      gameState.enemies.push(createChapter2Stage2GoblinEnemy(wave));
    }
    return;
  }

  if (stage === 2) {
    gameState.enemies.push(shouldSpawnEvileye(wave) ? createEvileyeEnemy(wave) : createGoblinEnemy(wave, false));
    return;
  }

  if (stage === 3) {
    if (gameState.karonBossSpawned) {
      return;
    }
    if (shouldTriggerKaronBossByEnemyGate()) {
      spawnKaronBoss("gate");
      return;
    }
    if (shouldSpawnKaronBoss(wave)) {
      spawnKaronBoss("wave");
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
          if (window.GameAudio) window.GameAudio.playEnemyAttackSfx(enemy);
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
        if (window.GameAudio) window.GameAudio.playEnemyAttackSfx(enemy);
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

function canDrawChapter2SkeletonSprite(enemy) {
  return chapter2SkeletonSpriteReady && enemy.type === "skeleton";
}

function canDrawChapter2BatSprite(enemy) {
  return chapter2BatSpriteReady && enemy.type === "bat";
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

  ctx.scale((enemy.face || -1) < 0 ? -1 : 1, 1);
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

function drawChapter2BatSprite(enemy) {
  if (!canDrawChapter2BatSprite(enemy)) return false;

  const isDying = enemy.dead || enemy.hp <= 0;
  const isAttacking = !isDying && enemy.attackAnimTimer > 0;
  const deathDuration = enemy.deathAnimDuration || 0.48;
  const deathProgress = isDying
    ? 1 - Math.max(0, enemy.deathAnimTimer || 0) / deathDuration
    : 0;
  const attackDuration = enemy.attackAnimDuration || 0.34;
  const attackProgress = isAttacking
    ? 1 - Math.max(0, enemy.attackAnimTimer || 0) / attackDuration
    : 0;
  const hover = isDying || enemy.paralyzeTimer > 0
    ? 0
    : Math.sin((enemy.animTime || 0) * 10 + (enemy.swarmIndex || 0) * 0.8) * 3;
  const wingPulse = isDying
    ? 1
    : 0.94 + Math.sin((enemy.animTime || 0) * 13 + (enemy.swarmIndex || 0)) * 0.06;
  const attackLunge = isAttacking ? -Math.sin(attackProgress * Math.PI) * 7 : 0;
  const drawW = CHAPTER2_BAT_SPRITE.drawW;
  const drawH = CHAPTER2_BAT_SPRITE.drawH;
  const flightOffset = enemy.flightOffset || CHAPTER2_BAT_SPRITE.flightOffsetY;

  ctx.save();
  ctx.translate(enemy.x + attackLunge, enemy.y - flightOffset + hover + deathProgress * 42);

  if (isDying) {
    ctx.globalAlpha = Math.max(0.1, 1 - deathProgress * 0.9);
    ctx.rotate(-deathProgress * 0.65);
  }

  ctx.scale(1, wingPulse);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(
    chapter2BatSprite,
    -drawW / 2,
    -drawH / 2,
    drawW,
    drawH
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

function drawChapter2SkeletonSprite(enemy) {
  if (!canDrawChapter2SkeletonSprite(enemy)) return false;

  let anim = "walk";
  if (enemy.dead || enemy.hp <= 0) anim = "death";
  else if (enemy.attackAnimTimer > 0) anim = "attack";

  const frameCount = CHAPTER2_SKELETON_SPRITE.frames[anim] || 1;
  const fps = CHAPTER2_SKELETON_SPRITE.fps[anim] || 8;
  let frame = Math.floor((enemy.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = enemy.attackAnimDuration || 0.6;
    const progress = 1 - Math.max(0, enemy.attackAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  } else if (anim === "death") {
    const duration = enemy.deathAnimDuration || 0.86;
    const progress = 1 - Math.max(0, enemy.deathAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const frameW = chapter2SkeletonSprite.naturalWidth / CHAPTER2_SKELETON_SPRITE.columns;
  const frameH = chapter2SkeletonSprite.naturalHeight / CHAPTER2_SKELETON_SPRITE.rowCount;
  const sx = frame * frameW;
  const sy = CHAPTER2_SKELETON_SPRITE.rows[anim] * frameH;
  const dw = CHAPTER2_SKELETON_SPRITE.drawW;
  const dh = CHAPTER2_SKELETON_SPRITE.drawH;
  const deathGroundOffsets = [32, 31, 32, 28, 28, 26];
  const groundOffsetY = anim === "walk"
    ? 8
    : anim === "death"
      ? deathGroundOffsets[frame] || 28
      : 14;

  ctx.save();
  ctx.translate(enemy.x, enemy.y);

  if (anim === "death") {
    const duration = enemy.deathAnimDuration || 0.86;
    const progress = 1 - Math.max(0, enemy.deathAnimTimer || 0) / duration;
    ctx.globalAlpha = Math.max(0.22, 1 - progress * 0.42);
  }

  ctx.fillStyle = "rgba(0,0,0,0.24)";
  ctx.beginPath();
  ctx.ellipse(0, 5, anim === "death" ? 48 : 31, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // The source artwork already faces screen-left, matching the enemy movement.
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(
    chapter2SkeletonSprite,
    sx,
    sy,
    frameW,
    frameH,
    -dw / 2,
    -dh + groundOffsetY,
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

  const usedChapter2BatSprite = drawChapter2BatSprite(enemy);
  if (usedChapter2BatSprite) {
    const isDying = enemy.dead || enemy.hp <= 0;
    if (!isDying) {
      const flightOffset = enemy.flightOffset || CHAPTER2_BAT_SPRITE.flightOffsetY;
      drawHealthBar(
        enemy.x,
        enemy.y - flightOffset - CHAPTER2_BAT_SPRITE.drawH / 2 - 9,
        CHAPTER2_BAT_SPRITE.healthBarWidth,
        enemy.hp,
        enemy.maxHp,
        "#ff6868"
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

  const usedChapter2SkeletonSprite = drawChapter2SkeletonSprite(enemy);
  if (usedChapter2SkeletonSprite) {
    const isDying = enemy.dead || enemy.hp <= 0;
    if (!isDying) {
      drawHealthBar(
        enemy.x,
        enemy.y - CHAPTER2_SKELETON_SPRITE.healthBarOffsetY,
        30,
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
