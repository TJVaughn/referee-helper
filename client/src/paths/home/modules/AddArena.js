import React, { Component } from 'react';
import postRequest from '../../../utils/postRequest'

class AddArena extends Component {
    constructor(props){
        super(props);
        this.state = {
            location: '',
            distance: '',
            duration: '',
            message: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleChange(evt){
        this.setState({[evt.target.name]: evt.target.value})
    }
    async callCreateArena(){
        const data = {
            "location": this.state.location,
            "distance": this.state.distance,
            "duration": this.state.duration
        }
        const res = await postRequest('arena', 'POST', { data })
        console.log(res)
        if(res.error) return this.setState({message: 'invalid location, location may already exist'})
        return this.setState({message: 'success!'})
    }

    handleSubmit(evt){
        evt.preventDefault()
        this.callCreateArena()
    }
    render(){
    	return(
    		<div>
                <h4>Add a new location: </h4>
                <form onSubmit={this.handleSubmit}>
                    <input type='text' name="location" onChange={this.handleChange} placeholder="location" value={this.state.location} />
                    <input type='text' name="distance" onChange={this.handleChange} placeholder="distance" value={this.state.distance} />
                    <input type='text' name="duration" onChange={this.handleChange} placeholder="duration" value={this.state.duration} />
                    <button>submit</button>
                </form>
                {this.state.message}
    		</div>
    	);
    }
}
export default AddArena ;