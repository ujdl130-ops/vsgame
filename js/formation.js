// Formation screen interactions.

const FORMATION_BASE_UNITS = [
  {
    id: "saintess",
    name: "성녀",
    image: "assets/maps/formation/saint.png",
    baseLevel: 4,
    maxLevel: 30,
    attack: 80,
    hp: 680,
    defense: 48,
    rarity: "normal",
  },
  {
    id: "archer",
    name: "궁수",
    image: "assets/maps/formation/archer.png",
    baseLevel: 2,
    maxLevel: 30,
    attack: 115,
    hp: 520,
    defense: 34,
    rarity: "normal",
  },
  {
    id: "thief",
    name: "도적",
    image: "assets/maps/formation/fighter.png",
    baseLevel: 5,
    maxLevel: 30,
    attack: 135,
    hp: 560,
    defense: 38,
    rarity: "normal",
  },
  {
    id: "mage",
    name: "마법사",
    image: "assets/maps/formation/magic.png",
    baseLevel: 3,
    maxLevel: 30,
    attack: 150,
    hp: 480,
    defense: 30,
    rarity: "normal",
  },
];

const FORMATION_LEVEL_COSTS = [
  { level: 1, normal: 0 },
  { level: 10, normal: 1970 },
  { level: 20, normal: 12010 },
  { level: 30, normal: 38050 },
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

const FORMATION_HERO_FRAGMENT_COST = 50;
const FORMATION_HERO_MAX_STAR = 5;
const FORMATION_HERO_BASE_STAR = 3;

const FORMATION_HEROES = [
  {
    id: "zeus",
    name: "제우스",
    image: "assets/maps/formation/zeus.png",
    unlocked: true,
    passive: "천벌: 일정 영역에 번개를 내려 범위 안의 적에게 지속 피해를 줍니다.",
    skillType: "",
  },
  {
    id: "poseidon",
    name: "포세이돈",
    image: "assets/maps/formation/poseidon.png",
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
  return (
    FORMATION_ROSTER_UNITS.find((unit) => unit.instanceId === unitId || unit.rosterId === unitId) ||
    FORMATION_ROSTER_UNITS.find((unit) => unit.baseId === unitId || unit.id === unitId) ||
    FORMATION_ROSTER_UNITS[0]
  );
}

function getFormationSlotsForCurrentPage() {
  return formationState.pages[formationState.activeType][formationState.activePage];
}

function getFormationHero(heroId = formationState.selectedHeroId) {
  return FORMATION_HEROES.find((hero) => hero.id === heroId) || FORMATION_HEROES[0];
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
  return Math.min(star * 10, Math.max(1, Number(growth.level) || 1));
}

function setFormationHeroGrowth(heroId, growth = {}) {
  const nextStar = Math.min(FORMATION_HERO_MAX_STAR, Math.max(FORMATION_HERO_BASE_STAR, Number(growth.star) || getFormationHeroStar(heroId)));
  const nextLevel = Math.min(nextStar * 10, Math.max(1, Number(growth.level) || getFormationHeroLevel(heroId)));
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

function initializeFormationHeroGrowthDefaults() {
  FORMATION_HEROES.forEach((hero) => {
    const growth = getHeroGrowthMap()[hero.id] || {};
    if (Number(growth.star) >= FORMATION_HERO_BASE_STAR && Number(growth.level) >= 1) return;
    setFormationHeroGrowth(hero.id, {
      star: Math.max(FORMATION_HERO_BASE_STAR, Number(growth.star) || FORMATION_HERO_BASE_STAR),
      level: Math.max(1, Number(growth.level) || 1),
    });
  });
}

function getFormationHeroLevelCap(heroId) {
  return getFormationHeroStar(heroId) * 10;
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
  const levelCap = star * 10;

  if (level < levelCap) {
    return { type: "level", cost: getFormationHeroLevelCost(heroId), nextLevel: level + 1 };
  }
  if (star < FORMATION_HERO_MAX_STAR) {
    return { type: "star", cost: FORMATION_HERO_FRAGMENT_COST, nextStar: star + 1 };
  }
  return { type: "max", cost: 0 };
}

function getNormalCumulativeLevelCost(level) {
  const targetLevel = Math.min(Math.max(Number(level) || 1, 1), 30);
  for (let i = 1; i < FORMATION_LEVEL_COSTS.length; i++) {
    const previous = FORMATION_LEVEL_COSTS[i - 1];
    const next = FORMATION_LEVEL_COSTS[i];
    if (targetLevel <= next.level) {
      const rangeLevel = next.level - previous.level;
      const rangeCost = next.normal - previous.normal;
      const progress = (targetLevel - previous.level) / rangeLevel;
      return Math.ceil(previous.normal + rangeCost * progress);
    }
  }
  return FORMATION_LEVEL_COSTS[FORMATION_LEVEL_COSTS.length - 1].normal;
}

function getFormationCumulativeLevelCost(unit, level) {
  const normalCost = getNormalCumulativeLevelCost(level);
  return unit.rarity === "hero" ? Math.ceil(normalCost * 1.25) : normalCost;
}

function getFormationLevelUpCost(unit) {
  if (!unit || unit.level >= unit.maxLevel) return 0;
  return getFormationCumulativeLevelCost(unit, unit.level + 1) - getFormationCumulativeLevelCost(unit, unit.level);
}

function getFormationTranscendCost(unit) {
  if (!unit || unit.star >= 3) return null;
  if (unit.rarity === "hero") return 40;
  return unit.star === 1 ? 20 : 30;
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
      <span class="formation-unit-level">Lv.${unit.level}</span>
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
  const fragmentAmount = getFormationHeroFragmentAmount();
  const action = getFormationHeroGrowthAction(hero.id);
  const isMax = action.type === "max";
  const levelLabel = isMax ? "MAX" : action.type === "level" ? action.cost.toLocaleString("ko-KR") : FORMATION_HERO_FRAGMENT_COST;
  const costLabel = action.type === "level" ? "골드" : action.type === "star" ? "신의정수" : "";

  return `
    <div class="formation-hero-detail">
      <div class="formation-hero-detail-card">
        <img src="${hero.image}" alt="${hero.name}">
      </div>
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
        <button id="formationHeroLevelUpBtn" class="formation-level-btn formation-hero-level-btn" type="button" ${hero.unlocked && !isMax ? "" : "disabled"}>
          레벨업 하기 <span>${costLabel ? `${costLabel} ${levelLabel}` : levelLabel}</span>
        </button>
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
    const levelUpBtn = document.getElementById("formationHeroLevelUpBtn");
    if (levelUpBtn) levelUpBtn.addEventListener("click", levelUpFormationHero);

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
    if (cost) cost.textContent = unit.level >= unit.maxLevel ? "MAX" : nextCost.toLocaleString("ko-KR");
    levelBtn.disabled = unit.level >= unit.maxLevel;
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
  showFormationMessage(`${hero.name} 정보를 확인합니다.`);
  renderFormationSlots();
  renderFormationRoster();
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
  if (unit.level >= unit.maxLevel) {
    showFormationMessage("이미 최대 레벨입니다.", "warning");
    return;
  }

  const cost = getFormationLevelUpCost(unit);
  if (gameWallet.gold < cost) {
    showFormationMessage(`골드가 부족합니다. 레벨업에는 ${cost.toLocaleString("ko-KR")}골드가 필요합니다.`, "warning");
    return;
  }

  gameWallet.gold -= cost;
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

function levelUpFormationHero() {
  const hero = getFormationHero();
  const currentStar = getFormationHeroStar(hero.id);
  const currentLevel = getFormationHeroLevel(hero.id);
  const action = getFormationHeroGrowthAction(hero.id);

  if (!hero.unlocked) {
    showFormationMessage(`${hero.name}은 아직 잠겨 있습니다.`, "warning");
    return;
  }

  if (action.type === "max") {
    showFormationMessage(`${hero.name}은 이미 최대 성장 상태입니다.`, "warning");
    return;
  }

  if (action.type === "level") {
    const cost = action.cost;
    const message = `골드 ${cost.toLocaleString("ko-KR")}을 소모해 ${hero.name}을 Lv.${action.nextLevel}로 성장시킵니다.`;
    showFormationMessage(`${message} 진행하시겠습니까?`);
    if (!window.confirm(message)) return;

    if (gameWallet.gold < cost) {
      showFormationMessage(`골드가 부족합니다. 레벨업에는 ${cost.toLocaleString("ko-KR")} 골드가 필요합니다.`, "warning");
      return;
    }

    gameWallet.gold -= cost;
    setFormationHeroGrowth(hero.id, { star: currentStar, level: action.nextLevel });
    updateWalletDisplays();
    showFormationMessage(`${hero.name}이(가) Lv.${action.nextLevel}이 되었습니다.`);
    renderFormationSlots();
    renderFormationRoster();
    return;
  }

  const message = `신의정수 ${FORMATION_HERO_FRAGMENT_COST}개를 소모해 ${hero.name}을 ${action.nextStar}성으로 성장시킵니다.`;
  showFormationMessage(`${message} 진행하시겠습니까?`);
  if (!window.confirm(message)) return;

  if (getFormationHeroFragmentAmount() < FORMATION_HERO_FRAGMENT_COST) {
    showFormationMessage(`신의정수가 부족합니다. 성급업에는 ${FORMATION_HERO_FRAGMENT_COST}개가 필요합니다.`, "warning");
    return;
  }

  playerProgress.commonEssence = Math.max(0, getFormationHeroFragmentAmount() - FORMATION_HERO_FRAGMENT_COST);
  setFormationHeroGrowth(hero.id, { star: action.nextStar, level: currentLevel });
  updateWalletDisplays();
  showFormationMessage(`${hero.name}이(가) ${action.nextStar}성이 되었습니다. Lv.${action.nextStar * 10}까지 성장할 수 있습니다.`);
  renderFormationSlots();
  renderFormationRoster();
}

function getBestFormationBattleUnit(baseId) {
  const placedIds = Object.values(formationState.pages.deck)
    .flat()
    .filter(Boolean);
  const placedUnits = placedIds
    .map((unitId) => getFormationUnit(unitId))
    .filter((unit) => unit && unit.baseId === baseId);

  const candidates = placedUnits.length
    ? placedUnits
    : FORMATION_ROSTER_UNITS.filter((unit) => unit.baseId === baseId);

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
