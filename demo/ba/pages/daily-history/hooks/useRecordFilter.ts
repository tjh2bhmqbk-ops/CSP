import { useMemo } from 'react'
import { DailyReport, ReportStatus } from '@/utils/types'

interface UseRecordFilterProps {
  records: DailyReport[]
  statusFilter?: ReportStatus | 'all'
  monthFilter?: string
}

/**
 * 记录筛选逻辑 Hook
 */
export function useRecordFilter({ records, statusFilter = 'all', monthFilter }: UseRecordFilterProps) {
  const filtered = useMemo(() => {
    let result = [...records]

    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter)
    }

    if (monthFilter) {
      result = result.filter((r) => r.date.startsWith(monthFilter))
    }

    return result
  }, [records, statusFilter, monthFilter])

  const totalCount = records.length
  const filteredCount = filtered.length

  return { filtered, totalCount, filteredCount } as const
}
