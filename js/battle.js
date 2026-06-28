// Battle helpers, update pipeline, and draw pipeline.

function isCombatAlive(entity) {
  return Boolean(entity && !entity.dead && entity.hp > 0);
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
  unit.shotTarget = null;
  unit.attackTarget = null;
  unit.deathAnimDuration = unit.deathAnimDuration || 0.85;
  unit.deathAnimTimer = unit.deathAnimDuration;
}

function startEnemyDeath(enemy) {
  if (!enemy || enemy.dead) return;
  enemy.dead = true;
  enemy.hp = 0;
  enemy.moving = false;
  enemy.cooldown = 0;
  enemy.attackAnimTimer = 0;
  enemy.deathAnimDuration = enemy.deathAnimDuration || 0.55;
  enemy.deathAnimTimer = enemy.deathAnimDuration;

  if (!enemy.deathRewarded) {
    gameState.gold += 18;
    enemy.deathRewarded = true;
  }
}

function findNearestEnemy(fromX, range) {
  let target = null;
  let bestDistance = Infinity;
  for (const enemy of gameState.enemies) {
    if (!isCombatAlive(enemy)) continue;
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

  // ?뚰솚 ?쒗븳 ?щ’? ?댁븘?덈뒗 蹂묒궗 ?섎? 湲곗??쇰줈 怨꾩궛?⑸땲??
  // 蹂묒궗媛 二쎈뒗 ?쒓컙 hp媛 0???섎?濡? ?щ쭩 紐⑥뀡???⑥븘 ?덉뼱??鍮??먮━??利됱떆 ?앷퉩?덈떎.
  gameState.enemies = gameState.enemies.filter((enemy) => !enemy.dead || enemy.deathAnimTimer > 0);
  gameState.units = gameState.units.filter((unit) => !unit.dead || unit.deathAnimTimer > 0);
}

function checkEndConditions() {
  if (gameState.enemyBaseHp <= 0) {
    completeStage(`STAGE ${selectedStage} CLEAR! ??湲곗? ?뚭눼`);
  }

  if (gameState.playerBaseHp <= 0) {
    gameState.gameOver = true;
    gameState.running = false;
    gameState.message = "GAME OVER! 아군 기지가 파괴되었습니다.";
  }
}

function update(dt) {
  if (!gameState.running) {
    updateParticles(dt);
    return;
  }

  gameState.messageTimer = Math.max(0, gameState.messageTimer - dt);
  gameState.goldTimer += dt;
  if (gameState.goldTimer >= 1) {
    gameState.gold += 12;
    gameState.goldTimer = 0;
  }

  updateWave(dt);
  updateHero(dt);
  updateUnits(dt);
  updateEnemies(dt);
  updateProjectiles(dt);
  updateParticles(dt);
  cleanupDeadEntities();
  checkEndConditions();
  updateHud();
  updateButtons();
}

function drawMessage() {
  if (!gameState.message) return;
  if (gameState.running && gameState.messageTimer <= 0 && gameState.waveBreakTimer <= 0) return;

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(240, 42, 480, 62);
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.strokeRect(240, 42, 480, 62);
  ctx.fillStyle = "#fff3a8";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.fillText(gameState.message, canvas.width / 2, 82);
  ctx.restore();
}

function draw() {
  drawBackground();
  drawBase(PLAYER_BASE_X, true);
  drawBase(ENEMY_BASE_X, false);

  const playerBaseUi = getBaseRenderConfig(true);
  const enemyBaseUi = getBaseRenderConfig(false);
  drawHealthBar(playerBaseUi.hpX, playerBaseUi.hpY, playerBaseUi.hpW, gameState.playerBaseHp, 100, "#79ff7a");
  drawHealthBar(enemyBaseUi.hpX, enemyBaseUi.hpY, enemyBaseUi.hpW, gameState.enemyBaseHp, gameState.enemyBaseMaxHp, "#ff6868");

  const drawList = [
    ...(gameState.hero && !gameState.hero.dead && gameState.hero.hp > 0 ? [gameState.hero] : []),
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
  drawMessage();
}
