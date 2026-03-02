# 일정공유 앱 기본 틀

브라우저만으로 바로 실행 가능한 **일정공유 웹앱 템플릿**입니다.

## 포함된 기능
- 일정 등록 (제목, 날짜, 시간, 참여자, 메모)
- 일정 목록 표시 및 시간순 정렬
- 일정 개별 삭제 / 전체 삭제
- `localStorage` 기반 임시 저장
- PWA 지원 (홈 화면 추가 + 오프라인 캐시)

## 실행 방법 (PC에서 띄우고 모바일 접속)
```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

- PC 브라우저: `http://localhost:8000`
- 모바일 브라우저(같은 와이파이): `http://<PC의_로컬_IP>:8000`

## Termux에서 처음부터 다시 실행 (복붙용)
아래를 **한 줄씩** 그대로 실행하면 됩니다.

```bash
pkg update -y && pkg upgrade -y
```

```bash
pkg install -y git python termux-api
```

```bash
pkill -f "python -m http.server" || true
```

```bash
rm -rf "$HOME/schedule-app"
```

```bash
git clone -b main https://github.com/wonhokimbusy-netizen/test.git "$HOME/schedule-app"
```

```bash
ls -la "$HOME/schedule-app/index.html"
```

```bash
python -m http.server 8000 --bind 0.0.0.0 --directory "$HOME/schedule-app"
```

서버 실행 후, **새 Termux 탭**에서 IP 확인:

```bash
termux-wifi-connectioninfo
```

접속 주소:
- 내 폰: `http://127.0.0.1:8000/index.html`
- 다른 기기: `http://<위에서 나온 ip>:8000/index.html`

## 자주 발생한 문제와 해결
- 디렉토리 목록(`Directory listing for /`)만 보일 때
  - 원인: `index.html`이 없는 폴더를 루트로 서빙 중
  - 해결: `--directory "$HOME/schedule-app"`를 포함해 서버 실행

- `ls: cannot access .../index.html: No such file or directory`
  - 원인: 저장소가 다른 폴더에 있거나 clone 실패
  - 해결: 위 복붙 순서대로 `rm -rf` 후 `git clone` 재실행

- `Cannot bind netlink socket: Permission denied`
  - 원인: 일부 환경에서 `ip` 명령 권한 제한
  - 해결: `termux-wifi-connectioninfo`로 IP 확인

- `0.0.0.0` 접속 불가
  - 정상입니다. `0.0.0.0`은 바인딩 주소입니다.
  - 실제 접속은 `127.0.0.1` 또는 `<실제 IP>`를 사용하세요.

## 외부 공개 호스팅(권장)
모바일을 서버로 계속 켜두기 어렵기 때문에, 실제 운영은 아래가 더 좋습니다.
- **GitHub Pages**
- **Cloudflare Pages / Netlify / Vercel**

이 프로젝트는 경로를 상대 경로(`./`)로 맞춰서 서브 경로 배포에서도 동작하도록 구성되어 있습니다.

## 모바일에서 앱처럼 사용하기
1. 모바일 브라우저로 앱 접속
2. 브라우저 메뉴에서 **홈 화면에 추가**
3. 이후 아이콘으로 실행하면 앱(standalone)처럼 실행 가능
