import BaseScene from '../BaseScene';
import LightController, { LightTypes } from '../../classes/controllers/LightController';
import GroundController from '../../classes/controllers/GroundController';
import CarController from './CarController';
import LiftController from '../../classes/controllers/LiftController';
import { basicColorMaterial } from '../../utils/THREEHelpers';
export default class CarScene extends BaseScene{
    constructor(el){
        super(el);
        this.carController = null;
    }
    initialize(){
        const lc = new LightController({ environment: this.environment });
        lc.addLight({ type: LightTypes.DIRECTIONAL, intensity: 4, target: { x: 0, y: -10, z: -5 } });

        new GroundController({environment: this.environment}, 'https://danielpatrickkoenig.github.io/spirit-of-kovak/dist/dirt_row.png');

        this.environment.cameraContainer.position.y = 3;
        this.environment.cameraContainer.position.z = 15;

        this.carController = new CarController({environment: this.environment});

        // this.carController = new CarController({environment: this.environment, 
        //     bodyModel: this.environment.createSphere({size: {r: .5}, position: {x: 0, y: 0, z: 0}, material: basicColorMaterial('0000cc')}).mesh,
        //     wheelModels: [
        //         this.environment.createSphere({size: {r: .1}, position: {x: 0, y: 0, z: 0}, material: basicColorMaterial('0000cc')}).mesh,
        //         this.environment.createSphere({size: {r: .1}, position: {x: 0, y: 0, z: 0}, material: basicColorMaterial('0000cc')}).mesh,
        //         this.environment.createSphere({size: {r: .1}, position: {x: 0, y: 0, z: 0}, material: basicColorMaterial('0000cc')}).mesh,
        //         this.environment.createSphere({size: {r: .1}, position: {x: 0, y: 0, z: 0}, material: basicColorMaterial('0000cc')}).mesh
        //     ]
        // });

        [...new Array(500).keys()].forEach(item => {
            const rockSize = (Math.random() * .4) + .1;
            const rock = this.environment.createSphere({size:{r: rockSize / 2}, position: { x: (Math.random() * 30) - 15, y: 0, z: (Math.random() * 30) - 15}, material: basicColorMaterial('00cc00'), mass: 0});

        });

        this.environment.createBox({size: {x: 6, y: .25, z: 20}, position: {x: 6, y: 0, z: -20}, mass: 0, material: basicColorMaterial('0000cc')});
        this.environment.createBox({size: {x: 6, y: .5, z: 16}, position: {x: 6, y: 0, z: -20}, mass: 0, material: basicColorMaterial('0000cc')});
        this.environment.createBox({size: {x: 6, y: .75, z: 12}, position: {x: 6, y: 0, z: -20}, mass: 0, material: basicColorMaterial('0000cc')});
        this.environment.createBox({size: {x: 6, y: 1, z: 8}, position: {x: 6, y: 0, z: -20}, mass: 0, material: basicColorMaterial('0000cc')});

        new LiftController({environment: this.environment, size: {x: 6, y: .25, z: 8}, position: {x: 0, y: .5, z: -20}, delay: 100});


    }
    getWidth(){
        return 300;
    }
    getHeight(){
        return 600;
    }
}