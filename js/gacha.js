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
  if (missionScreen) missionScreen.classList.add("is-hidden");
  if (inventoryScreen) inventoryScreen.classList.add("is-hidden");
  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-shop", "in-formation", "in-mission", "in-inventory");
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
  if (!recruitDoorScene || recruitDoorScene.querySelector(".gacha-result-layer")) return;

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

function renderRecruitResultCards(results) {
  const grid = recruitDoorScene?.querySelector(".gacha-result-grid");
  if (!grid) return;
  const list = Array.isArray(results) ? results : [];
  grid.classList.toggle("is-ten-pull", list.length === 10);
  grid.replaceChildren(...list.map((result, index) => {
    const card = document.createElement("article");
    card.className = `gacha-reveal-card is-${result.rarity.toLowerCase()}`;
    card.style.setProperty("--card-index", index);

    const rarity = document.createElement("strong");
    rarity.className = "gacha-card-rarity";
    rarity.textContent = result.rarity;

    const icon = document.createElement("div");
    icon.className = "gacha-card-icon";
    const iconPath = result.hero ? getGodEssenceIcon(result.hero.id) : "";
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
    name.textContent = result.hero ? result.hero.name : "강림의 흔적";

    card.append(rarity, icon, name);
    if (result.isDuplicate && result.convertedEssence) {
      const conversion = document.createElement("small");
      conversion.textContent = `${result.convertedEssence.name} ${result.convertedEssence.amount}개`;
      card.appendChild(conversion);
    }
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
      ? summonResults.some((result) => result.rarity === "SSR")
      : getRecruitThreeStarResult(count),
    opened: false,
  };

  recruitDoorScene.className = `recruit-door-scene is-summoning ${recruitDoorState.hasThreeStar ? "is-three-star" : "is-normal"}`;
  if (recruitDoorCloseBtn) recruitDoorCloseBtn.textContent = "닫기";
  if (doorTapGuide) doorTapGuide.textContent = "올림포스에 신성한 빛이 내립니다...";
  if (doorResultText) doorResultText.textContent = "";
  if (doorKnockText) doorKnockText.textContent = "";
  renderRecruitResultCards(summonResults);

  scheduleRecruitAnimation(() => recruitDoorScene.classList.add("is-door-visible", "is-auto-shake"), 120);
  scheduleRecruitAnimation(() => recruitDoorScene.classList.remove("is-auto-shake"), 620);
  scheduleRecruitAnimation(() => recruitDoorScene.classList.add("is-charging"), 500);
  scheduleRecruitAnimation(() => recruitDoorScene.classList.add("is-light-leak", "is-screen-shake"), 1050);
  scheduleRecruitAnimation(() => recruitDoorScene.classList.add("is-heaven-strike"), 1280);
  scheduleRecruitAnimation(() => {
    recruitDoorScene.classList.add("is-impact-spread");
    openRecruitDoor();
  }, 1720);
  scheduleRecruitAnimation(() => recruitDoorScene.classList.add("is-flashing"), 2000);
  scheduleRecruitAnimation(() => {
    recruitDoorScene.classList.add("is-results-visible");
  }, 2250);
  scheduleRecruitAnimation(() => {
    recruitDoorScene.classList.remove("is-flashing", "is-screen-shake");
  }, 2500);
}

function hideRecruitDoorScene(silent = false) {
  if (!recruitDoorScene) return;
  clearRecruitAnimationTimers();
  recruitDoorScene.classList.add("is-hidden");
  recruitDoorScene.classList.remove(
    "is-summoning", "is-door-visible", "is-auto-shake", "is-charging",
    "is-light-leak", "is-screen-shake", "is-opening", "is-flashing",
    "is-heaven-strike", "is-impact-spread", "is-results-visible",
    "is-three-star", "is-normal"
  );
  recruitDoorState.active = false;
  recruitDoorState.opened = false;
  recruitDoorState.tapCount = 0;
  if (!silent && recruitNotice) {
    recruitNotice.innerHTML = "<strong>SSR 확률 3%</strong><span>중복 신 획득 시 해당 신의 정수로 변환됩니다.</span>";
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
  DUPLICATE_ESSENCE_AMOUNT: DUPLICATE_GOD_ESSENCE_AMOUNT,
  summonGodDescentOnce,
  summonGodDescentTen,
  renderGachaResult,
  openGachaScreen,
};
