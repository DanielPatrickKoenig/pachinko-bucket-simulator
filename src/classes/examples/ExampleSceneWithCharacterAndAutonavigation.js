import BaseScene from '../BaseScene';
import LightController, {LightTypes} from '../controllers/LightController';
import GroundController from '../controllers/GroundController';
import ExamplePlayerController from './ExamplePlayerController';
import ExampleCharacterController from './ExampleCharacterController';
import AutoNavigationController from '../controllers/AutoNavigationController';
import CheckpointController from '../controllers/CheckpointController';
import { POVModes } from '../POVManager';
export default class ExampleSceneWithCharacterAndAutonavigation extends BaseScene{
    constructor(el){
        super(el);
    }
    initialize(){

        const lightController = new LightController({environment: this.environment});
        lightController.addLight({type: LightTypes.DIRECTIONAL, color: 0xffffff, intensity: 1.5, target: {x: 20, y: 0, z: 15}});
        lightController.addLight({type: LightTypes.DIRECTIONAL, color: 0xffffff, intensity: .5, target: {x: -5, y: 0, z: -22}});


        new GroundController({environment: this.environment}, 'https://danielpatrickkoenig.github.io/spirit-of-kovak/dist/dirt_row.png');
        
        const player = new ExamplePlayerController({environment: this.environment});
        new ExampleCharacterController({environment: this.environment});

        new AutoNavigationController({environment: this.environment}, [{x: 9, y: 0, z: 5}, {x: 9, y: 0, z: 8}, {x: 12, y: 0, z: 8}, {x: 14, y: 0, z: 8}, {x: 14, y: 0, z: 12}, {x: 19, y: 0, z: 12}], player);

        const checkpoints = [];

        checkpoints.push(new CheckpointController({environment: this.environment}, {x: 12, y: 0, z: 8}, player, () => this.onCheckpoint(0) ));
        checkpoints.push(new CheckpointController({environment: this.environment}, {x: 14, y: 0, z: 12}, player, () => this.onCheckpoint(1) ));
    }

    onCheckpoint(index){
        this.emitActionHandler(index, 'checkpoint');
    }

    getPOVMode(){
        return POVModes.ISOPERSPECTIVE;
    }
}