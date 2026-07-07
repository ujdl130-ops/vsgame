// Friendly unit summoning, behavior, and rendering.

const THIEF_ATTACK_DURATION = 0.42;
const THIEF_RETREAT_DURATION = 0.45;
const THIEF_RETREAT_SPEED = 190;
const THIEF_RETREAT_MIN_X = PLAYER_BASE_X + 58;

function getSummonFormationStats(baseId, fallbackBaseStats) {
  if (typeof getFormationBattleStats === "function") {
    const formationStats = getFormationBattleStats(baseId);
    if (formationStats) return formationStats;
  }

  const grownStats = getGrownStats(baseId, fallbackBaseStats);
  return {
    ...grownStats,
    damage: typeof grownStats.damage === "number" ? grownStats.damage : (fallbackBaseStats.damage || 0),
    healAmount: typeof grownStats.healAmount === "number" ? grownStats.healAmount : fallbackBaseStats.healAmount,
    defense: 0,
  };
}

function summonGuard() {
  if (!hasSummonSlot()) {
    showSummonLimitMessage();
    updateHud();
    updateButtons();
    return;
  }
  if (!spendRunestone(50)) return;
  const stats = getSummonFormationStats("guard", { hp: 115, damage: 10 });
  gameState.units.push({
    type: "guard",
    name: "방패병",
    level: stats.level,
    star: stats.star,
    x: PLAYER_BASE_X + 70,
    y: COMBAT_LINE_Y,
    w: 34,
    h: 56,
    hp: stats.hp,
    maxHp: stats.hp,
    defense: stats.defense || 0,
    speed: 48,
    damage: stats.damage,
    range: stats.range || 42,
    cooldown: 0,
    attackSpeed: stats.attackSpeed || 1.0,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.46,
    attackImpactPending: false,
    attackTarget: null,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.85,
    deathRewarded: false,
  });
  if (typeof recordStageMissionGuardSummon === "function") recordStageMissionGuardSummon();
}

function summonArcher() {
  if (!hasSummonSlot()) {
    showSummonLimitMessage();
    updateHud();
    updateButtons();
    return;
  }
  if (!spendRunestone(75)) return;
  const stats = getSummonFormationStats("archer", { hp: 48, damage: 13 });
  gameState.units.push({
    type: "archer",
    name: "궁수",
    level: stats.level,
    star: stats.star,
    x: PLAYER_BASE_X + 62,
    y: COMBAT_LINE_Y,
    w: 32,
    h: 52,
    hp: stats.hp,
    maxHp: stats.hp,
    defense: stats.defense || 0,
    speed: 42,
    damage: stats.damage,
    range: stats.range || 175,
    cooldown: 0,
    attackSpeed: stats.attackSpeed || 0.85,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.58,
    pendingArrowShot: false,
    shotTarget: null,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.85,
    deathRewarded: false,
  });
  if (typeof recordStageMissionArcherSummon === "function") recordStageMissionArcherSummon();
}

function summonMage() {
  if (!hasSummonSlot()) {
    showSummonLimitMessage();
    updateHud();
    updateButtons();
    return;
  }
  if (!spendRunestone(100)) return;
  const stats = getSummonFormationStats("mage", { hp: 42, damage: 15 });
  gameState.units.push({
    type: "mage",
    name: "마법사",
    level: stats.level,
    star: stats.star,
    x: PLAYER_BASE_X + 58,
    y: COMBAT_LINE_Y,
    w: 32,
    h: 52,
    hp: stats.hp,
    maxHp: stats.hp,
    defense: stats.defense || 0,
    speed: 38,
    damage: stats.damage,
    range: stats.range || 155,
    cooldown: 0,
    attackSpeed: stats.attackSpeed || 1.2,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.72,
    pendingMageShot: false,
    shotTarget: null,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.85,
    deathRewarded: false,
  });
}

