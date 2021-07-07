import React, { useEffect, useRef, useState } from 'react';
import CLN from 'classnames';
import { Modal } from 'antd';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
// 主题风格
import 'codemirror/theme/solarized.css';
import 'codemirror/theme/yonce.css';
import 'codemirror/theme/monokai.css';
// 代码模式，clike是包含java,c++等模式的
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';
//ctrl+空格代码提示补全
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/anyword-hint.js';
//代码高亮
import 'codemirror/addon/selection/active-line';
//折叠代码
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchBrackets';
import S from './index.less';
import editor from '@/reducer/editor';

interface IProps {
  className?: string;
  visible?: boolean;
  data?: string;
  readonly?: boolean;
  onOk?: (...args: any) => void;
  onCancel?: (...args: any) => void;
}
const { confirm } = Modal;
const Component = (props: IProps) => {
  const { className, visible, onCancel, onOk, readonly, data } = props;
  const codeMirror = useRef(null);
  const [error, setError] = useState(false);
  // const data = JSON.stringify(`{
  //   x: ['Mon', 'The', 'Wed', 'Thu', 'Fri'],
  //   data: [
  //     {
  //       name: 'first',
  //       data: [1, 2, 3, 4, 5]
  //     },
  //     {
  //       name: 'second',
  //       data: [2, 3, 4, 5, 6]
  //     }
  //   ]
  // }`);
  // const data = `{
  //   "xLabel": ["Mon", "The", "Wed", "Thu", "Fri"],
  //   "data":[
  //     {
  //       "name":"first",
  //       "data":[1, 2, 3, 4, 5]
  //     },
  //     {
  //       "name":"second",
  //       "da321ta3":[2 ,3, 4, 5, 6]
  //     }
  //   ]
  // }`;
  // const data = `{
  //   "x": ["Mon", "Tue", "Wed", "Thu", "Fri"]
  //   "data": [
  //     {
  //       "name": "first",
  //       "data": [1, 2, 3, 4, 5]
  //     },
  //     {
  //       "name": "second",
  //       "data": [2, 3, 4, 5, 6]
  //     }
  //   ]
  // }`;
  // const data = JSON.stringify(`[
  //   {
  //     "x": 80,
  //     "y": "一月",
  //     "s": "s1"
  //   },
  //   {
  //     "x": 50,
  //     "y": "二月",
  //     "s": "s1"
  //   },
  //   {
  //     "x": 160,
  //     "y": "三月",
  //     "s": "s1"
  //   },
  //   {
  //     "x": 120,
  //     "y": "四月",
  //     "s": "s1"
  //   },
  //   {
  //     "x": 40,
  //     "y": "五月",
  //     "s": "s1"
  //   },
  //   {
  //     "x": 50,
  //     "y": "一月",
  //     "s": "s2"
  //   },
  //   {
  //     "x": 150,
  //     "y": "二月",
  //     "s": "s2"
  //   },
  //   {
  //     "x": 120,
  //     "y": "三月",
  //     "s": "s2"
  //   },
  //   {
  //     "x": 190,
  //     "y": "四月",
  //     "s": "s2"
  //   },
  //   {
  //     "x": 140,
  //     "y": "五月",
  //     "s": "s2"
  //   }
  // ]`)

  useEffect(() => {
    if (!data) return;
    const editor = (codeMirror.current as any).editor;
    editor.setValue(data);
  }, [visible]);
  const [result, setResult] = useState(data);
  const [modal, contextHolder] = Modal.useModal();
  return (
    <div className={CLN(S['container'], className)} id="main">
      <Modal
        title="数据"
        visible={visible}
        width={1400}
        onOk={() => {
          if (error) {
            modal.error({
              title: 'JSON格式错误，请检查。',
              okText: '确定'
            });
          } else {
            onOk && onOk(result);
          }
        }}
        okText="确定"
        // bodyStyle={{ padding: '0 40px' }}
        cancelText="取消"
        confirmLoading={false}
        onCancel={() => {
          onCancel && onCancel();
        }}
      >
        {contextHolder}
        <CodeMirror
          ref={codeMirror}
          editorDidMount={editor => {}}
          value={data}
          className={S['code']}
          options={{
            mode: { name: 'javascript', json: true },
            theme: 'monokai',
            readOnly: readonly,
            autofocus: true, //自动获取焦点
            styleActiveLine: true, //光标代码高亮
            // lineNumbers: true, //显示行号
            smartIndent: true, //自动缩进
            //start-设置支持代码折叠
            lineWrapping: true,
            foldGutter: true,
            // gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'], //end
            // extraKeys: {
            //   Ctrl: 'autocomplete',
            //   'Ctrl-S': function (editor: any) {},
            //   'Ctrl-Z': function (editor: any) {
            //     editor.undo();
            //   }, //undo
            //   F8: function (editor: any) {
            //     editor.redo();
            //   } //Redo
            // },
            matchBrackets: true, //括号匹配，光标旁边的括号都高亮显示
            autoCloseBrackets: true //键入时将自动关闭()[]{}''""
          }}
          onChange={(instance, changeObj) => {
            try {
              const value = JSON.parse(instance.getValue());

              setResult(instance.getValue());
              error && setError(false);
            } catch (error) {
              setError(true);
            }
          }}
          // 在失去焦点的时候触发，这个时候放数据最好
          // onBlur={this.codeOnBlur}

          // // 这个必须加上，否则在一些情况下，第二次打开就会有问题
          // onBeforeChange={(editor, data, value) => {
          //   console.log('onBeforeChange fresh');
          //   console.log('data', data);
          //   console.log('value', value);
          //   // console.log(JSON.parse(value || ''));
          //   setResult(value);
          // }}
          //     /* HERE: pick out only the value. and might as well get name. */
        />
      </Modal>
    </div>
  );
};

export default Component;
