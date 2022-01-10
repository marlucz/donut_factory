import * as THREE from "three";
import Experience from "./Experience.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
  constructor(_options) {
    // Options
    this.experience = new Experience();
    this.config = this.experience.config;
    this.debug = this.experience.debug;
    this.time = this.experience.time;
    this.sizes = this.experience.sizes;
    this.targetElement = this.experience.targetElement;
    this.scene = this.experience.scene;

    // Set up
    this.mode = "debug"; // defaultCamera \ debugCamera

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: "camera",
        expanded: false,
      });
    }

    this.setInstance();
    this.setModes();
  }

  setInstance() {
    // Set up
    this.instance = new THREE.PerspectiveCamera(
      25,
      this.config.width / this.config.height,
      0.1,
      150
    );
    this.instance.rotation.reorder("YXZ");

    this.scene.add(this.instance);
  }

  setModes() {
    this.modes = {};

    // Default
    this.modes.default = {};
    this.modes.default.instance = this.instance.clone();
    this.modes.default.instance.rotation.reorder("YXZ");

    // Debug
    this.modes.debug = {};
    this.modes.debug.instance = this.instance.clone();
    this.modes.debug.instance.rotation.reorder("YXZ");
    this.modes.debug.instance.position.set(5, 5, 5);

    this.modes.debug.orbitControls = new OrbitControls(
      this.modes.debug.instance,
      this.targetElement
    );
    this.modes.debug.orbitControls.enabled = this.modes.debug.active;
    this.modes.debug.orbitControls.screenSpacePanning = true;
    this.modes.debug.orbitControls.enableKeys = false;
    this.modes.debug.orbitControls.zoomSpeed = 0.25;
    this.modes.debug.orbitControls.enableDamping = true;
    this.modes.debug.orbitControls.update();
  }

  startAnimation() {
    this.factoryAnimations =
      this.experience.resources.items.factoryModel.animations;
    this.animationCamera =
      this.experience.resources.items.factoryModel.cameras[0];
    this.experience.resources.items.factoryModel.scene.traverse((child) => {
      if (child.name === "cameraTarget") {
        this.animationCameraTarget = child;
      }
    });
    this.instance.position.copy(this.animationCamera.position);
    this.instance.updateProjectionMatrix();

    this.animation = {};
    this.mixers = ["camera", "target"];
    this.animation.speed = 0.01;

    this.animation.mixers = {
      camera: new THREE.AnimationMixer(this.animationCamera),
      target: new THREE.AnimationMixer(this.animationCameraTarget),
    };

    this.animation.actions = {
      camera: {},
      target: {},
    };

    this.mixers.forEach((mixer) => {
      for (let i = 0; i < this.factoryAnimations.length; i++) {
        const clip = this.factoryAnimations[i];
        if (clip.name.startsWith(mixer)) {
          const action = this.animation.mixers[mixer].clipAction(clip);
          this.animation.actions[mixer][clip.name] = action;
        }
      }
    });

    this.animation.play = (name) => {
      this.mixers.forEach((mixer) => {
        const action = this.animation.actions[mixer][`${mixer}-${name}`];
        action.reset()
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.play();
      });
    };

    this.animation.current = "intro";
    // this.animation.play(this.animation.current);

    if (this.debug) {
      this.debugFolder
        .addButton({
          title: "intro",
          label: "intro",
        })
        .on("click", () => this.animation.play("intro"));

      this.debugFolder.addInput(this.animation, 'speed', {
        label: 'animation speed', min: 0.01, max: 0.1, step: 0.01
      })
    }
  }

  resize() {
    this.instance.aspect = this.config.width / this.config.height;
    this.instance.updateProjectionMatrix();

    this.modes.default.instance.aspect = this.config.width / this.config.height;
    this.modes.default.instance.updateProjectionMatrix();

    this.modes.debug.instance.aspect = this.config.width / this.config.height;
    this.modes.debug.instance.updateProjectionMatrix();
  }

  update() {
    // Update debug orbit controls
    // this.modes.debug.orbitControls.update();

    // Apply coordinates
    // this.instance.position.copy(this.modes[this.mode].instance.position);
    // this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion);

    if (this.mixers) {
      this.mixers.forEach((mixer) => {
        this.animation.mixers[mixer].update(this.animation.speed);
      });
      this.instance.position.copy(this.animationCamera.position);
      this.instance.lookAt(this.animationCameraTarget.position);
    }

    this.instance.updateMatrixWorld(); // To be used in projection
    this.instance.updateProjectionMatrix(); // To be used in projection
  }

  destroy() {
    this.modes.debug.orbitControls.destroy();
  }
}
