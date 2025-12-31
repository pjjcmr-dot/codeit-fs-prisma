# Prisma Blog - Setup

2-1. Setup 강의를 따라 만든 초기 프로젝트 구조입니다.

## 프로젝트 구조

```
prisma-blog/
├── prisma/
│   └── schema.prisma       # Prisma 스키마
├── env/
│   ├── .env.example        # 환경 변수 템플릿
│   ├── .env.development    # 개발 환경 설정
│   └── .env.production     # 프로덕션 환경 설정
├── src/
│   ├── config/
│   │   └── config.js       # 환경 변수 검증 (Zod)
│   ├── db/
│   │   └── prisma.js       # Prisma Client + Adapter 설정
│   └── server.js           # Express 서버
├── generated/
│   └── prisma/             # 생성된 Prisma Client (자동)
├── prisma.config.js        # Prisma 설정
├── jsconfig.json           # VS Code IntelliSense 설정
├── .prettierrc             # Prettier 설정
├── eslint.config.js        # ESLint 설정
├── .gitignore
└── package.json
```

## 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. PostgreSQL에서 데이터베이스 생성
psql
CREATE DATABASE prisma_blog;
\q

# 3. 환경 변수 파일 설정
cp env/.env.example env/.env.development
# env/.env.development 파일을 열어 DATABASE_URL 수정
# DATABASE_URL="postgresql://username:password@localhost:5432/prisma_blog"

# 4. 개발 서버 실행
npm run dev
```

## 주요 특징

- **Prisma 7**: 최신 Prisma ORM (prisma-client provider, output 필수)
- **Adapter 패턴**: PostgreSQL 연결을 위한 @prisma/adapter-pg
- **환경별 설정**: development/production 분리 (env/ 폴더)
- **Zod 검증**: 환경 변수 타입 검증 및 안전성 확보
- **Path Aliases**: `#generated`, `#config`, `#db` 사용
- **Node.js 22+**: 네이티브 `--env-file` 지원 (Node.js 앱용)
- **dotenv-cli**: Prisma CLI 명령어에 환경 변수 주입
- **ESM**: ES Module 방식 (import/export)
- **코드 품질**: ESLint + Prettier 설정 완료

## 주요 Scripts

```bash
npm run dev              # 개발 서버 실행
npm run prod             # 프로덕션 서버 실행
npm run prisma:migrate   # 마이그레이션 실행
npm run prisma:studio    # Prisma Studio 실행
npm run prisma:generate  # Prisma Client 재생성
npm run format           # 코드 포맷팅
npm run format:check     # 포맷팅 확인
```
