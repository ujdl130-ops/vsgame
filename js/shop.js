// Shop screen interactions.

const SHOP_ITEMS = [
  { id: "starter_package", name: "스타터 패키지", category: "package", priceLabel: "₩3,300", rewards: { gold: 10000, diamonds: 500, summonTickets: 10 } },
  { id: "god_growth_package", name: "신 성장 패키지", category: "package", priceLabel: "₩11,000", rewards: { gold: 30000, diamonds: 1000, summonTickets: 10, essences: { lightningEssence: 10, seaEssence: 10, soulEssence: 10, wisdomEssence: 10, warEssence: 10, strengthEssence: 10 } } },
  { id: "soldier_growth_package", name: "병사 성장 패키지", category: "package", priceLabel: "₩5,500", rewards: { gold: 20000, soldierFragments: 100 } },
  { id: "monthly_subscription", name: "월정액", category: "subscription", priceLabel: "₩5,500", rewards: { diamonds: 300 }, entitlement: "monthlySubscription" },
  { id: "season_pass", name: "시즌패스", category: "pass", priceLabel: "₩11,000", rewards: { diamonds: 500, summonTickets: 10, soldierFragments: 50 }, entitlement: "seasonPass" },
  { id: "diamond_500", name: "다이아 500개", category: "diamond", priceLabel: "₩5,500", rewards: { diamonds: 500 } },
];

function getShopItems() {
  return SHOP_ITEMS.map((item) => ({
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
  return { success: true, item: { ...item }, rewards: { ...item.rewards } };
}

function renderShopItems(container = null) {
  const items = getShopItems();
  if (!container) return items;
  container.replaceChildren(...items.map((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "shop-card";
    button.dataset.shopItemId = item.id;
    button.innerHTML = `<strong>${item.name}</strong><span>${item.priceLabel}</span>`;
    button.addEventListener("click", () => purchaseShopItem(item.id));
    return button;
  }));
  return items;
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
    gameState.message = "상점에서 장비를 확인하세요";
    updateButtons();
  }

  if (shopNotice) {
    shopNotice.textContent = "?곸젏 ?덈ぉ???좏깮?섏꽭??";
  }
}

function showShopItemNotice(itemName) {
  if (!shopNotice) return;
  shopNotice.textContent = `${itemName} 선택됨`;
}

function showShopNotice() {
  showShop();
}

window.ShopAPI = {
  items: SHOP_ITEMS,
  getShopItems,
  purchaseShopItem,
  renderShopItems,
  openShopScreen,
};
