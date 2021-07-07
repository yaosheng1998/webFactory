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
      image: 'BarCharts/bar1.jpg',
      chartsMark: 'barCharts1',
      options: {
        title: {
          show: true,
          text: '基础柱状图',
          textStyle: {
            fontSize: 18
          }
        },
        xAxis: {
          type: 'category',
          data: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          axisLabel: {
            textStyle: {
              fontSize: 12
            }
          }
        },
        grid: { left: 30, top: 40, right: 0, bottom: 30 },
        tooltip: {
          show: false,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: false
            },
            lineStyle: {
              width: 1
            }
          }
        },
        legend: {
          show: false,
          data: []
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              fontSize: 12
            }
          }
        },
        series: []
      },
      title: {
        show: true,
        content: '基础柱状图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      tooltip: {
        show: false,
        trigger: 'axis',
        lineWidth: 1,
        axisPointerType: 'shadow',
        axisPointerLabel: false
      },
      grid: { left: 30, top: 40, right: 0, bottom: 30 },
      legend: {
        show: true
      }
    },
    {
      id: 1,
      chartsMark: 'barCharts2',
      title: {
        show: true,
        content: '瀑布图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      tooltip: {
        show: false,
        trigger: 'axis',
        lineWidth: 1,
        axisPointerType: 'shadow',
        axisPointerLabel: false
      },
      grid: { left: 30, top: 40, right: 0, bottom: 30 },
      legend: {
        show: true
      },
      image: 'BarCharts/bar2.jpg',
      options: {
        title: {
          text: '瀑布图',
          textStyle: {
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params: any) {
            var tar = params[1];
            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
          }
        },
        grid: {
          left: 30,
          top: 40,
          right: 0,
          bottom: 30
        },
        xAxis: {
          type: 'category',
          splitLine: { show: false },
          data: ['总费用', '房租', '水电费', '交通费', '伙食费', '日用品数'],
          axisLabel: {
            textStyle: {
              fontSize: 12
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              fontSize: 12
            }
          }
        },
        series: [
          {
            name: '辅助',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            },
            emphasis: {
              itemStyle: {
                barBorderColor: 'rgba(0,0,0,0)',
                color: 'rgba(0,0,0,0)'
              }
            },
            data: [0, 1700, 1400, 1200, 300, 0]
          },
          {
            name: '生活费',
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              position: 'inside'
            },
            data: [2900, 1200, 300, 200, 900, 300]
          }
        ]
      }
    },
    {
      id: 2,
      title: {
        show: true,
        content: '交错正负柱状图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      chartsMark: 'barCharts3',
      image: 'BarCharts/bar3.jpg',
      options: {
        title: {
          // text: '交错正负轴标签',
          // subtext: 'From ExcelHome',
          // sublink: 'http://e.weibo.com/1341556070/AjwF2AgQm'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: 30,
          top: 40,
          right: 10,
          bottom: 30
        },
        xAxis: {
          type: 'value',
          position: 'top',
          splitLine: {
            lineStyle: {
              // type: 'dashed'
            }
          },
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        yAxis: {
          type: 'category',
          axisLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          data: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
        },
        series: [
          {
            name: '生活费',
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              formatter: '{b}',
              textStyle: {
                fontSize: 14
              }
            },
            data: [
              { value: -7, label: 'right' },
              { value: -9, label: 'right' },
              2,
              4,
              { value: 2, label: 'right' },
              8,
              { value: -7, label: 'right' },
              4,
              { value: -6, label: 'right' },
              8
            ]
          }
        ]
      }
    },
    {
      id: 3,
      title: {
        show: true,
        content: '横向条形图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      chartsMark: 'barCharts4',
      image: 'BarCharts/bar4.jpg',
      options: {
        // title: {
        //     text: '世界人口总量',
        //     subtext: '数据来自网络'
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['I', 'II'],
          textStyle: {
            color: '#ccc',
            fontSize: 14
          }
        },
        grid: {
          left: 30,
          top: 40,
          right: 10,
          bottom: 30
          // containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        yAxis: {
          type: 'category',
          data: ['A', 'B', 'C', 'D', 'E', 'F'],
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        series: [
          {
            name: 'I',
            type: 'bar',
            data: [182, 234, 290, 1049, 1317, 630]
          },
          {
            name: 'II',
            type: 'bar',
            data: [193, 234, 310, 1215, 1341, 680]
          }
        ]
      }
    },
    {
      id: 4,
      title: {
        show: true,
        content: '堆叠条形图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      chartsMark: 'barCharts5',
      image: 'BarCharts/bar5.jpg',
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {
          data: ['I', 'II', 'III', 'IV', 'V'],
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          left: 30,
          top: 40,
          right: 10,
          bottom: 30
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        yAxis: {
          type: 'category',
          data: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        series: [
          {
            name: 'I',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: 'II',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'III',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: 'IV',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [150, 212, 201, 154, 190, 330, 410]
          },
          {
            name: 'V',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [320, 532, 201, 534, 790, 430, 520]
          }
        ]
      }
    },
    {
      id: 5,
      title: {
        show: true,
        content: '纵向条形图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      chartsMark: 'barCharts6',
      image: 'BarCharts/bar6.jpg',
      options: {
        legend: {
          top: 5,
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: 30,
          top: 30,
          right: 10,
          bottom: 20
          // containLabel: true
        },
        dataset: {
          source: [
            ['product', 'I', 'II', 'III'],
            ['A', 43.3, 85.8, 93.7],
            ['B', 83.1, 73.4, 55.1],
            ['C', 86.4, 65.2, 82.5],
            ['D', 72.4, 53.9, 39.1]
          ]
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
      }
    },
    {
      id: 6,
      title: {
        show: true,
        content: '正负条形图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      chartsMark: 'barCharts7',
      image: 'BarCharts/bar7.jpg',
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['利润', '支出', '收入'],
          textStyle: {
            fontSize: 18
          }
        },
        grid: {
          left: 30,
          top: 40,
          right: 10,
          bottom: 30
        },
        xAxis: [
          {
            type: 'value',
            axisLabel: {
              textStyle: {
                fontSize: 14
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                fontSize: 14
              }
            },
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        series: [
          {
            name: '利润',
            type: 'bar',
            label: {
              show: true,
              position: 'inside',
              fontSize: 14
            },
            emphasis: {
              focus: 'series'
            },
            data: [200, 170, 240, 244, 200, 220, 210]
          },
          {
            name: '收入',
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              fontSize: 14
            },
            emphasis: {
              focus: 'series'
            },
            data: [320, 302, 341, 374, 390, 450, 420]
          },
          {
            name: '支出',
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              position: 'inside',
              fontSize: 14
            },
            emphasis: {
              focus: 'series'
            },
            data: [-120, -132, -101, -134, -190, -230, -210]
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
                    chartsMark: item.chartsMark,
                    options: item.options,
                    title: item.title,
                    grid: item.grid,
                    tooltip: item.tooltip
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
