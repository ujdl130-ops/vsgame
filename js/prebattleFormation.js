// Pre-battle hero selection screen. Kept separate from the lobby formation UI.

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

  root.innerHTML = `
    <div class="prebattle-formation-board">
      <img class="prebattle-formation-hero-card" src="assets/maps/formation/zeus.png" alt="제우스 카드" draggable="false">
    </div>
  `;
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
  }
}, true);
