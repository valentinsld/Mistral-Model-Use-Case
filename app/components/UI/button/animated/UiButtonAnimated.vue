<script setup lang="ts">
import ButtonAnimated from '~/assets/webgl/elements/ButtonAnimated'

let buttonAnimated: ButtonAnimated
const buttonRef = useTemplateRef('buttonRef')

onMounted(() => {
  buttonAnimated = new ButtonAnimated(buttonRef.value)
})

onUnmounted(() => {
  if (buttonAnimated) {
    buttonAnimated.destroy()
  }
})
</script>

<template>
  <button ref="buttonRef" class="ui-button-animated">
    <span class="ui-button-animated__content">
      <slot />
    </span>
  </button>
</template>

<style lang="scss" scoped src="./UiButtonAnimated.scss" />
