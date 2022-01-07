import React from 'react';
import { Customized } from 'recharts';
import { resolveAxis } from './helpers';

let targetY: any, targetX: any, moving = false;
const AxisDragUtil = (axisDragProps: any)  => {
    return <Customized 
        component={
            (props: any) => {
                //TODO handle category
                const dragHandle = (e: any, key: string) => {
                    e.persist();
                    const bbox = e.target.getBoundingClientRect();

                    const originY = e.pageY;
                    const originX = e.pageX;
                    const relativeOriginY = e.clientY - bbox.top;
                    const relativeOriginX = e.clientX - bbox.left;
                    
                    targetY = axisDragProps?.yAxisDomain;
                    targetX = axisDragProps?.xAxisDomain;
                    
                    let cursor: string;
                    switch (key) {
                        case 'y':
                            cursor = 'n-resize';
                            break;
                        case 'x':
                            cursor = 'e-resize';
                            break;
                        case 'xy':
                            cursor = 'ne-resize';
                            break;
                        case 'pan':
                            cursor = 'all-scroll'
                        default:
                            //invalid key
                            break;
                    }
                    let dragContainer = document.createElement('div');
                    dragContainer.setAttribute(
                        'style', 
                        `
                            position:absolute;
                            top:0;
                            bottom:0;
                            left:0;
                            right:0;
                            z-index:10000;
                            cursor:${cursor}
                        `
                    );
                    dragContainer.setAttribute('id', 'drag-overlay-root');
                    moving = true;

                    dragContainer.addEventListener('mouseup', (ev: any) => {
                        dragContainer.remove(); 
                        moving = false; //TODO: is this needed when its removed?
                    });
                    dragContainer.addEventListener('mousemove', (ev: any) => {
                        if (!moving) 
                            return;

                        ev.stopPropagation();
                        ev.preventDefault();

                        const cursorPosY = originY - ev.pageY;
                        const cursorPosX = originX - ev.pageX;
                        
                        const [yA1, yA2] = resolveAxis(props, targetY); 
                        const [xA1, xA2] = targetX; 

                        const tickSizeY = (yA2-yA1)/props.yAxisMap[0].height;
                        const tickSizeX = (xA2-xA1)/props.xAxisMap[0].width;
                        const distanceY = cursorPosY*tickSizeY;
                        const distanceX = cursorPosX*tickSizeX  * -1;
                        const log = Math.log(5);

                        if (key == 'pan'){  
                            const domainY = [yA1 - distanceY, yA2 - distanceY];
                            const domainX = [xA1 - distanceX, xA2 - distanceX];

                            axisDragProps?.onCoordYChange(domainY);
                            axisDragProps?.onCoordXChange(domainX);
                            return;
                        }

                        if (key == 'xy') {
                            const domainY = [yA1 - (distanceY * log), yA2];
                            const domainX = [xA1 - (distanceX * log), xA2];

                            axisDragProps?.onCoordYChange(domainY);
                            axisDragProps?.onCoordXChange(domainX);
                            return;
                        }
                        
                        const axisH = key == 'x' 
                            ? props.xAxisMap[0].width 
                            : props.yAxisMap[0].height;

                        const
                            z1 = 0,
                            z2 = axisH * 1/10,
                            z3 =  (axisH * 4/5)+z2,
                            z4 =  (axisH * 1/10)+z3;
                            
                        let domain: any = [];

                        const ro = key == 'x' ? relativeOriginX : relativeOriginY;
                        const dist = key == 'x' ? distanceX : distanceY;
                        const a1 = key == 'x' ? xA1 : yA1;
                        const a2 = key == 'x' ? xA2 : yA2;
                        
                        const 
                            logz1 = [a1, a2 - (dist * log)], 
                            logz2 = [a1 - (dist * log), a2];

                        if (ro > z1 && ro <= z2) {
                            domain = key == 'x' ? logz2 : logz1; 
                        }
                        else if (ro > z2 && ro <= z3) {
                            domain = [a1 - dist, a2 - dist];
                        }
                        else if (ro > z3 && ro <= z4) {
                            domain = key == 'x' ? logz1 : logz2;
                        }
                        
                        if (key == 'x') {
                            axisDragProps?.onCoordXChange(domain);
                        } 
                        else {
                            axisDragProps?.onCoordYChange(domain);
                        }
                          
                    });
                    document.body.appendChild(dragContainer);
                }

                if (axisDragProps.panState) {
                    return <g>
                        <rect
                            onMouseDown={(e: any) => dragHandle(e, 'pan')}
                            x={props.yAxisMap[0].width + props.yAxisMap[0].x} 
                            y={props.yAxisMap[0].y} 
                            width={props.xAxisMap[0].width} 
                            height={props.yAxisMap[0].height} 
                            style={{opacity: 0, cursor: 'all-scroll'}}
                        />   
                    </g>
                }

                return (
                    <g>
                        {/* TODO apply to multiple axis, this only applies to the first x and y axis currently */}
                        {/* x axis */}
                        <rect 
                            onMouseDown={(e: any) => dragHandle(e, 'x')}
                            x={props.xAxisMap[0].x} 
                            y={props.xAxisMap[0].y} 
                            width={props.xAxisMap[0].width} 
                            height={props.height-props.xAxisMap[0].y} 
                            style={{opacity: 0, cursor: 'e-resize'}}
                        />
                        {/* origin */}
                        <rect 
                            onMouseDown={(e: any) => dragHandle(e, 'xy')}
                            x={props.yAxisMap[0].x} 
                            y={props.xAxisMap[0].y} 
                            width={props.yAxisMap[0].width} 
                            height={props.height-props.xAxisMap[0].y} 
                            style={{opacity: 0, cursor: 'ne-resize'}}
                        />
                        {/* y axis */}
                        <rect 
                            onMouseDown={(e: any) => dragHandle(e, 'y')}
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