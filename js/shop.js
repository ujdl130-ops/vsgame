// Shop screen interactions.
// 상점 UI 뼈대: 카테고리별 상품 카드 5개와 구매 확인 팝업을 생성합니다.

const SHOP_CATEGORY_LIST = [
  {
    id: "recommend",
    label: "추천",
    fallbackIcon: "👍",
    useEmoji: true,
    iconPaths: [
      "assets/maps/store/category/icon_recommend.png",
      "assets/maps/shop/category/icon_recommend.png",
      "assets/maps/store/icon_recommend.png",
      "assets/maps/shop/icon_recommend.png",
    ],
  },
  {
    id: "package",
    label: "패키지",
    fallbackIcon: "🎒",
    useEmoji: true,
    iconPaths: [
      "assets/maps/store/category/icon_recommend.png",
      "assets/maps/shop/category/icon_recommend.png",
    ],
  },
  {
    id: "diamond",
    label: "다이아",
    fallbackIcon: "💎",
    useEmoji: true,
    iconPaths: [
      "assets/maps/store/category/icon_money.png",
      "assets/maps/shop/category/icon_money.png",
      "assets/maps/store/icon_money.png",
      "assets/maps/shop/icon_money.png",
    ],
  },
  {
    id: "growth",
    label: "성장",
    fallbackIcon: "💪",
    useEmoji: true,
    iconPaths: [
      "assets/maps/store/category/icon_fragment.png",
      "assets/maps/shop/category/icon_fragment.png",
      "assets/maps/store/category/icon_money.png",
      "assets/maps/shop/category/icon_money.png",
    ],
  },
  {
    id: "monthly",
    label: "월정액",
    fallbackIcon: "📅",
    useEmoji: true,
    iconPaths: [
      "assets/maps/store/category/icon_item.png",
      "assets/maps/shop/category/icon_item.png",
      "assets/maps/store/icon_normal.png",
      "assets/maps/shop/icon_normal.png",
    ],
  },
];

