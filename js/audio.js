// Screen music.

const recruitBgm = new Audio("assets/sounds/bgm/gacha.mp3");
recruitBgm.loop = true;
recruitBgm.preload = "auto";
recruitBgm.volume = 0.55;

function syncScreenBgm() {
  const isRecruitOpen = document.body.classList.contains("in-recruit");

  if (isRecruitOpen) {
    recruitBgm.play().catch(() => {
      // The next user interaction retries playback if the browser blocked autoplay.
    });
    return;
  }

  recruitBgm.pause();
  recruitBgm.currentTime = 0;
}

const screenBgmObserver = new MutationObserver(syncScreenBgm);
screenBgmObserver.observe(document.body, {
  attributes: true,
  attributeFilter: ["class"],
});

document.addEventListener("pointerdown", () => {
  if (document.body.classList.contains("in-recruit") && recruitBgm.paused) {
    recruitBgm.play().catch(() => {});
  }
}, { passive: true });

syncScreenBgm();
