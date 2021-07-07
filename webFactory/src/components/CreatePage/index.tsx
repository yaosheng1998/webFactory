import React, {
  PropsWithChildren,
  ReactChildren,
  useEffect,
  useState
} from 'react';
import CLN from 'classnames';
import S from './index.less';
import { message, Modal, Input } from 'antd';
import { connect } from 'react-redux';

import Form from '@components/Form';
import { getPage } from '@core/doRequest';
import { setLogin, setUserInfo, setUserPage, setPageGroup } from '@action/user';
import { login, regist, tokenValidator } from '@core/user';
import { getPageData } from '@core/editor';
import { createPage } from '@core/editor';
import store, { IState } from '@/reducer';
import { dateFormat } from '@/utils/tool';
import Login from '@routes/Login';
const { Select, Upload, Switch } = Form;
interface IProps extends PropsWithChildren<any> {
  user: IState['user'];
  style: object;
  groupId: number;
  onSuccess: (...args: any) => {};
}
const Component = (props: IProps) => {
  const { children, user, style, onSuccess, groupId } = props;
  const [visible, setVisible] = useState(false);
  const [pageName, setPageName] = useState('');
  const [encode, setEncode] = useState(false);
  const [groupid, setGroupid] = useState(user.group[0]?.groupid);
  const [descript, setDescript] = useState('');
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const init = () => {
    setPageName('');
    setEncode(false);
    setDescript('');
    setVisible(false);
  };
  const handleOk = () => {
    setConfirmLoading(true);
    createPage({
      userid: user.userid,
      name: pageName,
      encode,
      groupid: groupId ? groupId : groupid,
      descript
    })
      .then(res => {
        init();
        if (res.state == 1) {
          onSuccess && onSuccess(res.pageid);
          setConfirmLoading(false);
          message.success('新建成功。');
          return getPageData(user.userid);
        }
      })
      .then(res => {
        getPage(user.userid);
      });
  };
  useEffect(() => {
    setGroupid(user.group[0]?.groupid);
  }, [user.group]);
  const handleCancel = () => {
    init();
  };
  return (
    <div className={S['container']}>
      <Modal
        title="新建页面"
        visible={visible}
        onOk={handleOk}
        okText="新建"
        cancelText="取消"
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <div className={CLN(S['pageName'], S['attr'])}>
          <span className={S['title']}>页面名 :</span>
          <Input
            className={S['input']}
            value={pageName}
            onChange={event => {
              const target = event?.target;
              setPageName(target.value);
            }}
          ></Input>
        </div>
        <div className={CLN(S['pageDescript'], S['attr'])}>
          <span className={S['title']}>简介 :</span>
          <Input
            className={S['input']}
            value={descript}
            onChange={event => {
              const target = event?.target;
              setDescript(target.value);
            }}
          ></Input>
        </div>
        {!groupId && (
          <div className={CLN(S['pageGroup'], S['attr'])}>
            <span className={S['title']}>页面组 :</span>
            <Select
              value={groupid}
              options={user.group.map(item => {
                return { value: item.groupid, text: item.name };
              })}
              width={200}
              onChange={value => {
                setGroupid(value);
              }}
            ></Select>
          </div>
        )}
        <div className={CLN(S['pageEncode'], S['attr'])}>
          <span className={S['title']}>加密 :</span>
          <Switch
            checked={encode}
            onChange={checked => {
              setEncode(checked);
            }}
          ></Switch>
        </div>
      </Modal>
      <div
        style={style}
        onClick={() => {
          setVisible(true);
        }}
      >
        {children}
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(Component);
