const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const waveText = document.getElementById("waveText");
const goldText = document.getElementById("goldText");
const playerHpText = document.getElementById("playerHpText");
const enemyHpText = document.getElementById("enemyHpText");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const summonGuardBtn = document.getElementById("summonGuardBtn");
const summonArcherBtn = document.getElementById("summonArcherBtn");
const skillBtn = document.getElementById("skillBtn");

const GROUND_Y = 410;
const PLAYER_BASE_X = 40;
const ENEMY_BASE_X = 900;
const MAX_WAVE = 3;

let gameState;
let lastTime = 0;
let animationId = null;
let keys = {};

function createInitialState() {
  return {
    running: false,
    gameOver: false,
    clear: false,
    message: "게임 시작을 눌러주세요",
    messageTimer: 0,
    wave: 1,
    gold: 100,
    goldTimer: 0,
    playerBaseHp: 100,
    enemyBaseHp: 100,
    enemySpawnTimer: 0,
    enemiesToSpawn: 5,
    spawnedInWave: 0,
    waveBreakTimer: 0,
    particles: [],
    projectiles: [],
    units: [],
    enemies: [],
    hero: {
      x: 145,
      y: GROUND_Y,
      w: 46,
      h: 70,
      hp: 120,
      maxHp: 120,
      speed: 210,
      attackCooldown: 0,
      face: 1,
    },
  };
}

function resetGame() {
  if (animationId) cancelAnimationFrame(animationId);
  gameState = createInitialState();
  lastTime = performance.now();
  updateHud();
  updateButtons();
  animationId = requestAnimationFrame(gameLoop);
}

function startGame() {
  if (gameState.gameOver || gameState.clear) resetGame();
  gameState.running = true;
  gameState.message = "Wave 1 시작!";
  gameState.messageTimer = 1.2;
  updateButtons();
}

function updateHud() {
  waveText.textContent = `${gameState.wave} / ${MAX_WAVE}`;
  goldText.textContent = Math.floor(gameState.gold);
  playerHpText.textContent = Math.max(0, Math.ceil(gameState.playerBaseHp));
  enemyHpText.textContent = Math.max(0, Math.ceil(gameState.enemyBaseHp));
}

function updateButtons() {
  const disabled = !gameState.running || gameState.gameOver || gameState.clear;
  summonGuardBtn.disabled = disabled || gameState.gold < 50;
  summonArcherBtn.disabled = disabled || gameState.gold < 75;
  skillBtn.disabled = disabled || gameState.gold < 100;
  startBtn.textContent = gameState.running ? "진행 중" : "게임 시작";
  startBtn.disabled = gameState.running && !gameState.gameOver && !gameState.clear;
}

function spendGold(amount) {
  if (!gameState.running || gameState.gold < amount || gameState.gameOver || gameState.clear) return false;
  gameState.gold -= amount;
  updateHud();
  updateButtons();
  return true;
}

function summonGuard() {
  if (!spendGold(50)) return;
  gameState.units.push({
    type: "guard",
    name: "방패병",
    x: PLAYER_BASE_X + 70,
    y: GROUND_Y,
    w: 34,
    h: 56,
    hp: 90,
    maxHp: 90,
    speed: 52,
    damage: 13,
    range: 42,
    cooldown: 0,
    attackSpeed: 0.75,
  });
}

function summonArcher() {
  if (!spendGold(75)) return;
  gameState.units.push({
    type: "archer",
    name: "궁수",
    x: PLAYER_BASE_X + 62,
    y: GROUND_Y,
    w: 32,
    h: 52,
    hp: 48,
    maxHp: 48,
    speed: 42,
    damage: 10,
    range: 170,
    cooldown: 0,
    attackSpeed: 1.05,
  });
}

function castHolySlash() {
  if (!spendGold(100)) return;
  gameState.particles.push({ type: "slash", x: gameState.hero.x + 44, y: GROUND_Y - 70, life: 0.38, maxLife: 0.38, w: 340 });
  for (const enemy of gameState.enemies) {
    if (enemy.x > gameState.hero.x && enemy.x < gameState.hero.x + 360) {
      enemy.hp -= 55;
      spawnHit(enemy.x, enemy.y - 35, "#fff59d");
    }
  }
}

