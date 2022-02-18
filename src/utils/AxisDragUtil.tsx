import React from 'react';
import { resolveAxis, calculateTimeSeriesTicks } from './helpers';
import { scaleLog, scaleLinear } from 'd3-scale';
import { Lock } from '../Icons';

let targetYMap: any, targetXMap: any, moving = false, adujustingDomainTimer: any = null;

const AxisDragUtil = (axisDragProps: any)  => {
    //TODO replace with d3 events
    const props = axisDragProps.graphProps;

    const createZones = (axisH: number) => {
        const
            z1 = 0,
            z2 = axisH * 1/10,
            z3 =  (axisH * 4/5)+z2,
            z4 =  (axisH * 1/10)+z3;

        return {z1, z2, z3, z4};
    }

    const dragHandle = (e: any, key: string, yAxisMap: any, xAxisMap: any, filters: any = []) => {
        e.persist();

        const bbox = e.target.getBoundingClientRect();
        const originY = e.pageY;
        const originX = e.pageX;
        const relativeOriginY = e.clientY - bbox.top;
        const relativeOriginX = e.clientX - bbox.left;
       
        targetYMap = axisDragProps.yAxisDomainMap
        targetXMap = axisDragProps.xAxisDomainMap
        
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
        
        const clearTimer = () => {
            if (adujustingDomainTimer != null) {
                clearTimeout(adujustingDomainTimer);
                adujustingDomainTimer = null;
            }
        }

        clearTimer();
        if (e.detail == 1) { //adjust 
            adujustingDomainTimer = setTimeout(() => {
                

                const ro = key == 'x' ? relativeOriginX : relativeOriginY;

                const {z1, z2, z3, z4} = createZones(
                    key == 'x' ? xAxisMap[0].width : yAxisMap[0].height
                ); 
                const axis = key == 'x' ? xAxisMap[0] : yAxisMap[0];
                const id = key == 'x' ? axis.xAxisId : axis.yAxisId;
                const targetMap = key == 'x' ? targetXMap[id] : targetYMap[id];
                const axisId = key == 'x' ? 'xAxis' : 'yAxis'
                const [a1, a2] = resolveAxis(
                    props, 
                    targetMap, 
                    null, 
                    id, 
                    axisId
                ); 
                    // console.log(axis, id, targetMap, a1, a2)
                if (ro > z1 && ro <= z2) {
                    addManuallyAdjustableInputs(e, key, a2, [a1, a2], axis, 1);
                }
                else if (ro > z3 && ro <= z4) {
                    addManuallyAdjustableInputs(e, key, a1, [a1, a2], axis, 0);
                }
            }, 400);
        } else if (e.detail == 2) {//reset
            clearTimer();

            setTimeout(() => {
                Object.keys(xAxisMap).length > 0 && axisDragProps.onBatchCoordXChange(
                    Object.keys(xAxisMap).reduce((aggregate: any, key: string) => {
                        const xAxis = xAxisMap[key];
                        const targetX = targetXMap[xAxis.xAxisId];

                        const domain = axisDragProps.originalResolvedDomainX[xAxis.xAxisId].domain;
                        
                        if (axisDragProps.originalXAxisType(xAxis.xAxisId) != 'category') {
                            calculateTimeSeriesTicks(5, targetX, domain, axisDragProps.setTicks);
                        }

                        return {...aggregate, [xAxis.xAxisId]: domain}
                    }, {})
                );

                Object.keys(yAxisMap).length > 0 && axisDragProps.onBatchCoordYChange(
                    Object.keys(yAxisMap).reduce((aggregate: any, key: string) => {
                        const yAxis = yAxisMap[key];

                        const domain = axisDragProps.originalResolvedDomainY[yAxis.yAxisId].domain;
                        
                        return {...aggregate, [yAxis.yAxisId]: domain}
                    }, {})
                );
            }, 250);

            return;
        }
       
        dragContainer.setAttribute('id', 'drag-overlay-root');
        moving = true;
        
        dragContainer.addEventListener('mouseup', (ev: any) => {
            dragContainer.remove(); 
            moving = false; 
            dragContainer = null;
            // clearTimer();
        });

        dragContainer.addEventListener('mousemove', (ev: any) => {
            if (!moving) 
                return;

            clearTimer();
            
            const movingRelativeOriginY = ev.clientY - bbox.top;
            const movingRelativeOriginX = ev.clientX - bbox.left;

            const cursorPosY = originY - ev.pageY;
            const cursorPosX = originX - ev.pageX;

            //TODO magnet at original domain
            const logScaleFuntionEnd = (a1: number, a2: number, axisSize: number, cursorPos: number) => {
                return scaleLog()
                    .domain([axisSize, 1])
                    .range([a2, (a1+((a2-a1)*10))])
                    (clamp(cursorPos, axisSize));
            }
                

            const logScaleFunctionStart = (a1: number, a2: number, axisSize: number, cursorPos: number) => {
                return scaleLog()
                    .domain([axisSize, 1])
                    .range([a1, (a2-((a2-a1)*10))])
                    (clamp(cursorPos, axisSize));
            }
                
            const clamp = (cursorPos: number, axisSize: number) => {
                if (cursorPos > axisSize*2) {
                    return axisSize*2;
                }

                if (cursorPos < 1) {
                    return 1;
                } 

                return cursorPos;
            }

            const resolveDomain = (
                a1: number, a2: number, 
                axisSize: number, 
                logscaleTop: number, 
                logscalebottom: number,
                ro: number, dist: number
            ) => {
                const {z1, z2, z3, z4} = createZones(axisSize); 
                let domain: any = [];

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

                return domain;
            }

            const dragHandlerX = (targetX: any, xAxis: any) => {
                const [xA1, xA2] = resolveAxis(
                    props, 
                    targetX, 
                    axisDragProps.originalXAxisType(xAxis.xAxisId), xAxis.xAxisId, 
                    'xAxis'
                ); 
                const tickSizeX = (xA2-xA1)/xAxis.width;
                const distanceX = cursorPosX*tickSizeX  * -1;

                const axisSize = xAxis.width;

                const ro =  relativeOriginX;
                const dist = distanceX;
                const a1 = xA1;
                const a2 = xA2;

                const logscaleTop = logScaleFuntionEnd(a1, a2, axisSize, movingRelativeOriginX);
                const logscalebottom = logScaleFunctionStart(a1, a2, axisSize, xAxis.width-movingRelativeOriginX);

                return  {
                    xAxisDomain: [xA1, xA2],
                    domain: resolveDomain(a1, a2, axisSize, logscaleTop, logscalebottom, ro, dist)
                };
            }

            const dragHandlerY = (targetY: any, yAxis: any) => {
                const [yA1, yA2] = resolveAxis(
                    props, 
                    targetY, 
                    null, 
                    yAxis.yAxisId, 
                    'yAxis'
                ); 
                const tickSizeY = (yA2-yA1)/yAxis.height;
                const distanceY = cursorPosY*tickSizeY;
                
                const axisSize = yAxis.height;

                const ro = relativeOriginY;
                const dist = distanceY;
                const a1 = yA1;
                const a2 = yA2;
    
                const logscaleTop = logScaleFuntionEnd(a1, a2, axisSize, yAxis.height-movingRelativeOriginY);
                const logscalebottom = logScaleFunctionStart(a1, a2, axisSize, movingRelativeOriginY);
                
                return  {
                    yAxisDomain: [yA1, yA2],
                    domain: resolveDomain(a1, a2, axisSize, logscaleTop, logscalebottom, ro, dist)
                };
            }

            const applyBatchUpdate = (domainX: any, domainY: any) => {
                Object.keys(xAxisMap).length > 0 && axisDragProps.onBatchCoordXChange(
                    Object.keys(xAxisMap).reduce((aggregate: any, key: string) => {
                        const xAxis = xAxisMap[key];
                        const targetX = targetXMap[xAxis.xAxisId];

                        const { xAxisDomain } = dragHandlerX(targetX, xAxis);
                        const [xA1, xA2] = xAxisDomain;

                        const domain = domainX(xA1, xA2, xAxis.width, xAxis);
                        
                        if (axisDragProps.originalXAxisType(xAxis.xAxisId) != 'category') {
                            calculateTimeSeriesTicks(5, targetX, domain, axisDragProps.setTicks);
                        }

                        return {...aggregate, [xAxis.xAxisId]: domain}
                    }, {})
                );

                Object.keys(yAxisMap).length > 0 && axisDragProps.onBatchCoordYChange(
                    Object.keys(yAxisMap).reduce((aggregate: any, key: string) => {
                        const yAxis = yAxisMap[key];

                        const { yAxisDomain } = dragHandlerY(targetYMap[yAxis.yAxisId], yAxis);
                        const [yA1, yA2] = yAxisDomain;

                        const domain = domainY(yA1, yA2, yAxis.height, yAxis);
                        
                        return {...aggregate, [yAxis.yAxisId]: domain}
                    }, {})
                );
            }

            if (key == 'x') {
                Object.keys(xAxisMap).map((key: string) => {
                    const xAxis = xAxisMap[key];
                    const targetX = targetXMap[xAxis.xAxisId];

                    const { domain } = dragHandlerX(targetX, xAxis);
                    
                    axisDragProps.onCoordXChange(domain, xAxis.xAxisId);
                    
                    if (axisDragProps.originalXAxisType(xAxis.xAxisId) != 'category') {
                        calculateTimeSeriesTicks(5, targetX, domain, axisDragProps.setTicks);
                    }
                });

                return;
            } 

            if (key == 'y') {
                Object.keys(yAxisMap).map((key: string) => {
                    const yAxis = yAxisMap[key];

                    const { domain } = dragHandlerY(targetYMap[yAxis.yAxisId], yAxis);
                    
                    axisDragProps.onCoordYChange(domain, yAxis.yAxisId);
                });

                return;
            }

            if (key == 'xy') {
                applyBatchUpdate(
                    (xA1: number, xA2: number, size: number, xAxis: any) => [
                        logScaleFunctionStart(xA1, xA2, size,  xAxis.width-movingRelativeOriginX), 
                        xA2
                    ],
                    (yA1: number, yA2: number, size: number, yAxis: any) => [
                        logScaleFunctionStart(yA1, yA2, size, yAxis.height-(movingRelativeOriginY*-1)), 
                        yA2
                    ]
                );

                return;
            }

            if (key == 'xy-end') {
                applyBatchUpdate(
                    (xA1: number, xA2: number, size: number, xAxis: any) => [
                        xA1,  
                        logScaleFuntionEnd(xA1, xA2, size, xAxis.width+movingRelativeOriginX)
                    ],
                    (yA1: number, yA2: number, size: number, yAxis: any) => [
                        yA1, 
                        logScaleFuntionEnd(yA1, yA2, size, (yAxis.height+yAxis.y)-movingRelativeOriginY)
                    ]
                );

                return;
            }

            if (key == 'y-end') {
                applyBatchUpdate(
                    (xA1: number, xA2: number, size: number, xAxis: any) => [
                        logScaleFunctionStart(xA1, xA2, size, xAxis.width-movingRelativeOriginX), 
                        xA2
                    ],
                    (yA1: number, yA2: number, size: number, yAxis: any) => [
                        yA1, 
                        logScaleFuntionEnd(yA1, yA2, size, yAxis.height-movingRelativeOriginY)
                    ]
                );

                return;
            }

            if (key == 'x-end') {
                applyBatchUpdate(
                    (xA1: number, xA2: number, size: number, xAxis: any) => [
                        xA1,  
                        logScaleFuntionEnd(xA1, xA2, size, xAxis.width-movingRelativeOriginX*-1)
                    ],
                    (yA1: number, yA2: number, size: number, yAxis: any) => [
                        logScaleFunctionStart(yA1, yA2, size, yAxis.height-movingRelativeOriginY*-1),
                        yA2
                    ]
                );

                return;
            }
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

    //TODO
    const addManuallyAdjustableInputs = (e: any, key: string, value: any, domain: any, axis: any, updateIndex: number) => {
        let dragContainer = document.createElement('div'), input = document.createElement('input');

        const update = (updateValue: any) => {
            const updatedDomain = updateIndex == 0 ? [updateValue, domain[1]] : [domain[0], updateValue];
            
            if (key == 'x') {
                axisDragProps.onCoordXChange(updatedDomain, axis.xAxisId);
            } else if (key == 'y') {
                axisDragProps.onCoordYChange(updatedDomain, axis.yAxisId);
            }
        }

        dragContainer.setAttribute(
            'style', 
            `
                position:fixed;
                top:0;
                bottom:0;
                left:0;
                right:0;
                z-index:10000;
                cursor:text;
            `
        );
        
        dragContainer.addEventListener('click', (e: any) => {
            e.preventDefault();
            e.stopPropagation();

            update(parseFloat(e.target.value));
            dragContainer.remove();
        });

        input.setAttribute(
            'style',
            `
                background-color: #7474ff;
                color: white;
                width: 50px;
                height: 20px;
                z-index:10001;
                transform: translate(${e.clientX - 25}px, ${e.clientY - 10}px)
            `
        );

        input.setAttribute('value', value);
        input.addEventListener('click', (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            return;
        });
        input.addEventListener('focus', () => {
            input.select();
        });
        input.addEventListener('keyup', (e: any) => {
            if (e.keyCode === 13) {
                update(parseFloat(e.target.value));
                dragContainer.remove();
            }
        });

        dragContainer.setAttribute('id', 'drag-overlay-root');
        dragContainer.appendChild(input);
        document.body.appendChild(dragContainer);
        input.focus();
    }
    
    return (
        <g className='recharts-toolkit-drag-layer'>
            {/* x axis */}
            {Object.keys(props.xAxisMap).map((key: string) => {
                const xAxis = props.xAxisMap[key];

                return (
                    <rect 
                        onMouseDown={(e: any) => dragHandle(e, 'x', {}, {[xAxis.xAxisId]: xAxis})}
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
                    <g> 
                        <rect 
                            onMouseDown={(e: any) => dragHandle(e, 'y', {[yAxis.yAxisId]: yAxis}, {})}
                            x={yAxis.x} 
                            y={yAxis.y} 
                            width={yAxis.width} 
                            height={yAxis.height} 
                            style={{opacity: 0, cursor: 'n-resize'}}
                        />
                        <Lock x={yAxis.x + yAxis.width} y={yAxis.y} onClick={e => console.log("locked")} style={{cursor: 'pointer'}}/>
                    </g>
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