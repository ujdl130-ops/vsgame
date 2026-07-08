// Formation screen interactions.

const FORMATION_MAX_LEVEL = typeof MAX_GROWTH_LEVEL === "number" ? MAX_GROWTH_LEVEL : 50;
const FORMATION_MAX_STAR = typeof MAX_TRANSCENDENCE_STAR === "number" ? MAX_TRANSCENDENCE_STAR : 5;

const FORMATION_BASE_UNITS = [
  {
    id: "guard",
    name: "방패병",
    image: "assets/maps/formation/guardpng.png",
    baseLevel: 1,
    maxLevel: FORMATION_MAX_LEVEL,
    attack: 10,
    hp: 115,
    defense: 0,
    range: 42,
    attackSpeed: 1.0,
    rarity: "normal",
    ability: "방패 대형: 전방에서 적의 진격을 막아 아군을 보호합니다.",
  },
  {
    id: "saintess",
    name: "성녀",
    image: "assets/maps/formation/saint.png",
    baseLevel: 1,
    maxLevel: FORMATION_MAX_LEVEL,
    attack: 0,
    hp: 54,
    defense: 0,
    healAmount: 8,
    range: 130,
    attackSpeed: 1.2,
    rarity: "normal",
    ability: "치유의 기도: 주변 아군의 체력을 회복합니다.",
  },
  {
    id: "archer",
    name: "궁수",
    image: "assets/maps/formation/archer.png",
    baseLevel: 1,
    maxLevel: FORMATION_MAX_LEVEL,
    attack: 13,
    hp: 48,
    defense: 0,
    range: 175,
    attackSpeed: 0.85,
    rarity: "normal",
    ability: "정밀 사격: 먼 거리의 적을 안정적으로 공격합니다.",
  },
  {
    id: "thief",
    name: "도적",
    image: "assets/maps/formation/fighter.png",
    baseLevel: 1,
    maxLevel: FORMATION_MAX_LEVEL,
    attack: 28,
    hp: 58,
    defense: 0,
    range: 36,
    attackSpeed: 1.35,
    rarity: "normal",
    ability: "급습: 빠르게 접근해 높은 피해를 줍니다.",
  },
  {
    id: "mage",
    name: "마법사",
    image: "assets/maps/formation/magic.png",
    baseLevel: 1,
    maxLevel: FORMATION_MAX_LEVEL,
    attack: 15,
    hp: 42,
    defense: 0,
    range: 155,
    attackSpeed: 1.2,
    rarity: "normal",
    ability: "비전탄: 마력 투사체로 적을 공격합니다.",
  },
];

const FORMATION_ROSTER_UNITS = Array.from({ length: 12 }, (_, index) => {
  const source = FORMATION_BASE_UNITS[index % FORMATION_BASE_UNITS.length];
  const pagePenalty = Math.floor(index / FORMATION_BASE_UNITS.length);
  const level = Math.max(1, source.baseLevel - pagePenalty);
  const levelDelta = level - source.baseLevel;

  return {
    ...source,
    baseId: source.id,
    instanceId: `${source.id}-${index + 1}`,
    level,
    star: 1,
    shards: 0,
    attack: Math.max(0, source.attack + levelDelta * 12),
    hp: Math.max(1, source.hp + levelDelta * 70),
    defense: Math.max(0, source.defense + levelDelta * 6),
  };
});

const FORMATION_OWNED_UNIT_LIMIT = 5;

const FORMATION_UNIT_ESSENCE_META = {
  guard: { key: "guardEssence", name: "방패병 정수" },
  archer: { key: "archerEssence", name: "궁수 정수" },
  thief: { key: "thiefEssence", name: "도적 정수" },
  mage: { key: "mageEssence", name: "마법사 정수" },
  saintess: { key: "saintessEssence", name: "성녀 정수" },
};

const FORMATION_HERO_FRAGMENT_COST = 40;
const FORMATION_HERO_MAX_STAR = FORMATION_MAX_STAR;
const FORMATION_HERO_BASE_STAR = 1;
const FORMATION_POSEIDON_UNLOCK_ESSENCE_COST = 100;
const FORMATION_HERO_GROWTH_VERSION = 4;

const FORMATION_HEROES = [
  {
    id: "zeus",
    name: "제우스",
    image: "assets/maps/formation/zeus.png",
    backImage: "assets/maps/formation/zeus_back.png",
    unlocked: true,
    passive: "천벌: 일정 영역에 번개를 내려 범위 안의 적에게 지속 피해를 줍니다.",
    skillType: "",
  },
  {
    id: "poseidon",
    name: "포세이돈",
    image: "assets/maps/formation/poseidon.png",
    backImage: "assets/maps/formation/poseidon_back.png",
    unlocked: true,
    passive: "해류의 가호: 적의 진격 속도를 늦춥니다.",
    skillType: "",
  },
  {
    id: "athena",
    name: "아테나",
    image: "assets/maps/formation/atena.png",
    unlocked: false,
    passive: "전술 지휘: 아군의 방어 능력을 강화합니다.",
    skillType: "",
  },
  {
    id: "hades",
    name: "하데스",
    image: "assets/maps/formation/hades.png",
    unlocked: false,
    passive: "명계의 계약: 처치한 적의 힘을 흡수합니다.",
    skillType: "",
  },
  {
    id: "ares",
    name: "아레스",
    image: "assets/maps/formation/ares.png",
    unlocked: false,
    passive: "전쟁의 함성: 아군 공격 속도를 끌어올립니다.",
    skillType: "",
  },
  {
    id: "heracles",
    name: "헤라클레스",
    image: "assets/maps/formation/hercules.png",
    unlocked: false,
    passive: "불굴의 힘: 영웅의 체력이 크게 증가합니다.",
    skillType: "",
  },
];

const formationState = {
  activeCategory: "hero",
  activeType: "deck",
  activePage: 1,
  selectedUnitId: FORMATION_ROSTER_UNITS[0].instanceId,
  selectedHeroId: "zeus",
  heroDetailFlipped: false,
  unitDetailFlipped: false,
  pendingHeroGrowthAction: null,
  pendingHeroPromotionAction: null,
  pendingUnitPromotionAction: null,
  rosterPage: 1,
  pages: {
    deck: { 1: Array(10).fill(null), 2: Array(10).fill(null) },
    tower: { 1: Array(10).fill(null), 2: Array(10).fill(null) },
    unit: { 1: Array(10).fill(null), 2: Array(10).fill(null) },
  },
};

const FORMATION_TYPE_LABELS = {
  deck: "덱",
  tower: "타워",
  unit: "유닛",
};

const FORMATION_CATEGORY_LABELS = {
  hero: "영웅",
  unit: "유닛",
};

function getFormationUnit(unitId) {
  const unit = (
    FORMATION_ROSTER_UNITS.find((unit) => unit.instanceId === unitId || unit.rosterId === unitId) ||
    FORMATION_ROSTER_UNITS.find((unit) => unit.baseId === unitId || unit.id === unitId) ||
    FORMATION_ROSTER_UNITS[0]
  );
  return applyFormationUnitStoredGrowth(unit);
}

function getFormationUnitGrowthMap() {
  if (!playerProgress.unitGrowth || typeof playerProgress.unitGrowth !== "object") {
    playerProgress.unitGrowth = {};
  }
  return playerProgress.unitGrowth;
}

function applyFormationUnitStoredGrowth(unit) {
  if (!unit) return unit;
  unit.star = Math.min(FORMATION_MAX_STAR, Math.max(1, Number(unit.star) || 1));
  unit.maxLevel = FORMATION_MAX_LEVEL;
  if (!playerProgress?.unitGrowth) return unit;
  const saved = playerProgress.unitGrowth[unit.instanceId];
  if (!saved || typeof saved !== "object") return unit;

  const savedStar = Number(saved.star ?? saved.diamondLevel);
  unit.star = Math.min(FORMATION_MAX_STAR, Math.max(1, savedStar || unit.star || 1));
  unit.maxLevel = FORMATION_MAX_LEVEL;
  unit.level = Math.min(unit.maxLevel, Math.max(1, Number(saved.level) || unit.level));
  return unit;
}

function saveFormationUnitGrowth(unit) {
  if (!playerProgress || !unit) return;
  getFormationUnitGrowthMap()[unit.instanceId] = {
    level: unit.level,
    essence: getFormationUnitEssenceInfo(unit).totalAmount,
    star: unit.star || 1,
  };
  saveProgress();
}

function getFormationSlotsForCurrentPage() {
  return formationState.pages[formationState.activeType][formationState.activePage];
}

function ensureFormationOwnedUnits() {
  if (!playerProgress) return FORMATION_ROSTER_UNITS.slice(0, FORMATION_OWNED_UNIT_LIMIT);
  if (!Array.isArray(playerProgress.ownedUnits) || !playerProgress.ownedUnits.length) {
    playerProgress.ownedUnits = FORMATION_ROSTER_UNITS.slice(0, FORMATION_BASE_UNITS.length).map((unit) => unit.instanceId);
    saveProgress();
  }
  playerProgress.ownedUnits = playerProgress.ownedUnits
    .filter((unitId) => FORMATION_ROSTER_UNITS.some((unit) => unit.instanceId === unitId))
    .slice(0, FORMATION_OWNED_UNIT_LIMIT);
  const hasGuard = playerProgress.ownedUnits
    .map((unitId) => getFormationUnit(unitId))
    .some((unit) => unit && unit.baseId === "guard");
  if (!hasGuard && playerProgress.ownedUnits.length < FORMATION_OWNED_UNIT_LIMIT) {
    const guardUnit = FORMATION_ROSTER_UNITS.find((unit) => unit.baseId === "guard");
    if (guardUnit) {
      playerProgress.ownedUnits.push(guardUnit.instanceId);
      saveProgress();
    }
  }
  return playerProgress.ownedUnits.map((unitId) => getFormationUnit(unitId)).filter(Boolean);
}

function addFormationOwnedUnit(baseId) {
  if (!playerProgress) return null;
  const ownedUnits = ensureFormationOwnedUnits();
  if (ownedUnits.length >= FORMATION_OWNED_UNIT_LIMIT) return null;
  const nextUnit = FORMATION_ROSTER_UNITS.find((unit) => unit.baseId === baseId && !playerProgress.ownedUnits.includes(unit.instanceId))
    || FORMATION_ROSTER_UNITS.find((unit) => !playerProgress.ownedUnits.includes(unit.instanceId));
  if (!nextUnit) return null;
  playerProgress.ownedUnits.push(nextUnit.instanceId);
  playerProgress.ownedUnits = playerProgress.ownedUnits.slice(0, FORMATION_OWNED_UNIT_LIMIT);
  saveProgress();
  return nextUnit;
}

function getFormationHero(heroId = formationState.selectedHeroId) {
  const hero = FORMATION_HEROES.find((hero) => hero.id === heroId) || FORMATION_HEROES[0];
  const unlocked = typeof isPlayerHeroUnlocked === "function"
    ? isPlayerHeroUnlocked(hero.id)
    : Boolean(hero.unlocked);
  return { ...hero, unlocked };
}

function isFormationHeroUnlocked(heroId) {
  if (typeof isPlayerHeroUnlocked === "function") return isPlayerHeroUnlocked(heroId);
  const hero = FORMATION_HEROES.find((hero) => hero.id === heroId) || FORMATION_HEROES[0];
  return Boolean(hero.unlocked);
}

