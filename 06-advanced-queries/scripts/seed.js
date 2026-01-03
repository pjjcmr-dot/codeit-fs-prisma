import { PrismaClient } from '#generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';

const NUM_USERS_TO_CREATE = 5;

const xs = (n) => Array.from({ length: n }, (_, i) => i + 1);

const makeUserInput = () => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
});

const makePostInputsForUser = (userId, count) =>
  xs(count).map(() => ({
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    content: faker.lorem.paragraphs({ min: 2, max: 5 }, '\n\n'),
    authorId: userId,
  }));

// transaction
const resetDb = (prisma) =>
  prisma.$transaction([prisma.post.deleteMany(), prisma.user.deleteMany()]);

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

const seedPosts = async (prisma, users) => {
  const data = users
    .map((u) => ({ id: u.id, count: faker.number.int({ min: 1, max: 3 }) }))
    .flatMap(({ id, count }) => makePostInputsForUser(id, count));

  await prisma.post.createMany({ data });
};

async function main(prisma) {
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

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

main(prisma)
  .catch((e) => {
    console.error('❌ 시딩 에러:', e);
    process.exit(1); // 프로세스 종료
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
