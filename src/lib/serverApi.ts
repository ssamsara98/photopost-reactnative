// eslint-disable-next-line import/no-unresolved
import { SERVER } from '@env';
import axios, { AxiosError, isAxiosError } from 'axios';

import { ErrorJSON, Sig } from '@/@types/server';
import { refreshTokens } from '@/redux/auth/auth.slice';
import { store } from '@/redux/store';

// console.log('SERVER', SERVER);

export const serverApi = axios.create({
  baseURL: SERVER,
});

serverApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error?.config!;
    if (error?.response?.status! === 403 && !(originalRequest as any)._retry) {
      // console.log('interceptors - renew tokens');
      (originalRequest as any)._retry = true;

      await store.dispatch(refreshTokens());
      const sig = store?.getState()?.auth?.signature;

      serverApi.defaults.headers.common.authorization = `${sig.tokenType} ${sig.accessToken}`;
      return serverApi(originalRequest);
    }

    return Promise.reject(error);
  },
);

export const catchServerApiErr: (err: any) => ErrorJSON = (err) => {
  // cnsole.log(SERVER);
  if (isAxiosError<ErrorJSON>(err)) {
    // console.error(jsonStringify(err));
    return err.response?.data;
  }
  return err;
};

export const createAuthorization = ({ tokenType, accessToken }: Sig) => {
  return { Authorization: `${tokenType} ${accessToken}` };
};