function getHeroGrowthMap() {
  if (!playerProgress.heroGrowth || typeof playerProgress.heroGrowth !== "object") {
    playerProgress.heroGrowth = {};
  }

  let changed = false;
  FORMATION_HEROES.forEach((hero) => {
    const saved = playerProgress.heroGrowth[hero.id];
    const legacyZeusGrowth = hero.id === "zeus" && playerProgress.growth && typeof playerProgress.growth.hero === "object"
      ? playerProgress.growth.hero
      : {};
    const source = saved && typeof saved === "object"
      ? { ...legacyZeusGrowth, ...saved }
      : legacyZeusGrowth;
    const starLevel = Math.min(
      FORMATION_HERO_MAX_STAR,
      Math.max(FORMATION_HERO_BASE_STAR, Number(source.starLevel ?? source.star) || FORMATION_HERO_BASE_STAR)
    );
    const level = Math.min(FORMATION_MAX_LEVEL, Math.max(1, Number(source.level) || 1));

    if (
      !saved
      || typeof saved !== "object"
      || Number(saved.level) !== level
      || Number(saved.starLevel ?? saved.star) !== starLevel
    ) {
      playerProgress.heroGrowth[hero.id] = {
        level,
        starLevel,
        starPiece: Math.max(0, Number(source.starPiece) || 0),
        essence: Math.max(0, Number(source.essence) || 0),
        star: starLevel,
      };
      changed = true;
    }
  });

  const zeusGrowth = playerProgress.heroGrowth.zeus;
  if (zeusGrowth) {
    playerProgress.growth = playerProgress.growth || {};
    const currentLegacy = playerProgress.growth.hero || {};
    if (Number(currentLegacy.level) !== zeusGrowth.level || Number(currentLegacy.starLevel ?? currentLegacy.star) !== zeusGrowth.starLevel) {
      playerProgress.growth.hero = {
        level: zeusGrowth.level,
        star: zeusGrowth.starLevel,
        starLevel: zeusGrowth.starLevel,
        starPiece: Math.max(0, Number(zeusGrowth.starPiece) || 0),
      };
      if (gameState) gameState.growth = playerProgress.growth;
      changed = true;
    }
  }

  if (changed) saveProgress();
  return playerProgress.heroGrowth;
}

function getFormationHeroStar(heroId) {
  const growth = getHeroGrowthMap()[heroId] || {};
  return Math.min(FORMATION_HERO_MAX_STAR, Math.max(FORMATION_HERO_BASE_STAR, Number(growth.starLevel ?? growth.star) || FORMATION_HERO_BASE_STAR));
}

function getFormationHeroLevel(heroId) {
  const star = getFormationHeroStar(heroId);
  const growth = getHeroGrowthMap()[heroId] || {};
  return Math.min(getFormationHeroLevelCap(heroId, star), Math.max(1, Number(growth.level) || 1));
}

function getFormationHeroPromotionPieceCost(starLevel = getFormationHeroStar(formationState.selectedHeroId)) {
  if (typeof getTranscendenceFragmentAmount === "function") {
    return getTranscendenceFragmentAmount("hero", starLevel, starLevel + 1) || FORMATION_HERO_FRAGMENT_COST;
  }
  return FORMATION_HERO_FRAGMENT_COST;
}

function renderFormationHeroStars(starLevel) {
  const filledStars = Math.min(FORMATION_HERO_MAX_STAR, Math.max(0, Number(starLevel) || 0));
  const emptyStars = Math.max(0, FORMATION_HERO_MAX_STAR - filledStars);
  return `${"★".repeat(filledStars)}${"☆".repeat(emptyStars)}`;
}

function setFormationHeroGrowth(heroId, growth = {}) {
  const nextStar = Math.min(FORMATION_HERO_MAX_STAR, Math.max(FORMATION_HERO_BASE_STAR, Number(growth.starLevel ?? growth.star) || getFormationHeroStar(heroId)));
  const nextLevel = Math.min(getFormationHeroLevelCap(heroId, nextStar), Math.max(1, Number(growth.level) || getFormationHeroLevel(heroId)));
  getHeroGrowthMap()[heroId] = {
    level: nextLevel,
    starLevel: nextStar,
    starPiece: 0,
    essence: getFormationHeroEssenceInfo(heroId).totalAmount,
    star: nextStar,
  };

  if (heroId === "zeus") {
    playerProgress.growth = playerProgress.growth || {};
    playerProgress.growth.hero = { level: nextLevel, star: nextStar, starLevel: nextStar, starPiece: 0 };
    if (gameState) gameState.growth = playerProgress.growth;
  }

  saveProgress();
}

function getFormationHeroEssenceMeta(heroId) {
  const hero = typeof getGodHeroById === "function" ? getGodHeroById(heroId) : null;
  if (hero && hero.essenceKey) {
    return {
      key: hero.essenceKey,
      name: hero.essenceName || `${hero.name || "영웅"} 정수`,
    };
  }

  const fallbackEssences = {
    zeus: { key: "lightningEssence", name: "번개의 정수" },
    poseidon: { key: "seaEssence", name: "바다의 정수" },
    hades: { key: "soulEssence", name: "영혼의 정수" },
    athena: { key: "wisdomEssence", name: "지혜의 정수" },
    ares: { key: "warEssence", name: "전쟁의 정수" },
    heracles: { key: "strengthEssence", name: "힘의 정수" },
  };

  return fallbackEssences[heroId] || { key: "", name: "전용 정수" };
}

function getFormationHeroEssenceIcon(heroId) {
  const iconMap = {
    zeus: "assets/icons/essence_zeus.png",
    poseidon: "assets/icons/essence_poseidon.png",
    hades: "assets/icons/essence_hades.png",
    athena: "assets/icons/essence_athena.png",
    ares: "assets/icons/essence_ares.png",
    heracles: "assets/icons/essence_hercules.png",
  };
  return iconMap[heroId] || "assets/icons/essence_all.png";
}

function getFormationHeroEssenceInfo(heroId = formationState.selectedHeroId, requiredAmount = 0) {
  const meta = getFormationHeroEssenceMeta(heroId);
  const specificAmount = Math.max(0, Number(playerProgress.essences?.[meta.key]) || 0);
  const commonAmount = Math.max(0, Number(playerProgress.commonEssence) || 0);
  const totalAmount = specificAmount + commonAmount;
  const cost = Math.max(0, Number(requiredAmount) || 0);
  const specificSpend = Math.min(specificAmount, cost);
  const commonSpend = Math.max(0, cost - specificSpend);

  return {
    ...meta,
    specificAmount,
    commonAmount,
    totalAmount,
    cost,
    canAfford: totalAmount >= cost,
    specificSpend,
    commonSpend,
  };
}

function getFormationHeroFragmentAmount(heroId = formationState.selectedHeroId) {
  return getFormationHeroEssenceInfo(heroId).totalAmount;
}

function getFormationHeroEssenceSpendLabel(heroId, requiredAmount) {
  const info = getFormationHeroEssenceInfo(heroId, requiredAmount);
  const parts = [];
  if (info.specificSpend > 0) parts.push(`${info.name} ${info.specificSpend.toLocaleString("ko-KR")}개`);
  if (info.commonSpend > 0) parts.push(`공통 신의정수 ${info.commonSpend.toLocaleString("ko-KR")}개`);
  return parts.join(" + ") || "정수 0개";
}

function consumeFormationHeroEssences(heroId, requiredAmount) {
  const info = getFormationHeroEssenceInfo(heroId, requiredAmount);
  if (!info.canAfford) return false;

  playerProgress.essences = playerProgress.essences || {};
  if (info.key && info.specificSpend > 0) {
    playerProgress.essences[info.key] = Math.max(0, info.specificAmount - info.specificSpend);
  }
  if (info.commonSpend > 0) {
    playerProgress.commonEssence = Math.max(0, info.commonAmount - info.commonSpend);
  }
  return true;
}

function getFormationHeroUnlockCost(heroId) {
  return heroId === "poseidon" ? FORMATION_POSEIDON_UNLOCK_ESSENCE_COST : null;
}

function canUnlockFormationHero(heroId) {
  const cost = getFormationHeroUnlockCost(heroId);
  if (!cost || isFormationHeroUnlocked(heroId)) return false;
  const info = getFormationHeroEssenceInfo(heroId, cost);
  return info.specificAmount >= cost;
}

function unlockFormationHero(heroId = formationState.selectedHeroId) {
  const hero = getFormationHero(heroId);
  const cost = getFormationHeroUnlockCost(hero.id);
  if (!cost) {
    showFormationMessage("아직 해금할 수 없는 영웅입니다.", "warning");
    return;
  }
  if (isFormationHeroUnlocked(hero.id)) {
    showFormationMessage(`${hero.name}은 이미 해금되었습니다.`);
    renderFormationSlots();
    renderFormationRoster();
    return;
  }
  const info = getFormationHeroEssenceInfo(hero.id, cost);
  if (info.specificAmount < cost) {
    showFormationMessage(`${info.name} ${cost.toLocaleString("ko-KR")}개가 필요합니다.`, "warning");
    return;
  }
  playerProgress.essences[info.key] = Math.max(0, info.specificAmount - cost);
  if (window.PlayerAPI?.unlockPlayerHero) {
    window.PlayerAPI.unlockPlayerHero(hero.id);
  } else {
    playerProgress.ownedGods = playerProgress.ownedGods || {};
    playerProgress.ownedGods[hero.id] = { id: hero.id, name: hero.name, owned: true };
    saveProgress();
  }
  formationState.selectedHeroId = hero.id;
  if (typeof setSelectedHeroId === "function") setSelectedHeroId(hero.id);
  updateWalletDisplays();
  if (window.GameAudio) window.GameAudio.playRewardGetSfx();
  showFormationMessage(`${hero.name}이(가) 해금되었습니다.`);
  renderFormationRoster();
  renderFormationSlots();
}

function initializeFormationHeroGrowthDefaults() {
  if (playerProgress.heroGrowthVersion !== FORMATION_HERO_GROWTH_VERSION) {
    const previousGrowth = playerProgress.heroGrowth && typeof playerProgress.heroGrowth === "object"
      ? playerProgress.heroGrowth
      : {};
    playerProgress.heroGrowth = {};
    FORMATION_HEROES.forEach((hero) => {
      const saved = previousGrowth[hero.id] || {};
      const starLevel = Math.min(FORMATION_HERO_MAX_STAR, Math.max(FORMATION_HERO_BASE_STAR, Number(saved.starLevel ?? saved.star) || FORMATION_HERO_BASE_STAR));
      playerProgress.heroGrowth[hero.id] = {
        level: Math.min(FORMATION_MAX_LEVEL, Math.max(1, Number(saved.level) || 1)),
        starLevel,
        starPiece: 0,
        essence: getFormationHeroEssenceInfo(hero.id).totalAmount,
        star: starLevel,
      };
    });
    playerProgress.heroGrowthVersion = FORMATION_HERO_GROWTH_VERSION;
    playerProgress.growth = playerProgress.growth || {};
    const zeusGrowth = playerProgress.heroGrowth.zeus || { level: 1, starLevel: FORMATION_HERO_BASE_STAR, starPiece: 0 };
    playerProgress.growth.hero = {
      level: zeusGrowth.level,
      star: zeusGrowth.starLevel,
      starLevel: zeusGrowth.starLevel,
      starPiece: 0,
    };
    if (gameState) gameState.growth = playerProgress.growth;
    saveProgress();
    return;
  }

  FORMATION_HEROES.forEach((hero) => {
    const growth = getHeroGrowthMap()[hero.id] || {};
    if (Number(growth.starLevel ?? growth.star) >= FORMATION_HERO_BASE_STAR && Number(growth.level) >= 1) return;
    setFormationHeroGrowth(hero.id, {
      starLevel: Math.max(FORMATION_HERO_BASE_STAR, Number(growth.starLevel ?? growth.star) || FORMATION_HERO_BASE_STAR),
      starPiece: 0,
      level: Math.max(1, Number(growth.level) || 1),
    });
  });
}

function getFormationHeroLevelCap(heroId, star = getFormationHeroStar(heroId)) {
  return FORMATION_MAX_LEVEL;
}

function getFormationHeroLevelCost(heroId) {
  const level = getFormationHeroLevel(heroId);
  const star = getFormationHeroStar(heroId);
  if (level >= getFormationHeroLevelCap(heroId)) return 0;

  if (typeof getLevelUpGoldCost === "function") {
    return getLevelUpGoldCost("hero", level, level + 1, { level, star });
  }

  const level29Cost = getNormalCumulativeLevelCost(30) - getNormalCumulativeLevelCost(29);
  const overLevel = Math.max(1, level - 29);
  return Math.ceil(level29Cost * 1.25 * (1 + overLevel * 0.08));
}

