let token: string | null = null;

export const setAuthToken = (t: string | null) => {
  token = t;
};

export const getAuthToken = () => token;
