import BaseController, {ControllerTypes} from './BaseController';
import jt from 'jstrig';
export default class LocatableController extends BaseController{
    constructor(data, startPosition){
        super(data);
        this.startPosition = startPosition;
    }
    getControllerType(){
        return ControllerTypes.CUSTOM_MESH;
    }
    location(){
        return this.startPosition;
    }
    getMinimumDistance(){
        return 1;
    }
    insideThreshold (lc) {
        const distance = jt.distance({x: this.location().x, y: this.location().z}, {x: lc.location().x, y: lc.location().z});
        return distance < this.getMinimumDistance();
    }
}