import Environment3d from './Environment3d';
import {POVModes} from './POVManager';
import gsap from 'gsap';
import {ControllerTypes} from './controllers/BaseController';
export default class BaseScene{
    constructor(el){
        this.environment = null;
        this.actionHandler = null;
        if(el){
            this.setup(el);
        }
    }
    setup (el) {
        this.environment = new Environment3d(el, {width: this.getWidth(), height: this.getHeight(), gravity: -5, pov: this.getPOVMode()});
        this.environment.onLoadingComplete = async () => {
            await new Promise(resolve => setTimeout(resolve, 50));
            this.loadComplete();
        };
        // console.log(this.environment);
        this.initialize();
        this.renderLoop(this);
    }
    initialize(){
        // put custom for scene here
    }
    getPOVMode(){
        return POVModes.THIRD_PERSON;
    }
    getWidth(){
        return 1000;
    }
    getHeight(){
        return 700;
    }
    renderLoop(scope){
        scope.environment.render();
        const loopProps = {n:0};
        gsap.to(loopProps, {
            duration: 1,
            n:1,
            onUpdate:() => {
                scope.environment.render();

                const controllers = scope.getControllers();
                
                controllers.forEach(item => item.update());
                // console.log(this.junction.getDistance(this.walker.location()));
            },
            onComplete: scope.renderLoop,
            onCompleteParams: [scope]
        });
    }
    getPlayerControllers(){
        return this.environment.controllers.filter(item => item.type === ControllerTypes.PLAYER).map(item => item.controller);
    }
    getControllers(){
        return this.environment.controllers.map(item => item.controller);
    }
    setActionHandler(handler){
        this.actionHandler = handler;
    }
    emitActionHandler(data, type){
        if(this.actionHandler){
            this.actionHandler(data, type);
        }
    }
    loadComplete(){

    }
    
}