const SHOP_ITEM_COUNT = 5;
const SHOP_CATEGORY_ITEMS = {
  recommend: [
    {
      id: "recommend-free",
      name: "오늘의 무료 보상",
      image: "assets/icons/free.png",
      price: "무료",
      dailyLimit: "1일 1회",
      contents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×50" },
        { icon: "assets/icons/gold.png", label: "골드", amount: "×10,000" },
      ],
    },
    {
      id: "recommend-fate",
      purchaseRuleId: "package-fate",
      name: "운명의 시작",
      image: "assets/icons/package_1.png",
      price: "₩5,900",
      badge: "BEST",
      contents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×500" },
        { icon: "assets/icons/ticket.png", label: "모집권", amount: "×3" },
        { icon: "assets/icons/essence_all.png", label: "공통 신의 정수", amount: "×3" },
        { icon: "assets/icons/gold.png", label: "골드", amount: "×30,000" },
      ],
    },
    {
      id: "recommend-gods-contract",
      purchaseRuleId: "monthly-gods-contract",
      name: "신들의 계약",
      image: "assets/icons/monthly_1.png",
      price: "₩9,900",
      badge: "HOT",
      duration: "30일",
      immediateContents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×500" },
      ],
      dailyContents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×50" },
        { icon: "assets/icons/essence_all.png", label: "공통 신의 정수", amount: "×1" },
      ],
    },
    {
      id: "recommend-legacy",
      purchaseRuleId: "package-legacy",
      name: "올림포스의 유산",
      image: "assets/icons/package_5.png",
      price: "₩49,900",
      badge: "NEW",
      contents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×5,000" },
        { icon: "assets/icons/ticket.png", label: "모집권", amount: "×50" },
        { icon: "assets/icons/essence_all.png", label: "공통 신의 정수", amount: "×50" },
        { icon: "assets/icons/gold.png", label: "골드", amount: "×1,000,000" },
      ],
      firstPurchaseBonus: {
        icon: "assets/icons/diamond.png",
        label: "첫 구매 보너스",
        amount: "+500💎",
      },
    },
  ],
  package: [
    {
      id: "package-fate",
      name: "운명의 시작",
      image: "assets/icons/package_1.png",
      price: "₩5,900",
      contents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×500" },
        { icon: "assets/icons/ticket.png", label: "모집권", amount: "×3" },
        { icon: "assets/icons/essence_all.png", label: "공통 신의 정수", amount: "×3" },
        { icon: "assets/icons/gold.png", label: "골드", amount: "×30,000" },
      ],
    },
    {
      id: "package-calling",
      name: "신의 부름",
      image: "assets/icons/package_2.png",
      price: "₩9,900",
      contents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×1,000" },
        { icon: "assets/icons/ticket.png", label: "모집권", amount: "×5" },
        { icon: "assets/icons/essence_all.png", label: "공통 신의 정수", amount: "×5" },
        { icon: "assets/icons/gold.png", label: "골드", amount: "×80,000" },
      ],
    },
    {
      id: "package-blessing",
      name: "신들의 가호",
      image: "assets/icons/package_3.png",
      price: "₩14,900",
      contents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×1,500" },
        { icon: "assets/icons/ticket.png", label: "모집권", amount: "×10" },
        { icon: "assets/icons/essence_all.png", label: "공통 신의 정수", amount: "×10" },
        { icon: "assets/icons/gold.png", label: "골드", amount: "×200,000" },
      ],
    },
    {
      id: "package-offering",
      name: "신성한 공물",
      image: "assets/icons/package_4.png",
      price: "₩29,900",
      contents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×3,000" },
        { icon: "assets/icons/ticket.png", label: "모집권", amount: "×30" },
        { icon: "assets/icons/essence_all.png", label: "공통 신의 정수", amount: "×30" },
        { icon: "assets/icons/gold.png", label: "골드", amount: "×500,000" },
      ],
    },
    {
      id: "package-legacy",
      name: "올림포스의 유산",
      image: "assets/icons/package_5.png",
      price: "₩49,900",
      contents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×5,000" },
        { icon: "assets/icons/ticket.png", label: "모집권", amount: "×50" },
        { icon: "assets/icons/essence_all.png", label: "공통 신의 정수", amount: "×50" },
        { icon: "assets/icons/gold.png", label: "골드", amount: "×1,000,000" },
      ],
      firstPurchaseBonus: {
        icon: "assets/icons/diamond.png",
        label: "첫 구매 보너스",
        amount: "+500💎",
      },
    },
  ],
  diamond: [
    {
      id: "diamond-pouch",
      name: "다이아 꾸러미",
      image: "assets/icons/package_dia1.png",
      price: "₩4,900",
      contents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×500" },
      ],
    },
    {
      id: "diamond-box",
      name: "다이아 상자",
      image: "assets/icons/package_dia2.png",
      price: "₩9,900",
      contents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×1,000" },
        { icon: "assets/icons/diamond.png", label: "보너스 다이아", amount: "+100", bonus: true },
      ],
    },
    {
      id: "diamond-vault",
      name: "다이아 금고",
      image: "assets/icons/package_dia3.png",
      price: "₩19,900",
      contents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×2,000" },
        { icon: "assets/icons/diamond.png", label: "보너스 다이아", amount: "+300", bonus: true },
      ],
    },
    {
      id: "diamond-sacred-vault",
      name: "신성한 다이아 금고",
      image: "assets/icons/package_dia4.png",
      price: "₩49,900",
      contents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×5,000" },
        { icon: "assets/icons/diamond.png", label: "보너스 다이아", amount: "+1,000", bonus: true },
      ],
    },
  ],
  growth: [
    {
      id: "growth-essence-free",
      name: "공통 신의 정수",
      amount: "×1",
      image: "assets/icons/essence_all.png",
      price: "무료",
      dailyLimit: "1일 1회",
    },
    {
      id: "growth-essence-3",
      name: "공통 신의 정수",
      amount: "×3",
      image: "assets/icons/essence_all.png",
      price: "200",
      priceIcon: "assets/icons/diamond.png",
      dailyLimit: "1일 1회",
    },
    {
      id: "growth-essence-5",
      name: "공통 신의 정수",
      amount: "×5",
      image: "assets/icons/essence_all.png",
      price: "300",
      priceIcon: "assets/icons/diamond.png",
      dailyLimit: "1일 1회",
    },
    {
      id: "growth-essence-10",
      name: "공통 신의 정수",
      amount: "×10",
      image: "assets/icons/essence_all.png",
      price: "500",
      priceIcon: "assets/icons/diamond.png",
      dailyLimit: "1일 1회",
    },
    {
      id: "growth-soldier-1",
      name: "병사 정수",
      amount: "×1",
      image: "assets/icons/essence_soldier.png",
      price: "20,000",
      priceIcon: "assets/icons/gold.png",
      dailyLimit: "1일 1회",
    },
    {
      id: "growth-soldier-10",
      name: "병사 정수",
      amount: "×10",
      image: "assets/icons/essence_soldier.png",
      price: "200,000",
      priceIcon: "assets/icons/gold.png",
      dailyLimit: "1일 1회",
    },
    {
      id: "growth-soldier-30",
      name: "병사 정수",
      amount: "×30",
      image: "assets/icons/essence_soldier.png",
      price: "600,000",
      priceIcon: "assets/icons/gold.png",
      dailyLimit: "1일 1회",
    },
    {
      id: "growth-soldier-50",
      name: "병사 정수",
      amount: "×50",
      image: "assets/icons/essence_soldier.png",
      price: "1,000,000",
      priceIcon: "assets/icons/gold.png",
      dailyLimit: "1일 1회",
    },
    {
      id: "growth-gold-20000",
      name: "골드",
      amount: "×20,000",
      image: "assets/icons/gold.png",
      price: "100",
      priceIcon: "assets/icons/diamond.png",
      dailyLimit: "1일 1회",
    },
    {
      id: "growth-gold-60000",
      name: "골드",
      amount: "×60,000",
      image: "assets/icons/gold.png",
      price: "300",
      priceIcon: "assets/icons/diamond.png",
      dailyLimit: "1일 1회",
    },
    {
      id: "growth-gold-100000",
      name: "골드",
      amount: "×100,000",
      image: "assets/icons/gold.png",
      price: "500",
      priceIcon: "assets/icons/diamond.png",
      dailyLimit: "1일 1회",
    },
    {
      id: "growth-gold-200000",
      name: "골드",
      amount: "×200,000",
      image: "assets/icons/gold.png",
      price: "1,000",
      priceIcon: "assets/icons/diamond.png",
      dailyLimit: "1일 1회",
    },
  ],
  monthly: [
    {
      id: "monthly-gods-contract",
      name: "신들의 계약",
      image: "assets/icons/monthly_1.png",
      price: "₩9,900",
      duration: "30일",
      immediateContents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×500" },
      ],
      dailyContents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×50" },
        { icon: "assets/icons/essence_all.png", label: "공통 신의 정수", amount: "×1" },
      ],
    },
    {
      id: "monthly-olympus-contract",
      name: "올림포스의 계약",
      image: "assets/icons/monthly_2.png",
      price: "₩29,900",
      duration: "30일",
      immediateContents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×3,000" },
      ],
      dailyContents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×100" },
        { icon: "assets/icons/essence_all.png", label: "공통 신의 정수", amount: "×3" },
        { icon: "assets/icons/gold.png", label: "골드", amount: "×10,000" },
      ],
    },
  ],
};

