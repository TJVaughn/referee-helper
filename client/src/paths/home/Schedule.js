import React, { useEffect } from 'react'
import CreateGame from './modules/CreateGame'
import AllGames from './modules/AllGames'
import SyncSchedules from './modules/SyncSchedules'
import AddArena from './modules/AddArena'
import CreateBlocks from './modules/CreateBlocks';
import { getCookie } from '../../utils/cookies'
import useToggle from '../../hooks/useToggle'

export default function Schedule(){
	const [gameToggle, setGameToggle ] = useToggle(false)
	const [locToggle, setLocToggle ] = useToggle(false)
	const [syncToggle, setSyncToggle ] = useToggle(false)
	const [blocksToggle, setBlocksToggle ] = useToggle(false)
	
	useEffect(() => {
		if(getCookie('InitialLoginFlow') === 'true'){
			return setSyncToggle(true)
		}
	}, [setSyncToggle])
	return (
		<div>
			<div className="Schedule-schedule-header">
				<p onClick={() =>{setGameToggle(!gameToggle)}} className="pointer">Create New Game</p>
				<p onClick={() =>{setLocToggle(!locToggle)}} className="pointer">Add Location</p>
				<p onClick={() =>{setSyncToggle(!syncToggle)}} className="pointer">Sync your schedule</p>
				<p onClick={() =>{setBlocksToggle(!blocksToggle)}} className="pointer">Create Blocks</p>
			</div>
			{gameToggle ? <CreateGame /> :''}
			{locToggle ?<AddArena /> :''}
			{syncToggle ? <SyncSchedules /> : ''}
			{blocksToggle ? <CreateBlocks /> : ''}
			<AllGames />
		</div>
	)
}

// was 92 LINES!!! and 2,366 bytes!
//Now 36 lines and 1,410 bytes! a 40.4% decrease!