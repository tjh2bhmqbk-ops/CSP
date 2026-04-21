---
name: CSP导购端-6项问题全面修复方案
overview: 修复用户提出的6项问题：(1)删除客流量/大单字段 (2)竞品柜台维护入口调整+报错修复 (3)删除"已驳回"tab (4)彻底修复Demo数据写入失败根因 (5)TabBar上报icon跳转确认 (6)异常告警无数据修复
design:
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
  - id: fix-demo-init
    content: 重写 constants.ts 的 Demo 数据生成逻辑：添加防重复初始化标志位、完善状态分布(draft/approved/submitted)、增强异常容错，彻底解决全页面数据为0的问题
    status: completed
  - id: clean-daily-page
    content: 删除 daily/index.tsx 的客流量/大单数输入区域(展开按钮+extra表单)，清理相关状态逻辑(expandedIdx/toggleExpand)
    status: completed
    dependencies:
      - fix-demo-init
  - id: fix-mgmt-page-entry
    content: 修复 competitor-mgmt/index.tsx 的 import 路径(@/别名)；从首页"每日业绩"区移除第3个入口(恢复2列布局)，保留"我的"页面菜单入口
    status: completed
    dependencies:
      - fix-demo-init
  - id: remove-rejected-tab
    content: 从 daily-history/index.tsx FILTER_TABS 移除 rejected 项，更新类型约束；移除 monthly/index.tsx useEffect 中的重复 Demo 初始化调用
    status: completed
    dependencies:
      - fix-demo-init
  - id: build-verify-all
    content: 编译验证全部修改，检查 lint 无新增错误，确认 Demo 数据正常写入
    status: completed
    dependencies:
      - clean-daily-page
      - fix-mgmt-page-entry
      - remove-rejected-tab
---

## 产品概述

针对 CSP 导购端已存在的 6 个问题进行全面修复和优化：

1. 删除每日上报页的客流量/大单数输入功能
2. 修复竞品柜台维护页报错 + 调整入口位置
3. 移除每日历史数据的"已驳回"筛选 Tab（无审核逻辑）
4. **核心修复**：彻底修复 Demo 数据无法写入的根本原因
5. TabBar 上报图标确认跳转正确（无需改动）
6. 异常告警无数据（由问题4的 Demo 数据修复联动解决）

## 核心功能

### 问题1 - 删除客流量/大单字段

- 从每日上报页 `pages/daily/index.tsx` 移除"更多数据"展开区域（客流量、大单数输入）
- 移除展开/收起按钮及相关交互状态
- 保留 CompetitorData 类型中的 traffic/bigOrders 字段以兼容历史数据

### 问题2 - 竞品柜台维护入口+报错修复

- 将入口从首页"每日业绩"区移除（该区恢复为2个入口），仅保留在"我的"页面菜单
- 修复 `competitor-mgmt/index.tsx` 的 import 路径：从相对路径 `../../utils/...` 改为 `@/utils/...`

### 问题3 - 移除"已驳回"Tab

- 从 `daily-history/index.tsx` 的 FILTER_TABS 中移除 `{ key: 'rejected', label: '已驳回' }`
- 更新筛选类型约束

### 问题4 - Demo 数据写入失败（核心修复）

**根因链**：

1. **多页面重复调用**：app.tsx componentDidShow + daily/index.tsx 模块顶层 + daily-history/index.tsx 模块顶层 + monthly/index.tsx 模块顶层+useEffect + abnormal-data/index.tsx 模块顶层 = 至少 6 处调用
2. **每次调用先清空再重建**：generateDemoDailyReports 第91行 `existingKeys.forEach(k => Taro.removeStorageSync(k))` 导致数据被反复清除
3. **Taro H5 兼容性**：getStorageInfoSync() 在 H5 模式可能抛异常被 catch 静默吞掉，导致函数提前返回但无数据写入
4. **状态不完整**：只有 approved/submitted，缺少 draft；traffic/bigOrders 全为0

### 问题5 - TabBar 上报跳转（确认正常）

- index.tsx 第195行已正确绑定 `/pages/daily/index`

