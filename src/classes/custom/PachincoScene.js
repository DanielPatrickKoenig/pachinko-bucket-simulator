import BaseScene from '../BaseScene';
import CANNON from 'cannon';
import LightController, { LightTypes } from '../../classes/controllers/LightController';
import { degreesToRadians, radiansToDegrees } from '../../utils/Utilities';
import { basicColorMaterial } from '../../utils/THREEHelpers';
import jstrig from 'jstrig';
export default class PachincoScene extends BaseScene{
    constructor(el){
        super(el);
    }

    initialize(){
        const storageID = 'bucket-simulator-content-36';
        const targetCount = 1;
        const positionCount = 36;
        const miliseconds = 66;
        // const positionCount = 4;
        const positionRange = 4;
        this.pegs = [];
        this.bumpers = [];
        let running = true;
        let currentPositionIndex = 0;
        const positions = [...new Array(positionCount).keys()].map(item => (positionRange * -1) + (((positionRange * 2) / positionCount) * item));
        const bucketSize = 2.04;
        this.tempMatrixEntry = {};
        this.positionMatrix = window.localStorage.getItem(storageID) ? JSON.parse(window.localStorage.getItem(storageID)) : [];
        if(this.positionMatrix.length){
            currentPositionIndex = this.positionMatrix[this.positionMatrix.length - 1].position;
        }
        const resetMax = 40;
        let resetCount = 0;
        this.mat3 = new CANNON.Material();
        this.groundMaterial = new CANNON.Material();
        this.wall = new CANNON.Material();
        const lc = new LightController({ environment: this.environment });
        lc.addLight({ type: LightTypes.DIRECTIONAL, intensity: 4, target: { x: 0, y: -10, z: 5 } });

        this.redMat = basicColorMaterial('ff0000');

        this.blueMat = basicColorMaterial('0000ff');

        this.environment.cameraContainer.position.y = 0;
        this.environment.cameraContainer.position.z = -9;
        this.environment.cameraContainer.rotation.y = degreesToRadians(180);

        const startOffset = (.001 + (Math.random() + .005)) * (Math.random() > .5 ? 1 : -1);
        this.startX = positions[currentPositionIndex];
        const startY = 5.5;
        const ball = this.environment.createSphere({ size: {r: .5}, position: {x: this.startX + startOffset, y: startY, z: 4}, material: this.redMat, mass: .1});
        ball.body.material = this.groundMaterial;
        this.resetBall(ball, this.startX, startY);
        const rowTop = 3.5;
        const rowSpace = 2;
        // const forceMax = 20;
        // this.environment.physics.addForce(ball.body, {x: (Math.random() * (forceMax / 2)) - forceMax, y: 0, z: 0});

        this.addPeg(0, rowTop);
        this.addPeg(3, rowTop);
        this.addPeg(-3, rowTop);
        
        this.addPeg(1.3, rowTop - (rowSpace * 1));
        this.addPeg(-1.3, rowTop - (rowSpace * 1));

        this.addPeg(0, rowTop - (rowSpace * 2));
        this.addPeg(3, rowTop - (rowSpace * 2));
        this.addPeg(-3, rowTop - (rowSpace * 2));

        this.addPeg(1.3, rowTop - (rowSpace * 3));
        this.addPeg(-1.3, rowTop - (rowSpace * 3));

        this.addPeg(0, rowTop - (rowSpace * 4));
        this.addPeg(3, rowTop - (rowSpace * 4));
        this.addPeg(-3, rowTop - (rowSpace * 4));

        this.emitActionHandler(this.pegs, 'pegs');




        this.environment.createBox({size: {x: 10, y: .1, z: .8}, position: { x: 0, y: rowTop - (rowSpace * 5) - 2.25, z: 4 }, material: this.blueMat, mass: 0 });

        const wall1 = this.environment.createBox({size: {x: .1, y: 20, z: .8}, position: { x: 5.1, y: 0, z: 4 }, material: this.blueMat, mass: 0 });
        const wall2 = this.environment.createBox({size: {x: .1, y: 20, z: .8}, position: { x: -5.1, y: 0, z: 4 }, material: this.blueMat, mass: 0 });

        wall1.body.material = this.wall;
        wall2.body.material = this.wall;

        this.environment.createBox({size: {x: .1, y: 3.9, z: .8}, position: { x: -5.1 + (bucketSize * 1), y: rowTop - (rowSpace * 5) - 1.75, z: 4 }, material: this.blueMat, mass: 0 });
        this.environment.createBox({size: {x: .1, y: 3.9, z: .8}, position: { x: -5.1 + (bucketSize * 2), y: rowTop - (rowSpace * 5) - 1.75, z: 4 }, material: this.blueMat, mass: 0 });
        this.environment.createBox({size: {x: .1, y: 3.9, z: .8}, position: { x: -5.1 + (bucketSize * 3), y: rowTop - (rowSpace * 5) - 1.75, z: 4 }, material: this.blueMat, mass: 0 });
        this.environment.createBox({size: {x: .1, y: 3.9, z: .8}, position: { x: -5.1 + (bucketSize * 4), y: rowTop - (rowSpace * 5) - 1.75, z: 4 }, material: this.blueMat, mass: 0 });



        this.addBumper(5, rowTop - (rowSpace * 1.05));
        this.addBumper(-5, rowTop - (rowSpace * 1.05));

        this.addBumper(5, rowTop - (rowSpace * 3.1));
        this.addBumper(-5, rowTop - (rowSpace * 3.1));

        this.emitActionHandler(this.bumpers, 'bumpers');


        
        const pegPoince = new CANNON.ContactMaterial(this.groundMaterial, this.mat3, { friction: 0.0, restitution: 0.5 });
        this.environment.physics.world.addContactMaterial(pegPoince);

        const wallBounce = new CANNON.ContactMaterial(this.groundMaterial, this.wall, { friction: 0.0, restitution: 0.5 });
        this.environment.physics.world.addContactMaterial(wallBounce);

        this.bucketMarkers = [...new Array(5).keys()].map(item => ({ x: -5.1 + (bucketSize * (item + 1)) - (bucketSize / 2), y: rowTop - (rowSpace * 5) } ));

        setInterval(() => {
            this.tempMatrixEntry.positions.push({ x: Math.round(ball.body.position.x * 1000) / 1000, y: Math.round(ball.body.position.y * 1000) / 1000 });
            const reachedBottom = ball.body.position.y < rowTop - (rowSpace * 5) - 1.5;
            if(reachedBottom){
                
                // console.log('below point');
                if(resetCount > resetMax){
                    resetCount = 0;
                    const sortedDistances = this.bucketMarkers.map((item, index) => ({ index, dist: jstrig.distance(item, { x: ball.body.position.x, y: ball.body.position.y }) })).sort((a, b) => a.dist - b.dist);
                    const bucket = sortedDistances[0];
                    if(this.positionMatrix.filter(item => item.position === currentPositionIndex && item.bucket === bucket.index).length < targetCount) {
                        console.log('bucket', bucket.index);
                        this.positionMatrix.push({ ...this.tempMatrixEntry, bucket: bucket.index, position: currentPositionIndex });
                        window.localStorage.setItem(storageID, JSON.stringify(this.positionMatrix));
                    }
                    if(running) this.resetBall(ball, positions[currentPositionIndex], startY);
                    console.log(this.positionMatrix);
                    const currentPositionMatches = this.positionMatrix.filter(item => item.position === currentPositionIndex);
                    const counts = [...new Array(5).keys()].map(item => currentPositionMatches.filter(_item => _item.bucket === item).length);
                    console.log('counts', counts);
                    console.log('position', currentPositionIndex);
                    if(counts.filter(item => item >= targetCount).length >= 5){
                        currentPositionIndex++;
                        if(currentPositionIndex > positionCount){
                            running = false;
                        }
                    }
                    
                    // currentPositionIndex++;
                }
                
                resetCount++;
                
            }
            if(this.tempMatrixEntry.positions?.length) {
                const {x, y, r} = this.tempMatrixEntry.positions[this.tempMatrixEntry.positions.length - 1];
                this.emitActionHandler(this.transformPosition( x, y ), 'ball');
            }
        }, miliseconds);
    }

