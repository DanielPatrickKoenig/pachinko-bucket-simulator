import CharacterController from './CharacterController';
import { POVModes } from '../POVManager'; 
export default class Walker2Controller extends CharacterController{
    constructor(data){
        super(data, 'https://danielpatrickkoenig.github.io/three-game-exparament/public/gifty.glb', {x: 4, y: 2, z: 0});
    }
    modelLoaded(model){
        super.modelLoaded(model);
        this.rigManager.currentState = 'idle';
        this.rigManager.cycle('rightLeg', 'z', [{value:-30, time:.5}, {value:30, time:.5}], ['moving', 'carying']);
        this.rigManager.cycle('leftLeg', 'z', [{value:30, time:.5}, {value:-30, time:.5}], ['moving', 'carying']);
        this.rigManager.cycle('rightLeg', 'z', [{value:0, time:.5}], ['idle', 'holding']);
        this.rigManager.cycle('leftLeg', 'z', [{value:0, time:.5}], ['idle', 'holding']);
        this.rigManager.cycle('leftArm', 'z', [{value:-90, time:.5}], ['moving', 'idle']);
        this.rigManager.cycle('leftArm', 'y', [{value:0, time:.5}], ['idle']);
        this.rigManager.cycle('leftArm', 'y', [{value:-20, time:.5}, {value:20, time:.5}], ['moving']);
        this.rigManager.cycle('leftArm', 'y', [{value:90, time:.5}], ['carying', 'holding']);
        this.rigManager.cycle('rightArm', 'z', [{value:90, time:.5}], ['moving', 'idle']);
        this.rigManager.cycle('rightArm', 'y', [{value:0, time:.5}], ['idle']);
        this.rigManager.cycle('rightArm', 'y', [{value:-20, time:.5}, {value:20, time:.5}], ['moving']);
        this.rigManager.cycle('rightArm', 'y', [{value:-90, time:.5}], ['carying', 'holding']);
    }
    update(){
        super.update();
        if(this.navigator){
            switch(this.environment.povMode){
                case POVModes.THIRD_PERSON:
                case POVModes.FIRST_PERSON:
                case POVModes.ISOMETRIC:
                case POVModes.ISOPERSPECTIVE:
                {
                    this.move(-1);
                    break;
                }
                case POVModes.SIDE_SCROLL_FLAT:
                case POVModes.SIDE_SCROLL_PERSPECTIVE:
                {
                    this.directionChange(1);
                    break;
                }
            }
        }
        
    }
}