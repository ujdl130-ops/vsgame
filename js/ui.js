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

function updateBattleViewportScale() {
  const baseWidth = 960;
  const baseHeight = 540;
  const maxScale = 2;
  const availableWidth = Math.max(1, window.innerWidth);
  const availableHeight = Math.max(1, window.innerHeight);
  const scale = Math.min(maxScale, availableWidth / baseWidth);
  const frameHeight = Math.min(baseHeight, availableHeight / scale);
  const rootStyle = document.documentElement.style;

  rootStyle.setProperty("--battle-visual-scale", scale.toFixed(4));
  rootStyle.setProperty("--battle-visual-width", `${baseWidth * scale}px`);
  rootStyle.setProperty("--battle-visual-height", `${frameHeight * scale}px`);
  rootStyle.setProperty("--battle-frame-height", `${frameHeight}px`);
}

function bindMovementJoystick(joystick) {
  if (!joystick) return;

  let activePointerId = null;

  const setJoystickInput = (direction) => {
    heroMoveInput = direction;
    joystick.classList.toggle("is-left", direction < 0);
    joystick.classList.toggle("is-right", direction > 0);
  };

  const resetJoystick = () => {
    activePointerId = null;
    joystick.style.setProperty("--stick-x", "0px");
    joystick.classList.remove("is-active", "is-left", "is-right");
    setJoystickInput(0);
  };

  const updateJoystick = (clientX) => {
    const rect = joystick.getBoundingClientRect();
    const visualScale = rect.width / Math.max(1, joystick.offsetWidth);
    const centerX = rect.left + rect.width / 2;
    const maxOffset = joystick.offsetWidth * 0.32;
    const deadZone = joystick.offsetWidth * 0.11;
    const localOffset = (clientX - centerX) / Math.max(1, visualScale);
    const offset = Math.max(-maxOffset, Math.min(maxOffset, localOffset));

    joystick.style.setProperty("--stick-x", `${offset}px`);

    if (Math.abs(offset) < deadZone || isGameOptionsOpen()) {
      setJoystickInput(0);
      return;
    }
    setJoystickInput(offset < 0 ? -1 : 1);
  };

  joystick.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (isGameOptionsOpen()) return;
    event.preventDefault();
    activePointerId = event.pointerId;
    joystick.classList.add("is-active");
    if (joystick.setPointerCapture) joystick.setPointerCapture(event.pointerId);
    updateJoystick(event.clientX);
  });

  joystick.addEventListener("pointermove", (event) => {
    if (activePointerId !== event.pointerId) return;
    event.preventDefault();
    updateJoystick(event.clientX);
  });

  joystick.addEventListener("pointerup", (event) => {
    if (activePointerId !== event.pointerId) return;
    resetJoystick();
  });

  joystick.addEventListener("pointercancel", resetJoystick);
  joystick.addEventListener("lostpointercapture", resetJoystick);
  joystick.addEventListener("blur", resetJoystick);
  window.addEventListener("blur", resetJoystick);
}

