const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const waveText = document.getElementById("waveText");
const goldText = document.getElementById("goldText");
const unitCountText = document.getElementById("unitCountText");
const playerHpText = document.getElementById("playerHpText");
const enemyHpText = document.getElementById("enemyHpText");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const summonGuardBtn = document.getElementById("summonGuardBtn");
const summonArcherBtn = document.getElementById("summonArcherBtn");
const summonMageBtn = document.getElementById("summonMageBtn");
const summonSaintessBtn = document.getElementById("summonSaintessBtn");
const skillBtn = document.getElementById("skillBtn"); // 현재 전투 개편으로 스킬 버튼은 사용하지 않습니다.
const titleScreen = document.getElementById("titleScreen");
const titleStartBtn = document.getElementById("titleStartBtn");
const lobbyScreen = document.getElementById("lobbyScreen");
const lobbyBattleBtn = document.getElementById("lobbyBattleBtn");
const lobbyShopBtn = document.getElementById("lobbyShopBtn");
const lobbyFormationBtn = document.getElementById("lobbyFormationBtn");
const lobbyRecruitBtn = document.getElementById("lobbyRecruitBtn");
const lobbyMissionBtn = document.getElementById("lobbyMissionBtn");
const lobbyMenuNotice = document.getElementById("lobbyMenuNotice");
const recruitScreen = document.getElementById("recruitScreen");
const recruitBackBtn = document.getElementById("recruitBackBtn");
const recruitCloseBtn = document.getElementById("recruitCloseBtn");
const recruitPullOneBtn = document.getElementById("recruitPullOneBtn");
const recruitPullTenBtn = document.getElementById("recruitPullTenBtn");
const recruitNotice = document.getElementById("recruitNotice");
const recruitDoorScene = document.getElementById("recruitDoorScene");
const recruitDoorFrame = document.getElementById("recruitDoorFrame");
const recruitDoorCloseBtn = document.getElementById("recruitDoorCloseBtn");
const doorTapGuide = document.getElementById("doorTapGuide");
const doorResultText = document.getElementById("doorResultText");
const doorKnockText = document.getElementById("doorKnockText");
const formationScreen = document.getElementById("formationScreen");
const formationBackBtn = document.getElementById("formationBackBtn");
const formationCloseBtn = document.getElementById("formationCloseBtn");
const formationNotice = document.getElementById("formationNotice");
const formationCategoryTabs = document.querySelectorAll(".formation-category-tab");
const formationDeckTabs = document.querySelectorAll(".formation-deck-tab:not(.is-locked)");
const formationSlots = document.querySelectorAll(".formation-slot");
const lobbyExitBtn = document.getElementById("lobbyExitBtn");
const lobbyNotice = document.getElementById("lobbyNotice");
const shopScreen = document.getElementById("shopScreen");
const shopBackBtn = document.getElementById("shopBackBtn");
const shopCloseBtn = document.getElementById("shopCloseBtn");
const shopNotice = document.getElementById("shopNotice");
const shopCards = document.querySelectorAll(".shop-card");
const stageSelectBtn = document.getElementById("stageSelectBtn");
const stageScreen = document.getElementById("stageScreen");
const stageBackBtn = document.getElementById("stageBackBtn");
const chapterPanel = document.getElementById("chapterPanel");
const stagePanel = document.getElementById("stagePanel");
const chapter1Btn = document.getElementById("chapter1Btn");
const chapterBackBtn = document.getElementById("chapterBackBtn");
const stageSelectNotice = document.getElementById("stageSelectNotice");
const stageCards = document.querySelectorAll(".stage-card");

const GROUND_Y = 410;
const PLAYER_BASE_X = 40;
const ENEMY_BASE_X = 900;
const MAX_WAVE = 3;
const MAX_SUMMONED_UNITS = 5;
const HERO_MIN_X = PLAYER_BASE_X + 72;
const HERO_MAX_X = ENEMY_BASE_X - 74;
const HERO_RESPAWN_SECONDS = 4;

const ASSET_PATHS = {
  archerSprite: "assets/animations/archer/elf_archer_guard_size_spritesheet.png",
  guardSprite: "assets/animations/guard/guard_spritesheet_v2.png",
  mageSprite: "assets/animations/mage/red_wizard_spritesheet.png",
  saintessSprite: "assets/animations/saintess/saintess_spritesheet_aligned.png",
  heroSprite: "assets/animations/hero/zeus_hero_spritesheet_latest_transparent_aligned.png",
  stage1EnemySprite: "assets/animations/enemy/stage1_goblin_spritesheet.png",
  stage1ForestBg: "assets/maps/stage1/stage1_forest_bg_v2.png",
  playerCastle: "assets/maps/stage1/player_castle_stage1.png",
  enemyCastle: "assets/maps/stage1/enemy_castle_stage1.png",
};

function loadGameImage(image, sourceList, setReady, label) {
  let sourceIndex = 0;

  image.onload = () => {
    setReady(true);
    console.log(`${label} 로드 성공: ${image.src}`);
  };

  image.onerror = () => {
    sourceIndex += 1;
    if (sourceIndex < sourceList.length) {
      image.src = sourceList[sourceIndex];
      return;
    }
    setReady(false);
    console.warn(`${label} 로드 실패. 기본 도형으로 표시됩니다.`);
  };

  image.src = sourceList[sourceIndex];
}

const archerSprite = new Image();
let archerSpriteReady = false;
loadGameImage(
  archerSprite,
  [ASSET_PATHS.archerSprite],
  (ready) => { archerSpriteReady = ready; },
  "궁수 스프라이트"
);

const heroSprite = new Image();
let heroSpriteReady = false;
loadGameImage(
  heroSprite,
  [ASSET_PATHS.heroSprite, "assets/animations/hero/zeus_hero_spritesheet_latest.png", "zeus_hero_spritesheet_latest.png"],
  (ready) => { heroSpriteReady = ready; },
  "메인 오퍼레이터 제우스 스프라이트"
);

const guardSprite = new Image();
let guardSpriteReady = false;
loadGameImage(
  guardSprite,
  [ASSET_PATHS.guardSprite],
  (ready) => { guardSpriteReady = ready; },
  "방패병 SD 기사 스프라이트"
);

const mageSprite = new Image();
let mageSpriteReady = false;
loadGameImage(
  mageSprite,
  [ASSET_PATHS.mageSprite],
  (ready) => { mageSpriteReady = ready; },
  "마법사 스프라이트"
);

const saintessSprite = new Image();
let saintessSpriteReady = false;
loadGameImage(
  saintessSprite,
  [ASSET_PATHS.saintessSprite],
  (ready) => { saintessSpriteReady = ready; },
  "성녀 스프라이트"
);

const stage1EnemySprite = new Image();
let stage1EnemySpriteReady = false;
loadGameImage(
  stage1EnemySprite,
  [ASSET_PATHS.stage1EnemySprite],
  (ready) => { stage1EnemySpriteReady = ready; },
  "Stage 1 enemy sprite"
);

const stage1ForestBg = new Image();
let stage1ForestBgReady = false;
loadGameImage(
  stage1ForestBg,
  [ASSET_PATHS.stage1ForestBg],
  (ready) => { stage1ForestBgReady = ready; },
  "Stage 1 숲 배경"
);

const playerCastleImage = new Image();
let playerCastleReady = false;
loadGameImage(
  playerCastleImage,
  [ASSET_PATHS.playerCastle],
  (ready) => { playerCastleReady = ready; },
  "플레이어 성"
);

const enemyCastleImage = new Image();
let enemyCastleReady = false;
loadGameImage(
  enemyCastleImage,
  [ASSET_PATHS.enemyCastle],
  (ready) => { enemyCastleReady = ready; },
  "적국의 성"
);

