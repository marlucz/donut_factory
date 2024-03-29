import * as THREE from "three";
import gsap from "gsap";
import Experience from "../Experience.js";

export default class MixerSwitch {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.time = this.experience.time;
    this.raycaster = this.experience.raycaster;

    this.setModel();
  }

  clickHandler = () => {
    gsap.to(this.model.group.rotation, {
      y: 0.4,
      duration: 2,
    });
  };

  setModel() {
    this.model = {};
    this.model.group = this.resources.items.mixerSwitchModel.scene.children[0];
    this.scene.add(this.model.group);
    this.raycaster.setIntersectionTarget(
      this.model.group.children[0],
      this.clickHandler
    );

    this.model.group.traverse((_child) => {
      if (_child instanceof THREE.Mesh) {
        _child.material = this.world.factory.model.material;
      }
    });
  }

  update() {
    // this.model.group.rotation.y = Math.abs(Math.sin(this.time.elapsed * 0.002) * 0.4)
  }
}
