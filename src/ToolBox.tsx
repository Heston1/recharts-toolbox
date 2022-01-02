import React from 'react';
import ReactDOM from 'react-dom';
import { Customized } from 'recharts';
import SelectionUtil from './utils/SelectionUtil';

export interface ToolBoxProps {
    children: JSX.Element | JSX.Element[] | string;
}
export type Props = ToolBoxProps;

export const ToolBox = (props: ToolBoxProps) => {
    const toolbarRef = React.useRef();
    const [parent, setParent] = React.useState();
    const [toolbarComponents, setToolbarComponents] = React.useState([]);

    //handle auto, and convert if passed in from props
    const [yAxisDomain, setYAxisDomain] = React.useState([0, 100]); 
    const [xAxisDomain, setXAxisDomain] = React.useState([0, 'auto']);

    const [zoomState, setZoomState] = React.useState()
    const [selectCoords, setSelectCoords] = React.useState();

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
            React.Children.map(toolbarComponents.props.children, child => {
                return React.cloneElement(
                    child, 
                    {
                        ...customizedProps, 
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
                zoomState && SelectionUtil({onCoordChange: (coords: any) => setSelectCoords(coords), setZoomState, yAxisDomain})
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
                    return React.cloneElement(child, { allowDataOverflow: true, domain: yAxisDomain })
                case "XAxis":
                    return React.cloneElement(child, { allowDataOverflow: true, })
                default:
                    return React.cloneElement(child)
            };
        }
    );
  
    return (
        <div style={{position: 'relative'}}>
            
            <div ref={toolbarRef} style={{position: 'absolute', top: 0, left: parent && parent.props.width }} />

            {parent &&
                React.cloneElement(
                    parent, 
                    {
                        data: parent.props.data
                            .map((point: any) => ({date: new Date(point.date).getTime()/1000, price: point.price}))
                    }, 
                    children
                )
            }
        </div>
    );
};