const GUARD_SPRITE = {
  // SD 기사형 방패병 전용 스프라이트 시트입니다.
  // 6열 x 5행: idle / walk / attack / unused hurt / death 순서입니다.
  // 프레임마다 몸통 중심이 조금씩 달라서 공격 시 잔상처럼 보이지 않도록
  // 애니메이션별 좌우 보정값을 따로 둡니다.
  frameW: 229,
  frameH: 229,
  drawW: 88,
  drawH: 88,
  fps: { idle: 5, walk: 8, attack: 11, death: 6 },
  rows: { idle: 0, walk: 1, attack: 2, death: 4 },
  frames: { idle: 6, walk: 6, attack: 6, death: 6 },
  baseOffset: { x: 8, y: 0 },
  offsets: {
    idle: [
      { x: -6, y: 0 },
      { x: -7, y: 0 },
      { x: -3, y: 0 },
      { x: 2, y: 0 },
      { x: 6, y: 0 },
      { x: 6, y: 0 },
    ],
    walk: [
      { x: -5, y: 0 },
      { x: -7, y: 0 },
      { x: -2, y: 0 },
      { x: 2, y: 0 },
      { x: 6, y: 0 },
      { x: 7, y: 0 },
    ],
    attack: [
      { x: 0, y: 0 },
      { x: -8, y: 0 },
      { x: -6, y: 0 },
      { x: -5, y: 0 },
      { x: -5, y: 0 },
      { x: -4, y: 0 },
    ],
    death: [
      { x: 2, y: 0 },
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: -3, y: 0 },
      { x: -2, y: 0 },
      { x: -2, y: 0 },
    ],
  },
};

const ARCHER_SPRITE = {
  // 6 columns x 5 rows, aligned to the guard sprite frame size.
  frameW: 229,
  frameH: 229,
  drawW: 88,
  drawH: 88,
  fps: { idle: 1, walk: 8, attack: 10, death: 6 },
  rows: { idle: 0, walk: 1, attack: 2, death: 4 },
  frames: { idle: 1, walk: 6, attack: 6, death: 6 },
};

const MAGE_SPRITE = {
  // 6 columns x 5 rows, aligned to the guard sprite frame size.
  frameW: 229,
  frameH: 229,
  drawW: 88,
  drawH: 88,
  fps: { idle: 5, walk: 8, attack: 10, death: 6 },
  rows: { idle: 0, walk: 1, attack: 2, death: 4 },
  frames: { idle: 6, walk: 6, attack: 6, death: 6 },
};

const SAINTESS_SPRITE = {
  // 6 columns x 5 rows, aligned to the guard sprite frame size.
  frameW: 229,
  frameH: 229,
  drawW: 88,
  drawH: 88,
  fps: { idle: 5, walk: 8, attack: 10, death: 6 },
  rows: { idle: 0, walk: 1, attack: 2, death: 4 },
  frames: { idle: 6, walk: 6, attack: 6, death: 6 },
};


const HERO_ZEUS_SPRITE = {
  // 검은 배경을 제거하고 각 프레임의 좌우 간격을 다시 맞춘 최신 제우스 스프라이트입니다.
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

const STAGE1_ENEMY_SPRITE = {
  columns: 6,
  rowCount: 3,
  rows: { walk: 0, attack: 1, death: 2 },
  frames: { walk: 6, attack: 6, death: 6 },
  fps: { walk: 8, attack: 11, death: 8 },
  drawW: 150,
  drawH: 94,
  healthBarOffsetY: 96,
  offsets: {
    walk: [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    attack: [
      { x: 0, y: 0 },
      { x: -3, y: 0 },
      { x: -6, y: 0 },
      { x: -9, y: 0 },
      { x: -5, y: 0 },
      { x: -2, y: 0 },
    ],
    death: [
      { x: 0, y: 0 },
      { x: 0, y: 2 },
      { x: 1, y: 4 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },
      { x: 3, y: 5 },
    ],
  },
};


const STAGE_CONFIGS = {
  1: {
    title: "풀숲 입구",
    maxWave: 3,
    startGold: 220,
    enemyBaseHp: 90,
    baseEnemiesToSpawn: 4,
  },
  2: {
    title: "몬스터 언덕",
    maxWave: 3,
    startGold: 190,
    enemyBaseHp: 120,
    baseEnemiesToSpawn: 6,
  },
  3: {
    title: "마왕의 전초기지",
    maxWave: 3,
    startGold: 170,
    enemyBaseHp: 150,
    baseEnemiesToSpawn: 8,
  },
};

const STAGE_PROGRESS_KEY = "pixelDefenseStageProgress";
let selectedStage = 1;
let playerProgress = loadProgress();


let gameState;
let lastTime = 0;
let animationId = null;
let keys = {};
let recruitDoorState = {
  active: false,
  tapCount: 0,
  pullCount: 1,
  hasThreeStar: false,
  opened: false,
};

function createInitialState() {
  const stageConfig = getStageConfig(selectedStage);

  return {
    running: false,
    gameOver: false,
    clear: false,
    stage: selectedStage,
    stageTitle: stageConfig.title,
    maxWave: stageConfig.maxWave,
    baseEnemiesToSpawn: stageConfig.baseEnemiesToSpawn,
    message: `Stage ${selectedStage} 준비 완료`,
    messageTimer: 0,
    wave: 1,
    gold: stageConfig.startGold,
    goldTimer: 0,
    playerBaseHp: 100,
    enemyBaseHp: stageConfig.enemyBaseHp,
    enemyBaseMaxHp: stageConfig.enemyBaseHp,
    enemySpawnTimer: 0,
    enemiesToSpawn: stageConfig.baseEnemiesToSpawn,
    spawnedInWave: 0,
    waveBreakTimer: 0,
    hero: createMainHero(),
    particles: [],
    projectiles: [],
    units: [],
    enemies: [],
  };
}

function createMainHero() {
  return {
    type: "hero",
    name: "제우스",
    x: PLAYER_BASE_X + 112,
    y: GROUND_Y,
    w: 38,
    h: 62,
    hp: 120,
    maxHp: 120,
    speed: 150,
    damage: 22,
    range: 265,
    cooldown: 0,
    attackSpeed: 0.5,
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
    lastHp: 120,
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


function getStageConfig(stageNumber) {
  return STAGE_CONFIGS[stageNumber] || STAGE_CONFIGS[1];
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STAGE_PROGRESS_KEY));
    if (!saved || typeof saved !== "object") throw new Error("No progress");
    const unlockedStage = Math.min(3, Math.max(1, Number(saved.unlockedStage) || 1));
    const clearedStages = Array.isArray(saved.clearedStages)
      ? saved.clearedStages.map(Number).filter((stage) => stage >= 1 && stage <= 3)
      : [];
    return { unlockedStage, clearedStages };
  } catch (error) {
    return { unlockedStage: 1, clearedStages: [] };
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STAGE_PROGRESS_KEY, JSON.stringify(playerProgress));
  } catch (error) {
    // 로컬 파일 실행 환경에서 저장소 접근이 막히더라도 게임 진행은 유지합니다.
  }
}

function isStageUnlocked(stageNumber) {
  return stageNumber <= playerProgress.unlockedStage;
}

function unlockStageProgress(stageNumber) {
  if (!playerProgress.clearedStages.includes(stageNumber)) {
    playerProgress.clearedStages.push(stageNumber);
  }
  if (stageNumber < 3) {
    playerProgress.unlockedStage = Math.max(playerProgress.unlockedStage, stageNumber + 1);
  }
  saveProgress();
  updateStageUI();
}

function updateStageUI() {
  stageCards.forEach((card) => {
    const stageNumber = Number(card.dataset.stage);
    const unlocked = isStageUnlocked(stageNumber);
    const cleared = playerProgress.clearedStages.includes(stageNumber);
    const status = card.querySelector(".stage-status");
    const lockIcon = card.querySelector(".lock-icon");

    card.classList.toggle("is-locked", !unlocked);
    card.classList.toggle("is-clear", cleared);
    card.setAttribute("aria-disabled", unlocked ? "false" : "true");

    if (status) {
      if (cleared) status.textContent = "클리어 완료";
      else if (unlocked) status.textContent = "도전 가능";
      else status.textContent = `Stage ${stageNumber - 1} 클리어 필요`;
    }

    if (lockIcon) {
      if (cleared) lockIcon.textContent = "★";
      else if (unlocked) lockIcon.textContent = "▶";
      else lockIcon.textContent = "🔒";
    }
  });
}

function showStageLockedNotice(stageNumber) {
  if (!stageSelectNotice) return;
  stageSelectNotice.textContent = `Stage ${stageNumber}는 아직 잠겨있습니다. 먼저 Stage ${stageNumber - 1}을 클리어하세요.`;
}

