import {AxiosResponse} from 'axios';
import {createAuthorization, serverApi} from './_api';

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
};
export const getPostListServer = async () => {
  return serverApi.get<PostRes[]>('/v1/posts');
};

export const getMyPostListServer = async (signature: Sig) => {
  return serverApi.get<PostRes[]>('/v1/posts/mine', {
    headers: {
      ...createAuthorization(signature),
    },
  });
};

export const getUserPostListServer = async (userId: number) => {
  return serverApi.get<PostRes[]>(`/v1/posts/u/${userId}`);
};
