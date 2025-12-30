# Prisma Blog - Setup

2-1. Setup 강의를 따라 만든 초기 프로젝트 구조입니다.

## 프로젝트 구조

```
prisma-blog/
├── prisma/
│   └── schema.prisma       # Prisma 스키마
├── src/
│   ├── db/
│   │   └── prisma.js       # Prisma Client + Adapter 설정
│   └── server.js           # Express 서버
├── prisma.config.ts        # Prisma 설정 (선택사항)
├── .env                    # 환경 변수
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

# 3. .env 파일에서 DATABASE_URL 설정
# DATABASE_URL="postgresql://username:password@localhost:5432/prisma_blog"

# 4. 개발 서버 실행
npm run dev
```

## 주요 특징

- **Prisma 7**: 최신 Prisma ORM 사용
- **Adapter 패턴**: PostgreSQL 연결을 위한 @prisma/adapter-pg
- **Node.js 22+**: 네이티브 .env 지원 (dotenv 불필요)
- **ESM**: ES Module 방식 (import/export)
- **코드 품질**: ESLint + Prettier 설정 완료
