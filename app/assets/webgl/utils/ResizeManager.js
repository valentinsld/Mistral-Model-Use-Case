class ResizeManager {
  constructor() {
    this.callbacks = new Map()
    this.isListening = false
    this.resizeHandler = this.handleResize.bind(this)
    this.throttleTimeout = null
    this.throttleDelay = 10 // ms
  }

  /**
   * Ajoute une fonction à appeler lors du resize
   * @param {Function} callback - La fonction à exécuter
   * @param {Number} priority - La priorité (0 à 5, 0 étant la plus haute priorité)
   */
  add(callback, priority = 5) {
    if (typeof callback !== "function") {
      console.warn("ResizeManager: callback must be a function")
      return
    }

    // Clamp priority entre 0 et 5
    const clampedPriority = Math.max(0, Math.min(5, priority))

    this.callbacks.set(callback, clampedPriority)

    // Démarre l'écoute si ce n'est pas déjà fait
    if (!this.isListening) {
      this.startListening()
    }
  }

  /**
   * Retire une fonction de la liste
   * @param {Function} callback - La fonction à retirer
   */
  remove(callback) {
    this.callbacks.delete(callback)

    // Arrête l'écoute si plus aucune callback
    if (this.callbacks.size === 0 && this.isListening) {
      this.stopListening()
    }
  }

  /**
   * Relance toutes les fonctions enregistrées
   */
  reload() {
    this.executeCallbacks()
  }

  /**
   * Gère l'événement resize avec throttle
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
   * Exécute toutes les callbacks par ordre de priorité
   */
  executeCallbacks() {
    // Trie les callbacks par priorité (0 = plus haute priorité)
    const sortedCallbacks = Array.from(this.callbacks.entries()).sort(
      (a, b) => a[1] - b[1]
    )

    // Exécute chaque callback
    sortedCallbacks.forEach(([callback]) => {
      try {
        callback()
      } catch (error) {
        console.error("ResizeManager: Error executing callback", error)
      }
    })
  }

  /**
   * Démarre l'écoute de l'événement resize
   */
  startListening() {
    window.addEventListener("resize", this.resizeHandler)
    this.isListening = true
  }

  /**
   * Arrête l'écoute de l'événement resize
   */
  stopListening() {
    window.removeEventListener("resize", this.resizeHandler)
    this.isListening = false
  }

  /**
   * Nettoie toutes les références
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
