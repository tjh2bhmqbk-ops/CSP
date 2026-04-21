import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AbnormalCounter } from '../../utils/types'
import { ABNORMAL_COUNTERS_KEY } from '../../utils/constants'

export default function AbnormalCounterPage() {
  const [counters, setCounters] = useState<AbnormalCounter[]>([])

  useEffect(() => { loadData() }, [])

  const loadData = () => {
    try {
      const stored = Taro.getStorageSync<AbnormalCounter[]>(ABNORMAL_COUNTERS_KEY)
      if (stored && stored.length > 0) {
        setCounters(stored)
      } else {
        // 无数据时使用模拟数据
        setCounters(mockCounters)
        Taro.setStorageSync(ABNORMAL_COUNTERS_KEY, mockCounters)
      }
    } catch (e) { console.error('Failed to load data:', e) }
  }

  // 只显示未上报类型
  const filteredCounters = counters.filter(c => c.abnormalType === 'not_submitted')

  const handleUrge = (counter: AbnormalCounter) => {
    Taro.showModal({
      title: '催办通知',
      content: `确认向 ${counter.baName} 发送催办通知？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '催办已发送', icon: 'success' })
        }
      }
    })
  }

  const formatTime = (isoStr: string) => {
    const d = new Date(isoStr)
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }

  return (
    <View className="abnormal-page">
      <View className="page-header">
        <Text className="page-title">异常柜台</Text>
        <Text className="page-subtitle">共 {filteredCounters.length} 个未上报柜台</Text>
      </View>

      <View className="tab-switch single-tab">
        <View className='tab-item --active'>
          <Text className="tab-text">未上报</Text>
          <Text className="tab-count">{filteredCounters.length}</Text>
        </View>
      </View>

      <View className="counter-list">
        {filteredCounters.length === 0 ? (
          <View className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
            </svg>
            <Text className="empty-text">暂无未上报柜台</Text>
          </View>
        ) : filteredCounters.map(counter => (
          <View key={counter.id} className="counter-card">
            <View className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke={counter.abnormalType === 'not_submitted' ? '#FAAD14' : '#F5222D'} strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </View>
            <View className="card-content">
              <View className="card-header">
                <Text className="counter-name">{counter.counterName}</Text>
                <Text className="alert-time">{formatTime(counter.alertTime)}</Text>
              </View>
              <View className="card-ba">
                <Text className="ba-label">BA：</Text>
                <Text className="ba-name">{counter.baName}</Text>
              </View>
              <Text className="card-detail">{counter.detail}</Text>
            </View>
            <View className="card-action">
              <View className="urge-btn" onClick={() => handleUrge(counter)}>
                <Text>催办</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

// 模拟数据：未上报柜台列表
const mockCounters: AbnormalCounter[] = [
  {
    id: '1',
    counterName: '雅诗兰黛 · 杭州万象城店',
    baName: '米晓妮',
    alertTime: '2026-08-22T10:00:00Z',
    detail: '8月22日日报未提交，已逾期1天',
    abnormalType: 'not_submitted'
  },
  {
    id: '2',
    counterName: '雅诗兰黛 · 庆春银泰',
    baName: 'Amy',
    alertTime: '2026-08-21T10:00:00Z',
    detail: '8月21日日报未提交，已逾期2天',
    abnormalType: 'not_submitted'
  },
  {
    id: '3',
    counterName: '雅诗兰黛 · 阪神阪急',
    baName: 'Ella',
    alertTime: '2026-08-20T10:00:00Z',
    detail: '8月20日日报未提交，已逾期3天',
    abnormalType: 'not_submitted'
  }
]