const SHOP_PURCHASE_RULES = {
  "recommend-free": { rewards: { gold: 10000, diamonds: 50 }, daily: true },
  "package-fate": { rewards: { gold: 30000, diamonds: 500, summonTickets: 3, commonEssence: 3 } },
  "package-calling": { rewards: { gold: 80000, diamonds: 1000, summonTickets: 5, commonEssence: 5 } },
  "package-blessing": { rewards: { gold: 200000, diamonds: 1500, summonTickets: 10, commonEssence: 10 } },
  "package-offering": { rewards: { gold: 500000, diamonds: 3000, summonTickets: 30, commonEssence: 30 } },
  "package-legacy": {
    rewards: { gold: 1000000, diamonds: 5000, summonTickets: 50, commonEssence: 50 },
    firstPurchaseBonus: { diamonds: 500 },
    firstPurchaseEntitlement: "packageLegacyFirstPurchaseBonus",
  },
  "monthly-gods-contract": { rewards: { diamonds: 500 } },
  "monthly-olympus-contract": { rewards: { diamonds: 3000 } },
  "diamond-pouch": { rewards: { diamonds: 500 } },
  "diamond-box": { rewards: { diamonds: 1100 } },
  "diamond-vault": { rewards: { diamonds: 2300 } },
  "diamond-sacred-vault": { rewards: { diamonds: 6000 } },
  "growth-gold-20000": { cost: { diamonds: 100 }, rewards: { gold: 20000 }, daily: true },
  "growth-gold-60000": { cost: { diamonds: 300 }, rewards: { gold: 60000 }, daily: true },
  "growth-gold-100000": { cost: { diamonds: 500 }, rewards: { gold: 100000 }, daily: true },
  "growth-gold-200000": { cost: { diamonds: 1000 }, rewards: { gold: 200000 }, daily: true },
  "growth-essence-free": { rewards: { commonEssence: 1 }, daily: true },
  "growth-essence-3": { cost: { diamonds: 200 }, rewards: { commonEssence: 3 }, daily: true },
  "growth-essence-5": { cost: { diamonds: 300 }, rewards: { commonEssence: 5 }, daily: true },
  "growth-essence-10": { cost: { diamonds: 500 }, rewards: { commonEssence: 10 }, daily: true },
  "growth-soldier-1": { cost: { gold: 20000 }, rewards: { soldierFragments: 1 }, daily: true },
  "growth-soldier-10": { cost: { gold: 200000 }, rewards: { soldierFragments: 10 }, daily: true },
  "growth-soldier-30": { cost: { gold: 600000 }, rewards: { soldierFragments: 30 }, daily: true },
  "growth-soldier-50": { cost: { gold: 1000000 }, rewards: { soldierFragments: 50 }, daily: true },
};