    addPeg (x, y) {
        const a = this.environment.createBox({size: {x: .1, y: .1, z: .8}, position: { x: x - .1, y, z: 4 }, material: this.blueMat, mass: 0 });
        const b = this.environment.createBox({size: {x: .1, y: .1, z: .8}, position: { x: x + .1, y, z: 4 }, material: this.blueMat, mass: 0 });

        const c = this.environment.createBox({size: {x: .1, y: .1, z: .8}, position: { x, y: y - .1, z: 4 }, material: this.blueMat, mass: 0 });
        const d = this.environment.createBox({size: {x: .1, y: .1, z: .8}, position: { x, y: y + .1, z: 4 }, material: this.blueMat, mass: 0 });

        a.body.material = this.mat3;
        b.body.material = this.mat3;
        c.body.material = this.mat3;
        d.body.material = this.mat3;

        this.pegs.push(this.transformPosition(x, y));
        
    }

    addBumper (x, y) {
        const scale = 1.8;
        const a = this.environment.createBox({size: {x: .2 * scale, y: 1 * scale, z: .8}, position: { x, y, z: 4 }, material: this.blueMat, mass: 0 });
        const b = this.environment.createBox({size: {x: .35 * scale, y: .8 * scale, z: .8}, position: { x, y, z: 4 }, material: this.blueMat, mass: 0 });
        const c = this.environment.createBox({size: {x: .5 * scale, y: .6 * scale, z: .8}, position: { x, y, z: 4 }, material: this.blueMat, mass: 0 });
        const d = this.environment.createBox({size: {x: .65 * scale, y: .4 * scale, z: .8}, position: { x, y, z: 4 }, material: this.blueMat, mass: 0 });
        const e = this.environment.createBox({size: {x: .8 * scale, y: .2 * scale, z: .8}, position: { x, y, z: 4 }, material: this.blueMat, mass: 0 });


        a.body.material = this.mat3;
        b.body.material = this.mat3;
        c.body.material = this.mat3;
        d.body.material = this.mat3;
        e.body.material = this.mat3;

        this.bumpers.push(this.transformPosition(x, y));
        
    }

    resetBall(ball, x, y){
        this.tempMatrixEntry = { shift: this.startX, positions: [] };
        
        const forceMax = 1.5;
        ball.body.position.x = x;
        // ball.body.position.x = x + (Math.random() * forceMax) - (forceMax / 2);
        ball.body.position.y = y;
        ball.body.position.z = 4;
        
        this.environment.physics.addForce(ball.body, {x: (Math.random() * forceMax) - (forceMax / 2), y: 0, z: 0});
    }

    transformPosition(x, y){
        const lowestX = 5.8;
        const lowestY = 8.5;
        const factoredX = ((x + lowestX) / (lowestX * 2)) * 100;
        const factoredY = ((((y * -1 ) + lowestY) / (lowestY * 2)) * 100) - 1;

        return { x: factoredX, y: factoredY };
    }

    getWidth(){
        return 300;
    }
    getHeight(){
        return 600;
    }
}