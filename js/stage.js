// Stage selection, waves, progress, and battlefield scenery.

const STAGE_CONFIGS = {
  1: {
    title: "초원의 입구",
    maxWave: 3,
    startRunestone: 0,
    playerBaseHp: 100,
    enemyBaseHp: 90,
    baseEnemiesToSpawn: 4,
  },
  2: {
    title: "모스 숲 언덕",
    maxWave: 3,
    startRunestone: 0,
    playerBaseHp: 100,
    enemyBaseHp: 120,
    baseEnemiesToSpawn: 6,
  },
  3: {
    title: "마왕군 전초기지",
    maxWave: 3,
    startRunestone: 0,
    playerBaseHp: 875,
    enemyBaseHp: 230,
    baseEnemiesToSpawn: 10,
  },
};

const STAGE_CLEAR_REWARDS = {
  1: { gold: 10000 },
  2: { gold: 15000 },
  3: { gold: 30000 },
};

function getStageConfig(stageNumber) {
  return STAGE_CONFIGS[stageNumber] || STAGE_CONFIGS[1];
}

function isStageUnlocked(stageNumber) {
  if (window.QAAPI?.isEnabled?.()) return true;
  return stageNumber <= playerProgress.unlockedStage;
}

function unlockStageProgress(stageNumber) {
  if (!playerProgress.clearedStages.includes(stageNumber)) {
    playerProgress.clearedStages.push(stageNumber);
  }
  if (stageNumber < 3) {
    playerProgress.unlockedStage = Math.max(playerProgress.unlockedStage, stageNumber + 1);
  }
  saveProgress();
  updateStageUI();
}

function updateStageUI() {
  stageCards.forEach((card) => {
    const stageNumber = Number(card.dataset.stage);
    const unlocked = isStageUnlocked(stageNumber);
    const cleared = window.QAAPI?.isEnabled?.() || playerProgress.clearedStages.includes(stageNumber);
    const status = card.querySelector(".stage-status");
    const lockIcon = card.querySelector(".lock-icon");

    card.classList.toggle("is-locked", !unlocked);
    card.classList.toggle("is-clear", cleared);
    card.setAttribute("aria-disabled", unlocked ? "false" : "true");

    if (status) {
      if (cleared) status.textContent = "완료";
      else if (unlocked) status.textContent = "도전";
      else status.textContent = "잠김";
    }

    if (lockIcon) {
      if (cleared) lockIcon.textContent = "✓";
      else if (unlocked) lockIcon.textContent = "▶";
      else lockIcon.textContent = "🔒";
    }
  });
}

const STAGE_DETAIL_CONFIGS = {
  1: {
    image: "assets/ui/stage1 info UI.png",
    alt: "Stage 1 detail info",
    missionIds: ["clear", "guard5", "noChampionDeath"],
  },
  2: {
    image: "assets/ui/stgae 2 ui info.png",
    alt: "Stage 2 detail info",
    missionIds: ["clear", "archer3", "noChampionDeath"],
  },
  3: {
    image: "assets/ui/stage3 info UI.png",
    alt: "Stage 3 detail info",
    missionIds: ["clear", "bossDefeat", "noChampionDeath"],
  },
};

function getStageDetailConfig(stageNumber) {
  return STAGE_DETAIL_CONFIGS[Number(stageNumber)] || null;
}

function getStageMissionProgress(stageNumber) {
  const allProgress = playerProgress.stageMissionStars && typeof playerProgress.stageMissionStars === "object"
    ? playerProgress.stageMissionStars
    : {};
  const progress = allProgress[String(stageNumber)] || allProgress[stageNumber] || {};
  const normalizedProgress = progress && typeof progress === "object" ? { ...progress } : {};
  if (getStageDetailConfig(stageNumber) && Array.isArray(playerProgress.clearedStages) && playerProgress.clearedStages.includes(Number(stageNumber))) {
    normalizedProgress.clear = true;
  }
  return normalizedProgress;
}

function updateStageDetailStars() {
  if (!stageDetailPanel) return;

  const stageNumber = Number(stageDetailPanel.dataset.stage) || 1;
  const detailConfig = getStageDetailConfig(stageNumber);
  const missionIds = detailConfig ? detailConfig.missionIds : [];
  const progress = getStageMissionProgress(stageNumber);
  stageDetailPanel.querySelectorAll(".stage-detail-star").forEach((star, index) => {
    const missionId = missionIds[index] || "";
    star.dataset.missionId = missionId;
    const completed = Boolean(missionId && progress[missionId]);
    star.classList.toggle("is-earned", completed);
    star.dataset.completed = completed ? "true" : "false";
  });
}

