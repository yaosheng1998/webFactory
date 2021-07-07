import React, { useState } from 'react';
import CLN from 'classnames';
import { connect } from 'react-redux';
import { Input } from 'antd';

import store, { IState } from '@/reducer';
import Icon from '@components/Icon';
import S from './index.less';
import { Modal } from 'antd';
import { selected } from '../Drag/Dragbox/index.less';
import { setElementState, elementSelect, setLineState } from '@action/editor';

interface IProps {
  className?: string;
  height?: number;
  element?: IState['editor']['element'];
  layer?: IState['editor']['layer'];
}

const Component = (props: IProps) => {
  const { className, height, element, layer } = props;
  const [isOpen, setIsOpen] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nameText, setNameText] = useState('');
  const [elementid, setElementid] = useState(0);
  const getIcon = (type: string) => {
    if (type == 'Chart') {
      return 'iconshuju';
    } else if (type == 'Image') {
      return 'icontupian';
    } else if (type == 'Text') {
      return 'iconwenben';
    } else if (type == 'Screen') {
      return 'iconpingmu';
    }
  };
  return (
    <div className={CLN(className, S['container'])}>
      <Modal
        title="修改名称"
        visible={modalVisible}
        onOk={() => {
          setElementState({ id: elementid, name: nameText });
          setModalVisible(false);
        }}
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <div className={S['wrap']}>
          <span>名称:</span>
          <Input
            className={S['input']}
            value={nameText}
            onChange={event => {
              const target = event?.target;
              setNameText(target.value);
            }}
          ></Input>
        </div>
      </Modal>
      <div className={S['title']}>
        <span>图层</span>
      </div>
      <ul
        className={CLN(
          S['content'],
          { [S['hidden']]: !isOpen },
          'blackScrollBar'
        )}
        style={{ height: height || 300 }}
      >
        {element?.map(item => {
          return (
            <li
              className={CLN(S['item'], { [S['selected']]: item.selected })}
              key={item.id}
              onClick={() => {
                setLineState({
                  left: item.left,
                  top: item.top,
                  show: item.id != -1
                });
                elementSelect(item.id);
              }}
            >
              <div className={S['name']}>
                <Icon name={getIcon(item.type)!}></Icon>
                <span>{item.name}</span>
              </div>
              <div className={S['options']}>
                {item.id != -1 && (
                  <Icon
                    name="iconbianji"
                    onClick={event => {
                      event.stopPropagation();
                      setModalVisible(true);
                      setNameText(item.name);
                      setElementid(item.id);
                    }}
                    className={S['edit']}
                  ></Icon>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div
        className={S['up']}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <Icon name={isOpen ? 'iconshangjiantou' : 'iconxiajiantou'}></Icon>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    element: state.editor.element,
    layer: state.editor.layer
  };
};

export default connect(mapStateToProps)(Component);
