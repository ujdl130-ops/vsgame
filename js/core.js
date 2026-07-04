// Shared DOM references, constants, and asset loading.

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const waveText = document.getElementById("waveText");
const unitCountText = document.getElementById("unitCountText");
const commandUnitText = document.getElementById("commandUnitText");
const runestoneGaugeFill = document.getElementById("runestoneGaugeFill");
const runestoneGaugeText = document.getElementById("runestoneGaugeText");
const zeusManaText = document.getElementById("zeusManaText");
const zeusManaFill = document.getElementById("zeusManaFill");
const playerHpText = document.getElementById("playerHpText");
const enemyHpText = document.getElementById("enemyHpText");

const gameOptionsBtn = document.getElementById("gameOptionsBtn");
const gameOptionsMenu = document.getElementById("gameOptionsMenu");
const optionStageSelectBtn = document.getElementById("optionStageSelectBtn");
const optionRestartBtn = document.getElementById("optionRestartBtn");
const movementJoystick = document.getElementById("movementJoystick");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const summonGuardSlotBtn = document.getElementById("summonGuardSlotBtn");
const summonArcherSlotBtn = document.getElementById("summonArcherSlotBtn");
const summonMageSlotBtn = document.getElementById("summonMageSlotBtn");
const summonSaintessSlotBtn = document.getElementById("summonSaintessSlotBtn");
const summonThiefSlotBtn = document.getElementById("summonThiefSlotBtn");
const basicAttackIconBtn = document.getElementById("basicAttackIconBtn");
const zeusSkillIconBtn = document.getElementById("zeusSkillIconBtn");
const skillBtn = document.getElementById("skillBtn"); // 전투 개편 후 스킬 버튼은 기본 공격 버튼으로 사용합니다.
const zeusSkillBtn = document.getElementById("zeusSkillBtn");

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
const COMBAT_LINE_Y = GROUND_Y - 42;
const PLAYER_BASE_X = 40;
const ENEMY_BASE_X = 900;
const MAX_WAVE = 3;
const MAX_SUMMONED_UNITS = 8;
const HERO_MIN_X = PLAYER_BASE_X + 72;
const HERO_MAX_X = ENEMY_BASE_X - 74;
const HERO_RESPAWN_SECONDS = 4;
const RUNESTONE_GAUGE_MAX = 150;
const ZEUS_MANA_MAX = 50;
const ZEUS_MANA_COST = 50;
const ZEUS_MANA_REGEN_PER_SECOND = 10;

const ASSET_PATHS = {
  archerSprite: "assets/animations/archer/elf_archer_guard_size_spritesheet.png",
  guardSprite: "assets/animations/guard/guard_spritesheet_v2.png",
  mageSprite: "assets/animations/mage/red_wizard_spritesheet.png",
  saintessSprite: "assets/animations/saintess/saintess_spritesheet_aligned.png",
  thiefSprite: "assets/animations/thief/female_thief_spritesheet.png",
  heroSprite: "assets/animations/hero/zeus_hero_spritesheet_latest_transparent_aligned.png",
  lobbyHeroIdle: "assets/animations/hero/zeus_lobby_idle_hd.png",
  zeusStormCloudSprite: "assets/effects/zeus_storm_cloud_spritesheet.png",
  zeusStormLightningSprite: "assets/effects/zeus_storm_lightning_spritesheet.png",
  stage1EnemySprite: "assets/animations/enemy/stage1_goblin_spritesheet.png",
  stage2EvileyeSprite: "assets/animations/enemy/stage2_flying_eye_spritesheet.png",
  karonHumanSprite: "assets/animations/Boss_Karon/karon_human_phase1_transparent.png",
  karonTransformSprite: "assets/animations/Boss_Karon/karon_transform_transparent.png",
  karonWerewolfSprite: "assets/animations/Boss_Karon/karon_werewolf_phase2_transparent.png",
  stage1Background: "assets/maps/stage1/stage1_forest_bg_v2.png",
  stageBackgroundTemplate: "assets/maps/stage{stage}/stage{stage}_background.png",
  playerCastleTemplate: "assets/maps/rune_gate_transparent.png",
  enemyCastleTemplate: "assets/maps/demon_gate_transparent.png",
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
    console.warn(`${label} 로드 실패. 기본 도형으로 표시합니다.`);
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

const lobbyHeroImage = new Image();
let lobbyHeroReady = false;
loadGameImage(
  lobbyHeroImage,
  [ASSET_PATHS.lobbyHeroIdle],
  (ready) => {
    lobbyHeroReady = ready;
    if (ready && typeof isLobbyVisible === "function" && isLobbyVisible() && typeof renderLobbyHero === "function") {
      renderLobbyHero();
    }
  },
  "Lobby Zeus idle"
);

const zeusStormCloudSprite = new Image();
let zeusStormCloudSpriteReady = false;
loadGameImage(
  zeusStormCloudSprite,
  [ASSET_PATHS.zeusStormCloudSprite],
  (ready) => { zeusStormCloudSpriteReady = ready; },
  "Zeus storm cloud sprite"
);

const zeusStormLightningSprite = new Image();
let zeusStormLightningSpriteReady = false;
loadGameImage(
  zeusStormLightningSprite,
  [ASSET_PATHS.zeusStormLightningSprite],
  (ready) => { zeusStormLightningSpriteReady = ready; },
  "Zeus storm lightning sprite"
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

const thiefSprite = new Image();
let thiefSpriteReady = false;
loadGameImage(
  thiefSprite,
  [ASSET_PATHS.thiefSprite],
  (ready) => { thiefSpriteReady = ready; },
  "Thief sprite"
);

const stage1EnemySprite = new Image();
let stage1EnemySpriteReady = false;
loadGameImage(
  stage1EnemySprite,
  [ASSET_PATHS.stage1EnemySprite],
  (ready) => { stage1EnemySpriteReady = ready; },
  "Stage 1 enemy sprite"
);

const stage2EvileyeSprite = new Image();
let stage2EvileyeSpriteReady = false;
loadGameImage(
  stage2EvileyeSprite,
  [ASSET_PATHS.stage2EvileyeSprite],
  (ready) => { stage2EvileyeSpriteReady = ready; },
  "Stage 2 evileye sprite"
);

const karonHumanSprite = new Image();
let karonHumanSpriteReady = false;
loadGameImage(
  karonHumanSprite,
  [ASSET_PATHS.karonHumanSprite],
  (ready) => { karonHumanSpriteReady = ready; },
  "Karon human sprite"
);

const karonTransformSprite = new Image();
let karonTransformSpriteReady = false;
loadGameImage(
  karonTransformSprite,
  [ASSET_PATHS.karonTransformSprite],
  (ready) => { karonTransformSpriteReady = ready; },
  "Karon transform sprite"
);

const karonWerewolfSprite = new Image();
let karonWerewolfSpriteReady = false;
loadGameImage(
  karonWerewolfSprite,
  [ASSET_PATHS.karonWerewolfSprite],
  (ready) => { karonWerewolfSpriteReady = ready; },
  "Karon werewolf sprite"
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
