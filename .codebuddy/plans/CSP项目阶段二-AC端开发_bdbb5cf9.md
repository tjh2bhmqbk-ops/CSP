---
name: CSP项目阶段二-AC端开发
overview: AC端（审批端）开发：包括审批中心首页、审核工作台、审核详情、异常柜台、数据报表等核心页面，支持月报审核流程（待审核/已通过/已驳回状态管理）
design:
  architecture:
    framework: react
  styleKeywords:
    - Minimalism
    - Monochrome
    - Data-centric
    - High-contrast
    - Card-based
  fontSystem:
    fontFamily: Source Han Sans CN
    heading:
      size: 40rpx
      weight: 600
    subheading:
      size: 34rpx
      weight: 500
    body:
      size: 30rpx
      weight: 400
  colorSystem:
    primary:
      - "#1E3A5F"
      - "#333333"
    background:
      - "#F5F5F5"
      - "#FFFFFF"
    text:
      - "#333333"
      - "#666666"
      - "#999999"
    functional:
      - "#52C41A"
      - "#FAAD14"
      - "#F5222D"
todos:
  - id: create-ac-structure
    content: 创建AC端项目结构和基础配置文件
    status: completed
  - id: ac-home-page
    content: 开发AC端首页（审批中心）- 统计卡片、任务列表、Tab切换
    status: completed
    dependencies:
      - create-ac-structure
  - id: ac-approval-workbench
    content: 开发审核工作台页面 - 三级Tab、批量操作、筛选功能
    status: completed
    dependencies:
      - create-ac-structure
  - id: ac-approval-detail
    content: 开发审核详情页 - 月报信息、数据展示、审核操作
    status: completed
    dependencies:
      - ac-approval-workbench
  - id: ac-abnormal-counter
    content: 开发异常柜台页面 - 未上报/异常Tab、任务卡片、催办功能
    status: completed
    dependencies:
      - create-ac-structure
  - id: ac-data-report
    content: 开发数据报表页面 - 日报/月报切换、矩阵表格、筛选导出
    status: completed
    dependencies:
      - create-ac-structure
  - id: ac-profile-page
    content: 开发我的页面 - 个人信息、设置入口
    status: completed
    dependencies:
      - create-ac-structure
  - id: ac-tabbar-nav
    content: 集成TabBar导航和路由配置
    status: completed
    dependencies:
      - ac-home-page
      - ac-abnormal-counter
      - ac-data-report
      - ac-profile-page
  - id: ac-demo-data
    content: 生成AC端Demo数据和联调测试
    status: completed
    dependencies:
      - ac-tabbar-nav
---

## AC端（审批端）开发需求

### 产品概述

AC端是CSP竞品销售数据收集系统的审批端，供区域主管（Area Coordinator）使用，负责审核BA提交的月报数据。

### 核心功能需求

**1. TabBar导航（4个Tab）**

- 上报审批：审批中心首页
- 异常柜台：异常数据监控
- 数据报表：数据查看和导出
- 我的：个人中心和设置

**2. 首页（审批中心）**

- 待审核统计横幅（如"您有3条数据上报等待审批，有3个上报异常"）
- Tab切换：待审批 / 已审批
- 审批任务卡片列表（日期、状态标签-待审批橙色、柜台、提交人、上报人）

**3. 审核工作台**

- 三级Tab切换：待审核 / 已审核 / 已驳回
- 列表展示：月份、柜台、提交人、提交时间、审核状态
- 批量操作功能（批量通过/驳回）
- 筛选功能

**4. 审核详情页**

- 月报信息展示（月份、柜台、提交人、提交时间）
- 竞品品牌销售数据明细（品牌、销售额、柜台状态）
- 系统校验结果展示
- 历史趋势对比图表
- 审核操作区：通过 / 驳回 / 退回修改
- 审批意见输入框（驳回时必填）

**5. 异常柜台页面**

- Tab切换：未上报 / 数据异常
- 异常任务卡片列表
- 筛选功能（按区域、按时间）
- 催办功能按钮

**6. 数据报表页面**

- Tab切换：日报 / 月报
- 矩阵表格展示（日期横向展示、品牌纵向展示）
- 状态标签（通过绿色/审批中橙色/未通过红色）
- 日期区间筛选
- 导出功能入口

**7. 月报修改页面（审核场景）**

- 月份数据展示（只读）
- 竞品业绩明细
- 审批意见显示（如有）
- 通过/不通过按钮

### 页面流程

```
首页 → 待审核列表 → 审核详情 → 通过/驳回/退回
首页 → 数据报表 → 查看/导出
首页 → 异常柜台 → 催办/处理
```

### 技术约束

- 复用BA端设计规范（黑白灰配色、思源黑体、rpx单位）
- 复用BA端类型定义和工具函数
- Taro 3.6 + React 18 + TypeScript
- 独立目录：demo/ac/

## 技术方案

### 技术栈

