import CANNON from 'cannon';
import {ShapeTypes, defaultDimensionValues} from '../utils/Utilities.js';
class Physics{
    constructor({ gravity, clock, onUpdate, scale }){
        this.world = new CANNON.World();
        this.world.gravity.set(0, gravity, 0);
        this.clock = clock;
        this.delta =  null;
        this.shapes = [];
        this.onUpdate = onUpdate;
        this.scale = scale ? scale : 1;
        this.floors = [];

    }
    
    processVec3({ property, values }){
        // console.log(`processing ${property}`);
        // console.log(values);
        const prop = property ? property : 'position';
        let sizeScale = 1;
        if(property === 'size'){
            sizeScale = this.scale;
        }
        return Object.keys(values).includes('r')
            ? new CANNON.Vec3(
                values.r ? values.r * sizeScale : defaultDimensionValues()[prop].r * sizeScale,
                values.x ? values.x * sizeScale : defaultDimensionValues()[prop].x * sizeScale,
                values.y ? values.y * sizeScale : defaultDimensionValues()[prop].y * sizeScale,
                values.z ? values.z * sizeScale : defaultDimensionValues()[prop].z * sizeScale
            )
            : new CANNON.Vec3(
                values.x ? values.x * sizeScale : defaultDimensionValues()[prop].x * sizeScale,
                values.y ? values.y * sizeScale : defaultDimensionValues()[prop].y * sizeScale,
                values.z ? values.z * sizeScale : defaultDimensionValues()[prop].z * sizeScale
            );
            
    }
    addShape({ type, mass, size, position, orientation, mesh }){
        let shape;
        const divider = mass === 0 ? 1 : 2;
        const sizeVector = type === ShapeTypes.BOX ? new CANNON.Vec3(size.x / divider, size.y / divider, size.z / divider) : this.processVec3({ values: size, property: 'size' });
        switch(type){
            case ShapeTypes.PLANE:{
                shape = new CANNON.Plane(sizeVector);
                break;
            }
            case ShapeTypes.BOX:{
                shape = new CANNON.Box(sizeVector);
                break;
            }
            case ShapeTypes.SPHERE:{
                shape = new CANNON.Sphere(sizeVector.x);
                break;
            }
            case ShapeTypes.CYLINDER:{
                shape = new CANNON.Cylinder(sizeVector.x, sizeVector.x, sizeVector.y, 32);
                break;
            }
        }
        const body = new CANNON.Body({ mass, shape });
        // body.addShape(shape);
        if (position) {
            const positionVector = this.processVec3({ values: position, property: 'position' });
            body.position = positionVector;
        }
        if (orientation) {
            const orientationVector = this.processVec3({ values: orientation, property: 'orientation' });
            body.quaternion.setFromAxisAngle(orientationVector, -Math.PI / 2);
        }
        this.world.addBody(body);
        this.shapes.push({ body, shape, mesh });
        // console.log(body);
        return body;
    }
    update(){
        requestAnimationFrame(() => {this.update()});
        this.delta = Math.min(this.clock.getDelta(), 0.1);
        if (this.delta > 0) {
            this.world.step(this.delta);
            this.shapes.forEach(item => {
                item.mesh.position.x = item.body.position.x;
                item.mesh.position.y = item.body.position.y;
                item.mesh.position.z = item.body.position.z;
                item.mesh.quaternion.set(
                    item.body.quaternion.x,
                    item.body.quaternion.y,
                    item.body.quaternion.z,
                    item.body.quaternion.w
                )
            });
            if(this.onUpdate){
                this.onUpdate();
            }
            
        }
    }
    onFloor(body){
        // console.log(this.floors);
        return this.floors.filter(item => this.inContact(item, body)).length;
    }
    inContact(body1, body2){
        const shapeIDs = [body1, body2].map(item => item.shapes[0].id);
        // console.log(shapeIDs);
        return this.world.contacts.filter(item => [item.bi.shapes[0].id, item.bj.shapes[0].id].sort().join(',') === shapeIDs.sort().join(',')).length;
    }
    addForce(body, {x, y, z}){
        const vector = {
            _x: x ? x : 0,
            _y: y ? y : 0,
            _z: z ? z : 0
        }
        const worldPoint = new CANNON.Vec3(body.position.x,body.position.y,body.position.z);
        const force = new CANNON.Vec3(vector._x, vector._y, vector._z);
        body.applyForce(force,worldPoint);
    }
    adjustForce(body, {x, y, z}){
        const vector = {
            _x: x ? x : 0,
            _y: y ? y : 0,
            _z: z ? z : 0
        }
        const worldPoint = new CANNON.Vec3(body.position.x,body.position.y,body.position.z);
        const force = new CANNON.Vec3(vector._x, vector._y, vector._z);
        body.applyImpulse(force,worldPoint);
    }

    constrain(a, b, range = 1){
        const localPivotA = new CANNON.Vec3(range , 0, range);
        const localPivotB = new CANNON.Vec3(range * -1, 0, range * -1);
        const constraint = new CANNON.PointToPointConstraint(a, localPivotA, b, localPivotB);
        this.world.addConstraint(constraint);
        return constraint;
    }

    lock (a, b) {
        const constraint = new CANNON.LockConstraint(a, b);
        this.world.addConstraint(constraint);
        return constraint;
    }

    hinge(a, b, options){
        const constraint = new CANNON.HingeConstraint(a, b, options);
        this.world.addConstraint(constraint);
        return constraint;
        /*
        {
            pivotA: new CANNON.Vec3(0, 0, -s * 0.5 - d),
            axisA: new CANNON.Vec3(1, 0, 0),
            pivotB: new CANNON.Vec3(0, 0, s * 0.5 + d),
            axisB: new CANNON.Vec3(1, 0, 0),
        }
        */
    }
}

export default Physics;
export { ShapeTypes };