<script setup lang="ts">
import { throttle } from 'throttle-debounce'
import RAFManager from '~/assets/webgl/utils/RafManager'
import modelsList from '~/datas/modelsList'

const modelImages = import.meta.glob<{ default: string }>('~/assets/images/models/*.svg', { eager: true })

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
// Model squares (2×2 model labels on grid)
// ──────────────────────────────────────────

const MODEL_SQUARE_SIZE = 2 // each model occupies 2×2 grid cells

// Fixed positions in percentage of the hero area (one per model)
const modelPositions: { xPercent: number, yPercent: number }[] = [
  { xPercent: 10, yPercent: 15 },
  { xPercent: 75, yPercent: 12 },
  { xPercent: 90, yPercent: 30 },
  { xPercent: 15, yPercent: 40 },
  { xPercent: 70, yPercent: 40 },
  { xPercent: 95, yPercent: 60 },
  { xPercent: 8, yPercent: 75 },
  { xPercent: 30, yPercent: 90 },
  { xPercent: 65, yPercent: 95 },
  { xPercent: 85, yPercent: 85 },
  { xPercent: 45, yPercent: 15 },
]

interface ModelDisplay {
  x: number
  y: number
  name: string
  imageUrl: string
}

const gridCols = ref(0)
const gridRows = ref(0)

function updateGridDimensions() {
  gridCols.value = Math.floor(window.innerWidth / SQUARE_SIZE)
  gridRows.value = Math.floor(window.innerHeight / SQUARE_SIZE)
}

const modelDisplays = computed<ModelDisplay[]>(() => {
  if (!gridCols.value || !gridRows.value) return []

  const result: ModelDisplay[] = []

  for (let i = 0; i < modelsList.length && i < modelPositions.length; i++) {
    const pos = modelPositions[i]!
    const model = modelsList[i]!

    const x = Math.floor((pos.xPercent / 100) * (gridCols.value - MODEL_SQUARE_SIZE))
    const y = Math.floor((pos.yPercent / 100) * (gridRows.value - MODEL_SQUARE_SIZE))

    // Check for overlap with already placed models (2×2 bounding box)
    const overlaps = result.some(placed =>
      x < placed.x + MODEL_SQUARE_SIZE
      && x + MODEL_SQUARE_SIZE > placed.x
      && y < placed.y + MODEL_SQUARE_SIZE
      && y + MODEL_SQUARE_SIZE > placed.y,
    )

    if (!overlaps) {
      const imageKey = Object.keys(modelImages).find(k => k.endsWith(`/${model.image}`))
      const imageUrl = imageKey ? modelImages[imageKey]!.default : ''

      result.push({ x, y, name: model.smallName, imageUrl })
    }
  }

  return result
})

function initModelSquares() {
  updateGridDimensions()
  window.addEventListener('resize', updateGridDimensions)
}

function destroyModelSquares() {
  window.removeEventListener('resize', updateGridDimensions)
}

// ──────────────────────────────────────────
// Lifecycle
// ──────────────────────────────────────────

onMounted(() => {
  initGridSquares()
  initMouseSquares()
  initModelSquares()
})

onUnmounted(() => {
  destroyGridSquares()
  destroyMouseSquares()
  destroyModelSquares()
})
</script>

<template>
  <section ref="heroRef" class="hero" :style="{ '--square-size': SQUARE_SIZE + 'px' }">
    <div class="hero__container">
      <div class="container__content">
        <h1 class="content__title">
          It starts with frontier science.
        </h1>

        <p class="content__description">
          State of the art models with cutting edge capabilities, from cloud to edge.
        </p>

        <UiButtonAnimated class="content__button">
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

      <div v-for="model in modelDisplays" :key="model.name" class="background-grid__model"
        :style="{ '--pos-x': model.x, '--pos-y': model.y }">
        <img :src="model.imageUrl" :alt="model.name" class="model__image">
        <span class="model__name">{{ model.name }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss" src="./Hero.scss" />
