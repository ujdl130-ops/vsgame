// Main hero data, growth hooks, combat, and rendering.

const GOD_HEROES = [
  { id: "zeus", name: "제우스", essenceKey: "lightningEssence", essenceName: "번개의 정수", role: "공격", level: 1, star: 1, starProgress: 0 },
  { id: "poseidon", name: "포세이돈", essenceKey: "seaEssence", essenceName: "바다의 정수", role: "제어", level: 1, star: 1, starProgress: 0 },
  { id: "hades", name: "하데스", essenceKey: "soulEssence", essenceName: "영혼의 정수", role: "공격", level: 1, star: 1, starProgress: 0 },
  { id: "athena", name: "아테나", essenceKey: "wisdomEssence", essenceName: "지혜의 정수", role: "지원", level: 1, star: 1, starProgress: 0 },
  { id: "ares", name: "아레스", essenceKey: "warEssence", essenceName: "전쟁의 정수", role: "전사", level: 1, star: 1, starProgress: 0 },
  { id: "heracles", name: "헤라클레스", essenceKey: "strengthEssence", essenceName: "힘의 정수", role: "방어", level: 1, star: 1, starProgress: 0 },
];

function getGodHeroes() {
  return GOD_HEROES.map((hero) => ({ ...hero }));
}

function getGodHeroById(heroId) {
  const hero = GOD_HEROES.find(({ id }) => id === heroId);
  return hero ? { ...hero } : null;
}

window.HeroAPI = { heroes: GOD_HEROES, getGodHeroes, getGodHeroById };

const HERO_ZEUS_SPRITE = {
  // 배경을 제거하고 각 프레임의 좌우 간격을 다시 맞춘 제우스 스프라이트입니다.
  // 시트 크기: 1536 x 1024, 6열 x 5행 기준
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

const ZEUS_THUNDERSTORM_SKILL = {
  name: "천벌",
  frameCount: 8,
  duration: 1.8,
  cloudBuildTime: 0.75,
  lightningStartTime: 0.82,
  lightningDuration: 0.72,
  clusterRadius: 150,
  framePadX: 28,
  damage: 45,
  paralysisDuration: 2,
  lightningColumnRadius: 20,
  lightningHitColumns: [
    [0.24, 0.72],
    [0.42, 0.72],
    [0.28, 0.66],
    [0.24, 0.56],
    [0.36, 0.68],
    [0.36, 0.76],
    [0.18, 0.72],
    [0.54, 0.78],
  ],
  fallbackX: ENEMY_BASE_X - 120,
};


function createMainHero() {
  const stats = getGrownStats("hero", { hp: 180, damage: 34 });
  return {
    type: "hero",
    name: "제우스",
    level: stats.level,
    star: stats.star,
    x: PLAYER_BASE_X + 112,
    y: COMBAT_LINE_Y,
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


function findZeusThunderstormTargetX() {
  const enemies = gameState.enemies.filter(isCombatAlive);
  if (enemies.length === 0) return ZEUS_THUNDERSTORM_SKILL.fallbackX;

  let bestX = enemies[0].x;
  let bestScore = -Infinity;

  for (const candidate of enemies) {
    let weightedX = 0;
    let weightTotal = 0;

    for (const enemy of enemies) {
      const distance = Math.abs(enemy.x - candidate.x);
      if (distance > ZEUS_THUNDERSTORM_SKILL.clusterRadius) continue;

      const weight = 1 - distance / ZEUS_THUNDERSTORM_SKILL.clusterRadius;
      weightedX += enemy.x * weight;
      weightTotal += weight;
    }

    if (weightTotal > bestScore) {
      bestScore = weightTotal;
      bestX = weightedX / weightTotal;
    }
  }

  return Math.max(130, Math.min(canvas.width - 130, bestX));
}

function castZeusThunderstorm() {
  if (!gameState || !gameState.running || gameState.gameOver || gameState.clear) return;
  const hero = gameState.hero;
  if (!hero || hero.dead || hero.hp <= 0) return;
  if (gameState.zeusSkillEffect && gameState.zeusSkillEffect.active) return;
  if ((gameState.zeusMana || 0) < ZEUS_MANA_COST) {
    gameState.message = `마나 부족! 천벌은 ${ZEUS_MANA_COST}마나가 필요합니다.`;
    gameState.messageTimer = 0.85;
    updateButtons();
    return;
  }

  gameState.zeusMana = Math.max(0, (gameState.zeusMana || 0) - ZEUS_MANA_COST);

  gameState.zeusSkillEffect = {
    active: true,
    timer: 0,
    duration: ZEUS_THUNDERSTORM_SKILL.duration,
    x: findZeusThunderstormTargetX(),
    hitEnemies: new Set(),
  };
  gameState.message = `${ZEUS_THUNDERSTORM_SKILL.name}!`;
  gameState.messageTimer = 0.65;
  updateButtons();
}

function showZeusSkillPlaceholder() {
  castZeusThunderstorm();
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
    gameState.message = "사거리 안에 적이 없습니다.";
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
      gameState.message = "메인 영웅 부활! 다시 조작할 수 있습니다.";
      gameState.messageTimer = 1.2;
    }
    return;
  }

  if (typeof hero.lastHp === "number" && hero.hp < hero.lastHp) {
    hero.hurtAnimTimer = 0.3;
  }
  hero.lastHp = hero.hp;

  const moveDir = Math.max(-1, Math.min(1, heroMoveInput || 0));

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
