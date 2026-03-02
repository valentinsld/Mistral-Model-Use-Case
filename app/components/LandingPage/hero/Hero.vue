<script setup lang="ts">
const SQUARE_SIZE = 60

interface GridSquare {
  id: number
  x: number
  y: number
  visible: boolean
}

const squares = reactive<GridSquare[]>([])
const visibleSquares = computed(() => squares.filter(s => s.visible))

let idCounter = 0
let timerId: ReturnType<typeof setTimeout> | null = null

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
  const idx = Math.floor(Math.random() * squares.length)
  const square = squares[idx]

  if (!square) return

  if (square.visible) {
    const visCount = squares.filter(s => s.visible).length
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
  timerId = setTimeout(() => {
    toggleRandom()
    scheduleToggle()
  }, 400 + Math.random() * 800)
}

onMounted(() => {
  for (let i = 0; i < 18; i++) {
    const pos = randomGridPos()
    squares.push({ id: idCounter++, ...pos, visible: true })
  }
  scheduleToggle()
})

onUnmounted(() => {
  if (timerId) clearTimeout(timerId)
})
</script>

<template>
  <section class="hero" :style="{ '--square-size': SQUARE_SIZE + 'px' }">
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
    </div>
  </section>
</template>

<style scoped lang="scss" src="./Hero.scss" />
