import * as THREE from 'three';

export function createGround(scene) {
  const groundGeometry = new THREE.PlaneGeometry(20, 20);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;  // 바닥 위치를 0으로 설정
  scene.add(ground);
  return ground;
}