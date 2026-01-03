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

// 1. 검색 기능
function searchPosts(search) {
  return prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          author: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ],
    },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
}

// 2. 페이지네이션
async function getPostsWithPagination(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    }),
    prisma.post.count(),
  ]);

  return {
    posts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      hasNext: page < Math.ceil(totalCount / limit),
      hasPrev: page > 1,
    },
  };
}

// 3. 공개 게시글만 조회
function getPublishedPosts() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
}

export const postRepository = {
  createPost,
  findPostById,
  findAllPosts,
  updatePost,
  deletePost,
  searchPosts,
  getPostsWithPagination,
  getPublishedPosts,
};
