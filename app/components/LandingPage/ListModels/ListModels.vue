<script setup lang="ts">
import { animate, onScroll } from 'animejs'
import modelsList from '~/datas/modelsList'

const sectionRef = useTemplateRef<HTMLElement>('section')
const elementsRef = useTemplateRef<HTMLElement[]>('elements')

// lifecycle log to verify refs
onMounted(() => {
  initAnimation()
})

//
// init Animation
//
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
