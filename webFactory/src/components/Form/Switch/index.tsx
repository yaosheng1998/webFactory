import React from 'react';
import CLN from 'classnames';
import { Switch } from 'antd';
import Icon from '@components/Icon';
import S from './index.less';

interface IProps {
  className?: string;
  style?: object;
  onChange?: (...args: any) => void;
  checked?: boolean;
}
const Component = (props: IProps) => {
  const { className, onChange, checked, style } = props;
  return (
    <div className={CLN(S['container'], className)}>
      <Switch
        checked={checked}
        style={style}
        onChange={checked => {
          onChange && onChange(checked);
        }}
      ></Switch>
    </div>
  );
};

export default Component;
