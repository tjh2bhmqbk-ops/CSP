---
name: CSP竞品情报系统 - Demo开发计划
overview: 基于PDF功能地图，开发CSP竞品情报系统的可交互Demo，包含三个角色端：导购BA端（企微小程序）、店长督导端（企微小程序）、管理后台（Web系统）
design:
  architecture:
    framework: html
  styleKeywords:
    - 简约现代
    - 企微小程序风格
    - 卡片式布局
    - 数据可视化
  fontSystem:
    fontFamily: PingFang SC, -apple-system, BlinkMacSystemFont
    heading:
      size: 20px
      weight: 600
    subheading:
      size: 16px
      weight: 500
    body:
      size: 14px
      weight: 400
  colorSystem:
    primary:
      - "#1a1a2e"
      - "#16213e"
    background:
      - "#f5f5f7"
      - "#ffffff"
    text:
      - "#1a1a2e"
      - "#666666"
    functional:
      - "#e94560"
      - "#00d9a5"
      - "#ffc107"
todos:
  - id: demo-structure
    content: 创建Demo目录结构和公共样式
    status: completed
  - id: ba-homepage
    content: 开发导购BA端首页（日月待办、上报入口、上报进度、待处理事项）
    status: completed
    dependencies:
      - demo-structure
  - id: ba-daily
    content: 开发导购BA日报上报页面
    status: completed
    dependencies:
      - ba-homepage
  - id: ba-monthly
    content: 开发导购BA月报上报页面
    status: completed
    dependencies:
      - ba-homepage
  - id: ba-history
    content: 开发导购BA历史记录查询页面
    status: completed
    dependencies:
      - ba-homepage
  - id: manager-homepage
    content: 开发店长督导端首页（异常预警、待审核队列、竞品概览）
    status: completed
    dependencies:
      - demo-structure
  - id: manager-audit
    content: 开发店长督导审核队列页面
    status: completed
    dependencies:
      - manager-homepage
  - id: admin-homepage
    content: 开发管理后台首页（品牌选择器、KPI概览、功能菜单）
    status: completed
    dependencies:
      - demo-structure
  - id: admin-alerts
    content: 开发管理后台异常预警中心页面
    status: completed
    dependencies:
      - admin-homepage
  - id: admin-reports
    content: 开发管理后台数据报表页面
    status: completed
    dependencies:
      - admin-homepage
---

# CSP竞品情报系统 - 产品方案与Demo开发计划

## 一、产品概述

CSP竞品情报系统是一款专为奢侈品牌设计的竞品数据采集与分析平台，通过**企微小程序**实现BA（美容顾问）数据上报、店长审核、**管理后台**数据分析的完整闭环。

---

## 二、用户角色与核心功能（严格基于PDF PAGE 11功能地图）

### 2.1 导购端BA（企微小程序）

| 功能 | PDF来源 | 状态 |
|------|---------|------|
| 每日上报 | "每日上报" | ✅ |
| 每周上报 | "每周上报" | ✅ 新增 |
| 每月上报 | "每月上报" | ✅ |
| 日数据查看修改 | "日数据查看修改" | ✅ 新增 |
| 周数据查看修改 | "周数据查看修改" | ✅ 新增 |
| 月数据查看修改 | "月数据查看修改" | ✅ |
| 竞品柜台信息维护 | "竞品柜台信息维护" | ✅ 新增 |
| 提交/审核状态提醒 | PAGE 16 | ✅ |

**设计要点：**
- 以**门店为单位**上报，任何被指定的BA登录后都可看到该门店的待填报提醒
- 首页显示**门店信息**（品牌、门店名），而非个人身份
- 有异常数据时会有提醒标识
- 有"未通过"提醒，提示BA修改后重新提交

### 2.2 店长/督导端（企微小程序）

| 功能 | PDF来源 | 状态 |
|------|---------|------|
| 日/周/月上报审批 | "日/周/月上报审批" | ✅ |
| 竞品柜台维护审批 | "竞品柜台维护审批" | ✅ 新增 |
| 未上报柜台 | "未上报柜台" | ✅ 新增 |
| 数据异常柜台 | "数据异常柜台" | ✅ 新增 |
| 竞品数据查看 | PAGE 17 "竞品数据查看" | ✅ |

**设计要点：**
- 提供手机端简易报表，方便AC查看竞品数据
- 首页提醒：竞品数据待审批任务数
- 异常柜台提醒：数据未提报、数据异常

### 2.3 管理后台（Web系统）

| 功能 | PDF来源 | 状态 |
|------|---------|------|
| 日/周/月数据审核 | "日/周/月修改审批" | ✅ 新增 |
| 竞品促销审核 | "竞品促销审核" | ✅ |
| 竞品柜台维护审核 | "竞品柜台维护审批" | ✅ |
| 未上报预警 | "未上报柜台" | ✅ |
| 数据异常柜台 | "数据异常柜台" | ✅ |
| 竞品异常数据 | "竞品异常数据" | ✅ 新增 |
| 日/周/月竞品数据表 | "竞品数据表" | ✅ |
| 竞品促销表 | "竞品促销表" | ✅ 新增 |
| 竞品柜台状态 | "异常柜台状态竞品" | ✅ |
| 品牌管理 | "品牌管理" | ✅ |
| 区域/城市/商场 | "区域/城市/商场" | ✅ 新增 |
| 门店/柜台管理 | "门店/柜台管理" | ✅ |
| 竞品关系管理 | "竞品关系管理" | ✅ 新增 |
| 角色与权限 | "角色与权限" | ✅ |

---

## 三、设计风格（基于PDF及归档UI参考）

### 3.1 小程序端风格

