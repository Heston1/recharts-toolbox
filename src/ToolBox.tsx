import React from 'react';
import ReactDOM from 'react-dom';
import { Customized } from 'recharts';
import AxisDragUtil from './utils/AxisDragUtil';
import SelectionUtil from './utils/SelectionUtil';

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

    //TODO auto, fn
    const [yAxisDomain, setYAxisDomain]: any = React.useState([20, 120]); 
    const [xAxisDomain, setXAxisDomain]: any = React.useState([1451865600 - 10000000, 1483056000 - 10000000]);

    const [zoomState, setZoomState] = React.useState(null)
    const [selectCoords, setSelectCoords] = React.useState(null);

    const [panState, setPanState] = React.useState(false);

    const [hasSet, setHasSet] = React.useState(false) //circular

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
                zoomState && SelectionUtil({
                    onCoordChange: (coords: any) => setSelectCoords(coords), 
                    setZoomState, 
                    yAxisDomain,
                    xAxisDomain,
                    offsetLeft: containerRef.current ? containerRef.current.offsetLeft : 0
                }),
                panState && AxisDragUtil({
                    panState,
                    yAxisDomain,
                    xAxisDomain,
                    onCoordYChange: (coords: any) => {
                        setYAxisDomain(coords)
                    }, 
                    onCoordXChange: (coords: any) => {
                        setXAxisDomain(coords)
                    }, 
                }),
                AxisDragUtil({//disable if axis is no difined
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
                })
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
                                    graph_uid: toolbox_graph_ref.current,
                                    yAxisDomain, 
                                    setYAxisDomain,
                                    zoomState,
                                    setZoomState,
                                    selectCoords,
                                    setSelectCoords,
                                    panState,
                                    setPanState
                                }
                            );
                        })
                    )
                }   
            </div>

            {parent &&
                React.cloneElement(
                    parent, 
                    {
                        id: toolbox_graph_ref.current
                    }, 
                    children()
                )
            }
        </div>
    );
};