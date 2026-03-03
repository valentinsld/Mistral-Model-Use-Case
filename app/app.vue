<script setup lang="ts">
import RAFManager from './assets/webgl/utils/RafManager'
import WebGL from './assets/webgl/WebGL'

const lenisOptions = {
  syncTouch: true
}

onMounted(() => {
  // if #stats in url exists, init stats
  if (window.location.hash.includes('#stats')) {
    RAFManager.initStats()
  }

  const webgl = new WebGL()

  const lenis = useLenis((lenis) => {
    webgl.setScrollY(lenis.actualScroll)
  })


  // lenis.value?.stop()

  window.scrollTo(0, 0)
})
</script>


<template>
  <VueLenis root :options="lenisOptions" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <canvas id="webgl" aria-hidden="true" role="presentation" />
</template>
