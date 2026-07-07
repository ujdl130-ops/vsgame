// Battle helpers, update pipeline, and draw pipeline.

function isCombatAlive(entity) {
  return Boolean(entity && !entity.dead && entity.hp > 0);
}

function canDamageCombatant(entity) {
  return Boolean(isCombatAlive(entity) && !entity.transforming);
}

function getDefenseMitigatedDamage(target, rawDamage) {
  const damage = Math.max(0, Number(rawDamage) || 0);
  const defense = Math.max(0, Number(target && target.defense) || 0);
  if (damage <= 0 || defense <= 0) return damage;

  const reduction = defense / (defense + 100);
  return Math.max(1, Math.round(damage * (1 - reduction)));
}

function damageCombatant(target, rawDamage) {
  if (!target) return 0;
  const damage = getDefenseMitigatedDamage(target, rawDamage);
  target.hp -= damage;
  return damage;
}

function startUnitDeath(unit) {
  if (!unit || unit.dead) return;
  unit.dead = true;
  unit.hp = 0;
  unit.moving = false;
  unit.cooldown = 0;
  unit.attackAnimTimer = 0;
  unit.pendingArrowShot = false;
  unit.pendingMageShot = false;
  unit.pendingHealPulse = false;
  unit.attackImpactPending = false;
  unit.retreatTimer = 0;
  unit.shotTarget = null;
  unit.attackTarget = null;
  unit.deathAnimDuration = unit.deathAnimDuration || 0.85;
  unit.deathAnimTimer = unit.deathAnimDuration;
}

function startEnemyDeath(enemy) {
  if (!enemy || enemy.dead) return;
  if (enemy.type === "karon" && typeof startKaronTransformation === "function" && startKaronTransformation(enemy)) return;

  enemy.dead = true;
  enemy.hp = 0;
  enemy.moving = false;
  enemy.cooldown = 0;
  enemy.attackAnimTimer = 0;
  enemy.paralyzeTimer = 0;
  enemy.laserTarget = null;
  enemy.laserHitPending = false;
  enemy.swordWaveTarget = null;
  enemy.swordWavePending = false;
  enemy.clawTarget = null;
  enemy.clawHitPending = false;
  enemy.playerGateHitPending = false;
  enemy.deathAnimDuration = enemy.deathAnimDuration || 0.55;
  enemy.deathAnimTimer = enemy.deathAnimDuration;

  if (enemy.isBoss && typeof recordStageMissionBossDefeat === "function") {
    recordStageMissionBossDefeat();
  }

  if (!enemy.deathRewarded) {
    addRunestone(18);
    enemy.deathRewarded = true;
  }
}

function findNearestEnemy(fromX, range, options = {}) {
  let target = null;
  let bestDistance = Infinity;
  const includeAirborne = options.includeAirborne !== false;
  for (const enemy of gameState.enemies) {
    if (!isCombatAlive(enemy)) continue;
    if (!includeAirborne && enemy.airborne) continue;
    const distance = enemy.x - fromX;
    if (distance >= -20 && distance <= range && distance < bestDistance) {
      target = enemy;
      bestDistance = distance;
    }
  }
  return target;
}

function findNearestAlly(fromX, range) {
  const candidates = gameState.units.filter(isCombatAlive);
  if (gameState.hero && !gameState.hero.dead && gameState.hero.hp > 0) {
    candidates.push(gameState.hero);
  }

  let target = null;
  let bestDistance = Infinity;
  for (const ally of candidates) {
    const distance = fromX - ally.x;
    if (distance >= -10 && distance <= range && distance < bestDistance) {
      target = ally;
      bestDistance = distance;
    }
  }
  return target;
}

function cleanupDeadEntities() {
  for (const enemy of gameState.enemies) {
    if (enemy.hp <= 0) startEnemyDeath(enemy);
  }

  for (const unit of gameState.units) {
    if (unit.hp <= 0 || unit.x >= ENEMY_BASE_X - 15) startUnitDeath(unit);
  }

  // 소환 제한 슬롯은 살아있는 병사 수를 기준으로 계산합니다.
  // 병사가 사망 모션 중이어도 빈 자리는 즉시 다시 사용할 수 있습니다.
  gameState.enemies = gameState.enemies.filter((enemy) => !enemy.dead || enemy.deathAnimTimer > 0);
  gameState.units = gameState.units.filter((unit) => !unit.dead || unit.deathAnimTimer > 0);
}