function recordStageMissionGuardSummon() {
  if (!gameState || Number(gameState.stage) !== 1 || !gameState.stageMissionRun) return;
  gameState.stageMissionRun.guardSummons = Math.max(0, Number(gameState.stageMissionRun.guardSummons) || 0) + 1;
}

function recordStageMissionArcherSummon() {
  if (!gameState || Number(gameState.stage) !== 2 || !gameState.stageMissionRun) return;
  gameState.stageMissionRun.archerSummons = Math.max(0, Number(gameState.stageMissionRun.archerSummons) || 0) + 1;
}

function recordStageMissionChampionDeath() {
  if (!gameState || !getStageDetailConfig(gameState.stage) || !gameState.stageMissionRun) return;
  gameState.stageMissionRun.championDied = true;
}

function recordStageMissionBossDefeat() {
  if (!gameState || Number(gameState.stage) !== 3 || !gameState.stageMissionRun) return;
  gameState.stageMissionRun.bossDefeated = true;
}

function completeStageMissions(stageNumber) {
  const detailConfig = getStageDetailConfig(stageNumber);
  if (!detailConfig) return;

  if (!playerProgress.stageMissionStars || typeof playerProgress.stageMissionStars !== "object") {
    playerProgress.stageMissionStars = {};
  }

  const progress = {
    ...getStageMissionProgress(stageNumber),
    clear: true,
  };
  const run = gameState && gameState.stageMissionRun ? gameState.stageMissionRun : {};

  if (detailConfig.missionIds.includes("guard5") && (Number(run.guardSummons) || 0) >= 5) {
    progress.guard5 = true;
  }
  if (detailConfig.missionIds.includes("archer3") && (Number(run.archerSummons) || 0) >= 3) {
    progress.archer3 = true;
  }
  if (detailConfig.missionIds.includes("bossDefeat") && run.bossDefeated) {
    progress.bossDefeat = true;
  }
  if (detailConfig.missionIds.includes("noChampionDeath") && !run.championDied) {
    progress.noChampionDeath = true;
  }

  playerProgress.stageMissionStars[String(stageNumber)] = progress;
  updateStageDetailStars();
}

function isStageDetailVisible() {
  return Boolean(stageDetailPanel && !stageDetailPanel.classList.contains("is-hidden"));
}

function setStageDetailSelectedCard(stageNumber) {
  stageCards.forEach((card) => {
    card.classList.toggle("is-detail-selected", Number(card.dataset.stage) === Number(stageNumber));
  });
}

function hideStageDetailPanel() {
  if (stageDetailPanel) {
    stageDetailPanel.classList.add("is-hidden");
    stageDetailPanel.removeAttribute("data-stage");
  }
  if (stageScreen) stageScreen.classList.remove("is-stage-detail-open");
  setStageDetailSelectedCard(0);
}

function showStageDetailPanel(stageNumber) {
  const detailConfig = getStageDetailConfig(stageNumber);
  if (!stageDetailPanel || !detailConfig) return false;

  const detailImage = stageDetailPanel.querySelector(".stage-detail-bg");
  if (detailImage) {
    detailImage.src = detailConfig.image;
    detailImage.alt = detailConfig.alt;
  }
  stageDetailPanel.setAttribute("aria-label", detailConfig.alt);

  stageDetailPanel.dataset.stage = String(stageNumber);
  stageDetailPanel.classList.remove("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-stage-detail-open");
  if (stageSelectNotice) stageSelectNotice.classList.remove("is-show");
  setStageDetailSelectedCard(stageNumber);
  updateStageDetailStars();

  requestAnimationFrame(() => {
    if (stageDetailStartBtn && isStageDetailVisible()) stageDetailStartBtn.focus({ preventScroll: true });
  });

  return true;
}

function proceedStageDetailPanel() {
  const stageNumber = Number(stageDetailPanel?.dataset.stage) || 1;
  hideStageDetailPanel();

  if (typeof showPreBattleFormation === "function") {
    showPreBattleFormation(stageNumber);
    return;
  }

  startGame(stageNumber);
}

function openStage(stageNumber) {
  if (!isStageUnlocked(stageNumber)) {
    showStageLockedNotice(stageNumber);
    return;
  }
  if (showStageDetailPanel(stageNumber)) {
    return;
  }
  if (typeof showPreBattleFormation === "function") {
    showPreBattleFormation(stageNumber);
    return;
  }
  startGame(stageNumber);
}

function setStageScreenMode(mode) {
  if (!stageScreen) return;
  const isStageMap = mode === "stage";
  stageScreen.classList.toggle("is-chapter-view", !isStageMap);
  stageScreen.classList.toggle("is-stage-view", isStageMap);
}

