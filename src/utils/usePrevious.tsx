import React from 'react';

//taken from https://stackoverflow.com/a/53446665 
const usePrevious = (value: any) => {
    const ref = React.useRef();
    React.useEffect(() => {
      ref.current = value;
    });
    return ref.current;
}

export default usePrevious;