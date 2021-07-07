import React from 'react';
import CLN from 'classnames';
import S from './index.less';
import TIconName from './name';

interface IProps {
  name: TIconName;
  className?: string;
  onClick?: (...args: any) => void;
}
const Component = (props: IProps) => {
  const { className, name, onClick } = props;
  return (
    <i
      className={CLN(className, name, S['iconfont'])}
      onClick={e => {
        onClick && onClick(e);
      }}
    ></i>
  );
};

export default Component;
