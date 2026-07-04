// Shop screen interactions.
// 프로토타입용 상점 UI: 좌측 카테고리 6개 + 빈 상품 카드 5개 + 구매 확인 팝업을 자동 생성합니다.

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
    id: "currency",
    label: "재화",
    fallbackIcon: "◆",
    iconPaths: [
      "assets/maps/store/category/icon_money.png",
      "assets/maps/shop/category/icon_money.png",
      "assets/maps/store/icon_money.png",
      "assets/maps/shop/icon_money.png",
    ],
  },
  {
    id: "gacha",
    label: "가챠",
    fallbackIcon: "✦",
    iconPaths: [
      "assets/maps/store/category/icon_gacha.png",
      "assets/maps/shop/category/icon_gacha.png",
      "assets/maps/store/icon_gacha.png",
      "assets/maps/shop/icon_gacha.png",
      "assets/maps/store/category/icon_recommend.png",
      "assets/maps/shop/category/icon_recommend.png",
    ],
  },
  {
    id: "fragment",
    label: "영웅조각",
    fallbackIcon: "◈",
    iconPaths: [
      "assets/maps/store/category/icon_fragment.png",
      "assets/maps/shop/category/icon_fragment.png",
      "assets/maps/store/icon_fragment.png",
      "assets/maps/shop/icon_fragment.png",
      "assets/maps/store/category/icon_money.png",
      "assets/maps/shop/category/icon_money.png",
    ],
  },
  {
    id: "item",
    label: "아이템",
    fallbackIcon: "▣",
    iconPaths: [
      "assets/maps/store/category/icon_item.png",
      "assets/maps/shop/category/icon_item.png",
      "assets/maps/store/icon_item.png",
      "assets/maps/shop/icon_item.png",
      "assets/maps/store/category/icon_money.png",
      "assets/maps/shop/category/icon_money.png",
    ],
  },
  {
    id: "normal",
    label: "일반",
    fallbackIcon: "✤",
    iconPaths: [
      "assets/maps/store/category/icon_normal.png",
      "assets/maps/shop/category/icon_normal.png",
      "assets/maps/store/icon_normal.png",
      "assets/maps/shop/icon_normal.png",
      "assets/maps/store/category/icon_recommend.png",
      "assets/maps/shop/category/icon_recommend.png",
    ],
  },
];

const SHOP_ITEM_COUNT = 5;
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

  for (let i = 0; i < SHOP_ITEM_COUNT; i += 1) {
    const card = document.createElement("button");
    const itemName = `${getSelectedShopCategoryLabel()} 상품 ${i + 1}`;

    card.type = "button";
    card.className = "shop-item-card";
    card.setAttribute("aria-label", itemName);

    setShopBackground(card, SHOP_ASSET_PATHS.itemCard);

    card.addEventListener("click", () => {
      openShopPurchasePopup(itemName);
    });

    itemWrap.appendChild(card);
  }
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
