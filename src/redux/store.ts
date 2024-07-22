import { configureStore } from '@reduxjs/toolkit';

import { apiSlice } from './api/api.slice';
import { authSlice } from './auth/auth.slice';
import { myPostsSlice } from './post/my-posts.slice';
import { postsSlice } from './post/post.slice';

export type AsyncStatus = 'idle' | 'loading' | 'fulfilled' | 'rejected';

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [postsSlice.name]: postsSlice.reducer,
    [myPostsSlice.name]: myPostsSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
