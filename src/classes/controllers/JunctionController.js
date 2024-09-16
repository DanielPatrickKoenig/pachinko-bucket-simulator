/*
this class is unfinished and is intended to connect a start path to a destination path
*/

import jt from 'jstrig';
import LocatableController from "./LocatableController";
import {generateID} from '../../utils/Utilities';
import {groupBy} from 'lodash';
export default class JunctionController extends LocatableController{
    constructor(data, startPosition, character){
        super(data, startPosition);
        this.junctionPoints = [];
        this.character = character;
        this.targetPoint = startPosition;
    }

    addPath(points, id){
        const pathID = id ? id :`path-${generateID()}`;
        points.forEach(item => this.junctionPoints.push({point: item, id: pathID}));
    }

    location(){
        return this.targetPoint;
    }

    pathToPoint({x, y, z}){
        console.log(this.character);
        if(this.character){
            const lc = this.character;
            // console.log(this.character.location());
            const closestToCharacterSortedByDistance = this.junctionPoints
                .map((item, index) => ({ distance: jt.distance({x: item.point.x, y: item.point.z}, {x: lc.location().x, y: lc.location().z}), index}))
                .sort((a, b) => a.distance - b.distance);
            const closestToCharacter = this.junctionPoints[closestToCharacterSortedByDistance[0].index];
            this.targetPoint = closestToCharacter.point;

            const closestToDestinationSortedByDistance = this.junctionPoints
                .map((item, index) => ({ distance: jt.distance({x: item.point.x, y: item.point.z}, {x, y: z}), index}))
                .sort((a, b) => a.distance - b.distance);
            const closestToDestination = this.junctionPoints[closestToDestinationSortedByDistance[0].index];
            // console.log(closestToDestination);
            console.log({x, y, z});
            console.log('has common paths');
            console.log(this.findRequiredPaths(closestToCharacter, closestToDestination));


            return {start: closestToCharacter.point, end: closestToDestination.point};
        }
        else{
            return null;
        }
        


    }

    findRequiredPaths(start, end){
        const paths = this.getPaths();
        if(start.id === end.id){
            return [paths[start.id]];
        }
        else{
            const startPath = paths[start.id];
            const endPath = paths[end.id];
           const commonPoints = this.hasCommonPoint(startPath, endPath);
           if(commonPoints){
               return [startPath, endPath];
           }
           else{
               console.log('does lead to path ************');
               const sharedPaths = this.getSharedPaths(startPath, paths);
               const leadsToPath = this.leadsToDestinationPath(startPath, endPath, sharedPaths, paths);
               console.log(leadsToPath);
           }
           
        }

    }

    hasCommonPoint(pathA, pathB){
        const aSerialized = pathA.map(item => (`${item.point.x}/${item.point.y}/${item.point.z}`));
        const bSerialized = pathB.map(item => (`${item.point.x}/${item.point.y}/${item.point.z}`));
        return aSerialized.filter(item => bSerialized.includes(item)).length;
    }

    getSharedPaths(path, allPaths, _exclusions){
        const exclusions = _exclusions ? _exclusions : [];
        return Object.keys(allPaths)
            .filter(item => !exclusions.includes(item) && item !== path[0].id && this.hasCommonPoint(path, allPaths[item]))
            .map(item => allPaths[item]);
    }

    // getRequiredPaths(currentPath, destinationPath, allPaths, _collection){
    //     const collection = _collection ? _collection : [];
    //     collection.push(currentPath);
    //     if(currentPath[0].id === destinationPath[0].id){
    //         return collection;
    //     }
    //     else{
    //         const connectedToCurrent = this.getSharedPaths(currentPath, allPaths, Object.keys(collection));
    //         if(connectedToCurrent.length){
    //             connectedToCurrent.forEach(item => this.getRequiredPaths(item, destinationPath, allPaths, collection))
                
    //         }
    //     }
        
    //     // return this.hasCommonPoint(startPath, destinationPath);
    // }

    leadsToDestinationPath(startPath, destinationPath, sharedPaths, allPaths, _collected, _used){
        const used = _used ? _used : [startPath, destinationPath];
        const collected = _collected ? _collected : [startPath];
        const usedIDs = used.map(item => item[0].id);
        sharedPaths.forEach(item => {
            const isUsed = usedIDs.includes(item[0].id);
            if(!isUsed){
                if(this.hasCommonPoint(item, destinationPath)){
                    collected.push(item);
                    collected.push(destinationPath);
                }
                else{
                    collected.push(item);
                    used.push(item);
                    const sharedWithItem = this.getSharedPaths(item, allPaths);
                    this.leadsToDestinationPath(startPath, destinationPath, sharedWithItem, allPaths, collected, used);
                }
                
            }
        });
        return collected;
    }

    getPaths(){
        return groupBy(this.junctionPoints, 'id');
    }

    getMinimumDistance(){
        return 2;
    }
    
    insideThreshold (lc) {
        const distance = jt.distance({x: this.location().x, y: this.location().z}, {x: lc.location().x, y: lc.location().z});
        return distance < this.getMinimumDistance();
    }

    update(){
        if(this.character && this.character.location() && !this.insideThreshold(this.character)){
            const characterLocation = this.character.location();
            const angle = jt.angle({x: this.location().x, y: this.location().z}, {x: characterLocation.x, y: characterLocation.z});
            this.character.navigator.setRotation(angle);
            this.character.move(-1);
        }
        else{
            this.character.moveStop();
        }
        
    }

}