function showStageSelect() {
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.remove("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);
  if (chapterPanel) chapterPanel.classList.remove("is-hidden");
  if (stagePanel) stagePanel.classList.add("is-hidden");
  document.body.classList.remove("game-started", "in-lobby", "in-shop", "in-recruit", "in-formation");
  document.body.classList.add("in-stage-select");

  if (gameState) {
    gameState.running = false;
    gameState.message = "스테이지를 선택하세요";
    updateButtons();
  }

  if (stageSelectNotice) {
    stageSelectNotice.textContent = "Chapter 1을 선택해 전투 지역을 확인하세요.";
  }
  updateStageUI();
}

function showChapterStages() {
  if (chapterPanel) chapterPanel.classList.add("is-hidden");
  if (stagePanel) stagePanel.classList.remove("is-hidden");
  if (stageSelectNotice) stageSelectNotice.textContent = "Stage 1부터 순서대로 클리어하면 다음 스테이지가 열립니다.";
  updateStageUI();
}

function openStage(stageNumber) {
  if (!isStageUnlocked(stageNumber)) {
    showStageLockedNotice(stageNumber);
    return;
  }
  startGame(stageNumber);
}

function isTitleVisible() {
  return titleScreen && !titleScreen.classList.contains("is-hidden");
}

function isLobbyVisible() {
  return lobbyScreen && !lobbyScreen.classList.contains("is-hidden");
}

function isStageSelectVisible() {
  return stageScreen && !stageScreen.classList.contains("is-hidden");
}

function isShopVisible() {
  return shopScreen && !shopScreen.classList.contains("is-hidden");
}

function isRecruitVisible() {
  return recruitScreen && !recruitScreen.classList.contains("is-hidden");
}

function isFormationVisible() {
  return formationScreen && !formationScreen.classList.contains("is-hidden");
}

function showShop() {
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.remove("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);
  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-recruit", "in-formation");
  document.body.classList.add("in-shop");

  if (gameState) {
    gameState.running = false;
    gameState.message = "상점에서 장비를 확인하세요";
    updateButtons();
  }

  if (shopNotice) {
    shopNotice.textContent = "상점 품목을 선택하세요.";
  }
}

function showFormation() {
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.remove("is-hidden");
  hideRecruitDoorScene(true);
  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-shop", "in-recruit", "in-formation");
  document.body.classList.add("in-formation");

  if (gameState) {
    gameState.running = false;
    gameState.message = "편성 화면에서 덱을 구성하세요";
    updateButtons();
  }

  if (formationNotice) {
    formationNotice.textContent = "유닛을 터치하면 빈 슬롯에 배치할 수 있도록 확장할 예정입니다.";
  }
}

function showShopItemNotice(itemName) {
  if (!shopNotice) return;
  shopNotice.textContent = `${itemName} 선택됨`;
}


function showRecruit() {
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.remove("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-shop", "in-formation");
  document.body.classList.add("in-recruit");

  if (gameState) {
    gameState.running = false;
    gameState.message = "모집 화면에서 영웅을 확인하세요";
    updateButtons();
  }

  if (recruitNotice) {
    recruitNotice.textContent = "왕국 기사단에 합류할 영웅을 모집하세요.";
  }
}

function getRecruitThreeStarResult(count) {
  // 1차 연출 프로토타입용 임시 확률입니다.
  // 10회 모집은 테스트가 잘 보이도록 3성 연출 확률을 조금 높였습니다.
  const chance = count >= 10 ? 0.45 : 0.18;
  return Math.random() < chance;
}

function startRecruitDoorAnimation(count) {
  if (!recruitDoorScene) {
    if (recruitNotice) recruitNotice.textContent = `${count}회 모집 기능을 준비 중입니다.`;
    return;
  }

  recruitDoorState = {
    active: true,
    tapCount: 0,
    pullCount: count,
    hasThreeStar: getRecruitThreeStarResult(count),
    opened: false,
  };

  recruitDoorScene.classList.remove("is-hidden", "is-knock", "knock-one", "knock-two", "is-opening", "is-three-star", "is-normal");
  if (doorTapGuide) doorTapGuide.textContent = "문을 터치하세요";
  if (doorResultText) doorResultText.textContent = "";
  if (doorKnockText) doorKnockText.textContent = "쾅!";
  if (recruitNotice) recruitNotice.textContent = `${count}회 모집 연출 진행 중 · 문을 3번 터치하세요.`;
}

function hideRecruitDoorScene(silent = false) {
  if (!recruitDoorScene) return;
  recruitDoorScene.classList.add("is-hidden");
  recruitDoorScene.classList.remove("is-knock", "knock-one", "knock-two", "is-opening", "is-three-star", "is-normal");
  recruitDoorState.active = false;
  recruitDoorState.opened = false;
  recruitDoorState.tapCount = 0;
  if (!silent && recruitNotice) {
    recruitNotice.textContent = "왕국 기사단에 합류할 영웅을 모집하세요.";
  }
}

function playDoorKnockStep() {
  if (!recruitDoorScene) return;

  recruitDoorScene.classList.remove("is-knock");
  void recruitDoorScene.offsetWidth;
  recruitDoorScene.classList.add("is-knock");

  if (doorKnockText) {
    doorKnockText.textContent = recruitDoorState.tapCount === 1 ? "쾅!" : "쾅쾅!";
  }

  if (doorTapGuide) {
    const remain = 3 - recruitDoorState.tapCount;
    doorTapGuide.textContent = remain > 0 ? `문이 흔들립니다 · ${remain}번 더 터치` : "문이 열립니다!";
  }

  clearTimeout(playDoorKnockStep.timer);
  playDoorKnockStep.timer = setTimeout(() => {
    recruitDoorScene.classList.remove("is-knock");
  }, 420);
}

function openRecruitDoor() {
  if (!recruitDoorScene) return;

  recruitDoorState.opened = true;
  recruitDoorScene.classList.remove("is-knock", "knock-one", "knock-two");
  recruitDoorScene.classList.add("is-opening", recruitDoorState.hasThreeStar ? "is-three-star" : "is-normal");

  if (doorTapGuide) {
    doorTapGuide.textContent = recruitDoorState.hasThreeStar ? "황금빛이 쏟아집니다!" : "보랏빛이 흘러나옵니다!";
  }

  if (doorResultText) {
    doorResultText.textContent = recruitDoorState.hasThreeStar
      ? "★3 픽업 영웅 등장!"
      : "영웅 모집 완료";
  }

  if (recruitNotice) {
    recruitNotice.textContent = recruitDoorState.hasThreeStar
      ? `${recruitDoorState.pullCount}회 모집 결과 · 3성 영웅 획득!`
      : `${recruitDoorState.pullCount}회 모집 결과 · 다음 기회를 노려보세요.`;
  }
}

function handleRecruitDoorTap(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (!recruitDoorScene || recruitDoorScene.classList.contains("is-hidden")) return;

  if (recruitDoorState.opened) {
    return;
  }

  recruitDoorState.tapCount += 1;

  if (recruitDoorState.tapCount === 1) {
    recruitDoorScene.classList.add("knock-one");
    playDoorKnockStep();
    return;
  }

  if (recruitDoorState.tapCount === 2) {
    recruitDoorScene.classList.remove("knock-one");
    recruitDoorScene.classList.add("knock-two");
    playDoorKnockStep();
    return;
  }

  openRecruitDoor();
}

function showRecruitPullNotice(count) {
  startRecruitDoorAnimation(count);
}

function showLobby() {
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.remove("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);
  document.body.classList.remove("game-started", "in-stage-select", "in-shop", "in-recruit", "in-formation");
  document.body.classList.add("in-lobby");
  if (gameState) {
    gameState.running = false;
    gameState.message = "로비에서 전투를 준비하세요";
    updateButtons();
  }
  if (lobbyNotice) {
    lobbyNotice.textContent = "상점에서 장비를 확인하거나 전투 버튼으로 Chapter 1을 선택할 수 있습니다.";
  }
  if (lobbyMenuNotice) {
    lobbyMenuNotice.textContent = "";
    lobbyMenuNotice.classList.remove("is-show");
  }
}

function showTitle() {
  resetGame();
  if (titleScreen) titleScreen.classList.remove("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);
  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-shop", "in-recruit", "in-formation");
  if (lobbyNotice) {
    lobbyNotice.textContent = "상점에서 장비를 확인하거나 전투 버튼으로 Chapter 1을 선택할 수 있습니다.";
  }
}


function showLobbyMenuNotice(label) {
  if (!lobbyMenuNotice) return;
  const noticeText = `${label} 기능은 다음 단계에서 추가 예정입니다.`;
  lobbyMenuNotice.textContent = noticeText;
  lobbyMenuNotice.classList.add("is-show");
  clearTimeout(showLobbyMenuNotice.timer);
  showLobbyMenuNotice.timer = setTimeout(() => {
    if (!lobbyMenuNotice) return;
    lobbyMenuNotice.classList.remove("is-show");
  }, 1600);
}

function showFormationNotice() {
  showFormation();
}

function showMissionNotice() {
  showLobbyMenuNotice("미션");
}

function showShopNotice() {
  showShop();
}

function showRecruitNotice() {
  showRecruit();
}

function setFormationCategoryTab(tabName) {
  formationCategoryTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.formationTab === tabName);
  });

  if (!formationNotice) return;
  if (tabName === "deck") formationNotice.textContent = "덱 탭입니다. 빈 슬롯에 유닛을 배치하는 구조로 확장할 예정입니다.";
  else if (tabName === "unit") formationNotice.textContent = "유닛 탭입니다. 보유 유닛 목록과 정렬 기능을 여기에 연결할 수 있습니다.";
  else formationNotice.textContent = "타워 탭입니다. 추후 방어 타워 편성 UI를 연결할 수 있습니다.";
}

function setFormationDeckPage(page) {
  formationDeckTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.deckPage === String(page));
  });
  if (formationNotice) {
    formationNotice.textContent = `덱 ${page} 페이지입니다. 현재는 UI 시안 단계라 슬롯이 비워져 있습니다.`;
  }
}

