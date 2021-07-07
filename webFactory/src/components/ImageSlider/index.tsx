import React, { useEffect, useRef, useState } from 'react';
import CLN from 'classnames';
import $ from 'jquery';
import S from './index.less';
import { background } from '@/routes/Edit/index.less';
import Icon from '@components/Icon';

interface IProps {
  height?: number;
  width?: number;
  onChange?: (...args: any) => void;
}

const Component = (props: IProps) => {
  const { height = 150, width = 340, onChange } = props;
  const config = {
    url:
      'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=176633955,3547719964&fm=26&gp=0.jpg',
    blockSize: 50
  };
  const [showImage, setShowImage] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [lock, setLock] = useState(false);
  const [shadow, setShadow] = useState({ offsetX: 0, offsetY: 0 });
  const [block, setBlock] = useState({ currentX: 0, state: 'pending' });
  const ref = {
    shandow: useRef<HTMLCanvasElement>(null),
    block: useRef<HTMLCanvasElement>(null),
    image: useRef<HTMLDivElement>(null)
  };
  useEffect(() => {
    onload();
    renderImage();
  }, []);
  const onload = () => {};
  const createClipPath = (
    ctx: CanvasRenderingContext2D,
    size = 100,
    styleIndex = 0
  ) => {
    const styles = [
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 1, 0],
      [0, 0, 1, 1],
      [0, 1, 0, 0],
      [0, 1, 0, 1],
      [0, 1, 1, 0],
      [0, 1, 1, 1],
      [1, 0, 0, 0],
      [1, 0, 0, 1],
      [1, 0, 1, 0],
      [1, 0, 1, 1],
      [1, 1, 0, 0],
      [1, 1, 0, 1],
      [1, 1, 1, 0],
      [1, 1, 1, 1]
    ];
    const style = styles[styleIndex];
    const r = 0.1 * size;
    ctx.clearRect(0, 0, config.blockSize, config.blockSize);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(r, r);
    ctx.lineTo(r, 0.5 * size - r);
    ctx.arc(r, 0.5 * size, r, 1.5 * Math.PI, 0.5 * Math.PI, !!style[0]);
    ctx.lineTo(r, size - r);
    ctx.lineTo(0.5 * size - r, size - r);
    ctx.arc(0.5 * size, size - r, r, Math.PI, 0, !!style[1]);
    ctx.lineTo(size - r, size - r);
    ctx.lineTo(size - r, 0.5 * size + r);
    ctx.arc(size - r, 0.5 * size, r, 0.5 * Math.PI, 1.5 * Math.PI, !!style[2]);
    ctx.lineTo(size - r, r);
    ctx.lineTo(0.5 * size + r, r);
    ctx.arc(0.5 * size, r, r, 0, Math.PI, !!style[3]);
    ctx.lineTo(r, r);
    ctx.clip();
    ctx.closePath();
  };
  const renderImage = () => {
    const objImage = new Image();
    objImage.addEventListener('load', () => {
      const ctxShadow = ref.shandow.current!.getContext('2d')!;
      const ctxBlock = ref.block.current!.getContext('2d')!;
      const styleIndex = Math.floor(Math.random() * 16);
      createClipPath(ctxShadow, config.blockSize, styleIndex);
      createClipPath(ctxBlock, config.blockSize, styleIndex);
      const clipX = Math.floor(
        config.blockSize + (width! - 2 * config.blockSize) * Math.random()
      );
      const clipY = Math.floor((height! - config.blockSize) * Math.random());
      setShadow({
        offsetX: clipX,
        offsetY: clipY
      });
      ctxBlock.drawImage(
        objImage,
        clipX,
        clipY,
        config.blockSize,
        config.blockSize,
        0,
        0,
        config.blockSize,
        config.blockSize
      );
      ctxShadow.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctxShadow.fill();
      ctxShadow.restore();
      ctxBlock.restore();
    });
    objImage.src = config.url;
  };
  return (
    <div
      className={S['container']}
      onMouseEnter={() => {}}
      onMouseLeave={event => {
        if (showImage && !event.buttons) {
          setShowImage(false);
          $(ref.image.current!).fadeOut(300);
        }
      }}
    >
      <div className={CLN(S['imageContainerWrap'])} ref={ref.image}>
        <div
          className={CLN(S['imageContainer'])}
          style={{ backgroundImage: `url("${config.url}")`, height, width }}
        >
          <canvas
            className={S['shandow']}
            height={config.blockSize}
            width={config.blockSize}
            style={{ left: shadow.offsetX, top: shadow.offsetY }}
            ref={ref.shandow}
          ></canvas>
          <canvas
            className={CLN(S['block'])}
            height={config.blockSize}
            width={config.blockSize}
            style={{ left: block.currentX, top: shadow.offsetY }}
            ref={ref.block}
          ></canvas>
          <Icon
            name="iconshuaxin1"
            className={S['refresh']}
            onClick={() => {
              renderImage();
            }}
          ></Icon>
        </div>
      </div>
      <div className={CLN(S['sliderContainer'], S[block.state])}>
        <div
          className={S['background']}
          style={{ width: width - block.currentX - 15 }}
        ></div>
        <div
          className={S['point']}
          style={{ left: block.currentX }}
          onMouseDown={event => {
            if (lock) return;
            if (!showImage && block.state != 'success') {
              setShowImage(true);
              $(ref.image.current!).fadeIn();
            }
            setShowTips(false);
            const $target = $(event.target);
            const $body = $(document.body);
            const pageX = event.pageX;
            let _currentX = block.currentX;
            $body.on('mousemove', event => {
              const curPageX = event.pageX;
              const diffX = curPageX - pageX;
              _currentX = block.currentX + diffX;
              _currentX < 0 && (_currentX = 0);
              _currentX > width - config.blockSize &&
                (_currentX = width - config.blockSize);
              setBlock({
                currentX: _currentX,
                state: block.state
              });
            });
            $body.on('mouseup', event => {
              $body.off('mousemove');
              $body.off('mouseup');
              setLock(true);
              if (Math.abs(_currentX - shadow.offsetX) < 4) {
                setBlock({ currentX: _currentX, state: 'success' });
                $(ref.image.current!).fadeOut(300);
                onChange && onChange('success');
              } else {
                renderImage();
                onChange && onChange('error');
                setBlock({ currentX: _currentX, state: 'error' });
                setTimeout(() => {
                  setBlock({ currentX: 0, state: 'error' });
                }, 200);
                setTimeout(() => {
                  setLock(false);
                  setBlock({ currentX: 0, state: 'pending' });
                  setShowTips(true);
                }, 500);
              }
            });
          }}
        >
          <Icon
            name={
              block.state == 'pending'
                ? 'iconzanting'
                : block.state == 'error'
                ? 'iconcuowu'
                : 'iconzhengque'
            }
          ></Icon>
        </div>
        <span
          className={S['tip']}
          style={{ display: showTips ? 'block' : 'none' }}
        >
          按住滑块,拖动完成拼图
        </span>
      </div>
    </div>
  );
};

export default Component;
