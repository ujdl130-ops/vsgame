// Mission screen.

const MISSION_GROUPS = [
  {
    id: "daily",
    title: "일일 미션",
    subtitle: "매일 초기화",
    missions: [
      { title: "몬스터 처치", detail: "전투에서 몬스터를 처치하세요.", current: 10, target: 100, reward: "골드 500" },
      { title: "스킬 사용", detail: "영웅 스킬을 사용하세요.", current: 10, target: 10, reward: "다이아 20" },
      { title: "유닛 소환", detail: "전투 중 유닛을 소환하세요.", current: 8, target: 20, reward: "영웅소환석 1" },
      { title: "스테이지 도전", detail: "스테이지에 입장하세요.", current: 1, target: 3, reward: "영웅소환석 1" },
      { title: "골드 획득", detail: "전투 보상으로 골드를 모으세요.", current: 1200, target: 3000, reward: "골드 800" },
    ],
  },
  {
    id: "weekly",
    title: "주간 미션",
    subtitle: "매주 초기화",
    missions: [
      { title: "몬스터 대량 처치", detail: "한 주 동안 몬스터를 처치하세요.", current: 145, target: 500, reward: "다이아 120" },
      { title: "보스전 승리", detail: "보스가 등장하는 전투에서 승리하세요.", current: 1, target: 5, reward: "영웅소환석 3" },
      { title: "스킬 연계 훈련", detail: "스킬을 여러 번 사용하세요.", current: 22, target: 80, reward: "골드 4000" },
      { title: "스테이지 클리어", detail: "스테이지를 클리어하세요.", current: 4, target: 15, reward: "영웅소환석 3" },
    ],
  },
  {
    id: "achievement",
    title: "업적",
    subtitle: "누적 달성",
    missions: [
      { title: "몬스터 처치 1단계", detail: "누적 몬스터 처치 수를 달성하세요.", current: 320, target: 1000, reward: "칭호: 수호자" },
      { title: "스킬 마스터", detail: "누적 스킬 사용 횟수를 달성하세요.", current: 58, target: 300, reward: "다이아 300" },
      { title: "소환 지휘관", detail: "누적 유닛 소환 횟수를 달성하세요.", current: 210, target: 700, reward: "영웅소환석 5" },
      { title: "전장의 개척자", detail: "누적 스테이지 클리어 횟수를 달성하세요.", current: 18, target: 100, reward: "골드 20000" },
      { title: "불굴의 도전자", detail: "누적 전투 도전 횟수를 달성하세요.", current: 42, target: 200, reward: "영웅소환석 10" },
    ],
  },
];

const claimedMissionRewards = new Set();
let claimableCount = 0;

function getMissionProgressPercent(mission) {
  if (!mission || !mission.target) return 0;
  return Math.max(0, Math.min(100, Math.round((mission.current / mission.target) * 100)));
}

function claimMissionReward(reward) {
  const amountMatch = String(reward).match(/(\d+)/);
  const amount = amountMatch ? Number(amountMatch[1]) : 1;

  if (reward.includes("골드")) addWalletCurrency("gold", amount);
  else if (reward.includes("다이아")) addWalletCurrency("diamond", amount);
  else {
    const itemName = reward.includes("소환")
      ? "영웅소환석"
      : reward.replace(/\s*\d+.*/, "").trim() || "영웅소환석";
    addInventoryItem(itemName, amount, {
      description: "미션 보상 아이템",
      rarity: "rare",
    });
  }
}

function handleMissionRewardClick(button) {
  if (!button || button.disabled || button.dataset.claimed === "true") return;
  claimMissionReward(button.dataset.reward || "");
  claimedMissionRewards.add(button.dataset.missionKey || "");
  renderMissionScreen();
}

function renderMissionCard(mission, index, groupId) {
  const percent = getMissionProgressPercent(mission);
  const complete = mission.current >= mission.target;
  const missionKey = `${groupId}-${index}`;
  const claimed = claimedMissionRewards.has(missionKey);
  return `
    <article class="mission-card ${complete ? "is-complete" : ""}">
      <div class="mission-card-main">
        <span class="mission-card-mark" aria-hidden="true">✦</span>
        <div>
          <h3>${mission.title}</h3>
          <p>${mission.detail}</p>
        </div>
      </div>
      <div class="mission-progress-row">
        <div class="mission-progress-track" aria-hidden="true">
          <span style="width: ${percent}%"></span>
        </div>
        <strong>${mission.current} / ${mission.target}</strong>
      </div>
      <div class="mission-card-foot">
        <span>${mission.reward}</span>
        <button type="button" data-reward="${mission.reward}" data-mission-key="${missionKey}" ${complete && !claimed ? "" : "disabled"}>${claimed ? "완료" : complete ? "받기" : "진행중"}</button>
      </div>
    </article>
  `;
}

function renderMissionGroup(group) {
  const visibleMissions = group.missions
    .map((mission, index) => ({ mission, index, missionKey: `${group.id}-${index}` }))
    .filter((entry) => !claimedMissionRewards.has(entry.missionKey));

  return `
    <section class="mission-section mission-section-${group.id}">
      <header class="mission-section-head">
        <div>
          <p>${group.subtitle}</p>
          <h2>${group.title}</h2>
        </div>
        <span>${visibleMissions.length}</span>
      </header>
      <div class="mission-list">
        ${visibleMissions.map(({ mission, index }) => renderMissionCard(mission, index, group.id)).join("")}
      </div>
    </section>
  `;
}

