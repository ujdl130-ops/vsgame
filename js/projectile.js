// Projectiles, hit effects, healing effects, and particles.

const MAGE_FIREBALL_SPLASH_RADIUS = 52;
const MAGE_FIREBALL_VERTICAL_RADIUS = 44;
const PROJECTILE_DEFAULT_MAX_LIFE = 3.2;
const KARON_SWORD_WAVE_GATE_X = PLAYER_BASE_ATTACK_X;
const KARON_SWORD_WAVE_GATE_DAMAGE_SCALE = 0.55;
const KARON_SWORD_WAVE_HIT_COLOR = "#ff2d74";

function getEnemyProjectileHitPoint(enemy) {
  if (!enemy) return { x: 0, y: 0 };

  if (enemy.airborne) {
    const evileyeConfig = typeof EVILEYE_SPRITE !== "undefined" ? EVILEYE_SPRITE : null;
    const flightOffset = enemy.type === "evileye" && evileyeConfig
      ? evileyeConfig.flightOffsetY
      : Math.max(78, enemy.h * 1.15);
    const visualHeight = enemy.type === "evileye" && evileyeConfig
      ? evileyeConfig.drawH
      : Math.max(enemy.h, 72);

    return {
      x: enemy.x,
      y: enemy.y - flightOffset - visualHeight * 0.42,
    };
  }

  return {
    x: enemy.x,
    y: enemy.y - Math.max(34, enemy.h * 0.65),
  };
}

function updateProjectileImpactPoint(projectile) {
  if (
    projectile.target
    && (isCombatAlive(projectile.target)
      || typeof projectile.targetX !== "number"
      || typeof projectile.targetY !== "number")
  ) {
    const hitPoint = getEnemyProjectileHitPoint(projectile.target);
    projectile.targetX = hitPoint.x;
    projectile.targetY = hitPoint.y;
  }

  return {
    x: typeof projectile.targetX === "number" ? projectile.targetX : projectile.x,
    y: typeof projectile.targetY === "number" ? projectile.targetY : projectile.y,
  };
}

function moveProjectileTowardImpact(projectile, dt) {
  const impact = updateProjectileImpactPoint(projectile);
  const speed = projectile.speed || Math.abs(projectile.vx || 0) || 420;
  const dx = impact.x - projectile.x;
  const dy = impact.y - projectile.y;
  const distance = Math.hypot(dx, dy);

  projectile.reachedImpact = false;
  if (distance <= speed * dt || distance <= 0.01) {
    projectile.x = impact.x;
    projectile.y = impact.y;
    projectile.angle = Math.atan2(dy, dx || 1);
    projectile.reachedImpact = true;
    return impact;
  }

  const step = speed * dt;
  projectile.x += (dx / distance) * step;
  projectile.y += (dy / distance) * step;
  projectile.angle = Math.atan2(dy, dx);
  return impact;
}

function spawnHit(x, y, color) {
  for (let i = 0; i < 8; i++) {
    gameState.particles.push({
      type: "hit",
      x,
      y,
      vx: (Math.random() - 0.5) * 120,
      vy: -40 - Math.random() * 80,
      life: 0.35,
      maxLife: 0.35,
      color,
    });
  }
}

function spawnHeal(x, y) {
  for (let i = 0; i < 7; i++) {
    gameState.particles.push({
      type: "heal",
      x: x + (Math.random() - 0.5) * 24,
      y: y + (Math.random() - 0.5) * 12,
      vx: (Math.random() - 0.5) * 18,
      life: 0.55,
      maxLife: 0.55,
      size: 3 + Math.random() * 3,
      color: i % 2 === 0 ? "#fff1a8" : "#8ff7ff",
    });
  }
}

function spawnFireballBurst(x, y, radius) {
  const colors = ["#fff3a6", "#ffbd35", "#ff7324", "#cf2f12"];
  for (let i = 0; i < 18; i++) {
    const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.35;
    const speed = 80 + Math.random() * 120;
    gameState.particles.push({
      type: "fireBurst",
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 0.58 - 30,
      life: 0.38 + Math.random() * 0.14,
      maxLife: 0.52,
      size: 4 + Math.random() * 6,
      color: colors[i % colors.length],
    });
  }

  gameState.particles.push({
    type: "fireShock",
    x,
    y,
    radius,
    life: 0.22,
    maxLife: 0.22,
  });
}

