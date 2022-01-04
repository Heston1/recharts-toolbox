import React from 'react';
import ReactDOM from 'react-dom';
import { Customized } from 'recharts';

let dragContainer = document.createElement('div');
const AxisDragUtil = (axisDragProps: any)  => {
    //TODO handle padding/margin, other offsets
    return <Customized 
        component={
            (props: any) => {
                return (
                    <g>
                        <rect 
                            onMouseDown={(e: any) => {
                                e.persist();

                                const origin = e.pageY;
                                const cursor = 'n-resize'
                                dragContainer.setAttribute('style', `position:absolute;top:0;bottom:0;left:0;right:0;z-index:10000;cursor:${cursor}`);
                                dragContainer.setAttribute('id', 'drag-overlay-root');
                                dragContainer.addEventListener('mouseup', (ev: any) => {
                                    ev.target.remove();
                                });
                                dragContainer.addEventListener('mousemove', (ev: any) => {
                                        const cursorPos = origin - ev.pageY
                                        
                                        const dist = cursorPos
                                        /**
                                         * TODO: split into 3 areas, top and bottom will scale (clamped), middle will pan 
                                         * would be nice if the axis and grid moved with the domain
                                         */
                                        const [yA1, yA2] = axisDragProps?.yAxisDomain;
                                        
                                        axisDragProps?.onCoordChange([
                                            yA1 - (dist * 0.2) , //* by scale
                                            yA2 - (dist * 0.2)
                                        ])
                                        
                            });
                                document.body.appendChild(dragContainer);
                            }}
                            x={props.yAxisMap[0].x} 
                            y={props.yAxisMap[0].y} 
                            width={props.yAxisMap[0].width} 
                            height={props.yAxisMap[0].height} 
                            style={{opacity: 0, cursor: 'n-resize'}}
                        />
                    </g>
                )
            }
        } 
    /> 
}
export default AxisDragUtil;