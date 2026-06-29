// Game lifecycle and event binding.

function resetGame() {
  if (animationId) cancelAnimationFrame(animationId);
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

  closeGameOptionsMenu(false);
  resetGame();
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);
  document.body.classList.add("game-started");
  document.body.classList.remove("in-lobby", "in-stage-select", "in-shop", "in-recruit", "in-formation");
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
  const playableKeys = ["Space", "ArrowLeft", "ArrowRight"];
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
    if (event.code === "KeyM") showMissionNotice();
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

  keys[event.code] = true;

  if (event.code === "Space") {
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
});

window.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

function bindSummonButton(button, summonFn) {
  if (!button || typeof summonFn !== "function") return;

  let lastPointerSummonAt = 0;

  button.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (button.disabled) return;

    event.preventDefault();
    lastPointerSummonAt = performance.now();
    summonFn();
  });

  button.addEventListener("click", (event) => {
    if (performance.now() - lastPointerSummonAt < 500) {
      event.preventDefault();
      return;
    }

    summonFn();
  });
}

if (startBtn) startBtn.addEventListener("click", () => startGame(selectedStage));
if (gameOptionsBtn) gameOptionsBtn.addEventListener("click", toggleGameOptionsMenu);
if (optionStageSelectBtn) optionStageSelectBtn.addEventListener("click", handleOptionStageSelect);
if (optionRestartBtn) optionRestartBtn.addEventListener("click", handleOptionRestart);
bindHoldMovementButton(moveLeftBtn, "ArrowLeft");
bindHoldMovementButton(moveRightBtn, "ArrowRight");
titleStartBtn.addEventListener("click", showLobby);
if (lobbyBattleBtn) lobbyBattleBtn.addEventListener("click", showStageSelect);
if (lobbyShopBtn) lobbyShopBtn.addEventListener("click", showShop);
if (lobbyFormationBtn) lobbyFormationBtn.addEventListener("click", showFormation);
if (lobbyRecruitBtn) lobbyRecruitBtn.addEventListener("click", showRecruit);
if (lobbyMissionBtn) lobbyMissionBtn.addEventListener("click", showMissionNotice);
if (formationBackBtn) formationBackBtn.addEventListener("click", showLobby);
if (formationCloseBtn) formationCloseBtn.addEventListener("click", showLobby);
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
if (recruitPullOneBtn) recruitPullOneBtn.addEventListener("click", () => startRecruitDoorAnimation(1));
if (recruitPullTenBtn) recruitPullTenBtn.addEventListener("click", () => startRecruitDoorAnimation(10));
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
bindSummonButton(summonGuardBtn, summonGuard);
bindSummonButton(summonArcherBtn, summonArcher);
bindSummonButton(summonMageBtn, summonMage);
bindSummonButton(summonSaintessBtn, summonSaintess);
bindSummonButton(summonThiefBtn, summonThief);
if (skillBtn) skillBtn.addEventListener("click", castHolySlash);
if (zeusSkillBtn) zeusSkillBtn.addEventListener("click", castZeusThunderstorm);
// 전투 개편: 캔버스 직접 터치 공격은 제거했습니다.

resetGame();
