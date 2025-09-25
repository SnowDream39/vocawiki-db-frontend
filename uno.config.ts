import { defineConfig, presetWind4 } from 'unocss'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [
    presetWind4({
      dark: 'media',
    }),
    presetIcons(),
  ],
})
