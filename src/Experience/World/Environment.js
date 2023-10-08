import * as THREE from "three";
import Experience from "../Experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    // Setup
    this.setAmbientLight();
    this.setSunLight();

    // Debug
    this.setDebug();
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(this.ambientLight);
  }
  setSunLight() {
    this.sunLight = new THREE.DirectionalLight(0xffffff, 0.6);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.camera.far = 45;
    this.sunLight.shadow.camera.left = -7;
    this.sunLight.shadow.camera.top = 7;
    this.sunLight.shadow.camera.right = 7;
    this.sunLight.shadow.camera.bottom = -7;
    this.sunLight.position.set(2, 8, 8);
    this.scene.add(this.sunLight);
  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Environment");
      this.debugFolder
        .add(this.sunLight, "intensity")
        .name("LightIntensity")
        .min(0)
        .max(10)
        .step(0.001);
    }
  }
}
