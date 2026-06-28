// Battle currency spending.

function spendGold(amount) {
  if (!gameState.running || gameState.gold < amount || gameState.gameOver || gameState.clear) return false;
  gameState.gold -= amount;
  updateHud();
  updateButtons();
  return true;
}
