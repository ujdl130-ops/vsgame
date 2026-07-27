// Game lifecycle and event binding.

function resetGame() {
  if (animationId) cancelAnimationFrame(animationId);
  keys = {};
  resetHeroMoveInput();
  gameState = createInitialState();
  lastTime = performance.now();
  updateHud();
  updateButtons();
  animationId = requestAnimationFrame(gameLoop);
}


function startGame(stageNumber = selectedStage) {
  selectedStage = Number(stageNumber) || 1;
  const chapter = typeof selectedChapter === "number" ? selectedChapter : 1;
  if (!canStartChapterStage(chapter, selectedStage)) {
    showStageSelect();
    showChapterStages(chapter);
    showStageLockedNotice(selectedStage);
    return;
  }

  loadStageAssets(selectedStage, chapter);
  hideStageClearRewardUi();
  hideStageDefeatUi();
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
  gameState.message = `Stage ${selectedStage} 전투 시작! 영웅을 보조하며 병사를 소환하세요.`;
  gameState.messageTimer = 1.2;
  updateHud();
  updateButtons();
  if (window.GameAudio) window.GameAudio.playStageBgm(selectedStage);
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

  if (typeof isMonthlyRewardPopupVisible === "function" && isMonthlyRewardPopupVisible()) {
    if (event.code === "Escape" || event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      closeMonthlyRewardPopup();
    }
    return;
  }

  if (isTitleVisible()) {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      handleTitleStart();
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
    if (typeof isStageDetailVisible === "function" && isStageDetailVisible()) {
      const detailButton = event.target && typeof event.target.closest === "function"
        ? event.target.closest("#stageDetailCloseBtn, #stageDetailStartBtn")
        : null;

      if (event.code === "Escape") {
        event.preventDefault();
        hideStageDetailPanel();
      } else if ((event.code === "Enter" || event.code === "Space") && !detailButton) {
        event.preventDefault();
        proceedStageDetailPanel();
      }
      return;
    }

    if (event.code === "Escape") {
      event.preventDefault();
      handleStageBack();
    }
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      if (isChapterStageMapVisible()) openStage(playerProgress.unlockedStage);
      else showChapterStages();
    }
    if (isChapterStageMapVisible()) {
      if (event.code === "Digit1") openStage(1);
      if (event.code === "Digit2") openStage(2);
      if (event.code === "Digit3") openStage(3);
      if (event.code === "Digit4") openStage(4);
    }
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

  if (isStageClearRewardVisible()) {
    const rewardInteractive = event.target && typeof event.target.closest === "function"
      ? event.target.closest(".stage-clear-reward-action, .stage-clear-reward-interactive")
      : null;
    if (rewardInteractive && (event.code === "Enter" || event.code === "Space")) return;
    if (event.code === "Escape" || event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
    }
    return;
  }

  if (isStageDefeatVisible()) {
    const defeatAction = event.target && typeof event.target.closest === "function"
      ? event.target.closest(".stage-defeat-action")
      : null;
    if (defeatAction && (event.code === "Enter" || event.code === "Space")) return;
    if (event.code === "Escape") {
      event.preventDefault();
      handleStageDefeatLobby();
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
  if (event.code === "KeyA" || event.code === "KeyD") {
    keys[event.code] = true;
    syncHeroMoveInput();
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
  if (event.code === "KeyA" || event.code === "KeyD") {
    keys[event.code] = false;
    syncHeroMoveInput();
  }
});

window.addEventListener("blur", () => {
  keys.Space = false;
  keys.KeyA = false;
  keys.KeyD = false;
  syncHeroMoveInput();
});

window.addEventListener("resize", updateBattleViewportScale);
window.addEventListener("orientationchange", updateBattleViewportScale);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", updateBattleViewportScale);
}
document.addEventListener("fullscreenchange", refreshGameViewport);
document.addEventListener("webkitfullscreenchange", refreshGameViewport);
updateBattleViewportScale();

function refreshGameViewport() {
  requestAnimationFrame(updateBattleViewportScale);
  window.setTimeout(updateBattleViewportScale, 250);
}

function isGameStandaloneDisplay() {
  return Boolean(
    window.navigator.standalone
    || window.matchMedia?.("(display-mode: fullscreen)")?.matches
    || window.matchMedia?.("(display-mode: standalone)")?.matches
  );
}

function isGameFullscreenActive() {
  return Boolean(
    document.fullscreenElement
    || document.webkitFullscreenElement
    || document.msFullscreenElement
    || isGameStandaloneDisplay()
  );
}

function syncGameFullscreenUiState() {
  document.documentElement.classList.toggle("is-game-fullscreen", isGameFullscreenActive());
}

document.addEventListener("fullscreenchange", syncGameFullscreenUiState);
document.addEventListener("webkitfullscreenchange", syncGameFullscreenUiState);

function lockGameLandscapeOrientation() {
  const lock = window.screen?.orientation?.lock;
  if (typeof lock !== "function") return;
  try {
    const orientationLock = lock.call(window.screen.orientation, "landscape-primary");
    if (orientationLock && typeof orientationLock.catch === "function") {
      orientationLock.catch(() => {
        const fallbackLock = lock.call(window.screen.orientation, "landscape");
        if (fallbackLock && typeof fallbackLock.catch === "function") fallbackLock.catch(() => {});
      });
    }
  } catch (error) {
    refreshGameViewport();
  }
}

function requestGameFullscreen() {
  syncGameFullscreenUiState();
  if (isGameFullscreenActive()) {
    lockGameLandscapeOrientation();
    refreshGameViewport();
    return;
  }

  const root = document.documentElement;
  const requestFullscreen =
    root.requestFullscreen
    || root.webkitRequestFullscreen
    || root.msRequestFullscreen;

  if (typeof requestFullscreen !== "function") {
    lockGameLandscapeOrientation();
    refreshGameViewport();
    return;
  }

  try {
    const fullscreenRequest = requestFullscreen.call(root, { navigationUI: "hide" });
    if (fullscreenRequest && typeof fullscreenRequest.then === "function") {
      fullscreenRequest
        .then(() => {
          lockGameLandscapeOrientation();
          syncGameFullscreenUiState();
          refreshGameViewport();
        })
        .catch(() => {
          syncGameFullscreenUiState();
          refreshGameViewport();
        });
    } else {
      lockGameLandscapeOrientation();
      syncGameFullscreenUiState();
      refreshGameViewport();
    }
  } catch (error) {
    syncGameFullscreenUiState();
    refreshGameViewport();
  }
}

function requestGameFullscreenFromGesture(event) {
  if (event?.button !== undefined && event.button !== 0) return;
  requestGameFullscreen();
}

window.addEventListener("pointerdown", requestGameFullscreenFromGesture, { capture: true, passive: true });
window.addEventListener("click", requestGameFullscreenFromGesture, { capture: true, passive: true });
window.addEventListener("keydown", requestGameFullscreenFromGesture, { capture: true });
syncGameFullscreenUiState();

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
if (optionResumeBtn) optionResumeBtn.addEventListener("click", handleOptionResume);
if (optionStageSelectBtn) optionStageSelectBtn.addEventListener("click", handleOptionStageSelect);
if (optionRestartBtn) optionRestartBtn.addEventListener("click", handleOptionRestart);
if (stageClearTreasureBtn) stageClearTreasureBtn.addEventListener("click", handleStageClearTreasureOpen);
if (stageClearRewardAdBtn) stageClearRewardAdBtn.addEventListener("click", handleStageClearRewardAdPreview);
if (stageClearRewardCloseBtn) stageClearRewardCloseBtn.addEventListener("click", handleStageClearRewardClose);
if (stageClearRewardLobbyBtn) stageClearRewardLobbyBtn.addEventListener("click", handleStageClearRewardLobby);
if (stageClearRewardRetryBtn) stageClearRewardRetryBtn.addEventListener("click", handleStageClearRewardRetry);
if (stageClearRewardNextBtn) stageClearRewardNextBtn.addEventListener("click", handleStageClearRewardNext);
if (stageDefeatLobbyBtn) stageDefeatLobbyBtn.addEventListener("click", handleStageDefeatLobby);
if (stageDefeatRetryBtn) stageDefeatRetryBtn.addEventListener("click", handleStageDefeatRetry);
if (stageDefeatUpgradeBtn) stageDefeatUpgradeBtn.addEventListener("click", handleStageDefeatUpgrade);
bindMovementJoystick(movementJoystick);
if (titleStartBtn) titleStartBtn.textContent = "TAP TO START";
function shouldShowWelcomeRewardPopup() {
  const mail = playerProgress?.welcomeMail || {};
  return !mail.introduced && !mail.claimed && !hasWelcomeZeusRewardClaimed();
}

function handleTitleStart() {
  requestGameFullscreen();
  showLobby();
  if (shouldShowWelcomeRewardPopup()) {
    playerProgress.welcomeMail = { ...(playerProgress.welcomeMail || {}), introduced: true, claimed: false };
    saveProgress();
    window.setTimeout(() => showWelcomeRewardPopup(), 120);
  }
}

if (titleScreen) titleScreen.addEventListener("click", handleTitleStart);

(() => {
  const showcase = document.getElementById("lobbyGodShowcase");
  const image = document.getElementById("lobbyGodImage");
  const name = document.getElementById("lobbyGodName");
  const title = document.getElementById("lobbyGodTitle");
  const dots = document.getElementById("lobbyGodDots");
  const previousButton = document.getElementById("lobbyGodPrevBtn");
  const nextButton = document.getElementById("lobbyGodNextBtn");
  const codex = document.getElementById("lobbyGodCodex");
  const codexName = document.getElementById("lobbyCodexName");
  const codexTitle = document.getElementById("lobbyCodexTitle");
  const codexStory = document.getElementById("lobbyCodexStory");
  const codexSkills = document.getElementById("lobbyCodexSkills");
  const codexBasicName = document.getElementById("lobbyCodexBasicName");
  const codexBasicDescription = document.getElementById("lobbyCodexBasicDescription");
  const codexUltimateName = document.getElementById("lobbyCodexUltimateName");
  const codexUltimateDescription = document.getElementById("lobbyCodexUltimateDescription");
  const codexLocked = document.getElementById("lobbyCodexLocked");
  if (!showcase || !image || !name || !title || !dots) return;

  const gods = [
    {
      id: "zeus",
      name: "제우스",
      title: "천둥의 지배자",
      image: "assets/gods/zeus.png",
      story: "티탄의 시대를 끝내고 올림포스의 왕좌에 오른 신들의 지배자. 세계의 질서를 어지럽히는 자에게 황금빛 번개로 심판을 내린다.",
      basicName: "뇌광의 창",
      basicDescription: "응축한 번개의 창을 전방의 적에게 던져 피해를 입힌다.",
      ultimateName: "천벌",
      ultimateDescription: "적이 밀집한 지역에 거대한 뇌운을 불러낸다. 번개에 닿은 적에게 강력한 피해를 주고 2초 동안 마비시킨다.",
    },
    {
      id: "poseidon", name: "포세이돈", title: "심해의 군주", image: "assets/gods/poseidon.png",
      story: "삼지창으로 바다와 폭풍, 대지의 격동을 다스리는 올림포스의 신.",
      basicName: "해류의 창", basicDescription: "거센 물살을 실은 삼지창으로 전방의 적을 꿰뚫는다.",
      ultimateName: "대해일", ultimateDescription: "전장을 집어삼키는 거대한 파도를 일으켜 모든 적을 밀어내고 피해를 준다.",
    },
    {
      id: "hades", name: "하데스", title: "명계의 왕", image: "assets/gods/hades.png",
      story: "죽은 자들의 세계와 깊은 지하의 보물을 지키는 냉철한 명계의 왕.",
      basicName: "망자의 손길", basicDescription: "명계의 기운을 방출해 적의 생명력을 잠식한다.",
      ultimateName: "명계의 문", ultimateDescription: "저승의 문을 열어 망령을 불러내고 넓은 범위의 적을 속박한다.",
    },
    {
      id: "ares", name: "아레스", title: "전쟁의 화신", image: "assets/gods/ares.png",
      story: "전장의 함성과 투쟁 속에서 힘을 얻는 거침없는 전쟁의 신.",
      basicName: "전장의 일격", basicDescription: "전투의 분노를 담은 강력한 베기로 가까운 적을 공격한다.",
      ultimateName: "전쟁신의 분노", ultimateDescription: "폭발적인 투기를 해방해 일정 시간 공격력과 공격 속도를 크게 높인다.",
    },
    {
      id: "atena", name: "아테나", title: "지혜의 수호자", image: "assets/gods/atena.png",
      story: "지혜와 전략으로 승리를 이끌며 영웅과 도시를 수호하는 여신.",
      basicName: "수호의 창", basicDescription: "정확한 창격으로 적을 공격하고 가장 가까운 아군을 보호한다.",
      ultimateName: "아이기스의 성역", ultimateDescription: "신성한 방패의 힘을 펼쳐 모든 아군이 받는 피해를 감소시킨다.",
    },
    {
      id: "heracles", name: "헤라클레스", title: "불굴의 영웅", image: "assets/gods/heracles.png",
      story: "열두 과업을 완수하고 인간의 한계를 넘어 신의 반열에 오른 위대한 영웅.",
      basicName: "괴력의 강타", basicDescription: "압도적인 힘으로 지면을 내리쳐 주변의 적을 뒤흔든다.",
      ultimateName: "열두 시련", ultimateDescription: "시련을 이겨낸 영웅의 힘을 해방해 체력을 회복하고 적진으로 돌진한다.",
    },
  ];
  let selectedIndex = 0;

  gods.forEach((god, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "lobby-god-dot";
    dot.setAttribute("aria-label", `${god.name} 선택`);
    dot.addEventListener("click", () => {
      selectGod(index);
      restartAutoChange();
    });
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
    updateCodex(god);
    dots.querySelectorAll(".lobby-god-dot").forEach((dot, dotIndex) => {
      const isSelected = dotIndex === selectedIndex;
      dot.classList.toggle("is-selected", isSelected);
      dot.setAttribute("aria-current", isSelected ? "true" : "false");
    });
  }

  function updateCodex(god) {
    if (!codex) return;
    codex.dataset.god = god.id;
    if (codexName) codexName.textContent = god.name;
    if (codexTitle) codexTitle.textContent = god.title;
    if (codexStory) codexStory.textContent = god.story;
    if (codexSkills) codexSkills.classList.toggle("is-hidden", Boolean(god.locked));
    if (codexLocked) codexLocked.classList.toggle("is-hidden", !god.locked);
    if (!god.locked) {
      if (codexBasicName) codexBasicName.textContent = god.basicName;
      if (codexBasicDescription) codexBasicDescription.textContent = god.basicDescription;
      if (codexUltimateName) codexUltimateName.textContent = god.ultimateName;
      if (codexUltimateDescription) codexUltimateDescription.textContent = god.ultimateDescription;
    }
  }

  let autoChangeTimer = 0;
  let autoChangePaused = false;
  const restartAutoChange = () => {
    window.clearInterval(autoChangeTimer);
    autoChangeTimer = window.setInterval(() => {
      if (!autoChangePaused && isLobbyVisible()) selectGod(selectedIndex + 1, 1);
    }, 6000);
  };
  const selectPreviousGod = () => {
    selectGod(selectedIndex - 1, -1);
    restartAutoChange();
  };
  const selectNextGod = () => {
    selectGod(selectedIndex + 1, 1);
    restartAutoChange();
  };

  if (previousButton) previousButton.addEventListener("click", selectPreviousGod);
  if (nextButton) nextButton.addEventListener("click", selectNextGod);
  [showcase, codex].filter(Boolean).forEach((element) => {
    element.addEventListener("pointerenter", () => { autoChangePaused = true; });
    element.addEventListener("pointerleave", () => { autoChangePaused = false; });
  });
  image.addEventListener("animationend", () => image.classList.remove("is-changing"));
  selectGod(selectedIndex);
  restartAutoChange();
})();

if (lobbyBattleBtn) lobbyBattleBtn.addEventListener("click", showStageSelect);
if (lobbyShopBtn) lobbyShopBtn.addEventListener("click", showShop);
if (lobbyFormationBtn) lobbyFormationBtn.addEventListener("click", showFormation);
if (lobbyRecruitBtn) lobbyRecruitBtn.addEventListener("click", showRecruit);
if (lobbyMissionBtn) lobbyMissionBtn.addEventListener("click", showMission);
const lobbyMailboxBtn = document.getElementById("lobbyMailboxBtn");
const lobbySettingsBtn = document.getElementById("lobbySettingsBtn");
const welcomeRewardPopup = document.getElementById("welcomeRewardPopup");
const welcomeRewardMailboxBtn = document.getElementById("welcomeRewardMailboxBtn");
const lobbyMailboxPanel = document.getElementById("lobbyMailboxPanel");
const lobbyMailboxCloseBtn = document.getElementById("lobbyMailboxCloseBtn");
const lobbyMailboxList = document.getElementById("lobbyMailboxList");
const lobbySettingsPanel = document.getElementById("lobbySettingsPanel");
const lobbySettingsCloseBtn = document.getElementById("lobbySettingsCloseBtn");
const lobbySettingsResetBtn = document.getElementById("lobbySettingsResetBtn");
const lobbySettingsExitBtn = document.getElementById("lobbySettingsExitBtn");
const lobbyVolumeControls = [
  { key: "master", input: document.getElementById("masterVolumeRange"), value: document.getElementById("masterVolumeValue") },
  { key: "bgm", input: document.getElementById("bgmVolumeRange"), value: document.getElementById("bgmVolumeValue") },
  { key: "sfx", input: document.getElementById("sfxVolumeRange"), value: document.getElementById("sfxVolumeValue") },
];

function updateLobbyTopBar() {
  const wallet = typeof playerProgress !== "undefined" && playerProgress ? playerProgress : {};
  const values = {
    lobbyGoldAmount: wallet.gold,
    lobbyDiamondAmount: wallet.diamonds,
    lobbyTicketAmount: wallet.summonTickets,
  };
  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = Math.max(0, Number(value) || 0).toLocaleString("ko-KR");
  });
}

