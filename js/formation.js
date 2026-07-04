// Formation screen interactions.

const FORMATION_UNITS = [
  {
    id: "saintess",
    name: "성녀",
    image: "assets/maps/formation/saint.png",
    level: 4,
    maxLevel: 10,
    attack: 80,
    hp: 680,
    defense: 48,
  },
  {
    id: "archer",
    name: "궁수",
    image: "assets/maps/formation/archer.png",
    level: 2,
    maxLevel: 10,
    attack: 115,
    hp: 520,
    defense: 34,
  },
  {
    id: "thief",
    name: "도적",
    image: "assets/maps/formation/fighter.png",
    level: 5,
    maxLevel: 10,
    attack: 135,
    hp: 560,
    defense: 38,
  },
  {
    id: "mage",
    name: "마법사",
    image: "assets/maps/formation/magic.png",
    level: 3,
    maxLevel: 10,
    attack: 150,
    hp: 480,
    defense: 30,
  },
];

const formationState = {
  activePage: 1,
  selectedUnitId: "saintess",
  rosterPage: 1,
  pages: { 1: Array(10).fill(null), 2: Array(10).fill(null) },
};

function getFormationUnit(unitId) {
  return FORMATION_UNITS.find((unit) => unit.id === unitId) || FORMATION_UNITS[0];
}

function getFormationSlotsForCurrentPage() {
  return formationState.pages[formationState.activePage];
}

function createFormationShellMarkup() {
  return `
    <div class="formation-scanline" aria-hidden="true"></div>

    <button id="formationBackBtn" class="formation-ui-btn formation-back-btn" type="button">로비</button>
    <button id="formationCloseBtn" class="formation-ui-btn formation-close-btn" type="button">닫기</button>

    <div class="formation-topbar" aria-label="재화 정보">
      <div class="formation-currency orange"><span>티켓</span><strong>0</strong></div>
      <div class="formation-currency purple"><span>토큰</span><strong>0</strong></div>
      <div class="formation-currency blue"><span>젬</span><strong>0</strong></div>
      <div class="formation-currency gold"><span>골드</span><strong>8,520</strong></div>
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
        </header>

        <div class="formation-placement-head">
          <span id="formationSlotTitle">배치 슬롯 (0/10)</span>
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
          <span id="formationRosterCount">4 / 4</span>
        </div>
        <div id="formationRosterGrid" class="formation-roster-grid" aria-label="보유 유닛 카드"></div>
        <div class="formation-roster-pager" aria-label="보유 유닛 페이지">
          <button id="formationRosterPrev" class="formation-arrow-btn" type="button" aria-label="이전 보유 유닛">‹</button>
          <span id="formationRosterPageDots" class="formation-roster-dots"></span>
          <button id="formationRosterNext" class="formation-arrow-btn" type="button" aria-label="다음 보유 유닛">›</button>
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
              <button id="formationLevelUpBtn" class="formation-level-btn" type="button">레벨업 <span>500</span></button>
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
    <button class="formation-unit-card${selectedClass}" type="button" data-unit-id="${unit.id}" aria-label="${unit.name}">
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
      <button class="formation-slot" type="button" data-slot-index="${index}" aria-label="빈 슬롯 ${index + 1}">
        <span>${index + 1}</span>
        <i>+</i>
      </button>
    `;
  }

  return `
    <button class="formation-slot is-filled" type="button" data-slot-index="${index}" aria-label="${index + 1}번 슬롯 ${unit.name}">
      <em>${index + 1}</em>
      <img src="${unit.image}" alt="${unit.name}">
      <strong>${unit.name}</strong>
      <small>Lv.${unit.level}</small>
    </button>
  `;
}

function renderFormationSlots() {
  const slotGrid = document.getElementById("formationSlotGrid");
  if (!slotGrid) return;

  const slots = getFormationSlotsForCurrentPage();
  slotGrid.innerHTML = slots.map((unitId, index) => renderFormationSlotCard(unitId, index)).join("");
  slotGrid.querySelectorAll(".formation-slot").forEach((slot) => {
    slot.addEventListener("click", () => handleFormationSlotClick(Number(slot.dataset.slotIndex)));
  });

  const placedCount = slots.filter(Boolean).length;
  const slotTitle = document.getElementById("formationSlotTitle");
  if (slotTitle) slotTitle.textContent = `배치 슬롯 (${placedCount}/10)`;
}

