import React, { useEffect, useState } from 'react';
import CLN from 'classnames';
import S from './index.less';
import { message, Progress } from 'antd';
import { setLogin, setUserInfo } from '@action/user';
import request from '@core/request';
import { login, regist, tokenValidator } from '@core/user';
import { getPageData } from '@core/editor';

import Form from '@components/Form';
import Icon from '@components/Icon';
import ImageSlider from '@components/ImageSlider';
interface IProps {}
const Component = (props: IProps) => {
  const [rember, setRember] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [verify, setVerify] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [count, setCount] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const initData = () => {
    setVerify(false);
    setUsername('');
    setPassword('');
    setRepeat('');
    setPasswordStrength(0);
    setCount(count + 1);
  };
  const checkInput = (type: string) => {
    if (isLogin) return;
    if (type == 'username') {
      if (!username) return;
      if (username.length < 6) {
        return (
          <Icon name="iconcuo" className={CLN(S['check'], S['cuo'])}></Icon>
        );
      } else {
        return (
          <Icon name="icondui" className={CLN(S['check'], S['dui'])}></Icon>
        );
      }
    } else if (type == 'password') {
      if (!password) return;
      if (password.length < 6) {
        return (
          <Icon name="iconcuo" className={CLN(S['check'], S['cuo'])}></Icon>
        );
      } else {
        return (
          <Icon name="icondui" className={CLN(S['check'], S['dui'])}></Icon>
        );
      }
    } else if (type == 'repeat') {
      if (!repeat) return;
      if (repeat !== password) {
        return (
          <Icon name="iconcuo" className={CLN(S['check'], S['cuo'])}></Icon>
        );
      } else {
        return (
          <Icon name="icondui" className={CLN(S['check'], S['dui'])}></Icon>
        );
      }
    }
  };
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

  return (
    <div className={S['container']}>
      <div className={S['mask']}>
        <i className={CLN(S['line'], S['one'])}></i>
        <i className={CLN(S['line'], S['two'])}></i>
        <i className={S['point']}></i>
      </div>
      <div className={S['main']}>
        <div className={CLN(S['decorate'], S['1'])}></div>
        <div className={CLN(S['decorate'], S['2'])}></div>
        <div className={CLN(S['decorate'], S['3'])}></div>
        <div className={CLN(S['decorate'], S['4'])}></div>
        <div className={S['content']}>
          <span className={S['title']}>数据可视化网页生产平台</span>
          <div className={S['inputWrap']}>
            <Form.Input
              className={S['input']}
              placeholder={'请输入账号'}
              value={username}
              icon={() => {
                return (
                  <Icon
                    name="icongerenzhongxin"
                    className={S['inputIcon']}
                  ></Icon>
                );
              }}
              onChange={value => {
                setUsername(value);
              }}
            />
            {checkInput('username')}
          </div>
          <div className={S['inputWrap']}>
            <Form.Input
              className={S['input']}
              placeholder={'请输入密码'}
              value={password}
              password={true}
              icon={() => {
                return <Icon name="iconmima" className={S['inputIcon']}></Icon>;
              }}
              onChange={value => {
                if (value.length > 8) {
                  setPasswordStrength(70);
                } else if (value.length > 5) {
                  setPasswordStrength(40);
                } else {
                  setPasswordStrength(10);
                }

                setPassword(value);
              }}
            />
            {checkInput('password')}
          </div>
          {!isLogin && (
            <>
              <div className={CLN(S['inputWrap'])}>
                <Form.Input
                  className={CLN(S['input'], S['repeat'])}
                  placeholder={'请重复密码'}
                  value={repeat}
                  password={true}
                  icon={() => {
                    return (
                      <Icon name="iconmima" className={S['inputIcon']}></Icon>
                    );
                  }}
                  onChange={value => {
                    setRepeat(value);
                  }}
                ></Form.Input>
                {checkInput('repeat')}
              </div>
              <Progress
                style={{ marginBottom: 30 }}
                percent={passwordStrength}
                strokeColor={
                  passwordStrength == 10
                    ? '#e56e58'
                    : passwordStrength == 40
                    ? '#ffd766'
                    : '#52c41a'
                }
                format={percent => {
                  if (percent! < 30) {
                    return <div>弱</div>;
                  } else if (percent! < 60) {
                    return <div>中</div>;
                  } else {
                    return <div>强</div>;
                  }
                }}
                steps={18}
                width={500}
              ></Progress>
            </>
          )}
          {isLogin && (
            <div className={S['optionWrap']}>
              <div className={S['rember']}>
                <Form.Chcekbox
                  checked={rember}
                  onChange={checkced => {
                    setRember(checkced);
                  }}
                />
                <span>记住我</span>
              </div>
            </div>
          )}
          <ImageSlider
            key={`slider_${count}`}
            onChange={result => {
              if (result == 'success') {
                setVerify(true);
              }
            }}
          ></ImageSlider>
          <div
            className={CLN(S['button'], { [S['isLogin']]: isLogin })}
            onClick={() => {
              if (!verify) {
                message.error('滑动验证未通过。');
                return;
              }
              if (isLogin) {
                const hide = message.loading('登陆中....');
                login(username, password).then(res => {
                  if (res.state === 1) {
                    hide();
                    loginSuccess(res.user);
                  } else {
                    hide();
                    message.error(res.message);
                  }
                });
              } else {
                if (username.length < 6) {
                  message.error('用户名长度不能小于6位。');
                  return;
                } else if (password.length < 6) {
                  message.error('密码长度不能小于6位。');
                  return;
                } else if (password !== repeat) {
                  message.error('密码重复错误。');
                  return;
                }
                const hide = message.loading('注册中....');
                regist(username, password).then(res => {
                  if (res.state === 1) {
                    hide();
                    message.success('注册成功。');
                    setIsLogin(true);
                    initData();
                  } else {
                    hide();
                    message.error(res.message);
                  }
                  setCount(count + 1);
                });
              }
            }}
          >
            {isLogin ? '立即登录' : '立即注册'}
          </div>
          <div className={S['optionWrap']}>
            {isLogin ? (
              <>
                <div className={S['register']}>
                  <span>没有账号？</span>
                  <span
                    className={S['button']}
                    onClick={() => {
                      setIsLogin(false);
                      initData();
                    }}
                  >
                    立即注册
                  </span>
                </div>
                <div className={S['forget']}>
                  <span>忘记密码</span>
                </div>
              </>
            ) : (
              <div
                className={S['toLogin']}
                onClick={() => {
                  setIsLogin(true);
                }}
              >
                <span
                  onClick={() => {
                    setIsLogin(true);
                    initData();
                  }}
                >
                  已有账号，立即登录
                </span>
                <Icon name="iconyoujiantou"></Icon>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Component;
