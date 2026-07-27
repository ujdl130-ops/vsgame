// Runtime player and game state.

let selectedStage = 1;
let playerProgress = loadProgress();

const PLAYER_ESSENCE_KEYS = [
  "lightningEssence", "seaEssence", "soulEssence",
  "wisdomEssence", "warEssence", "strengthEssence",
];

const PLAYER_UNIT_ESSENCE_KEYS = [
  "guardEssence", "archerEssence", "thiefEssence",
  "mageEssence", "saintessEssence",
];

function normalizePlayerData(savedData = {}) {
  const essences = {};
  PLAYER_ESSENCE_KEYS.forEach((key) => {
    essences[key] = Math.max(0, Number(savedData.essences?.[key]) || 0);
  });

  const unitEssences = {};
  PLAYER_UNIT_ESSENCE_KEYS.forEach((key) => {
    unitEssences[key] = Math.max(0, Number(savedData.unitEssences?.[key]) || 0);
  });

  const stageMissionStars = {};
  const savedStageMissionStars = savedData.stageMissionStars && typeof savedData.stageMissionStars === "object"
    ? savedData.stageMissionStars
    : {};
  Object.entries(savedStageMissionStars).forEach(([stageNumber, missions]) => {
    if (!missions || typeof missions !== "object") return;
    stageMissionStars[stageNumber] = { ...missions };
  });
  const claimedMissionRewards = Array.isArray(savedData.claimedMissionRewards)
    ? [...new Set(savedData.claimedMissionRewards.map(String).filter(Boolean))]
    : [];
  const claimedMissionDailyDate = typeof savedData.claimedMissionDailyDate === "string"
    ? savedData.claimedMissionDailyDate
    : "";
  const claimedMissionWeeklyWeek = typeof savedData.claimedMissionWeeklyWeek === "string"
    ? savedData.claimedMissionWeeklyWeek
    : "";
  const monthlySubscriptions = {};
  const savedMonthlySubscriptions = savedData.monthlySubscriptions && typeof savedData.monthlySubscriptions === "object"
    ? savedData.monthlySubscriptions
    : {};
  Object.entries(savedMonthlySubscriptions).forEach(([key, state]) => {
    if (!state || typeof state !== "object") return;
    monthlySubscriptions[key] = {
      active: state.active !== false,
      startedDate: typeof state.startedDate === "string" ? state.startedDate : "",
      endDate: typeof state.endDate === "string" ? state.endDate : "",
      lastClaimedDate: typeof state.lastClaimedDate === "string" ? state.lastClaimedDate : "",
      claimedDays: Math.max(0, Number(state.claimedDays) || 0),
      purchasedAt: typeof state.purchasedAt === "string" ? state.purchasedAt : "",
    };
  });

  return {
    ...savedData,
    unlockedStage: Math.min(3, Math.max(1, Number(savedData.unlockedStage) || 1)),
    clearedStages: Array.isArray(savedData.clearedStages) ? savedData.clearedStages : [],
    gold: Math.max(0, Number(savedData.gold) || 0),
    diamonds: Math.max(0, Number(savedData.diamonds) || 0),
    summonTickets: Math.max(0, Number(savedData.summonTickets) || 0),
    commonEssence: Math.max(0, Number(savedData.commonEssence) || 0),
    soldierFragments: Math.max(0, Number(savedData.soldierFragments) || 0),
    essences,
    unitEssences,
    ownedGods: savedData.ownedGods && typeof savedData.ownedGods === "object" ? { ...savedData.ownedGods } : {},
    welcomeMail: savedData.welcomeMail && typeof savedData.welcomeMail === "object"
      ? {
        introduced: Boolean(savedData.welcomeMail.introduced),
        claimed: Boolean(savedData.welcomeMail.claimed),
      }
      : { introduced: false, claimed: false },
    entitlements: savedData.entitlements && typeof savedData.entitlements === "object" ? { ...savedData.entitlements } : {},
    unitGrowth: savedData.unitGrowth && typeof savedData.unitGrowth === "object" ? { ...savedData.unitGrowth } : {},
    stageMissionStars,
    claimedMissionRewards,
    claimedMissionDailyDate,
    claimedMissionWeeklyWeek,
    monthlySubscriptions,
  };
}

playerProgress = normalizePlayerData(playerProgress);

function grantPlayerRewards(rewards = {}) {
  ["gold", "diamonds", "summonTickets", "commonEssence", "soldierFragments"].forEach((key) => {
    if (rewards[key]) playerProgress[key] = Math.max(0, playerProgress[key] + Number(rewards[key]));
  });
  Object.entries(rewards.essences || {}).forEach(([key, amount]) => {
    if (PLAYER_ESSENCE_KEYS.includes(key)) {
      playerProgress.essences[key] = Math.max(0, playerProgress.essences[key] + Number(amount));
    }
  });
  Object.entries(rewards.unitEssences || {}).forEach(([key, amount]) => {
    if (PLAYER_UNIT_ESSENCE_KEYS.includes(key)) {
      playerProgress.unitEssences[key] = Math.max(0, playerProgress.unitEssences[key] + Number(amount));
    }
  });
  saveProgress();
  if (typeof updateWalletDisplays === "function") updateWalletDisplays();
  if (typeof updateLobbyTopBar === "function") updateLobbyTopBar();
  if (window.ShopAPI?.updateShopWallet) window.ShopAPI.updateShopWallet();
  if (typeof updateRecruitWallet === "function") updateRecruitWallet();
  if (typeof renderInventoryScreen === "function") renderInventoryScreen();
  return playerProgress;
}

