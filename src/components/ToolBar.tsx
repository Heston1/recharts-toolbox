import React from 'react';
import { XAxis } from 'recharts';
import {GripIcon} from '../Icons';
import usePrevious from '../utils/usePrevious';
export interface ToolBarProps {
    displayMode?: 'visible' | 'hover' | 'hidden';
    style?: any; //TODO if function
}
export type Props = ToolBarProps;

export const ToolBar = (props: any) => {
    const {customizedProps, displayMode, style} = props;
    const toolbarRef = React.useRef(null);
    const [toolbarDimentions, setToolbarDimentions] = React.useState({width: 0, height: 0})
    const prevDimentions = usePrevious(toolbarDimentions);
    const [hover, setHover] = React.useState(false);

    React.useEffect(() => {
        if (toolbarRef?.current) {// && prevDimentions != toolbarDimentions
            const current = toolbarRef.current
            setToolbarDimentions({width: current.offsetWidth, height: current.offsetHeight});
        }
    }, [toolbarRef?.current])

    return (
        <div 
            onMouseOver={e => {
                setHover(true); //TODO: trigger if hover over graph
            }} 
            onMouseLeave={e => {
                setHover(false);
            }}
            
            style={{
                position: 'absolute',
                cursor: 'pointer',
                zIndex: 1,
                // opacity: displayMode == 'hover' && !hover ? 0: 1,
                ...style
            }}
        >   
        <span style={{
            display: 'table',
            zIndex: 1,
            transform: `translate3d(
                    ${
                        ((
                        customizedProps.xAxisMap[0].x 
                        + customizedProps.xAxisMap[0].width) 
                        - toolbarDimentions.width
                        - 5)
                    }px,
                    ${customizedProps.yAxisMap[0].y + 5}px, 
                    0)`,
        }}>
            <div
                style={{
                    backgroundColor: '#f0f0f0',
                    borderRadius: 5,
                    display:  'flex',
                    flexFlow: 'column wrap-reverse',
                    gap: '10px',
                    padding: 5,
                    textAlign: 'center',
                }}
                ref={toolbarRef}

            >
                <GripIcon style={{cursor: 'grab'}} color='grey'/>
                {props.children}
            </div>
        </span>
        </div>
    );
}