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

function isMissionVisible() {
  return missionScreen && !missionScreen.classList.contains("is-hidden");
}

function isInventoryVisible() {
  return inventoryScreen && !inventoryScreen.classList.contains("is-hidden");
}

function showLobby() {
  hideStageDefeatUi();
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.remove("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  if (missionScreen) missionScreen.classList.add("is-hidden");
  if (inventoryScreen) inventoryScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);
  document.body.classList.remove("game-started", "in-stage-select", "in-shop", "in-recruit", "in-formation", "in-mission", "in-inventory");
  document.body.classList.add("in-lobby");
  if (typeof updateLobbyTopBar === "function") updateLobbyTopBar();
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
  // Ensure lobby hero canvas is drawn when showing lobby
  requestAnimationFrame(() => {
    if (typeof renderLobbyHero === 'function') renderLobbyHero();
  });
}

const LOBBY_HERO_HD_BOUNDS = {
  x: 267,
  y: 51,
  width: 845,
  height: 854,
};

function getLobbyHeroImageBounds(image) {
  if (
    image
    && image.naturalWidth === 1536
    && image.naturalHeight === 1024
    && typeof ASSET_PATHS !== 'undefined'
    && ASSET_PATHS.lobbyHeroIdle
    && ASSET_PATHS.lobbyHeroIdle.includes('zeus_lobby_idle_hd.png')
  ) {
    return LOBBY_HERO_HD_BOUNDS;
  }

  return image && image.naturalWidth && image.naturalHeight
    ? { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight }
    : null;
}

// Draw the lobby-only transparent idle frame.

