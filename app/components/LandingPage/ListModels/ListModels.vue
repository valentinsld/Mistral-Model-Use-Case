<script setup lang="ts">
import { animate, onScroll } from 'animejs'
import PixelArts from '~/assets/webgl/elements/PixelArts'
import modelsList from '~/datas/modelsList'

const sectionRef = useTemplateRef<HTMLElement>('section')
const elementsRef = useTemplateRef<HTMLElement[]>('elements')

const centerElementIndex = ref<number | null>(null)
const isSectionVisible = ref(false)
let scrollTimeout: ReturnType<typeof setTimeout> | null = null
let elementObserver: IntersectionObserver | null = null
let sectionObserver: IntersectionObserver | null = null
let lenis: any = null
let pixelArts: PixelArts | null = null

// Constant to adjust scroll duration (higher value = slower scroll)
const SCROLL_DURATION_MULTIPLIER = 0.05

// lifecycle log to verify refs
onMounted(() => {
  initAnimation()
  initLenis()
  initObservers()
  initPixelArts()
})

onUnmounted(() => {
  if (scrollTimeout) clearTimeout(scrollTimeout)
  cleanupObservers()
  if (lenis) lenis.value?.destroy()
  if (pixelArts) pixelArts.destroy()
})

// --------------
// init Animation
// --------------
function initAnimation() {
  if (!elementsRef.value || !sectionRef.value) return

  elementsRef.value.forEach((el) => {
    animate(
      el,
      {
        opacity: [0, 1, 1, 0.3],
        y: [50, 0, 0, -50],
        rotateX: ['20deg', '0deg', '0deg', '0deg'],
        ease: "inOutQuad",
        autoplay: onScroll({
          enter: 'bottom top',
          leave: 'top bottom',
          sync: 0.5,
        })
      }
    )
  })
}

// --------------
// Init Lenis
// --------------
function initLenis() {
  lenis = useLenis(handleLenisScroll)
}

//
// Handle Lenis Scroll
//
function handleLenisScroll() {
  // Clear the previous timeout
  if (scrollTimeout) clearTimeout(scrollTimeout)

  // Wait for the user to stop scrolling (300ms of inactivity)
  scrollTimeout = setTimeout(() => {
    snapToCenter()
  }, 300)
}

//
// Init Observers
//
function initObservers() {
  if (!elementsRef.value || !sectionRef.value) return

  // Observer for items (detects the center of the screen)
  elementObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = elementsRef.value!.indexOf(entry.target as HTMLElement)
          if (index !== -1) {
            centerElementIndex.value = index
          }
        }
      })
    },
    {
      // Negative rootMargin to create a central zone on the screen
      rootMargin: '-45% 0px -45% 0px',
      threshold: [0.1, 0.5, 0.9]
    }
  )

  // Observe each element
  elementsRef.value.forEach((el) => {
    elementObserver!.observe(el)
  })

  // Observer for the section (detects if visible at 80%)
  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isSectionVisible.value = entry.isIntersecting
        if (!entry.isIntersecting) {
          centerElementIndex.value = null // Reset center index if the section is no longer visible
        }
      })
    },
    {
      threshold: [0.1, 0.2]
    }
  )

  sectionObserver.observe(sectionRef.value)
}

//
// Snap to Center
//
function snapToCenter() {
  if (!elementsRef.value || !lenis || centerElementIndex.value === null) return
  if (!isSectionVisible.value) return

  const element = elementsRef.value[centerElementIndex.value]
  if (!element) return

  // Calculate position to center the element
  const rect = element.getBoundingClientRect()
  const elementCenter = rect.top + rect.height / 2
  const viewportCenter = window.innerHeight / 2
  const offset = elementCenter - viewportCenter

  // Calculate duration based on distance (min: 0.5s, max: 2s)
  const distance = Math.abs(offset)
  const dynamicDuration = Math.min(2, Math.max(0.5, distance * SCROLL_DURATION_MULTIPLIER))

  // Scroll with Lenis for a smooth effect
  lenis.value?.scrollTo(window.scrollY + offset, {
    duration: dynamicDuration,
    easing: (x: number): number => 1 - Math.pow(1 - x, 4) // easeOutQuart : https://easings.net/#easeOutQuart
  })
}

// --------------
// Init Pixel Arts
// --------------

function initPixelArts() {
  pixelArts = new PixelArts(modelsList.map((model) => model.pixelArt))
}

watch(centerElementIndex, (newIndex) => {
  if (pixelArts) {
    pixelArts.setPixelArt(newIndex)
  }
})

watch(isSectionVisible, (isVisible) => {
  if (pixelArts && !isVisible) {
    pixelArts.out()
  }
})

// --------------
// Cleanup Observers
// --------------
function cleanupObservers() {
  if (elementObserver) {
    elementObserver.disconnect()
    elementObserver = null
  }
  if (sectionObserver) {
    sectionObserver.disconnect()
    sectionObserver = null
  }
}
</script>

<template>
  <section ref="section" class="list-models">
    <ul class="list-models__list">
      <li v-for="model in modelsList" :key="model.id" ref="elements" class="list__element">
        <h3 class="element__title">{{ model.name }}</h3>
        <p class="element__description">{{ model.description }}</p>
        <p class="element__explanation">
          {{ model.explanation }}
        </p>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped src="./ListModels.scss" />
