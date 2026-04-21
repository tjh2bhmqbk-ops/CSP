import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { DailyReport } from '@/utils/types'
import { STATUS_CONFIG, formatDateToCN, formatMoney, COUNTER_STATUS_OPTIONS } from '@/utils/constants'

interface RecordDetailModalProps {
  visible: boolean
  record: DailyReport | null
  onClose: () => void
  onEdit?: (date: string) => void
}

const RecordDetailModal: React.FC<RecordDetailModalProps> = ({ visible, record, onClose, onEdit }) => {
  if (!visible || !record) return null

  const statusInfo = STATUS_CONFIG[record.status] || STATUS_CONFIG['submitted']
  const totalSales = record.competitors.reduce((s, c) => s + c.sales, 0)

  const handleEdit = () => {
    onClose()
    setTimeout(() => {
      if (onEdit) onEdit(record.date)
      else Taro.navigateTo({ url: `/pages/ba-daily/index?date=${record.date}&mode=edit` })
    }, 300)
  }

  return (
    <View className="modal-mask" onClick={onClose}>
      <View className="modal-content" catchMove onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <View className="modal-header">
          <Text className="modal-title">上报详情</Text>
          <View className="modal-close" onClick={onClose}>
            <Text className="modal-close-text">✕</Text>
          </View>
        </View>

        {/* 基本信息 */}
        <View className="modal-section">
          <View className="modal-row">
            <Text className="modal-row__label">上报日期</Text>
            <Text className="modal-row__value">{formatDateToCN(record.date)}</Text>
          </View>
          <View className="modal-row">
            <Text className="modal-row__label">提交时间</Text>
            <Text className="modal-row__value">
              {record.submitTime ? new Date(record.submitTime).toLocaleString('zh-CN') : '-'}
            </Text>
          </View>
          <View className="modal-row">
            <Text className="modal-row__label">审核状态</Text>
            <View className="modal-status-badge" style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}>
              <Text>{statusInfo.label}</Text>
            </View>
          </View>
        </View>

        {/* 竞品明细 */}
        <View className="modal-section">
          <Text className="modal-section__title">竞品业绩明细</Text>
          {record.competitors.map((comp) => {
            const statusLabel = COUNTER_STATUS_OPTIONS.find(o => o.value === comp.counterStatus)?.label || '营业中'
            return (
              <View key={comp.brand} className="modal-comp-item">
                <View className="modal-comp-item__header">
                  <View style={{ display: 'flex', alignItems: 'center', gap: '10rpx' }}>
                    <View className={`modal-comp-dot ${comp.type === 'core' ? '--core' : ''}`} />
                    <Text className="modal-comp-name">{comp.brand}</Text>
                  </View>
                  <Text className="modal-comp-status">{statusLabel}</Text>
                </View>
                <View className="modal-comp-detail">
                  <Text className="modal-comp-detail__item">销售额：{formatMoney(comp.sales)} 元</Text>
                  <Text className="modal-comp-detail__item">客流量：{comp.traffic || '-'} 人</Text>
                  <Text className="modal-comp-detail__item">大单数：{comp.bigOrders || '-'} 笔</Text>
                </View>
              </View>
            )
          })}

          {/* 合计 */}
          <View className="modal-total-row">
            <Text className="modal-total-label">合计销售额</Text>
            <Text className="modal-total-value">¥ {totalSales.toLocaleString('zh-CN')}</Text>
          </View>
        </View>

        {/* 备注 */}
        {record.remark && (
          <View className="modal-section">
            <Text className="modal-section__title">备注说明</Text>
            <Text className="modal-remark">{record.remark}</Text>
          </View>
        )}

        {/* 驳回原因 */}
        {record.status === 'rejected' && record.rejectReason && (
          <View className="modal-reject-box">
            <Text className="modal-reject-label">驳回原因</Text>
            <Text className="modal-reject-text">{record.rejectReason}</Text>
          </View>
        )}

        {/* 底部操作 */}
        <View className="modal-footer">
          <View className="modal-footer__btn --close" onClick={onClose}>
            <Text className="modal-footer__btn-text --close">关闭</Text>
          </View>
          {(record.status === 'draft' || record.status === 'rejected') && (
            <View className="modal-footer__btn --edit" onClick={handleEdit}>
              <Text className="modal-footer__btn-text --edit">编辑修改</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default RecordDetailModal
