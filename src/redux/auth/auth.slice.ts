import {createAsyncThunk, createSelector, createSlice} from '@reduxjs/toolkit';
import {getProfileServer, renewTokensServer, serverLogin} from '../../api/serverApi';
import {catchServerApiErr} from '../../api/_api';
import {deleteData, storeData} from '../../utils/storage.helper';
import {AsyncStatus, RootState} from '../store';
import {Sig} from '../../@types/server.type';

const initialState: {
  status: AsyncStatus;
  error: any;
  isLogin: boolean;
  signature: Sig;

  userStatus: AsyncStatus;
  userError: any;
  user: any;
} = {
  status: 'idle',
  error: null,
  isLogin: false,
  signature: {
    type: '',
    accessToken: '',
    refreshToken: '',
  },
  userStatus: 'idle',
  userError: null,
  user: {},
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
        state.signature = action.payload;
        storeData('auth', {signature: action.payload, isLogin: true});
      })
      .addCase(loginRdx.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error;
      })

      // logout
      .addCase(authLogout.fulfilled, (state) => {
        state.isLogin = false;
        state.signature = {type: '', accessToken: '', refreshToken: ''};
      })

      // renew tokens
      .addCase(renewTokens.fulfilled, (state, action) => {
        state.signature = action.payload;
      })
      .addCase(renewTokens.rejected, (state) => {
        state.isLogin = false;
        state.signature = {type: '', accessToken: '', refreshToken: ''};
      })

      // user
      .addCase(fetchProfileRdx.pending, (state) => {
        state.userStatus = 'loading';
      })
      .addCase(fetchProfileRdx.fulfilled, (state, action) => {
        state.userStatus = 'fulfilled';
        state.user = action.payload;
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
  async ({userSession, password}: {userSession: string; password: string}) => {
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

export const renewTokens = createAsyncThunk(
  `${authSlice.name}/refreshToken`,
  async (_, {getState}) => {
    const state = getState() as RootState;
    try {
      // console.log('redux - renew tokens');
      const resp = await renewTokensServer(state.auth.signature);
      return resp.data;
    } catch (err) {
      await deleteData('auth');
      throw catchServerApiErr(err);
    }
  },
);

export const fetchProfileRdx = createAsyncThunk(
  `${authSlice.name}/profile`,
  async ({sig}: {sig: Sig}) => {
    try {
      const resp = await getProfileServer(sig);
      return resp.data;
    } catch (err) {
      throw catchServerApiErr(err);
    }
  },
);
