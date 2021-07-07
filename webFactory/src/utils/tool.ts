import { item } from '@/components/EditPanel/Tools/index.less';
import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
export const hasChildren = (father: Element | null, child: Element) => {
  if (father == null) return false;
  if (father == child) {
    return true;
  }
  const children = father.children;
  for (let i = 0; i < children.length; i++) {
    if (hasChildren(children[i], child)) {
      return true;
    }
  }
  return false;
};

export const dateFormat = (date: string | Date) => {
  let _date = moment(typeof date == 'string' ? new Date(date) : date);
  return _date.format('YYYY-M-DD H:mm');
};

export const getNewId = (data: { id: number; [propName: string]: any }[]) => {
  let id = 1;
  while (1) {
    let flag = true;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        flag = false;
        break;
      }
    }
    if (flag) {
      break;
    } else {
      id++;
    }
  }
  return id;
};

// export const tokenValidator = async () => {
//     const cookie = document.cookie.split(';');
//     const token = cookie
//         .filter(item => {
//             const name = item.split('=')[0];
//             return name == 'token';
//         })[0]
//         .split('=')[0];
//     let result = false;
//     await $.ajax({
//         type: 'GET',
//         url: 'http://localhost:8080/token',
//         data: { token },
//         success() {
//             result = true;
//         }
//     });
//     return result;
// };

// export const login = async (username: string, password: string) => {
//     let result = false;
//     await $.ajax({
//         type: 'GET',
//         url: 'http://localhost:8080/login',
//         data: { username, password },
//         success(res) {
//             if (res.msg == 'success') {
//                 result = true;
//                 saveCookie('token', res.token);
//             }
//         }
//     });
//     return result;
// };
// export const register = async (
//     username: string,
//     password: string,
//     repeat: string
// ) => {
//     let result = false;
//     if (!_.isEqual(password, repeat)) {
//         return false;
//     }
//     await $.ajax({
//         type: 'POST',
//         url: 'http://localhost:8080/register',
//         data: { username, password },
//         success(res) {
//             if (res.msg == 'success') {
//                 result = true;
//             }
//         }
//     });
//     return result;
// };
