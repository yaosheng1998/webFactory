import React, { useEffect, useRef, useState } from 'react';
import CLN from 'classnames';
import { Layout, message, Space, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import $ from 'jquery';
import {
  withRouter,
  Link,
  RouteComponentProps,
  useRouteMatch
} from 'react-router-dom';

import store, { IState } from '@/reducer';
import { IControlText } from '@reducer/editor';
import Icon from '@components/Icon';
import EditPanel from '@components/EditPanel';
import S from './index.less';
import { itemIcon } from '@components/Nav/index.less';
import Text from '@components/Control/Text';
import {
  elementSelect,
  setLineState,
  setElement,
  setElementData
} from '@action/editor';
import { IBackgroundElement } from '@reducer/editor';
import { render } from 'react-dom';
import user from '@/reducer/user';
import { isEmpty } from 'lodash';
import Charts from '@/components/Chart';
import Codemirror from '@components/Codemirror';
import { getPageContent, savePageContent, getElementData } from '@core/editor';
import { dateFormat } from '@/utils/tool';
import { getPage } from '@core/doRequest';
import { setLogin, setUserInfo, setUserPage, setPageGroup } from '@action/user';

interface IProps extends RouteComponentProps {
  element: IState['editor']['element'];
  tool: IState['editor']['tool'];
  userid: IState['user']['userid'];
}
const { Content } = Layout;
const { Tools, Layer, Attribute, Drag } = EditPanel;
const { DragArea, DragBox, Line } = Drag;
const Component = (props: IProps) => {
  const { element, tool, match, userid, history } = props;
  const ref = {
    panelRef: useRef(null),
    panleBGRef: useRef(null),
    contentRef: useRef(null),
    coverRef: useRef(null)
  };
  const pageid = parseInt(match.params['id']);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [hide, setHide] = useState(false);
  const bgElement = element.filter(
    item => item.id == -1
  )[0] as IBackgroundElement;
  useEffect(() => {
    scrollEvent();
    elementSelect([]);
    setLineState({ show: false });
  }, []);
  // panel滚轮放大缩小
  const scrollEvent = () => {
    const $panel = $(ref.panelRef.current || '');
    const $panelBG = $(ref.panleBGRef.current || '');
    const $content = $(ref.contentRef.current || '');
    const onScroll = (event: any) => {
      const martix = $content.css('transform').match(/(\d+(\.\d+)?)/g);
      const _scale = martix ? parseFloat(martix[0]) : 1.0;
      if (Math.abs(_scale - 1) < 0.25) {
        $content.css({ left: 0, top: 0 });
      }
      if (event.wheelDelta > 0) {
        setScale(_scale + 0.05);
      } else if (event.wheelDelta < 0 && scale > 0.25) {
        setScale(_scale - 0.05);
      }
    };
    $panel.on('mouseenter', () => {
      document.addEventListener('mousewheel', onScroll, false);
    });
    $panel.on('mouseleave', () => {
      document.removeEventListener('mousewheel', onScroll);
    });
  };
  // cover选择验证
  const coverSelectAll = (
    left: number,
    top: number,
    width: number,
    height: number
  ) => {
    const right = left + width;
    const bottom = top + height;
    let lineLeft = 999999;
    let lineTop = 999999;
    const _selectList = element.filter(item => {
      return (
        item.id != -1 &&
        item.left >= left &&
        item.left + item.width <= right &&
        item.top >= top &&
        item.top + item.height <= bottom
      );
    });
    _selectList.forEach(item => {
      lineLeft = Math.min(item.left, lineLeft);
      lineTop = Math.min(item.top, lineTop);
    });
    if (_selectList.length) {
      setLineState({ left: lineLeft, top: lineTop, show: true });
      elementSelect(_selectList.map(item => item.id));
    } else {
      setLineState({ show: false });
      elementSelect(-1);
    }
  };
  // 获取背景颜色
  const getBackground = () => {
    const bgElement = element.filter(
      item => item.id == -1
    )[0] as IBackgroundElement;
    if (bgElement.image.url) {
      return {
        background: `url(${bgElement.image.url})`
      };
    }
    let backgroundColor = bgElement.backgroundColor;
    const getColor = (str: string) => {
      return `linear-gradient(${str}, ${bgElement.backgroundColor}, ${bgElement.endBackgroundColor})`;
    };
    if (bgElement.colorGradient == 'l2r') {
      return { backgroundImage: getColor('to right') };
    } else if (bgElement.colorGradient == 't2b') {
      return { backgroundImage: getColor('to bottom') };
    } else if (bgElement.colorGradient == 'lt2rb') {
      return { backgroundImage: getColor('to bottom right') };
    } else if (bgElement.colorGradient == 'lb2rt') {
      return { backgroundImage: getColor('to top right') };
    }
    return { backgroundColor };
  };
  const getBackgroundRect = () => {
    const bgElement = element.filter(
      item => item.id == -1
    )[0] as IBackgroundElement;
    return {
      width: bgElement.width,
      height: bgElement.height
    };
  };
  const save = () => {
    setLoading(true);
    return savePageContent(
      userid,
      pageid,
      JSON.stringify(
        element.map(item => {
          return {
            ...item,
            selected: item.id != -1 ? false : true
          };
        })
      )
    ).then(res => {
      if (res.state == 1) {
        getPage(userid);
      }
      setLoading(false);
    });
  };
  useEffect(() => {
    if (userid == -1) return;
    setLoading(true);
    setHide(true);
    getPageContent(userid, pageid)
      .then(res => {
        const data = JSON.parse(res.data);
        setElement(data);
        return getElementData(userid, pageid);
      })
      .then(res => {
        if (res.state == 1) {
          setElementData(res.data);
        }
        setHide(false);
        setLoading(false);
      });
  }, [userid]);
  console.log('element', element);
  return (
    <Layout className={S['container']}>
      <div className={S['header']}>
        <Space size={28} className={S['option']}>
          <div
            className={S['btn']}
            onClick={() => {
              save().then(() => {
                message.success('保存成功。');
              });
            }}
          >
            <Icon name="iconfactory"></Icon>
            <span>保存</span>
          </div>
          <div
            className={S['btn']}
            onClick={() => {
              save().then(() => {
                history.push({ pathname: '/preview', state: { element } });
              });
            }}
          >
            <Icon name="iconfactory"></Icon>
            <span>预览</span>
          </div>
          <div className={S['btn']}>
            <Icon name="iconfactory"></Icon>
            <span>撤销</span>
          </div>
          {/* <Charts></Charts> */}
        </Space>
      </div>
      <Content className={S['content']}>
        <Codemirror visible={false}></Codemirror>
        <Tools className={S['tools']} onChange={tool => {}}></Tools>
        <div className={S['editPanel']} id="editPanel" ref={ref.panelRef}>
          <Spin
            className={CLN(S['spin'], {
              [S['loading']]: loading,
              [S['hide']]: hide
            })}
            spinning={loading}
            indicator={
              <LoadingOutlined style={{ fontSize: 80 }}></LoadingOutlined>
            }
          ></Spin>
          <div
            className={S['background']}
            id="editPanelBG"
            ref={ref.panleBGRef}
            onMouseDown={event => {
              if (tool.selectId == 1) return;
              const $panleBG = $(ref.panleBGRef.current || '');
              const $content = $(ref.contentRef.current || '');
              const $cover = $(ref.coverRef.current || '');
              const offsetPanelBG = $panleBG.offset();
              const offsetContent = $content.offset();
              const target = event.target;
              const pageX = event.pageX;
              const pageY = event.pageY;
              let pointLeft = pageX - offsetPanelBG?.left!;
              let pointTop = pageY - offsetPanelBG?.top!;
              let _width = 0;
              let _height = 0;
              let _left = 0;
              let _top = 0;
              $('html').on('mousemove', event => {
                const diffX = event.pageX - pageX;
                const diffY = event.pageY - pageY;
                _width = diffX;
                _height = diffY;
                _left = pointLeft;
                _top = pointTop;
                if (diffX > 0 && diffY < 0) {
                  _height = -_height;
                  _top = _top - _height;
                } else if (diffX < 0 && diffY > 0) {
                  _width = -_width;
                  _left = _left - _width;
                } else if (diffX < 0 && diffY < 0) {
                  _width = -_width;
                  _height = -_height;
                  _left = _left - _width;
                  _top = _top - _height;
                }
                $cover.css({
                  left: _left,
                  top: _top,
                  height: _height,
                  width: _width,
                  display: 'block'
                });
              });
              $('html').on('mouseup', event => {
                $('html').off('mousemove');
                $('html').off('mouseup');
                if ($(event.target)[0] == $('#lineDelete')[0]) return;
                coverSelectAll(
                  parseFloat($cover.css('left')) -
                    (offsetContent?.left! - offsetPanelBG?.left!),
                  parseFloat($cover.css('top')) -
                    (offsetContent?.top! - offsetPanelBG?.top!),
                  _width / scale,
                  _height / scale
                );
                $cover.css({ display: 'none' });
              });
            }}
          >
            <div
              className={S['editContent']}
              ref={ref.contentRef}
              id={'editContent'}
              style={{
                transform: `scale(${scale})`,
                ...getBackground()
              }}
            >
              <DragArea
                pageid={pageid}
                onLoading={() => {
                  setLoading(true);
                }}
                onLoaded={() => {
                  setLoading(false);
                }}
              ></DragArea>
            </div>
            <div className={S['cover']} ref={ref.coverRef}></div>
          </div>
        </div>
        <div className={S['right']}>
          <Layer className={S['layer']} height={200}></Layer>
          <Attribute
            className={S['attribute']}
            name={'边框1'}
            pageid={pageid}
            onLoading={() => {
              setLoading(true);
            }}
            onLoaded={() => {
              setLoading(false);
            }}
          ></Attribute>
        </div>
      </Content>
    </Layout>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    element: state.editor.element,
    tool: state.editor.tool,
    userid: state.user.userid
  };
};

export default withRouter(connect(mapStateToProps)(Component));
