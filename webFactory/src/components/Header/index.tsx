import React, { useState } from 'react';
import S from './index.less';
import CLN from 'classnames';
import { Layout, Menu } from 'antd';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { IState } from '@/reducer';
import CreatePage from '@components/CreatePage';
import Icon from '@components/Icon';

interface IProps extends RouteComponentProps {
  user?: IState['user'];
}

const { Header } = Layout;

const Component = (props: IProps) => {
  const { user, history } = props;
  const itemStyle = {
    height: 40,
    verticalAlign: 'top',
    lineHeight: '40px'
  };
  const [visible, setVisible] = useState(false);
  let menuKey = ['1'];
  if (history.location.pathname.match(/person/)) {
    menuKey = ['3'];
  }
  const isEdit = false;
  const isPreview = !!history.location.pathname.match(/preview/);
  const isVisit = !!history.location.pathname.match(/visit/);
  return (
    <Header
      className={CLN(S['header'], { [S['hide']]: isPreview || isVisit })}
      style={isEdit ? { height: 40 } : {}}
    >
      <div className={S['logoWrap']}>
        <Icon name={'iconfactory'} className={S['logo']}></Icon>
        <span className={S['title']}>WebFactory</span>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={menuKey}
        className={S['nav']}
      >
        <Menu.Item
          key="1"
          onClick={() => {
            history.push('/console');
          }}
          style={isEdit ? itemStyle : {}}
        >
          控制台
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => {
            // history.push('/edit');
          }}
          style={isEdit ? itemStyle : { padding: 0 }}
        >
          <CreatePage
            style={{ padding: '0 20px' }}
            onSuccess={(pageid: number) => {
              history.push(`/edit/${pageid}`);
            }}
          >
            新建页面
          </CreatePage>
        </Menu.Item>
        <Menu.Item
          key="3"
          style={isEdit ? itemStyle : {}}
          onClick={() => {
            history.push('/person');
          }}
        >
          个人中心
        </Menu.Item>
      </Menu>
      <div className={S['userWrap']}>
        <img
          src={user?.userProfile.avatar}
          className={S['userAvatar']}
          alt=""
        />
        <div className={S['userName']}>{user?.userProfile.userName}</div>
      </div>
    </Header>
    // <div className={S['container']}>
    //   <div className={S['titleWrap']}>
    //     <Icon name={'iconfactory'} className={S['logo']}></Icon>
    //     <span className={S['title']}>WebFactory</span>
    //   </div>
    //   <div className={S['userWrap']}>
    //     <div className={S['avatar']}>
    //       <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2324934928,732707167&fm=26&gp=0.jpg" alt="avatar" />
    //     </div>
    //     <span className={S['userName']}>{user?.userProfile.userName}</span>
    //   </div>
    // </div>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    user: state.user
  };
};
export default withRouter(connect(mapStateToProps)(Component));
