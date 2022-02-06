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
    this.resources.items.donutModel.scene.traverse((child) => {
      if (child.name === "Donut") this.model.donut = child;
      if (child.name === "Dough") this.model.dough = child;
    });

    this.scene.add(this.model.donut, this.model.dough);

    this.model.donut.needsUpdate = true;
    this.model.dough.needsUpdate = true;
  }

  clipAction = (mixer, name) => {
    return this.animation.mixer[mixer].clipAction(
      this.resources.items.donutModel.animations.find(
        (anim) => anim.name === name
      )
    );
  };

  setAnimation() {
    this.animation = {};
    this.animation.isActive = false;
    this.animation.mixer = {};
    this.animation.mixer.donut = new THREE.AnimationMixer(this.model.donut);
    this.animation.mixer.dough = new THREE.AnimationMixer(this.model.dough);

    this.animation.mixer.donut.addEventListener("finished", () => {
      this.animation.isActive = false;
      this.animation.mixer.donut.time = 0;
      this.animation.action.prev = this.animation.action.current;
    });
    this.animation.mixer.dough.addEventListener("finished", () => {
      this.animation.isActive = false;
      this.animation.mixer.dough.time = 0;
      this.animation.action.prev = this.animation.action.current;
    });

    this.animation.action = {};

    this.animations = [
      {
        mixer: "dough",
        name: "dough-to-form"
      },
      {
        mixer: "donut",
        name: "donut-to-bake"
      },
      {
        mixer: "donut",
        name: "donut-bake"
      },
      {
        mixer: "donut",
        name: "donut-to-icing"
      },
      {
        mixer: "donut",
        name: "donut-to-sprinkles"
      },
      {
        mixer: "donut",
        name: "donut-leave"
      },
    ]

    this.animation.play = (action) => {
      action.reset();
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;

      if (this.animation.action.prev) {
        // remove prev animation influence on next animation
        this.animation.action.prev.fadeOut(0);
      }

      action.play();
      this.animation.isActive = true;
      this.animation.action.current = action;
    };

    if (this.debug) {
      this.animations.forEach(({mixer,name}) => {
        this.debugFolder
          .addButton({
            title: name,
            label: name,
          })
          .on("click", () => this.startAnimation(mixer, name));

      })
    }
  }

  startAnimation(mixer, name) {
    const action = this.clipAction(mixer, name);

    this.animation.play(action);
  }

  update() {
    if (this.animation.isActive) {
      this.animation.mixer.donut.update(0.01);
      this.animation.mixer.dough.update(0.01);
    }
  }
}
