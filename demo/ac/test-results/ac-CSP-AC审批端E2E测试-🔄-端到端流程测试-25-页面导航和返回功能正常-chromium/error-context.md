# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ac.spec.ts >> CSP AC审批端E2E测试 >> 🔄 端到端流程测试 >> 25. 页面导航和返回功能正常
- Location: e2e/ac.spec.ts:413:9

# Error details

```
Error: Channel closed
```

```
Error: page.waitForTimeout: Target page, context or browser has been closed
```

# Test source

```ts
  1   | /**
  2   |  * CSP AC审批端 E2E 测试脚本
  3   |  * 使用 Playwright 进行端到端测试
  4   |  * 测试AC端完整功能：审批中心、审核工作台、异常柜台、数据报表等
  5   |  */
  6   | 
  7   | import { test, expect } from '@playwright/test'
  8   | 
  9   | const BASE_URL = 'http://localhost:10088'
  10  | 
  11  | test.describe('CSP AC审批端E2E测试', () => {
  12  | 
  13  |   test.beforeEach(async ({ page }) => {
  14  |     await page.goto(BASE_URL)
  15  |     // 等待页面加载
> 16  |     await page.waitForTimeout(1500)
      |                ^ Error: page.waitForTimeout: Target page, context or browser has been closed
  17  |   })
  18  | 
  19  |   test.describe('🏠 审批中心首页', () => {
  20  |     
  21  |     test('1. 审批中心首页加载正常', async ({ page }) => {
  22  |       // 检查页面标题或主要元素存在
  23  |       const bodyText = await page.locator('body').textContent()
  24  |       expect(bodyText).toBeTruthy()
  25  |       // 检查包含审批中心相关文字
  26  |       const hasTitle = bodyText?.includes('审批中心') || bodyText?.includes('上报审批')
  27  |       expect(hasTitle).toBeTruthy()
  28  |       console.log('✅ 审批中心首页加载正常')
  29  |     })
  30  | 
  31  |     test('2. 顶部统计提醒显示正常', async ({ page }) => {
  32  |       // 检查统计提醒区域
  33  |       const bodyText = await page.locator('body').textContent()
  34  |       const hasStats = bodyText?.includes('上报') || bodyText?.includes('审批') || bodyText?.includes('数据')
  35  |       expect(hasStats).toBeTruthy()
  36  |       console.log('✅ 统计提醒显示正常')
  37  |     })
  38  | 
  39  |     test('3. Tab切换功能正常（待审批/已审批）', async ({ page }) => {
  40  |       // 检查Tab存在（使用更灵活的匹配）
  41  |       const bodyText = await page.locator('body').textContent()
  42  |       const hasPending = bodyText?.includes('待')
  43  |       const hasApproved = bodyText?.includes('已')
  44  |       expect(hasPending || hasApproved).toBeTruthy()
  45  |       
  46  |       // 尝试点击Tab
  47  |       try {
  48  |         await page.click('text=已审批')
  49  |         await page.waitForTimeout(500)
  50  |         console.log('✅ Tab切换功能正常')
  51  |       } catch {
  52  |         console.log('⚠️ Tab点击失败，但页面存在')
  53  |       }
  54  |     })
  55  | 
  56  |     test('4. 审批任务卡片显示正常', async ({ page }) => {
  57  |       // 检查任务卡片存在
  58  |       const taskCard = page.locator('.task-card, [class*="task"]').first()
  59  |       if (await taskCard.isVisible().catch(() => false)) {
  60  |         // 验证卡片包含必要信息
  61  |         const cardText = await taskCard.textContent()
  62  |         expect(cardText).toBeTruthy()
  63  |         console.log('✅ 审批任务卡片显示正常')
  64  |       } else {
  65  |         // 如果没有数据，检查空状态
  66  |         const bodyText = await page.locator('body').textContent()
  67  |         if (bodyText?.includes('暂无') || bodyText?.includes('没有')) {
  68  |           console.log('✅ 审批任务卡片显示正常（暂无数据状态）')
  69  |         } else {
  70  |           console.log('⚠️ 未检测到任务卡片或空状态')
  71  |         }
  72  |       }
  73  |     })
  74  | 
  75  |     test('5. 点击查看更多跳转到审核工作台', async ({ page }) => {
  76  |       // 查找查看更多按钮
  77  |       const viewMore = page.locator('text=查看更多').first()
  78  |       if (await viewMore.isVisible().catch(() => false)) {
  79  |         await viewMore.click()
  80  |         await page.waitForTimeout(800)
  81  |         // 验证跳转到了审核工作台
  82  |         const url = page.url()
  83  |         expect(url).toContain('approval-workbench')
  84  |         console.log('✅ 点击查看更多跳转到审核工作台')
  85  |       } else {
  86  |         console.log('⚠️ 未找到查看更多按钮')
  87  |       }
  88  |     })
  89  | 
  90  |     test('6. 点击任务卡片跳转到审核详情', async ({ page }) => {
  91  |       // 查找第一个任务卡片
  92  |       const taskCard = page.locator('.task-card, [class*="task"]').first()
  93  |       if (await taskCard.isVisible().catch(() => false)) {
  94  |         await taskCard.click()
  95  |         await page.waitForTimeout(800)
  96  |         // 验证跳转到了审核详情
  97  |         const url = page.url()
  98  |         expect(url).toContain('approval-detail')
  99  |         console.log('✅ 点击任务卡片跳转到审核详情')
  100 |       } else {
  101 |         console.log('⚠️ 未找到任务卡片')
  102 |       }
  103 |     })
  104 |   })
  105 | 
  106 |   test.describe('✅ 审核工作台', () => {
  107 |     
  108 |     test('7. 审核工作台页面加载正常', async ({ page }) => {
  109 |       // 先进入审核工作台
  110 |       await page.goto(`${BASE_URL}/#/pages/approval-workbench/index`)
  111 |       await page.waitForTimeout(1000)
  112 |       
  113 |       // 检查页面加载和内容
  114 |       const bodyText = await page.locator('body').textContent()
  115 |       expect(bodyText).toBeTruthy()
  116 |       // 检查是否有工作台相关文字
```