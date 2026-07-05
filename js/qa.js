// QA_MODE_START: release builds can remove this file and the marked HTML/CSS blocks.

const QA_MODE_STORAGE_KEY = "vsgameQaMode";

const qaState = {
  enabled: localStorage.getItem(QA_MODE_STORAGE_KEY) === "1",
};

function isQaModeEnabled() {
  return qaState.enabled;
}

function setQaModeEnabled(enabled) {
  qaState.enabled = Boolean(enabled);
  localStorage.setItem(QA_MODE_STORAGE_KEY, qaState.enabled ? "1" : "0");
  document.body.classList.toggle("qa-mode-enabled", qaState.enabled);
  updateQaPanel();
  refreshQaAffectedScreens();
}

function getQaCurrencyFields() {
  return [
    { inputId: "qaGoldInput", key: "gold" },
    { inputId: "qaDiamondInput", key: "diamonds" },
    { inputId: "qaTicketInput", key: "summonTickets" },
    { inputId: "qaCommonEssenceInput", key: "commonEssence" },
    { inputId: "qaSoldierEssenceInput", key: "soldierFragments" },
  ];
}

function setQaNotice(message) {
  const notice = document.getElementById("qaPanelNotice");
  if (notice) notice.textContent = message;
}

function syncQaCurrencyInputs() {
  if (!playerProgress) return;
  getQaCurrencyFields().forEach(({ inputId, key }) => {
    const input = document.getElementById(inputId);
    if (input) input.value = Math.max(0, Number(playerProgress[key]) || 0);
  });
}

function applyQaCurrencyValues() {
  if (!playerProgress) return;
  getQaCurrencyFields().forEach(({ inputId, key }) => {
    const input = document.getElementById(inputId);
    if (!input) return;
    playerProgress[key] = Math.max(0, Math.round(Number(input.value) || 0));
  });
  saveProgress();
  refreshQaAffectedScreens();
  setQaNotice("재화 값을 적용했습니다.");
}

function clearAllStagesForQa() {
  if (!playerProgress) return;
  playerProgress.unlockedStage = 3;
  playerProgress.clearedStages = [1, 2, 3];
  saveProgress();
  if (typeof updateStageUI === "function") updateStageUI();
  setQaNotice("모든 스테이지를 클리어 상태로 변경했습니다.");
}

function refreshQaAffectedScreens() {
  if (typeof updateWalletDisplays === "function") updateWalletDisplays();
  if (window.ShopAPI?.updateShopWallet) window.ShopAPI.updateShopWallet();
  if (typeof updateRecruitWallet === "function") updateRecruitWallet();
  if (typeof renderInventoryScreen === "function") renderInventoryScreen();
  if (typeof renderFormationScreen === "function" && typeof isFormationVisible === "function" && isFormationVisible()) {
    renderFormationScreen();
  }
  if (typeof renderMissionScreen === "function" && typeof isMissionVisible === "function" && isMissionVisible()) {
    renderMissionScreen();
  }
  if (typeof updateStageUI === "function") updateStageUI();
}

function updateQaPanel() {
  const button = document.getElementById("qaModeBtn");
  const toggle = document.getElementById("qaToggleBtn");
  if (button) button.classList.toggle("is-active", qaState.enabled);
  if (toggle) {
    toggle.textContent = qaState.enabled ? "ON" : "OFF";
    toggle.setAttribute("aria-pressed", qaState.enabled ? "true" : "false");
    toggle.classList.toggle("is-active", qaState.enabled);
  }
  syncQaCurrencyInputs();
}

function openQaPanel() {
  const panel = document.getElementById("qaPanel");
  if (panel) panel.classList.remove("is-hidden");
  updateQaPanel();
  setQaNotice(qaState.enabled ? "QA 모드가 활성화되어 있습니다." : "QA 모드를 켜면 테스트 기능이 적용됩니다.");
}

function closeQaPanel() {
  const panel = document.getElementById("qaPanel");
  if (panel) panel.classList.add("is-hidden");
}

function bindQaModeControls() {
  document.body.classList.toggle("qa-mode-enabled", qaState.enabled);
  document.getElementById("qaModeBtn")?.addEventListener("click", openQaPanel);
  document.getElementById("qaPanelCloseBtn")?.addEventListener("click", closeQaPanel);
  document.getElementById("qaToggleBtn")?.addEventListener("click", () => setQaModeEnabled(!qaState.enabled));
  document.getElementById("qaApplyCurrencyBtn")?.addEventListener("click", applyQaCurrencyValues);
  document.getElementById("qaClearStagesBtn")?.addEventListener("click", clearAllStagesForQa);
  document.getElementById("qaOpenFormationBtn")?.addEventListener("click", () => {
    closeQaPanel();
    if (typeof showFormation === "function") showFormation();
  });
  updateQaPanel();
  refreshQaAffectedScreens();
}

window.QAAPI = {
  isEnabled: isQaModeEnabled,
  setEnabled: setQaModeEnabled,
  refresh: refreshQaAffectedScreens,
};

bindQaModeControls();

// QA_MODE_END
