// Inventory screen.

const INVENTORY_SLOT_COUNT = 30;
const inventoryState = {
  items: [],
};

const INVENTORY_CURRENCY_ITEMS = [
  { key: "gold", name: "골드", description: "전투와 성장에 사용하는 기본 재화입니다.", rarity: "normal" },
  { key: "commonEssence", name: "신의정수", description: "신 성장에 사용하는 정수입니다.", rarity: "rare" },
  { key: "soldierFragments", name: "병사정수", description: "유닛 성장에 사용하는 정수입니다.", rarity: "rare" },
];

const INVENTORY_HERO_ESSENCE_ITEMS = [
  { key: "lightningEssence", name: "제우스 정수" },
  { key: "seaEssence", name: "포세이돈 정수" },
  { key: "wisdomEssence", name: "아테나 정수" },
  { key: "soulEssence", name: "하데스 정수" },
  { key: "warEssence", name: "아레스 정수" },
  { key: "strengthEssence", name: "헤라클레스 정수" },
];

function getInventoryDisplayItems() {
  const currencyItems = INVENTORY_CURRENCY_ITEMS
    .map((item) => ({
      name: item.name,
      count: Math.max(0, Number(playerProgress?.[item.key]) || 0),
      description: item.description,
      rarity: item.rarity,
    }))
    .filter((item) => item.count > 0);

  const heroEssenceItems = INVENTORY_HERO_ESSENCE_ITEMS
    .map((item) => ({
      name: item.name,
      count: Math.max(0, Number(playerProgress?.essences?.[item.key]) || 0),
      description: "신 전용 성장 정수입니다.",
      rarity: "rare",
    }))
    .filter((item) => item.count > 0);

  return [...currencyItems, ...heroEssenceItems, ...inventoryState.items];
}

function addInventoryItem(name, amount = 1, options = {}) {
  if (!name) return;
  const count = Math.max(1, Number(amount) || 1);
  const existing = inventoryState.items.find((item) => item.name === name);

  if (existing) {
    existing.count += count;
  } else {
    inventoryState.items.push({
      name,
      count,
      description: options.description || "",
      rarity: options.rarity || "normal",
    });
  }

  renderInventoryScreen();
}

function renderInventorySlot(index) {
  const item = getInventoryDisplayItems()[index];
  if (!item) {
    return `
      <button class="inventory-slot is-empty" type="button" aria-label="빈 인벤토리 슬롯 ${index + 1}">
        <span>${index + 1}</span>
      </button>
    `;
  }

  return `
    <button class="inventory-slot has-item rarity-${item.rarity}" type="button" aria-label="${item.name} ${item.count}개">
      <span>${index + 1}</span>
      <strong>${item.name}</strong>
      <em>x${item.count}</em>
      <small>${item.description}</small>
    </button>
  `;
}

function renderInventoryScreen() {
  if (!inventoryRoot) return;
  const displayItems = getInventoryDisplayItems();
  const slots = Array.from({ length: INVENTORY_SLOT_COUNT }, (_, index) => renderInventorySlot(index)).join("");
  inventoryRoot.innerHTML = `
    <aside class="inventory-brand-panel" aria-label="인벤토리 로고">
      <div class="inventory-brand-emblem" aria-hidden="true">✦</div>
      <strong>인벤토리</strong>
      <span>INVENTORY</span>
    </aside>
    <main class="inventory-board">
      <header class="inventory-board-head">
        <div>
          <p>TEMPLE VAULT</p>
          <h1>인벤토리</h1>
        </div>
        <span>${displayItems.length} / ${INVENTORY_SLOT_COUNT}</span>
      </header>
      <div class="inventory-slot-grid">
        ${slots}
      </div>
    </main>
  `;
}

function showInventory() {
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  if (missionScreen) missionScreen.classList.add("is-hidden");
  if (inventoryScreen) inventoryScreen.classList.remove("is-hidden");
  hideRecruitDoorScene(true);

  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-shop", "in-recruit", "in-formation", "in-mission");
  document.body.classList.add("in-inventory");

  if (gameState) {
    gameState.running = false;
    gameState.message = "인벤토리에서 보유 아이템을 확인하세요";
    updateButtons();
  }

  renderInventoryScreen();
}
