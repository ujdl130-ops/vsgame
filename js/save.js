// Local progress persistence.

const STAGE_PROGRESS_KEY = "pixelDefenseStageProgress";

const MIN_GROWTH_LEVEL = 1;
const MAX_GROWTH_LEVEL = 50;
const LEVEL_GROWTH_DEFINED_MAX_LEVEL = MAX_GROWTH_LEVEL;
const MIN_TRANSCENDENCE_STAR = 1;
const MAX_TRANSCENDENCE_STAR = 5;

const CHARACTER_GROWTH_CONFIGS = {
  guard: {
    level: {
      hp: { early: 0.0483, mid: 0.0966, late: 0.1448 },
      damage: { early: 0.0276, mid: 0.0386, late: 0.0552 },
    },
    transcendence: {
      1: { hp: 1.0, damage: 1.0 },
      2: { hp: 1.25, damage: 1.125 },
      3: { hp: 1.5, damage: 1.25 },
      4: { hp: 1.75, damage: 1.4 },
      5: { hp: 2.1, damage: 1.6 },
    },
  },
  archer: {
    level: {
      hp: { early: 0.0276, mid: 0.0386, late: 0.0552 },
      damage: { early: 0.0448, mid: 0.0897, late: 0.1345 },
    },
    transcendence: {
      1: { hp: 1.0, damage: 1.0 },
      2: { hp: 1.125, damage: 1.25 },
      3: { hp: 1.25, damage: 1.5 },
      4: { hp: 1.4, damage: 1.75 },
      5: { hp: 1.6, damage: 2.1 },
    },
  },
  thief: {
    level: {
      hp: { early: 0.0276, mid: 0.0386, late: 0.0552 },
      damage: { early: 0.0448, mid: 0.0941, late: 0.1434 },
    },
    transcendence: {
      1: { hp: 1.0, damage: 1.0 },
      2: { hp: 1.15, damage: 1.275 },
      3: { hp: 1.3, damage: 1.55 },
      4: { hp: 1.48, damage: 1.85 },
      5: { hp: 1.7, damage: 2.25 },
    },
  },
  mage: {
    level: {
      hp: { early: 0.0241, mid: 0.0338, late: 0.0483 },
      damage: { early: 0.0397, mid: 0.0714, late: 0.1031 },
    },
    transcendence: {
      1: { hp: 1.0, damage: 1.0 },
      2: { hp: 1.125, damage: 1.225 },
      3: { hp: 1.25, damage: 1.45 },
      4: { hp: 1.4, damage: 1.68 },
      5: { hp: 1.6, damage: 2.0 },
    },
  },
  saintess: {
    level: {
      hp: { early: 0.031, mid: 0.0434, late: 0.0621 },
      healAmount: { early: 0.0483, mid: 0.1014, late: 0.1545 },
    },
    transcendence: {
      1: { hp: 1.0, healAmount: 1.0 },
      2: { hp: 1.175, healAmount: 1.275 },
      3: { hp: 1.35, healAmount: 1.55 },
      4: { hp: 1.55, healAmount: 1.85 },
      5: { hp: 1.8, healAmount: 2.25 },
    },
  },
  hero: {
    level: {
      hp: { early: 0.0466, mid: 0.0978, late: 0.149 },
      damage: { early: 0.05, mid: 0.105, late: 0.16 },
    },
    transcendence: {
      1: { hp: 1.0, damage: 1.0 },
      2: { hp: 1.25, damage: 1.275 },
      3: { hp: 1.5, damage: 1.55 },
      4: { hp: 1.85, damage: 1.95 },
      5: { hp: 2.25, damage: 2.45 },
    },
  },
};

const GROWTH_TYPE_ALIASES = {
  warrior: "guard",
  rogue: "thief",
  healer: "saintess",
  zeus: "hero",
};

