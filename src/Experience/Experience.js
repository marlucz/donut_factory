import * as THREE from "three";
import { Pane } from "tweakpane";

import Time from "./Utils/Time.js";
import Sizes from "./Utils/Sizes.js";
import Stats from "./Utils/Stats.js";
import Raycaster from "./Raycaster.js";

import Resources from "./Resources.js";
import Renderer from "./Renderer.js";
import Camera from "./Camera.js";
import World from "./World/World.js";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

import assets from "./assets.js";

export default class Experience {
  static instance;

  constructor(_options = {}) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;

    // Options
    this.targetElement = _options.targetElement;

    if (!this.targetElement) {
      console.warn("Missing 'targetElement' property");
      return;
    }

    this.time = new Time();
    this.sizes = new Sizes();
    this.setConfig();
    this.setDebug();
    this.setStats();
    this.setScene();
    this.setCamera();
    this.setRenderer();
    this.setResources();
    this.setPasses();
    this.setRaycaster();
    this.setWorld();

    this.sizes.on("resize", () => {
      this.resize();
    });

    this.update();
  }

  setConfig() {
    this.config = {};

    // Pixel ratio
    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

    // Width and height
    const boundings = this.targetElement.getBoundingClientRect();
    this.config.width = boundings.width;
    this.config.height = boundings.height || window.innerHeight;

    // Debug
    this.config.debug =
      window.location.hash === "#debug" && this.config.width > 420;
  }

  setDebug() {
    if (this.config.debug) {
      this.debug = new Pane();
      this.debug.containerElem_.style.width = "320px";
    }
  }

  setStats() {
    if (this.config.debug) {
      this.stats = new Stats(true);
    }
  }

  setScene() {
    this.scene = new THREE.Scene();
  }

  setCamera() {
    this.camera = new Camera();
  }

  setRenderer() {
    this.renderer = new Renderer({ rendererInstance: this.rendererInstance });

    this.targetElement.appendChild(this.renderer.instance.domElement);
  }

  setResources() {
    this.resources = new Resources(assets);
  }

  setPasses() {
    this.passes = {};

    // Debug
    if (this.debug) {
      this.passes.debugFolder = this.debug.addFolder({
        title: "postprocessing",
        expanded: false,
      });
    }

    this.passes.composer = new EffectComposer(this.renderer.instance);
    this.passes.renderPass = new RenderPass(this.scene, this.camera.instance);
    this.passes.composer.addPass(this.passes.renderPass);

    this.passes.outlinePass = new OutlinePass(
      new THREE.Vector2(this.config.width, this.config.height),
      this.scene,
      this.camera.instance
    );

    this.passes.outlinePass.edgeStrength = Number(10);
    this.passes.outlinePass.edgeGlow = Number(2);
    this.passes.outlinePass.edgeThickness = Number(1);
    this.passes.outlinePass.pulsePeriod = Number(0);
    this.passes.outlinePass.visibleEdgeColor.set("#ffffff");
    this.passes.outlinePass.hiddenEdgeColor.set("#ffffff");
    this.passes.outlinePass.selectedObjects = [];
    this.passes.composer.addPass(this.passes.outlinePass);

    this.passes.effectFXAA = new ShaderPass(FXAAShader);
    this.passes.effectFXAA.uniforms["resolution"].value.set(
      1 / this.config.width,
      1 / this.config.height
    );
    this.passes.effectFXAA.renderToScreen = true;
    this.passes.composer.addPass(this.passes.effectFXAA);

  }

  setWorld() {
    this.world = new World();
  }

  setRaycaster() {
    this.raycaster = new Raycaster();
  }

  update() {
    if (this.stats) this.stats.update();

    if (this.camera.isSet) this.camera.update();

    if (this.world) this.world.update();

    if (this.renderer) this.renderer.update();

    this.raycaster.update();

    this.passes.composer.render();

    window.requestAnimationFrame(() => {
      this.update();
    });
  }

  resize() {
    // Config
    const boundings = this.targetElement.getBoundingClientRect();
    this.config.width = boundings.width;
    this.config.height = boundings.height;

    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

    if (this.camera) this.camera.resize();

    if (this.renderer) this.renderer.resize();

    if (this.world) this.world.resize();
  }

  destroy() {}
}
