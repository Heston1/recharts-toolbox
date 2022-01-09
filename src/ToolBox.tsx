import React from 'react';
import ReactDOM from 'react-dom';
import { Customized } from 'recharts';
import { CustomTooltip } from './general/CustomTooltip';
import AxisDragUtil from './utils/AxisDragUtil';
import SelectionUtil from './utils/SelectionUtil';
import TooltipUtil from './utils/TooltipUtil';
import { withFading } from './utils/withFading';

export interface ToolBoxProps {
    children: JSX.Element | JSX.Element[] | string;
}
export type Props = ToolBoxProps;

const uid = () => Date.now().toString(36) + Math.random().toString(36).substring(0,2);

export const ToolBox = (props: ToolBoxProps) => {
    const toolbox_graph_ref = React.useRef(`toolbox_ref_${uid()}`);

    const toolbarRef = React.useRef(null);
    const containerRef = React.useRef(null);
    const graphStatetRef = React.useRef(null);

    const [parent, setParent] = React.useState(null);
    
    const [toolbarComponents, setToolbarComponents] = React.useState(null);

    const [yAxisDomain, setYAxisDomain]: any = React.useState(['auto', 'auto']); 
    const [xAxisDomain, setXAxisDomain]: any = React.useState([1451865600, 1483056000]); // 1451865600, 1483056000

    const [selectState, setSelectState] = React.useState(null); //zoom, select, laso
    const [selectCoords, setSelectCoords] = React.useState(null);

    const [panState, setPanState] = React.useState(false);

    const [hasSet, setHasSet] = React.useState(false) //circular

    const [tooltipMode, setTooltipMode] = React.useState('closest'); //closest, compare
    const [tooltipCoord, setTooltipCoord] = React.useState(null);

    const [enableReferenceLines, setEnableReferenceLines] = React.useState(false);

    const [ticks, setTicks] = React.useState([])

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
                    //TODO handle other components
                    break;
            }
        }
        if (props.children instanceof Array) {
            props.children.forEach(child => {
                setComponents(child);
            })
        } else if (props.children instanceof Object) {
            setComponents(props.children);
        } else {
            //TODO render other
            setParent(null) //toolbar or chart not a child
        }   

        //TODO ohhh AxisDragUtil:12
        let tmp = [], x1 = xAxisDomain[0], x2 = xAxisDomain[1],tickCount = 5;
        for (let numTick = 0; numTick < tickCount; numTick++) {
            tmp.push((x1+(((x2-x1)/tickCount)*numTick)));
        }
        setTicks(tmp)
    }, [props.children]);

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
            if (child == null) {
                return;
            }
            //Acts as middleware to inject toolbox props into recharts components
            //TODO handle non-integer keys, datetime etc.
            switch (child.type.displayName) {
                case "YAxis":
                    return React.cloneElement(child, { 
                        allowDataOverflow: true, 
                        domain: yAxisDomain,
                        scale: 'linear'
                    })
                case "XAxis":
                    return React.cloneElement(child, { 
                        allowDataOverflow: true, 
                        domain: xAxisDomain,
                        scale: 'linear',
                        type: 'number',
                        ticks,
                        interval: 0,
                        tickFormatter: (tick: any) => {
                            //TODo change based on granularity
                            return new Date(tick.toFixed(0)*1000).toLocaleDateString('en-US');
                        }
                    })
                default:
                    return React.cloneElement(child)
            };
        }
    );

    return (
        <div ref={containerRef} style={{position: 'relative'}}>
           
            {   
                withFading({
                    element: <div
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
                                                    graph_uid: toolbox_graph_ref.current,
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
                                                    setTicks,
                                                }
                                            );
                                        })
                                    )
                                }   
                            </div>,
                    duration: 0.5,
                    isOut: false
                })
            }

            {parent &&
                React.cloneElement(
                    parent, 
                    {
                        id: toolbox_graph_ref.current
                    }, 
                    children()
                )
            }

            {/* is this really slower than adding it to customized? */}
            {/* drag layer */}
            {(graphStatetRef.current && hasSet) && 
                //TODO: needs to be component
                <svg width="600" height="400" viewBox='0 0 600 400' style={{position: 'absolute', top: 0, left: 0}}>

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
                        setTicks
                    }}/>

                    {selectState && <SelectionUtil {...{
                        graphProps: graphStatetRef.current,
                        mode: selectState,
                        onCoordChange: (coords: any) => setSelectCoords(coords), 
                        setSelectState, 
                        yAxisDomain,
                        xAxisDomain,
                        offsetLeft: containerRef.current ? containerRef.current.offsetLeft : 0
                    }} />}
                </svg>
                
            }  

            {/* tooltip layer */}
            {tooltipCoord &&  <CustomTooltip {...{tooltipMode, tooltipCoord}}/> }
        </div>
    );
};