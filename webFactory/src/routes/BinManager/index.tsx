import React, { useEffect, useState } from 'react';
import CLN from 'classnames';
import S from './index.less';
import { LoadingOutlined } from '@ant-design/icons';
import {
  withRouter,
  RouteComponentProps,
  useRouteMatch
} from 'react-router-dom';
import {
  Layout,
  Space,
  Input,
  Table,
  Pagination,
  Tooltip,
  message,
  Spin
} from 'antd';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import CreatePage from '@components/CreatePage';
import { dateFormat } from '@/utils/tool';
import store, { IState } from '@/reducer';
import Icon from '@components/Icon';
import Codemirror from '@components/Codemirror';
import { deletePageReal, recoverPage } from '@core/editor';
import { getPage } from '@/core/doRequest';

interface IProps extends RouteComponentProps {
  user: IState['user'];
}
const { Content, Header, Footer } = Layout;
const { confirm } = Modal;

const Component = (props: IProps) => {
  const { history, user, match } = props;
  const groupid: number = match.params['id'];
  const [groupMap, setGroupMap] = useState({});
  const [search, setSearch] = useState('');
  const [pageCurrent, setPageCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: '页面名',
      editable: true,
      dataIndex: 'name',
      key: 'binManager_name',
      onCell: (record: any) => {
        return { record };
      }
    },
    { title: '组名', dataIndex: 'groupName', key: 'binManager_groupName' },
    { title: '发布状态', dataIndex: 'publish', key: 'binManager_publish' },
    { title: '创建时间', dataIndex: 'create', key: 'binManager_create' },
    { title: '删除时间', dataIndex: 'delete', key: 'binManager_delete' },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'binManager_action',
      render: (_: any, record: any) => {
        return (
          <div className={S['options']}>
            <a
              onClick={() => {
                confirm({
                  icon: <ExclamationCircleOutlined />,
                  content: <div>是否恢复该页面？</div>,
                  okText: '确认',
                  cancelText: '取消',
                  onOk() {
                    setLoading(true);
                    recoverPage(user.userid, record.id).then(res => {
                      if (res.state == 1) {
                        message.success('恢复成功。');
                        getPage(user.userid);
                      }
                      setLoading(false);
                    });
                  },
                  onCancel() {}
                });
              }}
            >
              恢复
            </a>
            <a
              onClick={() => {
                confirm({
                  icon: <ExclamationCircleOutlined />,
                  content: <div>是否彻底删除该页面？</div>,
                  okText: '确认',
                  cancelText: '取消',
                  onOk() {
                    setLoading(true);
                    deletePageReal(user.userid, record.id).then(res => {
                      if (res.state == 1) {
                        message.success('彻底删除成功。');
                        getPage(user.userid);
                      }
                      setLoading(false);
                    });
                  },
                  onCancel() {}
                });
              }}
            >
              彻底删除
            </a>
          </div>
        );
      }
    }
  ];
  const page = user.page
    .filter(item => {
      if (search) {
        return item.name.match(new RegExp(search)) && item.delete;
      }
      return item.delete;
    })
    .map(item => {
      return {
        id: item.id,
        key: item.id,
        name: item.name,
        groupName: groupMap[item.groupid],
        publish: item.publish ? '已发布' : '未发布',
        create: dateFormat(item.create),
        delete: dateFormat(item.delete),
        description: item.description
      };
    });
  useEffect(() => {
    let _groupMap = {};
    user.group.map(item => {
      _groupMap[item.groupid] = item.name;
    });
    setGroupMap(_groupMap);
  }, [user.group]);
  return (
    <Layout className={S['container']} style={{ backgroundColor: '#fff' }}>
      <Spin
        className={CLN(S['spin'], {
          [S['loading']]: loading
        })}
        spinning={loading}
        indicator={<LoadingOutlined style={{ fontSize: 80 }}></LoadingOutlined>}
      ></Spin>
      <div className={S['title']}>回收站</div>
      <div className={S['optionWrap']}>
        <Space className={S['leftOption']} size={10}>
          <Input.Search
            placeholder="页面名..."
            //   enterButton="Search"
            //   size="large"
            value={search}
            onChange={event => {
              const target = event.target;
              setSearch(target.value);
            }}
          />
        </Space>
        <Space className={S['rightOption']} size={10}>
          <Tooltip title="刷新">
            <div
              className={CLN(S['refresh'], S['btn'])}
              onClick={() => {
                setLoading(true);
                getPage(user.userid)!.then(() => {
                  setLoading(false);
                });
              }}
            >
              <Icon name="iconshuaxin1"></Icon>
            </div>
          </Tooltip>
          <Tooltip title="导出">
            <div className={CLN(S['export'], S['btn'])}>
              <Icon name="icondaochu-tianchong"></Icon>
            </div>
          </Tooltip>
        </Space>
      </div>
      <Codemirror visible={false}></Codemirror>
      <Table
        columns={columns as any}
        className={S['table']}
        pagination={false}
        expandable={{
          expandedRowRender: (record: any) => (
            <div style={{ paddingLeft: 49 }}>
              <p>{`简介: ${record.description}`}</p>
            </div>
          )
          // rowExpandable: record => record.name !== 'Not Expandable'
        }}
        dataSource={page.slice(
          (pageCurrent - 1) * 6,
          Math.min((pageCurrent - 1) * 6 + 6, user.page.length)
        )}
      />
      <div className={S['pagination']}>
        <Pagination
          total={Math.ceil(page.length / 6) * 10}
          current={pageCurrent}
          onChange={current => {
            setPageCurrent(current);
          }}
        ></Pagination>
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
