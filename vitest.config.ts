import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  return {
    test: {
      globals: true,
      setupFiles: ['./src/test/vitest.setup.ts'],
      environment: 'jsdom',
      threads: false,
      trace: true,
      restoreMocks: true,
      environmentOptions: {
        jsdom: {
          resources: 'usable',
        },
      },
      coverage: {
        provider: 'istanbul',
        reportsDirectory: 'coverage',
        reporters: ['text-summary', 'html'],
      },
    },
    plugins: [react(), svgr()],
    clearScreen: false,
    build: {
      minify: 'esbuild',
      sourcemap: true,
      rollupOptions: {
        manualChunks: {
          mui: ['@mui/material'],
          muicons: ['@mui/icons-material'],
        },
      } as import('rollup').RollupOptions,
    },
    resolve: {
      alias: {
        '~': path.join(__dirname, 'src'),
      },
    },
    esbuild: {
      pure: mode === 'production' ? ['console.log'] : [],
      keepNames: true,
    },
  }
})
