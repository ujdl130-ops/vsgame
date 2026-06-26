픽셀디펜스 궁수 스프라이트 모션 수정 버전

수정 내용
1. archer_spritesheet.png를 다시 정렬했습니다.
   - 기존 이미지는 캐릭터가 6x5 격자 안에서 조금씩 다른 위치에 있어 걷기/공격 시 덜컹거려 보였습니다.
   - 각 프레임의 캐릭터를 개별 추출한 뒤 같은 기준선에 맞춰 재배치했습니다.
2. script.js의 궁수병 모션 로직을 수정했습니다.
   - walk 애니메이션 FPS를 낮춰 걸음이 덜 빠르게 보이도록 조정했습니다.
   - 공격 시작과 동시에 화살이 나가던 문제를 수정했습니다.
   - 공격 모션 중 활시위가 풀리는 타이밍에 화살이 발사되도록 변경했습니다.
   - 그림자는 땅에 고정하고 캐릭터만 움직이도록 정리했습니다.
3. 적용 대상은 궁수병(type: "archer")만입니다.
   - 방패병, 주인공, 적은 기존 렌더링 유지.

사용 방법
- index.html, style.css, script.js, archer_spritesheet.png를 같은 폴더에 둔 뒤 index.html 실행
- GitHub Pages에 올릴 때도 4개 파일을 같은 위치에 업로드
- 이미지 파일 이름을 바꾸면 script.js의 archerSprite.src도 같이 바꿔야 합니다.

포함된 확인용 파일
- archer_spritesheet_aligned_preview.png: 정렬 확인용 이미지
- archer_walk_fixed_preview.gif: 걷기 모션 확인용
- archer_attack_fixed_preview.gif: 공격 모션 확인용
- archer_spritesheet_meta.json: 재정렬 좌표 기록