function handleFormationSlotClick(index) {
  formationSlots.forEach((slot) => slot.classList.remove("is-selected"));
  const target = formationSlots[index];
  if (target) target.classList.add("is-selected");
  if (formationNotice) {
    formationNotice.textContent = `${index + 1}번 슬롯이 선택되었습니다. 이후 유닛 배치 기능을 연결할 수 있습니다.`;
  }
}

function startGame(stageNumber = selectedStage) {
  selectedStage = Number(stageNumber) || 1;
  if (!isStageUnlocked(selectedStage)) {
    showStageSelect();
    showChapterStages();
    showStageLockedNotice(selectedStage);
    return;
  }

  resetGame();
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);
  document.body.classList.add("game-started");
  document.body.classList.remove("in-lobby", "in-stage-select", "in-shop", "in-recruit", "in-formation");
  gameState.running = true;
  gameState.message = `Stage ${selectedStage} - Wave ${gameState.wave} 시작! 영웅을 보조하며 병사를 소환하세요`;
  gameState.messageTimer = 1.2;
  updateHud();
  updateButtons();
}

function restartGame() {
  startGame(selectedStage);
}

function updateHud() {
  waveText.textContent = `${gameState.wave} / ${gameState.maxWave}`;
  goldText.textContent = Math.floor(gameState.gold);
  if (unitCountText) unitCountText.textContent = `${getActiveUnitCount()} / ${MAX_SUMMONED_UNITS}`;
  playerHpText.textContent = Math.max(0, Math.ceil(gameState.playerBaseHp));
  enemyHpText.textContent = Math.max(0, Math.ceil(gameState.enemyBaseHp));
}

function getActiveUnitCount() {
  if (!gameState || !Array.isArray(gameState.units)) return 0;
  return gameState.units.filter((unit) => unit.hp > 0).length;
}

function hasSummonSlot() {
  return getActiveUnitCount() < MAX_SUMMONED_UNITS;
}

function showSummonLimitMessage() {
  if (!gameState) return;
  gameState.message = `소환 제한! 병사는 최대 ${MAX_SUMMONED_UNITS}명까지 유지됩니다.`;
  gameState.messageTimer = 1.25;
}

function updateButtons() {
  const disabled = !gameState.running || gameState.gameOver || gameState.clear;
  const activeUnits = getActiveUnitCount();
  const unitLimitReached = activeUnits >= MAX_SUMMONED_UNITS;
  const slotText = `${activeUnits}/${MAX_SUMMONED_UNITS}`;

  if (summonGuardBtn) {
    summonGuardBtn.textContent = unitLimitReached ? `방패병 소환 제한 ${slotText}` : `방패병 소환 50G · ${slotText}`;
    summonGuardBtn.disabled = disabled || unitLimitReached || gameState.gold < 50;
    summonGuardBtn.title = unitLimitReached ? "아군 병사가 사망하면 다시 소환할 수 있습니다." : "방패병을 소환합니다.";
  }

  if (summonArcherBtn) {
    summonArcherBtn.textContent = unitLimitReached ? `궁수 소환 제한 ${slotText}` : `궁수 소환 75G · ${slotText}`;
    summonArcherBtn.disabled = disabled || unitLimitReached || gameState.gold < 75;
    summonArcherBtn.title = unitLimitReached ? "아군 병사가 사망하면 다시 소환할 수 있습니다." : "궁수를 소환합니다.";
  }

  if (summonMageBtn) {
    summonMageBtn.textContent = unitLimitReached ? `마법사 소환 제한 ${slotText}` : `마법사 소환 100G · ${slotText}`;
    summonMageBtn.disabled = disabled || unitLimitReached || gameState.gold < 100;
    summonMageBtn.title = unitLimitReached ? "아군 병사가 사망하면 다시 소환할 수 있습니다." : "마법사를 소환합니다.";
  }

  if (summonSaintessBtn) {
    summonSaintessBtn.textContent = unitLimitReached ? `성녀 소환 제한 ${slotText}` : `성녀 소환 120G · ${slotText}`;
    summonSaintessBtn.disabled = disabled || unitLimitReached || gameState.gold < 120;
    summonSaintessBtn.title = unitLimitReached ? "아군 병사가 사망하면 다시 소환할 수 있습니다." : "주변 아군을 회복하는 성녀를 소환합니다.";
  }

  if (skillBtn) {
    const hero = gameState.hero;
    const heroReady = hero && !hero.dead && hero.hp > 0 && hero.cooldown <= 0;
    skillBtn.textContent = hero && hero.dead
      ? `영웅 부활 ${Math.ceil(hero.respawnTimer)}초`
      : "영웅 공격 Space";
    skillBtn.disabled = disabled || !heroReady;
    skillBtn.title = "메인 영웅이 가장 가까운 적에게 화살을 발사합니다.";
  }
  if (startBtn) {
    startBtn.textContent = gameState.running ? "진행 중" : "게임 시작";
    startBtn.disabled = gameState.running && !gameState.gameOver && !gameState.clear;
  }
  if (stageSelectBtn) stageSelectBtn.disabled = false;
}

function spendGold(amount) {
  if (!gameState.running || gameState.gold < amount || gameState.gameOver || gameState.clear) return false;
  gameState.gold -= amount;
  updateHud();
  updateButtons();
  return true;
}

function summonGuard() {
  if (!hasSummonSlot()) {
    showSummonLimitMessage();
    updateHud();
    updateButtons();
    return;
  }
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
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.46,
    attackImpactPending: false,
    attackTarget: null,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.85,
    deathRewarded: false,
  });
}

function summonArcher() {
  if (!hasSummonSlot()) {
    showSummonLimitMessage();
    updateHud();
    updateButtons();
    return;
  }
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
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.58,
    pendingArrowShot: false,
    shotTarget: null,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.85,
    deathRewarded: false,
  });
}

