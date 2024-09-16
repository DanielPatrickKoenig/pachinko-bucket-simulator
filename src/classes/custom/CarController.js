import VehicleController from '../../classes/controllers/VehicleController';
import { basicColorMaterial } from '../../utils/THREEHelpers';
import jstrig from 'jstrig';
import { degreesToRadians } from '../../utils/Utilities';

export default class CarController extends VehicleController{
    constructor(data, models){
        super(data, models);

       this.addExtras();


       this.addWheelMarkers();

       
    }
    addWheelMarkers(){
        this.wheels.forEach(item => {
            item.wheel.mesh.material = basicColorMaterial('0000cc');
            item.wheel.mesh.material.transparent = true;
            item.wheel.mesh.material.opacity = 0;
            
            const markerCount = 6;
            [...new Array(markerCount).keys()].forEach((_item, _index) => {
                const position = {
                    x: 0,
                    y: jstrig.orbit(0, .35, (360 / markerCount) * _index, 'sin'),
                    z: jstrig.orbit(0, .35, (360 / markerCount) * _index, 'cos')
                };
                const marker = this.environment.createSphere({ size: {r: .04}, position, material: basicColorMaterial('666666') });
                item.wheel.mesh.add(marker.mesh);

            });
        });
    }

    addExtras(){
        const wall1 = this.environment.createBox({size: {x: .2, y: .4, z: 2}, position: { x: 1.4, y: 3.5, z: 0 }, material: this.redMat, mass: .2 });
        this.environment.physics.lock(this.chassis.body, wall1.body);
        const wall2 = this.environment.createBox({size: {x: .2, y: .4, z: 2}, position: { x: -1.4, y: 3.5, z: 0 }, material: this.redMat, mass: .2 });
        this.environment.physics.lock(this.chassis.body, wall2.body);
        const wall3 = this.environment.createBox({size: {x: 1, y: .4, z: .2}, position: { x: 0, y: 3.5, z: -2.4 }, material: this.redMat, mass: .2 });
        this.environment.physics.lock(this.chassis.body, wall3.body);
        const wall4 = this.environment.createBox({size: {x: 1, y: .4, z: .2}, position: { x: 0, y: 3.5, z: 2.4 }, material: this.redMat, mass: .2 });
        this.environment.physics.lock(this.chassis.body, wall4.body);

        this.environment.createSphere({ size: { r: .4 }, position: { x: 0, y: 3.5, z: 0 }, material: basicColorMaterial('00cc00'), mass: .3 });

        this.angleWall = wall3.mesh;
    }

    update(){
        
        // const rawAngle = this.chassis.mesh.rotation.y;
        // const rawAngle = jstrig.angle({ x: this.chassis.mesh.position.x, y: this.chassis.mesh.position.z }, { x: this.angleWall.position.x, y: this.angleWall.position.z });

        const rawAngle = jstrig.angle({ x: this.wheels[2].wheel.mesh.position.x, y: this.wheels[2].wheel.mesh.position.z }, { x: this.wheels[0].wheel.mesh.position.x, y: this.wheels[0].wheel.mesh.position.z });

        // this.wheels
        // console.log('r', rawAngle);
        // console.log('q', this.chassis.body.quaternion.y);
        this.environment.cameraContainer.position.y = this.chassis.mesh.position.y+2;
        const angle = rawAngle;
        const distance = -8;
        const newPosition = {
            x: jstrig.orbit(this.chassis.mesh.position.x, distance, angle, 'cos'),
            z: jstrig.orbit(this.chassis.mesh.position.z, distance, angle, 'sin')
        };

        this.environment.cameraContainer.position.x = newPosition.x;
        this.environment.cameraContainer.position.z = newPosition.z;

        this.environment.cameraContainer.rotation.y = degreesToRadians(rawAngle) * -1;
    }
}