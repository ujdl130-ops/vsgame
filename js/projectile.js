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
    target,
    life: 0,
    maxLife: 1.5,
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
    if (!canDamageCombatant(enemy)) continue;
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

    if (projectile.type === "karonSwordWave") {
      const target = isCombatAlive(projectile.target)
        ? projectile.target
        : findNearestAlly(projectile.x, 90);

      if (target && Math.abs(projectile.x - target.x) < 24) {
        target.hp -= projectile.damage;
        spawnHit(target.x, target.y - Math.max(38, target.h * 0.65), "#79c8ff");
        projectile.dead = true;
      }

      if (projectile.x < -90 || projectile.life > projectile.maxLife) projectile.dead = true;
      continue;
    }

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
      if (canDamageCombatant(projectile.target)) {
        projectile.target.hp -= projectile.damage;
      }
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
    if (projectile.type === "karonSwordWave") {
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
      continue;
    }

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
