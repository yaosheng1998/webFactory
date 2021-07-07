import request from './request';
import CryptoJs from 'crypto-js';

export const login = (username: string, password: string) => {
  return request('GET', 'local/login', {
    username,
    password: CryptoJs.SHA1(password).toString()
  });
};

export const regist = (username: string, password: string) => {
  return request('POST', 'local/regist', {
    username,
    password: CryptoJs.SHA1(password).toString()
  });
};

export const tokenValidator = (token: string) => {
  return request('GET', 'local/token', { token });
};

export const updateBirthday = (userid: number, birthday: number) => {
  return request('POST', 'local/updateBirthday', { userid, birthday });
};

export const updateEmail = (userid: number, email: string) => {
  return request('POST', 'local/updateEmail', { userid, email });
};

export const updateAvatar = (userid: number, avatar: string) => {
  return request('POST', 'local/updateAvatar', { userid, avatar });
};

export const uploadAvatarImage = (formData: FormData) => {
  return request('POST', 'local/images/avatar/upload', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};
