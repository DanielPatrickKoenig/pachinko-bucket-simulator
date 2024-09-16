import * as THREE from 'three';
export default class InteractionManager{
    constructor(environment){
        this.environment = environment;
        const testMarker = this.createTestMarker();
        this.environment.renderer.domElement.addEventListener('click', (e) => {
            console.log(this.environment);
            console.log(this.environment.renderer.domElement.getBoundingClientRect().top);
            const raycaster = new THREE.Raycaster();
            const pointer = this.pointerPosition(e);
            raycaster.setFromCamera(pointer, this.environment.camera);
            const intersects = raycaster.intersectObjects(this.environment.scene.children);
            console.log(intersects);
            if(intersects.length){
                testMarker.position.x = intersects[0].point.x;
                // testMarker.position.y = intersects[0].y;
                testMarker.position.z = intersects[0].point.z;
            }
        });
        

    }

    pointerPosition(e){
        const pointer = new THREE.Vector2();
        // pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        // pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

        pointer.x = ( e.clientX / window.innerWidth );
        pointer.y = - ( e.clientY / window.innerHeight );

        // pointer.x = ( e.clientX / 1 ) * 2 - 1;
        // pointer.y = - ( e.clientY / 1 ) * 2 + 1;
        return pointer;
    }

    createTestMarker(){
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        const mesh = this.environment.createSphere({size: {r: 1}, material}).mesh;
        this.environment.scene.add(mesh);
        return mesh;
    }
}