function getPlayerData() {
  return playerProgress;
}

function grantWelcomeZeusReward() {
  playerProgress.ownedGods = playerProgress.ownedGods || {};
  const hero = typeof getGodHeroById === "function" ? getGodHeroById("zeus") : null;
  playerProgress.ownedGods.zeus = {
    ...(hero || { id: "zeus", name: "제우스" }),
    owned: true,
  };
  playerProgress.welcomeMail = {
    ...(playerProgress.welcomeMail || {}),
    introduced: true,
    claimed: true,
  };
  saveProgress();
  return playerProgress.ownedGods.zeus;
}

function unlockPlayerHero(heroId) {
  if (!PROTOTYPE_PLAYABLE_HERO_IDS.has(heroId)) return null;
  playerProgress.ownedGods = playerProgress.ownedGods || {};
  const hero = typeof getGodHeroById === "function" ? getGodHeroById(heroId) : null;
  playerProgress.ownedGods[heroId] = {
    ...(hero || { id: heroId }),
    owned: true,
  };
  saveProgress();
  return playerProgress.ownedGods[heroId];
}

window.PlayerAPI = { getPlayerData, grantPlayerRewards, normalizePlayerData, grantWelcomeZeusReward, unlockPlayerHero };

let gameState;
let lastTime = 0;
let animationId = null;
let keys = {};
let heroMoveInput = 0;
let heroJoystickMoveInput = 0;
let selectedHeroId = "zeus";
const PROTOTYPE_PLAYABLE_HERO_IDS = new Set(["zeus", "poseidon"]);
let gameOptionsWasRunning = false;
let recruitDoorState = {
  active: false,
  tapCount: 0,
  pullCount: 1,
  hasThreeStar: false,
  opened: false,
};

function syncHeroMoveInput() {
  const keyboardInput = Number(Boolean(keys.KeyD)) - Number(Boolean(keys.KeyA));
  const isKeyboardMoving = Boolean(keys.KeyA || keys.KeyD);
  heroMoveInput = isKeyboardMoving ? keyboardInput : heroJoystickMoveInput;
}

function setHeroJoystickMoveInput(amount) {
  heroJoystickMoveInput = Math.max(-1, Math.min(1, Number(amount) || 0));
  syncHeroMoveInput();
}

function resetHeroMoveInput() {
  keys.KeyA = false;
  keys.KeyD = false;
  heroJoystickMoveInput = 0;
  heroMoveInput = 0;
}

function isPlayerHeroUnlocked(heroId) {
  if (!PROTOTYPE_PLAYABLE_HERO_IDS.has(heroId)) return false;
  const ownedGod = playerProgress?.ownedGods?.[heroId];
  return Boolean(ownedGod && (ownedGod.owned === true || ownedGod === true));
}

function setSelectedHeroId(heroId) {
  selectedHeroId = isPlayerHeroUnlocked(heroId) ? heroId : "zeus";
}

function createInitialState() {
  const stageConfig = getStageConfig(selectedStage);
  const playerBaseHp = stageConfig.playerBaseHp || 100;

  return {
    running: false,
    gameOver: false,
    clear: false,
    chapter: typeof selectedChapter === "number" ? selectedChapter : 1,
    stage: selectedStage,
    stageTitle: stageConfig.title,
    maxWave: stageConfig.maxWave,
    baseEnemiesToSpawn: stageConfig.baseEnemiesToSpawn,
    message: `Stage ${selectedStage} 준비 완료`,
    messageTimer: 0,
    wave: 1,
    runestone: clampRunestone(stageConfig.startRunestone),
    zeusMana: 0,
    zeusManaMax: ZEUS_MANA_MAX,
    playerBaseHp,
    playerBaseMaxHp: playerBaseHp,
    enemyBaseHp: stageConfig.enemyBaseHp,
    enemyBaseMaxHp: stageConfig.enemyBaseHp,
    enemySpawnTimer: 0,
    enemiesToSpawn: stageConfig.baseEnemiesToSpawn,
    spawnedInWave: 0,
    karonBossSpawned: false,
    karonBossTrigger: "",
    stageThreeBossOpeningMinionsSpawned: false,
    stageThreeBossReinforcementTimer: typeof STAGE3_BOSS_REINFORCEMENT_INTERVAL === "number"
      ? STAGE3_BOSS_REINFORCEMENT_INTERVAL
      : 6,
    enemyGateShieldLastMessageAt: 0,
    waveBreakTimer: 0,
    growth: playerProgress.growth || {},
    selectedHeroId,
    hero: createMainHero(selectedHeroId),
    zeusSkillEffect: null,
    poseidonSkillEffect: null,
    particles: [],
    projectiles: [],
    units: [],
    enemies: [],
    stageMissionRun: {
      guardSummons: 0,
      archerSummons: 0,
      mageSummons: 0,
      bossDefeated: false,
      championDied: false,
    },
  };
}
