import * as THREE from 'three';
// glb loader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import assets and assign to variables

let camera, scene, renderer;

let object;

init();

function init() {


    camera = new THREE.PerspectiveCamera(
        20, // fov = field of view
        window.innerWidth / window.innerHeight, // aspect ratio
        0.1, // near plane : anything closer than this won't be rendered
        2000 // far plane : anything further than this won't be rendered
    );

    // set camera position
    camera.position.set(50, 50, 50);
    

    scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    //const pointLight = new THREE.PointLight(0xffffff, 15);
    //camera.add(pointLight);
    scene.add(camera);

    const manager = new THREE.LoadingManager(
        function () {
            console.log(object)
            scene.add(object.scene);
            render();
        }
    );

    // model

    function onProgress(xhr) {
        if (xhr.lengthComputable) {
            const percentComplete = xhr.loaded / xhr.total * 100;
            //set #loading value to percentComplete
            const dom = document.getElementById('loading');
            dom.value = percentComplete;
            if (percentComplete >= 100) { //loading complete, percentage sometimes > 100
                //hide #loading-container
                const dom = document.getElementById('loading-container');
                dom.style.display = 'none';
                //show renderer.domElement
                renderer.domElement.style.display = 'block';
            }
            console.log(percentComplete);
        }
    }

    function onError() { }

    const loader = new GLTFLoader(manager);
    loader.load('assets/BahamasIsland.glb', function (obj) {
        object = obj;

    }, onProgress, onError);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    // hide renderer.domElement before loading complete
    renderer.domElement.style.display = 'none';
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.useLegacyLights = false;
    document.body.appendChild(renderer.domElement);


    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.addEventListener('change', render);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}



function render() {
    renderer.render(scene, camera);
}
