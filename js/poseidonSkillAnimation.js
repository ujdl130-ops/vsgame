// Standalone Poseidon tsunami skill animation.
// This file is intentionally not wired into the battle loop yet.

const POSEIDON_TSUNAMI_SKILL_ANIMATION = {
  duration: 1.45,
  windupTime: 0.16,
  crashTime: 0.9,
  fadeTime: 0.28,
  waveSpeed: 920,
  waveWidth: 420,
  waveHeight: 260,
  foamCount: 34,
  sprayCount: 42,
  impactPulseCount: 4,
  damageWindowStart: 0.24,
  damageWindowEnd: 1.05,
  knockbackDirection: 1,
};

function createPoseidonTsunamiAnimation(options = {}) {
  const canvasWidth = options.canvasWidth || (typeof canvas !== "undefined" ? canvas.width : 960);
  const groundY = options.groundY || (typeof GROUND_Y !== "undefined" ? GROUND_Y : 300);
  const height = options.height || POSEIDON_TSUNAMI_SKILL_ANIMATION.waveHeight;
  const width = options.width || POSEIDON_TSUNAMI_SKILL_ANIMATION.waveWidth;
  const startX = options.startX == null ? -width * 0.72 : options.startX;
  const endX = options.endX == null ? canvasWidth + width * 0.34 : options.endX;
  const random = options.random || Math.random;

  return {
    type: "poseidonTsunami",
    active: true,
    timer: 0,
    duration: options.duration || POSEIDON_TSUNAMI_SKILL_ANIMATION.duration,
    groundY,
    startX,
    endX,
    width,
    height,
    impactX: startX,
    hitEnemies: new Set(),
    foam: createPoseidonFoamBursts(POSEIDON_TSUNAMI_SKILL_ANIMATION.foamCount, random),
    spray: createPoseidonSprayBursts(POSEIDON_TSUNAMI_SKILL_ANIMATION.sprayCount, random),
    pulses: createPoseidonImpactPulses(POSEIDON_TSUNAMI_SKILL_ANIMATION.impactPulseCount),
  };
}

function updatePoseidonTsunamiAnimation(effect, dt) {
  if (!effect || !effect.active) return false;

  effect.timer += dt;
  const progress = getPoseidonTsunamiProgress(effect);
  const travel = easeOutCubic(progress);
  effect.impactX = lerp(effect.startX, effect.endX, travel);

  if (effect.timer >= effect.duration) {
    effect.active = false;
  }

  return effect.active;
}

function getPoseidonTsunamiDamageZone(effect) {
  if (!effect || !effect.active) return null;

  const progress = getPoseidonTsunamiProgress(effect);
  if (
    progress < POSEIDON_TSUNAMI_SKILL_ANIMATION.damageWindowStart
    || progress > POSEIDON_TSUNAMI_SKILL_ANIMATION.damageWindowEnd
  ) {
    return null;
  }

  const frontX = effect.impactX + effect.width * 0.24;
  return {
    x: effect.impactX - effect.width * 0.46,
    y: effect.groundY - effect.height * 0.82,
    w: effect.width * 0.9,
    h: effect.height * 0.86,
    frontX,
    knockbackX: POSEIDON_TSUNAMI_SKILL_ANIMATION.knockbackDirection,
  };
}

function drawPoseidonTsunamiAnimation(renderCtx, effect) {
  if (!renderCtx || !effect || !effect.active) return;

  const progress = getPoseidonTsunamiProgress(effect);
  const intro = smoothstep(0, 0.18, progress);
  const fade = 1 - smoothstep(0.78, 1, progress);
  const alpha = Math.max(0, intro * fade);
  if (alpha <= 0) return;

  const x = effect.impactX;
  const y = effect.groundY;
  const width = effect.width;
  const height = effect.height;
  const crestY = y - height * (0.72 + Math.sin(progress * Math.PI * 2.1) * 0.035);
  const curl = Math.sin(progress * Math.PI * 1.6);

  renderCtx.save();
  renderCtx.globalAlpha = alpha;
  renderCtx.imageSmoothingEnabled = true;

  drawPoseidonSeaShadow(renderCtx, x, y, width, progress);
  drawPoseidonBackMist(renderCtx, effect, progress, alpha);
  renderCtx.globalAlpha = alpha;
  drawPoseidonMainWave(renderCtx, x, y, width, height, crestY, curl, progress);
  drawPoseidonFoam(renderCtx, effect, progress, alpha);
  drawPoseidonSpray(renderCtx, effect, progress, alpha);
  drawPoseidonImpactPulses(renderCtx, effect, progress, alpha);

  renderCtx.restore();
}