function getFormationHeroGrowthAction(heroId = formationState.selectedHeroId) {
  const star = getFormationHeroStar(heroId);
  const level = getFormationHeroLevel(heroId);
  const levelCap = getFormationHeroLevelCap(heroId, star);

  if (level < levelCap) {
    const cost = getFormationHeroLevelCost(heroId);
    if (cost !== null) return { type: "level", cost, nextLevel: level + 1 };
    const requiredStar = typeof getRequiredTranscendenceStarForLevel === "function"
      ? getRequiredTranscendenceStarForLevel(level + 1)
      : star + 1;
    return { type: "locked", cost: null, nextLevel: level + 1, requiredStar };
  }
  return { type: "max", cost: 0 };
}

function getFormationHeroGrowthActionKey(heroId, action) {
  if (!action || action.type === "max") return "";
  return `${heroId}:${action.type}:${action.nextLevel || action.nextStar || 0}`;
}

function getFormationHeroPromotionAction(heroId = formationState.selectedHeroId) {
  const starLevel = getFormationHeroStar(heroId);
  if (starLevel >= FORMATION_HERO_MAX_STAR) return { type: "max", cost: 0, starLevel, nextStar: starLevel };
  return {
    type: "star",
    cost: getFormationHeroPromotionPieceCost(starLevel),
    starLevel,
    nextStar: starLevel + 1,
  };
}

function getFormationHeroPromotionActionKey(heroId, action) {
  if (!action || action.type !== "star") return "";
  return `${heroId}:star:${action.starLevel}`;
}

function getFormationHeroStats(heroId = formationState.selectedHeroId) {
  const star = getFormationHeroStar(heroId);
  const level = getFormationHeroLevel(heroId);
  const definition = typeof getHeroDefinition === "function" ? getHeroDefinition(heroId) : null;
  const stats = getGrownStats("hero", {
    hp: definition?.baseHp || 180,
    damage: definition?.baseDamage || 34,
  }, { level, star });

  return {
    level,
    star,
    hp: stats.hp,
    damage: stats.damage,
    range: definition?.range || 275,
    attackSpeed: definition?.attackSpeed || 0.48,
  };
}

function getFormationUnitFragmentAmount() {
  return Math.max(0, Number(playerProgress.soldierFragments) || 0);
}

function getFormationUnitEssenceMeta(unit = getFormationUnit(formationState.selectedUnitId)) {
  return FORMATION_UNIT_ESSENCE_META[unit?.baseId] || { key: "", name: `${unit?.name || "유닛"} 정수` };
}

function getFormationUnitEssenceInfo(unit = getFormationUnit(formationState.selectedUnitId), requiredAmount = 0) {
  const meta = getFormationUnitEssenceMeta(unit);
  const specificAmount = 0;
  const commonAmount = getFormationUnitFragmentAmount();
  const totalAmount = commonAmount;
  const cost = Math.max(0, Number(requiredAmount) || 0);
  const specificSpend = 0;
  const commonSpend = cost;

  return {
    ...meta,
    specificAmount,
    commonAmount,
    totalAmount,
    cost,
    canAfford: totalAmount >= cost,
    specificSpend,
    commonSpend,
  };
}

function getFormationUnitEssenceSpendLabel(unit, requiredAmount) {
  const info = getFormationUnitEssenceInfo(unit, requiredAmount);
  return info.commonSpend > 0 ? `병사정수 ${info.commonSpend.toLocaleString("ko-KR")}개` : "병사정수 0개";
}

function consumeFormationUnitEssences(unit, requiredAmount) {
  const info = getFormationUnitEssenceInfo(unit, requiredAmount);
  if (!info.canAfford) return false;

  if (info.commonSpend > 0) {
    playerProgress.soldierFragments = Math.max(0, info.commonAmount - info.commonSpend);
  }
  return true;
}

function getFormationUnitStats(unit = getFormationUnit(formationState.selectedUnitId)) {
  const level = Math.min(FORMATION_MAX_LEVEL, Math.max(1, Number(unit.level) || 1));
  const star = Math.min(FORMATION_MAX_STAR, Math.max(1, Number(unit.star) || 1));
  const baseStats = {
    hp: unit.hp,
    damage: unit.attack,
  };
  if (unit.baseId === "saintess") {
    baseStats.healAmount = unit.healAmount || 8;
  }
  const grownStats = typeof getGrownStats === "function"
    ? getGrownStats(unit.baseId || unit.id || "guard", baseStats, { level, star })
    : { level, star, ...baseStats };

  return {
    level,
    star,
    hp: grownStats.hp || unit.hp,
    damage: unit.baseId === "saintess" ? 0 : (grownStats.damage || unit.attack),
    healAmount: unit.baseId === "saintess" ? (grownStats.healAmount || unit.healAmount || 8) : undefined,
    defense: unit.defense,
    range: unit.range || 42,
    attackSpeed: unit.attackSpeed || 1.0,
  };
}

function getNormalCumulativeLevelCost(level) {
  if (typeof getCumulativeLevelUpGold === "function") {
    return getCumulativeLevelUpGold("guard", level);
  }
  return 0;
}

function getFormationCumulativeLevelCost(unit, level) {
  const growthType = unit && unit.rarity === "hero" ? "hero" : "guard";
  if (typeof getCumulativeLevelUpGold === "function") {
    return getCumulativeLevelUpGold(growthType, level);
  }

  const normalCost = getNormalCumulativeLevelCost(level);
  return unit && unit.rarity === "hero" ? Math.ceil(normalCost * 1.25) : normalCost;
}

function getFormationLevelUpCost(unit) {
  if (!unit || unit.level >= unit.maxLevel) return 0;
  const growthType = unit.rarity === "hero" ? "hero" : (unit.baseId || unit.id || "guard");

  if (typeof getLevelUpGoldCost === "function") {
    return getLevelUpGoldCost(growthType, unit.level, unit.level + 1, {
      level: unit.level,
      star: unit.star,
    });
  }

  return getFormationCumulativeLevelCost(unit, unit.level + 1) - getFormationCumulativeLevelCost(unit, unit.level);
}

function getFormationTranscendCost(unit) {
  if (!unit || unit.star >= FORMATION_MAX_STAR) return null;
  if (typeof getTranscendenceFragmentAmount === "function") {
    return getTranscendenceFragmentAmount(unit.baseId || unit.id || "guard", unit.star, unit.star + 1);
  }
  const fallbackCosts = { 1: 20, 2: 30, 3: 50, 4: 80 };
  return fallbackCosts[unit.star] || null;
}

function getFormationLevelRequirement(unit) {
  if (!unit || unit.level >= unit.maxLevel) return null;
  const nextLevel = unit.level + 1;
  const requiredStar = typeof getRequiredTranscendenceStarForLevel === "function"
    ? getRequiredTranscendenceStarForLevel(nextLevel)
    : nextLevel > 40 ? 5 : nextLevel > 30 ? 4 : 1;
  return unit.star < requiredStar ? requiredStar : null;
}

function getFormationLevelUpLockLabel(unit) {
  if (!unit) return "선택 필요";
  if (unit.level >= unit.maxLevel) return "MAX";

  const requiredStar = getFormationLevelRequirement(unit);
  if (requiredStar) return `${requiredStar}초월 필요`;

  const cost = getFormationLevelUpCost(unit);
  if (cost === null) return "조건 미충족";
  return "";
}

function getFormationUnitGrowthAction(unit = getFormationUnit(formationState.selectedUnitId)) {
  if (!unit) return { type: "none", cost: 0 };

  if (unit.level < unit.maxLevel) {
    const cost = getFormationLevelUpCost(unit);
    if (cost !== null) {
      return { type: "level", cost, nextLevel: unit.level + 1 };
    }
    return { type: "locked", cost: null, nextLevel: unit.level + 1, requiredStar: getFormationLevelRequirement(unit) };
  }

  return { type: "max", cost: 0 };
}

function getFormationUnitPromotionAction(unit = getFormationUnit(formationState.selectedUnitId)) {
  if (!unit) return { type: "none", cost: 0 };
  const star = Math.min(FORMATION_MAX_STAR, Math.max(1, Number(unit.star) || 1));
  if (star >= FORMATION_MAX_STAR) return { type: "max", cost: 0, star, nextStar: star };
  return {
    type: "star",
    cost: getFormationTranscendCost(unit),
    star,
    nextStar: star + 1,
  };
}

function getFormationUnitPromotionActionKey(unit, action) {
  if (!unit || !action || action.type !== "star") return "";
  return `${unit.instanceId}:star:${action.star}`;
}

function showFormationMessage(message, tone = "info") {
  const notice = document.getElementById("formationNotice");
  if (!notice) return;
  notice.textContent = message;
  notice.classList.toggle("is-warning", tone === "warning");
}

function createFormationShellMarkup() {
  return `
    <div class="formation-scanline" aria-hidden="true"></div>

    <button id="formationBackBtn" class="formation-ui-btn formation-back-btn" type="button">로비</button>
    <button id="formationCloseBtn" class="formation-ui-btn formation-close-btn" type="button">인벤토리</button>

    <div class="formation-topbar" aria-label="재화 정보">
      <div class="formation-currency blue"><span>다이아</span><strong data-wallet-value="diamond">0</strong></div>
      <div class="formation-currency gold"><span>골드</span><strong data-wallet-value="gold">0</strong></div>
      <button class="formation-gear" type="button" aria-label="설정">⚙</button>
    </div>

    <div class="formation-shell">
      <aside class="formation-brand-panel" aria-label="편성 로고">
        <div class="formation-brand-emblem" aria-hidden="true">✦</div>
        <strong>편성</strong>
        <span>FORMATION</span>
        <nav class="formation-category-nav" aria-label="편성 카테고리">
          <button class="formation-category-btn is-active" type="button" data-formation-category="hero">영웅</button>
          <button class="formation-category-btn" type="button" data-formation-category="unit">유닛</button>
        </nav>
      </aside>

      <section class="formation-main-panel">
        <header class="formation-header-row">
          <div class="formation-title-box">
            <p class="formation-kicker">FORMATION</p>
            <h1 id="formationTitle" class="formation-logo">덱 편성</h1>
          </div>
          <div class="formation-type-tabs" aria-label="편성 종류">
            <button class="formation-type-tab is-active" type="button" data-formation-type="deck">덱</button>
            <button class="formation-type-tab" type="button" data-formation-type="tower">타워</button>
            <button class="formation-type-tab" type="button" data-formation-type="unit">유닛</button>
          </div>
        </header>

        <div class="formation-placement-head">
          <span id="formationSlotTitle">덱 배치 슬롯 (0/10)</span>
        </div>

        <div class="formation-slots-panel" aria-label="배치 슬롯">
          <div id="formationSlotGrid" class="formation-slot-grid"></div>
          <div class="formation-deck-tabs" aria-label="편성 페이지">
            <button class="formation-deck-tab is-active" type="button" data-deck-page="1">1</button>
            <button class="formation-deck-tab" type="button" data-deck-page="2">2</button>
          </div>
          <p id="formationNotice" class="formation-notice" aria-live="polite">보유 유닛을 선택한 뒤 빈 슬롯을 누르면 배치됩니다.</p>
        </div>
      </section>

      <aside class="formation-roster-panel" aria-label="보유 유닛 목록">
        <div class="formation-roster-head">
          <strong>보유 유닛</strong>
          <span id="formationRosterCount">12 / 12</span>
        </div>
        <div id="formationRosterGrid" class="formation-roster-grid" aria-label="보유 유닛 카드"></div>
        <div class="formation-roster-pager" aria-label="보유 유닛 페이지">
          <button class="formation-roster-page-btn is-active" type="button" data-roster-page="1">1</button>
          <button class="formation-roster-page-btn" type="button" data-roster-page="2">2</button>
          <button class="formation-roster-page-btn" type="button" data-roster-page="3">3</button>
        </div>

        <div class="formation-selected-info" aria-label="선택한 유닛 정보">
          <h2>선택한 유닛 정보</h2>
          <div class="formation-selected-body">
            <div id="formationSelectedCard" class="formation-selected-card"></div>
            <div class="formation-selected-stats">
              <div class="formation-selected-name-row">
                <strong id="formationSelectedName"></strong>
                <span id="formationSelectedLevel"></span>
              </div>
              <dl>
                <div><dt>공격력</dt><dd id="formationSelectedAttack"></dd></div>
                <div><dt>체력</dt><dd id="formationSelectedHp"></dd></div>
                <div><dt>방어력</dt><dd id="formationSelectedDefense"></dd></div>
              </dl>
              <button id="formationLevelUpBtn" class="formation-level-btn" type="button">레벨업 <span></span></button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  `;
}

