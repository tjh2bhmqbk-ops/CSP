# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ac.spec.ts >> CSP AC审批端E2E测试 >> 🏠 审批中心首页 >> 6. 点击任务卡片跳转到审核详情
- Location: e2e/ac.spec.ts:90:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.task-card, [class*="task"]').first()
    - locator resolved to <taro-view-core class="task-list">…</taro-view-core>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <iframe src="about:blank" id="react-refresh-overlay"></iframe> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <iframe src="about:blank" id="react-refresh-overlay"></iframe> intercepts pointer events
    - retrying click action
      - waiting 100ms
    54 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <iframe src="about:blank" id="react-refresh-overlay"></iframe> intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e6]:
      - generic [ref=e8]: 审批中心
      - generic [ref=e10]:
        - img [ref=e12]
        - generic [ref=e15]:
          - generic [ref=e16]:
            - generic [ref=e17]: 张主管
            - generic [ref=e18]: Area Coordinator
          - generic [ref=e19]: 浙江省杭州市
      - generic [ref=e20]:
        - generic [ref=e21]:
          - text: 您有
          - generic [ref=e22]: 2条
          - text: 数据上报等待审批，有
          - generic [ref=e23]: 3个
          - text: 上报异常
        - generic [ref=e25]: 查看
      - generic [ref=e26]:
        - generic [ref=e27]:
          - generic [ref=e28]: 待审批
          - generic [ref=e29]: "2"
        - generic [ref=e31]: 已审批
      - generic [ref=e32]:
        - generic [ref=e33]:
          - generic [ref=e35]:
            - generic [ref=e36]:
              - generic [ref=e37]: 2026年3月
              - generic [ref=e39]: 待审核
            - generic [ref=e40]:
              - img [ref=e41]
              - generic [ref=e44]: 雅诗兰黛·杭州万象城FSS
            - generic [ref=e45]:
              - generic [ref=e46]: 上报人：
              - generic [ref=e47]: 米晓妮
              - generic [ref=e48]: 4月19日 17:47
          - img [ref=e50]
        - generic [ref=e52]:
          - generic [ref=e54]:
            - generic [ref=e55]:
              - generic [ref=e56]: 2026年3月
              - generic [ref=e58]: 待审核
            - generic [ref=e59]:
              - img [ref=e60]
              - generic [ref=e63]: 雅诗兰黛·杭州西湖银泰FSS
            - generic [ref=e64]:
              - generic [ref=e65]: 上报人：
              - generic [ref=e66]: 王小红
              - generic [ref=e67]: 4月18日 17:47
          - img [ref=e69]
      - generic [ref=e72]: 查看全部 >
    - generic [ref=e74]:
      - link "上报审批" [ref=e75] [cursor=pointer]:
        - /url: javascript:;
        - paragraph [ref=e77]: 上报审批
      - link "异常柜台" [ref=e78] [cursor=pointer]:
        - /url: javascript:;
        - paragraph [ref=e80]: 异常柜台
      - link "数据报表" [ref=e81] [cursor=pointer]:
        - /url: javascript:;
        - paragraph [ref=e83]: 数据报表
      - link "我的" [ref=e84] [cursor=pointer]:
        - /url: javascript:;
        - paragraph [ref=e86]: 我的
  - iframe [ref=e87]:
    - generic [ref=f1e2]:
      - text: "Compiled with problems:"
      - button "X" [ref=f1e3] [cursor=pointer]
      - generic [ref=f1e4]:
        - text: ERROR
        - generic [ref=f1e5]: "Conflict: Multiple assets emit different content to the same filename index.html"
  - iframe [ref=e88]:
    - generic [ref=f2e2]:
      - heading "Failed to compile." [level=3] [ref=f2e4]
      - generic [ref=f2e6]: "Conflict: Multiple assets emit different content to the same filename index.html"
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
  16  |     await page.waitForTimeout(1500)
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
> 94  |         await taskCard.click()
      |                        ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  117 |       const hasWorkbenchContent = bodyText?.includes('审核') || bodyText?.includes('审批') || bodyText?.includes('工作台')
  118 |       expect(hasWorkbenchContent).toBeTruthy()
  119 |       console.log('✅ 审核工作台页面加载正常')
  120 |     })
  121 | 
  122 |     test('8. 三级Tab切换正常', async ({ page }) => {
  123 |       await page.goto(`${BASE_URL}/#/pages/approval-workbench/index`)
  124 |       await page.waitForTimeout(800)
  125 |       
  126 |       // 检查是否有Tab相关文字
  127 |       const bodyText = await page.locator('body').textContent()
  128 |       const hasTabs = bodyText?.includes('待') || bodyText?.includes('已')
  129 |       
  130 |       if (hasTabs) {
  131 |         try {
  132 |           // 尝试点击Tab
  133 |           await page.click('text=已审批')
  134 |           await page.waitForTimeout(300)
  135 |         } catch {
  136 |           // Tab可能不存在，跳过
  137 |         }
  138 |         console.log('✅ 三级Tab切换正常')
  139 |       } else {
  140 |         console.log('⚠️ 未检测到Tab标签')
  141 |       }
  142 |     })
  143 | 
  144 |     test('9. 批量操作功能存在', async ({ page }) => {
  145 |       await page.goto(`${BASE_URL}/#/pages/approval-workbench/index`)
  146 |       await page.waitForTimeout(800)
  147 |       
  148 |       // 检查全选复选框或批量操作按钮
  149 |       const bodyText = await page.locator('body').textContent()
  150 |       const hasBatchOp = bodyText?.includes('全选') || 
  151 |                          bodyText?.includes('批量') || 
  152 |                          bodyText?.includes('checkbox') ||
  153 |                          bodyText?.includes('选择')
  154 |       
  155 |       if (hasBatchOp) {
  156 |         console.log('✅ 批量操作功能存在')
  157 |       } else {
  158 |         console.log('⚠️ 未检测到批量操作功能')
  159 |       }
  160 |     })
  161 |   })
  162 | 
  163 |   test.describe('📋 审核详情页', () => {
  164 |     
  165 |     test('10. 审核详情页显示月报信息', async ({ page }) => {
  166 |       // 进入审核详情页
  167 |       await page.goto(`${BASE_URL}/#/pages/approval-detail/index?id=1`)
  168 |       await page.waitForTimeout(1000)
  169 |       
  170 |       // 检查月报相关信息
  171 |       const bodyText = await page.locator('body').textContent()
  172 |       expect(bodyText).toBeTruthy()
  173 |       
  174 |       // 检查是否存在审核操作按钮
  175 |       const hasApproveBtn = bodyText?.includes('通过') || bodyText?.includes('驳回') || bodyText?.includes('退回')
  176 |       if (hasApproveBtn) {
  177 |         console.log('✅ 审核详情页显示审核操作按钮')
  178 |       } else {
  179 |         console.log('⚠️ 未检测到审核操作按钮')
  180 |       }
  181 |     })
  182 | 
  183 |     test('11. 审核操作按钮存在（通过/驳回/退回）', async ({ page }) => {
  184 |       await page.goto(`${BASE_URL}/#/pages/approval-detail/index?id=1`)
  185 |       await page.waitForTimeout(800)
  186 |       
  187 |       // 查找审核按钮
  188 |       const bodyText = await page.locator('body').textContent()
  189 |       const hasPass = bodyText?.includes('通过')
  190 |       const hasReject = bodyText?.includes('驳回')
  191 |       const hasReturn = bodyText?.includes('退回')
  192 |       
  193 |       if (hasPass || hasReject || hasReturn) {
  194 |         console.log('✅ 审核操作按钮存在')
```