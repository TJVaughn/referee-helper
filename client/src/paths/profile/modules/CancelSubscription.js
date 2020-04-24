import React from 'react'

function CancelSubscription(){
    return (
        <div className='Profile-alert-box-container'>
            {/* <div className="Profile-alert-box-inner">
                <h1>Cancel Subscription</h1>
                <p>
                    To cancel, please input your email on file.
                </p>
                <input className={'Profile-cancel-email-input'} onChange={this.handleUserEmail} type='email' value={this.state.cancelEmail} />
                <br />
                <button disabled={this.state.cancelEmail !== user.email ? true : false} 
                    onClick={this.handleCancelUserSubscription} 
                    className={`Profile-cancel-button ${this.state.cancelEmail !== user.email ? 'disabled' : ''}`}>
                    CANCEL
                </button>
                <p>Wait, I changed my mind!</p>
                <p onClick={this.handleCancelButton} className="Profile-dont-cancel-button">
                    Don't cancel
                </p>
            </div> */}
        </div>
    )
}

export default CancelSubscription