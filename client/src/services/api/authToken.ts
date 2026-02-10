type AccessTokenProvider = () => Promise<string | null | undefined>;

let accessTokenProvider: AccessTokenProvider | null = null;

export const setAccessTokenProvider = (provider: AccessTokenProvider) => {
  accessTokenProvider = provider;
};

export const getAccessToken = async (): Promise<string | null> => {
  if (!accessTokenProvider) {
    return localStorage.getItem('auth_token');
  }
  const token = await accessTokenProvider();
  return token ?? null;
};

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = await getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
