// Projectiles, hit effects, healing effects, and particles.

const MAGE_FIREBALL_SPLASH_RADIUS = 52;
const MAGE_FIREBALL_VERTICAL_RADIUS = 44;

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
    vx: 420,
    damage: unit.damage,
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
    vx: 360,
    damage: unit.damage,
    splashRadius: MAGE_FIREBALL_SPLASH_RADIUS,
    targetX: shotTarget.x,
    targetY: shotTarget.y - Math.max(34, shotTarget.h * 0.72),
    target: shotTarget,
  });

  unit.pendingMageShot = false;
  unit.shotTarget = null;
}

function getMageFireballImpactPoint(projectile) {
  if (isCombatAlive(projectile.target)) {
    projectile.targetX = projectile.target.x;
    projectile.targetY = projectile.target.y - Math.max(34, projectile.target.h * 0.72);
  }

  return {
    x: projectile.targetX || projectile.x,
    y: projectile.targetY || projectile.y,
  };
}

function isEnemyInsideMageFireball(enemy, impactX, impactY, radius) {
  const enemyHitY = enemy.y - Math.max(30, enemy.h * 0.65);
  const dx = enemy.x - impactX;
  const dy = enemyHitY - impactY;
  return (dx * dx) / (radius * radius) + (dy * dy) / (MAGE_FIREBALL_VERTICAL_RADIUS * MAGE_FIREBALL_VERTICAL_RADIUS) <= 1;
}

function explodeMageFireball(projectile, impactX, impactY) {
  const radius = projectile.splashRadius || MAGE_FIREBALL_SPLASH_RADIUS;
  let hitCount = 0;

  for (const enemy of gameState.enemies) {
    if (!isCombatAlive(enemy)) continue;
    if (!isEnemyInsideMageFireball(enemy, impactX, impactY, radius)) continue;

    enemy.hp -= projectile.damage;
    hitCount += 1;
    spawnHit(enemy.x, enemy.y - Math.max(34, enemy.h * 0.65), "#ffbd35");
  }

  spawnFireballBurst(impactX, impactY, radius);
  if (hitCount === 0) spawnHit(impactX, impactY, "#ff7324");
}

function updateProjectiles(dt) {
  for (const projectile of gameState.projectiles) {
    projectile.life = (projectile.life || 0) + dt;
    projectile.x += projectile.vx * dt;

    if (projectile.type === "mageFireball") {
      const impact = getMageFireballImpactPoint(projectile);
      if (projectile.x >= impact.x - 16) {
        explodeMageFireball(projectile, impact.x, impact.y);
        projectile.dead = true;
      }
      if (projectile.x > canvas.width + 50) projectile.dead = true;
      continue;
    }

    if (isCombatAlive(projectile.target) && Math.abs(projectile.x - projectile.target.x) < 18) {
      projectile.target.hp -= projectile.damage;
      projectile.dead = true;
    }
    if (projectile.x > canvas.width + 50) projectile.dead = true;
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

function drawProjectiles() {
  for (const projectile of gameState.projectiles) {
    if (projectile.type === "heroBolt") {
      ctx.save();
      ctx.strokeStyle = "#9fe8ff";
      ctx.shadowColor = "rgba(120, 220, 255, 0.95)";
      ctx.shadowBlur = 10;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(projectile.x - 18, projectile.y + 2);
      ctx.lineTo(projectile.x - 10, projectile.y - 9);
      ctx.lineTo(projectile.x - 1, projectile.y + 1);
      ctx.lineTo(projectile.x + 8, projectile.y - 10);
      ctx.lineTo(projectile.x + 18, projectile.y);
      ctx.stroke();
      ctx.restore();
      continue;
    }

    if (projectile.type === "mageFireball") {
      const flicker = Math.sin((projectile.life || 0) * 36) * 2;
      ctx.save();
      ctx.translate(projectile.x, projectile.y);
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

    ctx.strokeStyle = "#f2fdff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(projectile.x - 14, projectile.y);
    ctx.lineTo(projectile.x + 12, projectile.y - 2);
    ctx.stroke();
  }
}

function drawParticles() {
  for (const particle of gameState.particles) {
    const alpha = Math.max(0, particle.life / particle.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;

    if (particle.type === "slash") {
      ctx.strokeStyle = "#fff7a8";
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y + 72);
      ctx.quadraticCurveTo(particle.x + particle.w * 0.48, particle.y - 35, particle.x + particle.w, particle.y + 20);
      ctx.stroke();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
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
