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

const formationState = {
  activeType: "deck",
  activePage: 1,
  selectedUnitId: FORMATION_ROSTER_UNITS[0].instanceId,
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
  if (title) title.textContent = `${FORMATION_TYPE_LABELS[formationState.activeType]} 편성`;

  document.querySelectorAll(".formation-type-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.formationType === formationState.activeType);
  });

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

function setFormationType(type) {
  if (!FORMATION_TYPE_LABELS[type]) return;
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
