import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load GLTF model
const loader = new GLTFLoader();
loader.load('./ruined/scene.gltf', function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    // Optional: You may want to manipulate the model or access its children here

    // Render the scene
    animate();
});

// Function to animate the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}