function hasWelcomeZeusRewardClaimed() {
  return Boolean(playerProgress?.welcomeMail?.claimed || playerProgress?.ownedGods?.zeus?.owned === true || playerProgress?.ownedGods?.zeus === true);
}

function renderLobbyMailbox() {
  if (!lobbyMailboxList) return;
  const claimed = hasWelcomeZeusRewardClaimed();
  lobbyMailboxList.innerHTML = `
    <article class="lobby-mail-item${claimed ? " is-claimed" : ""}">
      <img src="assets/maps/formation/zeus.png" alt="제우스">
      <div>
        <strong>환영 보상</strong>
        <span>제우스 영웅 1개</span>
        <p>${claimed ? "이미 수령한 보상입니다." : "첫 전투를 시작하기 위한 신을 수령하세요."}</p>
      </div>
      <button id="welcomeZeusClaimBtn" type="button" ${claimed ? "disabled" : ""}>${claimed ? "수령완료" : "받기"}</button>
    </article>
  `;
  const claimBtn = document.getElementById("welcomeZeusClaimBtn");
  if (claimBtn && !claimed) claimBtn.addEventListener("click", claimWelcomeZeusReward);
}

function showLobbyMailbox() {
  renderLobbyMailbox();
  if (lobbyMailboxPanel) lobbyMailboxPanel.classList.remove("is-hidden");
}

