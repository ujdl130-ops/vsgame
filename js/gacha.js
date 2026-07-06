// Recruit/gacha screen and door animation.

const GOD_DESCENT_SSR_RATE = 0.03;
const GOD_DESCENT_GOOD_RATE = 0.27;
const GACHA_ESSENCE_AMOUNT = 10;
const DUPLICATE_GOD_ESSENCE_AMOUNT = 10;
const GACHA_SSR_VIDEO_SRC = "assets/ui/gacha 1.mp4";
const GACHA_NORMAL_VIDEO_SRC = "assets/ui/gacha 2.mp4";
let recruitBgmWasPlayingBeforeSummon = false;

function isGodOwned(heroId) {
  const ownedGod = playerProgress.ownedGods?.[heroId];
  return Boolean(ownedGod && ownedGod.owned === true);
}

function summonGodDescentOnce(random = Math.random) {
  const roll = random();

  if (roll >= GOD_DESCENT_SSR_RATE + GOD_DESCENT_GOOD_RATE) {
    grantPlayerRewards({ soldierFragments: GACHA_ESSENCE_AMOUNT });
    return [{
      rarity: "BASIC", type: "basic", hero: null,
      rewardName: "병사 정수", rewardAmount: GACHA_ESSENCE_AMOUNT,
      iconPath: "assets/icons/essence_soldier.png",
      isDuplicate: false, convertedEssence: null,
    }];
  }

  if (roll >= GOD_DESCENT_SSR_RATE) {
    const essenceHero = GOD_HEROES[Math.floor(random() * GOD_HEROES.length)];
    grantPlayerRewards({ essences: { [essenceHero.essenceKey]: GACHA_ESSENCE_AMOUNT } });
    return [{
      rarity: "GOOD", type: "good", hero: null,
      rewardName: essenceHero.essenceName, rewardAmount: GACHA_ESSENCE_AMOUNT,
      iconPath: getGodEssenceIcon(essenceHero.id),
      isDuplicate: false, convertedEssence: null,
    }];
  }

  const hero = GOD_HEROES[Math.floor(random() * GOD_HEROES.length)];
  const isDuplicate = isGodOwned(hero.id);
  let convertedEssence = null;
  if (isDuplicate) {
    convertedEssence = { key: hero.essenceKey, name: hero.essenceName, amount: DUPLICATE_GOD_ESSENCE_AMOUNT };
    grantPlayerRewards({ essences: { [hero.essenceKey]: DUPLICATE_GOD_ESSENCE_AMOUNT } });
  } else {
    playerProgress.ownedGods[hero.id] = { ...hero, owned: true };
    saveProgress();
  }
  return [{
    rarity: "AWESOME", type: "awesome", hero: { ...hero },
    rewardName: hero.name, rewardAmount: 1, isDuplicate, convertedEssence,
  }];
}

function summonGodDescentTen(random = Math.random) {
  return Array.from({ length: 10 }, () => summonGodDescentOnce(random)[0]);
}

