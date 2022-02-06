import React from 'react'
import { calculateTimeSeriesTicks, resolveAxis } from '../utils/helpers';
import { ZoomInIcon } from '../Icons';

export const ZoomIn = (props: any) => {
    const {yAxisDomain, setYAxisDomain, setXAxisDomain, xAxisDomain, setTicks} = props;

    const zoomFunction = (e: any) => {
        const yDomain = resolveAxis(props, yAxisDomain);
        const xDomain = resolveAxis(props, xAxisDomain);
        const diffy = Math.abs(yDomain[1] - yDomain[0]);
        const diffx = Math.abs(xDomain[1] - xDomain[0]);

        //use scaling function passed from props
        const scaley = (((diffy)/2)/Math.log(5))  //TODO: avoid dividing by 2
        const scalex = (((diffx)/2)/Math.log(5)) 

        const y1 = yDomain[0] + scaley;
        const y2 = yDomain[1] - scaley;
        setYAxisDomain([y1, y2])
        const x1 = xDomain[0] + scalex;
        const x2 = xDomain[1] - scalex;

        setXAxisDomain([x1, x2]);
        calculateTimeSeriesTicks(5, xAxisDomain, [x1, x2], setTicks);
    };

    return <ZoomInIcon onClick={zoomFunction} />;
}