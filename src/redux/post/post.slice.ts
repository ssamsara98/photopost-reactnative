import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { ErrorJSON, PaginationCursorMeta, PostWithPhotos } from '@/@types/server';
import { getPostListServer } from '@/api/server';
import { catchServerApiErr } from '@/lib/serverApi';

import { AsyncStatus, RootState } from '../store';

export const postsAdapter = createEntityAdapter<PostWithPhotos>();

type PostsInitialState = {
  status: AsyncStatus;
  error: ErrorJSON | null;
  pagination: PaginationCursorMeta;
};
const postsIntialState = postsAdapter.getInitialState<PostsInitialState>({
  status: 'idle',
  error: null,
  pagination: {
    cursor: 0,
    limit: 10,
    itemCount: 0,
    hasNext: true,
  },
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
      postsAdapter.upsertMany(state, action.payload.result.items);
      state.pagination = action.payload.result.meta;
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
      postsAdapter.addMany(state, action.payload.result.items);
      state.pagination = action.payload.result.meta;
    });
    builder.addCase(fetchPostListNextRdx.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = catchServerApiErr(action.error);
    });
  },
});

export const postsSelectors = postsAdapter.getSelectors();

export const selectPostsReducer = (state: RootState) => state.posts;
export const selectPostsReducerSafe = createSelector(selectPostsReducer, (posts) => posts);

export const fetchPostListRdx = createAsyncThunk(
  `${postsSlice.name}/fetchPostList`,
  async (arg: { params?: { cursor?: number; limit?: number } }) => {
    const resp = await getPostListServer(arg.params);
    return resp.data;
  },
);

export const fetchPostListNextRdx = createAsyncThunk(
  `${postsSlice.name}/fetchPostListNext`,
  async (arg: { params?: { cursor?: number; limit?: number } }) => {
    const resp = await getPostListServer(arg.params);
    return resp.data;
  },
);
