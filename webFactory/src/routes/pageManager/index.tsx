import React, { useEffect, useState } from 'react';
import CLN from 'classnames';
import S from './index.less';
import { LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
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
import { setLogin, setUserInfo, setUserPage, setPageGroup } from '@action/user';
import {
  deletePage,
  publishPage,
  deleteGroup,
  getPageContent
} from '@core/editor';
import { getPage } from '@core/doRequest';
import store, { IState } from '@/reducer';
import Icon from '@components/Icon';

interface IProps extends RouteComponentProps {
  user: IState['user'];
}
const { Content, Header, Footer } = Layout;
const { confirm } = Modal;
const Component = (props: IProps) => {
  const { history, user, match } = props;
  const groupid: number = match.params['id'];
  const [search, setSearch] = useState('');
  const [pageCurrent, setPageCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: '页面名',
      editable: true,
      dataIndex: 'name',
      key: 'pageManager_name',
      onCell: (record: any) => {
        return { record };
      }
    },
    { title: '数据源ID', dataIndex: 'sourceid', key: 'pageManager_sourceid' },
    { title: '发布状态', dataIndex: 'publish', key: 'pageManager_publish' },
    { title: '创建时间', dataIndex: 'create', key: 'pageManager_create' },
    { title: '更新时间', dataIndex: 'update', key: 'pageManager_update' },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'pageManager_action',
      render: (_: any, record: any) => {
        return (
          <div className={S['options']}>
            <a
              onClick={() => {
                history.push(`/edit/${record.id}`);
              }}
            >
              编辑
            </a>
            <a
              onClick={() => {
                confirm({
                  icon: <ExclamationCircleOutlined />,
                  content: <div>是否发布该页面？</div>,
                  okText: '确认',
                  cancelText: '取消',
                  onOk() {
                    setLoading(true);
                    publishPage(
                      user.userid,
                      record.id,
                      record.publish == '已发布' ? false : true
                    ).then(res => {
                      if (res.state == 1) {
                        message.success(
                          record.publish ? '发布成功。' : '取消发布成功。'
                        );
                        getPage(user.userid);
                      }
                      setLoading(false);
                    });
                  },
                  onCancel() {}
                });
              }}
            >
              发布
            </a>
            <a
              onClick={() => {
                confirm({
                  icon: <ExclamationCircleOutlined />,
                  content: <div>是否删除该页面？</div>,
                  okText: '确认',
                  cancelText: '取消',
                  onOk() {
                    setLoading(true);
                    deletePage(user.userid, record.id)
                      .then(res => {
                        if (res.state == 1) {
                          message.success('删除成功。');
                          return getPage(user.userid);
                        }
                      })
                      .then(() => {
                        if (user.page.length < pageCurrent * 6) {
                          setPageCurrent(Math.max(pageCurrent - 1, 1));
                        }
                        setLoading(false);
                      });
                  },
                  onCancel() {}
                });
              }}
            >
              删除
            </a>
          </div>
        );
      }
    }
  ];
  const page = user.page.filter(item => {
    if (item.delete) return false;
    if (search) {
      return item.groupid == groupid && item.name.match(new RegExp(search));
    }
    return item.groupid == groupid;
  });
  return (
    <Layout className={S['container']} style={{ backgroundColor: '#fff' }}>
      <Spin
        className={CLN(S['spin'], {
          [S['loading']]: loading
        })}
        spinning={loading}
        indicator={<LoadingOutlined style={{ fontSize: 80 }}></LoadingOutlined>}
      ></Spin>
      <div className={S['title']}>页面管理</div>
      <div className={S['optionWrap']}>
        <Space className={S['leftOption']} size={10}>
          <div className={S['createPage']}>
            <CreatePage
              style={{ padding: '0 10px' }}
              groupId={groupid}
              onSuccess={(pageid: number) => {
                history.push(`/edit/${pageid}`);
              }}
            >
              新建页面
            </CreatePage>
          </div>
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
                getPage(user.userid)?.then(res => {
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
          <Tooltip title="删除">
            <div
              className={CLN(S['delete'], S['btn'])}
              onClick={() => {
                confirm({
                  icon: <ExclamationCircleOutlined />,
                  content: <div>分组删除时页面将会丢失，是否删除该分组？</div>,
                  okText: '确认',
                  cancelText: '取消',
                  onOk() {
                    setLoading(true);
                    deleteGroup(user.userid, groupid)
                      .then(res => {
                        if (res.state == 1) {
                          return getPage(user.userid);
                        }
                        setLoading(false);
                      })
                      .then(() => {
                        history.push('/console/pageManager');
                      });
                  },
                  onCancel() {}
                });
              }}
            >
              <DeleteOutlined style={{ fontSize: 16 }}></DeleteOutlined>
              {/* <Icon name="icondaochu-tianchong"></Icon> */}
            </div>
          </Tooltip>
        </Space>
      </div>
      <Table
        columns={columns as any}
        className={S['table']}
        pagination={false}
        expandable={{
          expandedRowRender: record => (
            <div style={{ paddingLeft: 49 }}>
              <p style={{ paddingBottom: 16 }}>{`访问链接: ${
                record.url || '--'
              }`}</p>
              <p style={{ paddingBottom: 16 }}>{`秘钥: ${
                record.visitKey || '--'
              }`}</p>
              <p>{`简介: ${record.description || '--'}`}</p>
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
