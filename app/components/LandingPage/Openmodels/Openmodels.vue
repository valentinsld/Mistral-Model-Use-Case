<script setup lang="ts">
import { animate, onScroll, stagger } from 'animejs'
import MODELS from '~/datas/modelsListOpen'

const modelImages = import.meta.glob<{ default: string }>('~/assets/images/models/*.svg', { eager: true })
const models = computed(() => MODELS.map(model => {
  const imageKey = Object.keys(modelImages).find(k => k.endsWith(`/${model.image}`))
  const imageUrl = imageKey ? modelImages[imageKey]!.default : ''

  return {
    ...model,
    imageUrl,
  }
}))

//
// Animation items
//
const itemsRef = useTemplateRef<HTMLElement[]>('items')

function initAnimation() {
  if (!itemsRef.value) return

  animate(itemsRef.value, {
    translateY: [70, 0],
    opacity: [0.8, 1],
    autoplay: onScroll({
      enter: 'bottom top',
      leave: 'top+=66% bottom',
      sync: .25,
    }),
    delay: stagger(100),
    duration: 800,
    easing: 'easeOutQuad',
  })
}

//
// Lifecycle
//
onMounted(() => {
  initAnimation()
})
</script>

<template>
  <section class="open-models">
    <h2 class="open-models__title">
      Free open-weight models for research.
    </h2>
    <p class="open-models__description">
      Free to use under the Apache 2.0 license.
    </p>

    <ul class="open-models__list">
      <li v-for="model in models" :key="model.id" ref="items" class="list__item">
        <img :src="model.imageUrl" :alt="model.name" class="item__image" />
        <h3 class="item__title">{{ model.name }}</h3>
        <p class="item__description">{{ model.description }}</p>
      </li>
    </ul>

    <div class="open-models__cta">
      <UiButtonAnimated>
        Download models
      </UiButtonAnimated>
    </div>
  </section>
</template>

<style lang="scss" scoped src="./Openmodels.scss" />
