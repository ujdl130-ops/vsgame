// Poseidon tsunami skill animation, sprite-only.

const POSEIDON_TSUNAMI_SKILL_ANIMATION = {
  spritePath: "assets/effects/poseidon_tsunami_spritesheet.png",
  duration: 3.25,
  waveWidth: 560,
  waveHeight: 270,
  renderStretchX: 1.42,
  damageWindowStart: 0.1,
  damageWindowEnd: 0.97,
  knockbackDirection: 1,
  spriteFrames: [
    { x: 8, y: 284, w: 188, h: 310, anchorX: 0.54, anchorY: 0.94, scale: 0.82, stretchX: 1.18 },
    { x: 188, y: 270, w: 214, h: 325, anchorX: 0.53, anchorY: 0.94, scale: 0.95, stretchX: 1.22 },
    { x: 388, y: 254, w: 218, h: 342, anchorX: 0.53, anchorY: 0.94, scale: 1.08, stretchX: 1.28 },
    { x: 602, y: 246, w: 232, h: 350, anchorX: 0.53, anchorY: 0.94, scale: 1.15, stretchX: 1.34 },
    { x: 818, y: 236, w: 258, h: 360, anchorX: 0.5, anchorY: 0.94, scale: 1.2, stretchX: 1.42 },
    { x: 1040, y: 272, w: 292, h: 324, anchorX: 0.43, anchorY: 0.94, scale: 1.06, stretchX: 1.55 },
    { x: 1228, y: 304, w: 436, h: 292, anchorX: 0.3, anchorY: 0.94, scale: 0.9, stretchX: 1.7 },
  ],
};

const poseidonTsunamiSprite = typeof Image !== "undefined" ? new Image() : null;
let poseidonTsunamiSpriteReady = false;

if (poseidonTsunamiSprite) {
  poseidonTsunamiSprite.onload = () => {
    poseidonTsunamiSpriteReady = true;
  };
  poseidonTsunamiSprite.onerror = () => {
    poseidonTsunamiSpriteReady = false;
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
  const startX = options.startX == null ? -width * 0.86 : options.startX;
  const endX = options.endX == null ? canvasWidth + width * 0.36 : options.endX;

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
  };
}

function updatePoseidonTsunamiAnimation(effect, dt) {
  if (!effect || !effect.active) return false;

  effect.timer += dt;
  const progress = getPoseidonTsunamiProgress(effect);
  const travel = smoothstep(0.08, 0.99, progress);
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
    x: effect.impactX - effect.width * 0.58,
    y: effect.groundY - effect.height * 0.9,
    w: effect.width * 1.16,
    h: effect.height,
    frontX: effect.impactX + effect.width * 0.24,
    knockbackX: POSEIDON_TSUNAMI_SKILL_ANIMATION.knockbackDirection,
  };
}

function drawPoseidonTsunamiAnimation(renderCtx, effect) {
  if (!renderCtx || !effect || !effect.active) return;

  const spriteCanvas = getPoseidonTsunamiSpriteCanvas();
  if (!spriteCanvas) return;

  const progress = getPoseidonTsunamiProgress(effect);
  const intro = smoothstep(0, 0.08, progress);
  const fade = 1 - smoothstep(0.92, 1, progress);
  const alpha = Math.max(0, intro * fade);
  if (alpha <= 0) return;

  renderCtx.save();
  renderCtx.imageSmoothingEnabled = true;
  renderCtx.imageSmoothingQuality = "high";
  drawPoseidonSpriteFrame(renderCtx, effect, progress, alpha, spriteCanvas);
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
  if (!poseidonTsunamiSpriteReady || !poseidonTsunamiSprite) return null;
  return poseidonTsunamiSprite;
}

function drawPoseidonSpriteFrame(renderCtx, effect, progress, alpha, spriteCanvas) {
  const frameIndex = getPoseidonSpriteFrameIndex(progress);
  const frame = POSEIDON_TSUNAMI_SKILL_ANIMATION.spriteFrames[frameIndex];
  const drawH = effect.height * frame.scale;
  const stretchX = POSEIDON_TSUNAMI_SKILL_ANIMATION.renderStretchX * (frame.stretchX || 1);
  const drawW = drawH * (frame.w / frame.h) * stretchX;
  const bob = Math.sin(progress * Math.PI * 4) * 3;
  const drawX = effect.impactX - drawW * frame.anchorX;
  const drawY = effect.groundY - drawH * frame.anchorY + bob;

  if (frameIndex > 0 && progress < 0.86) {
    const previous = POSEIDON_TSUNAMI_SKILL_ANIMATION.spriteFrames[frameIndex - 1];
    const previousH = effect.height * previous.scale * 0.96;
    const previousStretchX = POSEIDON_TSUNAMI_SKILL_ANIMATION.renderStretchX * (previous.stretchX || 1);
    const previousW = previousH * (previous.w / previous.h) * previousStretchX;
    renderCtx.globalAlpha = alpha * 0.2;
    renderCtx.drawImage(
      spriteCanvas,
      previous.x,
      previous.y,
      previous.w,
      previous.h,
      effect.impactX - previousW * previous.anchorX - 46,
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
  const frameProgress = smoothstep(0.08, 0.98, progress);
  return Math.min(frameCount - 1, Math.floor(frameProgress * frameCount));
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