function renderLobbyHero() {
  const canvas = document.getElementById('lobbyHeroCanvas');
  if (!canvas) return;
  const c = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const canvasW = Math.max(1, Math.round(rect.width || canvas.width));
  const canvasH = Math.max(1, Math.round(rect.height || canvas.height));
  if (canvas.width !== canvasW || canvas.height !== canvasH) {
    canvas.width = canvasW;
    canvas.height = canvasH;
  }
  c.clearRect(0, 0, canvas.width, canvas.height);

  if (typeof lobbyHeroImage !== 'undefined' && lobbyHeroImage && lobbyHeroReady) {
    const bounds = getLobbyHeroImageBounds(lobbyHeroImage);
    const sW = bounds.width;
    const sH = bounds.height;
    c.imageSmoothingEnabled = true;
    c.imageSmoothingQuality = 'high';
    const padding = Math.round(canvasW * 0.02);
    const maxDrawW = canvasW - padding * 2;
    const maxDrawH = canvasH - padding * 2;
    let drawW = maxDrawW;
    let drawH = Math.round(sH * (drawW / sW));
    if (drawH > maxDrawH) {
      drawH = maxDrawH;
      drawW = Math.round(sW * (drawH / sH));
    }
    const dx = Math.round((canvasW - drawW) / 2);
    const dy = Math.round(canvasH - drawH - padding);
    c.drawImage(lobbyHeroImage, bounds.x, bounds.y, sW, sH, dx, dy, drawW, drawH);
    return;
  }

  if (typeof lobbyHeroImage !== 'undefined' && lobbyHeroImage) {
    lobbyHeroImage.addEventListener('load', function onLoad() {
      lobbyHeroImage.removeEventListener('load', onLoad);
      renderLobbyHero();
    });
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
  if (missionScreen) missionScreen.classList.add("is-hidden");
  if (inventoryScreen) inventoryScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);
  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-shop", "in-recruit", "in-formation", "in-mission", "in-inventory");
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

function isStageClearRewardVisible() {
  return Boolean(stageClearRewardOverlay && !stageClearRewardOverlay.classList.contains("is-hidden"));
}

function isStageDefeatVisible() {
  return Boolean(stageDefeatOverlay && !stageDefeatOverlay.classList.contains("is-hidden"));
}

function updateStageClearRewardActions() {
  if (!stageClearRewardNextBtn) return;
  const nextStage = Number(selectedStage) + 1;
  const canGoNext = Boolean(STAGE_CONFIGS[nextStage] && isStageUnlocked(nextStage));
  stageClearRewardNextBtn.disabled = !canGoNext;
  stageClearRewardNextBtn.setAttribute("aria-disabled", canGoNext ? "false" : "true");
}

const STAGE_CLEAR_TREASURE_REWARD_CONFIGS = {
  1: { gold: 10000 },
  2: { gold: 15000 },
  3: { gold: 30000 },
};
const DEFAULT_STAGE_CLEAR_TREASURE_REWARD_CONFIG = STAGE_CLEAR_TREASURE_REWARD_CONFIGS[1];
let stageClearTreasureReward = null;
let stageClearTreasureAdClaimed = false;

function getStageClearTreasureRewardConfig(stageNumber = selectedStage) {
  const stage = Number(stageNumber) || 1;
  return STAGE_CLEAR_TREASURE_REWARD_CONFIGS[stage] || DEFAULT_STAGE_CLEAR_TREASURE_REWARD_CONFIG;
}

function rollStageClearTreasureSoldierReward(random = Math.random) {
  const roll = random();
  if (roll < 0.5) return 1;
  if (roll < 0.85) return 2;
  return 3;
}

function createStageClearTreasureReward(stageNumber = selectedStage) {
  const rewardConfig = getStageClearTreasureRewardConfig(stageNumber);
  return {
    gold: rewardConfig.gold,
    soldierFragments: rollStageClearTreasureSoldierReward(),
  };
}

function updateStageClearTreasureRewardText(reward = stageClearTreasureReward, multiplier = 1) {
  const goldAmount = document.getElementById("stageClearGoldAmount");
  const soldierAmount = document.getElementById("stageClearSoldierAmount");
  const rewardConfig = getStageClearTreasureRewardConfig();
  const visibleReward = reward || { gold: rewardConfig.gold, soldierFragments: 1 };
  const rewardMultiplier = Math.max(1, Number(multiplier) || 1);

  if (goldAmount) {
    goldAmount.textContent = `${Math.max(0, Number(visibleReward.gold) || 0) * rewardMultiplier}G`;
  }
  if (soldierAmount) {
    soldierAmount.textContent = `${Math.max(1, Number(visibleReward.soldierFragments) || 1) * rewardMultiplier}개`;
  }
}

function syncStageClearRewardWalletDisplays() {
  if (typeof updateWalletDisplays === "function") updateWalletDisplays();
  if (typeof updateLobbyTopBar === "function") updateLobbyTopBar();
  if (window.ShopAPI?.updateShopWallet) window.ShopAPI.updateShopWallet();
  if (typeof updateRecruitWallet === "function") updateRecruitWallet();
  if (typeof renderInventoryScreen === "function") renderInventoryScreen();
}

function grantStageClearTreasureReward(reward) {
  if (!reward || typeof grantPlayerRewards !== "function") return;
  grantPlayerRewards({
    gold: Math.max(0, Number(reward.gold) || 0),
    soldierFragments: Math.max(0, Number(reward.soldierFragments) || 0),
  });
  syncStageClearRewardWalletDisplays();
}

function resetStageClearRewardEffects() {
  stageClearTreasureReward = null;
  stageClearTreasureAdClaimed = false;
  updateStageClearTreasureRewardText();

  if (stageClearTreasureBtn) {
    stageClearTreasureBtn.classList.remove("is-open");
    stageClearTreasureBtn.setAttribute("aria-label", "보물상자 열기");
  }
  if (stageClearRewardAdBtn) {
    stageClearRewardAdBtn.classList.remove("is-preview");
    stageClearRewardAdBtn.setAttribute("aria-disabled", "false");
    stageClearRewardAdBtn.setAttribute("aria-label", "광고 시청 보상 2배");
  }
  if (stageClearRewardMultiplierIndicator) {
    stageClearRewardMultiplierIndicator.classList.remove("is-show");
  }
}

function handleStageClearTreasureOpen() {
  if (!stageClearTreasureBtn || stageClearTreasureBtn.classList.contains("is-open")) return;
  stageClearTreasureReward = createStageClearTreasureReward();
  updateStageClearTreasureRewardText(stageClearTreasureReward);
  grantStageClearTreasureReward(stageClearTreasureReward);
  stageClearTreasureBtn.classList.add("is-open");
  stageClearTreasureBtn.setAttribute("aria-label", "보물상자 열림");
}

function handleStageClearRewardAdPreview() {
  if (!stageClearRewardAdBtn || stageClearTreasureAdClaimed) return;
  if (!stageClearTreasureReward) {
    handleStageClearTreasureOpen();
  }
  if (!stageClearTreasureReward) return;

  stageClearTreasureAdClaimed = true;
  grantStageClearTreasureReward(stageClearTreasureReward);
  updateStageClearTreasureRewardText(stageClearTreasureReward, 2);
  stageClearRewardAdBtn.setAttribute("aria-disabled", "true");
  stageClearRewardAdBtn.setAttribute("aria-label", "광고 보상 수령 완료");
  stageClearRewardAdBtn.classList.remove("is-preview");
  if (stageClearRewardMultiplierIndicator) {
    stageClearRewardMultiplierIndicator.classList.remove("is-show");
    void stageClearRewardMultiplierIndicator.offsetWidth;
    stageClearRewardMultiplierIndicator.classList.add("is-show");
  }
  void stageClearRewardAdBtn.offsetWidth;
  stageClearRewardAdBtn.classList.add("is-preview");
  clearTimeout(handleStageClearRewardAdPreview.timer);
  handleStageClearRewardAdPreview.timer = setTimeout(() => {
    if (stageClearRewardAdBtn) stageClearRewardAdBtn.classList.remove("is-preview");
  }, 720);
}

function showStageClearRewardUi() {
  if (!stageClearRewardOverlay) return;
  closeGameOptionsMenu(false);
  updateStageClearRewardActions();
  resetStageClearRewardEffects();
  stageClearRewardOverlay.classList.remove("is-hidden");
}

function hideStageClearRewardUi() {
  if (!stageClearRewardOverlay) return;
  stageClearRewardOverlay.classList.add("is-hidden");
}

function showStageDefeatUi() {
  if (!stageDefeatOverlay) return;
  closeGameOptionsMenu(false);
  hideStageClearRewardUi();
  stageDefeatOverlay.classList.remove("is-hidden");
}

function hideStageDefeatUi() {
  if (!stageDefeatOverlay) return;
  stageDefeatOverlay.classList.add("is-hidden");
}

function handleStageClearRewardLobby() {
  hideStageClearRewardUi();
  showLobby();
}

function handleStageClearRewardRetry() {
  hideStageClearRewardUi();
  restartGame();
}

function handleStageClearRewardNext() {
  const nextStage = Number(selectedStage) + 1;
  if (!STAGE_CONFIGS[nextStage] || !isStageUnlocked(nextStage)) return;
  hideStageClearRewardUi();
  startGame(nextStage);
}

function handleStageDefeatLobby() {
  hideStageDefeatUi();
  showLobby();
}

function handleStageDefeatRetry() {
  hideStageDefeatUi();
  restartGame();
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
  gameState.message = "";
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

function handleOptionResume() {
  closeGameOptionsMenu(true);
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

  const setJoystickInput = (amount) => {
    heroMoveInput = Math.max(-1, Math.min(1, Number(amount) || 0));
    joystick.classList.toggle("is-left", heroMoveInput < 0);
    joystick.classList.toggle("is-right", heroMoveInput > 0);
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
    setJoystickInput(offset / maxOffset);
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
      <span class="zeus-action-label">${isSkill ? label : "기본공격"}</span>
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
  const heroIsPoseidon = hero && hero.heroId === "poseidon";
  const zeusEffectActive = Boolean(gameState && gameState.zeusSkillEffect && gameState.zeusSkillEffect.active);
  const poseidonEffectActive = Boolean(gameState && gameState.poseidonSkillEffect && gameState.poseidonSkillEffect.active);
  const heroSkillActive = heroIsPoseidon ? poseidonEffectActive : zeusEffectActive;
  const zeusMana = Math.floor(gameState && gameState.zeusMana || 0);
  const zeusSkillDamage = typeof getZeusThunderstormDamage === "function"
    ? getZeusThunderstormDamage(hero)
    : 0;
  renderRoundCommand(
    skillBtn,
    hero && hero.dead ? `부활 ${Math.ceil(hero.respawnTimer)}` : "SPACE",
    hero && hero.dead ? `영웅 부활 ${Math.ceil(hero.respawnTimer)}초` : "영웅 공격",
    "메인 영웅이 가장 가까운 적에게 투사체를 발사합니다."
  );
  renderRoundCommand(
    zeusSkillBtn,
    heroSkillActive ? "CAST" : "READY",
    heroIsPoseidon ? "해일" : "천벌",
    heroIsPoseidon
      ? poseidonEffectActive
        ? "해일 발동 중입니다."
        : `마나 ${zeusMana}/${ZEUS_MANA_COST} · 50마나를 소모해 해일로 적을 밀어냅니다.`
      : zeusEffectActive
      ? "천벌 발동 중입니다."
      : `마나 ${zeusMana}/${ZEUS_MANA_COST} · ${zeusSkillDamage} 피해를 주고 2초간 마비시킵니다.`
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
    const zeusMana = Math.floor(gameState.zeusMana || 0);
    const basicAttackManaReady = zeusMana >= BASIC_ATTACK_MANA_COST;
    if (!skillBtn.classList.contains("zeus-action-btn")) {
      skillBtn.textContent = hero && hero.dead
        ? `영웅 부활 ${Math.ceil(hero.respawnTimer)}초`
        : "영웅 공격 Space";
    }
    skillBtn.disabled = disabled || !heroReady || !basicAttackManaReady;
    skillBtn.title = "메인 영웅이 가장 가까운 적에게 투사체를 발사합니다.";
  }
  if (zeusSkillBtn) {
    const hero = gameState.hero;
    const heroReady = hero && !hero.dead && hero.hp > 0;
    const heroIsPoseidon = hero && hero.heroId === "poseidon";
    const zeusEffectActive = Boolean(gameState.zeusSkillEffect && gameState.zeusSkillEffect.active);
    const poseidonEffectActive = Boolean(gameState.poseidonSkillEffect && gameState.poseidonSkillEffect.active);
    const heroSkillActive = heroIsPoseidon ? poseidonEffectActive : zeusEffectActive;
    const zeusMana = Math.floor(gameState.zeusMana || 0);
    const zeusManaReady = zeusMana >= ZEUS_MANA_COST;
    zeusSkillBtn.disabled = disabled || !heroReady || heroSkillActive || !zeusManaReady;
    zeusSkillBtn.title = heroIsPoseidon
      ? poseidonEffectActive
        ? "해일 발동 중입니다."
        : zeusManaReady
          ? "50마나를 소모해 해일을 사용합니다."
          : `마나 충전 중 ${zeusMana}/${ZEUS_MANA_COST}`
      : zeusEffectActive
      ? "천벌 발동 중입니다."
      : zeusManaReady
        ? "50마나를 소모해 천벌을 사용합니다."
        : `마나 충전 중 ${zeusMana}/${ZEUS_MANA_COST}`;
  }
  if (basicAttackIconBtn) {
    const hero = gameState.hero;
    const heroReady = hero && !hero.dead && hero.hp > 0 && hero.cooldown <= 0;
    const zeusMana = Math.floor(gameState.zeusMana || 0);
    const basicAttackManaReady = zeusMana >= BASIC_ATTACK_MANA_COST;
    basicAttackIconBtn.disabled = disabled || !heroReady || !basicAttackManaReady;
    basicAttackIconBtn.title = heroReady
      ? basicAttackManaReady
        ? `Basic attack · Mana ${BASIC_ATTACK_MANA_COST}`
        : `Mana ${zeusMana}/${BASIC_ATTACK_MANA_COST}`
      : "Basic attack is not ready";
  }
  if (zeusSkillIconBtn) {
    const hero = gameState.hero;
    const heroReady = hero && !hero.dead && hero.hp > 0;
    const heroIsPoseidon = hero && hero.heroId === "poseidon";
    const zeusEffectActive = Boolean(gameState.zeusSkillEffect && gameState.zeusSkillEffect.active);
    const poseidonEffectActive = Boolean(gameState.poseidonSkillEffect && gameState.poseidonSkillEffect.active);
    const heroSkillActive = heroIsPoseidon ? poseidonEffectActive : zeusEffectActive;
    const zeusMana = Math.floor(gameState.zeusMana || 0);
    const zeusManaReady = zeusMana >= ZEUS_MANA_COST;
    zeusSkillIconBtn.disabled = disabled || !heroReady || heroSkillActive || !zeusManaReady;
    zeusSkillIconBtn.title = heroIsPoseidon
      ? poseidonEffectActive
        ? "Poseidon skill is casting"
        : zeusManaReady
          ? "Cast Poseidon skill"
          : `Mana ${zeusMana}/${ZEUS_MANA_COST}`
      : zeusEffectActive
      ? "Zeus skill is casting"
      : zeusManaReady
        ? "Cast Zeus skill"
        : `Mana ${zeusMana}/${ZEUS_MANA_COST}`;
  }
  if (startBtn) {
    startBtn.textContent = gameState.running ? "진행 중" : "게임 시작";
    startBtn.disabled = gameState.running && !gameState.gameOver && !gameState.clear;
  }
  if (stageSelectBtn) stageSelectBtn.disabled = false;
  refreshCommandButtonMarkup();
}