function renderGachaResult(results, container = null) {
  const list = Array.isArray(results) ? results : [];
  if (!container) return list;
  container.replaceChildren(...list.map((result) => {
    const item = document.createElement("div");
    item.className = `gacha-result gacha-result-${result.type}`;
    item.textContent = result.isDuplicate && result.convertedEssence
      ? `${result.rarity} ${result.rewardName} → ${result.convertedEssence.name} ${result.convertedEssence.amount}개`
      : `${result.rarity} ${result.rewardName}${result.type === "awesome" ? "" : ` ${result.rewardAmount}개`}`;
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
  if (missionScreen) missionScreen.classList.add("is-hidden");
  if (inventoryScreen) inventoryScreen.classList.add("is-hidden");
  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-shop", "in-formation", "in-mission", "in-inventory");
  document.body.classList.add("in-recruit");

  if (gameState) {
    gameState.running = false;
    gameState.message = "모집 화면에서 영웅을 확인하세요";
    updateButtons();
  }

  updateRecruitWallet();
  bindRecruitTicketPopup();

  if (recruitNotice) {
    recruitNotice.innerHTML = "<strong>AWESOME 신 3%</strong><span>BASIC: 병사 정수 10개 · GOOD: 무작위 신의 정수 10개</span>";
  }
}

function getRecruitBalance(key) {
  return Math.max(0, Number(window.ShopAPI?.getSessionBalance?.(key)) || 0);
}

function updateRecruitWallet() {
  const godEssenceTotal = Object.values(playerProgress?.essences || {})
    .reduce((total, amount) => total + Math.max(0, Number(amount) || 0), 0);
  const walletValues = {
    recruitGoldAmount: getRecruitBalance("gold"),
    recruitDiamondAmount: getRecruitBalance("diamonds"),
    recruitTicketAmount: getRecruitBalance("summonTickets"),
    recruitEssenceAmount: godEssenceTotal,
    recruitSoldierEssenceAmount: Math.max(0, Number(playerProgress?.soldierFragments) || 0),
  };

  Object.entries(walletValues).forEach(([elementId, value]) => {
    const amount = document.getElementById(elementId);
    if (amount) amount.textContent = value.toLocaleString("ko-KR");
  });

  updateRecruitPullCosts();
}

function updateRecruitPullCosts() {
  [
    { button: document.getElementById("recruitPullOneBtn"), count: 1, diamonds: 100 },
    { button: document.getElementById("recruitPullTenBtn"), count: 10, diamonds: 1000 },
  ].forEach(({ button, count, diamonds }) => {
    const cost = button?.querySelector(".recruit-pull-cost");
    if (!cost) return;
    const useTicket = getRecruitBalance("summonTickets") >= count;
    cost.innerHTML = `
      <img src="assets/icons/${useTicket ? "ticket" : "diamond"}.png" alt="">
      <strong>${(useTicket ? count : diamonds).toLocaleString("ko-KR")}</strong>
    `;
    cost.classList.toggle("uses-ticket", useTicket);
    cost.classList.toggle("uses-diamond", !useTicket);
  });
}

function openRecruitTicketPopup() {
  const popup = document.getElementById("recruitTicketPopup");
  if (popup) popup.classList.remove("is-hidden");
}

function closeRecruitTicketPopup() {
  const popup = document.getElementById("recruitTicketPopup");
  if (popup) popup.classList.add("is-hidden");
}

function bindRecruitTicketPopup() {
  const popup = document.getElementById("recruitTicketPopup");
  const closeBtn = document.getElementById("recruitTicketPopupCloseBtn");
  const shopBtn = document.getElementById("recruitTicketPopupShopBtn");
  if (!popup || popup.dataset.bound === "true") return;

  popup.dataset.bound = "true";
  closeBtn?.addEventListener("click", closeRecruitTicketPopup);
  shopBtn?.addEventListener("click", () => {
    closeRecruitTicketPopup();
    showShop();
  });
  popup.addEventListener("click", (event) => {
    if (event.target === popup) closeRecruitTicketPopup();
  });
}

function requestRecruitPull(count) {
  const pullCount = count === 10 ? 10 : 1;
  const diamondCost = pullCount === 10 ? 1000 : 100;
  const useTicket = getRecruitBalance("summonTickets") >= pullCount;
  const currencyKey = useTicket ? "summonTickets" : "diamonds";
  const cost = useTicket ? pullCount : diamondCost;

  if (getRecruitBalance(currencyKey) < cost) {
    openRecruitTicketPopup();
    return false;
  }

  const spent = window.ShopAPI?.spendSessionCurrency?.(currencyKey, cost);
  if (!spent) {
    openRecruitTicketPopup();
    return false;
  }

  updateRecruitWallet();
  const results = pullCount === 10 ? summonGodDescentTen() : summonGodDescentOnce();
  updateRecruitWallet();
  renderGachaResult(results);
  startRecruitDoorAnimation(pullCount, results);
  return true;
}

function getRecruitThreeStarResult(count) {
  const chance = count >= 10 ? 0.45 : 0.18;
  return Math.random() < chance;
}

const recruitAnimationTimers = [];

function scheduleRecruitAnimation(callback, delay) {
  const timer = setTimeout(callback, delay);
  recruitAnimationTimers.push(timer);
}

function clearRecruitAnimationTimers() {
  recruitAnimationTimers.splice(0).forEach(clearTimeout);
}

function ensureRecruitAnimationUI() {
  if (!recruitDoorScene) return;

  if (!recruitDoorScene.querySelector(".gacha-summon-video")) {
    const summonVideo = document.createElement("video");
    summonVideo.className = "gacha-summon-video";
    summonVideo.muted = false;
    summonVideo.volume = 1;
    summonVideo.playsInline = true;
    summonVideo.preload = "auto";
    summonVideo.setAttribute("aria-hidden", "true");
    summonVideo.setAttribute("tabindex", "-1");
    recruitDoorScene.prepend(summonVideo);
  }

  if (recruitDoorScene.querySelector(".gacha-result-layer")) return;

  const particles = document.createElement("div");
  particles.className = "summon-particles";
  particles.setAttribute("aria-hidden", "true");
  for (let index = 0; index < 32; index += 1) {
    const particle = document.createElement("i");
    particle.style.setProperty("--particle-index", index);
    particle.style.setProperty("--particle-x", `${8 + ((index * 29) % 84)}%`);
    particle.style.setProperty("--particle-delay", `${(index % 8) * 0.08}s`);
    particles.appendChild(particle);
  }

  const flash = document.createElement("div");
  flash.className = "summon-white-flash";
  flash.setAttribute("aria-hidden", "true");

  const heavenStrike = document.createElement("div");
  heavenStrike.className = "summon-heaven-strike";
  heavenStrike.setAttribute("aria-hidden", "true");
  heavenStrike.innerHTML = `
    <div class="summon-divine-floor">
      <i class="divine-floor-halo"></i>
      <i class="divine-floor-runes"></i>
      <i class="divine-floor-rays"></i>
      <i class="divine-altar-step step-back"></i>
      <i class="divine-altar-step step-middle"></i>
      <i class="divine-altar-step step-front"></i>
      <i class="divine-altar-core"></i>
    </div>
    <i class="summon-heaven-beam"></i>
    <i class="summon-impact-core"></i>
    <i class="summon-impact-ring ring-one"></i>
    <i class="summon-impact-ring ring-two"></i>
  `;

  const resultLayer = document.createElement("section");
  resultLayer.className = "gacha-result-layer";
  resultLayer.setAttribute("aria-label", "강림 결과");
  resultLayer.innerHTML = `
    <h2>강림 결과</h2>
    <div class="gacha-result-grid"></div>
    <button class="gacha-result-confirm" type="button">확인</button>
  `;
  resultLayer.querySelector(".gacha-result-confirm").addEventListener("click", () => {
    hideRecruitDoorScene();
    showRecruit();
  });

  recruitDoorScene.append(particles, heavenStrike, flash, resultLayer);
}

function getRecruitSummonVideo() {
  return recruitDoorScene ? recruitDoorScene.querySelector(".gacha-summon-video") : null;
}

function resetRecruitSummonVideo() {
  const summonVideo = getRecruitSummonVideo();
  if (!summonVideo) return;

  summonVideo.pause();
  summonVideo.onended = null;
  summonVideo.onerror = null;
  summonVideo.removeAttribute("src");
  summonVideo.load();
}

function pauseRecruitBgmForSummon() {
  if (typeof recruitBgm === "undefined") return;

  recruitBgmWasPlayingBeforeSummon = !recruitBgm.paused;
  if (recruitBgmWasPlayingBeforeSummon) recruitBgm.pause();
}

function resumeRecruitBgmAfterSummon() {
  if (typeof recruitBgm === "undefined" || !recruitBgmWasPlayingBeforeSummon) return;
  if (!document.body.classList.contains("in-recruit")) return;

  recruitBgm.play().catch(() => {});
  recruitBgmWasPlayingBeforeSummon = false;
}

function showRecruitAnimationResults() {
  if (!recruitDoorScene || recruitDoorScene.classList.contains("is-hidden")) return;
  recruitDoorScene.classList.add("is-results-visible");
  resumeRecruitBgmAfterSummon();
}

function playRecruitSummonVideo(hasSsr) {
  const summonVideo = getRecruitSummonVideo();
  if (!summonVideo) {
    scheduleRecruitAnimation(showRecruitAnimationResults, 2200);
    return;
  }

  const videoSrc = hasSsr ? GACHA_SSR_VIDEO_SRC : GACHA_NORMAL_VIDEO_SRC;
  summonVideo.pause();
  summonVideo.muted = false;
  summonVideo.volume = 1;
  summonVideo.onended = showRecruitAnimationResults;
  summonVideo.onerror = () => scheduleRecruitAnimation(showRecruitAnimationResults, 600);
  summonVideo.src = videoSrc;
  summonVideo.load();
  try {
    summonVideo.currentTime = 0;
  } catch (error) {
    // Some browsers only allow seeking after metadata is loaded.
  }

  const playPromise = summonVideo.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      resumeRecruitBgmAfterSummon();
      scheduleRecruitAnimation(showRecruitAnimationResults, 600);
    });
  }
}

