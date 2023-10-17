export const SUCCESS = 0;

export const INTERNAL_SERVER_ERROR = 999;

// AUTH
export const AUTH_ERROR = {
  USER_NOT_FOUND: 10001,
  USER_DISABLED: 10002,
  INVALID_PASSWORD: 10003,
  LOCK_USER: 10004,
  INVALID_REFRESH_TOKEN: 10005,
};

// CATEGORY
export const CATEGORY_ERROR = {
  CATEGORY_ALREADY_EXIST: 20001,
  CREATE_CATEGORY_FAILED: 20002,
  CATEGORY_NOT_FOUND: 20003,
  CATEGORY_VERSION_CONFLICT: 20004,
  UPDATE_CATEGORY_FAILED: 20005,
};

// ALBUM
export const ALBUM_ERROR = {
  ALBUM_DISPLAY_NAME_ALREADY_EXIST: 30001,
  ALBUM_FOLDER_NAME_ALREADY_EXIST: 30002,
  ALBUM_CREATE_FAILED: 30003,
  ALBUM_NOT_FOUND: 30004,
  ALBUM_VERSION_CONFLICT: 30005,
  UPDATE_ALBUM_FAILED: 30006,
  ALBUM_HAS_PICTURE: 30007,
};

// PICTURE
export const PICTURE_ERROR = {};

// TAG
export const TAG_ERROR = {
  TAG_ALREADY_EXIST: 50001,
  CREATE_TAG_FAILED: 50002,
  UPDATE_TAG_FAILED: 50003,
  TAG_VERSION_CONFLICT: 50004,
};
