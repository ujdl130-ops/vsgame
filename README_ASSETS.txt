픽셀디펜스 에셋 정리 구조

assets/
  animations/
    archer/
      archer_spritesheet_v2.png
    guard/
      guard_spritesheet_v2.png
  maps/
    stage1/
      stage1_forest_bg_v2.png

script.js의 ASSET_PATHS에서 위 파일 경로를 한 번에 관리합니다.


전투 시스템 v2
- 직접 조작 메인 유닛 제거
- 전투는 방패병/궁수 소환과 자동 전투만으로 진행
- 키보드 단축키: 1 방패병, 2 궁수


전투 시스템 v3
- 아군 병사는 최대 5명까지만 동시에 유지
- 방패병/궁수 구분 없이 전체 병사 수로 계산
- 병사가 사망하면 units 배열에서 제거되어 소환 슬롯이 다시 열림
- HUD에 Units 0/5 표시 추가