function summonMage() {
  if (!hasSummonSlot()) {
    showSummonLimitMessage();
    updateHud();
    updateButtons();
    return;
  }
  if (!spendGold(100)) return;
  gameState.units.push({
    type: "mage",
    name: "마법사",
    x: PLAYER_BASE_X + 58,
    y: GROUND_Y,
    w: 32,
    h: 52,
    hp: 42,
    maxHp: 42,
    speed: 38,
    damage: 16,
    range: 155,
    cooldown: 0,
    attackSpeed: 1.18,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.72,
    pendingMageShot: false,
    shotTarget: null,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.85,
    deathRewarded: false,
  });
}

function summonSaintess() {
  if (!hasSummonSlot()) {
    showSummonLimitMessage();
    updateHud();
    updateButtons();
    return;
  }
  if (!spendGold(120)) return;
  gameState.units.push({
    type: "saintess",
    name: "성녀",
    x: PLAYER_BASE_X + 56,
    y: GROUND_Y,
    w: 32,
    h: 52,
    hp: 54,
    maxHp: 54,
    speed: 36,
    damage: 0,
    range: 0,
    cooldown: 0,
    attackSpeed: 1.2,
    healRange: 130,
    healAmount: 8,
    healInterval: 1.2,
    healCooldown: 0,
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: 0.72,
    pendingHealPulse: false,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: 0.85,
    deathRewarded: false,
  });
}


function isCombatAlive(entity) {
  return Boolean(entity && !entity.dead && entity.hp > 0);
}

function startUnitDeath(unit) {
  if (!unit || unit.dead) return;
  unit.dead = true;
  unit.hp = 0;
  unit.moving = false;
  unit.cooldown = 0;
  unit.attackAnimTimer = 0;
  unit.pendingArrowShot = false;
  unit.pendingMageShot = false;
  unit.pendingHealPulse = false;
  unit.attackImpactPending = false;
  unit.shotTarget = null;
  unit.attackTarget = null;
  unit.deathAnimDuration = unit.deathAnimDuration || 0.85;
  unit.deathAnimTimer = unit.deathAnimDuration;
}

function startEnemyDeath(enemy) {
  if (!enemy || enemy.dead) return;
  enemy.dead = true;
  enemy.hp = 0;
  enemy.moving = false;
  enemy.cooldown = 0;
  enemy.attackAnimTimer = 0;
  enemy.deathAnimDuration = enemy.deathAnimDuration || 0.55;
  enemy.deathAnimTimer = enemy.deathAnimDuration;

  if (!enemy.deathRewarded) {
    gameState.gold += 18;
    enemy.deathRewarded = true;
  }
}

function castHolySlash() {
  heroAttack();
}

function spawnEnemy() {
  const wave = gameState.wave;
  const isStageOne = Number(gameState.stage) === 1;
  const isBrute = !isStageOne && wave >= 2 && Math.random() < 0.32;
  const isFast = !isStageOne && wave >= 3 && Math.random() < 0.25;

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
      animTime: 0,
      moving: false,
      attackAnimTimer: 0,
      attackAnimDuration: 0.34,
      dead: false,
      deathAnimTimer: 0,
      deathAnimDuration: 0.55,
      deathRewarded: false,
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
    animTime: 0,
    moving: false,
    attackAnimTimer: 0,
    attackAnimDuration: isStageOne ? 0.48 : 0.34,
    dead: false,
    deathAnimTimer: 0,
    deathAnimDuration: isStageOne ? 0.8 : 0.55,
    deathRewarded: false,
  });
}

function findNearestEnemy(fromX, range) {
  let target = null;
  let bestDistance = Infinity;
  for (const enemy of gameState.enemies) {
    if (!isCombatAlive(enemy)) continue;
    const distance = enemy.x - fromX;
    if (distance >= -20 && distance <= range && distance < bestDistance) {
      target = enemy;
      bestDistance = distance;
    }
  }
  return target;
}

