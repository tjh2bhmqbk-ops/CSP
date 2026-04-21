---
name: csp-daily-report-and-history
overview: 优化 CSP 竞品上报系统的「每日数据上报」二级页面（竞品业绩录入）和「历史数据查询修改」功能，完善表单交互、数据验证、编辑回填及本地存储等核心能力。
design:
  architecture:
    framework: html
  styleKeywords:
    - Minimalism
    - Enterprise-grade Mobile UI
    - Monochrome Professional
    - High Information Density
    - Clean Card-based Layout
  fontSystem:
    fontFamily: Source Han Sans CN, Noto Sans SC
    heading:
      size: 17px
      weight: 600
    subheading:
      size: 15px
      weight: 500
    body:
      size: 14px
      weight: 400
  colorSystem:
    primary:
      - "#1E3A5F"
      - "#2D5A8E"
      - "#333333"
    background:
      - "#F5F5F5"
      - "#FFFFFF"
      - "#F8F9FA"
    text:
      - "#333333"
      - "#666666"
      - "#999999"
    functional:
      - "#52C41A"
      - "#FAAD14"
      - "#F5222D"
      - "#1E3A5F"
todos:
  - id: refactor-daily-page
    content: 全面重写 daily.html 每日数据上报页，包含日期选择器、动态竞品列表、多维度数据输入、草稿保存、提交校验及localStorage持久化
    status: completed
  - id: refactor-history-page
    content: 全面重写 daily-history.html 历史查询页，包含状态筛选、记录列表、查看详情、编辑跳转（带参数回填）、空状态及数据统计
    status: completed
    dependencies:
      - refactor-daily-page
  - id: shared-data-layer
    content: 创建共享数据管理层（localStorage封装），统一两个页面的数据读写接口，生成模拟历史数据用于展示
    status: completed
    dependencies:
      - refactor-daily-page
      - refactor-history-page
  - id: preview-and-verify
    content: 启动本地服务预览两个页面，验证上报→保存→列表展示→编辑→重新提交的完整流程
    status: completed
    dependencies:
      - refactor-daily-page
      - refactor-history-page
      - shared-data-layer
---

## 产品概述

CSP竞品情报系统的BA端（导购端）二级功能页面，包含两个核心页面：**每日数据上报页**和**历史数据查询修改页**。用于导购人员（BA）上报所在商场其他竞品品牌的业绩数据，并支持历史记录的查看与修改。

> **技术栈调整说明**：本项目适配 **手机端小程序**，采用 **React (Taro)** 或 **Vue (uni-app/Taro)** 框架开发。所有页面（含首页 index.html）均需迁移为小程序页面结构。本计划以 **Taro + React** 为主方案（与现有 CSP 技术选型对齐），如需切换为 Vue 可在执行阶段调整。

## 核心功能

### 功能1：每日数据上报页（daily 页面）

- **日期选择器**：支持选择上报日期，默认今日，可切换历史日期补报
- **竞品列表动态展示**：展示该商场所有需监控的竞品柜台（如Dior、LV、Gucci、Hermès等），每个竞品卡片包含：
- 竞品名称 + 核心/普通竞品标识
- 柜台状态标记（正常营业/装修中/撤柜）
- 销售额输入框（元）
- 客流量输入（可选）
- 大单数量输入（可选）
- **备注区域**：异常情况说明文本域
- **草稿保存**：使用 Taro.setStorageSync 本地持久化，防止意外丢失
- **提交校验**：必填项校验 + 数据合理性校验（负数拦截、空值拦截）
- **提交反馈**：Taro.showToast 提示 + 提交成功后跳转回首页

### 功能2：历史数据查询修改页（daily-history 页面）

- **状态筛选 Tab**：全部 / 待审核 / 已通过 / 已驳回
- **月份筛选器**：快速切换查看不同月份数据
- **历史记录列表**：以卡片形式展示每日上报记录，每条记录包含：
- 上报日期 + 状态标签（待审核/已通过/已驳回）
- 各竞品销售额摘要汇总
- 驳回原因展示（如有）
- **查看详情**：弹窗展开完整数据详情
- **编辑修改**：跳转到 daily 页面编辑模式（URL参数传递日期），预填充已有数据
- **本地数据管理**：使用 Taro.setStorageSync 存储模拟数据，实现完整CRUD操作

