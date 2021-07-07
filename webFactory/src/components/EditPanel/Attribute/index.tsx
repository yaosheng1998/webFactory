import React, { useEffect, useRef, useState } from 'react';
import CLN from 'classnames';
import { connect } from 'react-redux';
import { Input, Space, Button } from 'antd';

import store, { IState } from '@/reducer';
import {
  IBackgroundElement,
  IChartsElement,
  IControlImage
} from '@reducer/editor';
import ColorPickr from '@components/ColorPickr';
import Folder from '@components/Folder';
import Form from '@components/Form';
import S from './index.less';
import dataFormat from '@core/dataFormat';
import {
  updateData,
  getElementData,
  savePageContent,
  uploadBackgroundImage,
  deleteBackgroundImage,
  uploadElementImage,
  deleteElementImage
} from '@core/editor';
import {
  setElementState,
  setChartOptions,
  setElementData
} from '@/action/editor';
import { getPage } from '@core/doRequest';
import Codemirror from '@components/Codemirror';
import user from '@/reducer/user';

interface IProps {
  name?: string;
  className?: string;
  pageid: number;
  userid: IState['user']['userid'];
  elementList: IState['editor']['element'];
  elementData: IState['editor']['elementData'];
  onLoading?: (...args: any) => void;
  onLoaded?: (...args: any) => void;
}

const { Select, Upload, Switch } = Form;

