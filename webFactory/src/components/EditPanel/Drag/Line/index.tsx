import React, { useState } from 'react';
import CLN from 'classnames';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import $ from 'jquery';

import store, { IState } from '@/reducer';
import { deleteElementSelected, setLineState } from '@action/editor';
import { deleteData } from '@core/editor';
import S from './index.less';

const { confirm } = Modal;

interface IProps {
  line?: IState['editor']['drag']['line'];
  deleteElement?: (...args: any) => void;
}

const Component = (props: IProps) => {
  const { line, deleteElement } = props;
  return (
    <div
      id="line"
      className={S['container']}
      style={{
        display: line?.show ? 'inline-block' : 'none',
        left: line?.left,
        top: line?.top
      }}
    >
      <div className={S['topLine']}></div>
      <div className={S['leftLine']}></div>
      <div className={S['rect']}>
        <div className={S['rectInfo']}>{`${line?.left}, ${line?.top}`}</div>
        <div
          className={S['delete']}
          id="lineDelete"
          onMouseUp={() => {
            confirm({
              icon: <ExclamationCircleOutlined />,
              content: <div>是否删除该元素</div>,
              okText: '确认',
              cancelText: '取消',
              onOk() {
                setLineState({
                  left: 0,
                  top: 0,
                  show: false
                });
                deleteElement && deleteElement();
              },
              onCancel() {}
            });
          }}
        >
          删除
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    line: state.editor.drag.line
  };
};

export default connect(mapStateToProps)(Component);
