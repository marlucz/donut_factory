import * as THREE from "three";

import Experience from "../Experience.js";

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
    this.scene.add(this.model.group);
  }

  update() {

  }
}
