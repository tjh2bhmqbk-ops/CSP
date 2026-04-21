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
      <Text className="status-selector__arrow">⌄</Text>
    </View>
  )
}

export default StatusSelector
