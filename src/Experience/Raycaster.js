import * as THREE from "three";
import Experience from "./Experience.js";

export default class Raycaster {
  constructor(_options) {
    // Options
    this.experience = new Experience();
    this.config = this.experience.config;
    this.camera = this.experience.camera;
    this.scene = this.experience.scene;

    this.intersectObjects = [];

    this.setRaycaster();
  }

  addObject(object) {
    this.intersectObjects.push(object);
  }

  onPointerMove = (event) => {
    if (!this.camera.animation || this.camera.animation.isActive) return;

    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  onPointerClick = () => {
    this.intersected = this.raycast();

    if (this.intersected) console.log(this.intersected);
  };

  setRaycaster() {
    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    document.addEventListener("mousemove", this.onPointerMove, false);
    document.addEventListener("click", this.onPointerClick, false);
  }

  raycast = () => {
    if (!this.intersectObjects[0]) return;
    this.raycaster.setFromCamera(this.pointer, this.camera.instance);

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(
      this.intersectObjects,
      false
    );
    if (intersects.length > 0) {
      this.intersected = intersects[0].object;

    } else {
      this.intersected = null;
    }
  };

  update() {
    this.raycast();
  }
}
