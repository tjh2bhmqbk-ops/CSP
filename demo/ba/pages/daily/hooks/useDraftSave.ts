import { useEffect, useRef, useCallback } from 'react'
import { DailyReport } from '@/utils/types'
import { saveReportSync, getReportSync } from '@/utils/storage'
import { DRAFT_SAVE_INTERVAL } from '@/utils/constants'

interface UseDraftSaveOptions {
  date: string
  getSnapshot: () => DailyReport
}

/**
 * 自动保存草稿 Hook
 * - 表单变化后延迟 N 秒自动保存到 Storage
 * - 页面加载时自动恢复草稿
 */
export function useDraftSave(options: UseDraftSaveOptions) {
  const { date, getSnapshot } = options
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dirtyRef = useRef(false)
  const initializedRef = useRef(false)

  /** 触发防抖保存 */
  const markDirty = useCallback(() => {
    dirtyRef.current = true
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const snapshot = getSnapshot()
      saveReportSync({ ...snapshot, status: 'pending', submitTime: new Date().toISOString() })
      dirtyRef.current = false
    }, DRAFT_SAVE_INTERVAL)
  }, [getSnapshot])

  /** 立即保存草稿 */
  const saveNow = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const snapshot = getSnapshot()
    saveReportSync({ ...snapshot, status: 'pending', submitTime: new Date().toISOString() })
    dirtyRef.current = false
  }, [getSnapshot])

  /** 清除草稿 */
  const clearDraft = useCallback(() => {
    try {
      Taro.removeStorageSync(`csp_daily_${date}`)
    } catch { /* ignore */ }
  }, [date])

  /** 加载草稿 */
  const loadDraft = useCallback((): DailyReport | null => {
    return getReportSync(date)
  }, [date])

  // 页面加载时尝试恢复草稿（仅首次）
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      // 由调用方决定是否使用草稿，这里仅提供加载能力
    }
  }, [date])

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { markDirty, saveNow, clearDraft, loadDraft } as const
}
