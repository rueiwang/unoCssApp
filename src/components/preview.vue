<template>
    <div
      ref="frameRef"
      class="relative w-full h-full bg-white"
    >
      <div
        class="overflow-auto"
        min-w-0 min-h-0 w-full h-full
      >
        <iframe
          ref="iframe"
          border-0 flex-grow min-w-0 w-full h-full min-h-0
          src="/example.html"
          @load="send"
        />
      </div>
    </div>
</template>
<script setup>
import {ref, reactive, computed, watch} from 'vue'
const props = defineProps({
    css: {
        type: String,
        default: ''
    },
    html: {
        type: String,
        default: ''
    },
    init: {
        type: Boolean,
        default: false
    },
    reloading: {
        type: Boolean,
        default: false
    }
})

const iframe = ref(null)
const iframeData = computed(() => ({
  source: 'unocss-playground',
  css: props.css,
  html: props.html,
  dark: false,
}))

async function send() {
  iframe.value?.contentWindow?.postMessage(JSON.stringify(iframeData.value), location.origin)
}

watch(() => props.init, (val) => {
    if(val) {
        send()
    }
})

watch(() => props.reloading, (val) => {
    if (val) {
        send()
    }
})
</script>