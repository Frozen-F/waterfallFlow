import path from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const resolve = (_path: string) => path.resolve(__dirname, _path);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve('./src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    open: true, // 是否自动打开浏览器
    strictPort: true, // 端口呗占用时自动尝试下一个端口
    hmr: true, // 热更，默认为开启状态
    // proxy: {
    //   [VITE_APP_API_BASE]: {
    //     // target: 'https://mockapi.eolink.com/MrjsDAlf2476066ffca8a54cac547131f9476bc983f1403',
    //     changeOrigin: true,
    //     rewrite: (path: string) => path.replace(VITE_APP_API_BASE, '/')
    //   }
    // }
  }
})
