import { isTokenWillExpired } from '../utils/jwt';
import {
  GenerateTokenRes,
  refreshToken as invokeRefreshToken,
} from './auth-api';

export const BASE_URL = 'http://localhost:3000/api';

export const API_OK = 0;

export const INTERNAL_ERROR = {
  code: 9999,
  message: '系统异常',
  data: null,
};

export const tokenStore: {
  accessToken: string | null;
  refreshToken: string | null;
  setTokenStore: ((tokenStore: GenerateTokenRes) => void) | null;
  clearTokenStore: (() => void) | null;
} = {
  accessToken: '',
  refreshToken: '',
  setTokenStore: null,
  clearTokenStore: null,
};

let refreshTokenPromise: Promise<GenerateTokenRes | null> | null = null;

type RejectReasonType = {
  code: number;
  message: string;
  status?: number;
  data?: unknown;
};

export function sendOneRequest(
  url: string,
  options: RequestInit
): Promise<ApiJsonResult<unknown>> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(url, options);
      const json = await res.json();
      if (res.ok) {
        resolve(json);
        return;
      }
      if (res.status === 400) {
        reject({
          status: res.status,
          ...json,
          message: '请求参数错误',
        });
        return;
      }
      reject({
        status: res.status,
        ...json,
      });
    } catch (e) {
      console.error(e);
      reject({
        status: INTERNAL_ERROR.code,
        ...INTERNAL_ERROR,
      });
    }
  });
}

function fillOption(accessToken: string, options?: RequestInit) {
  return {
    ...options,
    headers: {
      ...options?.headers,
      'Content-Type': 'application/json',
      Authentication: `Bearer ${accessToken}`,
    },
  };
}

function retryRequest(
  refreshToken: string,
  resolve: (data: ApiJsonResult<unknown>) => void,
  reject: (reason: RejectReasonType) => void,
  path: string,
  options: RequestInit | undefined,
  setTokenStore: ((tokenStore: GenerateTokenRes) => void) | null,
  clearTokenStore: (() => void) | null
) {
  console.log('Start to refresh token');
  if (refreshTokenPromise === null) {
    console.log('First time to refresh token');
    refreshTokenPromise = invokeRefreshToken(refreshToken);
  }
  refreshTokenPromise.then((newTokenStore) => {
    if (newTokenStore === null) {
      console.log('Refresh token failed, clear token store');
      reject({
        code: 401,
        message: '请重新登录',
      });
      clearTokenStore && clearTokenStore();
      return;
    }

    const optionsClone = fillOption(newTokenStore.accessToken, options);
    console.log(
      'Refresh token success, retry request',
      path,
      optionsClone,
      newTokenStore
    );
    sendOneRequest(`${BASE_URL}${path}`, optionsClone).then(resolve, reject);
    setTokenStore && setTokenStore(newTokenStore);
  });

  refreshTokenPromise.finally(() => {
    console.log('Clear refresh token promise');
    refreshTokenPromise = null;
  });
}

export function sendRequest(
  path: string,
  options?: RequestInit
): Promise<ApiJsonResult<unknown>> {
  const { accessToken, refreshToken, setTokenStore, clearTokenStore } =
    tokenStore;

  console.log(
    'Start to send request',
    path,
    options,
    accessToken,
    refreshToken
  );

  return new Promise((resolve, reject) => {
    if (!accessToken || !refreshToken) {
      reject({
        code: 401,
        message: '请先登录',
      });
      return;
    }

    if (isTokenWillExpired(accessToken)) {
      console.log('Token will expired');
      retryRequest(
        refreshToken,
        resolve,
        reject,
        path,
        options,
        setTokenStore,
        clearTokenStore
      );
      return;
    }

    const optionsClone = fillOption(accessToken, options);
    console.log('Send request', path, optionsClone);
    sendOneRequest(`${BASE_URL}${path}`, optionsClone).then(
      resolve,
      (reason) => {
        console.log('Request failed', reason);
        if (reason.status === 401) {
          console.log('Token expired');
          retryRequest(
            refreshToken,
            resolve,
            reject,
            path,
            options,
            setTokenStore,
            clearTokenStore
          );
        } else {
          reject(reason);
        }
      }
    );
  });
}