function getGodEssenceIcon(heroId) {
  const iconNames = {
    zeus: "zeus",
    poseidon: "poseidon",
    hades: "hades",
    athena: "athena",
    ares: "ares",
    heracles: "hercules",
  };
  return iconNames[heroId] ? `assets/icons/essence_${iconNames[heroId]}.png` : "";
}

function getGodImage(heroId) {
  const imageNames = { athena: "atena" };
  return `assets/gods/${imageNames[heroId] || heroId}.png`;
}

function renderRecruitResultCards(results) {
  const grid = recruitDoorScene?.querySelector(".gacha-result-grid");
  if (!grid) return;
  const list = Array.isArray(results) ? results : [];
  grid.classList.toggle("is-ten-pull", list.length === 10);
  grid.replaceChildren(...list.map((result, index) => {
    const card = document.createElement("article");
    card.className = `gacha-reveal-card is-${result.type}`;
    card.style.setProperty("--card-index", index);

    const icon = document.createElement("div");
    icon.className = "gacha-card-icon";
    const iconPath = result.iconPath || (result.hero ? getGodImage(result.hero.id) : "");
    if (iconPath) {
      const image = document.createElement("img");
      image.src = iconPath;
      image.alt = "";
      icon.appendChild(image);
    } else {
      icon.textContent = "✦";
    }

    const name = document.createElement("span");
    name.className = "gacha-card-name";
    name.textContent = result.rewardName;

    card.append(icon, name);
    const detail = document.createElement("small");
    detail.textContent = result.isDuplicate && result.convertedEssence
      ? `중복 변환: ${result.convertedEssence.name} ${result.convertedEssence.amount}개`
      : result.type === "awesome" ? "신 획득" : `${result.rewardAmount}개 획득`;
    card.appendChild(detail);
    return card;
  }));
}

