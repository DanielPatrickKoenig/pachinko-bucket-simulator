import { basicColorMaterial } from '../../utils/THREEHelpers';
import BaseScene from '../BaseScene';
import LightController, { LightTypes } from '../../classes/controllers/LightController';
import GroundController from '../../classes/controllers/GroundController';
import BowlingPinController from './BowlingPinController';
export default class BowlingScene extends BaseScene{
    constructor(el){
        super(el);
    }
    initialize(){
        const lc = new LightController({ environment: this.environment });
        lc.addLight({ type: LightTypes.DIRECTIONAL, intensity: 4, target: { x: 0, y: -10, z: -5 } });

        new GroundController({environment: this.environment}, 'https://danielpatrickkoenig.github.io/spirit-of-kovak/dist/dirt_row.png');

        this.environment.cameraContainer.position.y = 2;
        this.environment.cameraContainer.position.z = 10;

        new BowlingPinController({ environment: this.environment }, { x: 0, y: .25, z: 0 });

        new BowlingPinController({ environment: this.environment }, { x: 1, y: .25, z: -1 });
        new BowlingPinController({ environment: this.environment }, { x: -1, y: .25, z: -1 });

        new BowlingPinController({ environment: this.environment }, { x: 2, y: .25, z: -2 });
        new BowlingPinController({ environment: this.environment }, { x: 0, y: .25, z: -2 });
        new BowlingPinController({ environment: this.environment }, { x: -2, y: .25, z: -2 });

        new BowlingPinController({ environment: this.environment }, { x: 3, y: .25, z: -3 });
        new BowlingPinController({ environment: this.environment }, { x: 1, y: .25, z: -3 });
        new BowlingPinController({ environment: this.environment }, { x: -1, y: .25, z: -3 });
        new BowlingPinController({ environment: this.environment }, { x: -3, y: .25, z: -3 });

        const greenMat = basicColorMaterial('00cc00');

        const bBall = this.environment.createSphere({ size: { r: .75 }, position: { x: 0, y: 1.75, z: 8 }, material: greenMat, mass: 15});

        setTimeout(() => {
            this.environment.physics.addForce(bBall.body, {x: (Math.random() * 8000) - 4000, y: 0, z: -24000});

        },2000);
    }
}