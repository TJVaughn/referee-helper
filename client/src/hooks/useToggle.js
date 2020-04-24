import { useState } from 'react'

function useToggle (bool = false){
    const [ state, setState ] = useState(bool)
    const toggle = () => {
        setState(!state)
    }
    return [ state, toggle ]
}

export default useToggle