## 技术栈

| 层级 | 选型 |
| --- | --- |
| **小程序框架** | Taro 3.x + React 18（推荐）或 Taro + Vue 3 |
| **状态管理** | React Hooks (useState/useEffect) 或 Vue3 Composition API |
| **样式方案** | SCSS 模块化 + CSS Variables（遵循 CSP 设计规范） |
| **数据持久化** | Taro.setStorage / wx.setStorage（Demo 阶段模拟后端接口） |
| **UI 组件库** | Taro UI 或 NutUI（按需引入）+ 自定义组件 |
| **设计规范** | CSP 导购端 MasterGo 设计规范（黑白灰配色、线性图标、思源黑体） |


## 技术架构

### 架构模式

采用 **Taro 多页面应用** 结构，每个功能对应独立页面目录，通过 Taro 路由 (`/pages/daily/index?date=xxx&mode=edit`) 实现页面间导航与参数传递。

### 数据流设计

```
用户填写表单 → 表单校验(Hooks) → Taro.setStorageSync 存储(键: csp_daily_{date})
                                      ↓
用户提交 → 更新status为pending → Toast反馈 → Taro.navigateTo({url: '/pages/index/index'})
                                      
历史页加载 → Taro.getStorageInfoSync 扫描所有记录 → 按日期排序渲染列表
              ↓
点击修改 → navigateTo('/pages/daily/index?date=xxx&mode=edit') → 回填数据 → 编辑提交
```

### 核心数据结构

```typescript
// 单日上报数据模型
interface DailyReport {
  date: string;                  // "2026-04-20"
  status: 'pending' | 'approved' | 'rejected';
  submitTime: string;            // "2026-04-20T21:00:00"
  remark: string;                // 备注
  competitors: CompetitorData[];
  rejectReason?: string;         // 驳回原因
}

interface CompetitorData {
  brand: string;                 // "Dior" | "LV" | "Gucci" | "Hermès"
  type: 'core' | 'normal';       // 核心/普通竞品
  counterStatus: 'normal' | 'renovation' | 'closed'; // 营业/装修/撤柜
  sales: number;                 // 销售额(元)
  traffic: number;               // 客流量(人)
  bigOrders: number;             // 大单数
}
```

### 项目目录结构

```
demo/ba/
├── app.config.ts                # Taro 全局配置（路由、 tabBar 等）
├── app.tsx                      # Taro App 入口
├── app.scss                     # 全局样式（CSP 设计规范变量）
├── pages/
│   ├── index/                   # [MIGRATE] 首页（从 index.html 迁移）
│   │   ├── index.tsx
│   │   └── index.module.scss
│   ├── daily/                   # [NEW] 每日数据上报页
│   │   ├── index.tsx            # 主页面组件
│   │   ├── index.module.scss    # 页面样式
│   │   ├── components/
│   │   │   ├── CompetitorCard.tsx     # 竞品录入卡片组件
│   │   │   ├── DatePicker.tsx        # 日期选择器组件
│   │   │   └── StatusSelector.tsx    # 柜台状态选择器
│   │   └── hooks/
│   │       ├── useFormState.ts      # 表单状态管理 Hook
│   │       └── useDraftSave.ts      # 草稿自动保存 Hook
│   └── daily-history/           # [NEW] 历史数据查询修改页
│       ├── index.tsx            # 主页面组件
│       ├── index.module.scss    # 页面样式
│       ├── components/
│       │   ├── RecordCard.tsx         # 历史记录卡片组件
│       │   ├── FilterTabs.tsx         # 状态筛选 Tab 组件
│       │   └── RecordDetailModal.tsx  # 详情弹窗组件
│       └── hooks/
│           ├── useRecordList.ts      # 记录列表查询 Hook
│           └── useRecordFilter.ts    # 筛选逻辑 Hook
├── utils/
│   ├── storage.ts               # localStorage 封装（Taro.Storage API）
│   ├── validators.ts            # 表单校验工具函数
│   ├── constants.ts             # 常量定义（竞品配置、状态枚举等）
│   └── types.ts                 # TypeScript 类型定义
├── images/
│   ├── header-bg.png
│   └── avatar.png
└── styles/
    └── variables.scss           # SCSS 设计令牌（颜色、圆角、间距等）
```

