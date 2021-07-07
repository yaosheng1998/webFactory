import React, { useEffect, useRef, useState } from 'react';
import CLN from 'classnames';
import { connect } from 'react-redux';
import Icon from '@components/Icon';
import { setDragLock, setToolSelectId } from '@action/editor';
import store, { IState } from '@/reducer';
import { hasChildren } from '@/utils/tool';
import Chart from '@components/Chart';
import S from './index.less';
import ChartS from '../index.less';

interface IProps {
  className?: string;
}

const Component = (props: IProps) => {
  const chartsList = [
    {
      id: 0,
      icon: '',
      image: 'RaderCharts/rader1.jpg',
      options: {
        title: {
          show: true,
          text: '基础雷达图',
          textStyle: {
            fontSize: 12
          }
        },
        legend: {
          textStyle: {
            fontSize: 14,
            color: '#fff'
          }
        },
        tooltip: {},
        radar: {
          // shape: 'circle',
          name: {
            fontSize: 14
          },
          indicator: [
            { name: 'A', max: 6500 },
            { name: 'B', max: 16000 },
            { name: 'C', max: 30000 },
            { name: 'D', max: 38000 },
            { name: 'E', max: 52000 },
            { name: 'F', max: 25000 }
          ]
        },
        series: [
          {
            name: '预算 vs 开销（Budget vs spending）',
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: 'I'
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: 'II'
              }
            ]
          }
        ],
        grid: { left: 30, top: 40, right: 0, bottom: 30 }
      },
      title: {
        show: true,
        content: '基础雷达图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      grid: { left: 30, top: 40, right: 0, bottom: 30 }
    }
  ];
  return (
    <ul className={CLN(S['container'], ChartS['chartsWrap'])}>
      {chartsList.map(item => {
        return (
          <li
            className={ChartS['chartItem']}
            key={item.id}
            draggable={true}
            onDragStart={event => {
              event.dataTransfer.setData(
                'transfer',
                JSON.stringify(
                  {
                    type: 'Chart',
                    options: item.options,
                    title: item.title,
                    grid: item.grid
                  } || {}
                )
              );
            }}
            title={item.title.content}
          >
            <div className={ChartS['chartImg']}>
              <img
                src={require(`@/assets/image/charts/${item.image}`)}
                className={S['img']}
              ></img>
            </div>
            <p className={ChartS['chartName']}>{item.title.content}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default Component;
