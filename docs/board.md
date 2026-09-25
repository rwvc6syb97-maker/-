# 个人站任务看板（FE-02-R1 证据复核与回执待补轮）

## 基线与执行约束
- 只读输入：`docs/PRD.md`、`docs/backlog.md`、`Code_20260925(2).txt`，均已核对存在并读取；PM-01 已 PASS（由本轮任务卡确认，文档包含正常流程、异常与 T01—T09）。业务事实最终由 PM 裁定。
- 阶段按 PM → ORCH → UI → FE → QA → PM 终验推进；禁止下游前置未 PASS 时实施。静态站无业务 API/数据库，DB 与 BE N/A，不派发占位开发。每节点返工最多 3 轮，第 4 次 BLOCKED，ORCH 下一轮裁决。
- 状态含义：PASS 已通过，READY 可派发，PLANNED 尚有前置，REWORK 交付证据或实现待返工，BLOCKED 环境阻塞待恢复，N/A 不在本期范围；READY 不代表已派发。FE-01 仅完成 P01—P07 静态内容/结构与独立构建验收；FE-02 本轮独立 CDP 复测旧 28×44 CSS px 目标均为 44×44 CSS px，但真实缩放、真实触屏、无协议应用缺证，最新 FE-02-R1 正式回执未附，尚未 PASS；QA-01 独立验收未执行。

## 任务图与验收
| id / role | 前置 | 状态 | 产物路径（唯一写入角色） | 验收标准与 backlog 覆盖 |
| --- | --- | --- | --- | --- |
| PM-01 / PM | 原始资料 | PASS | `docs/PRD.md`、`docs/backlog.md` | 需求明确范围、事实、异常、T01—T09 和 P01—P11；原始资料只读 |
| ORCH-01 / ORCH | PM-01 PASS | PASS | `docs/architecture.md`、`docs/contracts/delivery.md`、`docs/board.md` | 架构列技术栈/目录/端口/分层/环境变量；交付契约列命名/构建及测试命令；任务图标记角色、前置、路径、验收 |
| DB-01 / DB | 无 | N/A | `docs/contracts/data.md`、schema、migrations 均不需产出 | PRD 明确无数据存储，禁止虚构数据库 |
| BE-01 / BE | 无 | N/A | `docs/contracts/api.md`、服务代码均不需产出 | PRD 明确无业务 API，禁止虚构服务与接口 |
| UI-01 / UI | ORCH-01 PASS | PASS | `docs/contracts/ui.md`、`prototype/`（如采用原型） | 按 P01—P10 / T01—T09 交付视觉/交互规范，规定首屏、长篇入口和返回、外链提示、焦点、响应式；不得改事实或定义接口 |
| FE-01 / FE | UI-01 PASS | PASS | `index.html`、`package.json`、`package-lock.json`、`src/`、`public/`（按需） | 按 UI 契约及 PM 基线实现 P01—P07，构建通过；首屏、能力、四项目、六段经历、教育、联系/外链事实准确 |
| FE-02 / FE | FE-01 PASS | REWORK 1/3（点击目标 CDP 复测达标；真实场景及正式回执待补） | FE-01 所属前端代码 | 实现并自检 P08—P10：键盘/触屏、320/768/1280px 与 200% 缩放、外站故障退化、无追踪/泄密；构建通过 |
| QA-01 / QA | FE-02 PASS | PLANNED | 测试代码（如需）、`docs/qa-report.md` | 按 P01—P10、PRD T01—T09 执行并留可复现证据；核构建、链接、事实、边界、无障碍与构建产物安全；未执行不可报 PASS |
| PM-02 / PM | QA-01 PASS 且全部 P0 清零 | PLANNED | `docs/product-signoff.md` | P11：原文事实和 QA 证据终验，记录本人确认电话/邮箱公开展示后才签收 |
| ORCH-02 / ORCH | PM-02 PASS | PLANNED | `docs/delivery-report.md`（如发生契约变更另记 `docs/decisions.md`） | 汇总节点与证据，检查接口/字段/路径一致性；本期 API/DB 为 N/A；完成后 DONE |

## 后续派发约束
- FE-02 返工任务卡（第 1/3 轮）：id FE-02；role FE；inputs（只读）`docs/PRD.md`、`docs/backlog.md`、`Code_20260925(2).txt`、`docs/architecture.md`、`docs/contracts/delivery.md`、`docs/contracts/ui.md`，以及已通过的 FE-01 实现（FE 对自身代码可写）；deliverables（可写）FE-01 所属前端代码及 DELIVER_CARD；contracts PM 事实、UI 交互与 ORCH 交付契约；acceptance 见 FE-02 行，提交可复现构建与交互/响应式自检证据，不得将未测项标为通过；budget ≤3 轮。本轮已收到交付并要求返工，不再视为 READY；不得将未测项标为通过。
- QA-01、PM-02 各卡必须等其前置全部 PASS 后分别派发；收到交付/返工/阻塞回执均由 ORCH 应答并更新本看板。任何新接口/数据库需求先交 PM 更新 PRD/backlog，再走 CR 决策与广播。

