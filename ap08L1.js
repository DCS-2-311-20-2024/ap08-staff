//
// 応用プログラミング 第8回 (ap08L1.js)
//
// G18400-2021 拓殖太郎
//

"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import * as L1 from "./ap08L1.js";
import * as L2 from "./ap08L2.js";
import * as L3 from "./ap08L3.js";
import * as L4 from "./ap08L4.js";

let renderer;
let camera;
let course;
export const origin = new THREE.Vector3();
export const controlPoints = [
    [ 25, 40],
    [-50,-20]
]
export function init(scene, size, id, offset, texture) {
    origin.set(offset.x, 0, offset.z);
    camera = new THREE.PerspectiveCamera(20, 1, 0.1, 1000);
    {
      camera.position.set(0, 10, 0);
      camera.lookAt(offset.x, 0, offset.z);
    }
    renderer =  new THREE.WebGLRenderer();
    {
      renderer.setClearColor(0x406080);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(size, size);
    }
    document.getElementById(id).appendChild(renderer.domElement);
    
    // 平面
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 80),
        new THREE.MeshLambertMaterial({color: "green"})
    )
    plane.rotateX(-Math.PI/2);
    plane.position.set(offset.x, -0.01, offset.z);
    scene.add(plane);

    // ビル

    // コース(描画)

}

// コース(自動運転用)
export function makeCourse(scene) {
}

// カメラを返す
export function getCamera() {
    return camera;
}

// 車の設定
export function setCar(scene, car) {
}

// Windowサイズの変更処理
export function resize() {
    camera.updateProjectionMatrix();
    const sizeR = 0.2 * window.innerWidth;
    renderer.setSize(sizeR, sizeR);
}

export function render(scene, car) {
    camera.lookAt(car.position.x, car.position.y, car.position.z);
    renderer.render(scene, camera);
}