function hideLobbyMailbox() {
  if (lobbyMailboxPanel) lobbyMailboxPanel.classList.add("is-hidden");
}

function showWelcomeRewardPopup() {
  if (welcomeRewardPopup) welcomeRewardPopup.classList.remove("is-hidden");
}

function hideWelcomeRewardPopup() {
  if (welcomeRewardPopup) welcomeRewardPopup.classList.add("is-hidden");
}

function claimWelcomeZeusReward() {
  if (hasWelcomeZeusRewardClaimed()) {
    renderLobbyMailbox();
    return;
  }
  if (window.PlayerAPI?.grantWelcomeZeusReward) {
    window.PlayerAPI.grantWelcomeZeusReward();
  } else {
    playerProgress.ownedGods = playerProgress.ownedGods || {};
    playerProgress.ownedGods.zeus = { id: "zeus", name: "제우스", owned: true };
    playerProgress.welcomeMail = { ...(playerProgress.welcomeMail || {}), introduced: true, claimed: true };
    saveProgress();
  }
  if (typeof setSelectedHeroId === "function") setSelectedHeroId("zeus");
  if (typeof updateLobbyTopBar === "function") updateLobbyTopBar();
  if (window.GameAudio) window.GameAudio.playRewardGetSfx();
  renderLobbyMailbox();
  showLobbyMenuNotice("제우스를 수령했습니다");
}

