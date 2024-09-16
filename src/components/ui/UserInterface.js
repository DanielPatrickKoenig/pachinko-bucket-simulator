import { useState } from 'react'; 
import SteeringWheel from './SteeringWheel';
import Peg from './Peg';
import Bumper from './Bumper';
import Ball from './Ball';
import './UserInterface.css';
const UserInterface = ({scene, gameIndex}) => {
    const [ pMarkerX, setPMarkerX ] = useState(0);
    const [ pMarkerY, setPMarkerY ] = useState(0);
    const [ pMarkerZ, setPMarkerZ ] = useState(0);
    const [ pegs, setPegs ] = useState([]);
    const [ bumpers, setBumpers ] = useState([]);
    const processAction = (data, type) => {
        // console.log('action data', data);
        // switch(type){
        //     case 'ball':{
        //         setPMarkerX(data.x);
        //         setPMarkerY(data.y);
        //         break;
        //     }

        //     case 'pegs':{
        //         setPegs(data);
        //         break;
        //     }

        //     case 'bumpers':{
        //         setBumpers(data);
        //         break;
        //     }
        // }
        
        // handle actions here
    }
    const markerClicked = () => {
        scene.hitPinata();
    }

    const directionChange = d => {
        scene.carController.turn(d);
        
    }
    const speedChange = s => {
        scene.carController.move(s * 10);
    }

    scene.setActionHandler(processAction);
        const pinataUI = <div>
            <div className="overlayer">
                <div>
                    <div onClick={markerClicked} style={{left: `${pMarkerX}%`, top: `${pMarkerY}%`}}>
                        <p>Tap this box to hit the pinata</p>
                    </div>
                </div>
            </div>
            <p>{pMarkerX}</p>
            <p>{pMarkerY}</p>
            <p>{pMarkerZ}</p>
        </div>;

        const carUI = <div>
            <SteeringWheel 
                onDirectionChange={directionChange}
                onSpeedChange={speedChange}
            />
        </div>;

        return (
        <div>
            {/* <div className="pachinko-board">
                <div class="pachinko-center">
                    { bumpers.map(item => <Bumper x={item.x} y={item.y} />) }
                    { pegs.map(item => <Peg x={item.x} y={item.y} />) }
                    <Ball x={pMarkerX} y={pMarkerY} />
                </div>
            </div> */}
            {gameIndex === 0 ? pinataUI : carUI}
        </div>
    );
}
export default UserInterface;