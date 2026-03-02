import * as THREE from "three"
import WebGL from "../WebGL"
import ResizeManager from "resize-manager"
import RafManager from "raf-manager"

import vertexShader from "../shaders/PlanevUv.vert"
import fragmentShader from "../shaders/ButtonAnimated.frag"
import { animate } from "animejs"

const defaultColors = {
  color1: 0xfa520f, // 0xe10500
  opacity1: 1,
  color2: 0xffe241,
  opacity2: 1,
}

export default class ButtonAnimated {
  constructor(element, colors = defaultColors) {
    this.element = element
    this.colors = { ...defaultColors, ...colors }
    this.webgl = new WebGL()

    this.animation = null
    this.baseScale = { x: 1, y: 1 }
    this.init()

    this._resize = this.resize.bind(this)
    this._update = this.update.bind(this)
    this._onMouseEnter = this.onMouseEnter.bind(this)
    this._onMouseLeave = this.onMouseLeave.bind(this)
    ResizeManager.add(this._resize)
    RafManager.add(this._update)
    this.element.addEventListener("mouseenter", this._onMouseEnter)
    this.element.addEventListener("mouseleave", this._onMouseLeave)
  }

  init() {
    this.planeGeometry = new THREE.PlaneGeometry(1, 1)
    this.planeMaterial = new THREE.RawShaderMaterial({
      side: THREE.BackSide,
      transparent: true,
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor1: { value: new THREE.Color(this.colors.color1) },
        uColor2: { value: new THREE.Color(this.colors.color2) },
        uTime: { value: 0 },
        uPlaneWidth: { value: 0 },
        uPlaneHeight: { value: 0 },
        uPixelSize: { value: 20.0 },
      },
    })
    this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial)

    this.resize()

    this.appear()
  }

  appear() {
    this.webgl.world.add(this.plane)
  }

  resize() {
    this.plane.scale.set(this.element.offsetWidth, this.element.offsetHeight, 1)

    this.plane.position.set(
      this.element.offsetLeft + this.element.offsetWidth * 0.5,
      this.element.offsetTop + this.element.offsetHeight * 0.5,
      -10,
    )
    this.planeMaterial.uniforms.uPlaneWidth.value = this.element.offsetWidth
    this.planeMaterial.uniforms.uPlaneHeight.value = this.element.offsetHeight
  }

  onMouseEnter() {
    if (this.hoverAnimation) {
      this.hoverAnimation.reverse()
    } else {
      this.hoverAnimation = animate(this.baseScale, {
        x: 1.05,
        y: 1.05,
        duration: 400,
        ease: "outBack(0.75)",
        onComplete: () => {
          this.hoverAnimation = null
        },
      })
    }
  }

  onMouseLeave() {
    if (this.hoverAnimation) {
      this.hoverAnimation.reverse()
    } else {
      this.hoverAnimation = animate(this.baseScale, {
        x: 1,
        y: 1,
        duration: 400,
        ease: "outBack(0.75)",
        onComplete: () => {
          this.hoverAnimation = null
        },
      })
    }
  }

  update(delta) {
    this.planeMaterial.uniforms.uTime.value = RafManager.timer * 0.002

    this.plane.scale.set(
      this.element.offsetWidth * this.baseScale.x,
      this.element.offsetHeight * this.baseScale.y,
      1,
    )
  }

  destroy() {
    ResizeManager.remove(this._resize)
    RafManager.remove(this._update)
    this.element.removeEventListener("mouseenter", this._onMouseEnter)
    this.element.removeEventListener("mouseleave", this._onMouseLeave)

    this.webgl.world.remove(this.plane)
    this.planeGeometry.dispose()
    this.planeMaterial.dispose()
  }
}
