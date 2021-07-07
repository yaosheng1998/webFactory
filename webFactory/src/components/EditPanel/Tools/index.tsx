import React from 'react';
import CLN from 'classnames';
import { connect } from 'react-redux';

import Icon from '@components/Icon';
import store, { IState } from '@/reducer';
import { ITool } from '@reducer/editor';
import { setToolSelectId } from '@action/editor';
import Align from './Align';
import Drag from './Drag';
import BaseControl from './BaseControl';
import ChartsControl from './ChartsControl';
import S from './index.less';
import { render } from 'react-dom';

interface IProps {
  className?: string;
  tool?: IState['editor']['tool'];
  onChange?: (tool: ITool) => void;
}

const Component = (props: IProps) => {
  const { className, tool, onChange } = props;
  return (
    <div className={CLN(className, S['container'])}>
      <ul className={S['tools']}>
        <li
          className={CLN(S['item'], { [S['active']]: tool?.selectId == 0 })}
          onClick={() => {
            setToolSelectId(0);
          }}
        >
          <Icon name={'iconzhizhen'}></Icon>
        </li>
        <Drag className={S['item']}></Drag>
        <Align className={S['item']}></Align>
        <BaseControl className={S['item']}></BaseControl>
        <ChartsControl className={S['item']}></ChartsControl>
        {/* {tool.toolList.map(item => {
          return (
            <li
              draggable={true}
              onDragStart={event => {
                event.dataTransfer.setData(
                  'transfer',
                  JSON.stringify(item.dataTransfer || {})
                );
              }}
              key={item.id}
              className={CLN(S['item'], {
                [S['active']]: tool.selectId == item.id
              })}
              onClick={() => {
                if (item.id == tool.selectId) return;
                const lastTool = tool.toolList[tool.selectId];
                lastTool.onChange && lastTool.onChange();
                setToolSelectId(item.id);
                item.onActive && item.onActive();
                onChange && onChange(tool.toolList[item.id]);
              }}
            >
              <Icon name={item.iconName}></Icon>
            </li>
          );
        })} */}
      </ul>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    tool: state.editor.tool
  };
};

export default connect(mapStateToProps)(Component);
