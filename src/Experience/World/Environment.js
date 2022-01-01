import * as THREE from "three";
import Experience from "../Experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    this.setPointLight();
  }

  setPointLight() {
    this.pointLight = new THREE.PointLight(0xffffff, 1.25, 1000);
    this.pointLight.position.set(0, 0, 600);
    this.scene.add(this.pointLight);
  }
}
