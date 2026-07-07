// Lightweight game audio manager.

const AUDIO_PATHS = {
  bgm: {
    basic: "assets/sounds/bgm/basic.MP3",
    stage1: "assets/sounds/bgm/stage1.MP3",
    stage2: "assets/sounds/bgm/stage2.MP3",
    stage3: "assets/sounds/bgm/stage3.MP3",
  },
  sfx: {
    archerAttack: "assets/sounds/sfx/archerattack.MP3",
    bossAttack: "assets/sounds/sfx/bossattack.MP3",
    bossDeath: "assets/sounds/sfx/bossdeath.MP3",
    buySuccess: "assets/sounds/sfx/buysucces.MP3",
    click: "assets/sounds/sfx/click.MP3",
    eyeEnemyAttack: "assets/sounds/sfx/eyeenemyattack.MP3",
    gachaOpenFinish: "assets/sounds/sfx/gachaopenfinish.MP3",
    godDeath: "assets/sounds/sfx/goddeath.MP3",
    knightAttack: "assets/sounds/sfx/knightattack.MP3",
    levelUp: "assets/sounds/sfx/levelup.MP3",
    magicAttack: "assets/sounds/sfx/magiction.MP3",
    poseidonBasic: "assets/sounds/sfx/poseidonbasic.MP3",
    poseidonSkill: "assets/sounds/sfx/poseidonskill.MP3",
    saintessAttack: "assets/sounds/sfx/saintessattack.MP3",
    stageClear: "assets/sounds/sfx/stageclear.MP3",
    starLevelUp: "assets/sounds/sfx/starlevelup.MP3",
    thiefAttack: "assets/sounds/sfx/thiefattack.MP3",
    wolfAttack: "assets/sounds/sfx/wolfattack.MP3",
    wolfChange: "assets/sounds/sfx/wolfchange.MP3",
    zeusBasic: "assets/sounds/sfx/zeusbasic.MP3",
    zeusSkill: "assets/sounds/sfx/zeusskill.MP3",
  },
};

const audioState = {
  bgm: null,
  bgmKey: "",
  unlocked: false,
  sfxCooldowns: new Map(),
};

const SFX_DEFAULT_COOLDOWN = 80;
const SFX_COOLDOWNS = {
  archerAttack: 130,
  bossAttack: 240,
  eyeEnemyAttack: 220,
  knightAttack: 130,
  magicAttack: 160,
  saintessAttack: 180,
  thiefAttack: 140,
  wolfAttack: 170,
};

function createGameAudio(src, { loop = false, volume = 1 } = {}) {
  const audio = new Audio(src);
  audio.loop = loop;
  audio.volume = volume;
  audio.preload = "auto";
  return audio;
}

function unlockGameAudio() {
  audioState.unlocked = true;
  if (audioState.bgm) {
    audioState.bgm.play().catch(() => {});
  }
}

function playBgm(key, options = {}) {
  const src = AUDIO_PATHS.bgm[key];
  if (!src || audioState.bgmKey === key) return;

  if (audioState.bgm) {
    audioState.bgm.pause();
    audioState.bgm.currentTime = 0;
  }

  audioState.bgmKey = key;
  audioState.bgm = createGameAudio(src, {
    loop: true,
    volume: options.volume ?? 0.42,
  });

  if (audioState.unlocked) {
    audioState.bgm.play().catch(() => {});
  }
}

function stopBgm() {
  if (!audioState.bgm) return;
  audioState.bgm.pause();
  audioState.bgm.currentTime = 0;
  audioState.bgm = null;
  audioState.bgmKey = "";
}

function pauseBgm() {
  if (!audioState.bgm) return false;
  const wasPlaying = !audioState.bgm.paused;
  audioState.bgm.pause();
  return wasPlaying;
}

function resumeBgm() {
  if (audioState.bgm && audioState.unlocked) {
    audioState.bgm.play().catch(() => {});
  }
}

function playSfx(key, options = {}) {
  const src = AUDIO_PATHS.sfx[key];
  if (!src) return;

  const now = performance.now();
  const cooldown = options.cooldown ?? SFX_COOLDOWNS[key] ?? SFX_DEFAULT_COOLDOWN;
  const lastPlayedAt = audioState.sfxCooldowns.get(key) || 0;
  if (now - lastPlayedAt < cooldown) return;
  audioState.sfxCooldowns.set(key, now);

  const audio = createGameAudio(src, {
    loop: false,
    volume: options.volume ?? 0.72,
  });
  audio.play().catch(() => {});
}

function playUnitAttackSfx(unitType) {
  const soundKeyByType = {
    guard: "knightAttack",
    archer: "archerAttack",
    mage: "magicAttack",
    saintess: "saintessAttack",
    thief: "thiefAttack",
  };
  playSfx(soundKeyByType[unitType]);
}

function playEnemyAttackSfx(enemy) {
  if (!enemy) return;
  if (enemy.type === "evileye") {
    playSfx("eyeEnemyAttack");
    return;
  }
  if (enemy.type === "karon") {
    playSfx(enemy.bossPhase === "werewolf" ? "wolfAttack" : "bossAttack");
    return;
  }
  if (enemy.type === "normal" || enemy.type === "brute") {
    playSfx("wolfAttack");
  }
}

function playEnemyDeathSfx(enemy) {
  if (!enemy) return;
  if (enemy.isBoss || enemy.type === "karon") {
    playSfx("bossDeath", { cooldown: 500, volume: 0.85 });
  }
}

function playHeroBasicSfx(hero) {
  playSfx(hero && hero.heroId === "poseidon" ? "poseidonBasic" : "zeusBasic");
}

function playHeroSkillSfx(hero) {
  playSfx(hero && hero.heroId === "poseidon" ? "poseidonSkill" : "zeusSkill", {
    cooldown: 600,
    volume: 0.86,
  });
}

function playStageBgm(stageNumber) {
  playBgm(`stage${Number(stageNumber) || 1}`, { volume: 0.45 });
}

function syncScreenBgm() {
  if (document.body.classList.contains("game-started")) {
    playStageBgm(typeof selectedStage !== "undefined" ? selectedStage : 1);
    return;
  }
  playBgm("basic");
}

window.addEventListener("pointerdown", unlockGameAudio, { once: true, capture: true });
window.addEventListener("keydown", unlockGameAudio, { once: true, capture: true });
document.addEventListener("click", (event) => {
  const clickable = event.target && typeof event.target.closest === "function"
    ? event.target.closest("button, [role='button'], .stage-card, .shop-item-card")
    : null;
  if (clickable && !clickable.disabled) playSfx("click", { cooldown: 45, volume: 0.45 });
}, true);

window.GameAudio = {
  playBgm,
  playSfx,
  stopBgm,
  pauseBgm,
  resumeBgm,
  syncScreenBgm,
  playStageBgm,
  playUnitAttackSfx,
  playEnemyAttackSfx,
  playEnemyDeathSfx,
  playHeroBasicSfx,
  playHeroSkillSfx,
};

syncScreenBgm();
