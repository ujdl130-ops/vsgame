// Formation screen interactions.

const FORMATION_MAX_LEVEL = typeof MAX_GROWTH_LEVEL === "number" ? MAX_GROWTH_LEVEL : 50;
const FORMATION_MAX_STAR = typeof MAX_TRANSCENDENCE_STAR === "number" ? MAX_TRANSCENDENCE_STAR : 5;

const FORMATION_BASE_UNITS = [
  {
    id: "guard",
    name: "방패병",
    image: "assets/maps/formation/guardpng.png",
    baseLevel: 1,
    maxLevel: 30,
    attack: 10,
    hp: 115,
    defense: 60,
    rarity: "normal",
    ability: "방패 대형: 전방에서 적의 진격을 막아 아군을 보호합니다.",
  },
  {
    id: "saintess",
    name: "성녀",
    image: "assets/maps/formation/saint.png",
    baseLevel: 4,
    maxLevel: FORMATION_MAX_LEVEL,
    attack: 80,
    hp: 680,
    defense: 48,
    rarity: "normal",
    ability: "치유의 기도: 주변 아군의 체력을 회복합니다.",
  },
  {
    id: "archer",
    name: "궁수",
    image: "assets/maps/formation/archer.png",
    baseLevel: 2,
    maxLevel: FORMATION_MAX_LEVEL,
    attack: 115,
    hp: 520,
    defense: 34,
    rarity: "normal",
    ability: "정밀 사격: 먼 거리의 적을 안정적으로 공격합니다.",
  },
  {
    id: "thief",
    name: "도적",
    image: "assets/maps/formation/fighter.png",
    baseLevel: 5,
    maxLevel: FORMATION_MAX_LEVEL,
    attack: 135,
    hp: 560,
    defense: 38,
    rarity: "normal",
    ability: "급습: 빠르게 접근해 높은 피해를 줍니다.",
  },
  {
    id: "mage",
    name: "마법사",
    image: "assets/maps/formation/magic.png",
    baseLevel: 3,
    maxLevel: FORMATION_MAX_LEVEL,
    attack: 150,
    hp: 480,
    defense: 30,
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
    attack: Math.max(1, source.attack + levelDelta * 12),
    hp: Math.max(1, source.hp + levelDelta * 70),
    defense: Math.max(1, source.defense + levelDelta * 6),
  };
});

const FORMATION_OWNED_UNIT_LIMIT = 5;

const FORMATION_HERO_FRAGMENT_COST = 50;
const FORMATION_HERO_MAX_STAR = 5;
const FORMATION_HERO_BASE_STAR = 1;
const FORMATION_HERO_GROWTH_VERSION = 2;
const FORMATION_HERO_TRANSCEND_SPECIFIC_COST = {
  1: 20,
  2: 30,
  3: 50,
  4: 80,
};
const FORMATION_HERO_TRANSCEND_COMMON_COST = {
  1: 0,
  2: 0,
  3: 50,
  4: 50,
};
const FORMATION_UNIT_TRANSCEND_COMMON_COST = {
  1: 0,
  2: 0,
  3: 10,
  4: 20,
};
const FORMATION_HERO_ESSENCES = {
  zeus: { key: "lightningEssence", name: "제우스 정수" },
  poseidon: { key: "seaEssence", name: "포세이돈 정수" },
  athena: { key: "wisdomEssence", name: "아테나 정수" },
  hades: { key: "soulEssence", name: "하데스 정수" },
  ares: { key: "warEssence", name: "아레스 정수" },
  heracles: { key: "strengthEssence", name: "헤라클레스 정수" },
};

