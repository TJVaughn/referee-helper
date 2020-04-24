import React from 'react'
import Landing from '../landing-page/Landing'
import { getCookie } from '../../utils/cookies'
import Schedule from './Schedule'

export default function IndexRouter(){
    return (
        <div>
            {getCookie("loggedIn") === "true"
            ? <Schedule />
            :<Landing />}
            
        </div>
    )
}