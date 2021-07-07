import React from 'react';
import CLN from 'classnames';
import { Provider } from 'react-redux';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { Layout, Breadcrumb, Menu } from 'antd';

import store from '@/reducer';
import Header from '@components/Header';
import Nav from '@components/Nav';
import Authorize from '@components/Authorize';
import Login from '@routes/Login';
import Console from '@routes/Console';
import Person from '@routes/Person';
import Edit from '@routes/Edit';
import S from './index.less';
import VisitPage from '@routes/VisitPage';

interface IProps {}
const { SubMenu } = Menu;
const { Content, Footer, Sider } = Layout;
const Component = (props: IProps) => {
  return (
    <Provider store={store}>
      <Router>
        <Authorize>
          <Layout className={S['container']}>
            <Header></Header>
            <Switch>
              <Route path="/" exact component={Console}>
                <Redirect to="/console" />
              </Route>
              <Route path="/console" component={Console}></Route>
              <Route path="/edit/:id" component={Edit}></Route>
              <Route path="/preview" component={VisitPage}></Route>
              <Route path="/person" component={Person}></Route>
              <Route path="/visit/:key" component={VisitPage}></Route>
            </Switch>
          </Layout>
        </Authorize>
      </Router>
      {/* <div className={CLN(S['container'])}>
          <div className={CLN(S['header'])}>
            <Header />
          </div>
          <div className={S['body']}>
            <Router>
              <Nav />
              <div className={S['main']}>
                <Switch>
                  <Route path="/" exact component={Login}></Route>
                  <Route path="/login" exact component={Login}></Route>
                  <Route path="/register" exact component={Login}></Route>
                </Switch>
              </div>
            </Router>
          </div>
        </div> */}
    </Provider>
  );
};

export default Component;
