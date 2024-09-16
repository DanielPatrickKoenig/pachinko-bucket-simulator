import PlayerController from './PlayerController';
export default class Walker1Controller extends PlayerController{
    constructor(data){
        super(data, 'https://danielpatrickkoenig.github.io/three-game-exparament/public/gifty.glb', {x: 0, y: 2, z: 0});
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
    move(direction){
        super.move(direction);
        console.log(this.getLocatables('LocatableController'));
    }
}