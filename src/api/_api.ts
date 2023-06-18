import axios, {isAxiosError} from 'axios';
import {SERVER} from '@env';

// console.log('SERVER', SERVER);

export const serverApi = axios.create({
  baseURL: SERVER,
});

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

export const createAuthorization = ({type, token}: {type: string; token: string}) => {
  return {Authorization: `${type} ${token}`};
};
