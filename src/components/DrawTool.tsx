import React from 'react';
import { DrawToolIcon } from '../Icons';
import usePrevious from '../utils/usePrevious';

//TODO
//basic shapes --recharts shape tool
//doodle
//line
//text
//custom?

export const DrawTool  = (props: any) => {
    const {setSelectState, selectCoords, setYAxisDomain, setXAxisDomain, setSelectCoords, onSelected} = props;
    const prev = usePrevious(selectCoords) //use prev to avoid re-render

    React.useEffect(() => {
        if (selectCoords != null && selectCoords != prev && selectCoords.type == "draw") {
            onSelected && onSelected(selectCoords)
            setSelectCoords(null); //reset coords
        }
    }, [selectCoords])

    React.useEffect(() => {
        props.setDrawType(props.type)
    }, [props.type])

    return <DrawToolIcon onClick={(e: any) => {setSelectState('draw')}}/>;
}