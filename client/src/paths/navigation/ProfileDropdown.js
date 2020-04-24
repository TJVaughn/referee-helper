import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom'
import ProfileImg from '../../images/grey-profile-img.png'
import { setCookie } from '../../utils/cookies';
import useToggle from '../../hooks/useToggle'

function ProfileDropdown(){

    const [ dropToggle, setDropToggle ] = useToggle(false)
    const [ logoutToggle, setLogoutToggle ] = useToggle(false)

    const logoutUser = async () => {
        let res = await fetch('/api/user/logout-all', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            }
        })
        res = await res.json()
        console.log(res)
        setCookie('loggedIn', 'false')
        window.location.reload()
    }

    return (
        <div className="Profile-dropdown-container">
            <img onClick={setDropToggle} className="Profile-img-icon" alt='profile' src={ProfileImg} />
                
            {dropToggle
                ?<div className={`Profile-img-dropdown`}>
                    <Link onClick={setDropToggle} to={'/profile/account'}>Account</Link>
                    <br />
                    <Link onClick={setDropToggle} to={'/profile/billing'}>Billing</Link>
                    <br />
                    <hr />
                    {logoutToggle
                        ?<div>
                            <span className="pointer" onClick={setLogoutToggle}>Are you sure?</span><br />
                            <span className="pointer blue" onClick={logoutUser}>Logout</span>
                        </div>
                        :<span className="pointer blue" onClick={setLogoutToggle}>Log Out</span>
                    } 
                </div>
            :''}
        </div>
    )
}

export default ProfileDropdown ;