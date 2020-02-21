import React, { Component } from 'react';
import { BrowserRouter as Link, Redirect } from "react-router-dom";
import fetchRequest from '../utils/fetchRequest'
import { toDateObj } from '../utils/toDateObj'
import postRequest from '../utils/postRequest'

class SingleGame extends Component {
    constructor(props){
        super(props)
        this.state = {
            game: {},
            edit: false,
            settings: false,
            delete: false,
            redirect: '',
            date: '',
            time: '',
            location: '',
            fees: '',
            group: '',
            level: '',
            milage: '',
            status: ''
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDate = this.handleDate.bind(this)
        this.handleTime = this.handleTime.bind(this)
        this.handleLocation = this.handleLocation.bind(this)
        this.handleMilage = this.handleMilage.bind(this)
        this.handleFees = this.handleFees.bind(this)
        this.handleLevel = this.handleLevel.bind(this)
        this.handleGroup = this.handleGroup.bind(this)
        this.handleStatus = this.handleStatus.bind(this)
        this.handleSettings = this.handleSettings.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.deleteGame = this.deleteGame.bind(this)
    }

    handleDate (evt) {
        this.setState({date: evt.target.value})
    }
    handleTime (evt) {
        this.setState({time: evt.target.value})
    }
    handleLocation (evt) {
        this.setState({location: evt.target.value})
    }
    handleFees (evt) {
        this.setState({fees: evt.target.value})
    }
    handleLevel (evt) {
        this.setState({level: evt.target.value})
    }
    handleGroup (evt) {
        this.setState({group: evt.target.value})
    }
    handleMilage (evt) {
        this.setState({milage: evt.target.value})
    }
    handleStatus(evt){
        this.setState({status: evt.target.value})

    }
    async callGetGame(){
        const res = await fetchRequest(`game/${this.props.id}`, 'GET')
        // console.log(res)
        this.setState({game: res})
        this.setState({
            date: toDateObj(res.dateTime).toDateString(),
            time: toDateObj(res.dateTime).toLocaleTimeString(),
            location: res.location,
            fees: res.fees / 100,
            group: res.refereeGroup,
            level: res.level,
            milage: res.milage,
            status: res.status
        })
    }
    componentDidMount(){
        this.callGetGame()
    }
    async callUpdateGame() {
        const dateTime = `${this.state.date} ${this.state.time}`
        const data = {
            "dateTime": dateTime,
            "location": this.state.location,
            "milage": this.state.milage,
            "fees": this.state.fees * 100,
            "level": this.state.level,
            "refereeGroup": this.state.group,
            "status": this.state.status
        }
        const res = await postRequest(`game/${this.props.id}`, 'PATCH', { data })
        console.log(res)
        this.setState({game: res, edit: false})
    }
    handleSubmit(evt) {
        evt.preventDefault()
        this.callUpdateGame()
    }
    handleClick(evt){
        evt.preventDefault()
        if(!this.state.edit){
            return this.setState({edit: true})
        }
        this.setState({edit: false})
    }
    handleSettings(evt){
        evt.preventDefault()
        if(!this.state.settings){
            return this.setState({settings: true})
        }
        this.setState({settings: false})
    }
    handleDelete() {
        if(!this.state.delete){
            return this.setState({delete: true})
        }
        this.setState({delete: false})
    }
    async deleteGame(){
        const res = await fetchRequest(`game/${this.props.id}`, 'DELETE')
        if(res.message){
            return this.setState({error: 'Error in deleting game, server error'})
        }
        // console.log(res)

        this.setState({redirect: <Redirect to={'/'} />})
    }
    render(){
        const tableHead = 
        <div className="Single-game">
            <p>
                Date: 
            </p>
            <p>
                Time: 
            </p>
            <p>
                Location: 
            </p>
            <p>
                Miles: 
            </p>
            <p>
                Fees:
            </p>
            <p>
                Level: 
            </p>
            <p>
                Group:
            </p>
            <p>
                Status:
            </p>
        </div>
        const editForm = 
        <div>
            <form className="Single-game" onSubmit={this.handleSubmit}>
                <input placeholder="Date" type="text" onChange={this.handleDate} value={this.state.date} />
                <input placeholder="Time" type="text" onChange={this.handleTime} value={this.state.time} />
                <input placeholder="Location" type="text" onChange={this.handleLocation} value={this.state.location} />
                <input placeholder="Milage" type="text" onChange={this.handleMilage} value={this.state.milage} />
                <input placeholder="Fees" type="text" onChange={this.handleFees} value={this.state.fees} />
                <input placeholder="Level" type="text" onChange={this.handleLevel} value={this.state.level} />
                <input placeholder="Ref Group" type="text" onChange={this.handleGroup} value={this.state.group} />
                <input placeholder="Status" type="text" onChange={this.handleStatus} value={this.state.status} />
                <button>Update:</button>
            </form>
        </div>
        const gameDetails = 
        <div className="Single-game">
            <p>
                {toDateObj(this.state.game.dateTime).toDateString()}
            </p>
            
            <p>
                {toDateObj(this.state.game.dateTime).toLocaleTimeString()}
            </p>
            
            <p>
                {this.state.game.location}
            </p>
            
            <p>
                {this.state.game.milage}
            </p>
            
            <p className="number">
                ${this.state.game.fees / 100}
            </p>
            
            <p>
                {this.state.game.level}
            </p>
            
            <p>
                {this.state.game.refereeGroup}
            </p>
            
            <p>
                {this.state.game.status}
            </p>
        </div>
        const gameSettings = 
        <div>
            <button onClick={this.handleDelete}>Delete Game</button>
            {
                this.state.delete
                ? <button onClick={this.deleteGame}>Yes, Delete</button>
                :''
            }
        </div>
    	return(
    		<div>
                <Link to={'/'}>← Back</Link>
                <button onClick={this.handleClick}>Edit Game</button>
                <button onClick={this.handleSettings}>Settings</button>
                {
                    this.state.settings
                    ? gameSettings
                    : ''
                }
                {this.state.error}
                <div className="Single-game-container">
                    {
                        tableHead
                    }
                    
                    {
                        this.state.edit
                        ? editForm
                        : gameDetails
                    }
                </div>
                {this.state.redirect}
    		</div>
    	);
    }
}
export default SingleGame ;