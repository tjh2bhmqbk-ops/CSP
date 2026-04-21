import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default function LandingPage() {
  const navigateTo = (type: 'ba' | 'ac') => {
    const url = type === 'ba' ? '/pages/ba-home/index' : '/pages/ac-home/index'
    Taro.navigateTo({ url })
  }

  return (
    <View className="landing-page">
      {/* 顶部背景 */}
      <View className="hero-section">
        <View className="hero-content">
          <Text className="hero-icon">📊</Text>
          <Text className="hero-title">CSP竞品情报系统</Text>
          <Text className="hero-subtitle">Commercial Spy Platform</Text>
        </View>
      </View>

      {/* 选择区域 */}
      <View className="card-section">
        <Text className="section-title">选择入口</Text>

        {/* BA导购端 */}
        <View className="role-card ba" onClick={() => navigateTo('ba')}>
          <View className="card-top-bar" />
          <View className="card-content">
            <Text className="card-icon">🏪</Text>
            <Text className="card-name">导购BA端</Text>
            <Text className="card-desc">门店竞品数据上报（导购使用）</Text>
            <View className="tag-list">
              <Text className="tag">日报</Text>
              <Text className="tag">周报</Text>
              <Text className="tag">月报</Text>
              <Text className="tag">历史修改</Text>
            </View>
            <View className="badge ba-badge">
              <Text className="badge-text">导购入口</Text>
            </View>
          </View>
        </View>

        {/* AC审批端 */}
        <View className="role-card ac" onClick={() => navigateTo('ac')}>
          <View className="card-top-bar" />
          <View className="card-content">
            <Text className="card-icon">✅</Text>
            <Text className="card-name">AC审批端</Text>
            <Text className="card-desc">月报审批与数据监控（主管使用）</Text>
            <View className="tag-list">
              <Text className="tag">审批中心</Text>
              <Text className="tag">异常柜台</Text>
              <Text className="tag">数据报表</Text>
              <Text className="tag">批量操作</Text>
            </View>
            <View className="badge ac-badge">
              <Text className="badge-text">审批入口</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 底部信息 */}
      <View className="footer">
        <Text className="footer-text">CSP Demo 演示版本</Text>
      </View>
    </View>
  )
}