## FE-01 验收轮与遗留
- 当前阶段：前端 P01—P07 内容与结构验收。依据 `docs/PRD.md`、`docs/contracts/ui.md`、`docs/contracts/delivery.md`、原文 `Code_20260925(2).txt`。静态核对 `src/content/profile.ts` 的三类能力、四项目、六段经历、教育与更多信息及 `src/App.tsx` 的首屏、区块顺序、联系协议、外链与锚点；主要内容和事实与基线一致，未发现 FE-01 范围内的确认缺陷。根目录存在锁文件；ORCH 独立执行 `node --version && npm --version && npm run build`，Node v24.20.0、npm 11.19.0，`tsc -b && vite build` 成功（Vite v8.3.1、18 个模块）。未独立执行 `npm ci`。
- 范围与问题清单：FE-01 无确认缺陷，返工轮次 0/3。浏览器预览、键盘/触屏、320/768/1280px、200% 缩放、外站故障退化及 PRD T01—T09 尚未实测；FE-02 负责交互/响应式自检，QA-01 负责独立回归，不得把未测项报 PASS。发布阻断待确认：电话和邮箱已在页面展示，但本人公开展示确认尚未取得（负责人 PM/本人；PM-02 前记录确认，否则禁止上线）；不据此倒推 FE-01 实现缺陷。阶段放行：FE-01 PASS，FE-02 READY；QA-01、PM-02 暂不放行，不作上线批准。
- DELIVER_CARD 应答：接受 FE-01 交付，仅对静态事实/结构及独立构建作出 PASS；构建成功不等于浏览器或 QA 测试通过。下游须提交各自可复现证据。

## FE-02 DELIVER_CARD 应答与本轮审核
- 当前阶段：前端 P08—P10 验收。收到 FE-02 交付 `src/App.tsx`、`src/App.css`、`index.html`；独立执行 `npm run build` 成功（tsc + Vite v8.3.1，18 个模块），`npx --no-install oxlint src` 为 3 文件 0 错误/0 警告。`npm run lint` 报依赖构建目录 13400 warnings，不能作为合格证据；未独立执行 `npm ci`。未运行浏览器、触屏或外站断连测试；`npm ls playwright @playwright/test puppeteer --depth=0` 返回空集，不代表其他浏览器能力不存在。
- 检查通过条目（仅静态/命令证据）：P08 页内锚点及可聚焦标题/跳转主内容、明文外站提示；P09 CSS 自适应断点、换行、焦点描边和减少动态效果规则存在；P10 联系明文、设备应用提示、外链为 HTTPS、无虚假成功提示，前端代码静态搜索未见表单/采集调用/凭据。`index.html` 禁用脚本时如实提示完整经历不可读并提供联系明文；上述静态检查不代替实际视口/交互/安全测试。
- 问题清单：P0／FE／P08—P10 缺少本节点承诺的键盘/触屏、320px/768px/1280px 和 200% 缩放、后退焦点、协议应用缺失/外站故障的可复现自检证据（`docs/board.md` FE-02 验收标准与任务卡、`docs/PRD.md` T05—T08、`docs/contracts/ui.md` 第 38、47—55 行）；修复目标：在 FE 自有回执中补充运行环境、步骤、实际结果及问题修复证据，未执行不得报通过。P0／FE／`src/App.css` 第 83、86 行联系区邮箱链接 `inline-flex` 加 `max-width: 100%` 且 `overflow-wrap: anywhere`，长链接可否在 320px/200% 换行尚无渲染证据；按 UI 契约第 52、55 行在实际渲染下验证不裁切，必要时仅修改 FE 自有样式并复测。P0／PM/本人／电话邮箱公开展示授权未确认（`docs/PRD.md` T09、交付契约第 22 行）；本人确认前禁止上线，不要求 FE 擅自改事实。
- REWORK_CARD 应答：task_id FE-02；round 1/3；problems 如上；required FE 交付 P08—P10 可复现自检与缺陷修复回执，构建/局部 lint 再核验；若当前环境不能做浏览器实测，明确 BLOCK_CARD（障碍、影响、可用选项），由 ORCH 一轮内裁决，不得伪造 PASS。阶段放行结论：FE-02 REWORK，QA-01 保持 PLANNED，不批准上线。

