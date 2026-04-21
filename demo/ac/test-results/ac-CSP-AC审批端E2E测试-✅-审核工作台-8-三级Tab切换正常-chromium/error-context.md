# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ac.spec.ts >> CSP AC审批端E2E测试 >> ✅ 审核工作台 >> 8. 三级Tab切换正常
- Location: e2e/ac.spec.ts:122:9

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6]:
    - generic [ref=e8]: 审核工作台
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]: 待审核
        - generic [ref=e12]: "2"
      - generic [ref=e13]:
        - generic [ref=e14]: 已通过
        - generic [ref=e15]: "1"
      - generic [ref=e16]:
        - generic [ref=e17]: 已驳回
        - generic [ref=e18]: "1"
    - generic [ref=e20]:
      - checkbox [ref=e22]
      - generic [ref=e23]: 全选
    - generic [ref=e24]:
      - generic [ref=e25]:
        - checkbox [ref=e28]
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]: 2026年3月
            - generic [ref=e33]: 待审核
          - generic [ref=e34]: 雅诗兰黛·杭州万象城FSS
          - generic [ref=e35]:
            - generic [ref=e36]: 米晓妮 · BA
            - generic [ref=e37]: 4/19 17:48
      - generic [ref=e38]:
        - checkbox [ref=e41]
        - generic [ref=e42]:
          - generic [ref=e43]:
            - generic [ref=e44]: 2026年3月
            - generic [ref=e46]: 待审核
          - generic [ref=e47]: 雅诗兰黛·杭州西湖银泰FSS
          - generic [ref=e48]:
            - generic [ref=e49]: 王小红 · BA
            - generic [ref=e50]: 4/18 17:48
  - iframe [ref=e51]:
    - generic [ref=f1e2]:
      - text: "Compiled with problems:"
      - button "X" [ref=f1e3] [cursor=pointer]
      - generic [ref=f1e4]:
        - text: ERROR
        - generic [ref=f1e5]: "Conflict: Multiple assets emit different content to the same filename index.html"
  - iframe [ref=e52]:
    - generic [ref=f2e2]:
      - heading "Failed to compile." [level=3] [ref=f2e4]
      - generic [ref=f2e6]: "Conflict: Multiple assets emit different content to the same filename index.html"
```