const FORMATION_HEROES = [
  {
    id: "zeus",
    name: "제우스",
    image: "assets/maps/formation/zeus.png",
    backImage: "assets/maps/formation/zeus_back.png",
    unlocked: true,
    passive: "천벌: 일정 영역에 번개를 내려 범위 안의 적에게 지속 피해를 줍니다.",
    skillType: "뇌광의 창: 응축한 번개의 창을 전방의 적에게 던져 피해를 입힙니다.",
  },
  {
    id: "poseidon",
    name: "포세이돈",
    image: "assets/maps/formation/poseidon.png",
    backImage: "assets/maps/formation/poseidon_back.png",
    unlocked: false,
    passive: "해류의 가호: 적의 진격 속도를 늦춥니다.",
    skillType: "해류의 창: 거센 물살을 실은 삼지창으로 전방의 적을 꿰뚫습니다.",
  },
  {
    id: "athena",
    name: "아테나",
    image: "assets/maps/formation/atena.png",
    unlocked: false,
    passive: "전술 지휘: 아군의 방어 능력을 강화합니다.",
    skillType: "수호의 창: 정확한 창격으로 적을 공격하고 가장 가까운 아군을 보호합니다.",
  },
  {
    id: "hades",
    name: "하데스",
    image: "assets/maps/formation/hades.png",
    unlocked: false,
    passive: "명계의 계약: 처치한 적의 힘을 흡수합니다.",
    skillType: "망자의 손길: 명계의 기운을 방출해 적의 생명력을 잠식합니다.",
  },
  {
    id: "ares",
    name: "아레스",
    image: "assets/maps/formation/ares.png",
    unlocked: false,
    passive: "전쟁의 함성: 아군 공격 속도를 끌어올립니다.",
    skillType: "전장의 일격: 전투의 분노를 담은 강력한 베기로 가까운 적을 공격합니다.",
  },
  {
    id: "heracles",
    name: "헤라클레스",
    image: "assets/maps/formation/hercules.png",
    unlocked: false,
    passive: "불굴의 힘: 영웅의 체력이 크게 증가합니다.",
    skillType: "괴력의 강타: 압도적인 힘으로 지면을 내리쳐 주변의 적을 뒤흔듭니다.",
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
  pendingGrowthConfirm: null,
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
  inventory: "인벤토리",
};

function getFormationUnit(unitId) {
  return (
    FORMATION_ROSTER_UNITS.find((unit) => unit.instanceId === unitId || unit.rosterId === unitId) ||
    FORMATION_ROSTER_UNITS.find((unit) => unit.baseId === unitId || unit.id === unitId) ||
    FORMATION_ROSTER_UNITS[0]
  );
}

function getFormationSlotsForCurrentPage() {
  return formationState.pages[formationState.activeType][formationState.activePage];
}

function ensureFormationOwnedUnits() {
  if (window.QAAPI?.isEnabled?.()) {
    return FORMATION_ROSTER_UNITS.slice(0, FORMATION_OWNED_UNIT_LIMIT);
  }
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
  return FORMATION_HEROES.find((hero) => hero.id === heroId) || FORMATION_HEROES[0];
}

function isFormationHeroUnlocked(heroId) {
  const hero = getFormationHero(heroId);
  return Boolean(hero.unlocked || playerProgress?.ownedGods?.[heroId]?.owned || playerProgress?.ownedGods?.[heroId]);
}

function getHeroGrowthMap() {
  if (!playerProgress.heroGrowth || typeof playerProgress.heroGrowth !== "object") {
    playerProgress.heroGrowth = {};
  }
  return playerProgress.heroGrowth;
}

function getFormationHeroStar(heroId) {
  const growth = getHeroGrowthMap()[heroId] || {};
  return Math.min(FORMATION_HERO_MAX_STAR, Math.max(FORMATION_HERO_BASE_STAR, Number(growth.star) || FORMATION_HERO_BASE_STAR));
}

function getFormationHeroLevel(heroId) {
  const star = getFormationHeroStar(heroId);
  const growth = getHeroGrowthMap()[heroId] || {};
  return Math.min(getFormationHeroLevelCap(heroId, star), Math.max(1, Number(growth.level) || 1));
}

function setFormationHeroGrowth(heroId, growth = {}) {
  const nextStar = Math.min(FORMATION_HERO_MAX_STAR, Math.max(FORMATION_HERO_BASE_STAR, Number(growth.star) || getFormationHeroStar(heroId)));
  const nextLevel = Math.min(getFormationHeroLevelCap(heroId, nextStar), Math.max(1, Number(growth.level) || getFormationHeroLevel(heroId)));
  getHeroGrowthMap()[heroId] = { star: nextStar, level: nextLevel };

  if (heroId === "zeus") {
    playerProgress.growth = playerProgress.growth || {};
    playerProgress.growth.hero = { level: nextLevel, star: nextStar };
    if (gameState) gameState.growth = playerProgress.growth;
  }

  saveProgress();
}

function getFormationHeroFragmentAmount() {
  return Math.max(0, Number(playerProgress.commonEssence) || 0);
}

function getFormationGoldAmount() {
  return Math.max(0, Number(playerProgress?.gold ?? gameWallet?.gold) || 0);
}

function getFormationHeroEssenceMeta(heroId = formationState.selectedHeroId) {
  return FORMATION_HERO_ESSENCES[heroId] || FORMATION_HERO_ESSENCES.zeus;
}

function getFormationHeroEssenceAmount(heroId = formationState.selectedHeroId) {
  const meta = getFormationHeroEssenceMeta(heroId);
  return Math.max(0, Number(playerProgress?.essences?.[meta.key]) || 0);
}

function getFormationHeroLevelAction(heroId = formationState.selectedHeroId) {
  const star = getFormationHeroStar(heroId);
  const level = getFormationHeroLevel(heroId);
  const levelCap = getFormationHeroLevelCap(heroId, star);
  if (level >= levelCap) return null;
  return { type: "level", cost: getFormationHeroLevelCost(heroId), nextLevel: level + 1 };
}

function getFormationHeroTranscendAction(heroId = formationState.selectedHeroId) {
  const star = getFormationHeroStar(heroId);
  if (star >= FORMATION_HERO_MAX_STAR) return null;
  return {
    type: "star",
    commonCost: FORMATION_HERO_TRANSCEND_COMMON_COST[star] || 0,
    essenceCost: FORMATION_HERO_TRANSCEND_SPECIFIC_COST[star] || FORMATION_HERO_FRAGMENT_COST,
    nextStar: star + 1,
  };
}

function getFormationUnitTranscendAction(unit = getFormationUnit(formationState.selectedUnitId)) {
  if (!unit || unit.star >= FORMATION_MAX_STAR) return null;
  return {
    type: "star",
    commonCost: FORMATION_UNIT_TRANSCEND_COMMON_COST[unit.star] || 0,
    soldierCost: getFormationTranscendCost(unit) || 0,
    nextStar: unit.star + 1,
  };
}

function formatFormationCostParts(parts) {
  return parts
    .filter((part) => part.amount > 0)
    .map((part) => `${part.label} ${part.amount.toLocaleString("ko-KR")}`)
    .join(" / ") || "무료";
}

function formatFormationLevelButtonCost(action) {
  if (!action || action.type !== "level") return "MAX";
  return `골드 ${action.cost.toLocaleString("ko-KR")}`;
}

function formatFormationTranscendButtonCost(parts) {
  if (!parts.some((part) => part.required > 0)) return "무료";
  return parts
    .map((part) => `${part.label} ${part.owned.toLocaleString("ko-KR")}/${part.required.toLocaleString("ko-KR")}`)
    .join(" / ");
}

function getFormationHeroVisibleGrowthAction(heroId = formationState.selectedHeroId) {
  const levelAction = getFormationHeroLevelAction(heroId);
  if (levelAction) {
    return {
      ...levelAction,
      label: "레벨업 하기",
      costLabel: `골드 ${levelAction.cost.toLocaleString("ko-KR")}`,
    };
  }

  const starAction = getFormationHeroTranscendAction(heroId);
  if (!starAction) return { type: "max", label: "MAX", costLabel: "MAX" };
  const heroEssenceMeta = getFormationHeroEssenceMeta(heroId);
  return {
    ...starAction,
    label: "초월",
    costLabel: formatFormationCostParts([
      { label: "공통정수", amount: starAction.commonCost },
      { label: heroEssenceMeta.name, amount: starAction.essenceCost },
    ]),
  };
}

function getFormationUnitVisibleGrowthAction(unit = getFormationUnit(formationState.selectedUnitId)) {
  if (!unit) return { type: "max", label: "MAX", costLabel: "선택 필요" };
  const lockLabel = getFormationLevelUpLockLabel(unit);
  if (!lockLabel) {
    const cost = getFormationLevelUpCost(unit);
    return {
      type: "level",
      cost,
      nextLevel: unit.level + 1,
      label: "레벨업 하기",
      costLabel: `골드 ${cost.toLocaleString("ko-KR")}`,
    };
  }

  if (lockLabel === "MAX") return { type: "max", label: "MAX", costLabel: "MAX" };
  const starAction = getFormationUnitTranscendAction(unit);
  if (!starAction) return { type: "max", label: "MAX", costLabel: lockLabel };
  return {
    ...starAction,
    label: "초월",
    costLabel: formatFormationCostParts([
      { label: "공통정수", amount: starAction.commonCost },
      { label: "병사정수", amount: starAction.soldierCost },
    ]),
  };
}

function getFormationGrowthActionByType(target, actionType) {
  if (target === "unit") {
    const unit = getFormationUnit(formationState.selectedUnitId);
    if (!unit) return { type: "max", label: "MAX", costLabel: "선택 필요" };
    if (actionType === "level") {
      const lockLabel = getFormationLevelUpLockLabel(unit);
      if (lockLabel) return { type: "max", label: "레벨업", costLabel: lockLabel };
      const cost = getFormationLevelUpCost(unit);
      return {
        type: "level",
        cost,
        nextLevel: unit.level + 1,
        label: "레벨업",
        costLabel: `골드 ${cost.toLocaleString("ko-KR")}`,
      };
    }
    if (actionType === "star") {
      const starAction = getFormationUnitTranscendAction(unit);
      if (!starAction) return { type: "max", label: "초월", costLabel: "MAX" };
      return {
        ...starAction,
        label: "초월",
        costLabel: formatFormationCostParts([
          { label: "공통정수", amount: starAction.commonCost },
          { label: "병사정수", amount: starAction.soldierCost },
        ]),
      };
    }
    return getFormationUnitVisibleGrowthAction(unit);
  }

  const hero = getFormationHero();
  if (actionType === "level") {
    const levelAction = getFormationHeroLevelAction(hero.id);
    if (!levelAction) return { type: "max", label: "레벨업", costLabel: "MAX" };
    return {
      ...levelAction,
      label: "레벨업",
      costLabel: `골드 ${levelAction.cost.toLocaleString("ko-KR")}`,
    };
  }
  if (actionType === "star") {
    const starAction = getFormationHeroTranscendAction(hero.id);
    if (!starAction) return { type: "max", label: "초월", costLabel: "MAX" };
    const heroEssenceMeta = getFormationHeroEssenceMeta(hero.id);
    return {
      ...starAction,
      label: "초월",
      costLabel: formatFormationCostParts([
        { label: "공통정수", amount: starAction.commonCost },
        { label: heroEssenceMeta.name, amount: starAction.essenceCost },
      ]),
    };
  }
  return getFormationHeroVisibleGrowthAction(hero.id);
}

function initializeFormationHeroGrowthDefaults() {
  if (playerProgress.heroGrowthVersion !== FORMATION_HERO_GROWTH_VERSION) {
    playerProgress.heroGrowth = {};
    FORMATION_HEROES.forEach((hero) => {
      playerProgress.heroGrowth[hero.id] = { star: FORMATION_HERO_BASE_STAR, level: 1 };
    });
    playerProgress.heroGrowthVersion = FORMATION_HERO_GROWTH_VERSION;
    playerProgress.growth = playerProgress.growth || {};
    playerProgress.growth.hero = { level: 1, star: FORMATION_HERO_BASE_STAR };
    if (gameState) gameState.growth = playerProgress.growth;
    saveProgress();
    return;
  }

  FORMATION_HEROES.forEach((hero) => {
    const growth = getHeroGrowthMap()[hero.id] || {};
    if (Number(growth.star) >= FORMATION_HERO_BASE_STAR && Number(growth.level) >= 1) return;
    setFormationHeroGrowth(hero.id, {
      star: Math.max(FORMATION_HERO_BASE_STAR, Number(growth.star) || FORMATION_HERO_BASE_STAR),
      level: Math.max(1, Number(growth.level) || 1),
    });
  });
}

function getFormationHeroLevelCap(heroId, star = getFormationHeroStar(heroId)) {
  return star <= 3 ? 30 : star * 10;
}

function getFormationHeroLevelCost(heroId) {
  const level = getFormationHeroLevel(heroId);
  if (level >= getFormationHeroLevelCap(heroId)) return 0;

  const existingCost = typeof getLevelUpGoldCost === "function"
    ? getLevelUpGoldCost("hero", level, level + 1)
    : null;
  if (existingCost !== null && typeof existingCost === "number") return existingCost;

  const level29Cost = getNormalCumulativeLevelCost(30) - getNormalCumulativeLevelCost(29);
  const overLevel = Math.max(1, level - 29);
  return Math.ceil(level29Cost * 1.25 * (1 + overLevel * 0.08));
}

function getFormationHeroGrowthAction(heroId = formationState.selectedHeroId) {
  const star = getFormationHeroStar(heroId);
  const level = getFormationHeroLevel(heroId);
  const levelCap = getFormationHeroLevelCap(heroId, star);

  if (level < levelCap) {
    return { type: "level", cost: getFormationHeroLevelCost(heroId), nextLevel: level + 1 };
  }
  if (star < FORMATION_HERO_MAX_STAR) {
    return {
      type: "star",
      cost: star >= 3 ? FORMATION_HERO_FRAGMENT_COST : 0,
      nextStar: star + 1,
    };
  }
  return { type: "max", cost: 0 };
}

function getFormationHeroGrowthActionKey(heroId, action) {
  if (!action || action.type === "max") return "";
  return `${heroId}:${action.type}:${action.nextLevel || action.nextStar || 0}`;
}

function getFormationHeroStats(heroId = formationState.selectedHeroId) {
  const star = getFormationHeroStar(heroId);
  const level = getFormationHeroLevel(heroId);
  const stats = getGrownStats("hero", { hp: 180, damage: 34 }, { level, star });

  return {
    hp: stats.hp,
    damage: stats.damage,
    range: 275,
    attackSpeed: 0.48,
  };
}

function getFormationUnitFragmentAmount() {
  return Math.max(0, Number(playerProgress.soldierFragments) || 0);
}

function getFormationUnitStats(unit = getFormationUnit(formationState.selectedUnitId)) {
  return {
    hp: unit.hp,
    damage: unit.attack,
    defense: unit.defense,
    range: unit.baseId === "guard" ? 42 : unit.baseId === "archer" || unit.baseId === "mage" ? 260 : 90,
    attackSpeed: unit.baseId === "guard" ? 1.0 : unit.baseId === "thief" ? 0.62 : unit.baseId === "mage" ? 0.82 : 0.72,
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
  const growthType = unit.rarity === "hero" ? "hero" : "guard";

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
  if (unit.rarity === "hero") return 40;
  if (unit.star === 1) return 20;
  if (unit.star === 2) return 30;
  if (unit.star === 3) return 50;
  if (unit.star === 4) return 80;
  return null;
}

function getFormationLevelRequirement(unit) {
  if (!unit || unit.level >= unit.maxLevel) return null;
  if (typeof getRequiredTranscendenceStarForLevel !== "function") return null;

  const nextLevel = unit.level + 1;
  const requiredStar = getRequiredTranscendenceStarForLevel(nextLevel);
  return unit.star >= requiredStar ? null : requiredStar;
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
      <div class="formation-currency gold"><span>골드</span><strong data-wallet-value="gold">8,520</strong></div>
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
  const lockedClass = hero.unlocked ? "" : " is-locked";
  const star = getFormationHeroStar(hero.id);
  const level = getFormationHeroLevel(hero.id);
  const lockMarkup = hero.unlocked ? "" : `<span class="formation-hero-lock" aria-hidden="true">🔒</span>`;

  return `
    <button class="formation-unit-card formation-hero-card${selectedClass}${lockedClass}" type="button" data-hero-id="${hero.id}" ${hero.unlocked ? "" : "disabled"} aria-label="${hero.name}">
      <img src="${hero.image}" alt="${hero.name}">
      ${lockMarkup}
      <span class="formation-unit-name">${hero.name}</span>
      <span class="formation-unit-level">${"★".repeat(star)}${"☆".repeat(FORMATION_HERO_MAX_STAR - star)} Lv.${level}</span>
    </button>
  `;
}

function renderFormationHeroDetail() {
  const hero = getFormationHero();
  const star = getFormationHeroStar(hero.id);
  const level = getFormationHeroLevel(hero.id);
  const levelCap = getFormationHeroLevelCap(hero.id);
  const commonEssenceAmount = getFormationHeroFragmentAmount();
  const heroEssenceMeta = getFormationHeroEssenceMeta(hero.id);
  const heroEssenceAmount = getFormationHeroEssenceAmount(hero.id);
  const goldAmount = getFormationGoldAmount();
  const isUnlocked = isFormationHeroUnlocked(hero.id);
  const levelAction = getFormationGrowthActionByType("hero", "level");
  const transcendAction = getFormationGrowthActionByType("hero", "star");
  const stats = getFormationHeroStats(hero.id);
  const canLevelUp = isUnlocked && levelAction.type === "level" && goldAmount >= levelAction.cost;
  const canTranscend = isUnlocked && transcendAction.type === "star"
    && commonEssenceAmount >= transcendAction.commonCost
    && heroEssenceAmount >= transcendAction.essenceCost;

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
          <div class="formation-hero-stars" aria-label="현재 성급">${"★".repeat(star)}${"☆".repeat(FORMATION_HERO_MAX_STAR - star)}</div>
        </div>
        <dl class="formation-hero-detail-list">
          <div><dt>패시브 능력</dt><dd>${hero.passive}</dd></div>
          <div><dt>스킬 종류</dt><dd>${hero.skillType || ""}</dd></div>
          <div><dt>현재 성급</dt><dd>${star}성 / ${FORMATION_HERO_MAX_STAR}성</dd></div>
          <div><dt>현재 레벨</dt><dd>Lv.${level} / ${levelCap}</dd></div>
          <div><dt>신의정수</dt><dd>${fragmentAmount.toLocaleString("ko-KR")} / ${FORMATION_HERO_FRAGMENT_COST}</dd></div>
        </dl>
        <button id="formationHeroLevelUpBtn" class="formation-level-btn formation-hero-level-btn" type="button" ${hero.unlocked && !isMax && !lacksEssenceForStar ? "" : "disabled"}>
          레벨업 하기 <span>${costLabel ? `${costLabel} ${levelLabel}` : levelLabel}</span>
        </button>
        ${lacksEssenceForStar ? `<p class="formation-growth-lock">신의정수 ${action.cost}개를 모으면 ${action.nextStar}성 성장이 가능합니다.</p>` : ""}
        ${isPending ? `
          <div class="formation-growth-confirm" role="dialog" aria-label="영웅 성장 확인">
            <p>${pendingMessage}</p>
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
    const levelUpBtn = document.getElementById("formationHeroLevelUpBtn");
    const confirmBtn = document.getElementById("formationHeroGrowthConfirmBtn");
    const cancelBtn = document.getElementById("formationHeroGrowthCancelBtn");
    if (detailCard) detailCard.addEventListener("click", toggleFormationHeroDetailFlip);
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

    rosterGrid.querySelectorAll(".formation-hero-card:not(.is-locked)").forEach((card) => {
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
  const nextCost = getFormationLevelUpCost(unit);

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
    const lockLabel = getFormationLevelUpLockLabel(unit);
    if (cost) cost.textContent = lockLabel || nextCost.toLocaleString("ko-KR");
    levelBtn.disabled = Boolean(lockLabel);
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
  if (!isFormationHeroUnlocked(hero.id)) {
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
  requestFormationGrowthConfirm("unit", "level");
}

function transcendFormationUnit() {
  requestFormationGrowthConfirm("unit", "star");
}

function executeFormationUnitGrowth(actionType = null) {
  const unit = getFormationUnit(formationState.selectedUnitId);
  const action = getFormationGrowthActionByType("unit", actionType);
  if (action.type === "max") {
    showFormationMessage(action.costLabel === "MAX" ? "이미 최대 성장 상태입니다." : `성장 조건: ${action.costLabel}`, "warning");
    return;
  }

  if (action.type === "star") {
    if (getFormationHeroFragmentAmount() < action.commonCost) {
      showFormationMessage(`공통정수가 부족합니다. 초월에는 ${action.commonCost}개가 필요합니다.`, "warning");
      return;
    }

    if (getFormationUnitFragmentAmount() < action.soldierCost) {
      showFormationMessage(`병사정수가 부족합니다. 초월에는 ${action.soldierCost}개가 필요합니다.`, "warning");
      return;
    }

    if (playerProgress) {
      playerProgress.commonEssence = Math.max(0, getFormationHeroFragmentAmount() - action.commonCost);
      playerProgress.soldierFragments = Math.max(0, getFormationUnitFragmentAmount() - action.soldierCost);
      saveProgress();
    }
    unit.star = action.nextStar;

    updateWalletDisplays();
    showFormationMessage(`${unit.name}이(가) ${action.nextStar}성으로 초월했습니다.`);
    renderFormationRoster();
    renderFormationSelectedInfo();
    renderFormationSlots();
    return;
  }

  if (gameWallet.gold < action.cost) {
    showFormationMessage(`골드가 부족합니다. 레벨업에는 ${action.cost.toLocaleString("ko-KR")}골드가 필요합니다.`, "warning");
    return;
  }

  gameWallet.gold -= action.cost;
  if (playerProgress) {
    playerProgress.gold = Math.max(0, Number(playerProgress.gold) || 0);
    playerProgress.gold = Math.max(0, playerProgress.gold - action.cost);
    saveProgress();
  }
  unit.level += 1;
  unit.attack += 12;
  unit.hp += 70;
  unit.defense += 6;

  updateWalletDisplays();
  showFormationMessage(`${unit.name}이(가) Lv.${unit.level}이 되었습니다.`);
  renderFormationRoster();
  renderFormationSelectedInfo();
  renderFormationSlots();
}

function requestFormationGrowthConfirm(target, actionType = null) {
  const isUnit = target === "unit";
  const name = isUnit ? getFormationUnit(formationState.selectedUnitId).name : getFormationHero().name;
  const action = getFormationGrowthActionByType(target, actionType);
  if (!action || action.type === "max") return;
  formationState.pendingGrowthConfirm = {
    target,
    actionType: action.type,
    message: `${name} ${action.type === "star" ? "초월" : "레벨업"}을 하시겠습니까?`,
  };
  renderFormationSlots();
}

function renderFormationGrowthConfirm() {
  const pending = formationState.pendingGrowthConfirm;
  if (!pending) return "";
  return `
    <div class="formation-growth-center-confirm" role="dialog" aria-label="성장 확인">
      <p>${pending.message}</p>
      <div>
        <button id="formationGrowthProceedBtn" type="button">진행</button>
        <button id="formationGrowthDismissBtn" type="button">취소</button>
      </div>
    </div>
  `;
}

function confirmFormationGrowthRequest() {
  const pending = formationState.pendingGrowthConfirm;
  if (!pending) return;
  formationState.pendingGrowthConfirm = null;
  if (pending.target === "unit") {
    executeFormationUnitGrowth(pending.actionType);
  } else {
    executeFormationHeroGrowth(pending.actionType);
  }
}

function cancelFormationGrowthRequest() {
  formationState.pendingGrowthConfirm = null;
  showFormationMessage("성장을 취소했습니다.");
  renderFormationSlots();
}

function levelUpFormationHero() {
  requestFormationGrowthConfirm("hero", "level");
}

function transcendFormationHero() {
  requestFormationGrowthConfirm("hero", "star");
}

function executeFormationHeroGrowth(actionType = null) {
  const hero = getFormationHero();
  const action = getFormationGrowthActionByType("hero", actionType);
  const currentStar = getFormationHeroStar(hero.id);
  const currentLevel = getFormationHeroLevel(hero.id);
  const heroEssenceMeta = getFormationHeroEssenceMeta(hero.id);

  if (!isFormationHeroUnlocked(hero.id)) {
    showFormationMessage(`${hero.name}은 아직 잠겨 있습니다.`, "warning");
    return;
  }

  if (action.type === "max") {
    showFormationMessage(`${hero.name}은 이미 최대 성장 상태입니다.`, "warning");
    return;
  }

  if (action.type === "star") {
    if (getFormationHeroFragmentAmount() < action.commonCost) {
      showFormationMessage(`공통정수가 부족합니다. 초월에는 ${action.commonCost}개가 필요합니다.`, "warning");
      return;
    }

    if (getFormationHeroEssenceAmount(hero.id) < action.essenceCost) {
      showFormationMessage(`${heroEssenceMeta.name}가 부족합니다. 초월에는 ${action.essenceCost}개가 필요합니다.`, "warning");
      return;
    }

    if (playerProgress) {
      playerProgress.commonEssence = Math.max(0, getFormationHeroFragmentAmount() - action.commonCost);
      playerProgress.essences = playerProgress.essences || {};
      playerProgress.essences[heroEssenceMeta.key] = Math.max(0, getFormationHeroEssenceAmount(hero.id) - action.essenceCost);
    }
    setFormationHeroGrowth(hero.id, { star: action.nextStar, level: currentLevel });
    formationState.pendingHeroGrowthAction = null;
    updateWalletDisplays();
    showFormationMessage(`${hero.name}이(가) ${action.nextStar}성으로 초월했습니다. Lv.${getFormationHeroLevelCap(hero.id, action.nextStar)}까지 성장할 수 있습니다.`);
    renderFormationSlots();
    renderFormationRoster();
    return;
  }

  if (gameWallet.gold < action.cost) {
    showFormationMessage(`골드가 부족합니다. 레벨업에는 ${action.cost.toLocaleString("ko-KR")} 골드가 필요합니다.`, "warning");
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
  showFormationMessage(`${hero.name}이(가) Lv.${action.nextLevel}이 되었습니다.`);
  renderFormationSlots();
  renderFormationRoster();
}

function confirmFormationHeroGrowth() {
  formationState.pendingHeroGrowthAction = null;
  renderFormationSlots();
}

function cancelFormationHeroGrowth() {
  formationState.pendingHeroGrowthAction = null;
  showFormationMessage("성장을 취소했습니다.");
  renderFormationSlots();
}

function createFormationShellMarkup() {
  return `
    <div class="formation-scanline" aria-hidden="true"></div>

    <button id="formationBackBtn" class="formation-ui-btn formation-back-btn" type="button">로비</button>

    <div class="formation-topbar formation-wallet-wide" aria-label="재화 정보">
      <div class="formation-currency gold"><img src="assets/icons/gold.png" alt=""><span>골드</span><strong data-wallet-value="gold">0</strong></div>
      <div class="formation-currency blue"><img src="assets/icons/diamond.png" alt=""><span>다이아몬드</span><strong data-wallet-value="diamond">0</strong></div>
      <div class="formation-currency ticket"><img src="assets/icons/ticket.png" alt=""><span>신 모집권</span><strong data-wallet-value="summonTickets">0</strong></div>
      <div class="formation-currency essence"><img src="assets/icons/essence_all.png" alt=""><span>신의정수</span><strong data-wallet-value="commonEssence">0</strong></div>
      <div class="formation-currency soldier"><img src="assets/icons/essence_soldier.png" alt=""><span>병사정수</span><strong data-wallet-value="soldierFragments">0</strong></div>
    </div>

    <div class="formation-shell">
      <aside class="formation-brand-panel" aria-label="성장 로고">
        <div class="formation-brand-emblem" aria-hidden="true">✦</div>
        <strong>성장</strong>
        <span>GROWTH</span>
        <nav class="formation-category-nav" aria-label="성장 카테고리">
          <button class="formation-category-btn is-active" type="button" data-formation-category="hero">영웅</button>
          <button class="formation-category-btn" type="button" data-formation-category="unit">유닛</button>
          <button class="formation-category-btn" type="button" data-formation-category="inventory">인벤토리</button>
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

      <aside class="formation-roster-panel" aria-label="보유 카드 목록" data-roster-title="보유 영웅">
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
  const isUnlocked = isFormationHeroUnlocked(hero.id);
  const selectedClass = options.selected ? " is-selected" : "";
  const lockedClass = isUnlocked ? "" : " is-locked";
  const star = getFormationHeroStar(hero.id);
  const level = getFormationHeroLevel(hero.id);
  const lockMarkup = isUnlocked ? "" : `<span class="formation-hero-lock" aria-hidden="true">🔒</span>`;

  return `
    <button class="formation-unit-card formation-hero-card${selectedClass}${lockedClass}" type="button" data-hero-id="${hero.id}" ${isUnlocked ? "" : "disabled"} aria-label="${hero.name}">
      <img src="${hero.image}" alt="${hero.name}">
      ${lockMarkup}
      <span class="formation-unit-name">${hero.name}</span>
      <span class="formation-unit-level">${"★".repeat(star)}${"☆".repeat(FORMATION_HERO_MAX_STAR - star)} Lv.${level}</span>
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
  const commonEssenceAmount = getFormationHeroFragmentAmount();
  const heroEssenceMeta = getFormationHeroEssenceMeta(hero.id);
  const heroEssenceAmount = getFormationHeroEssenceAmount(hero.id);
  const goldAmount = getFormationGoldAmount();
  const stats = getFormationHeroStats(hero.id);
  const isUnlocked = isFormationHeroUnlocked(hero.id);
  const levelAction = getFormationGrowthActionByType("hero", "level");
  const transcendAction = getFormationGrowthActionByType("hero", "star");
  const canLevelUp = isUnlocked && levelAction.type === "level" && goldAmount >= levelAction.cost;
  const canTranscend = isUnlocked && transcendAction.type === "star"
    && commonEssenceAmount >= transcendAction.commonCost
    && heroEssenceAmount >= transcendAction.essenceCost;

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
          <div class="formation-hero-stars" aria-label="현재 성급">${"★".repeat(star)}${"☆".repeat(FORMATION_HERO_MAX_STAR - star)}</div>
        </div>
        <dl class="formation-hero-detail-list">
          <div><dt>패시브스킬</dt><dd>${hero.passive}</dd></div>
          <div><dt>기본스킬</dt><dd>${hero.skillType || "전투 중 기본 스킬을 사용합니다."}</dd></div>
          <div><dt>현재 성급</dt><dd>${star}성 / ${FORMATION_HERO_MAX_STAR}성</dd></div>
          <div><dt>현재 레벨</dt><dd>Lv.${level} / ${levelCap}</dd></div>
          <div><dt>공통정수</dt><dd>${commonEssenceAmount.toLocaleString("ko-KR")}</dd></div>
          <div><dt>${heroEssenceMeta.name}</dt><dd>${heroEssenceAmount.toLocaleString("ko-KR")}</dd></div>
          <div><dt>골드</dt><dd>${goldAmount.toLocaleString("ko-KR")}</dd></div>
        </dl>
        <div class="formation-growth-actions">
          <button id="formationHeroLevelUpBtn" class="formation-level-btn formation-hero-level-btn" type="button" ${canLevelUp ? "" : "disabled"}>
            <span class="formation-level-btn-label">레벨업</span>
            <span class="formation-level-btn-meta">(${formatFormationLevelButtonCost(levelAction)})</span>
          </button>
          <button id="formationHeroTranscendBtn" class="formation-level-btn formation-hero-level-btn formation-transcend-btn" type="button" ${canTranscend ? "" : "disabled"}>
            <span class="formation-level-btn-label">초월</span>
            <span class="formation-level-btn-meta">${formatFormationTranscendButtonCost([
              { label: "공통정수", owned: commonEssenceAmount, required: transcendAction.commonCost || 0 },
              { label: heroEssenceMeta.name, owned: heroEssenceAmount, required: transcendAction.essenceCost || 0 },
            ])}</span>
          </button>
        </div>
        ${renderFormationGrowthConfirm()}
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
  const commonEssenceAmount = getFormationHeroFragmentAmount();
  const soldierEssenceAmount = getFormationUnitFragmentAmount();
  const goldAmount = getFormationGoldAmount();
  const levelAction = getFormationGrowthActionByType("unit", "level");
  const transcendAction = getFormationGrowthActionByType("unit", "star");
  const canLevelUp = levelAction.type === "level" && goldAmount >= levelAction.cost;
  const canTranscend = transcendAction.type === "star"
    && commonEssenceAmount >= transcendAction.commonCost
    && soldierEssenceAmount >= transcendAction.soldierCost;

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
          { label: "공격력", value: stats.damage },
          { label: "체력", value: stats.hp },
          { label: "방어력", value: stats.defense },
          { label: "사거리", value: stats.range },
          { label: "공격속도", value: stats.attackSpeed.toFixed(2) },
        ],
      })}
      <div class="formation-hero-detail-info">
        <div class="formation-hero-detail-top">
          <p class="formation-kicker">UNIT</p>
          <h2>${unit.name}</h2>
          <div class="formation-hero-stars formation-unit-diamonds" aria-label="현재 성급">${"◆".repeat(unit.star)}${"◇".repeat(FORMATION_MAX_STAR - unit.star)}</div>
        </div>
        <dl class="formation-hero-detail-list">
          <div><dt>스킬</dt><dd>${unit.ability || "전투에서 아군 진형을 보조합니다."}</dd></div>
          <div><dt>현재 성급</dt><dd>${unit.star}성 / ${FORMATION_MAX_STAR}성</dd></div>
          <div><dt>현재 레벨</dt><dd>Lv.${unit.level} / ${unit.maxLevel}</dd></div>
          <div><dt>공통정수</dt><dd>${commonEssenceAmount.toLocaleString("ko-KR")}</dd></div>
          <div><dt>병사정수</dt><dd>${soldierEssenceAmount.toLocaleString("ko-KR")}</dd></div>
          <div><dt>골드</dt><dd>${goldAmount.toLocaleString("ko-KR")}</dd></div>
        </dl>
        <div class="formation-growth-actions">
          <button id="formationUnitLevelUpBtn" class="formation-level-btn formation-hero-level-btn" type="button" ${canLevelUp ? "" : "disabled"}>
            <span class="formation-level-btn-label">레벨업</span>
            <span class="formation-level-btn-meta">(${formatFormationLevelButtonCost(levelAction)})</span>
          </button>
          <button id="formationUnitTranscendBtn" class="formation-level-btn formation-hero-level-btn formation-transcend-btn" type="button" ${canTranscend ? "" : "disabled"}>
            <span class="formation-level-btn-label">초월</span>
            <span class="formation-level-btn-meta">${formatFormationTranscendButtonCost([
              { label: "공통정수", owned: commonEssenceAmount, required: transcendAction.commonCost || 0 },
              { label: "병사정수", owned: soldierEssenceAmount, required: transcendAction.soldierCost || 0 },
            ])}</span>
          </button>
        </div>
        ${renderFormationGrowthConfirm()}
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
  const heroLevelUpBtn = document.getElementById("formationHeroLevelUpBtn");
  const heroTranscendBtn = document.getElementById("formationHeroTranscendBtn");
  const unitLevelUpBtn = document.getElementById("formationUnitLevelUpBtn");
  const unitTranscendBtn = document.getElementById("formationUnitTranscendBtn");
  const confirmBtn = document.getElementById("formationHeroGrowthConfirmBtn");
  const cancelBtn = document.getElementById("formationHeroGrowthCancelBtn");
  const growthProceedBtn = document.getElementById("formationGrowthProceedBtn");
  const growthDismissBtn = document.getElementById("formationGrowthDismissBtn");
  if (detailCard) detailCard.addEventListener("click", toggleFormationDetailFlip);
  if (heroLevelUpBtn) heroLevelUpBtn.addEventListener("click", levelUpFormationHero);
  if (heroTranscendBtn) heroTranscendBtn.addEventListener("click", transcendFormationHero);
  if (unitLevelUpBtn) unitLevelUpBtn.addEventListener("click", levelUpFormationUnit);
  if (unitTranscendBtn) unitTranscendBtn.addEventListener("click", transcendFormationUnit);
  if (confirmBtn) confirmBtn.addEventListener("click", confirmFormationHeroGrowth);
  if (cancelBtn) cancelBtn.addEventListener("click", cancelFormationHeroGrowth);
  if (growthProceedBtn) growthProceedBtn.addEventListener("click", confirmFormationGrowthRequest);
  if (growthDismissBtn) growthDismissBtn.addEventListener("click", cancelFormationGrowthRequest);

  const slotTitle = document.getElementById("formationSlotTitle");
  if (slotTitle) slotTitle.textContent = formationState.activeCategory === "unit" ? "유닛" : "영웅";
}

function renderFormationRoster() {
  const rosterGrid = document.getElementById("formationRosterGrid");
  const rosterCount = document.getElementById("formationRosterCount");
  if (!rosterGrid) return;

  const rosterTitle = document.querySelector(".formation-roster-head strong");
  const rosterPanel = document.querySelector(".formation-roster-panel");
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
    if (rosterPanel) rosterPanel.dataset.rosterTitle = "보유 유닛";
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
  if (rosterPanel) rosterPanel.dataset.rosterTitle = "보유 영웅";
  if (rosterCount) rosterCount.textContent = `${getFormationHeroOwnedCount()} / ${FORMATION_HEROES.length}`;
  rosterGrid.innerHTML = FORMATION_HEROES
    .map((hero) => renderFormationHeroCard(hero, { selected: hero.id === formationState.selectedHeroId }))
    .join("");
  rosterGrid.querySelectorAll(".formation-hero-card:not(.is-locked)").forEach((card) => {
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
  if (category === "inventory") {
    showInventory();
    return;
  }
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

  const levelBonus = Math.max(0, formationUnit.level - 1);
  const multiplier = 1 + levelBonus * 0.08;
  const nextUnit = {
    ...battleUnit,
    formationUnitId: formationUnit.instanceId,
    formationLevel: formationUnit.level,
  };

  if (typeof nextUnit.maxHp === "number") {
    nextUnit.maxHp = Math.max(1, Math.round(nextUnit.maxHp * multiplier));
    nextUnit.hp = nextUnit.maxHp;
  }
  if (typeof nextUnit.damage === "number") {
    nextUnit.damage = Math.max(0, Math.round(nextUnit.damage * multiplier));
  }
  if (typeof nextUnit.healAmount === "number") {
    nextUnit.healAmount = Math.max(1, Math.round(nextUnit.healAmount * multiplier));
  }

  return nextUnit;
}
