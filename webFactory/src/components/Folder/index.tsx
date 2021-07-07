import React, { useEffect, useRef, useState } from 'react';
import CLN from 'classnames';
import $ from 'jquery';

import Icon from '@components/Icon';
import S from './index.less';

interface IProps {
  title: string;
  className?: string;
  children?: any;
}

const Component = (props: IProps) => {
  const { title, className, children } = props;
  const [isOpen, setIsOpen] = useState(false);
  const ref = {
    content: useRef(null),
    mask: useRef(null)
  };
  useEffect(() => {
    const $content = $(ref.content.current || '');
    const $mask = $(ref.mask.current || '');
    const height = $mask.css('height');
    if (isOpen) {
      $content.css({ height });
    } else {
      $content.css({ height: 0 });
    }
  });
  return (
    <div className={CLN(className, S['container'])}>
      <div
        className={S['title']}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <Icon name={isOpen ? 'iconxiasanjiao' : 'iconyousanjiao'}></Icon>
        <span>{title}</span>
      </div>
      {children && (
        <div
          className={CLN(S['content'], { [S['hidden']]: !isOpen })}
          ref={ref.content}
        >
          <div ref={ref.mask} className={S['mask']}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Component;
