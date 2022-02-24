import React from 'react';
import { scaleLinear, scaleBand } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { LinearGradient } from "@visx/gradient";
import { BoxPlot } from "@visx/stats";
import {
  withTooltip,
  Tooltip,
  defaultStyles as defaultTooltipStyles
} from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";

interface TooltipData {
  name?: string;
  min?: number;
  median?: number;
  max?: number;
  firstQuartile?: number;
  thirdQuartile?: number;
}

export type StatsPlotProps = {
  width: number;
  height: number;
};

export default withTooltip<StatsPlotProps, TooltipData>(
  ({
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    showTooltip,
    hideTooltip
  }: StatsPlotProps & WithTooltipProvidedProps<TooltipData>) => {

  const width = 500;
  const height = 300;

    // Last chart 6
    const xMax5 = width - 80;
    const yMax5 = height - 80;
    const boxPlotData = [{
      'x': "1985-1999",
      'min': 0,
      'firstQuartile': 0,
      'median': 1,
      'thirdQuartile': 3,
      'max': 14,
      'outliers': [14, 12, 8, 7, 6, 5, 4]
    }, {
      'x': "2000-2014",
      'min': 0,
      'firstQuartile': 0,
      'median': 0,
      'thirdQuartile': 1,
      'max': 3,
      'outliers': [3]
    }]
    const x = (d) => d.x;
    const min = (d) => d.min;
    const max = (d) => d.max;
    const median = (d) => d.median;
    const firstQuartile = (d) => d.firstQuartile;
    const thirdQuartile = (d) => d.thirdQuartile;
    const outliers = (d) => d.outliers;

    const xScaleBox = scaleBand()
      .range ([0, xMax5])
      .round (true)
      .domain (boxPlotData.map(x))
      .padding (0.4)
    
    const minYValue = 0;
    const maxYValue = 14;

    const yScaleBox = scaleLinear()
      .range ([yMax5, 0])
      .domain ([minYValue, maxYValue])
    
    const boxWidth = xScaleBox.bandwidth();
    const constrainedWidth = Math.min(40, boxWidth);
    
  return (
    <div style={{ margin: 100 }}>
    <h2>What is the distribution of accidents during 1985-1999 and 2000-2014 that resulted in fatalities?</h2>
    <h4>As seen by their respective box heights, data for accidents that resulted in fatalities in 1985-1999 is significantly more dispersed than the data from 2000-2014. 
      Also, we can see there are no obvious outliers in either period. In terms of distribution, 
      data for accidents that resulted in fatalities from 1985-1999 had a more symmetric distribution (median is set between the first and third quartile) than the data from 2000-2014,
      which had a right-skewed distribution (median is set closer to the first quartile).
    </h4>
    <h2>Which period had more accidents result in fatalities?</h2>
    <h4>In general, it can be seen that more accidents would result in fatalities from 1985-1999 than from 2000-2014. In 1985-1999, 
      most airlines in the distribution would have at least one accident result in fatalities and airlines in the upper quartile would
      have about three of their accidents during the 15 year period result in fatalities. On the other hand, from 2000-2014, most airlines
      in the distribution would have none of their accidents during the 15 year period lead to fatalities and airlines in the upper quartile
      would have about one of their accidents result in fatalities. In both time periods, airlines in the lower quartile had none of their
      accidents result in fatalities. Therefore, the 15 year period from 1985-1999 experinced more accidents that resulted in fatalities than
      in 2000-2014.
    </h4>
    <h4></h4>
      <div style={{ display: "flex" }}>
      <svg width={width} height={height}>
      <LinearGradient from={`#e9e9e9`} to={`#fff`} id={`gradientFill`} />
      <rect width={width} height={height} fill={`url(#gradientFill)`} rx={5} />
      <Group top={25} left={55}>
      <AxisLeft left={10} scale={yScaleBox} label="Fatal Accident Count"/>
      {boxPlotData.map((d) => {
          return (
            <BoxPlot
            min={min(d)}
            max={max(d)}
            left={xScaleBox(x(d)) + 37}
            stroke="Black"
            firstQuartile={firstQuartile(d)}
            thirdQuartile={thirdQuartile(d)}
            median={median(d)}
            boxWidth={constrainedWidth * 0.75}
            fillOpacity={0.3}
            strokeWidth={1}
            valueScale={yScaleBox}
            outliers={outliers(d)}
            boxProps={{
              onMouseOver: () => {
                showTooltip({
                  tooltipTop: yScaleBox(median(d) - 20) ?? 0 + 40,
                  tooltipLeft: xScaleBox(x(d))! + constrainedWidth + 190,
                  tooltipData: {
                    name: x(d),
                    min: min(d),
                    max: max(d),
                    median: median(d),
                    firstQuartile: firstQuartile(d),
                    thirdQuartile: thirdQuartile(d)
                  }
                });
              },
              onMouseLeave: () => {
                hideTooltip();
              }
            }}
            />
          )
        })}
      <AxisBottom scale={xScaleBox} label="Time Period" labelOffset={15} top={yMax5} hideZero={true}/>
      </Group>
    </svg>
    {tooltipOpen && tooltipData && (
          <Tooltip
            top={tooltipTop}
            left={tooltipLeft}
            style={{
              ...defaultTooltipStyles,
              backgroundColor: "#283238",
              color: "white"
            }}
          >
            <div>
              <strong>{tooltipData.name}</strong>
            </div>
            <div style={{ marginTop: "5px", fontSize: "12px" }}>
              <div>Max: {tooltipData.max}</div>
             
              <div>Third Quartile: {tooltipData.thirdQuartile}</div>
              
              <div>Median: {tooltipData.median}</div>
              
              <div>First Quartile: {tooltipData.firstQuartile}</div>
              
              <div>Min: {tooltipData.min}</div>
            </div>
          </Tooltip>
        )}
    </div>
    </div>
  );
  })