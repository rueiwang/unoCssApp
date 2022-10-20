<script setup>
import { ref } from '@vue/reactivity'
import Preview from './components/preview.vue';
import { createGenerator, defineConfig, presetUno } from 'unocss'
import { computed, onMounted, watch } from '@vue/runtime-core';
// 
const bps =  {
          xs: '360px',
          sm: '480px',
          md: '768px',
          lg: '1024px',
          xl: '1366px',
          '2xl': '1680px'
        }

// 初始化
const uno = createGenerator({}, defineConfig({
  presets: [
    presetUno()
  ],
  theme: {
      breakpoints: {...bps}
  }
}))

const classList = ref('text-red-500')
const htmlTemplate = computed(() => `<p class="${classList.value}">TEST COLOR</p>`)
let css = ref('')

const init = ref(false)
async function generate() {
  let result = await uno.generate(htmlTemplate.value || '')
  css.value = result.css
  init.value = true
}

onMounted(async () => {
  await generate()
})

const reloading = ref(false)
watch(() => classList.value, async () => {
  reloading.value = false
  await generate()
  reloading.value = true
})



const iframeStyle = computed(() => ({
  width: `calc(${iframeW.value} - 1px)`
}))

const iframeW = ref('1024px')
function changeIframeW(w) {
  iframeW.value = w
}


</script>

<template>
 
  <div>
    <div class="mb-10px">
      <button :class="{active: v === iframeW }" class="px-10px focus:outline-none hover:(border-none outline-none)" v-for="(v, bp) in bps" :key="bp"
        @click="changeIframeW(v)">{{ bp }}</button>
    </div>
    <input class="inputControl" type="text" v-model.lazy="classList" />
    <div :style="iframeStyle">
      <Preview :init="init" :html="htmlTemplate" :css="css" :reloading="reloading"></Preview>
    </div>
  </div>

</template>

<style>
.inputControl {
  width: 100%;
  padding: 5px 10px;
  margin-bottom: 20px;
}

button.active {
  color: red;
}
</style>