function renderMissionScreen() {
  if (!missionRoot) return;
  claimableCount = getClaimableMissionEntries().length;
  missionRoot.innerHTML = `
    <aside class="mission-brand-panel" aria-label="미션 로고">
      <div class="mission-brand-emblem" aria-hidden="true">✦</div>
      <strong>미션</strong>
      <span>MISSION</span>
    </aside>
    <main class="mission-board">
      <header class="mission-board-head">
        <div>
          <p>TEMPLE QUEST</p>
          <h1>미션</h1>
        </div>
      </header>
      <div class="mission-columns">
        ${MISSION_GROUPS.map(renderMissionGroup).join("")}
      </div>
    </main>
  `;
  const missionHead = missionRoot.querySelector(".mission-board-head");
  if (missionHead) {
    const claimAllButton = document.createElement("button");
    claimAllButton.id = "missionClaimAllBtn";
    claimAllButton.className = "mission-claim-all-btn";
    claimAllButton.type = "button";
    claimAllButton.textContent = "모두받기";
    claimAllButton.disabled = claimableCount <= 0;
    missionHead.appendChild(claimAllButton);
  }
  missionRoot.querySelectorAll(".mission-reward-btn").forEach((button) => {
    button.addEventListener("click", () => handleMissionRewardClick(button));
  });
  const claimAllBtn = missionRoot.querySelector(".mission-board > .mission-board-head .mission-claim-all-btn");
  if (claimAllBtn) claimAllBtn.addEventListener("click", handleMissionClaimAll);
}

function showMission() {
  if (titleScreen) titleScreen.classList.add("is-hidden");
  if (lobbyScreen) lobbyScreen.classList.add("is-hidden");
  if (stageScreen) stageScreen.classList.add("is-hidden");
  if (shopScreen) shopScreen.classList.add("is-hidden");
  if (recruitScreen) recruitScreen.classList.add("is-hidden");
  if (formationScreen) formationScreen.classList.add("is-hidden");
  if (missionScreen) missionScreen.classList.remove("is-hidden");
  if (inventoryScreen) inventoryScreen.classList.add("is-hidden");
  hideRecruitDoorScene(true);

  document.body.classList.remove("game-started", "in-lobby", "in-stage-select", "in-shop", "in-recruit", "in-formation", "in-inventory");
  document.body.classList.add("in-mission");

  if (gameState) {
    gameState.running = false;
    gameState.message = "미션 화면에서 진행도를 확인하세요";
    updateButtons();
  }

  renderMissionScreen();
}

function showMissionNotice() {
  showMission();
}

// QA_MODE_SUPPORT: reward normalization and QA-completable mission cards.
function claimMissionReward(reward) {
  const rewardText = String(reward || "");
  const amountMatch = rewardText.match(/(\d+)/);
  const amount = amountMatch ? Number(amountMatch[1]) : 1;

  if (rewardText.includes("골드") || rewardText.includes("怨⑤뱶")) {
    grantPlayerRewards({ gold: amount });
  } else if (rewardText.includes("다이아") || rewardText.includes("?ㅼ씠")) {
    grantPlayerRewards({ diamonds: amount });
  } else if (rewardText.includes("모집") || rewardText.includes("소환") || rewardText.includes("?뚰솚")) {
    grantPlayerRewards({ summonTickets: amount });
  } else if (rewardText.includes("신의정수")) {
    grantPlayerRewards({ commonEssence: amount });
  } else if (rewardText.includes("병사정수")) {
    grantPlayerRewards({ soldierFragments: amount });
  } else {
    addInventoryItem(rewardText.replace(/\s*\d+.*/, "").trim() || "미션 보상", amount, {
      description: "미션 보상 아이템",
      rarity: "rare",
    });
  }
}

function getClaimableMissionEntries() {
  return MISSION_GROUPS.flatMap((group) => group.missions.map((mission, index) => {
    const missionKey = `${group.id}-${index}`;
    const complete = mission.current >= mission.target;
    return { mission, missionKey, complete };
  })).filter((entry) => entry.complete && !claimedMissionRewards.has(entry.missionKey));
}

function handleMissionClaimAll() {
  const claimable = getClaimableMissionEntries();
  if (!claimable.length) return;
  claimable.forEach(({ mission, missionKey }) => {
    claimMissionReward(mission.reward);
    claimedMissionRewards.add(missionKey);
  });
  renderMissionScreen();
}

function renderMissionCard(mission, index, groupId) {
  const percent = window.QAAPI?.isEnabled?.() ? 100 : getMissionProgressPercent(mission);
  const complete = window.QAAPI?.isEnabled?.() || mission.current >= mission.target;
  const missionKey = `${groupId}-${index}`;
  const claimed = claimedMissionRewards.has(missionKey);
  return `
    <article class="mission-card ${complete ? "is-complete" : ""}">
      <div class="mission-card-main">
        <span class="mission-card-mark" aria-hidden="true">◆</span>
        <div>
          <h3>${mission.title}</h3>
          <p>${mission.detail}</p>
        </div>
      </div>
      <div class="mission-progress-row">
        <div class="mission-progress-track" aria-hidden="true">
          <span style="width: ${percent}%"></span>
        </div>
        <button class="mission-reward-btn" type="button" data-reward="${mission.reward}" data-mission-key="${missionKey}" ${complete && !claimed ? "" : "disabled"}>${claimed ? "완료" : "받기"}</button>
        <strong>${complete && window.QAAPI?.isEnabled?.() ? mission.target : mission.current} / ${mission.target}</strong>
      </div>
      <div class="mission-card-foot">
        <span>${mission.reward}</span>
        <button type="button" data-reward="${mission.reward}" data-mission-key="${missionKey}" ${complete && !claimed ? "" : "disabled"}>${claimed ? "완료" : complete ? "받기" : "진행중"}</button>
      </div>
    </article>
  `;
}