function findNearestAlly(fromX, range) {
  const candidates = gameState.units.filter(isCombatAlive);
  if (gameState.hero && !gameState.hero.dead && gameState.hero.hp > 0) {
    candidates.push(gameState.hero);
  }

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
      gameState.message = `메인 영웅 쓰러짐 · ${HERO_RESPAWN_SECONDS}초 후 부활`;
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

function updateWave(dt) {
  if (gameState.waveBreakTimer > 0) {
    gameState.waveBreakTimer -= dt;
    const remain = Math.ceil(gameState.waveBreakTimer);
    gameState.message = `다음 웨이브까지 ${remain}`;
    if (gameState.waveBreakTimer <= 0) {
      gameState.wave += 1;
      gameState.enemySpawnTimer = 0;
      gameState.spawnedInWave = 0;
      gameState.enemiesToSpawn = gameState.baseEnemiesToSpawn + gameState.wave * 3;
      gameState.enemyBaseHp = Math.min(gameState.enemyBaseMaxHp, gameState.enemyBaseHp + 18);
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
  if (waveFinished && gameState.wave < gameState.maxWave) {
    gameState.waveBreakTimer = 3;
    gameState.gold += 60;
  } else if (waveFinished && gameState.wave >= gameState.maxWave) {
    completeStage(`STAGE ${selectedStage} CLEAR! 모든 웨이브 방어 성공`);
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

function findSaintessHealTargets(unit) {
  const candidates = [];
  if (isCombatAlive(gameState.hero)) candidates.push(gameState.hero);

  for (const ally of gameState.units) {
    if (ally !== unit && isCombatAlive(ally)) candidates.push(ally);
  }

  return candidates
    .filter((ally) => ally.hp < ally.maxHp && Math.abs(ally.x - unit.x) <= unit.healRange)
    .sort((a, b) => Math.abs(a.x - unit.x) - Math.abs(b.x - unit.x));
}

function performSaintessHeal(unit) {
  const targets = findSaintessHealTargets(unit);
  if (!targets.length) {
    unit.pendingHealPulse = false;
    return;
  }

  for (const ally of targets) {
    ally.hp = Math.min(ally.maxHp, ally.hp + unit.healAmount);
    spawnHeal(ally.x, ally.y - 50);
  }

  unit.pendingHealPulse = false;
}

function updateUnits(dt) {
  for (const unit of gameState.units) {
    unit.animTime = (unit.animTime || 0) + dt;

    if (unit.hp <= 0 || unit.dead) {
      startUnitDeath(unit);
      unit.deathAnimTimer = Math.max(0, (unit.deathAnimTimer || 0) - dt);
      continue;
    }

    unit.cooldown = Math.max(0, unit.cooldown - dt);
    unit.moving = false;

    const previousAttackTimer = unit.attackAnimTimer || 0;
    unit.attackAnimDuration = unit.attackAnimDuration || (unit.type === "guard" ? 0.46 : (unit.type === "mage" || unit.type === "saintess") ? 0.72 : 0.58);
    unit.attackAnimTimer = Math.max(0, previousAttackTimer - dt);

    const attackProgress = unit.attackAnimTimer > 0
      ? 1 - unit.attackAnimTimer / unit.attackAnimDuration
      : 1;

    // 쫄병은 피격 모션이 없습니다. 공격 / 걷기 / 사망 모션만 사용합니다.
    // 궁수는 활시위를 놓는 타이밍에 화살 발사
    if (unit.type === "archer" && unit.pendingArrowShot && (attackProgress >= 0.62 || unit.attackAnimTimer <= 0)) {
      fireArcherArrow(unit);
    }

    if (unit.type === "mage" && unit.pendingMageShot && (attackProgress >= 0.66 || unit.attackAnimTimer <= 0)) {
      fireMageBolt(unit);
    }

    if (unit.type === "saintess") {
      unit.healCooldown = Math.max(0, (unit.healCooldown || 0) - dt);

      if (unit.pendingHealPulse && (attackProgress >= 0.62 || unit.attackAnimTimer <= 0)) {
        performSaintessHeal(unit);
      }

      if (unit.attackAnimTimer > 0) {
        continue;
      }

      const healTargets = findSaintessHealTargets(unit);
      if (healTargets.length && unit.healCooldown <= 0) {
        unit.healCooldown = unit.healInterval || 1.2;
        unit.attackAnimDuration = 0.72;
        unit.attackAnimTimer = unit.attackAnimDuration;
        unit.pendingHealPulse = true;
        continue;
      }

      unit.x += unit.speed * dt;
      unit.moving = true;

      if (unit.x > ENEMY_BASE_X - 35) {
        gameState.enemyBaseHp -= 4 * dt;
        unit.x = ENEMY_BASE_X - 35;
        unit.moving = false;
      }
      continue;
    }

    // 방패병은 검이 앞으로 나가는 프레임에 근접 피해 적용
    if (unit.type === "guard" && unit.attackImpactPending && (attackProgress >= 0.48 || unit.attackAnimTimer <= 0)) {
      const attackTarget = isCombatAlive(unit.attackTarget)
        ? unit.attackTarget
        : findNearestEnemy(unit.x, unit.range + 12);

      if (attackTarget) {
        attackTarget.hp -= unit.damage;
      }

      unit.attackImpactPending = false;
      unit.attackTarget = null;
    }

    const target = findNearestEnemy(unit.x, unit.range);

    if (target) {
      if (unit.cooldown <= 0) {
        unit.cooldown = unit.attackSpeed;
        if (unit.type === "archer") {
          unit.attackAnimDuration = 0.58;
          unit.attackAnimTimer = unit.attackAnimDuration;
          unit.pendingArrowShot = true;
          unit.shotTarget = target;
        } else if (unit.type === "mage") {
          unit.attackAnimDuration = 0.72;
          unit.attackAnimTimer = unit.attackAnimDuration;
          unit.pendingMageShot = true;
          unit.shotTarget = target;
        } else if (unit.type === "guard") {
          unit.attackAnimDuration = 0.46;
          unit.attackAnimTimer = unit.attackAnimDuration;
          unit.attackImpactPending = true;
          unit.attackTarget = target;
        } else {
          target.hp -= unit.damage;
        }
      }
    } else {
      unit.x += unit.speed * dt;
      unit.moving = true;
    }

    if (unit.x > ENEMY_BASE_X - 35) {
      gameState.enemyBaseHp -= unit.type === "guard" ? 18 * dt : unit.type === "mage" ? 10 * dt : 8 * dt;
      unit.x = ENEMY_BASE_X - 35;
      unit.moving = false;
    }
  }
}

function updateEnemies(dt) {
  for (const enemy of gameState.enemies) {
    enemy.animTime = (enemy.animTime || 0) + dt;

    if (enemy.hp <= 0 || enemy.dead) {
      startEnemyDeath(enemy);
      enemy.deathAnimTimer = Math.max(0, (enemy.deathAnimTimer || 0) - dt);
      continue;
    }

    enemy.cooldown = Math.max(0, enemy.cooldown - dt);
    enemy.attackAnimTimer = Math.max(0, (enemy.attackAnimTimer || 0) - dt);
    enemy.moving = false;

    const target = findNearestAlly(enemy.x, enemy.range);

    if (target) {
      if (enemy.cooldown <= 0) {
        enemy.cooldown = enemy.attackSpeed;
        enemy.attackAnimTimer = enemy.attackAnimDuration || 0.34;
        target.hp -= enemy.damage;

        // 피격 시스템은 메인 영웅에게만 적용합니다.
        if (target.type === "hero") {
          spawnHit(target.x, target.y - 38, "#ff9090");
        }
      }
    } else {
      enemy.x -= enemy.speed * dt;
      enemy.moving = true;
    }

    if (enemy.x < PLAYER_BASE_X + 28) {
      gameState.playerBaseHp -= enemy.damage * dt * 0.8;
      enemy.x = PLAYER_BASE_X + 28;
      enemy.moving = false;
    }
  }
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

function cleanupDeadEntities() {
  for (const enemy of gameState.enemies) {
    if (enemy.hp <= 0) startEnemyDeath(enemy);
  }

  for (const unit of gameState.units) {
    if (unit.hp <= 0 || unit.x >= ENEMY_BASE_X - 15) startUnitDeath(unit);
  }

  // 소환 제한 슬롯은 살아있는 병사 수를 기준으로 계산합니다.
  // 병사가 죽는 순간 hp가 0이 되므로, 사망 모션이 남아 있어도 빈 자리는 즉시 생깁니다.
  gameState.enemies = gameState.enemies.filter((enemy) => !enemy.dead || enemy.deathAnimTimer > 0);
  gameState.units = gameState.units.filter((unit) => !unit.dead || unit.deathAnimTimer > 0);
}


function completeStage(message) {
  if (gameState.clear) return;
  gameState.clear = true;
  gameState.running = false;
  gameState.message = `${message} · 스테이지 선택 버튼으로 다음 지역 도전`;
  unlockStageProgress(selectedStage);
  updateButtons();
}

function checkEndConditions() {
  if (gameState.enemyBaseHp <= 0) {
    completeStage(`STAGE ${selectedStage} CLEAR! 적 기지 파괴`);
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
    gameState.gold += 12;
    gameState.goldTimer = 0;
  }

  updateWave(dt);
  updateHero(dt);
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
  const isStage1 = gameState && Number(gameState.stage) === 1;

  if (isStage1 && stage1ForestBgReady) {
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(stage1ForestBg, 0, 0, canvas.width, canvas.height);

    // 전투 라인을 살짝 보정해서 캐릭터가 배경에 묻히지 않도록 처리합니다.
    const laneGradient = ctx.createLinearGradient(0, GROUND_Y - 120, 0, canvas.height);
    laneGradient.addColorStop(0, "rgba(255, 255, 255, 0.00)");
    laneGradient.addColorStop(0.42, "rgba(255, 244, 179, 0.10)");
    laneGradient.addColorStop(0.72, "rgba(45, 90, 35, 0.12)");
    laneGradient.addColorStop(1, "rgba(0, 0, 0, 0.18)");
    ctx.fillStyle = laneGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    return;
  }

  drawFallbackBackground();
}

function drawFallbackBackground() {
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

function getBaseRenderConfig(isPlayer) {
  if (isPlayer) {
    return {
      image: playerCastleImage,
      ready: playerCastleReady,
      drawX: 8,
      drawY: GROUND_Y - 198,
      drawW: 188,
      drawH: 188,
      shadowX: 92,
      shadowY: GROUND_Y + 2,
      shadowW: 58,
      shadowH: 14,
      hpX: 96,
      hpY: GROUND_Y - 148,
      hpW: 98,
    };
  }

  return {
    image: enemyCastleImage,
    ready: enemyCastleReady,
    drawX: canvas.width - 208,
    drawY: GROUND_Y - 208,
    drawW: 198,
    drawH: 198,
    shadowX: canvas.width - 110,
    shadowY: GROUND_Y + 2,
    shadowW: 64,
    shadowH: 15,
    hpX: canvas.width - 109,
    hpY: GROUND_Y - 148,
    hpW: 104,
  };
}

function drawBase(x, isPlayer) {
  const config = getBaseRenderConfig(isPlayer);

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(config.shadowX, config.shadowY, config.shadowW, config.shadowH, 0, 0, Math.PI * 2);
  ctx.fill();

  if (config.ready) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(config.image, config.drawX, config.drawY, config.drawW, config.drawH);
    ctx.restore();
    return;
  }

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

function drawGuardSprite(unit) {
  if (!guardSpriteReady) return false;

  let anim = "idle";
  if (unit.dead || unit.hp <= 0) anim = "death";
  else if (unit.attackAnimTimer > 0) anim = "attack";
  else if (unit.moving) anim = "walk";

  const frameCount = GUARD_SPRITE.frames[anim] || 1;
  const fps = GUARD_SPRITE.fps[anim] || 8;
  let frame = Math.floor((unit.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = unit.attackAnimDuration || 0.46;
    const progress = 1 - unit.attackAnimTimer / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  } else if (anim === "death") {
    const duration = unit.deathAnimDuration || 0.85;
    const progress = 1 - Math.max(0, unit.deathAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const sx = frame * GUARD_SPRITE.frameW;
  const sy = GUARD_SPRITE.rows[anim] * GUARD_SPRITE.frameH;
  const dw = GUARD_SPRITE.drawW;
  const dh = GUARD_SPRITE.drawH;
  const baseOffset = GUARD_SPRITE.baseOffset || { x: 0, y: 0 };
  const frameOffset = (GUARD_SPRITE.offsets[anim] && GUARD_SPRITE.offsets[anim][frame]) || { x: 0, y: 0 };

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    guardSprite,
    sx,
    sy,
    GUARD_SPRITE.frameW,
    GUARD_SPRITE.frameH,
    -dw / 2 + baseOffset.x + frameOffset.x,
    -dh + 9 + baseOffset.y + frameOffset.y,
    dw,
    dh
  );

  return true;
}

function drawArcherSprite(unit) {
  if (!archerSpriteReady) return false;

  let anim = "idle";
  if (unit.dead || unit.hp <= 0) anim = "death";
  else if (unit.attackAnimTimer > 0) anim = "attack";
  else if (unit.moving) anim = "walk";

  const frameCount = ARCHER_SPRITE.frames[anim] || 1;
  const fps = ARCHER_SPRITE.fps[anim] || 8;
  let frame = Math.floor((unit.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = unit.attackAnimDuration || 0.58;
    const progress = 1 - unit.attackAnimTimer / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  } else if (anim === "death") {
    const duration = unit.deathAnimDuration || 0.85;
    const progress = 1 - Math.max(0, unit.deathAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const sx = frame * ARCHER_SPRITE.frameW;
  const sy = ARCHER_SPRITE.rows[anim] * ARCHER_SPRITE.frameH;
  const dw = ARCHER_SPRITE.drawW;
  const dh = ARCHER_SPRITE.drawH;

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    archerSprite,
    sx,
    sy,
    ARCHER_SPRITE.frameW,
    ARCHER_SPRITE.frameH,
    -dw / 2 + 2,
    -dh + 8,
    dw,
    dh
  );

  return true;
}

function drawMageSprite(unit) {
  if (!mageSpriteReady) return false;

  let anim = "idle";
  if (unit.dead || unit.hp <= 0) anim = "death";
  else if (unit.attackAnimTimer > 0) anim = "attack";
  else if (unit.moving) anim = "walk";

  const frameCount = MAGE_SPRITE.frames[anim] || 1;
  const fps = MAGE_SPRITE.fps[anim] || 8;
  let frame = Math.floor((unit.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = unit.attackAnimDuration || 0.72;
    const progress = 1 - unit.attackAnimTimer / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  } else if (anim === "death") {
    const duration = unit.deathAnimDuration || 0.85;
    const progress = 1 - Math.max(0, unit.deathAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const sx = frame * MAGE_SPRITE.frameW;
  const sy = MAGE_SPRITE.rows[anim] * MAGE_SPRITE.frameH;
  const dw = MAGE_SPRITE.drawW;
  const dh = MAGE_SPRITE.drawH;

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    mageSprite,
    sx,
    sy,
    MAGE_SPRITE.frameW,
    MAGE_SPRITE.frameH,
    -dw / 2 + 2,
    -dh + 8,
    dw,
    dh
  );

  return true;
}

function drawSaintessSprite(unit) {
  if (!saintessSpriteReady) return false;

  let anim = "idle";
  if (unit.dead || unit.hp <= 0) anim = "death";
  else if (unit.attackAnimTimer > 0) anim = "attack";
  else if (unit.moving) anim = "walk";

  const frameCount = SAINTESS_SPRITE.frames[anim] || 1;
  const fps = SAINTESS_SPRITE.fps[anim] || 8;
  let frame = Math.floor((unit.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = unit.attackAnimDuration || 0.72;
    const progress = 1 - unit.attackAnimTimer / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  } else if (anim === "death") {
    const duration = unit.deathAnimDuration || 0.85;
    const progress = 1 - Math.max(0, unit.deathAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const sx = frame * SAINTESS_SPRITE.frameW;
  const sy = SAINTESS_SPRITE.rows[anim] * SAINTESS_SPRITE.frameH;
  const dw = SAINTESS_SPRITE.drawW;
  const dh = SAINTESS_SPRITE.drawH;

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    saintessSprite,
    sx,
    sy,
    SAINTESS_SPRITE.frameW,
    SAINTESS_SPRITE.frameH,
    -dw / 2 + 2,
    -dh + 8,
    dw,
    dh
  );

  return true;
}

function drawUnit(unit) {
  ctx.save();
  ctx.translate(unit.x, unit.y);
  const isDying = unit.dead || unit.hp <= 0;
  const bob = isDying ? 0 : Math.sin((performance.now() + unit.x * 10) * 0.01) * 2;

  if (isDying) {
    const duration = unit.deathAnimDuration || 0.85;
    const progress = 1 - Math.max(0, unit.deathAnimTimer || 0) / duration;
    ctx.globalAlpha = Math.max(0.25, 1 - progress * 0.45);
  }

  // 그림자는 땅에 고정합니다. 그림자가 캐릭터와 같이 흔들리면 걷기 모션이 더 어색해 보입니다.
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 3, 22, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  if (!isDying && unit.type === "saintess" && unit.attackAnimTimer > 0) {
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = "#fff1a8";
    ctx.shadowColor = "rgba(255, 241, 168, 0.85)";
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, -28, 35, 20, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (unit.type === "guard") {
    const drewSprite = drawGuardSprite(unit);

    if (!drewSprite) {
      ctx.translate(0, bob);

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
    }
  } else if (unit.type === "archer") {
    const drewSprite = drawArcherSprite(unit);

    if (!drewSprite) {
      ctx.translate(0, bob);

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
  } else if (unit.type === "mage") {
    const drewSprite = drawMageSprite(unit);

    if (!drewSprite) {
      ctx.translate(0, bob);

      ctx.fillStyle = "#573aa8";
      ctx.fillRect(-13, -39, 26, 31);
      ctx.fillStyle = "#f04444";
      ctx.fillRect(-12, -56, 24, 18);
      ctx.strokeStyle = "#7b4a23";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(18, -14);
      ctx.lineTo(26, -58);
      ctx.stroke();
      ctx.fillStyle = "#68eaff";
      ctx.beginPath();
      ctx.arc(27, -61, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (unit.type === "saintess") {
    const drewSprite = drawSaintessSprite(unit);

    if (!drewSprite) {
      ctx.translate(0, bob);

      ctx.fillStyle = "#fff1c7";
      ctx.fillRect(-13, -39, 26, 31);
      ctx.fillStyle = "#f6c2d9";
      ctx.fillRect(-10, -56, 20, 18);
      ctx.strokeStyle = "#c99a35";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(18, -14);
      ctx.lineTo(26, -58);
      ctx.stroke();
      ctx.fillStyle = "#8ff7ff";
      ctx.beginPath();
      ctx.arc(27, -61, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  if (!isDying) drawHealthBar(unit.x, unit.y - 68, 42, unit.hp, unit.maxHp, "#68d8ff");
}

function canDrawStage1EnemySprite(enemy) {
  return stage1EnemySpriteReady
    && Number(gameState.stage) === 1
    && enemy.type === "normal";
}

function drawStage1EnemySprite(enemy) {
  if (!canDrawStage1EnemySprite(enemy)) return false;

  let anim = "walk";
  if (enemy.dead || enemy.hp <= 0) anim = "death";
  else if (enemy.attackAnimTimer > 0) anim = "attack";

  const frameCount = STAGE1_ENEMY_SPRITE.frames[anim] || 1;
  const fps = STAGE1_ENEMY_SPRITE.fps[anim] || 8;
  let frame = Math.floor((enemy.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = enemy.attackAnimDuration || 0.48;
    const progress = 1 - Math.max(0, enemy.attackAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  } else if (anim === "death") {
    const duration = enemy.deathAnimDuration || 0.8;
    const progress = 1 - Math.max(0, enemy.deathAnimTimer || 0) / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const frameW = stage1EnemySprite.naturalWidth / STAGE1_ENEMY_SPRITE.columns;
  const frameH = stage1EnemySprite.naturalHeight / STAGE1_ENEMY_SPRITE.rowCount;
  const sx = frame * frameW;
  const sy = STAGE1_ENEMY_SPRITE.rows[anim] * frameH;
  const dw = STAGE1_ENEMY_SPRITE.drawW;
  const dh = STAGE1_ENEMY_SPRITE.drawH;
  const frameOffset = (STAGE1_ENEMY_SPRITE.offsets[anim] && STAGE1_ENEMY_SPRITE.offsets[anim][frame]) || { x: 0, y: 0 };

  ctx.save();
  ctx.translate(enemy.x, enemy.y);

  if (anim === "death") {
    const duration = enemy.deathAnimDuration || 0.8;
    const progress = 1 - Math.max(0, enemy.deathAnimTimer || 0) / duration;
    ctx.globalAlpha = Math.max(0.25, 1 - progress * 0.35);
  }

  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, 4, anim === "death" ? 34 : 28, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(-1, 1);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    stage1EnemySprite,
    sx,
    sy,
    frameW,
    frameH,
    -dw / 2 + frameOffset.x,
    -dh + 8 + frameOffset.y,
    dw,
    dh
  );

  ctx.restore();
  return true;
}

function drawEnemy(enemy) {
  const usedStage1Sprite = drawStage1EnemySprite(enemy);
  if (usedStage1Sprite) {
    const isDying = enemy.dead || enemy.hp <= 0;
    if (!isDying) {
      drawHealthBar(
        enemy.x,
        enemy.y - STAGE1_ENEMY_SPRITE.healthBarOffsetY,
        46,
        enemy.hp,
        enemy.maxHp,
        "#ff6868"
      );
    }
    return;
  }

  ctx.save();
  ctx.translate(enemy.x, enemy.y);

  const isDying = enemy.dead || enemy.hp <= 0;
  const duration = enemy.deathAnimDuration || 0.55;
  const deathProgress = isDying ? 1 - Math.max(0, enemy.deathAnimTimer || 0) / duration : 0;
  const bob = isDying ? 0 : Math.sin((performance.now() + enemy.x * 11) * 0.012) * 2;

  if (isDying) {
    ctx.globalAlpha = Math.max(0.1, 1 - deathProgress * 0.85);
    ctx.translate(0, deathProgress * 20);
    ctx.scale(1, Math.max(0.25, 1 - deathProgress * 0.65));
  } else {
    ctx.translate(0, bob);
  }

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
  if (!isDying) drawHealthBar(enemy.x, enemy.y - enemy.h - 18, 44, enemy.hp, enemy.maxHp, "#ff6868");
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

  const playerBaseUi = getBaseRenderConfig(true);
  const enemyBaseUi = getBaseRenderConfig(false);
  drawHealthBar(playerBaseUi.hpX, playerBaseUi.hpY, playerBaseUi.hpW, gameState.playerBaseHp, 100, "#79ff7a");
  drawHealthBar(enemyBaseUi.hpX, enemyBaseUi.hpY, enemyBaseUi.hpW, gameState.enemyBaseHp, gameState.enemyBaseMaxHp, "#ff6868");

  const drawList = [
    ...(gameState.hero && !gameState.hero.dead && gameState.hero.hp > 0 ? [gameState.hero] : []),
    ...gameState.units,
    ...gameState.enemies,
  ].sort((a, b) => a.y - b.y || a.x - b.x);

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
  const playableKeys = ["Space", "ArrowLeft", "ArrowRight"];
  if (playableKeys.includes(event.code)) event.preventDefault();

  if (isTitleVisible()) {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      showLobby();
    }
    return;
  }

  if (isLobbyVisible()) {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      showStageSelect();
    }
    if (event.code === "KeyS") showShopNotice();
    if (event.code === "KeyF") showFormationNotice();
    if (event.code === "KeyM") showMissionNotice();
    if (event.code === "Escape") showTitle();
    return;
  }

  if (isStageSelectVisible()) {
    if (event.code === "Escape") showLobby();
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      if (stagePanel && stagePanel.classList.contains("is-hidden")) showChapterStages();
      else openStage(playerProgress.unlockedStage);
    }
    if (event.code === "Digit1") openStage(1);
    if (event.code === "Digit2") openStage(2);
    if (event.code === "Digit3") openStage(3);
    return;
  }

  if (isShopVisible()) {
    if (event.code === "Escape") showLobby();
    return;
  }

  if (isFormationVisible()) {
    if (event.code === "Escape") showLobby();
    if (event.code === "Digit1") setFormationDeckPage(1);
    if (event.code === "Digit2") setFormationDeckPage(2);
    return;
  }

  if (isRecruitVisible()) {
    if (event.code === "Escape") {
      if (recruitDoorScene && !recruitDoorScene.classList.contains("is-hidden")) hideRecruitDoorScene();
      else showLobby();
    }
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      if (recruitDoorScene && !recruitDoorScene.classList.contains("is-hidden")) handleRecruitDoorTap(event);
      else startRecruitDoorAnimation(1);
    }
    return;
  }

  keys[event.code] = true;

  if (event.code === "Space") {
    event.preventDefault();
    heroAttack();
  }
  if (event.code === "Digit1") {
    event.preventDefault();
    summonGuard();
  }
  if (event.code === "Digit2") {
    event.preventDefault();
    summonArcher();
  }
  if (event.code === "Digit3") {
    event.preventDefault();
    summonMage();
  }
  if (event.code === "Digit4") {
    event.preventDefault();
    summonSaintess();
  }
});

window.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

startBtn.addEventListener("click", () => startGame(selectedStage));
titleStartBtn.addEventListener("click", showLobby);
if (lobbyBattleBtn) lobbyBattleBtn.addEventListener("click", showStageSelect);
if (lobbyShopBtn) lobbyShopBtn.addEventListener("click", showShop);
if (lobbyFormationBtn) lobbyFormationBtn.addEventListener("click", showFormation);
if (lobbyRecruitBtn) lobbyRecruitBtn.addEventListener("click", showRecruit);
if (lobbyMissionBtn) lobbyMissionBtn.addEventListener("click", showMissionNotice);
if (formationBackBtn) formationBackBtn.addEventListener("click", showLobby);
if (formationCloseBtn) formationCloseBtn.addEventListener("click", showLobby);
formationCategoryTabs.forEach((tab) => {
  tab.addEventListener("click", () => setFormationCategoryTab(tab.dataset.formationTab || "deck"));
});
formationDeckTabs.forEach((tab) => {
  tab.addEventListener("click", () => setFormationDeckPage(tab.dataset.deckPage || "1"));
});
formationSlots.forEach((slot, index) => {
  slot.addEventListener("click", () => handleFormationSlotClick(index));
});
if (recruitBackBtn) recruitBackBtn.addEventListener("click", showLobby);
if (recruitCloseBtn) recruitCloseBtn.addEventListener("click", showLobby);
if (recruitPullOneBtn) recruitPullOneBtn.addEventListener("click", () => startRecruitDoorAnimation(1));
if (recruitPullTenBtn) recruitPullTenBtn.addEventListener("click", () => startRecruitDoorAnimation(10));
if (recruitDoorFrame) recruitDoorFrame.addEventListener("pointerdown", handleRecruitDoorTap);
if (recruitDoorCloseBtn) recruitDoorCloseBtn.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  event.stopPropagation();
  hideRecruitDoorScene();
});
if (lobbyExitBtn) lobbyExitBtn.addEventListener("click", showTitle);
if (shopBackBtn) shopBackBtn.addEventListener("click", showLobby);
if (shopCloseBtn) shopCloseBtn.addEventListener("click", showLobby);
shopCards.forEach((card) => {
  card.addEventListener("click", () => showShopItemNotice(card.dataset.item || "아이템"));
});
if (stageBackBtn) stageBackBtn.addEventListener("click", showLobby);
if (chapter1Btn) chapter1Btn.addEventListener("click", showChapterStages);
if (chapterBackBtn) chapterBackBtn.addEventListener("click", showStageSelect);
stageCards.forEach((card) => {
  card.addEventListener("click", () => openStage(Number(card.dataset.stage)));
});
restartBtn.addEventListener("click", restartGame);
if (stageSelectBtn) stageSelectBtn.addEventListener("click", showStageSelect);
summonGuardBtn.addEventListener("click", summonGuard);
summonArcherBtn.addEventListener("click", summonArcher);
if (summonMageBtn) summonMageBtn.addEventListener("click", summonMage);
if (summonSaintessBtn) summonSaintessBtn.addEventListener("click", summonSaintess);
if (skillBtn) skillBtn.addEventListener("click", castHolySlash);
// 전투 개편: 캔버스 터치 직접 공격은 제거했습니다.

resetGame();
