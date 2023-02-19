import * as THREE from "three";

import Experience from "../Experience.js";

const glassMaterial = new THREE.MeshPhysicalMaterial({
  roughness: 0.2,
  transmission: 1, // Add transparency
});

export default class IcingCables {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.time = this.experience.time;

    this.setModel();
  }

  setModel() {
    this.model = {};
    this.model.group = this.resources.items.icingCablesModel.scene;
    this.model.group.traverse((_child) => {
      if (_child instanceof THREE.Mesh) {
        _child.material = glassMaterial;
      }
    });
    this.scene.add(this.model.group);
  }

  update() {}
}
