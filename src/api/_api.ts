import axios, {AxiosError} from 'axios';
import {SERVER} from '@env';

export const serverApi = axios.create({
  baseURL: SERVER,
});

export const catchServerApiErr: (err: any) => {
  message: string;
  statusCode: number;
} = (err) => {
  // cnsole.log(SERVER);
  if (err instanceof AxiosError) {
    return err.response?.data;
  }
  return err;
};

export const createAuthorization = ({type, token}: {type: string; token: string}) => {
  return {Authorization: `${type} ${token}`};
};
