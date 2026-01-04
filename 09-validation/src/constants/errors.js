// Prisma 에러 코드 상수
export const PRISMA_ERROR = {
  UNIQUE_CONSTRAINT: 'P2002',
  RECORD_NOT_FOUND: 'P2025',
};

// 에러 메시지 상수
export const ERROR_MESSAGE = {
  // User 관련
  USER_NOT_FOUND: 'User not found',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  FAILED_TO_FETCH_USERS: 'Failed to fetch users',
  FAILED_TO_FETCH_USER: 'Failed to fetch user',
  FAILED_TO_CREATE_USER: 'Failed to create user',
  FAILED_TO_UPDATE_USER: 'Failed to update user',
  FAILED_TO_DELETE_USER: 'Failed to delete user',

  // Post 관련
  POST_NOT_FOUND: 'Post not found',
  TITLE_REQUIRED: 'Title is required',
  AUTHOR_ID_REQUIRED: 'Author ID is required',
  SEARCH_QUERY_REQUIRED: 'Search query is required',
  FAILED_TO_FETCH_POSTS: 'Failed to fetch posts',
  FAILED_TO_FETCH_POST: 'Failed to fetch post',
  FAILED_TO_CREATE_POST: 'Failed to create post',
  FAILED_TO_UPDATE_POST: 'Failed to update post',
  FAILED_TO_DELETE_POST: 'Failed to delete post',
  FAILED_TO_SEARCH_POSTS: 'Failed to search posts',
  FAILED_TO_FETCH_PUBLISHED_POSTS: 'Failed to fetch published posts',
  FAILED_TO_FETCH_USER_WITH_POSTS: 'Failed to fetch user with posts',
  FAILED_TO_DELETE_POST_WITH_COMMENTS: 'Failed to delete post with comments',
  FAILED_TO_CREATE_POST_WITH_COMMENT: 'Failed to create post with comment',
  FAILED_TO_CREATE_MULTIPLE_POSTS: 'Failed to create multiple posts',
  POSTS_ARRAY_REQUIRED: 'Posts array is required',
  INVALID_POSTS_ARRAY: 'Posts must be an array',

  // Auth 관련
  NO_AUTH_TOKEN: 'No authentication token provided',
  INVALID_TOKEN: 'Invalid or expired token',
  USER_NOT_FOUND_FROM_TOKEN: 'User not found from token',
  AUTH_FAILED: 'Authentication failed',
  INVALID_CREDENTIALS: 'Invalid email or password',

  // Validation
  INVALID_INPUT: 'Invalid input',
  VALIDATION_FAILED: 'Validation failed',
};
