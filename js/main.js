// Game lifecycle and event binding.

function resetGame() {
  if (animationId) cancelAnimationFrame(animationId);
  keys = {};
  heroMoveInput = 0;
  gameState = createInitialState();
  lastTime = performance.now();
  updateHud();
  updateButtons();
  animationId = requestAnimationFrame(gameLoop);
}


function startGame(stageNumber = selectedStage) {
  selectedStage = Number(stageNumber) || 1;
  if (!isStageUnlocked(selectedStage)) {
    showStageSelect();
    showChapterStages();
    showStageLockedNotice(selectedStage);
    return;
  }

  loadStageAssets(selectedStage);
  closeGameOptionsMenu(false);
  resetGame();
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  if (missionScreen) missionScreen.classList.add("is-hidden");
  if (inventoryScreen) inventoryScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);
  document.body.classList.add("game-started");
  document.body.classList.remove("in-lobby", "in-stage-select", "in-shop", "in-recruit", "in-formation", "in-mission", "in-inventory");
  updateBattleViewportScale();
  gameState.running = true;
  gameState.message = `Stage ${selectedStage} - Wave ${gameState.wave} 시작! 영웅을 보조하며 병사를 소환하세요.`;
  gameState.messageTimer = 1.2;
  updateHud();
  updateButtons();
}

function restartGame() {
  startGame(selectedStage);
}

function gameLoop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;
  update(dt);
  draw();
  animationId = requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (event) => {
  const playableKeys = ["Space"];
  if (playableKeys.includes(event.code)) event.preventDefault();

  if (isTitleVisible()) {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      showLobby();
    }
    return;
  }

  if (isLobbyVisible()) {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      showStageSelect();
    }
    if (event.code === "KeyS") showShopNotice();
    if (event.code === "KeyF") showFormationNotice();
    if (event.code === "KeyM") showMission();
    if (event.code === "Escape") showTitle();
    return;
  }

  if (isStageSelectVisible()) {
    if (event.code === "Escape") showLobby();
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      if (stagePanel && stagePanel.classList.contains("is-hidden")) showChapterStages();
      else openStage(playerProgress.unlockedStage);
    }
    if (event.code === "Digit1") openStage(1);
    if (event.code === "Digit2") openStage(2);
    if (event.code === "Digit3") openStage(3);
    return;
  }

  if (isShopVisible()) {
    if (event.code === "Escape") showLobby();
    return;
  }

  if (isFormationVisible()) {
    if (event.code === "Escape") showLobby();
    if (event.code === "Digit1") setFormationDeckPage(1);
    if (event.code === "Digit2") setFormationDeckPage(2);
    return;
  }

  if (isMissionVisible()) {
    if (event.code === "Escape") showLobby();
    return;
  }

  if (isInventoryVisible()) {
    if (event.code === "Escape") showFormation();
    return;
  }

  if (isRecruitVisible()) {
    if (event.code === "Escape") {
      if (recruitDoorScene && !recruitDoorScene.classList.contains("is-hidden")) hideRecruitDoorScene();
      else showLobby();
    }
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      if (recruitDoorScene && !recruitDoorScene.classList.contains("is-hidden")) handleRecruitDoorTap(event);
      else startRecruitDoorAnimation(1);
    }
    return;
  }

  if (isGameOptionsOpen()) {
    if (event.code === "Escape") {
      event.preventDefault();
      closeGameOptionsMenu(true);
    }
    return;
  }

  if (event.code === "Space") {
    keys.Space = true;
    event.preventDefault();
    heroAttack();
  }
  if (event.code === "Digit1") {
    event.preventDefault();
    summonGuard();
  }
  if (event.code === "Digit2") {
    event.preventDefault();
    summonArcher();
  }
  if (event.code === "Digit3") {
    event.preventDefault();
    summonMage();
  }
  if (event.code === "Digit4") {
    event.preventDefault();
    summonSaintess();
  }
  if (event.code === "Digit5") {
    event.preventDefault();
    summonThief();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "Space") keys.Space = false;
});

window.addEventListener("resize", updateBattleViewportScale);
window.addEventListener("orientationchange", updateBattleViewportScale);