let selectedShopCategory = "recommend";
let selectedShopItemName = "";
let selectedShopItem = null;
let shopSessionBalances = null;
const shopSessionDailyPurchases = {};
const shopSessionFirstPurchaseBonuses = {};

const SHOP_ASSET_PATHS = {
  categoryNormal: [
    "assets/maps/store/category/bg_nomal.png",
    "assets/maps/store/category/bg_normal.png",
    "assets/maps/shop/category/bg_nomal.png",
    "assets/maps/shop/category/bg_normal.png",
    "assets/maps/store/bg_nomal.png",
    "assets/maps/store/bg_normal.png",
    "assets/maps/shop/bg_nomal.png",
    "assets/maps/shop/bg_normal.png",
  ],
  categorySelected: [
    "assets/maps/store/category/bg_selected.png",
    "assets/maps/shop/category/bg_selected.png",
    "assets/maps/store/bg_selected.png",
    "assets/maps/shop/bg_selected.png",
  ],
  itemCard: [
    "assets/maps/store/card/item_card.png",
    "assets/maps/shop/card/item_card.png",
    "assets/maps/store/category/item_card.png",
    "assets/maps/shop/category/item_card.png",
    "assets/maps/store/item_card.png",
    "assets/maps/shop/item_card.png",
  ],
  growthCard: [
    "assets/maps/shop/category/growshop_card.png",
    "assets/maps/shop/growshop_card.png",
  ],
};

const shopAssetCache = new Map();

function resolveShopAsset(paths, callback) {
  const key = paths.join("|");

  if (shopAssetCache.has(key)) {
    callback(shopAssetCache.get(key));
    return;
  }

  let index = 0;

  const tryNext = () => {
    if (index >= paths.length) {
      shopAssetCache.set(key, "");
      callback("");
      return;
    }

    const src = paths[index];
    const image = new Image();

    image.onload = () => {
      shopAssetCache.set(key, src);
      callback(src);
    };

    image.onerror = () => {
      index += 1;
      tryNext();
    };

    image.src = src;
  };

  tryNext();
}

function setShopBackground(element, paths) {
  if (!element) return;

  resolveShopAsset(paths, (src) => {
    if (!src) return;
    element.style.setProperty("--shop-bg-image", `url('${src}')`);
  });
}

function setShopIcon(iconElement, category) {
  if (!iconElement || !category) return;

  iconElement.textContent = category.fallbackIcon || "";
  if (category.useEmoji) {
    iconElement.classList.add("is-emoji");
    return;
  }

  resolveShopAsset(category.iconPaths || [], (src) => {
    if (!src) return;
    iconElement.textContent = "";
    iconElement.style.setProperty("--shop-icon-image", `url('${src}')`);
    iconElement.classList.add("has-image");
  });
}

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
  if (missionScreen) missionScreen.classList.add("is-hidden");
  if (inventoryScreen) inventoryScreen.classList.add("is-hidden");

  hideRecruitDoorScene(true);

  document.body.classList.remove(
    "game-started",
    "in-lobby",
    "in-stage-select",
    "in-recruit",
    "in-formation",
    "in-mission",
    "in-inventory"
  );
  document.body.classList.add("in-shop");

  if (gameState) {
    gameState.running = false;
    gameState.message = "상점에서 아이템을 확인하세요";
    updateButtons();
  }

  resetShopSessionState();
  updateShopWallet();
  renderShopUI();
  bindShopPurchasePopup();

  if (shopNotice) {
    shopNotice.textContent = "상점 품목을 선택하세요.";
  }
}

