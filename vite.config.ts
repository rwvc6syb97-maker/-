import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// GitHub Pages 部署在 https://<user>.github.io/<repo>/ 子路径下，
// 因此生产构建需要设置 base 为仓库名。
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/-/' : '/',
  plugins: [react()],
}))