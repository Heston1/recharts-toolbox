import React from 'react'

export const ZoomIn = (props: any) => {
    const {yAxisDomain, setYAxisDomain} = props;
    
    const zoomFunction = (e: any) => {
        const diff = Math.abs(yAxisDomain[1] - yAxisDomain[0]);

        //use scaling function passed from props
        const scale = (((diff)/2)/Math.log(5))  //huh??
        const x = yAxisDomain[0] + scale;
        const y = yAxisDomain[1] - scale;
        setYAxisDomain([x, y])
    };

    return (
        <svg onClick={zoomFunction} xmlns="http://www.w3.org/2000/svg" width="16" height="16" stroke="rgb(102, 102, 102)" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
            <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
            <path fillRule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"/>
        </svg>
    );
}