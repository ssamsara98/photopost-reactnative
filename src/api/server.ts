// eslint-disable-next-line import/no-unresolved
import { SERVER } from '@env';
import { AxiosResponse } from 'axios';

import {
  CreatePostListResp,
  LoginReq,
  LoginRes,
  PostListMineResp,
  PostListResp,
  RefreshTokensReq,
  RegisterReq,
  RegisterRes,
  Sig,
  SuccessJSON,
  UploadImageServerRes,
  User,
} from '@/@types/server';
import { createAuthorization, serverApi } from '@/lib/serverApi';
import { jsonStringify } from '@/utils/json-stringify';

/* auth */

export const serverRegister = async (
  email: string,
  username: string,
  password: string,
  name: string,
) => {
  return serverApi.post<
    SuccessJSON<RegisterRes>,
    AxiosResponse<SuccessJSON<RegisterRes>>,
    RegisterReq
  >('/register', {
    email,
    username,
    password,
    name,
  });
};

export const serverLogin = async (userSession: string, password: string) => {
  const resp = await serverApi.post<
    SuccessJSON<LoginRes>,
    AxiosResponse<SuccessJSON<LoginRes>>,
    LoginReq
  >('/login', {
    userSession,
    password,
  });
  return resp;
};

/* profile */
export const getProfileServer = async (sig: Sig) => {
  return serverApi.get<SuccessJSON<User>>('/me', {
    headers: {
      ...createAuthorization(sig),
    },
  });
};

/* refresh token */
export const refreshTokensServer = async (sig: Sig) => {
  return serverApi.post<SuccessJSON<Sig>, AxiosResponse<SuccessJSON<Sig>>, RefreshTokensReq>(
    '/token-renew',
    {
      refreshToken: sig.refreshToken,
    },
  );
};

/* posts */

export const getPostListServer = async (params?: any) => {
  return serverApi.get<SuccessJSON<PostListResp>>('/v1/posts', {
    params,
  });
};

export const getMyPostListServer = async (sig: Sig, params?: any) => {
  return serverApi.get<SuccessJSON<PostListMineResp>>('/v1/posts/mine', {
    headers: {
      ...createAuthorization(sig),
    },
    params,
  });
};

export const getUserPostListServer = async (userId: number) => {
  return serverApi.get<SuccessJSON<PostListResp>>(`/v1/posts/u/${userId}`);
};

export const uploadImageServer = async (
  body: FormData,
  sig: Sig,
): Promise<SuccessJSON<UploadImageServerRes>> => {
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
  //   .catch((err) => {
  //     // console.error(jsonStringify(err));
  //     throw err;
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
    .catch((err) => {
      console.error(jsonStringify(err));
      throw err;
    });
};

export const createPostServer = async (body: any, sig: Sig) => {
  return serverApi.post<SuccessJSON<CreatePostListResp>>('/v1/posts', body, {
    headers: {
      ...createAuthorization(sig),
    },
  });
};
