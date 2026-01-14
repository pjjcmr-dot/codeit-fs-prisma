// Prisma 에러 코드 상수
export const PRISMA_ERROR = {
  UNIQUE_CONSTRAINT: 'P2002', // Unique constraint 위반
  RECORD_NOT_FOUND: 'P2025', // 레코드를 찾을 수 없음
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
};
