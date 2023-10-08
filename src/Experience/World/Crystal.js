import * as THREE from "three";
import { gsap } from "gsap";

import Experience from "../Experience";

export default class Crystal {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.resources = this.experience.resources;

    this.parentObject = new THREE.Group();
    this.material = null;

    this.hasRevealAnimationEnded = false;

    // Options
    this.options = {
      rotationSpeed: 0.01,
      hoverAmplitude: 0.1,
      hoverSpeed: 0.002,
      revealAnimation: () => {
        this.revealAnimation();
      },
      hideAnimation: () => {
        this.hideAnimation();
      },
    };

    // Setup
    this.resource = this.resources.items.crystalModel;

    this.setDebug();

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resource.scene;

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (!this.material) {
          this.material = child.material;
        }
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.material.transparent = true;

    // this.parentObject.position.y = 10;
    this.parentObject.add(this.model);
    this.scene.add(this.parentObject);
  }

  resetInitialState() {
    this.parentObject.position.set(this.initialPosition);
    gsap.set(this.parentObject.position, { y: 10 });
    gsap.set(this.material, { opacity: 1 });
  }

  revealAnimation() {
    gsap.set(this.material, { opacity: 1 });
    gsap.set(this.parentObject.position, { y: 10 });
    gsap.set(this.parentObject.position, { z: 0 });
    gsap.to(this.parentObject.position, {
      y: 0,
      duration: 3,
      ease: "Power1.easeInOut",
      onComplete: () => {
        this.hasRevealAnimationEnded = true;
      },
    });
  }

  hideAnimation() {
    const timeline = gsap.timeline({
      onComplete: () => {
        // console.log("HideAnimationComplete");
      },
    });
    // Add animations to the timeline
    timeline
      .to(this.material, {
        opacity: 0,
        duration: 2,
        ease: "Power1.easeInOut",
      })
      .to(
        this.parentObject.position,
        {
          z: -2,
          duration: 2,
          ease: "Power1.easeInOut",
        },
        "-=2"
      ); // Offset the position animation by -2 seconds relative to the previous animation
  }

  addAnimation() {}

  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);

    const smallRockOne = this.animation.mixer.clipAction(
      this.resource.animations[0]
    );

    const smallRockTwo = this.animation.mixer.clipAction(
      this.resource.animations[1]
    );
    const smallRockThree = this.animation.mixer.clipAction(
      this.resource.animations[2]
    );

    smallRockOne.play();
    smallRockTwo.play();
    smallRockThree.play();
  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Crystal");

      // Animation
      this.debugFolder
        .add(this.options, "revealAnimation")
        .name("Reveal Crytsal Animation");
      this.debugFolder
        .add(this.options, "hideAnimation")
        .name("Hide Crytsal Animation");

      // Crystal
      this.debugFolder
        .add(this.options, "rotationSpeed")
        .name("Rotation Speed");
      this.debugFolder
        .add(this.options, "hoverAmplitude")
        .name("Hover Amplitude")
        .min(0.001)
        .max(0.4);
      this.debugFolder
        .add(this.options, "hoverSpeed")
        .name("Hover Speed")
        .min(0.001)
        .max(0.01);
    }
  }

  update() {
    // Crystal animation
    this.animation.mixer.update(this.time.delta * 0.001);
    // Rotate the model on the z-axis
    this.model.rotation.y += this.options.rotationSpeed;
    if (this.hasRevealAnimationEnded) {
      this.model.position.y =
        Math.sin(this.time.elapsed * this.options.hoverSpeed) *
        this.options.hoverAmplitude;
    }
  }
}
