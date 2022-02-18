import React from 'react';
import { Customized } from 'recharts';
import { CustomTooltip } from './general/CustomTooltip';
import AxisDragUtil from './utils/AxisDragUtil';
import { formatTimeSeriesTicks, uid, getData, getXAxisKey, getDomainOfDataByKey, convertXAxisToNumber } from './utils/helpers';
import SelectionUtil from './utils/SelectionUtil';
import TooltipUtil from './utils/TooltipUtil';
import { withFading } from './utils/withFading';
import { withResponsiveContainer } from './utils/withResponsiveContainer';
export interface ToolkitProps {
    children: JSX.Element | JSX.Element[] | string;
    width: number;
    height: number;
}
export type Props = ToolkitProps;

export enum ActionState {
    NONE,
    ZOOMSELECT,
    ZOOMIN, 
    ZOOMOUT, 
    PAN, 
    LASOSELECT,
    AUTOSCALE,
    CAMERA,
    DRAW
} 

export enum TooltipState {
    CLOSEST = 'closest',
    COMPARE = 'compare'
}

export const Toolkit = withResponsiveContainer((props: ToolkitProps) => {
    const toolkit_graph_ref = React.useRef(`toolkit_ref_${uid()}`);

    const toolbarRef = React.useRef(null);
    const containerRef = React.useRef(null);
    const graphStatetRef = React.useRef(null);

    const [parent, setParent] = React.useState(null);
    
    const [toolbarComponents, setToolbarComponents] = React.useState(null);

    const [yAxisDomainMap, setYAxisDomainMap]: any = React.useState({0: ['auto', 'auto']}); 
    const [xAxisDomainMap, setXAxisDomainMap]: any = React.useState({0: ['auto', 'auto']});

    const originalResolvedDomainX = React.useRef(null);
    const originalResolvedDomainY = React.useRef(null);

    const [selectState, setSelectState] = React.useState(ActionState.NONE);
    const [selectCoords, setSelectCoords] = React.useState(null);

    const [panState, setPanState] = React.useState(false);

    const [hasSet, setHasSet] = React.useState(false) //circular

    const [tooltipMode, setTooltipMode] = React.useState(TooltipState.CLOSEST);
    const [tooltipCoord, setTooltipCoord] = React.useState(null);

    const [enableReferenceLines, setEnableReferenceLines] = React.useState(false);

    const [ticks, setTicks] = React.useState([]);
    const [drawType, setDrawType] = React.useState('polygon');

    React.useEffect(() => {
        const setComponents = (child: any) => {
            switch (child.type.name) {
                case 'CategoricalChartWrapper':
                    setParent(child);
                    break;
                case 'ToolBar':
                    setToolbarComponents(child);
                    break;
                default:
                    if (child.type.name == null && child.props.children instanceof Object) {
                        if (child.props.children?.type.name == "CategoricalChartWrapper") {
                            setParent(child.props.children)
                        }
                    } 
                    break;
                    //TODO handle non svg elements
            }
        }
        if (props.children instanceof Array) {
            props.children.forEach(child => {
                setComponents(child);
            })
        } else if (props.children instanceof Object) {
            setComponents(props.children);
        } else {
            setParent(null);
            console.warn("CategoricalChartWrapper is not a child of Toolkit.")
        }   
    }, [props.children, props.width, props.height]);

    //TODO remove
    React.useEffect(() => {
        if (parent ) { 
            parent.props.children
                .filter((component: any) => component.type.name == 'XAxis' || component.type.name == 'YAxis')
                .forEach((axisElement: any, index: number) => {
                    if (axisElement.type.name == "XAxis") {
                        if (
                            typeof xAxisDomainMap[axisElement.props.xAxisId][0] == 'string' || 
                            typeof xAxisDomainMap[axisElement.props.xAxisId][1] == 'string'
                        ) {
                            const xAxis = getDomainOfDataByKey(
                                getData(parent), 
                                getXAxisKey(parent, axisElement.props.xAxisId), 
                                axisElement.props.type
                            ); //TODO
    
                            if (axisElement.props.type != 'category') {
                                let tmp = [], x1 = xAxis[0], x2 = xAxis[1], tickCount = 5;
                                for (let numTick = 0; numTick < tickCount; numTick++) {
                                    tmp.push((x1+(((x2-x1)/tickCount)*numTick)));
                                }
                                setTicks(tmp); //TODO by axis id
                            }
                            
                            //TODO
                            setXAxisDomainMap({...xAxisDomainMap, [axisElement.props.xAxisId]: xAxis});
                        }
                    } 
                    else if (axisElement.type.name == "YAxis") {
                        //TODO
                        setYAxisDomainMap({...yAxisDomainMap, [axisElement.props.yAxisId]: axisElement.props.domain})
                    }
                });
        }
    }, [parent])

    const proxy = () => (
        <Customized component={(customizedProps: any) => {
            React.useEffect(() => {
                graphStatetRef.current = customizedProps;
                
                if (hasSet == false) {
                    setHasSet(true);

                    originalResolvedDomainX.current = customizedProps.xAxisMap;
                    originalResolvedDomainY.current = customizedProps.yAxisMap;
                }
            }, [customizedProps])
            
            return null;
        }}/>
    );
        
    const children = () => parent && React.Children.map(
        parent.props.children.concat(
            [
                proxy(),
            ]
        ), 
        child => {
            if (child == null) {
                return;
            }
           
            const xAxisConfig = (child: any) => ({
                allowDataOverflow: true, 
                domain: xAxisDomainMap[child.props.xAxisId],
                scale: 'linear',
                type: 'number',
                ticks: child.props.type != 'category' ? ticks : null,
                interval: child.props.type != 'category' ? 0 : 0,
                tickFormatter: (tick: any) => {
                    if (child.props.type == "time") {
                        const date = new Date(tick.toFixed(0)*1000);
                        const interval = ((xAxisDomainMap[child.props.xAxisId][1]-xAxisDomainMap[child.props.xAxisId][0])/5);
                        
                        return formatTimeSeriesTicks(interval, date);
                    } 
                    else if (child.props.type == 'category') {
                        return parent.props.data[tick].name
                    }
                    else {
                        return tick
                    }
                }
            });

            if (child.type) {
                switch (child.type.displayName) {
                    case "YAxis":
                        return React.cloneElement(child, { 
                            allowDataOverflow: true, 
                            domain: yAxisDomainMap[child.props.yAxisId],
                            allowDecimals: false,
                            tickFormatter: (tick: any) => parseInt(tick), 
                            scale: 'linear',
                        })
                    case "XAxis":
                        return React.cloneElement(child, xAxisConfig(child))
                    //TODO disable dots when moving 
                    case "Line": 
                        return React.cloneElement(child, {
                        })
                    case "Area": 
                        return React.cloneElement(child, {
                        })
                    default:
                        return React.cloneElement(child)
                };
            } else {
                return React.cloneElement(child)
            }
        }
    );

    
    return (
        <div ref={containerRef} style={{position: 'relative'}}>
           
            {parent &&   
                withFading({
                    element: 
                            <div
                                ref={toolbarRef} 
                                style={{
                                    position: 'absolute', 
                                    top: 0, right: 0,left: 0, bottom: 0
                                }} 
                            >
                                {(graphStatetRef.current && hasSet) && 
                                    React.cloneElement(
                                        toolbarComponents,
                                        {
                                            customizedProps: graphStatetRef.current,
                                        },
                                        React.Children.map(toolbarComponents.props.children, child => {
                                            return React.cloneElement(
                                                child, 
                                                {
                                                    ...graphStatetRef.current, 
                                                    data: parent.props.data,
                                                    containerRef: containerRef.current,
                                                    graph_uid: toolkit_graph_ref.current,
                                                    yAxisDomainMap, 
                                                    setYAxisDomainMap,
                                                    xAxisDomainMap, 
                                                    setXAxisDomainMap,
                                                    selectState,
                                                    setSelectState,
                                                    selectCoords,
                                                    setSelectCoords,
                                                    panState,
                                                    setPanState,
                                                    tooltipMode,
                                                    setTooltipMode,
                                                    enableReferenceLines, 
                                                    setEnableReferenceLines,
                                                    ticks,
                                                    setTicks,
                                                    drawType,
                                                    setDrawType
                                                }
                                            );
                                        })
                                    )
                                }   
                            </div>
                            ,
                    duration: 0.5,
                    isOut: false
                })
            }

            {
                parent &&
                    React.cloneElement(
                        parent, 
                        {
                            id: toolkit_graph_ref.current,
                            width: props.width || parent.props.width,
                            height: props.height  || parent.props.height,
                            data: convertXAxisToNumber(parent.props.data)
                        }, 
                        children()
                    )
            }
          
            {(graphStatetRef.current && hasSet) && 
                //TODO: needs to be component
                <svg 
                    width={graphStatetRef.current.width} 
                    height={graphStatetRef.current.height} 
                    viewBox={`0 0 ${graphStatetRef.current.width} ${graphStatetRef.current.height}`} 
                    style={{position: 'absolute', top: 0, left: 0}}
                >

                    <TooltipUtil {...{
                        graphProps: graphStatetRef.current,
                        mode: tooltipMode,
                        tooltipCoord,
                        onCoordChange: (payload: any) => {
                            setTooltipCoord(payload);
                        },
                        setEnableReferenceLines,
                        enableReferenceLines,
                    }}/>

                    <AxisDragUtil {...{
                        graphProps: graphStatetRef.current,
                        panState,
                        yAxisDomainMap,
                        xAxisDomainMap,
                        offsetLeft: containerRef.current ? containerRef.current.offsetLeft : 0,
                        onCoordYChange: (domain: any, axisId: any) => {
                            //TODO disable tooltip, hide toolbar
                            setYAxisDomainMap({...yAxisDomainMap, [axisId]: domain});
                        }, 
                        onCoordXChange: (domain: any, axisId: any) => {
                            //TODO disable tooltip, hide toolbar
                            setXAxisDomainMap({...xAxisDomainMap, [axisId]: domain});
                        }, 
                        onBatchCoordYChange: (domainMap: any) => {
                            setYAxisDomainMap({...yAxisDomainMap, ...domainMap});
                        },
                        onBatchCoordXChange: (domainMap: any) => {
                            setXAxisDomainMap({...xAxisDomainMap, ...domainMap});
                        },
                        ticks,
                        setTicks,
                        //everything gets converted to type 'number'
                        originalXAxisType: (xAxisId: number) => 
                            parent.props.children.filter((n: any) => n.type.name == 'XAxis' && n.props.xAxisId == xAxisId)[0].props.type,
                        originalResolvedDomainX: originalResolvedDomainX.current,
                        originalResolvedDomainY: originalResolvedDomainY.current,
                    }}/>

                    {selectState && <SelectionUtil {...{
                        graphProps: graphStatetRef.current,
                        mode: selectState,
                        onCoordChange: (coords: any) => setSelectCoords(coords), 
                        setSelectState, 
                        yAxisDomainMap,
                        xAxisDomainMap,
                        drawType,
                        offsetLeft: containerRef.current ? containerRef.current.offsetLeft : 0
                    }} />}
                </svg>
                
            }  

            {/* tooltip layer */}
            {tooltipCoord &&  <CustomTooltip {...{tooltipMode, tooltipCoord}}/> }

        </div>
    );
});