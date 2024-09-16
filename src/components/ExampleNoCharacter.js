import ExampleScene from '../classes/examples/ExampleScene';
import { createRef } from 'react';
const Game = () => {
    let gameContainer = createRef();
    
    const createScene = async () => {
        while(!gameContainer.current){
            await new Promise(resolve => setTimeout(resolve), 5);
        }
        return new ExampleScene(gameContainer.current);
    }
    const scene = createScene();
    return (
        <div>
            <div ref={gameContainer} className="game-container"></div>
        </div>
    );
}

export default Game;
