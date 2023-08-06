import axios, {AxiosError, isAxiosError} from 'axios';
import {SERVER} from '@env';
import {Sig} from '../@types/server.type';
import {store} from '../redux/store';
import {renewTokens} from '../redux/auth/auth.slice';

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

      await store.dispatch(renewTokens());
      const sig = store?.getState()?.auth?.signature;

      serverApi.defaults.headers.common.authorization = `${sig.type} ${sig.accessToken}`;
      return serverApi(originalRequest);
    }

    return Promise.reject(error);
  },
);

export const catchServerApiErr: (err: any) => {
  message: string;
  statusCode: number;
} = (err) => {
  // cnsole.log(SERVER);
  if (isAxiosError(err)) {
    // console.error(JSON.stringify(err, null, 2));
    return err.response?.data;
  }
  return err;
};

export const createAuthorization = ({type, accessToken}: Sig) => {
  return {Authorization: `${type} ${accessToken}`};
};