function resetShopSessionState() {
  shopSessionBalances = null;
  Object.keys(shopSessionDailyPurchases).forEach((key) => {
    delete shopSessionDailyPurchases[key];
  });
  Object.keys(shopSessionFirstPurchaseBonuses).forEach((key) => {
    delete shopSessionFirstPurchaseBonuses[key];
  });

  const legacyEntitlement = "packageLegacyFirstPurchaseBonus";
  if (playerProgress?.entitlements?.[legacyEntitlement]) {
    delete playerProgress.entitlements[legacyEntitlement];
    saveProgress();
  }
}

function updateShopWallet() {
  if (!shopSessionBalances) {
    shopSessionBalances = {
      gold: 0,
      diamonds: 0,
      summonTickets: 0,
      commonEssence: 0,
      soldierFragments: 0,
    };
  }
  if (playerProgress) {
    shopSessionBalances.gold = Math.max(0, Number(playerProgress.gold) || 0);
    shopSessionBalances.diamonds = Math.max(0, Number(playerProgress.diamonds) || 0);
    shopSessionBalances.summonTickets = Math.max(0, Number(playerProgress.summonTickets) || 0);
    shopSessionBalances.commonEssence = Math.max(0, Number(playerProgress.commonEssence) || 0);
    shopSessionBalances.soldierFragments = Math.max(0, Number(playerProgress.soldierFragments) || 0);
  }
  const walletValues = {
    shopGoldAmount: shopSessionBalances.gold,
    shopDiamondAmount: shopSessionBalances.diamonds,
    shopTicketAmount: shopSessionBalances.summonTickets,
    shopEssenceAmount: shopSessionBalances.commonEssence,
    shopSoldierEssenceAmount: shopSessionBalances.soldierFragments,
  };

  Object.entries(walletValues).forEach(([elementId, amount]) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = Math.max(0, Number(amount) || 0).toLocaleString("ko-KR");
    }
  });
}

function renderShopUI() {
  const categoryWrap = document.getElementById("shopCategoryList");
  const itemWrap = document.getElementById("shopItemList");

  if (!categoryWrap || !itemWrap) return;

  categoryWrap.innerHTML = "";
  itemWrap.innerHTML = "";
  itemWrap.dataset.category = selectedShopCategory;

  SHOP_CATEGORY_LIST.forEach((category) => {
    const button = document.createElement("button");
    const isSelected = category.id === selectedShopCategory;

    button.type = "button";
    button.className = `shop-category-btn${isSelected ? " is-selected" : ""}`;
    button.setAttribute("aria-pressed", isSelected ? "true" : "false");

    const icon = document.createElement("span");
    icon.className = "shop-category-icon";
    icon.setAttribute("aria-hidden", "true");
    setShopIcon(icon, category);

    const label = document.createElement("span");
    label.className = "shop-category-label";
    label.textContent = category.label;

    button.appendChild(icon);
    button.appendChild(label);

    setShopBackground(
      button,
      isSelected ? SHOP_ASSET_PATHS.categorySelected : SHOP_ASSET_PATHS.categoryNormal
    );

    button.addEventListener("click", () => {
      selectedShopCategory = category.id;
      renderShopUI();

      if (shopNotice) {
        shopNotice.textContent = `${category.label} 카테고리 선택됨`;
      }
    });

    categoryWrap.appendChild(button);
  });

  const categoryItems = SHOP_CATEGORY_ITEMS[selectedShopCategory] || [];
  const visibleItemCount = selectedShopCategory === "growth"
    ? categoryItems.length
    : SHOP_ITEM_COUNT;

  categoryItems.slice(0, visibleItemCount).forEach((item) => {
    const card = document.createElement("button");
    const itemName = selectedShopCategory === "growth"
      ? `${item.name} ${item.amount}`
      : item.name;

    card.type = "button";
    const isDetailedOffer = (
      selectedShopCategory === "recommend"
      || selectedShopCategory === "package"
      || selectedShopCategory === "diamond"
      || selectedShopCategory === "monthly"
    );
    const isPurchased = isShopItemPurchased(item);
    const itemRuleId = item.purchaseRuleId || item.id;
    const hasFirstPurchaseBonus = Boolean(
      item.firstPurchaseBonus && !hasClaimedFirstPurchaseBonus(itemRuleId)
    );
    card.className = [
      "shop-item-card",
      isDetailedOffer ? "is-detailed-offer" : "",
      selectedShopCategory === "recommend" ? "is-recommend" : "",
      selectedShopCategory === "package" ? "is-package" : "",
      selectedShopCategory === "diamond" ? "is-diamond" : "",
      selectedShopCategory === "growth" ? "is-growth" : "",
      (selectedShopCategory === "monthly" || item.immediateContents) ? "is-monthly" : "",
      isPurchased ? "is-purchased" : "",
      hasFirstPurchaseBonus ? "has-first-purchase-bonus" : "",
    ].filter(Boolean).join(" ");
    card.dataset.itemId = item.id;
    card.dataset.category = selectedShopCategory;
    card.disabled = isPurchased;
    card.setAttribute("aria-label", isPurchased ? `${itemName}, 오늘 구매 완료` : itemName);

    setShopBackground(
      card,
      selectedShopCategory === "growth" ? SHOP_ASSET_PATHS.growthCard : SHOP_ASSET_PATHS.itemCard
    );

    if (selectedShopCategory === "growth") {
      renderGrowthCardContent(card, item);
    } else if (isDetailedOffer) {
      renderDetailedOfferCardContent(card, item);
    } else {
      const name = document.createElement("span");
      name.className = "shop-item-name";
      name.textContent = itemName;
      card.appendChild(name);
    }

    card.addEventListener("click", () => {
      openShopPurchasePopup(itemName, item);
    });

    itemWrap.appendChild(card);
  });
}

