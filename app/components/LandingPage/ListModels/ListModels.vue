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

// Constante pour ajuster la durée du scroll (plus la valeur est grande, plus le scroll est lent)
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
  // Clear le timeout précédent
  if (scrollTimeout) clearTimeout(scrollTimeout)

  // Attendre que l'utilisateur arrête de scroller (300ms d'inactivité)
  scrollTimeout = setTimeout(() => {
    snapToCenter()
  }, 300)
}

//
// Init Observers
//
function initObservers() {
  if (!elementsRef.value || !sectionRef.value) return

  // Observer pour les éléments (détecte le centre de l'écran)
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
      // rootMargin négatif pour créer une zone au centre de l'écran
      rootMargin: '-45% 0px -45% 0px',
      threshold: [0.1, 0.5, 0.9]
    }
  )

  // Observer chaque élément
  elementsRef.value.forEach((el) => {
    elementObserver!.observe(el)
  })

  // Observer pour la section (détecte si visible à 80%)
  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        console.log('Section visibility:', entry.isIntersecting, 'Intersection ratio:', entry.intersectionRatio)
        isSectionVisible.value = entry.isIntersecting
        if (!entry.isIntersecting) {
          centerElementIndex.value = null // Réinitialiser l'index central si la section n'est plus visible
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

  // Calculer la position pour centrer l'élément
  const rect = element.getBoundingClientRect()
  const elementCenter = rect.top + rect.height / 2
  const viewportCenter = window.innerHeight / 2
  const offset = elementCenter - viewportCenter

  // Calculer la durée en fonction de la distance (min: 0.5s, max: 2s)
  const distance = Math.abs(offset)
  const dynamicDuration = Math.min(2, Math.max(0.5, distance * SCROLL_DURATION_MULTIPLIER))

  // Scroller avec Lenis pour un effet smooth
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
