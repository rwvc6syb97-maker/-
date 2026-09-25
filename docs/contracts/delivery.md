# 交付契约（ORCH-01）

## 版本与唯一事实来源
- PM 唯一负责 `docs/PRD.md`、`docs/backlog.md`；事实核对依据 `Code_20260925(2).txt`。ORCH 仅负责本契约、`docs/architecture.md`、`docs/board.md` 及后续决策/归档文件。
- UI 唯一负责 `docs/contracts/ui.md`、`prototype/`；FE 仅写前端实现；QA 仅写测试与报告。FE 不猜测字段/事实、不改 UI token，专家不得越权改 PM 或 ORCH 文件。
- 本期没有数据库、业务 API、Swagger 或错误码；DB、BE 标记 N/A。未来若增加后端，必须先由 PM 更新需求再走 CR，不用假接口占位。

## 文件、命名与通信
- 文档路径与大小写按契约原样引用；React 组件文件用 PascalCase，变量/函数、TS 类型对象字段用 camelCase，静态资源与 CSS 类建议 kebab-case；不把数据库字段或后端响应当作本期交付要求。
- 页面公开事实严格按 PM 基线，不在其他角色之间以聊天代替契约传递。UI 先交设计契约和原型（如采用原型），FE 在 UI PASS 后实施，QA 在 FE PASS 后验收。
- 跨角色争议走 CR：提出原因与影响 → ORCH 决策 → 记录 `docs/decisions.md` → 广播受影响角色；业务事实或范围争议由 PM 最终裁定。任何人不得先改他人产物再补报。
- 消息使用 TASK_CARD（id/role/inputs 读写标记/deliverables/contracts/acceptance/budget，返工预算≤3）、DELIVER_CARD（task_id/files/tests/self_check/open_questions）、REWORK_CARD（节点、轮次、定位、契约条款、修复目标）、BLOCK_CARD（阻碍、影响、选项）；每条回执由 ORCH 应答并更新看板。

## 构建与测试命令（项目创建后运行，当前尚无前端工程）
- FE 建立 React + Vite 工程及 `package.json`，至少提供 `dev`、`build`、`preview` 脚本并提交锁文件；QA 的复现命令以最终锁文件与脚本为准。建议使用 Node.js 20 LTS 或更新的受支持版本；如最终 Vite 版本要求更高，以锁定版本的 engines 为准并记入交付回执。
- 安装：`npm ci`（须先有 `package-lock.json`）；构建：`npm run build`；本地开发：`npm run dev -- --host 127.0.0.1 --port 5173`；构建预览：`npm run preview -- --host 127.0.0.1 --port 4173`。
- 静态验收：QA 运行 `npm run build`，浏览构建预览；按 PRD T01—T09 对照源文档核对内容、链接、键盘、触屏、响应式、异常退化及产物隐私。仅在 FE 实际定义了测试脚本后运行 `npm test` 或相应测试命令，不得把未执行项报 PASS。
- 当前仓库尚未有前端项目、锁文件、测试脚本，因此以上命令是未来可复现验收约定，非本轮运行结果；不能以文档交付冒充构建或测试通过。

## 放行门槛
- PM 需求基线 PASS 后 UI 才可派发；UI 契约验收 PASS 后 FE 才可派发；FE 构建及契约验收 PASS 后 QA 才可派发；QA 证据通过后 PM 做终验。
- P0（包含事实/链接错、未经确认公开联系方式、敏感信息泄露、核心内容不可达）必须清零；P1/P2 登记后可按计划处理。电话/邮箱公开展示须由本人确认，未确认即禁止上线。