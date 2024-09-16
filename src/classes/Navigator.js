import jt from 'jstrig';
import * as THREE from 'three';
import {radiansToDegrees, degreesToRadians} from '../utils/Utilities.js';
import gsap from 'gsap';
const MovementDirectives = {
    NOT_MOVING: -1,
    FORWARD: 0,
    BACKWARD: 1,
    RIGHT: 2,
    LEFT: 3,
    ROTATING_RIGHT: 4,
    ROTATING_LEFT: 5,
    JUMPING: 6,
    NOT_ROTATING: 7
};
export default class Navigator{
    constructor (mover, speed, environment, position) {
        this.mover = mover;
        this.speed = speed;
        this.walls = [];
        this.env = environment;
        this.physics = this.env && this.env.physics;
        this.physicsMesh = null;
        this.physicsBody = null;
        this.currentPosition = null;
        this.moving = false;
        this.turnSpeed = 5;
        this.rotationProxy = this.mover.rotation.y;
        this.mobileMoving = false;
        this.movementStatus = {
            movement: MovementDirectives.NOT_MOVING,
            rotation: MovementDirectives.NOT_ROTATING
        };
        if(this.physics){
            const material = new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent: true, opacity: 0} );
            const { mesh, body } = this.env.createSphere({size: {r: 1}, position, mass: 1, material });

            this.physicsMesh = mesh;
            this.physicsBody = body;
            this.currentPosition = {x: this.physicsBody.position.x, y: this.physicsBody.position.y + this.getYShift(), z: this.physicsBody.position.z};
            this.physicsBody.addEventListener("collide",function(e){
                console.log(e);
            });
            mesh.scale.x = 0;
            mesh.scale.y = 0;
            mesh.scale.z = 0;
        }
        this.thread(this);
    }
    getYShift(){
        return -1;
    }
    thread(scope){
        const p = { n: 0 };
        gsap.to(p, { duration: 1, n: 1, onComplete: () => scope.thread(scope), onUpdate: () => scope.threadUpdate(scope) });
    }
    threadUpdate(){
        this.mover.rotation.y += (this.rotationProxy - this.mover.rotation.y) / 5;
        if(this.mobileMoving){
            console.log('mobile moving');
            this.moveForward();
        }
        
    }
    forward2D(){
        this.move2D(-1);
    }
    backward2D(){
        this.move2D(1);
    }
    moveLateral2D(left){
        this.move2D(1, left ? 90 : -90);
    }
    move2D(direction, angleOffset = 0) {
        // console.log(this.mover.position.y);
        const startPosX = this.mover.position.x;
        const startPosZ = this.mover.position.z;
        const xMove = jt.orbit(this.mover.position.x, this.speed * direction, radiansToDegrees(this.mover.rotation.y + angleOffset), jt.OrbitType.COS);
        const zMove = jt.orbit(this.mover.position.z, this.speed * direction, radiansToDegrees(this.mover.rotation.y + angleOffset), jt.OrbitType.SIN);
        if(this.physics){
            const forceFactor = 20;
            this.physicsBody.velocity.x = (xMove - startPosX) * forceFactor;
            this.physicsBody.velocity.z = (zMove - startPosZ) * forceFactor;
            this.currentPosition = {x: this.physicsBody.position.x, y: this.physicsBody.position.y + this.getYShift(), z: this.physicsBody.position.z};
        }
        else{
            this.mover.position.x = xMove;
            this.mover.position.z = zMove;
        }
        this.moving = true;
    }
    turn(rotation){
        console.log(rotation);
        this.rotationProxy+=degreesToRadians(this.turnSpeed * rotation);
    }
    setRotation(rotation, ease){
        this.rotationProxy = degreesToRadians(rotation);
        if(!ease){
            this.mover.rotation.y = degreesToRadians(rotation);
        }
        
    }
    jump(){
        if(this.physics && this.physics.onFloor(this.physicsBody)){
            this.physicsBody.velocity.y = 12;
        }
    }
    idle(){
        if(this.physics){
            this.physicsBody.position.x = this.currentPosition.x;
            this.physicsBody.position.z = this.currentPosition.z;
            this.physicsBody.velocity.x = 0;
            this.physicsBody.velocity.z = 0;
        }
        
    }
    stopMoving(){
        this.movementStatus.movement = MovementDirectives.NOT_ROTATING;
    }
    moveForward(){
        this.movementStatus.movement = MovementDirectives.FORWARD;
    }
    moveBackward(){
        this.movementStatus.movement = MovementDirectives.BACKWARD;
    }
    stopTurning(){
        this.movementStatus.rotation = MovementDirectives.NOT_ROTATING;
    }
    turnLeft(){
        this.movementStatus.rotation = MovementDirectives.ROTATING_LEFT;
    }
    turnRight(){
        this.movementStatus.rotation = MovementDirectives.ROTATING_RIGHT;
    }
    syncToBody(){
        switch(this.movementStatus.movement){
            case MovementDirectives.NOT_MOVING:{
                this.idle();
                break;
            }
            case MovementDirectives.FORWARD:{
                this.forward2D();
                break;
            }
            case MovementDirectives.BACKWARD:{
                this.backward2D();
                break;
            }
            case MovementDirectives.RIGHT:{
                break;
            }
            case MovementDirectives.LEFT:{
                break;
            }
        }
        switch(this.movementStatus){
            case MovementDirectives.ROTATING_LEFT:{
                this.turn(-1);
                break;
            }
            case MovementDirectives.ROTATING_RIGHT:{
                this.turn(1);
                break;
            }
        }
        if(this.physics){
            this.mover.position.x = this.physicsBody.position.x;
            this.mover.position.y = this.physicsBody.position.y + this.getYShift();
            this.mover.position.z = this.physicsBody.position.z;
            this.currentPosition.x = this.physicsBody.position.x;
            this.currentPosition.y = this.physicsBody.position.y + this.getYShift();
            this.currentPosition.z = this.physicsBody.position.z;
        }
    }
}