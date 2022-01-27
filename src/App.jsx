import { scaleLinear, scaleBand, extent, line, symbol, csv } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { LegendThreshold } from '@visx/legend';
import census from "./census";

function App() {
  const chartSize = 500;
  const margin = 30;
  const legendPadding = 200;
  const populations = []
  for(var i = 0; i < census.length; i++) {
    populations.push(census[i].People/ 1000000)
  }
  const _extent = extent(populations);
  const _scaleY = scaleLinear()
    .domain([0, _extent[1]])
    .range([chartSize - margin, margin]);
  const _scaleLine = scaleLinear()
    .domain([0, 11])
    .range([margin, chartSize - margin]);
  const ageGroups = [
    0,
    5,
    10,
    15,
    20,
    25,
    30,
    35,
    40,
    45,
    50,
    55,
    60, 
    65,
    70,
    75,
    80, 
    85, 
    90
  ];
  const _scaleAge = scaleBand()
    .domain(ageGroups)
    .range([0, 750]);
  const dataByGender = {"Male 2000": [], "Female 2000": [], "Male 1900": [], "Female 1900": []};
  for(var i = 0; i < census.length; i++) {
    if(census[i].Year == 2000) {
      if(census[i].Sex == 1) {
        dataByGender["Male 2000"].push(census[i].People / 1000000)
      } else {
        dataByGender["Female 2000"].push(census[i].People / 1000000) 
      }
    } else {
      if(census[i].Sex == 1) {
        dataByGender["Male 1900"].push(census[i].People / 1000000)
      } else {
        dataByGender["Female 1900"].push(census[i].People / 1000000) 
      }
    }
  }
  const genders = ["Male 2000", "Female 2000", "Male 1900", "Female 1900"]
  const _lineMaker = line()
    .x((d, i) => {
      return _scaleLine(i + 0.65);
    })
    .y((d) => {
      return _scaleY(d);
    });
  

  return (
    <div style={{ margin: 50 }}>
      <h1>Age Group Population Male and Female (1900 vs 2000)</h1>
      <h2>Although population has increased significantly overall between 1900 (bottom) </h2>
      <h2>and 2000 (top), why has the male and female population diverged?</h2>
      <div style={{ display: "flex" }}>
        <svg
          width={chartSize + 285}
          height={chartSize + 20}
        >
        <AxisLeft 
          strokeWidth={2} 
          left={margin + 25}
          right={margin} 
          scale={_scaleY} 
          label="Population Total in Millions"
          labelProps={{
            fontSize:15
          }}
          />
          <AxisBottom
            strokeWidth={2}
            top={chartSize - margin + 5}
            left={margin + 11}
            scale={_scaleAge}
            tickValues={ageGroups}
            label="Age Categories"
            labelProps={{
              fontSize:15
            }}
          />
          <text x={400} y={380} fill={'black'} fontWeight={'bold'} fontSize={20}>1900</text>
          <text x={450} y={100} fill={'black'} fontWeight={'bold'} fontSize={20}>2000</text>
          {genders.map((gender, i) => {
            return (
              <path
                stroke={"Black"}
                strokeWidth={2}
                fill="none"
                key={gender}
                d={_lineMaker(dataByGender[gender])}
                strokeDasharray={gender === "Female 2000" || gender === "Female 1900" ? 5:0}
              />
            );
          })}
          
        </svg>
        <div style={{border: "solid", height: 250, width: 100, textAlign: 'center'}}>
          <h2>Legend</h2>
            Female:
            <h3>----------</h3>
            Male:
            <h3>━━━━</h3>
         </div>
      </div>
    </div>
  );
}
export default App;