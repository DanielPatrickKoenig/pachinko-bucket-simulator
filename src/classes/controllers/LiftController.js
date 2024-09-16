import BaseController from './BaseController';
import { basicColorMaterial } from '../../utils/THREEHelpers';
export default class LiftController extends BaseController{
    constructor(data){
        super(data);
        this.max = data.max ? data.max : 5;
        this.min = data.min ? data.min : -5;
        this.delay = data.delay ? data.delay : 0;
        this.speed = data.speed ? data.speed : .02;
        this.size = data.size ? data.size : {x: 1, y: 1, z: 1};
        this.position = data.position ? data.position : {x: 0, y: 0, z: 0};
        this.model = data.model ? data.model : null;
        this.material = data.material ? data.material : basicColorMaterial('cc0000');

        this.mover = this.environment.createBox({size: this.size, position: this.position, mass: 0, customMesh: this.model, material: this.material});

        this.moverStats = {
            direction: -1,
            speed: this.speed,
            delayMax: this.delay,
            currentDelay: 0
        }
        
    }

    update(){
        if(this.mover.body.position.y < this.min && this.moverStats.currentDelay === 0){
            this.moverStats.direction = 1;
            this.moverStats.currentDelay = this.moverStats.delayMax;
            this.mover.body.position.y = this.min;
        }
        else if(this.mover.body.position.y > this.max && this.moverStats.currentDelay === 0){
            this.moverStats.direction = -1;
            this.moverStats.currentDelay = this.moverStats.delayMax;
            this.mover.body.position.y = this.max;
        }
        if(this.moverStats.currentDelay === 0){
            this.mover.body.position.y = this.mover.body.position.y + (this.moverStats.speed * this.moverStats.direction);
        }
        else if(this.moverStats.currentDelay > 0){
            this.moverStats.currentDelay -= 1;
            console.log(this.moverStats.currentDelay);
        }
        
    }    
}