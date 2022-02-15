import React from 'react';
import { resolveAxis, calculateTimeSeriesTicks } from './helpers';
import { scaleLog, scaleLinear } from 'd3-scale';

let targetYMap: any, targetXMap: any, moving = false;

const AxisDragUtil = (axisDragProps: any)  => {
    //TODO replace with d3 events
    const props = axisDragProps.graphProps;

    const dragHandle = (e: any, key: string, yAxisMap: any, xAxisMap: any) => {
        e.persist();
        const bbox = e.target.getBoundingClientRect();

        const originY = e.pageY;
        const originX = e.pageX;
        const relativeOriginY = e.clientY - bbox.top;
        const relativeOriginX = e.clientX - bbox.left;
       
        targetYMap = yAxisMap instanceof Object ? 
            Object.entries(axisDragProps.yAxisDomainMap).map(([key, value]: any) => value) : 
            [axisDragProps.yAxisDomainMap[yAxisMap.yAxisId]];
        targetXMap = xAxisMap instanceof Object ? 
            Object.entries(axisDragProps.xAxisDomainMap).map(([key, value]: any) => value) : 
            [axisDragProps.xAxisDomainMap[xAxisMap.xAxisId]];
        
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
            case 'y-end':
                cursor = 'se-resize';
                break;
            case 'x-end':
                cursor = 'nw-resize';
                break;
            case 'xy-end':
                cursor = 'sw-resize';
                break;
            case 'pan':
                cursor = 'all-scroll'
            default:
                //invalid key
                break;
        }
        if (document.getElementById('drag-overlay-root')) {
            console.warn("recharts-toolkit: drag handle was not removed");
        }
        let dragContainer = document.createElement('div');
        dragContainer.setAttribute(
            'style', 
            `
                position:fixed;
                top:0;
                bottom:0;
                left:0;
                right:0;
                z-index:10000;
                cursor:${cursor};
            `
        );
        
        dragContainer.setAttribute('id', 'drag-overlay-root');
        moving = true;

        dragContainer.addEventListener('mouseup', (ev: any) => {
            dragContainer.remove(); 
            moving = false; 
            dragContainer = null;
        });
        dragContainer.addEventListener('mousemove', (ev: any) => {
            if (!moving) 
                return;

            const movingRelativeOriginY = ev.clientY - bbox.top;
            const movingRelativeOriginX = ev.clientX - bbox.left;

            const cursorPosY = originY - ev.pageY;
            const cursorPosX = originX - ev.pageX;
            const axiss = Object.keys(targetXMap).length >= Object.keys(targetYMap).length ? targetXMap : targetYMap
           
            Array.from(Array(axiss.length).keys())
                .forEach((index: any) => {
                    // console.log(index)
                const targetX = targetXMap[index] || targetXMap[0];
                const targetY = targetYMap[index] || targetYMap[0];
                const xAxis = xAxisMap[index] || xAxisMap[0] || xAxisMap;
                const yAxis = yAxisMap[index] || yAxisMap[0] || yAxisMap;
               
                const [yA1, yA2] = resolveAxis(props, targetY); 
                const [xA1, xA2] = resolveAxis(props, targetX, axisDragProps.originalXAxisType(xAxis.xAxisId)); 
                


                const tickSizeY = (yA2-yA1)/yAxis.height;
                const tickSizeX = (xA2-xA1)/xAxis.width;
                const distanceY = cursorPosY*tickSizeY;
                const distanceX = cursorPosX*tickSizeX  * -1;
    
                if (key == 'pan'){  
                    const domainY = [yA1 - distanceY, yA2 - distanceY];
                    const domainX = [xA1 - distanceX, xA2 - distanceX];
    
                    axisDragProps?.onCoordYChange(domainY, yAxis.yAxisId);
                    axisDragProps?.onCoordXChange(domainX, xAxis.xAxisId);
                    if (axisDragProps.originalXAxisType(xAxis.xAxisId) != 'category') {
                        calculateTimeSeriesTicks(5, targetX, domainX, axisDragProps.setTicks);
                    }
                    return;
                }
    
                const axisH = key == 'x' ? xAxis.width : yAxis.height;
    
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
    
                const logscaletd = (a1: number, a2: number, key: string) => scaleLog()
                    .domain([key == 'x' ? xAxis.width : yAxis.height, 1])
                    .range([a2, (a1+((a2-a1)*10))]);
    
                const logscalebd = (a1: number, a2: number, key: string) => scaleLog()
                    .domain([key == 'x' ? xAxis.width : yAxis.height, 1])
                    .range([a1, (a2-((a2-a1)*10))]);
    
              
                const clamp = (cursorPos: number) => {
                    const axisLength = key == 'x' ? xAxis.width : yAxis.height;
                    if (cursorPos > axisLength*2) {
                        return axisLength*2;
                    }
    
                    if (cursorPos < 1) {
                        return 1;
                    } 
    
                    return cursorPos;
                }
    
    
                if (key == 'xy') {
                    //TODO add offsets, clean up
                    
                    const domainY = [logscalebd(yA1, yA2, 'y')(clamp(yAxis.height-(movingRelativeOriginY*-1))), yA2];
                    const domainX = [logscalebd(xA1, xA2, 'x')(clamp(xAxis.width-movingRelativeOriginX)), xA2];
                  
                    axisDragProps?.onCoordYChange(domainY, yAxis.yAxisId);
                    axisDragProps?.onCoordXChange(domainX, xAxis.xAxisId);
                    if (axisDragProps.originalXAxisType(xAxis.xAxisId) != 'category') {
                        calculateTimeSeriesTicks(5, targetX, domainX, axisDragProps.setTicks);
                    }
                    return;
                }
                if (key == 'xy-end') {
                    const domainY = [yA1, logscaletd(yA1, yA2, 'y')(clamp((yAxis.height+yAxis.y)-movingRelativeOriginY))];
                    const domainX = [xA1,  logscaletd(xA1, xA2, 'x')(clamp(xAxis.width+movingRelativeOriginX))];
    
                    axisDragProps?.onCoordYChange(domainY, yAxis.yAxisId);
                    axisDragProps?.onCoordXChange(domainX, xAxis.xAxisId);
                    if (axisDragProps.originalXAxisType(xAxis.xAxisId) != 'category') {
                        calculateTimeSeriesTicks(5, targetX, domainX, axisDragProps.setTicks);
                    }
                    return;
                }
                if (key == 'y-end') {
                    const domainY = [yA1, logscaletd(yA1, yA2, 'y')(clamp(yAxis.height-movingRelativeOriginY))];
                    const domainX = [logscalebd(xA1, xA2, 'x')(clamp(xAxis.width-movingRelativeOriginX)), xA2];
    
                    axisDragProps?.onCoordYChange(domainY, yAxis.yAxisId);
                    axisDragProps?.onCoordXChange(domainX, xAxis.xAxisId);
                    if (axisDragProps.originalXAxisType(xAxis.xAxisId) != 'category') {
                        calculateTimeSeriesTicks(5, targetX, domainX, axisDragProps.setTicks);
                    }
                    return;
                }
                if (key == 'x-end') {
                    const domainY = [logscalebd(yA1, yA2, 'y')(clamp((yAxis.height-movingRelativeOriginY*-1))), yA2];
                    const domainX = [xA1,  logscaletd(xA1, xA2, 'x')(clamp(xAxis.width-movingRelativeOriginX*-1))];
    
                    axisDragProps?.onCoordYChange(domainY, yAxis.yAxisId);
                    axisDragProps?.onCoordXChange(domainX, xAxis.xAxisId);
                    if (axisDragProps.originalXAxisType(xAxis.xAxisId) != 'category') {
                        calculateTimeSeriesTicks(5, targetX, domainX, axisDragProps.setTicks);
                    }
                    return;
                }
    
                //TODO magnatise at the original domain and the origin
                const logscaleTop = logscaletd(a1, a2, key)(
                    key == 'x' ? clamp(movingRelativeOriginX) : clamp(yAxis.height-movingRelativeOriginY)
                );
                const logscalebottom = logscalebd(a1, a2, key)(
                    key == 'x' ?  clamp(xAxis.width-movingRelativeOriginX) : clamp(movingRelativeOriginY)
                );
              
                const 
                    logz1 = [a1, logscaleTop], 
                    logz2 = [logscalebottom, a2];
    
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
                    axisDragProps?.onCoordXChange(domain, xAxis.xAxisId);
    
                    if (axisDragProps.originalXAxisType(xAxis.xAxisId) != 'category') {
                        calculateTimeSeriesTicks(5, targetX, domain, axisDragProps.setTicks);
                    }
                } 
                else {
                    // if (props.yAxisMap[0].type != 'category') {
                        axisDragProps?.onCoordYChange(domain, yAxis.yAxisId);
                    // }
                }
            });
        });
        document.body.appendChild(dragContainer);
    }

    if (axisDragProps.panState) {
        return <g>
            <rect
                onMouseDown={(e: any) => dragHandle(e, 'pan', props.yAxis[0], props.xAxis[0])}
                x={props.yAxisMap[0].width + props.yAxisMap[0].x} 
                y={props.yAxisMap[0].y} 
                width={props.xAxisMap[0].width} 
                height={props.yAxisMap[0].height} 
                style={{opacity: 0, cursor: 'all-scroll'}}
            />   
        </g>
    }

    //TODO when the top or bottom of the axis is clicked bring up an input to modify the domains manually
    // const adjustDomain = (e: any, key: string) => {
    //     let dragContainer = document.createElement('div'), input = document.createElement('input');
    //     dragContainer.setAttribute(
    //         'style', 
    //         `
    //             position:fixed;
    //             top:0;
    //             bottom:0;
    //             left:0;
    //             right:0;
    //             z-index:10000;
    //             cursor:text;
    //         `
    //     );
    //     input.setAttribute(
    //         'style',
    //         `
    //             background-color: #7474ff;
    //             color: white;
    //             width: 30px;
    //             height: 20px;
    //             transform: translate(${e.clientX}px, ${e.clientY}px)
    //         `
    //     )
    //     dragContainer.setAttribute('id', 'drag-overlay-root');
    //     dragContainer.appendChild(input)
    //     document.body.appendChild(dragContainer);
    // }
    
    return (
        <g className='recharts-toolkit-drag-layer'>
            {/* x axis */}
            {Object.keys(props.xAxisMap).map((key: string) => {
                const xAxis = props.xAxisMap[key];

                return (
                    <rect 
                        onMouseDown={(e: any) => dragHandle(e, 'x', props.yAxisMap[0], xAxis)}
                        x={xAxis.x} 
                        y={xAxis.y} 
                        width={xAxis.width} 
                        height={props.height-xAxis.y} 
                        style={{opacity: 0, cursor: 'e-resize'}}
                    /> 
                );
            })}

            {/* y axis */}
            {Object.keys(props.yAxisMap).map((key: string) => {
                const yAxis = props.yAxisMap[key];

                return (
                    <rect 
                        onMouseDown={(e: any) => dragHandle(e, 'y', yAxis, props.xAxisMap[0])}
                        x={yAxis.x} 
                        y={yAxis.y} 
                        width={yAxis.width} 
                        height={yAxis.height} 
                        style={{opacity: 0, cursor: 'n-resize'}}
                    />
                );
            })}
            
            {/* origin */}
            <rect 
                onMouseDown={(e: any) => dragHandle(e, 'xy', props.yAxisMap, props.xAxisMap)}
                x={props.yAxisMap[0].x} 
                y={props.xAxisMap[0].y} 
                width={props.yAxisMap[0].width}
                height={props.height-props.xAxisMap[0].y} 
                style={{opacity: 0, cursor: 'ne-resize'}}
            />

            {/* xy */}
            <rect 
                onMouseDown={(e: any) => dragHandle(e, 'xy-end', props.yAxisMap, props.xAxisMap)}
                x={props.xAxisMap[0].width + props.xAxisMap[0].x} 
                y={0} 
                width={props.width - props.yAxisMap[0].width + props.yAxisMap[0].x} 
                height={props.yAxisMap[0].y} 
                style={{opacity: 0, cursor: 'sw-resize'}}
            />

            {/* y end */}
            <rect 
                onMouseDown={(e: any) => dragHandle(e, 'y-end', props.yAxisMap, props.xAxisMap)}
                x={props.yAxisMap[0].x} 
                y={0} 
                width={props.yAxisMap[0].width}
                height={props.yAxisMap[0].y} 
                style={{opacity: 0, cursor: 'se-resize'}}
            />

            {/* x end */}
            <rect 
                onMouseDown={(e: any) => dragHandle(e, 'x-end', props.yAxisMap, props.xAxisMap)}
                x={props.xAxisMap[0].width + props.xAxisMap[0].x} 
                y={props.xAxisMap[0].y} 
                width={props.width - (props.yAxisMap[0].x + props.xAxisMap[0].width)} 
                height={props.height - props.xAxisMap[0].y} 
                style={{opacity: 0, cursor: 'nw-resize'}}
            />
        </g>
    )
}
export default AxisDragUtil;