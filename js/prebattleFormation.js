// Pre-battle hero selection screen. Kept separate from the lobby formation UI.

const PREBATTLE_FORMATION_SLOT_COUNT = 10;
const PREBATTLE_FORMATION_DEFAULT_HERO = {
  id: "zeus",
  name: "제우스",
  level: 1,
  image: "assets/animations/hero/zeus_lobby_idle_hd.png",
};
const PREBATTLE_FORMATION_HEROES = [
  PREBATTLE_FORMATION_DEFAULT_HERO,
  {
    id: "poseidon",
    name: "포세이돈",
    level: 1,
    image: "assets/animations/hero/poseidon_lobby_idle_hd.png",
  },
];

const prebattleFormationState = {
  stageNumber: 1,
  selectedHeroId: PREBATTLE_FORMATION_DEFAULT_HERO.id,
};

function getPrebattleOwnedHeroes() {
  return PREBATTLE_FORMATION_HEROES;
}

function getPrebattleFormationRoot() {
  let root = document.getElementById("prebattleFormationScreen");
  if (root) return root;

  root = document.createElement("section");
  root.id = "prebattleFormationScreen";
  root.className = "prebattle-formation-screen is-hidden";
  root.setAttribute("aria-label", "전투 전 영웅 편성");
  document.body.appendChild(root);
  return root;
}

function renderPrebattleFormationSlot(hero, index) {
  if (!hero) {
    return `
      <button class="prebattle-formation-slot is-empty" type="button" aria-label="빈 영웅 슬롯 ${index + 1}" disabled></button>
    `;
  }

  const selectedClass = hero.id === prebattleFormationState.selectedHeroId ? " is-selected" : "";
  return `
    <button class="prebattle-formation-slot is-filled${selectedClass}" type="button" data-hero-id="${hero.id}" aria-label="${hero.name} 선택">
      <span class="prebattle-formation-portrait" style="background-image: url('${hero.image}');" aria-hidden="true"></span>
      <span class="prebattle-formation-name">${hero.name}</span>
      <span class="prebattle-formation-level">Lv.${hero.level}</span>
    </button>
  `;
}

function renderPrebattleFormation() {
  const root = getPrebattleFormationRoot();
  const heroes = getPrebattleOwnedHeroes();
  const slots = Array.from({ length: PREBATTLE_FORMATION_SLOT_COUNT }, (_, index) => heroes[index] || null);

  root.innerHTML = `
    <div class="prebattle-formation-board">
      <button id="prebattleFormationBackBtn" class="prebattle-formation-back-btn" type="button" aria-label="뒤로가기"></button>
      <div id="prebattleFormationSlotGrid" class="prebattle-formation-slot-grid" aria-label="보유 영웅">
        ${slots.map((hero, index) => renderPrebattleFormationSlot(hero, index)).join("")}
      </div>
      <div class="prebattle-formation-actions">
        <p id="prebattleFormationNotice" class="prebattle-formation-notice" aria-live="polite">Stage ${prebattleFormationState.stageNumber} 출전 영웅을 선택하세요.</p>
        <button id="prebattleFormationStartBtn" class="prebattle-formation-start-btn" type="button">전투 시작</button>
      </div>
    </div>
  `;

  root.querySelector("#prebattleFormationBackBtn")?.addEventListener("click", closePrebattleFormationToStage);
  root.querySelector("#prebattleFormationStartBtn")?.addEventListener("click", confirmPrebattleFormation);
  root.querySelectorAll(".prebattle-formation-slot.is-filled").forEach((slot) => {
    slot.addEventListener("click", () => selectPrebattleHero(slot.dataset.heroId));
  });
}

function selectPrebattleHero(heroId) {
  const hero = getPrebattleOwnedHeroes().find((candidate) => candidate.id === heroId);
  if (!hero) return;

  prebattleFormationState.selectedHeroId = hero.id;
  renderPrebattleFormation();
  const notice = document.getElementById("prebattleFormationNotice");
  if (notice) notice.textContent = `${hero.name} 선택 완료`;
}

function showPreBattleFormation(stageNumber) {
  prebattleFormationState.stageNumber = Number(stageNumber) || 1;
  prebattleFormationState.selectedHeroId = PREBATTLE_FORMATION_DEFAULT_HERO.id;

  closeGameOptionsMenu(false);
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  if (missionScreen) missionScreen.classList.add("is-hidden");
  if (inventoryScreen) inventoryScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);

  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-shop", "in-recruit", "in-formation", "in-mission", "in-inventory");
  document.body.classList.add("in-prebattle-formation");

  if (gameState) {
    gameState.running = false;
    gameState.message = "출전 영웅을 선택하세요.";
    updateButtons();
  }

  renderPrebattleFormation();
  getPrebattleFormationRoot().classList.remove("is-hidden");
}

function closePrebattleFormationToStage() {
  const root = getPrebattleFormationRoot();
  root.classList.add("is-hidden");
  document.body.classList.remove("in-prebattle-formation");
  showStageSelect();
  showChapterStages();
}

function confirmPrebattleFormation() {
  const root = getPrebattleFormationRoot();
  root.classList.add("is-hidden");
  document.body.classList.remove("in-prebattle-formation");
  setSelectedHeroId(prebattleFormationState.selectedHeroId);
  startGame(prebattleFormationState.stageNumber);
}

window.addEventListener("keydown", (event) => {
  const root = document.getElementById("prebattleFormationScreen");
  if (!root || root.classList.contains("is-hidden")) return;

  if (event.code === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    closePrebattleFormationToStage();
  }

  if (event.code === "Enter" || event.code === "Space") {
    event.preventDefault();
    event.stopPropagation();
    confirmPrebattleFormation();
  }
}, true);
