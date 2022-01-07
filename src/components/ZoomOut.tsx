import React from 'react';

export const ZoomOut = (props: any) => {
    const {yAxisDomain, setYAxisDomain, setXAxisDomain, xAxisDomain} = props;

    const zoomFunction = (e: any) => {
        const diffy = Math.abs(yAxisDomain[1] - yAxisDomain[0]);
        const diffx = Math.abs(xAxisDomain[1] - xAxisDomain[0]);
        
        const scaley = (Math.log(5)*(diffy/2));
        const scalex = (Math.log(5)*(diffx/2)); 

        const y1 = yAxisDomain[0] - scaley;
        const y2 = yAxisDomain[1] + scaley;
        setYAxisDomain([y1, y2])
        const x1 = xAxisDomain[0] - scalex;
        const x2 = xAxisDomain[1] + scalex;
        setXAxisDomain([x1, x2])
    };

    return (
        <svg onClick={zoomFunction} xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="rgb(102, 102, 102)" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
            <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
            <path fillRule="evenodd" d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
        </svg>
    );
}