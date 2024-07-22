import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { ErrorJSON, PaginationMeta, PostWithPhotos, Sig } from '@/@types/server';
import { getMyPostListServer } from '@/api/server';
import { catchServerApiErr } from '@/lib/serverApi';

import { AsyncStatus, RootState } from '../store';

export const myPostsAdapter = createEntityAdapter<PostWithPhotos>();

type MyPostsInitialState = {
  status: AsyncStatus;
  error: ErrorJSON | null;
  pagination: PaginationMeta;
  page: number;
};
const myPostsIntialState = myPostsAdapter.getInitialState<MyPostsInitialState>({
  status: 'idle',
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    count: 0,
    itemCount: 0,
    totalPages: 0,
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
      myPostsAdapter.upsertMany(state, action.payload.result.items);
      state.pagination = action.payload.result.meta;
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
      myPostsAdapter.addMany(state, action.payload.result.items);
      state.pagination = action.payload.result.meta;
    });
    builder.addCase(fetchMyPostListNextRdx.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = catchServerApiErr(action.error);
    });
  },
});

export const myPostsSelectors = myPostsAdapter.getSelectors();

export const selectMyPostsReducer = (state: RootState) => state.myPosts;
export const selectMyPostsReducerSafe = createSelector(selectMyPostsReducer, (myPosts) => myPosts);

export const fetchMyPostListRdx = createAsyncThunk(
  `${myPostsSlice.name}/fetchMyPostList`,
  async (arg: { sig: Sig; params?: { page?: number; limit?: number } }) => {
    const resp = await getMyPostListServer(arg.sig, arg.params);
    return resp.data;
  },
);

export const fetchMyPostListNextRdx = createAsyncThunk(
  `${myPostsSlice.name}/fetchMyPostListNext`,
  async (arg: { sig: Sig; params?: { page?: number; limit?: number } }) => {
    const resp = await getMyPostListServer(arg.sig, arg.params);
    return resp.data;
  },
);
