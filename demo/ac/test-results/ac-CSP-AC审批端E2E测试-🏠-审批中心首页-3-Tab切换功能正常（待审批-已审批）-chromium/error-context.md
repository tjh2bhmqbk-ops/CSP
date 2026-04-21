# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ac.spec.ts >> CSP AC审批端E2E测试 >> 🏠 审批中心首页 >> 3. Tab切换功能正常（待审批/已审批）
- Location: e2e/ac.spec.ts:39:9

# Error details

```
Test timeout of 30000ms exceeded.
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
              - generic [ref=e48]: 4月19日 17:46
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
              - generic [ref=e67]: 4月18日 17:46
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