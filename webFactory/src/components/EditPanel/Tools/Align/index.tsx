import React, { useEffect, useRef, useState } from 'react';
import CLN from 'classnames';
import { connect } from 'react-redux';
import Icon from '@components/Icon';
import {
  setDragLock,
  setToolSelectId,
  elementTopAlign,
  elementLeftAlign,
  elementBottomAlign,
  elementRightAlign
} from '@action/editor';
import store, { IState } from '@/reducer';
import { hasChildren } from '@/utils/tool';
import S from './index.less';
import ToolS from '../index.less';

interface IProps {
  className?: string;
  tool?: IState['editor']['tool'];
}

const Component = (props: IProps) => {
  const { className, tool } = props;
  const ref = useRef(null);
  // const [show, setShow] = useState(false);
  const id = 2;
  const name = 'align';
  useEffect(() => {
    // if (tool?.selectId == id) {
    //   setShow(true);
    // } else {
    //   setShow(false);
    // }
  }, [tool?.selectId]);
  return (
    <li
      className={CLN(
        S['container'],
        { [ToolS['active']]: tool?.selectId == id },
        className
      )}
      onClick={() => {
        setToolSelectId(id);
        $('body')
          .off('click')
          .on('click', event => {
            const target = event.target;
            if (!hasChildren(ref.current, target)) {
              setToolSelectId(0);
              $('body').off('click');
            }
          });
      }}
    >
      <Icon name="iconduiqibiaozhi"></Icon>
      {tool?.selectId == id && (
        <ul className={S['downList']} ref={ref}>
          <li
            className={CLN(S['item'], S['topAlign'])}
            onClick={event => {
              elementTopAlign();
            }}
          >
            <Icon name="iconshangduiqi"></Icon>
            <span>上对齐</span>
          </li>
          <li
            className={CLN(S['item'], S['bottomAlign'])}
            onClick={event => {
              elementBottomAlign();
            }}
          >
            <Icon name="iconxiaduiqi"></Icon>
            <span>下对齐</span>
          </li>
          <li
            className={CLN(S['item'], S['leftAlign'])}
            onClick={event => {
              elementLeftAlign();
            }}
          >
            <Icon name="iconzuoduiqi"></Icon>
            <span>左对齐</span>
          </li>
          <li
            className={CLN(S['item'], S['rightAlign'])}
            onClick={event => {
              elementRightAlign();
            }}
          >
            <Icon name="iconyouduiqi"></Icon>
            <span>右对齐</span>
          </li>
        </ul>
      )}
    </li>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    tool: state.editor.tool
  };
};

export default connect(mapStateToProps)(Component);
