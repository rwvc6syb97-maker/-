// 把 vite 构建产物（dist/）发布到 docs/。
//
// 为什么是 docs/：
//   本仓库的 GitHub Pages 设置为「main 分支 + /docs 文件夹」，
//   Pages 只会发布 docs/ 目录的内容，因此构建产物必须落到这里，
//   站点地址为 https://rwvc6syb97-maker.github.io/-/
//
// 注意：不要删除 docs/ 下的 *.md 文档，Pages 会把它们渲染成 .html 页面。
//   本脚本只覆盖构建产物（index.html 与 dist 根目录下的静态文件）。
//
// 该脚本同时被 .github/workflows/publish.yml 调用，保证本地与 CI 行为一致。
import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const docs = path.join(root, 'docs')

if (!existsSync(path.join(dist, 'index.html'))) {
  console.error('✗ 找不到 dist/index.html，请先运行 npm run build')
  process.exit(1)
}

await mkdir(docs, { recursive: true })

// 清掉上一次的产物，避免旧的内容哈希文件在 docs/assets 里越积越多
await rm(path.join(docs, 'assets'), { recursive: true, force: true })

// 复制 dist 根目录下的全部内容（index.html、favicon.svg、icons.svg、assets/ 等）
for (const entry of await readdir(dist, { withFileTypes: true })) {
  await cp(path.join(dist, entry.name), path.join(docs, entry.name), { recursive: true })
}

console.log('✓ 已把 dist/ 的构建产物发布到 docs/')
