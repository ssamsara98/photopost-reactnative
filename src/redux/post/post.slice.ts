import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {getPostListServer} from '../../api/serverApi';
import {catchServerApiErr} from '../../api/_api';
import {AsyncStatus, RootState} from '../store';
import {PostWithPhotos} from '../../@types/server.type';

export const postsAdapter = createEntityAdapter<PostWithPhotos>();

type PostsInitialState = {
  status: AsyncStatus;
  error: any;
  pagination: {
    count: number;
    hasNext: boolean;
  };
  page: number;
};
const postsIntialState = postsAdapter.getInitialState<PostsInitialState>({
  status: 'idle',
  error: null,
  pagination: {
    count: 0,
    hasNext: false,
  },
  page: 0,
});

export const postsSlice = createSlice({
  name: 'posts',
  initialState: postsIntialState,
  reducers: {},
  extraReducers(builder) {
    // posts
    builder.addCase(fetchPostListRdx.pending, (state) => {
      state.status = 'loading';
      postsAdapter.removeAll(state);
    });
    builder.addCase(fetchPostListRdx.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      postsAdapter.upsertMany(state, action.payload.result);
      state.pagination = action.payload.pagination;
      state.page = 1;
    });
    builder.addCase(fetchPostListRdx.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = catchServerApiErr(action.error);
    });

    // posts next
    builder.addCase(fetchPostListNextRdx.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchPostListNextRdx.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      postsAdapter.addMany(state, action.payload.result);
      state.pagination = action.payload.pagination;
      state.page += 1;
    });
    builder.addCase(fetchPostListNextRdx.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = catchServerApiErr(action.error);
    });
  },
});

export const postsSelectors = postsAdapter.getSelectors();

export const selectPostsReducer = (state: RootState) => state.posts;
export const selectPostsReducerSafe = createSelector(
  selectPostsReducer,
  (posts) => posts,
);

export const fetchPostListRdx = createAsyncThunk(
  `${postsSlice.name}/fetchPostList`,
  async (arg: {params?: {page?: number; limit?: number}}) => {
    const resp = await getPostListServer(arg.params);
    return resp.data;
  },
);

export const fetchPostListNextRdx = createAsyncThunk(
  `${postsSlice.name}/fetchPostListNext`,
  async (arg: {params?: {page?: number; limit?: number}}) => {
    const resp = await getPostListServer(arg.params);
    return resp.data;
  },
);
