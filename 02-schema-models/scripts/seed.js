console.log('seed...');

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { faker } from '@faker-js/faker';

const NUM_USERS_TO_CREATE = 5;

// 헬퍼 함수: 1부터 n까지의 배열 생성
const xs = (n) => Array.from({ length: n }, (_, i) => i + 1);

// 유저 데이터 생성 함수
const makeUserInput = () => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
});

// 포스트 데이터 생성 함수
const makePostInputsForUser = (userId, count) =>
  xs(count).map(() => ({
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    content: faker.lorem.paragraphs({ min: 2, max: 5 }, '\n\n'),
    authorId: userId,
  }));

// 트랜잭션으로 기존 데이터 삭제, 트랜잭션이 무엇인지 알고 싶으면 2-7로 가시면 됩니다.
const resetDb = (prisma) =>
  prisma.$transaction([prisma.post.deleteMany(), prisma.user.deleteMany()]);

// 유저 시딩
const seedUsers = async (prisma, count) => {
  const data = xs(count).map(makeUserInput);
  const emails = data.map((u) => u.email);

  // createMany는 생성된 레코드를 반환하지 않아서, 결과 조회를 한 번 더 합니다.
  await prisma.user.createMany({ data });
  return prisma.user.findMany({
    where: { email: { in: emails } },
    select: { id: true },
  });
};

// 포스트 시딩
const seedPosts = async (prisma, users) => {
  const data = users
    .map((u) => ({
      id: u.id,
      count: faker.number.int({ min: 1, max: 3 }),
    }))
    .flatMap(({ id, count }) => makePostInputsForUser(id, count));
  await prisma.post.createMany({ data });
};

async function main(prisma) {
  // 프로덕션 환경 체크
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('⚠️  프로덕션 환경에서는 시딩을 실행하지 않습니다');
  }

  console.log('🌱 시딩 시작...');

  await resetDb(prisma);
  console.log('✅ 기존 데이터 삭제 완료');

  const users = await seedUsers(prisma, NUM_USERS_TO_CREATE);
  await seedPosts(prisma, users);

  console.log(`✅ ${users.length}명의 유저가 생성되었습니다`);
  console.log('✅ 데이터 시딩 완료');
}

// Prisma Client 설정
import pkg from 'pg';
const { Pool } = pkg;

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

main(prisma)
  .catch((e) => {
    console.error('❌ 시딩 에러:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
