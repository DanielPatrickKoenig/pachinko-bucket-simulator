import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {nextTick, generateID} from '../utils/Utilities.js';
const LoadStates = {
    LOADING: 'loading',
    SUCCESS: 'success',
    FAILED: 'failed'
};
export default class ModelLoader{
    constructor(){
        this.queue = [];
        
    }
    async load(file){
        const id = `model-${generateID()}`;
        this.queue.push({ file, id, status: LoadStates.LOADING });
        const loader = new GLTFLoader();
        let model = null;
        loader.load( file, ( gltf ) => {
            model = gltf.scene;
            this.queue.find(item => item.id === id).status = LoadStates.SUCCESS;
        }, undefined, ( error ) => {
            model = error;
            // console.error( error );
            this.queue.find(item => item.id === id).status = LoadStates.FAILED;

        } );
        while (model === null){
            await nextTick();
        }
        
        return model;
    }
}

export { LoadStates };