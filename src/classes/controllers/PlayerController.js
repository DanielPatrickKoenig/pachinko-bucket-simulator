import {ControllerTypes} from './BaseController';
import CharacterController from './CharacterController';
import POVManager from '../POVManager';
export default class PlayerController extends CharacterController{
    constructor(data, glbFile, startPosition){
        super(data, glbFile, startPosition);
        this.povBase = 0;
        this.pov = null;
    }
    update(){
        super.update();
        if(this.pov){
            this.pov.reposition();
        }
    }
    getControllerType(){
        return ControllerTypes.PLAYER;
    }
    modelLoaded(model){
        super.modelLoaded(model);
        this.pov = new POVManager(model, this.environment.cameraContainer, this.environment.povMode);
        this.pov.reposition();
    }
    povStart(e){
        this.povBase = this.pov.getAngleOffset();
        if(e.mobile){
            this.rigManager.currentState = 'moving';
            this.navigator.mobileMoving = true;
        }
        
    }
    povEnd(e){
        if(e.mobile){
            this.rigManager.currentState = 'idle';
            this.navigator.mobileMoving = false;
        }
    }
    povChange(e){
        this.pov.setAngleOffset(this.povBase + e.x);
        // this.pov.angleOffset =this.povBase + e.x;
        this.pov.reposition();
    }
    getLocatables(){
        return this.getControllersOfType('LocatableController');
    }
    
}