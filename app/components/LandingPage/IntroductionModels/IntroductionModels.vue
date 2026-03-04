<script setup lang="ts">
import { createTimeline, stagger, splitText, get, TextSplitter } from 'animejs'
import TailoredArrow from '~/assets/webgl/elements/TailoredArrow'

const sectionRef = useTemplateRef<HTMLElement>('section')
const titleRef = useTemplateRef<HTMLElement>('title')
const titleLeftRef = useTemplateRef<HTMLElement>('titleLeft')
const titleIconRef = useTemplateRef<HTMLElement>('titleIcon')
const titleRightRef = useTemplateRef<HTMLElement>('titleRight')
const descriptionRef = useTemplateRef<HTMLElement>('description')
const usageRef = useTemplateRef<HTMLElement>('usage')

const RANDOM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@&%!'
const STAGGER_DELAY = 20
const CHAR_DURATION = 250

async function splitTextToSpans(el: HTMLElement) {
  return await splitText(el, { lines: true, chars: true, accessible: true })
}

let observer: IntersectionObserver | undefined
let tailoredArrow: TailoredArrow | undefined
onMounted(async () => {
  if (!titleLeftRef.value || !titleRightRef.value || !descriptionRef.value || !usageRef.value || !titleIconRef.value)
    return

  // init webgl arrow
  tailoredArrow = new TailoredArrow(titleIconRef.value)

  // Split text into individual character spans
  const titleLeft = await splitTextToSpans(titleLeftRef.value)
  const titleRight = await splitTextToSpans(titleRightRef.value)
  const desc = await splitTextToSpans(descriptionRef.value)


  const tl = createTimeline({
    autoplay: false,
  })

  const allChars = [...titleLeft.chars, ...titleRight.chars, ...desc.chars]
  tl.add(allChars, {
    opacity: [0, 1],
    color: ['#fa520f', '#fa520f', '#1f1f1f'],
    duration: CHAR_DURATION,
    ease: 'outQuad',
    delay: stagger(STAGGER_DELAY),
  }, 0)

  const allLines = [titleRef.value, ...desc.lines]
  tl.add(allLines, {
    y: [25, 0],
    duration: 800,
    ease: 'outQuad',
    delay: stagger(STAGGER_DELAY * 13),
  }, 0)

  // Title right chars start slightly after left chars
  tl.add(titleRight.lines, {
    x: ['-1.4em', '0em'],
    duration: 1500,
    ease: 'outBack(1.2)',
    onBegin: () => tailoredArrow?.animateIn(),
  }, '-=800')

  // Usage fades in at the end
  tl.add(usageRef.value, {
    opacity: [0, 1],
    y: [25, 0],
    filter: ['blur(4px)', 'blur(0px)'],
    duration: 800,
    ease: 'outQuad',
  }, '-=300')

  tl.reset()

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        tl.play()
        observer?.disconnect()
      }
    },
    { threshold: 0.5 },
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }

})

onUnmounted(() => {
  observer?.disconnect()

  tailoredArrow?.destroy()
})

</script>

<template>
  <section ref="section" class="introduction-models">
    <h2 class="introduction-models__title" ref="title">
      <span ref="titleLeft" class="title__left">
        Tailored
      </span>
      <span ref="titleIcon" class="title__icon" aria-hidden="true" />
      <span ref="titleRight" class="title__right">
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

<style lang="scss" src="./IntroductionModels.scss" />
