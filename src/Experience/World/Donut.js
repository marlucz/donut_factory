import * as THREE from "three";

import Experience from "../Experience.js";

export default class Donut {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.time = this.experience.time;

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: "donut",
        expanded: false,
      });
    }

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = {};
    console.log(this.resources.items.donutModel);
    this.model.group = this.resources.items.donutModel.scene;
    this.scene.add(this.model.group);
  }

  setAnimation() {
    this.animation = {};
    this.animation.isActive = false;

    this.animation.mixer = new THREE.AnimationMixer(this.model.group);

    this.animation.mixer.addEventListener("finished", () => {
      this.animation.isActive = false;
      this.animation.mixer.time = 0;
      console.log(this.animation.mixer)
    });

    this.animation.actions = {};
    this.animation.actions.toBake = this.animation.mixer.clipAction(
      this.resources.items.donutModel.animations.find(anim => anim.name === "donut-to-bake")
    );
    this.animation.actions.bake = this.animation.mixer.clipAction(
      this.resources.items.donutModel.animations.find(anim => anim.name === "donut-bake")
    );
    this.animation.actions.toIcing = this.animation.mixer.clipAction(
       this.resources.items.donutModel.animations.find(anim => anim.name === "donut-to-icing")
      );
    this.animation.actions.toSprinkles = this.animation.mixer.clipAction(
       this.resources.items.donutModel.animations.find(anim => anim.name === "donut-to-sprinkles")
      );
    this.animation.actions.leave = this.animation.mixer.clipAction(
       this.resources.items.donutModel.animations.find(anim => anim.name === "donut-leave")
      );

    this.animation.actions.current = this.animation.toBake;

    this.animation.play = (name) => {

      const action = this.animation.actions[name];

      action.reset();
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.play();
      this.animation.isActive = true;
      console.log(this.animation.mixer)

      this.animation.actions.current = action;
    };

    if (this.debug) {
      this.debugFolder
        .addButton({
          title: "toBake",
          label: "play toBake",
        })
        .on("click", () => this.startAnimation("toBake"));
      this.debugFolder
        .addButton({
          title: "bake",
          label: "play bake",
        })
        .on("click", () => this.startAnimation("bake"));
      this.debugFolder
        .addButton({
          title: "toIcing",
          label: "play toIcing",
        })
        .on("click", () => this.startAnimation("toIcing"));
      this.debugFolder
        .addButton({
          title: "toSprinkles",
          label: "play toSprinkles",
        })
        .on("click", () => this.startAnimation("toSprinkles"));
      this.debugFolder
        .addButton({
          title: "leave",
          label: "play leave",
        })
        .on("click", () => this.startAnimation("leave"));
    }
  }

  startAnimation(name) {
    this.animation.play(name);
  }

  update() {
    if (this.animation.isActive) {
      this.animation.mixer.update(0.01);
    }
  }
}
