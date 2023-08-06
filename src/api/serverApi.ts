import {AxiosResponse} from 'axios';
import {createAuthorization, serverApi} from './_api';
import {SERVER} from '@env';
import {
  CreatePostListResp,
  LoginReq,
  LoginRes,
  PostListResp,
  RegisterReq,
  RegisterRes,
  RenewTokensReq,
  Sig,
  UploadImageServerRes,
} from '../@types/server.type';

// auth
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

export const serverLogin = async (userSession: string, password: string) => {
  return serverApi.post<LoginRes, AxiosResponse<LoginRes>, LoginReq>('/login', {
    userSession,
    password,
  });
};

export const getProfileServer = async (sig: Sig) => {
  return serverApi.get('/me', {
    headers: {
      ...createAuthorization(sig),
    },
  });
};

export const renewTokensServer = async (sig: Sig) => {
  return serverApi.post<Sig, AxiosResponse<Sig>, RenewTokensReq>('/token-renew', {
    refreshToken: sig.refreshToken,
  });
};

// posts

export const getPostListServer = async (params?: any) => {
  return serverApi.get<PostListResp>('/v1/posts', {
    params,
  });
};

export const getMyPostListServer = async (sig: Sig, params?: any) => {
  return serverApi.get<PostListResp>('/v1/posts/mine', {
    headers: {
      ...createAuthorization(sig),
    },
    params,
  });
};

export const getUserPostListServer = async (userId: number) => {
  return serverApi.get<PostListResp>(`/v1/posts/u/${userId}`);
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

export const createPostServer = async (body: any, sig: Sig) => {
  return serverApi.post<CreatePostListResp>('/v1/posts/', body, {
    headers: {
      ...createAuthorization(sig),
    },
  });
};
