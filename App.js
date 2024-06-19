import * as THREE from "three"
import WebGPURenderer from "three/addons/renderers/webgpu/WebGPURenderer.js"
import WebGL from "three/addons/capabilities/WebGL.js"
import WebGPU from "three/addons/capabilities/WebGPU.js"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

export default class App {
  constructor() {
    this._setupThreeJs();
  }

  async _setupThreeJs() {
    const divContainer = document.querySelector("#canvas-container");
    this._divContainer = divContainer;

    console.log(`WebGPU Available: ${WebGPU.isAvailable()}, WebGL Available: ${WebGL.isWebGL2Available()}`)
    
    const bWebGPU = true;
    let renderer;
    if (bWebGPU) {
      renderer = new WebGPURenderer({ antialias: true, forceWebGL: false });
      await renderer.init();
      console.log("WebGPU Mode");
    } else {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      console.log("WebGL Mode");
    }
    renderer.setClearColor(new THREE.Color("#2c3e50"), 1);
    renderer.setPixelRatio(window.devicePixelRatio);

    divContainer.appendChild(renderer.domElement);

    this._renderer = renderer;
    const scene = new THREE.Scene();
    this._scene = scene;

    this._setupCamera();
    this._setupLight();
    this._setupControls();
    this._setupModel();
    this._setupEvents();
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10);
    camera.position.z = 3;
    this._camera = camera;
  }

  _setupLight() {
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    this._scene.add(light)
  }

  _setupModel() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial();
    const mesh = new THREE.Mesh(geometry, material)

    this._scene.add(mesh);
    this._mesh = mesh;
  }

  _setupControls() {
    this._orbitControls = new OrbitControls(this._camera, this._divContainer);
  }

  _setupEvents() {
    window.onresize = this.resize.bind(this);
    this.resize();

    this._clock = new THREE.Clock()
    requestAnimationFrame(this.render.bind(this));
  }

  update() {
    const delta = this._clock.getDelta();

    this._mesh.rotation.y += delta;

    this._orbitControls.update();
  }

  render() {
    this.update();

    this._renderer.render(this._scene, this._camera);

    requestAnimationFrame(this.render.bind(this));
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }
}