import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createGround } from './ground.js';

let scene, camera, renderer, controls;
let leaves = [];
let ground;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene') });
  renderer.setSize(window.innerWidth, window.innerHeight);

  controls = new OrbitControls(camera, renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  camera.position.set(0, 5, 10);
  camera.lookAt(0, 0, 0);

  ground = createGround(scene);
  loadModel();
  animate();
}


function loadModel() {
  const loader = new GLTFLoader();
  loader.load(
    '/public/sidewalk.glb',
    (gltf) => {
      let leafCount = 0;
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.name.startsWith('leaf_')) {
          setupLeaf(child);
          leafCount++;
        }
      });
      console.log(`Found ${leafCount} leaves`);
      scene.add(gltf.scene);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
      console.error('An error happened', error);
    }
  );
}

function setupLeaf(leaf) {
  // 초기 위치를 약간 위로 올림
  leaf.position.y += 5;  // 5 단위 위로 올림
  leaf.userData.initialPosition = leaf.position.clone();
  
  // 초기 회전을 랜덤하게 설정
  leaf.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );

  // 떨어지는 속도와 회전 속도를 조정
  leaf.userData.fallSpeed = Math.random() * 0.02 + 0.01;  // 속도를 약간 줄임
  leaf.userData.rotationSpeed = {
    x: Math.random() * 0.02 - 0.01,
    y: Math.random() * 0.02 - 0.01,
    z: Math.random() * 0.02 - 0.01
  };

  leaf.userData.landed = false;

  leaves.push(leaf);
}

function animateLeaves() {
  leaves.forEach((leaf, index) => {
    if (!leaf.userData.landed) {
      // 위치 직접 업데이트
      leaf.position.y -= leaf.userData.fallSpeed;

      // 회전 업데이트
      leaf.rotation.x += leaf.userData.rotationSpeed.x;
      leaf.rotation.y += leaf.userData.rotationSpeed.y;
      leaf.rotation.z += leaf.userData.rotationSpeed.z;

      // 바닥에 닿으면 위치를 고정
      if (leaf.position.y <= ground.position.y) {
        leaf.position.y = ground.position.y;
        leaf.userData.landed = true;
        // console.log(`Leaf ${index} landed on the ground. Initial Y: ${leaf.userData.initialPosition.y}, Final Y: ${leaf.position.y}`);
      }
    }
  });
}

function animate() {
  requestAnimationFrame(animate);
  animateLeaves();
  controls.update();
  renderer.render(scene, camera);
}

// 디버그 정보를 주기적으로 출력
setInterval(() => {
  console.log("Leaves positions:");
  leaves.forEach((leaf, index) => {
    console.log(`Leaf ${index}: ${leaf.position.y}, landed: ${leaf.userData.landed}`);
  });
}, 5000);  // 5초마다 출력

init();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});