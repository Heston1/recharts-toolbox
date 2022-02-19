import React, { Component } from 'react';
import { ResponsiveContainer, LineChart, ComposedChart , 
  Area, Line, Legend, XAxis, YAxis, CartesianGrid, ReferenceLine,
    Label, LabelList, Brush, ScatterChart, ZAxis, Scatter, Polygon, Rectangle, Customized, ReferenceArea, ReferenceDot, BarChart, Bar, Cell } from 'recharts';
import { Toolkit, ZoomSelect, ZoomIn, ZoomOut, Pan, AutoScale, Reset, Camera, 
  ToolBar, TooltipClosest, TooltipCompare, BoxSelect, LasoSelect,
   DrawTool, Export, ReferenceLines, Ruler, Icons } from 'recharts-toolkit';
import { changeNumberOfData } from './utils';
import * as _ from 'lodash';


const scatter01 = [
  { x: 100, y: 200, z: 200, errorY: [20, 30], errorX: 30 },
  { x: 120, y: 100, z: 260, errorY: 20, errorX: [20, 30] },
  { x: 170, y: 300, z: 400, errorY: [12, 8], errorX: 20 },
  { x: 140, y: 250, z: 280, errorY: 23, errorX: [12, 8] },
  { x: 150, y: 400, z: 500, errorY: [21, 10], errorX: 23 },
  { x: 110, y: 280, z: 200, errorY: 21, errorX: [21, 10] },
];

const scatter02 = [
  { x: 200, y: 260, z: 240 },
  { x: 240, y: 290, z: 220 },
  { x: 190, y: 290, z: 250 },
  { x: 198, y: 250, z: 210 },
  { x: 180, y: 280, z: 260 },
  { x: 210, y: 220, z: 230 },
];


const exampleLineData = [
  { name: 'A', uv: 245, pv: 350, },
  { name: 'B', uv: 480, pv: 300, },
  { name: 'C', uv: 145, pv: 300, },
  { name: 'D', uv: 900, pv: 200, },
  { name: 'E', uv: 375, pv: 240, },
  { name: 'F', uv: 500, pv: 200,},
]

const dataCat = [
  { name: 'Page A', uv: 1000, pv: 2400, amt: 2400, uvError: [75, 20] },
  { name: 'Page B', uv: 300, pv: 4567, amt: 2400, uvError: [90, 40] },
  { name: 'Page C', uv: 280, pv: 1398, amt: 2400, uvError: 40 },
  { name: 'Page D', uv: 200, pv: 9800, amt: 2400, uvError: 20 },
  { name: 'Page E', uv: 278, pv: null, amt: 2400, uvError: 28 },
  { name: 'Page F', uv: 189, pv: 4800, amt: 2400, uvError: [90, 20] },
  { name: 'Page G', uv: 189, pv: 4800, amt: 2400, uvError: [28, 40] },
  { name: 'Page H', uv: 189, pv: 4800, amt: 2400, uvError: 28 },
  { name: 'Page I', uv: 189, pv: 4800, amt: 2400, uvError: 28 },
  { name: 'Page J', uv: 189, pv: 4800, amt: 2400, uvError: [15, 60] },
];

const data01 = [
  { day: '05-01', weather: 'sunny' },
  { day: '05-02', weather: 'sunny' },
  { day: '05-03', weather: 'cloudy' },
  { day: '05-04', weather: 'rain' },
  { day: '05-05', weather: 'rain' },
  { day: '05-06', weather: 'cloudy' },
  { day: '05-07', weather: 'cloudy' },
  { day: '05-08', weather: 'sunny' },
  { day: '05-09', weather: 'sunny' },
];

const data02 = [
  { name: 'Page A', uv: 300, pv: 2600, amt: 3400 },
  { name: 'Page B', uv: 400, pv: 4367, amt: 6400 },
  { name: 'Page C', uv: 300, pv: 1398, amt: 2400 },
  { name: 'Page D', uv: 200, pv: 9800, amt: 2400 },
  { name: 'Page E', uv: 278, pv: 3908, amt: 2400 },
  { name: 'Page F', uv: 189, pv: 4800, amt: 2400 },
  { name: 'Page G', uv: 189, pv: 4800, amt: 2400 },
];

