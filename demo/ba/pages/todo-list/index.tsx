import React, { useState, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { DailyReport } from '@/utils/types'
import { STATUS_CONFIG, formatDateToCN, getPastDateStr } from '@/utils/constants'
import { getAllReportsSync, getMonthlyReportsSync } from '@/utils/storage'
import RecordDetailModal from './components/TodoDetailModal'

interface TodoItem {
  id: string
  type: string
  title: string
  desc: string
  time: string
  statusText?: string
  statusColor?: string
  statusBg?: string
  linkedDate?: string
  linkedRecord?: DailyReport | any
}

function TodoListPage() {
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailItem, setDetailItem] = useState<TodoItem | null>(null)

  // 从 storage + 模拟生成待办列表
  const allRecords = getAllReportsSync()
  const monthlyRecords = getMonthlyReportsSync()
  const now = new Date()

  const todoItems: TodoItem[] = []

  // 1. 今日未提交提醒
  const todayStr = getPastDateStr(0)
  const todayRecord = allRecords.find(r => r.date === todayStr && r.status === 'submitted')
  if (!todayRecord) {
    todoItems.push({
      id: 'today-due', type: 'daily_due',
      title: '今日日报尚未提交', desc: '请及时填写今日竞品销售数据',
      time: '系统提醒 · 今天', statusText: '待上报', statusColor: '#FAAD14', statusBg: '#FFF7E6',
    })
  }

  // 2. 近期已提交记录（显示为已完成）
  allRecords.filter(r => r.status === 'submitted').slice(0, 4).forEach(r => {
    todoItems.push({
      id: `done-${r.date}`, type: 'daily_done',
      title: `${formatDateToCN(r.date)} 日报已提交`,
      desc: `销售额合计 ¥${r.competitors.reduce((s,c)=>s+c.sales,0).toLocaleString()}，状态正常`,
      time: `${new Date(r.submitTime).toLocaleDateString('zh-CN')}`,
      statusText: '已提交', statusColor: '#1E3A5F', statusBg: '#EBF5FF',
      linkedDate: r.date, linkedRecord: r,
    })
  })

  // 3. 草稿记录
  allRecords.filter(r => r.status === 'draft').forEach(r => {
    todoItems.push({
      id: `draft-${r.date}`, type: 'daily_draft',
      title: `${formatDateToCN(r.date)} 有未完成草稿`,
      desc: '上次编辑未保存或保存了草稿，点击继续编辑',
      time: `${new Date(r.submitTime).toLocaleDateString('zh-CN')} · 草稿`,
      statusText: '继续填写', statusColor: '#666', statusBg: '#F5F5F5',
      linkedDate: r.date, linkedRecord: r,
    })
  })

  // 4. 月报相关
  monthlyRecords.forEach(mr => {
    if (mr.status === 'draft') {
      todoItems.push({
        id: `m-draft-${mr.month}`, type: 'monthly_draft',
        title: `${mr.month.replace('-','年')}月 月报草稿未提交`,
        desc: '月度汇总数据已保存草稿，请尽快完善并提交',
        time: `${new Date(mr.submitTime).toLocaleDateString('zh-CN')} · 草稿`,
        statusText: '待提交', statusColor: '#FAAD14', statusBg: '#FFF7E6',
      })
    }
    if (mr.status === 'submitted') {
      todoItems.push({
        id: `m-sub-${mr.month}`, type: 'monthly_submitted',
        title: `${mr.month.replace('-','年')}月 月报已提交`,
        desc: `销售额合计 ¥${mr.competitors.reduce((s,c)=>s+c.sales,0).toLocaleString()}`,
        time: `${new Date(mr.submitTime).toLocaleDateString('zh-CN')}`,
        statusText: '已提交', statusColor: '#1E3A5F', statusBg: '#EBF5FF',
      })
    }
    if (mr.status === 'approved') {
      todoItems.push({
        id: `m-app-${mr.month}`, type: 'monthly_approved',
        title: `${mr.month.replace('-','年')}月 月报审核通过`,
        desc: '月度报告审核通过，无需操作',
        time: `${new Date(mr.submitTime).toLocaleDateString('zh-CN')}`,
        statusText: '已通过', statusColor: '#52C41A', statusBg: '#F6FFED',
      })
    }
  })

  // 5. 系统通知（月报截止提醒）
  todoItems.push(
    { id: 'notice-2', type: 'system_info',
      title: '本月月报截止日期：25日',
      desc: '还有5天时间，请及时汇总本月各竞品销售数据',
      time: '系统提醒 · 今天',
      statusText: '待处理', statusColor: '#FAAD14', statusBg: '#FFF7E6',
    }
  )

  /** 查看详情 */
  const handleViewDetail = useCallback((item: TodoItem) => { setDetailItem(item); setDetailVisible(true) }, [])
  /** 关闭 */
  const handleClose = useCallback(() => { setDetailVisible(false); setTimeout(() => setDetailItem(null), 300) }, [])

  /** 点击处理 */
  const handleItemClick = useCallback((item: TodoItem) => {
    if (item.type.includes('draft')) {
      Taro.navigateTo({ url: `/pages/daily/index?date=${item.linkedDate}&mode=edit` })
    } else if (item.type === 'daily_done' || item.type === 'daily_draft') {
      handleViewDetail(item)
    } else if (item.type.startsWith('monthly_')) {
      if (item.type.includes('draft')) {
        Taro.navigateTo({ url: '/pages/monthly/index' })
      } else {
        handleViewDetail(item)
      }
    } else if (item.type === 'system_warn') {
      // 异常数据 → 跳转异常数据页
      Taro.navigateTo({ url: '/pages/abnormal-data/index' })
    } else if (item.type === 'daily_due') {
      Taro.navigateTo({ url: '/pages/daily/index' })
    } else {
      handleViewDetail(item)
    }
  }, [])

  return (
    <View className="todo-list-page">
      <View className="nav-bar">
        <View className="nav-bar__back" onClick={() => Taro.navigateBack()}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </View>
        <Text className="nav-bar__title">全部待办</Text>
        <Text className="nav-bar__count">{todoItems.length}项</Text>
      </View>

      <ScrollView scrollY className="todo-scroll">
        <View className="todo-list">
          {todoItems.map(item => (
            <View key={item.id} className={`todo-item ${item.type}`} onClick={() => handleItemClick(item)}>
              {/* 图标 */}
              <View className={`todo-item__icon --${item.iconType || item.type}`}>
                {getIconSvg(item.type)}
              </View>
              <View className="todo-item__content">
                <Text className="todo-item__title">{item.title}</Text>
                <Text className="todo-item__desc">{item.desc}</Text>
                <Text className="todo-item__time">{item.time}</Text>
              </View>
              {item.statusText && (
                <View className="todo-item__status" style={{ background: item.statusBg }}>
                  <Text style={{ color: item.statusColor }}>{item.statusText}</Text>
                </View>
              )}
              {(item.linkedDate || !item.type.includes('empty') && !item.type.includes('system')) && (
                <Text className="todo-item__arrow">›</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <RecordDetailModal visible={detailVisible} item={detailItem} onClose={handleClose} />
    </View>
  )
}

/** 根据 type 返回 SVG 图标 */
function getIconSvg(type: string): React.ReactNode {
  switch (true) {
    case type.includes('due'): return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAAD14" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    case type.includes('done') || type.includes('approved'): return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#52C41A" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg>
    case type.includes('draft'): return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
    case type === 'system_warn': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5222D" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    default: return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
  }
}

export default TodoListPage