function drawPoseidonTsunamiDebugZone(renderCtx, effect) {
  const zone = getPoseidonTsunamiDamageZone(effect);
  if (!renderCtx || !zone) return;

  renderCtx.save();
  renderCtx.globalAlpha = 0.28;
  renderCtx.fillStyle = "#67f1ff";
  renderCtx.fillRect(zone.x, zone.y, zone.w, zone.h);
  renderCtx.strokeStyle = "#e9ffff";
  renderCtx.lineWidth = 2;
  renderCtx.strokeRect(zone.x, zone.y, zone.w, zone.h);
  renderCtx.restore();
}

function drawPoseidonSeaShadow(renderCtx, x, y, width, progress) {
  const spread = width * (1.25 + progress * 0.45);
  const gradient = renderCtx.createRadialGradient(x - width * 0.08, y - 10, 10, x, y - 10, spread * 0.55);
  gradient.addColorStop(0, "rgba(39, 196, 220, 0.36)");
  gradient.addColorStop(0.56, "rgba(17, 113, 174, 0.24)");
  gradient.addColorStop(1, "rgba(2, 28, 63, 0)");

  renderCtx.fillStyle = gradient;
  renderCtx.beginPath();
  renderCtx.ellipse(x, y - 6, spread * 0.48, 38, 0, 0, Math.PI * 2);
  renderCtx.fill();
}

function drawPoseidonBackMist(renderCtx, effect, progress, baseAlpha) {
  const mistCount = 5;
  for (let i = 0; i < mistCount; i += 1) {
    const phase = (progress * 1.2 + i / mistCount) % 1;
    const mistX = effect.impactX - effect.width * (0.62 + phase * 0.5);
    const mistY = effect.groundY - effect.height * (0.26 + i * 0.055);
    const mistW = effect.width * (0.34 + phase * 0.24);
    const mistAlpha = (1 - phase) * 0.22;

    renderCtx.globalAlpha = baseAlpha;
    renderCtx.fillStyle = `rgba(177, 240, 255, ${mistAlpha})`;
    renderCtx.beginPath();
    renderCtx.ellipse(mistX, mistY, mistW, 17 + i * 2, -0.08, 0, Math.PI * 2);
    renderCtx.fill();
  }
}

function drawPoseidonMainWave(renderCtx, x, y, width, height, crestY, curl, progress) {
  const left = x - width * 0.72;
  const right = x + width * 0.34;
  const bottom = y + 38;

  const bodyGradient = renderCtx.createLinearGradient(left, crestY, right, bottom);
  bodyGradient.addColorStop(0, "rgba(6, 42, 99, 0.88)");
  bodyGradient.addColorStop(0.38, "rgba(8, 126, 178, 0.92)");
  bodyGradient.addColorStop(0.72, "rgba(33, 205, 226, 0.88)");
  bodyGradient.addColorStop(1, "rgba(229, 255, 255, 0.9)");

  renderCtx.fillStyle = bodyGradient;
  renderCtx.beginPath();
  renderCtx.moveTo(left, bottom);
  renderCtx.bezierCurveTo(
    left + width * 0.12,
    y - height * 0.36,
    left + width * 0.34,
    y - height * 0.78,
    x - width * 0.03,
    crestY
  );
  renderCtx.bezierCurveTo(
    x + width * (0.18 + curl * 0.06),
    crestY - height * 0.18,
    x + width * 0.34,
    crestY + height * 0.2,
    x + width * 0.08,
    y - height * 0.34
  );
  renderCtx.bezierCurveTo(
    x + width * 0.34,
    y - height * 0.1,
    right,
    y + 3,
    right,
    bottom
  );
  renderCtx.closePath();
  renderCtx.fill();

  renderCtx.strokeStyle = "rgba(220, 255, 255, 0.9)";
  renderCtx.lineWidth = 8;
  renderCtx.lineCap = "round";
  renderCtx.beginPath();
  renderCtx.moveTo(x - width * 0.11, crestY + 6);
  renderCtx.bezierCurveTo(
    x + width * 0.13,
    crestY - height * 0.13,
    x + width * 0.3,
    crestY + height * 0.1,
    x + width * 0.05,
    y - height * 0.3
  );
  renderCtx.stroke();

  renderCtx.strokeStyle = "rgba(143, 237, 255, 0.42)";
  renderCtx.lineWidth = 4;
  for (let i = 0; i < 4; i += 1) {
    const bandY = y - height * (0.54 - i * 0.095) + Math.sin(progress * 8 + i) * 4;
    renderCtx.beginPath();
    renderCtx.moveTo(left + width * (0.18 + i * 0.02), bandY);
    renderCtx.bezierCurveTo(
      left + width * 0.42,
      bandY - 22,
      x + width * 0.08,
      bandY + 16,
      right - width * 0.1,
      bandY - 4
    );
    renderCtx.stroke();
  }
}