function startRecruitDoorAnimation(count, results = null) {
  if (!recruitDoorScene) {
    return;
  }

  clearRecruitAnimationTimers();
  ensureRecruitAnimationUI();
  const summonResults = Array.isArray(results) ? results : [];
  recruitDoorState = {
    active: true,
    tapCount: 0,
    pullCount: count,
    results: summonResults,
    hasThreeStar: summonResults.length
      ? summonResults.some((result) => result.type === "awesome")
      : getRecruitThreeStarResult(count),
    opened: false,
  };

  recruitDoorScene.className = `recruit-door-scene is-summoning is-video-summon ${recruitDoorState.hasThreeStar ? "is-three-star" : "is-normal"}`;
  if (recruitDoorCloseBtn) recruitDoorCloseBtn.textContent = "닫기";
  if (doorTapGuide) doorTapGuide.textContent = "올림포스에 신성한 빛이 내립니다...";
  if (doorResultText) doorResultText.textContent = "";
  if (doorKnockText) doorKnockText.textContent = "";
  renderRecruitResultCards(summonResults);
  pauseRecruitBgmForSummon();
  playRecruitSummonVideo(recruitDoorState.hasThreeStar);
}

function hideRecruitDoorScene(silent = false) {
  if (!recruitDoorScene) return;
  clearRecruitAnimationTimers();
  resetRecruitSummonVideo();
  resumeRecruitBgmAfterSummon();
  recruitDoorScene.classList.add("is-hidden");
  recruitDoorScene.classList.remove(
    "is-summoning", "is-door-visible", "is-auto-shake", "is-charging",
    "is-light-leak", "is-screen-shake", "is-opening", "is-flashing",
    "is-heaven-strike", "is-impact-spread", "is-results-visible",
    "is-three-star", "is-normal", "is-video-summon"
  );
  recruitDoorState.active = false;
  recruitDoorState.opened = false;
  recruitDoorState.tapCount = 0;
  if (!silent && recruitNotice) {
    recruitNotice.innerHTML = "<strong>AWESOME 신 3%</strong><span>BASIC: 병사 정수 10개 · GOOD: 무작위 신의 정수 10개</span>";
  }
}

function playDoorKnockStep() {
  // The enhanced summon sequence advances automatically.
}

function openRecruitDoor() {
  if (!recruitDoorScene || recruitDoorState.opened) return;

  recruitDoorState.opened = true;
  recruitDoorScene.classList.add("is-opening");
}

function handleRecruitDoorTap(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // No interaction is required; the sequence is intentionally automatic.
}

function showRecruitPullNotice(count) {
  startRecruitDoorAnimation(count);
}

function showRecruitNotice() {
  showRecruit();
}

window.GachaAPI = {
  SSR_RATE: GOD_DESCENT_SSR_RATE,
  GOOD_RATE: GOD_DESCENT_GOOD_RATE,
  DUPLICATE_ESSENCE_AMOUNT: DUPLICATE_GOD_ESSENCE_AMOUNT,
  summonGodDescentOnce,
  summonGodDescentTen,
  renderGachaResult,
  openGachaScreen,
  requestRecruitPull,
  updateRecruitWallet,
};
