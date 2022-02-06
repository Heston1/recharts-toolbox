import React from 'react';
import { LasoSelectIcon } from '../Icons';
import usePrevious from '../utils/usePrevious';

export const LasoSelect  = (props: any) => {
    const {setSelectState, selectCoords, setYAxisDomain, setXAxisDomain, setSelectCoords, onSelected} = props;
    const prev = usePrevious(selectCoords) //use prev to avoid re-render
    
    React.useEffect(() => {
        if (selectCoords != null && selectCoords != prev && selectCoords.type == "laso") {
            onSelected && onSelected(selectCoords)
            setSelectCoords(null); //reset coords
        }
    }, [selectCoords])

    //TODO change icon
    return <LasoSelectIcon onClick={(e: any) => {setSelectState('laso')}} />;
}

