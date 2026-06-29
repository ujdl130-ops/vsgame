// Main hero data, growth hooks, combat, and rendering.

const HERO_ZEUS_SPRITE = {
  // 寃? 諛곌꼍???쒓굅?섍퀬 媛??꾨젅?꾩쓽 醫뚯슦 媛꾧꺽???ㅼ떆 留욎텣 理쒖떊 ?쒖슦???ㅽ봽?쇱씠?몄엯?덈떎.
  // ?쒗듃 ?ш린: 1536 x 1024, 6??x 5??湲곗?
  frameW: 256,
  frameH: 204,
  drawW: 150,
  drawH: 150,
  fps: { idle: 5, walk: 8, attack: 10, hurt: 7, death: 6 },
  rows: { idle: 0, walk: 1, attack: 2, hurt: 3, death: 4 },
  frames: { idle: 6, walk: 6, attack: 6, hurt: 6, death: 6 },
  walkFrameOrder: [0, 1, 2, 3, 4, 5],
  walkOffsets: [
    { x: 0, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
    { x: 0, y: -1 },
  ],
};


function createMainHero() {
  const stats = getGrownStats("hero", { hp: 180, damage: 34 });
  return {
    type: "hero",
    name: "제우스",
    level: stats.level,
    star: stats.star,
    x: PLAYER_BASE_X + 112,
    y: GROUND_Y,
    w: 38,
    h: 62,
    hp: stats.hp,
    maxHp: stats.hp,
    speed: 145,
    damage: stats.damage,
    range: 275,
    cooldown: 0,
    attackSpeed: 0.48,
    attackAnimTimer: 0,
    attackAnimDuration: 0.56,
    pendingHeroShot: false,
    shotTarget: null,
    hurtAnimTimer: 0,
    animTime: 0,
    animState: "idle",
    animStateTime: 0,
    moving: false,
    face: 1,
    dead: false,
    respawnTimer: 0,
    lastHp: stats.hp,
  };
}


function showZeusSkillPlaceholder() {
  if (!gameState || !gameState.running || gameState.gameOver || gameState.clear) return;
  gameState.message = "?쒖슦???ㅽ궗? ?꾩쭅 以鍮?以묒엯?덈떎.";
  gameState.messageTimer = 1.25;
}


function castHolySlash() {
  heroAttack();
}

function fireHeroArrow(hero) {
  const shotTarget = isCombatAlive(hero.shotTarget)
    ? hero.shotTarget
    : findNearestEnemy(hero.x, hero.range);

  if (shotTarget) {
    gameState.projectiles.push({
      type: "heroBolt",
      x: hero.x + 28,
      y: hero.y - 56,
      vx: 620,
      damage: hero.damage,
      target: shotTarget,
    });
  } else if (ENEMY_BASE_X - hero.x <= hero.range + 25) {
    gameState.enemyBaseHp -= hero.damage * 0.65;
    spawnHit(ENEMY_BASE_X - 38, GROUND_Y - 78, "#9fe8ff");
  } else {
    gameState.message = "?ш굅由??덉뿉 ?곸씠 ?놁뒿?덈떎.";
    gameState.messageTimer = 0.8;
  }

  hero.pendingHeroShot = false;
  hero.shotTarget = null;
}

function heroAttack() {
  if (!gameState || !gameState.running || gameState.gameOver || gameState.clear) return;
  const hero = gameState.hero;
  if (!hero || hero.dead || hero.hp <= 0 || hero.cooldown > 0) return;

  hero.face = 1;
  hero.cooldown = hero.attackSpeed;
  hero.attackAnimDuration = 0.56;
  hero.attackAnimTimer = hero.attackAnimDuration;
  hero.pendingHeroShot = true;
  hero.shotTarget = findNearestEnemy(hero.x, hero.range);
}

function getHeroVisualAnim(hero) {
  if (!hero || hero.dead || hero.hp <= 0) return "death";
  if (hero.hurtAnimTimer > 0) return "hurt";
  if (hero.attackAnimTimer > 0) return "attack";
  if (hero.moving) return "walk";
  return "idle";
}

function syncHeroAnimState(hero, dt) {
  const nextAnim = getHeroVisualAnim(hero);
  if (hero.animState !== nextAnim) {
    hero.animState = nextAnim;
    hero.animStateTime = 0;
    return;
  }
  hero.animStateTime = (hero.animStateTime || 0) + dt;
}

function updateHero(dt) {
  const hero = gameState.hero;
  if (!hero) return;

  hero.animTime = (hero.animTime || 0) + dt;
  hero.cooldown = Math.max(0, hero.cooldown - dt);
  hero.attackAnimTimer = Math.max(0, (hero.attackAnimTimer || 0) - dt);
  hero.hurtAnimTimer = Math.max(0, (hero.hurtAnimTimer || 0) - dt);
  hero.moving = false;

  if (hero.hp <= 0) {
    if (!hero.dead) {
      hero.dead = true;
      hero.respawnTimer = HERO_RESPAWN_SECONDS;
      hero.pendingHeroShot = false;
      gameState.message = `메인 영웅이 쓰러졌습니다. ${HERO_RESPAWN_SECONDS}초 후 부활`;
      gameState.messageTimer = 1.2;
    }

    hero.respawnTimer = Math.max(0, hero.respawnTimer - dt);
    if (hero.respawnTimer <= 0) {
      Object.assign(hero, createMainHero());
      gameState.message = "硫붿씤 ?곸썒 遺?? ?ㅼ떆 議곗옉?????덉뒿?덈떎.";
      gameState.messageTimer = 1.2;
    }
    return;
  }

  if (typeof hero.lastHp === "number" && hero.hp < hero.lastHp) {
    hero.hurtAnimTimer = 0.3;
  }
  hero.lastHp = hero.hp;

  const moveLeft = keys.ArrowLeft || keys.KeyA;
  const moveRight = keys.ArrowRight || keys.KeyD;
  let moveDir = 0;
  if (moveLeft) moveDir -= 1;
  if (moveRight) moveDir += 1;

  if (moveDir !== 0) {
    hero.x += moveDir * hero.speed * dt;
    hero.x = Math.max(HERO_MIN_X, Math.min(HERO_MAX_X, hero.x));
    hero.moving = true;
    hero.face = moveDir > 0 ? 1 : -1;
  }

  if (keys.Space) {
    heroAttack();
  }

  if (hero.pendingHeroShot) {
    const duration = hero.attackAnimDuration || 0.56;
    const progress = hero.attackAnimTimer > 0 ? 1 - hero.attackAnimTimer / duration : 1;
    if (progress >= 0.58 || hero.attackAnimTimer <= 0) {
      fireHeroArrow(hero);
    }
  }

  syncHeroAnimState(hero, dt);
}

function drawHero(hero) {
  if (!hero || hero.dead || hero.hp <= 0) return;

  ctx.save();
  ctx.translate(hero.x, hero.y);

  const isHeroWalking = hero.animState === "walk" || hero.moving;
  const walkShadowPulse = isHeroWalking
    ? Math.abs(Math.sin((hero.animStateTime || 0) * HERO_ZEUS_SPRITE.fps.walk * Math.PI))
    : 0;

  ctx.fillStyle = "rgba(0,0,0,0.24)";
  ctx.beginPath();
  ctx.ellipse(0, 4, 28 + walkShadowPulse * 2, 8 - walkShadowPulse * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  if (heroSpriteReady) {
    drawHeroSprite(hero);
    ctx.restore();
    drawHealthBar(hero.x, hero.y - 118, 58, hero.hp, hero.maxHp, "#79ff7a");
    return;
  }

  const bob = Math.sin(performance.now() * 0.008) * 2;
  ctx.translate(0, bob);
  ctx.fillStyle = "#355f1f";
  ctx.fillRect(-15, -42, 30, 34);
  ctx.fillStyle = "#f0c78a";
  ctx.fillRect(-10, -58, 20, 18);
  ctx.fillStyle = "#244017";
  ctx.fillRect(-18, -50, 36, 16);
  ctx.strokeStyle = "#6a3e1f";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(22, -35, 18, -1.2, 1.2);
  ctx.stroke();
  ctx.restore();

  drawHealthBar(hero.x, hero.y - 118, 58, hero.hp, hero.maxHp, "#79ff7a");
}

function drawHeroSprite(hero) {
  const anim = hero.animState || getHeroVisualAnim(hero);
  const frameCount = HERO_ZEUS_SPRITE.frames[anim] || 1;
  const fps = HERO_ZEUS_SPRITE.fps[anim] || 8;
  const animTime = hero.animStateTime || hero.animTime || 0;
  let frame = Math.floor(animTime * fps) % frameCount;

  if (anim === "walk") {
    const order = HERO_ZEUS_SPRITE.walkFrameOrder || [0, 1, 2, 3, 4, 5];
    const orderIndex = Math.floor(animTime * fps) % order.length;
    frame = order[orderIndex] % frameCount;
  }

  if (anim === "attack") {
    const duration = hero.attackAnimDuration || 0.56;
    const progress = 1 - hero.attackAnimTimer / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const sx = frame * HERO_ZEUS_SPRITE.frameW;
  const sy = HERO_ZEUS_SPRITE.rows[anim] * HERO_ZEUS_SPRITE.frameH;
  const dw = HERO_ZEUS_SPRITE.drawW;
  const dh = HERO_ZEUS_SPRITE.drawH;
  const walkOffset = anim === "walk"
    ? HERO_ZEUS_SPRITE.walkOffsets[frame] || { x: 0, y: 0 }
    : { x: 0, y: 0 };

  ctx.save();
  if (hero.face < 0) ctx.scale(-1, 1);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    heroSprite,
    sx,
    sy,
    HERO_ZEUS_SPRITE.frameW,
    HERO_ZEUS_SPRITE.frameH,
    -dw / 2 + 2 + walkOffset.x,
    -dh + 10 + walkOffset.y,
    dw,
    dh
  );
  ctx.restore();
}