function renderFormationRoster() {
  const rosterGrid = document.getElementById("formationRosterGrid");
  const dots = document.getElementById("formationRosterPageDots");
  const rosterCount = document.getElementById("formationRosterCount");
  if (!rosterGrid) return;

  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(FORMATION_UNITS.length / pageSize));
  formationState.rosterPage = Math.min(Math.max(1, formationState.rosterPage), pageCount);
  const start = (formationState.rosterPage - 1) * pageSize;
  const visibleUnits = FORMATION_UNITS.slice(start, start + pageSize);

  rosterGrid.innerHTML = visibleUnits
    .map((unit) => renderFormationUnitCard(unit, { selected: unit.id === formationState.selectedUnitId }))
    .join("");

  rosterGrid.querySelectorAll(".formation-unit-card").forEach((card) => {
    card.addEventListener("click", () => selectFormationUnit(card.dataset.unitId));
  });

  if (rosterCount) rosterCount.textContent = `${FORMATION_UNITS.length} / ${FORMATION_UNITS.length}`;
  if (dots) {
    dots.innerHTML = Array.from({ length: pageCount }, (_, index) => (
      `<span class="${index + 1 === formationState.rosterPage ? "is-active" : ""}"></span>`
    )).join("");
  }

  const prev = document.getElementById("formationRosterPrev");
  const next = document.getElementById("formationRosterNext");
  if (prev) prev.disabled = formationState.rosterPage <= 1;
  if (next) next.disabled = formationState.rosterPage >= pageCount;
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

  if (card) {
    card.innerHTML = `<img src="${unit.image}" alt="${unit.name}">`;
  }
  if (name) name.textContent = unit.name;
  if (level) level.textContent = `Lv.${unit.level} / ${unit.maxLevel}`;
  if (attack) attack.textContent = unit.attack;
  if (hp) hp.textContent = unit.hp;
  if (defense) defense.textContent = unit.defense;
  if (levelBtn) levelBtn.disabled = unit.level >= unit.maxLevel;
}

function renderFormationTabs() {
  const title = document.getElementById("formationTitle");
  if (title) title.textContent = "덱 편성";

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
}

function bindFormationScreenEvents() {
  const backBtn = document.getElementById("formationBackBtn");
  const closeBtn = document.getElementById("formationCloseBtn");
  const rosterPrev = document.getElementById("formationRosterPrev");
  const rosterNext = document.getElementById("formationRosterNext");
  const levelUpBtn = document.getElementById("formationLevelUpBtn");

  if (backBtn) backBtn.addEventListener("click", showLobby);
  if (closeBtn) closeBtn.addEventListener("click", showLobby);

  document.querySelectorAll(".formation-deck-tab").forEach((tab) => {
    tab.addEventListener("click", () => setFormationDeckPage(tab.dataset.deckPage || "1"));
  });

  if (rosterPrev) {
    rosterPrev.addEventListener("click", () => {
      formationState.rosterPage -= 1;
      renderFormationRoster();
    });
  }
  if (rosterNext) {
    rosterNext.addEventListener("click", () => {
      formationState.rosterPage += 1;
      renderFormationRoster();
    });
  }
  if (levelUpBtn) levelUpBtn.addEventListener("click", levelUpFormationUnit);
}

function showFormation() {
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.remove("is-hidden");
  hideRecruitDoorScene(true);
  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-shop", "in-recruit", "in-formation");
  document.body.classList.add("in-formation");

  if (gameState) {
    gameState.running = false;
    gameState.message = "편성 화면에서 덱을 구성하세요";
    updateButtons();
  }

  renderFormationScreen();
}

function showFormationNotice() {
  showFormation();
}

function setFormationCategoryTab(tabName) {
  const notice = document.getElementById("formationNotice");
  if (notice) notice.textContent = "덱 편성 화면입니다. 보유 유닛을 선택해 슬롯에 배치하세요.";
  renderFormationTabs();
  renderFormationSlots();
}

function setFormationDeckPage(page) {
  const pageNumber = Number(page) === 2 ? 2 : 1;
  formationState.activePage = pageNumber;
  const notice = document.getElementById("formationNotice");
  if (notice) notice.textContent = `${pageNumber}번 페이지로 이동했습니다.`;
  renderFormationTabs();
  renderFormationSlots();
}

function selectFormationUnit(unitId) {
  formationState.selectedUnitId = unitId;
  renderFormationRoster();
  renderFormationSelectedInfo();
}

function handleFormationSlotClick(index) {
  const slots = getFormationSlotsForCurrentPage();
  slots[index] = formationState.selectedUnitId;
  const unit = getFormationUnit(formationState.selectedUnitId);
  const notice = document.getElementById("formationNotice");
  if (notice) {
    notice.textContent = `${formationState.activePage}페이지 ${index + 1}번 슬롯에 ${unit.name}을 배치했습니다.`;
  }
  renderFormationSlots();
}

function levelUpFormationUnit() {
  const unit = getFormationUnit(formationState.selectedUnitId);
  if (unit.level >= unit.maxLevel) return;

  unit.level += 1;
  unit.attack += 12;
  unit.hp += 70;
  unit.defense += 6;

  const notice = document.getElementById("formationNotice");
  if (notice) notice.textContent = `${unit.name}의 레벨이 ${unit.level}이 되었습니다.`;
  renderFormationRoster();
  renderFormationSelectedInfo();
  renderFormationSlots();
}
