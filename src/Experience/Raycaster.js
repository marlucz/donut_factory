import * as THREE from "three";
import Experience from "./Experience.js";

export default class Raycaster {
  constructor(_options) {
    // Options
    this.experience = new Experience();
    this.config = this.experience.config;
    this.camera = this.experience.camera;
    this.scene = this.experience.scene;
    this.outlinePass = this.experience.renderer.postProcess.outlinePass;

    this.intersectObjects = [];

    this.setRaycaster();
  }

  setIntersectionTarget(object, handler) {
    this.intersectObjects.push(object);
    this.intersectionClickHandler = handler;
  }

  onPointerMove = (event) => {
    if (!this.camera.animation || this.camera.animation.isActive) return;

    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  onPointerClick = () => {
    if (this.intersected && this.intersectionClickHandler)
      this.intersectionClickHandler(this.intersected);
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
      true
    );

    if (intersects.length > 0) {
      this.intersected = intersects[0].object;
      if (
        this.intersectObjects.find(
          (mesh) => mesh.name === this.intersected.name
        )
      ) {
        this.selectedObjects = [this.intersected];
        this.outlinePass.selectedObjects = this.selectedObjects;
      }
    } else {
      this.intersected = [];
      this.selectedObjects = [this.intersected];
      this.outlinePass.selectedObjects = [];
    }
  };

  update() {
    this.raycast();
  }
}
