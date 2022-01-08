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
    }, []);
    
    //huh??
    const proxy = () => (//needs to be hoc
        <Customized component={(customizedProps: any) => {
            React.useEffect(() => {
                graphStatetRef.current = customizedProps
                // console.log(customizedProps)
                if (hasSet == false) {
                    setHasSet(true)
                } else {
                    return;
                }
            }, [customizedProps])
            
            return null;
        }}/>
    );
    
    const children = () => parent && React.Children.map(
        parent.props.children.concat(
            [
                proxy(),
                //TODO merge to use the same overlay
                TooltipUtil({//TODO: should always display
                    mode: tooltipMode,
                    onCoordChange: (payload: any) => {
                        setTooltipCoord(payload)
                    }
                }),
                selectState && SelectionUtil({
                    mode: selectState,
                    onCoordChange: (coords: any) => setSelectCoords(coords), 
                    setSelectState, 
                    yAxisDomain,
                    xAxisDomain,
                    offsetLeft: containerRef.current ? containerRef.current.offsetLeft : 0
                }),
                AxisDragUtil({//disable if axis is no difined
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
                }),
               
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
                        scale: 'linear'
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
                                                    setTooltipMode
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

            {tooltipCoord &&  <CustomTooltip {...{tooltipMode, tooltipCoord}}/> }
        </div>
    );
};