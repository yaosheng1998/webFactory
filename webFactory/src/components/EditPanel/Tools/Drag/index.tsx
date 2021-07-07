import React, { useEffect } from 'react';
import CLN from 'classnames';
import { connect } from 'react-redux';
import store, { IState } from '@/reducer';
import Icon from '@components/Icon';
import { setDragLock, setToolSelectId } from '@action/editor';

import S from './index.less';
import ToolS from '../index.less';

interface IProps {
  tool?: IState['editor']['tool'];
  className?: string;
}
const Component = (props: IProps) => {
  const { tool, className } = props;
  const id = 1;
  const name = 'drag';
  useEffect(() => {
    if (tool?.selectId == id) {
      const $editPanel = $('#editPanel');
      const $editPanelBG = $('#editPanelBG');
      const $content = $('#editContent');
      setDragLock(true);
      $editPanel.on('mousedown', event => {
        let curLeft = parseInt($content.css('left'));
        let curTop = parseInt($content.css('top'));
        let curPageX = event.pageX;
        let curPageY = event.pageY;
        $content.on('mousemove', event => {
          const pageX = event.pageX;
          const pageY = event.pageY;
          const diffX = pageX - curPageX;
          const diffY = pageY - curPageY;
          curPageX = pageX;
          curPageY = pageY;
          curLeft += diffX;
          curTop += diffY;
          $content.css({ left: curLeft, top: curTop });
        });
        $editPanel.on('mouseup', () => {
          $content.off('mousemove');
        });
      });
    } else {
      const $editPanel = $('#editPanel');
      $editPanel.off('mousedown');
      setDragLock(false);
    }
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
      }}
    >
      <Icon name="iconzhuashou2"></Icon>
    </li>
  );
};

const mapStateToProps = (state: IState) => {
  return { tool: state.editor.tool };
};

export default connect(mapStateToProps)(Component);
