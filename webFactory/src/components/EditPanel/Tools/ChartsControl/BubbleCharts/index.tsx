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
      image: 'BubbleCharts/bubble1.jpg',
      options: {
        title: {
          show: true,
          text: '基础散点图',
          textStyle: {
            fontSize: 12
          }
        },
        xAxis: {
          axisLabel: {
            fontSize: 12
          }
        },
        yAxis: {
          axisLabel: {
            fontSize: 12
          }
        },
        series: [
          {
            symbolSize: 14,
            data: [
              [10.0, 8.04],
              [8.07, 6.95],
              [13.0, 7.58],
              [9.05, 8.81],
              [11.0, 8.33],
              [14.0, 7.66],
              [13.4, 6.81],
              [10.0, 6.33],
              [14.0, 8.96],
              [12.5, 6.82],
              [9.15, 7.2],
              [11.5, 7.2],
              [3.03, 4.23],
              [12.2, 7.83],
              [2.02, 4.47],
              [1.05, 3.33],
              [4.05, 4.96],
              [6.03, 7.24],
              [12.0, 6.26],
              [12.0, 8.84],
              [7.08, 5.82],
              [5.02, 5.68]
            ],
            type: 'scatter'
          }
        ],
        grid: { left: 30, top: 40, right: 0, bottom: 30 }
      },
      title: {
        show: true,
        content: '基础散点图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      grid: { left: 30, top: 40, right: 0, bottom: 30 }
    },
    {
      id: 1,
      icon: '',
      title: {
        show: true,
        content: '气泡图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      image: 'BubbleCharts/bubble2.jpg',
      options: {
        title: {
          show: true,
          text: '基础散点图',
          textStyle: {
            fontSize: 12
          }
        },
        xAxis: {
          axisLabel: {
            fontSize: 12
          }
        },
        yAxis: {
          axisLabel: {
            fontSize: 12
          }
        },
        series: [
          {
            symbolSize: 14,
            data: [
              [10.0, 8.04],
              [8.07, 6.95],
              [13.0, 7.58],
              [9.05, 8.81],
              [11.0, 8.33],
              [14.0, 7.66],
              [13.4, 6.81],
              [10.0, 6.33],
              [14.0, 8.96],
              [12.5, 6.82],
              [9.15, 7.2],
              [11.5, 7.2],
              [3.03, 4.23],
              [12.2, 7.83],
              [2.02, 4.47],
              [1.05, 3.33],
              [4.05, 4.96],
              [6.03, 7.24],
              [12.0, 6.26],
              [12.0, 8.84],
              [7.08, 5.82],
              [5.02, 5.68]
            ],
            type: 'scatter'
          }
        ],
        grid: { left: 30, top: 40, right: 0, bottom: 30 }
      }
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