function isShopItemPurchased(item) {
  const rule = item ? SHOP_PURCHASE_RULES[item.purchaseRuleId || item.id] : null;
  return Boolean(
    rule?.daily
    && shopSessionDailyPurchases[item.id] === getLocalDateKey()
  );
}

function renderGrowthCardContent(card, item) {
  const image = document.createElement("img");
  image.className = "shop-growth-image";
  image.src = item.image;
  image.alt = "";
  image.draggable = false;

  const title = document.createElement("strong");
  title.className = "shop-growth-title";
  title.textContent = item.name;

  const amount = document.createElement("span");
  amount.className = "shop-growth-amount";
  amount.textContent = item.amount;

  const limit = document.createElement("span");
  limit.className = "shop-growth-limit";
  limit.textContent = item.dailyLimit;

  const price = document.createElement("span");
  price.className = `shop-growth-price${item.priceIcon ? "" : " is-free"}`;

  if (item.priceIcon) {
    const priceIcon = document.createElement("img");
    priceIcon.src = item.priceIcon;
    priceIcon.alt = "";
    priceIcon.draggable = false;
    price.appendChild(priceIcon);
  }

  const priceText = document.createElement("span");
  priceText.textContent = item.price;
  price.appendChild(priceText);

  card.append(image, title, amount, limit, price);
}

function renderDetailedOfferCardContent(card, item) {
  if (item.immediateContents || item.dailyContents) {
    renderMonthlyContractCardContent(card, item);
    return;
  }

  const image = document.createElement("img");
  image.className = "shop-package-image";
  image.src = item.image;
  image.alt = "";
  image.draggable = false;

  const title = document.createElement("strong");
  title.className = "shop-package-title";
  title.textContent = item.name;

  const contentList = document.createElement("span");
  contentList.className = "shop-package-contents";

  let firstPurchaseBadge = null;
  const itemRuleId = item.purchaseRuleId || item.id;
  if (item.firstPurchaseBonus && !hasClaimedFirstPurchaseBonus(itemRuleId)) {
    firstPurchaseBadge = document.createElement("span");
    firstPurchaseBadge.className = "shop-first-purchase-badge";
    firstPurchaseBadge.textContent = "첫 구매 보너스 +500💎";
  }

  (item.contents || []).forEach((content) => {
    const row = document.createElement("span");
    row.className = `shop-package-content-row${content.bonus ? " is-bonus" : ""}`;

    const icon = document.createElement("img");
    icon.className = "shop-package-content-icon";
    icon.src = content.icon;
    icon.alt = "";
    icon.draggable = false;

    const label = document.createElement("span");
    label.className = "shop-package-content-label";
    label.textContent = content.label;

    const amount = document.createElement("span");
    amount.className = "shop-package-content-amount";
    amount.textContent = content.amount;

    row.append(icon, label, amount);
    contentList.appendChild(row);
  });

  const price = document.createElement("span");
  price.className = "shop-package-price";
  price.textContent = item.price;

  card.append(image, title, contentList, price);
  if (item.dailyLimit) {
    const limit = document.createElement("span");
    limit.className = "shop-recommend-limit";
    limit.textContent = item.dailyLimit;
    card.appendChild(limit);
  }
  if (item.badge) {
    const badge = document.createElement("span");
    badge.className = `shop-recommend-badge is-${item.badge.toLowerCase()}`;
    badge.textContent = item.badge;
    card.appendChild(badge);
  }
  if (firstPurchaseBadge) card.appendChild(firstPurchaseBadge);
}

