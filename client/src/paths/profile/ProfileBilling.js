import React, { useState, useEffect } from 'react';
import formatNumber from '../../utils/formatNumber';
import postRequest from '../../utils/postRequest';
import getRequest from '../../utils/getRequest';
import useToggle from '../../hooks/useToggle';
import useInput from '../../hooks/useInput'
import { Link } from 'react-router-dom';

function ProfileBilling(){
    const [ alert, setAlert ] = useToggle(false)
    const [ user, setUser ] = useState({})
    const [ stripeUser, setStripeUser ] = useState({subscriptions: {data: [{plan: ''}]}})
    const [ billingHistory, setBillingHistory ] = useState([])

    const cancelSub = async () => {
        console.log('cancelled sub')
        const data = {
            cancelEmail: formInput.cancelEmail
        }
        const req = await postRequest('stripe/cancel-subscription', 'POST', {data})
        console.log(req)
        window.location.reload()
    }
    const { formInput, handleInputChange, handleSubmit } = useInput(cancelSub)
    const getUser = async () => {
        const req = await getRequest('user/me')
        console.log(req)
        setUser(req)
    }
    const getStripeUser = async () => {
        const res = await getRequest('stripe/customer')
        console.log(res)
        setStripeUser(res.customer)
        setBillingHistory(res.customerBillingHistory.data)
    }

    useEffect(() => {
        getUser()
        getStripeUser()
    }, [])

    const billingHistoryMap = billingHistory.map(item => 
        <div key={item.id}>
            <p>
                Date paid: {new Date(item.status_transitions.paid_at * 1000).toLocaleDateString()}
            </p>
            <p>
                Amount paid: ${formatNumber(item.amount_paid)}
            </p>
            <p>
                Status: {item.status}
            </p>
            <hr />
        </div>
    )

    const CancelSubscription = <div className='Profile-alert-box-container'>
    <div className="Profile-alert-box-inner">
        <h1>Cancel Subscription</h1>
        <p>
            To cancel, please input your email on file.
        </p>
        <form onSubmit={handleSubmit}>
            <input className={'Profile-cancel-email-input'} 
            name='cancelEmail' onChange={handleInputChange} 
            type='email' value={formInput.cancelEmail} />
            <br />
            <button disabled={formInput.cancelEmail !== user.email ? true : false} 
                className={`Profile-cancel-button ${formInput.cancelEmail !== user.email ? 'disabled' : ''}`}>
                CANCEL
            </button>
        </form>
        
        <p>Wait, I changed my mind!</p>
        <p onClick={() => {setAlert(!alert)}} className="Profile-dont-cancel-button">
            Don't cancel
        </p>
    </div>
</div>

    return (
        <div>
            
            {!stripeUser.subscriptions.data[0].plan.active === false
            ? <div>
            <h3>
                Billing
            </h3>
            <p>
                Subscription start date:
                <br />
                {new Date(stripeUser.subscriptions.data[0].current_period_start * 1000).toLocaleDateString()}
            </p>

            <p>
                Subscription status: {stripeUser.subscriptions.data[0].plan.active ? 'pro' : 'free'}
            </p>
            <div>
                {stripeUser.subscriptions.data[0].cancel_at_period_end
                ? <p>
                    Will not renew on {new Date(stripeUser.subscriptions.data[0].current_period_end * 1000).toLocaleDateString()}
                    </p>
                : <p>
                    Will renew on {new Date(stripeUser.subscriptions.data[0].current_period_end * 1000).toLocaleDateString()} 
                    {' '}for ${formatNumber(stripeUser.subscriptions.data[0].plan.amount)}
                </p>}
            </div>
            <button onClick={() => {setAlert(!alert)}} className="Profile-cancel-button">Cancel Subscription</button>
        </div>
            : <Link to={'/subscription'}>Renew Subscription</Link>}
                
            {alert
            ? CancelSubscription
            :''}
            <h3>History</h3>
            {billingHistoryMap}
        </div>
    )
}
export default ProfileBilling

//153 LINES!!!