## 实现要点

### 关键技术决策

1. **Taro Storage 作为 Demo 数据层**：使用 `Taro.setStorage` / `Taro.getStorage` 替代浏览器 `localStorage`，无需后端即可完整演示 CRUD 流程；后续对接真实 API 时仅需替换 `utils/storage.ts`
2. **URL 参数驱动编辑模式**：`/pages/daily/index?date=2026-04-18&mode=edit` 实现上报/编辑复用同一页面
3. **竞品配置硬编码为常量**：在 `utils/constants.ts` 中定义 `COMPETITOR_CONFIG` 数组，后续可从接口获取
4. **表单联动逻辑**：当柜台状态选为"装修中"或"撤柜"时，自动清空并禁用销售额等输入字段
5. **自定义 Hooks 复用逻辑**：`useFormState`(表单状态)、`useDraftSave`(自动保存)、`useRecordList`(列表查询) 等 Hooks 可跨页面复用
6. **SCSS Modules 隔离样式**：每个页面组件使用 `.module.scss` 避免全局样式污染

### 性能与可靠性

- Taro Storage 异步读写，数据量极小（<100条），无性能瓶颈
- 表单防抖处理（useDebouncedValue），避免频繁触发重渲染
- 提交前做 immutable 快照（immer 或 shallowCopy），确保数据一致性
- 草稿自动保存间隔 3 秒（useDraftSave Hook 内部 setInterval + dirty flag）

## 设计风格

采用**简约专业移动端**设计风格，严格遵循CSP导购端MasterGo设计规范：

```
// styles/variables.scss
$csp-bg: #F5F5F5;
$csp-card-bg: #FFFFFF;
$csp-text-primary: #333333;
$csp-text-secondary: #999999;
$csp-border-radius: 8px;
$csp-shadow: 0 2px 8px rgba(0,0,0,0.06);
$csp-font-family: 'Source Han Sans CN', -apple-system, sans-serif;

// 状态颜色
$status-pending: #FAAD14;      // 待审核 - 琥珀黄
$status-approved: #52C41A;     // 已通过 - 绿色
$status-rejected: #F5222D;     // 已驳回 - 红色
$primary-gradient: linear-gradient(135deg, #1E3A5F, #2D5A8E); // 主按钮渐变蓝
```

## 页面规划（共2个页面 + 迁移首页）

### 页面0：首页 (pages/index/) — 从 index.html 迁移

将现有 `index.html` 迁移为 Taro React 页面，保持原有视觉和交互不变。

### 页面1：每日数据上报页 (pages/daily/index)

**Block 1 - 导航头部**
固定顶部导航栏（Taro 自定义 NavBar），左侧返回箭头（黑白线性SVG），居中显示标题"每日竞品数据上报"，背景渐变蓝色（#B8D4E8至#E8F2F8）。

**Block 2 - 日期选择器**
白色卡片横条，左側日期图标+"上报日期"，右侧显示选中日期（格式：2026年4月20日 今日），点击调用 Taro.showDatePicker 切换日期（限制不可选未来日期）。

**Block 3 - 竞品数据录入区**
白色圆角卡片容器，标题行显示"竞品业绩录入"+ 录入进度提示（如"已填3/4"）。遍历 `COMPETITOR_CONFIG` 渲染 `<CompetitorCard />` 组件：

- 顶栏：品牌名 + 红/灰圆点标识核心/普通 + 右侧 `<StatusSelector />` 下拉
- 输入行：销售额数字输入 + 单位"元"；可折叠展开客流量/大单数

