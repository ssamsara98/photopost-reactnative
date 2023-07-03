import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getMyPostListServer, getPostListServer, Sig} from '../../api/serverApi';
import {catchServerApiErr} from '../../api/_api';
import {AsyncStatus} from '../store';

const initialState: {
  status: AsyncStatus;
  error: any;
  posts: any[];
  pagination: {
    count: number;
    hasNext: boolean;
  };
  page: number;

  myPostsStatus: AsyncStatus;
  myPostsError: any;
  myPosts: any[];
  myPostsPagination: {
    count: number;
    hasNext: boolean;
  };
  myPostsPage: number;
} = {
  status: 'idle',
  error: null,
  posts: [],
  pagination: {
    count: 0,
    hasNext: false,
  },
  page: 0,

  myPostsStatus: 'idle',
  myPostsError: null,
  myPosts: [],
  myPostsPagination: {
    count: 0,
    hasNext: false,
  },
  myPostsPage: 0,
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchPostListRdx.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchPostListRdx.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      state.posts = state.posts.concat(action.payload.result);
      state.pagination = action.payload.pagination;
      state.page += 1;
    });
    builder.addCase(fetchPostListRdx.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = catchServerApiErr(action.error);
    });

    // refresh
    builder.addCase(fetchPostListRefreshRdx.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchPostListRefreshRdx.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      state.posts = action.payload.result;
      state.pagination = action.payload.pagination;
      state.page = 1;
    });
    builder.addCase(fetchPostListRefreshRdx.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = catchServerApiErr(action.error);
    });

    // my posts
    builder.addCase(fetchMyPostListRdx.pending, (state) => {
      state.myPostsStatus = 'loading';
    });
    builder.addCase(fetchMyPostListRdx.fulfilled, (state, action) => {
      state.myPostsStatus = 'fulfilled';
      state.myPosts = action.payload.result;
      state.myPostsPagination = action.payload.pagination;
      state.myPostsPage = 1;
    });
    builder.addCase(fetchMyPostListRdx.rejected, (state, action) => {
      state.myPostsStatus = 'rejected';
      state.myPostsError = catchServerApiErr(action.error);
    });

    // my posts next
    builder.addCase(fetchMyPostListNextRdx.pending, (state) => {
      state.myPostsStatus = 'loading';
    });
    builder.addCase(fetchMyPostListNextRdx.fulfilled, (state, action) => {
      state.myPostsStatus = 'fulfilled';
      state.myPosts = state.myPosts.concat(action.payload.result);
      state.myPostsPagination = action.payload.pagination;
      state.myPostsPage += 1;
    });
    builder.addCase(fetchMyPostListNextRdx.rejected, (state, action) => {
      state.myPostsStatus = 'rejected';
      state.myPostsError = catchServerApiErr(action.error);
    });
  },
});

export const fetchPostListRdx = createAsyncThunk(
  `${postsSlice.name}/fetchPostList`,
  async (arg: {params?: {page?: number; limit?: number}}) => {
    const resp = await getPostListServer(arg.params);
    return resp.data;
  },
);

export const fetchPostListRefreshRdx = createAsyncThunk(
  `${postsSlice.name}/fetchPostListRefresh`,
  async (arg: {params?: {page?: number; limit?: number}}) => {
    const resp = await getPostListServer(arg.params);
    return resp.data;
  },
);

export const fetchMyPostListRdx = createAsyncThunk(
  `${postsSlice.name}/fetchMyPostList`,
  async (arg: {sig: Sig; params?: {page?: number; limit?: number}}) => {
    const resp = await getMyPostListServer(arg.sig, arg.params);
    return resp.data;
  },
);

export const fetchMyPostListNextRdx = createAsyncThunk(
  `${postsSlice.name}/fetchMyPostListNext`,
  async (arg: {sig: Sig; params?: {page?: number; limit?: number}}) => {
    const resp = await getMyPostListServer(arg.sig, arg.params);
    return resp.data;
  },
);
