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

const ASSET_PATHS = {
  archerSprite: "assets/animations/archer/archer_spritesheet_v2.png",
  guardSprite: "assets/animations/guard/guard_spritesheet_v2.png",
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
  [ASSET_PATHS.archerSprite, "archer_spritesheet_v2.png", "pixeldefense_runtime_clean/archer_spritesheet_v2.png"],
  (ready) => { archerSpriteReady = ready; },
  "궁수 스프라이트"
);

const guardSprite = new Image();
let guardSpriteReady = false;
loadGameImage(
  guardSprite,
  [ASSET_PATHS.guardSprite, "guard_spritesheet_v2.png", "pixeldefense_runtime_clean/guard_spritesheet_v2.png"],
  (ready) => { guardSpriteReady = ready; },
  "방패병 SD 기사 스프라이트"
);

const stage1ForestBg = new Image();
let stage1ForestBgReady = false;
loadGameImage(
  stage1ForestBg,
  [ASSET_PATHS.stage1ForestBg, "stage1_forest_bg_v2.png", "pixeldefense_runtime_clean/stage1_forest_bg_v2.png"],
  (ready) => { stage1ForestBgReady = ready; },
  "Stage 1 숲 배경"
);

const playerCastleImage = new Image();
let playerCastleReady = false;
loadGameImage(
  playerCastleImage,
  [ASSET_PATHS.playerCastle, "중세_판타지_성_탑_3d_모델.png"],
  (ready) => { playerCastleReady = ready; },
  "플레이어 성"
);

const enemyCastleImage = new Image();
let enemyCastleReady = false;
loadGameImage(
  enemyCastleImage,
  [ASSET_PATHS.enemyCastle, "원시_부족_풍의_나무_감시탑.png"],
  (ready) => { enemyCastleReady = ready; },
  "적국의 성"
);

const GUARD_SPRITE = {
  // SD 기사형 방패병 전용 스프라이트 시트입니다.
  // 6열 x 5행: idle / walk / attack / hurt / death 순서입니다.
  frameW: 229,
  frameH: 229,
  drawW: 88,
  drawH: 88,
  fps: { idle: 5, walk: 8, attack: 11, hurt: 7, death: 6 },
  rows: { idle: 0, walk: 1, attack: 2, hurt: 3, death: 4 },
  frames: { idle: 6, walk: 6, attack: 6, hurt: 4, death: 6 },
};

const ARCHER_SPRITE = {
  // 6열 x 5행으로 다시 정렬한 궁수 전용 스프라이트 시트입니다.
  // 각 프레임의 발 위치를 같은 기준선에 맞춰 걷기/공격 중 흔들림을 줄였습니다.
  frameW: 229,
  frameH: 229,
  drawW: 90,
  drawH: 90,
  fps: { idle: 5, walk: 8, attack: 10, hurt: 7 },
  rows: { idle: 0, walk: 1, attack: 2, hurt: 3, death: 4 },
  frames: { idle: 6, walk: 6, attack: 6, hurt: 6, death: 6 },
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
    particles: [],
    projectiles: [],
    units: [],
    enemies: [],
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
  gameState.message = `Stage ${selectedStage} - Wave ${gameState.wave} 시작! 병사를 소환하세요`;
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

  if (skillBtn) skillBtn.disabled = true;
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
    hurtAnimTimer: 0,
    lastHp: 90,
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
    hurtAnimTimer: 0,
    lastHp: 48,
  });
}

