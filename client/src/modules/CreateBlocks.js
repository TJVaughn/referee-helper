import React, { Component } from 'react';
import getRequest from '../utils/getRequest';

class CreateBlocks extends Component {
    constructor(props){
        super(props);
        this.state = {
            inProcess: false,
            message: ''
        }
        this.handleASClick = this.handleASClick.bind(this)
        this.handleHWRClick = this.handleHWRClick.bind(this)
        this.handleBothClick = this.handleBothClick.bind(this)
    }
    async callASBlocks(){
        let res = await getRequest('arbiter/blocks')
        console.log(res)
    }

    async callHWRBlocks(){
        let res = await getRequest('horizon/blocks')
        console.log(res)
    }

    async handleASClick(){
        if(this.state.inProcess){
            return this.setState({message: "Can only do one request at a time."})
        }
        this.setState({inProcess: true})
        await this.callASBlocks()
        this.setState({inProcess: false, message: 'Request completed'})
    }

    async handleHWRClick(){
        if(this.state.inProcess){
            return this.setState({message: "Can only do one request at a time."})
        }
        this.setState({inProcess: true})
        await this.callHWRBlocks()
        this.setState({inProcess: false, message: 'Request completed'})
    }

    async handleBothClick(){
        if(this.state.inProcess){
            return this.setState({message: "Can only do one request at a time."})
        }
        this.setState({inProcess: true})
        await this.callASBlocks()
        await this.callHWRBlocks()
        this.setState({inProcess: false, message: 'Request completed'})
    }

    render(){
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
    		</div>
    	);
    }
}
export default CreateBlocks ;