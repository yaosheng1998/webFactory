import React, { useRef, useState, useEffect } from 'react';
import CLN from 'classnames';
import { Editor } from '@tinymce/tinymce-react';
import { Modal } from 'antd';

import { IControlText, IControlImage } from '@reducer/editor';
import { setElementState } from '@action/editor';
import Icon from '@components/Icon';
import S from './index.less';

interface IProps {
  className?: string;
  element: IControlImage;
}

const Component = (props: IProps) => {
  const { className, element } = props;
  const ref = useRef(null);
  //   const ref = useRef(null);
  return (
    <div className={CLN(className, S['container'])}>
      <img
        draggable={false}
        className={S['content']}
        src={element.url ? element.url : 'src/assets/image/imageControl.jpg'}
        style={{ opacity: element.opacity ? element.opacity : 1 }}
        ref={ref}
      ></img>
    </div>
  );
};

export default Component;
