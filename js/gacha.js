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
    recruitNotice.textContent = "왕국 기사단에 합류할 영웅을 모집하세요.";
  }
}

function getRecruitThreeStarResult(count) {
  // 1차 연출 프로토타입용 임시 확률입니다.
  // 10회 모집은 테스트가 잘 보이도록 3성 연출 확률을 조금 높였습니다.
  const chance = count >= 10 ? 0.45 : 0.18;
  return Math.random() < chance;
}

function startRecruitDoorAnimation(count) {
  if (!recruitDoorScene) {
    if (recruitNotice) recruitNotice.textContent = `${count}회 모집 기능을 준비 중입니다.`;
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
  if (doorKnockText) doorKnockText.textContent = "쾅!";
  if (recruitNotice) recruitNotice.textContent = `${count}회 모집 연출 진행 중 · 문을 3번 터치하세요.`;
}

function hideRecruitDoorScene(silent = false) {
  if (!recruitDoorScene) return;
  recruitDoorScene.classList.add("is-hidden");
  recruitDoorScene.classList.remove("is-knock", "knock-one", "knock-two", "is-opening", "is-three-star", "is-normal");
  recruitDoorState.active = false;
  recruitDoorState.opened = false;
  recruitDoorState.tapCount = 0;
  if (!silent && recruitNotice) {
    recruitNotice.textContent = "왕국 기사단에 합류할 영웅을 모집하세요.";
  }
}

function playDoorKnockStep() {
  if (!recruitDoorScene) return;

  recruitDoorScene.classList.remove("is-knock");
  void recruitDoorScene.offsetWidth;
  recruitDoorScene.classList.add("is-knock");

  if (doorKnockText) {
    doorKnockText.textContent = recruitDoorState.tapCount === 1 ? "쾅!" : "쾅쾅!";
  }

  if (doorTapGuide) {
    const remain = 3 - recruitDoorState.tapCount;
    doorTapGuide.textContent = remain > 0 ? `문이 흔들립니다 · ${remain}번 더 터치` : "문이 열립니다!";
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
    doorTapGuide.textContent = recruitDoorState.hasThreeStar ? "황금빛이 쏟아집니다!" : "보랏빛이 흘러나옵니다!";
  }

  if (doorResultText) {
    doorResultText.textContent = recruitDoorState.hasThreeStar
      ? "★3 픽업 영웅 등장!"
      : "영웅 모집 완료";
  }

  if (recruitNotice) {
    recruitNotice.textContent = recruitDoorState.hasThreeStar
      ? `${recruitDoorState.pullCount}회 모집 결과 · 3성 영웅 획득!`
      : `${recruitDoorState.pullCount}회 모집 결과 · 다음 기회를 노려보세요.`;
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
