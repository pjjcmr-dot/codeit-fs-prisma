import express from 'express';
import { prisma } from './db/prisma.js';
import { config } from '#config';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Prisma!');
});

app.listen(config.PORT, () => {
  console.log(
    `[${config.NODE_ENV}] Server running at http://localhost:${config.PORT}`,
  );
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
