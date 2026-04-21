import React, { useState, useCallback, useMemo, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { DailyReport } from '@/utils/types'
import { STATUS_CONFIG, formatMoney, formatDateToCN, generateDemoDailyReports } from '@/utils/constants'
import { getAllReportsSync } from '@/utils/storage'
import RecordDetailModal from './components/RecordDetailModal'

// 立即生成 Demo 数据
generateDemoDailyReports()

/** 筛选 Tab 选项（无审核逻辑，移除已通过） */
const FILTER_TABS: { key: 'all' | 'submitted' | 'draft'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'submitted', label: '已提交' },
  { key: 'draft', label: '草稿' },
]

function DailyHistoryPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'draft'>('all')
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailRecord, setDetailRecord] = useState<DailyReport | null>(null)

  // 获取所有日报记录
  const allRecords = useMemo(() => getAllReportsSync(), [])

  /** 按状态过滤 */
  const filtered = useMemo(() =>
    statusFilter === 'all' ? allRecords : allRecords.filter(r => r.status === statusFilter),
    [allRecords, statusFilter]
  )

  /** 统计各状态数量 */
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allRecords.length }
    for (const r of allRecords) {
      counts[r.status] = (counts[r.status] || 0) + 1
    }
    return counts
  }, [allRecords])

  /** 汇总统计 */
  const summary = useMemo(() => {
    const totalSales = allRecords.reduce((s, r) => s + r.competitors.reduce((ss, c) => ss + c.sales, 0), 0)
    const submitted = allRecords.filter(r => r.status === 'submitted').length
    const drafts = allRecords.filter(r => r.status === 'draft').length
    return { totalSales, submitted, drafts, total: allRecords.length }
  }, [allRecords])

  /** 查看详情 */
  const handleViewDetail = useCallback((record: DailyReport) => {
    setDetailRecord(record)
    setDetailVisible(true)
  }, [])

  /** 关闭详情 */
  const handleCloseDetail = useCallback(() => {
    setDetailVisible(false)
    setTimeout(() => setDetailRecord(null), 300)
  }, [])

  /** 跳转编辑 */
  const handleEdit = useCallback((date: string) => {
    Taro.navigateTo({ url: `/pages/daily/index?date=${date}&mode=edit` })
  }, [])

  /** 跳转到上报页面 */
  const handleGoReport = useCallback(() => {
    Taro.navigateTo({ url: '/pages/daily/index' })
  }, [])

  return (
    <View className="history-page">
      {/* ====== 导航头部 ====== */}
      <View className="nav-bar">
        <View className="nav-bar__back" onClick={() => Taro.navigateBack()}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        </View>
        <Text className="nav-bar__title">每日历史数据</Text>
        <View className="nav-bar__placeholder" />
      </View>

      <View className="history-page__content">
        {/* ====== 统计概览卡片 ====== */}
        <View className="stats-card">
          <View className="stats-card__row">
            <View className="stats-card__item">
              <Text className="stats-card__value">{summary.total}</Text>
              <Text className="stats-card__label">总记录</Text>
            </View>
            <View className="stats-card__divider" />
            <View className="stats-card__item">
              <Text className="stats-card__value --blue">{summary.submitted}</Text>
              <Text className="stats-card__label">已提交</Text>
            </View>
            <View className="stats-card__divider" />
            <View className="stats-card__item">
              <Text className="stats-card__value --gray">{summary.drafts}</Text>
              <Text className="stats-card__label">草稿</Text>
            </View>
          </View>
          <View className="stats-card__footer">
            <Text className="stats-card__footer-text">合计销售额</Text>
            <Text className="stats-card__footer-value">¥ {summary.totalSales.toLocaleString('zh-CN')}</Text>
          </View>
        </View>

        {/* ====== 筛选工具栏 ====== */}
        <View className="filter-bar">
          <ScrollView scrollX className="filter-tabs-scroll">
            <View className="filter-tabs">
              {FILTER_TABS.map(t => (
                <View
                  key={t.key}
                  className={`filter-tab ${statusFilter === t.key ? '--active' : ''}`}
                  onClick={() => setStatusFilter(t.key)}
                >
                  <Text className={`filter-tab__text ${statusFilter === t.key ? '--active' : ''}`}>
                    {t.label}
                  </Text>
                  {statusCounts[t.key] !== undefined && (
                    <Text className={`filter-tab__count ${statusFilter === t.key ? '--active' : ''}`}>
                      {statusCounts[t.key]}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
          <Text className="filter-summary">显示 {filtered.length} / {allRecords.length} 条</Text>
        </View>

        {/* ====== 记录列表 / 空状态 ====== */}
        {filtered.length === 0 ? (
          <View className="empty-state">
            <View className="empty-state__icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#DDD" strokeWidth="1.2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </View>
            <Text className="empty-state__title">
              {statusFilter === 'all' ? '暂无上报记录' : `暂无${STATUS_CONFIG[statusFilter]?.label || ''}记录`}
            </Text>
            <Text className="empty-state__desc">
              {statusFilter === 'all' ? '去上报第一份竞品数据吧' : '切换筛选条件查看其他记录'}
            </Text>
            {statusFilter === 'all' && (
              <View className="empty-state__btn" onClick={handleGoReport}>
                <Text className="empty-state__btn-text">去上报</Text>
              </View>
            )}
          </View>
        ) : (
          <ScrollView scrollY className="record-list">
            {filtered.map((record) => {
              const statusInfo = STATUS_CONFIG[record.status] || STATUS_CONFIG['submitted']
              const totalSales = record.competitors.reduce((s, c) => s + c.sales, 0)
              const isDraft = record.status === 'draft'

              return (
                <View key={record.date} className="record-card">
                  {/* 顶栏 */}
                  <View className="record-card__header">
                    <View className="record-card__date-row">
                      <Text className="record-card__date">{formatDateToCN(record.date)}</Text>
                      <View className="record-card__badge" style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}>
                        <Text className="record-card__badge-text">{statusInfo.label}</Text>
                      </View>
                    </View>
                    {record.submitTime && (
                      <Text className="record-card__time">
                        {new Date(record.submitTime).toLocaleDateString('zh-CN')}
                      </Text>
                    )}
                  </View>

                  {/* 数据摘要 */}
                  <View className="record-card__summary">
                    {record.competitors.map(comp => (
                      <View key={comp.brand} className="record-card__summary-item">
                        <View className="record-card__summary-brand-row">
                          <View className={`record-card__summary-dot ${comp.type === 'core' ? '--core' : ''}`} />
                          <Text className="record-card__summary-brand">{comp.brand}</Text>
                        </View>
                        <Text className="record-card__summary-value">
                          {formatMoney(comp.sales)}
                          <Text className="record-card__summary-unit">元</Text>
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* 合计行 */}
                  <View className="record-card__total-row">
                    <Text className="record-card__total-label">合计</Text>
                    <Text className="record-card__total-value">¥{totalSales.toLocaleString()}</Text>
                  </View>

                  {/* 备注 */}
                  {record.remark && (
                    <View className="record-card__remark">
                      <Text className="record-card__remark-text">{record.remark}</Text>
                    </View>
                  )}

                  {/* 操作按钮 */}
                  <View className="record-card__actions">
                    <View className="record-card__btn --outline" onClick={() => handleViewDetail(record)}>
                      <Text className="record-card__btn-text --outline">查看详情</Text>
                    </View>
                    {isDraft && (
                      <View className="record-card__btn --solid" onClick={() => handleEdit(record.date)}>
                        <Text className="record-card__btn-text --solid">继续编辑</Text>
                      </View>
                    )}
                  </View>
                </View>
              )
            })}

            {/* 底部占位 */}
            <View style={{ height: '40rpx' }} />
          </ScrollView>
        )}
      </View>

      {/* 详情弹窗 */}
      <RecordDetailModal
        visible={detailVisible}
        record={detailRecord}
        onClose={handleCloseDetail}
        onEdit={handleEdit}
      />
    </View>
  )
}

export default DailyHistoryPage
