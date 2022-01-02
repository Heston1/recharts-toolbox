import React from 'react';
export interface CameraProps {
    width?: number;
    height?: number;
    readonly graph_uid: string; //internal
    onDownload?: (dataURL: string) => void;
}
export type Props = CameraProps;

export const Camera = (props: CameraProps) => {
    const {graph_uid, width, height, onDownload} = props

    const toImage = () => {
        const svg = document.getElementById(graph_uid);
        if (svg == null) {
            return;
        }

        let canvas = document.createElement('canvas');
        //TODO aspect ratio, fit
        canvas.width = width || svg.clientWidth;
        canvas.height = height || svg.clientHeight;

        let data = new XMLSerializer().serializeToString(svg);
        let blob = new Blob([data], { type: 'image/svg+xml' });
        let img = new Image();

        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            var base64String = reader.result;
            
            img.src = String(base64String);
            img.onload = () => {
                canvas.getContext('2d').drawImage(img, 0, 0);
                var dt = canvas.toDataURL('image/png');
                
                const download = () => {
                    var link = document.createElement("a");
                    link.download = "download.png";
                    link.target = "_blank";
                    link.href = dt;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                onDownload && onDownload(dt); //TODO prevent default
                download();
            }
        }
    }

    //https://icons.getbootstrap.com/icons/camera-fill/
    return (
        <svg onClick={e => toImage()} xmlns="http://www.w3.org/2000/svg" width="18" height="18"   fill="rgb(102, 102, 102)" className="bi bi-camera-fill" viewBox="0 0 16 16">
            <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
            <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
        </svg>
    );
}