import store from '@/reducer';
import { IAction, IState } from '@reducer/user';

/*登录*/
export const setLogin = (isLogin: boolean) => {
  store.dispatch({ type: 'SET_LOGIN', isLogin });
};

export const setUserInfo = (info: {
  userid: number;
  userProfile: IAction['userProfile'];
}) => {
  store.dispatch({
    type: 'SET_USER_INFO',
    userid: info.userid,
    userProfile: info.userProfile
  });
};

export const setUserPage = (page: IState['page']) => {
  store.dispatch({ type: 'SET_USER_PAGE', page });
};

export const setPageGroup = (group: IState['group']) => {
  store.dispatch({ type: 'SET_PAGE_GROUP', group });
};