function updateLobbySettingsControls() {
  const settings = window.GameAudio?.getAudioSettings?.() || { master: 1, bgm: 1, sfx: 1 };
  lobbyVolumeControls.forEach((control) => {
    if (!control.input || !control.value) return;
    const percent = Math.round(Math.min(1, Math.max(0, Number(settings[control.key]) || 0)) * 100);
    control.input.value = String(percent);
    control.value.textContent = `${percent}%`;
  });
}

function showLobbySettings() {
  updateLobbySettingsControls();
  if (lobbySettingsPanel) lobbySettingsPanel.classList.remove("is-hidden");
}

function hideLobbySettings() {
  if (lobbySettingsPanel) lobbySettingsPanel.classList.add("is-hidden");
}

function resetGameProgressFromSettings() {
  const confirmed = window.confirm("진행 데이터를 초기화할까요? 볼륨 설정은 유지됩니다.");
  if (!confirmed) return;
  if (typeof resetProgressStorage === "function") resetProgressStorage();
  playerProgress = normalizePlayerData(typeof createDefaultProgress === "function" ? createDefaultProgress() : {});
  if (typeof claimedMissionRewards !== "undefined") claimedMissionRewards.clear();
  selectedStage = 1;
  if (typeof setSelectedHeroId === "function") setSelectedHeroId("zeus");
  hideLobbySettings();
  showTitle();
  updateWalletDisplays();
  updateLobbyTopBar();
}

