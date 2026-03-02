<script setup lang="ts">
import { createTimeline, stagger } from 'animejs'

const sectionRef = useTemplateRef<HTMLElement>('section')
const titleRef = useTemplateRef<HTMLElement>('title')
const descriptionRef = useTemplateRef<HTMLElement>('description')
const usageRef = useTemplateRef<HTMLElement>('usage')

onMounted(() => {
  const targets = [titleRef.value, descriptionRef.value]

  const tl = createTimeline({
    defaults: {
      duration: 1400,
      ease: 'outQuad',
    },
    autoplay: false,
  })

  tl.add(targets, {
    opacity: [0, 1],
    filter: ['blur(10px)', 'blur(0px)'],
    delay: stagger(250),
  })

  if (titleRef.value) {
    tl.add([titleRef.value.querySelector('.title__right')], {
      x: ['-3em', '0em'],
      duration: 800,
      easing: 'easeOutBack',
    }, '-=200')
  }

  tl.add([usageRef.value], {
    opacity: [0, 1],
    filter: ['blur(10px)', 'blur(0px)'],
  }, '-=200')

  // fix: reset the timeline to ensure it starts from the beginning when played
  tl.reset()

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        console.log('Playing animation for IntroductionModels')
        tl.play()
        observer.disconnect()
      }
    },
    { threshold: 0.5 },
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }

  onUnmounted(() => {
    observer.disconnect()
  })
})
</script>

<template>
  <section ref="section" class="introduction-models">
    <h2 ref="title" class="introduction-models__title">
      <span class="title__left">
        Tailored
      </span>
      <span class="title__icon" aria-hidden="true" />
      <span class="title__right">
        for You.
      </span>
    </h2>

    <p ref="description" class="introduction-models__description">
      Our premier models are designed to be yours to tune, customize, distill, and deploy.
    </p>

    <p ref="usage" class="introduction-models__usage">
      Available for commercial use.
    </p>
  </section>
</template>

<style lang="scss" scoped src="./IntroductionModels.scss" />
