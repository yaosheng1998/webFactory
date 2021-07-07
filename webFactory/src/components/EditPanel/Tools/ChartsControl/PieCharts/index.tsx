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
      image: 'PieCharts/pie1.jpg',
      options: {
        title: {
          show: true,
          text: '基础饼图',
          textStyle: {
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            fontSize: 3
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            label: {
              fontSize: 14
            },
            data: [
              { value: 1048, name: '搜索引擎' },
              { value: 735, name: '直接访问' },
              { value: 580, name: '邮件营销' },
              { value: 484, name: '联盟广告' },
              { value: 300, name: '视频广告' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        grid: { left: 30, top: 40, right: 0, bottom: 30 }
      },
      title: {
        show: true,
        content: '基础饼图',
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
        content: '环形图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      image: 'PieCharts/pie2.jpg',
      options: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        grid: { left: 30, top: 40, right: 0, bottom: 30 },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: '搜索引擎' },
              { value: 735, name: '直接访问' },
              { value: 580, name: '邮件营销' },
              { value: 484, name: '联盟广告' },
              { value: 300, name: '视频广告' }
            ]
          }
        ]
      }
    },
    {
      id: 2,
      icon: '',
      title: {
        show: true,
        content: '玫瑰图1',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      image: 'PieCharts/pie3.jpg',
      options: {
        title: {
          // text: 'Customized Pie',
          left: 'center',
          top: 20,
          textStyle: {
            // color: '#ccc'
          }
        },
        legend: {
          top: 10,
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item'
        },
        grid: { left: 30, top: 40, right: 0, bottom: 30 },
        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [
              { value: 335, name: 'A' },
              { value: 310, name: 'B' },
              { value: 274, name: 'C' },
              { value: 235, name: 'D' },
              { value: 400, name: 'E' }
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: 'radius',
            label: {
              // color: 'rgba(255, 255, 255, 1)',
              fontSize: 14
            },
            labelLine: {
              lineStyle: {
                // color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            itemStyle: {
              color: '#73C0DE',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx: any) {
              return Math.random() * 200;
            }
          }
        ]
      }
    },
    {
      id: 3,
      icon: '',
      title: {
        show: true,
        content: '玫瑰图2',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      image: 'PieCharts/pie4.jpg',
      options: {
        legend: {
          top: 'top',
          textStyle: {
            fontSize: 14
          }
        },
        grid: { left: 30, top: 40, right: 0, bottom: 30 },
        series: [
          {
            name: '面积模式',
            type: 'pie',
            radius: [10, 80],
            center: ['50%', '50%'],
            roseType: 'area',
            label: {
              fontSize: 14
            },
            itemStyle: {
              borderRadius: 8
            },
            data: [
              { value: 40, name: 'A' },
              { value: 38, name: 'B' },
              { value: 32, name: 'C' },
              { value: 30, name: 'D' },
              { value: 28, name: 'E' },
              { value: 26, name: 'F' },
              { value: 22, name: 'G' },
              { value: 18, name: 'H' }
            ]
          }
        ]
      }
    },
    {
      id: 4,
      icon: '',
      title: {
        show: true,
        content: '嵌套环形图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      image: 'PieCharts/pie5.jpg',
      options: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          // data: ['直达', '营销广告', '搜索引擎', '邮件营销', '联盟广告', '视频广告', '百度', '谷歌', '必应', '其他'],
          textStyle: {
            fontSize: 14
          }
        },
        grid: { left: 30, top: 40, right: 0, bottom: 30 },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
              position: 'inner',
              fontSize: 14
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1548, name: 'I' },
              { value: 775, name: 'B' },
              { value: 679, name: 'J', selected: true }
            ]
          },
          {
            name: '访问来源',
            type: 'pie',
            radius: ['45%', '60%'],
            labelLine: {
              length: 30
            },
            label: {
              // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              // backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              // borderWidth: 1,
              // borderRadius: 4,
              fontSize: 14
              // rich: {
              //     a: {
              //         color: '#6E7079',
              //         lineHeight: 22,
              //         align: 'center'
              //     },
              //     hr: {
              //         borderColor: '#8C8D8E',
              //         width: '100%',
              //         borderWidth: 1,
              //         height: 0
              //     },
              //     b: {
              //         color: '#4C5058',
              //         fontSize: 14,
              //         fontWeight: 'bold',
              //         lineHeight: 33
              //     },
              //     per: {
              //         color: '#fff',
              //         backgroundColor: '#4C5058',
              //         padding: [3, 4],
              //         borderRadius: 4
              //     }
              // }
            },
            data: [
              { value: 1048, name: 'A' },
              { value: 335, name: 'B' },
              { value: 310, name: 'C' },
              { value: 251, name: 'D' },
              { value: 234, name: 'E' },
              { value: 147, name: 'F' },
              { value: 135, name: 'G' },
              { value: 102, name: 'H' }
            ]
          }
        ]
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
