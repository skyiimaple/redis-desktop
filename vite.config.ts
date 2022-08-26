import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import electron from "vite-plugin-electron";
import electronRenderer from "vite-plugin-electron/renderer";
import polyfillExports from "vite-plugin-electron/polyfill-exports";
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
// https://vitejs.dev/config/
export default defineConfig({
  base: './', //打包路径
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    //配置主进程和预加载脚本地址
    electron({
      main: {
        entry: "electron-main/index.ts",
      },
      preload: {
        input: path.join(__dirname, "./electron-preload/index.ts"),
      },
    }),
    electronRenderer(),
    polyfillExports(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  build: {
    emptyOutDir: false, // 必须配置，否则electron相关文件将不会生成build后的文件
  },
});