function spawnThiefStrike(x, y) {
  gameState.particles.push({
    type: "slash",
    x: x - 24,
    y: y - 30,
    w: 62,
    life: 0.16,
    maxLife: 0.16,
    lineWidth: 7,
    color: "#cfffff",
    innerColor: "#ffffff",
  });

  gameState.particles.push({
    type: "slash",
    x: x - 14,
    y: y - 22,
    w: 48,
    life: 0.11,
    maxLife: 0.11,
    lineWidth: 4,
    color: "#8ff7ff",
    innerColor: "#ffffff",
  });

  spawnHit(x, y, "#e9fbff");
}

function spawnKaronSwordWave(enemy) {
  const target = isCombatAlive(enemy.swordWaveTarget)
    ? enemy.swordWaveTarget
    : findNearestAlly(enemy.x, enemy.range + 40);

  gameState.projectiles.push({
    type: "karonSwordWave",
    x: enemy.x - 48,
    y: enemy.y - 72,
    vx: -500,
    damage: enemy.damage,
    splashRadius: enemy.swordWaveSplashRadius || 72,
    target,
    life: 0,
    maxLife: 1.5,
  });
}

function getKaronSwordWaveSplashTargets(impactX, radius) {
  const targets = [];
  if (isCombatAlive(gameState.hero)) targets.push(gameState.hero);

  for (const unit of gameState.units) {
    if (isCombatAlive(unit)) targets.push(unit);
  }

  return targets.filter((target) => Math.abs(target.x - impactX) <= radius);
}

function damageKaronSwordWaveSplash(projectile, impactX) {
  const radius = projectile.splashRadius || 72;
  const targets = getKaronSwordWaveSplashTargets(impactX, radius);

  for (const target of targets) {
    damageCombatant(target, projectile.damage);
    spawnHit(target.x, target.y - Math.max(38, target.h * 0.65), KARON_SWORD_WAVE_HIT_COLOR);
  }

  const gateHit = isKaronSwordWavePlayerGateInSplash(impactX, radius);
  if (gateHit) {
    damageKaronSwordWavePlayerGate(projectile);
  }

  if (targets.length === 0 && !gateHit) {
    spawnHit(impactX, projectile.y, KARON_SWORD_WAVE_HIT_COLOR);
  }
}

function isKaronSwordWavePlayerGateInSplash(impactX, radius) {
  return Math.abs(impactX - KARON_SWORD_WAVE_GATE_X) <= radius;
}

function hasKaronSwordWaveReachedPlayerGate(projectile) {
  return projectile.x <= KARON_SWORD_WAVE_GATE_X;
}

function damageKaronSwordWavePlayerGate(projectile) {
  gameState.playerBaseHp -= projectile.damage * KARON_SWORD_WAVE_GATE_DAMAGE_SCALE;
  spawnHit(PLAYER_BASE_ATTACK_HIT_X, GROUND_Y - 78, KARON_SWORD_WAVE_HIT_COLOR);
}

function fireArcherArrow(unit) {
  const shotTarget = isCombatAlive(unit.shotTarget)
    ? unit.shotTarget
    : findNearestEnemy(unit.x, unit.range + 40);

  if (!shotTarget) {
    unit.pendingArrowShot = false;
    unit.shotTarget = null;
    return;
  }

  gameState.projectiles.push({
    type: "arrow",
    x: unit.x + 34,
    y: unit.y - 44,
    speed: 420,
    damage: unit.damage,
    maxLife: PROJECTILE_DEFAULT_MAX_LIFE,
    target: shotTarget,
  });

  unit.pendingArrowShot = false;
  unit.shotTarget = null;
}

