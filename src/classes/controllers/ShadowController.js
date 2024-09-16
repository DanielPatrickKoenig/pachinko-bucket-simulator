import * as THREE from 'three';
import BaseController from './BaseController';
export default class ShadowController extends BaseController{
    constructor(data){
        super(data);
        const renderer = this.environment.renderer;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
    }
    registerLight (light, { width, height, near, far, caster, receiver }) {
        light.castShadow = true;
        light.shadow.mapSize.width = width;
        light.shadow.mapSize.height = height;
        light.shadow.camera.near = near;
        light.shadow.camera.far = far;
        if(caster){
            caster.castShadow = true;
            caster.receiveShadow = false;
        }
        if(receiver){
            receiver.receiveShadow = true;
        }
        
    }
}