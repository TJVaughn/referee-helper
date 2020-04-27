import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileAccount from './ProfileAccount';
import ProfileBilling from './ProfileBilling';
import getUser from '../../api/user/getUser';
import getStripeUser from '../../api/user/stripe/getStripeUser';

export default function Profile(props){
	const [ user, setUser ] = useState({})
	const [ stripeUser, setStripeUser ] = useState({subscriptions: {data: []}})
	const [ stripeBilling, setStripeBilling ] = useState([])

	const callGetStripeUser = async () => {
		let res = await getStripeUser()
		setStripeUser(res.customer)
		setStripeBilling(res.customerBillingHistory.data)
	}
	const callGetUser = async () => {
		let res = await getUser()
		setUser(res)
	}
	useEffect(() => {
		callGetUser()
		callGetStripeUser()
	}, [props])
	return (
		<div>
			<div className="Profile-navigation">
				<Link to={'/profile/account'}><h2>Account</h2></Link>
				<Link to={'/profile/billing'}><h2>Billing</h2></Link>
			</div>
			{props.path === '/profile/account' ? <ProfileAccount user={user} /> : ''}
			{props.path === '/profile/billing' ? <ProfileBilling user={user} stripeUser={stripeUser} billing={stripeBilling} /> : ''}
		</div>
	)
}

// //66 lines but could remove 18