import * as THREE from "three";
import Environment from "./Environment.js";
import Experience from "../Experience.js";
import Factory from "./Factory";
import CompJoystick from "./CompJoystick";
import Curtains from "./Curtains";
import FormArm from "./FormArm";
import IcingButtons from "./IcingButtons";
import MixerSwitch from "./MixerSwitch";
import OvenMeters from "./OvenMeters";
import SprinklesSwitch from "./SprinklesSwitch";
import SprinklesTanks from "./SprinklesTanks";
import Glasses from "./Glasses";
import IcingCables from "./IcingCables";
import MixerLight from "./MixerLight";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setLoadingScreen();

    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.setFactory();
        this.setCompJoystick();
        this.setCurtains();
        this.setFormArm();
        this.setIcingButtons();
        this.setMixerSwitch();
        this.setOvenMeters();
        this.setSprinklesSwitch();
        this.setSprinklesTanks();
        this.setGlasses();
        this.setIcingCables();
        this.setMixerLight();
        this.setEnvironment();
      }
    });
  }

  setLoadingScreen() {
    this.loadingScreen = document.querySelector(".loading");
    this.resources.on("end", () => {
      this.loadingScreen.classList.add("ended");
    });
  }

  setEnvironment() {
    this.environment = new Environment();
  }
  setFactory() {
    this.factory = new Factory();
  }
  setCompJoystick() {
    this.compJoystick = new CompJoystick();
  }
  setCurtains() {
    this.curtains = new Curtains();
  }
  setFormArm() {
    this.formArm = new FormArm();
  }
  setIcingButtons() {
    this.icingButtons = new IcingButtons();
  }
  setMixerSwitch() {
    this.mixerSwitch = new MixerSwitch();
  }
  setOvenMeters() {
    this.ovenMeters = new OvenMeters();
  }
  setSprinklesSwitch() {
    this.sprinklesSwitch = new SprinklesSwitch();
  }
  setSprinklesTanks() {
    this.sprinklesTanks = new SprinklesTanks();
  }
  setGlasses() {
    this.glasses = new Glasses();
  }
  setIcingCables() {
    this.icingCables = new IcingCables();
  }
  setMixerLight() {
    this.mixerLight = new MixerLight();
  }

  resize() {}

  update() {
    if (this.factory) this.factory.update();
    if (this.compJoystick) this.compJoystick.update();
    if (this.curtains) this.curtains.update();
    if (this.formArm) this.formArm.update();
    if (this.icingButtons) this.icingButtons.update();
    if (this.mixerSwitch) this.mixerSwitch.update();
    if (this.ovenMeters) this.ovenMeters.update();
    if (this.sprinklesSwitch) this.sprinklesSwitch.update();
    if (this.sprinklesTanks) this.sprinklesTanks.update();
  }

  destroy() {}
}
