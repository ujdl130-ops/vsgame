픽셀디펜스 파일 정리 결과

[실제 사용 파일]
index.html
style.css
script.js
assets/animations/hero/zeus_hero_spritesheet.png
assets/animations/guard/guard_spritesheet_v2.png
assets/animations/archer/archer_spritesheet_v2.png
assets/maps/stage1/stage1_forest_bg_v2.png
assets/maps/stage1/player_castle_stage1.png
assets/maps/stage1/enemy_castle_stage1.png

[정리 기준]
- 전투 코드에서 직접 로드하는 스프라이트/배경/성 이미지만 assets 폴더에 유지했습니다.
- 루트 폴더에 흩어져 있던 이미지 파일은 제거하고 분류 폴더로 이동했습니다.
- 중복 업로드된 동일 이미지들은 최종 ZIP에는 1개씩만 포함했습니다.
- script.js의 이미지 로드 경로는 assets 기준 최신 경로만 사용하도록 정리했습니다.

[폴더 구조]
assets/animations/hero      : 메인 영웅 제우스 스프라이트
assets/animations/guard     : 방패병 스프라이트
assets/animations/archer    : 궁수 스프라이트
assets/maps/stage1          : Stage 1 배경/플레이어 성/적 성
assets/unused               : 현재 비워둠. 이후 안 쓰는 후보 파일 보관용
