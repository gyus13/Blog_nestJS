## EndTicket

- 미래의 나를 상상하며 자존감을 올릴 수 있게 도와주는 마음관리 어플리케이션
- Google 스토어 [https://play.google.com/store/apps/details?id=org.aos.ticket](https://play.google.com/store/apps/details?id=org.aos.ticket)
- App 스토어 [https://apps.apple.com/kr/app/마침-표/id1634962397](https://apps.apple.com/kr/app/%EB%A7%88%EC%B9%A8-%ED%91%9C/id1634962397)


### 팀원 구성

- 기획자 1명 디자이너 1명
- AOS 1명 IOS 1명
- 백엔드 1명

### 기술스택

- NestJS
- EC2(Nginx), RDS(MYSQL)
- FCM, KAKAO, APPLE, Google developer 써드파티

### 

### 주요 기술

- 로그인(카카오,애플,구글 소셜로그인 구현)
    - 카카오, 애플, 구글 써드파티를 사용해서 AOS, IOS 각각 소셜로그인 구현
    https://github.com/gyus13/EndTicket/blob/main/src/auth/auth.service.ts
    
- 스케쥴러를 이용한 주간미션 업데이트
    - 매주 월요일 오전 6시에 주간미션 업데이트를 위해서 스케줄링 구현
    https://github.com/gyus13/EndTicket/blob/main/src/tasks/tasks.service.ts
    
- 푸시 알림으로 유저에게 알림
    - firebaseFCM을 활용해 구현
    https://github.com/gyus13/EndTicket/blob/main/src/push/push.service.ts

- TypeOrm을 사용한 정렬 문
    - 정렬, 페이징을 할때는 rawQuery보다는 typeOrm
    https://github.com/gyus13/EndTicket/blob/main/src/users/users.service.ts
    
- rawQuery를 사용한 조회 문
    - 대부분의 쿼리는 rawQuery로 작성함.

- Nginx를 이용한 Redirect, subDomain 서버 세팅
    
- main branch와 test branch를 나눈 브랜치 전략
    - test branch 에서 testServer로 운영을 하며, 클라이언트 개발자와 테스팅
    - main 실제 앱의 코드로써 test가 다끝난 기능으로 운영
