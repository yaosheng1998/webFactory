import React, { useRef, useState, useEffect } from 'react';
import CLN from 'classnames';
import { Editor } from '@tinymce/tinymce-react';
import { Modal } from 'antd';

import { IControlText } from '@reducer/editor';
import { setElementState } from '@action/editor';
import S from './index.less';

interface IProps {
  className?: string;
  element: IControlText;
}

const Component = (props: IProps) => {
  const { className, element } = props;
  const [visiable, setVisiable] = useState(false);
  const [value, setValue] = useState(element.value || '');
  const ref = useRef(null);
  //   const ref = useRef(null);
  useEffect(() => {
    $(ref.current || '').html(element.value);
  }, [element.value]);
  return (
    <div
      className={CLN(className, S['container'])}
      onDoubleClick={() => {
        setVisiable(true);
      }}
    >
      <div className={S['content']} ref={ref}>
        {element.value}
      </div>
      <Modal
        title="编辑"
        visible={visiable}
        // maskClosable={false}
        onOk={() => {
          setVisiable(false);
        }}
        onCancel={() => {
          setElementState({ id: element.id, value });
          setVisiable(false);
        }}
        okText="确认"
        cancelText="取消"
        width={800}
        footer={null}
        bodyStyle={{ padding: 0 }}
        style={{ padding: 0 }}
      >
        <Editor
          inline={false}
          // selector="editorStateRef"
          apiKey="r9bxg31eteh6c6h62vlkoge6swhgd0crgpesbspquszfj9sr"
          // ref="tinyEditor"
          value={value}
          onEditorChange={(content, editor) => {
            // console.log('Content was updated:', content);
            // setElementState({ id: element.id, value: content });
            setValue(content);
          }}
          init={{
            height: '500px',
            language: 'zh_CN',
            plugins: 'table lists image',
            toolbar: `formatselect | image |  bold italic strikethrough forecolor backcolor
        alignleft aligncenter alignright alignjustify
        numlist bullist outdent indent`,
            file_picker_types: 'image',
            // automatic_uploads={false}
            images_upload_url: '',
            image_uploadtab: true
          }}
        />
      </Modal>
    </div>
  );
};

export default Component;
