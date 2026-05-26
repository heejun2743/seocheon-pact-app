# 서천결의 PWA 앱

4명의 친구가 사용하는 카톡형 채팅 + 밴드형 사진첩 + 홈페이지형 메인 화면을 결합한 PWA 프로토타입입니다.

## 실행 방법

```bash
npm install
npm run dev
```

## 배포 방법

### Netlify 추천
1. GitHub에 이 폴더를 업로드합니다.
2. Netlify에서 Add new site → Import from GitHub를 선택합니다.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. 배포된 주소를 휴대폰에서 열고 “홈 화면에 추가”를 선택합니다.

## 현재 기능
- 4명 프로필
- 카톡형 단체방/공지방
- 메시지 전송 데모
- 친구 메시지 수신 테스트
- 브라우저 알림 권한 테스트
- 밴드형 사진·영상 앨범 카드
- PWA manifest
- service worker
- 홈 화면 아이콘

## 다음 개발 단계
- Firebase/Supabase 로그인
- 실시간 채팅 DB 연결
- 사진·영상 클라우드 저장소 연결
- 실제 푸시알림 연결
