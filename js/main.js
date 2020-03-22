import * as THREE from "/js/three.module.js";
import { OrbitControls } from "/js/OrbitControls.js";
import { GLTFLoader } from "/js/GLTFLoader.js";
import GLTFObject from "/js/object.js";
import { GUI } from "/js/dat.gui.module.js";

let gui;

var params = {
    color: "#e5e5e5"
};

const sceneURL = "../models/girl/girl.gltf";

const sceneURL2 =
    "https://cdn.glitch.com/9488457d-447d-44b2-b029-3ca998dec3ef%2FBox.glb?v=1584255677433";

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

var renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setClearColor(params.color);

let control = new OrbitControls(camera, renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(light);

let girl = new GLTFObject(sceneURL, scene, camera, renderer);

girl.init(function(scene) {
    console.log(scene);
    girl.setScale(0.01);
});

let box = new GLTFObject(sceneURL2, scene);
box.init(function() {
    box.setPosition(2, 0, 2);
    console.log(box.object.id);
    animate();
});

camera.position.z = 5;

// AXES HELPER
// var axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

let textureLoader = new THREE.TextureLoader();

let groundTexture = textureLoader.load("/textures/wood-texture-light.jpg");
console.log(groundTexture);
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(25, 25);
groundTexture.anisotropy = 16;
groundTexture.encoding = THREE.sRGBEncoding;

var groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });

var mesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(200, 200),
    groundMaterial
);
mesh.position.y = 0;
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
    INTERSECTED;

var animate = function() {
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        // console.log(intersects)
        if (INTERSECTED != intersects[0]) {
            // if ( INTERSECTED ) console.log("aa")

            // INTERSECTED = intersects[0].object;
            // INTERSECTED.point = intersects[0].point;

            INTERSECTED = intersects[0];
        }
    } else {
        // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        // if ( INTERSECTED ) console.log("hihi")

        INTERSECTED = null;
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};
window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("dblclick", function() {
    if (INTERSECTED) {
        if (gui) gui.destroy();
        gui = new GUI();
        
        let currentObject = INTERSECTED
        
        console.log(INTERSECTED);
        gui.add(params, "color").onChange((value) => {
            console.log(currentObject)
            // renderer.setClearColor(value);
            currentObject.object.material.color.set(value)
            // INTERSECTED.object.material.color.set(value)
            animate();
        });
        
        let tempPosition = new THREE.Vector3(
            INTERSECTED.point.x + 2,
            INTERSECTED.point.y + 2,
            INTERSECTED.point.z + 2
        );
        camera.position.copy(tempPosition);
        control.target.set(
            INTERSECTED.point.x,
            INTERSECTED.point.y,
            INTERSECTED.point.z
        );
        camera.lookAt(INTERSECTED.point);
    } else {
        if (gui) {
            gui.destroy();
            gui = null
        }
    }
});

animate();

function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
