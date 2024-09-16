import BaseScene from '../BaseScene';
import LightController, { LightTypes } from '../../classes/controllers/LightController';
import PinataController from './PinataController';
import { degreesToRadians } from '../../utils/Utilities';
import { basicColorMaterial, getCanvasPosition } from '../../utils/THREEHelpers';
export default class PinataScene extends BaseScene{
    constructor(el){
        super(el);
        this.pinataController = null;
        this.hitForce = 9000;
    }
    initialize(){
        const lc = new LightController({ environment: this.environment });
        lc.addLight({ type: LightTypes.DIRECTIONAL, intensity: 4, target: { x: 0, y: -10, z: 5 } });

        this.environment.cameraContainer.position.y = 6;
        this.environment.cameraContainer.position.z = -20;
        this.environment.cameraContainer.rotation.y = degreesToRadians(180);

        this.pinataController = new PinataController({ environment: this.environment });

        this.pinataController.onPinataMoved = (data) => {
            const translatedPosition = getCanvasPosition(data.mesh, this.environment)
            this.emitActionHandler(translatedPosition, 'automatic');
        };

    }
    async hitPinata(){
        const hitter = this.environment.createSphere({size: {r: .25}, position: {x: this.pinataController.pinata.mesh.position.x, y: this.pinataController.pinata.mesh.position.y, z: this.pinataController.pinata.mesh.position.z - 3},mass: 5, material: basicColorMaterial('cc00cc')});
        this.environment.physics.addForce(hitter.body, {x: 0, y: 0, z: this.hitForce});
        hitter.mesh.visible = false;

        this.pinataController.breakOffPiece();

        await new Promise(resolve => setTimeout(resolve, 1000));
        this.environment.physics.world.remove(hitter.body);
        this.environment.scene.remove(hitter.mesh);

        // this.environment.physics.addForce(this.pinataController.pinata.body, {x: (Math.random() * 4000) - 2000, y: Math.random() * 4000, z: 6000});
    }
    
}