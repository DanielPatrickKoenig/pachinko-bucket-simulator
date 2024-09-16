import CustomMeshController from '../controllers/CustomMeshController';
import { basicColorMaterial } from '../../utils/THREEHelpers';
import * as THREE from 'three';
import { degreesToRadians } from '../../utils/Utilities';
export default class PinataController extends CustomMeshController{
    constructor(data){
        super(data, 'https://danielpatrickkoenig.github.io/shared-app-resources/pinata3.glb');

        this.onPinataMoved = null;
        this.links = [];
        this.pipes = [];
        this.hits = 0;
        this.maxHits = 5;
        this.pinata = null;
        this.ropeThickness = .1;
        this.jointCount = 6;
        this.linkSize = .3; // links connect the joints and are invisible. higher size means more stability
        this.remainingChunkIndexes = [2, 9, 14, 17];
    }
    modelLoaded(model){
        model.scale.z = -1;
        model.scale.x = -1;
        const greenMat = basicColorMaterial('00cc00');
        greenMat.transparent = true;
        greenMat.opacity = 0;
        const blueMat = basicColorMaterial('0000cc');
        const chainProps = { start: {x: 0, y: 16, z: 0}, jump: 1.125 };
        const chainTop = this.environment.createSphere({size: {r: this.linkSize}, position: chainProps.start, material: greenMat, mass: 0 });
        this.links = [...new Array(this.jointCount).keys()].map(item => this.environment.createSphere({size: { r: this.linkSize }, position: { ...chainProps.start, y: chainProps.start.y - (chainProps.jump * (item + 1)) }, material: greenMat, mass: 1 }));
        // this.links = [...new Array(6).keys()].map(item => this.environment.createSphere({size: { r: .2 }, position: basePositions.links[item], material: redMat, mass: 1 }));
        this.links.forEach((item, index) => {
            const lastObj = index === 0 ? chainTop.body : this.links[index - 1].body;
            this.environment.physics.constrain(lastObj, item.body, .5);

        });

        this.pinata = this.environment.createBox({size: {x: 2, y: 1, z: 3}, position: { ...chainProps.start, y: chainProps.start.y - (chainProps.jump * (this.links.length)) - (chainProps.jump * 2) }, customMesh: model, mass: 20 });
        this.environment.physics.constrain(this.links[this.links.length - 1].body, this.pinata.body, 1);

        this.pipes = this.links.map((item, index) => {
            const container = new THREE.Object3D();
            const proxy = new THREE.Object3D();
            const innerContainer = new THREE.Object3D();
            const pipe = this.environment.createCylinder({ size: {r: this.ropeThickness, y: index === this.links.length - 1 ? 3 : 1.5}, position: { x: 0, y: 0, z: 0 }, material: blueMat })
            const joint = this.environment.createSphere({size: { r: this.ropeThickness }, position: { ...chainProps.start, y: chainProps.start.y - (chainProps.jump * (item + 1)) }, material: blueMat });
            this.links[index].mesh.add(container);
            this.links[index].mesh.add(proxy);
            container.add(innerContainer);
            innerContainer.add(pipe.mesh);
            container.add(joint.mesh);
            innerContainer.rotation.x = degreesToRadians(90);
            innerContainer.position.z =  index === this.links.length - 1 ? -.75 : .75; 
            const start = item.mesh;
            const end = index === this.links.length - 1 ? this.pinata.group : this.links[index + 1].mesh;
            return {start, end, container, proxy};

        });
        
        
    }
    update(){
        if(this.pinata && this.onPinataMoved){
            this.onPinataMoved(this.pinata);
        }
        this.pipes.forEach((item, index) => {
            if(item.end && item.end.position){
                item.proxy.lookAt(item.end.position);
            }
            else{
                item.proxy.lookAt(this.pipes[index - 1].start.position);
            }
            item.container.rotation.x = item.proxy.rotation.x;
            item.container.rotation.y = item.proxy.rotation.y;
            item.container.rotation.z = item.proxy.rotation.z;

            
        });
        
    }

    getBasePositions () {
        return {
            links: JSON.parse('[{"x":0.25000260531054147,"y":15.279178231653827,"z":0.2496779888851987},{"x":0.2500080232775214,"y":13.851506029054319,"z":0.24902614736459736},{"x":0.2500140677826064,"y":12.424187436325294,"z":0.2483506005567428},{"x":0.25002093127805625,"y":10.99730527686605,"z":0.24765474425916392},{"x":0.25002857564798175,"y":9.570933042333886,"z":0.24694369934367674},{"x":0.2500365156923629,"y":8.145140711104311,"z":0.246222896756961}]'),
            pinata: JSON.parse('{"x":0.24926154920356008,"y":5.316430174930662,"z":0.2621179257249421}')
        }
    }

    breakOffPiece(){
        this.hits++;
        if(this.hits === this.maxHits){
            this.pinata.mesh.children.filter((item, index) => !this.remainingChunkIndexes.includes(index)).map((item, index) => ({index, item})).reverse().forEach(item => {
                const wp = item.item.getWorldPosition(item.item.position);
                this.environment.createSphere({size: {r: 1.5}, position: {x:  wp.x, y: wp.y, z: wp.z}, mass: 1, customMesh: item.item})
            });
        }
        
    }
}