**Block 4 - 备注说明区**
白色卡片内多行文本域（Taro Textarea），placeholder："备注说明（选填）：如有异常情况请在此说明"

**Block 5 - 底部操作栏**
固定底部安全区域，左右双按钮："存草稿"（浅灰#f5f5f5）+ "提交上报"（主色调渐变蓝，宽度占比2:1）。

### 页面2：历史数据查询修改页 (pages/daily-history/index)

**Block 1 - 导航头部**
统一NavBar，标题"历史数据查询"。

**Block 2 - 筛选工具栏**
`<FilterTabs />` 横向 Tab：全部 / 待审核 / 已通过 / 已驳回 + 右侧月份 Picker。统计摘要文字（如"共12条记录"）。

**Block 3 - 历史记录列表**
ScrollView 垂直滚动卡片列表，每张 `<RecordCard />` 包含：

- 顶栏：日期 + 状态徽章（pending/approved/rejected 对应颜色）
- 数据摘要区（浅灰底）：各竞品品牌名+销售额两列紧凑布局
- 驳回原因（仅 rejected 时显示，淡红底色）
- 操作按钮："查看详情"(描边) + "修改"(实心，rejected 状态改为"修改重提")

**Block 4 - 空状态**
无数据时显示插画+引导文案"暂无上报记录，去上报第一份数据吧"+ 跳转按钮。

## 任务拆解

### Phase 1: 基础设施搭建

1. 初始化 Taro 项目结构（app.config.ts, app.tsx, package.json 配置）
2. 创建全局样式变量文件 `styles/variables.scss` 和 `app.scss`
3. 实现 `utils/storage.ts` — Taro Storage 异步封装
4. 实现 `utils/types.ts` — TypeScript 类型定义
5. 实现 `utils/constants.ts` — 竞品配置、状态枚举等常量
6. 实现 `utils/validators.ts` — 表单校验函数

### Phase 2: 每日数据上报页 (pages/daily/)

7. 创建 `hooks/useFormState.ts` — 表单状态管理 Hook
8. 创建 `hooks/useDraftSave.ts` — 草稿自动保存 Hook
9. 创建 `components/DatePicker.tsx` — 日期选择器组件
10. 创建 `components/StatusSelector.tsx` — 柜台状态选择器
11. 创建 `components/CompetitorCard.tsx` — 竞品录入卡片组件
12. 编写 `index.tsx` 主页面 + `index.module.scss` 样式

### Phase 3: 历史数据查询修改页 (pages/daily-history/)

13. 创建 `hooks/useRecordList.ts` — 记录列表查询 Hook
14. Create `hooks/useRecordFilter.ts` — 筛选逻辑 Hook
15. 创建 `components/FilterTabs.tsx` — 状态筛选 Tab 组件
16. 创建 `components/RecordCard.tsx` — 历史记录卡片组件
17. 创建 `components/RecordDetailModal.tsx` — 详情弹窗组件
18. 编写 `index.tsx` 主页面 + `index.module.scss` 样式

### Phase 4: 首页迁移 + 联调

19. 将现有 `index.html` 迁移至 `pages/index/` 为 Taro React 页面
20. 更新 `app.config.ts` 注册所有页面路由
21. 联调测试：首页→上报→提交→历史→修改→回填 完整流程验证
22. 内置模拟数据（近7天记录），确保演示可用

## Agent Extensions

### Skill: 前端开发

- **Purpose**: 用于构建高质量的移动端UI页面，包括精美的CSS/SCSS样式设计、流畅的交互效果和专业的小程序适配
- **Expected Outcome**: 产出符合CSP设计规范的精美小程序页面，具备完整的交互逻辑和数据持久化能力

### Skill: harness-engineering

- **Purpose**: 用于确保多步骤任务执行的可靠性，覆盖上下文工程、分离评估和多会话交接
- **Expected Outcome**: 保证22个步骤的实现过程有序可控，每个阶段有明确的验收标准