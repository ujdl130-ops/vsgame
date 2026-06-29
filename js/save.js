// Local progress persistence.

const STAGE_PROGRESS_KEY = "pixelDefenseStageProgress";

const CHARACTER_GROWTH_CONFIGS = {
  guard: {
    level: { hp: 1.4, damage: 0.8 },
    transcendence: {
      1: { hp: 1.0, damage: 1.0 },
      2: { hp: 1.25, damage: 1.125 },
      3: { hp: 1.5, damage: 1.25 },
    },
  },
  archer: {
    level: { hp: 0.8, damage: 1.3 },
    transcendence: {
      1: { hp: 1.0, damage: 1.0 },
      2: { hp: 1.125, damage: 1.25 },
      3: { hp: 1.25, damage: 1.5 },
    },
  },
  thief: {
    level: { hp: 0.8, damage: 1.3 },
    transcendence: {
      1: { hp: 1.0, damage: 1.0 },
      2: { hp: 1.15, damage: 1.275 },
      3: { hp: 1.3, damage: 1.55 },
    },
  },
  mage: {
    level: { hp: 0.7, damage: 1.15 },
    transcendence: {
      1: { hp: 1.0, damage: 1.0 },
      2: { hp: 1.125, damage: 1.225 },
      3: { hp: 1.25, damage: 1.45 },
    },
  },
  saintess: {
    level: { hp: 0.9, healAmount: 1.4 },
    transcendence: {
      1: { hp: 1.0, healAmount: 1.0 },
      2: { hp: 1.175, healAmount: 1.275 },
      3: { hp: 1.35, healAmount: 1.55 },
    },
  },
  hero: {
    level: { hp: 1.35, damage: 1.45 },
    transcendence: {
      1: { hp: 1.0, damage: 1.0 },
      2: { hp: 1.25, damage: 1.275 },
      3: { hp: 1.5, damage: 1.55 },
    },
  },
};

const GROWTH_TYPE_ALIASES = {
  warrior: "guard",
  rogue: "thief",
  healer: "saintess",
  zeus: "hero",
};

const LEVEL_UP_GOLD_MILESTONES = [
  { level: 1, cumulativeGold: 0 },
  { level: 10, cumulativeGold: 1970 },
  { level: 20, cumulativeGold: 12010 },
  { level: 30, cumulativeGold: 38050 },
];

const HERO_LEVEL_UP_COST_MULTIPLIER = 1.25;

function resolveGrowthType(type) {
  return GROWTH_TYPE_ALIASES[type] || type;
}

function clampGrowthLevel(level) {
  return Math.min(30, Math.max(1, Math.round(Number(level) || 1)));
}

function clampTranscendenceStar(star) {
  return Math.min(3, Math.max(1, Math.round(Number(star) || 1)));
}

function isHeroGrowthType(type) {
  return resolveGrowthType(type) === "hero";
}

function getBaseCumulativeLevelUpGold(level) {
  const targetLevel = clampGrowthLevel(level);

  for (let index = 1; index < LEVEL_UP_GOLD_MILESTONES.length; index += 1) {
    const previous = LEVEL_UP_GOLD_MILESTONES[index - 1];
    const next = LEVEL_UP_GOLD_MILESTONES[index];

    if (targetLevel <= next.level) {
      const levelProgress = (targetLevel - previous.level) / (next.level - previous.level);
      const goldRange = next.cumulativeGold - previous.cumulativeGold;
      return Math.round(previous.cumulativeGold + goldRange * levelProgress);
    }
  }

  return LEVEL_UP_GOLD_MILESTONES[LEVEL_UP_GOLD_MILESTONES.length - 1].cumulativeGold;
}

function getCumulativeLevelUpGold(type, level) {
  const baseCost = getBaseCumulativeLevelUpGold(level);
  return Math.round(baseCost * (isHeroGrowthType(type) ? HERO_LEVEL_UP_COST_MULTIPLIER : 1));
}

function getLevelUpGoldCost(type, fromLevel, toLevel = Number(fromLevel) + 1) {
  const startLevel = clampGrowthLevel(fromLevel);
  const targetLevel = clampGrowthLevel(toLevel);
  if (targetLevel <= startLevel) return 0;
  return getCumulativeLevelUpGold(type, targetLevel) - getCumulativeLevelUpGold(type, startLevel);
}

function getNextLevelUpGoldCost(type, growthState = getStoredGrowthState(type)) {
  return getLevelUpGoldCost(type, growthState.level, growthState.level + 1);
}

function getStoredGrowthState(type) {
  const growthType = resolveGrowthType(type);
  const progressGrowth = playerProgress && playerProgress.growth;
  const gameGrowth = gameState && gameState.growth;
  const saved = (gameGrowth && gameGrowth[growthType])
    || (progressGrowth && progressGrowth[growthType])
    || {};

  return {
    level: clampGrowthLevel(saved.level),
    star: clampTranscendenceStar(saved.star),
  };
}

function getLevelGrowthCoefficient(type, stat, level) {
  const growthType = resolveGrowthType(type);
  const config = CHARACTER_GROWTH_CONFIGS[growthType];
  const levelGrowth = (config && config.level && config.level[stat]) || 0;
  return 1 + ((clampGrowthLevel(level) - 1) / 29) * levelGrowth;
}

function getTranscendenceCoefficient(type, stat, star) {
  const growthType = resolveGrowthType(type);
  const config = CHARACTER_GROWTH_CONFIGS[growthType];
  const starConfig = config && config.transcendence && config.transcendence[clampTranscendenceStar(star)];
  return (starConfig && starConfig[stat]) || 1;
}

function calculateGrowthStat(type, stat, baseValue, growthState) {
  const level = growthState ? growthState.level : getStoredGrowthState(type).level;
  const star = growthState ? growthState.star : getStoredGrowthState(type).star;
  return Math.round(
    baseValue
    * getLevelGrowthCoefficient(type, stat, level)
    * getTranscendenceCoefficient(type, stat, star)
  );
}

function getGrownStats(type, baseStats, growthState = getStoredGrowthState(type)) {
  const stats = {
    level: growthState.level,
    star: growthState.star,
  };

  if (typeof baseStats.hp === "number") {
    stats.hp = calculateGrowthStat(type, "hp", baseStats.hp, growthState);
  }
  if (typeof baseStats.damage === "number") {
    stats.damage = calculateGrowthStat(type, "damage", baseStats.damage, growthState);
  }
  if (typeof baseStats.healAmount === "number") {
    stats.healAmount = calculateGrowthStat(type, "healAmount", baseStats.healAmount, growthState);
  }

  return stats;
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STAGE_PROGRESS_KEY));
    if (!saved || typeof saved !== "object") throw new Error("No progress");
    const unlockedStage = Math.min(3, Math.max(1, Number(saved.unlockedStage) || 1));
    const clearedStages = Array.isArray(saved.clearedStages)
      ? saved.clearedStages.map(Number).filter((stage) => stage >= 1 && stage <= 3)
      : [];
    const growth = saved.growth && typeof saved.growth === "object" ? saved.growth : {};
    return { unlockedStage, clearedStages, growth };
  } catch (error) {
    return { unlockedStage: 1, clearedStages: [], growth: {} };
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STAGE_PROGRESS_KEY, JSON.stringify(playerProgress));
  } catch (error) {
    // 로컬 파일 실행 환경에서 저장소 접근이 막히더라도 게임 진행은 유지합니다.
  }
}
