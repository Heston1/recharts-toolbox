import React from 'react';
import { calculateTimeSeriesTicks, resolveAxis } from '../utils/helpers';
import { ZoomOutIcon } from '../Icons';
import { scaleLog, scaleLinear } from 'd3-scale';

export const ZoomOut = (props: any) => {
    const {
        yAxisDomainMap, 
        xAxisDomainMap,
        setXAxisDomainMap, 
        yAxisMap, 
        xAxisMap, 
        setYAxisDomainMap, 
        setTicks
    } = props;
   
    const zoomFunction = (e: any) => {
        setYAxisDomainMap(
            Object.keys(yAxisDomainMap).reduce((aggregate: any, key: string) => {
                const yAxis = yAxisMap[key];
    
                const domain = resolveAxis(props, yAxisDomainMap[key], null, yAxis.yAxisId, 'yAxis');
                const diff = domain[1]-domain[0];
                const mult = 2;
                const sub = (diff*mult)/(mult*domain.length);
                
                return {
                    ...aggregate,
                    [yAxis.yAxisId]:  [domain[0]-sub, domain[1]+sub]
                };
            }, {})
        );

        setXAxisDomainMap(
            Object.keys(xAxisDomainMap).reduce((aggregate: any, key: string) => {
                const xAxis = xAxisMap[key];
    
                const domain = resolveAxis(props, xAxisDomainMap[key], null, xAxis.xAxisId, 'xAxis');
                const diff = domain[1]-domain[0];
                const mult = 2;
                const sub = (diff*mult)/(mult*domain.length);
                const zoomedDomain = [domain[0]-sub, domain[1]+sub];
                calculateTimeSeriesTicks(5, xAxisDomainMap[key], zoomedDomain, setTicks);

                return {
                    ...aggregate,
                    [xAxis.xAxisId]:  zoomedDomain
                };
            }, {})
        );
    };

    return <ZoomOutIcon onClick={zoomFunction}/>;
}