const LEVEL_UP_GOLD_COST_BY_LEVEL = {
  2: 80,
  3: 100,
  4: 120,
  5: 150,
  6: 190,
  7: 240,
  8: 300,
  9: 360,
  10: 430,
  11: 510,
  12: 600,
  13: 700,
  14: 800,
  15: 900,
  16: 1010,
  17: 1130,
  18: 1260,
  19: 1400,
  20: 1730,
  21: 1690,
  22: 1860,
  23: 2040,
  24: 2230,
  25: 2430,
  26: 2640,
  27: 2850,
  28: 3070,
  29: 3300,
  30: 3930,
  31: 3840,
  32: 4100,
  33: 4370,
  34: 4650,
  35: 4930,
  36: 5220,
  37: 5530,
  38: 5840,
  39: 6160,
  40: 5400,
  41: 6840,
  42: 7190,
  43: 7560,
  44: 7930,
  45: 8310,
  46: 8700,
  47: 9100,
  48: 9510,
  49: 9930,
  50: 6970,
};

const HERO_LEVEL_UP_COST_MULTIPLIER = 1.25;

const CHARACTER_FRAGMENT_KEYS = {
  guard: "guardFragment",
  archer: "archerFragment",
  thief: "thiefFragment",
  mage: "mageFragment",
  saintess: "saintessFragment",
  hero: "heroFragment",
};

const TRANSCENDENCE_FRAGMENT_COSTS = {
  2: 20,
  3: 30,
  4: 50,
  5: 80,
};

const HERO_TRANSCENDENCE_FRAGMENT_COSTS = {
  2: 40,
  3: 40,
  4: 40,
  5: 40,
};

function resolveGrowthType(type) {
  return GROWTH_TYPE_ALIASES[type] || type;
}

function clampGrowthLevel(level) {
  return Math.min(MAX_GROWTH_LEVEL, Math.max(MIN_GROWTH_LEVEL, Math.round(Number(level) || MIN_GROWTH_LEVEL)));
}

function clampTranscendenceStar(star) {
  return Math.min(
    MAX_TRANSCENDENCE_STAR,
    Math.max(MIN_TRANSCENDENCE_STAR, Math.round(Number(star) || MIN_TRANSCENDENCE_STAR))
  );
}

function isHeroGrowthType(type) {
  return resolveGrowthType(type) === "hero";
}

function getCharacterFragmentKey(type) {
  const growthType = resolveGrowthType(type);
  return CHARACTER_FRAGMENT_KEYS[growthType] || `${growthType}Fragment`;
}

function getRequiredTranscendenceStarForLevel(level) {
  const targetLevel = clampGrowthLevel(level);
  if (targetLevel > 40) return 5;
  if (targetLevel > 30) return 4;
  return 1;
}

function meetsLevelTranscendenceRequirement(targetLevel, growthState) {
  const star = clampTranscendenceStar(growthState && growthState.star);
  return star >= getRequiredTranscendenceStarForLevel(targetLevel);
}

function getBaseCumulativeLevelUpGold(level) {
  const targetLevel = clampGrowthLevel(level);
  let cumulativeGold = 0;

  for (let currentLevel = MIN_GROWTH_LEVEL + 1; currentLevel <= targetLevel; currentLevel += 1) {
    const levelCost = LEVEL_UP_GOLD_COST_BY_LEVEL[currentLevel];
    if (typeof levelCost !== "number") return null;
    cumulativeGold += levelCost;
  }

  return cumulativeGold;
}

function getCumulativeLevelUpGold(type, level) {
  const baseCost = getBaseCumulativeLevelUpGold(level);
  if (baseCost === null) return null;
  return Math.round(baseCost * (isHeroGrowthType(type) ? HERO_LEVEL_UP_COST_MULTIPLIER : 1));
}

function getLevelUpGoldCost(type, fromLevel, toLevel = Number(fromLevel) + 1, growthState = getStoredGrowthState(type)) {
  const startLevel = clampGrowthLevel(fromLevel);
  const targetLevel = clampGrowthLevel(toLevel);
  if (targetLevel <= startLevel) return 0;
  if (!meetsLevelTranscendenceRequirement(targetLevel, growthState)) return null;
  const targetCost = getCumulativeLevelUpGold(type, targetLevel);
  const startCost = getCumulativeLevelUpGold(type, startLevel);
  if (targetCost === null || startCost === null) return null;
  return targetCost - startCost;
}

function getNextLevelUpGoldCost(type, growthState = getStoredGrowthState(type)) {
  return getLevelUpGoldCost(type, growthState.level, growthState.level + 1);
}

