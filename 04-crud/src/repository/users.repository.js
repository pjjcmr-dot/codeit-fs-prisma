import { prisma } from '#db/prisma.js';

function createUser(data) {
  return prisma.user.create({
    data,
  });
}

function findUserById(id) {
  return prisma.user.findUnique({
    where: { id: Number(id) },
  });
}

function findAllUsers() {
  return prisma.user.findMany();
}

function updateUser(id, data) {
  return prisma.user.update({
    where: { id: Number(id) },
    data,
  });
}

function deleteUser(id) {
  return prisma.user.delete({
    where: { id: Number(id) },
  });
}

// 사용자와 게시글 함께 조회
function findUserWithPosts(id) {
  return prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
      posts: true,
    },
  });
}

// 모든 사용자와 게시글 함께 조회
function findAllUsersWithPosts() {
  return prisma.user.findMany({
    include: {
      posts: true,
    },
  });
}

export const usersRepository = {
  createUser,
  findUserById,
  findAllUsers,
  updateUser,
  deleteUser,
  findUserWithPosts,
  findAllUsersWithPosts,
};
