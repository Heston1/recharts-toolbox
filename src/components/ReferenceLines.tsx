import React from 'react';
import { ReferenceLinesIcon } from '../Icons';

//TODO hide line/box, customise box/line, click/hover
export const ReferenceLines  = (props: any) => {
    const {setEnableReferenceLines, enableReferenceLines} = props;
    const selected = enableReferenceLines ? "#22b5bf" : "rgb(102, 102, 102)"; //TODO

    //TODO change icon
    return <ReferenceLinesIcon onClick={(e: any) => setEnableReferenceLines(!enableReferenceLines)} fill={selected} />;
}