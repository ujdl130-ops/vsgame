// Runtime player and game state.

let selectedStage = 1;
let playerProgress = loadProgress();

const PLAYER_ESSENCE_KEYS = [
  "lightningEssence", "seaEssence", "soulEssence",
  "wisdomEssence", "warEssence", "strengthEssence",
];

function normalizePlayerData(savedData = {}) {
  const essences = {};
  PLAYER_ESSENCE_KEYS.forEach((key) => {
    essences[key] = Math.max(0, Number(savedData.essences?.[key]) || 0);
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
    ownedGods: savedData.ownedGods && typeof savedData.ownedGods === "object" ? { ...savedData.ownedGods } : {},
    entitlements: savedData.entitlements && typeof savedData.entitlements === "object" ? { ...savedData.entitlements } : {},
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
let gameOptionsWasRunning = false;
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
    runestone: stageConfig.startRunestone,
    runestoneTimer: 0,
    zeusMana: 0,
    zeusManaMax: ZEUS_MANA_MAX,
    playerBaseHp: 100,
    enemyBaseHp: stageConfig.enemyBaseHp,
    enemyBaseMaxHp: stageConfig.enemyBaseHp,
    enemySpawnTimer: 0,
    enemiesToSpawn: stageConfig.baseEnemiesToSpawn,
    spawnedInWave: 0,
    waveBreakTimer: 0,
    hero: createMainHero(),
    zeusSkillEffect: null,
    particles: [],
    projectiles: [],
    units: [],
    enemies: [],
  };
}
