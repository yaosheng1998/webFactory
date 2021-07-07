import React from 'react';
import CLN from 'classnames';
import S from './index.less';

import Icon from '@components/Icon';

interface IProps {
  className?: string;
  checked: boolean;
  onChange?: (...args: any) => void;
}

const Component = (props: IProps) => {
  const { className, checked, onChange } = props;
  return (
    <Icon
      name={checked ? 'iconxuanzhong' : 'iconweixuanzhong'}
      className={CLN(className, S['checkbox'], { [S['checked']]: checked })}
      onClick={e => {
        onChange && onChange(!checked);
      }}
    ></Icon>
  );
};

export default Component;
