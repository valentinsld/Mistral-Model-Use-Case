import * as THREE from "three"
import WebGL from "../WebGL"
import ResizeManager from "resize-manager"
import RafManager from "raf-manager"

import vertexShader from "../shaders/PlanevUv.vert"
import fragmentShader from "../shaders/ButtonAnimated.frag"
import { animate, createTimeline } from "animejs"

const defaultColors = {
  color1: 0xfa520f, // 0xe10500
  opacity1: 1,
  color2: 0xffe241,
  opacity2: 1,
}

export default class ButtonAnimated {
  constructor(element, colors = defaultColors) {
    this.element = element
    this.iconEl = this.element.querySelector(
      ".ui-button-animated__content .content__icon",
    )
    this.colors = { ...defaultColors, ...colors }
    this.webgl = new WebGL()

    this.animation = null
    this.baseScale = { x: 1, y: 1 }
    this.initPlane()
    this.initArrow()
    this.resize()

    this._resize = this.resize.bind(this)
    this._update = this.update.bind(this)
    this._onMouseEnter = this.onMouseEnter.bind(this)
    this._onMouseLeave = this.onMouseLeave.bind(this)
    ResizeManager.add(this._resize)
    RafManager.add(this._update)
    this.element.addEventListener("mouseenter", this._onMouseEnter)
    this.element.addEventListener("mouseleave", this._onMouseLeave)
  }

  initPlane() {
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

    this.webgl.world.add(this.plane)
  }

  initArrow() {
    if (!this.iconEl) return

    this.groupArrow = new THREE.Group()
    this.webgl.world.add(this.groupArrow)

    // create 5 cubes like the arrow cube
    // X - -
    // - X -
    // - - X
    // - X -
    // X - -

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xfffaeb })
    const positions = [
      [-1, -2, 0],
      [0, -1, 0],
      [1, 0, 0],
      [0, 1, 0],
      [-1, 2, 0],
    ]
    this.cubes = positions.map((pos) => {
      const cube = new THREE.Mesh(geometry, material)
      cube.position.set(...pos)
      this.groupArrow.add(cube)
      return cube
    })
  }

  resize() {
    // position plane
    this.plane.scale.set(this.element.offsetWidth, this.element.offsetHeight, 1)

    this.plane.position.set(
      this.element.offsetLeft + this.element.offsetWidth * 0.5,
      this.element.offsetTop + this.element.offsetHeight * 0.5,
      -10,
    )
    this.planeMaterial.uniforms.uPlaneWidth.value = this.element.offsetWidth
    this.planeMaterial.uniforms.uPlaneHeight.value = this.element.offsetHeight

    // position groupArrow
    if (this.groupArrow) {
      const iconRect = this.iconEl.getBoundingClientRect()
      this.groupArrow.position.set(
        iconRect.left + iconRect.width / 2,
        iconRect.top + iconRect.height / 2,
        0,
      )

      const maxDim = Math.max(iconRect.width, iconRect.height) / 4
      this.groupArrow.scale.set(maxDim, maxDim, maxDim)
    }
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

    if (this.groupArrow) {
      if (this.arrowTimeline) this.arrowTimeline.pause()
      this.arrowTimeline = createTimeline()
        .add(this.groupArrow.scale, {
          x: this.groupArrow.scale.x * 1.3,
          y: this.groupArrow.scale.y * 1.3,
          z: this.groupArrow.scale.z * 1.3,
          duration: 150,
          ease: "inOutQuad",
        })
        .add(this.groupArrow.scale, {
          x: this.groupArrow.scale.x,
          y: this.groupArrow.scale.y,
          z: this.groupArrow.scale.z,
          duration: 150,
          ease: "outBounce",
        })
        .add(
          this.groupArrow.rotation,
          {
            x: this.groupArrow.rotation.x + Math.PI,
            y: [0, this.groupArrow.rotation.y - Math.PI * 0.15, 0],
            duration: 600,
            ease: "inOutQuad",
          },
          0,
        )
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

  update() {
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
    this.webgl.world.remove(this.groupArrow)
    this.planeGeometry.dispose()
    this.planeMaterial.dispose()
  }
}
