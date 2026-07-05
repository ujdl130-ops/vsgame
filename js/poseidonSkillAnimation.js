// Standalone Poseidon tsunami skill animation.

const POSEIDON_TSUNAMI_SKILL_ANIMATION = {
  spritePath: "assets/effects/ChatGPT Image 2026년 7월 5일 오후 06_20_54.png",
  duration: 1.45,
  waveWidth: 360,
  waveHeight: 238,
  damageWindowStart: 0.13,
  damageWindowEnd: 0.94,
  knockbackDirection: 1,
  spriteFrames: [
    { x: 8, y: 284, w: 188, h: 310, anchorX: 0.54, anchorY: 0.94, scale: 0.76 },
    { x: 188, y: 270, w: 214, h: 325, anchorX: 0.53, anchorY: 0.94, scale: 0.88 },
    { x: 388, y: 254, w: 218, h: 342, anchorX: 0.53, anchorY: 0.94, scale: 1.0 },
    { x: 602, y: 246, w: 232, h: 350, anchorX: 0.53, anchorY: 0.94, scale: 1.05 },
    { x: 818, y: 236, w: 258, h: 360, anchorX: 0.5, anchorY: 0.94, scale: 1.1 },
    { x: 1040, y: 272, w: 292, h: 324, anchorX: 0.43, anchorY: 0.94, scale: 0.98 },
    { x: 1228, y: 304, w: 436, h: 292, anchorX: 0.3, anchorY: 0.94, scale: 0.82 },
  ],
};

const poseidonTsunamiSprite = typeof Image !== "undefined" ? new Image() : null;
let poseidonTsunamiSpriteReady = false;
let poseidonTsunamiSpriteCanvas = null;
let poseidonTsunamiSpriteMaskFailed = false;

if (poseidonTsunamiSprite) {
  poseidonTsunamiSprite.onload = () => {
    poseidonTsunamiSpriteReady = true;
    poseidonTsunamiSpriteCanvas = null;
  };
  poseidonTsunamiSprite.onerror = () => {
    poseidonTsunamiSpriteReady = false;
    poseidonTsunamiSpriteMaskFailed = true;
    console.warn("Poseidon tsunami sprite could not be loaded.");
  };
  poseidonTsunamiSprite.src = POSEIDON_TSUNAMI_SKILL_ANIMATION.spritePath;
}

function createPoseidonTsunamiAnimation(options = {}) {
  const canvasWidth = options.canvasWidth || (typeof canvas !== "undefined" ? canvas.width : 960);
  const laneY = options.laneY || (typeof COMBAT_LINE_Y !== "undefined" ? COMBAT_LINE_Y : 258);
  const groundY = options.groundY || laneY + 30;
  const height = options.height || POSEIDON_TSUNAMI_SKILL_ANIMATION.waveHeight;
  const width = options.width || POSEIDON_TSUNAMI_SKILL_ANIMATION.waveWidth;
  const startX = options.startX == null ? -width * 0.62 : options.startX;
  const endX = options.endX == null ? canvasWidth + width * 0.52 : options.endX;
  const random = options.random || Math.random;

  return {
    type: "poseidonTsunami",
    active: true,
    timer: 0,
    duration: options.duration || POSEIDON_TSUNAMI_SKILL_ANIMATION.duration,
    laneY,
    groundY,
    startX,
    endX,
    width,
    height,
    impactX: startX,
    hitEnemies: new Set(),
    wake: createPoseidonWakeStreaks(24, random),
    spray: createPoseidonSprayBursts(36, random),
    pulses: createPoseidonImpactPulses(4),
  };
}

function updatePoseidonTsunamiAnimation(effect, dt) {
  if (!effect || !effect.active) return false;

  effect.timer += dt;
  const progress = getPoseidonTsunamiProgress(effect);
  const travel = smoothstep(0.02, 0.96, progress);
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

  return {
    x: effect.impactX - effect.width * 0.5,
    y: effect.groundY - effect.height * 0.9,
    w: effect.width,
    h: effect.height,
    frontX: effect.impactX + effect.width * 0.24,
    knockbackX: POSEIDON_TSUNAMI_SKILL_ANIMATION.knockbackDirection,
  };
}

