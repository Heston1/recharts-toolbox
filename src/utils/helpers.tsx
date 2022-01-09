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
/**
 * 
 * @param tickCount 
 * @param domain 
 */
let lastX: any = [], ticks: any = [];
export const calculateTimeSeriesTicks = (tickCount: number = 5, initialDomian:any, domain: any, callback: any) => {
    // let ticks: any = axisDragProps?.ticks; //why does this add to the previous state????
    if (lastX.length == 0) {
        lastX = initialDomian;
    }
    const x1 = lastX[0];
    const x2 = lastX[1];
    if (ticks.length == 0) {
        let tmp = []
        for (let numTick = 0; numTick < tickCount; numTick++) {
            tmp.push((x1+(((x2-x1)/tickCount)*numTick)));
        }
        ticks = tmp
    } 

    if (ticks[ticks.length-1] < domain[1]) {
        ticks.push(ticks[ticks.length-1]+((x2-x1)/tickCount));
    } 
    else {
        ticks.pop()
    }
    
    if (ticks[0] > domain[0]) {
        ticks.unshift((ticks[0]-(((x2-x1)/tickCount))));
    } 
    else {
        ticks.shift()
    }

    //TODO use min tick gap instead of 0.75/1.5
    if (
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