function checkEndConditions() {
  if (gameState.clear || gameState.gameOver) return;

  if (gameState.enemyBaseHp <= 0) {
    completeStage(`STAGE ${selectedStage} CLEAR! 적 기지 파괴`);
    return;
  }

  if (gameState.playerBaseHp <= 0) {
    gameState.gameOver = true;
    gameState.running = false;
    gameState.message = "DEFEAT! 성이 함락되었습니다.";
    updateButtons();
    if (typeof showStageDefeatUi === "function") showStageDefeatUi();
  }
}

let zeusLightningMask = null;
let zeusLightningMaskFailed = false;

function getZeusStormRenderMetrics(effect, sprite) {
  if (!effect || !sprite || !sprite.naturalWidth || !sprite.naturalHeight) return null;

  const frameCount = ZEUS_THUNDERSTORM_SKILL.frameCount;
  const cloudProgress = Math.max(0, Math.min(1, effect.timer / ZEUS_THUNDERSTORM_SKILL.cloudBuildTime));
  const framePadX = ZEUS_THUNDERSTORM_SKILL.framePadX || 0;
  const rawFrameW = sprite.naturalWidth / frameCount;
  const frameW = rawFrameW - framePadX * 2;
  const frameH = sprite.naturalHeight;

  return {
    frameCount,
    cloudProgress,
    framePadX,
    rawFrameW,
    frameW,
    frameH,
    drawW: frameW,
    drawH: frameH,
    drawX: Math.max(-40, Math.min(canvas.width - frameW + 40, effect.x - frameW / 2)),
    drawY: (ZEUS_THUNDERSTORM_SKILL.stormBaseDrawY ?? -92)
      - (1 - cloudProgress) * (ZEUS_THUNDERSTORM_SKILL.stormIntroYOffset ?? 14),
  };
}

function getZeusLightningFrameInfo(effect) {
  if (!effect || effect.timer < ZEUS_THUNDERSTORM_SKILL.lightningStartTime) return null;

  const lightningTime = effect.timer - ZEUS_THUNDERSTORM_SKILL.lightningStartTime;
  const lightningProgress = Math.max(0, Math.min(0.999, lightningTime / ZEUS_THUNDERSTORM_SKILL.lightningDuration));
  const frame = Math.min(
    ZEUS_THUNDERSTORM_SKILL.frameCount - 1,
    Math.floor(lightningProgress * ZEUS_THUNDERSTORM_SKILL.frameCount)
  );

  return { frame, progress: lightningProgress };
}

function getZeusLightningMask() {
  if (zeusLightningMask || zeusLightningMaskFailed) return zeusLightningMask;
  if (!zeusStormLightningSpriteReady || !zeusStormLightningSprite.naturalWidth) return null;

  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = zeusStormLightningSprite.naturalWidth;
  maskCanvas.height = zeusStormLightningSprite.naturalHeight;
  const maskCtx = maskCanvas.getContext("2d");

  try {
    maskCtx.drawImage(zeusStormLightningSprite, 0, 0);
    const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    zeusLightningMask = {
      width: maskCanvas.width,
      height: maskCanvas.height,
      data: imageData.data,
    };
  } catch (error) {
    zeusLightningMaskFailed = true;
    console.warn("Zeus lightning hit mask could not be prepared.", error);
  }

  return zeusLightningMask;
}

function hasZeusLightningAlphaAt(mask, x, y, radius = 5) {
  const centerX = Math.round(x);
  const centerY = Math.round(y);

  for (let sampleY = centerY - radius; sampleY <= centerY + radius; sampleY += 2) {
    if (sampleY < 0 || sampleY >= mask.height) continue;
    for (let sampleX = centerX - radius; sampleX <= centerX + radius; sampleX += 2) {
      if (sampleX < 0 || sampleX >= mask.width) continue;
      const alpha = mask.data[(sampleY * mask.width + sampleX) * 4 + 3];
      if (alpha > 35) return true;
    }
  }

  return false;
}

