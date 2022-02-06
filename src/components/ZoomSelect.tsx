import React from 'react';
import { ZoomSelectIcon } from '../Icons';
import { calculateTimeSeriesTicks } from '../utils/helpers';
import usePrevious from '../utils/usePrevious';

export const ZoomSelect  = (props: any) => {
    const {setSelectState, selectState, xAxisDomain, setYAxisDomain, setXAxisDomain, selectCoords, setSelectCoords, setTicks} = props;
    const prev = usePrevious(selectCoords) //use prev to avoid re-render
    const selected = selectState == 'zoom' ? "#22b5bf" : "rgb(102, 102, 102)";

    React.useEffect(() => {
        if (selectCoords != null && selectCoords != prev && selectCoords.type == "zoom") {
            setYAxisDomain(selectCoords.yDomain);
            setXAxisDomain(selectCoords.xDomain);
            calculateTimeSeriesTicks(5, xAxisDomain, selectCoords.xDomain, setTicks);
            setSelectCoords(null); //reset coords
        }
    }, [selectCoords])

    return <ZoomSelectIcon onClick={(e: any) => {setSelectState('zoom')}} stroke={selected} />;
}