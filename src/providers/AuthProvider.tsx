import { ReactNode, createContext, useReducer, useCallback, useEffect } from 'react';
import { isTokenExpired } from '../utils/jwt';

type AuthContextType = {
  setTokenStore: (tokenStore: TokenStore) => void;
  accessToken: () => string | null;
  refreshToken: () => string | null;
  isLogin: () => boolean;
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
}

type TokenStoreAction = {
  type: Action;
  payload: TokenStore;
};

const reducer = (state: TokenStore | null, action: TokenStoreAction): TokenStore | null => {
  const { type, payload } = action;
  switch (type) {
    case Action.SET_TOKEN_STORE:
      return payload;
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

  const accessToken = () => state?.accessToken || null;

  const refreshToken = () => state?.refreshToken || null;

  const isLogin = () => !!state || !isTokenExpired(refreshToken() || '');

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
