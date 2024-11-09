<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAppStore } from '@/stores/app'
const store = useAppStore()
console.log('store.init', store)

import { Gradient } from 'whatamesh'
import { onMounted, watch } from 'vue'
import moment from 'moment'

Date.prototype.toJSON = function () {
  return moment(this).format()
}

let gradient = new Gradient()
onMounted(() => {
  gradient.initGradient('#gradient-canvas')
})

watch(
  store.state,
  () => {
    setTimeout(() => {
      gradient.initGradient('#gradient-canvas')
    }, 200)
  },
  { deep: true }
)
</script>

<template>
  <canvas id="gradient-canvas"></canvas>
  <RouterView />
</template>
<style></style>
