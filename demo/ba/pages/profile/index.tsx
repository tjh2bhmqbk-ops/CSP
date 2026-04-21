import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

function ProfilePage() {
  const navigateTo = (url: string) => Taro.navigateTo({ url })

  const menuItems = [
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
      title: '日竞品数据上报', desc: '查看所有已上报的日报记录',
      url: '/pages/daily-history/index',
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
      title: '月竞品数据上报', desc: '查看所有月度汇总报告',
      url: '/pages/monthly-history/index',
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="6" width="10" height="14" rx="1.5" ry="1.5"/><rect x="21" y="6" width="10" height="14" rx="1.5" ry="1.5"/><path d="M10 24v4M16 24v4M26 24v4M32 24v4"/><line x1="7" y1="27" x2="13" y2="27"/><line x1="23" y1="27" x2="29" y2="27"/></svg>,
      title: '竞品柜台维护', desc: '配置各竞品开关店状态',
      url: '/pages/competitor-mgmt/index',
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
      title: '待处理事项', desc: '查看待处理、异常等提醒',
      url: '/pages/todo-list/index',
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
