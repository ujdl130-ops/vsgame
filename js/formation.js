// Formation screen interactions.

function showFormation() {
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.remove("is-hidden");
  hideRecruitDoorScene(true);
  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-shop", "in-recruit", "in-formation");
  document.body.classList.add("in-formation");

  if (gameState) {
    gameState.running = false;
    gameState.message = "편성 화면에서 덱을 구성하세요";
    updateButtons();
  }

  if (formationNotice) {
    formationNotice.textContent = "유닛을 터치하면 빈 슬롯에 배치할 수 있도록 확장할 예정입니다.";
  }
}

function showFormationNotice() {
  showFormation();
}

function setFormationCategoryTab(tabName) {
  formationCategoryTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.formationTab === tabName);
  });

  if (!formationNotice) return;
  if (tabName === "deck") formationNotice.textContent = "덱 탭입니다. 빈 슬롯에 유닛을 배치하는 구조로 확장할 예정입니다.";
  else if (tabName === "unit") formationNotice.textContent = "유닛 탭입니다. 보유 유닛 목록과 정렬 기능을 여기에 연결할 수 있습니다.";
  else formationNotice.textContent = "타워 탭입니다. 추후 방어 타워 편성 UI를 연결할 수 있습니다.";
}

function setFormationDeckPage(page) {
  formationDeckTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.deckPage === String(page));
  });
  if (formationNotice) {
    formationNotice.textContent = `덱 ${page} 페이지입니다. 현재는 UI 시안 단계라 슬롯이 비워져 있습니다.`;
  }
}

function handleFormationSlotClick(index) {
  formationSlots.forEach((slot) => slot.classList.remove("is-selected"));
  const target = formationSlots[index];
  if (target) target.classList.add("is-selected");
  if (formationNotice) {
    formationNotice.textContent = `${index + 1}번 슬롯이 선택되었습니다. 이후 유닛 배치 기능을 연결할 수 있습니다.`;
  }
}
