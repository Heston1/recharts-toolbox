import React from 'react';
import usePrevious from '../utils/usePrevious';

export const BoxSelect  = (props: any) => {
    const {setSelectState, selectCoords, setYAxisDomain, setXAxisDomain, setSelectCoords, onSelected} = props;
    const prev = usePrevious(selectCoords) //use prev to avoid re-render
    
    React.useEffect(() => {
        if (selectCoords != null && selectCoords != prev && selectCoords.type == "select") {
            onSelected && onSelected(selectCoords)
            setSelectCoords(null); //reset coords
        }
    }, [selectCoords])

    return (
        <svg onClick={(e: any) => {setSelectState('select')}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="rgb(102, 102, 102)" viewBox="0 0 16 16">
            <rect fill="none" strokeWidth={4} strokeDasharray={"2,2"} x={0} y={0} width={16} height={16}/>
        </svg>
    );
}