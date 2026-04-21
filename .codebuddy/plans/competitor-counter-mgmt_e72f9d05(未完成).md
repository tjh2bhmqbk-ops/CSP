---
name: competitor-counter-mgmt
overview: 新增竞品柜台维护功能页面，支持配置同商城各竞品的开关店状态，数据持久化到 localStorage 并与上报页面联动
design:
  styleKeywords:
    - Minimalism
    - Enterprise-grade Mobile UI
    - Card-based Layout
  fontSystem:
    fontFamily: Source Han Sans CN
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
    background:
      - "#F5F5F5"
      - "#FFFFFF"
    text:
      - "#333333"
      - "#999999"
    functional:
      - "#52C41A"
      - "#FAAD14"
      - "#999999"
todos:
  - id: create-types-storage
    content: 扩展 types.ts 和 storage.ts，新增竞品柜台配置数据结构与 CRUD 方法
    status: pending
  - id: create-mgmt-page
    content: 创建 competitor-mgmt 页面（统计卡片 + 竞品列表 + 状态切换 + 实时保存）
    status: pending
    dependencies:
      - create-types-storage
  - id: add-entry-points
    content: 首页和我的页面增加入口、app.config.ts 注册路由、daily 页联动柜台状态
    status: pending
    dependencies:
      - create-mgmt-page
  - id: build-and-verify
    content: 编译验证并预览竞品柜台维护页完整流程
    status: pending
    dependencies:
      - add-entry-points
---

## 产品概述

在CSP导购端新增"竞品柜台维护"功能，允许BA配置同商城内其他竞品品牌的当前开关店状态（营业中/装修中/撤柜），使每日上报时能自动读取最新柜台状态。

## 核心功能

- 竞品品牌列表展示，每个品牌显示当前柜台状态（营业中/装修中/撤柜）
- 可切换每个竞品的柜台状态，状态变更实时保存到 localStorage
- 统计概览：营业中/装修中/撤柜各多少家
- 首页增加"竞品柜台维护"入口卡片
- "我的"页面菜单增加入口
- 每日上报页初始化时从 localStorage 读取竞品柜台默认状态作为初始值

## 技术栈

沿用现有 Taro 3.x + React 18 + SCSS Modules + Taro Storage 方案，与项目现有架构完全一致。

## 实现方案

1. **新建页面** `pages/competitor-mgmt/index.tsx` + `index.module.scss`
2. **扩展数据层**：在 `storage.ts` 新增竞品柜台配置的 CRUD（key: `csp_competitor_config`），在 `types.ts` 扩展 `CompetitorConfigItem` 增加 `counterStatus` 字段
3. **路由注册**：`app.config.ts` 增加 `pages/competitor-mgmt/index`
4. **首页入口**：在"每日业绩"区域增加第三个入口图标"竞品柜台维护"
5. **我的页面入口**：在 menuItems 中增加竞品柜台维护菜单项
6. **上报页联动**：daily/index.tsx 初始化竞品列表时，优先从 localStorage 读取柜台状态

## 目录结构

```
demo/ba/
├── app.config.ts                              # [MODIFY] 注册 competitor-mgmt 页面
├── utils/
│   ├── types.ts                               # [MODIFY] CompetitorConfigItem 增加 counterStatus
│   ├── storage.ts                             # [MODIFY] 新增竞品配置 CRUD 方法
│   └── constants.ts                           # [MODIFY] 新增竞品配置默认 Demo 数据生成
├── pages/
│   ├── competitor-mgmt/
│   │   ├── index.tsx                          # [NEW] 竞品柜台维护页面
│   │   └── index.module.scss                  # [NEW] 页面样式
│   ├── index/index.tsx                        # [MODIFY] 首页增加入口卡片
│   ├── profile/index.tsx                      # [MODIFY] 我的页面增加菜单入口
│   └── daily/index.tsx                        # [MODIFY] 上报页读取竞品柜台默认状态
```

## 设计风格

延续 CSP 导购端简约专业移动端风格，背景 #F5F5F5，卡片白色，主文字 #333，次要文字 #999，圆角 8-12px。

## 页面规划 — 竞品柜台维护页

**Block 1 - 导航头部**
统一 NavBar，左侧返回箭头，居中标题"竞品柜台维护"。

**Block 2 - 统计概览卡片**
白色圆角卡片，横向排列三个数字：营业中(绿)、装修中(黄)、撤柜(灰)，底部显示竞品总数。

**Block 3 - 竞品柜台状态列表**
ScrollView 卡片列表，每项包含：

- 品牌名 + 核心/普通标签
- 当前状态徽章（营业中绿/装修中黄/撤柜灰）
- 右侧切换按钮（点击弹出 ActionSheet 选择状态）
- 最近变更时间

**Block 4 - 底部保存提示**
保存成功后 Toast 提示，状态变更实时持久化无需手动保存。

## SubAgent

- **code-explorer**: 探索现有页面组件模式（如 daily-history 的卡片样式、筛选栏、统计卡片），确保新页面与现有风格一致