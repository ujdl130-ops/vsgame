// Stage selection, waves, progress, and battlefield scenery.

const STAGE_CONFIGS = {
  1: {
    title: "초원의 입구",
    maxWave: 3,
    startRunestone: 0,
    enemyBaseHp: 90,
    baseEnemiesToSpawn: 4,
  },
  2: {
    title: "모스 숲 언덕",
    maxWave: 3,
    startRunestone: 0,
    enemyBaseHp: 120,
    baseEnemiesToSpawn: 6,
  },
  3: {
    title: "마왕군 전초기지",
    maxWave: 3,
    startRunestone: 0,
    enemyBaseHp: 150,
    baseEnemiesToSpawn: 8,
  },
};


function getStageConfig(stageNumber) {
  return STAGE_CONFIGS[stageNumber] || STAGE_CONFIGS[1];
}

function isStageUnlocked(stageNumber) {
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
    const cleared = playerProgress.clearedStages.includes(stageNumber);
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

function showStageLockedNotice(stageNumber) {
  if (!stageSelectNotice) return;
  stageSelectNotice.textContent = `Stage ${stageNumber}는 아직 잠겨 있습니다. 먼저 Stage ${stageNumber - 1}을 클리어하세요.`;
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
  hideRecruitDoorScene(true);
  if (chapterPanel) chapterPanel.classList.add("is-hidden");
  if (stagePanel) stagePanel.classList.remove("is-hidden");
  document.body.classList.remove("game-started", "in-lobby", "in-shop", "in-recruit", "in-formation", "in-mission");
  document.body.classList.add("in-stage-select");

  if (gameState) {
    gameState.running = false;
    gameState.message = "스테이지를 선택하세요";
    updateButtons();
  }

  if (stageSelectNotice) {
    stageSelectNotice.textContent = "Stage 1부터 순서대로 클리어하면 다음 스테이지가 열립니다.";
  }
  updateStageUI();
}

function showChapterStages() {
  if (chapterPanel) chapterPanel.classList.add("is-hidden");
  if (stagePanel) stagePanel.classList.remove("is-hidden");
  if (stageSelectNotice) stageSelectNotice.textContent = "Stage 1부터 순서대로 클리어하면 다음 스테이지가 열립니다.";
  updateStageUI();
}

function openStage(stageNumber) {
  if (!isStageUnlocked(stageNumber)) {
    showStageLockedNotice(stageNumber);
    return;
  }
  startGame(stageNumber);
}


function updateWave(dt) {
  if (gameState.waveBreakTimer > 0) {
    gameState.waveBreakTimer -= dt;
    const remain = Math.ceil(gameState.waveBreakTimer);
    gameState.message = `다음 웨이브까지 ${remain}`;
    if (gameState.waveBreakTimer <= 0) {
      gameState.wave += 1;
      gameState.enemySpawnTimer = 0;
      gameState.spawnedInWave = 0;
      gameState.enemiesToSpawn = gameState.baseEnemiesToSpawn + gameState.wave * 3;
      gameState.enemyBaseHp = Math.min(gameState.enemyBaseMaxHp, gameState.enemyBaseHp + 18);
      gameState.message = `Wave ${gameState.wave} 시작!`;
      gameState.messageTimer = 1.1;
    }
    return;
  }

  gameState.enemySpawnTimer -= dt;
  const spawnGap = Math.max(0.82, 1.65 - gameState.wave * 0.22);

  if (gameState.spawnedInWave < gameState.enemiesToSpawn && gameState.enemySpawnTimer <= 0) {
    spawnEnemy();
    gameState.spawnedInWave += 1;
    gameState.enemySpawnTimer = spawnGap;
  }

  const waveFinished = gameState.spawnedInWave >= gameState.enemiesToSpawn && gameState.enemies.length === 0;
  if (waveFinished && gameState.wave < gameState.maxWave) {
    gameState.waveBreakTimer = 3;
    gameState.runestone += 60;
  } else if (waveFinished && gameState.wave >= gameState.maxWave) {
    completeStage(`STAGE ${selectedStage} CLEAR! 모든 웨이브 방어 성공`);
  }
}

function completeStage(message) {
  if (gameState.clear) return;
  gameState.clear = true;
  gameState.running = false;
  gameState.message = `${message} · 스테이지 선택 버튼으로 다음 지역에 도전`;
  unlockStageProgress(selectedStage);
  updateButtons();
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
      drawX: 8,
      drawY: GROUND_Y - 198,
      drawW: 188,
      drawH: 188,
      shadowX: 92,
      shadowY: GROUND_Y + 2,
      shadowW: 58,
      shadowH: 14,
      hpX: 96,
      hpY: GROUND_Y - 148,
      hpW: 98,
    };
  }

  return {
    image: enemyCastleImage,
    ready: enemyCastleReady,
    drawX: canvas.width - 208,
    drawY: GROUND_Y - 208,
    drawW: 198,
    drawH: 198,
    shadowX: canvas.width - 110,
    shadowY: GROUND_Y + 2,
    shadowW: 64,
    shadowH: 15,
    hpX: canvas.width - 109,
    hpY: GROUND_Y - 148,
    hpW: 104,
  };
}

function drawBase(x, isPlayer) {
  const config = getBaseRenderConfig(isPlayer);

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(config.shadowX, config.shadowY, config.shadowW, config.shadowH, 0, 0, Math.PI * 2);
  ctx.fill();

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
