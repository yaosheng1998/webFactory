import React, { ReactElement } from 'react';
import CLN from 'classnames';
import S from './index.less';

import Icon from '@components/Icon';

interface IProps {
  placeholder?: string;
  password?: boolean;
  className?: string;
  value?: string;
  icon?: () => ReactElement;
  onChange?: (...args: any) => void;
}

const Component = (props: IProps) => {
  const {
    placeholder,
    onChange,
    className,
    value,
    icon,
    password = false
  } = props;
  return (
    <div className={CLN(className, S['inputWrap'])}>
      {icon && icon()}
      <input
        placeholder={placeholder}
        value={value}
        type={password ? 'password' : 'text'}
        className={S['input']}
        onChange={e => {
          onChange && onChange(e.target.value);
        }}
      />
      {password && <div className={S['eye']}></div>}
    </div>
  );
};

export default Component;
