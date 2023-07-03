import {AxiosResponse} from 'axios';
import {createAuthorization, serverApi} from './_api';
import {SERVER} from '@env';

type RegisterReq = {
  email: string;
  username: string;
  password: string;
  name: string;
};
type RegisterRes = {
  type: string;
  token: string;
};
export const serverRegister = async (
  email: string,
  username: string,
  password: string,
  name: string,
) => {
  return serverApi.post<RegisterRes, AxiosResponse<RegisterRes>, RegisterReq>(
    '/register',
    {
      email,
      username,
      password,
      name,
    },
  );
};

type LoginReq = {
  userSession: string;
  password: string;
};
type LoginRes = {
  type: string;
  token: string;
};
export const serverLogin = async (userSession: string, password: string) => {
  return serverApi.post<LoginRes, AxiosResponse<LoginRes>, LoginReq>('/login', {
    userSession,
    password,
  });
};

export type Sig = {type: string; token: string};

export const getProfileServer = async (sig: Sig) => {
  return serverApi.get('/me', {
    headers: {
      ...createAuthorization(sig),
    },
  });
};

export type PostRes = {
  pagination: {
    count: number;
    hasNext: boolean;
  };
  result: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    authorId: number;
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
  }[];
};
export const getPostListServer = async (params?: any) => {
  return serverApi.get<PostRes>('/v1/posts', {
    params,
  });
};

export const getMyPostListServer = async (sig: Sig, params?: any) => {
  return serverApi.get<PostRes>('/v1/posts/mine', {
    headers: {
      ...createAuthorization(sig),
    },
    params,
  });
};

export const getUserPostListServer = async (userId: number) => {
  return serverApi.get<PostRes>(`/v1/posts/u/${userId}`);
};

export type UploadImageServerRes = {
  photo: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    keypath: string;
  };
};
export const uploadImageServer = async (
  body: FormData,
  sig: Sig,
): Promise<UploadImageServerRes> => {
  // return serverApi
  //   .post(`${'/v1/posts/upload'}`, body, {
  //     method: 'POST',
  //     headers: {
  //       ...createAuthorization(sig),
  //     },
  //   })
  //   .then((response) => {
  //     return response.data;
  //   })
  //   .catch((error) => {
  //     // console.log('error', JSON.stringify(error, null, 2));
  //     throw error;
  //   });

  // console.log(`SERVER=>${SERVER}`);
  return fetch(`${SERVER}/v1/posts/upload`, {
    method: 'POST',
    body,
    headers: {
      ...createAuthorization(sig),
    },
  })
    .then((response) => response.json())
    .then((response) => {
      // console.log('response', response);
      return response;
    })
    .catch((error) => {
      console.log('error', JSON.stringify(error, null, 2));
      throw error;
    });
};

export type CreatePostRes = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  authorId: number;
  caption: string;
  isPublished: boolean;
  photos: null;
};
export const createPostServer = async (body: any, sig: Sig) => {
  return serverApi.post<CreatePostRes>('/v1/posts/', body, {
    headers: {
      ...createAuthorization(sig),
    },
  });
};
