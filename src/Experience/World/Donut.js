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
     this.resources.items.donutModel.scene.traverse(child => {
       if(child.name === 'Donut') this.model.donut = child;
       if(child.name === 'Dough') this.model.dough = child;
     })
     console.log(this.model)
    this.scene.add(this.model.donut, this.model.dough);
  }

  setAnimation() {
    this.animation = {};
    this.animation.isActive = false;
    this.animation.mixer = {}
    this.animation.mixer.donut = new THREE.AnimationMixer(this.model.donut);
    this.animation.mixer.dough = new THREE.AnimationMixer(this.model.dough);

    this.animation.mixer.donut.addEventListener("finished", () => {
      this.animation.isActive = false;
      this.animation.mixer.donut.time = 0;
    });
    this.animation.mixer.dough.addEventListener("finished", () => {
      this.animation.isActive = false;
      this.animation.mixer.dough.time = 0;
    });

    this.animation.actions = {};

    this.animation.actions.toBake = this.animation.mixer.donut.clipAction(
      this.resources.items.donutModel.animations.find(anim => anim.name === "donut-to-bake")
    );
    this.animation.actions.bake = this.animation.mixer.donut.clipAction(
      this.resources.items.donutModel.animations.find(anim => anim.name === "donut-bake")
    );
    this.animation.actions.toIcing = this.animation.mixer.donut.clipAction(
       this.resources.items.donutModel.animations.find(anim => anim.name === "donut-to-icing")
      );
    this.animation.actions.toSprinkles = this.animation.mixer.donut.clipAction(
       this.resources.items.donutModel.animations.find(anim => anim.name === "donut-to-sprinkles")
      );
    this.animation.actions.leave = this.animation.mixer.donut.clipAction(
       this.resources.items.donutModel.animations.find(anim => anim.name === "donut-leave")
      );
    this.animation.actions.toForm = this.animation.mixer.dough.clipAction(
       this.resources.items.donutModel.animations.find(anim => anim.name === "dough-to-form")
      );

    this.animation.actions.current = this.animation.toBake;

    this.animation.play = (name) => {

      const action = this.animation.actions[name];
      action.reset();
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.play();
      this.animation.isActive = true;

      this.animation.actions.current = action;
      console.log(this.animation.actions.current)
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
      this.debugFolder
        .addButton({
          title: "toForm",
          label: "play toForm",
        })
        .on("click", () => this.startAnimation("toForm"));
    }
  }

  startAnimation(name) {
    this.animation.play(name);
  }

  update() {
    if (this.animation.isActive) {
      this.animation.mixer.donut.update(0.005);
      this.animation.mixer.dough.update(0.005);

      const {x,z} = this.model.donut.position

      // console.log('x: ' + x, 'z ' + z)
    }
  }
}
