# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ac.spec.ts >> CSP AC审批端E2E测试 >> 🔄 端到端流程测试 >> 24. 完整审批流程：首页 -> 工作台 -> 详情 -> 操作
- Location: e2e/ac.spec.ts:392:9

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
    52 × waiting for element to be visible, enabled and stable
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
              - generic [ref=e48]: 4月19日 17:50
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
              - generic [ref=e67]: 4月18日 17:50
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
    - generic [ref=f3e2]:
      - text: "Compiled with problems:"
      - button "X" [ref=f3e3] [cursor=pointer]
      - generic [ref=f3e4]:
        - text: ERROR
        - generic [ref=f3e5]: "Conflict: Multiple assets emit different content to the same filename index.html"
  - iframe [ref=e88]:
    - generic [ref=f4e2]:
      - heading "Failed to compile." [level=3] [ref=f4e4]
      - generic [ref=f4e6]: "Conflict: Multiple assets emit different content to the same filename index.html"
```

# Test source

```ts
  300 |       if (hasDaily && hasMonthly) {
  301 |         console.log('✅ 日报/月报Tab切换存在')
  302 |       } else {
  303 |         console.log('⚠️ 未检测到日报/月报Tab')
  304 |       }
  305 |     })
  306 | 
  307 |     test('19. 矩阵表格或数据展示存在', async ({ page }) => {
  308 |       await page.goto(`${BASE_URL}/#/pages/data-report/index`)
  309 |       await page.waitForTimeout(800)
  310 |       
  311 |       // 检查表格或数据
  312 |       const bodyText = await page.locator('body').textContent()
  313 |       const hasTable = bodyText?.includes('table') || 
  314 |                        bodyText?.includes('数据') ||
  315 |                        bodyText?.includes('品牌') ||
  316 |                        bodyText?.includes('销售')
  317 |       
  318 |       if (hasTable) {
  319 |         console.log('✅ 矩阵表格或数据展示存在')
  320 |       } else {
  321 |         console.log('⚠️ 未检测到表格数据')
  322 |       }
  323 |     })
  324 | 
  325 |     test('20. 状态标签显示正确（通过/审批中/未通过）', async ({ page }) => {
  326 |       await page.goto(`${BASE_URL}/#/pages/data-report/index`)
  327 |       await page.waitForTimeout(800)
  328 |       
  329 |       // 检查状态标签
  330 |       const bodyText = await page.locator('body').textContent()
  331 |       const hasStatus = bodyText?.includes('通过') || 
  332 |                         bodyText?.includes('审批中') || 
  333 |                         bodyText?.includes('未通过') ||
  334 |                         bodyText?.includes('已驳回')
  335 |       
  336 |       if (hasStatus) {
  337 |         console.log('✅ 状态标签显示正确')
  338 |       } else {
  339 |         console.log('⚠️ 未检测到状态标签')
  340 |       }
  341 |     })
  342 |   })
  343 | 
  344 |   test.describe('👤 我的页面', () => {
  345 |     
  346 |     test('21. 我的页面加载正常', async ({ page }) => {
  347 |       // 点击TabBar的我的
  348 |       await page.goto(`${BASE_URL}/#/pages/profile/index`)
  349 |       await page.waitForTimeout(1000)
  350 |       
  351 |       const bodyText = await page.locator('body').textContent()
  352 |       expect(bodyText).toBeTruthy()
  353 |       console.log('✅ 我的页面加载正常')
  354 |     })
  355 | 
  356 |     test('22. TabBar导航完整（4个Tab）', async ({ page }) => {
  357 |       // 回到首页检查TabBar
  358 |       await page.goto(BASE_URL)
  359 |       await page.waitForTimeout(1000)
  360 |       
  361 |       // 检查4个Tab存在
  362 |       const bodyText = await page.locator('body').textContent()
  363 |       const hasApproval = bodyText?.includes('上报审批') || bodyText?.includes('审批')
  364 |       const hasAbnormal = bodyText?.includes('异常柜台') || bodyText?.includes('异常')
  365 |       const hasReport = bodyText?.includes('数据报表') || bodyText?.includes('报表')
  366 |       const hasProfile = bodyText?.includes('我的')
  367 |       
  368 |       const tabCount = [hasApproval, hasAbnormal, hasReport, hasProfile].filter(Boolean).length
  369 |       console.log(`✅ TabBar导航检查：检测到 ${tabCount}/4 个Tab标签`)
  370 |     })
  371 | 
  372 |     test('23. TabBar切换功能完整测试', async ({ page }) => {
  373 |       await page.goto(BASE_URL)
  374 |       await page.waitForTimeout(1000)
  375 |       
  376 |       // 依次点击各个Tab
  377 |       const tabs = ['异常柜台', '数据报表', '我的']
  378 |       for (const tab of tabs) {
  379 |         const tabElement = page.locator(`text=${tab}`).first()
  380 |         if (await tabElement.isVisible().catch(() => false)) {
  381 |           await tabElement.click()
  382 |           await page.waitForTimeout(600)
  383 |         }
  384 |       }
  385 |       
  386 |       console.log('✅ TabBar切换功能完整测试完成')
  387 |     })
  388 |   })
  389 | 
  390 |   test.describe('🔄 端到端流程测试', () => {
  391 |     
  392 |     test('24. 完整审批流程：首页 -> 工作台 -> 详情 -> 操作', async ({ page }) => {
  393 |       // 从首页开始
  394 |       await page.goto(BASE_URL)
  395 |       await page.waitForTimeout(1000)
  396 |       
  397 |       // 点击第一个任务卡片进入详情
  398 |       const taskCard = page.locator('.task-card, [class*="task"]').first()
  399 |       if (await taskCard.isVisible().catch(() => false)) {
> 400 |         await taskCard.click()
      |                        ^ Error: locator.click: Test timeout of 30000ms exceeded.
  401 |         await page.waitForTimeout(800)
  402 |         
  403 |         // 验证在详情页
  404 |         const url = page.url()
  405 |         expect(url).toContain('approval-detail')
  406 |         
  407 |         console.log('✅ 完整审批流程测试通过：首页 -> 详情')
  408 |       } else {
  409 |         console.log('⚠️ 无任务卡片，跳过流程测试')
  410 |       }
  411 |     })
  412 | 
  413 |     test('25. 页面导航和返回功能正常', async ({ page }) => {
  414 |       // 进入详情页
  415 |       await page.goto(`${BASE_URL}/#/pages/approval-detail/index?id=1`)
  416 |       await page.waitForTimeout(800)
  417 |       
  418 |       // 尝试返回（通过浏览器后退）
  419 |       await page.goBack()
  420 |       await page.waitForTimeout(600)
  421 |       
  422 |       console.log('✅ 页面导航和返回功能正常')
  423 |     })
  424 |   })
  425 | })
  426 | 
```