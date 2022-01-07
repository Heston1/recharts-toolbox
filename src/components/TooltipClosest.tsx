import React from 'react'

export const TooltipClosest = (props: any) => {
    const {tooltipMode, setTooltipMode} = props;
    const selected = tooltipMode == 'closest' ? "#22b5bf" : "rgb(102, 102, 102)"; //TODO

    return (
        <svg onClick={e => setTooltipMode('closest')} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={selected} viewBox="0 0 16 16">
            <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg>
    );
}