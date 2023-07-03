import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getProfileServer, serverLogin, Sig} from '../../api/serverApi';
import {catchServerApiErr} from '../../api/_api';
import {deleteData, storeData} from '../../utils/storage.helper';
import {AsyncStatus} from '../store';

const initialState: {
  status: AsyncStatus;
  error: any;
  isLogin: boolean;
  signature: {
    type: string;
    token: string;
  };
  userStatus: AsyncStatus;
  userError: any;
  user: any;
} = {
  status: 'idle',
  error: null,
  isLogin: false,
  signature: {
    type: '',
    token: '',
  },
  userStatus: 'idle',
  userError: null,
  user: {},
};

export const authSlice = createSlice({
  name: 'posts',
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
      .addCase(postLoginRdx.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postLoginRdx.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.isLogin = true;
        state.signature = action.payload;
        storeData('auth', {signature: action.payload, isLogin: true});
      })
      .addCase(postLoginRdx.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error;
      })

      // logout
      .addCase(authLogout.fulfilled, (state) => {
        state.isLogin = false;
        state.signature = {type: '', token: ''};
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

export const postLoginRdx = createAsyncThunk(
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
