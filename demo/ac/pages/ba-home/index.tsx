import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

function HomePage() {
  // TabBar 导航：小程序内使用 navigateTo 跳转
  const switchTab = (path: string) => {
    Taro.navigateTo({ url: path })
  }

  const navigateTo = (url: string) => {
    Taro.navigateTo({ url })
  }

  return (
    <View className="home-page">
      {/* ========== 顶部背景区 ========== */}
      <View className="header-bg">
        <Image
          className="header-bg-img"
          src="/images/header-bg.png"
          mode="aspectFill"
        />
        <Text className="header-title">竞品上报系统</Text>
      </View>

      {/* ========== 用户信息卡片 ========== */}
      <View className="user-card">
        <View className="user-info-row">
          <Image
            className="user-avatar"
            src="/images/avatar.png"
            mode="aspectFill"
          />
          <View className="user-details">
            <View className="user-name-row">
              <Text className="user-name">米晓妮</Text>
              <Text className="user-role">雅诗兰黛·杭州万象城FSS</Text>
            </View>
            <Text className="user-location">浙江省&nbsp;&nbsp;杭州市&nbsp;&nbsp;万象城购物中心</Text>
          </View>
        </View>
      </View>

      {/* ========== 提醒横幅（可点击跳转异常数据） ========== */}
      <View className="notice-banner" onClick={() => navigateTo('/pages/ba-abnormal-data/index')}>
        <View className="notice-icon">
          <Text className="notice-icon-text">🔔</Text>
        </View>
        <Text className="notice-text">您今天上报的数据存在异常，请修改或补充后重新提交</Text>
      </View>

      {/* ========== 待处理事项（合并后唯一入口） ========== */}
      <View className="performance-section animate-in">
        <Text className="section-header">每日业绩</Text>
        <View className="section-card">
          <View className="entry-row">
            <View className="entry-item" onClick={() => navigateTo('/pages/ba-daily/index')}>
              <View className="entry-icon-wrap">
                <Text className="entry-icon-text">📊</Text>
              </View>
              <Text className="entry-label">每日数据上报</Text>
            </View>
            <View className="entry-divider" />
            <View className="entry-item" onClick={() => navigateTo('/pages/ba-daily-history/index')}>
              <View className="entry-icon-wrap">
                <Text className="entry-icon-text">📝</Text>
              </View>
              <Text className="entry-label">历史数据查询修改</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ========== 月度业绩 ========== */}
      <View className="performance-section animate-in --delay">
        <Text className="section-header">月度业绩</Text>
        <View className="section-card">
          <View className="entry-row">
            <View className="entry-item" onClick={() => navigateTo('/pages/ba-monthly/index')}>
              <View className="entry-icon-wrap">
                <Text className="entry-icon-text">📅</Text>
              </View>
              <Text className="entry-label">每月数据上报</Text>
            </View>
            <View className="entry-divider" />
            <View className="entry-item" onClick={() => navigateTo('/pages/ba-monthly-history/index')}>
              <View className="entry-icon-wrap">
                <Text className="entry-icon-text">📝</Text>
              </View>
              <Text className="entry-label">历史数据查询修改</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ========== 本月进度 ========== */}
      <View className="progress-section animate-in --delay2">
        <View className="progress-card">
          <View className="progress-header">
            <View className="progress-title">
              <Text className="progress-title-icon">📈</Text>
              <Text>本月上报情况</Text>
            </View>
            <Text className="progress-value">65%</Text>
          </View>
          <View className="progress-bar-bg">
            <View className="progress-bar-fill" style={{ width: '65%' }} />
          </View>
          <Text className="progress-desc">已上报15天，待审核3天，还需上报16天</Text>
        </View>
      </View>

      {/* ========== 待处理事项 ========== */}
      <View className="todo-section animate-in --delay3">
        <View className="section-title-row">
          <View className="section-title-text">
            <Text className="section-title-icon">📋</Text>
            <Text>待处理事项</Text>
          </View>
          <Text className="section-more" onClick={() => navigateTo('/pages/ba-todo-list/index')}>全部 ›</Text>
        </View>
        <View className="todo-list">
          <View className="todo-item" onClick={() => navigateTo('/pages/ba-daily-history/index')}>
            <View className="todo-item-icon --warning">
              <Text className="todo-item-icon-text">⚠️</Text>
            </View>
            <View className="todo-item-content">
              <Text className="todo-item-title">月报审核未通过，需修改重新提交</Text>
              <Text className="todo-item-time">待处理 · 2小时前</Text>
            </View>
            <View className="todo-item-status"><Text>待修改</Text></View>
            <Text className="todo-item-arrow">›</Text>
          </View>

          <View className="todo-item">
            <View className="todo-item-icon --success">
              <Text className="todo-item-icon-text">✅</Text>
            </View>
            <View className="todo-item-content">
              <Text className="todo-item-title">4月18日 日报已审核通过</Text>
              <Text className="todo-item-time">已完成 · 昨天</Text>
            </View>
            <View className="todo-item-status --approved"><Text>已通过</Text></View>
            <Text className="todo-item-arrow">›</Text>
          </View>
        </View>
      </View>

      {/* 底部占位 */}
      <View className="page-spacer" />

      {/* ========== 底部TabBar ========== */}
      <View className="tabbar safe-bottom">
        <View className="tabbar-item --active">
          <View className="tabbar-icon">
            <Image className="tabbar-icon-img" src="/images/tab-home-active.png" mode="aspectFit" />
          </View>
          <Text className="tabbar-label">首页</Text>
        </View>

        <View className="tabbar-item" onClick={() => navigateTo('/pages/ba-daily/index')}>
          <View className="tabbar-icon">
            <Image className="tabbar-icon-img" src="/images/tab-report.png" mode="aspectFit" />
          </View>
          <Text className="tabbar-label">上报</Text>
        </View>

        <View className="tabbar-item" onClick={() => switchTab('/pages/ba-profile/index')}>
          <View className="tabbar-icon">
            <Image className="tabbar-icon-img" src="/images/tab-profile.png" mode="aspectFit" />
          </View>
          <Text className="tabbar-label">我的</Text>
        </View>
      </View>
    </View>
  )
}

export default HomePage
