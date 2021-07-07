import React, { useEffect, useRef, useState } from 'react';
import CLN from 'classnames';
import { connect } from 'react-redux';
import Icon from '@components/Icon';
import { setDragLock, setToolSelectId } from '@action/editor';
import {
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  RadarChartOutlined,
  DotChartOutlined,
  AreaChartOutlined
} from '@ant-design/icons';
import store, { IState } from '@/reducer';
import { hasChildren } from '@/utils/tool';
import S from './index.less';
import ToolS from '../index.less';
import LineCharts from './LineCharts';
import PieCharts from './PieCharts';
import BubbleCharts from './BubbleCharts';
import RaderCharts from './RaderCharts';
import BarCharts from './BarCharts';

interface IProps {
  className?: string;
  tool?: IState['editor']['tool'];
}

const Component = (props: IProps) => {
  const { className, tool } = props;
  const [chartId, setChartId] = useState(0);
  const ref = useRef(null);
  // const [show, setShow] = useState(false);
  const id = 4;
  const name = 'chartsControl';
  const chartsList = [
    {
      id: 0,
      icon: <BarChartOutlined />,
      title: '柱状图',
      chart: <BarCharts></BarCharts>
    },
    {
      id: 1,
      icon: <LineChartOutlined />,
      title: '折线图',
      chart: <LineCharts></LineCharts>
    },
    {
      id: 2,
      icon: <PieChartOutlined />,
      title: '饼图',
      chart: <PieCharts></PieCharts>
    },
    {
      id: 3,
      icon: <RadarChartOutlined />,
      title: '散点图',
      chart: <BubbleCharts></BubbleCharts>
    },
    {
      id: 4,
      icon: <DotChartOutlined />,
      title: '雷达图',
      chart: <RaderCharts></RaderCharts>
    }
  ];
  useEffect(() => {}, [tool?.selectId]);
  return (
    <li
      className={CLN(
        S['container'],
        { [ToolS['active']]: tool?.selectId == id },
        className
      )}
      onClick={() => {
        setToolSelectId(id);
        $('body')
          .off('click')
          .on('click', event => {
            const target = event.target;
            if (!hasChildren(ref.current, target)) {
              setToolSelectId(0);
              $('body').off('click');
            }
          });
      }}
    >
      <AreaChartOutlined />
      {tool?.selectId == id && (
        <div className={S['downList']} ref={ref}>
          <ul className={S['menu']}>
            {chartsList.map(item => {
              return (
                <li
                  className={CLN(S['item'], {
                    [S['active']]: item.id == chartId
                  })}
                  key={item.id}
                  title={item.title}
                  onClick={() => {
                    setChartId(item.id);
                  }}
                >
                  {item.icon}
                </li>
              );
            })}
          </ul>
          {chartsList[chartId].chart}
        </div>
      )}
    </li>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    tool: state.editor.tool
  };
};

export default connect(mapStateToProps)(Component);
