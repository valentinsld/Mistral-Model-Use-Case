class ResizeManager {
  constructor() {
    this.callbacks = new Map()
    this.isListening = false
    this.resizeHandler = this.handleResize.bind(this)
    this.throttleTimeout = null
    this.throttleDelay = 10 // ms
  }

  /**
   * Add a function to be called on resize
   * @param {Function} callback - Function to execute
   * @param {Number} priority - Priority (0 to 5, 0 is highest priority)
   */
  add(callback, priority = 5) {
    if (typeof callback !== "function") {
      console.warn("ResizeManager: callback must be a function")
      return
    }

    // Clamp priority between 0 and 5
    const clampedPriority = Math.max(0, Math.min(5, priority))

    this.callbacks.set(callback, clampedPriority)

    // Start listening if not already started
    if (!this.isListening) {
      this.startListening()
    }
  }

  /**
   * Remove a function from the list
   * @param {Function} callback - The function to remove
   */
  remove(callback) {
    this.callbacks.delete(callback)

    // Stop listening if no callbacks remain
    if (this.callbacks.size === 0 && this.isListening) {
      this.stopListening()
    }
  }

  /**
   * Re-run all registered functions
   */
  reload() {
    this.executeCallbacks()
  }

  /**
   * Handle resize event with throttle
   */
  handleResize() {
    if (this.throttleTimeout) {
      return
    }

    this.throttleTimeout = setTimeout(() => {
      this.executeCallbacks()
      this.throttleTimeout = null
    }, this.throttleDelay)
  }

  /**
   * Execute all callbacks by priority order
   */
  executeCallbacks() {
    // Sort callbacks by priority (0 = highest priority)
    const sortedCallbacks = Array.from(this.callbacks.entries()).sort(
      (a, b) => a[1] - b[1],
    )

    // Execute each callback
    sortedCallbacks.forEach(([callback]) => {
      try {
        callback()
      } catch (error) {
        console.error("ResizeManager: Error executing callback", error)
      }
    })
  }

  /**
   * Start listening to the resize event
   */
  startListening() {
    window.addEventListener("resize", this.resizeHandler)
    this.isListening = true
  }

  /**
   * Stop listening to the resize event
   */
  stopListening() {
    window.removeEventListener("resize", this.resizeHandler)
    this.isListening = false
  }

  /**
   * Clean up all references
   */
  destroy() {
    if (this.throttleTimeout) {
      clearTimeout(this.throttleTimeout)
      this.throttleTimeout = null
    }
    this.stopListening()
    this.callbacks.clear()
  }
}

// Export singleton
export default new ResizeManager()
