import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Checkbox } from '@tarojs/components'
import { ApprovalTask } from '../../utils/types'
import { STATUS_CONFIG, APPROVAL_TASKS_KEY, formatMonthDisplay } from '../../utils/constants'

type WorkbenchTab = 'pending' | 'approved' | 'rejected'

export default function ApprovalWorkbenchPage() {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('pending')
  const [tasks, setTasks] = useState<ApprovalTask[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => { loadData() }, [])

  const loadData = () => {
    try {
      const storedTasks = Taro.getStorageSync<ApprovalTask[]>(APPROVAL_TASKS_KEY) || []
      setTasks(storedTasks)
    } catch (e) { console.error('Failed to load data:', e) }
  }

  const filteredTasks = tasks.filter(task => task.status === activeTab)

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const selectAll = () => {
    const allIds = filteredTasks.map(t => t.id)
    setSelectedIds(prev => prev.length === allIds.length ? [] : allIds)
  }

  const batchApprove = () => {
    if (selectedIds.length === 0) return
    Taro.showModal({
      title: '批量通过',
      content: `确认通过选中的 ${selectedIds.length} 条记录？`,
      success: (res) => {
        if (res.confirm) {
          const updated = tasks.map(t => selectedIds.includes(t.id) ? { ...t, status: 'approved' as const } : t)
          setTasks(updated)
          Taro.setStorageSync(APPROVAL_TASKS_KEY, updated)
          setSelectedIds([])
          Taro.showToast({ title: '已通过', icon: 'success' })
        }
      }
    })
  }

  const batchReject = () => {
    if (selectedIds.length === 0) return
    Taro.showModal({
      title: '批量驳回',
      content: `确认驳回选中的 ${selectedIds.length} 条记录？`,
      editable: true,
      placeholderText: '请输入驳回原因',
      success: (res) => {
        if (res.confirm && res.content) {
          const updated = tasks.map(t => selectedIds.includes(t.id) ? { ...t, status: 'rejected' as const, rejectReason: res.content } : t)
          setTasks(updated)
          Taro.setStorageSync(APPROVAL_TASKS_KEY, updated)
          setSelectedIds([])
          Taro.showToast({ title: '已驳回', icon: 'success' })
        }
      }
    })
  }

  const navigateToDetail = (taskId: string) => {
    Taro.navigateTo({ url: `/pages/approval-detail/index?taskId=${taskId}` })
  }

  const formatDateTime = (isoStr: string) => {
    const d = new Date(isoStr)
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <View className="workbench-page">
      <View className="page-header">
        <Text className="page-title">审核工作台</Text>
      </View>

      {/* 筛选栏 - 城市切换、时间筛选（禁用状态） */}
      <View className="filter-bar">
        <View className="filter-item">
          <Text>全部城市</Text>
          <Text className="filter-arrow">▼</Text>
        </View>
        <View className="filter-item">
          <Text>全部时间</Text>
          <Text className="filter-arrow">▼</Text>
        </View>
      </View>

      {/* 三级Tab */}
      <View className="tab-bar">
        {(['pending', 'approved', 'rejected'] as WorkbenchTab[]).map(tab => (
          <View key={tab} className={`tab-item ${activeTab === tab ? '--active' : ''}`} onClick={() => { setActiveTab(tab); setSelectedIds([]) }}>
            <Text className="tab-text">{STATUS_CONFIG[tab]?.label}</Text>
            <Text className="tab-count">{tasks.filter(t => t.status === tab).length}</Text>
          </View>
        ))}
      </View>

      {/* 批量操作栏 */}
      {activeTab === 'pending' && filteredTasks.length > 0 && (
        <View className="batch-bar">
          <View className="batch-select" onClick={selectAll}>
            <Checkbox checked={selectedIds.length === filteredTasks.length && filteredTasks.length > 0} />
            <Text className="batch-text">全选</Text>
          </View>
          {selectedIds.length > 0 && (
            <View className="batch-actions">
              <View className="batch-btn --approve" onClick={batchApprove}><Text>批量通过</Text></View>
              <View className="batch-btn --reject" onClick={batchReject}><Text>批量驳回</Text></View>
            </View>
          )}
        </View>
      )}

      {/* 任务列表 */}
      <View className="workbench-list">
        {filteredTasks.length === 0 ? (
          <View className="empty-state">
            <Text className="empty-text">暂无{STATUS_CONFIG[activeTab]?.label}记录</Text>
          </View>
        ) : filteredTasks.map(task => (
          <View key={task.id} className="workbench-item">
            {activeTab === 'pending' && (
              <View className="item-checkbox" onClick={(e) => { e.stopPropagation(); toggleSelect(task.id) }}>
                <Checkbox checked={selectedIds.includes(task.id)} />
              </View>
            )}
            <View className="item-content" onClick={() => navigateToDetail(task.id)}>
              <View className="item-header">
                <Text className="item-month">{formatMonthDisplay(task.month)}</Text>
                <View className="status-tag" style={{ color: STATUS_CONFIG[task.status]?.color, backgroundColor: STATUS_CONFIG[task.status]?.bgColor }}>
                  <Text>{STATUS_CONFIG[task.status]?.label}</Text>
                </View>
              </View>
              <Text className="item-counter">{task.counterName}</Text>
              <View className="item-footer">
                <Text className="item-submitter">{task.submitterName} · {task.submitterRole}</Text>
                <Text className="item-time">{formatDateTime(task.submitTime)}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
