import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { ACUserInfo } from '../../utils/types'
import { getACUserInfo } from '../../utils/constants'

export default function ProfilePage() {
  const [userInfo] = useState<ACUserInfo>(getACUserInfo())

  const menuItems = [
    { icon: <Text className="menu-icon-text">📋</Text>, title: '我的审批', desc: '查看历史审批记录', url: '/pages/approval-workbench/index' },
    { icon: <Text className="menu-icon-text">📊</Text>, title: '数据报表', desc: '日报与月报统计', url: '/pages/data-report/index' },
    { icon: <Text className="menu-icon-text">🛡️</Text>, title: '异常监控', desc: '异常柜台管理', url: '/pages/abnormal-counter/index' },
  ]

  const handleNavigate = (url: string) => {
    if (url) {
      // 异常监控跳转到未上报页面
      if (url.includes('abnormal-counter')) {
        Taro.navigateTo({ url: '/pages/abnormal-counter/index' })
      } else {
        Taro.navigateTo({ url })
      }
    }
  }

  return (
    <View className="profile-page">
      <View className="profile-header">
        <Image className="profile-avatar" src="/images/avatar.png" mode="aspectFill" />
        <Text className="profile-name">{userInfo.name}</Text>
        <Text className="profile-role">{userInfo.role}</Text>
        <Text className="profile-region">{userInfo.region}</Text>
        <Text className="profile-id">工号: {userInfo.employeeCode}</Text>
      </View>

      <View className="stats-bar">
        <View className="stats-item"><Text className="stats-val">12</Text><Text className="stats-label">已审批</Text></View>
        <View className="stats-divider" />
        <View className="stats-item"><Text className="stats-val --active">2</Text><Text className="stats-label">待审批</Text></View>
        <View className="stats-divider" />
        <View className="stats-item"><Text className="stats-val">3</Text><Text className="stats-label">异常</Text></View>
      </View>

      <View className="menu-section">
        <Text className="menu-section__title">功能服务</Text>
        <View className="menu-list">
          {menuItems.map((item, idx) => (
            <View key={idx} className="menu-item" onClick={() => handleNavigate(item.url)}>
              <View className="menu-item__icon">{item.icon}</View>
              <View className="menu-item__info">
                <Text className="menu-item__title">{item.title}</Text>
                <Text className="menu-item__desc">{item.desc}</Text>
              </View>
              <Text className="menu-item__arrow">›</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="footer-info">
        <Text className="footer-ver">CSP 审批端 v1.0.0</Text>
        <Text className="footer-copy">2026 竞品情报系统</Text>
      </View>
      <AcTabBar active="profile" />
    </View>
  )
}
