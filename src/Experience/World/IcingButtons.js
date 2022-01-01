import * as THREE from "three";

import Experience from "../Experience.js";

export default class IcingButtons {
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
    this.model.group = this.resources.items.icingButtonsModel.scene.children[0]
    this.scene.add(this.model.group);

    this.model.group.traverse((_child) => {
      if (_child instanceof THREE.Mesh) {
        _child.material = this.world.factory.model.material;
      }
    });
  }

  update() {
  }
}
