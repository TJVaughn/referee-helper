import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { getCookie } from '../../utils/cookies';
import syncArbiterProfile from '../../api/user/syncArbiterProfile'
import Loading from '../../modules/Loading'

export default function ProfileAccount(props){
	const [ message, setMessage ] = useState('')
	const [ toggle, setToggle ] = useState(false)
	//Arbiter Profile Sync Button
	const callASSync = async () => {
		setMessage('syncing')
		setToggle(true)
		let res = await syncArbiterProfile()
		if(res.error) {
			setMessage(`Error: ${res.error}`)
			setToggle(false)
			return
		}
		setToggle(false)
		console.log(toggle)
		setMessage('Success!')
		return
	}

	return (
		<div>
			<h3>Account</h3>
				<label>ReSync from Arbiter: </label>
				<button onClick={callASSync}>Sync</button>
				<h2>{message}</h2>
				{!toggle ? '' :<Loading message={message} />}
				<div>
					<h3>{props.user.fName} {props.user.lName}</h3>
					<h3>{props.user.email}</h3>
					<div>
						<p>{props.user.street}</p>
						<p>{props.user.city}</p>
						<p>{props.user.state}</p>
						<p>{props.user.postalCode}</p>
					</div>
					<div>
						<h3>Arbiter Email: {props.user.asEmail}</h3>
						<Link to={'/arbiter-sync'} >Update Arbiter Login Info</Link>
						<h3>Horizon Username: {props.user.hwrUsername}</h3>
						<Link to={'/horizon-sync'} >Update Horizon Login Info</Link>
					</div>
				</div>
				{/* {this.state.redirect} */}
		</div>
	)
}

//was 102 LINES
//was 2,367 bytes
//1,572 bytes at 52 lines on 4/27