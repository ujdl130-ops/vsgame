// Myth Genesis shop screen interactions.

const SHOP_CATEGORIES = [
  { id: "recommended", label: "추천" },
  { id: "package", label: "패키지" },
  { id: "diamond", label: "보석" },
  { id: "gold", label: "골드" },
  { id: "growth", label: "성장" },
  { id: "subscription", label: "월정액" },
  { id: "event", label: "이벤트" },
];

const SHOP_ITEMS = [
  {
    id: "god_blessing_package",
    name: "신의 축복 패키지",
    category: "recommended",
    badge: "BEST",
    icon: "blessing",
    description: "SSR 소환권 x10, 보석 x3000, 골드 x500000",
    priceLabel: "₩29,000",
    rewards: { gold: 500000, diamonds: 3000, summonTickets: 10 },
  },
  {
    id: "growth_support_package",
    name: "성장의 지원 패키지",
    category: "recommended",
    badge: "HOT",
    icon: "growth",
    description: "경험치 물약 x50, 강화석 x200, 골드 x300000",
    priceLabel: "₩15,000",
    rewards: { gold: 300000, soldierFragments: 200 },
  },
  {
    id: "transcendent_choice_package",
    name: "초월자의 선택 패키지",
    category: "recommended",
    badge: "NEW",
    icon: "choice",
    description: "SSR 소환권 x5, 보석 x2000, 선택 장비 상자 x1",
    priceLabel: "₩19,000",
    rewards: { diamonds: 2000, summonTickets: 5, soldierFragments: 80 },
  },
  {
    id: "olympus_starter_package",
    name: "올림포스 입문 패키지",
    category: "package",
    badge: "NEW",
    icon: "altar",
    description: "보석 x1200, 소환권 x5, 골드 x150000",
    priceLabel: "₩9,900",
    rewards: { gold: 150000, diamonds: 1200, summonTickets: 5 },
  },
  {
    id: "divine_armory_package",
    name: "신성 무기고 패키지",
    category: "package",
    badge: "HOT",
    icon: "armory",
    description: "강화석 x300, 병사 조각 x120, 골드 x250000",
    priceLabel: "₩22,000",
    rewards: { gold: 250000, soldierFragments: 120 },
  },
  {
    id: "god_growth_package",
    name: "신 성장 패키지",
    category: "package",
    icon: "essence",
    description: "신의 정수 6종 x10, 보석 x1000, 소환권 x10",
    priceLabel: "₩11,000",
    rewards: {
      diamonds: 1000,
      summonTickets: 10,
      essences: { lightningEssence: 10, seaEssence: 10, soulEssence: 10, wisdomEssence: 10, warEssence: 10, strengthEssence: 10 },
    },
  },
  { id: "diamond_500", name: "보석 500개", category: "diamond", icon: "gem", description: "신성한 보석 x500", priceLabel: "₩5,900", rewards: { diamonds: 500 } },
  { id: "diamond_1200", name: "보석 1200개", category: "diamond", badge: "BEST", icon: "gem", description: "신성한 보석 x1200", priceLabel: "₩12,000", rewards: { diamonds: 1200 } },
  { id: "diamond_3000", name: "보석 3000개", category: "diamond", badge: "HOT", icon: "gem", description: "신성한 보석 x3000", priceLabel: "₩29,000", rewards: { diamonds: 3000 } },
  { id: "gold_100000", name: "골드 100,000", category: "gold", icon: "coin", description: "왕국 금고 골드 x100000", priceLabel: "보석 100개", rewards: { gold: 100000 } },
  { id: "gold_500000", name: "골드 500,000", category: "gold", badge: "BEST", icon: "coin", description: "왕국 금고 골드 x500000", priceLabel: "보석 450개", rewards: { gold: 500000 } },
  { id: "gold_1000000", name: "골드 1,000,000", category: "gold", badge: "HOT", icon: "coin", description: "왕국 금고 골드 x1000000", priceLabel: "보석 800개", rewards: { gold: 1000000 } },
  { id: "exp_potion_bundle", name: "경험치 물약 묶음", category: "growth", icon: "potion", description: "경험치 물약 x50, 골드 x50000", priceLabel: "보석 180개", rewards: { gold: 50000, soldierFragments: 30 } },
  { id: "enhance_stone_bundle", name: "강화석 묶음", category: "growth", icon: "stone", description: "강화석 x200, 골드 x80000", priceLabel: "보석 250개", rewards: { gold: 80000, soldierFragments: 60 } },
  { id: "gear_enhance_package", name: "장비 강화 패키지", category: "growth", badge: "NEW", icon: "hammer", description: "강화석 x350, 선택 장비 상자 x1", priceLabel: "₩9,900", rewards: { soldierFragments: 100 } },
  {
    id: "olympus_blessing_monthly",
    name: "올림포스의 가호",
    category: "subscription",
    badge: "BEST",
    icon: "moon",
    description: "구매 즉시 보석 x300, 30일 동안 매일 보석 지급",
    priceLabel: "₩5,500",
    rewards: { diamonds: 300 },
    entitlement: "monthlySubscription",
  },
  { id: "limited_divine_package", name: "기간 한정 패키지", category: "event", badge: "HOT", icon: "event", description: "보석 x1500, 소환권 x8, 골드 x300000", priceLabel: "₩17,000", rewards: { gold: 300000, diamonds: 1500, summonTickets: 8 } },
  { id: "first_purchase_bonus", name: "첫 구매 보너스 패키지", category: "event", badge: "NEW", icon: "gift", description: "첫 공물 보너스: 보석 x1000, 골드 x200000", priceLabel: "₩3,300", rewards: { gold: 200000, diamonds: 1000 } },
];

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

function getShopItemIcon(item) {
  return `<span class="shop-item-icon ${item.icon ? `shop-icon-${item.icon}` : ""}" aria-hidden="true"></span>`;
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
      ${getShopItemIcon(item)}
      <small>${item.description}</small>
      <span class="shop-buy-label">${item.priceLabel}</span>
    `;
    button.addEventListener("click", () => {
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
  if (shopNotice) shopNotice.textContent = `${category?.label || "추천"} 공물을 확인하세요.`;
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
