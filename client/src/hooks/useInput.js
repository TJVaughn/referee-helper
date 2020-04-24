import { useState } from 'react'

const useInput = (callback) => {
    const [ formInput, setFormInput ] = useState({})

    const handleSubmit = (evt) => {
        evt.preventDefault()
        callback()
    }
    const handleInputChange = (event) => {
        event.persist()
        setFormInput(formInput => ({...formInput, 
            [event.target.name]: event.target.value
        }))
    }
    return { formInput, handleInputChange, handleSubmit }
}
export default useInput