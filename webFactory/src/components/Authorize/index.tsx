import React, { PropsWithChildren, ReactChildren, useEffect } from 'react';
import CLN from 'classnames';
import S from './index.less';
import { message } from 'antd';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { getCookie } from '@utils/cookie';
import { dateFormat } from '@/utils/tool';
import { setLogin, setUserInfo, setUserPage, setPageGroup } from '@action/user';
import { login, regist, tokenValidator } from '@core/user';
import { getPageData } from '@core/editor';
import store, { IState } from '@/reducer';
import { getPage } from '@core/doRequest';
import Login from '@routes/Login';

interface IProps extends PropsWithChildren<any> {
  user: IState['user'];
}
const Component = (props: IProps) => {
  const { children, user, history } = props;
  const isLogin = user!.isLogin;
  const needLogin = !!history.location.pathname.match(/visit/);
  const loginSuccess = (user: any) => {
    setLogin(true);
    setUserInfo({
      userid: user.userid,
      userProfile: {
        userName: user.username,
        avatar: user.avatar,
        birthday: user.birthday,
        frezee: user.frezee,
        language: user.language,
        skin: user.skin,
        email: user.email
      }
    });
    message.success('登录成功。');
  };

  useEffect(() => {
    if (needLogin) return;
    const cookie = getCookie();
    if (cookie['token']) {
      tokenValidator(cookie['token']).then(res => {
        if (res.state == 1) {
          loginSuccess(res.user);
          return;
        }
      });
    }
  }, []);
  useEffect(() => {
    if (needLogin) return;
    if (user.userid == -1) return;
    getPage(user.userid);
  }, [user.userid]);
  return (
    <div className={S['container']}>
      {needLogin ? children : isLogin ? children : <Login />}
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    user: state.user
  };
};

export default withRouter(connect(mapStateToProps)(Component));
