<script setup lang="ts">
import { throttle } from 'throttle-debounce'
import RAFManager from '~/assets/webgl/utils/RafManager'

const SQUARE_SIZE = 60
const heroRef = ref<HTMLElement | null>(null)

// ──────────────────────────────────────────
// Grid squares (random toggle animation)
// ──────────────────────────────────────────

interface GridSquare {
  id: number
  x: number
  y: number
  visible: boolean
}

const gridSquares = reactive<GridSquare[]>([])
const visibleSquares = computed(() => gridSquares.filter(s => s.visible))

let gridIdCounter = 0
let gridTimerId: ReturnType<typeof setTimeout> | null = null

function randomGridPos() {
  const xMin = Math.ceil(window.innerWidth * 0.3 / SQUARE_SIZE)
  const xMax = Math.floor(window.innerWidth / SQUARE_SIZE) - 1
  const yMax = Math.floor(window.innerHeight / SQUARE_SIZE) - 1

  return {
    x: Math.floor(Math.random() * (xMax - xMin + 1)) + xMin,
    y: Math.floor(Math.random() * (yMax + 1)),
  }
}

function toggleRandom() {
  const idx = Math.floor(Math.random() * gridSquares.length)
  const square = gridSquares[idx]

  if (!square) return

  if (square.visible) {
    const visCount = gridSquares.filter(s => s.visible).length
    if (visCount > 1) {
      square.visible = false
    }
  } else {
    const pos = randomGridPos()
    square.x = pos.x
    square.y = pos.y
    square.visible = true
  }
}

function scheduleToggle() {
  gridTimerId = setTimeout(() => {
    toggleRandom()
    scheduleToggle()
  }, 400 + Math.random() * 800)
}

function initGridSquares() {
  for (let i = 0; i < 18; i++) {
    const pos = randomGridPos()
    gridSquares.push({ id: gridIdCounter++, ...pos, visible: true })
  }
  scheduleToggle()
}

function destroyGridSquares() {
  if (gridTimerId) clearTimeout(gridTimerId)
}

// ──────────────────────────────────────────
// Mouse squares (follow cursor)
// ──────────────────────────────────────────

const MOUSE_SQUARE_LIFETIME = 5000 // 5 seconds

interface MouseSquare {
  id: number
  x: number
  y: number
  date: Date
}

const mouseSquares = ref<MouseSquare[]>([])
let mouseIdCounter = 0

const onMouseMove = throttle(50, (e: MouseEvent) => {
  const rect = heroRef.value?.getBoundingClientRect()
  if (!rect) return

  const x = Math.floor((e.clientX - rect.left) / SQUARE_SIZE)
  const y = Math.floor((e.clientY - rect.top) / SQUARE_SIZE)

  mouseSquares.value.push({
    id: mouseIdCounter++,
    x,
    y,
    date: new Date(),
  })
})

function cleanupMouseSquares() {
  const now = Date.now()
  mouseSquares.value = mouseSquares.value.filter(
    s => now - s.date.getTime() < MOUSE_SQUARE_LIFETIME,
  )
}

function initMouseSquares() {
  heroRef.value?.addEventListener('mousemove', onMouseMove)
  RAFManager.add(cleanupMouseSquares)
}

function destroyMouseSquares() {
  heroRef.value?.removeEventListener('mousemove', onMouseMove)
  RAFManager.remove(cleanupMouseSquares)
}

// ──────────────────────────────────────────
// Lifecycle
// ──────────────────────────────────────────

onMounted(() => {
  initGridSquares()
  initMouseSquares()
})

onUnmounted(() => {
  destroyGridSquares()
  destroyMouseSquares()
})
</script>

<template>
  <section ref="heroRef" class="hero" :style="{ '--square-size': SQUARE_SIZE + 'px' }">
    <div class="hero__container">
      <div class="container__left">
        <h1 class="left__title">
          It starts with frontier science.
        </h1>

        <p class="left__description">
          State of the art models with cutting edge capabilities, from cloud to edge.
        </p>

        <UiButtonAnimated class="left__button">
          Contact sales
        </UiButtonAnimated>
      </div>
    </div>

    <div class="hero__background-grid" aria-hidden="true" role="presentation">
      <TransitionGroup name="square">
        <div v-for="square in visibleSquares" :key="square.id" class="background-grid__square"
          :style="{ '--pos-x': square.x, '--pos-y': square.y }" />
      </TransitionGroup>

      <TransitionGroup name="square">
        <div v-for="square in mouseSquares" :key="square.id" class="background-grid__square"
          :style="{ '--pos-x': square.x, '--pos-y': square.y }" />
      </TransitionGroup>
    </div>
  </section>
</template>

<style scoped lang="scss" src="./Hero.scss" />
