export enum ErrorCode {
  // Success (0)
  SUCCESS = 0,

  // Auth errors (1000-1999)
  IS_REQUIRED = 1000,
  USER_ALREADY_EXISTS = 1001,
  USER_NOT_VERIFIED = 1002,
  INVALID_EMAIL = 1003,
  INVALID_PASSWORD = 1004,
  INVALID_PHONE = 1005,
  USER_NOT_FOUND = 1006,
  OTP_EXPIRED = 1007,
  OTP_INVALID = 1008,
  OTP_REQUIRED = 1009,
  EMAIL_REQUIRED = 1010,
  MISSING_FIELDS = 1011,
  USER_EXISTS = 1012,
  TOKEN_GENERATION_FAILED = 1013,
  UNAUTHORIZED = 1014,
  TOKEN_INVALID = 1015,
  TOKEN_EXPIRED = 1016,
  NOT_FOUND = 1017,
  FORBIDDEN = 1018,
  POLICY_ALREADY_EXISTS = 1019,
  POLICY_NOT_FOUND = 1020,
  CATEGORY_ALREADY_EXISTS = 1021,
  CATEGORY_NOT_FOUND = 1022,
  SERVER_ERROR = 5000,
  EMAIL_SEND_FAILED = 5001,
  DATABASE_ERROR = 5002,
}
