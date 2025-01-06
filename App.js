import * as THREE from "three"
import { OrbitControls } from "three/addons/Addons.js"

export default class App {
  constructor() {
    this._setupThreeJs();
    this._setupCamera();
    this._setupLight();
    this._setupControls();
    this._setupModel();
    this._setupEvents();
  }

  _setupThreeJs() {
    const divContainer = document.querySelector("#app");
    this._divContainer = divContainer;
    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color("#2c3e50"), 1);
    renderer.setPixelRatio(window.devicePixelRatio);

    divContainer.appendChild(renderer.domElement);

    this._renderer = renderer;
    const scene = new THREE.Scene();
    this._scene = scene;
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
    const orbitControls = new OrbitControls(this._camera, this._divContainer);
    this._orbitControls = orbitControls;
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