function renderFormationUnitCard(unit, options = {}) {
  const selectedClass = options.selected ? " is-selected" : "";
  return `
    <button class="formation-unit-card${selectedClass}" type="button" data-unit-id="${unit.instanceId}" aria-label="${unit.name}">
      <img src="${unit.image}" alt="${unit.name}">
      <span class="formation-unit-name">${unit.name}</span>
    </button>
  `;
}

function renderFormationHeroCard(hero, options = {}) {
  const selectedClass = options.selected ? " is-selected" : "";
  const unlocked = isFormationHeroUnlocked(hero.id);
  const selectableLocked = !unlocked && getFormationHeroUnlockCost(hero.id);
  const lockedClass = unlocked ? "" : " is-locked";
  const star = getFormationHeroStar(hero.id);
  const level = getFormationHeroLevel(hero.id);
  const lockMarkup = unlocked ? "" : `<span class="formation-hero-lock" aria-hidden="true">🔒</span>`;

  return `
    <button class="formation-unit-card formation-hero-card${selectedClass}${lockedClass}" type="button" data-hero-id="${hero.id}" ${unlocked || selectableLocked ? "" : "disabled"} aria-label="${hero.name}">
      <img src="${hero.image}" alt="${hero.name}">
      ${lockMarkup}
      <span class="formation-unit-name">${hero.name}</span>
      <span class="formation-unit-level">${renderFormationHeroStars(star)} Lv.${level}</span>
    </button>
  `;
}

function renderFormationHeroDetail() {
  const hero = getFormationHero();
  const star = getFormationHeroStar(hero.id);
  const level = getFormationHeroLevel(hero.id);
  const levelCap = getFormationHeroLevelCap(hero.id);
  const action = getFormationHeroGrowthAction(hero.id);
  const promotionAction = getFormationHeroPromotionAction(hero.id);
  const essenceInfo = getFormationHeroEssenceInfo(hero.id, promotionAction.cost);
  const actionKey = getFormationHeroGrowthActionKey(hero.id, action);
  const promotionActionKey = getFormationHeroPromotionActionKey(hero.id, promotionAction);
  const isPending = formationState.pendingHeroGrowthAction === actionKey;
  const isPromotionPending = formationState.pendingHeroPromotionAction === promotionActionKey;
  const unlockCost = getFormationHeroUnlockCost(hero.id);
  const unlockInfo = getFormationHeroEssenceInfo(hero.id, unlockCost || 0);
  const stats = getFormationHeroStats(hero.id);
  const isLevelMax = level >= FORMATION_MAX_LEVEL && star >= FORMATION_HERO_MAX_STAR;
  const levelLabel = isLevelMax
    ? "MAX"
    : action.type === "level"
      ? action.cost.toLocaleString("ko-KR")
      : action.type === "locked"
        ? `${action.requiredStar}초월 필요`
        : "MAX";
  const pendingMessage = action.type === "level"
    ? `골드 ${action.cost.toLocaleString("ko-KR")}을 소모해 Lv.${action.nextLevel}로 성장시킵니다.`
    : "";
  const levelCostMarkup = action.type === "level"
    ? `<span class="formation-btn-cost"><img src="assets/icons/gold.png" alt="">${action.cost.toLocaleString("ko-KR")}</span>`
    : `<span class="formation-btn-cost">${levelLabel}</span>`;
  const promoteCostMarkup = promotionAction.type === "star" ? `
    <span class="formation-btn-cost formation-promote-cost">
      <img src="${getFormationHeroEssenceIcon(hero.id)}" alt="">${essenceInfo.specificAmount.toLocaleString("ko-KR")}
      <b>+</b>
      <img src="assets/icons/essence_all.png" alt="">${essenceInfo.commonAmount.toLocaleString("ko-KR")}
      <em>/ ${promotionAction.cost}</em>
    </span>
  ` : `<span class="formation-btn-cost">MAX</span>`;
  const promotionMessage = `${getFormationHeroEssenceSpendLabel(hero.id, promotionAction.cost)}를 사용해 ${promotionAction.nextStar}성으로 초월합니다.`;

  return `
    <div class="formation-hero-detail">
      <button class="formation-hero-detail-card${formationState.heroDetailFlipped ? " is-flipped" : ""}" type="button" aria-label="${hero.name} 스탯 보기">
        <span class="formation-hero-flip-inner">
          <span class="formation-hero-flip-face formation-hero-flip-front">
            <img src="${hero.image}" alt="${hero.name}">
          </span>
          <span class="formation-hero-flip-face formation-hero-flip-back formation-hero-back-${hero.id}">
            <div class="formation-hero-back-stats">
              <strong>${hero.name}</strong>
              <em>일반 스탯</em>
              <span>공격력 <b>${stats.damage}</b></span>
              <span>체력 <b>${stats.hp}</b></span>
              <span>사거리 <b>${stats.range}</b></span>
              <span>공격속도 <b>${stats.attackSpeed.toFixed(2)}</b></span>
            </div>
          </span>
        </span>
      </button>
      <div class="formation-hero-detail-info">
        <div class="formation-hero-detail-top">
          <p class="formation-kicker">HERO</p>
          <h2>${hero.name}</h2>
          <div class="formation-hero-stars" aria-label="현재 성급">${renderFormationHeroStars(star)}</div>
        </div>
        <dl class="formation-hero-detail-list">
          <div><dt>패시브 능력</dt><dd>${hero.passive}</dd></div>
          <div><dt>현재 초월</dt><dd>${star}성 / ${FORMATION_HERO_MAX_STAR}성</dd></div>
          <div><dt>현재 레벨</dt><dd>Lv.${level} / ${levelCap}</dd></div>
        </dl>
        <div class="formation-growth-actions">
          ${!hero.unlocked && unlockCost ? `
          <button id="formationHeroUnlockBtn" class="formation-level-btn formation-hero-level-btn formation-unlock-btn" type="button" ${unlockInfo.specificAmount >= unlockCost ? "" : "disabled"}>
            해금 <span class="formation-btn-cost"><img src="${getFormationHeroEssenceIcon(hero.id)}" alt="">${unlockInfo.specificAmount.toLocaleString("ko-KR")} / ${unlockCost.toLocaleString("ko-KR")}</span>
          </button>
          ` : `
          <button id="formationHeroLevelUpBtn" class="formation-level-btn formation-hero-level-btn" type="button" ${hero.unlocked && action.type === "level" ? "" : "disabled"}>
            레벨업 ${levelCostMarkup}
          </button>
          <button id="formationHeroPromoteBtn" class="formation-level-btn formation-hero-level-btn formation-promote-btn" type="button" ${hero.unlocked && promotionAction.type === "star" && essenceInfo.canAfford ? "" : "disabled"}>
            초월 ${promoteCostMarkup}
          </button>
          `}
        </div>
        ${isPending || isPromotionPending ? `
          <div class="formation-growth-confirm" role="dialog" aria-label="영웅 성장 확인">
            <p>${isPromotionPending ? promotionMessage : pendingMessage}</p>
            <div>
              <button id="formationHeroGrowthConfirmBtn" type="button">진행</button>
              <button id="formationHeroGrowthCancelBtn" type="button">취소</button>
            </div>
          </div>
        ` : ""}
      </div>
    </div>
  `;
}

function renderFormationSlotCard(unitId, index) {
  const unit = unitId ? getFormationUnit(unitId) : null;
  if (!unit) {
    return `
      <button class="formation-slot formation-slot-add" type="button" data-slot-index="${index}" aria-label="빈 슬롯 ${index + 1}">
        <span>${index + 1}</span>
        <i>+</i>
      </button>
    `;
  }

  return `
    <div class="formation-slot is-filled" data-slot-index="${index}" aria-label="${index + 1}번 슬롯 ${unit.name}">
      <em>${index + 1}</em>
      <img src="${unit.image}" alt="${unit.name}">
      <button class="formation-slot-remove" type="button" data-slot-index="${index}" aria-label="${unit.name} 배치 해제">×</button>
      <strong>${unit.name}</strong>
      <small>Lv.${unit.level}</small>
    </div>
  `;
}

function renderFormationSlots() {
  const slotGrid = document.getElementById("formationSlotGrid");
  if (!slotGrid) return;

  const slotsPanel = document.querySelector(".formation-slots-panel");
  const deckTabs = document.querySelector(".formation-deck-tabs");
  if (formationState.activeCategory === "hero") {
    if (slotsPanel) slotsPanel.classList.add("is-hero-detail");
    if (deckTabs) deckTabs.classList.add("is-hidden");
    slotGrid.classList.add("is-hero-detail-grid");
    slotGrid.innerHTML = renderFormationHeroDetail();
    const detailCard = slotGrid.querySelector(".formation-hero-detail-card");
    const heroUnlockBtn = document.getElementById("formationHeroUnlockBtn");
    const levelUpBtn = document.getElementById("formationHeroLevelUpBtn");
    const confirmBtn = document.getElementById("formationHeroGrowthConfirmBtn");
    const cancelBtn = document.getElementById("formationHeroGrowthCancelBtn");
    if (detailCard) detailCard.addEventListener("click", toggleFormationHeroDetailFlip);
    if (heroUnlockBtn) heroUnlockBtn.addEventListener("click", () => unlockFormationHero());
    if (levelUpBtn) levelUpBtn.addEventListener("click", levelUpFormationHero);
    if (confirmBtn) confirmBtn.addEventListener("click", confirmFormationHeroGrowth);
    if (cancelBtn) cancelBtn.addEventListener("click", cancelFormationHeroGrowth);

    const slotTitle = document.getElementById("formationSlotTitle");
    if (slotTitle) slotTitle.textContent = "영웅";
    return;
  }

  if (slotsPanel) slotsPanel.classList.remove("is-hero-detail");
  if (deckTabs) deckTabs.classList.remove("is-hidden");
  slotGrid.classList.remove("is-hero-detail-grid");

  const slots = getFormationSlotsForCurrentPage();
  slotGrid.innerHTML = slots.map((unitId, index) => renderFormationSlotCard(unitId, index)).join("");
  slotGrid.querySelectorAll(".formation-slot-add").forEach((slot) => {
    slot.addEventListener("click", () => handleFormationSlotClick(Number(slot.dataset.slotIndex)));
  });
  slotGrid.querySelectorAll(".formation-slot-remove").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      removeFormationSlot(Number(button.dataset.slotIndex));
    });
  });

  const placedCount = slots.filter(Boolean).length;
  const slotTitle = document.getElementById("formationSlotTitle");
  if (slotTitle) slotTitle.textContent = `${FORMATION_TYPE_LABELS[formationState.activeType]} 배치 슬롯 (${placedCount}/10)`;
}

