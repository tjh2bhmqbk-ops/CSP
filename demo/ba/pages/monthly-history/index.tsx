import React, { useState, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { MonthlyReport, ReportStatus } from '@/utils/types'
import { STATUS_CONFIG, formatMoney, generateDemoMonthlyReports } from '@/utils/constants'
import { getMonthlyReportsSync } from '@/utils/storage'
import RecordDetailModal from './components/RecordDetailModal'

// 立即生成 Demo 数据
generateDemoMonthlyReports()

function MonthlyHistoryPage() {
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all')
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailRecord, setDetailRecord] = useState<MonthlyReport | null>(null)

  // 从 storage 读取所有月报记录
  const allRecords = getMonthlyReportsSync()
  const filtered = statusFilter === 'all' ? allRecords : allRecords.filter(r => r.status === statusFilter)

  /** 查看详情 */
  const handleViewDetail = useCallback((record: MonthlyReport) => {
    setDetailRecord(record)
    setDetailVisible(true)
  }, [])

  /** 关闭详情 */
  const handleCloseDetail = useCallback(() => {
    setDetailVisible(false)
    setTimeout(() => setDetailRecord(null), 300)
  }, [])

  /** 跳转编辑 */
  const handleEdit = useCallback((month: string) => {
    Taro.navigateTo({
      url: `/pages/monthly/index?month=${month}&mode=edit`,
    })
  }, [])

  return (
    <View className="monthly-hist-page">
      {/* 导航头部 */}
      <View className="nav-bar">
        <View className="nav-bar__back" onClick={() => Taro.navigateBack()}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </View>
        <Text className="nav-bar__title">每月数据查询</Text>
        <View className="nav-bar__placeholder" />
      </View>

      {/* 内容区 */}
      <View className="monthly-hist-page__content">
        {/* 筛选 Tab */}
        <View className="filter-bar">
          <View className="filter-tabs">
            {(['all', 'submitted', 'approved', 'draft'] as const).map(s => (
              <View
                key={s}
                className={`filter-tab ${statusFilter === s ? '--active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                <Text className={`filter-tab-text ${statusFilter === s ? '--active' : ''}`}>
                  {s === 'all' ? '全部' : STATUS_CONFIG[s]?.label || s}
                </Text>
              </View>
            ))}
          </View>
          <Text className="filter-count">共{filtered.length}条</Text>
        </View>

        {/* 记录列表 / 空状态 */}
        {filtered.length === 0 ? (
          <View className="empty-state">
            <View className="empty-state__icon">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#DDD" strokeWidth="1"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </View>
            <Text className="empty-state__title">暂无月报记录</Text>
            <Text className="empty-state__desc">去上报第一份月度数据吧</Text>
            <View
              className="empty-state__btn"
              onClick={() => Taro.navigateTo({ url: '/pages/monthly/index' })}
            >
              <Text className="empty-state__btn-text">去上报</Text>
            </View>
          </View>
        ) : (
          <ScrollView scrollY className="record-list">
            {filtered.map((record) => {
              const statusInfo = STATUS_CONFIG[record.status] || STATUS_CONFIG['submitted']
              const isDraft = record.status === 'draft'
              const totalSales = record.competitors.reduce((s, c) => s + c.sales, 0)

              return (
                <View key={record.month} className="record-card">
                  {/* 头部 */}
                  <View className="record-card__header">
                    <View className="record-card__month-info">
                      <Text className="record-card__month">{formatMonthCN(record.month)}</Text>
                      <Text className="record-card__total">合计 ¥{totalSales.toLocaleString()}</Text>
                    </View>
                    <View
                      className="record-card__badge"
                      style={{ background: statusInfo.bgColor, color: statusInfo.color }}
                    >
                      <Text className="record-card__badge-txt">{statusInfo.label}</Text>
                    </View>
                  </View>

                  {/* 摘要 */}
                  <View className="record-card__summary">
                    {record.competitors.map(c => (
                      <View key={c.brand} className="summary-item">
                        <Text className="summary-brand">{c.brand}</Text>
                        <Text className="summary-val">{formatMoney(c.sales)}<Text className="summary-unit">元</Text></Text>
                      </View>
                    ))}
                  </View>

                  {/* 驳回原因 — 草稿时显示提示 */}
                  {isDraft && (
                    <View className="record-card__reject-box">
                      <Text className="reject-label">草稿状态：</Text>
                      <Text className="reject-text">请完善数据后提交</Text>
                    </View>
                  )}

                  {/* 操作按钮 */}
                  <View className="record-card__actions">
                    <View className={`action-btn --outline`} onClick={() => handleViewDetail(record)}>
                      <Text className="action-btn-text --outline">查看详情</Text>
                    </View>
                    <View className={`action-btn --solid`} onClick={() => handleEdit(record.month)}>
                      <Text className="action-btn-text --solid">{isDraft ? '继续编辑' : '修改'}</Text>
                    </View>
                  </View>
                </View>
              )
            })}
          </ScrollView>
        )}
      </View>

      {/* 详情弹窗 */}
      <RecordDetailModal visible={detailVisible} record={detailRecord} onClose={handleCloseDetail} />
    </View>
  )
}

/** 格式化月份为中文显示 */
function formatMonthCN(monthStr: string): string {
  const [y, m] = monthStr.split('-')
  return `${y}年${parseInt(m)}月`
}

export default MonthlyHistoryPage
