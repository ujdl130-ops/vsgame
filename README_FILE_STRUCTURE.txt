픽셀디펜스 - 제우스 검은 배경 제거/프레임 간격 보정 적용본

[이번 수정]
1. zeus_hero_spritesheet_latest.png의 검은 배경을 투명 처리했습니다.
2. 각 프레임 안에서 캐릭터가 좌우로 밀려 보이던 문제를 줄이기 위해 프레임별 캐릭터 위치를 중앙 정렬했습니다.
3. 각 프레임의 바닥 기준선을 맞춰서 이동 중 위아래 튐을 줄였습니다.
4. script.js의 heroSprite 경로를 새 파일로 교체했습니다.
5. 제우스 프레임 설정은 256 x 204 기준으로 유지했습니다.
6. 체력바는 얼굴을 덜 가리도록 위쪽 위치를 유지했습니다.

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