function renderFormationRoster() {
  const rosterGrid = document.getElementById("formationRosterGrid");
  const rosterCount = document.getElementById("formationRosterCount");
  if (!rosterGrid) return;

  const rosterTitle = document.querySelector(".formation-roster-head strong");
  const selectedInfo = document.querySelector(".formation-selected-info");
  const rosterPager = document.querySelector(".formation-roster-pager");
  const isDeck = formationState.activeType === "deck";

  if (formationState.activeCategory === "hero") {
    if (rosterTitle) rosterTitle.textContent = "보유 영웅";
    if (rosterCount) rosterCount.textContent = "2 / 6";
    if (selectedInfo) selectedInfo.classList.add("is-hidden");
    if (rosterPager) rosterPager.classList.add("is-hidden");
    rosterGrid.classList.add("is-hero-roster");
    rosterGrid.innerHTML = FORMATION_HEROES
      .map((hero) => renderFormationHeroCard(hero, { selected: hero.id === formationState.selectedHeroId }))
      .join("");

    rosterGrid.querySelectorAll(".formation-hero-card:not(:disabled)").forEach((card) => {
      card.addEventListener("click", () => selectFormationHero(card.dataset.heroId));
    });
    return;
  }

  rosterGrid.classList.remove("is-hero-roster");

  if (!isDeck) {
    if (rosterTitle) rosterTitle.textContent = `보유 ${FORMATION_TYPE_LABELS[formationState.activeType]}`;
    if (rosterCount) rosterCount.textContent = "0 / 0";
    rosterGrid.innerHTML = `
      <div class="formation-roster-empty-state">
        <span>+</span>
        <strong>준비 중</strong>
        <p>${FORMATION_TYPE_LABELS[formationState.activeType]} 카드는 아직 제작되지 않았습니다.</p>
      </div>
    `;
    document.querySelectorAll(".formation-roster-page-btn").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.rosterPage === "1");
    });
    if (selectedInfo) selectedInfo.classList.add("is-hidden");
    if (rosterPager) rosterPager.classList.add("is-hidden");
    return;
  }

  if (rosterTitle) rosterTitle.textContent = "보유 유닛";
  if (selectedInfo) selectedInfo.classList.remove("is-hidden");
  if (rosterPager) rosterPager.classList.remove("is-hidden");

  const pageSize = 4;
  const pageCount = Math.ceil(FORMATION_ROSTER_UNITS.length / pageSize);
  formationState.rosterPage = Math.min(Math.max(1, formationState.rosterPage), pageCount);
  const start = (formationState.rosterPage - 1) * pageSize;
  const visibleUnits = FORMATION_ROSTER_UNITS.slice(start, start + pageSize);

  rosterGrid.innerHTML = visibleUnits
    .map((unit) => renderFormationUnitCard(unit, { selected: unit.instanceId === formationState.selectedUnitId }))
    .join("");

  rosterGrid.querySelectorAll(".formation-unit-card").forEach((card) => {
    card.addEventListener("click", () => selectFormationUnit(card.dataset.unitId));
  });

  if (rosterCount) rosterCount.textContent = `${FORMATION_ROSTER_UNITS.length} / ${FORMATION_ROSTER_UNITS.length}`;
  document.querySelectorAll(".formation-roster-page-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.rosterPage === String(formationState.rosterPage));
  });
}

function renderFormationSelectedInfo() {
  const unit = getFormationUnit(formationState.selectedUnitId);
  const card = document.getElementById("formationSelectedCard");
  const name = document.getElementById("formationSelectedName");
  const level = document.getElementById("formationSelectedLevel");
  const attack = document.getElementById("formationSelectedAttack");
  const hp = document.getElementById("formationSelectedHp");
  const defense = document.getElementById("formationSelectedDefense");
  const levelBtn = document.getElementById("formationLevelUpBtn");
  const action = getFormationUnitGrowthAction(unit);

  if (card) {
    card.innerHTML = `<img src="${unit.image}" alt="${unit.name}">`;
  }
  if (name) name.textContent = unit.name;
  if (level) level.textContent = `Lv.${unit.level} / ${unit.maxLevel}`;
  if (attack) attack.textContent = unit.attack;
  if (hp) hp.textContent = unit.hp;
  if (defense) defense.textContent = unit.defense;
  if (levelBtn) {
    const cost = levelBtn.querySelector("span");
    const disabled = action.type === "max" || action.type === "none"
      || (action.type === "star" && action.cost > 0 && !getFormationUnitEssenceInfo(unit, action.cost).canAfford);
    if (cost) {
      cost.textContent = action.type === "star"
        ? `병사정수 ${action.cost.toLocaleString("ko-KR")}`
        : action.type === "level"
          ? action.cost.toLocaleString("ko-KR")
          : "MAX";
    }
    levelBtn.disabled = disabled;
  }
}

function renderFormationTabs() {
  const title = document.getElementById("formationTitle");
  if (title) {
    title.textContent = formationState.activeCategory === "hero"
      ? "영웅"
      : `${FORMATION_TYPE_LABELS[formationState.activeType]} 편성`;
  }

  document.querySelectorAll(".formation-category-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.formationCategory === formationState.activeCategory);
  });

  document.querySelectorAll(".formation-type-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.formationType === formationState.activeType);
  });

  const typeTabs = document.querySelector(".formation-type-tabs");
  if (typeTabs) typeTabs.classList.toggle("is-hidden", formationState.activeCategory === "hero");

  document.querySelectorAll(".formation-deck-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.deckPage === String(formationState.activePage));
  });
}

function renderFormationScreen() {
  if (!formationScreen) return;
  if (!formationScreen.dataset.rendered) {
    formationScreen.innerHTML = createFormationShellMarkup();
    formationScreen.dataset.rendered = "true";
    bindFormationScreenEvents();
  }
  initializeFormationHeroGrowthDefaults();
  renderFormationTabs();
  renderFormationSlots();
  renderFormationRoster();
  renderFormationSelectedInfo();
  updateWalletDisplays();
}

function bindFormationScreenEvents() {
  const backBtn = document.getElementById("formationBackBtn");
  const closeBtn = document.getElementById("formationCloseBtn");
  const levelUpBtn = document.getElementById("formationLevelUpBtn");

  if (backBtn) backBtn.addEventListener("click", showLobby);
  if (closeBtn) closeBtn.addEventListener("click", showInventory);

  document.querySelectorAll(".formation-deck-tab").forEach((tab) => {
    tab.addEventListener("click", () => setFormationDeckPage(tab.dataset.deckPage || "1"));
  });

  document.querySelectorAll(".formation-type-tab").forEach((tab) => {
    tab.addEventListener("click", () => setFormationType(tab.dataset.formationType || "deck"));
  });

  document.querySelectorAll(".formation-category-btn").forEach((button) => {
    button.addEventListener("click", () => setFormationCategory(button.dataset.formationCategory || "hero"));
  });

  document.querySelectorAll(".formation-roster-page-btn").forEach((button) => {
    button.addEventListener("click", () => {
      formationState.rosterPage = Number(button.dataset.rosterPage) || 1;
      renderFormationRoster();
    });
  });
  if (levelUpBtn) levelUpBtn.addEventListener("click", levelUpFormationUnit);
}

function showFormation() {
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.remove("is-hidden");
  if (missionScreen) missionScreen.classList.add("is-hidden");
  if (inventoryScreen) inventoryScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);
  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-shop", "in-recruit", "in-formation", "in-mission", "in-inventory");
  document.body.classList.add("in-formation");

  if (gameState) {
    gameState.running = false;
    gameState.message = "편성 화면에서 덱을 구성하세요.";
    updateButtons();
  }

  renderFormationScreen();
}

function showFormationNotice() {
  showFormation();
}

function setFormationCategoryTab() {
  showFormationMessage("편성 화면입니다. 보유 유닛을 선택해 슬롯에 배치하세요.");
  renderFormationTabs();
  renderFormationSlots();
}

function setFormationCategory(category) {
  if (!FORMATION_CATEGORY_LABELS[category]) return;
  formationState.activeCategory = category;
  formationState.rosterPage = 1;
  formationState.pendingHeroGrowthAction = null;
  formationState.pendingHeroPromotionAction = null;
  formationState.pendingUnitPromotionAction = null;
  formationState.heroDetailFlipped = false;
  if (category === "unit") {
    formationState.activeType = "deck";
  }

  showFormationMessage(
    category === "hero"
      ? "보유 영웅을 선택하면 상세 정보와 성급을 확인할 수 있습니다."
      : "보유 유닛을 선택한 뒤 빈 슬롯을 누르면 배치됩니다."
  );
  renderFormationTabs();
  renderFormationSlots();
  renderFormationRoster();
  renderFormationSelectedInfo();
}

function setFormationType(type) {
  if (!FORMATION_TYPE_LABELS[type]) return;
  formationState.activeCategory = "unit";
  formationState.activeType = type;
  formationState.activePage = 1;
  formationState.rosterPage = 1;
  showFormationMessage(
    type === "deck"
      ? "보유 유닛을 선택한 뒤 빈 슬롯을 누르면 배치됩니다."
      : `${FORMATION_TYPE_LABELS[type]} 편성 페이지입니다. 카드는 준비 중입니다.`
  );
  renderFormationTabs();
  renderFormationSlots();
  renderFormationRoster();
}

function setFormationDeckPage(page) {
  const pageNumber = Number(page) === 2 ? 2 : 1;
  formationState.activePage = pageNumber;
  showFormationMessage(`${pageNumber}번 페이지로 이동했습니다.`);
  renderFormationTabs();
  renderFormationSlots();
}

function selectFormationUnit(unitId) {
  formationState.selectedUnitId = unitId;
  renderFormationRoster();
  renderFormationSelectedInfo();
}

function selectFormationHero(heroId) {
  const hero = getFormationHero(heroId);
  if (!hero.unlocked) {
    showFormationMessage(`${hero.name}은 아직 잠겨 있습니다.`, "warning");
    return;
  }

  formationState.selectedHeroId = hero.id;
  formationState.heroDetailFlipped = false;
  formationState.pendingHeroGrowthAction = null;
  showFormationMessage(`${hero.name} 정보를 확인합니다.`);
  renderFormationSlots();
  renderFormationRoster();
}

function toggleFormationHeroDetailFlip() {
  const detailCard = document.querySelector(".formation-hero-detail-card");
  if (detailCard) {
    detailCard.classList.remove("is-flipping");
    void detailCard.offsetWidth;
  }

  formationState.heroDetailFlipped = !formationState.heroDetailFlipped;
  if (detailCard) {
    detailCard.classList.toggle("is-flipped", formationState.heroDetailFlipped);
    detailCard.classList.add("is-flipping");
    window.setTimeout(() => detailCard.classList.remove("is-flipping"), 860);
  }
}

function handleFormationSlotClick(index) {
  if (formationState.activeType !== "deck") {
    showFormationMessage(`${FORMATION_TYPE_LABELS[formationState.activeType]} 카드는 아직 준비 중입니다.`, "warning");
    return;
  }

  const slots = getFormationSlotsForCurrentPage();
  slots[index] = formationState.selectedUnitId;
  const unit = getFormationUnit(formationState.selectedUnitId);
  showFormationMessage(`${formationState.activePage}페이지 ${index + 1}번 슬롯에 ${unit.name}을 배치했습니다.`);
  renderFormationSlots();
}

function removeFormationSlot(index) {
  const slots = getFormationSlotsForCurrentPage();
  if (!slots[index]) return;

  slots[index] = null;
  showFormationMessage(`${formationState.activePage}페이지 ${index + 1}번 슬롯 배치를 해제했습니다.`);
  renderFormationSlots();
}

function levelUpFormationUnit() {
  const unit = getFormationUnit(formationState.selectedUnitId);
  const action = getFormationUnitGrowthAction(unit);

  if (action.type === "max" || action.type === "none") {
    showFormationMessage("이미 최대 성장 상태입니다.", "warning");
    return;
  }

  if (action.type === "locked") {
    showFormationMessage(`${action.requiredStar}초월이 필요합니다.`, "warning");
    return;
  }

  const cost = action.cost;
  if (cost === null) {
    showFormationMessage("현재 조건에서는 레벨업할 수 없습니다.", "warning");
    return;
  }

  if (gameWallet.gold < cost) {
    showFormationMessage(`골드가 부족합니다. 레벨업에는 ${cost.toLocaleString("ko-KR")}골드가 필요합니다.`, "warning");
    return;
  }

  gameWallet.gold -= cost;
  if (playerProgress) {
    playerProgress.gold = Math.max(0, Number(playerProgress.gold) || 0);
    playerProgress.gold = Math.max(0, playerProgress.gold - cost);
    saveProgress();
  }
  unit.level += 1;
  saveFormationUnitGrowth(unit);

  updateWalletDisplays();
  if (window.GameAudio) window.GameAudio.playSfx("levelUp", { cooldown: 250, volume: 0.8 });
  showFormationMessage(`${unit.name}이(가) Lv.${unit.level}이 되었습니다.`);
  renderFormationRoster();
  renderFormationSelectedInfo();
  renderFormationSlots();
}

