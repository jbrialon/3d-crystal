import Experience from "../Experience";
import Environment from "./Environment";
import Crystal from "./Crystal";
import Particles from "./Particles";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    // Options
    this.options = {
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

  update() {
    if (this.crystal) this.crystal.update();
    if (this.particles) this.particles.update();
  }
}
