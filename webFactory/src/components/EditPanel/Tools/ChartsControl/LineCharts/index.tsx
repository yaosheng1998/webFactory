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
      image: 'LineCharts/line1.jpg',
      options: {
        title: {
          show: true,
          text: '基础折线图',
          textStyle: {
            fontSize: 12
          }
        },
        xAxis: {
          type: 'category',
          data: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        tooltip: {
          trigger: 'axis'
          // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          //     type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          // }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line',
            lineStyle: {
              width: 5
            }
          }
        ],
        grid: { left: 30, top: 40, right: 0, bottom: 30 }
      },
      title: {
        show: true,
        content: '基础折线图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      grid: { left: 30, top: 40, right: 0, bottom: 30 }
    },
    {
      id: 1,
      title: {
        show: true,
        content: '基础平滑折线图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      image: 'LineCharts/line2.jpg',
      options: {
        xAxis: {
          type: 'category',
          data: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        tooltip: {
          trigger: 'axis'
          // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          //     type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          // }
        },
        grid: { left: 30, top: 40, right: 0, bottom: 30 },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 5
            }
          }
        ]
      }
    },
    {
      id: 2,
      icon: '',
      title: {
        show: true,
        content: '基础面积图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      image: 'LineCharts/line3.jpg',
      options: {
        xAxis: {
          type: 'category',
          data: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        grid: { left: 30, top: 40, right: 0, bottom: 30 },
        tooltip: {
          trigger: 'axis'
          // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          //     type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          // }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true,
            areaStyle: {},
            lineStyle: {
              width: 5
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
        content: '堆叠折现图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      image: 'LineCharts/line4.jpg',
      options: {
        title: {
          // text: '折线图堆叠'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
          textStyle: {
            fontSize: 14
          }
        },
        grid: { left: 30, top: 40, right: 0, bottom: 30 },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            lineStyle: {
              width: 5
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            lineStyle: {
              width: 5
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            lineStyle: {
              width: 5
            },
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '直接访问',
            type: 'line',
            stack: '总量',
            lineStyle: {
              width: 5
            },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            lineStyle: {
              width: 5
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      }
    },
    {
      id: 4,
      icon: '',
      title: {
        show: true,
        content: '堆叠面积图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      image: 'LineCharts/line5.jpg',
      options: {
        title: {
          // text: '折线图堆叠'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
          textStyle: {
            fontSize: 14
          }
        },
        grid: { left: 30, top: 40, right: 0, bottom: 30 },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            lineStyle: {
              width: 5
            },
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            lineStyle: {
              width: 5
            },
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            lineStyle: {
              width: 5
            },
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '直接访问',
            type: 'line',
            stack: '总量',
            lineStyle: {
              width: 5
            },
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            lineStyle: {
              width: 5
            },
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      }
    },
    {
      id: 5,
      icon: '',
      title: {
        show: true,
        content: '阶梯折线图',
        position: 'left',
        fontSize: 18,
        fontWeight: 600,
        fontColor: '#ccc'
      },
      image: 'LineCharts/line6.jpg',
      options: {
        title: {
          // text: 'Step Line'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Step Start', 'Step Middle', 'Step End'],
          textStyle: {
            fontSize: 14
          }
        },
        grid: { left: 30, top: 40, right: 0, bottom: 30 },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              fontSize: 14
            }
          }
        },
        series: [
          {
            name: 'Step Start',
            type: 'line',
            step: 'start',
            lineStyle: {
              width: 5
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Step Middle',
            type: 'line',
            step: 'middle',
            lineStyle: {
              width: 5
            },
            data: [220, 282, 201, 234, 290, 430, 410]
          },
          {
            name: 'Step End',
            type: 'line',
            step: 'end',
            lineStyle: {
              width: 5
            },
            data: [450, 432, 401, 454, 590, 530, 510]
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