| 设计要素 | 描述 |
|---------|------|
| 顶部区域 | 深色渐变头部，显示门店信息 |
| 提醒标识 | 红色/黄色圆点表示未处理事项数量 |
| 功能入口 | 图标+文字的卡片式入口 |
| 列表布局 | 紧凑列表展示数据，带状态标识 |
| Tab切换 | 日报/周报/月报Tab切换 |
| 审批按钮 | 通过/驳回快捷操作 |

### 3.2 管理后台风格

| 设计要素 | 描述 |
|---------|------|
| 布局结构 | 左侧导航+右侧内容区 |
| 品牌选择器 | 顶部品牌切换（数据隔离） |
| 卡片网格 | KPI数据卡片网格布局 |
| 表格列表 | 数据表格+筛选操作 |
| 颜色标识 | ●核心竞品 ○普通竞品；绿/黄/灰柜台状态 |

### 3.3 配色方案

| 颜色 | 用途 |
|------|------|
| 主色：#1E3A5F | 头部、按钮、导航 |
| 辅助：#3B5998 | 次要元素 |
| 成功：#52C41A | 已通过、正常状态 |
| 警告：#FAAD14 | 待处理、异常提醒 |
| 危险：#F5222D | 未上报、严重异常 |
| 背景：#F5F5F5 | 页面背景 |
| 文字：#333333 | 主文字 |

---

## 四、确认事项

| 确认项 | 答案 |
|-------|------|
| 数据权限 | ✅ 品牌隔离，不同品牌经理只看自己品牌数据 |
| 报表深度 | ❌ 不需要下钻 |
| 品牌VI | ❌ 无特殊要求 |
| 技术入口 | ✅ 企微小程序 + Web后台 |
| 设计风格 | 参考PDF企微小程序风格 + 归档UI参考图 |

---

## 五、Demo文件结构（更新版）

```
/Users/pingguo/CodeBuddy/CSP/
├── demo/
│   ├── index.html              # Demo入口（角色选择）
│   ├── mock.js                # 模拟数据
│   │
│   ├── ba/                    # 导购BA端（企微小程序）
│   │   ├── index.html         # BA首页（门店信息+待办+快捷入口）
│   │   ├── daily.html         # 每日上报
│   │   ├── weekly.html        # 每周上报
│   │   ├── monthly.html       # 每月上报
│   │   ├── counter-maintain.html # 竞品柜台信息维护
│   │   ├── daily-history.html # 日数据查看修改
│   │   ├── weekly-history.html# 周数据查看修改
│   │   └── monthly-history.html# 月数据查看修改
│   │
│   ├── manager/               # 店长/督导端（企微小程序）
│   │   ├── index.html         # 店长首页（待审批+异常提醒）
│   │   ├── review-center.html # 审核中心（日/周/月/促销/柜台）
│   │   ├── missing-list.html  # 未上报柜台列表
│   │   └── abnormal-list.html # 数据异常柜台
│   │
│   └── admin/                 # 管理后台（Web系统）
│       ├── index.html         # 管理首页（数据概览）
│       ├── alert-center.html  # 异常预警中心
│       ├── reports.html       # 数据报表（日/周/月/促销/柜台状态）
│       ├── review-admin.html  # 修改审批
│       ├── brand.html         # 品牌管理
│       ├── competitor.html    # 竞品关系管理
│       ├── region.html        # 区域/城市/商场管理
│       └── counter.html       # 柜台管理
│
├── styles/
│   └── main.css               # 公共样式（统一设计语言）
│
└── docs/
    └── CSP-Demo-修正计划.md   # 详细修正计划
```

---

## 六、开发任务清单

### Phase 1：设计风格校准
| 任务 | 优先级 | 说明 |
|------|--------|------|
| 更新公共样式 | P0 | 统一配色、组件风格 |
| 更新Demo入口页 | P0 | 角色选择优化 |

### Phase 2：BA端功能补全
| 任务 | 优先级 | 说明 |
|------|--------|------|
| 增加周报入口 | P0 | 每日/每周/每月Tab |
| 增加柜台维护入口 | P0 | 竞品柜台信息上报 |
| 日数据查看修改页 | P1 | 历史日报查询修改 |
| 周数据查看修改页 | P1 | 历史周报查询修改 |
| 优化月历史页面 | P1 | 完善月数据查看修改 |

### Phase 3：店长端功能补全
| 任务 | 优先级 | 说明 |
|------|--------|------|
| 增加柜台审批入口 | P0 | 竞品柜台维护审批 |
| 未上报柜台列表页 | P0 | 未上报提醒 |
| 数据异常柜台页 | P0 | 数据异常提醒 |
| 优化审核中心 | P1 | 日/周/月/促销/柜台Tab |

### Phase 4：管理端功能补全
| 任务 | 优先级 | 说明 |
|------|--------|------|
| 增加修改审批页 | P1 | 日/周/月修改审批 |
| 增加竞品异常预警 | P1 | 竞品数据异常 |
| 增加竞品促销表 | P1 | 促销状态查看 |
| 增加竞品关系管理 | P1 | 竞品关系配置 |
| 增加区域/城市管理 | P2 | 地理层级管理 |

---

## 七、技术实现

| 项目 | 技术方案 |
|------|---------|
| 前端框架 | HTML5 + CSS3 + Vanilla JS |
| 企微小程序模拟 | 响应式布局模拟小程序UI |
| 图表 | CSS伪元素模拟简单图表 |
| 数据模拟 | JSON对象模拟后端数据 |
| 图标 | 简洁SVG/Unicode图标 |

---

*计划版本：V2.0（修正版）*
*更新时间：2026-04-20*
*基于PDF功能地图（PAGE 11）和归档UI参考图*
