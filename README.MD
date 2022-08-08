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
- MySQL
- Nginx
- EC2, RDS
- FCM, KAKAO, APPLE, Google developer 써드파티

### 담당업무

- 로그인(카카오,애플,구글 소셜로그인 구현)
    - 카카오, 애플, 구글 써드파티를 사용해서 AOS, IOS 각각 소셜로그인 구현
    https://github.com/gyus13/EndTicket/blob/main/src/auth/auth.service.ts
    
- 스케쥴러를 이용한 주간미션 업데이트
    

- TypeOrm, rawQuery를 같이 사용하여 Query문 구성
    

- EC2, RDS로 클라우드 환경 구성
- Nginx를 이용한 Redirect, subDomain 서버 세팅
- main branch와 test branch를 나눈 브랜치 전략
