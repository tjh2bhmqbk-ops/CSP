import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { ACUserInfo } from '../../utils/types'
import { getACUserInfo } from '../../utils/constants'

export default function ProfilePage() {
  const [userInfo] = useState<ACUserInfo>(getACUserInfo())

  const menuItems = [
    { icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ), title: '我的审批', desc: '查看历史审批记录', url: '/pages/approval-workbench/index' },
    { icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ), title: '异常监控', desc: '异常柜台管理', url: '/pages/abnormal-counter/index' },
  ]

  const handleNavigate = (url: string) => {
    if (url) {
      // 异常监控跳转到未上报页面
      if (url.includes('abnormal-counter')) {
        Taro.switchTab({ url: '/pages/abnormal-counter/index' })
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
    </View>
  )
}
