// Hero-only formation screen and pre-battle selection flow.

const FORMATION_SLOT_COUNT = 10;
const FORMATION_DEFAULT_HERO_ID = "zeus";
const FORMATION_AVAILABLE_HERO_IDS = [FORMATION_DEFAULT_HERO_ID];

const FORMATION_HERO_VISUALS = {
  zeus: {
    image: "assets/animations/hero/zeus_hero_spritesheet_latest_transparent_aligned.png",
    frameClass: "is-zeus-frame",
  },
};

const FORMATION_HERO_FALLBACKS = {
  zeus: {
    id: "zeus",
    name: "제우스",
    role: "공격",
    level: 1,
    star: 1,
    starProgress: 0,
    essenceKey: "lightningEssence",
    essenceName: "번개의 정수",
  },
};

const formationState = {
  mode: "lobby",
  pendingStage: null,
  selectedHeroId: FORMATION_DEFAULT_HERO_ID,
  battleHeroId: FORMATION_DEFAULT_HERO_ID,
};

function getFormationHeroDefinition(heroId) {
  const apiHero = typeof window !== "undefined" && window.HeroAPI?.getGodHeroById?.(heroId);
  const fallback = FORMATION_HERO_FALLBACKS[heroId] || FORMATION_HERO_FALLBACKS[FORMATION_DEFAULT_HERO_ID];
  const hero = apiHero || fallback;
  const growth = typeof getStoredGrowthState === "function"
    ? getStoredGrowthState(heroId === "zeus" ? "hero" : heroId)
    : { level: hero.level || 1, star: hero.star || 1 };

  return {
    ...fallback,
    ...hero,
    id: heroId,
    name: fallback.name || hero.name || heroId,
    level: growth.level || hero.level || 1,
    star: growth.star || hero.star || 1,
    visual: FORMATION_HERO_VISUALS[heroId] || FORMATION_HERO_VISUALS[FORMATION_DEFAULT_HERO_ID],
  };
}

function ensureDefaultOwnedFormationHero() {
  if (!playerProgress) return;
  if (!playerProgress.ownedGods || typeof playerProgress.ownedGods !== "object") {
    playerProgress.ownedGods = {};
  }

  if (!playerProgress.ownedGods[FORMATION_DEFAULT_HERO_ID]) {
    playerProgress.ownedGods[FORMATION_DEFAULT_HERO_ID] = {
      ...getFormationHeroDefinition(FORMATION_DEFAULT_HERO_ID),
    };
    saveProgress();
  }
}

function getOwnedFormationHeroes() {
  ensureDefaultOwnedFormationHero();
  return FORMATION_AVAILABLE_HERO_IDS
    .filter((heroId) => playerProgress?.ownedGods?.[heroId])
    .map((heroId) => getFormationHeroDefinition(heroId));
}

function getFormationHero(heroId) {
  return getOwnedFormationHeroes().find((hero) => hero.id === heroId)
    || getFormationHeroDefinition(FORMATION_DEFAULT_HERO_ID);
}

function getFormationSlots() {
  const heroes = getOwnedFormationHeroes();
  return Array.from({ length: FORMATION_SLOT_COUNT }, (_, index) => heroes[index] || null);
}

function showFormationMessage(message, tone = "info") {
  const notice = document.getElementById("formationNotice");
  if (!notice) return;
  notice.textContent = message;
  notice.classList.toggle("is-warning", tone === "warning");
}

function createFormationShellMarkup() {
  const stageLabel = formationState.pendingStage ? `Stage ${formationState.pendingStage}` : "Chapter 1";
  const noticeText = formationState.mode === "prebattle"
    ? `${stageLabel} 출전 영웅을 선택했습니다.`
    : "보유 영웅";
  return `
    <div class="formation-stage-board" aria-label="영웅 편성">
      <button id="formationBackBtn" class="formation-image-back-btn" type="button" aria-label="뒤로가기"></button>
      <div id="formationSlotGrid" class="formation-hero-slot-grid" aria-label="보유 영웅"></div>
      <div class="formation-battle-panel">
        <p id="formationNotice" class="formation-notice" aria-live="polite">${noticeText}</p>
        <button id="formationBattleStartBtn" class="formation-battle-start-btn" type="button">전투 시작</button>
      </div>
    </div>
  `;
}

function renderFormationHeroVisual(hero) {
  const visual = hero.visual || FORMATION_HERO_VISUALS[FORMATION_DEFAULT_HERO_ID];
  return `
    <span class="formation-hero-portrait ${visual.frameClass}" style="background-image: url('${visual.image}');" aria-hidden="true"></span>
  `;
}

