// Shop screen interactions.
// 상점 UI 뼈대: 카테고리별 상품 카드 5개와 구매 확인 팝업을 생성합니다.

const SHOP_CATEGORY_LIST = [
  {
    id: "recommend",
    label: "추천",
    fallbackIcon: "★",
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
    fallbackIcon: "▣",
    iconPaths: [
      "assets/maps/store/category/icon_recommend.png",
      "assets/maps/shop/category/icon_recommend.png",
    ],
  },
  {
    id: "diamond",
    label: "다이아",
    fallbackIcon: "◆",
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
    fallbackIcon: "✦",
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
    fallbackIcon: "◈",
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
    { id: "recommend-free", name: "무료 상품", sourceCategory: "event" },
    { id: "recommend-package", name: "인기 패키지", sourceCategory: "package" },
    { id: "recommend-diamond", name: "추천 다이아", sourceCategory: "diamond" },
    { id: "recommend-growth", name: "성장 지원 상품", sourceCategory: "growth" },
    { id: "recommend-monthly", name: "월정액", sourceCategory: "monthly" },
  ],
  package: [
    {
      id: "package-fate",
      name: "운명의 시작",
      image: "assets/icons/package_1.png",
      price: "₩5,900",
      contents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×500" },
        { icon: "assets/icons/ticket.png", label: "신 모집권", amount: "×2" },
        { icon: "assets/icons/essence_all.png", label: "공통 신의 정수", amount: "×3" },
      ],
    },
    {
      id: "package-calling",
      name: "신의 부름",
      image: "assets/icons/package_2.png",
      price: "₩9,900",
      contents: [
        { icon: "assets/icons/ticket.png", label: "신 모집권", amount: "×10" },
        { icon: "assets/icons/essence_all.png", label: "공통 신의 정수", amount: "×3" },
      ],
    },
    {
      id: "package-blessing",
      name: "신들의 가호",
      image: "assets/icons/package_3.png",
      price: "₩14,900",
      contents: [
        { icon: "assets/icons/essence_all.png", label: "공통 신의 정수", amount: "×10" },
        { icon: "assets/icons/essence_soldier.png", label: "병사 조각", amount: "×100" },
      ],
    },
    {
      id: "package-offering",
      name: "신성한 공물",
      image: "assets/icons/package_4.png",
      price: "₩29,900",
      contents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×2,000" },
        { icon: "assets/icons/ticket.png", label: "신 모집권", amount: "×10" },
        { icon: "assets/icons/essence_all.png", label: "공통 신의 정수", amount: "×10" },
      ],
    },
    {
      id: "package-legacy",
      name: "올림포스의 유산",
      image: "assets/icons/package_5.png",
      price: "₩49,900",
      contents: [
        { icon: "assets/icons/diamond.png", label: "다이아", amount: "×3,000" },
        { icon: "assets/icons/ticket.png", label: "신 모집권", amount: "×20" },
        { icon: "assets/icons/essence_all.png", label: "공통 신의 정수", amount: "×20" },
        { icon: "assets/icons/essence_soldier.png", label: "병사 조각", amount: "×300" },
      ],
    },
  ],
  diamond: Array.from({ length: SHOP_ITEM_COUNT }, (_, index) => ({
    id: `diamond-${index + 1}`,
    name: `다이아 충전 상품 ${index + 1}`,
  })),
  growth: [
    { id: "growth-common-essence", name: "공통 신의 정수" },
    { id: "growth-soldier-piece", name: "병사 조각" },
    { id: "growth-box", name: "성장 재화 상자" },
    { id: "growth-exp", name: "경험의 서" },
    { id: "growth-gold", name: "성장 골드" },
  ],
  monthly: Array.from({ length: SHOP_ITEM_COUNT }, (_, index) => ({
    id: `monthly-${index + 1}`,
    name: `월정액 상품 ${index + 1}`,
  })),
};
let selectedShopCategory = "recommend";
let selectedShopItemName = "";

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

  hideRecruitDoorScene(true);

  document.body.classList.remove(
    "game-started",
    "in-lobby",
    "in-stage-select",
    "in-recruit",
    "in-formation"
  );
  document.body.classList.add("in-shop");

  if (gameState) {
    gameState.running = false;
    gameState.message = "상점에서 아이템을 확인하세요";
    updateButtons();
  }

  renderShopUI();
  bindShopPurchasePopup();

  if (shopNotice) {
    shopNotice.textContent = "상점 품목을 선택하세요.";
  }
}

function renderShopUI() {
  const categoryWrap = document.getElementById("shopCategoryList");
  const itemWrap = document.getElementById("shopItemList");

  if (!categoryWrap || !itemWrap) return;

  categoryWrap.innerHTML = "";
  itemWrap.innerHTML = "";

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

  categoryItems.slice(0, SHOP_ITEM_COUNT).forEach((item) => {
    const card = document.createElement("button");
    const itemName = item.name;

    card.type = "button";
    card.className = `shop-item-card${selectedShopCategory === "package" ? " is-package" : ""}`;
    card.dataset.itemId = item.id;
    card.dataset.category = selectedShopCategory;
    card.setAttribute("aria-label", itemName);

    setShopBackground(card, SHOP_ASSET_PATHS.itemCard);

    if (selectedShopCategory === "package") {
      renderPackageCardContent(card, item);
    } else {
      const name = document.createElement("span");
      name.className = "shop-item-name";
      name.textContent = itemName;
      card.appendChild(name);
    }

    card.addEventListener("click", () => {
      openShopPurchasePopup(itemName);
    });

    itemWrap.appendChild(card);
  });
}

function renderPackageCardContent(card, item) {
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

  (item.contents || []).forEach((content) => {
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
    contentList.appendChild(row);
  });

  const price = document.createElement("span");
  price.className = "shop-package-price";
  price.textContent = item.price;

  card.append(image, title, contentList, price);
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

function openShopPurchasePopup(itemName) {
  const popup = document.getElementById("shopPurchasePopup");
  const text = document.getElementById("shopPurchaseText");

  selectedShopItemName = itemName || "선택한 상품";

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
  if (shopNotice) {
    shopNotice.textContent = `${selectedShopItemName || "상품"} 구매 완료!`;
  }
  closeShopPurchasePopup();
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
};
