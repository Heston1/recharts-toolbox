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