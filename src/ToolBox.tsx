import React from 'react';
import ReactDOM from 'react-dom';
import { Customized } from 'recharts';
import SelectionUtil from './utils/SelectionUtil';

export interface ToolBoxProps {
    children: JSX.Element | JSX.Element[] | string;
}
export type Props = ToolBoxProps;

export const ToolBox = (props: ToolBoxProps) => {
    const toolbarRef = React.useRef(null);
    const containerRef = React.useRef(null);
    const [parent, setParent] = React.useState(null);
    const [toolbarComponents, setToolbarComponents] = React.useState(null);

    const [yAxisDomain, setYAxisDomain] = React.useState([0, 'auto']); 
    const [xAxisDomain, setXAxisDomain] = React.useState([0, 'auto']);

    const [zoomState, setZoomState] = React.useState(null)
    const [selectCoords, setSelectCoords] = React.useState(null);
    const toolbox_graph_ref = React.useRef(
        `toolbox_ref_${Date.now().toString(36) + Math.random().toString(36).substring(0,2)}`
    )

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

    const createProxy = (component: any) => (
        <Customized component={(customizedProps: any) => (
            toolbarRef.current ? ReactDOM.createPortal(component(customizedProps), toolbarRef.current) : null
        )}/>
    );

    const ToolBar = createProxy((customizedProps: any) => {
        return React.createElement(//TODO clone instead
            'div', 
            {
                style: {display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: '5px'}
            }, 
            React.Children.map(toolbarComponents?.props.children, child => {
              
                return React.cloneElement(
                    child, 
                    {
                        ...customizedProps, 
                        graph_uid: toolbox_graph_ref.current,
                        yAxisDomain, 
                        setYAxisDomain,
                        zoomState,
                        setZoomState,
                        selectCoords
                    }
                );
            })
        )
    });

    const children = parent && React.Children.map(
        parent.props.children.concat(
            [
                ToolBar, 
                zoomState && SelectionUtil({
                    onCoordChange: (coords: any) => setSelectCoords(coords), 
                    setZoomState, 
                    yAxisDomain,
                    offsetLeft: containerRef.current ? containerRef.current.offsetLeft : 0
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
                        domain: yAxisDomain
                    })
                case "XAxis":
                    return React.cloneElement(child, { allowDataOverflow: true, })
                default:
                    return React.cloneElement(child)
            };
        }
    );
    
    return (
        <div ref={containerRef} style={{position: 'relative'}}>
            
            <div ref={toolbarRef} style={{position: 'absolute', top: 0, left: parent && parent.props.width }} />

            {parent &&
                React.cloneElement(
                    parent, 
                    {
                        // data: parent.props.data
                        //     .map((point: any) => ({date: new Date(point.date).getTime()/1000, price: point.price})),
                        id: toolbox_graph_ref.current
                    }, 
                    children
                )
            }
        </div>
    );
};