function summonSaintess() {
  if (!hasSummonSlot()) {
    showSummonLimitMessage();
    updateHud();
    updateButtons();
    return;
  }
  if (!spendRunestone(120)) return;
  const stats = getSummonFormationStats("saintess", { hp: 54, damage: 0, healAmount: 8 });
  gameState.units.push({
    type: "saintess",
    name: "성녀",
    level: stats.level,
    star: stats.star,
    x: PLAYER_BASE_X + 56,
    y: COMBAT_LINE_Y,
    w: 32,
    h: 52,
    hp: stats.hp,
    maxHp: stats.hp,
    defense: stats.defense || 0,
    speed: 36,
    damage: stats.damage || 0,
    range: stats.range || 130,
    cooldown: 0,
    attackSpeed: stats.attackSpeed || 1.2,
    healRange: stats.range || 130,
    healAmount: stats.healAmount || stats.damage || 8,
    healInterval: 1.2,
    healCooldown: 0,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.72,
    pendingHealPulse: false,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.85,
    deathRewarded: false,
  });
}

function summonThief() {
  if (!hasSummonSlot()) {
    showSummonLimitMessage();
    updateHud();
    updateButtons();
    return;
  }
  if (!spendRunestone(90)) return;
  const stats = getSummonFormationStats("thief", { hp: 58, damage: 28 });
  gameState.units.push({
    type: "thief",
    name: "도적",
    level: stats.level,
    star: stats.star,
    x: PLAYER_BASE_X + 64,
    y: COMBAT_LINE_Y,
    w: 30,
    h: 52,
    hp: stats.hp,
    maxHp: stats.hp,
    defense: stats.defense || 0,
    speed: 72,
    damage: stats.damage,
    range: stats.range || 36,
    cooldown: 0,
    attackSpeed: stats.attackSpeed || 1.35,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: THIEF_ATTACK_DURATION,
    attackImpactPending: false,
    attackTarget: null,
    retreatTimer: 0,
    retreatDuration: THIEF_RETREAT_DURATION,
    retreatSpeed: THIEF_RETREAT_SPEED,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.78,
    deathRewarded: false,
  });
}

function startThiefRetreat(unit) {
  unit.retreatDuration = unit.retreatDuration || THIEF_RETREAT_DURATION;
  unit.retreatTimer = unit.retreatDuration;
  unit.moving = true;
}

function findSaintessHealTargets(unit) {
  const candidates = [];
  if (isCombatAlive(gameState.hero)) candidates.push(gameState.hero);

  for (const ally of gameState.units) {
    if (ally !== unit && isCombatAlive(ally)) candidates.push(ally);
  }

  return candidates
    .filter((ally) => ally.hp < ally.maxHp && Math.abs(ally.x - unit.x) <= unit.healRange)
    .sort((a, b) => Math.abs(a.x - unit.x) - Math.abs(b.x - unit.x));
}

function performSaintessHeal(unit) {
  const targets = findSaintessHealTargets(unit);
  if (!targets.length) {
    unit.pendingHealPulse = false;
    return;
  }

  for (const ally of targets) {
    ally.hp = Math.min(ally.maxHp, ally.hp + unit.healAmount);
    spawnHeal(ally.x, ally.y - 50);
  }

  unit.pendingHealPulse = false;
}

