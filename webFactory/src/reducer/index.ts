import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import user, { IState as userState } from './user';
import editor, { IState as editorState } from './editor';

const store = createStore(
  combineReducers({ user, editor }),
  applyMiddleware(thunkMiddleware)
);

export interface IState {
  user: userState;
  editor: editorState;
}
export default store;