if (lobbyMailboxBtn) lobbyMailboxBtn.addEventListener("click", showLobbyMailbox);
if (lobbyMailboxCloseBtn) lobbyMailboxCloseBtn.addEventListener("click", hideLobbyMailbox);
if (lobbyMailboxPanel) {
  lobbyMailboxPanel.addEventListener("click", (event) => {
    if (event.target === lobbyMailboxPanel) hideLobbyMailbox();
  });
}
if (welcomeRewardMailboxBtn) {
  welcomeRewardMailboxBtn.addEventListener("click", () => {
    hideWelcomeRewardPopup();
    showLobbyMailbox();
  });
}
if (lobbySettingsBtn) lobbySettingsBtn.addEventListener("click", showLobbySettings);
lobbyVolumeControls.forEach((control) => {
  if (!control.input) return;
  control.input.addEventListener("input", () => {
    const percent = Math.min(100, Math.max(0, Number(control.input.value) || 0));
    if (control.value) control.value.textContent = `${Math.round(percent)}%`;
    window.GameAudio?.setAudioSetting?.(control.key, percent / 100);
  });
});
if (lobbySettingsCloseBtn) lobbySettingsCloseBtn.addEventListener("click", hideLobbySettings);
if (lobbySettingsResetBtn) lobbySettingsResetBtn.addEventListener("click", resetGameProgressFromSettings);
if (lobbySettingsPanel) {
  lobbySettingsPanel.addEventListener("click", (event) => {
    if (event.target === lobbySettingsPanel) hideLobbySettings();
  });
}
if (lobbySettingsExitBtn) {
  lobbySettingsExitBtn.addEventListener("click", () => {
    hideLobbySettings();
    showTitle();
  });
}
updateLobbyTopBar();
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
if (recruitDoorCloseBtn) {
  recruitDoorCloseBtn.addEventListener("pointerdown", closeRecruitDoorScene);
  recruitDoorCloseBtn.addEventListener("click", closeRecruitDoorScene);
}
if (lobbyExitBtn) lobbyExitBtn.addEventListener("click", showTitle);
if (shopBackBtn) shopBackBtn.addEventListener("click", showLobby);
if (shopCloseBtn) shopCloseBtn.addEventListener("click", showLobby);
shopCards.forEach((card) => {
  card.addEventListener("click", () => showShopItemNotice(card.dataset.item || "아이템"));
});
if (stageBackBtn) stageBackBtn.addEventListener("click", handleStageBack);
if (chapter1Btn) chapter1Btn.addEventListener("click", () => showChapterStages(1));
if (chapter2Btn) chapter2Btn.addEventListener("click", () => showChapterStages(2));
if (chapterBackBtn) chapterBackBtn.addEventListener("click", showStageSelect);
if (stageDetailCloseBtn) stageDetailCloseBtn.addEventListener("click", hideStageDetailPanel);
if (stageDetailStartBtn) stageDetailStartBtn.addEventListener("click", proceedStageDetailPanel);
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
bindHeroActionIcon(zeusSkillIconBtn, castHeroSkill);
if (skillBtn) skillBtn.addEventListener("click", castHolySlash);
if (zeusSkillBtn) zeusSkillBtn.addEventListener("click", castHeroSkill);
// 전투 개편: 캔버스 직접 터치 공격은 제거했습니다.

resetGame();
