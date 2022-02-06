import React from 'react';
import { PanIcon } from '../Icons';

export const Pan = (props: any) => {
    const { setPanState, panState } = props;
    const selected = panState ? "#22b5bf" : "rgb(102, 102, 102)"; //TODO

    return <PanIcon onClick={e => setPanState(!panState)} stroke={selected}/>
}
