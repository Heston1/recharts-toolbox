import React from 'react'
import { TooltipClosestIcon } from '../Icons';

export const TooltipClosest = (props: any) => {
    const {tooltipMode, setTooltipMode} = props;
    const selected = tooltipMode == 'closest' ? "#22b5bf" : "rgb(102, 102, 102)"; //TODO

    return <TooltipClosestIcon onClick={e => setTooltipMode('closest')} fill={selected} />;
}