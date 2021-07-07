import React, { useEffect, useRef, useState } from 'react';
import CLN from 'classnames';
import { connect } from 'react-redux';
import Icon from '@components/Icon';
import { setDragLock, setToolSelectId } from '@action/editor';
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
  const id = 3;
  const name = 'baseControl';
  useEffect(() => {}, [tool?.selectId]);
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
      <Icon name="iconkongjian"></Icon>
      {tool?.selectId == id && (
        <ul className={S['downList']} ref={ref}>
          <li
            className={CLN(S['item'], S['topAlign'])}
            draggable={true}
            title={'文本标签'}
            onDragStart={event => {
              event.dataTransfer.setData(
                'transfer',
                JSON.stringify({ type: 'Text' } || {})
              );
            }}
            onDragEnd={() => {
              // setToolSelectId(0);
            }}
            onClick={event => {
              event.stopPropagation();
            }}
          >
            <Icon name="iconwenben"></Icon>
          </li>
          <li
            className={CLN(S['item'], S['bottomAlign'])}
            title={'图片控件'}
            draggable={true}
            onDragStart={event => {
              event.dataTransfer.setData(
                'transfer',
                JSON.stringify({ type: 'Image' } || {})
              );
            }}
            onClick={event => {
              event.stopPropagation();
            }}
          >
            <Icon name="icontupian"></Icon>
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
