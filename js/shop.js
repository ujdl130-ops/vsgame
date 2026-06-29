// Myth Genesis shop screen interactions.

const SHOP_CATEGORIES = [
  { id: "recommended", label: "⭐ 추천" },
  { id: "package", label: "📦 패키지" },
  { id: "diamond", label: "💎 다이아" },
  { id: "growth", label: "📈 성장" },
  { id: "event", label: "🎁 이벤트" },
];

const SHOP_ITEMS = [
  {
    id: "new_apostle_blessing_recommended",
    name: "신입 사도의 축복",
    category: "recommended",
    badge: "BEST",
    icon: "ticket",
    description: "신 모집권 x10, 다이아 x500, 골드 x100,000, 공통 정수 x100",
    priceLabel: "₩5,900",
    rewards: { gold: 100000, diamonds: 500, summonTickets: 10, commonEssence: 100 },
  },
  {
    id: "descent_support_package",
    name: "강림 지원 패키지",
    category: "recommended",
    badge: "HOT",
    icon: "ticket",
    description: "신 모집권 x20, 다이아 x1,000",
    priceLabel: "₩19,000",
    rewards: { diamonds: 1000, summonTickets: 20 },
  },
  {
    id: "growth_support_package",
    name: "성장 지원 패키지",
    category: "recommended",
    badge: "NEW",
    icon: "essenceAll",
    description: "골드 x500,000, 공통 정수 x300, 다이아 x300",
    priceLabel: "₩15,000",
    rewards: { gold: 500000, diamonds: 300, commonEssence: 300 },
  },
  {
    id: "new_apostle_blessing",
    name: "신입 사도의 축복",
    category: "package",
    icon: "ticket",
    description: "신 모집권 x10, 다이아 x500, 골드 x100,000, 공통 정수 x100",
    priceLabel: "₩5,900",
    rewards: { gold: 100000, diamonds: 500, summonTickets: 10, commonEssence: 100 },
  },
  {
    id: "god_blessing_package",
    name: "신의 축복 패키지",
    category: "package",
    badge: "BEST",
    icon: "ticket",
    description: "신 모집권 x30, 다이아 x2,000, 골드 x300,000, 공통 정수 x200",
    priceLabel: "₩29,000",
    rewards: { gold: 300000, diamonds: 2000, summonTickets: 30, commonEssence: 200 },
  },
  {
    id: "transcendent_offering",
    name: "초월자의 공물",
    category: "package",
    badge: "HOT",
    icon: "ticket",
    description: "신 모집권 x50, 다이아 x5,000",
    priceLabel: "₩55,000",
    rewards: { diamonds: 5000, summonTickets: 50 },
  },
  {
    id: "oracle_supply_box",
    name: "신탁의 보급 상자",
    category: "package",
    icon: "essenceAll",
    description: "골드 x1,000,000, 공통 정수 x700",
    priceLabel: "₩19,000",
    rewards: { gold: 1000000, commonEssence: 700 },
  },
  { id: "diamond_500", name: "다이아 500", category: "diamond", icon: "gem", description: "다이아 x500", priceLabel: "₩5,900", rewards: { diamonds: 500 } },
  { id: "diamond_1200", name: "다이아 1,200", category: "diamond", badge: "BEST", icon: "gem", description: "다이아 x1,200", priceLabel: "₩12,000", rewards: { diamonds: 1200 } },
  { id: "diamond_2500", name: "다이아 2,500", category: "diamond", icon: "gem", description: "다이아 x2,500", priceLabel: "₩25,000", rewards: { diamonds: 2500 } },
  { id: "diamond_6500", name: "다이아 6,500", category: "diamond", badge: "HOT", icon: "gem", description: "다이아 x6,500", priceLabel: "₩59,000", rewards: { diamonds: 6500 } },
  { id: "diamond_14000", name: "다이아 14,000", category: "diamond", badge: "BEST", icon: "gem", description: "다이아 x14,000", priceLabel: "₩119,000", rewards: { diamonds: 14000 } },
  { id: "gold_100000", name: "골드 100,000", category: "growth", icon: "coin", description: "골드 x100,000", priceLabel: "💎100", rewards: { gold: 100000 } },
  { id: "gold_300000", name: "골드 300,000", category: "growth", icon: "coin", description: "골드 x300,000", priceLabel: "💎250", rewards: { gold: 300000 } },
  { id: "gold_1000000", name: "골드 1,000,000", category: "growth", icon: "coin", description: "골드 x1,000,000", priceLabel: "💎700", rewards: { gold: 1000000 } },
  { id: "common_essence_100", name: "공통 정수 100개", category: "growth", icon: "essenceAll", description: "공통 정수 x100", priceLabel: "💎150", rewards: { commonEssence: 100 } },
  { id: "common_essence_300", name: "공통 정수 300개", category: "growth", icon: "essenceAll", description: "공통 정수 x300", priceLabel: "💎400", rewards: { commonEssence: 300 } },
  { id: "common_essence_700", name: "공통 정수 700개", category: "growth", icon: "essenceAll", description: "공통 정수 x700", priceLabel: "💎850", rewards: { commonEssence: 700 } },
  { id: "launch_celebration_package", name: "출시 기념 패키지", category: "event", badge: "NEW", icon: "ticket", description: "신 모집권, 다이아, 공통 정수로 구성된 출시 기념 공물", priceLabel: "준비중", rewards: {} },
  { id: "limited_time_package", name: "기간 한정 패키지", category: "event", badge: "HOT", icon: "essenceAll", description: "기간 한정 성장 재화와 특별 보상", priceLabel: "준비중", rewards: {} },
  { id: "collaboration_package", name: "콜라보 패키지", category: "event", icon: "gem", description: "콜라보 이벤트 전용 특별 공물", priceLabel: "준비중", rewards: {} },
  { id: "special_attendance_package", name: "특별 출석 패키지", category: "event", icon: "ticket", description: "출석 보상과 함께 받는 추가 모집 지원", priceLabel: "준비중", rewards: {} },
];

