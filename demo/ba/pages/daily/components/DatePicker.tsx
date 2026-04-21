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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
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
          <View className="date-picker__arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </View>
        </View>
      </Picker>
    </View>
  )
}

export default DatePicker