function fireMageBolt(unit) {
  const shotTarget = isCombatAlive(unit.shotTarget)
    ? unit.shotTarget
    : findNearestEnemy(unit.x, unit.range + 35);

  if (!shotTarget) {
    unit.pendingMageShot = false;
    unit.shotTarget = null;
    return;
  }

  gameState.projectiles.push({
    type: "mageFireball",
    x: unit.x + 32,
    y: unit.y - 48,
    speed: 360,
    damage: unit.damage,
    splashRadius: MAGE_FIREBALL_SPLASH_RADIUS,
    maxLife: PROJECTILE_DEFAULT_MAX_LIFE,
    targetX: getEnemyProjectileHitPoint(shotTarget).x,
    targetY: getEnemyProjectileHitPoint(shotTarget).y,
    target: shotTarget,
  });

  unit.pendingMageShot = false;
  unit.shotTarget = null;
}

function getMageFireballImpactPoint(projectile) {
  return updateProjectileImpactPoint(projectile);
}

function isEnemyInsideMageFireball(enemy, impactX, impactY, radius) {
  const enemyHitY = getEnemyProjectileHitPoint(enemy).y;
  const dx = enemy.x - impactX;
  const dy = enemyHitY - impactY;
  return (dx * dx) / (radius * radius) + (dy * dy) / (MAGE_FIREBALL_VERTICAL_RADIUS * MAGE_FIREBALL_VERTICAL_RADIUS) <= 1;
}

function explodeMageFireball(projectile, impactX, impactY) {
  const radius = projectile.splashRadius || MAGE_FIREBALL_SPLASH_RADIUS;
  let hitCount = 0;

  for (const enemy of gameState.enemies) {
    if (!canDamageCombatant(enemy)) continue;
    if (!isEnemyInsideMageFireball(enemy, impactX, impactY, radius)) continue;

    enemy.hp -= projectile.damage;
    hitCount += 1;
    const hitPoint = getEnemyProjectileHitPoint(enemy);
    spawnHit(hitPoint.x, hitPoint.y, "#ffbd35");
  }

  spawnFireballBurst(impactX, impactY, radius);
  if (hitCount === 0) spawnHit(impactX, impactY, "#ff7324");
}

function updateProjectiles(dt) {
  for (const projectile of gameState.projectiles) {
    projectile.life = (projectile.life || 0) + dt;

    if (projectile.type === "karonSwordWave") {
      projectile.x += projectile.vx * dt;
      const target = isCombatAlive(projectile.target)
        ? projectile.target
        : findNearestAlly(projectile.x, 90);

      if (target && Math.abs(projectile.x - target.x) < 24) {
        damageKaronSwordWaveSplash(projectile, target.x);
        projectile.dead = true;
      }

      if (!projectile.dead && hasKaronSwordWaveReachedPlayerGate(projectile)) {
        damageKaronSwordWavePlayerGate(projectile);
        projectile.dead = true;
      }

      if (projectile.x < -90 || projectile.life > projectile.maxLife) projectile.dead = true;
      continue;
    }

    if (projectile.type === "mageFireball") {
      const impact = moveProjectileTowardImpact(projectile, dt);
      if (projectile.reachedImpact) {
        explodeMageFireball(projectile, impact.x, impact.y);
        projectile.dead = true;
      }
      if (projectile.x > canvas.width + 50 || projectile.life > (projectile.maxLife || PROJECTILE_DEFAULT_MAX_LIFE)) projectile.dead = true;
      continue;
    }

    const impact = moveProjectileTowardImpact(projectile, dt);
    if (projectile.reachedImpact) {
      if (isCombatAlive(projectile.target) && canDamageCombatant(projectile.target)) {
        damageCombatant(projectile.target, projectile.damage);
        spawnHit(impact.x, impact.y, projectile.color || "#f2fdff");
      }
      projectile.dead = true;
    }
    if (projectile.x > canvas.width + 50 || projectile.life > (projectile.maxLife || PROJECTILE_DEFAULT_MAX_LIFE)) projectile.dead = true;
  }
  gameState.projectiles = gameState.projectiles.filter((p) => !p.dead);
}

