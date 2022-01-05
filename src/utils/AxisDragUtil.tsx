import React from 'react';
import ReactDOM from 'react-dom';
import { Customized } from 'recharts';

let target: any;
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
                                const bbox = e.target.getBoundingClientRect();

                                const origin = e.pageY;
                                const relativeOrigin = e.clientY - bbox.top 
                                // const [yA1, yA2] = axisDragProps?.yAxisDomain;
                                target = axisDragProps?.yAxisDomain;
                                const cursor = 'n-resize'
                                let dragContainer = document.createElement('div')
                                dragContainer.setAttribute('style', `position:absolute;top:0;bottom:0;left:0;right:0;z-index:10000;cursor:${cursor}`);
                                dragContainer.setAttribute('id', 'drag-overlay-root');
                                dragContainer.addEventListener('mouseup', (ev: any) => {
                                    ev.target.remove();
                                });
                                dragContainer.addEventListener('mousemove', (ev: any) => {
                                        ev.stopPropagation()
                                        const cursorPos = origin - ev.pageY
                                       
                                        let
                                            z1 = 0,
                                            z2 = (props.yAxisMap[0].height * 1/3),
                                            z3 =  (props.yAxisMap[0].height * 1/3)*2,
                                            z4 =  (props.yAxisMap[0].height * 1/3)*3

                                        const [yA1, yA2] = target;
                                        
                                        let domain: any = [];
                                        if (relativeOrigin > z1 && relativeOrigin <= z2) {
                                            domain = [
                                                yA1 , 
                                                yA2 - (cursorPos * Math.log(5))
                                            ]
                                        }
                                        else if (relativeOrigin > z2 && relativeOrigin <= z3) {
                                            domain = [//TODO
                                                yA1 - (cursorPos * (yA1/yA2) ),
                                                yA2 - (cursorPos * (yA1/yA2) )
                                            ]
                                        }
                                        else if (relativeOrigin > z3 && relativeOrigin <= z4) {
                                            domain = [
                                                yA1 - (cursorPos * Math.log(5)), 
                                                yA2
                                            ]
                                        }
                                        axisDragProps?.onCoordChange(domain)
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