import React from 'react';
import { resolveAxis, isInPolygon, uid } from './helpers';
import { scaleLinear } from 'd3-scale';
import usePrevious from './usePrevious';

let select_wasMoved = false, maskInterval: any
const SelectionUtil = (selectionProps: any)  => {
    //TODO handle padding/margin, other offsets
    const props = selectionProps.graphProps;
    const [originalStart, setOriginalStart] = React.useState(null);
    const [start, setStart] = React.useState(null);
    const [end, setEnd] = React.useState(null);
    // const previousPoint = usePrevious(end);

    const [path, setPath] = React.useState("");
    const [canvasItems, setCanvasItems]: any = React.useState({});
    const [drawContext, setDrawContext] = React.useState(null);
    const [maskOpacity, setMaskOpacity] = React.useState(0);
    
    const [vYmap, setVYMAP] = React.useState([]);
    const [vXmap, setVXMAP] = React.useState([]);

    const normalise = (value: number, max: number, min: number = 0) => (value-min)/(max-min);

    React.useEffect(() => {//TODO use <style />
        if (maskOpacity > 0.3) {
            clearInterval(maskInterval);
            maskInterval = null;
            return;
        }
    }, [maskOpacity])

    const onMouseDown = (e: any) => {
        setStart(null); setEnd(null);
        const bbox = e.target.getBoundingClientRect();
        
        const x = e.clientX - selectionProps.offsetLeft, y =  e.clientY - bbox.top + props.yAxisMap[0].y

        setStart({x, y}); 
        setOriginalStart({x, y})

        //TODO replace with <style />
        maskInterval = setInterval(() => {
            setMaskOpacity(prev => prev+0.01);
        }, 2);
        select_wasMoved = true;
    }

    const onMouseMove = (e: any) => {
        if (select_wasMoved) {
            const bbox = e.target.getBoundingClientRect();

            const x = e.clientX - selectionProps.offsetLeft;
            const y = e.clientY - bbox.top + props.yAxisMap[0].y;
            
            const directionX = normalise(x - originalStart.x, originalStart.x);
            const directionY = normalise(y - originalStart.y, originalStart.y);

            if (directionY < 0.075 && directionY > -0.075) {
                setStart({x: originalStart.x, y: 0})
                setEnd({x, y: props.yAxisMap[0].height + bbox.top + props.yAxisMap[0].y}) //TODO test
            } 
            else if (directionX < 0.075 && directionX > -0.075) {
                setStart({x: 0, y: originalStart.y})
                setEnd({x: props.xAxisMap[0].width + props.yAxisMap[0].width + props.yAxisMap[0].x, y})
            } 
            else {
                setStart(originalStart);
                setEnd({x, y});
            }
        }
    }

    const onMouseUp = (e: any) => {
        setMaskOpacity(0);

        select_wasMoved = false;

        selectionProps?.setSelectState(null);
        
        const x1 = start.x < end.x ? start.x : end.x;
        const y1 = start.y < end.y ? start.y : end.y;
        const x2 = start.x > end.x ? start.x : end.x;
        const y2 = start.y > end.y ? start.y : end.y;

        if (selectionProps.mode == "zoom" || selectionProps.mode == null) {
            const [yA1, yA2] = resolveAxis(props, selectionProps.yAxisDomain);
            const [xA1, xA2] = resolveAxis(props, selectionProps.xAxisDomain);
           
            selectionProps?.onCoordChange({
                type: selectionProps.mode,
                yDomain: [
                    (yA2 - ( (yA2 - yA1) * (y2 - props.yAxisMap[0].y)/(props.yAxisMap[0].height) ) ) ,
                    (yA2 - ( (yA2 - yA1) * (y1 - props.yAxisMap[0].y)/(props.yAxisMap[0].height) ) ) ,
                ],
                xDomain: [
                    (xA1 - ( (xA1 - xA2) * (x1 - props.xAxisMap[0].x)/(props.xAxisMap[0].width) ) ) ,
                    (xA1 - ( (xA1 - xA2) * (x2 - props.xAxisMap[0].x)/(props.xAxisMap[0].width) ) ) ,
                ]
            })
        }
        else if (selectionProps.mode == "select") {
            //return the same as recharts tooltips api
            selectionProps?.onCoordChange({
                type: selectionProps.mode,
                selectedPoints: props.formattedGraphicalItems
                    .reduce((acc: any, items: any) => acc.concat(items.props.points), [])
                    .filter((point: any) => {
                        if (point.x >=  x1 && point.x <= x2 && point.y >= y1 && point.y <= y2) {
                            return point;
                        }
                    })
            })
        }
        
    }

    const onLasoMouseDown = (e: any) => {
        select_wasMoved = true;
        setPath("");
        setVYMAP([]);
        setVXMAP([]);

        const bbox = e.target.getBoundingClientRect();
        const x = e.clientX - selectionProps.offsetLeft, y = e.clientY - bbox.top + props.yAxisMap[0].y
        setPath(`M${x},${y}`)
    }
    const onLasoMouseMove = (e: any) => {
        if (select_wasMoved) {
            const bbox = e.target.getBoundingClientRect();
            const x = e.clientX - selectionProps.offsetLeft, y = e.clientY - bbox.top + props.yAxisMap[0].y
            let newPath = path;
            if (path.substring(path.length - 1, path.length) == "Z") {
                newPath = path.substring(0, path.length - 1) 
            }
            setPath(newPath + `L${x},${y}Z`);
            setVXMAP(vXmap.concat([x]))
            setVYMAP(vYmap.concat([y]))
        }
    }
    const onLasoMouseUp = (e: any) => {
        select_wasMoved = false;

        selectionProps?.onCoordChange({
            type: 'laso',
            selectedPoints: props.formattedGraphicalItems
                .reduce((acc: any, items: any) => acc.concat(items.props.points), [])
                .filter((point: any) => {
                    return isInPolygon(vXmap.length, vXmap, vYmap, point.x, point.y);
                })
        });
    }

    const mousetocoord = (x: number, y: number) => {
        const [yA1, yA2] = resolveAxis(props, selectionProps.yAxisDomain);
        const [xA1, xA2] = resolveAxis(props, selectionProps.xAxisDomain);
        const xcoord = (xA1 - ( (xA1 - xA2) * (x - props.xAxisMap[0].x)/(props.xAxisMap[0].width) ) );
        const ycoord = (yA2 - ( (yA2 - yA1) * (y - props.yAxisMap[0].y)/(props.yAxisMap[0].height) ) );

        return {
            x: xcoord,
            y: ycoord
        }
    }

    const onDrawDown = (e: any) => {
        select_wasMoved = true;

        const bbox = e.target.getBoundingClientRect();
        const x = e.clientX - selectionProps.offsetLeft, y = e.clientY - bbox.top + props.yAxisMap[0].y
    
        const id = uid();
        const items: any = canvasItems;
        const newItem = {
            type: selectionProps.drawType,
            id,
            points: [
                {
                    ...mousetocoord(x,y),
                    command: selectionProps.drawType == 'ellipse' && 'I'
                }
            ],
            
        };
        items[id] = newItem;
        setCanvasItems(items);
        setDrawContext(id);
    }
    const onDrawMove = (e: any) => {
        if (select_wasMoved) {
            if (selectionProps.drawType == 'polygon' || selectionProps.drawType == 'pen') {
                const bbox = e.target.getBoundingClientRect();
                const x = e.clientX - selectionProps.offsetLeft, y = e.clientY - bbox.top + props.yAxisMap[0].y

                const items: any = canvasItems;
                
                const item = canvasItems[drawContext];
                
                const newPoints = item.points.concat([mousetocoord(x,y)]);

                item.points = newPoints;

                items[drawContext] = item;

                setCanvasItems({...items})
            } 
            if (selectionProps.drawType == 'line') {
                const bbox = e.target.getBoundingClientRect();
                const x = e.clientX - selectionProps.offsetLeft, y = e.clientY - bbox.top + props.yAxisMap[0].y

                const items: any = canvasItems;
                
                const item = canvasItems[drawContext];
                
                item.points[1] = mousetocoord(x,y);

                items[drawContext] = item;

                setCanvasItems({...items})
            }
            if (selectionProps.drawType == 'rectangle') {
                const bbox = e.target.getBoundingClientRect();
                const x = e.clientX - selectionProps.offsetLeft, y = e.clientY - bbox.top + props.yAxisMap[0].y

                const items: any = canvasItems;
                
                const item = canvasItems[drawContext];
                const end = mousetocoord(x,y);
                const start = item.points[0];
                item.points[1] = {//top right
                    x: end.x,
                    y: start.y
                };
                item.points[2] = end;
                item.points[3] = {
                    x: start.x,
                    y: end.y
                }
                item.points[4] = start;

                items[drawContext] = item;

                setCanvasItems({...items})
            }
            if (selectionProps.drawType == 'ellipse') {
                const bbox = e.target.getBoundingClientRect();
                const x = e.clientX - selectionProps.offsetLeft, y = e.clientY - bbox.top + props.yAxisMap[0].y

                const items: any = canvasItems;
                
                const item = canvasItems[drawContext];
                const end = mousetocoord(x,y);
                const start = item.points[0];
                item.points[1] = {
                    x: start.x,
                    y: start.y - ((start.y-end.y)/2),
                    command: 'M'
                }
                item.points[2] = {
                    x: start.x,
                    y: start.y + ((start.y-end.y)/2),
                    command: 'C'
                }
               
                item.points[3] = {//top right
                    x: start.x + ((end.x-start.x)),
                    y: start.y,
                    command: 'CP'
                };
                item.points[4] = {
                    x: 0,
                    y: 0,
                    command: 'SF'
                }
                item.points[5] = {
                    x: end.x,
                    y: start.y - ((start.y-end.y)/2),
                    command: 'CP'
                }
               
                items[drawContext] = item;

                setCanvasItems({...items})
            }
        }
    }
    const onDrawUp = (e: any) => {
        select_wasMoved = false;
        setDrawContext(null);
    }

    //TODO multiple selections
    if (selectionProps.mode == "laso") {
        return (
            <g className='recharts-toolkit-laso-select-layer'>
                <path
                    d={path}
                    style={{
                        stroke: "white", 
                        strokeWidth: 1,
                        fillOpacity: 0.1,
                        fillRule: 'evenodd',
                    }}
                />
                <path
                    d={path}
                    style={{
                        strokeDasharray: "2,2",
                        stroke: "black", 
                        strokeWidth: 1,
                        fillOpacity: 0.1,
                        fillRule: 'evenodd',
                    }}
                />
                <rect 
                    onMouseDown={onLasoMouseDown}
                    onMouseMove={onLasoMouseMove}
                    onMouseUp={onLasoMouseUp}
                    x={props.yAxisMap[0].width + props.yAxisMap[0].x} 
                    y={props.yAxisMap[0].y} 
                    width={props.xAxisMap[0].width} 
                    height={props.yAxisMap[0].height} 
                    style={{opacity: 0, cursor: 'crosshair'}}
                />
            </g>
        )
    }

    if (selectionProps.mode == "select") {
        return (
            <g className='recharts-toolkit-box-select-layer'> 
                {(start && end) && <rect 
                    x={start.x < end.x ? start.x : end.x}
                    y={start.y < end.y ? start.y : end.y}
                    width={start.x < end.x ? end.x-start.x : start.x-end.x}
                    height={start.y < end.y ?  end.y-start.y : start.y-end.y}
                    style={{
                        strokeDasharray: "3,3",
                        stroke: "black", 
                        strokeWidth: 1,
                        strokeOpacity: 1,
                        fillOpacity: 0.1,
                    }}
                />}
                <rect 
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    x={props.yAxisMap[0].width + props.yAxisMap[0].x} 
                    y={props.yAxisMap[0].y} 
                    width={props.xAxisMap[0].width} 
                    height={props.yAxisMap[0].height} 
                    style={{opacity: 0, cursor: 'crosshair'}}
                />
            </g>
        );
    }

    if (selectionProps.mode == "draw") {
        return (
            <g className='recharts-toolkit-draw-layer'>
                {
                    Object.keys(canvasItems).map((key: any) => {
                        const item = canvasItems[key];
                        const xmap = item.points.map((point: any) => point.x);
                        const ymap = item.points.map((point: any) => point.y);

                        return (
                            <path
                                key={key}
                                d={xmap.reduce((acc: string, x: number, index: number) => {
                                    const [yA1, yA2] = resolveAxis(props, selectionProps.yAxisDomain);
                                    const [xA1, xA2] = resolveAxis(props, selectionProps.xAxisDomain);
                                    const command = item.points[index].command
            
                                    const scalex = scaleLinear()
                                        .domain([xA1, xA2])
                                        .range([0, props.xAxisMap[0].width]);
                                    const scaley = scaleLinear() 
                                        .domain([yA1, yA2])
                                        .range([props.yAxisMap[0].height, 0]);
                                    const xPos = scalex(x) + props.yAxisMap[0].width + props.yAxisMap[0].x
                                    const yPos = scaley(ymap[index]) + props.yAxisMap[0].y 
                                    if (index == 0 || command == 'M') {
                                        return  `M${xPos},${yPos}`
                                    } else if (index > 0 ) {
                                        if (command == "C") {

                                        }
                                        // if (ry == null) ry = rx;
                                        // return `
                                        //     M${cx-rx} ${cy}a${rx} ${ry} 
                                        //     0 1 0 ${rx*2} 0a${rx},${ry} 
                                        //     0 1 0 -${rx*2},0`;

                                        if (command == null || command == "L") {
                                            return  acc + `L${xPos},${yPos}`
                                        } 
                                        // if (command == "C") {
                                        //     return  acc + `A${xPos},${yPos}`
                                        // }
                                        // if (command == "CP") {
                                        //     return  acc + `,${xPos},${yPos}`
                                        // }
                                        // if (command == "SF") {
                                        //     return  acc + `,1`
                                        // }
                                    } else {
                                        //Z
                                    }
                                    
                                }, "")}
                                style={{
                                    stroke: "red", 
                                    strokeWidth: 1,
                                    fillOpacity: 0,
                                }}
                            />
                        );
                    })
                }
                
                <rect 
                    onMouseDown={onDrawDown}
                    onMouseMove={onDrawMove}
                    onMouseUp={onDrawUp}
                    x={props.yAxisMap[0].width + props.yAxisMap[0].x} 
                    y={props.yAxisMap[0].y} 
                    width={props.xAxisMap[0].width} 
                    height={props.yAxisMap[0].height} 
                    style={{opacity: 0, cursor: 'crosshair'}}
                />
            </g>
        )
    }

    if (selectionProps.mode == "ruler") {
        //TODO
    }

    if (selectionProps.mode == "zoom" || selectionProps.mode == null) {
        return (
            <g className='recharts-toolkit-zoom-layer'>
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
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    x={props.yAxisMap[0].width + props.yAxisMap[0].x} 
                    y={props.yAxisMap[0].y} 
                    width={props.xAxisMap[0].width} 
                    height={props.yAxisMap[0].height} 
                    style={{opacity: maskOpacity, cursor: 'crosshair'}}
                    mask="url(#selection_mask)" 
                />
                
            </g>
        )
    }
}
export default SelectionUtil;