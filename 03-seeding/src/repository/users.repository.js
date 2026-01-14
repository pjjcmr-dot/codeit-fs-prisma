import { prisma } from '#db/prisma.js';

// 사용자 생성
function createUser(data) {
  return prisma.user.create({
    data,
  });
}

// 특정 사용자 조회
function findUserById(id) {
  return prisma.user.findUnique({
    where: { id: Number(id) },
  });
}

// 모든 사용자 조회
function findAllUsers() {
  return prisma.user.findMany();
}

// 사용자 정보 수정
function updateUser(id, data) {
  return prisma.user.update({
    where: { id: Number(id) },
    data,
  });
}

// 사용자 삭제
function deleteUser(id) {
  return prisma.user.delete({
    where: { id: Number(id) },
  });
}

export const userRepository = {
  createUser,
  findUserById,
  findAllUsers,
  updateUser,
  deleteUser,
};