function isChapterStageMapVisible() {
  return Boolean(stagePanel && !stagePanel.classList.contains("is-hidden"));
}

function hidePrebattleFormationScreen() {
  const root = document.getElementById("prebattleFormationScreen");
  if (root) root.classList.add("is-hidden");
  document.body.classList.remove("in-prebattle-formation");
}

function handleStageBack() {
  if (isStageDetailVisible()) {
    hideStageDetailPanel();
    return;
  }
  if (isChapterStageMapVisible()) {
    showStageSelect();
    return;
  }
  showLobby();
}

function showStageLockedNotice(stageNumber) {
  if (!stageSelectNotice) return;
  stageSelectNotice.textContent = `Stage ${stageNumber}는 아직 잠겨 있습니다. 먼저 Stage ${stageNumber - 1}을 클리어하세요.`;
  stageSelectNotice.classList.add("is-show");
  clearTimeout(showStageLockedNotice.timer);
  showStageLockedNotice.timer = setTimeout(() => {
    if (stageSelectNotice) stageSelectNotice.classList.remove("is-show");
  }, 1700);
}

function showStageSelect() {
  closeGameOptionsMenu(false);
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.remove("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  if (missionScreen) missionScreen.classList.add("is-hidden");
  if (inventoryScreen) inventoryScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);
  hidePrebattleFormationScreen();
  if (chapterPanel) chapterPanel.classList.remove("is-hidden");
  if (stagePanel) stagePanel.classList.add("is-hidden");
  hideStageDetailPanel();
  if (stageBackBtn) stageBackBtn.setAttribute("aria-label", "Back to lobby");
  if (stageSelectNotice) stageSelectNotice.classList.remove("is-show");
  setStageScreenMode("chapter");

  document.body.classList.remove("game-started", "in-lobby", "in-shop", "in-recruit", "in-formation", "in-mission", "in-inventory");
  document.body.classList.add("in-stage-select");

  if (gameState) {
    gameState.running = false;
    gameState.message = "챕터를 선택하세요.";
    updateButtons();
  }

  updateStageUI();
}

function showChapterStages() {
  if (chapterPanel) chapterPanel.classList.add("is-hidden");
  if (stagePanel) stagePanel.classList.remove("is-hidden");
  hideStageDetailPanel();
  if (stageBackBtn) stageBackBtn.setAttribute("aria-label", "Back to chapter select");
  if (stageSelectNotice) stageSelectNotice.classList.remove("is-show");
  setStageScreenMode("stage");
  updateStageUI();
}


function updateWave(dt) {
  if (gameState.waveBreakTimer > 0) {
    gameState.waveBreakTimer -= dt;
    const remain = Math.ceil(gameState.waveBreakTimer);
    gameState.message = `다음 적 증원까지 ${remain}`;
    if (gameState.waveBreakTimer <= 0) {
      gameState.wave = Math.min(gameState.wave + 1, gameState.maxWave);
      gameState.enemySpawnTimer = 0;
      gameState.spawnedInWave = 0;
      gameState.enemiesToSpawn = gameState.baseEnemiesToSpawn + gameState.wave * 3;
      gameState.message = "적 증원이 몰려옵니다!";
      gameState.messageTimer = 1.1;
    }
    return;
  }

  gameState.enemySpawnTimer -= dt;
  const spawnGap = Number(gameState.stage) === 3
    ? Math.max(0.68, 1.16 - gameState.wave * 0.13)
    : Math.max(0.82, 1.65 - gameState.wave * 0.22);

  if (gameState.spawnedInWave < gameState.enemiesToSpawn && gameState.enemySpawnTimer <= 0) {
    spawnEnemy();
    gameState.spawnedInWave += 1;
    gameState.enemySpawnTimer = spawnGap;
  }

  const waveFinished = gameState.spawnedInWave >= gameState.enemiesToSpawn && gameState.enemies.length === 0;
  if (waveFinished) {
    gameState.waveBreakTimer = 3;
    addRunestone(60);
    if (gameState.wave >= gameState.maxWave && !gameState.gateObjectiveAnnounced) {
      gameState.gateObjectiveAnnounced = true;
      gameState.message = "상대 게이트를 파괴해야 클리어됩니다!";
      gameState.messageTimer = 1.4;
    }
  }
}

