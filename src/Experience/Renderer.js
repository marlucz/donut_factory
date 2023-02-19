import * as THREE from "three";
import Experience from "./Experience.js";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

export default class Renderer {
  constructor(_options = {}) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.debug = this.experience.debug;
    this.stats = this.experience.stats;
    this.time = this.experience.time;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.usePostprocess = true;

    this.setInstance();
    this.setPostProcess();
  }

  setInstance() {
    this.clearColor = "#010101";

    // Renderer
    this.instance = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
    });
    this.instance.domElement.style.position = "absolute";
    this.instance.domElement.style.top = 0;
    this.instance.domElement.style.left = 0;
    this.instance.domElement.style.width = "100%";
    this.instance.domElement.style.height = "100%";

    this.instance.setClearColor(this.clearColor, 1);
    this.instance.setSize(this.config.width, this.config.height);
    this.instance.setPixelRatio(this.config.pixelRatio);

    this.instance.physicallyCorrectLights = true;
    // this.instance.gammaOutPut = true
    this.instance.outputEncoding = THREE.sRGBEncoding;
    // this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    // this.instance.shadowMap.enabled = false
    this.instance.toneMapping = THREE.NoToneMapping;
    this.instance.toneMappingExposure = 1;

    this.context = this.instance.getContext();

    // Add stats panel
    if (this.stats) {
      this.stats.setRenderPanel(this.context);
    }
  }

  setPostProcess() {
    this.postProcess = {};

    if (this.debug) {
      this.postProcess.debugFolder = this.debug.addFolder({
        title: "postprocessing",
        expanded: false,
      });
    }

    /**
     * Render pass
     */
    this.postProcess.renderPass = new RenderPass(
      this.scene,
      this.camera.instance
    );

    /**
     * Outline pass
     */

    this.postProcess.outlinePass = new OutlinePass(
      new THREE.Vector2(this.config.width, this.config.height),
      this.scene,
      this.camera.instance
    );

    // this.postProcess.outlinePass.edgeStrength = Number(10);
    // this.postProcess.outlinePass.edgeGlow = Number(2);
    // this.postProcess.outlinePass.edgeThickness = Number(1);
    // this.postProcess.outlinePass.pulsePeriod = Number(0);
    this.postProcess.outlinePass.visibleEdgeColor.set("#00ff00");
    this.postProcess.outlinePass.hiddenEdgeColor.set("#000000");
    this.postProcess.outlinePass.selectedObjects = [];

    /**
     * Effect FXAA
     */

    this.postProcess.effectFXAA = new ShaderPass(FXAAShader);
    this.postProcess.effectFXAA.uniforms["resolution"].value.set(
      1 / this.config.width,
      1 / this.config.height
    );
    this.postProcess.effectFXAA.renderToScreen = true;

    /**
     * Effect composer
     */
    const RenderTargetClass =
      this.config.pixelRatio >= 2
        ? THREE.WebGLRenderTarget
        : THREE.WebGLMultisampleRenderTarget;
    // const RenderTargetClass = THREE.WebGLRenderTarget
    this.renderTarget = new RenderTargetClass(
      this.config.width,
      this.config.height,
      {
        generateMipmaps: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        encoding: THREE.sRGBEncoding,
      }
    );
    this.postProcess.composer = new EffectComposer(
      this.instance,
      this.renderTarget
    );
    this.postProcess.composer.setSize(this.config.width, this.config.height);
    this.postProcess.composer.setPixelRatio(this.config.pixelRatio);

    this.postProcess.composer.addPass(this.postProcess.renderPass);
    this.postProcess.composer.addPass(this.postProcess.effectFXAA);
    this.postProcess.composer.addPass(this.postProcess.outlinePass);
  }

  resize() {
    // Instance
    this.instance.setSize(this.config.width, this.config.height);
    this.instance.setPixelRatio(this.config.pixelRatio);

    // Post process
    this.postProcess.composer.setSize(this.config.width, this.config.height);
    this.postProcess.composer.setPixelRatio(this.config.pixelRatio);

    this.postProcess.effectFXAA.uniforms["resolution"].value.set(
      1 / this.config.width,
      1 / this.config.height
    );
  }

  update() {
    if (this.stats) {
      this.stats.beforeRender();
    }

    if (this.usePostprocess) {
      this.postProcess.composer.render();
    } else {
      this.instance.render(this.scene, this.camera.instance);
    }

    if (this.stats) {
      this.stats.afterRender();
    }
  }

  destroy() {
    this.instance.renderLists.dispose();
    this.instance.dispose();
    this.renderTarget.dispose();
    this.postProcess.composer.renderTarget1.dispose();
    this.postProcess.composer.renderTarget2.dispose();
  }
}
