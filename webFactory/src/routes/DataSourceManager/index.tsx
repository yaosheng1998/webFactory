import React, { useEffect, useState } from 'react';
import CLN from 'classnames';
import S from './index.less';
import {
  withRouter,
  RouteComponentProps,
  useRouteMatch
} from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { Layout, Space, Input, Table, Pagination, Tooltip, Spin } from 'antd';
import { connect } from 'react-redux';

import {
  updateData,
  getElementData,
  savePageContent,
  uploadBackgroundImage,
  deleteBackgroundImage
} from '@core/editor';
import Codemirror from '@components/Codemirror';
import Form from '@components/Form';
import CreatePage from '@components/CreatePage';
import { getPageElementData } from '@core/editor';
import { dateFormat } from '@/utils/tool';
import store, { IState } from '@/reducer';
import Icon from '@components/Icon';
import { use } from 'echarts/core';

const { Select } = Form;

interface IProps extends RouteComponentProps {
  user: IState['user'];
}
const { Content, Header, Footer } = Layout;

const Component = (props: IProps) => {
  const { history, user, match } = props;
  const groupid: number = match.params['id'];
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [codeVisible, setCodeVisible] = useState(false);
  const [codeData, setCodeData] = useState('');
  const [elementid, setElementid] = useState(0);
  const columns = [
    {
      title: '数据源ID',
      editable: true,
      dataIndex: 'sourceid',
      key: 'dataSourceManager_sourceid',
      width: 220,
      align: 'center',
      onCell: (record: any) => {
        return { record };
      }
    },
    {
      title: '数据表名',
      dataIndex: 'elementName',
      key: 'dataSourceManager_pageName'
    },
    { title: '创建时间', dataIndex: 'create', key: 'dataSourceManager_create' },
    { title: '更新时间', dataIndex: 'update', key: 'dataSourceManager_update' },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'dataSourceManager_action',
      render: (_: any, record: any) => {
        return (
          <div className={S['options']}>
            <a
              onClick={() => {
                setCodeVisible(true);
                setCodeData(record.data);
                setElementid(record.elementid);
              }}
            >
              修改
            </a>
          </div>
        );
      }
    }
  ];
  const page = user.page.filter(item => {
    if (search) {
      return item.groupid == groupid && item.name.match(new RegExp(search));
    }
    return item.groupid == groupid;
  });
  const [pageCurrent, setPageCurrent] = useState(1);
  const [select, setSelect] = useState(0);
  const getData = () => {
    setLoading(true);
    return getPageElementData(user.userid, select).then(res => {
      console.log(res);
      if (res.state == 1) {
        setData(
          res.data
            .map((item: any) => {
              return {
                key: `source_${select}_${item.elementid}`,
                sourceid: `source_${select}_${item.elementid}`,
                elementName: item.elementName,
                elementid: item.elementid,
                data: item.data,
                create: dateFormat(item.create_time),
                update: dateFormat(item.update_time)
              };
            })
            .filter((item: any) => {
              if (search) {
                return item.elementName.match(new RegExp(search));
              }
              return true;
            })
        );
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    const _page = user.page.filter(item => !item.delete);
    setSelect(_page.length ? _page[0].id : 0);
  }, [user.page]);
  useEffect(() => {
    if (select == 0) return;
    getData();
  }, [select]);
  const realData = data.filter((item: any) => {
    if (search) {
      return item.elementName.match(new RegExp(search));
    }
    return true;
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
      <Codemirror
        data={codeData}
        visible={codeVisible}
        onCancel={() => {
          setCodeVisible(false);
        }}
        onOk={value => {
          console.log('ok', value);
          setLoading(true);
          updateData({
            userid: user.userid,
            pageid: select,
            elementid,
            data: value
          }).then(res => {
            getData();
          });
          setCodeVisible(false);
        }}
      ></Codemirror>
      <div className={S['title']}>数据管理</div>
      <div className={S['optionWrap']}>
        <Space className={S['leftOption']} size={10}>
          <Select
            options={user.page
              .filter(item => !item.delete)
              .map(item => {
                return {
                  value: item.id,
                  text: item.name
                };
              })}
            width={200}
            value={select}
            onChange={value => {
              setSelect(value);
              // setElementState({ id: _element.id, colorGradient: value });
              // console.log('value', {
              //   id: element.id,
              //   image: { state: value }
              // });
            }}
          ></Select>
          <Input.Search
            placeholder="数据表名..."
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
                getData().then(() => {
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
      <Table
        columns={columns as any}
        className={S['table']}
        pagination={false}
        // expandable={{
        //   expandedRowRender: record => (
        //     <div style={{ paddingLeft: 49 }}>
        //       <p style={{ paddingBottom: 16 }}>{`访问链接: ${record.url}`}</p>
        //       <p style={{ paddingBottom: 16 }}>{`秘钥: ${record.visitKey}`}</p>
        //       <p>{`描述: ${record.description}`}</p>
        //     </div>
        //   )
        //   // rowExpandable: record => record.name !== 'Not Expandable'
        // }}
        dataSource={realData.slice(
          (pageCurrent - 1) * 6,
          Math.min((pageCurrent - 1) * 6 + 6, user.page.length)
        )}
      />
      <div className={S['pagination']}>
        <Pagination
          total={Math.ceil(realData.length / 6) * 10}
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
