import React from 'react';
import { getDomainOfDataByKey } from '../utils/helpers';

export const AutoScale  = (props: any) => {
    const {data, yAxisDomain, setYAxisDomain, setXAxisDomain, xAxisDomain} = props;

    const handleAutoSize = (e: any) => {
        const xAxis = getDomainOfDataByKey(data, 'date', 'number'); //TODO
        setYAxisDomain(['auto', 'auto'])
        setXAxisDomain(xAxis)
    }

    // https://icons.getbootstrap.com/icons/aspect-ratio/
    return (
        <svg onClick={handleAutoSize} xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="rgb(102, 102, 102)" className="bi bi-aspect-ratio" viewBox="0 0 16 16">
            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
        </svg>
    );
}