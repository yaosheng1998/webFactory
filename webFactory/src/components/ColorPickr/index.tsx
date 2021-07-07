import React, { useState, useEffect } from 'react';
import CLN from 'classnames';
import '@simonwep/pickr/dist/themes/monolith.min.css';
import Pickr from '@simonwep/pickr';
import S from './index.less';
import _ from 'lodash';

interface IProps {
  className?: string;
  color?: string;
  width?: number;
  onSave?: (...args: any) => void;
  onChange?: (...args: any) => void;
}

const Component = (props: IProps) => {
  const { className, onChange, onSave, width } = props;
  let _color = props.color || '#FFFFFF';
  const [pickr, setPickr] = useState({} as Pickr);
  const [color, setColor] = useState(_color);
  useEffect(() => {
    const _pickr = new Pickr({
      el: '.colorPicker',
      theme: 'monolith',
      padding: 0,
      default: color,
      swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)'
      ],
      i18n: {
        'btn:save': '保存'
      },
      components: {
        // Main components
        preview: true,
        opacity: true,
        hue: true,
        // Input / output Options
        interaction: {
          hex: true,
          rgba: true,
          input: true,
          save: true
        }
      }
    } as Pickr.Options);
    setPickr(_pickr);
    // setTimeout(() => {
    _pickr
      .on('save', () => {
        const hsva = _pickr.getColor();
        const hexaColor = '#' + hsva.toHEXA().join('');
        onSave && onSave(hexaColor);
        _color = hexaColor;
        _pickr.hide();
      })
      .on('change', () => {
        const hsva = _pickr.getColor();
        const hexa = '#' + hsva.toHEXA().join('');
        onChange && onChange(hexa);
        setColor(hexa);
      })
      .on('hide', () => {
        const hsva = _pickr.getColor();
        const hexa = '#' + hsva.toHEXA().join('');
        setColor(_color);
        _pickr.setColor(_color, true);
      });
  }, []);
  return (
    <div
      className={S['container']}
      style={{ width }}
      onClick={() => {
        pickr.show();
      }}
    >
      <div className={S['hide']}>
        <div className="colorPicker"></div>;
      </div>
      <div
        className={S['block']}
        style={{
          backgroundColor: color
        }}
      ></div>
      <span>{color.toLocaleUpperCase()}</span>
    </div>
  );
};

export default Component;