function updateParticles(dt) {
  for (const particle of gameState.particles) {
    particle.life -= dt;
    if (particle.type === "hit" || particle.type === "fireBurst") {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += (particle.type === "fireBurst" ? 170 : 260) * dt;
    } else if (particle.type === "heal") {
      particle.x += particle.vx * dt;
      particle.y -= 28 * dt;
    }
  }
  gameState.particles = gameState.particles.filter((p) => p.life > 0);
}

function isKaronSwordWaveProjectileImageReady() {
  return (
    typeof karonSwordWaveProjectileImage !== "undefined"
    && typeof karonSwordWaveProjectileReady !== "undefined"
    && karonSwordWaveProjectileImage
    && karonSwordWaveProjectileReady
  );
}

function drawKaronSwordWaveImage(projectile) {
  const width = 132;
  const height = 124;
  const sourceWidth = karonSwordWaveProjectileImage.naturalWidth || karonSwordWaveProjectileImage.width;
  const sourceHeight = karonSwordWaveProjectileImage.naturalHeight || karonSwordWaveProjectileImage.height;
  const direction = projectile.vx < 0 ? -1 : 1;

  ctx.save();
  ctx.translate(projectile.x, projectile.y - 8);
  ctx.scale(direction, 1);
  ctx.drawImage(
    karonSwordWaveProjectileImage,
    0,
    0,
    sourceWidth,
    sourceHeight,
    -width / 2,
    -height / 2,
    width,
    height
  );
  ctx.restore();
}

function drawKaronSwordWaveFallback(projectile) {
  const pulse = Math.sin((projectile.life || 0) * 42) * 0.12;

  ctx.save();
  ctx.translate(projectile.x, projectile.y);
  ctx.globalAlpha = Math.max(0.2, 1 - (projectile.life || 0) / (projectile.maxLife || 1.5) * 0.28);
  ctx.shadowColor = "rgba(55, 156, 255, 0.95)";
  ctx.shadowBlur = 16;

  const slashGradient = ctx.createLinearGradient(-82, 0, 32, 0);
  slashGradient.addColorStop(0, "rgba(5, 14, 45, 0)");
  slashGradient.addColorStop(0.25, "rgba(12, 28, 82, 0.95)");
  slashGradient.addColorStop(0.62, "rgba(24, 146, 255, 0.96)");
  slashGradient.addColorStop(1, "rgba(250, 255, 255, 0)");

  ctx.fillStyle = slashGradient;
  ctx.beginPath();
  ctx.moveTo(-88, -8);
  ctx.quadraticCurveTo(-38, -25 - pulse * 18, 34, -2);
  ctx.quadraticCurveTo(-36, 23 + pulse * 18, -88, 10);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(223, 247, 255, 0.88)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-72, 4);
  ctx.quadraticCurveTo(-24, -18, 28, -2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(4, 11, 28, 0.92)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-82, 10);
  ctx.quadraticCurveTo(-26, 20, 24, 3);
  ctx.stroke();
  ctx.restore();
}

function drawKaronSwordWave(projectile) {
  if (isKaronSwordWaveProjectileImageReady()) {
    drawKaronSwordWaveImage(projectile);
    return;
  }

  drawKaronSwordWaveFallback(projectile);
}