function spawnEnemy() {
  const wave = gameState.wave;
  const isBrute = wave >= 2 && Math.random() < 0.32;
  const isFast = wave >= 3 && Math.random() < 0.25;

  if (isBrute) {
    gameState.enemies.push({
      type: "brute",
      x: ENEMY_BASE_X - 45,
      y: GROUND_Y,
      w: 44,
      h: 66,
      hp: 95 + wave * 8,
      maxHp: 95 + wave * 8,
      speed: 28 + wave * 2,
      damage: 16 + wave * 2,
      range: 45,
      cooldown: 0,
      attackSpeed: 0.9,
    });
    return;
  }

  gameState.enemies.push({
    type: isFast ? "fast" : "normal",
    x: ENEMY_BASE_X - 45,
    y: GROUND_Y,
    w: isFast ? 30 : 34,
    h: isFast ? 46 : 54,
    hp: isFast ? 36 + wave * 6 : 55 + wave * 8,
    maxHp: isFast ? 36 + wave * 6 : 55 + wave * 8,
    speed: isFast ? 74 + wave * 3 : 43 + wave * 3,
    damage: isFast ? 7 + wave : 10 + wave * 2,
    range: 38,
    cooldown: 0,
    attackSpeed: isFast ? 0.52 : 0.78,
  });
}

function findNearestEnemy(fromX, range) {
  let target = null;
  let bestDistance = Infinity;
  for (const enemy of gameState.enemies) {
    const distance = enemy.x - fromX;
    if (distance >= -20 && distance <= range && distance < bestDistance) {
      target = enemy;
      bestDistance = distance;
    }
  }
  return target;
}

function findNearestAlly(fromX, range) {
  const candidates = [gameState.hero, ...gameState.units];
  let target = null;
  let bestDistance = Infinity;
  for (const ally of candidates) {
    const distance = fromX - ally.x;
    if (distance >= -10 && distance <= range && distance < bestDistance) {
      target = ally;
      bestDistance = distance;
    }
  }
  return target;
}

