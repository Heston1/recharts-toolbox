import React from 'react';
import { Customized } from 'recharts';

const TooltipUtil = (tooltipProps: any)  => {
    return <Customized 
        component={
            (props: any) => {
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
                    } else {
                        //TODO use same api as recharts
                        tooltipProps.onCoordChange(points[index]);
                    }
                }

                const leaveHandle = (e: any) => {
                    tooltipProps.onCoordChange(null);
                }

                return (
                    <g>
                        <rect 
                            onMouseMove={handle}
                            onMouseLeave={leaveHandle}
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
                    </g>
                )
            }
        } 
    /> 
}
export default TooltipUtil;