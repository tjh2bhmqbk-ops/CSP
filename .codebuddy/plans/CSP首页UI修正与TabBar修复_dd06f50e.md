---
name: CSP首页UI修正与TabBar修复
overview: 根据设计稿修正CSP首页UI差异，修复TabBar错位问题，完善小程序端首页布局
design:
  architecture:
    framework: html
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 18px
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
      - "#E8F4F8"
      - "#B8D4E3"
      - "#FFFFFF"
      - "#F5F5F5"
    text:
      - "#333333"
      - "#666666"
      - "#999999"
      - "#FFFFFF"
    functional:
      - "#F5222D"
      - "#FAAD14"
      - "#52C41A"
todos:
  - id: fix-tabbar-style
    content: 使用 [skill:前端开发] 修复TabBar样式和定位问题
    status: completed
  - id: rebuild-homepage
    content: 使用 [skill:前端开发] 重构BA首页，匹配设计稿布局
    status: completed
    dependencies:
      - fix-tabbar-style
  - id: verify-design
    content: 使用 [skill:harness-engineering] 验证实现效果，确保与设计稿一致
    status: completed
    dependencies:
      - rebuild-homepage
---

## 用户需求

1. UIUE设计与归档文件中的设计稿（首页@1.5x.jpg）不一致，需要对照设计稿修正
2. 首页底部三个按钮（TabBar）错位了，需要修复

## 设计稿分析（首页@1.5x.jpg）

- **顶部Banner**：浅蓝色渐变背景，展示化妆品产品图，标题"竞品上报系统"
- **用户信息区**：白色卡片，包含头像、姓名（米晓妮）、品牌门店信息（雅诗兰黛·杭州万象城FSS）、地址（浙江省 杭州市 万象城购物中心）
- **异常提醒**：灰色背景条，显示"您今天上报的数据存在异常，请修改或补充后重新提交"
- **每日业绩卡片**：白色卡片，标题居中，下方两个功能入口（每日数据上报、历史数据查询修改），中间有分隔线
- **月度业绩卡片**：白色卡片，与每日业绩类似布局
- **底部TabBar**：三个按钮（首页/上报/我的），图标+文字垂直排列，白色背景

## 当前Demo问题

1. 首页布局结构与设计稿不符（缺少Banner、用户信息卡片样式不同）
2. 功能入口区域布局不一致（设计稿是2列卡片式，当前是3列网格）
3. TabBar样式和定位问题导致错位

## 技术栈

- **框架**：纯HTML + CSS（小程序风格Demo）
- **样式**：CSS3 + Flexbox/Grid布局
- **图标**：使用emoji或CSS绘制（Demo环境）
- **响应式**：移动端优先，max-width: 375px

## 实现方案

1. **重构首页布局**：按照设计稿重新构建页面结构

- 添加顶部Banner区域（渐变背景+产品图占位）
- 重构用户信息卡片（白色浮动卡片）
- 添加异常提醒条
- 重构业绩卡片（每日/月度）

2. **修复TabBar错位**：

- 使用fixed定位 + transform居中
- 设置正确的width和max-width
- 添加safe-area-inset-bottom适配iPhone

3. **样式细节调整**：

- 配色：浅蓝渐变背景 #E8F4F8 -> #B8D4E3
- 卡片：白色背景、圆角、阴影
- 字体：系统默认字体，层级分明

## 设计风格

采用小程序风格的轻量级设计，符合企业微信应用规范：

1. **顶部Banner**：浅蓝色渐变背景（#E8F4F8 到 #B8D4E3），展示品牌调性
2. **用户信息卡片**：白色圆角卡片，头像+信息布局，悬浮于Banner下方
3. **异常提醒**：灰色背景条，醒目但不突兀
4. **业绩卡片**：白色卡片，标题居中，功能入口左右对称布局
5. **底部TabBar**：白色背景，三个等分按钮，图标+文字垂直排列

## 页面结构

```
┌─────────────────────────┐
│      Banner区域          │  ← 渐变背景+产品图
│    竞品上报系统           │
├─────────────────────────┤
│  ┌─────────────────┐    │
│  │  用户信息卡片    │    │  ← 白色浮动卡片
│  │ 头像 姓名 门店   │    │
│  └─────────────────┘    │
├─────────────────────────┤
│  异常提醒条              │
├─────────────────────────┤
│  ┌─────────────────┐    │
│  │    每日业绩      │    │  ← 白色卡片
│  │  上报  |  历史   │    │
│  └─────────────────┘    │
│  ┌─────────────────┐    │
│  │    月度业绩      │    │
│  │  上报  |  历史   │    │
│  └─────────────────┘    │
└─────────────────────────┘
│  首页  |  上报  |  我的  │  ← TabBar
└─────────────────────────┘
```

## Agent Extensions

### Skill

- **harness-engineering**
- Purpose: 使用系统化方法执行多步骤前端开发任务，确保代码质量和项目稳定性
- Expected outcome: 按照规范完成首页重构和TabBar修复，确保代码可维护

- **前端开发**
- Purpose: 使用现代前端开发最佳实践，构建高质量的UI界面
- Expected outcome: 实现符合设计稿的视觉效果，修复布局问题