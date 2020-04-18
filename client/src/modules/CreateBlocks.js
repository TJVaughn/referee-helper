import React, { Component } from 'react';

class CreateBlocks extends Component {
    render(){
    	return(
    		<div>
                <h4 title="Create blocks for future games that are not on the respective platform.">Automatically Generate Blocks: </h4>
                <div className="Create-blocks-container">
                    <p title="This will automatically make 'Part Day Blocks' on the Arbiter Sports platform. 
                    For each game that isn't on AS, a time slot will be blocked 1 hour prior, to 2 hours after the start time">
                        Create Arbiter Sports blocks
                    </p>
                    <p title="This will automatically make 'Not Available Between' blocks on the Horizon Web Ref platform. 
                    For each game that isn't on HWR, a time slot will be blocked 1 hour prior, to 2 hours after the start time. 
                    Warning, if you have a full day block on a given day, this will override that and change it to a 'Not Available Between' block ">
                        Create Horizon Web Ref blocks
                    </p>
                    <p title="Create blocks for future games that are not on the respective platform.">
                        Create blocks for both
                    </p>
                </div>
    		</div>
    	);
    }
}
export default CreateBlocks ;