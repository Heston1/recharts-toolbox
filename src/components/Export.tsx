import React from 'react';
export interface ExportProps {
    readonly customizedProps: any;
    //headers: array
    //data fn: return formatting
}
export type Props = ExportProps;

export const Export = (props: ExportProps) => {
    const { customizedProps } = props;

    //TODO csv, json
    const exportToFile = (e: any) => {
    }

    //https://icons.getbootstrap.com/icons/file-earmark-arrow-down/
    return (
        <svg onClick={exportToFile} xmlns="http://www.w3.org/2000/svg" width="18" height="18"  fill="rgb(102, 102, 102)" viewBox="0 0 16 16">
            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0z"/>
        </svg>
    );
}