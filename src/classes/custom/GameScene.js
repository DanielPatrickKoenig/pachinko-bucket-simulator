import { basicColorMaterial } from '../../utils/THREEHelpers';
import BaseScene from '../BaseScene';
import LightController, { LightTypes } from '../../classes/controllers/LightController';

import GroundController from '../../classes/controllers/GroundController';
export default class GameScene extends BaseScene{
    constructor(el){
        super(el);
    }
    initialize(){
        const lc = new LightController({ environment: this.environment });
        lc.addLight({ type: LightTypes.DIRECTIONAL, intensity: 4, target: { x: 0, y: -10, z: -5 } });

        // new GroundController({environment: this.environment}, 'https://danielpatrickkoenig.github.io/spirit-of-kovak/dist/dirt_row.png');

        const redMaterial = basicColorMaterial('cc0000');
        const greenMaterial = basicColorMaterial('00cc00');
        // this.environment.createSphere({size: { r: 1 }, position: { x: 0, y: 0, z: -5 }, material: basicColorMaterial('cc0000') });

        const topBlock = this.environment.createSphere({ size: { r: .5 }, position: { x: 0, y: 3, z: -8 }, material: redMaterial, mass: 0 });
        const block1 = this.environment.createSphere({ size: { r: .5 }, position: { x: 4, y: 3, z: -9 }, material: redMaterial, mass: 1 });
        const block2 = this.environment.createSphere({ size: { r: .5 }, position: { x: 8, y: 3, z: -10 }, material: redMaterial, mass: 1 });
        const block3 = this.environment.createSphere({ size: { r: 1 }, position: { x: 12, y: 3, z: -11 }, material: redMaterial, mass: 2 });

        this.environment.physics.constrain(topBlock.body, block1.body);
        this.environment.physics.constrain(block1.body, block2.body);
        this.environment.physics.constrain(block2.body, block3.body);
        // const floor = this.environment.createBox({ size: { x: 50, y: 1, z: 50 }, position: { x: 0, y: -4, z: -8 }, material: greenMaterial, mass: 0 });
        // console.log(floor);

        
    }
}