function drawProjectiles() {
  for (const projectile of gameState.projectiles) {
    if (projectile.type === "karonSwordWave") {
      drawKaronSwordWave(projectile);
      continue;
    }

    if (projectile.type === "poseidonBolt") {
      const ripple = Math.sin((projectile.life || 0) * 24) * 3;
      ctx.save();
      ctx.translate(projectile.x, projectile.y);
      ctx.rotate(projectile.angle || 0);
      ctx.strokeStyle = projectile.color || "#7be8ff";
      ctx.fillStyle = "rgba(190, 245, 255, 0.92)";
      ctx.shadowColor = "rgba(90, 220, 255, 0.95)";
      ctx.shadowBlur = 12;
      ctx.lineWidth = 4;

      ctx.beginPath();
      ctx.moveTo(-22, 0);
      ctx.lineTo(18, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(7, -10);
      ctx.moveTo(18, 0);
      ctx.lineTo(7, 10);
      ctx.moveTo(10, 0);
      ctx.lineTo(0, -7);
      ctx.moveTo(10, 0);
      ctx.lineTo(0, 7);
      ctx.stroke();

      ctx.strokeStyle = "rgba(210, 250, 255, 0.72)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-30, -8 + ripple);
      ctx.quadraticCurveTo(-16, -17 - ripple, -2, -7);
      ctx.moveTo(-34, 8 - ripple);
      ctx.quadraticCurveTo(-18, 18 + ripple, -1, 7);
      ctx.stroke();
      ctx.restore();
      continue;
    }

    if (projectile.type === "heroBolt") {
      ctx.save();
      ctx.translate(projectile.x, projectile.y);
      ctx.rotate(projectile.angle || 0);
      ctx.strokeStyle = "#9fe8ff";
      ctx.shadowColor = "rgba(120, 220, 255, 0.95)";
      ctx.shadowBlur = 10;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-18, 2);
      ctx.lineTo(-10, -9);
      ctx.lineTo(-1, 1);
      ctx.lineTo(8, -10);
      ctx.lineTo(18, 0);
      ctx.stroke();
      ctx.restore();
      continue;
    }

    if (projectile.type === "mageFireball") {
      const flicker = Math.sin((projectile.life || 0) * 36) * 2;
      ctx.save();
      ctx.translate(projectile.x, projectile.y);
      ctx.rotate(projectile.angle || 0);
      ctx.shadowColor = "rgba(255, 117, 24, 0.85)";
      ctx.shadowBlur = 10;

      ctx.fillStyle = "rgba(162, 39, 14, 0.82)";
      ctx.fillRect(-30, -4, 18, 8);
      ctx.fillStyle = "rgba(255, 115, 36, 0.9)";
      ctx.fillRect(-22, -7, 18, 14);
      ctx.fillStyle = "#cf2f12";
      ctx.fillRect(-8, -10 - flicker, 20, 20);
      ctx.fillStyle = "#ff7324";
      ctx.fillRect(-4, -8 + flicker * 0.3, 20, 16);
      ctx.fillStyle = "#ffbd35";
      ctx.fillRect(2, -5, 14, 10);
      ctx.fillStyle = "#fff3a6";
      ctx.fillRect(7, -3, 7, 6);
      ctx.restore();
      continue;
    }

    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    ctx.rotate(projectile.angle || 0);
    ctx.strokeStyle = "#f2fdff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(12, -2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawParticles() {
  for (const particle of gameState.particles) {
    const alpha = Math.max(0, particle.life / particle.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;

    if (particle.type === "slash") {
      ctx.strokeStyle = particle.color || "#fff7a8";
      ctx.lineWidth = particle.lineWidth || 12;
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y + 72);
      ctx.quadraticCurveTo(particle.x + particle.w * 0.48, particle.y - 35, particle.x + particle.w, particle.y + 20);
      ctx.stroke();
      ctx.strokeStyle = particle.innerColor || "#ffffff";
      ctx.lineWidth = Math.max(2, Math.floor((particle.lineWidth || 12) * 0.35));
      ctx.stroke();
    } else if (particle.type === "heroAttack") {
      ctx.strokeStyle = "#fff9c7";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y + 34);
      ctx.lineTo(particle.x + 75, particle.y);
      ctx.stroke();
    } else if (particle.type === "hit") {
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, 5, 5);
    } else if (particle.type === "fireBurst") {
      ctx.fillStyle = particle.color;
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 8;
      ctx.fillRect(particle.x, particle.y, particle.size || 5, particle.size || 5);
    } else if (particle.type === "fireShock") {
      const progress = 1 - alpha;
      ctx.strokeStyle = `rgba(255, 190, 55, ${0.8 * alpha})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(
        particle.x,
        particle.y + 14,
        particle.radius * (0.35 + progress * 0.65),
        12 + progress * 16,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    } else if (particle.type === "heal") {
      ctx.fillStyle = particle.color;
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size || 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
