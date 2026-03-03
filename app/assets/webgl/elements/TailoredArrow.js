import * as THREE from "three"
import WebGL from "../WebGL"
import ResizeManager from "resize-manager"
import RafManager from "raf-manager"

import { createTimeline, stagger } from "animejs"
import RAFManager from "../utils/RafManager"

const defaultColor = 0xfa520f

export default class TailoredArrow {
  constructor(element, color = defaultColor) {
    this.element = element
    this.color = color
    this.webgl = new WebGL()
    this.rotationDirection = 0

    this.initArrow()
    this.resize()

    this._resize = this.resize.bind(this)
    this._update = this.update.bind(this)
    ResizeManager.add(this._resize)
    RafManager.add(this._update)
  }

  initArrow() {
    this.groupArrow = new THREE.Group()
    this.webgl.world.add(this.groupArrow)

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({
      color: this.color,
      roughness: 0.5,
    })
    const positions = [
      [-2.5, 0, 0],
      [-1.5, 0, 0],
      [-0.5, 0, 0],
      [0.5, 0, 0],
      [0.5, -2, 0],
      [1.5, -1, 0],
      [2.5, 0, 0],
      [1.5, 1, 0],
      [0.5, 2, 0],
    ]
    this.cubes = positions.map((pos) => {
      const cube = new THREE.Mesh(geometry, material)
      cube.scale.set(0)
      cube.position.set(...pos)
      this.groupArrow.add(cube)
      return cube
    })

    this.light = new THREE.PointLight(0xffffff, 0.05, 0.2)
    this.lightHelper = new THREE.PointLightHelper(this.light, 50)
    this.webgl.world.add(this.light, this.lightHelper)
  }

  resize() {
    const iconRect = this.element.getBoundingClientRect()
    this.groupArrow.position.set(
      iconRect.left + iconRect.width / 2 + window.scrollX,
      -iconRect.top - iconRect.height / 2 - window.scrollY,
      0,
    )

    const maxDim = Math.max(iconRect.width, iconRect.height) / 10
    this.groupArrow.scale.set(maxDim, maxDim, maxDim)

    this.light.position
      .copy(this.groupArrow.position)
      .add(new THREE.Vector3(50, 80, 100))
  }

  update() {
    this.groupArrow.rotation.y =
      Math.cos(RAFManager.timer * 0.0075) * 0.2 * this.rotationDirection
    this.groupArrow.rotation.x =
      Math.sin(RAFManager.timer * 0.01) * 0.2 * this.rotationDirection
  }

  animateIn() {
    const DEG = Math.PI / 180
    this.groupArrow.rotation.set(-25 * DEG, -25 * DEG, 0)

    const tl = createTimeline()

    tl.add(
      this.cubes.map((c) => c.scale),
      {
        x: [0, 1],
        y: [0, 1],
        z: [0, 1],
        duration: 600,
        ease: "out(4)",
        delay: stagger(50),
      },
      0,
    )

      .add(
        this.groupArrow.position,
        {
          x: [this.groupArrow.position.x - 30, this.groupArrow.position.x],
          duration: 1500,
          ease: "outBack(1.2)",
        },
        0,
      )

      .add(
        this.groupArrow.rotation,
        {
          x: [Math.PI * 0.5, 0],
          y: [-Math.PI * 0.5, 0],
          duration: 1500,
          ease: "outBack(1.5)",
        },
        0,
      )

      .add(
        this,
        {
          rotationDirection: 1,
          duration: 2000,
          ease: "outSine",
        },
        "-=500",
      )
  }

  destroy() {
    ResizeManager.remove(this._resize)
    RafManager.remove(this._update)

    this.cubes.forEach((cube) => {
      cube.geometry.dispose()
      cube.material.dispose()
      this.groupArrow.remove(cube)
    })

    this.webgl.world.remove(this.light, this.lightHelper)
    this.webgl.world.remove(this.groupArrow)
  }
}
