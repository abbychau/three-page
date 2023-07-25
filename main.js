import * as THREE from 'three';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import assets and assign to variables

let camera, scene, renderer;

let object;

init();

function init() {

    function loadModel() {
        object.traverse( function ( child ) {
            if ( child.isMesh ) child.material.map = texture;
        } );
    
        object.position.y = - 0;
        object.scale.setScalar( 0.1 );
        scene.add( object );
    
        render();
    }
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20 );
    camera.position.z = 2.5;

    scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight( 0xffffff );
    scene.add( ambientLight );

    const pointLight = new THREE.PointLight( 0xffffff, 15 );
    camera.add( pointLight );
    scene.add( camera );

    const manager = new THREE.LoadingManager( loadModel );

    // texture

    const textureLoader = new THREE.TextureLoader( manager );
    const texture = textureLoader.load( 'assets/flower.jpg', render );
    texture.colorSpace = THREE.SRGBColorSpace;

    // model

    function onProgress( xhr ) {
        if ( xhr.lengthComputable ) {
            const percentComplete = xhr.loaded / xhr.total * 100;
            //set #loading value to percentComplete
            const dom = document.getElementById('loading');
            dom.value = percentComplete;
            if (percentComplete === 100) {
                //hide #loading-container
                const dom = document.getElementById('loading-container');
                dom.style.display = 'none';
                //show renderer.domElement
                renderer.domElement.style.display = 'block';
            }
            console.log( percentComplete );
        }
    }

    function onError() {}

    const loader = new OBJLoader( manager );
    loader.load( 'assets/2023-1.obj', function ( obj ) {
        object = obj;
    }, onProgress, onError );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    // hide renderer.domElement before loading complete
    renderer.domElement.style.display = 'none';
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.useLegacyLights = false;
    document.body.appendChild( renderer.domElement );


    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 2;
    controls.maxDistance = 5;
    controls.addEventListener( 'change', render );
    
    window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function render() {
    renderer.render( scene, camera );
}
