import React from 'react';

export const BoxSelectIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="rgb(102, 102, 102)" viewBox="0 0 16 16" {...props}>
            <rect fill="none" strokeWidth={4} strokeDasharray={"2,2"} x={0} y={0} width={16} height={16}/>
        </svg>
    );
};