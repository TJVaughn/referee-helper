import React, { Component } from 'react';
import postRequest from '../../../utils/postRequest'

class AddArena extends Component {
    constructor(props){
        super(props);
        this.state = {
            arena: ''
        }
        this.handleArenaChange = this.handleArenaChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleArenaChange(evt){
        this.setState({arena: evt.target.value})
    }
    async callCreateArena(){
        const data = {
            "name": this.state.name
        }
        const res = await postRequest('arena', 'POST', { data })
        //I will input a search
        //The backend will handle everything
        //And return the rink details as well as distance and duration
        console.log(res)
    }

    handleSubmit(evt){
        evt.preventDefault()
        this.callCreateArena()
    }
    render(){
    	return(
    		<div>
                <h4>Add a new arena: </h4>
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleArenaChange} placeholder="location" value={this.state.arena} />
                    <button>Add Arena</button>
                </form>
    		</div>
    	);
    }
}
export default AddArena ;