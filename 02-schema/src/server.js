import express from 'express';
import { prisma } from './db/prisma.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Prisma!');
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});

// 앱 종료 시 Prisma 연결 정리
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
