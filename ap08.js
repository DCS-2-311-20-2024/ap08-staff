//
// 応用プログラミング 第8回 (ap08.js)
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { GLTFLoader } from "three/addons";
import * as L1 from "./ap08L1.js";
import * as L2 from "./ap08L2.js";
import * as L3 from "./ap08L3.js";
import * as L4 from "./ap08L4.js";

// ３Ｄページ作成関数の定義
function init() {
  // シーンの構成を4つの部分に分けて分担する
  const parts = [
    {module: L1, id: "left1", offset: {x: 50, z:-40}},
    {module: L2, id: "left2", offset: {x:-50, z:-40}},
    {module: L3, id: "left3", offset: {x:-50, z: 40}},
    {module: L4, id: "left4", offset: {x: 50, z: 40}},
  ];
  // 画面を 2:8 に分割する
  let sizeR = 0.8 * window.innerWidth;
  let sizeL = 0.2 * window.innerWidth;
  // シーン作成
  const scene = new THREE.Scene();
   // カメラの作成
  const mainCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  {
    mainCamera.position.set(50,50,200);
    mainCamera.lookAt(0,0,0);
  }
  // メインレンダラ
  const mainRenderer = new THREE.WebGLRenderer();
  {
    mainRenderer.setClearColor(0x204060);
    mainRenderer.setPixelRatio(window.devicePixelRatio);
    mainRenderer.setSize(sizeR, sizeR);
  }
  document.getElementById("main").appendChild(mainRenderer.domElement);
  // 3Dモデル(GLTF形式)の読み込み
  const PREFIX = "SHTV_Prefab_Car_"; // 4つの車の接頭辞
  const modelLoader = new GLTFLoader();
  const textureLoader = new THREE.TextureLoader();
  let cars = [];
  textureLoader.load("cityTexture.png", texture => {
    modelLoader.load("cars/scene.gltf", model => {
      model.scene.traverse(obj => {
        // 車の向きをリセットする
        obj.rotation.y = 0;
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.material.needsUpdate = true;
          // 車の部品の中心をずらす (救急車の車輪だけ特別扱い)
          if (obj.name.indexOf("Wheel_Ambulance_FR") == 11
            || obj.name.indexOf("Wheel_Ambulance_BR") == 11
          ) {
            obj.geometry.translate(-200, 0, 0)
          }
          else {
            obj.geometry.translate(200, 0, 0)
          }
        }
        if (obj.name.indexOf(PREFIX) == 0) {
          cars.push(obj); // 車を1台ずつ配列に入れる
        }
      });

      // 分担部分の初期化
      parts.forEach((part) => {
        part.module.init(scene, sizeL, part.id, part.offset, texture);
      });
      // 分担部分の自動運転コースの作成
      parts.forEach((part) => {
        part.module.makeCourse(scene);
      });
      // 分担部分の描画
      parts.forEach((part, i) => {
        part.module.setCar(scene, cars[i]);
      });
      // 全体の描画の開始
      render();
    });
  });
  // 光源の設定
  { // 環境ライト
    const light = new THREE.AmbientLight();
    light.intensity=1.5;
    scene.add(light);
  }
  { // ポイントライト
    const light = new THREE.PointLight(0xffffff, 5000);
    light.position.set(0, 50, 0);
    scene.add(light);
  }
  // Windowサイズの変更処理
  window.addEventListener("resize", ()=>{
    mainCamera.updateProjectionMatrix();
    sizeR = 0.8 * window.innerWidth;
    mainRenderer.setSize(sizeR, sizeR);
    parts.forEach((part) => {
      part.module.resize();
    });
  }, false);

  // 各セクションをクリックしたときにメイン表示のカメラを切り替える
  let camera = mainCamera;
  parts.forEach((part) => {
    document.getElementById(part.id).onclick = () => {
      camera = part.module.getCamera();
    }
  });
  // メイン部分をクリックしたときにカメラを元に戻す
  document.getElementById("main").onclick = () => {
    camera = mainCamera;
  }

  // 描画処理
  function render() {
    mainRenderer.render(scene, camera);
    parts.forEach((part, i) => {
      part.module.render(scene, cars[i]);
    });
    requestAnimationFrame(render);
  }
}

document.onload = init();