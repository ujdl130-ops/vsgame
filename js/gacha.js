// Recruit/gacha screen and door animation.

function showRecruit() {
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.remove("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-shop", "in-formation");
  document.body.classList.add("in-recruit");

  if (gameState) {
    gameState.running = false;
    gameState.message = "모집 화면에서 영웅을 확인하세요";
    updateButtons();
  }

  if (recruitNotice) {
    recruitNotice.textContent = "?뺢뎅 湲곗궗?⑥뿉 ?⑸쪟???곸썒??紐⑥쭛?섏꽭??";
  }
}

function getRecruitThreeStarResult(count) {
  // 1李??곗텧 ?꾨줈?좏??낆슜 ?꾩떆 ?뺣쪧?낅땲??
  // 10??紐⑥쭛? ?뚯뒪?멸? ??蹂댁씠?꾨줉 3???곗텧 ?뺣쪧??議곌툑 ?믪??듬땲??
  const chance = count >= 10 ? 0.45 : 0.18;
  return Math.random() < chance;
}

function startRecruitDoorAnimation(count) {
  if (!recruitDoorScene) {
    if (recruitNotice) recruitNotice.textContent = `${count}??紐⑥쭛 湲곕뒫??以鍮?以묒엯?덈떎.`;
    return;
  }

  recruitDoorState = {
    active: true,
    tapCount: 0,
    pullCount: count,
    hasThreeStar: getRecruitThreeStarResult(count),
    opened: false,
  };

  recruitDoorScene.classList.remove("is-hidden", "is-knock", "knock-one", "knock-two", "is-opening", "is-three-star", "is-normal");
  if (doorTapGuide) doorTapGuide.textContent = "문을 터치하세요";
  if (doorResultText) doorResultText.textContent = "";
  if (doorKnockText) doorKnockText.textContent = "苡?";
  if (recruitNotice) recruitNotice.textContent = `${count}??紐⑥쭛 ?곗텧 吏꾪뻾 以?쨌 臾몄쓣 3踰??곗튂?섏꽭??`;
}

function hideRecruitDoorScene(silent = false) {
  if (!recruitDoorScene) return;
  recruitDoorScene.classList.add("is-hidden");
  recruitDoorScene.classList.remove("is-knock", "knock-one", "knock-two", "is-opening", "is-three-star", "is-normal");
  recruitDoorState.active = false;
  recruitDoorState.opened = false;
  recruitDoorState.tapCount = 0;
  if (!silent && recruitNotice) {
    recruitNotice.textContent = "?뺢뎅 湲곗궗?⑥뿉 ?⑸쪟???곸썒??紐⑥쭛?섏꽭??";
  }
}

function playDoorKnockStep() {
  if (!recruitDoorScene) return;

  recruitDoorScene.classList.remove("is-knock");
  void recruitDoorScene.offsetWidth;
  recruitDoorScene.classList.add("is-knock");

  if (doorKnockText) {
    doorKnockText.textContent = recruitDoorState.tapCount === 1 ? "苡?" : "苡낆푷!";
  }

  if (doorTapGuide) {
    const remain = 3 - recruitDoorState.tapCount;
    doorTapGuide.textContent = remain > 0 ? `臾몄씠 ?붾뱾由쎈땲??쨌 ${remain}踰????곗튂` : "臾몄씠 ?대┰?덈떎!";
  }

  clearTimeout(playDoorKnockStep.timer);
  playDoorKnockStep.timer = setTimeout(() => {
    recruitDoorScene.classList.remove("is-knock");
  }, 420);
}

function openRecruitDoor() {
  if (!recruitDoorScene) return;

  recruitDoorState.opened = true;
  recruitDoorScene.classList.remove("is-knock", "knock-one", "knock-two");
  recruitDoorScene.classList.add("is-opening", recruitDoorState.hasThreeStar ? "is-three-star" : "is-normal");

  if (doorTapGuide) {
    doorTapGuide.textContent = recruitDoorState.hasThreeStar ? "?⑷툑鍮쏆씠 ?잛븘吏묐땲??" : "蹂대옃鍮쏆씠 ?섎윭?섏샃?덈떎!";
  }

  if (doorResultText) {
    doorResultText.textContent = recruitDoorState.hasThreeStar
      ? "?? ?쎌뾽 ?곸썒 ?깆옣!"
      : "?곸썒 紐⑥쭛 ?꾨즺";
  }

  if (recruitNotice) {
    recruitNotice.textContent = recruitDoorState.hasThreeStar
      ? `${recruitDoorState.pullCount}??紐⑥쭛 寃곌낵 쨌 3???곸썒 ?띾뱷!`
      : `${recruitDoorState.pullCount}??紐⑥쭛 寃곌낵 쨌 ?ㅼ쓬 湲고쉶瑜??몃젮蹂댁꽭??`;
  }
}

function handleRecruitDoorTap(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (!recruitDoorScene || recruitDoorScene.classList.contains("is-hidden")) return;

  if (recruitDoorState.opened) {
    return;
  }

  recruitDoorState.tapCount += 1;

  if (recruitDoorState.tapCount === 1) {
    recruitDoorScene.classList.add("knock-one");
    playDoorKnockStep();
    return;
  }

  if (recruitDoorState.tapCount === 2) {
    recruitDoorScene.classList.remove("knock-one");
    recruitDoorScene.classList.add("knock-two");
    playDoorKnockStep();
    return;
  }

  openRecruitDoor();
}

function showRecruitPullNotice(count) {
  startRecruitDoorAnimation(count);
}

function showRecruitNotice() {
  showRecruit();
}
