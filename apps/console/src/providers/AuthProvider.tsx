import { ReactNode, createContext, useReducer, useCallback, useEffect } from 'react';
import { isTokenExpired, decodeJwt } from '../utils/jwt';
import { tokenStore as apiTokenStore } from '../apis/http-request';

type JwtPayload = {
  id: string;
  nickName: string;
  avatarUrl: string | null;
  iat: number;
  exp: number;
};

type AuthContextType = {
  setTokenStore: (tokenStore: TokenStore) => void;
  accessToken: string | null;
  refreshToken: string | null;
  isLogin: boolean;
  payload: JwtPayload | null;
  avatarUrl: string | null;
  nickName: string | null;
  clearTokenStore: () => void;
};
export const AuthContext = createContext<AuthContextType | null>(null);

type TokenStore = {
  accessToken: string;
  refreshToken: string;
};

const TOKEN_STORE_CACHE_KEY = 'TOKEN_STORE';

const cachedTokenStr = localStorage.getItem(TOKEN_STORE_CACHE_KEY);
let cachedToken: TokenStore | null = null;
try {
  cachedToken = cachedTokenStr ? JSON.parse(cachedTokenStr) : null;
} catch (e) {
  console.error(e);
  cachedToken = null;
}

type Props = {
  children: ReactNode;
};

enum Action {
  SET_TOKEN_STORE,
  CLEAR_TOKEN_STORE,
}

type TokenStoreAction =
  | {
      type: Action.SET_TOKEN_STORE;
      payload: TokenStore;
    }
  | {
      type: Action.CLEAR_TOKEN_STORE;
    };

const reducer = (state: TokenStore | null, action: TokenStoreAction): TokenStore | null => {
  const { type } = action;
  switch (type) {
    case Action.SET_TOKEN_STORE:
      return action.payload;
    case Action.CLEAR_TOKEN_STORE:
      return null;
    default:
      return state;
  }
};

const AuthProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, cachedToken);

  const setTokenStore = useCallback(
    (tokenStore: TokenStore) => {
      dispatch({
        type: Action.SET_TOKEN_STORE,
        payload: tokenStore,
      });
    },
    [dispatch]
  );

  const accessToken = state?.accessToken || null;

  const refreshToken = state?.refreshToken || null;

  const isLogin = !!state || !isTokenExpired(refreshToken);

  const payload: JwtPayload | null = decodeJwt(accessToken);

  const avatarUrl = payload?.avatarUrl || null;

  const nickName = payload?.nickName || null;

  const clearTokenStore = useCallback(() => {
    dispatch({
      type: Action.CLEAR_TOKEN_STORE,
    });
  }, [dispatch]);

  apiTokenStore.accessToken = accessToken;
  apiTokenStore.refreshToken = refreshToken;
  apiTokenStore.setTokenStore = setTokenStore;
  apiTokenStore.clearTokenStore = clearTokenStore;

  const cacheTokenStore = useCallback(() => {
    localStorage.setItem(TOKEN_STORE_CACHE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    window.addEventListener('beforeunload', cacheTokenStore);
    return () => {
      window.removeEventListener('beforeunload', cacheTokenStore);
    };
  }, [cacheTokenStore]);

  return (
    <AuthContext.Provider
      value={{
        setTokenStore,
        accessToken,
        refreshToken,
        isLogin,
        payload,
        avatarUrl,
        nickName,
        clearTokenStore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
