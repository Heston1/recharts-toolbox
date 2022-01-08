import React from "react"

export const CustomTooltip = (props: any) => {
    const { tooltipMode, tooltipCoord } = props;
    
    return (
        <div 
            style={{
                position: 'absolute', 
                top: tooltipCoord.y, 
                left: tooltipCoord.x + 10,
                background: 'white',
                
                border: '1px solid #666',
                padding: 10,
                color: '#666',
                zIndex: 10001
            }}
        >
            <div style={{marginBottom: 5}}>
                {tooltipCoord.payload.date}
            </div>
            <div>
                {tooltipMode == 'compare' &&
                    Object.keys(tooltipCoord.payload)
                        .filter(key => key != 'date')
                        .map(key => 
                            <div>{key}: {tooltipCoord.payload[key]}</div>
                        )
                }
                {tooltipMode == 'closest' && 
                    <div> {tooltipCoord.value}</div>
                }
            </div>
        </div>
    )
}