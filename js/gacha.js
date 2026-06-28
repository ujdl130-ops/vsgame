// Recruit/gacha screen and door animation.

const GOD_DESCENT_SSR_RATE = 0.03;
const DUPLICATE_GOD_ESSENCE_AMOUNT = 10;

function summonGodDescentOnce(random = Math.random) {
  if (random() >= GOD_DESCENT_SSR_RATE) {
    return [{ rarity: "R", type: "normal", hero: null, isDuplicate: false, convertedEssence: null }];
  }
  const hero = GOD_HEROES[Math.floor(random() * GOD_HEROES.length)];
  const isDuplicate = Boolean(playerProgress.ownedGods[hero.id]);
  let convertedEssence = null;
  if (isDuplicate) {
    convertedEssence = { key: hero.essenceKey, name: hero.essenceName, amount: DUPLICATE_GOD_ESSENCE_AMOUNT };
    grantPlayerRewards({ essences: { [hero.essenceKey]: DUPLICATE_GOD_ESSENCE_AMOUNT } });
  } else {
    playerProgress.ownedGods[hero.id] = { ...hero };
    saveProgress();
  }
  return [{ rarity: "SSR", type: "god", hero: { ...hero }, isDuplicate, convertedEssence }];
}

function summonGodDescentTen(random = Math.random) {
  return Array.from({ length: 10 }, () => summonGodDescentOnce(random)[0]);
}

function renderGachaResult(results, container = null) {
  const list = Array.isArray(results) ? results : [];
  if (!container) return list;
  container.replaceChildren(...list.map((result) => {
    const item = document.createElement("div");
    item.className = `gacha-result gacha-result-${result.rarity.toLowerCase()}`;
    item.textContent = result.hero
      ? `${result.rarity} ${result.hero.name}${result.isDuplicate ? ` → ${result.convertedEssence.name} ${result.convertedEssence.amount}개` : ""}`
      : result.rarity;
    return item;
  }));
  return list;
}

function openGachaScreen() {
  showRecruit();
}

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

  const goldAmount = document.getElementById("recruitGoldAmount");
  const diamondAmount = document.getElementById("recruitDiamondAmount");
  if (goldAmount) goldAmount.textContent = Number(playerProgress.gold || 0).toLocaleString("ko-KR");
  if (diamondAmount) diamondAmount.textContent = Number(playerProgress.diamonds || 0).toLocaleString("ko-KR");

  if (recruitNotice) {
    recruitNotice.innerHTML = "<strong>SSR 확률 3%</strong><span>중복 신 획득 시 해당 신의 정수로 변환됩니다.</span>";
  }
}

function getRecruitThreeStarResult(count) {
  // 1李??곗텧 ?꾨줈?좏??낆슜 ?꾩떆 ?뺣쪧?낅땲??
  // 10??紐⑥쭛? ?뚯뒪?멸? ??蹂댁씠?꾨줉 3???곗텧 ?뺣쪧??議곌툑 ?믪??듬땲??
  const chance = count >= 10 ? 0.45 : 0.18;
  return Math.random() < chance;
}

function startRecruitDoorAnimation(count, results = null) {
  if (!recruitDoorScene) {
    if (recruitNotice) recruitNotice.textContent = `${count}??紐⑥쭛 湲곕뒫??以鍮?以묒엯?덈떎.`;
    return;
  }

  recruitDoorState = {
    active: true,
    tapCount: 0,
    pullCount: count,
    hasThreeStar: Array.isArray(results)
      ? results.some((result) => result.rarity === "SSR")
      : getRecruitThreeStarResult(count),
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
    recruitNotice.innerHTML = "<strong>SSR 확률 3%</strong><span>중복 신 획득 시 해당 신의 정수로 변환됩니다.</span>";
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

window.GachaAPI = {
  SSR_RATE: GOD_DESCENT_SSR_RATE,
  DUPLICATE_ESSENCE_AMOUNT: DUPLICATE_GOD_ESSENCE_AMOUNT,
  summonGodDescentOnce,
  summonGodDescentTen,
  renderGachaResult,
  openGachaScreen,
};
