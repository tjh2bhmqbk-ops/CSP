import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { formatDateToCN, getTodayStr } from '@/utils/constants'

interface DatePickerProps {
  value: string
  onChange: (dateStr: string) => void
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const isToday = value === getTodayStr()
  const isPast = !isToday

  /** Picker 选择日期 */
  const handlePick = (e: any) => {
    const { date } = e.detail
    // Taro Picker 返回格式 "2026-04-20"
    if (date && date !== value) {
      onChange(date)
    }
  }

  return (
    <View className="date-picker">
      <View className="date-picker__left">
        <View className="date-picker__icon">
          <Text className="date-picker__icon-text">📅</Text>
        </View>
        <Text className="date-picker__label">上报日期</Text>
      </View>

      {/* 原生日期选择器 */}
      <Picker
        mode="date"
        value={value}
        onChange={handlePick}
        end={getTodayStr()}
      >
        <View className="date-picker__right">
          <Text className={`date-picker__value ${isToday ? '--today' : ''} ${isPast ? '--past' : ''}`}>
            {formatDateToCN(value)}
          </Text>
          {isToday && <Text className="date-picker__badge">今日</Text>}
          <Text className="date-picker__arrow">›</Text>
        </View>
      </Picker>
    </View>
  )
}

export default DatePicker
