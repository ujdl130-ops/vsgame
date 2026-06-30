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
    gameState.message = "濡쒕퉬?먯꽌 ?꾪닾瑜?以鍮꾪븯?몄슂";
    updateButtons();
  }
  if (lobbyNotice) {
    lobbyNotice.textContent = "?곸젏?먯꽌 ?λ퉬瑜??뺤씤?섍굅???꾪닾 踰꾪듉?쇰줈 Chapter 1???좏깮?????덉뒿?덈떎.";
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
  hideRecruitDoorScene(true);
  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-shop", "in-recruit", "in-formation");
  if (lobbyNotice) {
    lobbyNotice.textContent = "?곸젏?먯꽌 ?λ퉬瑜??뺤씤?섍굅???꾪닾 踰꾪듉?쇰줈 Chapter 1???좏깮?????덉뒿?덈떎.";
  }
}


function showLobbyMenuNotice(label) {
  if (!lobbyMenuNotice) return;
  const noticeText = `${label} 湲곕뒫? ?ㅼ쓬 ?④퀎?먯꽌 異붽? ?덉젙?낅땲??`;
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
  gameState.message = "寃뚯엫 ?쇱떆?뺤?";
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
  gameState.message = `?뚰솚 ?쒗븳! 蹂묒궗??理쒕? ${MAX_SUMMONED_UNITS}紐낃퉴吏 ?좎??⑸땲??`;
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
      <span class="zeus-action-label">${isSkill ? "?쒖슦???ㅽ궗" : "湲곕낯怨듦꺽"}</span>
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
  const limitTitle = "?꾧뎔 蹂묒궗媛 ?щ쭩?섎㈃ ?ㅼ떆 ?뚰솚?????덉뒿?덈떎.";

  renderCommandSlot(
    summonGuardBtn,
    "50",
    slotText,
    unitLimitReached ? `諛⑺뙣蹂??뚰솚 ?쒗븳 ${activeUnits}/${MAX_SUMMONED_UNITS}` : "諛⑺뙣蹂??뚰솚",
    unitLimitReached ? limitTitle : "諛⑺뙣蹂묒쓣 ?뚰솚?⑸땲??"
  );
  renderCommandSlot(
    summonArcherBtn,
    "75",
    slotText,
    unitLimitReached ? `沅곸닔 ?뚰솚 ?쒗븳 ${activeUnits}/${MAX_SUMMONED_UNITS}` : "沅곸닔 ?뚰솚",
    unitLimitReached ? limitTitle : "沅곸닔瑜??뚰솚?⑸땲??"
  );
  renderCommandSlot(
    summonMageBtn,
    "100",
    slotText,
    unitLimitReached ? `留덈쾿???뚰솚 ?쒗븳 ${activeUnits}/${MAX_SUMMONED_UNITS}` : "留덈쾿???뚰솚",
    unitLimitReached ? limitTitle : "留덈쾿?щ? ?뚰솚?⑸땲??"
  );
  renderCommandSlot(
    summonSaintessBtn,
    "120",
    slotText,
    unitLimitReached ? `?깅? ?뚰솚 ?쒗븳 ${activeUnits}/${MAX_SUMMONED_UNITS}` : "?깅? ?뚰솚",
    unitLimitReached ? limitTitle : "二쇰? ?꾧뎔???뚮났?섎뒗 ?깅?瑜??뚰솚?⑸땲??"
  );
  renderCommandSlot(
    summonThiefBtn,
    "?",
    "준비",
    "?꾩쟻 ?뚰솚",
    "?꾩쟻 ?뚰솚 湲곕뒫? 以鍮?以묒엯?덈떎."
  );

  const hero = gameState && gameState.hero;
  renderRoundCommand(
    skillBtn,
    hero && hero.dead ? `遺??${Math.ceil(hero.respawnTimer)}` : "SPACE",
    hero && hero.dead ? `영웅 부활 ${Math.ceil(hero.respawnTimer)}초` : "영웅 공격",
    "硫붿씤 ?곸썒??媛??媛源뚯슫 ?곸뿉寃??붿궡??諛쒖궗?⑸땲??"
  );
  renderRoundCommand(
    zeusSkillBtn,
    "READY",
    "?쒖슦???ㅽ궗",
    "?쒖슦???ㅽ궗 湲곕뒫? 以鍮?以묒엯?덈떎."
  );
}

