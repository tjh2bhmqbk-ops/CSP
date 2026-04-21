export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/daily/index',
    'pages/daily-history/index',
    'pages/monthly/index',
    'pages/monthly-history/index',
    'pages/todo-list/index',
    'pages/profile/index',
    'pages/abnormal-data/index',
    'pages/competitor-mgmt/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: 'CSP导购端',
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
        text: '首页',
        iconPath: '/images/tab-home.png',
        selectedIconPath: '/images/tab-home-active.png',
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
