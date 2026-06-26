픽셀디펜스 궁수 walk 모션 교체 버전

수정 내용
1. archer_spritesheet.png의 2번째 행(walk)만 새 걷기 모션으로 교체했습니다.
2. idle / attack / hurt / death 행은 기존 파일을 유지했습니다.
3. script.js는 기존 229x229, 6열 x 5행 기준을 그대로 사용합니다.
4. walk 프레임은 두 다리가 번갈아 앞으로/뒤로 움직이는 형태로 보이도록 교체했습니다.

사용 방법
- index.html, style.css, script.js, archer_spritesheet.png를 같은 폴더에 둔 뒤 index.html 실행
- GitHub Pages 업로드 시에도 4개 파일을 같은 위치에 업로드
- 브라우저에 예전 이미지가 남아 있으면 Ctrl + F5로 강력 새로고침

확인용 파일
- archer_walk_new_preview.gif: 새 걷기 모션 애니메이션 확인용
- archer_walk_row_preview.png: 새 walk 행 확인용
- archer_spritesheet_walk_applied_preview.png: 전체 스프라이트 시트 확인용
