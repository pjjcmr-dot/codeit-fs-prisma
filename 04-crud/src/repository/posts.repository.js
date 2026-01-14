import { prisma } from '#db/prisma.js';

// 게시글 생성
function createPost(data) {
  return prisma.post.create({
    data,
  });
}

// 특정 게시글 조회
function findPostById(id, include = null) {
  return prisma.post.findUnique({
    where: { id: Number(id) },
    ...(include && { include }),
  });
}

// 모든 게시글 조회
function findAllPosts(include = null) {
  return prisma.post.findMany({
    ...(include && { include }),
  });
}

// 게시글 정보 수정
function updatePost(id, data) {
  return prisma.post.update({
    where: { id: Number(id) },
    data,
  });
}

// 게시글 삭제
function deletePost(id) {
  return prisma.post.delete({
    where: { id: Number(id) },
  });
}

export const postRepository = {
  createPost,
  findPostById,
  findAllPosts,
  updatePost,
  deletePost,
};
