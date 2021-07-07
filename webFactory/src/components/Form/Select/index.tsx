import React from 'react';
import CLN from 'classnames';
import { Select } from 'antd';
import Icon from '@components/Icon';
import S from './index.less';

interface IProps {
  className?: string;
  width?: number;
  options: { value: string | number; text: string }[];
  onChange?: (...args: any) => void;
  value?: string | number;
  disabled?: boolean;
}
const { Option } = Select;
const Component = (props: IProps) => {
  const { className, options, onChange, value, width = 100, disabled } = props;
  const _options = options.map(item => {
    return { label: item.text, value: item.value };
  });
  return (
    <div
      className={CLN(S['container'], { [S['disabled']]: disabled }, className)}
    >
      <Select
        placeholder="请选择..."
        value={value}
        suffixIcon={<Icon name="iconxiasanjiao" className={S['suffix']}></Icon>}
        className={S['select']}
        style={{ width: width - 2 }}
        options={_options}
        bordered={false}
        disabled={disabled}
        dropdownClassName={S['dropdown']}
        onChange={value => {
          onChange && onChange(value);
        }}
      ></Select>
    </div>
  );
};

export default Component;
