import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // 只把第三方依赖单独成块；领域正文、教案、词典交给 Rollup 按动态 import 自动拆分，
        // 首屏只加载轻量目录（catalog.json），打开问题时才下载所在领域。
        manualChunks(id) {
          if (id.replaceAll('\\', '/').includes('/node_modules/')) return 'vendor';
        },
      },
    },
  },
});
