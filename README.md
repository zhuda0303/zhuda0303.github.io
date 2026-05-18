# GitHub Pages — 프로필 사이트

이 폴더(`docs/`)는 김주대님 정적 자기소개 페이지([index.html](index.html))입니다. 원문 마크다운은 저장소의 [Resume/자기소개서_김주대.md](../Resume/자기소개서_김주대.md)이며, HTML은 수동으로 맞춰 두었습니다. 마크다운을 수정한 뒤에는 `index.html`도 같은 내용으로 갱신해야 합니다.

## 배포 방법

1. GitHub 저장소에서 **Settings → Pages**로 이동합니다.
2. **Build and deployment**에서 Source를 **Deploy from a branch**로 선택합니다.
3. Branch는 **main**(또는 사용 중인 기본 브랜치), Folder는 **/docs**를 선택하고 저장합니다.
4. 몇 분 뒤 `https://<사용자명>.github.io/<저장소명>/` 에서 사이트가 열립니다.

## 로컬에서 보기

`docs/index.html`을 브라우저로 직접 열거나, 간단한 정적 서버로 같은 폴더를 루트로 띄우면 됩니다. CSS·JS는 `./styles.css`, `./main.js` 상대 경로로 연결되어 있어 GitHub Pages 프로젝트 URL에서도 동작합니다.

## Actions로만 올리고 싶을 때

`/docs` 대신 워크플로에서 `actions/upload-pages-artifact`의 `path`를 이 폴더(`docs`)로 지정해 배포할 수 있습니다. 저장소 루트 전체를 artifact로 올리는 방식은 이 사이트에는 맞지 않습니다.