function promoteFormationUnit() {
  const unit = getFormationUnit(formationState.selectedUnitId);
  const action = getFormationUnitPromotionAction(unit);
  const actionKey = getFormationUnitPromotionActionKey(unit, action);

  if (!unit || action.type === "none") return;
  if (action.type === "max") {
    showFormationMessage("최대 초월 단계입니다.", "warning");
    return;
  }
  if (!getFormationUnitEssenceInfo(unit, action.cost).canAfford) {
    showFormationMessage("정수가 부족합니다.", "warning");
    return;
  }

  formationState.pendingUnitPromotionAction = actionKey;
  showFormationMessage("초월 내용을 확인한 뒤 진행하세요.");
  renderFormationSlots();
}

function confirmFormationUnitPromotion() {
  const unit = getFormationUnit(formationState.selectedUnitId);
  const action = getFormationUnitPromotionAction(unit);
  const actionKey = getFormationUnitPromotionActionKey(unit, action);

  if (formationState.pendingUnitPromotionAction !== actionKey) {
    formationState.pendingUnitPromotionAction = null;
    renderFormationSlots();
    return;
  }
  if (!getFormationUnitEssenceInfo(unit, action.cost).canAfford) {
    showFormationMessage("정수가 부족합니다.", "warning");
    formationState.pendingUnitPromotionAction = null;
    renderFormationSlots();
    return;
  }
  if (!consumeFormationUnitEssences(unit, action.cost)) {
    showFormationMessage("정수가 부족합니다.", "warning");
    formationState.pendingUnitPromotionAction = null;
    renderFormationSlots();
    return;
  }

  unit.star = action.nextStar;
  unit.maxLevel = FORMATION_MAX_LEVEL;
  saveFormationUnitGrowth(unit);
  formationState.pendingUnitPromotionAction = null;
  updateWalletDisplays();
  if (window.GameAudio) window.GameAudio.playSfx("starLevelUp", { cooldown: 350, volume: 0.82 });
  showFormationMessage(`${unit.name}이(가) ${unit.star}성으로 초월했습니다.`);
  renderFormationRoster();
  renderFormationSelectedInfo();
  renderFormationSlots();
}

function levelUpFormationHero() {
  const hero = getFormationHero();
  const action = getFormationHeroGrowthAction(hero.id);

  if (!hero.unlocked) {
    showFormationMessage(`${hero.name}은 아직 잠겨 있습니다.`, "warning");
    return;
  }

  if (action.type === "max") {
    showFormationMessage(`${hero.name}은 이미 최대 성장 상태입니다.`, "warning");
    return;
  }

  if (action.type === "locked") {
    showFormationMessage(`${action.requiredStar}초월이 필요합니다.`, "warning");
    return;
  }

  if (action.type === "level") {
    if (gameWallet.gold < action.cost) {
      showFormationMessage(`골드가 부족합니다. 레벨업에는 ${action.cost.toLocaleString("ko-KR")} 골드가 필요합니다.`, "warning");
      return;
    }
    gameWallet.gold -= action.cost;
    if (playerProgress) {
      playerProgress.gold = Math.max(0, Number(playerProgress.gold) || 0);
      playerProgress.gold = Math.max(0, playerProgress.gold - action.cost);
    }
    setFormationHeroGrowth(hero.id, { star: getFormationHeroStar(hero.id), level: action.nextLevel });
    formationState.pendingHeroGrowthAction = null;
    updateWalletDisplays();
    if (window.GameAudio) window.GameAudio.playSfx("levelUp", { cooldown: 250, volume: 0.8 });
    showFormationMessage(`${hero.name}이(가) Lv.${action.nextLevel}이 되었습니다.`);
    renderFormationSlots();
    renderFormationRoster();
    return;
  }

  renderFormationSlots();
}

function confirmFormationHeroGrowth() {
  if (formationState.pendingHeroPromotionAction) {
    confirmFormationHeroPromotion();
    return;
  }
  if (formationState.pendingUnitPromotionAction) {
    confirmFormationUnitPromotion();
    return;
  }

  const hero = getFormationHero();
  const currentStar = getFormationHeroStar(hero.id);
  const currentLevel = getFormationHeroLevel(hero.id);
  const action = getFormationHeroGrowthAction(hero.id);
  const actionKey = getFormationHeroGrowthActionKey(hero.id, action);

  if (formationState.pendingHeroGrowthAction !== actionKey) {
    formationState.pendingHeroGrowthAction = null;
    renderFormationSlots();
    return;
  }

  if (action.type === "level") {
    if (gameWallet.gold < action.cost) {
      showFormationMessage(`골드가 부족합니다. 레벨업에는 ${action.cost.toLocaleString("ko-KR")} 골드가 필요합니다.`, "warning");
      formationState.pendingHeroGrowthAction = null;
      renderFormationSlots();
      return;
    }

    gameWallet.gold -= action.cost;
    if (playerProgress) {
      playerProgress.gold = Math.max(0, Number(playerProgress.gold) || 0);
      playerProgress.gold = Math.max(0, playerProgress.gold - action.cost);
    }
    setFormationHeroGrowth(hero.id, { star: currentStar, level: action.nextLevel });
    formationState.pendingHeroGrowthAction = null;
    updateWalletDisplays();
    if (window.GameAudio) window.GameAudio.playSfx("levelUp", { cooldown: 250, volume: 0.8 });
    showFormationMessage(`${hero.name}이(가) Lv.${action.nextLevel}이 되었습니다.`);
    renderFormationSlots();
    renderFormationRoster();
    return;
  }

  if (action.type !== "star") {
    formationState.pendingHeroGrowthAction = null;
    renderFormationSlots();
    return;
  }

  if (action.cost > 0 && !getFormationHeroEssenceInfo(hero.id, action.cost).canAfford) {
    showFormationMessage(`신의정수가 부족합니다. 성급업에는 ${action.cost}개가 필요합니다.`, "warning");
    formationState.pendingHeroGrowthAction = null;
    renderFormationSlots();
    return;
  }

  if (action.cost > 0 && !consumeFormationHeroEssences(hero.id, action.cost)) {
    showFormationMessage("신의정수가 부족합니다.", "warning");
    formationState.pendingHeroGrowthAction = null;
    renderFormationSlots();
    return;
  }

  setFormationHeroGrowth(hero.id, { star: action.nextStar, level: currentLevel });
  formationState.pendingHeroGrowthAction = null;
  updateWalletDisplays();
  if (window.GameAudio) window.GameAudio.playSfx("starLevelUp", { cooldown: 350, volume: 0.82 });
  showFormationMessage(`${hero.name}이(가) ${action.nextStar}성이 되었습니다. Lv.${getFormationHeroLevelCap(hero.id, action.nextStar)}까지 성장할 수 있습니다.`);
  renderFormationSlots();
  renderFormationRoster();
}

function promoteFormationHero() {
  const hero = getFormationHero();
  const action = getFormationHeroPromotionAction(hero.id);
  const actionKey = getFormationHeroPromotionActionKey(hero.id, action);

  if (!hero.unlocked) {
    showFormationMessage(`${hero.name}은 아직 잠겨 있습니다.`, "warning");
    return;
  }
  if (action.type === "max") {
    showFormationMessage("최대 초월 단계입니다.", "warning");
    return;
  }
  if (!getFormationHeroEssenceInfo(hero.id, action.cost).canAfford) {
    showFormationMessage("정수가 부족합니다.", "warning");
    return;
  }

  formationState.pendingHeroPromotionAction = actionKey;
  showFormationMessage("초월 내용을 확인한 뒤 진행하세요.");
  renderFormationSlots();
}

function confirmFormationHeroPromotion() {
  const hero = getFormationHero();
  const action = getFormationHeroPromotionAction(hero.id);
  const actionKey = getFormationHeroPromotionActionKey(hero.id, action);

  if (formationState.pendingHeroPromotionAction !== actionKey) {
    formationState.pendingHeroPromotionAction = null;
    renderFormationSlots();
    return;
  }
  if (!getFormationHeroEssenceInfo(hero.id, action.cost).canAfford) {
    showFormationMessage("정수가 부족합니다.", "warning");
    formationState.pendingHeroPromotionAction = null;
    renderFormationSlots();
    return;
  }
  if (!consumeFormationHeroEssences(hero.id, action.cost)) {
    showFormationMessage("정수가 부족합니다.", "warning");
    formationState.pendingHeroPromotionAction = null;
    renderFormationSlots();
    return;
  }

  setFormationHeroGrowth(hero.id, {
    star: action.nextStar,
    level: getFormationHeroLevel(hero.id),
  });
  formationState.pendingHeroPromotionAction = null;
  updateWalletDisplays();
  if (window.GameAudio) window.GameAudio.playSfx("starLevelUp", { cooldown: 350, volume: 0.82 });
  showFormationMessage(`${hero.name}이(가) ${action.nextStar}성으로 초월했습니다.`);
  renderFormationSlots();
  renderFormationRoster();
}

function cancelFormationHeroGrowth() {
  formationState.pendingHeroGrowthAction = null;
  formationState.pendingHeroPromotionAction = null;
  formationState.pendingUnitPromotionAction = null;
  showFormationMessage("성장을 취소했습니다.");
  renderFormationSlots();
}

function createFormationShellMarkup() {
  return `
    <div class="formation-scanline" aria-hidden="true"></div>

    <button id="formationBackBtn" class="formation-ui-btn formation-back-btn" type="button">로비</button>
    <button id="formationCloseBtn" class="formation-ui-btn formation-close-btn" type="button">인벤토리</button>

    <div class="formation-topbar formation-wallet-wide" aria-label="재화 정보">
      <div class="formation-currency blue"><img src="assets/icons/diamond.png" alt=""><span>다이아몬드</span><strong data-wallet-value="diamond">0</strong></div>
      <div class="formation-currency gold"><img src="assets/icons/gold.png" alt=""><span>골드</span><strong data-wallet-value="gold">0</strong></div>
      <div class="formation-currency ticket"><img src="assets/icons/ticket.png" alt=""><span>강림권</span><strong data-wallet-value="summonTickets">0</strong></div>
      <div class="formation-currency essence"><img src="assets/icons/essence_all.png" alt=""><span>공통 신의정수</span><strong data-wallet-value="commonEssence">0</strong></div>
      <div class="formation-currency soldier"><img src="assets/icons/essence_soldier.png" alt=""><span>병사정수</span><strong data-wallet-value="soldierFragments">0</strong></div>
      <div class="formation-currency god-essence zeus"><img src="assets/icons/essence_zeus.png" alt=""><span>제우스 정수</span><strong data-essence-key="lightningEssence">0</strong></div>
      <div class="formation-currency god-essence poseidon"><img src="assets/icons/essence_poseidon.png" alt=""><span>포세이돈 정수</span><strong data-essence-key="seaEssence">0</strong></div>
      <div class="formation-currency god-essence hades"><img src="assets/icons/essence_hades.png" alt=""><span>하데스 정수</span><strong data-essence-key="soulEssence">0</strong></div>
      <div class="formation-currency god-essence athena"><img src="assets/icons/essence_athena.png" alt=""><span>아테나 정수</span><strong data-essence-key="wisdomEssence">0</strong></div>
      <div class="formation-currency god-essence ares"><img src="assets/icons/essence_ares.png" alt=""><span>아레스 정수</span><strong data-essence-key="warEssence">0</strong></div>
      <div class="formation-currency god-essence heracles"><img src="assets/icons/essence_hercules.png" alt=""><span>헤라클레스 정수</span><strong data-essence-key="strengthEssence">0</strong></div>
    </div>

    <div class="formation-shell">
      <aside class="formation-brand-panel" aria-label="성장 로고">
        <div class="formation-brand-emblem" aria-hidden="true">✦</div>
        <strong>성장</strong>
        <span>GROWTH</span>
        <nav class="formation-category-nav" aria-label="성장 카테고리">
          <button class="formation-category-btn is-active" type="button" data-formation-category="hero">영웅</button>
          <button class="formation-category-btn" type="button" data-formation-category="unit">유닛</button>
        </nav>
      </aside>

      <section class="formation-main-panel">
        <header class="formation-header-row">
          <div class="formation-title-box">
            <p class="formation-kicker">GROWTH</p>
            <h1 id="formationTitle" class="formation-logo">영웅 성장</h1>
          </div>
          <div class="formation-type-tabs is-hidden" aria-label="성장 종류"></div>
        </header>

        <div class="formation-placement-head">
          <span id="formationSlotTitle">영웅</span>
        </div>

        <div class="formation-slots-panel is-hero-detail" aria-label="성장 상세">
          <div id="formationSlotGrid" class="formation-slot-grid is-hero-detail-grid"></div>
          <div class="formation-deck-tabs is-hidden" aria-label="성장 페이지"></div>
          <p id="formationNotice" class="formation-notice" aria-live="polite">보유 카드를 선택하면 성장 정보를 확인할 수 있습니다.</p>
        </div>
      </section>

      <aside class="formation-roster-panel" aria-label="보유 카드 목록">
        <div class="formation-roster-head">
          <strong>보유 영웅</strong>
          <span id="formationRosterCount">2 / 6</span>
        </div>
        <div id="formationRosterGrid" class="formation-roster-grid is-hero-roster" aria-label="보유 카드"></div>
        <div class="formation-roster-pager is-hidden" aria-label="보유 카드 페이지">
          <button class="formation-roster-page-btn is-active" type="button" data-roster-page="1">1</button>
          <button class="formation-roster-page-btn" type="button" data-roster-page="2">2</button>
        </div>
      </aside>
    </div>
  `;
}