function isEnemyNearZeusLightningColumn(enemy, frameInfo, metrics) {
  const columns = ZEUS_THUNDERSTORM_SKILL.lightningHitColumns[frameInfo.frame] || [0.5];
  const radius = ZEUS_THUNDERSTORM_SKILL.lightningColumnRadius || 18;
  const halfW = Math.max(enemy.w * 0.9, 24);
  const enemyLeft = enemy.x - halfW;
  const enemyRight = enemy.x + halfW;
  const enemyTop = enemy.y - Math.max(enemy.h + 24, 76);
  const enemyBottom = enemy.y - 6;
  const boltTop = metrics.drawY + metrics.frameH * 0.28;
  const boltBottom = metrics.drawY + metrics.frameH * 0.74;

  if (enemyBottom < boltTop || enemyTop > boltBottom) return false;

  for (const column of columns) {
    const boltX = metrics.drawX + metrics.drawW * column;
    if (boltX >= enemyLeft - radius && boltX <= enemyRight + radius) return true;
  }

  return false;
}

function isEnemyTouchedByZeusLightning(enemy, effect) {
  if (!isCombatAlive(enemy) || !zeusStormLightningSpriteReady) return false;

  const frameInfo = getZeusLightningFrameInfo(effect);
  const metrics = getZeusStormRenderMetrics(effect, zeusStormLightningSprite);
  if (!frameInfo || !metrics) return false;

  const mask = getZeusLightningMask();
  if (!mask) return isEnemyNearZeusLightningColumn(enemy, frameInfo, metrics);

  const halfW = Math.max(enemy.w * 0.9, 24);
  const topY = enemy.y - Math.max(enemy.h + 24, 76);
  const bottomY = enemy.y - 6;
  const sampleXs = [-0.85, -0.45, 0, 0.45, 0.85];
  const sampleYs = [0.12, 0.3, 0.48, 0.66, 0.84];

  for (const xRatio of sampleXs) {
    const screenX = enemy.x + halfW * xRatio;
    if (screenX < metrics.drawX || screenX > metrics.drawX + metrics.drawW) continue;

    for (const yRatio of sampleYs) {
      const screenY = topY + (bottomY - topY) * yRatio;
      if (screenY < metrics.drawY || screenY > metrics.drawY + metrics.drawH) continue;

      const sourceX = frameInfo.frame * metrics.rawFrameW
        + metrics.framePadX
        + (screenX - metrics.drawX) * (metrics.frameW / metrics.drawW);
      const sourceY = (screenY - metrics.drawY) * (metrics.frameH / metrics.drawH);

      if (hasZeusLightningAlphaAt(mask, sourceX, sourceY)) return true;
    }
  }

  return false;
}

function applyZeusThunderstormDamage() {
  const effect = gameState.zeusSkillEffect;
  if (!effect || !effect.active) return;

  if (!effect.hitEnemies) effect.hitEnemies = new Set();
  const thunderstormDamage = effect.damage || getZeusThunderstormDamage();

  for (const enemy of gameState.enemies) {
    if (!canDamageCombatant(enemy) || effect.hitEnemies.has(enemy)) continue;
    if (!isEnemyTouchedByZeusLightning(enemy, effect)) continue;

    enemy.hp -= thunderstormDamage;
    enemy.paralyzeTimer = Math.max(
      enemy.paralyzeTimer || 0,
      ZEUS_THUNDERSTORM_SKILL.paralysisDuration
    );
    enemy.moving = false;
    enemy.attackAnimTimer = 0;
    effect.hitEnemies.add(enemy);
    spawnHit(enemy.x, enemy.y - Math.max(34, enemy.h * 0.65), "#ffe36a");
  }
}

function updateZeusThunderstormEffect(dt) {
  const effect = gameState.zeusSkillEffect;
  if (!effect || !effect.active) return;

  effect.timer += dt;
  applyZeusThunderstormDamage();
  if (effect.timer >= effect.duration) {
    gameState.zeusSkillEffect = null;
    updateButtons();
  }
}

function getPoseidonTsunamiDamageZone(effect) {
  const tsunamiApi = typeof window !== "undefined" ? window.PoseidonTsunamiAnimation : null;
  if (tsunamiApi && typeof tsunamiApi.getDamageZone === "function") {
    return tsunamiApi.getDamageZone(effect);
  }

  if (!effect || !effect.active) return null;
  const progress = Math.max(0, Math.min(1, effect.timer / (effect.duration || 1)));
  if (progress < 0.24 || progress > 1) return null;

  return {
    x: effect.impactX - effect.width * 0.46,
    y: effect.groundY - effect.height * 0.82,
    w: effect.width * 0.9,
    h: effect.height * 0.86,
    frontX: effect.impactX + effect.width * 0.24,
    knockbackX: 1,
  };
}

