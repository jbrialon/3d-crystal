import * as THREE from "three";

import Experience from "../Experience";
import Environment from "./Environment";
import Crystal from "./Crystal";
import Particles from "./Particles";
import EnergyField from "./EnergyField.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    // Options
    this.options = {
      pointB: new THREE.Vector3(0, 3, 0),
      revealAnimation: () => {
        this.revealAnimation();
      },
      hideAnimation: () => {
        this.hideAnimation();
      },
    };

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("World");

      this.debugFolder
        .add(this.options, "revealAnimation")
        .name("Reveal Animation");
      this.debugFolder
        .add(this.options, "hideAnimation")
        .name("Hide Animation");
    }

    // Wait for resources to be loaded
    this.resources.on("ready", () => {
      // Setup
      this.crystal = new Crystal();
      this.particles = new Particles();
      this.environment = new Environment();

      this.energyfieldOne = new EnergyField({
        pointA: new THREE.Vector3(0.3, -100, 0),
        pointB: this.options.pointB,
        controlPoint1: new THREE.Vector3(4, -4.0, -8),
        controlPoint2: new THREE.Vector3(6, 5.0, 5.0),
        particlesColor: "#73332c", // Default color
        uSpeed: 0.078,
        uPerlinMultiplier: 0.78,
        uPerlinFrequency: 2.0,
        uTimeFrequency: 0.3,
      });

      this.energyfieldTwo = new EnergyField({
        pointA: new THREE.Vector3(0.3, 100, 20),
        pointB: this.options.pointB,
        controlPoint1: new THREE.Vector3(0, -3.0, -15),
        controlPoint2: new THREE.Vector3(-8, 10.0, 4.0),
        particlesColor: "#73332c", // Default color
        uSpeed: 0.078,
        uPerlinMultiplier: 0.78,
        uPerlinFrequency: 2.0,
        uTimeFrequency: 0.3,
      });

      this.energyfieldThree = new EnergyField({
        pointA: new THREE.Vector3(0.3, -100, 20),
        pointB: this.options.pointB,
        controlPoint1: new THREE.Vector3(0, -3.0, 10),
        controlPoint2: new THREE.Vector3(8, 10.0, 4.0),
        particlesColor: "#73332c", // Default color
        uSpeed: 0.078,
        uPerlinMultiplier: 0.78,
        uPerlinFrequency: 2.0,
        uTimeFrequency: 0.3,
      });
    });
  }

  revealAnimation() {
    this.crystal.revealAnimation();
    this.particles.revealAnimation();
  }

  hideAnimation() {
    this.crystal.hideAnimation();
    this.particles.hideAnimation();
  }
  animationManager() {
    if (this.crystal) this.crystal.addAnimation();
  }

  update() {
    if (this.crystal) this.crystal.update();
    if (this.particles) this.particles.update();
    if (this.energyfieldOne) this.energyfieldOne.update();
    if (this.energyfieldTwo) this.energyfieldTwo.update();
    if (this.energyfieldThree) this.energyfieldThree.update();
  }
}
