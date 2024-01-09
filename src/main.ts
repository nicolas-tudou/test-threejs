
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

// light
const envLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(envLight);

const light = new THREE.PointLight( 0xffffff, 100 );
light.position.set( 0, 10, 0 ); //default; light shining from top
light.castShadow = true; // default false
scene.add( light );

window.addEventListener("resize", handleWindowResize)
function handleWindowResize () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
}

// cube
const geometry = new THREE.BoxGeometry(3, 3, 3);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = true;
cube.position.y = 5;
// scene.add(cube);

// ground
const floorG = new THREE.PlaneGeometry(30, 30);
const floorM = new THREE.MeshPhongMaterial({color: 0x0099ff})
const floor = new THREE.Mesh(floorG, floorM);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI / 2
scene.add(floor)

// grid helper
const grid = new THREE.GridHelper(10, 10, 0xffffff);
scene.add(grid)

// axis helper
const axes = new THREE.AxesHelper(10);
scene.add(axes)


// 3D model loader
const loader = new GLTFLoader();
loader.load( '../models/buster_drone.glb', function ( gltf ) {
  console.log(gltf)
  gltf.scene.scale.set(3, 3, 3)
  gltf.scene.position.y = 4
	scene.add( gltf.scene );
}, undefined, function ( error ) {

	console.error( error );

} );

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping  = true
// controls.addEventListener('change', e => {
//   console.log('controls changed', e)
// })


function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

if (WebGL.isWebGLAvailable()) {
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById('container')?.appendChild(warning);
}