### 问题6 - 异常告警无数据（联动修复）

- abnormal-data 页面依赖月报 Demo 数据，问题4修复后自动有数据

## Tech Stack

Taro 3.x + React 18 + SCSS Modules + Taro Storage，沿用现有架构不变。

## Implementation Approach

### 核心：Demo 数据防重复初始化机制

采用**模块级单例标志位 `_demoDataInitialized`**，确保全局范围内 `generateDemoDailyReports()` 和 `generateDemoMonthlyReports()` 各自只执行一次有效写入：

```
第一次调用 → 写入数据 → 设置标志 = true
后续调用 → 检测标志 → 直接返回（不清空不重建）
```

关键设计决策：

1. 标志位放在 constants.ts 模块作用域内（不是 storage），因为模块在 Taro H5 中是单例
2. 不再使用"先清空再重建"策略，改为"仅在首次时写入"
3. 保留 app.tsx componentDidShow 中的调用作为唯一可靠入口
4. 各页面模块顶层的同步调用保留但会被标志位短路（防御性编程）

### Demo 数据内容增强

- 日报状态分布调整为：最近3天=approved, 中间5天=submitted, 更早= draft, 今天=draft
- 月报状态保持：本月=draft, 上月=submitted, 更早=approved
- traffic/bigOrders 保持为0（因问题1要删除前端展示）

## Implementation Notes

1. **防回归**：各页面保留 import 和顶层调用语句（删掉可能导致编译错误），但通过标志位实现幂等性
2. **H5 Storage 兼容**：getStorageInfoSync() 外层已有 try-catch，新增对 setStorageSync 的容错日志
3. **入口调整**：首页 entry-row 从3个改回2个（删除竞品柜台维护入口），"我的"页面保留
4. **import 路径**：competitor-mgmt 必须使用 `@/` 别名与其他页面一致

## Architecture Design

```
                    ┌─────────────────────────┐
                    │       app.tsx            │
                    │  componentDidShow()     │──→ generateDemoDailyReports()
                    │                       │    generateDemoMonthlyReports()
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
     ┌────────────────┐ ┌──────────────┐ ┌────────────────┐
     │ daily/index.tsx│ │ daily-history│ │ monthly/index   │
     │ 模块顶层调用    │ │ /index.tsx    │ │ .tsx            │
     │ (被标志位短路)  │ │ 模块顶层调用  │ │ 模块顶层+useEffect│
     └───────┬────────┘ └──────┬───────┘ └───────┬────────┘
             │                 │                  │
             ▼                 ▼                  ▼
     ┌─────────────────────────────────────────────┐
     │          utils/constants.ts                │
     │  _dailyInit=true?  _monthlyInit=true?      │
     │  是→return        是→return               │
     │  否→写入storage   否→写入storage           │
     └─────────────────────────────────────────────┘
```

## Directory Structure

```
demo/ba/
├── app.config.ts                              # [MODIFY] 注册已完成(上一轮)
├── app.tsx                                     # [MODIFY] 优化 Demo 初始化调用方式
├── utils/
│   ├── types.ts                                # [MODIFY] 无需改动(traffic/bigOrders保留)
│   ├── storage.ts                              # [MODIFY] 无需改动(上一轮已完成)
│   └── constants.ts                            # [MODIFY] 重写: 防重复初始化 + 完整状态分布
├── pages/
│   ├── competitor-mgmt/
│   │   ├── index.tsx                           # [MODIFY] 修复 import 路径 @/别名
│   │   └── index.module.scss                   # [MODIFY] 无需改动
│   ├── index/index.tsx                         # [MODIFY] 删除"每日业绩"区第3个入口
│   ├── profile/index.tsx                       # [MODIFY] 保留竞品柜台维护菜单项(不变)
│   ├── daily/index.tsx                         # [MODIFY] 删除客流量/大单输入区域
│   ├── daily-history/index.tsx                 # [MODIFY] 移除"已驳回"Tab
│   ├── monthly/index.tsx                       # [MODIFY] 移除 useEffect 内重复初始化
│   └── abnormal-data/index.tsx                 # [MODIFY] 无需改动(Demo修复后自动有数据)
```

