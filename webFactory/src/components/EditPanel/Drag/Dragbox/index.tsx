import React, {
  forwardRef,
  MouseEvent,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
  useState
} from 'react';
import $ from 'jquery';
import CLN from 'classnames';

import store, { IState } from '@/reducer';
import { IElement } from '@reducer/editor';
import { connect } from 'react-redux';
import {
  setElementState,
  setLineState,
  elementSelect,
  elementSelectAdd
} from '@action/editor';
import S from './index.less';
import { rectInfo } from '../Line/index.less';

interface IProps extends PropsWithChildren<{}> {
  className?: string;
  dragable?: boolean;
  allElement?: IState['editor']['element'];
  isLock?: IState['editor']['drag']['isLock'];
  element: IElement;
  onSelect?: (...args: any) => void;
  onMove?: (...args: any) => void;
}

const Component = (props: IProps) => {
  const {
    children,
    className,
    element,
    onSelect,
    onMove,
    allElement,
    isLock
  } = props;
  const [hover, setHover] = useState(false);
  const { height, width, left, top, selected, id } = element;
  const ref = useRef(null);
  const pointList = [
    ['left', 'top', 'rsLeftTop'],
    ['midx', 'top', 'rsMidTop'],
    ['right', 'top', 'rsRightTop'],
    ['midy', 'left', 'rsMidLeft'],
    ['midy', 'right', 'rsMidLeft'],
    ['left', 'bottom', 'rsRightTop'],
    ['midx', 'bottom', 'rsMidTop'],
    ['right', 'bottom', 'rsLeftTop']
  ];
  const onResize = (event: MouseEvent, type: string) => {
    event.stopPropagation();
    const $body = $('body');
    let curPageX = event.pageX;
    let curPageY = event.pageY;
    $body.on('mousemove', event => {
      const pageX = event.pageX;
      const pageY = event.pageY;
      const diffX = pageX - curPageX;
      const diffY = pageY - curPageY;
      let _height = height - diffY;
      let _width = width - diffX;
      let _left = left + diffX;
      let _top = top + diffY;
      if (type == 'left top') {
        if (_height < 0) {
          _top = top + height;
          _height = 0;
        }
        if (_width < 0) {
          _left = left + width;
          _width = 0;
        }
        setElementState({
          id: element.id,
          height: _height,
          width: _width,
          left: _left,
          top: _top
        });
        setLineState({
          left: _left,
          top: _top
        });
      } else if (type == 'midx top') {
        if (_height < 0) {
          _top = top + height;
          _height = 0;
        }
        setElementState({
          id: element.id,
          height: _height,
          top: _top
        });
        setLineState({
          top: _top
        });
      } else if (type == 'right top') {
        _height = height - diffY;
        _width = width + diffX;
        _top = top + diffY;
        if (_height < 0) {
          _top = top + height;
          _height = 0;
        }
        if (_width < 0) {
          _left = left + width;
          _width = 0;
        }
        setElementState({
          id: element.id,
          height: _height,
          width: _width,
          top: _top
        });
        setLineState({
          top: _top
        });
      } else if (type == 'midy left') {
        if (_width < 0) {
          _left = left + width;
          _width = 0;
        }
        setElementState({
          id: element.id,
          width: _width,
          left: _left
        });
        setLineState({
          left: _left
        });
      } else if (type == 'midy right') {
        _width = width + diffX;
        if (_width < 0) {
          _width = 0;
        }
        setElementState({
          id: element.id,
          width: _width
        });
      } else if (type == 'left bottom') {
        _height = height + diffY;
        if (_height < 0) {
          _height = 0;
        }
        if (_width < 0) {
          _left = left + width;
          _width = 0;
        }
        setElementState({
          id: element.id,
          height: _height,
          width: _width,
          left: _left
        });
        setLineState({
          left: _left
        });
      } else if (type == 'midx bottom') {
        _height = height + diffY;
        if (_height < 0) {
          _height = 0;
        }
        if (_width < 0) {
          _width = 0;
        }
        setElementState({
          id: element.id,
          height: _height
        });
      } else if (type == 'right bottom') {
        _height = height + diffY;
        _width = width + diffX;
        if (_height < 0) {
          _height = 0;
        }
        if (_width < 0) {
          _width = 0;
        }
        setElementState({
          id: element.id,
          height: _height,
          width: _width
        });
      }
    });
    $body.on('mouseup', event => {
      $body.off('mousemove');
    });
  };
  useEffect(() => {
    // const $ref = $(ref.current || '');
    // if (selected && $ref.not(':focus')) {
    //   $ref.trigger('focus');
    // }
  });
  return (
    <div
      className={CLN(className, S['container'], { [S['selected']]: selected })}
      style={{ height, width, left, top }}
      ref={ref}
      id={`element_${element.id}`}
      tabIndex={0}
      // onBlur={() => {
      //   const $ref = $(ref.current || '');
      //   setElementState({ id: element.id, selected: false });
      //   setLineState({
      //     left: left,
      //     top: top,
      //     show: false
      //   });
      // }}
      onClick={event => {
        event.stopPropagation();
      }}
      onMouseDown={event => {
        event.stopPropagation();
        const $body = $('body');
        const $line = $('#line');
        const $ref = $(ref.current || '');
        const ctrlKey = event.ctrlKey;
        let elList = allElement!
          .filter(item => item.id != -1 && item.selected)
          .map(item => ({
            id: item.id,
            el: $(`#element_${item.id}`),
            left: item.left,
            top: item.top
          }));
        let lineLeft = parseFloat($ref.css('left'));
        let lineTop = parseFloat($ref.css('top'));
        if (!selected) {
          if (ctrlKey) {
            elementSelectAdd(element.id);
            elList.push({ id, el: $ref, left, top });
          } else {
            elementSelect(element.id);
            elList = [{ id, el: $ref, left, top }];
          }
          onSelect && onSelect();
        }
        elList.forEach(item => {
          lineLeft = Math.min(item.left, lineLeft);
          lineTop = Math.min(item.top, lineTop);
        });
        !selected &&
          setLineState({
            left: lineLeft,
            top: lineTop,
            show: true
          });
        if (!isLock) {
          let curPageX = event.pageX;
          let curPageY = event.pageY;
          let diffX = 0;
          let diffY = 0;
          $body.on('mousemove', event => {
            const pageX = event.pageX;
            const pageY = event.pageY;
            diffX = pageX - curPageX;
            diffY = pageY - curPageY;
            onMove && onMove({ left: left + diffX, top: top + diffY });
            elList.forEach(item => {
              item.el.css({ left: item.left + diffX, top: item.top + diffY });
            });
            setLineState({ left: lineLeft + diffX, top: lineTop + diffY });
          });
          $body.on('mouseup', event => {
            elList.forEach(item => {
              setElementState({
                id: item.id,
                left: item.left + diffX,
                top: item.top + diffY
              });
            });
            $body.off('mousemove');
            $body.off('mouseup');
          });
        }
      }}
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
    >
      {/* <div className={S['dragWrap']}>{children}</div>
      <div
        className={CLN(S['dragObj'], {
          [S['hover']]: hover,
          [S['selected']]: selected
        })}
      >
        {pointList.map(item => {
          return (
            <div
              className={CLN(S['point'], S[item[0]], S[item[1]], S[item[2]])}
              onMouseDown={event => {
                onResize(event, `${item[0]} ${item[1]}`);
              }}
              key={`${item[0]}${item[1]}`}
            ></div>
          );
        })}
      </div> */}
      {children}
      {pointList.map(item => {
        return (
          <div
            className={CLN(S['point'], S[item[0]], S[item[1]], S[item[2]])}
            onMouseDown={event => {
              onResize(event, `${item[0]} ${item[1]}`);
            }}
            key={`${item[0]}${item[1]}`}
          ></div>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    allElement: state.editor.element,
    isLock: state.editor.drag.isLock
  };
};

export default connect(mapStateToProps)(Component);