## FE-02 BLOCK_CARD 应答与阻塞裁决
- 当前阶段：FE-02 前端验收阻塞裁决（收到 BLOCK_CARD 后本轮裁决）。FE 报告浏览器/驱动不可用、DNS 失败；已有构建成功及本地 HTTP 200 证据，只证明可构建且服务能响应，不证明页面在实际浏览器中可用。承接上轮 REWORK 1/3，本轮判为 **暂 BLOCKED（环境阻塞，返工轮次仍为 1/3）**，不得视作 FE-02 PASS 或启动 QA-01。现有证据不能判定视觉或交互实现已失败，亦不得将未测项报 PASS。
- 检查通过条目：沿用已记录的构建、局部 lint、静态结构核对和 FE 报告的本地 HTTP 200；本轮未取得独立浏览器实测证据。问题清单：P0／FE-02／无浏览器环境导致 320/768/1280px、200% 缩放、键盘/触屏、后退焦点及协议/外站故障退化无可复现自检，窄屏邮箱换行未验证；负责人 FE（环境支持由 ORCH 协调）；依据 PRD T05—T08、UI 契约响应式条款及 FE-02 验收标准，须补齐实际步骤、环境、结果及必要修复复测。P0／PM/本人／公开电话邮箱尚未获本人确认；依据 PRD T09 与交付契约放行门槛，未确认禁止发布，不能以页面展示或测试通过替代授权。
- BLOCK_CARD 应答与下一步支持任务卡：id FE-02-VERIFY-SUPPORT；role 具备可用浏览器环境的独立验证专家（仅协助 FE 自检，**不是 QA-01 正式派发**）；inputs（只读）`docs/PRD.md`、`docs/backlog.md`、`docs/contracts/ui.md`、`docs/contracts/delivery.md`、`docs/board.md` 及 FE 页面/构建预览；deliverables 为提交给 FE 的可复现浏览器实测记录（浏览器版本、运行环境、视口/缩放、键盘/触屏及故障模拟步骤、实际结果、截图或日志；无专家文件写入或业务代码修改），FE 汇总到自身 DELIVER_CARD；contracts PRD T05—T08、UI 响应式/交互规范、FE-02 验收标准与角色文件边界；acceptance 实际覆盖 320/768/1280px、200%、键盘/触屏、焦点、长邮箱换行与协议/外站故障，无法测到的项明确未测；budget 本次支持 1 轮，FE-02 返工总预算仍≤3 轮。优先调配已有浏览器环境而非依赖 DNS 下载驱动；若环境仍不可得，保持 BLOCKED 并在下一轮升级环境资源裁决，不跳过验证。FE 获证后仅修改自有代码、复测并重交 DELIVER_CARD；ORCH 按证据复核，FE-02 PASS 后才正式派发 QA-01，QA 完成独立测试后方可流转 PM-02。
- 阶段放行结论：FE-02 暂 BLOCKED；QA-01、PM-02 维持 PLANNED；本人确认公开联系方式、全部 P0 清零及 QA 合格报告未齐前禁止上线。

## FE-02 浏览器协助 BLOCK_CARD 一轮内裁决与 REWORK_CARD
- 当前阶段：FE-02 前端交互与响应式验收；收到浏览器协助 BLOCK_CARD，本轮裁决解除“完全无浏览器环境”的旧阻塞，FE-02 改为 REWORK 1/3，QA-01 仍 PLANNED，未放行。既往第 38—41 行为历史裁决，以下为当前有效状态；协助记录不能替代 FE 自检回执或 QA 独立验收。
- 检查通过条目（限协助实际覆盖范围）：浏览器 CDP 已能实测 320/768/1280 CSS px 宽、键盘、模拟触摸及断网；证据仅证明这些能力和本轮观察，不能外推为真实触屏、真实 200% 浏览器缩放、外站失败或无协议应用测试通过。先前构建、局部 lint 及静态核对继续有效，但不构成 FE-02 PASS。
- 问题清单：P0／FE／导航“关于”“联系”目标各为 28×44 CSS px，宽度低于 `docs/contracts/ui.md` 第 47 行不小于 44×44 CSS px 的硬性要求；FE 仅修改自有前端代码扩大两处可点击区域，在 320/768/1280 宽和键盘/模拟触摸条件下复测实际点击框、焦点与导航布局，提交测量值及复现步骤。P0／FE／真实 200% 缩放、真实触屏、外站失败、无协议应用仍缺证；依据 UI 契约第 47、55—56 行及 FE-02 验收标准，逐项补可取得的实测，标明环境、操作、预期/实际、截图或日志；无法实测的项提交 BLOCK_CARD（障碍、影响、替代方案），不得伪称已测。替代证据仅在明确对应验收目标、覆盖边界和局限，且由 ORCH 逐项审查认可后用于有限判断：模拟触摸不能证明真实触屏，断网不能直接证明外站失败，无协议应用不能由静态检查宣称通过，视口调整不能冒充真实浏览器 200% 缩放。P0／PM/本人／公开联系方式授权未确认，发布前须本人确认。
- REWORK_CARD 应答：task_id FE-02；round 1/3（沿用现有轮次，不因协助证据虚增）；problems 如上；required FE 修复两处目标至少 44×44 CSS px、复测并附可复现结果，补齐可取得的浏览器实测；无法取得的逐项报 BLOCK_CARD 或提交替代证据及等效依据供 ORCH 裁决。仅在 FE-02 全项通过并确认无 P0 后派发 QA-01；QA-01 未启动，PM-02 未放行，现阶段禁止上线。

