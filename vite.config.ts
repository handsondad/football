import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    // 全文搜索与关联图谱需要首屏即加载全部领域内容，domains 包刻意不拆分
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const norm = id.replaceAll('\\', '/');
          if (norm.includes('/node_modules/')) return 'vendor';
          if (norm.includes('/src/content/domains/')) return 'domains';
          if (norm.includes('/src/content/drills/') || norm.includes('/src/content/lexicon/')) {
            return 'reference-kb';
          }
        },
      },
    },
  },
});
