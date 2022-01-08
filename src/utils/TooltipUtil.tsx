import React from 'react';

const TooltipUtil = (tooltipProps: any)  => {
    const props = tooltipProps.graphProps;
    const [referenceLines, setReferenceLines] = React.useState(null);
    const handle = (e: any) => {
        e.persist();
        const bbox = e.target.getBoundingClientRect();
        const tickSize = 10; //TODO: should be tick size
        
        const relY = e.clientY - bbox.top;
        const relX = e.clientX - bbox.left;

        let points: any;
        
        //ideas for speeding this up
        // - calc bb of graph, if the cursor is not within bounds return
        switch (tooltipProps.mode) {
            case 'closest':
                points = props.formattedGraphicalItems.reduce(
                    //TODO pass axis key to payload
                    (acc: any, items: any) => acc.concat(items.props.points), []
                );
                break;
            default:
            case 'compare':
                points = props.formattedGraphicalItems.reduce(
                    (acc: any, items: any) => {
                        if (acc.length == 0) {
                            return items.props.points;
                        } else {
                            return acc.map(
                                (point: any, i: number) => 
                                    Object.assign({}, point, {
                                        y: relY
                                    })
                                );
                        }
                    }, []
                );
                break;
        }
        
        let minDist: number = Infinity;
        let index: any
        points.forEach((point: any, _index: number) => {
            const dist = Math.sqrt((relX-point.x)**2) 
                + Math.sqrt((relY-point.y)**2);
            if (dist < minDist) {
                minDist = dist;
                index = _index;
            }
        });

        if (Math.abs(minDist) > tickSize) {
            tooltipProps.onCoordChange(null);
            setReferenceLines(null);
        } else {
            //TODO use same api as recharts
            tooltipProps.onCoordChange(points[index]);
            setReferenceLines(points[index]);
        }
    }

    const leaveHandle = (e: any) => {
        tooltipProps.onCoordChange(null);
        setReferenceLines(null);
    }
    const referenceBox = 20; //TODO font size
    return (
        <g onMouseLeave={leaveHandle}>
            <rect 
                onMouseMove={handle}
                x={0} 
                y={0} 
                width={
                    props.xAxisMap[0].width + 
                    props.yAxisMap[0].width + 
                    props.yAxisMap[0].x + 
                    props.xAxisMap[0].x 
                }  
                height={
                    props.yAxisMap[0].height + 
                    props.yAxisMap[0].y + 
                    props.xAxisMap[0].y
                } 
                style={{opacity: 0}}
            />
            {(referenceLines && tooltipProps.enableReferenceLines) &&
                <g>
                    <g>
                        <rect 
                            x={props.yAxisMap[0].x} 
                            y={referenceLines.y - (referenceBox/2)} 
                            width={props.yAxisMap[0].width} 
                            height={referenceBox-3}
                            fill="rgb(34, 181, 191)"
                        />
                        <text
                            x={props.yAxisMap[0].x + props.yAxisMap[0].width * 0.5}
                            y={referenceLines.y}
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fill="white"
                        >
                            {referenceLines.value}
                        </text>
                    </g>
                    <g>
                        <rect 
                            x={referenceLines.x - (props.yAxisMap[0].width/2)} 
                            y={props.yAxisMap[0].y + props.yAxisMap[0].height} 
                            width={props.yAxisMap[0].width } 
                            height={referenceBox}
                            fill="rgb(34, 181, 191)"
                        />
                        <text
                            x={referenceLines.x}
                            y={props.yAxisMap[0].y + props.yAxisMap[0].height + (referenceBox/2)}
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fill="white"
                        >
                            {referenceLines.value}
                        </text>
                    </g>
                    <line 
                        x1={props.yAxisMap[0].x + props.yAxisMap[0].width} 
                        y1={referenceLines.y} 
                        x2={referenceLines.x} 
                        y2={referenceLines.y}
                        style={{stroke:'black', strokeWidth:1, strokeDasharray: "3,3"}}
                    />
                    <line 
                        x1={referenceLines.x} 
                        y1={referenceLines.y} 
                        x2={props.yAxisMap[0].x + props.yAxisMap[0].width + props.xAxisMap[0].width} 
                        y2={referenceLines.y}
                        style={{stroke:'black', strokeWidth:1, strokeDasharray: "3,3"}}
                    />
                    <line 
                        x1={referenceLines.x} 
                        y1={props.yAxisMap[0].y} 
                        x2={referenceLines.x} 
                        y2={referenceLines.y}
                        style={{stroke:'black', strokeWidth:1, strokeDasharray: "3,3"}}
                    />
                    <line 
                        x1={referenceLines.x} 
                        y1={referenceLines.y} 
                        x2={referenceLines.x} 
                        y2={props.yAxisMap[0].y + props.yAxisMap[0].height}
                        style={{stroke:'black', strokeWidth:1, strokeDasharray: "3,3"}}
                    />
                </g>
            } 
            
        </g>
    )
}
export default TooltipUtil;