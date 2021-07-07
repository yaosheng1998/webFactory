import React, { useEffect, useState } from 'react';
import CLN from 'classnames';
import S from './index.less';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  withRouter,
  RouteComponentProps
} from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Modal, Input } from 'antd';
import { connect } from 'react-redux';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined
} from '@ant-design/icons';

import { dateFormat } from '@/utils/tool';
import { setUserPage, setPageGroup } from '@action/user';
import { createGroup } from '@core/editor';
import store, { IState } from '@/reducer';
import Icon from '@components/Icon';
import PageManager from '@routes/pageManager';
import DataSourceManager from '@/routes/DataSourceManager';
import BinManager from '@/routes/BinManager';

interface IProps extends RouteComponentProps {
  user: IState['user'];
}
const { SubMenu } = Menu;
const { Content, Footer, Sider } = Layout;
const Component = (props: IProps) => {
  const { history, user, match } = props;
  const [visible, setVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  let selectKey = ['1'];
  const getRoute = () => {
    let route = ['控制台'];
    const pathname = history.location.pathname;
    if (pathname.match('pageManager')) {
      route.push('页面管理');
      const id = pathname.match(/\d*$/)![0];
      const _name = user.group.filter(item => {
        return item.groupid == parseInt(id);
      });
      route.push(_name[0]?.name);
      selectKey = ['' + _name[0]?.groupid];
    } else if (pathname.match('dataSourceManager')) {
      route.push('数据管理');
      selectKey = ['dataManager'];
    } else if (pathname.match('binManager')) {
      route.push('回收站');
      selectKey = ['binManager'];
    }
    return route;
  };
  return (
    <Layout className={S['container']}>
      <Modal
        title="添加分组"
        visible={visible}
        onOk={() => {
          setVisible(false);
          setConfirmLoading(true);
          createGroup({
            userid: user.userid,
            name: groupName
          }).then(res => {
            if (res.state == 1) {
              setConfirmLoading(false);
              setPageGroup(res.groups);
            }
          });
        }}
        okText="添加"
        cancelText="取消"
        confirmLoading={confirmLoading}
        onCancel={() => {
          setGroupName('');
          setVisible(false);
        }}
      >
        <div className={CLN(S['attr'])}>
          <span className={S['title']}>组名 :</span>
          <Input
            className={S['input']}
            value={groupName}
            onChange={event => {
              const target = event.target;
              setGroupName(target.value);
            }}
          ></Input>
        </div>
      </Modal>
      <Breadcrumb className={S['breadcrumb']}>
        {getRoute().map(item => {
          return <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>;
        })}
      </Breadcrumb>
      <Layout className={S['content']}>
        <Sider
          className={S['Nav']}
          theme="light"
          style={{ boxShadow: '1px 1px 5px 1px #ccc' }}
        >
          <Menu
            mode="inline"
            selectedKeys={selectKey}
            // defaultOpenKeys={['dataManager']}
          >
            <SubMenu key="pageManager" icon={<UserOutlined />} title="页面管理">
              {user.group.map(item => {
                return (
                  <Menu.Item
                    key={item.groupid}
                    onClick={() => {
                      history.push(`/console/pageManager/${item.groupid}`);
                    }}
                  >
                    {item.name}
                  </Menu.Item>
                );
              })}
              <Menu.Item
                key="groupAdd"
                onClick={() => {
                  // history.push('/console/pageManager/2');
                  console.log(visible);
                  setVisible(true);
                }}
              >
                添加分组
              </Menu.Item>
            </SubMenu>
            <Menu.Item
              key="dataManager"
              icon={<Icon name="iconshuju" className={S['itemIcon']}></Icon>}
              onClick={() => {
                history.push('/console/dataSourceManager');
              }}
            >
              数据管理
            </Menu.Item>
            <Menu.Item
              key="binManager"
              icon={
                <Icon name="iconhuishouzhan1" className={S['itemIcon']}></Icon>
              }
              onClick={() => {
                history.push('/console/binManager');
              }}
            >
              回收站
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className={S['main']}>
          <Router>
            <Switch>
              <Route path="/console" exact component={PageManager}>
                <Redirect
                  to={`/console/pageManager/${
                    user.group[0] ? user.group[0].groupid : 0
                  }`}
                />
              </Route>
              <Route
                path="/console/pageManager/0"
                exact
                component={PageManager}
              >
                <Redirect
                  to={`/console/pageManager/${
                    user.group[0] ? user.group[0].groupid : 0
                  }`}
                />
              </Route>
              <Route path="/console/pageManager" exact component={PageManager}>
                <Redirect
                  to={`/console/pageManager/${
                    user.group[0] ? user.group[0].groupid : 0
                  }`}
                />
              </Route>
              <Route
                path="/console/pageManager/:id"
                exact
                component={PageManager}
              ></Route>
              <Route
                path="/console/dataSourceManager"
                exact
                component={DataSourceManager}
              ></Route>
              <Route
                path="/console/binManager"
                exact
                component={BinManager}
              ></Route>
            </Switch>
          </Router>
        </Content>
      </Layout>
    </Layout>
  );
};
const mapStateToProps = (state: IState) => {
  return {
    user: state['user']
  };
};

export default withRouter(connect(mapStateToProps)(Component));