function bindUnitSlotButton(button, summonFn) {
  if (!button || typeof summonFn !== "function") return;

  let lastPointerSummonAt = 0;
  const triggerSummon = () => {
    if (button.disabled || isGameOptionsOpen()) return;
    summonFn();
  };

  button.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    lastPointerSummonAt = performance.now();
    triggerSummon();
  });

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (performance.now() - lastPointerSummonAt < 450) return;
    triggerSummon();
  });
}

function bindHeroActionIcon(button, actionFn) {
  if (!button || typeof actionFn !== "function") return;

  let lastPointerActionAt = 0;
  const triggerAction = () => {
    if (button.disabled || isGameOptionsOpen()) return;
    actionFn();
    updateButtons();
  };

  button.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    lastPointerActionAt = performance.now();
    triggerAction();
  });

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (performance.now() - lastPointerActionAt < 450) return;
    triggerAction();
  });
}

if (startBtn) startBtn.addEventListener("click", () => startGame(selectedStage));
if (gameOptionsBtn) gameOptionsBtn.addEventListener("click", toggleGameOptionsMenu);
if (optionStageSelectBtn) optionStageSelectBtn.addEventListener("click", handleOptionStageSelect);
if (optionRestartBtn) optionRestartBtn.addEventListener("click", handleOptionRestart);
bindMovementJoystick(movementJoystick);
if (titleStartBtn) titleStartBtn.textContent = "TAP TO START";
if (titleScreen) titleScreen.addEventListener("click", showLobby);

(() => {
  const showcase = document.getElementById("lobbyGodShowcase");
  const image = document.getElementById("lobbyGodImage");
  const name = document.getElementById("lobbyGodName");
  const title = document.getElementById("lobbyGodTitle");
  const dots = document.getElementById("lobbyGodDots");
  const previousButton = document.getElementById("lobbyGodPrevBtn");
  const nextButton = document.getElementById("lobbyGodNextBtn");
  if (!showcase || !image || !name || !title || !dots) return;

  const gods = [
    { id: "zeus", name: "제우스", title: "천둥의 지배자", image: "assets/gods/zeus.png" },
    { id: "poseidon", name: "포세이돈", title: "심해의 군주", image: "assets/gods/poseidon.png" },
    { id: "hades", name: "하데스", title: "명계의 왕", image: "assets/gods/hades.png" },
    { id: "ares", name: "아레스", title: "전쟁의 화신", image: "assets/gods/ares.png" },
    { id: "atena", name: "아테나", title: "지혜의 수호자", image: "assets/gods/atena.png" },
    { id: "heracles", name: "헤라클레스", title: "불굴의 영웅", image: "assets/gods/heracles.png" },
  ];
  let savedGod = "";
  try {
    savedGod = localStorage.getItem("pixelDefenseLobbyGod") || "";
  } catch (error) {
    savedGod = "";
  }
  let selectedIndex = Math.max(0, gods.findIndex((god) => god.id === savedGod));

  gods.forEach((god, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "lobby-god-dot";
    dot.setAttribute("aria-label", `${god.name} 선택`);
    dot.addEventListener("click", () => selectGod(index));
    dots.appendChild(dot);
  });

  function selectGod(index, direction = 0) {
    selectedIndex = (index + gods.length) % gods.length;
    const god = gods[selectedIndex];
    showcase.dataset.god = god.id;
    showcase.dataset.direction = direction < 0 ? "previous" : "next";
    image.classList.remove("is-changing");
    void image.offsetWidth;
    image.classList.add("is-changing");
    image.src = god.image;
    image.alt = god.name;
    name.textContent = god.name;
    title.textContent = god.title;
    dots.querySelectorAll(".lobby-god-dot").forEach((dot, dotIndex) => {
      const isSelected = dotIndex === selectedIndex;
      dot.classList.toggle("is-selected", isSelected);
      dot.setAttribute("aria-current", isSelected ? "true" : "false");
    });
    try {
      localStorage.setItem("pixelDefenseLobbyGod", god.id);
    } catch (error) {
      // The carousel still works when storage is unavailable.
    }
  }

  if (previousButton) previousButton.addEventListener("click", () => selectGod(selectedIndex - 1, -1));
  if (nextButton) nextButton.addEventListener("click", () => selectGod(selectedIndex + 1, 1));
  image.addEventListener("animationend", () => image.classList.remove("is-changing"));
  selectGod(selectedIndex);
})();

