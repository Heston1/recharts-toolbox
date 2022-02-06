import React from 'react';
import { BoxSelectIcon } from '../Icons';
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

    return <BoxSelectIcon onClick={(e: any) => {setSelectState('select')}}/>;
}