import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { DailyReport } from '@/utils/types'
import { STATUS_CONFIG, formatMoney, formatDateToCN } from '@/utils/constants'

interface RecordCardProps {
  record: DailyReport
  onViewDetail: (record: DailyReport) => void
  onEdit: (date: string) => void
}

const RecordCard: React.FC<RecordCardProps> = ({ record, onViewDetail, onEdit }) => {
  const statusInfo = STATUS_CONFIG[record.status]
  const isRejected = record.status === 'rejected'

  return (
    <View className="record-card">
      {/* 顶栏：日期 + 状态 */}
      <View className="record-card__header">
        <Text className="record-card__date">{formatDateToCN(record.date)}</Text>
        <View
          className={`record-card__badge --${record.status}`}
          style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}
        >
          <Text className="record-card__badge-text">{statusInfo.label}</Text>
        </View>
      </View>

      {/* 数据摘要 */}
      <View className="record-card__summary">
        {record.competitors.map((comp) => (
          <View key={comp.brand} className="record-card__summary-item">
            <Text className="record-card__summary-brand">{comp.brand}</Text>
            <Text className="record-card__summary-value">
              {formatMoney(comp.sales)}
              <Text className="record-card__summary-unit">元</Text>
            </Text>
          </View>
        ))}
      </View>

      {/* 驳回原因 */}
      {isRejected && record.rejectReason && (
        <View className="record-card__reject">
          <Text className="record-card__reject-label">驳回原因</Text>
          <Text className="record-card__reject-text">{record.rejectReason}</Text>
        </View>
      )}

      {/* 操作按钮 */}
      <View className="record-card__actions">
        <View
          className="record-card__btn --outline"
          onClick={() => onViewDetail(record)}
        >
          <Text className="record-card__btn-text --outline">查看详情</Text>
        </View>
        <View
          className="record-card__btn --solid"
          onClick={() => onEdit(record.date)}
        >
          <Text className="record-card__btn-text --solid">
            {isRejected ? '修改重提' : '修改'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default RecordCard
