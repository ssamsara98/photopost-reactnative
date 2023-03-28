import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getMyPostListServer, getPostListServer, Sig} from '../../api/serverApi';
import {catchServerApiErr} from '../../api/_api';
import {AsyncStatus} from '../store';

const initialState: {
  status: AsyncStatus;
  error: any;
  posts: any[];

  myPostsStatus: AsyncStatus;
  myPostsError: any;
  myPosts: any[];
} = {
  status: 'idle',
  error: null,
  posts: [],

  myPostsStatus: 'idle',
  myPostsError: null,
  myPosts: [],
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
      state.posts = state.posts.concat(action.payload!);
    });
    builder.addCase(fetchPostListRdx.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = catchServerApiErr(action.error);
    });
    // my posts
    builder.addCase(fetchMyPostListRdx.pending, (state) => {
      state.myPostsStatus = 'loading';
    });
    builder.addCase(fetchMyPostListRdx.fulfilled, (state, action) => {
      state.myPostsStatus = 'fulfilled';
      state.myPosts = state.myPosts.concat(action.payload!);
    });
    builder.addCase(fetchMyPostListRdx.rejected, (state, action) => {
      state.myPostsStatus = 'rejected';
      state.myPostsError = catchServerApiErr(action.error);
    });
  },
});

export const fetchPostListRdx = createAsyncThunk(
  `${postsSlice.name}/fetchPostList`,
  async () => {
    const resp = await getPostListServer();
    return resp.data;
  },
);

export const fetchMyPostListRdx = createAsyncThunk(
  `${postsSlice.name}/fetchMyPostList`,
  async (sig: Sig) => {
    const resp = await getMyPostListServer(sig);
    return resp.data;
  },
);
