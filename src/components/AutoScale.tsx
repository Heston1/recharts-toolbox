import React from 'react';
import { AutoScaleIcon } from '../Icons';
import { getDomainOfDataByKey } from '../utils/helpers';

export const AutoScale  = (props: any) => {
    const {data, yAxisDomain, setYAxisDomain, setXAxisDomain, xAxisDomain} = props;

    const handleAutoSize = (e: any) => {
        const xAxis = getDomainOfDataByKey(data, 'date', 'number'); //TODO
        
        setYAxisDomain(['auto', 'auto'])
        setXAxisDomain(xAxis)
    }

    return <AutoScaleIcon onClick={handleAutoSize} />;
}