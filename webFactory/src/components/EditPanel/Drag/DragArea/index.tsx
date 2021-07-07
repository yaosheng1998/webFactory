import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import CLN from 'classnames';
import $ from 'jquery';
import { connect } from 'react-redux';

import store, { IState } from '@/reducer';
import Text from '@components/Control/Text';
import Image from '@components/Control/Image';
import {
  IControlText,
  IChartsElement,
  IControlImage,
  IAction
} from '@reducer/editor';
import DragBox from '../Dragbox';
import Line from '../Line';
import {
  createElement,
  elementSelect,
  setLineState,
  setElementData,
  deleteElementSelected
} from '@action/editor';
import dataFormat from '@core/dataFormat';
import {
  updateData,
  savePageContent,
  getElementData,
  deleteData
} from '@core/editor';
import Chart from '@components/Chart';
import { getPage } from '@core/doRequest';
import { getNewId } from '@/utils/tool';
import S from './index.less';

interface IProps {
  element: IState['editor']['element'];
  onLoading?: (...args: any) => void;
  onLoaded?: (...args: any) => void;
  userid: IState['user']['userid'];
  pageid: number;
}

const Component = (props: IProps) => {
  const { element, onLoading, onLoaded, userid, pageid } = props;
  const ref = useRef(null);
  const renderElement = (item = element![0]) => {
    if (item.type == 'Text') {
      return <Text element={item as IControlText} />;
    } else if (item.type == 'Chart') {
      return <Chart element={item as IChartsElement}></Chart>;
    } else if (item.type == 'Image') {
      return <Image element={item as IControlImage}></Image>;
    }
  };
  const createNewElement = (payload: {
    id: number;
    type: string;
    options?: object;
    chartsMark?: string;
    title?: IAction['title'];
    tooltip?: IAction['tooltip'];
    grid?: IAction['grid'];
    legend?: IAction['legend'];
    left: number;
    top: number;
  }) => {
    const TextNumber = element.reduce((pre, item) => {
      return item.type == 'Text' ? pre + 1 : pre;
    }, 0);
    let _newElement = {
      id: payload.id,
      type: payload.type,
      name: payload.type,
      height: 100,
      width: 100,
      left: payload.left,
      top: payload.top,
      value: `Text${TextNumber}`,
      isLock: false,
      layerOpen: true,
      selected: true,
      editing: false
    };
    if (payload.type == 'Chart') {
      _newElement['options'] = payload.options || {};
      _newElement['title'] = payload.title;
      _newElement['tooltip'] = payload.tooltip;
      _newElement['chartsMark'] = payload.chartsMark;
      _newElement['grid'] = payload.grid;
      _newElement['legend'] = payload.legend;
      _newElement.height = 200;
      _newElement.width = 400;
    } else if (payload.type == 'Image') {
      _newElement.height = 150;
      _newElement.width = 240;
    }
    return _newElement;
  };
  // const save = () => {
  //   return savePageContent(
  //     userid,
  //     pageid,
  //     JSON.stringify(
  //       element.map(item => {
  //         return {
  //           ...item,
  //           selected: item.id != -1 ? false : true
  //         };
  //       })
  //     )
  //   ).then(res => {
  //     if (res.state == 1) {
  //       getPage(userid);
  //     }
  //     setLoading(false);
  //   });
  // };
  return (
    <div
      className={S['container']}
      ref={ref}
      onClick={() => {
        // elementSelect(-1);
        // setLineState({ show: false });
      }}
      onDragOver={event => {
        event.preventDefault();
      }}
      onDrop={event => {
        event.preventDefault();
        const $ref = $(ref.current || '');
        const offset = $ref.offset();
        const data = JSON.parse(event.dataTransfer.getData('transfer'));
        const left = event.pageX - parseInt(offset!.left + '') - 50;
        const top = event.pageY - parseInt(offset!.top + '') - 50;
        const id = getNewId(element);
        if (data.type == 'Text') {
          const newElement = createNewElement({
            id,
            type: 'Text',
            left,
            top
          });
          createElement(newElement);
          setLineState({ left, top, show: true });
        } else if (data.type == 'Image') {
          const newElement = createNewElement({
            id,
            type: 'Image',
            left,
            top
          });
          createElement(newElement);
          setLineState({ left, top, show: true });
        } else if (data.type == 'Chart') {
          onLoading && onLoading();
          const _element = element.slice();
          const newElement = createNewElement({
            id,
            type: 'Chart',
            options: data.options,
            title: data.title,
            tooltip: data.tooltip,
            chartsMark: data.chartsMark,
            grid: data.grid,
            legend: data.legend,
            left,
            top
          });
          _element.push(newElement);
          createElement(newElement);
          setLineState({ left, top, show: true });
          savePageContent(
            userid,
            pageid,
            JSON.stringify(
              _element.map(item => {
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
                  elementid: id,
                  data: dataFormat[data.chartsMark]
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
                setElementData(res.data);
                return getPage(userid);
              }
            })
            .then(res => {
              onLoaded && onLoaded();
            });
        }
      }}
    >
      {element!.map((item, index) => {
        if (item.id == -1) return;
        return (
          <DragBox key={item.id} element={item}>
            {renderElement(item)}
          </DragBox>
        );
      })}
      <Line
        deleteElement={() => {
          onLoading && onLoading();
          const deleteElement = element
            .filter(item => {
              return item.id != -1 && item.selected;
            })
            .map(item => item.id);
          const saveElement = element.filter(item => {
            return item.id == -1 || !item.selected;
          });
          deleteData({ userid, pageid, elementid: deleteElement })
            .then(res => {
              if (res.state == 1) {
                return savePageContent(
                  userid,
                  pageid,
                  JSON.stringify(
                    saveElement.map(item => {
                      return {
                        ...item,
                        selected: item.id != -1 ? false : true
                      };
                    })
                  )
                );
              }
            })
            .then(res => {
              deleteElementSelected();
              onLoaded && onLoaded();
            });
        }}
      ></Line>
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    element: state.editor.element,
    userid: state.user.userid
  };
};

export default connect(mapStateToProps)(Component);
