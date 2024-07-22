// eslint-disable-next-line import/no-unresolved
import { SERVER } from '@env';
// Import the RTK Query methods from the React-specific entry point
import { EntityState, createEntityAdapter } from '@reduxjs/toolkit';
import {
  // BaseQueryFn,
  // FetchArgs,
  // FetchBaseQueryError,
  // FetchBaseQueryMeta,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: SERVER,
  credentials: 'include',
  prepareHeaders(headers, api) {
    const sig = (api.getState() as RootState).auth.signature;
    if (sig) {
      if (sig.accessToken) {
        headers.set('Authorization', `${sig.tokenType} ${sig.accessToken}`);
      }
    }
    return headers;
  },
});

// const baseQueryWithReauth: Promise<
//   BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>
// > = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (
//     result?.error &&
//     result.error.status === 'PARSING_ERROR' &&
//     (result.error.originalStatus === 401 || result.error.originalStatus === 403)
//   ) {
//     console.log('sending refresh token');
//     const refreshResult = await baseQuery('/token-renew', api, extraOptions);
//     if (refreshResult.data) {
//       const user = (api.getState() as RootState).auth.user;
//     }
//   }

//   return result;
// };

type Pagination = {
  count: number;
  hasNext: boolean;
};

type Post = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  authorId: number;
  author: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    email: string;
    username: string;
    name: string;
    sexType: string;
  };
  caption: string;
  isPublished: boolean;
  photos: [
    {
      id: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
      position: number;
      postId: string;
      photoId: string;
      photo: {
        id: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string;
        keypath: string;
      };
    },
  ];
};

type PostListQuery = {
  page: number;
  limit: number;
};
type ListRes<P, R> = {
  pagination: P;
  result: R;
};

export const postsAdapter = createEntityAdapter({
  selectId: (post: Post) => post.id,
});
export const postsSelector = postsAdapter.getSelectors();

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery,

  tagTypes: ['PostList'],

  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getPostList: builder.query<ListRes<Pagination, EntityState<Post>>, PostListQuery | null>({
      // The URL for the request is '/fakeApi/posts'
      query: (args) => {
        const url = `/v1/posts${args ? `?page=${args.page}&limit=${args.limit}` : ''}`;
        // console.log(url);
        return url;
      },
      providesTags: ['PostList'],
      transformResponse: (response: ListRes<Pagination, Post[]>) => {
        // console.log(response);
        // console.log(jsonStringify(response));
        const posts = postsAdapter.addMany(postsAdapter.getInitialState(), response.result);
        return {
          pagination: response.pagination,
          result: posts,
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg !== previousArg;
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const res = `${endpointName}-${queryArgs?.page || '0'}`;
        // console.log(endpointName, queryArgs);
        // console.log(res);
        return res;
      },
      merge: (currentState, incomingState) => {
        // console.log('Merge');
        // console.log(currentState, incomingState);
        const posts = postsAdapter.addMany(
          currentState.result,
          postsSelector.selectAll(incomingState.result),
        );
        return {
          pagination: incomingState.pagination,
          result: posts,
        };
      },
    }),
  }),
});
