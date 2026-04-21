import React from 'react'
import { View, Text, Input } from '@tarojs/components'
import { CompetitorData } from '@/utils/types'
import StatusSelector from './StatusSelector'

interface CompetitorCardProps {
  data: CompetitorData
  index: number
  onSalesChange: (idx: number, val: number) => void
  onStatusChange: (idx: number, status: CompetitorData['counterStatus']) => void
}

const CompetitorCard: React.FC<CompetitorCardProps> = ({
  data,
  index,
  onSalesChange,
  onStatusChange,
}) => {
  const isDisabled = data.counterStatus !== 'normal'
  const isCore = data.type === 'core'

  const handleSalesInput = (e) => {
    const val = e.detail.value
    onSalesChange(index, val === '' ? 0 : parseFloat(val) || 0)
  }

  return (
    <View className={`comp-card ${isDisabled ? '--disabled' : ''}`}>
      {/* 顶栏 */}
      <View className="comp-card__header">
        <View className="comp-card__brand-row">
          <View className={`comp-card__dot ${isCore ? '--core' : ''}`} />
          <Text className="comp-card__brand">{data.brand}</Text>
        </View>
        <StatusSelector
          value={data.counterStatus}
          onChange={(s) => onStatusChange(index, s)}
          type={data.type}
        />
      </View>

      {/* 输入区 — 仅销售额 */}
      <View className="comp-card__body">
        <View className="comp-card__row">
          <Text className="comp-card__label">销售额</Text>
          <Input
            className="comp-card__input"
            type="digit"
            placeholder="请输入销售额"
            value={data.sales > 0 ? String(data.sales) : ''}
            disabled={isDisabled}
            onInput={handleSalesInput}
          />
          <Text className="comp-card__unit">元</Text>
        </View>
      </View>

      {isDisabled && (
        <Text className="comp-card__hint">
          {data.counterStatus === 'renovation' ? '该柜台当前装修中，暂无需录入数据' : '该柜台已撤柜'}
        </Text>
      )}
    </View>
  )
}

export default CompetitorCard
