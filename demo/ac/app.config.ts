export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/approval-workbench/index',
    'pages/approval-detail/index',
    'pages/abnormal-counter/index',
    'pages/data-report/index',
    'pages/profile/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: 'CSP审批端',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#1E3A5F',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '上报审批',
        iconPath: '/images/tab-approval.png',
        selectedIconPath: '/images/tab-approval-active.png',
      },
      {
        pagePath: 'pages/abnormal-counter/index',
        text: '异常柜台',
        iconPath: '/images/tab-abnormal.png',
        selectedIconPath: '/images/tab-abnormal-active.png',
      },
      {
        pagePath: 'pages/data-report/index',
        text: '数据报表',
        iconPath: '/images/tab-report.png',
        selectedIconPath: '/images/tab-report-active.png',
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: '/images/tab-profile.png',
        selectedIconPath: '/images/tab-profile-active.png',
      },
    ],
  },
})
