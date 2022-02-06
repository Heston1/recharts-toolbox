import React from 'react';
import { CameraIcon } from '../Icons';
export interface CameraProps {
    width?: number;
    height?: number;
    readonly graph_uid: string; //internal
    onDownload?: (dataURL: string) => void;
}
export type Props = CameraProps;

export const Camera = (props: CameraProps) => {
    const {graph_uid, width, height, onDownload} = props
    //TODO currently only exports the graph, get every layer in the container and merge it into a single svg
    const toImage = () => {
        let svg: HTMLElement = document.getElementById(graph_uid);
        console.log(svg, graph_uid)
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

    return <CameraIcon onClick={e => toImage()} />
}