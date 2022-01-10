/**
 * 
 * @param customizedProps 
 * @param axisDomain 
 * @returns 
 */
export const resolveAxis = (customizedProps: any, axisDomain: any) => {
    //TODO if category just get first and last
    let resolvedDomain: any = [axisDomain[0], axisDomain[1]];
    const points = customizedProps.formattedGraphicalItems
            .reduce((acc: any, items: any) => acc.concat(items.props.points), [])
            .map((point: any) => point.value)
    //TODO round
    if (axisDomain[0] == 'auto') {
        resolvedDomain[0] = Math.min(...points);
    } 
    if (axisDomain[1] == 'auto') {
        resolvedDomain[1] = Math.max(...points);
    }

    return resolvedDomain;
};

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