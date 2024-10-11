import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadModel(scene) {
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