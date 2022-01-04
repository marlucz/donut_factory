import * as THREE from "three";

import Experience from "../Experience.js";

export default class Factory {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.time = this.experience.time;

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: "factory",
        expanded: true,
      });
    }

    this.setModel();
  }

  setModel() {
    this.model = {};

    this.resources.items.factoryModel.scene.traverse((child) => {
      if (child.name === "factory") {
        this.model.mesh = child;
      }
    });

    this.model.factoryBakedTexture = this.resources.items.factoryBakedTexture;
    this.model.factoryBakedTexture.encoding = THREE.sRGBEncoding;
    this.model.factoryBakedTexture.flipY = false;

    this.model.material = new THREE.MeshBasicMaterial({
      map: this.model.factoryBakedTexture,
    });

    this.model.mesh.traverse((_child) => {
      if (_child instanceof THREE.Mesh) {
        _child.material = this.model.material;
      }
    });

    this.scene.add(this.model.mesh);

    // Debug
    if (this.debug) {
    }
  }
  update() {}
}
