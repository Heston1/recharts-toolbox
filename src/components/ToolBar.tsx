import React from 'react';
import { XAxis } from 'recharts';
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
        if (toolbarRef?.current && prevDimentions != toolbarDimentions) {
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
            ref={toolbarRef}
            style={{
                position: 'absolute',
                display: displayMode == 'hidden' ? 'none' : 'flex', 
                flexDirection: 'column', 
                flexWrap: 'wrap', 
                gap: '10px', 
                cursor: 'pointer',
                marginTop: customizedProps.yAxisMap[0].y + 5,
                marginLeft: (
                    (customizedProps.yAxisMap[0].width 
                        + customizedProps.yAxisMap[0].x 
                        + customizedProps.xAxisMap[0].width) 
                    - toolbarDimentions.width
                    - 5
                ),
                zIndex: 10,
                opacity: displayMode == 'hover' && !hover ? 0: 1,
                ...style
            }}
        >
            {props.children}
        </div>
    );
}