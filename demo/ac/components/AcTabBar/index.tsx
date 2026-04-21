import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'

type TabKey = 'home' | 'workbench' | 'report' | 'profile'

interface AcTabBarProps {
  active: TabKey
}

const TABS: { key: TabKey; label: string; url: string; icon: string; activeIcon: string }[] = [
  { key: 'home', label: '首页', url: '/pages/ac-home/index', icon: '/images/tab-home.png', activeIcon: '/images/tab-home-active.png' },
  { key: 'workbench', label: '工作台', url: '/pages/approval-workbench/index', icon: '/images/tab-approval.png', activeIcon: '/images/tab-approval-active.png' },
  { key: 'report', label: '报表', url: '/pages/data-report/index', icon: '/images/tab-report.png', activeIcon: '/images/tab-report-active.png' },
  { key: 'profile', label: '我的', url: '/pages/ac-profile/index', icon: '/images/tab-profile.png', activeIcon: '/images/tab-profile-active.png' },
]

export default function AcTabBar({ active }: AcTabBarProps) {
  const handleTap = (tab: typeof TABS[0]) => {
    if (tab.key === active) return
    Taro.redirectTo({ url: tab.url })
  }

  return (
    <>
      <View className="page-spacer" />
      <View className="ac-tabbar safe-bottom">
        {TABS.map(tab => (
          <View
            key={tab.key}
            className={`ac-tabbar-item ${tab.key === active ? '--active' : ''}`}
            onClick={() => handleTap(tab)}
          >
            <View className="ac-tabbar-icon">
              <Image
                className="ac-tabbar-icon-img"
                src={tab.key === active ? tab.activeIcon : tab.icon}
                mode="aspectFit"
              />
            </View>
            <Text className="ac-tabbar-label">{tab.label}</Text>
          </View>
        ))}
      </View>
    </>
  )
}