function drawPoseidonTsunamiAnimation(renderCtx, effect) {
  if (!renderCtx || !effect || !effect.active) return;

  const progress = getPoseidonTsunamiProgress(effect);
  const intro = smoothstep(0, 0.08, progress);
  const fade = 1 - smoothstep(0.84, 1, progress);
  const alpha = Math.max(0, intro * fade);
  if (alpha <= 0) return;

  renderCtx.save();
  renderCtx.imageSmoothingEnabled = true;
  renderCtx.imageSmoothingQuality = "high";

  drawPoseidonLaneWash(renderCtx, effect, progress, alpha);

  const spriteCanvas = getPoseidonTsunamiSpriteCanvas();
  if (spriteCanvas) {
    drawPoseidonSpriteFrame(renderCtx, effect, progress, alpha, spriteCanvas);
  } else {
    drawPoseidonFallbackWave(renderCtx, effect, progress, alpha);
  }

  drawPoseidonWakeFoam(renderCtx, effect, progress, alpha);
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

function getPoseidonTsunamiSpriteCanvas() {
  if (poseidonTsunamiSpriteCanvas) return poseidonTsunamiSpriteCanvas;
  if (!poseidonTsunamiSpriteReady || !poseidonTsunamiSprite || poseidonTsunamiSpriteMaskFailed) return null;

  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = poseidonTsunamiSprite.naturalWidth;
  maskCanvas.height = poseidonTsunamiSprite.naturalHeight;
  const maskCtx = maskCanvas.getContext("2d");

  try {
    maskCtx.drawImage(poseidonTsunamiSprite, 0, 0);
    const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max - min;
      const blueLift = (b - r) + (g - r) * 0.45;
      const blueWater = b > 118 && blueLift > 22;
      const cyanFoam = max > 206 && b > 196 && g > 190 && blueLift > -5 && r < 248;
      const paleBackground = max > 184 && saturation < 30;
      const checkerBackground = max > 218 && saturation < 54 && blueLift < 14;

      if (!blueWater && !cyanFoam && (paleBackground || checkerBackground)) {
        data[i + 3] = 0;
      } else if (!blueWater && !cyanFoam && max > 235 && saturation < 70) {
        data[i + 3] = Math.min(data[i + 3], 80);
      }
    }

    maskCtx.putImageData(imageData, 0, 0);
    poseidonTsunamiSpriteCanvas = maskCanvas;
  } catch (error) {
    poseidonTsunamiSpriteMaskFailed = true;
    console.warn("Poseidon tsunami sprite mask could not be prepared.", error);
  }

  return poseidonTsunamiSpriteCanvas;
}

function drawPoseidonSpriteFrame(renderCtx, effect, progress, alpha, spriteCanvas) {
  const frameIndex = getPoseidonSpriteFrameIndex(progress);
  const frame = POSEIDON_TSUNAMI_SKILL_ANIMATION.spriteFrames[frameIndex];
  const drawH = effect.height * frame.scale;
  const drawW = drawH * (frame.w / frame.h);
  const bob = Math.sin(progress * Math.PI * 4) * 3;
  const drawX = effect.impactX - drawW * frame.anchorX;
  const drawY = effect.groundY - drawH * frame.anchorY + bob;

  if (frameIndex > 0 && progress < 0.86) {
    const previous = POSEIDON_TSUNAMI_SKILL_ANIMATION.spriteFrames[frameIndex - 1];
    const previousH = effect.height * previous.scale * 0.96;
    const previousW = previousH * (previous.w / previous.h);
    renderCtx.globalAlpha = alpha * 0.24;
    renderCtx.drawImage(
      spriteCanvas,
      previous.x,
      previous.y,
      previous.w,
      previous.h,
      effect.impactX - previousW * previous.anchorX - 24,
      effect.groundY - previousH * previous.anchorY + 2,
      previousW,
      previousH
    );
  }

  renderCtx.globalAlpha = alpha;
  renderCtx.drawImage(
    spriteCanvas,
    frame.x,
    frame.y,
    frame.w,
    frame.h,
    drawX,
    drawY,
    drawW,
    drawH
  );
}

