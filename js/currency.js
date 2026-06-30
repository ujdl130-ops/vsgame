// Battle summon currency spending.

function spendRunestone(amount) {
  if (!gameState.running || gameState.runestone < amount || gameState.gameOver || gameState.clear) return false;
  gameState.runestone -= amount;
  updateHud();
  updateButtons();
  return true;
}
