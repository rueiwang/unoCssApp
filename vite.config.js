import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import {
  presetUno,
  presetAttributify
} from 'unocss'

function hexToRgba (hex, opacity = 1) {
  let hexReg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  if(!hexReg.test(hex)) return
  let code = hex.replace(hexReg, '$1')

  if(code.length === 3) {
    let shortHandReg = /(.{1})(.{1})(.{1})/
    code = code.replace(shortHandReg, '$1$1$2$2$3$3')
  }

  let [r, g, b] = code.match(/(.{2})/g).map((c) => parseInt(c, 16))

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss({
      presets: [
        presetAttributify(),
        presetUno()
      ],
      rules: [
        [/text-\[#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\]$/, ([, d]) => ({
          color: `${hexToRgba(d)}`
        })]
      ],
      theme: {
         breakpoints: {
          xs: '360px',
          sm: '480px',
          md: '768px',
          lg: '1024px',
          xl: '1366px',
          '2xl': '1680px'
        }
      }
    }),
  ]
})


