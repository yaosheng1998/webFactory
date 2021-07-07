import React, { useEffect, useRef, useState } from 'react';
import CLN from 'classnames';
import $ from 'jquery';
import S from './index.less';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  withRouter,
  RouteComponentProps
} from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Modal, Input, Button } from 'antd';

import Icon from '@components/Icon';
import { IBackgroundElement } from '@reducer/editor';
import Text from '@components/Control/Text';
import Chart from '@components/Chart';
import Image from '@components/Control/Image';
import { IControlText, IChartsElement, IControlImage } from '@reducer/editor';
import { IState } from '@/reducer';
interface IProps extends RouteComponentProps {}
const Component = (props: IProps) => {
  const { history, match } = props;
  const preview = !!history.location.pathname.match(/preview/);
  const element =
    ((history as any).location.state.element as IState['editor']['element']) ||
    {};
  // const element = JSON.parse(
  //   '[{"id": -1, "top": 0, "left": 0, "name": "背景屏幕", "type": "Screen", "image": {"top": 0, "left": 0, "state": "none"}, "width": 1920, "height": 1080, "isLock": false, "selected": true, "layerOpen": true, "colorGradient": "none", "backgroundColor": "#FFFFFF", "endBackgroundColor": "#FFFFFF"}, {"id": 1, "top": 120, "grid": {"top": 40, "left": 30, "right": 0, "bottom": 30}, "left": 273, "name": "Chart", "type": "Chart", "title": {"show": true, "content": "基础柱状图", "fontSize": 18, "position": "left", "fontColor": "#ccc", "fontWeight": 600}, "value": "Text0", "width": 455, "height": 219, "isLock": false, "legend": {"show": false}, "editing": false, "options": {"grid": {"top": 40, "left": 30, "right": 0, "bottom": 30}, "title": {"show": true, "text": "基础柱状图", "textStyle": {"fontSize": 18}}, "xAxis": {"data": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"], "type": "category", "axisLabel": {"textStyle": {"fontSize": 12}}}, "yAxis": {"type": "value", "axisLabel": {"textStyle": {"fontSize": 12}}}, "legend": {"data": ["I"], "show": false}, "series": [{"data": [120, 200, 150, 80, 70, 110, 130, 60, 90, 110], "name": "I", "type": "bar"}], "tooltip": {"show": false, "trigger": "axis", "axisPointer": {"type": "shadow", "label": {"show": false}, "lineStyle": {"width": 1}}}}, "tooltip": {"show": false, "trigger": "axis", "lineWidth": 1, "axisPointerType": "shadow", "axisPointerLabel": false}, "selected": false, "layerOpen": true}]'
  // ) as IState['editor']['element'];
  const bgElement =
    (element.filter(item => {
      return item.id == -1;
    })[0] as IBackgroundElement) || {};
  const [width, setWidth] = useState(bgElement.width);
  const [height, setHeight] = useState(bgElement.height);
  const renderElement = (item = element[0]) => {
    if (item.type == 'Text') {
      return <Text element={item as IControlText} />;
    } else if (item.type == 'Chart') {
      return <Chart element={item as IChartsElement}></Chart>;
    } else if (item.type == 'Image') {
      return <Image element={item as IControlImage}></Image>;
    }
  };
  useEffect(() => {
    const $container = $(`.${S['container']}`);
    const _width = parseInt($container.css('width'));
    const _height = parseInt($container.css('height'));
    if (width > _width) {
      if ((height * _width) / width > _height) {
        setHeight(_height);
        setWidth((width * _height) / height);
      } else {
        setHeight((height * _width) / width);
        setWidth(_width);
      }
    }
  });
  return (
    <div className={S['container']}>
      {preview && (
        <div className={S['backBtn']}>
          <Button
            type="primary"
            onClick={() => {
              history.go(-1);
            }}
          >
            返回
          </Button>
        </div>
      )}
      <div
        className={S['area']}
        style={{
          height,
          width,
          backgroundColor: bgElement.backgroundColor
          // background: bgElement.image.url ? `url(${bgElement.image.url})` : ''
        }}
      >
        {element.map(item => {
          const { height, width, left, top } = item;
          if (item.id == -1) return;
          return (
            <div
              className={S['element']}
              key={`view_element${item.id}`}
              style={{ height, width, left, top }}
            >
              {renderElement(item)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default withRouter(Component);