function renderMonthlyContractCardContent(card, item) {
  const image = document.createElement("img");
  image.className = "shop-monthly-image";
  image.src = item.image;
  image.alt = "";
  image.draggable = false;

  const title = document.createElement("strong");
  title.className = "shop-package-title shop-monthly-title";
  title.textContent = item.name;

  const duration = document.createElement("span");
  duration.className = "shop-monthly-duration";
  duration.textContent = item.duration || "30일";

  const sections = document.createElement("span");
  sections.className = "shop-monthly-sections";

  [
    { title: "즉시 지급", contents: item.immediateContents },
    { title: "매일 지급", contents: item.dailyContents },
  ].forEach((sectionData) => {
    const section = document.createElement("span");
    section.className = "shop-monthly-section";

    const heading = document.createElement("strong");
    heading.className = "shop-monthly-section-title";
    heading.textContent = `[${sectionData.title}]`;
    section.appendChild(heading);

    (sectionData.contents || []).forEach((content) => {
      const row = document.createElement("span");
      row.className = "shop-package-content-row";

      const icon = document.createElement("img");
      icon.className = "shop-package-content-icon";
      icon.src = content.icon;
      icon.alt = "";
      icon.draggable = false;

      const label = document.createElement("span");
      label.className = "shop-package-content-label";
      label.textContent = content.label;

      const amount = document.createElement("span");
      amount.className = "shop-package-content-amount";
      amount.textContent = content.amount;

      row.append(icon, label, amount);
      section.appendChild(row);
    });

    sections.appendChild(section);
  });

  const price = document.createElement("span");
  price.className = "shop-package-price";
  price.textContent = item.price;

  card.append(image, title, duration, sections, price);
  if (item.badge) {
    const badge = document.createElement("span");
    badge.className = `shop-recommend-badge is-${item.badge.toLowerCase()}`;
    badge.textContent = item.badge;
    card.appendChild(badge);
  }
}

function hasClaimedFirstPurchaseBonus(itemId) {
  const rule = SHOP_PURCHASE_RULES[itemId];
  return Boolean(
    rule?.firstPurchaseEntitlement
    && shopSessionFirstPurchaseBonuses[rule.firstPurchaseEntitlement]
  );
}

function getSelectedShopCategoryLabel() {
  const category = SHOP_CATEGORY_LIST.find((item) => item.id === selectedShopCategory);
  return category ? category.label : "상점";
}

function bindShopPurchasePopup() {
  const popup = document.getElementById("shopPurchasePopup");
  const cancelBtn = document.getElementById("shopPurchaseCancelBtn");
  const confirmBtn = document.getElementById("shopPurchaseConfirmBtn");

  if (!popup) return;

  if (cancelBtn && !cancelBtn.dataset.shopBound) {
    cancelBtn.dataset.shopBound = "true";
    cancelBtn.addEventListener("click", closeShopPurchasePopup);
  }

  if (confirmBtn && !confirmBtn.dataset.shopBound) {
    confirmBtn.dataset.shopBound = "true";
    confirmBtn.addEventListener("click", confirmShopPurchase);
  }

  if (!popup.dataset.shopBound) {
    popup.dataset.shopBound = "true";
    popup.addEventListener("click", (event) => {
      if (event.target === popup) closeShopPurchasePopup();
    });
  }
}

function openShopPurchasePopup(itemName, item = null) {
  const popup = document.getElementById("shopPurchasePopup");
  const text = document.getElementById("shopPurchaseText");

  selectedShopItemName = itemName || "선택한 상품";
  selectedShopItem = item;

  if (text) {
    text.textContent = `${selectedShopItemName}을(를) 구매하시겠습니까?`;
  }

  if (popup) {
    popup.classList.remove("is-hidden");
  }

  if (shopNotice) {
    shopNotice.textContent = `${selectedShopItemName} 선택됨`;
  }
}