- **框架**：Taro 3.6 + React 18 + TypeScript（复用BA端配置）
- **样式**：SCSS + 设计令牌（复用BA端variables.scss）
- **状态管理**：React Hooks（useState/useCallback）
- **存储**：Taro Storage（与BA端数据互通）
- **图标**：内联SVG（保持与BA端一致）

### 架构设计

#### 1. 目录结构

```
demo/ac/                    # AC端根目录
├── pages/
│   ├── index/             # 首页（审批中心）
│   ├── approval-workbench/# 审核工作台
│   ├── approval-detail/   # 审核详情
│   ├── abnormal-counter/  # 异常柜台
│   ├── data-report/       # 数据报表
│   └── profile/           # 我的
├── utils/
│   ├── types.ts           # 类型定义（复用BA端）
│   ├── constants.ts       # 常量配置（复用BA端）
│   └── storage.ts         # 存储工具（复用BA端）
├── styles/
│   └── variables.scss     # SCSS变量（复用BA端）
├── app.config.ts          # 路由和TabBar配置
├── app.tsx                # 应用入口
└── app.scss               # 全局样式
```

#### 2. 状态管理

- **审核状态**：pending(待审核) | approved(已通过) | rejected(已驳回)
- **数据流**：Storage读取 → 组件状态 → 审核操作 → Storage更新

#### 3. 复用策略

- **类型定义**：复用BA端 `MonthlyReport`, `ReportStatus`, `CompetitorData`
- **工具函数**：复用BA端 `formatMoney`, `STATUS_CONFIG`, `generateDemoMonthlyReports`
- **样式变量**：复用BA端 `variables.scss` 中的颜色、字体、间距定义
- **组件模式**：参考BA端 `RecordDetailModal` 设计审核详情弹窗

#### 4. 关键实现点

- **审核流程**：月报状态从 `submitted` → `approved`/`rejected`
- **批量操作**：支持多选后批量通过/驳回
- **矩阵表格**：使用Grid布局实现日期×品牌的数据展示
- **催办功能**：模拟发送催办通知（Storage标记）

#### 5. 扩展类型定义

```typescript
// AC端新增类型
interface ApprovalTask {
  id: string
  month: string
  counterName: string
  submitterName: string
  submitTime: string
  status: 'pending' | 'approved' | 'rejected'
  monthlyReport: MonthlyReport
  rejectReason?: string
}

interface AbnormalCounter {
  id: string
  counterName: string
  baName: string
  abnormalType: 'not_submitted' | 'data_error'
  month?: string
  alertTime: string
}

interface ApprovalStats {
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  abnormalCount: number
}
```

## AC端UI设计规范

### 设计架构

基于BA端现有的黑白灰极简设计风格，保持视觉一致性，AC端作为审批端强调数据的清晰呈现和操作的明确性。

### 页面设计详情

**1. 首页（审批中心）**

- 顶部统计卡片：区域经理信息、待审批数量（大数字突出显示）、异常提醒数量
- Tab切换栏：待审批（橙色角标）| 已审批
- 审批任务卡片：白色卡片、阴影悬浮效果、左侧状态色条（橙色-待审批/绿色-已通过/红色-已驳回）、卡片内显示月份、柜台、提交人、提交时间

**2. 审核工作台**

- 三级Tab切换：待审核 | 已审核 | 已驳回（选中态下划线高亮）
- 批量操作栏：全选复选框、批量通过按钮、批量驳回按钮（默认隐藏，选择后滑入显示）
- 列表项：左侧多选框、月份标签、柜台名称、提交人信息、提交时间、状态标签

**3. 审核详情页**

- 顶部信息区：月份（大标题）、柜台名称、提交人、提交时间、当前状态标签
- 数据展示卡片：竞品品牌表格（品牌名、销售额、柜台状态标记）
- 历史趋势区：迷你折线图展示该柜台近3个月数据趋势
- 系统校验区：绿色勾选标记显示校验通过项
- 底部操作区：审批意见输入框（多行文本）、通过按钮（黑色实心）、驳回按钮（白色描边）

**4. 异常柜台页面**

- Tab切换：未上报（橙色数字角标）| 数据异常
- 异常任务卡片：警告图标（橙色/红色）、柜台名称、BA姓名、异常类型描述、时间、催办按钮（黑色描边小按钮）

**5. 数据报表页面**

- Tab切换：日报 | 月报
- 矩阵表格：横向表头为日期/月份、纵向为品牌、单元格显示销售额、状态颜色区分（绿色-通过/橙色-审批中/红色-未通过）
- 筛选栏：日期区间选择器、品牌多选下拉、导出按钮

**6. TabBar导航**

- 4个Tab：上报审批（图标：文件核对）、异常柜台（图标：警告三角）、数据报表（图标：图表）、我的（图标：人像）
- 选中态：图标填充+文字加粗+主色调
- 未选中态：线性图标+灰色文字