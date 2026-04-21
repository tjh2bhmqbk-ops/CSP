import { useState, useCallback } from 'react'
import { CompetitorData, FormState } from '@/utils/types'
import { COMPETITOR_CONFIG, createDefaultCompetitor, getTodayStr } from '@/utils/constants'

interface UseFormStateOptions {
  initialDate?: string
  /** 编辑模式回填数据 */
  editData?: FormState | null
}

export function useFormState(options?: UseFormStateOptions) {
  const today = options?.initialDate || getTodayStr()

  // 从编辑数据或默认配置初始化竞品列表
  const initCompetitors = (): CompetitorData[] => {
    if (options?.editData) {
      return options.editData.competitors
    }
    return COMPETITOR_CONFIG.map((c) => createDefaultCompetitor(c.brand, c.type))
  }

  const [date, setDate] = useState(today)
  const [remark, setRemark] = useState(options?.editData?.remark || '')
  const [competitors, setCompetitors] = useState<CompetitorData[]>(initCompetitors)

  /** 更新单个竞品字段 */
  const updateCompetitor = useCallback(
    (index: string | number, field: keyof CompetitorData, value: any) => {
      const idx = typeof index === 'string' ? parseInt(index) : index
      setCompetitors((prev) =>
        prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
      )
    },
    []
  )

  /** 切换柜台状态（装修中/撤柜时清空数值） */
  const changeCounterStatus = useCallback(
    (index: string | number, status: CompetitorData['counterStatus']) => {
      const idx = typeof index === 'string' ? parseInt(index) : index
      setCompetitors((prev) =>
        prev.map((c, i) => {
          if (i !== idx) return c
          const isClosed = status !== 'normal'
          return {
            ...c,
            counterStatus: status,
            sales: isClosed ? 0 : c.sales,
            traffic: isClosed ? 0 : c.traffic,
            bigOrders: isClosed ? 0 : c.bigOrders,
          }
        })
      )
    },
    []
  )

  /** 获取当前表单状态快照 */
  const getSnapshot = useCallback((): FormState => ({
    date,
    remark,
    competitors,
  }), [date, remark, competitors])

  /** 获取填写进度 */
  const getProgress = useCallback((): { filled: number; total: number } => {
    const normalOnes = competitors.filter((c) => c.counterStatus === 'normal')
    const filled = normalOnes.filter((c) => c.sales > 0).length
    return { filled, total: normalOnes.length }
  }, [competitors])

  return {
    date,
    setDate,
    remark,
    setRemark,
    competitors,
    updateCompetitor,
    changeCounterStatus,
    getSnapshot,
    getProgress,
  } as const
}
