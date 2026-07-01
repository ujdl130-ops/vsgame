// Battle summon currency spending.

function clampRunestone(value) {
  return Math.max(0, Math.min(RUNESTONE_GAUGE_MAX, value));
}

function addRunestone(amount) {
  if (!gameState) return;
  gameState.runestone = clampRunestone((gameState.runestone || 0) + amount);
}

function spendRunestone(amount) {
  if (!gameState.running || gameState.runestone < amount || gameState.gameOver || gameState.clear) return false;
  gameState.runestone = clampRunestone(gameState.runestone - amount);
  updateHud();
  updateButtons();
  return true;
}