function closeShopPurchasePopup() {
  const popup = document.getElementById("shopPurchasePopup");
  if (popup) popup.classList.add("is-hidden");
}

function confirmShopPurchase() {
  const result = executeCurrentShopPurchase();

  if (!result.success) {
    if (shopNotice) shopNotice.textContent = result.message;
    closeShopPurchasePopup();
    return;
  }

  updateShopWallet();
  renderShopUI();

  if (shopNotice) {
    shopNotice.textContent = `${selectedShopItemName || "상품"} 구매 완료!`;
  }
  closeShopPurchasePopup();
}

function executeCurrentShopPurchase() {
  if (!selectedShopItem) {
    return { success: false, message: "상품 정보를 찾을 수 없습니다." };
  }

  const ruleId = selectedShopItem.purchaseRuleId || selectedShopItem.id;
  const rule = SHOP_PURCHASE_RULES[ruleId];
  if (!rule) {
    return { success: false, message: "상품 보상은 준비 중입니다." };
  }

  const today = getLocalDateKey();
  if (rule.daily && shopSessionDailyPurchases[selectedShopItem.id] === today) {
    return { success: false, message: "이 상품은 오늘 이미 구매했습니다." };
  }

  const cost = rule.cost || {};
  updateShopWallet();
  if ((cost.gold || 0) > shopSessionBalances.gold) {
    return { success: false, message: "골드가 부족합니다." };
  }
  if ((cost.diamonds || 0) > shopSessionBalances.diamonds) {
    return { success: false, message: "다이아가 부족합니다." };
  }

  if (playerProgress) {
    playerProgress.gold = Math.max(0, Number(playerProgress.gold) || 0) - (Number(cost.gold) || 0);
    playerProgress.diamonds = Math.max(0, Number(playerProgress.diamonds) || 0) - (Number(cost.diamonds) || 0);
    saveProgress();
  }

  const rewards = { ...(rule.rewards || {}) };
  const shouldGrantFirstPurchaseBonus = Boolean(
    rule.firstPurchaseBonus
    && !hasClaimedFirstPurchaseBonus(ruleId)
  );
  if (shouldGrantFirstPurchaseBonus) {
    Object.entries(rule.firstPurchaseBonus).forEach(([key, amount]) => {
      rewards[key] = Number(rewards[key] || 0) + Number(amount || 0);
    });
  }
  grantPlayerRewards(rewards);

  if (rule.daily) {
    shopSessionDailyPurchases[selectedShopItem.id] = today;
  }
  if (shouldGrantFirstPurchaseBonus && rule.firstPurchaseEntitlement) {
    shopSessionFirstPurchaseBonuses[rule.firstPurchaseEntitlement] = true;
  }

  return { success: true };
}

function applyShopSessionRewards(rewards) {
  ["gold", "diamonds", "summonTickets", "commonEssence", "soldierFragments"].forEach((key) => {
    shopSessionBalances[key] = Math.max(
      0,
      Number(shopSessionBalances[key] || 0) + Number(rewards[key] || 0)
    );
  });
  grantPlayerRewards(rewards);
}

function getShopSessionBalance(key) {
  updateShopWallet();
  return Math.max(0, Number(shopSessionBalances?.[key]) || 0);
}

function spendShopSessionCurrency(key, amount) {
  const cost = Math.max(0, Number(amount) || 0);
  if (!playerProgress || getShopSessionBalance(key) < cost) return false;
  playerProgress[key] = Math.max(0, Number(playerProgress[key]) || 0) - cost;
  saveProgress();
  updateShopWallet();
  if (typeof updateWalletDisplays === "function") updateWalletDisplays();
  if (typeof renderInventoryScreen === "function") renderInventoryScreen();
  return true;
}

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function showShopItemNotice(itemName) {
  openShopPurchasePopup(itemName);
}

function showShopNotice() {
  showShop();
}

window.ShopAPI = {
  items: SHOP_ITEMS,
  categories: SHOP_CATEGORY_LIST,
  categoryItems: SHOP_CATEGORY_ITEMS,
  getShopItems,
  purchaseShopItem,
  renderShopItems,
  openShopScreen,
  updateShopWallet,
  getSessionBalance: getShopSessionBalance,
  spendSessionCurrency: spendShopSessionCurrency,
};
