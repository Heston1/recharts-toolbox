
export const getXAxisKey = (node: any) => {
    // const lookup = node.type.displayName == "ScatterChart" ? 'Scatter' : 'XAxis'
    return node.props.children.filter((n: any) => n.type.name == 'XAxis')[0].props.dataKey;
}

export const getData = (node: any) => {
    if (node.type.displayName == "ScatterChart") {
        return flatten(node.props.children.filter((n: any) => n.type.name == 'Scatter').map((n: any) => n.props.data));
    }
    else {
        return node.props.data;
    }
}


/**
 * 
 * @param arr 
 * @returns 
 */
export const flatten = (arr:any) => [].concat(...arr);

/**
 * 
 * @param customizedProps 
 * @param axisDomain 
 * @returns 
 */
export const resolveAxis = (
    customizedProps: any, //should be data
    axisDomain: any, 
    type: string = 'number', 
    filterNulls: boolean = true
) => {
    //TODO if category just get first and last
    //TODO /src/util/ChartUtils.ts:getDomainOfDataByKey 
    let resolvedDomain: any = [axisDomain[0], axisDomain[1]];

    if (type == 'category' && (axisDomain[0] == 'auto' || axisDomain[1] == 'auto' || isNaN(axisDomain[1]) || isNaN(axisDomain[0]))) {
        const testPoint = customizedProps.formattedGraphicalItems[0]
        const items = testPoint.props.points || testPoint.props.data;
        return [0, items.length];
    }

    if (axisDomain[0] == 'auto' || axisDomain[1] == 'auto') {    
        const points: Array<any> = customizedProps.formattedGraphicalItems
            .reduce((acc: any, items: any) => {
                const getValues = (data: any) => {
                    if (data[0] && data[0].value instanceof Array) { //TODO value?
                        return acc.concat(flatten(data.map((point: any) => flatten(point.value || point.y))))
                    } else {
                        return acc.concat(flatten(data.map((point: any) => point.value || point.y)))
                    }
                }
                
                if (items.props.hasOwnProperty("points")) {
                    return getValues(items.props.points)
                } else if (items.props.hasOwnProperty("data")) {
                    return getValues(items.props.data)
                }
                
            }, [])
            .filter((value: any) => filterNulls && (!isNaN(value) && !isNaN(value) && value != null && value != null));
        
       

        if (axisDomain[0] == 'auto') {
            resolvedDomain[0] = Math.min(...points);
        } 
        if (axisDomain[1] == 'auto') {
            resolvedDomain[1] = Math.max(...points);
        }
    }
    

    return resolvedDomain;
};

export const getDomainOfDataByKey = (data: Array<any>, key: string, type: string) => {
    const arr = data.map(point => point[key]);
    if (type != 'number') {
        return [0, arr.length]
    } else {
        return [Math.min(...arr), Math.max(...arr)]
    }
}

/**
 * 
 * @returns 
 */
export const uid = () => Date.now().toString(36) + Math.random().toString(36).substring(0,2);

/**
 * https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
 * n is the number of points in the polygon, a ray is cast between px,py from the x,y position, 
 * each time the ray intersects the polygon c switches indicating inside or outside
 * @param n 
 * @param px 
 * @param py 
 * @param x 
 * @param y 
 * @returns 
 */
export const isInPolygon = (n: number, px: any, py: any, x: number, y: number) => {
    let i: any, j: any = n-1, c = false;
    for (i = 0; i < n; j = i++) {
        if (((py[i]>y) != (py[j]>y)) &&
                (x < (px[j]-px[i]) * (y-py[i]) / (py[j]-py[i]) + px[i])) {
            c = !c
        }
        
    }
    return c;
}


//TODO use for zoom in/out, zoom select
//TODO preserve start, end, startend
//TODO fix have initial domain
//move this to toolkit file and listen for domain changes
/**
 * 
 * @param tickCount 
 * @param domain 
 */
let lastX: any = [], ticks: any = [];
export const calculateTimeSeriesTicks = (tickCount: number = 5, initialDomian:any, domain: any, callback: any) => {
    if (lastX.length == 0) {
        lastX = initialDomian;
    }

    const x1 = lastX[0];
    const x2 = lastX[1];
    if (ticks.length == 0) {
        let tmp = []
        for (let numTick = 0; numTick < tickCount; numTick++) {
            tmp.push((x1+((x2-x1)/tickCount)*numTick));
        }
        ticks = tmp
    } 

    if (ticks[ticks.length-1] < domain[1]) {
        ticks.push(ticks[ticks.length-1]+((x2-x1)/tickCount));
    } 
    if (ticks[ticks.length-1] > domain[1]) {
        ticks.pop()
    }
    if (ticks[0] > domain[0]) {
        ticks.unshift(ticks[0]-(((x2-x1)/tickCount)));
    }
    if (ticks[0] < domain[0]) {
        ticks.shift()
    }

    //TODO use min tick gap instead of 0.75/1.5
    if (//reset when gap is less than 0.75 the width of the interval
        ((lastX[1]-lastX[0])/tickCount<((domain[1]-domain[0])/tickCount)*0.75)
        || ((lastX[1]-lastX[0])/tickCount>((domain[1]-domain[0])/tickCount)*1.5)
    ){
        let tmp = []
        for (let numTick = 0; numTick < tickCount; numTick++) {
            tmp.push((domain[0]+(((domain[1]-domain[0])/tickCount)*numTick)));
        }
        ticks = tmp
        lastX = domain
    }

    callback(ticks);
}

/**
 * 
 * @param interval 
 * @param date 
 * @returns 
 */
export const formatTimeSeriesTicks = (interval: any, date: Date) => {
    const min = 60;
    const hour = 60*min;
    const day = 24*hour;
    const week = day*7;
    const month = (52*week)/12;
    const year = (12*month);

    if (isNaN(interval)) return ''; //TODO if domain is not set 

    const formattedMilli = ("000" + date.getMilliseconds()).slice(-4);
    const formattedSec = ("0" + date.getSeconds()).slice(-2);
    const formattedMin =  ("0" + date.getMinutes()).slice(-2);
    const formattedHour = ("0" + date.getHours()).slice(-2)

    const toLocaleDateString = (options: any) =>  date.toLocaleDateString(navigator.language, options);

    if (interval < min){
        return formattedSec + ':' + formattedMilli;
    } else if (interval > min && interval < hour) {
        return formattedMin + ':' + formattedSec;
    } else if (interval > hour && interval < day) {
        return toLocaleDateString({ day: 'numeric' }) + ", " + formattedHour + ':' + formattedMin;
    } else if (interval > day && interval < week) {
        return toLocaleDateString({ day: 'numeric', month: 'short' });
    } else if (interval > week && interval < month) {
        return toLocaleDateString({ day: 'numeric', month: 'short' });
    } else if (interval > month && interval < year) {
        return toLocaleDateString({ month: 'numeric', year: '2-digit' });
    } else if (interval > year) {
        return toLocaleDateString({ year: '2-digit' });
    } else {
        return toLocaleDateString(null);
    }
}