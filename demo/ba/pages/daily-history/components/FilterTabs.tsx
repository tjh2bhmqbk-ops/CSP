import React from 'react'
import { View, Text } from '@tarojs/components'
import { ReportStatus } from '@/utils/types'

interface FilterTabsProps {
  value: ReportStatus | 'all'
  onChange: (val: ReportStatus | 'all') => void
  total: number
  filteredCount: number
}

const TABS: { key: ReportStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待审核' },
  { key: 'approved', label: '已通过' },
  { key: 'rejected', label: '已驳回' },
]

const FilterTabs: React.FC<FilterTabsProps> = ({ value, onChange, total }) => (
  <View className="filter-tabs">
    <View className="filter-tabs__list">
      {TABS.map((tab) => (
        <View
          key={tab.key}
          className={`filter-tabs__item ${value === tab.key ? '--active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          <Text className={`filter-tabs__text ${value === tab.key ? '--active' : ''}`}>
            {tab.label}
          </Text>
        </View>
      ))}
    </View>
    <Text className="filter-tabs__count">共{total}条记录</Text>
  </View>
)

export default FilterTabs
