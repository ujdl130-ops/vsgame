픽셀디펜스 방패병 SD 기사 스프라이트 적용 버전

수정 내용
1. guard_spritesheet.png를 추가했습니다.
   - 이전에 만든 SD 기사풍 방패병 스프라이트를 투명 배경 PNG로 정리했습니다.
   - 6열 x 5행, 229x229 셀 구조입니다.
2. 방패병(type: "guard")에 스프라이트 애니메이션을 적용했습니다.
   - idle: 대기
   - walk: 이동
   - attack: 근접 공격
   - hurt: 피격
3. 궁수병(type: "archer")은 기존 적용 상태를 유지했습니다.
4. 방패병 공격 피해는 검을 휘두르는 중간 타이밍에 들어가도록 수정했습니다.

사용 방법
- index.html, style.css, script.js, archer_spritesheet.png, guard_spritesheet.png를 같은 폴더에 둔 뒤 index.html 실행
- GitHub Pages에 올릴 때도 위 파일들을 같은 위치에 업로드
- 이미지가 예전처럼 보이면 Ctrl + F5로 강력 새로고침

확인용 파일
- guard_spritesheet_preview.png: 전체 방패병 스프라이트 확인용
- guard_walk_preview.gif: 방패병 걷기 미리보기
- guard_attack_preview.gif: 방패병 공격 미리보기
