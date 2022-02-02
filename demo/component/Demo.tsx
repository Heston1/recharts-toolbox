import React, { Component } from 'react';
import { ResponsiveContainer, LineChart, ComposedChart , 
  Area, Line, Legend, XAxis, YAxis, CartesianGrid, ReferenceLine,
    Label, LabelList, Brush, ScatterChart, ZAxis, Scatter, Polygon, Rectangle, Customized, ReferenceArea, ReferenceDot, BarChart, Bar } from 'recharts';
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

// const randdist = Array.from(Array(100).keys()).map((x: number) => {
//   const rand = (min: number, max: number) =>  parseFloat((Math.random() * ((max) - (min) + 1) + (min)).toFixed(2));
//     return {
//       x,
//       y: rand(x-rand(0,50), x+rand(0,50))
//     }
// });

// const randdist2 = Array.from(Array(100).keys()).map((x: number) => {
//   const rand = (min: number, max: number) =>  parseFloat((Math.random() * ((max) - (min) + 1) + (min)).toFixed(2));
//     return {
//       x: x+rand(0,50),
//       y: rand(x-rand(0,50), x+rand(0,50))
//     }
// });

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

  // { date: 'Jan 01 2017',},TODO handle null y axis value
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
  isrealtime: false
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
    return (
      <div className="line-charts"  style={{margin: '0 15%'}}>
        <h2 style={{color: 'red', marginBottom: '20px', marginTop: '50px'}}><b>**This library is still under development 0.x and should not be used for production, the API could change and it is not recommended for use at this current moment in time.**</b></h2>
        <hr/>
        <div>
          <h1>Recharts-toolkit</h1>
          <p>Recharts wrapper for interactive visualisations</p>

        </div>
        <hr/>
        <div>
          <h3>Installation</h3>
        </div>
        <hr/>
        <div>
          <h3>Examples</h3>
        </div>
        <div className="line-chart-wrapper">
          <p><i>Zoom, pan and timeseries graph example</i></p>
          <ul>
            <li>Drag the x or y axis to pan, dragging the edges of the axis will logarithmically scale</li>
            <li>You can also drag the edges of the graph to scale by both the x and y axis e.g. hover your cursor just below the x and y axis (origin)</li>
            {/* <li>Use the middle mouse button (scroll wheel) to scale horizontally</li> */}
            <li>
              You can also use the pan tool (<Icons.PanIcon width="13" height="13"/>) and zoom tools (<Icons.ZoomSelectIcon width="13" height="13"/>/<Icons.ZoomInIcon width="13" height="13"/>/<Icons.ZoomOutIcon width="13" height="13"/>) on the toolbar
            </li>
            <li>
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
            </li>
          </ul>
         

          <Toolkit
            //TODO use components outside of here
          >

            <ToolBar 
              displayMode='visible' //TODO
            >
              <Camera
                onCapture={(e: any) => {
                  // e.preventDefault() TODO
                }}
                //icon
                //is toggled
              />

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

              <TooltipClosest />
              <TooltipCompare />

              <BoxSelect 
                onSelected={(points: any) => console.log(points)}
              />
              <LasoSelect 
                onSelected={(points: any) => console.log(points)}
              />
              <ReferenceLines 
                fixed="price" //TODO dataKey, cursor, dynamic
              /> 
             
              <Export 
                type="csv"
                header={[]} //override axis name/label
                beforeDownload={(e: any) => {}} //modify here before downloading
                onDownload={(e: any) => {}} //do what you want with the csv file
              />

              
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
                    .map((point: any, index: number) => {
                      
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
                        ]
                      }
                    })
                }
                margin={{ top: 40, right: 40, bottom: 20, left: 20 }}
              >
                  <CartesianGrid strokeDasharray="3 3" />
                  {/* TODO override types? */}
                  {/*  @ts-ignore */}
                  <XAxis dataKey="date" type="time">
                    <Label value="Date" position="insideBottom" />
                  </XAxis>
                  <YAxis >
                    <Label value="Stock Price" position="insideLeft" angle={90} />
                  </YAxis>
                  {/* <Legend iconType="plainline" align="left" verticalAlign="top" margin={{ top: 0, left: 200, right: 0, bottom: 0 }}/> */}
                  <YAxis  label="test" orientation="right"/>
                  <Line name="CLOSE" dataKey="price" stroke="#0f69ff" dot={false} connectNulls />
                  {/* period, field, type, offset */}
                  <Line name="MA (20, C, MA, 0)" dataKey="ma" stroke="#7e1fff" dot={false} connectNulls />
                  <Line name="MA (20, C, EMA, 0)" dataKey="middleband" stroke="orange" dot={false} connectNulls />
                  {/* period, field, standard deviations, type */}
                  <Area name="BOLLINGER BANDS (20, C, 2, EMA)" dataKey="bollinger" stroke="orange" strokeWidth={1} connectNulls  fill="orange" fillOpacity={0.1} />
                </ComposedChart>
            </ResponsiveContainer>
          </Toolkit>
        </div>

        <div className="line-chart-wrapper">
          <p><i>Selection example with scatter graph</i></p>
          <ul>
            <li>Utilise the select laso (<Icons.LasoSelectIcon width="13" height="13"/>) and box select (<Icons.BoxSelectIcon width="13" height="13"/>) tools to select data from the graph
            </li>
            {/* <li>Hold <code>Shift</code> while clicking to make multiple selections</li> */}
          </ul>
          <div style={{display: 'flex'}}>
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
              <ScatterChart width={400} height={400} margin={{ top: 20, right: 20, bottom: 0, left: 20 }}> 
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
            </Toolkit>
            <div style={{height: '400px', width: '100%', border: '1px solid black', overflowY: 'auto', flexGrow: 1}}>
              <code>
                {this.state.scatterPoints ? JSON.stringify(this.state.scatterPoints) : 'Make a selection to view the data here...'}
              </code>
            </div>
          </div>
        </div>
        
        <div className="line-chart-wrapper" style={{flexGrow: 2}}>
          <p><i>Tooltip and category with yaxis number type</i></p>
          <Toolkit>

            <ToolBar 
              displayMode={'visible'}
            >
              {/* <ReferenceLines /> */}
            </ToolBar>
            <ResponsiveContainer height={400}>
            <BarChart data={dataCat} syncId="test">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name"/>
              <YAxis /> 
              <Bar dataKey="pv" fill="#8884d8" />
              <Bar dataKey="uv" fill="#82ca9d" />
              
            </BarChart>
            
            </ResponsiveContainer>
          </Toolkit>
        </div>

        <p><b>TODO</b></p>
        <div className="line-chart-wrapper" style={{flexGrow: 1, maxWidth: 500}}>
            <p><i>Improved tooltip example</i></p>
        </div>
        <div className="line-chart-wrapper" style={{flexGrow: 1, maxWidth: 500}}>
            <p><i>Draw tool example</i></p>
        </div>
        <div className="line-chart-wrapper" style={{flexGrow: 1, maxWidth: 500}}>
            <p><i>Cross-filter example</i></p>
        </div>
        <div className="line-chart-wrapper" style={{flexGrow: 1, maxWidth: 500}}>
            <p><i>Layered/Stacked graph example ... deferred</i></p>
        </div>
      </div>  
    );
  }
}
