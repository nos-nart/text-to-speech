import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import fs from 'fs';
import lessToJS from 'less-vars-to-js';
import { resolve } from 'path';

const pathResolver = (path: string) => resolve(__dirname, path);
const themeVariables = lessToJS(
  fs.readFileSync(pathResolver('./src/antd-custom.less'), 'utf8'),
);

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tsconfigPaths()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: themeVariables,
      },
    },
  },
  // server: {
  //   fs: {
  //     // Allow serving files from one level up to the project root
  //     allow: ['..']
  //   },
  //   proxy: {
  //     '/api': 'ws://125.214.0.120:81'
  //   }
  // },
})