const data03 = [
  { date: 'Jan 04 2016', price: 105.35 },
  { date: 'Jan 05 2016', price: 102.71 },
  { date: 'Jan 06 2016', price: 100.7 },
  { date: 'Jan 07 2016', price: 96.45 },
  { date: 'Jan 08 2016', price: 96.96 },
  { date: 'Jan 11 2016', price: 98.53 },
  { date: 'Jan 12 2016', price: 99.96 },
  { date: 'Jan 13 2016', price: 97.39 },
  { date: 'Jan 14 2016', price: 99.52 },
  { date: 'Jan 15 2016', price: 97.13 },
  { date: 'Jan 19 2016', price: 96.66 },
  { date: 'Jan 20 2016', price: 96.79 },
  { date: 'Jan 21 2016', price: 96.3 },
  { date: 'Jan 22 2016', price: 101.42 },
  { date: 'Jan 25 2016', price: 99.44 },
  { date: 'Jan 26 2016', price: 99.99 },
  { date: 'Jan 27 2016', price: 93.42 },
  { date: 'Jan 28 2016', price: 94.09 },
  { date: 'Jan 29 2016', price: 97.34 },
  { date: 'Feb 01 2016', price: 96.43 },
  { date: 'Feb 02 2016', price: 94.48 },
  { date: 'Feb 03 2016', price: 96.35 },
  { date: 'Feb 04 2016', price: 96.6 },
  { date: 'Feb 05 2016', price: 94.02 },
  { date: 'Feb 08 2016', price: 95.01 },
  { date: 'Feb 09 2016', price: 94.99 },
  { date: 'Feb 10 2016', price: 94.27 },
  { date: 'Feb 11 2016', price: 93.7 },
  { date: 'Feb 12 2016', price: 93.99 },
  { date: 'Feb 16 2016', price: 96.64 },
  { date: 'Feb 17 2016', price: 98.12 },
  { date: 'Feb 18 2016', price: 96.26 },
  { date: 'Feb 19 2016', price: 96.04 },
  { date: 'Feb 22 2016', price: 96.88 },
  { date: 'Feb 23 2016', price: 94.69 },
  { date: 'Feb 24 2016', price: 96.1 },
  { date: 'Feb 25 2016', price: 96.76 },
  { date: 'Feb 26 2016', price: 96.91 },
  { date: 'Feb 29 2016', price: 96.69 },
  { date: 'Mar 01 2016', price: 100.53 },
  { date: 'Mar 02 2016', price: 100.75 },
  { date: 'Mar 03 2016', price: 101.5 },
  { date: 'Mar 04 2016', price: 103.01 },
  { date: 'Mar 07 2016', price: 101.87 },
  { date: 'Mar 08 2016', price: 101.03 },
  { date: 'Mar 09 2016', price: 101.12 },
  { date: 'Mar 10 2016', price: 101.17 },
  { date: 'Mar 11 2016', price: 102.26 },
  { date: 'Mar 14 2016', price: 102.52 },
  { date: 'Mar 15 2016', price: 104.58 },
  { date: 'Mar 16 2016', price: 105.97 },
  { date: 'Mar 17 2016', price: 105.8 },
  { date: 'Mar 18 2016', price: 105.92 },
  { date: 'Mar 21 2016', price: 105.91 },
  { date: 'Mar 22 2016', price: 106.72 },
  { date: 'Mar 23 2016', price: 106.13 },
  { date: 'Mar 24 2016', price: 105.67 },
  { date: 'Mar 28 2016', price: 105.19 },
  { date: 'Mar 29 2016', price: 107.68 },
  { date: 'Mar 30 2016', price: 109.56 },
  { date: 'Mar 31 2016', price: 108.99 },
  { date: 'Apr 01 2016', price: 109.99 },
  { date: 'Apr 04 2016', price: 111.12 },
  { date: 'Apr 05 2016', price: 109.81 },
  { date: 'Apr 06 2016', price: 110.96 },
  { date: 'Apr 07 2016', price: 108.54 },
  { date: 'Apr 08 2016', price: 108.66 },
  { date: 'Apr 11 2016', price: 109.02 },
  { date: 'Apr 12 2016', price: 110.44 },
  { date: 'Apr 13 2016', price: 112.04 },
  { date: 'Apr 14 2016', price: 112.1 },
  { date: 'Apr 15 2016', price: 109.85 },
  { date: 'Apr 18 2016', price: 107.48 },
  { date: 'Apr 19 2016', price: 106.91 },
  { date: 'Apr 20 2016', price: 107.13 },
  { date: 'Apr 21 2016', price: 105.97 },
  { date: 'Apr 22 2016', price: 105.68 },
  { date: 'Apr 25 2016', price: 105.08 },
  { date: 'Apr 26 2016', price: 104.35 },
  { date: 'Apr 27 2016', price: 97.82 },
  { date: 'Apr 28 2016', price: 94.83 },
  { date: 'Apr 29 2016', price: 93.74 },
  { date: 'May 02 2016', price: 93.64 },
  { date: 'May 03 2016', price: 95.18 },
  { date: 'May 04 2016', price: 94.19 },
  { date: 'May 05 2016', price: 93.24 },
  { date: 'May 06 2016', price: 92.72 },
  { date: 'May 09 2016', price: 92.79 },
  { date: 'May 10 2016', price: 93.42 },
  { date: 'May 11 2016', price: 92.51 },
  { date: 'May 12 2016', price: 90.34 },
  { date: 'May 13 2016', price: 90.52 },
  { date: 'May 16 2016', price: 93.88 },
  { date: 'May 17 2016', price: 93.49 },
  { date: 'May 18 2016', price: 94.56 },
  { date: 'May 19 2016', price: 94.2 },
  { date: 'May 20 2016', price: 95.22 },
  { date: 'May 23 2016', price: 96.43 },
  { date: 'May 24 2016', price: 97.9 },
  { date: 'May 25 2016', price: 99.62 },
  { date: 'May 26 2016', price: 100.41 },
  { date: 'May 27 2016', price: 100.35 },
  { date: 'May 31 2016', price: 99.86 },
  { date: 'Jun 01 2016', price: 98.46 },
  { date: 'Jun 02 2016', price: 97.72 },
  { date: 'Jun 03 2016', price: 97.92 },
  { date: 'Jun 06 2016', price: 98.63 },
  { date: 'Jun 07 2016', price: 99.03 },
  { date: 'Jun 08 2016', price: 98.94 },
  { date: 'Jun 09 2016', price: 99.65 },
  { date: 'Jun 10 2016', price: 98.83 },
  { date: 'Jun 13 2016', price: 97.34 },
  { date: 'Jun 14 2016', price: 97.46 },
  { date: 'Jun 15 2016', price: 97.14 },
  { date: 'Jun 16 2016', price: 97.55 },
  { date: 'Jun 17 2016', price: 95.33 },
  { date: 'Jun 20 2016', price: 95.1 },
  { date: 'Jun 21 2016', price: 95.91 },
  { date: 'Jun 22 2016', price: 95.55 },
  { date: 'Jun 23 2016', price: 96.1 },
  { date: 'Jun 24 2016', price: 93.4 },
  { date: 'Jun 27 2016', price: 92.04 },
  { date: 'Jun 28 2016', price: 93.59 },
  { date: 'Jun 29 2016', price: 94.4 },
  { date: 'Jun 30 2016', price: 95.6 },
  { date: 'Jul 01 2016', price: 95.89 },
  { date: 'Jul 05 2016', price: 94.99 },
  { date: 'Jul 06 2016', price: 95.53 },
  { date: 'Jul 07 2016', price: 95.94 },
  { date: 'Jul 08 2016', price: 96.68 },
  { date: 'Jul 11 2016', price: 96.98 },
  { date: 'Jul 12 2016', price: 97.42 },
  { date: 'Jul 13 2016', price: 96.87 },
  { date: 'Jul 14 2016', price: 98.79 },
  { date: 'Jul 15 2016', price: 98.78 },
  { date: 'Jul 18 2016', price: 99.83 },
  { date: 'Jul 19 2016', price: 99.87 },
  { date: 'Jul 20 2016', price: 99.96 },
  { date: 'Jul 21 2016', price: 99.43 },
  { date: 'Jul 22 2016', price: 98.66 },
  { date: 'Jul 25 2016', price: 97.34 },
  { date: 'Jul 26 2016', price: 96.67 },
  { date: 'Jul 27 2016', price: 102.95 },
  { date: 'Jul 28 2016', price: 104.34 },
  { date: 'Jul 29 2016', price: 104.21 },
  { date: 'Aug 01 2016', price: 106.05 },
  { date: 'Aug 02 2016', price: 104.48 },
  { date: 'Aug 03 2016', price: 105.79 },
  { date: 'Aug 04 2016', price: 105.87 },
  { date: 'Aug 05 2016', price: 107.48 },
  { date: 'Aug 08 2016', price: 108.37 },
  { date: 'Aug 09 2016', price: 108.81 },
  { date: 'Aug 10 2016', price: 108 },
  { date: 'Aug 11 2016', price: 107.93 },
  { date: 'Aug 12 2016', price: 108.18 },
  { date: 'Aug 15 2016', price: 109.48 },
  { date: 'Aug 16 2016', price: 109.38 },
  { date: 'Aug 17 2016', price: 109.22 },
  { date: 'Aug 18 2016', price: 109.08 },
  { date: 'Aug 19 2016', price: 109.36 },
  { date: 'Aug 22 2016', price: 108.51 },
  { date: 'Aug 23 2016', price: 108.85 },
  { date: 'Aug 24 2016', price: 108.03 },
  { date: 'Aug 25 2016', price: 107.57 },
  { date: 'Aug 26 2016', price: 106.94 },
  { date: 'Aug 29 2016', price: 106.82 },
  { date: 'Aug 30 2016', price: 106 },
  { date: 'Aug 31 2016', price: 106.1 },
  { date: 'Sept 01 2016', price: 106.73 },
  { date: 'Sept 02 2016', price: 107.73 },
  { date: 'Sept 06 2016', price: 107.7 },
  { date: 'Sept 07 2016', price: 108.36 },
  { date: 'Sept 08 2016', price: 105.52 },
  { date: 'Sept 09 2016', price: 103.13 },
  { date: 'Sept 12 2016', price: 105.44 },
  { date: 'Sept 13 2016', price: 107.95 },
  { date: 'Sept 14 2016', price: 111.77 },
  { date: 'Sept 15 2016', price: 115.57 },
  { date: 'Sept 16 2016', price: 114.92 },
  { date: 'Sept 19 2016', price: 113.58 },
  { date: 'Sept 20 2016', price: 113.57 },
  { date: 'Sept 21 2016', price: 113.55 },
  { date: 'Sept 22 2016', price: 114.62 },
  { date: 'Sept 23 2016', price: 112.71 },
  { date: 'Sept 26 2016', price: 112.88 },
  { date: 'Sept 27 2016', price: 113.09 },
  { date: 'Sept 28 2016', price: 113.95 },
  { date: 'Sept 29 2016', price: 112.18 },
  { date: 'Sept 30 2016', price: 113.05 },
  { date: 'Oct 03 2016', price: 112.52 },
  { date: 'Oct 04 2016', price: 113 },
  { date: 'Oct 05 2016', price: 113.05 },
  { date: 'Oct 06 2016', price: 113.89 },
  { date: 'Oct 07 2016', price: 114.06 },
  { date: 'Oct 10 2016', price: 116.05 },
  { date: 'Oct 11 2016', price: 116.3 },
  { date: 'Oct 12 2016', price: 117.34 },
  { date: 'Oct 13 2016', price: 116.98 },
  { date: 'Oct 14 2016', price: 117.63 },
  { date: 'Oct 17 2016', price: 117.55 },
  { date: 'Oct 18 2016', price: 117.47 },
  { date: 'Oct 19 2016', price: 117.12 },
  { date: 'Oct 20 2016', price: 117.06 },
  { date: 'Oct 21 2016', price: 116.6 },
  { date: 'Oct 24 2016', price: 117.65 },
  { date: 'Oct 25 2016', price: 118.25 },
  { date: 'Oct 26 2016', price: 115.59 },
  { date: 'Oct 27 2016', price: 114.48 },
  { date: 'Oct 28 2016', price: 113.72 },
  { date: 'Oct 31 2016', price: 113.54 },
  { date: 'Nov 01 2016', price: 111.49 },
  { date: 'Nov 02 2016', price: 111.59 },
  { date: 'Nov 03 2016', price: 109.83 },
  { date: 'Nov 04 2016', price: 108.84 },
  { date: 'Nov 07 2016', price: 110.41 },
  { date: 'Nov 08 2016', price: 111.06 },
  { date: 'Nov 09 2016', price: 110.88 },
  { date: 'Nov 10 2016', price: 107.79 },
  { date: 'Nov 11 2016', price: 108.43 },
  { date: 'Nov 14 2016', price: 105.71 },
  { date: 'Nov 15 2016', price: 107.11 },
  { date: 'Nov 16 2016', price: 109.99 },
  { date: 'Nov 17 2016', price: 109.95 },
  { date: 'Nov 18 2016', price: 110.06 },
  { date: 'Nov 21 2016', price: 111.73 },
  { date: 'Nov 22 2016', price: 111.8 },
  { date: 'Nov 23 2016', price: 111.23 },
  { date: 'Nov 25 2016', price: 111.79 },
  { date: 'Nov 28 2016', price: 111.57 },
  { date: 'Nov 29 2016', price: 111.46 },
  { date: 'Nov 30 2016', price: 110.52 },
  { date: 'Dec 01 2016', price: 109.49 },
  { date: 'Dec 02 2016', price: 109.9 },
  { date: 'Dec 05 2016', price: 109.11 },
  { date: 'Dec 06 2016', price: 109.95 },
  { date: 'Dec 07 2016', price: 111.03 },
  { date: 'Dec 08 2016', price: 112.12 },
  { date: 'Dec 09 2016', price: 113.95 },
  { date: 'Dec 12 2016', price: 113.3 },
  { date: 'Dec 13 2016', price: 115.19 },
  { date: 'Dec 14 2016', price: 115.19 },
  { date: 'Dec 15 2016', price: 115.82 },
  { date: 'Dec 16 2016', price: 115.97 },
  { date: 'Dec 19 2016', price: 116.64 },
  { date: 'Dec 20 2016', price: 116.95 },
  { date: 'Dec 21 2016', price: 117.06 },
  { date: 'Dec 22 2016', price: 116.29 },
  { date: 'Dec 23 2016', price: 116.52 },
  { date: 'Dec 27 2016', price: 117.26 },
  { date: 'Dec 28 2016', price: 116.76 },
  { date: 'Dec 29 2016', price: 116.73 },
  { date: 'Dec 30 2016', price: 115.82 },
];

