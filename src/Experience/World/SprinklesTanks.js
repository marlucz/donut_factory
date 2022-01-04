import * as THREE from "three";

import Experience from "../Experience.js";

export default class SprinklesTanks {
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
    this.model.group =
      this.resources.items.sprinklesTanksModel.scene.children[0];
    this.scene.add(this.model.group);

    this.model.group.traverse((_child) => {
      if (_child instanceof THREE.Mesh) {
        _child.material = this.world.factory.model.material;
      }
    });
  }

  update() {
    this.model.group.children.forEach((child, i) => {
      let time = this.time.elapsed;
      time = time < i ? 0 : time;

      child.scale.y = 1 - Math.abs(Math.sin(time * 0.001));
    });
  }
}
