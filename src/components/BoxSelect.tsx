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
            <path d="M5 2V0H0v5h2v6H0v5h5v-2h6v2h5v-5h-2V5h2V0h-5v2H5zm6 1v2h2v6h-2v2H5v-2H3V5h2V3h6zm1-2h3v3h-3V1zm3 11v3h-3v-3h3zM4 15H1v-3h3v3zM1 4V1h3v3H1z"/>
        </svg>
    );
}