import React from 'react';

//TODO some weird issues with this 
export const withResponsiveContainer = (Component: any) => {
    return (props: any) => {
        const [responsiveContainer, setResponsiveContainer] = React.useState(null)
        React.useEffect(() => { 
            const setComponents = (child: any) => {
                if (child.type.name == null && child.props.children instanceof Object) {
                    if (child.props.children?.type.name == "CategoricalChartWrapper") {
                        setResponsiveContainer(child)
                    }
                } 
            }
            if (props.children instanceof Array) {
                props.children.forEach((child: any) => {
                    setComponents(child);
                })
            } else if (props.children instanceof Object) {
                setComponents(props.children);
            } else {
                // console.warn("")
            }   
        }, [props.children]);
        
        return  responsiveContainer 
            ? React.cloneElement(responsiveContainer, {}, <Component {...props}/>) 
            : <Component {...props}/>
    }

}