function updateUnits(dt) {
  for (const unit of gameState.units) {
    unit.animTime = (unit.animTime || 0) + dt;

    if (unit.hp <= 0 || unit.dead) {
      startUnitDeath(unit);
      unit.deathAnimTimer = Math.max(0, (unit.deathAnimTimer || 0) - dt);
      continue;
    }

    unit.cooldown = Math.max(0, unit.cooldown - dt);
    unit.moving = false;

    const previousAttackTimer = unit.attackAnimTimer || 0;
    unit.attackAnimDuration = unit.attackAnimDuration || (unit.type === "guard" ? 0.46 : unit.type === "thief" ? THIEF_ATTACK_DURATION : (unit.type === "mage" || unit.type === "saintess") ? 0.72 : 0.58);
    unit.attackAnimTimer = Math.max(0, previousAttackTimer - dt);

    const attackProgress = unit.attackAnimTimer > 0
      ? 1 - unit.attackAnimTimer / unit.attackAnimDuration
      : 1;

    if (unit.type === "thief" && (unit.retreatTimer || 0) > 0) {
      unit.retreatTimer = Math.max(0, unit.retreatTimer - dt);
      unit.x = Math.max(THIEF_RETREAT_MIN_X, unit.x - (unit.retreatSpeed || THIEF_RETREAT_SPEED) * dt);
      unit.moving = true;
      continue;
    }

    // 궁수는 별도의 공격 모션이 없습니다. 공격 / 걷기 / 사망 모션만 사용합니다.
    // 궁수는 지정한 타이밍에 투사체를 발사합니다.
    if (unit.type === "archer" && unit.pendingArrowShot && (attackProgress >= 0.62 || unit.attackAnimTimer <= 0)) {
      fireArcherArrow(unit);
    }

    if (unit.type === "mage" && unit.pendingMageShot && (attackProgress >= 0.66 || unit.attackAnimTimer <= 0)) {
      fireMageBolt(unit);
    }

    if (unit.type === "mage" && unit.attackAnimTimer > 0) {
      continue;
    }

    if (unit.type === "saintess") {
      unit.healCooldown = Math.max(0, (unit.healCooldown || 0) - dt);

      if (unit.pendingHealPulse && (attackProgress >= 0.62 || unit.attackAnimTimer <= 0)) {
        performSaintessHeal(unit);
      }

      if (unit.attackAnimTimer > 0) {
        continue;
      }

      const healTargets = findSaintessHealTargets(unit);
      if (healTargets.length && unit.healCooldown <= 0) {
        unit.healCooldown = unit.healInterval || 1.2;
        unit.attackAnimDuration = 0.72;
        unit.attackAnimTimer = unit.attackAnimDuration;
        unit.pendingHealPulse = true;
        continue;
      }

      if (healTargets.length) {
        continue;
      }

      unit.x += unit.speed * dt;
      unit.moving = true;

      if (unit.x > ENEMY_BASE_X - 35) {
        gameState.enemyBaseHp -= 4 * dt;
        unit.x = ENEMY_BASE_X - 35;
        unit.moving = false;
      }
      continue;
    }

    // 근접 유닛은 무기를 앞으로 내미는 프레임에 피해를 적용합니다.
    if ((unit.type === "guard" || unit.type === "thief") && unit.attackImpactPending && (attackProgress >= 0.48 || unit.attackAnimTimer <= 0)) {
      const attackTarget = isCombatAlive(unit.attackTarget)
        ? unit.attackTarget
        : findNearestEnemy(unit.x, unit.range + 12, { includeAirborne: false });

      if (canDamageCombatant(attackTarget)) {
        attackTarget.hp -= unit.damage;
        if (unit.type === "thief") {
          spawnThiefStrike(attackTarget.x, attackTarget.y - Math.max(34, attackTarget.h * 0.65));
          startThiefRetreat(unit);
        }
      }

      unit.attackImpactPending = false;
      unit.attackTarget = null;

      if (unit.type === "thief" && (unit.retreatTimer || 0) > 0) {
        continue;
      }
    }

    const target = findNearestEnemy(unit.x, unit.range, {
      includeAirborne: !(unit.type === "guard" || unit.type === "thief"),
    });

    if (target) {
      if (unit.cooldown <= 0) {
        unit.cooldown = unit.attackSpeed;
        if (unit.type === "archer") {
          unit.attackAnimDuration = 0.58;
          unit.attackAnimTimer = unit.attackAnimDuration;
          unit.pendingArrowShot = true;
          unit.shotTarget = target;
        } else if (unit.type === "mage") {
          unit.attackAnimDuration = 0.72;
          unit.attackAnimTimer = unit.attackAnimDuration;
          unit.pendingMageShot = true;
          unit.shotTarget = target;
        } else if (unit.type === "guard" || unit.type === "thief") {
          unit.attackAnimDuration = unit.type === "guard" ? 0.46 : THIEF_ATTACK_DURATION;
          unit.attackAnimTimer = unit.attackAnimDuration;
          unit.attackImpactPending = true;
          unit.attackTarget = target;
        } else if (canDamageCombatant(target)) {
          target.hp -= unit.damage;
        }
      }
    } else {
      unit.x += unit.speed * dt;
      unit.moving = true;
    }

    if (unit.x > ENEMY_BASE_X - 35) {
      gameState.enemyBaseHp -= unit.type === "guard" ? 18 * dt : unit.type === "thief" ? 14 * dt : unit.type === "mage" ? 10 * dt : 8 * dt;
      unit.x = ENEMY_BASE_X - 35;
      unit.moving = false;
    }
  }
}

