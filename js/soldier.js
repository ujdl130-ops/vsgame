// Soldier sprite metadata.

const GUARD_SPRITE = {
  // SD 기사형 방패병 전용 스프라이트 시트입니다.
  // 6열 x 5행: idle / walk / attack / unused hurt / death 순서입니다.
  // 프레임마다 몸통 중심이 조금씩 달라서 공격 시 잔상처럼 보이지 않도록
  // 애니메이션별 좌우 보정값을 따로 둡니다.
  frameW: 229,
  frameH: 229,
  drawW: 88,
  drawH: 88,
  fps: { idle: 5, walk: 8, attack: 11, death: 6 },
  rows: { idle: 0, walk: 1, attack: 2, death: 4 },
  frames: { idle: 6, walk: 6, attack: 6, death: 6 },
  baseOffset: { x: 8, y: 0 },
  offsets: {
    idle: [
      { x: -6, y: 0 },
      { x: -7, y: 0 },
      { x: -3, y: 0 },
      { x: 2, y: 0 },
      { x: 6, y: 0 },
      { x: 6, y: 0 },
    ],
    walk: [
      { x: -5, y: 0 },
      { x: -7, y: 0 },
      { x: -2, y: 0 },
      { x: 2, y: 0 },
      { x: 6, y: 0 },
      { x: 7, y: 0 },
    ],
    attack: [
      { x: 0, y: 0 },
      { x: -8, y: 0 },
      { x: -6, y: 0 },
      { x: -5, y: 0 },
      { x: -5, y: 0 },
      { x: -4, y: 0 },
    ],
    death: [
      { x: 2, y: 0 },
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: -3, y: 0 },
      { x: -2, y: 0 },
      { x: -2, y: 0 },
    ],
  },
};

const ARCHER_SPRITE = {
  // 6 columns x 5 rows, aligned to the guard sprite frame size.
  frameW: 229,
  frameH: 229,
  drawW: 88,
  drawH: 88,
  fps: { idle: 1, walk: 8, attack: 10, death: 6 },
  rows: { idle: 0, walk: 1, attack: 2, death: 4 },
  frames: { idle: 1, walk: 6, attack: 6, death: 6 },
};

const MAGE_SPRITE = {
  // 6 columns x 5 rows, aligned to the guard sprite frame size.
  frameW: 229,
  frameH: 229,
  drawW: 88,
  drawH: 88,
  fps: { idle: 5, walk: 8, attack: 10, death: 6 },
  rows: { idle: 0, walk: 1, attack: 2, death: 4 },
  frames: { idle: 6, walk: 6, attack: 6, death: 6 },
};

const SAINTESS_SPRITE = {
  // 6 columns x 5 rows, aligned to the guard sprite frame size.
  frameW: 229,
  frameH: 229,
  drawW: 88,
  drawH: 88,
  fps: { idle: 5, walk: 8, attack: 10, death: 6 },
  rows: { idle: 0, walk: 1, attack: 2, death: 4 },
  frames: { idle: 6, walk: 6, attack: 6, death: 6 },
};

const THIEF_SPRITE = {
  // 6 columns x 5 rows, aligned to the guard sprite frame size.
  frameW: 229,
  frameH: 229,
  drawW: 88,
  drawH: 88,
  fps: { idle: 5, walk: 9, attack: 12, death: 6 },
  rows: { idle: 0, walk: 1, attack: 2, death: 4 },
  frames: { idle: 6, walk: 6, attack: 6, death: 6 },
};


