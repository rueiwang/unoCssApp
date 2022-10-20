<script setup>
import { reactive, ref } from '@vue/reactivity'
import Preview from './components/preview.vue';
import { createGenerator, defineConfig, presetUno } from 'unocss'
import { computed, onMounted, watch } from '@vue/runtime-core';
// 
const defaultBps =  {
          xs: '360px',
          sm: '480px',
          md: '768px',
          lg: '1024px',
          xl: '1366px',
          '2xl': '1680px'
        }
        
const customBps = reactive({})
const inputBps = ref('')
const breakpoints = computed(() => (Object.assign({...defaultBps }, customBps)))
// 初始化
let uno;

function initUno () {
  uno = createGenerator({}, defineConfig({
  presets: [
    presetUno()
  ],
  theme: {
      breakpoints: breakpoints.value
  }
}))
}

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
  initUno()
  await generate()
  console.log(uno);
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

async function addBp () {
  Object.assign(customBps, {[inputBps.value]: inputBps.value})
  initUno()
  await generate()
  inputBps.value = ''
}

</script>

<template>
 
  <div>
    <p class="mb-10px" v-text="JSON.stringify(breakpoints)"></p>
    <div>
      <input class="mr-10px mb-10px" type="text" v-model.lazy="inputBps">
      <button @click="addBp" class="px-10px focus:outline-none hover:(border-none outline-none)">add new bp</button>
    </div>
    <div class="mb-10px">
      <button :class="{active: v === iframeW }" class="px-10px focus:outline-none hover:(border-none outline-none)" v-for="(v, bp) in breakpoints" :key="bp"
        @click="changeIframeW(v)">{{ bp }}</button>
    </div>
    <input class="inputControl" type="text" v-model.lazy="classList" />
    <div class="mb-10px" :style="iframeStyle">
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
