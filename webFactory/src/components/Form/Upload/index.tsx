import React, { useRef } from 'react';
import CLN from 'classnames';
import Icon from '@components/Icon';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import S from './index.less';
import { Modal } from 'antd';

const { confirm } = Modal;

interface IProps {
  className?: string;
  url?: string;
  text?: string;
  name?: string;
  height?: number;
  width?: number;
  onUpload?: (...args: any) => void;
  onDelete?: (...args: any) => void;
}
const Component = (props: IProps) => {
  const {
    className,
    url,
    height = 70,
    width = 200,
    onUpload,
    onDelete,
    name,
    text = '上传png、jpg图片(<=1M)'
  } = props;

  const input = useRef(null);
  return (
    <div className={CLN(S['container'], className)} style={{ height, width }}>
      <input
        ref={input}
        type="file"
        accept=".jpg,.png"
        style={{ display: 'none' }}
        onChange={event => {
          const target = event.target;
          onUpload && onUpload(target.files![0]);
          if (input.current) {
            (input.current as any).value = '';
          }
        }}
      />
      {url ? (
        <div className={S['showImage']}>
          <img
            src={url}
            alt=""
            className={S['image']}
            style={{
              height: 0.8 * height,
              width: 0.8 * height,
              marginLeft: 0.1 * height
            }}
          />
          <div className={S['desc']} title={name}>
            {name}
          </div>
          <div className={S['delete']}></div>
          <Icon
            name="iconhuishouzhan2"
            className={S['delete']}
            onClick={() => {
              confirm({
                icon: <ExclamationCircleOutlined />,
                content: <div>是否删除该资源？</div>,
                okText: '确认',
                cancelText: '取消',
                onOk() {
                  onDelete && onDelete();
                },
                onCancel() {}
              });
            }}
          ></Icon>
        </div>
      ) : (
        <div
          className={S['upload']}
          onClick={() => {
            if (input.current) {
              (input.current as any).click();
            }
          }}
        >
          <Icon name="iconshangchuan2" className={S['upIcon']}></Icon>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default Component;
