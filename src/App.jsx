import React from 'react';
import { scaleLinear, scaleBand, extent, line, symbol, csv, groupSort, scaleOrdinal, sort } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { Bar, BarStack, Circle, LinePath } from "@visx/shape";
import airlineSafety from "./airline-safety";
import { LinearGradient } from "@visx/gradient";
import { LegendOrdinal, LegendLabel, LegendItem } from "@visx/legend";
import { BoxPlot } from "@visx/stats";


function App() {
  const chartSize = 500;
  const margin = 30;
  const data = airlineSafety;
  const width = 500;
  const height = 300;
  
    // Graph 1 for Have airlines gotten safer in the past 30 years? Bar chart
    const timePeriodsIncidents = [{"Period": "1985-1999", "Incidents": 402}, {"Period": "2000-2014", "Incidents": 231}]
    const x1 = (d) => d.Period;
    const y1 = (d) => d.Incidents;
    const xMax1 = width - 80;
    const yMax1 = height - 80;
    const xScale1 = scaleBand()
      .rangeRound ([0, xMax1])
      .domain (timePeriodsIncidents.map(x1))
      .padding (0.4);
    const yScale1 = scaleLinear()
      .rangeRound([0, yMax1])
      .domain([Math.max(...timePeriodsIncidents.map(y1)), 0]);
    
    // Graph 2 Scale for Do first world country airlines experience less crashes? Bar chart
    const airlinesIncidentsTop = {}
    for (var i = 0; i < data.length; i++) {
      var airlineName = data[i].airline
      var incidentTotal = data[i].incidents_85_99 + data[i].incidents_00_14
      if (incidentTotal >= 15) {
        airlinesIncidentsTop[airlineName] = incidentTotal
      }
    }
    const keys = Object.keys(airlinesIncidentsTop); // x-axis data
    const values = [] // y-axis data
    const airlineCrashes = [] // Data used
    for (var i = 0; i < keys.length; i++) {
      values.push(airlinesIncidentsTop[keys[i]])
      airlineCrashes.push({
        'Airline': keys[i],
        'totalCrashes': values[i]
      })
    }
    var empty = ''
    const ticks = []
    for (var i = 0; i < 11; i++) {
      empty += ' '
      ticks[i] = empty
    }
    const x2 = (d) => d.Airline;
    const y2 = (d) => d.totalCrashes;
    const xMax2 = width - 80;
    const yMax2 = height - 80;
    const xScale2 = scaleBand()
      .rangeRound ([0, xMax2])
      .domain (airlineCrashes.map(x2))
      .padding (0.4);
    const yScale2 = scaleLinear()
      .rangeRound([0, yMax2])
      .domain([Math.max.apply(Math, values), 0]);

    // Graph 3 Stacked bar chart
    const legendGlyphSize = 20;
    const green2 = "#0b2345";
    const green1 = "#3a956c";
    const dates = "1985-1999" | "2000-2014"
    const safetyImprove = [ // data
      {
        "Airline": 'China Airlines',
        "1985-99 Fatalities": 310,
        "2000-14 Fatalities": 225
      },
      {
        "Airline": 'Japan Airlines',
        "1985-99 Fatalities": 520,
        "2000-14 Fatalities": 0
      },
      {
        "Airline": 'Korean Airlines',
        "1985-99 Fatalities": 425,
        "2000-14 Fatalities": 0
      },
      {
        "Airline": 'Delta / Northwest*',
        "1985-99 Fatalities": 356,
        "2000-14 Fatalities": 51
      },
      {
        "Airline": 'Air India',
        "1985-99 Fatalities": 171,
        "2000-14 Fatalities": 158
      },
    ]
    const datePeriods = ["2000-14 Fatalities", "1985-99 Fatalities"] //key
    const defaultMargin = { top: 50, right: 40, bottom: 100, left: 100 };
    const getAirline = (d) => d.Airline;
    const xMax3 = width - 80;
    const yMax3 = height - 80;

    const airlineScale = scaleBand()
      .domain (safetyImprove.map(getAirline))
      .padding (0.2)
      .rangeRound([0, xMax3]);
  
    const fatalityScale = scaleLinear()
      .domain([0, 600])
      .range([yMax3, 0])
    
    const colorScale = scaleOrdinal()
      .domain (datePeriods)
      .range([green1, green2])

    // Graph 4 scaterplot chart
    const xMax4 = width - 80;
    const yMax4 = height - 80;
    const kmFlown = []
    for(var i = 0; i < data.length; i++) {
      var km = data[i].avail_seat_km_per_week/ 100000000
      kmFlown.push(Math.round(km))
    }
    const crashesTotal = []
    
    console.log(kmFlown)
    const circleData = []
    for(var i = 0; i < data.length; i++) {
      var first = data[i].incidents_85_99
      var second = data[i].incidents_00_14
      crashesTotal.push(first + second)
      circleData.push({
        'KM': kmFlown[i],
        'CrashTotal': crashesTotal[i]
      })
    }
    console.log(crashesTotal)
    const key2 = ['KM', 'CrashTotal']
    const getKM = (d) => d.KM;
    const getTotal = (d) => d.CrashTotal;
    const crashScale = scaleLinear()
      .rangeRound([12, xMax4])
      .domain ([0, Math.max.apply(Math, crashesTotal)])
      .nice (true)

    const kmScale = scaleLinear()
      .rangeRound([yMax4, 0])
      .domain ([0, Math.max.apply(Math, kmFlown)])
      .nice(true)

    //y = 0.4357x + 5.271
    // trend line equation
    const trendLineData = [
      [0, 8.0638],
      [10, 13.1798],
      [20, 18.2958],
      [30, 23.4118],
      [40, 28.5278],
      [50, 33.6438],
      [60, 38.7598],
      [70, 43.8758],
      [80, 48.9918],
      [90, 54.1078]
    ]
    const getX = d => d[0];
    const getY = d => d[1];
    const xs = trendLineData.map(getX);
    const ys = trendLineData.map(getY);
    const xScale = scaleLinear()
      .domain([0, Math.max(...xs)])
      .range ([12, xMax4])
    
    const yScale = scaleLinear()
      .domain ([0, Math.max(...ys)])
      .range ([yMax4 + 5, 75])
    const xTrend = d => xScale(getX(d));
    const yTrend = d => yScale(getY(d));
   
    
    // Graph 5 Scatter Plot
    const xMax5 = width - 80;
    const yMax5 = height - 80;
    const fatal19 = []
    const fatal00 = []
    const incidentCircleData = []
    for(var i = 0; i < data.length; i++) {
      fatal19.push(data[i].incidents_85_99)
      fatal00.push(data[i].incidents_00_14)
      incidentCircleData.push({
        'incident1985_99': data[i].incidents_85_99,
        'incident2000_14': data[i].incidents_00_14
      })
    }

    const incidentOneScale = scaleLinear()
      .rangeRound([12, xMax5])
      .domain ([0, Math.max.apply(Math, fatal19)])
      .nice (true)

    const incidentTwoScale = scaleLinear()
      .rangeRound([yMax5, 0])
      .domain ([0, Math.max.apply(Math, fatal00)])
      .nice(true)
    
      
    //y = 0.166x + 2.9335
    // trend line equation
    const trendLineData2 = [
      [0, 2.9335],
      [10, 4.5935],
      [20, 6.2535],
      [30, 7.9135],
      [40, 9.5735],
      [50, 11.2335],
      [60, 12.8935],
      [70, 14.5535],
      [80, 16.2135],
      [90, 17.8735]
    ]
    const getX2 = d => d[0];
    const getY2 = d => d[1];
    const xs2 = trendLineData2.map(getX2);
    const ys2 = trendLineData2.map(getY2);
    const xScaleTrend = scaleLinear()
      .domain([0, Math.max(...xs2)])
      .range ([12, xMax4])
    
    const yScaleTrend = scaleLinear()
      .domain ([0, Math.max(...ys2)])
      .range ([yMax4, 145])
    const xTrend2 = d => xScaleTrend(getX2(d));
    const yTrend2 = d => yScaleTrend(getY2(d));

    // Last chart 6
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
      <h2>Have airlines gotten safer in the past 30 years?</h2>
      <h4>From the graph, we can see that, since 1999, airline safety has improved by a significant margin. 
        In the time period from 2000-2014, airlines in total had 171 less accidents than in the previous 15 years.</h4>
      <div style={{ display: "flex" }}>
      <svg width={width} height={height}>
      <LinearGradient from={`#e9e9e9`} to={`#fff`} id={`gradientFill`} />
      <rect width={width} height={height} fill={`url(#gradientFill)`} rx={5} />
      <Group top={25} left={55}>
        <AxisLeft left={10} scale={yScale1} numTicks={4} label="Incidents" />
        {timePeriodsIncidents.map((d, i) => {
          const period = x1(d);
          const barWidth = xScale1.bandwidth();
          const barHeight = yMax1 - yScale1(y1(d));
          const barX = xScale1(period);
          const barY = yMax1 - barHeight;
          return [<Bar key={`bar-${period}`} x={barX} y={barY} width={barWidth} height={barHeight} fill="red"/>, 
          <text x={105} y={100} fontSize={25} fontWeight={ 'bold' }>402</text>, <text x={278} y={155} fontSize={25} fontWeight={ 'bold' }>231</text>];
        })}
        <AxisBottom scale={xScale1} label="Period" labelOffset={15} top={yMax1} />
      </Group>
    </svg>
      </div>
      <h2>Do first or third world country airlines experience more crashes?</h2>
      <h4>From the graph, we can see that first world countries actually tend to have more crashes than third world countries. 
        Out of all airlines averaging a greater than avergage crash count from 1985-2014, 6 out of the 11 airlines are 
        from first world countries, with 3 out of the 6 being airlines based in America.</h4>
      <h2>Do some countries tend to have airline accidents more often?</h2>
      <h4>From the chart, we can see that, for airlines averaging a greater than avergage crash count, 3 out of the 11 listed airlines
        are based in America. Additionally, Aeroflot, a Russian based airline, had a significantly higher incident count than any other airline during that 30 year period. 
        Therefore, within the 30 year period from 1985-2014, airlines based in America and Russia tended to experince accidents
        more often than other countries.
      </h4>
      <h7>Average incident count from 1985-2014: 14</h7>
      <div style={{ display: "flex" }}>
      <svg width={width} height={height + 115}>
      <LinearGradient from={`#e9e9e9`} to={`#fff`} id={`gradientFill`} />
      <rect width={width} height={height + 150} fill={`url(#gradientFill)`} rx={5} />
      <Group top={25} left={55}>
        <AxisLeft left={10} scale={yScale2} numTicks={7} label="Crashes"/>
        {airlineCrashes.map((d, i) => {
          const airline = x2(d);
          const barWidth = xScale2.bandwidth(); 
          const barHeight = yMax2 - yScale2(y2(d));
          const barX = xScale2(airline); 
          const barY = yMax2 - barHeight; 
          return [
          <Bar key={`bar-${airline}`} x={barX} y={barY} width={barWidth} height={barHeight} fill="purple"/>,
          <text id='rotate' x={-325} y={32} fontFamily='sans-serif'>Pakistan International</text>,
          <text id='rotate' x={-308} y={70} fontFamily='sans-serif'>Ethiopian Airlines</text>, 
          <text id='rotate' x={-298} y={105} fontFamily='sans-serif'>Saudia Arabian</text>, 
          <text id='rotate' x={-270} y={142} fontFamily='sans-serif'>Aeroflot*</text>, 
          <text id='rotate' x={-252} y={178} fontFamily='sans-serif'>Tam</text>, 
          <text id='rotate' x={-300} y={214} fontFamily='sans-serif'>Turkish Airlines</text>, 
          <text id='rotate' x={-351} y={250} fontFamily='sans-serif'>US Airways / America West</text>, 
          <text id='rotate' x={-277} y={285} fontFamily='sans-serif'>Air France</text>, 
          <text id='rotate' x={-277} y={322} fontFamily='sans-serif'>American*</text>, 
          <text id='rotate' x={-313} y={357} fontFamily='sans-serif'>Delta / Northwest*</text>, 
          <text id='rotate' x={-320} y={395} fontFamily='sans-serif'>United / Continental</text>,
          <text x={65} y={370} fontSize={10} fontFamily='sans-serif'>Airlines With Total Carshes Above The Average(14) From 1985-2014 </text>
        ]
        })}
        <AxisBottom scale={xScale2} labelOffset={15} top={yMax2} tickValues={ticks} hideTicks/>
      </Group>
    </svg>
      </div>
      <h2>Has the safety quality of the top 5 most fatal airlines from 1985-1999 improved by a significant margin since then?</h2>
      <h4>Out of the top 5 airlines with the most fatalities from 1985-1999, Japan Airlines, Korean Airlines, and Delta / Northwest improved by the
        greatest margin. All 3 airlines had a 2000-2014 fatality count less than a quarter of their fatality count from 1985-1999. On the other hand,
        China Airlines and Air India from 2000-2014 had a fatility count roughly equivalent to half of their 1985-1999 fatality count.
      </h4>
      <h7>(Significant improvement implies a 2000-2014 fatality count less than a quarter of that airlines fatality count from 1985-1999)</h7>
      <div style={{ display: "flex" }}>
      <svg width={width} height={height + 50}>
      <LinearGradient from={`#e9e9e9`} to={`#fff`} id={`gradientFill`} />
      <rect width={width} height={height} fill={`url(#gradientFill)`} rx={5} />
      <Group left={defaultMargin.left} top={defaultMargin.top}>
      <AxisLeft
            scale={fatalityScale} 
            numTicks={5}
            tickLength={10} 
            strokeWidth={2}
            labelOffset={40}
            label="Fatality Count"
          />
          <AxisBottom
            top={yMax3}
            scale={airlineScale}
            label="Airlines"
          />
      <BarStack
        data={safetyImprove}
        keys={datePeriods}
        x={getAirline}
        xScale={airlineScale}
        yScale={fatalityScale}
        color={colorScale}
      ></BarStack>
      </Group>
    </svg>
    <div>
    <LegendOrdinal scale={colorScale} direction="row">
          {(labels) =>
            labels.map((label, i) => (
              <LegendItem>
                <svg
                  width={legendGlyphSize}
                  height={legendGlyphSize}
                  style={{ margin: "0 2px 0 20px" }}
                >
                  <circle
                    fill={label.value}
                    r={legendGlyphSize / 2}
                    cx={legendGlyphSize / 2}
                    cy={legendGlyphSize / 2}
                  />
                </svg>
                <LegendLabel align="left" margin="0 8px">
                  {label.text}
                </LegendLabel>
              </LegendItem>
            ))
          }
        </LegendOrdinal>
    </div>
      </div>
      <h2>Is there a relationship between total KM flown by an airline and crash count?</h2>
      <h4>Although every kilometer flown runs the risk of a crash ocurring, from the data, there is no direct correlation between
        the weekly KM flown by an airline and crash count. We can see that points with a lower weekly KM flown and lower crash count from
        1985-2014 congregated around the beginning of the trend line but this is not telling of the full story. Based on the R² value of the trend line, there
        is a very loose, almost negligible, relationship/correlation between the weekly KM flown by an airline and crash count for the thirty year period,
        meaning the trend line is not fully representative of the data. 
      </h4>
      <h7>(Possible correlation, if and only if, R² >= 0.5)</h7>
      <div style={{ display: "flex" }}>
      <svg width={width} height={height}>
      <LinearGradient from={`#e9e9e9`} to={`#fff`} id={`gradientFill`} />
      <rect width={width} height={height} fill={`url(#gradientFill)`} rx={5} />
      <Group top={25} left={55}>
        <AxisLeft left={10} scale={kmScale} label="KM Flown Per Week (Hundred Millions)"/>
        {circleData.map((d, i) => {
          return (
            <Circle
              key={i}
              cx={crashScale(d.CrashTotal)}
              cy={kmScale(d.KM)}
              r={3}
              style={{ stroke: "Black", fill: "none" }}
            />
          )

        })}
        <LinePath
        data={trendLineData}
        x={xTrend}
        y={yTrend}
        stroke="red"
        strokeWidth={2}
        shapeRendering="geometricPrecision"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
        <text x={250} y={90}>R² = 0.2229</text>
        <AxisBottom scale={crashScale} label="Total Crashes 1985-2014" labelOffset={15} top={yMax4} hideZero={true}/>
      </Group>
    </svg>
    </div>
    <h2>Is there a correlation between the accident count from one period to the next? (1985-1999 and 2000-2014)</h2>
    <h4>There is no correlation between the accident count from one period to the next. Although airlines with lower crash counts in both periods
      congregated around the beginning of the trend line, again, this is not telling of the full story. The R² value of the trend line indicates that
      there is a very small and practically negligible correlation between both varibles. The trend line is not an accurate representation of the data, 
      meaning that the crash count during a given 15 years time period is an unsuitable varibale to use to predict the crash count for another or following time period. Therefore, the crash count from one period is not indicitve
      of the crash count for another. Crash count, within a certain 15 year time range, is based more on improved airline safety quality than the crash count from
      the previous 15 years.
    </h4>
    <h7>(Possible correlation, if and only if, R² >= 0.5)</h7>
      <div style={{ display: "flex" }}>
      <svg width={width} height={height}>
      <LinearGradient from={`#e9e9e9`} to={`#fff`} id={`gradientFill`} />
      <rect width={width} height={height} fill={`url(#gradientFill)`} rx={5} />
      <Group top={25} left={55}>
        <AxisLeft left={10} scale={incidentTwoScale} label="2000-2014 Airline Incident Count"/>
        {incidentCircleData.map((d, i) => {
          return (
            <Circle
              key={i}
              cx={incidentOneScale(d.incident1985_99)}
              cy={incidentTwoScale(d.incident2000_14)}
              r={3}
              style={{ stroke: "Black", fill: "none" }}
            />
          )
        })}
        <LinePath
        data={trendLineData2}
        x={xTrend2}
        y={yTrend2}
        stroke="red"
        strokeWidth={2}
        shapeRendering="geometricPrecision"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />

        <AxisBottom scale={incidentOneScale} label="1985-1999 Airline Incident Count" labelOffset={15} top={yMax4} hideZero={true}/>
        <text x={200} y={160}>R² = 0.1624</text>
      </Group>
    </svg>
    </div>
    
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
            />
          )
        })}
      <AxisBottom scale={xScaleBox} label="Time Period" labelOffset={15} top={yMax4} hideZero={true}/>
      </Group>
    </svg>
    <div style={{border: "solid", height: 250, width: 130}}>
            <h3 style={{textAlign: 'Center'}}>1985-1999</h3>
            Max: 14
            <br></br>
            Third Quartile: 3
            <br></br>
            Median: 1
            <br></br>
            First Quartile: 0
            <br></br>
            Min: 0
         </div>
    <div style={{border: "solid", height: 250, width: 130}}>
            <h3 style={{textAlign: 'Center'}}>2000-2014</h3>
            Max: 3
            <br></br>
            Third Quartile: 1
            <br></br>
            Median: 0
            <br></br>
            First Quartile: 0
            <br></br>
            Min: 0
      </div>
    </div>
    </div>
  );
}
export default App;