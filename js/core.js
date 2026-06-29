// Shared DOM references, constants, and asset loading.

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const waveText = document.getElementById("waveText");
const goldText = document.getElementById("goldText");
const unitCountText = document.getElementById("unitCountText");
const commandUnitText = document.getElementById("commandUnitText");
const commandGoldText = document.getElementById("commandGoldText");
const playerHpText = document.getElementById("playerHpText");
const enemyHpText = document.getElementById("enemyHpText");

const gameOptionsBtn = document.getElementById("gameOptionsBtn");
const gameOptionsMenu = document.getElementById("gameOptionsMenu");
const optionStageSelectBtn = document.getElementById("optionStageSelectBtn");
const optionRestartBtn = document.getElementById("optionRestartBtn");
const moveLeftBtn = document.getElementById("moveLeftBtn");
const moveRightBtn = document.getElementById("moveRightBtn");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const summonGuardBtn = document.getElementById("summonGuardBtn");
const summonArcherBtn = document.getElementById("summonArcherBtn");
const summonMageBtn = document.getElementById("summonMageBtn");
const summonSaintessBtn = document.getElementById("summonSaintessBtn");
let summonThiefBtn = document.getElementById("summonThiefBtn");
const skillBtn = document.getElementById("skillBtn"); // ?꾩옱 ?꾪닾 媛쒗렪?쇰줈 ?ㅽ궗 踰꾪듉? ?ъ슜?섏? ?딆뒿?덈떎.
const zeusSkillBtn = document.getElementById("zeusSkillBtn");

if (!summonThiefBtn && skillBtn && skillBtn.parentElement) {
  summonThiefBtn = document.createElement("button");
  summonThiefBtn.id = "summonThiefBtn";
  summonThiefBtn.type = "button";
  summonThiefBtn.textContent = "?꾩쟻 ?뚰솚";
  skillBtn.parentElement.insertBefore(summonThiefBtn, skillBtn);
}

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

const GROUND_Y = 300;
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
  stage1Background: "assets/maps/stage1/stage1_forest_bg_v2.png",
  stageBackgroundTemplate: "assets/maps/stage{stage}/stage{stage}_background.png",
  playerCastleTemplate: "assets/maps/stage{stage}/player_castle_stage1.png",
  enemyCastleTemplate: "assets/maps/stage{stage}/enemy_castle_stage1.png",
};

function loadGameImage(image, sourceList, setReady, label) {
  let sourceIndex = 0;

  image.onload = () => {
    setReady(true);
    console.log(`${label} 濡쒕뱶 ?깃났: ${image.src}`);
  };

  image.onerror = () => {
    sourceIndex += 1;
    if (sourceIndex < sourceList.length) {
      image.src = sourceList[sourceIndex];
      return;
    }
    setReady(false);
    console.warn(`${label} 濡쒕뱶 ?ㅽ뙣. 湲곕낯 ?꾪삎?쇰줈 ?쒖떆?⑸땲??`);
  };

  image.src = sourceList[sourceIndex];
}

const archerSprite = new Image();
let archerSpriteReady = false;
loadGameImage(
  archerSprite,
  [ASSET_PATHS.archerSprite],
  (ready) => { archerSpriteReady = ready; },
  "Archer sprite"
);

const heroSprite = new Image();
let heroSpriteReady = false;
loadGameImage(
  heroSprite,
  [ASSET_PATHS.heroSprite, "assets/animations/hero/zeus_hero_spritesheet_latest.png", "zeus_hero_spritesheet_latest.png"],
  (ready) => { heroSpriteReady = ready; },
  "Hero Zeus sprite"
);

const guardSprite = new Image();
let guardSpriteReady = false;
loadGameImage(
  guardSprite,
  [ASSET_PATHS.guardSprite],
  (ready) => { guardSpriteReady = ready; },
  "Guard sprite"
);

const mageSprite = new Image();
let mageSpriteReady = false;
loadGameImage(
  mageSprite,
  [ASSET_PATHS.mageSprite],
  (ready) => { mageSpriteReady = ready; },
  "Mage sprite"
);

const saintessSprite = new Image();
let saintessSpriteReady = false;
loadGameImage(
  saintessSprite,
  [ASSET_PATHS.saintessSprite],
  (ready) => { saintessSpriteReady = ready; },
  "Saintess sprite"
);

const stage1EnemySprite = new Image();
let stage1EnemySpriteReady = false;
loadGameImage(
  stage1EnemySprite,
  [ASSET_PATHS.stage1EnemySprite],
  (ready) => { stage1EnemySpriteReady = ready; },
  "Stage 1 enemy sprite"
);

function resolveStageAssetPath(stageNumber, templateKey) {
  const stage = Math.min(Math.max(1, Number(stageNumber) || 1), 3);
  return ASSET_PATHS[templateKey].replace(/{stage}/g, String(stage));
}

const stageBackgroundImage = new Image();
let stageBackgroundReady = false;
const playerCastleImage = new Image();
let playerCastleReady = false;
const enemyCastleImage = new Image();
let enemyCastleReady = false;

function loadStageAssets(stageNumber) {
  const stage = Math.min(Math.max(1, Number(stageNumber) || 1), 3);
  stageBackgroundReady = false;
  playerCastleReady = false;
  enemyCastleReady = false;

  const backgroundPath = stage === 1
    ? ASSET_PATHS.stage1Background
    : resolveStageAssetPath(stage, "stageBackgroundTemplate");

  loadGameImage(
    stageBackgroundImage,
    [backgroundPath],
    (ready) => { stageBackgroundReady = ready; },
    `Stage ${stage} background`
  );

  loadGameImage(
    playerCastleImage,
    [resolveStageAssetPath(stage, "playerCastleTemplate")],
    (ready) => { playerCastleReady = ready; },
    `Player castle (stage ${stage})`
  );

  loadGameImage(
    enemyCastleImage,
    [resolveStageAssetPath(stage, "enemyCastleTemplate")],
    (ready) => { enemyCastleReady = ready; },
    `Enemy castle (stage ${stage})`
  );
}
