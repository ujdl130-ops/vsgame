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

function getPrebattleFormationHero(heroId) {
  if (typeof FORMATION_HEROES === "undefined" || !Array.isArray(FORMATION_HEROES)) return null;
  return FORMATION_HEROES.find((hero) => hero.id === heroId) || null;
}

function getPrebattleHeroCard(hero) {
  const formationHero = getPrebattleFormationHero(hero.id);
  if (!formationHero) return { ...hero, unlocked: true };
  return {
    ...hero,
    name: formationHero.name || hero.name,
    image: formationHero.image || hero.image,
    unlocked: formationHero.unlocked !== false,
  };
}

function isPrebattleHeroOwned(heroId) {
  const formationHero = getPrebattleFormationHero(heroId);
  return formationHero ? formationHero.unlocked !== false : true;
}

function getFirstOwnedPrebattleHeroIndex() {
  const heroIndex = PREBATTLE_HERO_CARDS.findIndex((hero) => isPrebattleHeroOwned(hero.id));
  return heroIndex >= 0 ? heroIndex : 0;
}

function getPrebattleHeroIndex(heroId = selectedHeroId) {
  const heroIndex = PREBATTLE_HERO_CARDS.findIndex((hero) => hero.id === heroId);
  if (heroIndex >= 0 && isPrebattleHeroOwned(PREBATTLE_HERO_CARDS[heroIndex].id)) return heroIndex;
  return getFirstOwnedPrebattleHeroIndex();
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
  return PREBATTLE_HERO_CARDS.map((baseHero, index) => {
    const hero = getPrebattleHeroCard(baseHero);
    const isLocked = !hero.unlocked;
    const lockedClass = isLocked ? " is-locked" : "";
    const heroLabel = isLocked ? `${hero.name} 잠김` : `${hero.name} 카드`;
    const lockMarkup = isLocked ? `<span class="prebattle-formation-lock" aria-hidden="true"><span></span></span>` : "";

    return `
    <div
      class="prebattle-formation-hero-card is-${getPrebattleCardPosition(index)}${lockedClass}"
      data-prebattle-hero-id="${hero.id}"
      data-locked="${isLocked ? "true" : "false"}"
      aria-label="${heroLabel}"
    >
      <img
        class="prebattle-formation-hero-card-image"
        src="${hero.image}"
        alt="${hero.name} 카드"
        draggable="false"
      >
      ${lockMarkup}
    </div>
  `;
  }).join("");
}

function updatePrebattleHeroCards() {
  const root = getPrebattleFormationRoot();
  const selectedHero = getPrebattleHeroCard(PREBATTLE_HERO_CARDS[prebattleFormationHeroIndex] || PREBATTLE_HERO_CARDS[0]);
  const track = root.querySelector(".prebattle-formation-card-track");
  if (!track || !selectedHero) return;

  const selectedHeroOwned = isPrebattleHeroOwned(selectedHero.id);
  const startButton = root.querySelector(".prebattle-formation-start-btn");

  root.dataset.activeHero = selectedHero.id;
  root.dataset.selectedHero = selectedHeroOwned ? selectedHero.id : "";
  track.setAttribute("aria-label", selectedHeroOwned ? `${selectedHero.name} 선택됨` : `${selectedHero.name} 잠김`);
  track.querySelectorAll(".prebattle-formation-hero-card").forEach((card, index) => {
    const hero = PREBATTLE_HERO_CARDS[index];
    const lockedClass = hero && !isPrebattleHeroOwned(hero.id) ? " is-locked" : "";
    card.className = `prebattle-formation-hero-card is-${getPrebattleCardPosition(index)}${lockedClass}`;
    card.dataset.locked = lockedClass ? "true" : "false";
  });

  if (startButton) {
    startButton.disabled = !selectedHeroOwned;
    startButton.setAttribute("aria-disabled", selectedHeroOwned ? "false" : "true");
    startButton.title = selectedHeroOwned ? "" : "성장 탭에서 보유한 영웅만 출전할 수 있습니다.";
  }
}

function movePrebattleHeroCard(direction) {
  if (!PREBATTLE_HERO_CARDS.length) return;
  const nextDirection = direction < 0 ? -1 : 1;
  prebattleFormationLastDirection = nextDirection;
  prebattleFormationHeroIndex = (
    prebattleFormationHeroIndex + nextDirection + PREBATTLE_HERO_CARDS.length
  ) % PREBATTLE_HERO_CARDS.length;

  const selectedHero = PREBATTLE_HERO_CARDS[prebattleFormationHeroIndex];
  if (selectedHero && isPrebattleHeroOwned(selectedHero.id)) {
    syncPrebattleSelectedHero(selectedHero.id);
  }
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
  const selectedHero = PREBATTLE_HERO_CARDS[prebattleFormationHeroIndex];
  if (selectedHero && isPrebattleHeroOwned(selectedHero.id)) {
    syncPrebattleSelectedHero(selectedHero.id);
  }

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
      <button class="prebattle-formation-start-btn" type="button">전투 시작</button>
    </div>
  `;

  const backButton = root.querySelector(".prebattle-formation-back-btn");
  const startButton = root.querySelector(".prebattle-formation-start-btn");
  if (backButton) backButton.addEventListener("click", closePrebattleFormationToStage);
  if (startButton) startButton.addEventListener("click", startPrebattleFormationBattle);
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

  const root = getPrebattleFormationRoot();
  root.dataset.stage = String(Number(stageNumber) || selectedStage || 1);
  renderPrebattleFormation();
  root.classList.remove("is-hidden");
}

function closePrebattleFormationToStage() {
  const root = getPrebattleFormationRoot();
  root.classList.add("is-hidden");
  document.body.classList.remove("in-prebattle-formation");
  showStageSelect();
  showChapterStages();
}

function startPrebattleFormationBattle() {
  const root = getPrebattleFormationRoot();
  const stageNumber = Number(root.dataset.stage) || selectedStage || 1;
  const selectedHero = PREBATTLE_HERO_CARDS[prebattleFormationHeroIndex] || PREBATTLE_HERO_CARDS[0];
  if (!selectedHero || !isPrebattleHeroOwned(selectedHero.id)) {
    updatePrebattleHeroCards();
    return;
  }
  syncPrebattleSelectedHero(selectedHero.id);
  root.classList.add("is-hidden");
  document.body.classList.remove("in-prebattle-formation");
  startGame(stageNumber);
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
