// Runtime player and game state.

let selectedStage = 1;
let playerProgress = loadProgress();


let gameState;
let lastTime = 0;
let animationId = null;
let keys = {};
let gameOptionsWasRunning = false;
let recruitDoorState = {

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
