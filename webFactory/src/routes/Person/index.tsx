import React, { useEffect, useRef, useState } from 'react';
import CLN from 'classnames';
import S, { birthday } from './index.less';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';
import {
  withRouter,
  RouteComponentProps,
  useRouteMatch
} from 'react-router-dom';
import { Layout, Input, DatePicker, Spin, message } from 'antd';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import CreatePage from '@components/CreatePage';
import { getCookie, deleteCookie } from '@utils/cookie';
import { dateFormat } from '@/utils/tool';
import { setLogin, setUserInfo, setUserPage, setPageGroup } from '@action/user';
import {
  updateBirthday,
  updateEmail,
  uploadAvatarImage,
  updateAvatar
} from '@core/user';
import { getPage } from '@core/doRequest';
import Form from '@components/Form';
import store, { IState } from '@/reducer';
import Icon from '@components/Icon';
import { init } from 'echarts/core';

interface IProps extends RouteComponentProps {
  user: IState['user'];
}
const { Select } = Form;
const { Content, Header, Footer } = Layout;
const { confirm } = Modal;
const Component = (props: IProps) => {
  const { history, user, match } = props;
  const [editName, setEditName] = useState('');
  const [dataCache, setDataCache] = useState(moment());
  const [emailCache, setEmailCache] = useState('');
  const [languageCache, setLanguageCache] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInput = useRef(null);
  const init = () => {
    setDataCache(moment(user.userProfile.birthday || 0));
    setEmailCache(user.userProfile.email || '');
    setLanguageCache(user.userProfile.language || '');
  };
  useEffect(() => {
    init();
  }, [user.userProfile]);
  return (
    <Layout className={S['container']}>
      <div className={S['content']}>
        <Spin
          className={CLN(S['spin'], {
            [S['loading']]: loading
          })}
          spinning={loading}
          indicator={
            <LoadingOutlined style={{ fontSize: 80 }}></LoadingOutlined>
          }
        ></Spin>
        <input
          ref={fileInput}
          type="file"
          style={{ display: 'none' }}
          onChange={event => {
            const target = event.target;
            const file = target.files![0];
            const formData = new FormData();
            const _extend = file.name.split('.');
            formData.append('file', file);
            formData.append('name', file.name);
            formData.append('extend', _extend[_extend.length - 1]);
            formData.append('path', `${user.userid}_${file.name}`);
            setLoading(true);
            uploadAvatarImage(formData)
              .then(res => {
                if (res.state == 1) {
                  setUserInfo({
                    userid: user.userid,
                    userProfile: {
                      avatar: res.url
                    }
                  });
                  return updateAvatar(user.userid, res.url);
                }
              })
              .then(res => {
                setLoading(false);
              });
            (fileInput.current as any).value = '';
          }}
          accept=".jpg,.png"
        ></input>
        <div className={S['head']}>
          <div className={S['avatarWrap']}>
            <img
              src={user.userProfile.avatar}
              className={S['avatar']}
              onClick={() => {
                (fileInput.current as any).click();
              }}
              alt=""
            />
            <div className={S['nameWrap']}>
              <div className={S['name']}>{user.userProfile.userName}</div>
              <div className={S['id']}>{`id: ${user.userid}`}</div>
            </div>
          </div>
          <Button
            type="primary"
            danger
            className={S['logout']}
            onClick={() => {
              confirm({
                icon: <ExclamationCircleOutlined />,
                content: <div>是否登出？</div>,
                okText: '确认',
                cancelText: '取消',
                onOk() {
                  deleteCookie('token');
                  location.reload();
                },
                onCancel() {}
              });
            }}
          >
            登出
          </Button>
        </div>
        <div className={S['body']}>
          <div className={S['form']}>
            <div className={CLN(S['username'], S['item'])}>
              <span>用户名</span>
              <Input
                type="text"
                value={user.userProfile.userName}
                disabled
                onChange={event => {}}
                className={S['input']}
              ></Input>
            </div>
            <div className={CLN(S['password'], S['item'])}>
              <span>密码</span>
              <Input
                type="password"
                value={'*********'}
                disabled={true}
                onChange={event => {}}
                className={S['input']}
              ></Input>
              <div className={S['change']}>修改</div>
            </div>
            <div className={CLN(S['birthday'], S['item'])}>
              <span>出生日期</span>
              <DatePicker
                allowClear={false}
                style={{ textAlign: 'center' }}
                className={S['input']}
                value={dataCache}
                placeholder={'选择日期...'}
                disabled={editName != 'birthday'}
                onChange={value => {
                  setDataCache(value || moment());
                }}
              />
              <div
                className={S['change']}
                onClick={() => {
                  if (editName != 'birthday') {
                    init();
                    setEditName('birthday');
                  } else {
                    if (dataCache) {
                      setLoading(true);
                      updateBirthday(user.userid, dataCache?.valueOf()).then(
                        res => {
                          if (res.state == 1) {
                            message.success('修改成功。');
                            setUserInfo({
                              userid: user.userid,
                              userProfile: {
                                birthday: new Date(dataCache?.valueOf())
                              }
                            });
                            setLoading(false);
                            setEditName('');
                          }
                        }
                      );
                    }
                  }
                }}
              >
                {editName == 'birthday' ? '保存' : '修改'}
              </div>
            </div>
            <div className={CLN(S['email'], S['item'])}>
              <span>邮箱</span>
              <Input
                type="text"
                value={emailCache}
                disabled={editName != 'email'}
                onChange={event => {
                  const target = event.target;
                  setEmailCache(target.value);
                }}
                className={S['input']}
              ></Input>
              <div
                className={S['change']}
                onClick={() => {
                  if (editName != 'email') {
                    init();
                    setEditName('email');
                  } else {
                    if (emailCache) {
                      setLoading(true);
                      updateEmail(user.userid, emailCache).then(res => {
                        if (res.state == 1) {
                          message.success('修改成功。');
                          setUserInfo({
                            userid: user.userid,
                            userProfile: {
                              email: emailCache
                            }
                          });
                          setLoading(false);
                          setEditName('');
                        }
                      });
                    }
                  }
                }}
              >
                {editName == 'email' ? '保存' : '修改'}
              </div>
            </div>
            <div className={CLN(S['language'], S['item'])}>
              <span>平台语言</span>
              <Select
                options={[{ value: 'zh', text: '中文' }]}
                value={languageCache}
                className={S['input']}
                onChange={value => {
                  setLanguageCache(value);
                }}
                width={320}
                disabled={editName != 'language'}
              ></Select>
              <div
                className={S['change']}
                onClick={() => {
                  if (editName != 'language') {
                    init();
                    setEditName('language');
                  } else {
                    setEditName('');
                  }
                }}
              >
                {editName == 'language' ? '保存' : '修改'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
const mapStateToProps = (state: IState) => {
  return {
    user: state['user']
  };
};

export default withRouter(connect(mapStateToProps)(Component));