if (lobbyBattleBtn) lobbyBattleBtn.addEventListener("click", showStageSelect);
if (lobbyShopBtn) lobbyShopBtn.addEventListener("click", showShop);
if (lobbyFormationBtn) lobbyFormationBtn.addEventListener("click", showFormation);
if (lobbyRecruitBtn) lobbyRecruitBtn.addEventListener("click", showRecruit);
if (lobbyMissionBtn) lobbyMissionBtn.addEventListener("click", showMission);
if (missionBackBtn) missionBackBtn.addEventListener("click", showLobby);
if (missionCloseBtn) missionCloseBtn.addEventListener("click", showLobby);
if (inventoryBackBtn) inventoryBackBtn.addEventListener("click", showLobby);
if (inventoryCloseBtn) inventoryCloseBtn.addEventListener("click", showFormation);
if (formationBackBtn) formationBackBtn.addEventListener("click", showLobby);
if (formationCloseBtn) formationCloseBtn.addEventListener("click", showInventory);
formationCategoryTabs.forEach((tab) => {
  tab.addEventListener("click", () => setFormationCategoryTab(tab.dataset.formationTab || "deck"));
});
formationDeckTabs.forEach((tab) => {
  tab.addEventListener("click", () => setFormationDeckPage(tab.dataset.deckPage || "1"));
});
formationSlots.forEach((slot, index) => {
  slot.addEventListener("click", () => handleFormationSlotClick(index));
});
if (recruitBackBtn) recruitBackBtn.addEventListener("click", showLobby);
if (recruitCloseBtn) recruitCloseBtn.addEventListener("click", showLobby);
if (recruitPullOneBtn) recruitPullOneBtn.addEventListener("click", () => {
  requestRecruitPull(1);
});
if (recruitPullTenBtn) recruitPullTenBtn.addEventListener("click", () => {
  requestRecruitPull(10);
});
if (recruitDoorFrame) recruitDoorFrame.addEventListener("pointerdown", handleRecruitDoorTap);
if (recruitDoorCloseBtn) recruitDoorCloseBtn.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  event.stopPropagation();
  hideRecruitDoorScene();
});
if (lobbyExitBtn) lobbyExitBtn.addEventListener("click", showTitle);
if (shopBackBtn) shopBackBtn.addEventListener("click", showLobby);
if (shopCloseBtn) shopCloseBtn.addEventListener("click", showLobby);
shopCards.forEach((card) => {
  card.addEventListener("click", () => showShopItemNotice(card.dataset.item || "아이템"));
});
if (stageBackBtn) stageBackBtn.addEventListener("click", showLobby);
if (chapter1Btn) chapter1Btn.addEventListener("click", showChapterStages);
if (chapterBackBtn) chapterBackBtn.addEventListener("click", showStageSelect);
stageCards.forEach((card) => {
  card.addEventListener("click", () => openStage(Number(card.dataset.stage)));
});
if (restartBtn) restartBtn.addEventListener("click", restartGame);
if (stageSelectBtn) stageSelectBtn.addEventListener("click", showStageSelect);
bindUnitSlotButton(summonGuardSlotBtn, summonGuard);
bindUnitSlotButton(summonArcherSlotBtn, summonArcher);
bindUnitSlotButton(summonMageSlotBtn, summonMage);
bindUnitSlotButton(summonSaintessSlotBtn, summonSaintess);
bindUnitSlotButton(summonThiefSlotBtn, summonThief);
bindHeroActionIcon(basicAttackIconBtn, castHolySlash);
bindHeroActionIcon(zeusSkillIconBtn, castZeusThunderstorm);
if (skillBtn) skillBtn.addEventListener("click", castHolySlash);
if (zeusSkillBtn) zeusSkillBtn.addEventListener("click", castZeusThunderstorm);
// 전투 개편: 캔버스 직접 터치 공격은 제거했습니다.

resetGame();
