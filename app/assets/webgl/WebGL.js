import * as THREE from "three"
import RAFManager from "raf-manager"
import ResizeManager from "resize-manager"

THREE.ColorManagement.enabled = false

export const HEIGHT_OFFSET = 200
export default class WebGL {
  static instance

  constructor() {
    if (WebGL.instance) {
      return WebGL.instance
    }

    // Check WebGL support
    if (!this.checkWebGLSupport()) {
      console.warn("WebGL not supported, falling back to CSS-only version")
      alert("WebGL is not supported on your browser/device.")
      return null
    }

    WebGL.instance = this

    this.size = {
      width: window.innerWidth,
      height: window.innerHeight + HEIGHT_OFFSET,
    }

    this.initScene()
    this.initCamera()
    this.initRenderer()

    // keep bound references so we can remove listeners / RAF later
    this._update = this.update.bind(this)
    this._resize = this.resize.bind(this)

    RAFManager.add(this._update)
    ResizeManager.add(this._resize, 0)
  }

  checkWebGLSupport() {
    try {
      const canvas = document.createElement("canvas")
      return !!(window.WebGLRenderingContext && canvas.getContext("webgl"))
    } catch {
      return false
    }
  }

  initScene() {
    this.scene = new THREE.Scene()

    this.world = new THREE.Object3D()
    // this.world.position.y = HEIGHT_OFFSET / 2
    this.worldFixed = new THREE.Object3D()
    this.scene.add(this.world)
    this.scene.add(this.worldFixed)

    // init ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    this.scene.add(ambientLight)
  }
  initCamera() {
    this.camera = new THREE.OrthographicCamera(
      0,
      this.size.width,
      0,
      this.size.height,
      0.1,
      1000,
    )

    this.camera.position.z = 500
  }
  initRenderer() {
    const isLowPerformance = this.detectLowPerformance()

    this.canvas = document.querySelector("#webgl")
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !isLowPerformance,
      powerPreference: isLowPerformance ? "low-power" : "high-performance",
      alpha: true,
      logarithmicDepthBuffer: true,
    })
    this.renderer.setSize(this.size.width, this.size.height)
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isLowPerformance ? 1 : 2),
    )
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.NoToneMapping

    this.renderer.domElement.style.position = "fixed"
    this.renderer.domElement.style.top = `-${HEIGHT_OFFSET / 2}px`
    this.renderer.domElement.style.left = "0"
    this.renderer.domElement.style.pointerEvents = "none"
  }

  detectLowPerformance() {
    // Détection basique de device faible
    const memory = navigator.deviceMemory // GB de RAM (Chrome/Edge)
    const cores = navigator.hardwareConcurrency

    return (memory && memory <= 4) || (cores && cores <= 2)
  }

  setScrollY(scrollY) {
    this.camera.position.y = Math.round(-scrollY - HEIGHT_OFFSET / 2)
    this.worldFixed.position.y = Math.round(-scrollY - HEIGHT_OFFSET / 2)
  }

  update() {
    this.renderer.render(this.scene, this.camera)
  }

  resize() {
    this.camera.right = this.size.width = window.innerWidth
    this.camera.bottom = this.size.height = window.innerHeight + HEIGHT_OFFSET
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.size.width, this.size.height)
  }

  destroy() {
    RAFManager.remove(this._update)
    ResizeManager.remove(this._resize)

    // dispose renderer and remove DOM element
    if (this.renderer) {
      if (this.renderer.dispose) this.renderer.dispose()
      const el = this.renderer.domElement
      if (el && el.parentNode) el.parentNode.removeChild(el)
      this.renderer = null
    }

    WebGL.instance = null
  }
}
