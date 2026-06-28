// Screen navigation, options menu, HUD, and command UI.

function isTitleVisible() {
  return titleScreen && !titleScreen.classList.contains("is-hidden");
}

function isLobbyVisible() {
  return lobbyScreen && !lobbyScreen.classList.contains("is-hidden");
}

function isStageSelectVisible() {
  return stageScreen && !stageScreen.classList.contains("is-hidden");
}

function isShopVisible() {
  return shopScreen && !shopScreen.classList.contains("is-hidden");
}

function isRecruitVisible() {
  return recruitScreen && !recruitScreen.classList.contains("is-hidden");
}

function isFormationVisible() {
  return formationScreen && !formationScreen.classList.contains("is-hidden");
}

function showLobby() {
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.remove("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);
  document.body.classList.remove("game-started", "in-stage-select", "in-shop", "in-recruit", "in-formation");
  document.body.classList.add("in-lobby");
  if (gameState) {
    gameState.running = false;
    gameState.message = "로비에서 전투를 준비하세요";
    updateButtons();
  }
  if (lobbyNotice) {
    lobbyNotice.textContent = "상점에서 장비를 확인하거나 전투 버튼으로 Chapter 1을 선택할 수 있습니다.";
  }
  if (lobbyMenuNotice) {
    lobbyMenuNotice.textContent = "";
    lobbyMenuNotice.classList.remove("is-show");
  }
}

function showTitle() {
  resetGame();
  if (titleScreen) titleScreen.classList.remove("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);
  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-shop", "in-recruit", "in-formation");
  if (lobbyNotice) {
    lobbyNotice.textContent = "상점에서 장비를 확인하거나 전투 버튼으로 Chapter 1을 선택할 수 있습니다.";
  }
}


function showLobbyMenuNotice(label) {
  if (!lobbyMenuNotice) return;
  const noticeText = `${label} 기능은 다음 단계에서 추가 예정입니다.`;
  lobbyMenuNotice.textContent = noticeText;
  lobbyMenuNotice.classList.add("is-show");
  clearTimeout(showLobbyMenuNotice.timer);
  showLobbyMenuNotice.timer = setTimeout(() => {
    if (!lobbyMenuNotice) return;
    lobbyMenuNotice.classList.remove("is-show");
  }, 1600);
}

function isGameOptionsOpen() {
  return Boolean(gameOptionsMenu && !gameOptionsMenu.classList.contains("is-hidden"));
}

function closeGameOptionsMenu(resumeGame = true) {
  if (!gameOptionsMenu) return;

  gameOptionsMenu.classList.add("is-hidden");
  if (gameOptionsBtn) {
    gameOptionsBtn.classList.remove("is-active");
    gameOptionsBtn.setAttribute("aria-expanded", "false");
  }

  if (
    resumeGame
    && gameOptionsWasRunning
    && gameState
    && !gameState.gameOver
    && !gameState.clear
  ) {
    gameState.running = true;
    gameState.message = "";
    gameState.messageTimer = 0;
    lastTime = performance.now();
  }

  gameOptionsWasRunning = false;
  updateButtons();
}

function openGameOptionsMenu() {
  if (!gameOptionsMenu || !gameState) return;

  gameOptionsWasRunning = Boolean(gameState.running);
  gameState.running = false;
  gameState.message = "게임 일시정지";
  gameState.messageTimer = 0;

  gameOptionsMenu.classList.remove("is-hidden");
  if (gameOptionsBtn) {
    gameOptionsBtn.classList.add("is-active");
    gameOptionsBtn.setAttribute("aria-expanded", "true");
  }
  updateButtons();
}

function toggleGameOptionsMenu() {
  if (isGameOptionsOpen()) closeGameOptionsMenu(true);
  else openGameOptionsMenu();
}

function handleOptionStageSelect() {
  closeGameOptionsMenu(false);
  showStageSelect();
}

function handleOptionRestart() {
  closeGameOptionsMenu(false);
  restartGame();
}

function bindHoldMovementButton(button, keyCode) {
  if (!button) return;

  const startMove = (event) => {
    event.preventDefault();
    if (isGameOptionsOpen()) return;
    keys[keyCode] = true;
  };
  const stopMove = () => {
    keys[keyCode] = false;
  };

  button.addEventListener("pointerdown", startMove);
  button.addEventListener("pointerup", stopMove);
  button.addEventListener("pointerleave", stopMove);
  button.addEventListener("pointercancel", stopMove);
  button.addEventListener("blur", stopMove);
}

function updateHud() {
  const activeUnits = getActiveUnitCount();

  waveText.textContent = `${gameState.wave} / ${gameState.maxWave}`;
  goldText.textContent = Math.floor(gameState.gold);
  if (unitCountText) unitCountText.textContent = `${activeUnits} / ${MAX_SUMMONED_UNITS}`;
  if (commandUnitText) commandUnitText.textContent = `${activeUnits} / ${MAX_SUMMONED_UNITS}`;
  if (commandGoldText) commandGoldText.textContent = `${Math.floor(gameState.gold)}G`;
  playerHpText.textContent = Math.max(0, Math.ceil(gameState.playerBaseHp));
  enemyHpText.textContent = Math.max(0, Math.ceil(gameState.enemyBaseHp));
}

function getActiveUnitCount() {
  if (!gameState || !Array.isArray(gameState.units)) return 0;
  return gameState.units.filter((unit) => unit.hp > 0).length;
}

function hasSummonSlot() {
  return getActiveUnitCount() < MAX_SUMMONED_UNITS;
}

function showSummonLimitMessage() {
  if (!gameState) return;
  gameState.message = `소환 제한! 병사는 최대 ${MAX_SUMMONED_UNITS}명까지 유지됩니다.`;
  gameState.messageTimer = 1.25;
}

function renderCommandSlot(button, costText, countText, label, title) {
  if (!button || !button.classList.contains("command-slot")) return;

  button.setAttribute("aria-label", label);
  button.title = title;
  button.innerHTML = `
    <span class="slot-icon" aria-hidden="true"></span>
    <span class="slot-cost">${costText}</span>
    <span class="slot-count">${countText}</span>
  `;
}

function renderRoundCommand(button, labelText, label, title) {
  if (!button) return;

  button.setAttribute("aria-label", label);
  button.title = title;

  if (button.classList.contains("zeus-action-btn")) {
    const isSkill = button.classList.contains("zeus-skill-btn");
    button.innerHTML = `
      <span class="zeus-action-icon ${isSkill ? "skill" : "basic"}" aria-hidden="true"></span>
      <span class="zeus-action-label">${isSkill ? "제우스 스킬" : "기본공격"}</span>
      <span class="zeus-action-key">${labelText}</span>
    `;
    return;
  }

  if (!button.classList.contains("battle-round-btn")) return;
  button.innerHTML = `
    <span class="round-icon" aria-hidden="true"></span>
    <span class="round-label">${labelText}</span>
  `;
}

function refreshCommandButtonMarkup() {
  const activeUnits = getActiveUnitCount();
  const unitLimitReached = activeUnits >= MAX_SUMMONED_UNITS;
  const slotText = unitLimitReached ? "MAX" : `${activeUnits}/${MAX_SUMMONED_UNITS}`;
  const limitTitle = "아군 병사가 사망하면 다시 소환할 수 있습니다.";

  renderCommandSlot(
    summonGuardBtn,
    "50",
    slotText,
    unitLimitReached ? `방패병 소환 제한 ${activeUnits}/${MAX_SUMMONED_UNITS}` : "방패병 소환",
    unitLimitReached ? limitTitle : "방패병을 소환합니다."
  );
  renderCommandSlot(
    summonArcherBtn,
    "75",
    slotText,
    unitLimitReached ? `궁수 소환 제한 ${activeUnits}/${MAX_SUMMONED_UNITS}` : "궁수 소환",
    unitLimitReached ? limitTitle : "궁수를 소환합니다."
  );
  renderCommandSlot(
    summonMageBtn,
    "100",
    slotText,
    unitLimitReached ? `마법사 소환 제한 ${activeUnits}/${MAX_SUMMONED_UNITS}` : "마법사 소환",
    unitLimitReached ? limitTitle : "마법사를 소환합니다."
  );
  renderCommandSlot(
    summonSaintessBtn,
    "120",
    slotText,
    unitLimitReached ? `성녀 소환 제한 ${activeUnits}/${MAX_SUMMONED_UNITS}` : "성녀 소환",
    unitLimitReached ? limitTitle : "주변 아군을 회복하는 성녀를 소환합니다."
  );
  renderCommandSlot(
    summonThiefBtn,
    "90",
    slotText,
    unitLimitReached ? `도적 소환 제한 ${activeUnits}/${MAX_SUMMONED_UNITS}` : "도적 소환",
    unitLimitReached ? limitTitle : "빠른 근접 도적을 소환합니다."
  );

  const hero = gameState && gameState.hero;
  const zeusEffectActive = Boolean(gameState && gameState.zeusSkillEffect && gameState.zeusSkillEffect.active);
  renderRoundCommand(
    skillBtn,
    hero && hero.dead ? `부활 ${Math.ceil(hero.respawnTimer)}` : "SPACE",
    hero && hero.dead ? `영웅 부활 ${Math.ceil(hero.respawnTimer)}초` : "영웅 공격",
    "메인 영웅이 가장 가까운 적에게 투사체를 발사합니다."
  );
  renderRoundCommand(
    zeusSkillBtn,
    zeusEffectActive ? "CAST" : "READY",
    "제우스 스킬",
    zeusEffectActive ? "번개 폭풍 연출 중입니다." : "거대한 먹구름과 번개 폭풍을 소환합니다."
  );
}

function updateButtons() {
  const disabled = !gameState.running || gameState.gameOver || gameState.clear;
  const activeUnits = getActiveUnitCount();
  const unitLimitReached = activeUnits >= MAX_SUMMONED_UNITS;
  const slotText = `${activeUnits}/${MAX_SUMMONED_UNITS}`;

  if (summonGuardBtn) {
    summonGuardBtn.textContent = unitLimitReached ? `방패병 소환 제한 ${slotText}` : `방패병 소환 50G · ${slotText}`;
    summonGuardBtn.disabled = disabled || unitLimitReached || gameState.gold < 50;
    summonGuardBtn.title = unitLimitReached ? "아군 병사가 사망하면 다시 소환할 수 있습니다." : "방패병을 소환합니다.";
  }

  if (summonArcherBtn) {
    summonArcherBtn.textContent = unitLimitReached ? `궁수 소환 제한 ${slotText}` : `궁수 소환 75G · ${slotText}`;
    summonArcherBtn.disabled = disabled || unitLimitReached || gameState.gold < 75;
    summonArcherBtn.title = unitLimitReached ? "아군 병사가 사망하면 다시 소환할 수 있습니다." : "궁수를 소환합니다.";
  }

  if (summonMageBtn) {
    summonMageBtn.textContent = unitLimitReached ? `마법사 소환 제한 ${slotText}` : `마법사 소환 100G · ${slotText}`;
    summonMageBtn.disabled = disabled || unitLimitReached || gameState.gold < 100;
    summonMageBtn.title = unitLimitReached ? "아군 병사가 사망하면 다시 소환할 수 있습니다." : "마법사를 소환합니다.";
  }

  if (summonSaintessBtn) {
    summonSaintessBtn.textContent = unitLimitReached ? `성녀 소환 제한 ${slotText}` : `성녀 소환 120G · ${slotText}`;
    summonSaintessBtn.disabled = disabled || unitLimitReached || gameState.gold < 120;
    summonSaintessBtn.title = unitLimitReached ? "아군 병사가 사망하면 다시 소환할 수 있습니다." : "주변 아군을 회복하는 성녀를 소환합니다.";
  }

  if (summonThiefBtn) {
    summonThiefBtn.textContent = unitLimitReached ? `도적 소환 제한 ${slotText}` : `도적 소환 90G · ${slotText}`;
    summonThiefBtn.disabled = disabled || unitLimitReached || gameState.gold < 90;
    summonThiefBtn.title = unitLimitReached ? "아군 병사가 사망하면 다시 소환할 수 있습니다." : "빠른 근접 도적을 소환합니다.";
  }

  if (skillBtn) {
    const hero = gameState.hero;
    const heroReady = hero && !hero.dead && hero.hp > 0 && hero.cooldown <= 0;
    if (!skillBtn.classList.contains("zeus-action-btn")) {
      skillBtn.textContent = hero && hero.dead
        ? `영웅 부활 ${Math.ceil(hero.respawnTimer)}초`
        : "영웅 공격 Space";
    }
    skillBtn.disabled = disabled || !heroReady;
    skillBtn.title = "메인 영웅이 가장 가까운 적에게 투사체를 발사합니다.";
  }
  if (zeusSkillBtn) {
    const hero = gameState.hero;
    const heroReady = hero && !hero.dead && hero.hp > 0;
    const zeusEffectActive = Boolean(gameState.zeusSkillEffect && gameState.zeusSkillEffect.active);
    zeusSkillBtn.disabled = disabled || !heroReady || zeusEffectActive;
    zeusSkillBtn.title = zeusEffectActive ? "번개 폭풍 연출 중입니다." : "거대한 먹구름과 번개 폭풍을 소환합니다.";
  }
  if (startBtn) {
    startBtn.textContent = gameState.running ? "진행 중" : "게임 시작";
    startBtn.disabled = gameState.running && !gameState.gameOver && !gameState.clear;
  }
  if (stageSelectBtn) stageSelectBtn.disabled = false;
  refreshCommandButtonMarkup();
}

