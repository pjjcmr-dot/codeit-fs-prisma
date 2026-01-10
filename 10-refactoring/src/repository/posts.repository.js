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

// 트랜잭션: 게시글과 댓글 안전하게 삭제
async function deleteWithComments(postId) {
  return await prisma.$transaction(async (tx) => {
    // 1. 댓글 수 확인 (로깅용)
    const commentCount = await tx.comment.count({
      where: { postId: Number(postId) },
    });

    // 2. 댓글 삭제
    await tx.comment.deleteMany({
      where: { postId: Number(postId) },
    });

    // 3. 게시글 삭제
    const deletedPost = await tx.post.delete({
      where: { id: Number(postId) },
    });

    return {
      deletedPost,
      deletedCommentsCount: commentCount,
    };
  });
}

// 트랜잭션: 게시글과 첫 댓글 함께 생성
async function createWithComment(authorId, postData, commentContent) {
  return await prisma.$transaction(async (tx) => {
    // 1. 게시글 생성
    const post = await tx.post.create({
      data: {
        ...postData,
        authorId: Number(authorId),
      },
    });

    // 2. 첫 댓글 생성
    const comment = await tx.comment.create({
      data: {
        content: commentContent,
        authorId: Number(authorId),
        postId: post.id,
      },
    });

    return {
      post,
      comment,
    };
  });
}

// 트랜잭션: 여러 게시글 일괄 생성 (배치 작업)
async function createMultiple(posts) {
  return await prisma.$transaction(
    posts.map((post) =>
      prisma.post.create({
        data: {
          title: post.title,
          content: post.content,
          published: post.published ?? false,
          authorId: Number(post.authorId),
        },
      }),
    ),
  );
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
  deleteWithComments,
  createWithComment,
  createMultiple,
};