function getPoseidonSpriteFrameIndex(progress) {
  const frameCount = POSEIDON_TSUNAMI_SKILL_ANIMATION.spriteFrames.length;
  const frameProgress = smoothstep(0.04, 0.93, progress);
  return Math.min(frameCount - 1, Math.floor(frameProgress * frameCount));
}

function drawPoseidonLaneWash(renderCtx, effect, progress, alpha) {
  const washLength = effect.width * (0.82 + progress * 0.72);
  const washX = effect.impactX - washLength * 0.46;
  const washY = effect.groundY - 8;

  renderCtx.globalAlpha = alpha * 0.58;
  const gradient = renderCtx.createLinearGradient(washX - washLength * 0.58, washY, washX + washLength * 0.58, washY);
  gradient.addColorStop(0, "rgba(19, 74, 130, 0)");
  gradient.addColorStop(0.26, "rgba(12, 151, 205, 0.26)");
  gradient.addColorStop(0.58, "rgba(69, 224, 244, 0.36)");
  gradient.addColorStop(1, "rgba(232, 255, 255, 0)");

  renderCtx.fillStyle = gradient;
  renderCtx.beginPath();
  renderCtx.ellipse(washX, washY, washLength * 0.58, 22, -0.02, 0, Math.PI * 2);
  renderCtx.fill();

  renderCtx.strokeStyle = "rgba(208, 255, 255, 0.54)";
  renderCtx.lineWidth = 3;
  renderCtx.lineCap = "round";
  for (let i = 0; i < 3; i += 1) {
    const offsetY = -14 + i * 12;
    const wave = Math.sin(progress * 9 + i) * 8;
    renderCtx.globalAlpha = alpha * (0.4 - i * 0.08);
    renderCtx.beginPath();
    renderCtx.moveTo(effect.impactX - washLength * 0.72, washY + offsetY);
    renderCtx.quadraticCurveTo(effect.impactX - washLength * 0.2, washY + offsetY - 11 - wave, effect.impactX + washLength * 0.28, washY + offsetY - 1);
    renderCtx.stroke();
  }
}

function drawPoseidonWakeFoam(renderCtx, effect, progress, alpha) {
  renderCtx.fillStyle = "rgba(238, 255, 255, 0.92)";

  for (const wake of effect.wake) {
    const local = (progress * wake.speed + wake.offset) % 1;
    const back = effect.width * (0.18 + local * 0.96);
    const foamX = effect.impactX - back + wake.xJitter;
    const foamY = effect.groundY - wake.yOffset + Math.sin(progress * 10 + wake.offset * 8) * wake.bob;
    const size = wake.size * (1 - local * 0.42);
    const foamAlpha = alpha * (1 - local) * 0.62;
    if (foamAlpha <= 0) continue;

    renderCtx.globalAlpha = foamAlpha;
    renderCtx.beginPath();
    renderCtx.ellipse(foamX, foamY, size * 2.2, size, wake.angle, 0, Math.PI * 2);
    renderCtx.fill();
  }
}

function drawPoseidonSpray(renderCtx, effect, progress, alpha) {
  const frameIndex = getPoseidonSpriteFrameIndex(progress);
  const crashBoost = frameIndex >= 4 ? 1.25 : 0.85;

  for (const spray of effect.spray) {
    const local = (progress - spray.delay) / spray.life;
    if (local <= 0 || local >= 1) continue;

    const arc = Math.sin(local * Math.PI);
    const x = effect.impactX + spray.baseX + spray.vx * local;
    const y = effect.groundY - spray.baseY - spray.vy * arc * crashBoost + local * local * 34;
    const size = spray.size * (1 - local * 0.46);
    const sprayAlpha = alpha * (1 - local) * 0.78;

    renderCtx.globalAlpha = sprayAlpha;
    renderCtx.fillStyle = spray.bright ? "#f5ffff" : "#a9f4ff";
    renderCtx.beginPath();
    renderCtx.arc(x, y, size, 0, Math.PI * 2);
    renderCtx.fill();
  }
}

