import React, { Component, useState } from 'react';
import getRequest from '../../../utils/getRequest'
import { getCookie, setCookie } from '../../../utils/cookies'
import { Redirect } from 'react-router-dom';
import Loading from '../../../modules/Loading'
import getArbiterSchedule from '../../../api/arbiter/getArbiterSchedule';
import getArbiterPayments from '../../../api/arbiter/getArbiterPayments';
import getHorizonData from '../../../api/horizon/getHorizonData';

export default function SyncSchedules(props) {
    const [ message, setMessage ] = useState("")
    const [ arbiterError, setArbiterError ] = useState("")
    const [ horizonError, setHorizonError ] = useState("")
    const [ syncTime, setSyncTime ] = useState("") 
    const [ inProcess, setInProcess ] = useState(false)
    const timer = () => {
        let secs = 0
        setSyncTime(secs)
        function updateTimer(){
            setSyncTime(secs += 1)
        }
        setInterval(updateTimer, 1000)
    }

    async function callASSchedule(){
        setInProcess(true)
        setMessage('Getting Arbiter Schedule...please do not refresh')
        timer()
        let schedule = await getArbiterSchedule()
        console.log(schedule)
        setMessage('complete')
        setInProcess(false)
        window.location.reload()
    }
    async function callASPayment(){
        setInProcess(true)
        timer()
        setMessage('Getting Payment Data...please do not refresh')
        let paymentsSuccess = await getArbiterPayments()
        setInProcess(false)
        if(!paymentsSuccess) {
            return setMessage('Failure in getting payment data')
        }
        setMessage('Success!')
        window.location.reload()
    }
    async function callGetHWRData(){
        setInProcess(true)
        timer()
        setMessage('Getting Horizon Data...please do not refresh')
        let data = await getHorizonData()
        setInProcess(false)
        setMessage('complete')
    }
    async function callSyncAllSchedules(){

    }
    return (
        <div>
            <h4>Sync Data: </h4>
            <div className="Sync-schedules-sync-data">
                <div>
                    <h5>Arbiter Sports</h5>
                    <button onClick={callASSchedule}>Schedule</button>
                    <br />
                    <button onClick={callASPayment}>Payment Data</button>
                </div>
                <div>
                    <h5>Horizon Web Ref</h5>
                    <button onClick={callGetHWRData} >Schedule & Payment</button>
                </div>
                <div>
                    <h5>Sync All</h5>
                    <button onClick={callSyncAllSchedules}>Sync All Data</button>
                </div>
            </div>


            <h1>
                {message}
            </h1>
            <p>
                {arbiterError}
            </p>
            <p>
                {horizonError}
            </p>
            {inProcess
            ? <h5>Sync Time: {syncTime}</h5>
            :''}
            

            {inProcess
            ? <Loading message={message} />
        :''}
        </div>
    )
}