const SHOP_ICON_IMAGES = {
  coin: "assets/icons/gold.png",
  essenceAll: "assets/icons/essence_all.png",
  gem: "assets/icons/diamonds.png",
  ticket: "assets/icons/ticket.png",
};

let activeShopCategory = "recommended";

function getShopItems(category = null) {
  const items = category ? SHOP_ITEMS.filter((item) => item.category === category) : SHOP_ITEMS;
  return items.map((item) => ({
    ...item,
    rewards: { ...item.rewards, essences: item.rewards.essences ? { ...item.rewards.essences } : undefined },
  }));
}

function purchaseShopItem(itemId) {
  const item = SHOP_ITEMS.find(({ id }) => id === itemId);
  if (!item) return { success: false, reason: "ITEM_NOT_FOUND", item: null };
  // Prototype only: payment approval is intentionally skipped.
  grantPlayerRewards(item.rewards);
  if (item.entitlement) {
    playerProgress.entitlements[item.entitlement] = true;
    saveProgress();
  }
  updateShopWallet();
  return { success: true, item: { ...item }, rewards: { ...item.rewards } };
}

function updateShopWallet() {
  const goldAmount = document.getElementById("shopGoldAmount");
  const diamondAmount = document.getElementById("shopDiamondAmount");
  const ticketAmount = document.getElementById("shopTicketAmount");
  if (goldAmount) goldAmount.textContent = Number(playerProgress.gold || 0).toLocaleString("ko-KR");
  if (diamondAmount) diamondAmount.textContent = Number(playerProgress.diamonds || 0).toLocaleString("ko-KR");
  if (ticketAmount) ticketAmount.textContent = Number(playerProgress.summonTickets || 0).toLocaleString("ko-KR");
}

function renderShopCategories() {
  const categoryList = document.getElementById("shopCategoryList");
  if (!categoryList) return;
  categoryList.replaceChildren(...SHOP_CATEGORIES.map((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `shop-category-btn${category.id === activeShopCategory ? " is-active" : ""}`;
    button.dataset.shopCategory = category.id;
    button.textContent = category.label;
    button.addEventListener("click", () => setShopCategory(category.id));
    return button;
  }));
}

function getShopRewardIcons(item) {
  const rewards = item.rewards || {};
  const rewardIcons = [
    { key: "summonTickets", label: "신 모집권", icon: "ticket" },
    { key: "diamonds", label: "다이아", icon: "gem" },
    { key: "gold", label: "골드", icon: "coin" },
    { key: "commonEssence", label: "공통 정수", icon: "essenceAll" },
  ].filter(({ key }) => Number(rewards[key]) > 0);

  if (!rewardIcons.length) return "";

  return `
    <span class="shop-reward-icons" aria-label="구성품">
      ${rewardIcons.map(({ key, label, icon }) => `
        <span class="shop-reward-chip" title="${label} x${Number(rewards[key]).toLocaleString("ko-KR")}">
          <img src="${SHOP_ICON_IMAGES[icon]}" alt="">
          <span class="shop-reward-name">${label}</span>
          <span class="shop-reward-amount">x${Number(rewards[key]).toLocaleString("ko-KR")}</span>
        </span>
      `).join("")}
    </span>
  `;
}

function renderShopItems(container = null, category = activeShopCategory) {
  const grid = container || document.getElementById("shopItemGrid");
  const items = getShopItems(category);
  if (!grid) return items;

  grid.classList.remove("is-refreshing");
  window.requestAnimationFrame(() => grid.classList.add("is-refreshing"));
  grid.replaceChildren(...items.map((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "shop-card";
    button.dataset.shopItemId = item.id;
    button.innerHTML = `
      ${item.badge ? `<span class="shop-card-badge">${item.badge}</span>` : ""}
      <strong>${item.name}</strong>
      ${getShopRewardIcons(item)}
      <span class="shop-buy-label">${item.priceLabel}</span>
    `;
    button.addEventListener("click", () => {
      if (item.priceLabel === "준비중") {
        showShopItemNotice(`${item.name}은 준비중입니다.`);
        return;
      }
      const result = purchaseShopItem(item.id);
      if (result.success) showShopItemNotice(`${item.name} 구매 완료`);
    });
    return button;
  }));
  return items;
}

function setShopCategory(categoryId) {
  activeShopCategory = SHOP_CATEGORIES.some(({ id }) => id === categoryId) ? categoryId : "recommended";
  const title = document.getElementById("shopCategoryTitle");
  const category = SHOP_CATEGORIES.find(({ id }) => id === activeShopCategory);
  if (title && category) title.textContent = category.label;
  renderShopCategories();
  renderShopItems();
  if (shopNotice) shopNotice.textContent = `${category?.label || "⭐ 추천"} 공물을 확인하세요.`;
}

function openShopScreen() {
  showShop();
}

function showShop() {
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.remove("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);
  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-recruit", "in-formation");
  document.body.classList.add("in-shop");

  if (gameState) {
    gameState.running = false;
    gameState.message = "신전의 공물을 확인하세요";
    updateButtons();
  }

  updateShopWallet();
  renderShopCategories();
  setShopCategory(activeShopCategory);
}

function showShopItemNotice(itemName) {
  if (!shopNotice) return;
  shopNotice.textContent = itemName;
}

function showShopNotice() {
  showShop();
}

window.ShopAPI = {
  categories: SHOP_CATEGORIES,
  items: SHOP_ITEMS,
  getShopItems,
  purchaseShopItem,
  renderShopItems,
  openShopScreen,
};
