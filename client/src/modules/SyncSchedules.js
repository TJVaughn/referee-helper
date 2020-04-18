import React, { Component } from 'react';
import getRequest from '../utils/getRequest'
import { getCookie, setCookie } from '../utils/cookies'
import { Redirect } from 'react-router-dom';

class SyncSchedules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            inProcess: false,
            arbiterError: '',
            horizonError: '',
            syncTime: ''
        }
        this.callSyncAllSchedules = this.callSyncAllSchedules.bind(this)
        this.callGetASData = this.callGetASData.bind(this)
        this.callGetHWRData = this.callGetHWRData.bind(this)
    }

    async callGetASData(){  
        try {
            this.setState({message: "Grabbing Arbiter Schedule"})
            await getRequest('arbiter/schedule')
            this.setState({message: "Now getting payment data from Arbiter"})
            await getRequest('arbiter/payments')
        } catch (error) {
            return this.setState({arbiterError: "Error fetching Arbiter schedule: " + error})
        }
    }

    async callGetHWRData(){
        try {
            this.setState({message: "Grabbing Horizon Schedule & Payment Data"})
            await getRequest('horizon/schedule')
        } catch (error) {
            return this.setState({horizonError: "Error fetching Arbiter schedule: " + error})
        }
    }
    async callArenaData(){
        try {
            this.setState({message: "Adding/updating arenas from schedule. Fetching mileage and drive duration time to arenas."})
            await getRequest('arena/add-arenas-from-schedule')
            this.setState({message: "Updating game distances and durations"})
            await getRequest('arena/assign-distance-to-games')
            
        } catch (error) {
            return this.setState({})
        }
    }

    async callSyncAllSchedules(){
        const startTime = Date.now()
        // console.log(startTime)
        this.setState({inProcess: true, syncTime: ''})
        await this.callGetASData()
        await this.callGetHWRData()
        setCookie("InitialLoginFlow", "false")
        await this.callArenaData()
        this.setState({inProcess: false, message: <Redirect to={'/'} />})
        const endTime = Date.now()
        // console.log(endTime)
        const secsElapsed = Math.floor((endTime - startTime) / 1000)
        console.log("The request process took: " + secsElapsed + " seconds")
        this.setState({syncTime: "The request process took: " + secsElapsed + " seconds"})
        // window.location.reload()
    }

    componentDidMount(){
        if(getCookie("InitialLoginFlow") === "true"){
            this.callSyncAllSchedules()
        }
    }

    render(){
    	return(
    		<div>
                <h4>Sync your schedules: </h4>
                {/* <button disabled={this.state.inProcess} onClick={this.callGetASData} >Sync Arbiter Sports</button>
                <button disabled={this.state.inProcess} onClick={this.callGetHWRData} >Sync Horizon Web Ref</button> */}
    			<button disabled={this.state.inProcess} onClick={this.callSyncAllSchedules}>Sync All Schedules</button>
                <h1>
                    {this.state.message}
                </h1>
                <p>
                    {this.state.arbiterError}
                </p>
                <p>
                    {this.state.horizonError}
                </p>
                <h5>{this.state.syncTime}</h5>
    		</div>
    	);
    }
}
export default SyncSchedules ;