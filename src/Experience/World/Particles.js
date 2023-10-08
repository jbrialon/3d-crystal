import * as THREE from "three";
import { gsap } from "gsap";

import Experience from "../Experience";

import vertexShader from "../../shaders/Particles/vertex.glsl";
import fragmentShader from "../../shaders/Particles/fragment.glsl";

export default class Particles {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    // Options
    this.options = {
      particlesCount: 200,
      particlesColor: "#73332c", // Default color
      particlesOpacity: 1,
      revealAnimation: () => {
        this.revealAnimation();
      },
    };

    // Setup
    this.setGeometry();
    this.setMaterial();
    this.setPoints();
    this.setDebug();
  }

  setGeometry() {
    this.geometry = new THREE.BufferGeometry();

    this.positionArray = new Float32Array(this.options.particlesCount * 3);
    this.scaleArray = new Float32Array(this.options.particlesCount * 1);

    for (let i = 0; i < this.options.particlesCount; i++) {
      this.positionArray[i * 3 + 0] = (Math.random() - 0.5) * 3;
      this.positionArray[i * 3 + 1] = (Math.random() - 0.5) * 5 + 8;
      this.positionArray[i * 3 + 2] = (Math.random() - 0.5) * 3;

      this.scaleArray[i] = Math.random();
    }

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positionArray, 3)
    );
    this.geometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(this.scaleArray, 1)
    );
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uOpacity: { value: this.options.particlesOpacity },
        uColor: { value: new THREE.Color(this.options.particlesColor) },
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 100 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
  }

  setPoints() {
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.position.y = -5;
    this.scene.add(this.points);
  }

  revealAnimation() {
    gsap.to(this.material.uniforms.uOpacity, {
      value: 1,
      duration: 2,
      delay: 3,
    });
  }

  hideAnimation() {
    gsap.to(this.material.uniforms.uOpacity, {
      value: 0,
      duration: 2,
    });
  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Particles");

      this.debugFolder
        .add(this.options, "revealAnimation")
        .name("Reveal Particles Animation");
      this.debugFolder.addColor(this.options, "particlesColor").onChange(() => {
        this.material.uniforms.uColor.value.set(this.options.particlesColor);
      });
      this.debugFolder
        .add(this.material.uniforms.uOpacity, "value")
        .min(0)
        .max(1);
    }
  }

  update() {
    this.material.uniforms.uTime.value = this.time.elapsedTime;
  }
}