历史轮次汇报：见上方第 43—47 行裁决；以下 FE-02-R1 复核结论覆盖历史观察，不倒改原始证据。

## FE-02-R1 本轮复核、交付及阻塞回执应答
- 当前阶段：FE-02 前端交互与响应式复核，维持 REWORK 1/3；工作区未检索到可逐项核验的最新 FE-02-R1 DELIVER_CARD、BLOCK_CARD 正文（files/tests/self_check/open_questions 及 blocker/impact/options），故不能代替 FE 填报或宣布其已正式交付。本条为回执待补裁决，不构成 QA-01 派发。
- 检查通过条目（仅本轮独立实测范围）：运行 `node scripts/fe02-check.mjs` 成功；Edge CDP 设置 320/768/1280 CSS px，所有链接点击框至少 44×44 CSS px、无横向溢出，邮箱明文可见可选中且未裁切；键盘跳转主内容及导航焦点、模拟触摸至联系区成功；模拟断网后已加载联系内容仍可读、无成功误报；仅拦截 InnerQuest 请求并浏览器后退，本站联系内容可恢复。`npm run build` 成功（tsc + Vite，18 模块）；`npx --no-install oxlint src` 3 文件 0 错误/0 警告。历史 P0“关于”“联系”28×44 本轮实测各 44×44，旧尺寸缺陷在所测视口未复现；CDP 模拟不证明真实场景。
- 问题清单：P0／FE／真实浏览器 200% 缩放未测试（PRD T07、UI 第 55 行），不得以视口模拟代替；需记录浏览器实际缩放、布局/导航/联系方式/长文结果。P0／FE／真实触屏设备未测试（PRD T05、UI 第 47 行），CDP 触摸模拟仅作有限证据；需真实设备操作记录或正式 BLOCK_CARD 说明阻碍及选项。P0／FE／无拨号/邮件客户端环境未测试（PRD T06、异常场景、UI 第 42 行），需记录协议失败时文字可读且无误报；不能以静态协议链接推定环境行为。P0／FE／仅模拟外站请求失败及浏览器后退（PRD T06/T08），已覆盖本站恢复退化的有限判断；真实外站持续可用不属于验收条件，不因第三方故障降低 PRD 门槛，无法提供真实外站故障环境时说明替代证据及覆盖边界。P0／FE／正式 DELIVER_CARD 与 BLOCK_CARD 缺失，须提交代码文件、命令输出、自检、未决项及各阻碍/影响/选项，供逐项验收；负责人 FE。发布阻断／PM 与本人／电话邮箱公开展示尚未确认（PRD T09），本人确认前不得上线。
- DELIVER_CARD 应答：本轮复现命令成功仅接纳上述有限测试证据；因正式回执未附、真实场景缺证，不签 FE-02 PASS。BLOCK_CARD 应答：已识别脚本确实无法验证真实缩放、真实触屏及无协议应用，环境障碍具备合理性，但正式阻塞回执未附，暂按 REWORK 1/3 保留，收到卡片后需逐项复核影响及可行选项。REWORK_CARD：task_id FE-02；round 1/3；problems 及条款见上；required 提交正式两卡、补齐可执行的实测并明确替代证据边界，不得伪报模拟为真实；无需重修本轮已测达标的点击目标。未触发 CR，不修改 PM/UI 契约；QA-01、PM-02 维持 PLANNED，阶段结论返回修改、禁止上线。

本轮通过节点：无新增；FE-02 的点击目标、三种 CDP 视口、键盘、模拟触摸及故障退化有限检查复现通过，节点仍未 PASS。
返工节点及问题：FE-02 REWORK 1/3；最新正式交付/阻塞回执待补，真实 200% 缩放、真实触屏、无协议应用缺证；PM/本人联系方式公开授权待确认。
下一步派发：向 FE 索取两卡及真实场景证据或逐项环境阻碍与替代方案供下一轮裁决；FE-02 PASS 前不派 QA-01，QA PASS 后再交 PM 终验。