function isEnemyInsidePoseidonTsunami(enemy, zone) {
  if (!enemy || !zone) return false;

  const halfW = Math.max(enemy.w * 0.82, 20);
  const enemyLeft = enemy.x - halfW;
  const enemyRight = enemy.x + halfW;
  const enemyTop = enemy.airborne
    ? enemy.y - Math.max(enemy.h + 96, 128)
    : enemy.y - Math.max(enemy.h + 26, 74);
  const enemyBottom = enemy.y + 8;

  return enemyRight >= zone.x
    && enemyLeft <= zone.x + zone.w
    && enemyBottom >= zone.y
    && enemyTop <= zone.y + zone.h;
}

function applyPoseidonTsunamiDamage() {
  const effect = gameState.poseidonSkillEffect;
  if (!effect || !effect.active) return;

  const zone = getPoseidonTsunamiDamageZone(effect);
  if (!zone) return;
  if (!effect.hitEnemies) effect.hitEnemies = new Set();

  for (const enemy of gameState.enemies) {
    if (!canDamageCombatant(enemy) || effect.hitEnemies.has(enemy)) continue;
    if (!isEnemyInsidePoseidonTsunami(enemy, zone)) continue;

    const isBoss = Boolean(enemy.isBoss || enemy.type === "karon");
    const damage = isBoss
      ? Math.round(POSEIDON_TSUNAMI_SKILL.damage * 0.72)
      : POSEIDON_TSUNAMI_SKILL.damage;
    const knockbackDistance = isBoss
      ? POSEIDON_TSUNAMI_SKILL.bossKnockbackDistance
      : POSEIDON_TSUNAMI_SKILL.knockbackDistance;

    enemy.hp -= damage;
    enemy.x = Math.min(ENEMY_BASE_X - 34, enemy.x + knockbackDistance);
    enemy.moving = false;
    enemy.attackAnimTimer = 0;
    enemy.paralyzeTimer = Math.max(enemy.paralyzeTimer || 0, POSEIDON_TSUNAMI_SKILL.hitStunDuration);
    enemy.laserTarget = null;
    enemy.laserHitPending = false;
    enemy.swordWaveTarget = null;
    enemy.swordWavePending = false;
    enemy.clawTarget = null;
    enemy.clawHitPending = false;
    enemy.playerGateHitPending = false;
    effect.hitEnemies.add(enemy);
    spawnHit(enemy.x, enemy.y - Math.max(36, enemy.h * 0.68), "#7be8ff");
  }
}

function updatePoseidonTsunamiEffect(dt) {
  const effect = gameState.poseidonSkillEffect;
  if (!effect || !effect.active) return;

  const tsunamiApi = typeof window !== "undefined" ? window.PoseidonTsunamiAnimation : null;
  if (tsunamiApi && typeof tsunamiApi.update === "function") {
    tsunamiApi.update(effect, dt);
  } else {
    effect.timer += dt;
    if (effect.timer >= (effect.duration || 3.25)) effect.active = false;
  }

  applyPoseidonTsunamiDamage();
  if (!effect.active) {
    gameState.poseidonSkillEffect = null;
    updateButtons();
  }
}

function updateZeusMana(dt) {
  if (!gameState) return;

  const maxMana = gameState.zeusManaMax || ZEUS_MANA_MAX;
  gameState.zeusMana = Math.min(
    maxMana,
    (gameState.zeusMana || 0) + ZEUS_MANA_REGEN_PER_SECOND * dt
  );
}

function update(dt) {
  if (!gameState.running) {
    updateParticles(dt);
    return;
  }

  gameState.messageTimer = Math.max(0, gameState.messageTimer - dt);
  addRunestone(RUNESTONE_REGEN_PER_SECOND * dt);
  updateZeusMana(dt);

  updateWave(dt);
  updateHero(dt);
  updateUnits(dt);
  updateEnemies(dt);
  updateProjectiles(dt);
  updateZeusThunderstormEffect(dt);
  updatePoseidonTsunamiEffect(dt);
  updateParticles(dt);
  cleanupDeadEntities();
  checkEndConditions();
  updateHud();
  updateButtons();
}