function canLevelUp(type, growthState = getStoredGrowthState(type)) {
  const currentLevel = clampGrowthLevel(growthState.level);
  return currentLevel < MAX_GROWTH_LEVEL
    && getNextLevelUpGoldCost(type, growthState) !== null;
}

function getTranscendenceFragmentCosts(type) {
  return isHeroGrowthType(type) ? HERO_TRANSCENDENCE_FRAGMENT_COSTS : TRANSCENDENCE_FRAGMENT_COSTS;
}

function getTranscendenceFragmentAmount(type, fromStar, toStar = Number(fromStar) + 1) {
  const fragmentCosts = getTranscendenceFragmentCosts(type);
  const startStar = clampTranscendenceStar(fromStar);
  const targetStar = clampTranscendenceStar(toStar);
  if (targetStar <= startStar) return 0;

  let amount = 0;
  for (let star = startStar + 1; star <= targetStar; star += 1) {
    if (typeof fragmentCosts[star] !== "number") return null;
    amount += fragmentCosts[star];
  }
  return amount;
}

function getTranscendenceCost(type, fromStar, toStar = Number(fromStar) + 1) {
  return {
    fragmentKey: getCharacterFragmentKey(type),
    amount: getTranscendenceFragmentAmount(type, fromStar, toStar),
  };
}

function getNextTranscendenceCost(type, growthState = getStoredGrowthState(type)) {
  return getTranscendenceCost(type, growthState.star, growthState.star + 1);
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
  const levelConfig = config && config.level && config.level[stat];
  const definedLevel = Math.min(clampGrowthLevel(level), LEVEL_GROWTH_DEFINED_MAX_LEVEL);

  if (typeof levelConfig === "number") {
    return 1 + ((definedLevel - MIN_GROWTH_LEVEL) / 29) * levelConfig;
  }

  if (!levelConfig || typeof levelConfig !== "object") return 1;

  if (typeof levelConfig.early === "number") {
    const earlyGrowth = levelConfig.early;
    const midGrowth = typeof levelConfig.mid === "number" ? levelConfig.mid : earlyGrowth;
    const lateGrowth = typeof levelConfig.late === "number" ? levelConfig.late : midGrowth;
    const level30Coefficient = 1 + (30 - MIN_GROWTH_LEVEL) * earlyGrowth;
    const level40Coefficient = level30Coefficient + (40 - 30) * midGrowth;

    if (definedLevel <= 30) {
      return 1 + (definedLevel - MIN_GROWTH_LEVEL) * earlyGrowth;
    }

    if (definedLevel <= 40) {
      return level30Coefficient + (definedLevel - 30) * midGrowth;
    }

    return level40Coefficient + (definedLevel - 40) * lateGrowth;
  }

  const milestones = Object.keys(levelConfig)
    .map(Number)
    .filter((milestone) => Number.isFinite(milestone))
    .sort((a, b) => a - b);

  if (!milestones.length) return 1;
  if (definedLevel <= milestones[0]) return levelConfig[milestones[0]];

  for (let index = 1; index < milestones.length; index += 1) {
    const previousLevel = milestones[index - 1];
    const nextLevel = milestones[index];

    if (definedLevel <= nextLevel) {
      const previousCoefficient = levelConfig[previousLevel];
      const nextCoefficient = levelConfig[nextLevel];
      const progress = (definedLevel - previousLevel) / (nextLevel - previousLevel);
      return previousCoefficient + (nextCoefficient - previousCoefficient) * progress;
    }
  }

  return levelConfig[milestones[milestones.length - 1]];
}

function getTranscendenceCoefficient(type, stat, star) {
  const growthType = resolveGrowthType(type);
  const config = CHARACTER_GROWTH_CONFIGS[growthType];
  let starConfig = null;

  if (config && config.transcendence) {
    for (let currentStar = clampTranscendenceStar(star); currentStar >= MIN_TRANSCENDENCE_STAR; currentStar -= 1) {
      if (config.transcendence[currentStar]) {
        starConfig = config.transcendence[currentStar];
        break;
      }
    }
  }

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
    return { ...saved, unlockedStage, clearedStages, growth };
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
