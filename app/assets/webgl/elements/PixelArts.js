import * as THREE from "three"
import WebGL, { HEIGHT_OFFSET } from "../WebGL"
import ResizeManager from "resize-manager"

import { createTimeline } from "animejs"

const GRID_SIZE = 21
const INSTANCE_COUNT = GRID_SIZE * GRID_SIZE
const INIT_COLOR = 0xffffff

export default class PixelArts {
  constructor(listPixelArts) {
    this.listPixelArts = listPixelArts
    this.webgl = new WebGL()

    this.init()
    this.resize()

    this._resize = this.resize.bind(this)
    ResizeManager.add(this._resize)
  }

  init() {
    this.pixelArtsGlobal = new THREE.Group()
    this.pixelArtsGlobal.name = "pixelArtsGlobal"

    const material = new THREE.MeshBasicMaterial({
      color: INIT_COLOR,
      // vertexColors: true,
    })
    this.instanceMesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      material,
      INSTANCE_COUNT,
    )
    this.instanceMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

    this.scaleMultipliers = []
    this.instancePositions = []
    this.dummy = new THREE.Object3D()

    // Initialize all colors to INIT_COLOR and scale multiplier to 0
    const initColor = new THREE.Color(INIT_COLOR)
    for (let i = 0; i < INSTANCE_COUNT; i++) {
      this.scaleMultipliers.push({ value: 0 })
      this.instancePositions.push({ x: 0, y: 0, z: 0 })
      this.instanceMesh.setColorAt(i, initColor)
    }

    this.instanceMesh.needsUpdate = true

    this.pixelArtsGlobal.add(this.instanceMesh)
    this.webgl.worldFixed.add(this.pixelArtsGlobal)
  }

  out() {
    if (this.currentAnimation) {
      this.currentAnimation.pause()
    }

    const tl = createTimeline()

    tl.add(
      this.scaleMultipliers,
      {
        value: 0,
        duration: 300,
        easing: "easeInOutQuad",
        onUpdate: () => {
          this.updateInstanceMatrices(false)
        },
      },
      0,
    )

    tl.add(
      this.pixelArtsGlobal.rotation,
      {
        y: Math.PI * 0.5,
        duration: 300,
        easing: "easeInOutQuad",
      },
      0, // Start at the beginning
    )

    this.currentAnimation = tl
  }

  setPixelArt(index) {
    const pixelArt = this.listPixelArts[index]
    if (!pixelArt) {
      console.warn(`Pixel art at index ${index} not found.`)
      return
    }

    if (this.currentAnimation) {
      this.currentAnimation.pause()
    }

    const tl = createTimeline()

    // Animation 1: Fade out all cubes to scale 0
    tl.add(
      this.scaleMultipliers,
      {
        value: 0,
        duration: 300,
        easing: "easeInOutQuad",
        onUpdate: () => {
          this.updateInstanceMatrices(false)
        },
      },
      0,
    )

    tl.add(
      this.pixelArtsGlobal.rotation,
      {
        y: Math.PI * 0.5,
        duration: 300,
        easing: "easeInOutQuad",
      },
      0, // Start at the beginning
    )

    // Animation 2: Fade in only active cubes (colors applied early, invisible during phase 1 since scale=0)
    tl.add(
      this.scaleMultipliers,
      {
        value: (el, i) => {
          return Boolean(
            pixelArt.array[Math.floor(i / GRID_SIZE)][i % GRID_SIZE],
          )
            ? 1
            : 0
        },
        duration: 400,
        easing: "easeOutElastic(1, 0.6)",
        onBegin: () => {
          const activeIndices = this.applyPixelArtColors(pixelArt)
        },
        onUpdate: () => {
          this.updateInstanceMatrices(false)
        },
      },
      300,
    )

    // Rotate the global group
    tl.add(
      this.pixelArtsGlobal.rotation,
      {
        y: [Math.PI * 1.5, Math.PI * 2],
        duration: 400,
        easing: "easeOutBack(1.22)",
        onComplete: () => {
          // Reset rotation to 0 after completing the full spin to avoid overflow issues
          this.pixelArtsGlobal.rotation.y = 0
        },
      },
      300,
    )

    this.currentAnimation = tl
  }

  applyPixelArtColors(pixelArt) {
    const offsetX = Math.floor((GRID_SIZE - pixelArt.size.x) / 2)
    const offsetY = Math.floor((GRID_SIZE - pixelArt.size.y) / 2)
    const activeIndices = []
    const initColor = new THREE.Color(INIT_COLOR)

    // Reset all colors to INIT_COLOR (but don't touch scales - animation handles that)
    for (let i = 0; i < INSTANCE_COUNT; i++) {
      this.instanceMesh.setColorAt(i, initColor)
    }

    // Apply pixel art colors
    for (let row = 0; row < pixelArt.size.y; row++) {
      for (let col = 0; col < pixelArt.size.x; col++) {
        const key = pixelArt.array[row][col]
        if (key && pixelArt.colors[key]) {
          const gridRow = offsetY + row
          const gridCol = offsetX + col
          const index = gridRow * GRID_SIZE + gridCol

          this.instanceMesh.setColorAt(
            index,
            new THREE.Color(pixelArt.colors[key]),
          )
          activeIndices.push(index)
        }
      }
    }

    this.instanceMesh.instanceColor.needsUpdate = true
    return activeIndices
  }

  updateInstanceMatrices(recalcPositions = true) {
    if (!this.cubeSize) return

    const halfGrid = (GRID_SIZE - 1) / 2

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const index = row * GRID_SIZE + col

        if (recalcPositions) {
          const x = (col - halfGrid) * this.cubeSize
          const y = (row - halfGrid) * this.cubeSize
          this.instancePositions[index].x = x
          this.instancePositions[index].y = y
          this.instancePositions[index].z = 0
        }

        const scale = this.cubeSize * this.scaleMultipliers[index].value

        this.dummy.position.set(
          this.instancePositions[index].x,
          this.instancePositions[index].y,
          this.instancePositions[index].z,
        )
        this.dummy.scale.set(scale, scale, scale)
        this.dummy.rotation.set(0, 0, 0)
        this.dummy.updateMatrix()
        this.instanceMesh.setMatrixAt(index, this.dummy.matrix)
      }
    }

    this.instanceMesh.instanceMatrix.needsUpdate = true
  }

  resize() {
    this.size = window.innerWidth * 0.3
    this.cubeSize = this.size / GRID_SIZE

    this.updateInstanceMatrices(true)

    this.pixelArtsGlobal.position.set(
      window.innerHeight / 4 + this.size / 4,
      window.innerHeight / 4 + this.size / 3 + HEIGHT_OFFSET,
      0,
    )
  }

  destroy() {
    ResizeManager.remove(this._resize)

    if (this.currentAnimation) {
      this.currentAnimation.pause()
      this.currentAnimation = null
    }

    if (this.pixelArtsGlobal) {
      this.pixelArtsGlobal.remove(this.instanceMesh)
      this.webgl.worldFixed.remove(this.pixelArtsGlobal)
    }

    if (this.instanceMesh) {
      this.instanceMesh.geometry.dispose()
      this.instanceMesh.material.dispose()
    }
    this.dummy = null
    this.instancePositions = null
    this.scaleMultipliers = null
    this.instanceMesh = null
    this.pixelArtsGlobal = null
  }
}
