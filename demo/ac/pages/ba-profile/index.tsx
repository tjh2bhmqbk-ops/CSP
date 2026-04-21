import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

function ProfilePage() {
  const navigateTo = (url: string) => Taro.navigateTo({ url })

  const menuItems = [
    {
      icon: <Text className="menu-icon-text">📊</Text>,
      title: '日竞品数据上报', desc: '查看所有已上报的日报记录',
      url: '/pages/ba-daily-history/index',
    },
    {
      icon: <Text className="menu-icon-text">📈</Text>,
      title: '月竞品数据上报', desc: '查看所有月度汇总报告',
      url: '/pages/ba-monthly-history/index',
    },
    {
      icon: <Text className="menu-icon-text">🏪</Text>,
      title: '竞品柜台维护', desc: '配置各竞品开关店状态',
      url: '/pages/ba-competitor-mgmt/index',
    },
    {
      icon: <Text className="menu-icon-text">✅</Text>,
      title: '待处理事项', desc: '查看待处理、异常等提醒',
      url: '/pages/ba-todo-list/index',
    },
  ]

  return (
    <View className="profile-page">
      <View className="profile-header">
        <Image className="profile-avatar" src="/images/avatar.png" mode="aspectFill" />
        <Text className="profile-name">米晓妮</Text>
        <Text className="profile-role">雅诗兰黛 · 杭州万象城 FSS</Text>
        <Text className="profile-id">ID: CSP20260420001</Text>
      </View>

      <View className="stats-bar">
        <View className="stats-item"><Text className="stats-val">15</Text><Text className="stats-label">已上报</Text></View>
        <View className="stats-divider" />
        <View className="stats-item"><Text className="stats-val --active">2</Text><Text className="stats-label">待处理</Text></View>
        <View className="stats-divider" />
        <View className="stats-item"><Text className="stats-val">13</Text><Text className="stats-label">已完成</Text></View>
      </View>

      <View className="menu-section">
        <Text className="menu-section__title">功能服务</Text>
        <View className="menu-list">
          {menuItems.map((item, idx) => (
            <View key={idx} className="menu-item" onClick={() => navigateTo(item.url)}>
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
        <Text className="footer-ver">CSP 导购端 v1.0.0</Text>
        <Text className="footer-copy">© 2026 竞品情报系统</Text>
      </View>
    </View>
  )
}

export default ProfilePage
