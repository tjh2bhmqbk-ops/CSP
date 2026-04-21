---
name: AC端UI优化调整
overview: 优化AC端7个UI/交互问题：Tab样式调整、字体放大、控件禁用、异常柜台简化、数据报表优化、我的页面精简、审核工作台样式美化
todos:
  - id: fix-home-tab
    content: 调整AC端首页Tab切换样式为下划线形式，移除蓝色填充
    status: pending
  - id: fix-home-font
    content: 放大AC端首页字体大小
    status: pending
    dependencies:
      - fix-home-tab
  - id: fix-home-filter
    content: 禁用首页门店切换和时间控件交互
    status: pending
    dependencies:
      - fix-home-font
  - id: fix-abnormal
    content: 优化异常柜台页面：移除数据异常Tab，修复UI走样
    status: pending
  - id: fix-report
    content: 调整数据报表：移除导出功能，区分日报月报数据，优化样式
    status: pending
  - id: fix-profile
    content: 我的页面移除系统设置，异常监控跳转至未上报
    status: pending
  - id: fix-workbench
    content: 优化审核工作台全选后的批量操作栏样式
    status: pending
  - id: e2e-test
    content: 执行AC端端到端测试验证所有修改
    status: pending
    dependencies:
      - fix-home-filter
      - fix-abnormal
      - fix-report
      - fix-profile
      - fix-workbench
---

## 用户需求

根据用户提供的截图和描述，需要完成以下7项AC端UI/UX优化：

1. **Tab切换样式调整**：移除蓝色填充态，选中时仅显示下划线
2. **首页字体放大**：当前字体偏小，需要整体放大字号
3. **首页筛选控件禁用**：门店切换、时间控件切换暂时不可用（禁用状态）
4. **异常柜台页面优化**：移除"数据异常"Tab，仅保留"未填报"；修复UI走样问题
5. **数据报表页面调整**：日报和月报样式调整，数据区分展示，移除导出功能
6. **我的页面调整**：移除"系统设置"菜单，异常监控点击后跳转至未上报页面
7. **审核工作台样式优化**：全选后的批量操作栏样式美化

## 涉及文件

- `/Users/pingguo/CodeBuddy/CSP/demo/ac/pages/index/index.tsx` - 首页逻辑
- `/Users/pingguo/CodeBuddy/CSP/demo/ac/pages/index/index.scss` - 首页样式
- `/Users/pingguo/CodeBuddy/CSP/demo/ac/pages/abnormal-counter/index.tsx` - 异常柜台
- `/Users/pingguo/CodeBuddy/CSP/demo/ac/pages/abnormal-counter/index.scss` - 异常柜台样式
- `/Users/pingguo/CodeBuddy/CSP/demo/ac/pages/data-report/index.tsx` - 数据报表
- `/Users/pingguo/CodeBuddy/CSP/demo/ac/pages/data-report/index.scss` - 数据报表样式
- `/Users/pingguo/CodeBuddy/CSP/demo/ac/pages/profile/index.tsx` - 我的页面
- `/Users/pingguo/CodeBuddy/CSP/demo/ac/pages/approval-workbench/index.scss` - 审核工作台样式

## 技术栈

- **框架**: Taro 3.x + React + TypeScript
- **样式**: SCSS
- **UI组件**: Taro UI 组件库

## 实现策略

1. **样式调整优先**：通过修改SCSS文件实现UI样式变更
2. **组件逻辑调整**：修改TSX文件中的组件行为和交互
3. **数据模拟**：为日报/月报准备不同的模拟数据
4. **渐进式修改**：按页面逐个调整，确保每个页面完成后再进行下一个

## 关键修改点

| 页面 | 修改内容 |
| --- | --- |
| 首页 | Tab下划线样式、字体放大、筛选控件disabled状态 |
| 异常柜台 | 移除数据异常Tab、修复卡片样式 |
| 数据报表 | 移除导出按钮、区分日报月报数据、调整表格样式 |
| 我的页面 | 移除系统设置、修改异常监控跳转 |
| 审核工作台 | 优化批量操作栏布局样式 |