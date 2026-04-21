import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { CounterStatus, CompetitorType } from '@/utils/types'
import { COUNTER_STATUS_OPTIONS } from '@/utils/constants'

interface StatusSelectorProps {
  value: CounterStatus
  onChange: (status: CounterStatus) => void
  type?: CompetitorType
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ value, onChange, type }) => {
  const handleSelect = () => {
    Taro.showActionSheet({
      itemList: COUNTER_STATUS_OPTIONS.map((o) => o.label),
      success: (res) => {
        const selected = COUNTER_STATUS_OPTIONS[res.tapIndex]
        onChange(selected.value)
      },
    })
  }

  const currentLabel = COUNTER_STATUS_OPTIONS.find((o) => o.value === value)?.label || '营业中'

  const statusClassMap: Record<CounterStatus, string> = {
    normal: '--normal',
    renovation: '--renovation',
    closed: '--closed',
  }

  return (
    <View className={`status-selector ${statusClassMap[value]}`} onClick={handleSelect}>
      <Text className="status-selector__text">{currentLabel}</Text>
      <View className="status-selector__arrow">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </View>
    </View>
  )
}

export default StatusSelector
