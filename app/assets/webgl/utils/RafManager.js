/**
 *  RAFManager requestAnimationFrame Manager
 *
 *  Simple package from here :
 *  https://github.com/drawcall/RAFManager/blob/master/src/RAFManager.js
 *
 *  CODE:
 *
 * 		// Add to
 *  	-- RAFManager.add("name", func);
 *
 *   	// Add and carry parameters
 *  	-- const func = data =>{ console.log(data) };
 *  	-- RAFManager.add("name", func, { msg:'hello world!' });
 *
 * 		// remove
 *  	-- RAFManager.remove("name");
 *  	-- RAFManager.stop();
 */

import Stats from "stats.js"

// simple polyfill by https://gist.github.com/paulirish/1579671
// (function () {
// 	let lastTime = 0;
// 	let vendors = ['ms', 'moz', 'webkit', 'o'];
// 	for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
// 		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
// 		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
// 			|| window[vendors[x] + 'CancelRequestAnimationFrame'];
// 	}
// }());

const RAFManager = {
  timer: 0,
  state: "stop",
  animations: [],
  paused: false,
  immediate: true,
  stats: null,

  add(callback, fps = 60, param = null) {
    const n = 60 / fps
    const aniData = { callback, fps, n, param, i: 0 }
    this.animations.push(aniData)
    if (this.immediate && this.animations.length >= 1) this.start()

    return this
  },

  // Initialise et affiche les stats de performance
  initStats() {
    if (this.stats) return this // Évite de recréer

    this.stats = new Stats()
    this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb
    document.body.appendChild(this.stats.dom)

    return this
  },

  getIndex(callback) {
    for (let i = 0; i < this.animations.length; i++) {
      const aniData = this.animations[i]
      if (aniData.callback === callback) return i
    }

    return -1
  },

  remove(callback) {
    const index = this.getIndex(callback)
    if (index < 0) return

    this.deleteMap(callback)
    if (this.immediate && this.animations.length === 0) this.stop()

    return this
  },

  deleteMap(callback) {
    const index = this.getIndex(callback)
    const aniData = this.animations[index]
    for (let key in aniData) delete aniData[key]

    this.animations.splice(index, 1)
  },

  start() {
    if (this.state === "start") return

    this.state = "start"
    this.tick()
    return this
  },

  stop() {
    if (this.state === "stop") return

    this.state = "stop"
    cancelAnimationFrame(this.timer)
    return this
  },

  pause() {
    if (this.state !== "start" || this.paused) return
    this.paused = true
    return this
  },

  resume() {
    if (this.state !== "start" || !this.paused) return
    this.paused = false
    return this
  },

  tick() {
    this.timer = requestAnimationFrame(() => {
      this.tick()
    })

    if (this.paused) return
    this.stats?.begin()
    for (let i = 0; i < this.animations.length; i++) {
      const aniData = this.animations[i]
      const callback = aniData.callback
      const param = aniData.param

      aniData.i++
      if (aniData.i >= aniData.n) {
        callback(param)
        aniData.i = 0
      }
    }
    this.stats?.end()
  },
}

export default RAFManager