const Component = (props: IProps) => {
  const {
    className,
    name,
    elementList,
    elementData,
    userid,
    pageid,
    onLoading,
    onLoaded
  } = props;
  const elementSelectList = elementList.filter(item => item.selected);
  let element = elementSelectList[0] || {};
  const [codeVisible, setCodeVisible] = useState(false);
  const [codeData, setCodeData] = useState('');
  const [readonly, setReadonly] = useState(false);
  const save = (content: string) => {
    onLoading && onLoading();
    return savePageContent(userid, pageid, content).then(res => {
      if (res.state == 1) {
        getPage(userid);
      }
      onLoaded && onLoaded();
    });
  };
  const createAttribute = () => {
    if (!elementSelectList.length) return;
    if (element.type == 'Screen') {
      const _element = element as IBackgroundElement;
      const isGradient = _element.colorGradient != 'none';
      return (
        <li className={S['item']}>
          <Folder title="背景样式" className={S['folder']}>
            <div className={CLN(S['line'])}>
              <span>{isGradient ? '开始颜色' : '背景颜色'}</span>
              <ColorPickr
                color={_element?.backgroundColor}
                onSave={color => {
                  setElementState({ id: _element.id, backgroundColor: color });
                  console.log('save', color);
                }}
              ></ColorPickr>
            </div>
            {isGradient && (
              <div className={CLN(S['line'])}>
                <span>结束颜色</span>
                <ColorPickr
                  color={_element?.endBackgroundColor}
                  onSave={color => {
                    setElementState({
                      id: _element.id,
                      endBackgroundColor: color
                    });
                    console.log('save', color);
                  }}
                ></ColorPickr>
              </div>
            )}
            <div className={CLN(S['line'])}>
              <span>渐变</span>
              <Select
                options={[
                  { value: 'none', text: '正常显示' },
                  { value: 'l2r', text: '从左到右' },
                  { value: 't2b', text: '从上到下' },
                  { value: 'lt2rb', text: '从左上到右下' },
                  { value: 'lb2rt', text: '从左下到右上' }
                ]}
                width={200}
                value={_element?.colorGradient}
                onChange={value => {
                  setElementState({ id: _element.id, colorGradient: value });
                  console.log('value', {
                    id: element.id,
                    image: { state: value }
                  });
                }}
              ></Select>
            </div>
          </Folder>
          <Folder title="图片" className={S['folder']}>
            <div className={CLN(S['line'])}>
              <span>资源</span>
              <Upload
                url={_element.image.url || ''}
                name={_element.image.name || ''}
                onUpload={file => {
                  const formData = new FormData();
                  const _extend = file.name.split('.');
                  formData.append('file', file);
                  formData.append('name', file.name);
                  formData.append('extend', _extend[_extend.length - 1]);
                  formData.append('path', `${userid}_${pageid}`);
                  uploadBackgroundImage(formData).then(res => {
                    if (res.state == 1) {
                      setElementState({
                        id: _element.id,
                        image: {
                          ..._element.image,
                          url: res.url,
                          name: file.name
                        }
                      });
                      save(
                        JSON.stringify(
                          elementList.map(item => {
                            if (item.id == -1) {
                              return {
                                ...item,
                                selected: true,
                                image: {
                                  ...item['image'],
                                  url: res.url,
                                  name: file.name
                                }
                              };
                            }
                            return {
                              ...item,
                              selected: false
                            };
                          })
                        )
                      );
                    }
                  });
                }}
                onDelete={() => {
                  deleteBackgroundImage(userid, pageid).then(res => {
                    if (res.state == 1) {
                      setElementState({
                        id: _element.id,
                        image: {
                          ..._element.image,
                          url: '',
                          name: ''
                        }
                      });
                      save(
                        JSON.stringify(
                          elementList.map(item => {
                            if (item.id == -1) {
                              return {
                                ...item,
                                selected: true,
                                image: {
                                  ...item['image'],
                                  url: '',
                                  name: ''
                                }
                              };
                            }
                            return {
                              ...item,
                              selected: false
                            };
                          })
                        )
                      );
                    }
                  });
                }}
              ></Upload>
            </div>
            <div className={CLN(S['line'])}>
              <span>显示状态</span>
              <Select
                options={[
                  { value: 'none', text: '正常显示' },
                  { value: 'stretch', text: '拉伸' },
                  { value: 'tile', text: '平铺' }
                ]}
                width={200}
                value={_element.image.state}
                onChange={value => {
                  setElementState({
                    id: _element.id,
                    image: { ..._element.image, state: value }
                  });
                }}
              ></Select>
            </div>
          </Folder>
        </li>
      );
    } else if (element.type == 'Chart') {
      const _element = element as IChartsElement;
      return (
        <>
          <li className={S['item']}>
            <Folder title="图表样式" className={S['folder']}>
              <div className={CLN(S['line'])}>
                <span className={CLN(S['breakTitle'])}>标题</span>
                <Switch
                  checked={_element?.title?.show}
                  onChange={checked => {
                    setChartOptions(_element.id, 'title', { show: checked });
                  }}
                  className={CLN(S['breakSwitch'])}
                ></Switch>
              </div>
              {_element.title.show && (
                <>
                  <div className={CLN(S['line'])}>
                    <span>标题名</span>
                    <Input
                      type="text"
                      value={_element?.title?.content}
                      onChange={event => {
                        const target = event.target;
                        setChartOptions(_element.id, 'title', {
                          content: target.value
                        });
                      }}
                      className={S['input']}
                    ></Input>
                  </div>
                  <div className={CLN(S['line'])}>
                    <span>标题位置</span>
                    <Select
                      options={[
                        { value: 'left', text: '左侧' },
                        { value: 'center', text: '居中' },
                        { value: 'right', text: '右侧' }
                      ]}
                      width={200}
                      value={_element?.title?.position}
                      onChange={value => {
                        setChartOptions(_element.id, 'title', {
                          position: value
                        });
                      }}
                    ></Select>
                  </div>
                  <div className={CLN(S['line'])}>
                    <span>标题颜色</span>
                    <ColorPickr
                      color={_element?.title?.fontColor}
                      onSave={color => {
                        setChartOptions(_element.id, 'title', {
                          fontColor: color
                        });
                      }}
                    ></ColorPickr>
                  </div>
                  <div className={CLN(S['line'])}>
                    <span>标题大小</span>
                    <Input
                      type="number"
                      value={_element?.title?.fontSize}
                      onChange={event => {
                        const target = event.target;
                        setChartOptions(_element.id, 'title', {
                          fontSize: parseInt(target.value)
                        });
                      }}
                      className={S['input']}
                      style={{ width: 100 }}
                    ></Input>
                  </div>
                  <div className={CLN(S['line'])}>
                    <span>标题粗细</span>
                    <Select
                      options={[
                        { value: '100', text: '100' },
                        { value: '200', text: '200' },
                        { value: '300', text: '300' },
                        { value: '400', text: '400' },
                        { value: '500', text: '500' },
                        { value: '600', text: '600' },
                        { value: '700', text: '700' },
                        { value: '800', text: '800' },
                        { value: '900', text: '900' }
                      ]}
                      width={100}
                      value={_element?.title?.fontWeight}
                      onChange={value => {
                        setChartOptions(_element.id, 'title', {
                          fontWeight: parseInt(value)
                        });
                      }}
                    ></Select>
                  </div>
                  <div className={S['breakRule']}></div>
                </>
              )}
              <div className={CLN(S['line'])}>
                <span className={CLN(S['breakTitle'])}>基础属性</span>
              </div>
              <div className={CLN(S['line'])}>
                <span>背景颜色</span>
                <ColorPickr
                  color={_element.backgroundColor}
                  onSave={color => {
                    setChartOptions(_element.id, 'base', {
                      backgroundColor: color
                    });
                  }}
                ></ColorPickr>
              </div>
              {[
                { name: '左边距', type: 'left' },
                { name: '右边距', type: 'right' },
                { name: '上边距', type: 'top' },
                { name: '下边距', type: 'bottom' }
              ].map(item => {
                return (
                  <div className={CLN(S['line'])} key={item.name}>
                    <span>{item.name}</span>
                    <Input
                      type="number"
                      value={_element?.grid[item.type]}
                      onChange={event => {
                        const target = event.target;
                        setChartOptions(_element.id, 'grid', {
                          [item.type]: parseInt(target.value)
                        });
                      }}
                      className={S['input']}
                      style={{ width: 100 }}
                    ></Input>
                  </div>
                );
              })}
              <div className={S['breakRule']}></div>
              <div className={CLN(S['line'])}>
                <span className={CLN(S['breakTitle'])}>信息提示</span>
                <Switch
                  checked={_element?.tooltip?.show}
                  onChange={checked => {
                    setChartOptions(_element.id, 'tooltip', { show: checked });
                  }}
                  className={CLN(S['breakSwitch'])}
                ></Switch>
              </div>
              {_element?.tooltip?.show && (
                <>
                  <div className={CLN(S['line'])}>
                    <span>指示器</span>
                    <Select
                      options={[
                        { value: 'none', text: '默认' },
                        { value: 'line', text: '直线' },
                        { value: 'shadow', text: '阴影' },
                        { value: 'cross', text: '十字准星' }
                      ]}
                      width={200}
                      value={_element?.tooltip?.axisPointerType}
                      onChange={value => {
                        setChartOptions(_element.id, 'tooltip', {
                          axisPointerType: value
                        });
                      }}
                    ></Select>
                  </div>
                  <div className={CLN(S['line'])}>
                    <span>轴高亮</span>
                    <Switch
                      checked={_element?.tooltip?.axisPointerLabel}
                      onChange={checked => {
                        setChartOptions(_element.id, 'tooltip', {
                          axisPointerLabel: checked
                        });
                      }}
                      className={CLN(S['breakSwitch'], S['lineSwitch'])}
                    ></Switch>
                  </div>
                  <div className={CLN(S['line'])}>
                    <span>指示线宽</span>
                    <Input
                      type="number"
                      value={_element?.tooltip.lineWidth}
                      onChange={event => {
                        const target = event.target;
                        setChartOptions(_element.id, 'tooltip', {
                          lineWidth: parseInt(target.value)
                        });
                      }}
                      className={S['input']}
                      style={{ width: 100 }}
                    ></Input>
                  </div>
                  <div className={S['breakRule']}></div>
                </>
              )}
              <div className={CLN(S['line'])}>
                <span className={CLN(S['breakTitle'])}>图例</span>
                <Switch
                  checked={_element?.legend?.show}
                  onChange={checked => {
                    setChartOptions(_element.id, 'legend', { show: checked });
                  }}
                  className={CLN(S['breakSwitch'])}
                ></Switch>
              </div>
              {/* {_element?.legend?.show && (
                <>
                  {[
                    { name: '左边距', type: 'left' },
                    { name: '右边距', type: 'right' },
                    { name: '上边距', type: 'top' },
                    { name: '下边距', type: 'bottom' }
                  ].map(item => {
                    return (
                      <div className={CLN(S['line'])} key={item.name}>
                        <span>{item.name}</span>
                        <Input
                          type="number"
                          value={_element?.grid[item.type]}
                          onChange={event => {
                            const target = event.target;
                            setChartOptions(_element.id, 'grid', {
                              [item.type]: parseInt(target.value)
                            });
                          }}
                          className={S['input']}
                          style={{ width: 100 }}
                        ></Input>
                      </div>
                    );
                  })}
                </>
              )} */}
              <div className={S['breakRule']}></div>
              <div className={CLN(S['line'])}>
                <span className={CLN(S['breakTitle'])}>轴属性</span>
              </div>
              <div className={CLN(S['line'])}>
                <span>指示线宽</span>
                <Input
                  type="number"
                  value={_element?.tooltip?.lineWidth}
                  onChange={event => {
                    const target = event.target;
                    setChartOptions(_element.id, 'tooltip', {
                      lineWidth: parseInt(target.value)
                    });
                  }}
                  className={S['input']}
                  style={{ width: 100 }}
                ></Input>
              </div>
              <div className={S['breakRule']}></div>
            </Folder>
          </li>
          <li className={S['item']}>
            <Folder title="数据" className={S['folder']}>
              <div className={CLN(S['line'])}>
                <span>数据格式</span>
                <div
                  className={S['btn']}
                  onClick={() => {
                    setCodeData(dataFormat[element['chartsMark']]);
                    setCodeVisible(true);
                    setReadonly(true);
                  }}
                >
                  查看格式
                </div>
              </div>
              <div className={CLN(S['line'])}>
                <span>添加数据</span>
                <div
                  className={S['btn']}
                  onClick={() => {
                    setCodeData(elementData[element.id]);
                    setCodeVisible(true);
                    setReadonly(false);
                  }}
                >
                  窗口添加
                </div>
              </div>
            </Folder>
          </li>
        </>
      );
    } else if (element.type == 'Image') {
      const _element = element as IControlImage;
      return (
        <li className={S['item']}>
          <Folder title="图片" className={S['folder']}>
            <div className={CLN(S['line'])}>
              <span>资源</span>
              <Upload
                url={_element.url || ''}
                name={_element.imgName || ''}
                onUpload={file => {
                  const formData = new FormData();
                  const _extend = file.name.split('.');
                  formData.append('file', file);
                  formData.append('name', file.name);
                  formData.append('extend', _extend[_extend.length - 1]);
                  formData.append('path', `${userid}_${pageid}_${_element.id}`);
                  uploadElementImage(formData).then(res => {
                    if (res.state == 1) {
                      setElementState({
                        id: _element.id,
                        url: res.url,
                        imgName: file.name
                      });
                      save(
                        JSON.stringify(
                          elementList.map(item => {
                            if (item.id == _element.id) {
                              return {
                                ...item,
                                selected: false,
                                url: res.url,
                                imgName: file.name
                              };
                            }
                            return {
                              ...item,
                              selected: item.id == -1 ? true : false
                            };
                          })
                        )
                      );
                    }
                  });
                }}
                onDelete={() => {
                  deleteElementImage(userid, pageid, _element.id).then(res => {
                    if (res.state == 1) {
                      setElementState({
                        id: _element.id,
                        url: '',
                        imgName: ''
                      });
                      save(
                        JSON.stringify(
                          elementList.map(item => {
                            if (item.id == _element.id) {
                              return {
                                ...item,
                                selected: false,
                                url: '',
                                imgName: ''
                              };
                            }
                            return {
                              ...item,
                              selected: item.id != -1 ? false : true
                            };
                          })
                        )
                      );
                    }
                  });
                }}
              ></Upload>
            </div>
          </Folder>
        </li>
      );
    }
  };

  return (
    <div className={CLN(className, S['container'])}>
      <div className={CLN(S['title'], S['text'])}>属性</div>
      {elementSelectList.length == 1 && (
        <div className={CLN(S['name'], S['text'])}>{element.name}</div>
      )}
      <ul className={S['content']}>
        <Codemirror
          data={codeData}
          readonly={readonly}
          visible={codeVisible}
          onCancel={() => {
            setCodeVisible(false);
          }}
          onOk={value => {
            console.log('ok', value);
            onLoading && onLoading();
            savePageContent(
              userid,
              pageid,
              JSON.stringify(
                elementList.map(item => {
                  return {
                    ...item,
                    selected: item.id != -1 ? false : true
                  };
                })
              )
            )
              .then(res => {
                if (res.state == 1) {
                  return updateData({
                    userid,
                    pageid,
                    elementid: element.id,
                    data: value
                  });
                }
              })
              .then(res => {
                if (res.state == 1) {
                  return getElementData(userid, pageid);
                }
              })
              .then(res => {
                if (res.state == 1) {
                  console.log('???:', res.data);
                  setElementData(res.data);
                  onLoaded && onLoaded();
                }
              });
            setCodeVisible(false);
          }}
        ></Codemirror>
        <li className={S['item']}>
          <Folder title="位置大小" className={S['folder']}>
            <div className={CLN(S['size'], S['line'])}>
              <span>大小</span>
              <Input
                type="number"
                value={element.width}
                suffix={<div>W</div>}
                className={S['input']}
                onChange={event => {
                  const target = event.target;
                  setElementState({
                    id: element.id,
                    width: parseInt(target.value || '0')
                  });
                }}
              ></Input>
              <Input
                type="number"
                value={element.height}
                suffix={<div>H</div>}
                className={S['input']}
                onChange={event => {
                  const target = event.target;
                  setElementState({
                    id: element.id,
                    height: parseInt(target.value || '0')
                  });
                }}
              ></Input>
            </div>
            <div className={CLN(S['position'], S['line'])}>
              <span>位置</span>
              <Input
                type="number"
                value={element.left}
                suffix={<div>X</div>}
                className={S['input']}
              ></Input>
              <Input
                type="number"
                value={element.top}
                suffix={<div>Y</div>}
                className={S['input']}
              ></Input>
            </div>
          </Folder>
        </li>
        {createAttribute()}
      </ul>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    userid: state.user.userid,
    elementList: state.editor.element,
    elementData: state.editor.elementData
  };
};
export default connect(mapStateToProps)(Component);
