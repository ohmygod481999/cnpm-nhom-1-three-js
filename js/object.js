import * as THREE from "/js/three.module.js";
import { OrbitControls } from "/js/OrbitControls.js";
import { GLTFLoader } from "/js/GLTFLoader.js";
import * as THREEx from "/js/threex.domevents.js";

class GLTFObject {
    constructor(url, scene, camera, renderer) {
        this.url = url;
        this.scene = scene;
        this.object = null;
        this.camera = camera;
        this.renderer = renderer;
        this.name = null,
        this.dateOfBirth = null
    }

    setInfo ({ name, dateOfBirth}) {
        this.name = name,
        this.dateOfBirth = dateOfBirth
    }

    init = async callback => {
        let loadGLTF = new Promise(resolve => {
            var loader = new GLTFLoader();
            loader.load(this.url, gltf => {
                console.log(gltf.scene.id)
                resolve(gltf.scene);
            });
        });
        const scene = await loadGLTF;
        this.scene.add(scene);
        this.object = scene;
        console.log("load done!");
        if (callback) callback(scene);
    };

    rotate(x, y, z) {
        if (!this.object) return console.error("Object NULL");
        this.object.rotation.x = x;
        this.object.rotation.y = y;
        this.object.rotation.z = z;
    }

    setPosition(x, y, z) {
        if (!this.object) return console.error("Object NULL");
        this.object.position.x = x;
        this.object.position.y = y;
        this.object.position.z = z;
    }

    setScale(x) {
        if (!this.object) return console.error("Object NULL");
        this.object.scale.x = x;
        this.object.scale.y = x;
        this.object.scale.z = x;
    }

    getScene() {
        if (!this.object) return {}
        return this.object;
    }

    print() {
        console.log(this.url);
    }
}

export default GLTFObject;
