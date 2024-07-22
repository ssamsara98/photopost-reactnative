import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';

import { Sig, User } from '@/@types/server';
import { getProfileServer, refreshTokensServer, serverLogin } from '@/api/server';
import { catchServerApiErr } from '@/lib/serverApi';
import { deleteData, storeData } from '@/utils/storage.helper';

import { AsyncStatus, RootState } from '../store';

const initialState: {
  status: AsyncStatus;
  error: any;
  isLogin: boolean;
  signature: Sig;

  userStatus: AsyncStatus;
  userError: any;
  user: User | null;
} = {
  status: 'idle',
  error: null,
  isLogin: false,
  signature: {
    tokenType: '',
    accessToken: '',
    refreshToken: '',
  },
  userStatus: 'idle',
  userError: null,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLogin = action.payload.isLogin;
      state.signature = action.payload.signature;
    },
  },
  extraReducers(builder) {
    builder
      // login
      .addCase(loginRdx.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginRdx.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.isLogin = true;
        state.signature = action.payload.result;
        storeData('auth', { signature: action.payload.result, isLogin: true });
      })
      .addCase(loginRdx.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error;
      })

      // logout
      .addCase(authLogout.fulfilled, (state) => {
        state.isLogin = false;
        state.signature = { tokenType: '', accessToken: '', refreshToken: '' };
      })

      // renew tokens
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.signature = action.payload.result;
      })
      .addCase(refreshTokens.rejected, (state) => {
        state.isLogin = false;
        state.signature = { tokenType: '', accessToken: '', refreshToken: '' };
      })

      // user
      .addCase(fetchProfileRdx.pending, (state) => {
        state.userStatus = 'loading';
      })
      .addCase(fetchProfileRdx.fulfilled, (state, action) => {
        state.userStatus = 'fulfilled';
        state.user = action.payload.result;
      })
      .addCase(fetchProfileRdx.rejected, (state, action) => {
        state.userStatus = 'rejected';
        state.userError = action.error;
      });
  },
});

export const selectAuthReducer = (state: RootState) => state.auth;
export const selectAuthReducerSafe = createSelector(selectAuthReducer, (auth) => auth);

export const loginRdx = createAsyncThunk(
  `${authSlice.name}/login`,
  async ({ userSession, password }: { userSession: string; password: string }) => {
    try {
      const resp = await serverLogin(userSession, password);
      return resp.data;
    } catch (err) {
      throw catchServerApiErr(err);
    }
  },
);

export const authLogout = createAsyncThunk(`${authSlice.name}/logout`, async () => {
  await deleteData('auth');
});

export const refreshTokens = createAsyncThunk(
  `${authSlice.name}/refreshToken`,
  async (_, { getState }) => {
    const state = getState() as RootState;
    try {
      // console.log('redux - renew tokens');
      const resp = await refreshTokensServer(state.auth.signature);
      return resp.data;
    } catch (err) {
      await deleteData('auth');
      throw catchServerApiErr(err);
    }
  },
);

export const fetchProfileRdx = createAsyncThunk(
  `${authSlice.name}/me`,
  async ({ sig }: { sig: Sig }) => {
    try {
      const resp = await getProfileServer(sig);
      return resp.data;
    } catch (err) {
      throw catchServerApiErr(err);
    }
  },
);
