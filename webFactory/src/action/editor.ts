import store from '@/reducer';
import { IState } from '@/reducer/user';
import { IAction } from '@reducer/editor';

export const setElement = (elements: IAction['elements']) => {
  store.dispatch({ type: 'SET_ELEMENT', elements });
};

/*选择工具*/
export const setToolSelectId = (selectId: number) => {
  store.dispatch({ type: 'SET_TOOL_SELECT_ID', selectId });
};

/*设置选择线位置*/
export const setLineState = (line: IAction['line']) => {
  store.dispatch({ type: 'SET_LINE_STATE', line });
};

/*设置元素基础属性*/
export const setElementState = (element: IAction['element']) => {
  store.dispatch({ type: 'SET_ELEMENT_STATE', element });
};

/*设置图表标题*/
export const setChartOptions = (
  elementId: number,
  optionsType: IAction['optionsType'],
  options:
    | IAction['title']
    | { backgroundColor: string }
    | IAction['grid']
    | IAction['tooltip']
) => {
  store.dispatch({
    type: 'SET_CHART_OPTIONS',
    optionsType,
    id: elementId,
    [optionsType!]: options
  });
};

/*设置图表options*/

/*设置元素是否锁定*/
export const setDragLock = (locked: boolean) => {
  store.dispatch({ type: 'SET_DRAG_LOCK', locked });
};

/*选择元素*/
export const elementSelect = (selectList: number | number[]) => {
  store.dispatch({ type: 'ELEMENT_SELECT', selectList });
};

/*ctrl增加选择元素*/
export const elementSelectAdd = (selectId: number) => {
  store.dispatch({ type: 'ELEMENT_SELECT_ADD', selectId });
};

/*元素上对齐*/
export const elementTopAlign = () => {
  const element = store.getState().editor.element.filter(item => item.selected);
  let minTop = element.length ? element[0].top : 0;
  element.forEach(item => {
    minTop = Math.min(item.top, minTop);
  });
  element.forEach(item => {
    setElementState({ id: item.id, top: minTop });
  });
};

/*元素下对齐*/
export const elementBottomAlign = () => {
  const element = store.getState().editor.element.filter(item => item.selected);
  let maxBottom = element.length ? element[0].top + element[0].height : 0;
  element.forEach(item => {
    maxBottom = Math.max(item.top + item.height, maxBottom);
  });
  element.forEach(item => {
    setElementState({ id: item.id, top: maxBottom - item.height });
  });
};

/*元素左对齐*/
export const elementLeftAlign = () => {
  const element = store.getState().editor.element.filter(item => item.selected);
  let minLeft = element.length ? element[0].left : 0;
  element.forEach(item => {
    minLeft = Math.min(item.left, minLeft);
  });
  element.forEach(item => {
    setElementState({ id: item.id, left: minLeft });
  });
};

/*元素右对齐*/
export const elementRightAlign = () => {
  const element = store.getState().editor.element.filter(item => item.selected);
  let maxRight = element.length ? element[0].left + element[0].width : 0;
  element.forEach(item => {
    maxRight = Math.max(item.left + item.width, maxRight);
  });
  element.forEach(item => {
    setElementState({ id: item.id, left: maxRight - item.width });
  });
};

/*新增元素*/
export const createElement = (newElement: IAction['newElement']) => {
  store.dispatch({
    type: 'CREATE_ELEMENT',
    newElement
  });
};

/*删除被选中元素*/
export const deleteElementSelected = () => {
  store.dispatch({ type: 'DELETE_ELEMENT_SELECTED' });
};

export const setElementData = (elementData: IAction['elementData']) => {
  store.dispatch({ type: 'SET_ELEMENT_DATA', elementData });
};
