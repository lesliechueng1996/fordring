import type { GenerateTokenRes } from '@fordring/api-type';
import { BASE_URL, INTERNAL_ERROR } from './http-request';

const USER_NOT_FOUND = 10001;
const USER_DISABLE = 10002;
export const INVALID_PASSWORD = 10003;
const LOCK_USER = 10004;

const ERROR_MSG_MAP: {
  [key: number]: string;
} = {
  [USER_NOT_FOUND]: '用户不存在',
  [USER_DISABLE]: '用户已被禁用',
  [INVALID_PASSWORD]: '密码错误',
  [LOCK_USER]: '密码错误，用户已锁定',
};

export function getErrorMsg(code: number) {
  const msg = ERROR_MSG_MAP[code];
  return msg || '未知错误';
}

export async function retrieveToken(
  email: string,
  password: string,
): Promise<ApiJsonResult<unknown>> {
  try {
    const res = await fetch(`${BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data: ApiJsonResult<unknown> = await res.json();
    return data;
  } catch (e) {
    console.error(e);
    return INTERNAL_ERROR;
  }
}

export async function logout(token: string) {
  await fetch(`${BASE_URL}/auth/token`, {
    method: 'DELETE',
    headers: {
      Authentication: `Bearer ${token}`,
    },
  });
}

export async function refreshToken(refreshToken: string) {
  try {
    console.log('Real start to refresh token');
    const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
      headers: {
        'Refresh-Token': refreshToken,
      },
    });
    const { code, message, data }: ApiJsonResult<unknown> = await res.json();
    if (res.ok) {
      return data as GenerateTokenRes;
    }
    console.error(
      `Refresh token failed, status: ${res.status}, [${code}] ${message}`,
    );
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}
