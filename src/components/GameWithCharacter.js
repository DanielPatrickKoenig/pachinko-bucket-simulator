import PlayerControl from './PlayerControl';
import UserInterface from './ui/UserInterface';
import { createRef } from 'react';
import { createScene } from '../engine';
import './GameWithCharacter.css';
const GameWithCharacter = () => {
    let gameContainer = createRef();
    const speed = 10;
    const turnSpeed = .5;
    const gameIndex = 1;
    const scene = createScene(null, gameIndex);
    const start = async () => {
        while(!gameContainer.current){
            await new Promise(resolve => setTimeout(resolve), 5);
        }
        scene.setup(gameContainer.current);
    }
    start();
    const downPressed = () => {
        scene.carController.move(speed);
        // scene.getPlayerControllers().forEach(item => item.move(speed));
    };
    const downReleased = () => {
        scene.carController.move(0);
        // scene.getPlayerControllers().forEach(item => item.moveStop());
    }
    const upPressed = async () => {
        scene.carController.move(speed);
    };
    const upReleased = () => {
        scene.carController.move(0);
    }
    const leftPressed = () => {
        scene.carController.turn(turnSpeed * -1);
        // scene.getPlayerControllers().forEach(item => item.directionChange(turnSpeed * -1));
    };
    const rightPressed = () => {
        scene.carController.turn(turnSpeed);
        // scene.getPlayerControllers().forEach(item => item.directionChange(turnSpeed));
    };
    const spacePressed = () => {
        scene.getPlayerControllers().forEach(item => item.space());
    };
    const leftReleased = () => {
        scene.carController.turn(0);
    }
    const rightReleased = () => {
        scene.carController.turn(0);
    }
    const pointerStarted = (e) => {
        if(e.mobile){
            scene.getPlayerControllers().forEach(item => item.move(speed * -1));
        }
        else{
            scene.getPlayerControllers().forEach(item => item.povStart(e));
        }
    }
    const pointerChanged = (e) => {
        if(e.mobile){
            scene.getPlayerControllers().forEach(item => item.directionChange(e.direction));
        }
        else{
            scene.getPlayerControllers().forEach(item => item.povChange(e.position));
        }
        
    }
    const pointerStopped = (e) => {
        if(e.mobile){
            scene.getPlayerControllers().forEach(item => item.moveStop());
        }
        
    }
    return (
        <div>
            <div ref={gameContainer} className={`game-container ${gameIndex === 1 ? 'car-game-container' : ''}`}></div>
            <PlayerControl 
                onPressDown={downPressed}
                onPressUp={upPressed}
                onPressLeft={leftPressed}
                onPressRight={rightPressed}
                onPressSpace={spacePressed}
                onReleaseDown={downReleased}
                onReleaseUp={upReleased}
                onReleaseLeft={leftReleased}
                onReleaseRight={rightReleased}
                onPointerStart={pointerStarted}
                onPointerChange={pointerChanged}
                onPointerStop={pointerStopped}
            >
                <UserInterface scene={scene} gameIndex={gameIndex} />
            </PlayerControl>
        </div>
    );
}

export default GameWithCharacter;
