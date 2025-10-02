import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthState } from "../../types";
import { authService } from "../../services/authService";

const loadInitialAuthState = (): AuthState => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      return {
        user: JSON.parse(userStr),
        token,
        isLoading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error("Error loading auth state:", error);
  }

  return {
    user: null,
    token: null,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = loadInitialAuthState();

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }) => {
    const response = await authService.login(credentials);

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    return response;
  }
);

// export const googleLoginUser = createAsyncThunk(
//   "auth/googleLogin",
//   async () => {
//     const response = await authService.googleLogin();
//     localStorage.setItem("token", response.token);
//     localStorage.setItem("user", JSON.stringify(response.user));
//     console.log("googleLogin resonse", response);
//     return response;
//   }
// );

// export const logoutUser = createAsyncThunk("auth/logout", async () => {
//   await authService.logout();
// });

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.clear();
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.error = null;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login failed";
      })
      // .addCase(googleLoginUser.fulfilled, (state, action) => {
      //   state.user = action.payload.user;
      //   state.token = action.payload.token;
      // });
    // .addCase(logoutUser.fulfilled, (state) => {
    //   state.user = null;
    //   state.token = null;
    // });
  },
});

export const { clearError, logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
