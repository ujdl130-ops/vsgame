픽셀디펜스 - 전투 시스템 피격 구조 정리 버전 v1

[이번 수정]
1. 쫄병(방패병/궁수)의 피격 모션/피격 타이머/hurt 상태를 제거했습니다.
2. 몬스터도 피격 경직 없이 이동/공격/사망만 처리되도록 정리했습니다.
3. 메인 영웅만 피격 이펙트와 hurt 애니메이션을 유지했습니다.
4. 쫄병과 몬스터는 서로 만나면 공격만 주고받고, HP가 0이 되면 사망 모션 후 사라집니다.
5. 사망한 쫄병은 즉시 소환 슬롯에서 제외되어 다시 소환할 수 있습니다.
6. 기존 에셋 경로는 assets 폴더 구조 기준으로 유지했습니다.

[사용 파일]
index.html
style.css
script.js
assets/animations/hero/zeus_hero_spritesheet_latest_transparent_aligned.png
assets/animations/guard/guard_spritesheet_v2.png
assets/animations/archer/archer_spritesheet_v2.png
assets/maps/stage1/stage1_forest_bg_v2.png
assets/maps/stage1/player_castle_stage1.png
assets/maps/stage1/enemy_castle_stage1.png
