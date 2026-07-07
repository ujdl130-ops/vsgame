// Pre-battle hero selection screen. Kept separate from the lobby formation UI.

const PREBATTLE_HERO_CARDS = [
  { id: "zeus", name: "제우스", image: "assets/maps/formation/zeus.png" },
  { id: "poseidon", name: "포세이돈", image: "assets/maps/formation/poseidon.png" },
  { id: "hades", name: "하데스", image: "assets/maps/formation/hades.png" },
  { id: "ares", name: "아레스", image: "assets/maps/formation/ares.png" },
  { id: "athena", name: "아테나", image: "assets/maps/formation/atena.png" },
  { id: "heracles", name: "헤라클레스", image: "assets/maps/formation/hercules.png" },
];

let prebattleFormationHeroIndex = 0;
let prebattleFormationLastDirection = -1;

function getPrebattleHeroIndex(heroId = selectedHeroId) {
  const heroIndex = PREBATTLE_HERO_CARDS.findIndex((hero) => hero.id === heroId);
  return heroIndex >= 0 ? heroIndex : 0;
}

function getPrebattleCardPosition(index) {
  if (index === prebattleFormationHeroIndex) return "active";
  if (PREBATTLE_HERO_CARDS.length === 2) {
    return prebattleFormationLastDirection > 0 ? "next" : "previous";
  }

  const previousIndex = (prebattleFormationHeroIndex - 1 + PREBATTLE_HERO_CARDS.length) % PREBATTLE_HERO_CARDS.length;
  const nextIndex = (prebattleFormationHeroIndex + 1) % PREBATTLE_HERO_CARDS.length;
  if (index === previousIndex) return "previous";
  if (index === nextIndex) return "next";
  return "hidden";
}

function syncPrebattleSelectedHero(heroId) {
  if (typeof setSelectedHeroId === "function") setSelectedHeroId(heroId);
  if (typeof formationState !== "undefined" && formationState) {
    formationState.selectedHeroId = heroId;
    formationState.heroDetailFlipped = false;
  }
}

function renderPrebattleHeroCards() {
  return PREBATTLE_HERO_CARDS.map((hero, index) => `
    <img
      class="prebattle-formation-hero-card is-${getPrebattleCardPosition(index)}"
      src="${hero.image}"
      alt="${hero.name} 카드"
      data-prebattle-hero-id="${hero.id}"
      draggable="false"
    >
  `).join("");
}

function updatePrebattleHeroCards() {
  const root = getPrebattleFormationRoot();
  const selectedHero = PREBATTLE_HERO_CARDS[prebattleFormationHeroIndex] || PREBATTLE_HERO_CARDS[0];
  const track = root.querySelector(".prebattle-formation-card-track");
  if (!track || !selectedHero) return;

  root.dataset.selectedHero = selectedHero.id;
  track.setAttribute("aria-label", `${selectedHero.name} 선택됨`);
  track.querySelectorAll(".prebattle-formation-hero-card").forEach((card, index) => {
    card.className = `prebattle-formation-hero-card is-${getPrebattleCardPosition(index)}`;
  });
}

function movePrebattleHeroCard(direction) {
  if (!PREBATTLE_HERO_CARDS.length) return;
  const nextDirection = direction < 0 ? -1 : 1;
  prebattleFormationLastDirection = nextDirection;
  prebattleFormationHeroIndex = (
    prebattleFormationHeroIndex + nextDirection + PREBATTLE_HERO_CARDS.length
  ) % PREBATTLE_HERO_CARDS.length;

  const selectedHero = PREBATTLE_HERO_CARDS[prebattleFormationHeroIndex];
  syncPrebattleSelectedHero(selectedHero.id);
  updatePrebattleHeroCards();
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

function renderPrebattleFormation() {
  const root = getPrebattleFormationRoot();
  prebattleFormationHeroIndex = getPrebattleHeroIndex();
  syncPrebattleSelectedHero(PREBATTLE_HERO_CARDS[prebattleFormationHeroIndex].id);

  root.innerHTML = `
    <div class="prebattle-formation-board">
      <button class="prebattle-formation-back-btn" type="button" aria-label="뒤로가기">← 뒤로</button>
      <button class="prebattle-formation-arrow-btn prebattle-formation-arrow-left" type="button" data-prebattle-direction="-1" aria-label="이전 영웅 보기">
        <img class="prebattle-formation-arrow" src="assets/ui/arrow_right_redesign.png" alt="" aria-hidden="true" draggable="false">
      </button>
      <div class="prebattle-formation-card-track" aria-live="polite">
        ${renderPrebattleHeroCards()}
      </div>
      <button class="prebattle-formation-arrow-btn prebattle-formation-arrow-right" type="button" data-prebattle-direction="1" aria-label="다음 영웅 보기">
        <img class="prebattle-formation-arrow" src="assets/ui/arrow_right_redesign.png" alt="" aria-hidden="true" draggable="false">
      </button>
    </div>
  `;

  const backButton = root.querySelector(".prebattle-formation-back-btn");
  if (backButton) backButton.addEventListener("click", closePrebattleFormationToStage);
  root.querySelectorAll(".prebattle-formation-arrow-btn").forEach((button) => {
    button.addEventListener("click", () => movePrebattleHeroCard(Number(button.dataset.prebattleDirection) || 1));
  });
  updatePrebattleHeroCards();
}

function showPreBattleFormation(stageNumber) {
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
    gameState.message = "";
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

window.addEventListener("keydown", (event) => {
  const root = document.getElementById("prebattleFormationScreen");
  if (!root || root.classList.contains("is-hidden")) return;

  if (event.code === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    closePrebattleFormationToStage();
    return;
  }

  if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
    event.preventDefault();
    event.stopPropagation();
    movePrebattleHeroCard(event.code === "ArrowLeft" ? -1 : 1);
  }
}, true);
