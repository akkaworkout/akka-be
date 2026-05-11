## AKKA WORKOUT
# AKKA Backend

운동 이용권, 출석, 소비 데이터를 관리하고 분석하는 웹 서비스 AKKA의 백엔드 서버입니다.  
프론트엔드와 백엔드 간 데이터 흐름을 이해하고, 실제 서비스에서 필요한 회원 인증 및 데이터 관리 API를 구성하기 위해 개발했습니다.

---

## 주요 기능

- 회원가입 / 로그인
- 이메일 중복 확인
- 닉네임 중복 확인
- JWT 기반 인증
- 비밀번호 암호화
- 사용자 정보 관리
- 운동 이용권 데이터 관리
- 운동 기록 / 출석 / 노쇼 데이터 관리
- 지출 데이터 관리
- 프론트엔드와 연동되는 REST API 제공

---

## 기술 스택

### Backend

- Node.js
- Express
- JavaScript

### Database

- MySQL

### Auth / Security

- JWT
- bcryptjs

### API / Tools

- REST API
- Swagger
- Git / GitHub
- Cloudtype

---

## 담당 및 구현 내용

- Node.js와 Express 기반 백엔드 서버 구성
- MySQL 데이터베이스 연결 및 API 데이터 처리
- 회원가입 / 로그인 API 구현
- 이메일 및 닉네임 중복 확인 API 구현
- bcryptjs를 활용한 비밀번호 암호화 처리
- JWT 기반 accessToken 발급 및 인증 흐름 구현
- 프론트엔드 요청에 맞춘 REST API 응답 구조 정리
- Swagger를 활용한 API 명세 확인 및 프론트엔드 연동 지원
- Cloudtype 환경에서 배포 서버 연결 및 API 테스트 진행

---

## API 구성

### Auth

- 회원가입 API
- 로그인 API
- 이메일 중복 확인 API
- 닉네임 중복 확인 API
- JWT 인증 처리

### User

- 사용자 정보 조회
- 사용자 정보 수정
- 프로필 이미지 및 목표 예산 / 운동 횟수 관련 데이터 처리

### Tickets

- 운동 이용권 조회
- 운동 이용권 등록
- 운동 이용권 상태 관리
- 잔여 횟수 및 환불 관련 데이터 처리

### Records

- 운동 기록 조회
- 운동 출석 기록 등록
- 노쇼 기록 관리
- 운동 유형별 기록 관리

### Expenses

- 지출 데이터 조회
- 지출 데이터 등록
- 운동 식품 / 운동 용품 등 지출 카테고리 관리

> 자세한 API 경로와 요청 / 응답 형식은 Swagger 문서를 기준으로 확인할 수 있습니다.

---

## 환경 변수

`.env` 파일에 아래 값들을 설정합니다.

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=akka

JWT_SECRET=your_jwt_secret
.env 파일은 보안상 GitHub에 업로드하지 않습니다.
실행 방법
npm install
npm run dev
또는
npm start
프로젝트 구조
src
├── config
├── controllers
├── middlewares
├── routes
├── services
├── models
└── server.js
실제 폴더 구조는 구현 상황에 따라 일부 다를 수 있습니다.
프론트엔드 연동
프론트엔드에서는 Swagger API 명세를 참고하여 백엔드 REST API를 연결했습니다.
로그인 성공 시 발급받은 JWT accessToken을 localStorage에 저장하고, 인증이 필요한 요청에서는 Authorization 헤더에 토큰을 포함해 API를 호출했습니다.
Authorization: Bearer <accessToken>
프론트엔드와 연동하면서 실제 응답 구조에 맞춰 데이터 필드명을 확인하고, 화면에서 필요한 형태로 응답을 사용할 수 있도록 API 흐름을 맞춰갔습니다.
프로젝트를 통해 배운 점
Express 기반 REST API 서버 구조
MySQL과 백엔드 서버 간 데이터 흐름
JWT 인증 방식과 accessToken 발급 흐름
bcryptjs를 활용한 비밀번호 암호화 방식
프론트엔드에서 필요한 API 응답 구조를 고려하는 방법
API 명세와 실제 응답을 맞춰가며 프론트엔드와 통합 디버깅하는 과정
프론트엔드와 백엔드를 함께 이해하면 API 연동 문제를 더 빠르게 파악할 수 있다는 점