function heroAttack() {
  const hero = gameState.hero;
  if (!gameState.running || hero.attackCooldown > 0 || gameState.gameOver || gameState.clear) return;
  hero.attackCooldown = 0.42;
  gameState.particles.push({ type: "heroAttack", x: hero.x + 42, y: hero.y - 56, life: 0.18, maxLife: 0.18 });

  const target = findNearestEnemy(hero.x, 98);
  if (target) {
    target.hp -= 22;
    spawnHit(target.x, target.y - 32, "#fff2a8");
  }
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

function updateHero(dt) {
  const hero = gameState.hero;
  const moveLeft = keys.ArrowLeft || keys.KeyA;
  const moveRight = keys.ArrowRight || keys.KeyD;

  if (moveLeft) {
    hero.x -= hero.speed * dt;
    hero.face = -1;
  }
  if (moveRight) {
    hero.x += hero.speed * dt;
    hero.face = 1;
  }

  hero.x = Math.max(PLAYER_BASE_X + 35, Math.min(ENEMY_BASE_X - 130, hero.x));
  hero.attackCooldown = Math.max(0, hero.attackCooldown - dt);
}

function updateWave(dt) {
  if (gameState.waveBreakTimer > 0) {
    gameState.waveBreakTimer -= dt;
    const remain = Math.ceil(gameState.waveBreakTimer);
    gameState.message = `다음 웨이브까지 ${remain}`;
    if (gameState.waveBreakTimer <= 0) {
      gameState.wave += 1;
      gameState.enemySpawnTimer = 0;
      gameState.spawnedInWave = 0;
      gameState.enemiesToSpawn = 5 + gameState.wave * 3;
      gameState.enemyBaseHp = Math.min(100, gameState.enemyBaseHp + 18);
      gameState.message = `Wave ${gameState.wave} 시작!`;
      gameState.messageTimer = 1.1;
    }
    return;
  }

  gameState.enemySpawnTimer -= dt;
  const spawnGap = Math.max(0.82, 1.65 - gameState.wave * 0.22);

  if (gameState.spawnedInWave < gameState.enemiesToSpawn && gameState.enemySpawnTimer <= 0) {
    spawnEnemy();
    gameState.spawnedInWave += 1;
    gameState.enemySpawnTimer = spawnGap;
  }

  const waveFinished = gameState.spawnedInWave >= gameState.enemiesToSpawn && gameState.enemies.length === 0;
  if (waveFinished && gameState.wave < MAX_WAVE) {
    gameState.waveBreakTimer = 3;
    gameState.gold += 60;
  } else if (waveFinished && gameState.wave >= MAX_WAVE) {
    gameState.clear = true;
    gameState.running = false;
    gameState.message = "CLEAR! 모든 웨이브 방어 성공";
  }
}

function updateUnits(dt) {
  for (const unit of gameState.units) {
    unit.cooldown = Math.max(0, unit.cooldown - dt);
    const target = findNearestEnemy(unit.x, unit.range);

    if (target) {
      if (unit.cooldown <= 0) {
        unit.cooldown = unit.attackSpeed;
        if (unit.type === "archer") {
          gameState.projectiles.push({
            type: "arrow",
            x: unit.x + 18,
            y: unit.y - 38,
            vx: 420,
            damage: unit.damage,
            target,
          });
        } else {
          target.hp -= unit.damage;
          spawnHit(target.x, target.y - 30, "#b7f7ff");
        }
      }
    } else {
      unit.x += unit.speed * dt;
    }

    if (unit.x > ENEMY_BASE_X - 35) {
      gameState.enemyBaseHp -= unit.type === "archer" ? 8 * dt : 18 * dt;
      unit.x = ENEMY_BASE_X - 35;
    }
  }
}

function updateEnemies(dt) {
  for (const enemy of gameState.enemies) {
    enemy.cooldown = Math.max(0, enemy.cooldown - dt);
    const target = findNearestAlly(enemy.x, enemy.range);

    if (target) {
      if (enemy.cooldown <= 0) {
        enemy.cooldown = enemy.attackSpeed;
        target.hp -= enemy.damage;
        spawnHit(target.x, target.y - 38, "#ff9090");
      }
    } else {
      enemy.x -= enemy.speed * dt;
    }

    if (enemy.x < PLAYER_BASE_X + 28) {
      gameState.playerBaseHp -= enemy.damage * dt * 0.8;
      enemy.x = PLAYER_BASE_X + 28;
    }
  }

  if (gameState.hero.hp <= 0) {
    gameState.playerBaseHp -= 25 * dt;
    gameState.hero.hp = 0;
  }
}

function updateProjectiles(dt) {
  for (const projectile of gameState.projectiles) {
    projectile.x += projectile.vx * dt;
    if (projectile.target && projectile.target.hp > 0 && Math.abs(projectile.x - projectile.target.x) < 18) {
      projectile.target.hp -= projectile.damage;
      projectile.dead = true;
      spawnHit(projectile.target.x, projectile.target.y - 35, "#c6f7ff");
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
    }
  }
  gameState.particles = gameState.particles.filter((p) => p.life > 0);
}

function cleanupDeadEntities() {
  const beforeEnemies = gameState.enemies.length;
  gameState.enemies = gameState.enemies.filter((enemy) => enemy.hp > 0);
  const killed = beforeEnemies - gameState.enemies.length;
  if (killed > 0) gameState.gold += killed * 18;

  gameState.units = gameState.units.filter((unit) => unit.hp > 0 && unit.x < ENEMY_BASE_X - 15);

  if (gameState.hero.hp <= 0 && gameState.gold >= 60) {
    gameState.gold -= 60;
    gameState.hero.hp = gameState.hero.maxHp;
    gameState.hero.x = PLAYER_BASE_X + 105;
    gameState.message = "주인공 부활! 60G 사용";
    gameState.messageTimer = 1.1;
  }
}

function checkEndConditions() {
  if (gameState.enemyBaseHp <= 0) {
    gameState.clear = true;
    gameState.running = false;
    gameState.message = "VICTORY! 적 기지 파괴";
  }

  if (gameState.playerBaseHp <= 0) {
    gameState.gameOver = true;
    gameState.running = false;
    gameState.message = "GAME OVER! 아군 기지가 파괴됨";
  }
}

function update(dt) {
  if (!gameState.running) {
    updateParticles(dt);
    return;
  }

  gameState.messageTimer = Math.max(0, gameState.messageTimer - dt);
  gameState.goldTimer += dt;
  if (gameState.goldTimer >= 1) {
    gameState.gold += 8;
    gameState.goldTimer = 0;
  }

  updateHero(dt);
  updateWave(dt);
  updateUnits(dt);
  updateEnemies(dt);
  updateProjectiles(dt);
  updateParticles(dt);
  cleanupDeadEntities();
  checkEndConditions();
  updateHud();
  updateButtons();
}

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#82b5f5");
  sky.addColorStop(0.58, "#d5f4ff");
  sky.addColorStop(0.59, "#81b75c");
  sky.addColorStop(1, "#4a7d3a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  drawCloud(170, 90, 42);
  drawCloud(520, 62, 36);
  drawCloud(760, 120, 48);

  ctx.fillStyle = "#548f46";
  for (let x = -20; x < canvas.width + 30; x += 70) {
    ctx.beginPath();
    ctx.moveTo(x, 355);
    ctx.lineTo(x + 42, 275 + Math.sin(x * 0.03) * 18);
    ctx.lineTo(x + 92, 355);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = "#5b3b26";
  ctx.fillRect(0, GROUND_Y, canvas.width, 12);
  ctx.fillStyle = "#3d291c";
  ctx.fillRect(0, GROUND_Y + 12, canvas.width, 80);

  for (let x = 0; x < canvas.width; x += 48) {
    ctx.fillStyle = x % 96 === 0 ? "#6f4a2f" : "#553722";
    ctx.fillRect(x, GROUND_Y + 14, 36, 10);
  }
}

function drawCloud(x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
  ctx.arc(x + size * 0.45, y - size * 0.25, size * 0.45, 0, Math.PI * 2);
  ctx.arc(x + size * 0.9, y, size * 0.55, 0, Math.PI * 2);
  ctx.arc(x + size * 0.35, y + size * 0.18, size * 0.48, 0, Math.PI * 2);
  ctx.fill();
}

function drawBase(x, isPlayer) {
  ctx.save();
  ctx.translate(x, GROUND_Y);
  ctx.fillStyle = isPlayer ? "#f6d77a" : "#60405d";
  ctx.fillRect(-32, -82, 64, 82);
  ctx.fillStyle = isPlayer ? "#a56d2c" : "#2b1830";
  ctx.fillRect(-42, -28, 84, 28);
  ctx.fillStyle = isPlayer ? "#fff0b2" : "#b881ff";
  ctx.fillRect(-20, -105, 40, 26);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(-18, -54, 36, 54);
  ctx.restore();
}

function drawHealthBar(x, y, w, hp, maxHp, color) {
  const ratio = Math.max(0, hp / maxHp);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(x - w / 2, y, w, 7);
  ctx.fillStyle = color;
  ctx.fillRect(x - w / 2, y, w * ratio, 7);
  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.strokeRect(x - w / 2, y, w, 7);
}

function drawHero(hero) {
  ctx.save();
  ctx.translate(hero.x, hero.y);
  const bob = Math.sin(performance.now() * 0.008) * 2;

  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, 4, 32, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(0, bob);
  ctx.fillStyle = "#fff7d0";
  ctx.fillRect(-16, -52, 32, 38);
  ctx.fillStyle = "#684027";
  ctx.fillRect(-14, -74, 28, 22);
  ctx.fillStyle = "#ffe1b2";
  ctx.fillRect(-12, -68, 24, 21);
  ctx.fillStyle = "#2f4b95";
  ctx.fillRect(-18, -30, 36, 22);
  ctx.fillStyle = "#47311d";
  ctx.fillRect(-18, -12, 12, 14);
  ctx.fillRect(6, -12, 12, 14);

  ctx.strokeStyle = "#f7f2ff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(14, -43);
  ctx.lineTo(48, -64);
  ctx.stroke();

  ctx.fillStyle = "#222";
  ctx.fillRect(3, -61, 4, 4);
  ctx.restore();

  drawHealthBar(hero.x, hero.y - 88, 54, hero.hp, hero.maxHp, "#79ff7a");
}

function drawUnit(unit) {
  ctx.save();
  ctx.translate(unit.x, unit.y);
  const bob = Math.sin((performance.now() + unit.x * 10) * 0.01) * 2;
  ctx.translate(0, bob);

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 3, 22, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  if (unit.type === "guard") {
    ctx.fillStyle = "#5db7ff";
    ctx.fillRect(-14, -42, 28, 34);
    ctx.fillStyle = "#ffd7ac";
    ctx.fillRect(-11, -58, 22, 18);
    ctx.fillStyle = "#d6f1ff";
    ctx.fillRect(8, -40, 18, 26);
    ctx.strokeStyle = "#e9fbff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(20, -42);
    ctx.lineTo(42, -54);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#7be05e";
    ctx.fillRect(-13, -38, 26, 30);
    ctx.fillStyle = "#ffd7ac";
    ctx.fillRect(-10, -54, 20, 17);
    ctx.strokeStyle = "#6a3e1f";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(18, -35, 17, -1.2, 1.2);
    ctx.stroke();
  }

  ctx.restore();
  drawHealthBar(unit.x, unit.y - 68, 42, unit.hp, unit.maxHp, "#68d8ff");
}

function drawEnemy(enemy) {
  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  const bob = Math.sin((performance.now() + enemy.x * 11) * 0.012) * 2;
  ctx.translate(0, bob);

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
  drawHealthBar(enemy.x, enemy.y - enemy.h - 18, 44, enemy.hp, enemy.maxHp, "#ff6868");
}

function drawProjectiles() {
  for (const projectile of gameState.projectiles) {
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
    }

    ctx.restore();
  }
}

function drawMessage() {
  if (!gameState.message) return;
  if (gameState.running && gameState.messageTimer <= 0 && gameState.waveBreakTimer <= 0) return;

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(240, 42, 480, 62);
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.strokeRect(240, 42, 480, 62);
  ctx.fillStyle = "#fff3a8";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.fillText(gameState.message, canvas.width / 2, 82);
  ctx.restore();
}

function draw() {
  drawBackground();
  drawBase(PLAYER_BASE_X, true);
  drawBase(ENEMY_BASE_X, false);

  drawHealthBar(PLAYER_BASE_X, GROUND_Y - 126, 86, gameState.playerBaseHp, 100, "#79ff7a");
  drawHealthBar(ENEMY_BASE_X, GROUND_Y - 126, 86, gameState.enemyBaseHp, 100, "#ff6868");

  const drawList = [gameState.hero, ...gameState.units, ...gameState.enemies].sort((a, b) => a.y - b.y || a.x - b.x);
  for (const entity of drawList) {
    if (entity === gameState.hero) drawHero(entity);
    else if (gameState.units.includes(entity)) drawUnit(entity);
    else drawEnemy(entity);
  }

  drawProjectiles();
  drawParticles();
  drawMessage();
}

function gameLoop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;
  update(dt);
  draw();
  animationId = requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (event) => {
  keys[event.code] = true;
  if (event.code === "Space") {
    event.preventDefault();
    heroAttack();
  }
});

window.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetGame);
summonGuardBtn.addEventListener("click", summonGuard);
summonArcherBtn.addEventListener("click", summonArcher);
skillBtn.addEventListener("click", castHolySlash);
canvas.addEventListener("pointerdown", heroAttack);

resetGame();
