import React from 'react';
import { Customized } from 'recharts';
import { CustomTooltip } from './general/CustomTooltip';
import AxisDragUtil from './utils/AxisDragUtil';
import { formatTimeSeriesTicks, resolveAxis, uid, flatten, getData, getXAxisKey, getDomainOfDataByKey } from './utils/helpers';
import SelectionUtil from './utils/SelectionUtil';
import TooltipUtil from './utils/TooltipUtil';
// import usePrevious from './utils/usePrevious';
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

    const [yAxisDomain, setYAxisDomain]: any = React.useState(['auto', 'auto']); 
    const [xAxisDomain, setXAxisDomain]: any = React.useState(['auto', 'auto']); // 1451865600, 1483056000 //0, 5

    const [selectState, setSelectState] = React.useState(ActionState.NONE);
    const [selectCoords, setSelectCoords] = React.useState(null);

    const [panState, setPanState] = React.useState(false);

    const [hasSet, setHasSet] = React.useState(false) //circular

    const [tooltipMode, setTooltipMode] = React.useState(TooltipState.CLOSEST);
    const [tooltipCoord, setTooltipCoord] = React.useState(null);

    const [enableReferenceLines, setEnableReferenceLines] = React.useState(false);

    const [ticks, setTicks] = React.useState([])
    const [drawType, setDrawType] = React.useState('polygon')

    React.useEffect(() => {
        const setComponents = (child: any) => {
            switch (child.type.name) {
                case 'CategoricalChartWrapper':
                    console.log(child)
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
                    //TODO should we ignore others?
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
    }, [props.children]);


  
    React.useEffect(() => {
        if (parent && (typeof xAxisDomain[0] == 'string' || typeof xAxisDomain[1] == 'string')) { 
            const xAxis = getDomainOfDataByKey(getData(parent), getXAxisKey(parent), 'number'); //TODO
      
            let tmp = [], x1 = xAxis[0], x2 = xAxis[1], tickCount = 5;
            for (let numTick = 0; numTick < tickCount; numTick++) {
                tmp.push((x1+(((x2-x1)/tickCount)*numTick)));
            }
            setTicks(tmp)
            setXAxisDomain(xAxis)
        }
    }, [parent])

    const proxy = () => (
        <Customized component={(customizedProps: any) => {
            React.useEffect(() => {
                graphStatetRef.current = customizedProps
                // console.log(customizedProps)
                
                if (hasSet == false) {
                    setHasSet(true)
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
            if (child == null) {//TODO load proxy first
                return;
            }

            const xaxiselem = parent.props.children.filter((n: any) => n.type.name == 'XAxis')[0];
            const xAxisConfig = (child: any) => ({ //convert everything to number even category
                allowDataOverflow: true, 
                domain: xAxisDomain,
                scale: 'linear',
                type: 'number',
                ticks: xaxiselem.props.type != 'category' ? ticks : null,
                interval: xaxiselem.props.type != 'category' ? 0 : 0,
                tickFormatter: (tick: any) => {
                    if (child.props.type == "time") {
                        const date = new Date(tick.toFixed(0)*1000);
                        const interval = ((xAxisDomain[1]-xAxisDomain[0])/5);
                        
                        return formatTimeSeriesTicks(interval, date);
                    } 
                    else if (xaxiselem.props.type == 'category') {
                        return parent.props.data[tick].name
                    }
                    else {
                        return tick
                    }
                }
            })
            if (child.type) {
                switch (child.type.displayName) {
                    //handle multiple axis
                    case "YAxis":
                        return React.cloneElement(child, { 
                            allowDataOverflow: true, 
                            domain: yAxisDomain,
                            scale: 'linear'
                        })
                    case "XAxis":
                        return React.cloneElement(child, xAxisConfig(child))
                    case "Line": 
                        return React.cloneElement(child, { 
                            //TODO disable dots when moving cause its causing performance issues when there are lots of them
                            // dot: (prevXAxisDomain != xAxisDomain || prevYAxisDomain != yAxisDomain) ? null : true
                        })
                    case "Area": 
                        return React.cloneElement(child, { 
                            //TODO disable dots when moving cause its causing performance issues when there are lots of them
                            // dot: (prevXAxisDomain != xAxisDomain || prevYAxisDomain != yAxisDomain) ? null : true
                        })
                    default:
                        return React.cloneElement(child)
                };
            } else {
                return React.cloneElement(child)
            }
            
        }
    );

    const convertXAxisToNumber = (data: any) => {
        if (data && data[0] && typeof data[0].name ==  'string') {
            const tmp = data.map((point: any, index: any) => ({...point, name: index}))
            // console.log(tmp)
            return tmp
        }
        
        return data
    }

    return (
        <div ref={containerRef} style={{position: 'relative'}}>
           
            {parent &&   
                // withFading({
                //     element: 
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
                                                    yAxisDomain, 
                                                    setYAxisDomain,
                                                    xAxisDomain, 
                                                    setXAxisDomain,
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
                            // ,
                //     duration: 0.5,
                //     isOut: false
                // })
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
                        yAxisDomain,
                        xAxisDomain,
                        offsetLeft: containerRef.current ? containerRef.current.offsetLeft : 0,
                        onCoordYChange: (coords: any) => {
                            //TODO disable tooltip, hide toolbar
                            setYAxisDomain(coords)
                        }, 
                        onCoordXChange: (coords: any) => {
                            //TODO disable tooltip, hide toolbar
                            setXAxisDomain(coords)
                        }, 
                        ticks,
                        setTicks,
                        originalXAxisType: parent.props.children.filter((n: any) => n.type.name == 'XAxis')[0].props.type
                        
                    }}/>

                    {selectState && <SelectionUtil {...{
                        graphProps: graphStatetRef.current,
                        mode: selectState,
                        onCoordChange: (coords: any) => setSelectCoords(coords), 
                        setSelectState, 
                        yAxisDomain,
                        xAxisDomain,
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