function drawGuardSprite(unit) {
  if (!guardSpriteReady) return false;

  let anim = "idle";
  if (unit.dead || unit.hp <= 0) anim = "death";
  else if (unit.attackAnimTimer > 0) anim = "attack";
  else if (unit.moving) anim = "walk";

  const frameCount = GUARD_SPRITE.frames[anim] || 1;
  const fps = GUARD_SPRITE.fps[anim] || 8;
  let frame = Math.floor((unit.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = unit.attackAnimDuration || 0.46;
    const progress = 1 - unit.attackAnimTimer / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  } else if (anim === "death") {
    const duration = unit.deathAnimDuration || 0.85;
    const progress = 1 - Math.max(0, unit.deathAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const sx = frame * GUARD_SPRITE.frameW;
  const sy = GUARD_SPRITE.rows[anim] * GUARD_SPRITE.frameH;
  const dw = GUARD_SPRITE.drawW;
  const dh = GUARD_SPRITE.drawH;
  const baseOffset = GUARD_SPRITE.baseOffset || { x: 0, y: 0 };
  const frameOffset = (GUARD_SPRITE.offsets[anim] && GUARD_SPRITE.offsets[anim][frame]) || { x: 0, y: 0 };

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    guardSprite,
    sx,
    sy,
    GUARD_SPRITE.frameW,
    GUARD_SPRITE.frameH,
    -dw / 2 + baseOffset.x + frameOffset.x,
    -dh + 9 + baseOffset.y + frameOffset.y,
    dw,
    dh
  );

  return true;
}

function drawArcherSprite(unit) {
  if (!archerSpriteReady) return false;

  let anim = "idle";
  if (unit.dead || unit.hp <= 0) anim = "death";
  else if (unit.attackAnimTimer > 0) anim = "attack";
  else if (unit.moving) anim = "walk";

  const frameCount = ARCHER_SPRITE.frames[anim] || 1;
  const fps = ARCHER_SPRITE.fps[anim] || 8;
  let frame = Math.floor((unit.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = unit.attackAnimDuration || 0.58;
    const progress = 1 - unit.attackAnimTimer / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  } else if (anim === "death") {
    const duration = unit.deathAnimDuration || 0.85;
    const progress = 1 - Math.max(0, unit.deathAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const sx = frame * ARCHER_SPRITE.frameW;
  const sy = ARCHER_SPRITE.rows[anim] * ARCHER_SPRITE.frameH;
  const dw = ARCHER_SPRITE.drawW;
  const dh = ARCHER_SPRITE.drawH;

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    archerSprite,
    sx,
    sy,
    ARCHER_SPRITE.frameW,
    ARCHER_SPRITE.frameH,
    -dw / 2 + 2,
    -dh + 8,
    dw,
    dh
  );

  return true;
}

function drawMageSprite(unit) {
  if (!mageSpriteReady) return false;

  let anim = "idle";
  if (unit.dead || unit.hp <= 0) anim = "death";
  else if (unit.attackAnimTimer > 0) anim = "attack";
  else if (unit.moving) anim = "walk";

  const frameCount = MAGE_SPRITE.frames[anim] || 1;
  const fps = MAGE_SPRITE.fps[anim] || 8;
  let frame = Math.floor((unit.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = unit.attackAnimDuration || 0.72;
    const progress = 1 - unit.attackAnimTimer / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  } else if (anim === "death") {
    const duration = unit.deathAnimDuration || 0.85;
    const progress = 1 - Math.max(0, unit.deathAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const sx = frame * MAGE_SPRITE.frameW;
  const sy = MAGE_SPRITE.rows[anim] * MAGE_SPRITE.frameH;
  const dw = MAGE_SPRITE.drawW;
  const dh = MAGE_SPRITE.drawH;

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    mageSprite,
    sx,
    sy,
    MAGE_SPRITE.frameW,
    MAGE_SPRITE.frameH,
    -dw / 2 + 2,
    -dh + 8,
    dw,
    dh
  );

  return true;
}

function drawSaintessSprite(unit) {
  if (!saintessSpriteReady) return false;

  let anim = "idle";
  if (unit.dead || unit.hp <= 0) anim = "death";
  else if (unit.attackAnimTimer > 0) anim = "attack";
  else if (unit.moving) anim = "walk";

  const frameCount = SAINTESS_SPRITE.frames[anim] || 1;
  const fps = SAINTESS_SPRITE.fps[anim] || 8;
  let frame = Math.floor((unit.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = unit.attackAnimDuration || 0.72;
    const progress = 1 - unit.attackAnimTimer / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  } else if (anim === "death") {
    const duration = unit.deathAnimDuration || 0.85;
    const progress = 1 - Math.max(0, unit.deathAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const sx = frame * SAINTESS_SPRITE.frameW;
  const sy = SAINTESS_SPRITE.rows[anim] * SAINTESS_SPRITE.frameH;
  const dw = SAINTESS_SPRITE.drawW;
  const dh = SAINTESS_SPRITE.drawH;

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    saintessSprite,
    sx,
    sy,
    SAINTESS_SPRITE.frameW,
    SAINTESS_SPRITE.frameH,
    -dw / 2 + 2,
    -dh + 8,
    dw,
    dh
  );

  return true;
}

function drawThiefSprite(unit) {
  if (!thiefSpriteReady) return false;

  let anim = "idle";
  if (unit.dead || unit.hp <= 0) anim = "death";
  else if (unit.attackAnimTimer > 0) anim = "attack";
  else if (unit.moving) anim = "walk";

  const frameCount = THIEF_SPRITE.frames[anim] || 1;
  const fps = THIEF_SPRITE.fps[anim] || 8;
  let frame = Math.floor((unit.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = unit.attackAnimDuration || THIEF_ATTACK_DURATION;
    const progress = 1 - unit.attackAnimTimer / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  } else if (anim === "death") {
    const duration = unit.deathAnimDuration || 0.78;
    const progress = 1 - Math.max(0, unit.deathAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const sx = frame * THIEF_SPRITE.frameW;
  const sy = THIEF_SPRITE.rows[anim] * THIEF_SPRITE.frameH;
  const dw = THIEF_SPRITE.drawW;
  const dh = THIEF_SPRITE.drawH;

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    thiefSprite,
    sx,
    sy,
    THIEF_SPRITE.frameW,
    THIEF_SPRITE.frameH,
    -dw / 2 + 2,
    -dh + 8,
    dw,
    dh
  );

  return true;
}

function drawUnit(unit) {
  ctx.save();
  ctx.translate(unit.x, unit.y);
  const isDying = unit.dead || unit.hp <= 0;
  const bob = isDying ? 0 : Math.sin((performance.now() + unit.x * 10) * 0.01) * 2;

  if (isDying) {
    const duration = unit.deathAnimDuration || 0.85;
    const progress = 1 - Math.max(0, unit.deathAnimTimer || 0) / duration;
    ctx.globalAlpha = Math.max(0.25, 1 - progress * 0.45);
  }

  // 그림자는 바닥에 고정합니다. 그림자가 캐릭터와 같이 흔들리면 걷기 모션이 어색해 보입니다.
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 3, 22, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  if (!isDying && unit.type === "saintess" && unit.attackAnimTimer > 0) {
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = "#fff1a8";
    ctx.shadowColor = "rgba(255, 241, 168, 0.85)";
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, -28, 35, 20, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (unit.type === "guard") {
    const drewSprite = drawGuardSprite(unit);

    if (!drewSprite) {
      ctx.translate(0, bob);

      ctx.fillStyle = "#5db7ff";
      ctx.fillRect(-14, -42, 28, 34);
      ctx.fillStyle = "#ffd7ac";
      ctx.fillRect(-11, -58, 22, 18);
      ctx.fillStyle = "#d6f1ff";
      ctx.fillRect(8, -40, 18, 26);
      ctx.strokeStyle = "#e9fbff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(20, -42);
      ctx.lineTo(42, -54);
      ctx.stroke();
    }
  } else if (unit.type === "archer") {
    const drewSprite = drawArcherSprite(unit);

    if (!drewSprite) {
      ctx.translate(0, bob);

      ctx.fillStyle = "#7be05e";
      ctx.fillRect(-13, -38, 26, 30);
      ctx.fillStyle = "#ffd7ac";
      ctx.fillRect(-10, -54, 20, 17);
      ctx.strokeStyle = "#6a3e1f";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(18, -35, 17, -1.2, 1.2);
      ctx.stroke();
    }
  } else if (unit.type === "mage") {
    const drewSprite = drawMageSprite(unit);

    if (!drewSprite) {
      ctx.translate(0, bob);

      ctx.fillStyle = "#573aa8";
      ctx.fillRect(-13, -39, 26, 31);
      ctx.fillStyle = "#f04444";
      ctx.fillRect(-12, -56, 24, 18);
      ctx.strokeStyle = "#7b4a23";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(18, -14);
      ctx.lineTo(26, -58);
      ctx.stroke();
      ctx.fillStyle = "#ffbd35";
      ctx.beginPath();
      ctx.arc(27, -61, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (unit.type === "saintess") {
    const drewSprite = drawSaintessSprite(unit);

    if (!drewSprite) {
      ctx.translate(0, bob);

      ctx.fillStyle = "#fff1c7";
      ctx.fillRect(-13, -39, 26, 31);
      ctx.fillStyle = "#f6c2d9";
      ctx.fillRect(-10, -56, 20, 18);
      ctx.strokeStyle = "#c99a35";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(18, -14);
      ctx.lineTo(26, -58);
      ctx.stroke();
      ctx.fillStyle = "#8ff7ff";
      ctx.beginPath();
      ctx.arc(27, -61, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (unit.type === "thief") {
    const retreatRatio = unit.retreatDuration
      ? Math.max(0, Math.min(1, (unit.retreatTimer || 0) / unit.retreatDuration))
      : 0;

    if (retreatRatio > 0 && thiefSpriteReady) {
      for (let i = 3; i >= 1; i--) {
        ctx.save();
        ctx.globalAlpha = retreatRatio * (0.06 + i * 0.05);
        ctx.translate(i * 13, 0);
        drawThiefSprite(unit);
        ctx.restore();
      }
    }

    const drewSprite = drawThiefSprite(unit);

    if (!drewSprite) {
      ctx.translate(0, bob);

      if (retreatRatio > 0) {
        ctx.save();
        ctx.globalAlpha = 0.45 * retreatRatio;
        ctx.strokeStyle = "#cfffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(18, -44);
        ctx.lineTo(44, -52);
        ctx.moveTo(14, -28);
        ctx.lineTo(38, -34);
        ctx.stroke();
        ctx.restore();
      }

      ctx.fillStyle = "#2f2a42";
      ctx.fillRect(-12, -38, 24, 30);
      ctx.fillStyle = "#ffd7ac";
      ctx.fillRect(-10, -54, 20, 17);
      ctx.fillStyle = "#503a7d";
      ctx.fillRect(-14, -31, 28, 13);
      ctx.strokeStyle = "#d9d7f6";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(14, -24);
      ctx.lineTo(32, -38);
      ctx.stroke();
    }
  }

  ctx.restore();
  if (!isDying) drawHealthBar(unit.x, unit.y - 68, 42, unit.hp, unit.maxHp, "#68d8ff");
}
