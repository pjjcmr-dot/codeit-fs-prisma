import { z } from 'zod';

// ID 파라미터 검증 스키마
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive({
    message: 'ID는 양수여야 합니다.',
  }),
});

// 페이지네이션 쿼리 스키마
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// 검색 쿼리 스키마
export const searchQuerySchema = z.object({
  q: z.string().min(1, '검색어를 입력해주세요.'),
});

// 게시글 생성 스키마
export const createPostSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다.'),
  content: z.string().optional(),
  published: z.boolean().default(false),
});

// 게시글 수정 스키마
export const updatePostSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다.').optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
});

// 게시글과 댓글 함께 생성 스키마
export const createPostWithCommentSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다.'),
  content: z.string().optional(),
  commentContent: z.string().min(1, '댓글 내용은 필수입니다.'),
});

// 여러 게시글 일괄 생성 스키마
export const batchCreatePostsSchema = z.object({
  posts: z
    .array(
      z.object({
        title: z.string().min(1, '제목은 필수입니다.'),
        content: z.string().optional(),
        published: z.boolean().default(false),
        authorId: z.coerce.number().int().positive({
          message: '작성자 ID는 양수여야 합니다.',
        }),
      }),
    )
    .min(1, '최소 1개의 게시글이 필요합니다.'),
});