function updateButtons() {
  const disabled = !gameState.running || gameState.gameOver || gameState.clear;
  const activeUnits = getActiveUnitCount();
  const unitLimitReached = activeUnits >= MAX_SUMMONED_UNITS;
  const slotText = `${activeUnits}/${MAX_SUMMONED_UNITS}`;

  if (summonGuardBtn) {
    summonGuardBtn.textContent = unitLimitReached ? `諛⑺뙣蹂??뚰솚 ?쒗븳 ${slotText}` : `諛⑺뙣蹂??뚰솚 50G 쨌 ${slotText}`;
    summonGuardBtn.disabled = disabled || unitLimitReached || gameState.gold < 50;
    summonGuardBtn.title = unitLimitReached ? "?꾧뎔 蹂묒궗媛 ?щ쭩?섎㈃ ?ㅼ떆 ?뚰솚?????덉뒿?덈떎." : "諛⑺뙣蹂묒쓣 ?뚰솚?⑸땲??";
  }

  if (summonArcherBtn) {
    summonArcherBtn.textContent = unitLimitReached ? `沅곸닔 ?뚰솚 ?쒗븳 ${slotText}` : `沅곸닔 ?뚰솚 75G 쨌 ${slotText}`;
    summonArcherBtn.disabled = disabled || unitLimitReached || gameState.gold < 75;
    summonArcherBtn.title = unitLimitReached ? "?꾧뎔 蹂묒궗媛 ?щ쭩?섎㈃ ?ㅼ떆 ?뚰솚?????덉뒿?덈떎." : "沅곸닔瑜??뚰솚?⑸땲??";
  }

  if (summonMageBtn) {
    summonMageBtn.textContent = unitLimitReached ? `留덈쾿???뚰솚 ?쒗븳 ${slotText}` : `留덈쾿???뚰솚 100G 쨌 ${slotText}`;
    summonMageBtn.disabled = disabled || unitLimitReached || gameState.gold < 100;
    summonMageBtn.title = unitLimitReached ? "?꾧뎔 蹂묒궗媛 ?щ쭩?섎㈃ ?ㅼ떆 ?뚰솚?????덉뒿?덈떎." : "留덈쾿?щ? ?뚰솚?⑸땲??";
  }

  if (summonSaintessBtn) {
    summonSaintessBtn.textContent = unitLimitReached ? `?깅? ?뚰솚 ?쒗븳 ${slotText}` : `?깅? ?뚰솚 120G 쨌 ${slotText}`;
    summonSaintessBtn.disabled = disabled || unitLimitReached || gameState.gold < 120;
    summonSaintessBtn.title = unitLimitReached ? "?꾧뎔 蹂묒궗媛 ?щ쭩?섎㈃ ?ㅼ떆 ?뚰솚?????덉뒿?덈떎." : "二쇰? ?꾧뎔???뚮났?섎뒗 ?깅?瑜??뚰솚?⑸땲??";
  }

  if (summonThiefBtn) {
    summonThiefBtn.textContent = "?꾩쟻 ?뚰솚";
    summonThiefBtn.disabled = disabled;
    summonThiefBtn.title = "?꾩쟻 ?뚰솚 湲곕뒫? 以鍮?以묒엯?덈떎.";
  }

  if (skillBtn) {
    const hero = gameState.hero;
    const heroReady = hero && !hero.dead && hero.hp > 0 && hero.cooldown <= 0;
    if (!skillBtn.classList.contains("zeus-action-btn")) {
      skillBtn.textContent = hero && hero.dead
        ? `영웅 부활 ${Math.ceil(hero.respawnTimer)}초`
        : "?곸썒 怨듦꺽 Space";
    }
    skillBtn.disabled = disabled || !heroReady;
    skillBtn.title = "硫붿씤 ?곸썒??媛??媛源뚯슫 ?곸뿉寃??붿궡??諛쒖궗?⑸땲??";
  }
  if (zeusSkillBtn) {
    const hero = gameState.hero;
    const heroReady = hero && !hero.dead && hero.hp > 0;
    zeusSkillBtn.disabled = disabled || !heroReady;
    zeusSkillBtn.title = "?쒖슦???ㅽ궗 湲곕뒫? 以鍮?以묒엯?덈떎.";
  }
  if (startBtn) {
    startBtn.textContent = gameState.running ? "진행 중" : "게임 시작";
    startBtn.disabled = gameState.running && !gameState.gameOver && !gameState.clear;
  }
  if (stageSelectBtn) stageSelectBtn.disabled = false;
  refreshCommandButtonMarkup();
}

