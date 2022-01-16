import React from 'react';
import { resolveAxis, isInPolygon } from './helpers';
import { scaleLinear } from 'd3-scale';

let select_wasMoved = false, maskInterval: any
const SelectionUtil = (selectionProps: any)  => {
    //TODO handle padding/margin, other offsets
    const props = selectionProps.graphProps;
    const [start, setStart] = React.useState(null);
    const [end, setEnd] = React.useState(null);
    const [path, setPath] = React.useState("");
    
    const [maskOpacity, setMaskOpacity] = React.useState(0);
    
    const [vYmap, setVYMAP] = React.useState([]);
    const [vXmap, setVXMAP] = React.useState([]);

    React.useEffect(() => {
        if (maskOpacity > 0.3) {
            clearInterval(maskInterval);
            maskInterval = null;
            return;
        }
    }, [maskOpacity])

    const onMouseDown = (e: any) => {
        setStart(null); setEnd(null);
        const bbox = e.target.getBoundingClientRect();
        
        setStart({x: e.clientX - selectionProps.offsetLeft, y: e.clientY - bbox.top + props.yAxisMap[0].y}); 
        //TODO replace with <style />
        maskInterval = setInterval(() => {
            setMaskOpacity(prev => prev+0.01);
        }, 2);
        select_wasMoved = true;
    }

    const onMouseMove = (e: any) => {
        if (select_wasMoved) {
            const bbox = e.target.getBoundingClientRect();

            setEnd({x: e.clientX - selectionProps.offsetLeft, y: e.clientY - bbox.top + props.yAxisMap[0].y});
        }
    }

    const onMouseUp = (e: any) => {
        setMaskOpacity(0);

        const bbox = e.target.getBoundingClientRect();

        setEnd({x: e.clientX - selectionProps.offsetLeft, y: e.clientY - bbox.top + props.yAxisMap[0].y});

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
        setVXMAP(vXmap.concat([xcoord]));
        setVYMAP(vYmap.concat([ycoord]));
    }

    const onDrawDown = (e: any) => {
        select_wasMoved = true;
        setPath("");
        setVYMAP([]);
        setVXMAP([]);

        const bbox = e.target.getBoundingClientRect();
        const x = e.clientX - selectionProps.offsetLeft, y = e.clientY - bbox.top + props.yAxisMap[0].y
        
        // TODO M if new position, maybe 2d array
        mousetocoord(x,y);
    }
    const onDrawMove = (e: any) => {
        if (select_wasMoved) {
            const bbox = e.target.getBoundingClientRect();
            const x = e.clientX - selectionProps.offsetLeft, y = e.clientY - bbox.top + props.yAxisMap[0].y

            mousetocoord(x,y);
        }
    }
    const onDrawUp = (e: any) => {
        select_wasMoved = false;
    }

    //TODO multiple selections
    if (selectionProps.mode == "laso") {
        return (
            <g>
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
            <g>
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
            <g>
                <path
                    d={vXmap.reduce((acc: string, x: number, index: number) => {
                        const [yA1, yA2] = resolveAxis(props, selectionProps.yAxisDomain);
                        const [xA1, xA2] = resolveAxis(props, selectionProps.xAxisDomain);

                        const scalex = scaleLinear()
                            .domain([xA1, xA2])
                            .range([0, props.xAxisMap[0].width]);
                        const scaley = scaleLinear() 
                            .domain([yA1, yA2])
                            .range([props.yAxisMap[0].height, 0]);
                        const xPos = scalex(x) + props.yAxisMap[0].width + props.yAxisMap[0].x
                        const yPos = scaley(vYmap[index]) + props.yAxisMap[0].y 
                        if (index == 0) {
                            return  `M${xPos},${yPos}`
                        } else if (index > 0) {
                            return  acc + `L${xPos},${yPos}`
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