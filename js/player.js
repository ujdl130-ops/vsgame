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
    entitlements: savedData.entitlements && typeof savedData.entitlements === "object" ? { ...savedData.entitlements } : {},
    unitGrowth: savedData.unitGrowth && typeof savedData.unitGrowth === "object" ? { ...savedData.unitGrowth } : {},
    stageMissionStars,
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
  return playerProgress;
}

function getPlayerData() {
  return playerProgress;
}

window.PlayerAPI = { getPlayerData, grantPlayerRewards, normalizePlayerData };

let gameState;
let lastTime = 0;
let animationId = null;
let keys = {};
let heroMoveInput = 0;
let selectedHeroId = "zeus";
let gameOptionsWasRunning = false;
let recruitDoorState = {
  active: false,
  tapCount: 0,
  pullCount: 1,
  hasThreeStar: false,
  opened: false,
};

function setSelectedHeroId(heroId) {
  selectedHeroId = heroId || "zeus";
}

function createInitialState() {
  const stageConfig = getStageConfig(selectedStage);
  const playerBaseHp = stageConfig.playerBaseHp || 100;

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
      bossDefeated: false,
      championDied: false,
    },
  };
}
