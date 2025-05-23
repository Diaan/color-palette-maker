import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins:
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@shoelace-style/shoelace/dist/assets/icons/*.svg',
          dest: 'assets/icons'
        },{
          src: 'src/assets/custom-icons/*.svg',
          dest: 'assets/custom-icons'
        }
      ]
    })
  })