const initialState = {
  data03,
  data01,
  data02,
  opacity: 1,
  anotherState: false,
  data: data03,
  date: 1,
  price: 115.82,
  isrealtime: false,
  toggleClose: false, 
  toggleBB20: false,
  toggleMA20: false,
};
let realTimeSim: any, LASTMA: number;
export default class Demo extends Component<any, any> {

  static displayName = 'RechartsToolkitDemo';

  state: any = initialState;

  handleChangeData = () => {
    this.setState(() => _.mapValues(initialState, changeNumberOfData));
  };

  handleChangeAnotherState = () => {
    this.setState({
      anotherState: !this.state.anotherState,
    });
  };
  
  render() {
    const colors = ['#8884d8', 'red'];
    
    return (
      <div className="line-charts"  style={{margin: '0 15%'}}>
        <h2 style={{color: 'red', marginBottom: '20px', marginTop: '50px'}}><b>**This library is still under development 0.x and should not be used for production, the API could change and it is not recommended for use at this current moment in time.**</b></h2>
        <hr/>
        <div style={{textAlign: 'center'}}>
          <h1 style={{margin: 0}}>Recharts-toolkit</h1>
          <p  style={{margin: 0, marginBottom: 20}}>Recharts wrapper for interactive visualisations</p>
          <a href="https://www.npmjs.com/package/recharts-toolkit" target="_blank">npmjs.com/package/recharts-toolkit</a> /  <a href="https://github.com/Heston1/recharts-toolkit" target="_blank">github.com/Heston1/recharts-toolkit</a>
           
          

          <div className="line-chart-wrapper" style={{position: 'relative'}}>
            <div style={{textAlign: 'left', position: 'absolute', left: 90, top: 25, zIndex: 10}}>
              <button 
                style={{
                  border: 'none', 
                  background: 'white', 
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px', 
                  borderLeft: '10px solid #0f69ff', 
                  borderRadius: '5px',
                  padding: '5px',
                  marginRight: '15px',
                  cursor: 'pointer',
                  opacity: this.state.toggleClose ? 0.5 : 1
                }}
                onClick={e => this.setState((prev: any) => ({toggleClose: !prev.toggleClose}))}
              >
                CLOSE {this.state.data[this.state.data.length-1].price}
              </button>
              <button
                style={{
                  border: 'none', 
                  background: 'white', 
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px', 
                  borderLeft: '10px solid orange', 
                  borderRadius: '5px',
                  padding: '5px',
                  marginRight: '15px',
                  cursor: 'pointer',
                  opacity: this.state.toggleBB20 ? 0.5 : 1
                }}
                onClick={e => this.setState(prev => ({toggleBB20: !prev.toggleBB20}))}
              >
                BOLLINGER BANDS (20, C, 2, EMA)
              </button>
              <button
                style={{
                  border: 'none', 
                  background: 'white', 
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px', 
                  borderLeft: '10px solid #7e1fff', 
                  borderRadius: '5px',
                  padding: '5px',
                  marginRight: '15px',
                  cursor: 'pointer',
                  opacity: this.state.toggleMA20 ? 0.5 : 1
                }}
                onClick={e => this.setState(prev => ({toggleMA20: !prev.toggleMA20}))}
              >
                MA (20, C, MA, 0)
              </button>
            </div>
          <Toolkit
            //TODO use components outside of here
          >

            <ToolBar 
              displayMode='visible' //TODO
            >
              {/* <Camera
                onCapture={(e: any) => {
                  // e.preventDefault() TODO
                }}
                //icon
                //is toggled
              /> */}

              <ZoomSelect 
                scale="log" 
                //TODO
                //linear
                //exp
                //fn: () => number
              />
              <ZoomIn 
                scale="log"
                //linear
                //exp
                //fn: () => number
              />
              <ZoomOut 
                scale="log"
                //linear
                //exp
                //fn: () => number
              />
              <Pan 
                speed={0} //TODO
                //fixed x/y
              />
              <AutoScale 
                //finds best fit for data
              />
              {/* <Reset 
                //clears drawings, axis etc.
              />  */}

              {/* <TooltipClosest />
              <TooltipCompare /> */}

              <BoxSelect 
                onSelected={(points: any) => console.log(points)}
              />
              <LasoSelect 
                onSelected={(points: any) => console.log(points)}
              />
              <ReferenceLines 
                fixed="price" //TODO dataKey, cursor, dynamic
              /> 
             
              {/* <Export 
                type="csv"
                header={[]} //override axis name/label
                beforeDownload={(e: any) => {}} //modify here before downloading
                onDownload={(e: any) => {}} //do what you want with the csv file
              /> */}

              
              <DrawTool 
                  type='pen' 
                  stroke='blue' 
                  fill="green" 
                  strokeWidth='2px' 
                  strokeStyle="solid"
                  // state={{}} if state not provided handle internally 
                  onChange={(e: any) => {}}
                  //edit/lock
                  // animation
              />
              
              {/* <Ruler /> */}
              
              {/* TODO track to last */}
            </ToolBar>

            <ResponsiveContainer height={400}>
              <ComposedChart 
                 data={
                  this.state.data
                    .slice(19, this.state.data.length)
                    .map((point: any, i: number) => {
                      const index = i + 19;

                      let EXPMA: number;
                      let u2: number;
                      let ma: number;
                      const d = this.state.data;
                      const period = 19; 
                      const P = period+1; //last 20 points
                      const multiplier = 2/(P+1); //weighting multiplier n+1

                      if (index == period) {
                        //sum of period
                        const sum = d.filter((x:any,i:number) => i<20).reduce((acc:number, x:any) => acc+x.price, 0);

                        //exp moving average
                        EXPMA = (d[index-1].price-sum/P)*multiplier+sum/P;
                        LASTMA = EXPMA;
                        ma = sum/P
                      }

                      if (index > period) {
                        //exp moving average
                        EXPMA = (d[index-1].price-LASTMA)*multiplier+LASTMA;
                        LASTMA = EXPMA;
                        //sum of period
                        const sum = d.filter((x:any,i:number) => i>=index-20 && i < index)
                            .reduce((acc:number, x:any) => acc+x.price, 0);
                        //mean
                        const u = sum/P
                        ma = u
                        //variance
                        u2 = d.filter((p:any,i:number) => i>=index-20 && i < index)
                            .map((x:any) => (x.price-u)**2)
                            .reduce((acc:number, p: number) =>acc+p,0)/P
                      }  

                      return {
                        date: new Date(point.date).getTime()/1000, 
                        price: point.price,
                        middleband: EXPMA, //median band
                        ma,
                        bollinger: [
                          EXPMA && EXPMA + (Math.sqrt(u2)*2), //upper band
                          EXPMA && EXPMA - (Math.sqrt(u2)*2) //lower band
                        ],
                        volume: (point.price/100)*100
                      }
                    })
                }
                margin={{ top: 20, right: 40, bottom: 20, left: 20 }}
              >
                  <CartesianGrid strokeDasharray="3 3" />
                  {/*  @ts-ignore */}
                  <XAxis dataKey="date" type="time" xAxisId={0}>
                    <Label value="Date" position="insideBottom" />
                  </XAxis>
                  {/*  @ts-ignore */}
                  {/* <XAxis dataKey="date" type="time" xAxisId={1}/> */}
                  <YAxis allowDecimals={false} yAxisId={0}>
                    <Label value="Stock Price" position="insideLeft" angle={90} />
                  </YAxis>
                  <YAxis dataKey="volume" label="test" orientation="right" yAxisId={1}  unit='%' hide={true} domain={[0, 750]} />
                  <Line name="CLOSE" dataKey="price" stroke="#0f69ff" dot={false} connectNulls hide={this.state.toggleClose}/>
                  <Line name="MA (20, C, MA, 0)" dataKey="ma" stroke="#7e1fff" dot={false} connectNulls hide={this.state.toggleMA20}/>
                  <Line name="MA (20, C, EMA, 0)" dataKey="middleband" stroke="orange" dot={false} connectNulls hide={this.state.toggleBB20}/>
                  <Area name="BOLLINGER BANDS (20, C, 2, EMA)" dataKey="bollinger" 
                    stroke="orange" strokeWidth={1} connectNulls  fill="orange" fillOpacity={0.1} hide={this.state.toggleBB20} />
                  {/* TODO another x axis for daily interval */}
                  {/* <Bar dataKey={'volume'} fill="#8884d8" yAxisId={1} isAnimationActive={false} animationDuration={0}>
                    {this.state.data.map((entry, index) => { return (
                      <Cell key={`cell-${index}`} fill={colors[entry.price < 90 ? 1 : 0]} opacity={0.8}/>
                    )})}
                  </Bar> */}
                </ComposedChart>
            </ResponsiveContainer>
          </Toolkit>
        </div>
          
          
        </div>
        <p><i>basic yahoo finance clone with recharts made easy!</i></p>
        <hr/>
        <div>
          <h3>Installation</h3>
          <h4>NPM</h4>
          <pre className="prettyprint">
              <code className="language-sh">
                {`
# latest stable
$ npm install recharts recharts-toolkit
# or using yarn
$ yarn add recharts recharts-toolkit 
                `}
              </code>
          </pre>
          <h4>UMD</h4>
          <pre className="prettyprint">
              <code className="language-html">
                {`
<script src="https://unpkg.com/react/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/recharts/umd/Recharts.js"></script>
<script src="https://unpkg.com/recharts-toolkit/umd/RechartsToolkit.js"></script>
                `}
              </code>
          </pre>
          <h4>Dev build</h4>
          <pre className="prettyprint">
              <code className="language-sh">
                {`
$ git clone https://github.com/Heston1/recharts-toolkit.git
$ cd recharts-toolkit
$ npm install # or yarn
$ npm run build  #or yarn build
                `}
              </code>
          </pre>
        </div>
        <hr/>
        <div>
          <h3>Selections</h3>
        </div>
        <div className="line-chart-wrapper">
          <ul>
            
            {/* <li>Hold <code>Shift</code> while clicking to make multiple selections</li> */}
            {/* <li><button onClick={(e: any) => this.setState({scatterPoints: null})}>Clear selection box</button></li> */}
          </ul>
          <div style={{display: 'flex', flexDirection: 'column', marginBottom: '20px'}}>
            <Toolkit>
              <ToolBar 
                displayMode={'visible'}
              >
                <ZoomSelect />
                <ZoomIn />
                <ZoomOut />
                <Pan />
                <AutoScale />
                {/* <TooltipClosest />
                <TooltipCompare /> */}
                <BoxSelect onSelected={(points: any) => this.setState({scatterPoints: points})}/>
                <LasoSelect onSelected={(points: any) => this.setState({scatterPoints: points})}/>
                {/* <ReferenceLines /> */}
              </ToolBar> 
              <ResponsiveContainer height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: 20 }}> 
                    <XAxis type="number" dataKey="x" name="stature" unit="cm" />
                    <YAxis type="number" dataKey="y" name="weight" unit="kg" /> 
                    <ZAxis type="number" dataKey="z" range={[50, 1200]} name="score" unit="km" />
                    <CartesianGrid />
                    <Scatter 
                      name="A school" 
                      data={scatter01} 
                      type="number"
                      fillOpacity={0.3} 
                      fill="#ff7300" 
                    />
                    <Scatter name="B school" data={scatter02} fill="#347300" />
                    <ReferenceArea x1={250} x2={300} ifOverflow="extendDomain" label="any label" />
                    <ReferenceLine x={159} stroke="red"/>
                    <ReferenceLine y={237.5} stroke="red"/>
                    <ReferenceDot x={170} y={290} r={15} label="AB" stroke="none" fill="red" isFront/>
                </ScatterChart>
              </ResponsiveContainer>
            </Toolkit>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', maxHeight: '350px'}}>
              <div style={{display: 'flex', flexDirection: 'column', marginRight: 20, maxWidth: '33%'}}>
                <h3>Selection</h3>
                <ul>
                  <li>Utilise the select laso (<Icons.LasoSelectIcon width="13" height="13"/>) and box select (<Icons.BoxSelectIcon width="13" height="13"/>) tools to select data from the graph</li>
                  <li>hold <code>shift</code> to select multiple, clicking will also be included in the selection</li>
                </ul>
                <div style={{border: '1px solid black', overflowY: 'auto', flexGrow: 1}}>
                  <code>
                    {this.state.scatterPoints ? JSON.stringify(this.state.scatterPoints) : 'Make a selection to view the data here...'}
                  </code>
                </div>
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', marginRight: 20, maxWidth: '33%'}}>
                <h3>Click</h3>
                <ul>
                  <li>Click a data point from the graph.</li>
                </ul>
                <div style={{width: '100%', border: '1px solid black', overflowY: 'auto', flexGrow: 1}}>
                  <code>
                    {'Click a data point to view the data here...'}
                  </code>
                </div>
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', maxWidth: '33%'}}>
                <h3>Hover</h3>
                <ul>
                  <li>Hover over a data point.</li>
                </ul>
                <div style={{width: '100%', border: '1px solid black', overflowY: 'auto', flexGrow: 1}}>
                  <code>
                    {'Hover of a data point to view the data here...'}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr/>
        <div>
          <h3>Pannable and scalable axis, with zoom</h3>
        </div>
        <div className="line-chart-wrapper">
          <ul>
            <li>You can pan and scale by axis, drag the x or y axis to pan, dragging the edges of the axis will logarithmically scale</li>
            <li>Drag the edges (for example the origin) of the graph to scale by both the x and y axis</li>
            <li>Use the lock (<Icons.Lock width="13" height="13"/>) and unlock (<Icons.Unlock width="13" height="13"/>) button next to the axis to disable it</li>
            {/* <li>Use the middle mouse button (scroll wheel) to scale horizontally</li> */}
            <li>
              You can also use the pan tool (<Icons.PanIcon width="13" height="13"/>) and zoom tools (<Icons.ZoomSelectIcon width="13" height="13"/>/<Icons.ZoomInIcon width="13" height="13"/>/<Icons.ZoomOutIcon width="13" height="13"/>) on the toolbar
            </li>
            {/* <li>
              Press the start button to add data every <input type="text" value="3" style={{width: '30px', textAlign: 'right'}} /> seconds:  <button onClick={e => {
                this.setState({isrealtime: !this.state.isrealtime}, () => {
                  if (this.state.isrealtime) {
                    realTimeSim = setInterval(() => {
                      if (this.state.date == 512) {
                        clearInterval(realTimeSim);
                        realTimeSim = null;
                        return;
                      }
                      const date = this.state.date + 1;
                      const lastentry = this.state.data[this.state.data.length-1].price;
                      const price = parseFloat((Math.random() * ((lastentry + 3) - (lastentry - 3) + 1) + (lastentry - 3)).toFixed(2));
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      //you may see missing points because its dividing by 30 and not alternating by month
                      const data = this.state.data.concat([{ date: `${months[parseInt('' + (date/30))]} ${date%30} 2017`, price}])
                      this.setState({ date,price,data});
                    }, 3000);
                  } else {
                    clearInterval(realTimeSim);
                    realTimeSim = null;
                  }
                });
                }}>{this.state.isrealtime ? 'stop' : 'start'}</button>
            </li> */}
          </ul>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
            <div style={{marginRight: '10px'}}>
              <Toolkit>
                  <ToolBar>
                      <ZoomIn />
                      <ZoomOut />
                      <ZoomSelect />
                      <Pan />
                  </ToolBar>