function completeStage(message) {
  if (gameState.clear) return;
  const alreadyCleared = playerProgress.clearedStages.includes(selectedStage);
  gameState.clear = true;
  gameState.running = false;
  gameState.message = `${message} · 스테이지 선택 버튼으로 다음 지역에 도전`;
  completeStageMissions(selectedStage);
  unlockStageProgress(selectedStage);
  const usesStageClearRewardUi = typeof showStageClearRewardUi === "function";
  if (!alreadyCleared && !usesStageClearRewardUi) {
    grantPlayerRewards(STAGE_CLEAR_REWARDS[selectedStage] || {});
  }
  updateButtons();
  if (usesStageClearRewardUi) showStageClearRewardUi();
}


function drawBackground() {
  if (gameState && stageBackgroundReady) {
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(stageBackgroundImage, 0, 0, canvas.width, canvas.height);

    // 전투 라인을 살짝 보정해서 캐릭터가 배경에 묻히지 않도록 처리합니다.
    const laneGradient = ctx.createLinearGradient(0, GROUND_Y - 120, 0, canvas.height);
    laneGradient.addColorStop(0, "rgba(255, 255, 255, 0.00)");
    laneGradient.addColorStop(0.42, "rgba(255, 244, 179, 0.10)");
    laneGradient.addColorStop(0.72, "rgba(45, 90, 35, 0.12)");
    laneGradient.addColorStop(1, "rgba(0, 0, 0, 0.18)");
    ctx.fillStyle = laneGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    return;
  }

  drawFallbackBackground();
}

function drawFallbackBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#82b5f5");
  sky.addColorStop(0.58, "#d5f4ff");
  sky.addColorStop(0.59, "#81b75c");
  sky.addColorStop(1, "#4a7d3a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  drawCloud(170, 90, 42);
  drawCloud(520, 62, 36);
  drawCloud(760, 120, 48);

  ctx.fillStyle = "#548f46";
  for (let x = -20; x < canvas.width + 30; x += 70) {
    ctx.beginPath();
    ctx.moveTo(x, 355);
    ctx.lineTo(x + 42, 275 + Math.sin(x * 0.03) * 18);
    ctx.lineTo(x + 92, 355);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = "#5b3b26";
  ctx.fillRect(0, GROUND_Y, canvas.width, 12);
  ctx.fillStyle = "#3d291c";
  ctx.fillRect(0, GROUND_Y + 12, canvas.width, 80);

  for (let x = 0; x < canvas.width; x += 48) {
    ctx.fillStyle = x % 96 === 0 ? "#6f4a2f" : "#553722";
    ctx.fillRect(x, GROUND_Y + 14, 36, 10);
  }
}

function drawCloud(x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
  ctx.arc(x + size * 0.45, y - size * 0.25, size * 0.45, 0, Math.PI * 2);
  ctx.arc(x + size * 0.9, y, size * 0.55, 0, Math.PI * 2);
  ctx.arc(x + size * 0.35, y + size * 0.18, size * 0.48, 0, Math.PI * 2);
  ctx.fill();
}

function getBaseRenderConfig(isPlayer) {
  if (isPlayer) {
    return {
      image: playerCastleImage,
      ready: playerCastleReady,
      drawX: -8,
      drawY: GROUND_Y - 285,
      drawW: 285,
      drawH: 285,
      hpX: 120,
      hpY: GROUND_Y + 8,
      hpW: 146,
    };
  }

  return {
    image: enemyCastleImage,
    ready: enemyCastleReady,
    drawX: canvas.width - 290,
    drawY: GROUND_Y - 285,
    drawW: 285,
    drawH: 285,
    hpX: canvas.width - 141,
    hpY: GROUND_Y + 8,
    hpW: 148,
  };
}

function drawBase(x, isPlayer) {
  const config = getBaseRenderConfig(isPlayer);

  ctx.save();
  if (config.ready) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(config.image, config.drawX, config.drawY, config.drawW, config.drawH);
    ctx.restore();
    return;
  }

  ctx.translate(x, GROUND_Y);
  ctx.fillStyle = isPlayer ? "#f6d77a" : "#60405d";
  ctx.fillRect(-32, -82, 64, 82);
  ctx.fillStyle = isPlayer ? "#a56d2c" : "#2b1830";
  ctx.fillRect(-42, -28, 84, 28);
  ctx.fillStyle = isPlayer ? "#fff0b2" : "#b881ff";
  ctx.fillRect(-20, -105, 40, 26);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(-18, -54, 36, 54);
  ctx.restore();
}

function drawHealthBar(x, y, w, hp, maxHp, color) {
  const ratio = Math.max(0, hp / maxHp);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(x - w / 2, y, w, 7);
  ctx.fillStyle = color;
  ctx.fillRect(x - w / 2, y, w * ratio, 7);
  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.strokeRect(x - w / 2, y, w, 7);
}
