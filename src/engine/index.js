import PinataScene from '../classes/custom/PinataScene';
import PachincoScene from '../classes/custom/PachincoScene';
function createScene(element, gameIndex=1){
    switch(gameIndex){
        case 0:{
            return new PinataScene(element);
        }
        case 1:{
            return new PachincoScene(element);
        }
    }
}
export {createScene};