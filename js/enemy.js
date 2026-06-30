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


function spawnEnemy() {
  const wave = gameState.wave;
  const isStageOne = Number(gameState.stage) === 1;
  const isBrute = !isStageOne && wave >= 2 && Math.random() < 0.32;
  const isFast = !isStageOne && wave >= 3 && Math.random() < 0.25;

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

  gameState.enemies.push({
    type: isFast ? "fast" : "normal",
    x: ENEMY_BASE_X - 45,
    y: COMBAT_LINE_Y,
    w: isFast ? 30 : 34,
    h: isFast ? 46 : 54,
    hp: isFast ? 36 + wave * 6 : 55 + wave * 8,
    maxHp: isFast ? 36 + wave * 6 : 55 + wave * 8,
    speed: isFast ? 74 + wave * 3 : 43 + wave * 3,
    damage: isFast ? 7 + wave : 10 + wave * 2,
    range: 38,
    cooldown: 0,
    attackSpeed: isFast ? 0.52 : 0.78,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: isStageOne ? 0.48 : 0.34,
    paralyzeTimer: 0,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: isStageOne ? 0.8 : 0.55,
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
    && Number(gameState.stage) === 1
    && enemy.type === "normal";
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
