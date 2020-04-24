import React from 'react'
import Profile from "./Profile";

export default function ProfileRouter(props){
    return(
        <div>
            <Profile path={props.location.pathname} />
        </div>
    )
}