function drawPoseidonImpactPulses(renderCtx, effect, progress, alpha) {
  for (const pulse of effect.pulses) {
    const local = (progress - pulse.delay) / pulse.life;
    if (local <= 0 || local >= 1) continue;

    const width = effect.width * (0.2 + local * 0.42);
    const height = 12 + local * 24;
    const pulseAlpha = alpha * (1 - local) * 0.42;

    renderCtx.globalAlpha = pulseAlpha;
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
}

function drawPoseidonFallbackWave(renderCtx, effect, progress, alpha) {
  const x = effect.impactX;
  const y = effect.groundY;
  const width = effect.width;
  const height = effect.height;
  const crestY = y - height * (0.74 + Math.sin(progress * Math.PI * 2.1) * 0.035);

  renderCtx.globalAlpha = alpha * 0.88;
  const bodyGradient = renderCtx.createLinearGradient(x - width * 0.62, crestY, x + width * 0.34, y + 18);
  bodyGradient.addColorStop(0, "rgba(5, 48, 112, 0.82)");
  bodyGradient.addColorStop(0.48, "rgba(18, 165, 215, 0.9)");
  bodyGradient.addColorStop(1, "rgba(235, 255, 255, 0.92)");

  renderCtx.fillStyle = bodyGradient;
  renderCtx.beginPath();
  renderCtx.moveTo(x - width * 0.66, y + 18);
  renderCtx.bezierCurveTo(x - width * 0.44, y - height * 0.32, x - width * 0.2, y - height * 0.78, x + width * 0.08, crestY);
  renderCtx.bezierCurveTo(x + width * 0.36, crestY - height * 0.08, x + width * 0.34, y - height * 0.2, x + width * 0.12, y - height * 0.2);
  renderCtx.bezierCurveTo(x + width * 0.38, y - height * 0.08, x + width * 0.42, y + 8, x + width * 0.32, y + 18);
  renderCtx.closePath();
  renderCtx.fill();

  renderCtx.strokeStyle = "rgba(230, 255, 255, 0.9)";
  renderCtx.lineWidth = 7;
  renderCtx.lineCap = "round";
  renderCtx.beginPath();
  renderCtx.moveTo(x - width * 0.04, crestY + 5);
  renderCtx.quadraticCurveTo(x + width * 0.24, crestY - 24, x + width * 0.08, y - height * 0.28);
  renderCtx.stroke();
}

function createPoseidonWakeStreaks(count, random) {
  const wake = [];
  for (let i = 0; i < count; i += 1) {
    wake.push({
      offset: random(),
      speed: 0.7 + random() * 0.6,
      yOffset: 4 + random() * 30,
      xJitter: (random() - 0.5) * 42,
      size: 2.4 + random() * 5.2,
      bob: 2 + random() * 5,
      angle: (random() - 0.5) * 0.38,
    });
  }
  return wake;
}

function createPoseidonSprayBursts(count, random) {
  const spray = [];
  for (let i = 0; i < count; i += 1) {
    spray.push({
      delay: 0.12 + random() * 0.48,
      life: 0.32 + random() * 0.34,
      baseX: -30 + random() * 130,
      baseY: 36 + random() * 126,
      vx: 20 + random() * 120,
      vy: 32 + random() * 118,
      size: 1.8 + random() * 4.2,
      bright: random() > 0.42,
    });
  }
  return spray;
}

function createPoseidonImpactPulses(count) {
  const pulses = [];
  for (let i = 0; i < count; i += 1) {
    pulses.push({
      delay: 0.22 + i * 0.11,
      life: 0.36,
      xOffset: 18 + i * 32,
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
    isSpriteReady: () => poseidonTsunamiSpriteReady,
  };
}