function getFormationHeroOwnedCount() {
  return FORMATION_HEROES.filter((hero) => isFormationHeroUnlocked(hero.id)).length;
}

function renderFormationHeroCard(hero, options = {}) {
  const selectedClass = options.selected ? " is-selected" : "";
  const unlocked = isFormationHeroUnlocked(hero.id);
  const selectableLocked = !unlocked && getFormationHeroUnlockCost(hero.id);
  const lockedClass = unlocked ? "" : " is-locked";
  const star = getFormationHeroStar(hero.id);
  const level = getFormationHeroLevel(hero.id);
  const lockMarkup = unlocked ? "" : `<span class="formation-hero-lock" aria-hidden="true">🔒</span>`;

  return `
    <button class="formation-unit-card formation-hero-card${selectedClass}${lockedClass}" type="button" data-hero-id="${hero.id}" ${unlocked || selectableLocked ? "" : "disabled"} aria-label="${hero.name}">
      <img src="${hero.image}" alt="${hero.name}">
      ${lockMarkup}
      <span class="formation-unit-name">${hero.name}</span>
      <span class="formation-unit-level">${renderFormationHeroStars(star)} Lv.${level}</span>
    </button>
  `;
}

function renderFormationUnitCard(unit, options = {}) {
  const selectedClass = options.selected ? " is-selected" : "";
  return `
    <button class="formation-unit-card formation-roster-unit-card${selectedClass}" type="button" data-unit-id="${unit.instanceId}" aria-label="${unit.name}">
      <img src="${unit.image}" alt="${unit.name}">
      <span class="formation-unit-name">${unit.name}</span>
    </button>
  `;
}

function renderFormationFlipCard({ cardClass = "", frontImage, frontAlt, backClass = "", title, subtitle, rows }) {
  const flippedClass = formationState.activeCategory === "unit"
    ? formationState.unitDetailFlipped
    : formationState.heroDetailFlipped;
  return `
    <button class="formation-hero-detail-card ${cardClass}${flippedClass ? " is-flipped" : ""}" type="button" aria-label="${frontAlt} 스탯 보기">
      <span class="formation-hero-flip-inner">
        <span class="formation-hero-flip-face formation-hero-flip-front">
          <img src="${frontImage}" alt="${frontAlt}">
        </span>
        <span class="formation-hero-flip-face formation-hero-flip-back ${backClass}">
          <div class="formation-hero-back-stats">
            <strong>${title}</strong>
            <em>${subtitle}</em>
            ${rows.map((row) => `<span>${row.label} <b>${row.value}</b></span>`).join("")}
          </div>
        </span>
      </span>
    </button>
  `;
}

function renderFormationHeroDetail() {
  const hero = getFormationHero();
  const star = getFormationHeroStar(hero.id);
  const level = getFormationHeroLevel(hero.id);
  const levelCap = getFormationHeroLevelCap(hero.id);
  const action = getFormationHeroGrowthAction(hero.id);
  const promotionAction = getFormationHeroPromotionAction(hero.id);
  const essenceInfo = getFormationHeroEssenceInfo(hero.id, promotionAction.cost);
  const actionKey = getFormationHeroGrowthActionKey(hero.id, action);
  const promotionActionKey = getFormationHeroPromotionActionKey(hero.id, promotionAction);
  const isPending = formationState.pendingHeroGrowthAction === actionKey;
  const isPromotionPending = formationState.pendingHeroPromotionAction === promotionActionKey;
  const unlockCost = getFormationHeroUnlockCost(hero.id);
  const unlockInfo = getFormationHeroEssenceInfo(hero.id, unlockCost || 0);
  const stats = getFormationHeroStats(hero.id);
  const isLevelMax = level >= FORMATION_MAX_LEVEL && star >= FORMATION_HERO_MAX_STAR;
  const levelLabel = isLevelMax
    ? "MAX"
    : action.type === "level"
      ? action.cost.toLocaleString("ko-KR")
      : action.type === "locked"
        ? `${action.requiredStar}초월 필요`
        : "MAX";
  const pendingMessage = action.type === "level"
    ? `골드 ${action.cost.toLocaleString("ko-KR")}을 소모해 Lv.${action.nextLevel}로 성장시킵니다.`
    : "";
  const levelCostMarkup = action.type === "level"
    ? `<span class="formation-btn-cost"><img src="assets/icons/gold.png" alt="">${action.cost.toLocaleString("ko-KR")}</span>`
    : `<span class="formation-btn-cost">${levelLabel}</span>`;
  const promoteCostMarkup = promotionAction.type === "star" ? `
    <span class="formation-btn-cost formation-promote-cost">
      <img src="${getFormationHeroEssenceIcon(hero.id)}" alt="">${essenceInfo.specificAmount.toLocaleString("ko-KR")}
      <b>+</b>
      <img src="assets/icons/essence_all.png" alt="">${essenceInfo.commonAmount.toLocaleString("ko-KR")}
      <em>/ ${promotionAction.cost}</em>
    </span>
  ` : `<span class="formation-btn-cost">MAX</span>`;
  const promotionMessage = `${getFormationHeroEssenceSpendLabel(hero.id, promotionAction.cost)}를 사용해 ${promotionAction.nextStar}성으로 초월합니다.`;

  return `
    <div class="formation-hero-detail">
      ${renderFormationFlipCard({
        frontImage: hero.image,
        frontAlt: hero.name,
        backClass: `formation-hero-back-${hero.id}`,
        title: hero.name,
        subtitle: "일반 스탯",
        rows: [
          { label: "공격력", value: stats.damage },
          { label: "체력", value: stats.hp },
          { label: "사거리", value: stats.range },
          { label: "공격속도", value: stats.attackSpeed.toFixed(2) },
        ],
      })}
      <div class="formation-hero-detail-info">
        <div class="formation-hero-detail-top">
          <p class="formation-kicker">HERO</p>
          <h2>${hero.name}</h2>
          <div class="formation-hero-stars" aria-label="현재 성급">${renderFormationHeroStars(star)}</div>
        </div>
        <dl class="formation-hero-detail-list">
          <div><dt>패시브 능력</dt><dd>${hero.passive}</dd></div>
          <div><dt>현재 초월</dt><dd>${star}성 / ${FORMATION_HERO_MAX_STAR}성</dd></div>
          <div><dt>현재 레벨</dt><dd>Lv.${level} / ${levelCap}</dd></div>
        </dl>
        <div class="formation-growth-actions">
          ${!hero.unlocked && unlockCost ? `
          <button id="formationHeroUnlockBtn" class="formation-level-btn formation-hero-level-btn formation-unlock-btn" type="button" ${unlockInfo.specificAmount >= unlockCost ? "" : "disabled"}>
            해금 <span class="formation-btn-cost"><img src="${getFormationHeroEssenceIcon(hero.id)}" alt="">${unlockInfo.specificAmount.toLocaleString("ko-KR")} / ${unlockCost.toLocaleString("ko-KR")}</span>
          </button>
          ` : `
          <button id="formationHeroLevelUpBtn" class="formation-level-btn formation-hero-level-btn" type="button" ${hero.unlocked && action.type === "level" ? "" : "disabled"}>
            레벨업 ${levelCostMarkup}
          </button>
          <button id="formationHeroPromoteBtn" class="formation-level-btn formation-hero-level-btn formation-promote-btn" type="button" ${hero.unlocked && promotionAction.type === "star" && essenceInfo.canAfford ? "" : "disabled"}>
            초월 ${promoteCostMarkup}
          </button>
          `}
        </div>
        ${isPending || isPromotionPending ? `
          <div class="formation-growth-confirm" role="dialog" aria-label="영웅 성장 확인">
            <p>${isPromotionPending ? promotionMessage : pendingMessage}</p>
            <div>
              <button id="formationHeroGrowthConfirmBtn" type="button">진행</button>
              <button id="formationHeroGrowthCancelBtn" type="button">취소</button>
            </div>
          </div>
        ` : ""}
      </div>
    </div>
  `;
}

function renderFormationUnitDetail() {
  const ownedUnits = ensureFormationOwnedUnits();
  if (!ownedUnits.some((ownedUnit) => ownedUnit.instanceId === formationState.selectedUnitId) && ownedUnits[0]) {
    formationState.selectedUnitId = ownedUnits[0].instanceId;
  }
  const unit = getFormationUnit(formationState.selectedUnitId);
  const stats = getFormationUnitStats(unit);
  const action = getFormationUnitGrowthAction(unit);
  const promotionAction = getFormationUnitPromotionAction(unit);
  const essenceInfo = getFormationUnitEssenceInfo(unit, promotionAction.cost);
  const star = Math.min(FORMATION_MAX_STAR, Math.max(1, Number(unit.star) || 1));
  const isLevelMax = unit.level >= FORMATION_MAX_LEVEL && star >= FORMATION_MAX_STAR;
  const promotionActionKey = getFormationUnitPromotionActionKey(unit, promotionAction);
  const isPromotionPending = formationState.pendingUnitPromotionAction === promotionActionKey;
  const buttonCostLabel = isLevelMax
    ? "MAX"
    : action.type === "level"
      ? `골드 ${action.cost.toLocaleString("ko-KR")}`
      : action.type === "locked"
        ? `${action.requiredStar}초월 필요`
        : "MAX";
  const levelCostMarkup = action.type === "level"
    ? `<span class="formation-btn-cost"><img src="assets/icons/gold.png" alt="">${action.cost.toLocaleString("ko-KR")}</span>`
    : `<span class="formation-btn-cost">${buttonCostLabel}</span>`;
  const promoteCostMarkup = promotionAction.type === "star" ? `
    <span class="formation-btn-cost formation-promote-cost">
      <img src="assets/icons/essence_soldier.png" alt="">${essenceInfo.commonAmount.toLocaleString("ko-KR")}
      <em>/ ${promotionAction.cost}</em>
    </span>
  ` : `<span class="formation-btn-cost">MAX</span>`;

  return `
    <div class="formation-hero-detail formation-unit-detail">
      ${renderFormationFlipCard({
        cardClass: "formation-unit-detail-card",
        frontImage: unit.image,
        frontAlt: unit.name,
        backClass: "formation-unit-back",
        title: unit.name,
        subtitle: "일반 스탯",
        rows: [
          { label: unit.baseId === "saintess" ? "힐량" : "공격력", value: unit.baseId === "saintess" ? stats.healAmount : stats.damage },
          { label: "체력", value: stats.hp },
          { label: "사거리", value: stats.range },
          { label: "공격속도", value: stats.attackSpeed.toFixed(2) },
        ],
      })}
      <div class="formation-hero-detail-info">
        <div class="formation-hero-detail-top">
          <p class="formation-kicker">UNIT</p>
          <h2>${unit.name}</h2>
          <div class="formation-hero-stars formation-unit-diamonds" aria-label="현재 초월">${renderFormationHeroStars(star)}</div>
        </div>
        <dl class="formation-hero-detail-list">
          <div><dt>능력</dt><dd>${unit.ability || "전투에서 아군 진형을 보조합니다."}</dd></div>
          <div><dt>현재 초월</dt><dd>${star}성 / ${FORMATION_MAX_STAR}성</dd></div>
          <div><dt>현재 레벨</dt><dd>Lv.${unit.level} / ${unit.maxLevel}</dd></div>
          <div><dt>병사정수</dt><dd>${essenceInfo.commonAmount.toLocaleString("ko-KR")}</dd></div>
        </dl>
        <div class="formation-growth-actions">
          <button id="formationUnitLevelUpBtn" class="formation-level-btn formation-hero-level-btn" type="button" ${action.type === "level" ? "" : "disabled"}>
            레벨업 ${levelCostMarkup}
          </button>
          <button id="formationUnitPromoteBtn" class="formation-level-btn formation-hero-level-btn formation-promote-btn" type="button" ${promotionAction.type === "star" && essenceInfo.canAfford ? "" : "disabled"}>
            초월 ${promoteCostMarkup}
          </button>
        </div>
        ${isPromotionPending ? `
          <div class="formation-growth-confirm" role="dialog" aria-label="유닛 초월 확인">
            <p>병사정수 ${promotionAction.cost}개를 사용해 ${promotionAction.nextStar}성으로 초월합니다.</p>
            <div>
              <button id="formationHeroGrowthConfirmBtn" type="button">진행</button>
              <button id="formationHeroGrowthCancelBtn" type="button">취소</button>
            </div>
          </div>
        ` : ""}
      </div>
    </div>
  `;
}

