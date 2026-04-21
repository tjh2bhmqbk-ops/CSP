import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Textarea } from '@tarojs/components'
import { ApprovalTask } from '../../utils/types'
import { STATUS_CONFIG, APPROVAL_TASKS_KEY, formatMoney, formatMonthDisplay } from '../../utils/constants'

export default function ApprovalDetailPage() {
  const router = useRouter()
  const taskId = router.params.taskId || ''
  const [task, setTask] = useState<ApprovalTask | null>(null)
  const [remark, setRemark] = useState('')

  useEffect(() => {
    loadTask()
  }, [taskId])

  const loadTask = () => {
    try {
      const tasks = Taro.getStorageSync<ApprovalTask[]>(APPROVAL_TASKS_KEY) || []
      const found = tasks.find(t => t.id === taskId)
      if (found) setTask(found)
    } catch (e) { console.error('Failed to load task:', e) }
  }

  const handleApprove = () => {
    Taro.showModal({
      title: '审核通过',
      content: '确认通过该月报？',
      success: (res) => {
        if (res.confirm) updateStatus('approved')
      }
    })
  }

  const handleReject = () => {
    if (!remark.trim()) {
      Taro.showToast({ title: '请输入驳回原因', icon: 'none' })
      return
    }
    Taro.showModal({
      title: '审核驳回',
      content: `确认驳回该月报？原因：${remark}`,
      success: (res) => {
        if (res.confirm) updateStatus('rejected', remark)
      }
    })
  }

  const handleReturn = () => {
    if (!remark.trim()) {
      Taro.showToast({ title: '请输入退回原因', icon: 'none' })
      return
    }
    updateStatus('rejected', remark)
  }

  const updateStatus = (status: 'approved' | 'rejected', reason?: string) => {
    try {
      const tasks = Taro.getStorageSync<ApprovalTask[]>(APPROVAL_TASKS_KEY) || []
      const updated = tasks.map(t => t.id === taskId ? { ...t, status, rejectReason: reason } : t)
      Taro.setStorageSync(APPROVAL_TASKS_KEY, updated)
      setTask(prev => prev ? { ...prev, status, rejectReason: reason } : null)
      Taro.showToast({ title: status === 'approved' ? '已通过' : '已驳回', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 800)
    } catch (e) { console.error('Failed to update status:', e) }
  }

  const formatDateTime = (isoStr: string) => {
    const d = new Date(isoStr)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  if (!task) {
    return (
      <View className="detail-page">
        <View className="empty-state"><Text className="empty-text">任务不存在</Text></View>
      </View>
    )
  }

  return (
    <View className="detail-page">
      <View className="detail-header">
        <Text className="detail-month">{formatMonthDisplay(task.month)} 月报</Text>
        <View className="detail-status" style={{ color: STATUS_CONFIG[task.status]?.color, backgroundColor: STATUS_CONFIG[task.status]?.bgColor }}>
          <Text>{STATUS_CONFIG[task.status]?.label}</Text>
        </View>
      </View>

      <View className="info-card">
        <View className="info-row"><Text className="info-label">柜台</Text><Text className="info-value">{task.counterName}</Text></View>
        <View className="info-row"><Text className="info-label">上报人</Text><Text className="info-value">{task.submitterName} · {task.submitterRole}</Text></View>
        <View className="info-row"><Text className="info-label">提交时间</Text><Text className="info-value">{formatDateTime(task.submitTime)}</Text></View>
        {task.rejectReason && <View className="info-row"><Text className="info-label">驳回原因</Text><Text className="info-value --warning">{task.rejectReason}</Text></View>}
      </View>

      <View className="data-card">
        <Text className="card-title">竞品销售数据</Text>
        <View className="data-table">
          <View className="table-header">
            <Text className="th">品牌</Text><Text className="th">柜台状态</Text><Text className="th">销售额</Text>
          </View>
          {task.monthlyReport.competitors.map((c, idx) => (
            <View key={idx} className="table-row">
              <Text className="td">{c.brand}</Text>
              <Text className="td">{c.counterStatus === 'normal' ? '营业中' : c.counterStatus === 'renovation' ? '装修中' : '撤柜'}</Text>
              <Text className="td">{formatMoney(c.sales)}</Text>
            </View>
          ))}
        </View>
      </View>

      {task.status === 'pending' && (
        <View className="action-card">
          <Text className="action-title">审批意见</Text>
          <Textarea className="remark-input" value={remark} onInput={(e) => setRemark(e.detail.value)} placeholder="请输入审批意见（驳回时必填）" />
          <View className="action-btns">
            <View className="btn --primary" onClick={handleApprove}><Text>审核通过</Text></View>
            <View className="btn --outline" onClick={handleReject}><Text>驳回</Text></View>
            <View className="btn --outline" onClick={handleReturn}><Text>退回修改</Text></View>
          </View>
        </View>
      )}
    </View>
  )
}
