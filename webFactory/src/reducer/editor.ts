import TIconName from '@components/Icon/name';
import Text from '@components/Control/Text';
import $ from 'jquery';
import _ from 'lodash';
import { ReactElement } from 'react';
import { item } from '@/components/EditPanel/Tools/index.less';
import { selected } from '@/components/EditPanel/Layer/index.less';
import { formatElementData } from '@core/dataFormat';
type TAction =
  | 'CREATE_ELEMENT'
  | 'SET_TOOL_SELECT_ID'
  | 'SET_ELEMENT_STATE'
  | 'SET_CHART_OPTIONS'
  | 'SET_LINE_STATE'
  | 'ELEMENT_SELECT'
  | 'ELEMENT_SELECT_ADD'
  | 'SET_DRAG_LOCK'
  | 'SET_ELEMENT'
  | 'DELETE_ELEMENT_SELECTED'
  | 'SET_ELEMENT_DATA';

interface ILayer {
  id: number;
  type: string;
  name: string;
  isHidden: boolean;
}
export interface IElement {
  id: number;
  type: string;
  name: string;
  backgroundColor?: string;
  height: number;
  width: number;
  left: number;
  top: number;
  isLock: boolean;
  layerOpen: boolean;
  selected: boolean;
}
export interface IControlText extends IElement {
  editing: boolean;
  value: string;
}
export interface IControlImage extends IElement {
  url: string;
  imgName: string;
  opacity: number;
}
export interface IBackgroundElement extends IElement {
  colorGradient: 'none' | 'l2r' | 't2b' | 'lt2rb' | 'lb2rt';
  endBackgroundColor?: string;
  image: {
    name?: string;
    url?: string;
    left: number;
    top: number;
    state: 'none' | 'stretch' | 'tile';
  };
}
export interface IChartsElement extends IElement {
  options: object;
  chartsMark: string;
  title: {
    show: boolean;
    content: string;
    position: 'left' | 'right' | 'center';
    fontSize: number;
    fontColor: string;
    fontWeight: number;
  };
  grid: {
    left: number;
    top: number;
    bottom: number;
    right: number;
  };
  tooltip: {
    show: boolean;
    trigger: 'item' | 'axis';
    lineWidth?: number;
    axisPointerType?: 'line' | 'shadow' | 'none' | 'cross';
    axisPointerLabel?: boolean;
  };
  legend: {
    show: boolean;
  };
}
export interface ITool {
  id: number;
  name: string;
  iconName: TIconName;
  onActive?: (...args: any) => void;
  onChange?: (...args: any) => void;
  dataTransfer?: { type: string };
}
interface IDragLine {
  left: number;
  top: number;
  show: boolean;
}
export interface IState {
  element: (IBackgroundElement | IElement | IControlText | IChartsElement)[];
  elementData: { [propName: number]: string };
  tool: { selectId: number };
  layer: { selectId: number[] };
  drag: {
    isLock: boolean;
    line: IDragLine;
  };
}
export interface IAction {
  name?: string;
  id?: number;
  type: TAction;
  left?: number;
  top?: number;
  options?: object;
  elementType?: string;
  selectId?: number;
  selectList?: number | number[];
  selected?: boolean;
  locked?: boolean;
  chartsMark?: string;
  elementData?: { [propName: number]: string };
  newElement?: IBackgroundElement | IElement | IControlText | IChartsElement;
  optionsType?: 'base' | 'title' | 'grid' | 'tooltip' | 'legend';
  title?: {
    show?: boolean;
    content?: string;
    position?: 'left' | 'right' | 'center';
    fontSize?: number;
    fontColor?: string;
    fontWeight?: number;
  };
  grid?: {
    left?: number;
    right?: number;
    bottom?: number;
    top?: number;
  };
  tooltip?: {
    show?: boolean;
    trigger?: 'item' | 'axis';
    lineWidth?: number;
    axisPointerType?: 'line' | 'shadow' | 'none' | 'cross';
    axisPointerLabel?: boolean;
  };
  legend?: {
    show?: boolean;
  };
  elements?: IState['element'];
  element?: {
    id?: number;
    name?: string;
    url?: string;
    imgName?: string;
    opacity?: number;
    height?: number;
    width?: number;
    left?: number;
    top?: number;
    isLock?: boolean;
    value?: string;
    layerOpen?: boolean;
    selected?: boolean;
    backgroundColor?: string;
    colorGradient?: 'none' | 'l2r' | 't2b' | 'lt2rb' | 'lb2rt';
    endBackgroundColor?: string;
    image?: {
      name?: string;
      url?: string;
      left?: number;
      top?: number;
      state?: 'none' | 'stretch' | 'tile';
    };
  };
  line?: { left?: number; top?: number; show?: boolean };
}
const initState: IState = {
  element: [
    {
      id: -1,
      type: 'Screen',
      name: '背景屏幕',
      backgroundColor: '#FFFFFF',
      height: 1080,
      width: 1920,
      left: 0,
      top: 0,
      isLock: false,
      layerOpen: true,
      selected: true,
      colorGradient: 'none',
      endBackgroundColor: '#FFFFFF',
      image: {
        name: '图片',
        url:
          'https://ys-webfactory-shanghai.oss-cn-shanghai.aliyuncs.com/avatar/touxiang.jpg',
        left: 0,
        top: 0,
        state: 'none'
      }
    }
  ],
  elementData: {},
  tool: {
    selectId: 0
  },
  layer: { selectId: [-1] },
  drag: {
    isLock: false,
    line: {
      left: 0,
      top: 0,
      show: false
    }
  }
};
const HANDLE_ACTION: {
  [propName in TAction]: (state: IState, action: IAction) => IState;
} = {
  SET_ELEMENT: (state, action) => {
    return {
      ...state,
      element: action.elements || []
    };
  },
  CREATE_ELEMENT: (state, action) => {
    const _element = state.element.map(item => {
      return { ...item, selected: false };
    });

    const TextNumber = _element.reduce((pre, item) => {
      return item.type == 'Text' ? pre + 1 : pre;
    }, 0);
    // options: action.options || {},
    // let _newElement = {
    //   id: state.elementCount + 1,
    //   type: action.elementType!,
    //   name: action.name || '',
    //   height: 100,
    //   width: 100,
    //   left: action.left || 0,
    //   top: action.top || 0,
    //   value: `Text${TextNumber}`,
    //   isLock: false,
    //   layerOpen: true,
    //   selected: true,
    //   editing: false
    // };
    // if (action.elementType == 'Chart') {
    //   _newElement['options'] = action.options || {};
    //   _newElement['title'] = action.title;
    //   _newElement['tooltip'] = action.tooltip;
    //   _newElement['chartsMark'] = action.chartsMark;
    //   _newElement.height = 200;
    //   _newElement.width = 400;
    //   _newElement['grid'] = action.options ? action.options['grid'] : {};
    // }
    if (action.newElement) {
      _element.push(action.newElement);
    }
    return {
      ...state,
      element: _element,
      drag: {
        ...state.drag
      }
    };
  },
  SET_TOOL_SELECT_ID: (state, action) => {
    return {
      ...state,
      tool: {
        ...state.tool,
        selectId: action.selectId || 0
      }
    };
  },
  // ADD_DRAG_ELEMENT: (state, action) => {
  //   const _dragList = state.dragList.slice();
  //   _dragList.push(action.element!);
  //   return {
  //     ...state,
  //     dragList: _dragList
  //   };
  // },
  SET_ELEMENT_STATE: (state, action) => {
    const id = action.element?.id;
    const _element = state.element.slice();
    for (let i = 0; i < _element.length; i++) {
      if (_element[i].id == id) {
        _element[i] = {
          ..._element[i],
          ...action.element
        };
        break;
      }
    }
    return {
      ...state,
      element: _element
    };
  },
  SET_CHART_OPTIONS: (state, action) => {
    const id = action.id;
    const _element = state.element.slice();
    for (let i = 0; i < _element.length; i++) {
      if (_element[i].id != id) continue;
      if (action.optionsType == 'title') {
        for (let prop in action['title']) {
          switch (prop) {
            case 'show':
              _element[i]['options']['title']['show'] = action.title.show;
              break;
            case 'content':
              _element[i]['options']['title']['text'] = action.title.content;
              break;
            case 'position':
              _element[i]['options']['title']['left'] = action.title.position;
              break;
            case 'fontColor':
              _element[i]['options']['title']['textStyle']['color'] =
                action.title.fontColor;
              break;
            case 'fontSize':
              _element[i]['options']['title']['textStyle']['fontSize'] =
                action.title.fontSize;
            case 'fontWeight':
              _element[i]['options']['title']['textStyle']['fontWeight'] =
                action.title.fontWeight;
          }
        }
        _element[i]['title'] = {
          ..._element[i]['title'],
          ...action.title
        };
        break;
      } else if (action.optionsType == 'base') {
        for (let prop in action['base']) {
          switch (prop) {
            case 'backgroundColor':
              _element[i]['options']['backgroundColor'] =
                action['base']['backgroundColor'];
              break;
          }
        }
        _element[i] = {
          ..._element[i],
          ...action['base']
        };
        break;
      } else if (action.optionsType == 'grid') {
        for (let prop in action['grid']) {
          _element[i]['options']['grid'][prop] = action['grid'][prop];
        }
        _element[i]['grid'] = {
          ..._element[i]['grid'],
          ...action['grid']
        };
        break;
      } else if (action.optionsType == 'tooltip') {
        for (let prop in action['tooltip']) {
          switch (prop) {
            case 'show':
              _element[i]['options']['tooltip']['show'] =
                action['tooltip']['show'];
              break;
            case 'trigger':
              _element[i]['options']['tooltip']['trigger'] =
                action['tooltip']['trigger'];
              break;
            case 'lineWidth':
              _element[i]['options']['tooltip']['axisPointer']['lineStyle'][
                'width'
              ] = action['tooltip']['lineWidth'];
              break;
            case 'axisPointerType':
              _element[i]['options']['tooltip']['axisPointer']['type'] =
                action['tooltip']['axisPointerType'];
              break;
            case 'axisPointerLabel':
              _element[i]['options']['tooltip']['axisPointer']['label'][
                'show'
              ] = action['tooltip']['axisPointerLabel'];
              break;
          }
        }
        _element[i]['tooltip'] = {
          ..._element[i]['tooltip'],
          ...action['tooltip']
        };
      } else if (action.optionsType == 'legend') {
        for (let prop in action['legend']) {
          _element[i]['options']['legend'][prop] = action['legend'][prop];
        }
        _element[i]['legend'] = {
          ..._element[i]['legend'],
          ...action['legend']
        };
        break;
      }
    }
    return {
      ...state,
      element: _element
    };
  },
  SET_ELEMENT_DATA: (state, action) => {
    const _element = state.element.slice() as IChartsElement[];
    _element.map(item => {
      if (item.id == -1 || item.type != 'Chart') return;
      item.options = formatElementData[item.chartsMark](
        item.options,
        action.elementData![item.id]
      );
    });
    return {
      ...state,
      element: _element,
      elementData: action.elementData || {}
    };
  },
  SET_LINE_STATE: (state, action) => {
    let _line = Object.assign({}, state.drag.line, { ...action.line });
    return {
      ...state,
      drag: {
        ...state.drag,
        line: _line
      }
    };
  },
  SET_DRAG_LOCK: (state, action) => {
    return {
      ...state,
      drag: {
        ...state.drag,
        isLock: !!action.locked
      }
    };
  },
  ELEMENT_SELECT: (state, action) => {
    let _element = state.element.slice();
    if (typeof action.selectList === 'number') {
      _element = _element.map(item => {
        return {
          ...item,
          selected: item.id == action.selectList ? true : false
        };
      });
    } else {
      _element = _element.map(item => {
        return {
          ...item,
          selected:
            _.indexOf(action.selectList as number[], item.id) != -1
              ? true
              : false
        };
      });
    }
    return {
      ...state,
      element: _element
    };
  },
  ELEMENT_SELECT_ADD: (state, action) => {
    const _element = state.element.slice();
    _element.forEach(item => {
      item.id == action.selectId && (item.selected = true);
      item.id == -1 && (item.selected = false);
    });
    return {
      ...state,
      element: _element
    };
  },
  DELETE_ELEMENT_SELECTED: (state, action) => {
    const _element = state.element.slice();
    return {
      ...state,
      element: _element.filter(item => {
        return !item.selected || item.id == -1;
      })
    };
  }
};

export default (state: IState = initState, action: IAction) => {
  const handle = HANDLE_ACTION[action.type];
  return handle ? handle(state, action) : state;
};
