import * as THREE from "three";
import gsap from "gsap";

import Experience from "../Experience.js";
import vertexShader from "../../shaders/EnergyField/vertex.glsl";
import fragmentShader from "../../shaders/EnergyField/fragment.glsl";

export default class EnergyField {
  constructor(options) {
    this.experience = new Experience();
    this.options = options;
    this.config = this.experience.config;
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;
    this.sound = this.experience.world.sound;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.timeline = this.experience.timeline;

    this.count = 2000;

    this.setPositions();
    this.setGeometry();
    this.setMaterial();
    this.setPoints();

    this.setDebug();
  }

  reset() {
    this.geometry.dispose();

    this.setPositions();
    this.setGeometry();

    this.points.geometry = this.geometry;
  }

  setPositions() {
    this.positions = new Float32Array(this.count * 3);

    let i = 0;

    for (; i < this.count; i++) {
      const azimuthalAngle = Math.random() * Math.PI * 2;
      const polarAngle = Math.acos(2 * Math.random() - 1);

      const radius = Math.cbrt(Math.random()) * 0.7;

      this.positions[i * 3 + 0] =
        Math.sin(polarAngle) * Math.cos(azimuthalAngle) * radius +
        Math.random() * 0.2;
      this.positions[i * 3 + 1] =
        Math.sin(polarAngle) * Math.sin(azimuthalAngle) * radius +
        Math.random() * 0.2;
      this.positions[i * 3 + 2] =
        Math.cos(polarAngle) * radius + Math.random() * 0.2;
    }
  }

  setGeometry() {
    const sizes = new Float32Array(this.count);
    const startTime = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      sizes[i] = 0.2 + Math.random() * 0.8;
      startTime[i] = Math.random();
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3)
    );
    this.geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    this.geometry.setAttribute(
      "aStartTime",
      new THREE.BufferAttribute(startTime, 1)
    );
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 100 },
        uSeed: { value: Math.random() },
        uOpacity: { value: 0.5 },
        uColor: { value: new THREE.Color(this.options.particlesColor) },

        uSpeed: { value: this.options.uSpeed },
        uPerlinMultiplier: { value: this.options.uPerlinMultiplier },
        uPerlinFrequency: { value: this.options.uPerlinFrequency },
        uTimeFrequency: { value: this.options.uTimeFrequency },

        uPointA: { value: this.options.pointA },
        uPointB: { value: this.options.pointB },
        uControlPoint1: { value: this.options.controlPoint1 },
        uControlPoint2: { value: this.options.controlPoint2 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
  }

  setPoints() {
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
    this.scene.add(this.points);
  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Flows");

      this.debugFolder
        .add(this.material.uniforms.uSpeed, "value")
        .min(0.001)
        .max(1)
        .step(0.001)
        .name("uSpeed");
      this.debugFolder
        .add(this.material.uniforms.uPerlinMultiplier, "value")
        .max(5)
        .step(0.001)
        .name("uPerlinMultiplier");
      this.debugFolder
        .add(this.material.uniforms.uPerlinFrequency, "value")
        .min(0.001)
        .max(5)
        .step(0.001)
        .name("uPerlinFrequency");
      this.debugFolder
        .add(this.material.uniforms.uTimeFrequency, "value")
        .min(0.001)
        .max(5)
        .step(0.001)
        .name("uTimeFrequency");
    }
  }

  update() {
    this.material.uniforms.uTime.value = this.time.elapsedTime;
  }
}
