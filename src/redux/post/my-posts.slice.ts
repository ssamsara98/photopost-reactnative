import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {getMyPostListServer} from '../../api/serverApi';
import {catchServerApiErr} from '../../api/_api';
import {AsyncStatus, RootState} from '../store';
import {PostWithPhotos, Sig} from '../../@types/server.type';

export const myPostsAdapter = createEntityAdapter<PostWithPhotos>();

type MyPostsInitialState = {
  status: AsyncStatus;
  error: any;
  pagination: {
    count: number;
    hasNext: boolean;
  };
  page: number;
};
const myPostsIntialState = myPostsAdapter.getInitialState<MyPostsInitialState>({
  status: 'idle',
  error: null,
  pagination: {
    count: 0,
    hasNext: false,
  },
  page: 0,
});

export const myPostsSlice = createSlice({
  name: 'myPosts',
  initialState: myPostsIntialState,
  reducers: {},
  extraReducers(builder) {
    // posts
    builder.addCase(fetchMyPostListRdx.pending, (state) => {
      state.status = 'loading';
      myPostsAdapter.removeAll(state);
    });
    builder.addCase(fetchMyPostListRdx.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      myPostsAdapter.upsertMany(state, action.payload.result);
      state.pagination = action.payload.pagination;
      state.page = 1;
    });
    builder.addCase(fetchMyPostListRdx.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = catchServerApiErr(action.error);
    });

    // posts next
    builder.addCase(fetchMyPostListNextRdx.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchMyPostListNextRdx.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      myPostsAdapter.addMany(state, action.payload.result);
      state.pagination = action.payload.pagination;
      state.page += 1;
    });
    builder.addCase(fetchMyPostListNextRdx.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = catchServerApiErr(action.error);
    });
  },
});

export const myPostsSelectors = myPostsAdapter.getSelectors();

export const selectMyPostsReducer = (state: RootState) => state.myPosts;
export const selectMyPostsReducerSafe = createSelector(
  selectMyPostsReducer,
  (myPosts) => myPosts,
);

export const fetchMyPostListRdx = createAsyncThunk(
  `${myPostsSlice.name}/fetchMyPostList`,
  async (arg: {sig: Sig; params?: {page?: number; limit?: number}}) => {
    const resp = await getMyPostListServer(arg.sig, arg.params);
    return resp.data;
  },
);

export const fetchMyPostListNextRdx = createAsyncThunk(
  `${myPostsSlice.name}/fetchMyPostListNext`,
  async (arg: {sig: Sig; params?: {page?: number; limit?: number}}) => {
    const resp = await getMyPostListServer(arg.sig, arg.params);
    return resp.data;
  },
);