function drawZeusThunderstormEffect() {
  const effect = gameState.zeusSkillEffect;
  if (!effect || !effect.active || !zeusStormCloudSpriteReady) return;

  const duration = effect.duration || ZEUS_THUNDERSTORM_SKILL.duration;
  const progress = Math.max(0, Math.min(0.999, effect.timer / duration));
  const cloudMetrics = getZeusStormRenderMetrics(effect, zeusStormCloudSprite);
  if (!cloudMetrics) return;

  const cloudFrame = Math.min(
    cloudMetrics.frameCount - 1,
    Math.floor(cloudMetrics.cloudProgress * cloudMetrics.frameCount)
  );
  const fadeOut = Math.min(1, (1 - progress) / 0.18);
  const cloudEase = cloudMetrics.cloudProgress * cloudMetrics.cloudProgress * (3 - 2 * cloudMetrics.cloudProgress);
  const cloudAlpha = Math.min(0.95, cloudEase) * fadeOut;

  ctx.save();
  ctx.globalAlpha = cloudAlpha;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(
    zeusStormCloudSprite,
    cloudFrame * cloudMetrics.rawFrameW + cloudMetrics.framePadX,
    0,
    cloudMetrics.frameW,
    cloudMetrics.frameH,
    cloudMetrics.drawX,
    cloudMetrics.drawY,
    cloudMetrics.drawW,
    cloudMetrics.drawH
  );
  ctx.restore();

  if (!zeusStormLightningSpriteReady || effect.timer < ZEUS_THUNDERSTORM_SKILL.lightningStartTime) return;

  const lightningFrameInfo = getZeusLightningFrameInfo(effect);
  const lightningMetrics = getZeusStormRenderMetrics(effect, zeusStormLightningSprite);
  if (!lightningFrameInfo || !lightningMetrics) return;

  const lightningAlpha = Math.min(1, (1 - lightningFrameInfo.progress) / 0.22)
    * (0.72 + 0.28 * Math.sin(lightningFrameInfo.progress * Math.PI * 5));

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, lightningAlpha));
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(
    zeusStormLightningSprite,
    lightningFrameInfo.frame * lightningMetrics.rawFrameW + lightningMetrics.framePadX,
    0,
    lightningMetrics.frameW,
    lightningMetrics.frameH,
    lightningMetrics.drawX,
    lightningMetrics.drawY,
    lightningMetrics.drawW,
    lightningMetrics.drawH
  );
  ctx.restore();
}

function drawPoseidonTsunamiEffect() {
  const effect = gameState.poseidonSkillEffect;
  if (!effect || !effect.active) return;

  const tsunamiApi = typeof window !== "undefined" ? window.PoseidonTsunamiAnimation : null;
  if (tsunamiApi && typeof tsunamiApi.draw === "function") {
    tsunamiApi.draw(ctx, effect);
  }
}

function draw() {
  drawBackground();
  drawBase(PLAYER_BASE_X, true);
  drawBase(ENEMY_BASE_X, false);

  const playerBaseUi = getBaseRenderConfig(true);
  const enemyBaseUi = getBaseRenderConfig(false);
  drawHealthBar(
    playerBaseUi.hpX,
    playerBaseUi.hpY,
    playerBaseUi.hpW,
    gameState.playerBaseHp,
    gameState.playerBaseMaxHp || 100,
    "#79ff7a"
  );
  drawHealthBar(enemyBaseUi.hpX, enemyBaseUi.hpY, enemyBaseUi.hpW, gameState.enemyBaseHp, gameState.enemyBaseMaxHp, "#ff6868");

  const drawList = [
    ...(gameState.hero && (!gameState.hero.dead || gameState.hero.deathAnimTimer > 0) ? [gameState.hero] : []),
    ...gameState.units,
    ...gameState.enemies,
  ].sort((a, b) => a.y - b.y || a.x - b.x);

  for (const entity of drawList) {
    if (entity === gameState.hero) drawHero(entity);
    else if (gameState.units.includes(entity)) drawUnit(entity);
    else drawEnemy(entity);
  }

  drawProjectiles();
  drawParticles();
  drawPoseidonTsunamiEffect();
  drawZeusThunderstormEffect();
}
