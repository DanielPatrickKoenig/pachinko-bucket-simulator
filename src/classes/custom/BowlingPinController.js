import CustomMeshController from '../controllers/CustomMeshController';
import { basicColorMaterial } from '../../utils/THREEHelpers';
export default class BowlingPinController extends CustomMeshController{
    constructor(data, {x, y, z}){
        super(data, 'https://eprize-content.s3.amazonaws.com/three_js_demo/assets/bowlingPin.glb');
        this.pinPosition = {x,y,z};

        
    }

    modelLoaded(model){
        this.model = model;
        const scale = .25;
        model.scale.x = scale;
        model.scale.y = scale;
        model.scale.z = scale;

        const {x,y,z} = this.pinPosition;

        const greenMat = basicColorMaterial('00cc00');

        this.base = this.environment.createBox({ size: { x: .25, y: .25, z: .25 }, position: { x, y, z }, material: greenMat, mass: 1 });
        this.center = this.environment.createSphere({ size: { r: .5 }, position: { x, y: y + 1.5, z }, material: greenMat, mass: 1 });
        this.top = this.environment.createSphere({ size: { r: .25 }, position: { x, y: y + 3.5, z }, mass: 1, customMesh: model });
        this.center.mesh.visible = false;
        this.base.mesh.visible = false;

        this.environment.physics.lock(this.base.body, this.center.body);
        this.environment.physics.lock(this.center.body, this.top.body);
        // console.log(model);
    }

    isDown() {
        const angleSum = Math.abs(this.base.mesh.rotation.x) + Math.abs(this.base.mesh.rotation.z);
        return angleSum >= 1;
    }
    
}