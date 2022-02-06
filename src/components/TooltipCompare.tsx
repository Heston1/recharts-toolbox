import React from 'react'
import { TooltipCompareIcon } from '../Icons';

export const TooltipCompare = (props: any) => {
    const {tooltipMode, setTooltipMode} = props;
    const selected = tooltipMode == 'compare' ? "#22b5bf" : "rgb(102, 102, 102)"; //TODO

    return <TooltipCompareIcon onClick={e => setTooltipMode('compare')} fill={selected} />;
}