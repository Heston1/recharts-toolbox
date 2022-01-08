import React from 'react';

//TODO hide line/box, customise box/line, click/hover
export const ReferenceLines  = (props: any) => {
    const {setEnableReferenceLines, enableReferenceLines} = props;
    const selected = enableReferenceLines ? "#22b5bf" : "rgb(102, 102, 102)"; //TODO

    //TODO change icon
    return (
        <svg onClick={(e: any) => setEnableReferenceLines(!enableReferenceLines)} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill={selected} viewBox="0 0 1000 1000">
            <path d="M512 409c0-57-46-104-103-104-57 0-104 47-104 104 0 57 47 103 104 103 57 0 103-46 103-103z m-327-39l92 0 0 92-92 0z m-185 0l92 0 0 92-92 0z m370-186l92 0 0 93-92 0z m0-184l92 0 0 92-92 0z" transform="matrix(1.5 0 0 -1.5 0 850)"></path>
        </svg>
    );
}