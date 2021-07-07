import React, { useEffect, useRef } from 'react';
import CLN from 'classnames';
import { IChartsElement } from '@reducer/editor';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart
  // MapChart,
  // TreeChart,
  // TreemapChart,
  // GraphChart,
  // GaugeChart,
  // FunnelChart,
  // ParallelChart,
  // SankeyChart,
  // BoxplotChart,
  // CandlestickChart,
  // EffectScatterChart,
  // LinesChart,
  // HeatmapChart,
  // PictorialBarChart,
  // ThemeRiverChart,
  // SunburstChart,
  // CustomChart,
} from 'echarts/charts';
import {
  // GridSimpleComponent,
  GridComponent,
  // PolarComponent,
  // RadarComponent,
  // GeoComponent,
  // SingleAxisComponent,
  // ParallelComponent,
  // CalendarComponent,
  // GraphicComponent,
  ToolboxComponent,
  TooltipComponent,
  AxisPointerComponent,
  // BrushComponent,
  TitleComponent,
  // TimelineComponent,
  // MarkPointComponent,
  // MarkLineComponent,
  // MarkAreaComponent,
  LegendComponent,
  LegendScrollComponent,
  LegendPlainComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  VisualMapComponent,
  // VisualMapContinuousComponent,
  // VisualMapPiecewiseComponent,
  // AriaComponent,
  // TransformComponent,
  DatasetComponent
} from 'echarts/components';
// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import {
  CanvasRenderer
  // SVGRenderer,
} from 'echarts/renderers';
import S from './index.less';

interface IProps {
  className?: string;
  element: IChartsElement;
}
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  VisualMapComponent,
  BarChart,
  RadarChart,
  ScatterChart,
  ToolboxComponent,
  LineChart,
  PieChart,
  CanvasRenderer,
  DatasetComponent
]);
const Component = (props: IProps) => {
  const { className, element } = props;
  const ref = useRef(null);
  useEffect(() => {
    (ref.current as any).getEchartsInstance().setOption(element.options);
    console.log(element.options);
  });
  return (
    <div className={CLN(S['container'], className)} id="main">
      <ReactEChartsCore
        echarts={echarts}
        ref={ref}
        option={element.options}
        notMerge={false}
        lazyUpdate={false}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default Component;
