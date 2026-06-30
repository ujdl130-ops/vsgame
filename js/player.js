// Runtime player and game state.

let selectedStage = 1;
let playerProgress = loadProgress();


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