                  <LineChart
                      width={500}
                      height={300}
                      data={exampleLineData}
                      margin={{left: -25}}
                      
                  >
                     {/*  @ts-ignore */}
                      <XAxis dataKey="name" lock />
                       {/*  @ts-ignore */}
                      <YAxis scale="linear" yAxisId={0} lock/>
                      <YAxis scale="linear" yAxisId={1}/>
                      <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                      <Line type="monotone" dataKey="uv" stroke="#8884d8" yAxisId={0} />
                      <Line type="monotone" dataKey="pv" stroke="#82ca9d" yAxisId={1}/>
                  </LineChart>
              </Toolkit>
            </div>
            <div className="line-chart-wrapper" style={{flexGrow: 2}}>
              <Toolkit>
                

                <ToolBar 
                  displayMode={'visible'}
                >
                  <ZoomIn />
                  <ZoomOut />
                  <ZoomSelect />
                  <Pan />
                </ToolBar>
                <ResponsiveContainer height={400}>
                  <BarChart data={dataCat} margin={{top: 30, bottom: 50, left: 10, right: 10}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name"/>
                    <YAxis /> 
                    <Bar dataKey="pv" fill="#8884d8" />
                    <Bar dataKey="uv" fill="#82ca9d" />
                    
                  </BarChart>
                
                </ResponsiveContainer>
              </Toolkit>
            </div>
            {/* <div style={{
              display: 'flex', 
              flexDirection: 'column', 
              width: 500,
              height: '100%',
              textAlign: 'left'
            }}>
              <pre className="prettyprint">
                <code className="language-js">
                    {`
<Toolkit>
  <ToolBar>
      <ZoomIn />
      <ZoomOut />
      <ZoomSelect />
  </ToolBar>

  <LineChart
      width={500}
      height={300}
      data={data}
  >
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
  </LineChart>
</Toolkit>
                `}
                </code>
              </pre>
            </div> */}
          </div>
        </div>
        <hr/>
        

        <div className="line-chart-wrapper" style={{flexGrow: 1, maxWidth: 500}}>
          <h3>Better tooltips</h3>
        </div>
        <hr/>
        <div className="line-chart-wrapper" style={{flexGrow: 1, maxWidth: 500}}>
            <h3>Drawing and saving to local storage</h3>
        </div>
        <hr/>
        <div className="line-chart-wrapper" style={{flexGrow: 1, maxWidth: 500}}>
            <h3>Customisable toolbar</h3>
        </div>
        <hr/>
        {/* <div className="line-chart-wrapper" style={{flexGrow: 1, maxWidth: 500}}>
            <p><i>Cross-filter example</i></p>
        </div>
        <div className="line-chart-wrapper" style={{flexGrow: 1, maxWidth: 500}}>
            <p><i>Layered/Stacked graph example ... deferred</i></p>
        </div>
        <hr/> */}
        <div>
          <h3>API</h3>
        </div>
        
      </div>  
      
    );
  }
}
