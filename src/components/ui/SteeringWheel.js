import { useState } from 'react';
import './SteeringWheel.css';
const SteeringWheel = ({onSpeedChange, onDirectionChange}) => {
    
    const [steeringX, setSetSteeringX] = useState(50);
    const [steeringY, setSetSteeringY] = useState(50);
    const [dragging, setDragging] = useState(false);
    let easeSignature = 0.0;
    const onDown = () => {
        easeSignature = Math.random();;
        setDragging(true);
        if(onSpeedChange){
            onSpeedChange(((steeringY - 50) / 100) * -2);
        }
        
    }
    const onMove = e => {
        if(dragging){
            const xPos = e.touches[0].pageX;
            
            // console.log('event y', e.touches[0].pageY)
            let calcPosX = (xPos / window.innerWidth) * 100;
            if(calcPosX > 100) calcPosX = 100;
            if(calcPosX < 0) calcPosX = 0;
            setSetSteeringX(calcPosX);

            const yPos = e.touches[0].pageY;
            let calcPosY = ((yPos - (window.innerHeight * .75)) / (window.innerHeight * .25)) * 100;
            console.log('calcPosY', calcPosY);
            if(calcPosY > 100) calcPosY = 100;
            if(calcPosY < 0) calcPosY = 0;
            setSetSteeringY(calcPosY);
            if(onDirectionChange){
                onDirectionChange((steeringX - 50) / 100);
            }

            if(onSpeedChange){
                onSpeedChange(((steeringY - 50) / 100) * -2);
            }
            
            // if(onSpeedChange){
            //     onSpeedChange(1);
            // }
        }
    }
    const onUp = () => {
        if(dragging){
            setDragging(true);
            if(onSpeedChange){
                onSpeedChange(0);
            }
            setSetSteeringY(50);
            // easeWheelToCenter();
        }
    }
    
    return <div>
        <svg className="steering-wheel">
            <g>
                <circle
                    className="steering-wheel-dragger"
                    cx={`${steeringX}%`}
                    cy={`${steeringY}%`}
                    r="50"
                    fill="#cc0000"
                    onTouchStart={onDown}
                    onTouchMove={onMove}
                    onTouchEnd={onUp}
                />
            </g>
        </svg>
    </div>
}

export default SteeringWheel;