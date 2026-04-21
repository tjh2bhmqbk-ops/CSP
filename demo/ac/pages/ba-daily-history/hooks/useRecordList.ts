import { useState, useEffect, useCallback } from 'react'
import { DailyReport } from '@/utils/types'
import { getAllReports } from '@/utils/storage'

/**
 * 历史记录列表 Hook
 * 支持按条件筛选
 */
export function useRecordList() {
  const [records, setRecords] = useState<DailyReport[]>([])
  const [loading, setLoading] = useState(true)

  /** 加载全部记录 */
  const loadRecords = useCallback(async () => {
    setLoading(true)
    try {
      const list = await getAllReports()
      // 如果无数据，生成模拟数据用于演示
      if (list.length === 0) {
        setRecords(generateMockData())
      } else {
        setRecords(list)
      }
    } catch {
      setRecords([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  return { records, loading, reload: loadRecords } as const
}

/** 生成近7天模拟数据（Demo 用） */
function generateMockData(): DailyReport[] {
  const brands = ['Dior', 'LV', 'Gucci', 'Hermès']
  const statuses: ('pending' | 'approved' | 'rejected')[] = [
    'approved', 'approved', 'approved',
    'pending', 'rejected', 'approved', 'pending',
  ]

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i - 1)
    const dateStr = date.toISOString().slice(0, 10)
    const status = statuses[i]

    return {
      date: dateStr,
      status,
      submitTime: `${dateStr}T${String(9 + Math.floor(Math.random() * 10)).padStart(2, '0')}:00:00`,
      remark: status === 'rejected' ? '部分品牌销售额异常偏高' : '',
      competitors: brands.map((brand, j) => ({
        brand,
        type: brand === 'Gucci' ? 'normal' as const : 'core' as const,
        counterStatus: 'normal' as const,
        sales: Math.floor(5000 + Math.random() * 40000),
        traffic: Math.floor(10 + Math.random() * 100),
        bigOrders: Math.floor(Math.random() * 5),
      })),
      rejectReason: status === 'rejected' ? 'Dior销售额与历史均值偏差超过200%，请核实后重新提交' : undefined,
    }
  })
}
