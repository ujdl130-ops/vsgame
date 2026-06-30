// Shop screen interactions.
// 프로토타입용 상점 UI: 좌측 카테고리 6개 + 빈 상품 카드 5개를 자동 생성합니다.

const SHOP_CATEGORY_LIST = [
  { id: "recommend", label: "추천" },
  { id: "currency", label: "재화" },
  { id: "gacha", label: "가챠" },
  { id: "fragment", label: "영웅조각" },
  { id: "item", label: "아이템" },
  { id: "normal", label: "일반" },
];

const SHOP_ITEM_COUNT = 5;
let selectedShopCategory = "recommend";

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
    element.style.backgroundImage = `url('${src}')`;
  });
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
    button.textContent = category.label;
    button.setAttribute("aria-pressed", isSelected ? "true" : "false");

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
    card.type = "button";
    card.className = "shop-item-card";
    card.setAttribute("aria-label", `${getSelectedShopCategoryLabel()} 상품 ${i + 1}`);

    setShopBackground(card, SHOP_ASSET_PATHS.itemCard);

    card.addEventListener("click", () => {
      showShopItemNotice(`${getSelectedShopCategoryLabel()} 상품 ${i + 1}`);
    });

    itemWrap.appendChild(card);
  }
}

function getSelectedShopCategoryLabel() {
  const category = SHOP_CATEGORY_LIST.find((item) => item.id === selectedShopCategory);
  return category ? category.label : "상점";
}

function showShopItemNotice(itemName) {
  if (!shopNotice) return;
  shopNotice.textContent = `${itemName} 선택됨`;
}

function showShopNotice() {
  showShop();
}
