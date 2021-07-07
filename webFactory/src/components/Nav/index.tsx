import React, { useState } from 'react';
import CLN from 'classnames';
import S from './index.less';
import { useHistory, withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu } from 'antd';

import Icon from '@components/Icon';
import { IState } from '@/reducer';

interface IProps extends RouteComponentProps {
  user?: IState['user'];
}

const Component = (props: IProps) => {
  const { history, user } = props;
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={S['container']}>
      <Menu
        mode="inline"
        theme="light"
        className={CLN(S['nav'], { [S['isCollapsed']]: collapsed })}
        inlineIndent={24}
        inlineCollapsed={collapsed}
        defaultSelectedKeys={['1']}
      >
        <Menu.Item
          key="1"
          icon={<Icon name="iconyemianguanli" className={S['itemIcon']}></Icon>}
          onClick={() => {
            history.push('./login');
          }}
        >
          页面管理
        </Menu.Item>
        <Menu.Item
          key="2"
          icon={<Icon name="iconshuju" className={S['itemIcon']}></Icon>}
          onClick={() => {
            history.push('./register');
          }}
        >
          数据管理
        </Menu.Item>
        <Menu.Item
          key="3"
          icon={
            <Icon name="icongerenzhongxin" className={S['itemIcon']}></Icon>
          }
        >
          个人中心
        </Menu.Item>
        <Menu.Item
          key="4"
          icon={
            <Icon
              name="iconhuishouzhan_huaban"
              className={S['itemIcon']}
            ></Icon>
          }
        >
          回收站
        </Menu.Item>
        {/* <Menu.SubMenu
          key="sub1"
          title="Navigation One"
          icon={<Icon name="iconyemianguanli" className={S['itemIcon']}></Icon>}
        >
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
          <Menu.Item key="7">Option 7</Menu.Item>
          <Menu.Item key="8">Option 8</Menu.Item>
        </Menu.SubMenu> */}
      </Menu>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    user: state.user
  };
};

export default withRouter(connect(mapStateToProps)(Component));
