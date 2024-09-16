import BaseScene from '../BaseScene';
import LightController, {LightTypes} from '../controllers/LightController';
import GroundController from '../controllers/GroundController';
import ExamplePlayerController from './ExamplePlayerController';
import ExampleCharacterController from './ExampleCharacterController';
export default class ExampleSceneWithCharacter extends BaseScene{
    constructor(el){
        super(el);
    }
    initialize(){

        const lightController = new LightController({environment: this.environment});
        lightController.addLight({type: LightTypes.DIRECTIONAL, color: 0xffffff, intensity: 1.5, target: {x: 20, y: 0, z: 15}});
        lightController.addLight({type: LightTypes.DIRECTIONAL, color: 0xffffff, intensity: .5, target: {x: -5, y: 0, z: -22}});


        new GroundController({environment: this.environment}, 'https://danielpatrickkoenig.github.io/spirit-of-kovak/dist/dirt_row.png');

        new ExamplePlayerController({environment: this.environment});
        new ExampleCharacterController({environment: this.environment});
    }
}