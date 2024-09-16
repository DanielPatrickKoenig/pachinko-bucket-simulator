import {ControllerTypes} from './BaseController';
import CustomMeshController from './CustomMeshController';
import RigManager from '../RigManager';
import Navigator from '../Navigator';
import { POVModes } from '../POVManager';

export default class CharacterController extends CustomMeshController{
    constructor(data, glbFile, startPosition){
        super(data, glbFile, startPosition);
        this.navigator = null;
        this.rigManager = null;
    }
    async loadModel (){
        const model = await this.environment.loadModel(this.glbFile);
        this.scene.add(model);
        model.rotateY(-180 * (Math.PI/180));
        this.modelLoaded(model);
    }
    update(){
        if(this.navigator){
            const onFloor = this.physics && this.physics.onFloor(this.navigator.physicsBody);
            if(this.rigManager.currentState === 'idle' && onFloor){
                this.navigator.idle();
            }
            this.navigator.syncToBody();
        }
    }
    modelLoaded(model){
        this.rigManager = new RigManager({
            model,
            camera: this.camera, 
            scene: this.scene
        });
        this.navigator = new Navigator(model, .1, this.environment, this.startPosition);
    }
    getControllerType(){
        return [ControllerTypes.CHARACTER];
    }
    move(direction){
        switch(this.environment.povMode){
            case POVModes.THIRD_PERSON:
            case POVModes.FIRST_PERSON:
            case POVModes.ISOMETRIC:
            case POVModes.ISOPERSPECTIVE:
            {
                this.rigManager.currentState = 'moving';
                if(direction < 0){
                    this.navigator.moveForward();
                }
                if(direction > 0){
                    this.navigator.moveBackward();
                }
                break;
            }
            case POVModes.SIDE_SCROLL_PERSPECTIVE:{
                this.rigManager.currentState = 'moving';
                const upOrDown = this.navigator.mover.rotation.y > 0 ? direction > 0 : direction < 0;
                this.navigator.moveLateral2D(upOrDown);
                break;
            }
        }
    }
    directionChange(change){
        switch(this.environment.povMode){
            case POVModes.THIRD_PERSON:
            case POVModes.FIRST_PERSON:
            case POVModes.ISOMETRIC:
            case POVModes.ISOPERSPECTIVE:
            {
                if(change<0){
                    this.navigator.turnLeft();
                }
                else if(change>0){
                    this.navigator.turnRight();
                }
                else{
                    this.navigator.stopTurning();
                }
                this.navigator.turn(change);
                break;
            }
            case POVModes.SIDE_SCROLL_FLAT:
            case POVModes.SIDE_SCROLL_PERSPECTIVE:
            {
                if(Math.abs(change)){
                    if(change<0){
                        this.navigator.turnLeft();
                        this.navigator.setRotation(180);
                    }
                    else if(change>0){
                        this.navigator.turnRight();
                        this.navigator.setRotation(0);
                    }
                    this.rigManager.currentState = 'moving';
                    this.navigator.moveForward();
                }
                else{
                    this.navigator.stopTurning();
                    this.rigManager.currentState = 'idle';
                    this.navigator.stopMoving();
                }
                break;
            }
        }
        
    }
    moveStop(){
        this.rigManager.currentState = 'idle';
        this.navigator.stopMoving();
    }
    space(){
        this.navigator.jump();
    }
    setState(state){
        if(this.rigManager){
            this.rigManager.currentState = state;
        }
        
    }
    location(){
        return this.navigator && this.navigator.physicsMesh ? this.navigator.physicsMesh.position : this.startPosition;
    }
}