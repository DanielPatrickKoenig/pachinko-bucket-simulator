import LocatableController from "./LocatableController";
export default class AutoNavigationController extends LocatableController{
    constructor(data, startPosition, character, onContact){
        super(data, startPosition);
        this.onContact = onContact;
        this.character = character;
        this.contacted = false;
    }
    update(){
        if(!this.contacted && this.onContact){
            if(this.insideThreshold(this.character)){
                this.contacted = true;
                this.onContact(this);
            }
        }
    }
    
}