function renderFormationSlot(hero, index) {
  if (!hero) {
    return `
      <button class="formation-hero-slot is-empty" type="button" data-slot-index="${index}" aria-label="빈 영웅 슬롯 ${index + 1}" disabled></button>
    `;
  }

  const selectedClass = hero.id === formationState.selectedHeroId ? " is-selected" : "";
  return `
    <button class="formation-hero-slot is-filled${selectedClass}" type="button" data-hero-id="${hero.id}" data-slot-index="${index}" aria-label="${hero.name} 선택">
      ${renderFormationHeroVisual(hero)}
      <span class="formation-hero-name">${hero.name}</span>
      <span class="formation-hero-level">Lv.${hero.level}</span>
    </button>
  `;
}

function renderFormationSlots() {
  const slotGrid = document.getElementById("formationSlotGrid");
  if (!slotGrid) return;

  const slots = getFormationSlots();
  if (!slots.some((hero) => hero && hero.id === formationState.selectedHeroId)) {
    formationState.selectedHeroId = slots.find(Boolean)?.id || null;
  }

  slotGrid.innerHTML = slots.map((hero, index) => renderFormationSlot(hero, index)).join("");
  slotGrid.querySelectorAll(".formation-hero-slot.is-filled").forEach((slot) => {
    slot.addEventListener("click", () => selectFormationHero(slot.dataset.heroId));
  });
}

function renderFormationScreen() {
  if (!formationScreen) return;
  formationScreen.innerHTML = createFormationShellMarkup();
  bindFormationScreenEvents();
  renderFormationSlots();

  const startBtn = document.getElementById("formationBattleStartBtn");
  if (startBtn) {
    startBtn.classList.toggle("is-hidden", formationState.mode !== "prebattle");
  }
}

function bindFormationScreenEvents() {
  const backBtn = document.getElementById("formationBackBtn");
  const startBtn = document.getElementById("formationBattleStartBtn");

  if (backBtn) backBtn.addEventListener("click", handleFormationBack);
  if (startBtn) startBtn.addEventListener("click", handleFormationConfirm);
}

function setFormationMode(mode = "lobby", stageNumber = null) {
  formationState.mode = mode;
  formationState.pendingStage = mode === "prebattle" ? Number(stageNumber) || selectedStage || 1 : null;
  formationState.selectedHeroId = FORMATION_DEFAULT_HERO_ID;
}

function showFormation(options = {}) {
  closeGameOptionsMenu(false);
  setFormationMode(options.mode || "lobby", options.stageNumber || null);

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
    gameState.message = "출전 영웅을 선택하세요.";
    updateButtons();
  }

  renderFormationScreen();
}

function showFormationNotice() {
  showFormation();
}

function showPreBattleFormation(stageNumber) {
  showFormation({ mode: "prebattle", stageNumber });
}

function handleFormationBack() {
  if (formationState.mode === "prebattle") {
    setFormationMode("lobby");
    showStageSelect();
    showChapterStages();
    return;
  }

  showLobby();
}

function handleFormationConfirm() {
  if (formationState.mode !== "prebattle") return;
  if (!formationState.selectedHeroId) {
    showFormationMessage("출전할 영웅을 선택하세요.", "warning");
    return;
  }

  formationState.battleHeroId = formationState.selectedHeroId;
  const stageNumber = formationState.pendingStage || selectedStage || 1;
  setFormationMode("lobby");
  startGame(stageNumber);
}

function selectFormationHero(heroId) {
  const hero = getFormationHero(heroId);
  formationState.selectedHeroId = hero.id;
  showFormationMessage(`${hero.name} 선택 완료`);
  renderFormationSlots();
}

function setFormationCategoryTab() {
  showFormationMessage("영웅 편성 화면입니다.");
}

function setFormationType() {
  showFormationMessage("현재는 보유 영웅만 편성할 수 있습니다.");
}

function setFormationDeckPage() {
  showFormationMessage("현재 편성 페이지는 1개입니다.");
}

function handleFormationSlotClick(index) {
  const hero = getFormationSlots()[index];
  if (hero) selectFormationHero(hero.id);
}

function removeFormationSlot() {
  showFormationMessage("출전 영웅은 최소 1명 필요합니다.", "warning");
}

function levelUpFormationUnit() {
  showFormationMessage("영웅 강화 UI에서 사용할 기능입니다.");
}

function getSelectedFormationHeroId() {
  return formationState.battleHeroId || FORMATION_DEFAULT_HERO_ID;
}

function getBestFormationBattleUnit() {
  return getFormationHero(getSelectedFormationHeroId());
}

function applyFormationBattleStats(baseId, battleUnit) {
  return battleUnit;
}

window.FormationAPI = {
  showFormation,
  showPreBattleFormation,
  getSelectedFormationHeroId,
  getOwnedFormationHeroes,
};
