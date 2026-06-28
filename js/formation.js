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
    formationNotice.textContent = "?좊떅???곗튂?섎㈃ 鍮??щ’??諛곗튂?????덈룄濡??뺤옣???덉젙?낅땲??";
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
  if (tabName === "deck") formationNotice.textContent = "????엯?덈떎. 鍮??щ’???좊떅??諛곗튂?섎뒗 援ъ“濡??뺤옣???덉젙?낅땲??";
  else if (tabName === "unit") formationNotice.textContent = "?좊떅 ??엯?덈떎. 蹂댁쑀 ?좊떅 紐⑸줉怨??뺣젹 湲곕뒫???ш린???곌껐?????덉뒿?덈떎.";
  else formationNotice.textContent = "?????엯?덈떎. 異뷀썑 諛⑹뼱 ????몄꽦 UI瑜??곌껐?????덉뒿?덈떎.";
}

function setFormationDeckPage(page) {
  formationDeckTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.deckPage === String(page));
  });
  if (formationNotice) {
    formationNotice.textContent = `??${page} ?섏씠吏?낅땲?? ?꾩옱??UI ?쒖븞 ?④퀎???щ’??鍮꾩썙???덉뒿?덈떎.`;
  }
}

function handleFormationSlotClick(index) {
  formationSlots.forEach((slot) => slot.classList.remove("is-selected"));
  const target = formationSlots[index];
  if (target) target.classList.add("is-selected");
  if (formationNotice) {
    formationNotice.textContent = `${index + 1}踰??щ’???좏깮?섏뿀?듬땲?? ?댄썑 ?좊떅 諛곗튂 湲곕뒫???곌껐?????덉뒿?덈떎.`;
  }
}
