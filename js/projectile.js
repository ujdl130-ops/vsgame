// Projectiles, hit effects, healing effects, and particles.

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
    type: "mageBolt",
    x: unit.x + 32,
    y: unit.y - 48,
    vx: 360,
    damage: unit.damage,
    target: shotTarget,
  });

  unit.pendingMageShot = false;
  unit.shotTarget = null;
}

function updateProjectiles(dt) {
  for (const projectile of gameState.projectiles) {
    projectile.x += projectile.vx * dt;
    if (isCombatAlive(projectile.target) && Math.abs(projectile.x - projectile.target.x) < 18) {
      projectile.target.hp -= projectile.damage;
      if (projectile.type === "mageBolt") {
        spawnHit(projectile.target.x, projectile.target.y - 46, "#68eaff");
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
    if (particle.type === "hit") {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 260 * dt;
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

    if (projectile.type === "mageBolt") {
      ctx.save();
      ctx.fillStyle = "#68eaff";
      ctx.shadowColor = "rgba(104, 234, 255, 0.95)";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(225, 255, 255, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(projectile.x - 18, projectile.y + 2);
      ctx.lineTo(projectile.x - 7, projectile.y - 4);
      ctx.stroke();
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
