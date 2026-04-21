---
name: ac-ui-adjustment-2
overview: AC端UI调整：审核工作台字体放大与交互优化、异常柜台催办按钮布局修复、数据报表日报数据填充与导出按钮删除
todos:
  - id: fix-workbench-font
    content: 放大审核工作台页面字体（标题、Tab、列表项、批量操作栏）
    status: completed
  - id: fix-workbench-filter
    content: 为审核工作台的城市切换、时间筛选添加禁用状态
    status: completed
    dependencies:
      - fix-workbench-font
  - id: fix-abnormal-card
    content: 优化异常柜台催办按钮布局，调整卡片内容间距
    status: completed
  - id: fix-abnormal-tab
    content: 调整异常柜台未上报TAB页面整体布局
    status: completed
    dependencies:
      - fix-abnormal-card
  - id: fix-report-font
    content: 放大数据报表页面字体
    status: completed
  - id: fix-report-export
    content: 删除数据报表导出按钮
    status: completed
    dependencies:
      - fix-report-font
  - id: fix-report-data
    content: 为日报填充模拟数据
    status: completed
    dependencies:
      - fix-report-export
  - id: e2e-test
    content: 构建并测试AC端所有修改
    status: completed
    dependencies:
      - fix-workbench-filter
      - fix-abnormal-tab
      - fix-report-data
---

## 用户需求

根据用户反馈，需要完成以下3项AC端页面优化：

### 1. 上报审批页面（审核工作台）

- 整体字体偏小，需要放大
- 城市切换、时间切换、筛选等功能不可用（禁用状态）

### 2. 异常柜台页面

- 催办按钮布局排布有问题
- 未上报TAB页面布局需要调整

### 3. 数据报表页面

- 整体字体偏小，需要放大
- 日报中Demo需要填充数据
- 导出按钮需要删除

## 涉及文件

- `/Users/pingguo/CodeBuddy/CSP/demo/ac/pages/approval-workbench/index.tsx` - 审核工作台逻辑
- `/Users/pingguo/CodeBuddy/CSP/demo/ac/pages/approval-workbench/index.scss` - 审核工作台样式
- `/Users/pingguo/CodeBuddy/CSP/demo/ac/pages/abnormal-counter/index.tsx` - 异常柜台逻辑
- `/Users/pingguo/CodeBuddy/CSP/demo/ac/pages/abnormal-counter/index.scss` - 异常柜台样式
- `/Users/pingguo/CodeBuddy/CSP/demo/ac/pages/data-report/index.tsx` - 数据报表逻辑
- `/Users/pingguo/CodeBuddy/CSP/demo/ac/pages/data-report/index.scss` - 数据报表样式

## 技术栈

- **框架**: Taro 3.x + React + TypeScript
- **样式**: SCSS
- **数据持久化**: LocalStorage

## 实现策略

1. **字体放大**: 通过修改SCSS文件中的font-size属性
2. **控件禁用**: 添加disabled状态样式（opacity降低、pointer-events禁用）
3. **布局调整**: 优化卡片布局、按钮位置
4. **数据填充**: 为日报添加模拟数据
5. **导出按钮**: 从TSX和SCSS中移除导出相关代码