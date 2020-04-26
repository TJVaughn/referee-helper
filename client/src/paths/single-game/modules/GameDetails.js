import React, { Component } from 'react';
import getRequest from '../../../utils/getRequest';
import { toDateObj } from '../../../utils/toDateObj';

class GameDetails extends Component {
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
            distance: '',
            duration: '',
            status: '',
            duration: '',
            platform: '',
            paid: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handlePaid = this.handlePaid.bind(this)
    }

    handlePaid(){
        return this.setState({paid: !this.state.paid})
    }
    handleSubmit(evt){
        evt.preventDefault()
    }
    handleChange(evt){
        this.setState({[evt.target.name]: evt.target.value})
    }
    async callGetGame(){
        const res = await getRequest(`game/${this.props.id}`)
        // console.log(res)
        this.setState({game: res})
        this.setState({
            date: toDateObj(res.dateTime).toLocaleDateString(),
            time: toDateObj(res.dateTime).toLocaleTimeString(),
            location: res.location,
            distance: res.distance,
            duration: res.duration,
            fees: res.fees / 100,
            group: res.refereeGroup,
            level: res.level,
            milage: res.milage,
            status: res.status,
            platform: res.platform,
            paid: res.paid
        })
    }
    componentDidMount(){
        this.callGetGame()
    }
    render(){
    	return(
    		<div>
    			<form className="Single-game" onSubmit={this.handleSubmit}>
                    <input name="date" placeholder="Date" type="text" onChange={this.handleChange} value={this.state.date} />
                    <input name="time" placeholder="Time" type="text" onChange={this.handleChange} value={this.state.time} />
                    <input name="location" placeholder="Location" type="text" onChange={this.handleChange} value={this.state.location} />
                    <input name="distance" placeholder="distance" type="text" onChange={this.handleChange} value={this.state.distance} />
                    <input name="duration" placeholder="duration" type="text" onChange={this.handleChange} value={this.state.duration} />
                    <input name="fees" placeholder="Fees" type="text" onChange={this.handleChange} value={this.state.fees} />
                    <input name="level" placeholder="Level" type="text" onChange={this.handleChange} value={this.state.level} />
                    <input name="group" placeholder="Ref Group" type="text" onChange={this.handleChange} value={this.state.group} />
                    <input name="status" placeholder="Status" type="text" onChange={this.handleChange} value={this.state.status} />
                    <p>{this.state.game.gameCode}</p>
                    <p>{this.state.platform}</p>
                    <p id="Single-game-paid-btn" className={this.state.paid ? 'paid' : 'unpaid'} onClick={this.handlePaid}>{this.state.paid ? 'paid' : 'unpaid'}</p>
                    <button>Update:</button>
                </form>
    		</div>
    	);
    }
}
export default GameDetails;

// import React, { useEffect, useState } from 'react'
// import getRequest from '../../../utils/getRequest'
// import useInput from '../../../hooks/useInput'
// import useToggle from '../../../hooks/useToggle'
// import formatNumber from '../../../utils/formatNumber'

// function GameDetails(props){
//     const [ gameState, setGameState ] = useState({})
//     const [ loading, setLoading ] = useToggle(true)
//     const [ paid, setPaid ] = useToggle(false)
//     async function getGame(){
//         const game = await getRequest(`game/${props.id}`)
//         console.log(game)
//         setLoading(false)
//         setGameState(game)
//         setPaid(game.paid)
//     }
    
//     useEffect(() => {
//         getGame()
//     }, [])

    
//     const updateGame = async () => {
//         console.log()
//     }
//     const [inputState, setInputState ] = useState({
//         date: new Date(gameState.dateTime).toLocaleDateString(),
//         time: 'hello'
//     })
//     // const { formInput, handleInputChange, handleSubmit } = useInput(updateGame) 
//     function handleChange(evt){
//         const value = evt.target.value
//         setInputState({
//             ...inputState,
//             [evt.target.name]: value
//         })
//     }
//     const handleSubmit = (evt) =>{
//         evt.preventDefault()
//     }
    
//     function Form(){
//         return (
//             <form onSubmit={handleSubmit}>
//                 <input name="date" type="text" value={inputState.date} onChange={handleChange} />
//                 <input name="time" type="text" value={inputState.time} onChange={handleChange} />
//                 {/* <input name="location" type="text" value={formInput.location} onChange={handleInputChange} defaultValue={gameState.location} />
//                 <input name="distance" type="text" value={formInput.distance} onChange={handleInputChange} defaultValue={`${formatNumber(gameState.distance * 10)}`} />
//                 <input name="duration" type="text" value={formInput.duration} onChange={handleInputChange} defaultValue={gameState.duration} />
//                 <input name="fees" type="text" value={formInput.fees} onChange={handleInputChange} defaultValue={gameState.fees} />
//                 <input name="level" type="text" value={formInput.level} onChange={handleInputChange} defaultValue={gameState.level} />
//                 <input name="group" type="text" value={formInput.group} onChange={handleInputChange} defaultValue={gameState.refereeGroup} />
//                 <input name="status" type="text" value={formInput.status} onChange={handleInputChange} defaultValue={gameState.status} />
//                 <p>{gameState.gameCode}</p>
//                 <p>{gameState.platform}</p>
//                 <p className={paid ? 'paid' : 'unpaid'} id="Single-game-paid-btn" onClick={() => {setPaid(!paid)}}>{paid ? 'paid' : 'unpaid'}</p> */}
//                 <button>update</button>
//             </form>
//         )
//     }

//     return (
//         <div>
//             {loading
//             ? 'loading game data'
//             :<Form />}
            
//         </div>
//     )
// }

// export default GameDetails

