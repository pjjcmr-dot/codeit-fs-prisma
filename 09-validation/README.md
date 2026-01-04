# Prisma Blog - Schema Models

2-2. Prisma 스키마: 모델과 관계 정의하기 강의의 결과물입니다.

## 프로젝트 구조

```
prisma-blog/
├── prisma/
│   ├── schema.prisma       # User와 Post 모델 정의
│   └── migrations/         # 마이그레이션 파일 (실행 후 생성)
├── env/
│   ├── .env.example
│   ├── .env.development
│   └── .env.production
├── src/
│   ├── config/
│   │   └── config.js
│   ├── db/
│   │   └── prisma.js
│   └── server.js
├── generated/
│   └── prisma/             # 생성된 Prisma Client (실행 후 생성)
├── prisma.config.js
├── jsconfig.json
├── .prettierrc
├── eslint.config.js
├── .gitignore
└── package.json
```

## 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp env/.env.example env/.env.development
# env/.env.development 파일을 열어 DATABASE_URL 수정

# 3. Prisma Client 생성
npm run prisma:generate

# 4. 마이그레이션 실행
npm run prisma:migrate
# 마이그레이션 이름 입력: init

# 5. 개발 서버 실행
npm run dev

# 6. (선택) Prisma Studio로 데이터베이스 확인
npm run prisma:studio
```

## 주요 변경사항 (01-setup → 02-schema-models)

### 1. schema.prisma에 모델 추가

**User 모델:**

- `id`: Primary Key (자동 증가)
- `email`: 중복 불가
- `name`: 선택적 필드
- `posts`: Post 모델과의 관계 (1:N)
- `createdAt`, `updatedAt`: 자동 타임스탬프

**Post 모델:**

- `id`: Primary Key (자동 증가)
- `title`: 게시글 제목
- `content`: 게시글 내용 (선택적)
- `published`: 공개 여부 (기본값: false)
- `author`, `authorId`: User 모델과의 관계
- `createdAt`, `updatedAt`: 자동 타임스탬프

### 2. 관계 설정 (1:N)

```prisma
// User: 한 명의 사용자가 여러 게시글 작성
model User {
  posts Post[]  // Post 배열
}

// Post: 각 게시글은 한 명의 작성자
model Post {
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
}
```

## 마이그레이션

마이그레이션 실행 시 다음이 생성됩니다:

- `prisma/migrations/` 폴더
- `20YYMMDDHHMMSS_init/` 마이그레이션 폴더
- SQL 파일 (CREATE TABLE 명령어)

## 주요 명령어

```bash
npm run prisma:generate  # Prisma Client 생성
npm run prisma:migrate   # 마이그레이션 생성 및 적용
npm run prisma:studio    # Prisma Studio 실행
npm run dev              # 개발 서버 실행
```

## 다음 단계

이제 데이터베이스 테이블이 생성되었습니다. 다음 강의에서는:

- 마이그레이션의 동작 원리 학습
- 시딩(Seeding)으로 테스트 데이터 생성
- Prisma Client로 CRUD 작업 수행
