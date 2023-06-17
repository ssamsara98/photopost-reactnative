import {AxiosResponse} from 'axios';
import {createAuthorization, serverApi} from './_api';
// import {SERVER} from '@env';

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

export const getMyPostListServer = async (sig: Sig) => {
  return serverApi.get<PostRes[]>('/v1/posts/mine', {
    headers: {
      ...createAuthorization(sig),
    },
  });
};

export const getUserPostListServer = async (userId: number) => {
  return serverApi.get<PostRes[]>(`/v1/posts/u/${userId}`);
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
export const uploadImageServer = async (body: FormData, sig: Sig) => {
  try {
    // console.log(body);
    return serverApi.post<UploadImageServerRes>('/v1/posts/upload', body, {
      headers: {
        ...createAuthorization(sig),
        'Content-Type': 'multipart/form-data; ',
      },
    });
  } catch (err) {
    // console.error(err);
    throw err;
  }

  // try {
  //   const response = await fetch(`${SERVER}/v1/posts/upload`, {
  //     method: 'POST',
  //     body,
  //     headers: {
  //       ...createAuthorization(sig),
  //       'Content-Type': 'multipart/form-data; ',
  //     },
  //   });
  //   return response.json();
  // } catch (err) {
  //   console.error(err);
  //   throw err;
  // }
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