本次任务主要为逻辑修复和优化，不涉及新UI创建或大规模视觉重设计。主要变更集中在：1) 删除daily页面的客流量/大单输入区域 2) 调整首页入口布局 3) 移除history页的rejected tab。整体风格延续CSP导购端简约专业移动端风格不变。

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 探索现有代码模式和文件结构，验证修改目标的准确性
- Expected outcome: 确认所有待修改文件的当前状态和精确代码位置

## E2E Testing Strategy

使用 Playwright 进行端到端测试，确保所有修复功能正常工作。

### 测试环境准备

```
# 安装 Playwright + Chromium
cd /Users/pingguo/CodeBuddy/CSP/demo/ba
npx playwright install chromium

# 启动开发服务器（后台运行）
npm run dev:h5 &
sleep 10  # 等待服务启动
```

### 测试用例清单

| # | 页面 | 测试场景 | 预期结果 |
| --- | --- | --- | --- |
| 1 | 首页 | 进入首页，无报错 | 页面正常加载，显示2个入口（每日业绩、竞品柜台维护不在此处） |
| 2 | 每日上报 | 点击TabBar"上报"进入 | 跳转到 `/pages/daily/index`，无客流量/大单数输入框 |
| 3 | 每日上报 | 提交日报 | 成功提交，无报错 |
| 4 | 每日历史 | 进入历史页面 | 仅显示2个Tab：全部、待审核 |
| 5 | 每日历史 | 筛选"待审核" | 显示待审核状态的日报 |
| 6 | 竞品柜台维护 | 从"我的"页面进入 | 页面正常加载，无JS错误 |
| 7 | 竞品柜台维护 | 查看竞品列表 | 列表正常显示 |
| 8 | 竞品柜台维护 | 新增竞品 | 表单正常，可提交 |
| 9 | 异常告警 | 进入异常告警页面 | 应显示月报数据（如有异常数据） |
| 10 | TabBar | 各页面TabBar切换 | 底部导航正常，图标高亮正确 |


### Playwright 测试脚本

```typescript
// e2e/ba.spec.ts
import { test, expect } from '@playwright/test';

test.describe('CSP导购端E2E测试', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:10086');
  });

  test('首页加载正常', async ({ page }) => {
    await expect(page.locator('view')).toBeVisible();
  });

  test('每日上报无客流量/大单输入框', async ({ page }) => {
    await page.click('text=上报');
    await expect(page.locator('text=客流量')).not.toBeVisible();
    await expect(page.locator('text=大单数')).not.toBeVisible();
  });

  test('每日历史仅2个Tab', async ({ page }) => {
    await page.click('text=上报');
    await page.click('text=历史');
    const tabs = page.locator('.tab-item');
    await expect(tabs).toHaveCount(2);
  });

  test('竞品柜台维护页面正常', async ({ page }) => {
    await page.click('text=我的');
    await page.click('text=竞品柜台维护');
    await expect(page.locator('text=竞品柜台')).toBeVisible();
  });
});
```

### 测试执行命令

```
# 方式1：交互式运行
cd /Users/pingguo/CodeBuddy/CSP/demo/ba
npx playwright test --project=chromium --headed

# 方式2：生成报告
npx playwright test --reporter=html
npx playwright show-report
```

### 回归风险评估

| 功能 | 风险等级 | 缓解措施 |
| --- | --- | --- |
| 每日上报删除字段 | 低 | 仅删除UI组件，类型定义保留 |
| 竞品柜台修复 | 中 | 多浏览器测试(H5+微信) |
| Demo数据初始化 | 高 | 验证6处调用点均正常工作 |
| TabBar跳转 | 低 | 已确认路径正确 |


## Validation Checklist

- [ ] `npm run build:h5` 编译成功，无错误
- [ ] 竞品柜台维护页面无JS报错
- [ ] 每日历史Tab筛选正常工作
- [ ] Demo数据在storage中有数据（各状态都有）
- [ ] Playwright E2E测试全部通过