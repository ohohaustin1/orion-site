// useAuth hook stub
export const useAuth = () => {
  return {
    user: null,
    isAuthenticated: false,
    loading: false,
    login: async (email: string, password: string) => {},
    logout: () => {},
  };
};
