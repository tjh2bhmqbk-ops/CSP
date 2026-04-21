import React from 'react'
import { View, Text } from '@tarojs/components'
import { MonthlyReport } from '@/utils/types'
import { STATUS_CONFIG, formatMoney } from '@/utils/constants'

interface Props {
  visible: boolean
  record: MonthlyReport | null
  onClose: () => void
}

function formatMonthCN(monthStr: string): string {
  const [y, m] = monthStr.split('-')
  return `${y}年${parseInt(m)}月`
}

const RecordDetailModal: React.FC<Props> = ({ visible, record, onClose }) => {
  if (!visible || !record) return null

  const statusInfo = STATUS_CONFIG[record.status]
  const totalSales = record.competitors.reduce((s, c) => s + c.sales, 0)
  const totalTraffic = record.competitors.reduce((s, c) => s + c.traffic, 0)
  const totalBigOrders = record.competitors.reduce((s, c) => s + c.bigOrders, 0)

  return (
    <View className="modal-mask" onClick={onClose}>
      <View className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <View className="modal-header">
          <Text className="modal-title">月报详情</Text>
          <View className="modal-close" onClick={onClose}>
            <Text>✕</Text>
          </View>
        </View>

        {/* 基本信息 */}
        <View className="modal-body">
          <View className="info-row">
            <Text className="info-label">上报月份</Text>
            <Text className="info-value">{formatMonthCN(record.month)}</Text>
          </View>
          <View className="info-row">
            <Text className="info-label">提交时间</Text>
            <Text className="info-value">{new Date(record.submitTime).toLocaleString('zh-CN')}</Text>
          </View>
          <View className="info-row">
            <Text className="info-label">审核状态</Text>
            <View
              className="status-badge"
              style={{ background: statusInfo.bgColor, color: statusInfo.color }}
            >
              <Text className="status-badge-text">{statusInfo.label}</Text>
            </View>
          </View>

          {/* 汇总 */}
          <View className="summary-section">
            <Text className="summary-section__title">数据汇总</Text>
            <View className="summary-grid">
              <View className="summary-cell">
                <Text className="summary-cell__val">¥{totalSales.toLocaleString()}</Text>
                <Text className="summary-cell__label">总销售额</Text>
              </View>
              <View className="summary-cell">
                <Text className="summary-cell__val">{totalTraffic}</Text>
                <Text className="summary-cell__label">总客流量(人)</Text>
              </View>
              <View className="summary-cell">
                <Text className="summary-cell__val">{totalBigOrders}</Text>
                <Text className="summary-cell__label">总大单数(笔)</Text>
              </View>
            </View>
          </View>

          {/* 各竞品明细 */}
          <View className="detail-section">
            <Text className="detail-section__title">竞品明细</Text>
            {record.competitors.map(comp => (
              <View key={comp.brand} className="detail-item">
                <View className="detail-item__head">
                  <View className={`dot ${comp.type === 'core' ? '--core' : ''}`} />
                  <Text className="detail-brand">{comp.brand}</Text>
                  <Text className="detail-status">
                    {comp.counterStatus === 'normal' ? '营业中' : comp.counterStatus === 'renovation' ? '装修中' : '撤柜'}
                  </Text>
                </View>
                <View className="detail-item__data">
                  <View><Text className="d-label">销售额：</Text><Text className="d-val">¥{formatMoney(comp.sales)}</Text></View>
                  {comp.counterStatus === 'normal' && (
                    <>
                      <View><Text className="d-label">客流量：</Text><Text className="d-val">{comp.traffic || '-'}人</Text></View>
                      <View><Text className="d-label">大单数：</Text><Text className="d-val">{comp.bigOrders || '-'}笔</Text></View>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* 备注 */}
          {record.remark && (
            <View className="remark-section">
              <Text className="remark-section__title">备注说明</Text>
              <Text className="remark-text">{record.remark}</Text>
            </View>
          )}

          {/* 驳回原因 */}
          {record.status === 'rejected' && record.rejectReason && (
            <View className="reject-section">
              <Text className="reject-section__title">驳回原因</Text>
              <Text className="reject-text">{record.rejectReason}</Text>
            </View>
          )}
        </View>

        {/* 底部按钮 */}
        <View className="modal-footer">
          <View className="modal-btn" onClick={onClose}>
            <Text className="modal-btn-text">关闭</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default RecordDetailModal
