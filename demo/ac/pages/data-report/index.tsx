import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { ApprovalTask } from '../../utils/types'
import { STATUS_CONFIG, APPROVAL_TASKS_KEY, formatMoney, formatMonthDisplay, getPastMonthStr } from '../../utils/constants'
import AcTabBar from '../../components/AcTabBar'

type ReportType = 'daily' | 'monthly'

interface DailyReport {
  date: string
  counterName: string
  totalSales: number
  status: 'submitted' | 'not_submitted'
}

const MONTH_OPTIONS = [
  getPastMonthStr(1), getPastMonthStr(2), getPastMonthStr(3),
  getPastMonthStr(4), getPastMonthStr(5), getPastMonthStr(6),
]
const MONTH_LABELS = MONTH_OPTIONS.map(m => formatMonthDisplay(m))

function getTodayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getDateLabel(dateStr: string): string {
  const [y, m, day] = dateStr.split('-')
  return `${y}年${parseInt(m)}月${parseInt(day)}日`
}

function generateDailyData(): DailyReport[] {
  const today = getTodayStr()
  const counters = [
    '雅诗兰黛 · 杭州万象城FSS',
    '雅诗兰黛 · 杭州西湖银泰FSS',
    '雅诗兰黛 · 杭州武林银泰FSS',
    '雅诗兰黛 · 庆春银泰FSS',
    '雅诗兰黛 · 湖滨银泰FSS',
  ]
  return counters.map((c, i) => ({
    date: today,
    counterName: c,
    totalSales: [12580, 9860, 15230, 11200, 18750][i],
    status: i < 3 ? 'submitted' : 'not_submitted',
  }))
}

export default function DataReportPage() {
  const [reportType, setReportType] = useState<ReportType>('monthly')
  const [tasks, setTasks] = useState<ApprovalTask[]>([])
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([])

  // 筛选状态
  const [dailyDate, setDailyDate] = useState(getTodayStr())
  const [monthIdx, setMonthIdx] = useState(0)

  useEffect(() => { loadData() }, [])

  const loadData = () => {
    try {
      const stored = Taro.getStorageSync<ApprovalTask[]>(APPROVAL_TASKS_KEY) || []
      setTasks(stored)
      setDailyReports(generateDailyData())
    } catch (e) { console.error('Failed to load data:', e) }
  }

  const onDailyDateChange = (e: any) => {
    const val = e.detail.value
    setDailyDate(val)
    // 重新生成模拟数据（不同日期不同状态）
    const counters = [
      '雅诗兰黛 · 杭州万象城FSS',
      '雅诗兰黛 · 杭州西湖银泰FSS',
      '雅诗兰黛 · 杭州武林银泰FSS',
      '雅诗兰黛 · 庆春银泰FSS',
      '雅诗兰黛 · 湖滨银泰FSS',
    ]
    const seed = val.split('-').join('')
    setDailyReports(counters.map((c, i) => ({
      date: val,
      counterName: c,
      totalSales: [12580, 9860, 15230, 11200, 18750][i],
      status: (parseInt(seed) + i) % 3 === 0 ? 'not_submitted' : 'submitted',
    })))
  }

  const selectedMonth = MONTH_OPTIONS[monthIdx]
  const monthlyTasks = tasks.filter(t => t.month === selectedMonth)

  const dailyStatusMap: Record<string, { text: string; color: string; bg: string }> = {
    submitted: { text: '已提交', color: '#1E3A5F', bg: '#EBF5FF' },
    not_submitted: { text: '未提交', color: '#999999', bg: '#F5F5F5' },
  }

  return (
    <View className="report-page">
      <View className="page-header">
        <Text className="page-title">数据报表</Text>
      </View>

      <View className="type-switch">
        <View className={`type-item ${reportType === 'daily' ? '--active' : ''}`} onClick={() => setReportType('daily')}>
          <Text>日报</Text>
        </View>
        <View className={`type-item ${reportType === 'monthly' ? '--active' : ''}`} onClick={() => setReportType('monthly')}>
          <Text>月报</Text>
        </View>
      </View>

      {/* 日期/月份筛选 */}
      <View className="date-picker-bar">
        {reportType === 'daily' ? (
          <Picker mode="date" value={dailyDate} onChange={onDailyDateChange}>
            <View className="date-picker-item">
              <Text className="date-picker-icon">📅</Text>
              <Text className="date-picker-text">{getDateLabel(dailyDate)}</Text>
              <Text className="date-picker-arrow">⌄</Text>
            </View>
          </Picker>
        ) : (
          <Picker mode="selector" range={MONTH_LABELS} value={monthIdx} onChange={(e) => setMonthIdx(e.detail.value)}>
            <View className="date-picker-item">
              <Text className="date-picker-icon">📅</Text>
              <Text className="date-picker-text">{MONTH_LABELS[monthIdx]}</Text>
              <Text className="date-picker-arrow">⌄</Text>
            </View>
          </Picker>
        )}
      </View>

      <View className="report-content">
        {reportType === 'daily' && dailyReports.length === 0 ? (
          <View className="empty-state">
            <Text className="empty-text">暂无日报数据</Text>
          </View>
        ) : reportType === 'monthly' && monthlyTasks.length === 0 ? (
          <View className="empty-state">
            <Text className="empty-text">暂无月报数据</Text>
          </View>
        ) : (
          <View className="report-table">
            <View className="table-header">
              <Text className="th --date">{reportType === 'daily' ? '日期' : '月份'}</Text>
              <Text className="th --counter">柜台</Text>
              <Text className="th --amount">金额</Text>
              <Text className="th --status">状态</Text>
            </View>
            {reportType === 'daily' ? (
              dailyReports.map((item, idx) => {
                const st = dailyStatusMap[item.status]
                return (
                  <View key={idx} className="table-row">
                    <Text className="td --date">{getDateLabel(item.date).slice(5)}</Text>
                    <Text className="td --counter">{item.counterName}</Text>
                    <Text className="td --amount">{item.status === 'submitted' ? formatMoney(item.totalSales) : '-'}</Text>
                    <View className="td --status">
                      <View className="status-tag" style={{ color: st.color, backgroundColor: st.bg }}>
                        <Text>{st.text}</Text>
                      </View>
                    </View>
                  </View>
                )
              })
            ) : (
              monthlyTasks.map((task, idx) => (
                <View key={idx} className="table-row">
                  <Text className="td --date">{formatMonthDisplay(task.month)}</Text>
                  <Text className="td --counter">{task.counterName}</Text>
                  <Text className="td --amount">{formatMoney(task.monthlyReport.competitors.reduce((sum, c) => sum + c.sales, 0))}</Text>
                  <View className="td --status">
                    <View className="status-tag" style={{ color: STATUS_CONFIG[task.status]?.color, backgroundColor: STATUS_CONFIG[task.status]?.bgColor }}>
                      <Text>{STATUS_CONFIG[task.status]?.label}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </View>
    </View>
  )
}
