import API from "./api";

const AuthService = {
  login: (payload: { email: string; password: string }) => {
    return API.post("auth/login", payload);
  },
  register: (payload: {
    email: string;
    password1: string;
    password2: string;
  }) => {
    return API.post("user", payload);
  },

  refreshAccessToken: (payload: { token: string }) => {
    return API.post("auth/refresh-access-token", payload);
  },

  logout: (accessToken: string) => {
    return API.delete("auth/logout", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  verifyEmail: (token: string) => {
    return API.put(`user/verify-email/${token}`);
  },

  resetPassword: (payload: { email: string }) => {
    return API.post("user/reset-password", payload);
  },

  confirmResetPassword: (
    token: string,
    payload: { password1: string; password2: string }
  ) => {
    return API.put(`user/password/${token}`, payload);
  },
};

export default AuthService;
