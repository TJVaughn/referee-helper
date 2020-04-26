import React, { Component } from 'react';
import postRequest from '../../../utils/postRequest'
import getRequest from '../../../utils/getRequest';

class CreateGame extends Component {
    constructor(props){
        super(props)
        this.state = {
            date: '',
            time: '',
            location: '',
            fees: '',
            group: '',
            level: '',
            arenas: []
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    async getAllArenas(){
        let res = await getRequest('arena/all')
        this.setState({arenas: res})
        if(!this.state.arenas){
            this.setState({arenas: []})
        }
    }
    componentDidMount(){
        this.getAllArenas()
    }
    async callCreateGame () {
        if(!this.state.date || !this.state.time || !this.state.location){
            return this.setState({error: "Date, time and location are required"})
        }
        const dateTime = `${this.state.date} ${this.state.time}`
        const data = {
            "dateTime": dateTime,
            "location": this.state.location,
            "fees": this.state.fees * 100,
            "level": this.state.level,
            "refereeGroup": this.state.group,
            "platform": "Manually Added"
        }
        let res = await postRequest('game', 'POST', { data })
        // res = res.json()
        console.log("Response from creategame: ", res)
        if(res._message){
            return this.setState({error: res._message})
        }
        window.location.reload()
    }
    handleChange(evt){
        this.setState({[evt.target.name]: evt.target.value})
    }
    handleSubmit (evt) {
        evt.preventDefault()
        this.callCreateGame()
    }
    render(){
        let arenaMap = this.state.arenas.map(arena => 
                <option value={arena.name} key={arena._id}>
                    {arena.name}
                </option>
            )
    	return(
    		<div>
                <h4>Add a new game: </h4>
    			<form className="Create-game-form" onSubmit={this.handleSubmit}>
                    <input placeholder="Date" name="date" type="date" onChange={this.handleChange} value={this.state.date} />
                    <input placeholder="Time" name="time" type="time" onChange={this.handleChange} value={this.state.time} />
                    <select name='location' value={this.state.location} onChange={this.handleChange}>
                        <option >location</option>
                        {arenaMap}
                    </select>
                    <input placeholder="Fees" name="fees" type="text" onChange={this.handleChange} value={this.state.fees} />
                    <input placeholder="Level" name='level' type="text" onChange={this.handleChange} value={this.state.level} />
                    <input placeholder="Ref Group" name='group' type="text" onChange={this.handleChange} value={this.state.group} />
                    <button>Add Game</button>
                </form>
                {this.state.error}
    		</div>
    	);
    }
}
export default CreateGame ;
//111 LINES!
