import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

function HomePage() {
  // TabBar 导航：使用 switchTab（H5 下会使用 history API）
  const switchTab = (path: string) => {
    // 强制使用 window.location 跳转（H5 tabBar 问题修复）
    window.location.hash = '#' + path
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
      <View className="notice-banner" onClick={() => navigateTo('/pages/abnormal-data/index')}>
        <View className="notice-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </View>
        <Text className="notice-text">您今天上报的数据存在异常，请修改或补充后重新提交</Text>
      </View>

      {/* ========== 待处理事项（合并后唯一入口） ========== */}
      <View className="performance-section animate-in">
        <Text className="section-header">每日业绩</Text>
        <View className="section-card">
          <View className="entry-row">
            <View className="entry-item" onClick={() => navigateTo('/pages/daily/index')}>
              <View className="entry-icon-wrap">
                <svg className="entry-icon-svg" viewBox="0 0 36 36" fill="none" stroke="#555" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8v18M12 14l6-6 6 6"/>
                  <path d="M6 26h24"/>
                  <path d="M8 28v2a2 2 0 002 2h16a2 2 0 002-2v-2"/>
                </svg>
              </View>
              <Text className="entry-label">每日数据上报</Text>
            </View>
            <View className="entry-divider" />
            <View className="entry-item" onClick={() => navigateTo('/pages/daily-history/index')}>
              <View className="entry-icon-wrap">
                <svg className="entry-icon-svg" viewBox="0 0 36 36" fill="none" stroke="#555" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M24 6l6 6L14 28H8v-6z"/>
                  <path d="M22 8l6 6"/>
                  <path d="M8 28l2 2"/>
                  <line x1="14" y1="22" x2="22" y2="14"/>
                </svg>
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
            <View className="entry-item" onClick={() => navigateTo('/pages/monthly/index')}>
              <View className="entry-icon-wrap">
                <svg className="entry-icon-svg" viewBox="0 0 36 36" fill="none" stroke="#555" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8v18M12 14l6-6 6 6"/>
                  <path d="M6 26h24"/>
                  <path d="M8 28v2a2 2 0 002 2h16a2 2 0 002-2v-2"/>
                </svg>
              </View>
              <Text className="entry-label">每月数据上报</Text>
            </View>
            <View className="entry-divider" />
            <View className="entry-item" onClick={() => navigateTo('/pages/monthly-history/index')}>
              <View className="entry-icon-wrap">
                <svg className="entry-icon-svg" viewBox="0 0 36 36" fill="none" stroke="#555" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M24 6l6 6L14 28H8v-6z"/>
                  <path d="M22 8l6 6"/>
                  <path d="M8 28l2 2"/>
                  <line x1="14" y1="22" x2="22" y2="14"/>
                </svg>
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            <Text>待处理事项</Text>
          </View>
          <Text className="section-more" onClick={() => navigateTo('/pages/todo-list/index')}>全部 ›</Text>
        </View>
        <View className="todo-list">
          <View className="todo-item" onClick={() => navigateTo('/pages/daily-history/index')}>
            <View className="todo-item-icon --warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAAD14" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#52C41A" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg>
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
        <View className={`tabbar-item ${true ? '--active' : ''}`}>
          <View className="tabbar-icon">
            <svg className="tabbar-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </View>
          <Text className="tabbar-label">首页</Text>
        </View>

        <View className="tabbar-item" onClick={() => navigateTo('/pages/daily/index')}>
          <View className="tabbar-icon">
            <svg className="tabbar-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </View>
          <Text className="tabbar-label">上报</Text>
        </View>

        <View className="tabbar-item" onClick={() => switchTab('/pages/profile/index')}>
          <View className="tabbar-icon">
            <svg className="tabbar-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </View>
          <Text className="tabbar-label">我的</Text>
        </View>
      </View>
    </View>
  )
}

export default HomePage
