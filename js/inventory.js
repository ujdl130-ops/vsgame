// Inventory screen.

const INVENTORY_SLOT_COUNT = 8;
const inventoryState = {
  items: [],
  activeTab: "all",
  currentPage: 1,
};

const INVENTORY_TABS = [
  { id: "all", label: "전체" },
  { id: "essence", label: "정수" },
  { id: "currency", label: "재화" },
];

const INVENTORY_ESSENCE_ITEMS = [
  { key: "commonEssence", name: "공통정수", icon: "assets/icons/essence_all.png", source: "progress" },
  { key: "soldierFragments", name: "병사정수", icon: "assets/icons/essence_soldier.png", source: "progress" },
  { key: "lightningEssence", name: "제우스 정수", icon: "assets/icons/essence_zeus.png", source: "essences" },
  { key: "seaEssence", name: "포세이돈 정수", icon: "assets/icons/essence_poseidon.png", source: "essences" },
  { key: "wisdomEssence", name: "아테나 정수", icon: "assets/icons/essence_athena.png", source: "essences" },
  { key: "soulEssence", name: "하데스 정수", icon: "assets/icons/essence_hades.png", source: "essences" },
  { key: "warEssence", name: "아레스 정수", icon: "assets/icons/essence_ares.png", source: "essences" },
  { key: "strengthEssence", name: "헤라클레스 정수", icon: "assets/icons/essence_hercules.png", source: "essences" },
];

const INVENTORY_RESOURCE_ITEMS = [
  { key: "gold", name: "골드", icon: "assets/icons/gold.png", source: "progress" },
  { key: "diamonds", name: "다이아몬드", icon: "assets/icons/diamond.png", source: "progress" },
  { key: "summonTickets", name: "뽑기권", icon: "assets/icons/ticket.png", source: "progress" },
];

function getInventoryItemAmount(item) {
  if (item.source === "essences") return Math.max(0, Number(playerProgress?.essences?.[item.key]) || 0);
  return Math.max(0, Number(playerProgress?.[item.key]) || 0);
}

function getInventoryDisplayItems(tab = inventoryState.activeTab) {
  const essenceItems = INVENTORY_ESSENCE_ITEMS.map((item) => ({
    ...item,
    count: getInventoryItemAmount(item),
    category: "essence",
    rarity: "rare",
  }));
  const resourceItems = INVENTORY_RESOURCE_ITEMS.map((item) => ({
    ...item,
    count: getInventoryItemAmount(item),
    category: "currency",
    rarity: "normal",
  }));
  const customItems = inventoryState.items.map((item) => ({
    ...item,
    category: "item",
    icon: item.icon || "",
  }));
  const items = [...essenceItems, ...resourceItems, ...customItems].filter((item) => item.count > 0);
  return tab === "all" ? items : items.filter((item) => item.category === tab);
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

function getInventoryPageCount(items) {
  const count = Math.max(1, Math.ceil(items.length / INVENTORY_SLOT_COUNT));
  return inventoryState.activeTab === "all" ? Math.min(2, count) : count;
}

function getInventoryPageItems(items) {
  const pageCount = getInventoryPageCount(items);
  inventoryState.currentPage = Math.min(Math.max(1, inventoryState.currentPage), pageCount);
  const startIndex = (inventoryState.currentPage - 1) * INVENTORY_SLOT_COUNT;
  return items.slice(startIndex, startIndex + INVENTORY_SLOT_COUNT);
}

function renderInventorySlot(index, pageItems) {
  const item = pageItems[index];
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
      ${item.icon ? `<img src="${item.icon}" alt="">` : ""}
      <em>x${item.count.toLocaleString("ko-KR")}</em>
      <strong>${item.name}</strong>
    </button>
  `;
}

function renderInventoryScreen() {
  if (!inventoryRoot) return;
  const displayItems = getInventoryDisplayItems();
  const pageItems = getInventoryPageItems(displayItems);
  const pageCount = getInventoryPageCount(displayItems);
  const slots = Array.from({ length: INVENTORY_SLOT_COUNT }, (_, index) => renderInventorySlot(index, pageItems)).join("");
  const tabs = INVENTORY_TABS.map((tab) => `
    <button class="inventory-tab${inventoryState.activeTab === tab.id ? " is-active" : ""}" type="button" data-inventory-tab="${tab.id}" data-inventory-label="${tab.label}">
      ${tab.label}
    </button>
  `).join("");
  const pager = Array.from({ length: pageCount }, (_, index) => {
    const page = index + 1;
    return `
      <button class="inventory-page-btn${inventoryState.currentPage === page ? " is-active" : ""}" type="button" data-inventory-page="${page}">
        ${page}
      </button>
    `;
  }).join("");
  inventoryRoot.innerHTML = `
    <aside class="inventory-brand-panel" aria-label="인벤토리 로고">
      <div class="inventory-brand-emblem" aria-hidden="true">✦</div>
      <strong>인벤토리</strong>
      <span>TEMPLE VAULT</span>
    </aside>
    <main class="inventory-board">
      <header class="inventory-board-head">
        <div>
          <p>TEMPLE VAULT</p>
          <h1>인벤토리</h1>
        </div>
        <span>${displayItems.length} / ${INVENTORY_SLOT_COUNT}</span>
      </header>
      <nav class="inventory-tabs" aria-label="인벤토리 분류">
        ${tabs}
      </nav>
      <div class="inventory-slot-grid">
        ${slots}
      </div>
      <nav class="inventory-pager" aria-label="인벤토리 페이지">
        ${pager}
      </nav>
    </main>
  `;
  inventoryRoot.querySelectorAll(".inventory-tab").forEach((button) => {
    button.addEventListener("click", () => {
      inventoryState.activeTab = button.dataset.inventoryTab || "all";
      inventoryState.currentPage = 1;
      renderInventoryScreen();
    });
  });
  inventoryRoot.querySelectorAll(".inventory-page-btn").forEach((button) => {
    button.addEventListener("click", () => {
      inventoryState.currentPage = Number(button.dataset.inventoryPage) || 1;
      renderInventoryScreen();
    });
  });
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
