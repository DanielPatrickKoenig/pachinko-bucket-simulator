import {object3DSelector} from '../utils/THREEHelpers.js';
import {degreesToRadians, radiansToDegrees, nextTick} from '../utils/Utilities.js';
import gsap from 'gsap';
export default class RigManager{
    constructor ({model, renderer, scene, camera}){
        this.model = model;
        this.currentState = '';
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        // console.log(object3DSelector(this.model, {type: 'Bone'}).map(item => item.name));
    }
    getBoneByName(name){
        return object3DSelector(this.model, {type: 'Bone', name})[0];
    }
    
    async rotateTo(bone, axis, {value, time}, update){
        let complete = false;
        const targetBone = this.getBoneByName(bone);
        const boneProxy = {rotation: radiansToDegrees(targetBone.rotation[`${axis}`])};
        gsap.to(boneProxy, {
            duration: time,
            rotation: value,
            onUpdate: () => {
                targetBone.rotation[axis] = degreesToRadians(boneProxy.rotation);
                update();
            },
            onComplete: () => { complete = true }
        });
        while (!complete){
            await nextTick();
        }
        return this;

    }
    async cycle(bone, axis, valuesAndTimes, states){
        for(let i = 0; i < valuesAndTimes.length; i++){
            if(!states || states.includes(this.currentState)){
                await this.rotateTo(bone, axis, valuesAndTimes[i], () => {
                    if(this.renderer){
                        this.renderer.render(this.scene, this.camera);
                    }
                });
            }
            else{
                while (!states.includes(this.currentState)){
                    await nextTick();
                }
            }
        }
        this.cycle(bone, axis, valuesAndTimes, states);
    }
    async sequence(bone, axis, valuesAndTimes){
        for(let i = 0; i < valuesAndTimes.length; i++){
            await this.rotateTo(bone, axis, valuesAndTimes[i], () => {
                if(this.renderer){
                    this.renderer.render(this.scene, this.camera);
                }
            });
        }
    }
}