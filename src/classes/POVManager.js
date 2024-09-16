import jt from 'jstrig';
import {degreesToRadians, radiansToDegrees} from '../utils/Utilities.js';
const POVModes = {
    THIRD_PERSON: 1,
    FIRST_PERSON: 2,
    SIDE_SCROLL_PERSPECTIVE: 3,
    SIDE_SCROLL_FLAT: 4,
    ISOMETRIC: 5,
    ISOPERSPECTIVE: 6
};
export default class POVManager{
    constructor(player, camera, mode){
        this.player = player;
        this.camera = camera;
        this.angleOffset = {};
        Object.keys(POVModes).forEach(item => this.angleOffset[POVModes[item]] = 0);
        this.distanceToPlayer = 12;
        this.mode = mode ? mode : POVModes.THIRD_PERSON;
    }
    getAngleOffset(){
        return this.angleOffset[this.mode];
    }
    setAngleOffset(offset){
        this.angleOffset[this.mode] = offset;
    }
    reposition(){
        switch(this.mode){
            case POVModes.THIRD_PERSON:{
                this.camera.position.x = jt.orbit(this.player.position.x, this.distanceToPlayer, radiansToDegrees(this.player.rotation.y) + this.getAngleOffset(), jt.OrbitType.COS);
                this.camera.position.z = jt.orbit(this.player.position.z, this.distanceToPlayer, radiansToDegrees(this.player.rotation.y) + this.getAngleOffset(), jt.OrbitType.SIN);
                this.camera.position.y = this.player.position.y + 6;
                this.camera.rotation.y = degreesToRadians(jt.angle({x: this.camera.position.x, y: this.camera.position.z}, {x: this.player.position.x, y: this.player.position.z})) * -1;
                break;
            }
            case POVModes.FIRST_PERSON:{
                this.distanceToPlayer = -2;
                this.camera.position.x = jt.orbit(this.player.position.x, this.distanceToPlayer, radiansToDegrees(this.player.rotation.y), jt.OrbitType.COS);
                this.camera.position.z = jt.orbit(this.player.position.z, this.distanceToPlayer, radiansToDegrees(this.player.rotation.y), jt.OrbitType.SIN);
                this.camera.position.y = this.player.position.y + 4;
                this.camera.rotation.y = degreesToRadians(jt.angle({x: this.camera.position.x, y: this.camera.position.z}, {x: this.player.position.x, y: this.player.position.z}) + 180) * -1;
                break;
            }
            case POVModes.SIDE_SCROLL_PERSPECTIVE:{
                this.camera.position.x = jt.orbit(this.player.position.x, this.distanceToPlayer, -90, jt.OrbitType.COS);
                this.camera.position.z = jt.orbit(this.player.position.z, this.distanceToPlayer, -90, jt.OrbitType.SIN);
                this.camera.position.y = this.player.position.y + 6;
                this.camera.rotation.y = degreesToRadians(jt.angle({x: this.camera.position.x, y: this.camera.position.z}, {x: this.player.position.x, y: this.player.position.z})) * -1;
                break;
            }
            case POVModes.SIDE_SCROLL_FLAT:{
                this.camera.position.x = jt.orbit(this.player.position.x, this.distanceToPlayer, -90, jt.OrbitType.COS);
                this.camera.position.z = jt.orbit(this.player.position.z, this.distanceToPlayer, -90, jt.OrbitType.SIN);
                this.camera.position.y = this.player.position.y;
                this.camera.rotation.y = degreesToRadians(jt.angle({x: this.camera.position.x, y: this.camera.position.z}, {x: this.player.position.x, y: this.player.position.z})) * -1;
                break;
            }
            case POVModes.ISOMETRIC:{
                this.camera.rotation.x = degreesToRadians(-20);
                this.distanceToPlayer = 60;
                this.camera.rotation.y = degreesToRadians(-20);
                this.camera.position.x = jt.orbit(this.player.position.x, this.distanceToPlayer, 180 + 20, jt.OrbitType.COS);
                this.camera.position.z = jt.orbit(this.player.position.z, this.distanceToPlayer, 180 + 20, jt.OrbitType.SIN);
                this.camera.position.y = this.player.position.y + 30;
                // this.camera.rotation.y = degreesToRadians(jt.angle({x: this.camera.position.x, y: this.camera.position.z}, {x: this.player.position.x, y: this.player.position.z})) * -1;
                break;
            }
            case POVModes.ISOPERSPECTIVE:{
                this.distanceToPlayer = 30;
                this.camera.position.x = jt.orbit(this.player.position.x, this.distanceToPlayer, this.getAngleOffset(), jt.OrbitType.COS);
                this.camera.position.z = jt.orbit(this.player.position.z, this.distanceToPlayer, this.getAngleOffset(), jt.OrbitType.SIN);
                this.camera.position.y = this.player.position.y + 12;
                this.camera.rotation.y = degreesToRadians(jt.angle({x: this.camera.position.x, y: this.camera.position.z}, {x: this.player.position.x, y: this.player.position.z})) * -1;
                break;
            }
        }
        
    }
}
export { POVModes };