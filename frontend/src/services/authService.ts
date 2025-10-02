import api from "./api";
import { API_URL } from "./api";
import type { User, LoginCredentials, AuthResponse } from "../types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/login", credentials);
    const { user, access_token } = response.data.data;
    const authResponse = {
      token: access_token,
      user: user
    };

    return authResponse;
  },

  googleLogin: () => {
    window.location.href = `${API_URL}/api/auth/google`;
  },

  logout: async (): Promise<void> => {
    await api.post("/api/auth/logout");
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get("/api/auth/profile");
    return response.data;
  },
};
