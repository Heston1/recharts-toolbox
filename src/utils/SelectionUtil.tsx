import React from 'react';
import { Customized } from 'recharts';
import { resolveAxis } from './helpers';

let select_wasMoved = false;
const SelectionUtil = (selectionProps: any)  => {
    //TODO handle padding/margin, other offsets
    return <Customized 
        component={
            (props: any) => {
                const [start, setStart] = React.useState(null);
                const [end, setEnd] = React.useState(null);

                return (
                    <g>
                        <mask id="selection_mask">
                            <rect 
                                x={props.yAxisMap[0].width + props.yAxisMap[0].x} 
                                y={props.yAxisMap[0].y} 
                                width={props.xAxisMap[0].width} 
                                height={props.yAxisMap[0].height} 
                                fill="white" 
                            />

                            {(start && end) && 
                                <rect 
                                    x={start.x < end.x ? start.x : end.x}
                                    y={start.y < end.y ? start.y : end.y}
                                    width={start.x < end.x ? end.x-start.x : start.x-end.x}
                                    height={start.y < end.y ?  end.y-start.y : start.y-end.y}
                                    fill="black"
                                />
                            }
                        </mask>
                        <rect 
                            onMouseDown={(e: any) => {
                                setStart(null); setEnd(null);
                                const bbox = e.target.getBoundingClientRect();
                               
                                setStart({x: e.clientX - selectionProps.offsetLeft, y: e.clientY - bbox.top + props.yAxisMap[0].y}); 
                                
                                select_wasMoved = true;
                            }}
                            onMouseMove={(e: any)  => {
                                if (select_wasMoved) {
                                    const bbox = e.target.getBoundingClientRect();

                                    setEnd({x: e.clientX - selectionProps.offsetLeft, y: e.clientY - bbox.top + props.yAxisMap[0].y});
                                }
                            }}
                            onMouseUp={(e: any)  => {
                                const bbox = e.target.getBoundingClientRect();

                                setEnd({x: e.clientX - selectionProps.offsetLeft, y: e.clientY - bbox.top + props.yAxisMap[0].y});

                                select_wasMoved = false;

                                selectionProps?.setZoomState(false);
                                
                                const x1 = start.x < end.x ? start.x : end.x;
                                const y1 = start.y < end.y ? start.y : end.y;
                                const x2 = start.x > end.x ? start.x : end.x;
                                const y2 = start.y > end.y ? start.y : end.y;

                                const [yA1, yA2] = resolveAxis(props, selectionProps.yAxisDomain);
                                const [xA1, xA2] = selectionProps.xAxisDomain;

                                selectionProps?.onCoordChange({
                                    yDomain: [
                                        (yA2 - ( (yA2 - yA1) * (y2 - props.yAxisMap[0].y)/(props.yAxisMap[0].height) ) ) ,
                                        (yA2 - ( (yA2 - yA1) * (y1 - props.yAxisMap[0].y)/(props.yAxisMap[0].height) ) ) ,
                                    ],
                                    xDomain: [
                                        (xA1 - ( (xA1 - xA2) * (x1 - props.xAxisMap[0].x)/(props.xAxisMap[0].width) ) ) ,
                                        (xA1 - ( (xA1 - xA2) * (x2 - props.xAxisMap[0].x)/(props.xAxisMap[0].width) ) ) ,
                                    ]
                                })
                                
                                
                            }}
                            x={props.yAxisMap[0].width + props.yAxisMap[0].x} 
                            y={props.yAxisMap[0].y} 
                            width={props.xAxisMap[0].width} 
                            height={props.yAxisMap[0].height} 
                            style={{opacity: select_wasMoved ? 0.3 : 0, cursor: 'crosshair'}}
                            mask="url(#selection_mask)" 
                        />
                    </g>
                )
            }
        } 
    /> 
}
export default SelectionUtil;