function renderFormationSlots() {
  const slotGrid = document.getElementById("formationSlotGrid");
  if (!slotGrid) return;

  const slotsPanel = document.querySelector(".formation-slots-panel");
  const deckTabs = document.querySelector(".formation-deck-tabs");
  if (slotsPanel) slotsPanel.classList.add("is-hero-detail");
  if (deckTabs) deckTabs.classList.add("is-hidden");
  slotGrid.classList.add("is-hero-detail-grid");
  slotGrid.innerHTML = formationState.activeCategory === "unit" ? renderFormationUnitDetail() : renderFormationHeroDetail();

  const detailCard = slotGrid.querySelector(".formation-hero-detail-card");
  const heroUnlockBtn = document.getElementById("formationHeroUnlockBtn");
  const heroLevelUpBtn = document.getElementById("formationHeroLevelUpBtn");
  const heroPromoteBtn = document.getElementById("formationHeroPromoteBtn");
  const unitLevelUpBtn = document.getElementById("formationUnitLevelUpBtn");
  const unitPromoteBtn = document.getElementById("formationUnitPromoteBtn");
  const confirmBtn = document.getElementById("formationHeroGrowthConfirmBtn");
  const cancelBtn = document.getElementById("formationHeroGrowthCancelBtn");
  if (detailCard) detailCard.addEventListener("click", toggleFormationDetailFlip);
  if (heroUnlockBtn) heroUnlockBtn.addEventListener("click", () => unlockFormationHero());
  if (heroLevelUpBtn) heroLevelUpBtn.addEventListener("click", levelUpFormationHero);
  if (heroPromoteBtn) heroPromoteBtn.addEventListener("click", promoteFormationHero);
  if (unitLevelUpBtn) unitLevelUpBtn.addEventListener("click", levelUpFormationUnit);
  if (unitPromoteBtn) unitPromoteBtn.addEventListener("click", promoteFormationUnit);
  if (confirmBtn) confirmBtn.addEventListener("click", confirmFormationHeroGrowth);
  if (cancelBtn) cancelBtn.addEventListener("click", cancelFormationHeroGrowth);

  const slotTitle = document.getElementById("formationSlotTitle");
  if (slotTitle) slotTitle.textContent = formationState.activeCategory === "unit" ? "유닛" : "영웅";
}

function renderFormationRoster() {
  const rosterGrid = document.getElementById("formationRosterGrid");
  const rosterCount = document.getElementById("formationRosterCount");
  if (!rosterGrid) return;

  const rosterTitle = document.querySelector(".formation-roster-head strong");
  const rosterPager = document.querySelector(".formation-roster-pager");
  if (rosterPager) rosterPager.classList.add("is-hidden");
  rosterGrid.classList.add("is-hero-roster");
  rosterGrid.classList.toggle("is-unit-roster", formationState.activeCategory === "unit");

  if (formationState.activeCategory === "unit") {
    const ownedUnits = ensureFormationOwnedUnits();
    if (!ownedUnits.some((unit) => unit.instanceId === formationState.selectedUnitId) && ownedUnits[0]) {
      formationState.selectedUnitId = ownedUnits[0].instanceId;
    }
    if (rosterTitle) rosterTitle.textContent = "보유 유닛";
    if (rosterCount) rosterCount.textContent = `${ownedUnits.length} / ${FORMATION_OWNED_UNIT_LIMIT}`;
    rosterGrid.innerHTML = ownedUnits
      .map((unit) => renderFormationUnitCard(unit, { selected: unit.instanceId === formationState.selectedUnitId }))
      .join("");
    rosterGrid.querySelectorAll(".formation-roster-unit-card").forEach((card) => {
      card.addEventListener("click", () => selectFormationUnit(card.dataset.unitId));
    });
    return;
  }

  if (rosterTitle) rosterTitle.textContent = "보유 영웅";
  if (rosterCount) rosterCount.textContent = `${getFormationHeroOwnedCount()} / ${FORMATION_HEROES.length}`;
  rosterGrid.innerHTML = FORMATION_HEROES
    .map((hero) => renderFormationHeroCard(hero, { selected: hero.id === formationState.selectedHeroId }))
    .join("");
  rosterGrid.querySelectorAll(".formation-hero-card:not(:disabled)").forEach((card) => {
    card.addEventListener("click", () => selectFormationHero(card.dataset.heroId));
  });
}

function renderFormationTabs() {
  const title = document.getElementById("formationTitle");
  if (title) title.textContent = formationState.activeCategory === "unit" ? "유닛 성장" : "영웅 성장";

  document.querySelectorAll(".formation-category-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.formationCategory === formationState.activeCategory);
  });

  const typeTabs = document.querySelector(".formation-type-tabs");
  if (typeTabs) typeTabs.classList.add("is-hidden");
}

function selectFormationUnit(unitId) {
  formationState.selectedUnitId = unitId;
  formationState.unitDetailFlipped = false;
  showFormationMessage(`${getFormationUnit(unitId).name} 정보를 확인합니다.`);
  renderFormationSlots();
  renderFormationRoster();
}

function setFormationCategory(category) {
  if (!FORMATION_CATEGORY_LABELS[category]) return;
  formationState.activeCategory = category;
  formationState.rosterPage = 1;
  formationState.pendingHeroGrowthAction = null;
  formationState.heroDetailFlipped = false;
  formationState.unitDetailFlipped = false;
  showFormationMessage(category === "hero"
    ? "보유 영웅을 선택하면 상세 정보와 성장 상태를 확인할 수 있습니다."
    : "보유 유닛을 선택하면 상세 정보와 성장 상태를 확인할 수 있습니다.");
  renderFormationTabs();
  renderFormationSlots();
  renderFormationRoster();
}

function toggleFormationDetailFlip() {
  const detailCard = document.querySelector(".formation-hero-detail-card");
  if (detailCard) {
    detailCard.classList.remove("is-flipping");
    void detailCard.offsetWidth;
  }

  if (formationState.activeCategory === "unit") {
    formationState.unitDetailFlipped = !formationState.unitDetailFlipped;
    if (detailCard) detailCard.classList.toggle("is-flipped", formationState.unitDetailFlipped);
  } else {
    formationState.heroDetailFlipped = !formationState.heroDetailFlipped;
    if (detailCard) detailCard.classList.toggle("is-flipped", formationState.heroDetailFlipped);
  }

  if (detailCard) {
    detailCard.classList.add("is-flipping");
    window.setTimeout(() => detailCard.classList.remove("is-flipping"), 860);
  }
}

function toggleFormationHeroDetailFlip() {
  toggleFormationDetailFlip();
}

function setFormationCategoryTab(category = "hero") {
  setFormationCategory(category === "unit" ? "unit" : "hero");
}

function showFormation() {
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.remove("is-hidden");
  if (missionScreen) missionScreen.classList.add("is-hidden");
  if (inventoryScreen) inventoryScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);
  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-shop", "in-recruit", "in-formation", "in-mission", "in-inventory");
  document.body.classList.add("in-formation");
  if (window.GameAudio) window.GameAudio.syncScreenBgm();

  if (gameState) {
    gameState.running = false;
    gameState.message = "성장 화면에서 영웅과 유닛을 성장시키세요.";
    updateButtons();
  }

  renderFormationScreen();
}

function showFormationNotice() {
  showFormation();
}

window.FormationAPI = {
  addOwnedUnit: addFormationOwnedUnit,
  getOwnedUnits: ensureFormationOwnedUnits,
  ownedUnitLimit: FORMATION_OWNED_UNIT_LIMIT,
};

function getBestFormationBattleUnit(baseId) {
  const placedIds = Object.values(formationState.pages.deck)
    .flat()
    .filter(Boolean);
  const placedUnits = placedIds
    .map((unitId) => getFormationUnit(unitId))
    .filter((unit) => unit && unit.baseId === baseId);

  const candidates = placedUnits.length
    ? placedUnits
    : ensureFormationOwnedUnits().filter((unit) => unit.baseId === baseId);

  return candidates.sort((a, b) => b.level - a.level || b.attack - a.attack)[0] || null;
}

function applyFormationBattleStats(baseId, battleUnit) {
  const formationUnit = getBestFormationBattleUnit(baseId);
  if (!formationUnit) return battleUnit;

  const formationStats = getFormationUnitStats(formationUnit);
  const nextUnit = {
    ...battleUnit,
    formationUnitId: formationUnit.instanceId,
    formationLevel: formationStats.level,
    level: formationStats.level,
    star: formationStats.star,
    maxHp: formationStats.hp,
    hp: formationStats.hp,
    damage: formationStats.damage,
    defense: formationStats.defense,
    range: formationStats.range,
    attackSpeed: formationStats.attackSpeed,
  };

  if (baseId === "saintess") {
    nextUnit.healAmount = Math.max(1, formationStats.healAmount || formationStats.damage || 8);
    nextUnit.damage = 0;
  }

  return nextUnit;
}

function getFormationBattleStats(baseId) {
  const battleUnit = getBestFormationBattleUnit(baseId);
  if (!battleUnit) return null;
  return applyFormationBattleStats(baseId, {
    type: baseId,
    level: battleUnit.level,
    star: battleUnit.star || 1,
    maxHp: battleUnit.hp,
    hp: battleUnit.hp,
    damage: battleUnit.attack,
    defense: battleUnit.defense,
    range: battleUnit.baseId === "guard" ? 42 : battleUnit.baseId === "archer" || battleUnit.baseId === "mage" ? 260 : 90,
    attackSpeed: battleUnit.baseId === "guard" ? 1.0 : battleUnit.baseId === "thief" ? 0.62 : battleUnit.baseId === "mage" ? 0.82 : 0.72,
  });
}

function getFormationHeroBattleStats(heroId = formationState.selectedHeroId) {
  const stats = getFormationHeroStats(heroId);
  return {
    ...stats,
    maxHp: stats.hp,
  };
}
