import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { getCurrentUser } from "@/features/auth/api/getCurrentUser";
import { getTokenCookie, removeTokenCookie } from "@/lib/axios";
import type { IAuthState, IUser } from "@/types/auth.types";

const initialState: IAuthState = {
  token: null,
  user: null,
  isLoading: true,
};

export const hydrateAuth = createAsyncThunk(
  "auth/hydrateAuth",
  async (): Promise<{ token: string; user: IUser } | null> => {
    const token = getTokenCookie();

    if (!token) {
      return null;
    }

    try {
      const user = await getCurrentUser(token);
      
      return { token, user };
    } catch {
      removeTokenCookie();
      throw new Error("Failed to hydrate auth");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: IUser }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoading = false;
    },
    authLogout: (state) => {
      state.token = null;
      state.user = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        if (!action.payload) {
          state.token = null;
          state.user = null;
          state.isLoading = false;
          return;
        }

        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isLoading = false;
      })
      .addCase(hydrateAuth.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.isLoading = false;
      });
  },
});

export const { authLogout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
