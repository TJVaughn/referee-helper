import React, { Component } from 'react';
import getRequest from '../../../utils/getRequest';

class CreateBlocks extends Component {
    constructor(props){
        super(props);
        this.state = {
            inProcess: false,
            message: '',
            arbiterErr: '',
            hwrErr: '',
            arbiterBlocks: [{gameData: {}}],
            horizonBlocks: [{gameData: {}}]
        }
        this.handleASClick = this.handleASClick.bind(this)
        this.handleHWRClick = this.handleHWRClick.bind(this)
        this.handleBothClick = this.handleBothClick.bind(this)
    }
    async callASBlocks(){
        let res = await getRequest('arbiter/blocks')
        console.log(res)
        if(res.error){
            return this.setState({message: 'Request Timed out', arbiterErr: 'There was an error setting blocks for Arbiter Sports'})
        }
        return this.setState({arbiterBlocks: res})
    }

    async callHWRBlocks(){
        let res = await getRequest('horizon/blocks')
        console.log(res)
        if(res.error){
            return this.setState({message: 'Request Timed out', hwrErr: 'There was an error setting blocks for Horizon Web Ref'})
        }
        return this.setState({horizonBlocks: res})
    }

    async handleASClick(){
        this.setState({message: "Setting blocks...please do not refresh"})
        if(this.state.inProcess){
            return this.setState({message: "Can only do one request at a time."})
        }
        this.setState({inProcess: true})
        await this.callASBlocks()
        this.setState({inProcess: false, message: 'Request completed'})
    }

    async handleHWRClick(){
        this.setState({message: "Setting blocks...please do not refresh"})
        if(this.state.inProcess){
            return this.setState({message: "Can only do one request at a time."})
        }
        this.setState({inProcess: true})
        await this.callHWRBlocks()
        this.setState({inProcess: false, message: 'Request completed'})
    }

    async handleBothClick(){
        this.setState({message: "Setting blocks...please do not refresh"})
        if(this.state.inProcess){
            return this.setState({message: "Can only do one request at a time."})
        }
        this.setState({inProcess: true})
        this.setState({message: "Setting Arbiter Sports blocks...please do not refresh"})
        await this.callASBlocks()
        this.setState({message: "Setting Horizon Web Ref blocks...please do not refresh"})
        await this.callHWRBlocks()
        this.setState({inProcess: false, message: 'Request completed'})
    }

    render(){
        const arbiterBlockMap = this.state.arbiterBlocks.map(item =>
                <div key={item.gameData._id}>
                    Start: {item.blockStartTime}
                    <br />
                    End: {item.blockEndTime}
                    <br />
                    For Game: {new Date(item.gameStartTime).toLocaleDateString()}, {new Date(item.gameStartTime).toLocaleTimeString()}
                    <hr />
                </div>
            );
            const horizonBlockMap = this.state.horizonBlocks.map(item => 
                <div key={item.gameData._id}>
                    Start: {item.blockStartTime}
                    <br />
                    End: {item.blockEndTime}
                    <br />
                    For Game: {new Date(item.gameStartTime).toLocaleDateString()}, {new Date(item.gameStartTime).toLocaleTimeString()}
                    <hr />
                </div>
                );
    	return(
    		<div>
                <h4 title="Create blocks for future games that are not on the respective platform.">
                    Automatically Generate Blocks: 
                </h4>
                <h3>
                    {this.state.message}
                </h3>
                <div className="Create-blocks-container">
                    <p onClick={this.handleASClick} title="This will automatically make 'Part Day Blocks' on the Arbiter Sports platform. 
                    For each game that isn't on AS, a time slot will be blocked 1 hour prior, to 2 hours after the start time">
                        Create Arbiter Sports blocks
                    </p>
                    <p onClick={this.handleHWRClick} title="This will automatically make 'Not Available Between' blocks on the Horizon Web Ref platform. 
                    For each game that isn't on HWR, a time slot will be blocked 1 hour prior, to 2 hours after the start time. 
                    Warning, if you have a full day block on a given day, this will override that and change it to 
                    a 'Not Available Between' block ">
                        Create Horizon Web Ref blocks
                    </p>
                    <p onClick={this.handleBothClick} title="Create blocks for future games that are not on the respective platform.">
                        Create blocks for both
                    </p>
                </div>
                {this.state.inProcess
                ?<div className="loading-animation">
                    <div className="loading-animation-inner">
                        <div className="loading-animation-dot"></div>
                        <div className="loading-animation-dot-2"></div>
                    </div>
                </div>
                :''}
            <h3>
                {this.state.arbiterErr}
            </h3>
            <h3>
                {this.state.hwrErr}
            </h3>
            {!this.state.arbiterBlocks[0].blockStartTime
            ?''
            :<div>
                <h4>Created Arbiter Blocks for: </h4>
                {arbiterBlockMap}
            </div>}
            {!this.state.horizonBlocks[0].blockStartTime
            ?''
            :<div>
            <h4>Created Horizon Blocks for: </h4>
            {horizonBlockMap}
        </div>}
            
    		</div>
    	);
    }
}
export default CreateBlocks ;
//was 145 Lines and 6,132 bytes
