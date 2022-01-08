import React from 'react';
import usePrevious from '../utils/usePrevious';

export const ZoomSelect  = (props: any) => {
    const {setSelectState, selectState, setYAxisDomain, setXAxisDomain, selectCoords, setSelectCoords} = props;
    const prev = usePrevious(selectCoords) //use prev to avoid re-render
    
    React.useEffect(() => {
        if (selectCoords != null && selectCoords != prev && selectCoords.type == "zoom") {
            setYAxisDomain(selectCoords.yDomain);
            setXAxisDomain(selectCoords.xDomain);
            setSelectCoords(null); //reset coords
        }
    }, [selectCoords])

    return (
        <svg onClick={(e: any) => {setSelectState('zoom')}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="rgb(102, 102, 102)" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
            <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
            {/* TODO: rect */}
        </svg>
    );
}