function drawPoseidonFoam(renderCtx, effect, progress, baseAlpha) {
  renderCtx.fillStyle = "rgba(239, 255, 255, 0.92)";
  renderCtx.strokeStyle = "rgba(156, 238, 255, 0.62)";
  renderCtx.lineWidth = 2;

  for (const foam of effect.foam) {
    const phase = (progress * foam.speed + foam.offset) % 1;
    const foamX = effect.impactX - effect.width * 0.48 + phase * effect.width * 0.92 + foam.xJitter;
    const foamY = effect.groundY - effect.height * foam.yRatio + Math.sin(progress * 11 + foam.offset * 7) * foam.bob;
    const size = foam.size * (0.72 + (1 - phase) * 0.48);
    const alpha = (1 - Math.abs(phase - 0.52) * 1.35) * 0.75;
    if (alpha <= 0) continue;

    renderCtx.globalAlpha = baseAlpha * Math.max(0, alpha);
    renderCtx.beginPath();
    renderCtx.ellipse(foamX, foamY, size * 1.8, size, foam.angle, 0, Math.PI * 2);
    renderCtx.fill();
    renderCtx.stroke();
  }

  renderCtx.globalAlpha = 1;
}

function drawPoseidonSpray(renderCtx, effect, progress, baseAlpha) {
  for (const spray of effect.spray) {
    const local = (progress - spray.delay) / spray.life;
    if (local <= 0 || local >= 1) continue;

    const arc = Math.sin(local * Math.PI);
    const x = effect.impactX + spray.baseX + spray.vx * local;
    const y = effect.groundY - effect.height * spray.baseY - spray.vy * arc + local * local * 44;
    const size = spray.size * (1 - local * 0.48);
    const alpha = (1 - local) * 0.86;

    renderCtx.globalAlpha = baseAlpha * alpha;
    renderCtx.fillStyle = spray.bright ? "#f4ffff" : "#a9f4ff";
    renderCtx.beginPath();
    renderCtx.arc(x, y, size, 0, Math.PI * 2);
    renderCtx.fill();
  }

  renderCtx.globalAlpha = 1;
}

function drawPoseidonImpactPulses(renderCtx, effect, progress, baseAlpha) {
  for (const pulse of effect.pulses) {
    const local = (progress - pulse.delay) / pulse.life;
    if (local <= 0 || local >= 1) continue;

    const width = effect.width * (0.28 + local * 0.48);
    const height = 18 + local * 22;
    const alpha = (1 - local) * 0.5;

    renderCtx.globalAlpha = baseAlpha * alpha;
    renderCtx.strokeStyle = pulse.color;
    renderCtx.lineWidth = 3 + (1 - local) * 3;
    renderCtx.beginPath();
    renderCtx.ellipse(
      effect.impactX + pulse.xOffset,
      effect.groundY - pulse.yOffset,
      width,
      height,
      0,
      0,
      Math.PI * 2
    );
    renderCtx.stroke();
  }

  renderCtx.globalAlpha = 1;
}

function createPoseidonFoamBursts(count, random) {
  const foam = [];
  for (let i = 0; i < count; i += 1) {
    foam.push({
      offset: random(),
      speed: 0.78 + random() * 0.74,
      yRatio: 0.12 + random() * 0.62,
      xJitter: (random() - 0.5) * 34,
      size: 2.5 + random() * 5.5,
      bob: 2 + random() * 7,
      angle: (random() - 0.5) * 0.45,
    });
  }
  return foam;
}

function createPoseidonSprayBursts(count, random) {
  const spray = [];
  for (let i = 0; i < count; i += 1) {
    spray.push({
      delay: random() * 0.38,
      life: 0.4 + random() * 0.34,
      baseX: -42 + random() * 146,
      baseY: 0.3 + random() * 0.55,
      vx: 24 + random() * 115,
      vy: 34 + random() * 132,
      size: 1.8 + random() * 4.4,
      bright: random() > 0.42,
    });
  }
  return spray;
}

function createPoseidonImpactPulses(count) {
  const pulses = [];
  for (let i = 0; i < count; i += 1) {
    pulses.push({
      delay: 0.22 + i * 0.105,
      life: 0.38,
      xOffset: 24 + i * 34,
      yOffset: 8 + i * 2,
      color: i % 2 === 0 ? "rgba(230, 255, 255, 0.82)" : "rgba(98, 222, 255, 0.68)",
    });
  }
  return pulses;
}

function getPoseidonTsunamiProgress(effect) {
  return Math.max(0, Math.min(1, effect.timer / effect.duration));
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
}

function smoothstep(edge0, edge1, value) {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

if (typeof window !== "undefined") {
  window.PoseidonTsunamiAnimation = {
    config: POSEIDON_TSUNAMI_SKILL_ANIMATION,
    create: createPoseidonTsunamiAnimation,
    update: updatePoseidonTsunamiAnimation,
    draw: drawPoseidonTsunamiAnimation,
    getDamageZone: getPoseidonTsunamiDamageZone,
    drawDebugZone: drawPoseidonTsunamiDebugZone,
  };
}
