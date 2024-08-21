import presetUno from '@unocss/preset-uno'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import { defineConfig } from 'unocss'

export default defineConfig({
	presets: [presetUno()],
	transformers: [transformerVariantGroup()],
})
