import { upload } from '@/components/Form/Upload/index.less';
import request from './request';
import $ from 'jquery';
import { reject } from 'lodash';

export const getPageContent = (userid: number, pageid: number) => {
  return request('GET', 'local/pages/getPageContent', { userid, pageid });
};

export const savePageContent = (
  userid: number,
  pageid: number,
  content: string
) => {
  return request('POST', 'local/pages/savePageContent', {
    userid,
    pageid,
    content
  });
};

export const getPageData = (userid: number) => {
  return request('GET', 'local/pages/getPageData', { userid });
};

export const createPage = (body: {
  userid: number;
  name: string;
  encode: boolean;
  groupid: number;
  descript: string;
}) => {
  return request('POST', 'local/pages/createPage', {
    userid: body.userid,
    name: body.name,
    encode: body.encode ? 1 : 0,
    groupid: body.groupid,
    descript: body.descript
  });
};

export const deletePage = (userid: number, pageid: number) => {
  return request('GET', 'local/pages/deletePage', { userid, pageid });
};

export const deletePageReal = (userid: number, pageid: number) => {
  return request('GET', 'local/pages/realDeletePage', { userid, pageid });
};

export const recoverPage = (userid: number, pageid: number) => {
  return request('GET', 'local/pages/recoverPage', { userid, pageid });
};

export const publishPage = (
  userid: number,
  pageid: number,
  publish: boolean
) => {
  return request('GET', 'local/pages/publishPage', { userid, pageid, publish });
};

export const createGroup = (body: { userid: number; name: string }) => {
  return request('POST', 'local/pages/createGroup', {
    userid: body.userid,
    name: body.name
  });
};

export const deleteGroup = (userid: number, groupid: number) => {
  return request('GET', 'local/pages/deleteGroup', {
    userid,
    groupid
  });
};

export const updateData = (body: {
  userid: number;
  pageid: number;
  elementid: number;
  data: string;
}) => {
  return request('POST', 'local/datas/updateData', {
    userid: body.userid,
    pageid: body.pageid,
    elementid: body.elementid,
    data: body.data
  });
};

export const deleteData = (body: {
  userid: number;
  pageid: number;
  elementid: number[];
}) => {
  return request('POST', 'local/datas/deleteData', {
    userid: body.userid,
    pageid: body.pageid,
    elementid: body.elementid
  });
};

export const getElementData = (userid: number, pageid: number) => {
  return request('GET', 'local/datas/getPageData', {
    userid,
    pageid
  });
};

export const getPageElementData = (userid: number, pageid: number) => {
  return request('GET', 'local/datas/getPageElementData', { userid, pageid });
};

export const uploadBackgroundImage = (formData: FormData) => {
  return request('POST', 'local/images/background/upload', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

export const deleteBackgroundImage = (userid: number, pageid: number) => {
  return request('GET', 'local/images/background/delete', { userid, pageid });
};

export const uploadElementImage = (formData: FormData) => {
  return request('POST', 'local/images/element/upload', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

export const deleteElementImage = (
  userid: number,
  pageid: number,
  elementid: number
) => {
  return request('GET', 'local/images/element/delete', {
    userid,
    pageid,
    elementid
  });
};