function castHolySlash() {
  // 전투 개편: 플레이어 직접 스킬은 제거했습니다.
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
  const candidates = [...gameState.units];
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
  // 전투 개편: 플레이어 직접 공격은 제거했습니다.
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
  // 전투 개편: 직접 조작 메인 유닛을 사용하지 않습니다.
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
  const shotTarget = unit.shotTarget && unit.shotTarget.hp > 0
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

function updateUnits(dt) {
  for (const unit of gameState.units) {
    unit.cooldown = Math.max(0, unit.cooldown - dt);

    if (unit.type === "archer" || unit.type === "guard") {
      unit.animTime = (unit.animTime || 0) + dt;
      unit.moving = false;

      const previousAttackTimer = unit.attackAnimTimer || 0;
      unit.attackAnimDuration = unit.attackAnimDuration || (unit.type === "guard" ? 0.46 : 0.58);
      unit.attackAnimTimer = Math.max(0, previousAttackTimer - dt);
      unit.hurtAnimTimer = Math.max(0, (unit.hurtAnimTimer || 0) - dt);

      if (typeof unit.lastHp === "number" && unit.hp < unit.lastHp) {
        unit.hurtAnimTimer = 0.28;
      }
      unit.lastHp = unit.hp;

      const attackProgress = unit.attackAnimTimer > 0
        ? 1 - unit.attackAnimTimer / unit.attackAnimDuration
        : 1;

      // 궁수는 활시위를 놓는 타이밍에 화살 발사
      if (unit.type === "archer" && unit.pendingArrowShot && (attackProgress >= 0.62 || unit.attackAnimTimer <= 0)) {
        fireArcherArrow(unit);
      }

      // 방패병은 검이 앞으로 나가는 프레임에 근접 피해 적용
      if (unit.type === "guard" && unit.attackImpactPending && (attackProgress >= 0.48 || unit.attackAnimTimer <= 0)) {
        const attackTarget = unit.attackTarget && unit.attackTarget.hp > 0
          ? unit.attackTarget
          : findNearestEnemy(unit.x, unit.range + 12);

        if (attackTarget) {
          attackTarget.hp -= unit.damage;
          spawnHit(attackTarget.x, attackTarget.y - 30, "#b7f7ff");
        }

        unit.attackImpactPending = false;
        unit.attackTarget = null;
      }
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
        } else if (unit.type === "guard") {
          unit.attackAnimDuration = 0.46;
          unit.attackAnimTimer = unit.attackAnimDuration;
          unit.attackImpactPending = true;
          unit.attackTarget = target;
        } else {
          target.hp -= unit.damage;
          spawnHit(target.x, target.y - 30, "#b7f7ff");
        }
      }
    } else {
      unit.x += unit.speed * dt;
      if (unit.type === "archer" || unit.type === "guard") unit.moving = true;
    }

    if (unit.x > ENEMY_BASE_X - 35) {
      gameState.enemyBaseHp -= unit.type === "archer" ? 8 * dt : 18 * dt;
      unit.x = ENEMY_BASE_X - 35;
      if (unit.type === "archer" || unit.type === "guard") unit.moving = false;
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

  // 소환 제한 슬롯은 살아있는 병사 수를 기준으로 계산합니다.
  // 병사가 죽으면 이 정리 단계 이후 자동으로 빈 자리가 생깁니다.
  gameState.units = gameState.units.filter((unit) => unit.hp > 0 && unit.x < ENEMY_BASE_X - 15);
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
  ctx.save();
  ctx.translate(hero.x, hero.y);
  const bob = Math.sin(performance.now() * 0.008) * 2;

  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, 4, 32, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // 주인공도 임시로 SD 기사 스프라이트를 사용합니다.
  // 이렇게 해야 전투 시작 직후에도 캐릭터가 네모 도형처럼 보이지 않습니다.
  if (guardSpriteReady) {
    drawHeroSprite(hero);
    ctx.restore();
    drawHealthBar(hero.x, hero.y - 88, 54, hero.hp, hero.maxHp, "#79ff7a");
    return;
  }

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

function drawHeroSprite(hero) {
  let anim = "idle";
  if (hero.hurtAnimTimer > 0) anim = "hurt";
  else if (hero.attackAnimTimer > 0) anim = "attack";
  else if (hero.moving) anim = "walk";

  const frameCount = GUARD_SPRITE.frames[anim];
  const fps = GUARD_SPRITE.fps[anim] || 8;
  let frame = Math.floor((hero.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = hero.attackAnimDuration || 0.42;
    const progress = 1 - hero.attackAnimTimer / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const sx = frame * GUARD_SPRITE.frameW;
  const sy = GUARD_SPRITE.rows[anim] * GUARD_SPRITE.frameH;
  const dw = 96;
  const dh = 96;

  ctx.save();
  if (hero.face < 0) ctx.scale(-1, 1);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(
    guardSprite,
    sx,
    sy,
    GUARD_SPRITE.frameW,
    GUARD_SPRITE.frameH,
    -dw / 2,
    -dh + 10,
    dw,
    dh
  );
  ctx.restore();
}


function drawGuardSprite(unit) {
  if (!guardSpriteReady) return false;

  let anim = "idle";
  if (unit.hurtAnimTimer > 0) anim = "hurt";
  else if (unit.attackAnimTimer > 0) anim = "attack";
  else if (unit.moving) anim = "walk";

  const frameCount = GUARD_SPRITE.frames[anim];
  const fps = GUARD_SPRITE.fps[anim] || 8;
  let frame = Math.floor((unit.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = unit.attackAnimDuration || 0.46;
    const progress = 1 - unit.attackAnimTimer / duration;
    frame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * frameCount)));
  }

  const sx = frame * GUARD_SPRITE.frameW;
  const sy = GUARD_SPRITE.rows[anim] * GUARD_SPRITE.frameH;
  const dw = GUARD_SPRITE.drawW;
  const dh = GUARD_SPRITE.drawH;

  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(
    guardSprite,
    sx,
    sy,
    GUARD_SPRITE.frameW,
    GUARD_SPRITE.frameH,
    -dw / 2,
    -dh + 9,
    dw,
    dh
  );

  return true;
}

function drawArcherSprite(unit) {
  if (!archerSpriteReady) return false;

  let anim = "idle";
  if (unit.hurtAnimTimer > 0) anim = "hurt";
  else if (unit.attackAnimTimer > 0) anim = "attack";
  else if (unit.moving) anim = "walk";

  const frameCount = ARCHER_SPRITE.frames[anim];
  const fps = ARCHER_SPRITE.fps[anim] || 8;
  let frame = Math.floor((unit.animTime || 0) * fps) % frameCount;

  if (anim === "attack") {
    const duration = unit.attackAnimDuration || 0.58;
    const progress = 1 - unit.attackAnimTimer / duration;
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

function drawUnit(unit) {
  ctx.save();
  ctx.translate(unit.x, unit.y);
  const bob = Math.sin((performance.now() + unit.x * 10) * 0.01) * 2;

  // 그림자는 땅에 고정합니다. 그림자가 캐릭터와 같이 흔들리면 걷기 모션이 더 어색해 보입니다.
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 3, 22, 7, 0, 0, Math.PI * 2);
  ctx.fill();

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
  } else {
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

  const playerBaseUi = getBaseRenderConfig(true);
  const enemyBaseUi = getBaseRenderConfig(false);
  drawHealthBar(playerBaseUi.hpX, playerBaseUi.hpY, playerBaseUi.hpW, gameState.playerBaseHp, 100, "#79ff7a");
  drawHealthBar(enemyBaseUi.hpX, enemyBaseUi.hpY, enemyBaseUi.hpW, gameState.enemyBaseHp, gameState.enemyBaseMaxHp, "#ff6868");

  const drawList = [...gameState.units, ...gameState.enemies].sort((a, b) => a.y - b.y || a.x - b.x);
  for (const entity of drawList) {
    if (gameState.units.includes(entity)) drawUnit(entity);
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
  const playableKeys = ["Space"];
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

  if (event.code === "Digit1") {
    event.preventDefault();
    summonGuard();
  }
  if (event.code === "Digit2") {
    event.preventDefault();
    summonArcher();
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
if (skillBtn) skillBtn.addEventListener("click", castHolySlash);
// 전투 개편: 캔버스 터치 직접 공격은 제거했습니다.

resetGame();