function updateHud() {
  const activeUnits = getActiveUnitCount();

  waveText.textContent = `${gameState.wave} / ${gameState.maxWave}`;
  const runestone = Math.floor(gameState.runestone || 0);
  if (runestoneGaugeFill) {
    runestoneGaugeFill.style.width = `${Math.max(0, Math.min(100, (runestone / RUNESTONE_GAUGE_MAX) * 100))}%`;
  }
  if (runestoneGaugeText) {
    runestoneGaugeText.textContent = `${runestone}/${RUNESTONE_GAUGE_MAX}`;
  }
  if (zeusManaText) {
    const zeusMana = Math.floor(gameState.zeusMana || 0);
    const zeusManaMax = gameState.zeusManaMax || ZEUS_MANA_MAX;
    zeusManaText.textContent = `${zeusMana}/${zeusManaMax}`;
    if (zeusManaFill) {
      zeusManaFill.style.width = `${Math.max(0, Math.min(100, (zeusMana / zeusManaMax) * 100))}%`;
    }
  }
  if (unitCountText) unitCountText.textContent = `${activeUnits} / ${MAX_SUMMONED_UNITS}`;
  if (commandUnitText) commandUnitText.textContent = `${activeUnits} / ${MAX_SUMMONED_UNITS}`;
  if (playerHpText) playerHpText.textContent = Math.max(0, Math.ceil(gameState.playerBaseHp));
  if (enemyHpText) enemyHpText.textContent = Math.max(0, Math.ceil(gameState.enemyBaseHp));
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

function renderRoundCommand(button, labelText, label, title) {
  if (!button) return;

  button.setAttribute("aria-label", label);
  button.title = title;

  if (button.classList.contains("zeus-action-btn")) {
    const isSkill = button.classList.contains("zeus-skill-btn");
    const renderKey = `zeus|${labelText}|${label}|${isSkill ? "skill" : "basic"}`;
    if (button.dataset.renderKey === renderKey) return;

    button.dataset.renderKey = renderKey;
    button.innerHTML = `
      <span class="zeus-action-icon ${isSkill ? "skill" : "basic"}" aria-hidden="true"></span>
      <span class="zeus-action-label">${isSkill ? "천벌" : "기본공격"}</span>
      <span class="zeus-action-key">${labelText}</span>
    `;
    return;
  }

  if (!button.classList.contains("battle-round-btn")) return;
  const renderKey = `round|${labelText}|${label}`;
  if (button.dataset.renderKey === renderKey) return;

  button.dataset.renderKey = renderKey;
  button.innerHTML = `
    <span class="round-icon" aria-hidden="true"></span>
    <span class="round-label">${labelText}</span>
  `;
}

function refreshCommandButtonMarkup() {
  const hero = gameState && gameState.hero;
  const zeusEffectActive = Boolean(gameState && gameState.zeusSkillEffect && gameState.zeusSkillEffect.active);
  const zeusMana = Math.floor(gameState && gameState.zeusMana || 0);
  renderRoundCommand(
    skillBtn,
    hero && hero.dead ? `부활 ${Math.ceil(hero.respawnTimer)}` : "SPACE",
    hero && hero.dead ? `영웅 부활 ${Math.ceil(hero.respawnTimer)}초` : "영웅 공격",
    "메인 영웅이 가장 가까운 적에게 투사체를 발사합니다."
  );
  renderRoundCommand(
    zeusSkillBtn,
    zeusEffectActive ? "CAST" : "READY",
    "천벌",
    zeusEffectActive
      ? "천벌 발동 중입니다."
      : `마나 ${zeusMana}/${ZEUS_MANA_COST} · 50마나를 소모해 적에게 피해를 주고 2초간 마비시킵니다.`
  );
}

function updateButtons() {
  const disabled = !gameState.running || gameState.gameOver || gameState.clear;

  if (summonGuardSlotBtn) {
    const canSummonGuard = !disabled && hasSummonSlot() && gameState.runestone >= 50;
    summonGuardSlotBtn.disabled = !canSummonGuard;
    summonGuardSlotBtn.title = canSummonGuard
      ? "기사를 소환합니다."
      : "룬스톤, 유닛 제한 또는 전투 상태를 확인하세요.";
  }

  if (summonArcherSlotBtn) {
    const canSummonArcher = !disabled && hasSummonSlot() && gameState.runestone >= 75;
    summonArcherSlotBtn.disabled = !canSummonArcher;
    summonArcherSlotBtn.title = canSummonArcher
      ? "궁수를 소환합니다."
      : "룬스톤, 유닛 제한 또는 전투 상태를 확인하세요.";
  }

  if (summonMageSlotBtn) {
    const canSummonMage = !disabled && hasSummonSlot() && gameState.runestone >= 100;
    summonMageSlotBtn.disabled = !canSummonMage;
    summonMageSlotBtn.title = canSummonMage
      ? "마법사를 소환합니다."
      : "룬스톤, 유닛 제한 또는 전투 상태를 확인하세요.";
  }

  if (summonSaintessSlotBtn) {
    const canSummonSaintess = !disabled && hasSummonSlot() && gameState.runestone >= 120;
    summonSaintessSlotBtn.disabled = !canSummonSaintess;
    summonSaintessSlotBtn.title = canSummonSaintess
      ? "성녀를 소환합니다."
      : "룬스톤, 유닛 제한 또는 전투 상태를 확인하세요.";
  }

  if (summonThiefSlotBtn) {
    const canSummonThief = !disabled && hasSummonSlot() && gameState.runestone >= 90;
    summonThiefSlotBtn.disabled = !canSummonThief;
    summonThiefSlotBtn.title = canSummonThief
      ? "도적을 소환합니다."
      : "룬스톤, 유닛 제한 또는 전투 상태를 확인하세요.";
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
    const zeusMana = Math.floor(gameState.zeusMana || 0);
    const zeusManaReady = zeusMana >= ZEUS_MANA_COST;
    zeusSkillBtn.disabled = disabled || !heroReady || zeusEffectActive || !zeusManaReady;
    zeusSkillBtn.title = zeusEffectActive
      ? "천벌 발동 중입니다."
      : zeusManaReady
        ? "50마나를 소모해 천벌을 사용합니다."
        : `마나 충전 중 ${zeusMana}/${ZEUS_MANA_COST}`;
  }
  if (startBtn) {
    startBtn.textContent = gameState.running ? "진행 중" : "게임 시작";
    startBtn.disabled = gameState.running && !gameState.gameOver && !gameState.clear;
  }
  if (stageSelectBtn) stageSelectBtn.disabled = false;
  refreshCommandButtonMarkup();
}

