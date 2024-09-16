import {getInheritanceChain, generateID} from '../../utils/Utilities';
const ControllerTypes = {
    NORMAL: 0,
    PLAYER: 1,
    CHARACTER: 2,
    CUSTOM_MESH: 3
}

export default class BaseController{
    constructor({environment}){
        this.environment = environment;
        this.camera = this.environment.camera;
        this.scene = this.environment.scene;
        this.renderer = this.environment.renderer;
        this.physics = this.environment.physics;
        this.items = {};
        this.controllerID = `controller-${generateID()}`;
        this.register();
        this.init();
    }
    init(){
        
    }

    register(){
        this.environment.registerController(this);
    }
    unregister(){
        this.environment.unregisterController(this);
    }
    getControllerType(){
        return ControllerTypes.NORMAL;
    }
    addItem(name, item){
        this.items[name] = item;
    }
    update(){

    }
    getControllersOfType(className, includeSelf){
        return this.environment.controllers.filter(item => getInheritanceChain(item.controller).includes(className) && (item.controller.controllerID !== this.controllerID || includeSelf));
    }
}
export {ControllerTypes};