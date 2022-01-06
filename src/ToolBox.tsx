import React from 'react';
import ReactDOM from 'react-dom';
import { Customized } from 'recharts';
import AxisDragUtil from './utils/AxisDragUtil';
import SelectionUtil from './utils/SelectionUtil';

export interface ToolBoxProps {
    children: JSX.Element | JSX.Element[] | string;
}
export type Props = ToolBoxProps;

export const ToolBox = (props: ToolBoxProps) => {
    const toolbox_graph_ref = React.useRef(
        `toolbox_ref_${Date.now().toString(36) + Math.random().toString(36).substring(0,2)}`
    );
    const toolbarRef = React.useRef(null);
    const containerRef = React.useRef(null);
    const graphStatetRef = React.useRef(null);

    const [parent, setParent] = React.useState(null);
    
    const [toolbarComponents, setToolbarComponents] = React.useState(null);

    //TODO
    const [yAxisDomain, setYAxisDomain] = React.useState([80, 130]); 
    const [xAxisDomain, setXAxisDomain] = React.useState([1451865600, 1483056000]); //TODO: auto

    const [zoomState, setZoomState] = React.useState(null)
    const [selectCoords, setSelectCoords] = React.useState(null);

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
    const proxy = (sourceRef: any, dest: any) => (
        <Customized component={(customizedProps: any) => {
            React.useEffect(() => {
                graphStatetRef.current = customizedProps
                if (hasSet == false) {
                    setHasSet(true)
                } else {
                    return;
                }
            }, [customizedProps])
            
            return sourceRef
                ? ReactDOM.createPortal(
                    <></>, dest) 
                : null
        }}/>
    );
    
    const children = () => parent && React.Children.map(
        parent.props.children.concat(
            [
                proxy(toolbarComponents, toolbarRef.current),
                zoomState && SelectionUtil({
                    onCoordChange: (coords: any) => setSelectCoords(coords), 
                    setZoomState, 
                    yAxisDomain,
                    offsetLeft: containerRef.current ? containerRef.current.offsetLeft : 0
                }),
                AxisDragUtil({
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
                        domain: xAxisDomain
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
                                    setSelectCoords
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
                        data: parent.props.data
                            .map((point: any) => ({date: new Date(point.date).getTime()/1000, price: point.price})),
                        id: toolbox_graph_ref.current
                    }, 
                    children()
                )
            }
        </div>
    );
};