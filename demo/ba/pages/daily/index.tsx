import React, { useEffect, useCallback, useState, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Textarea, Input } from '@tarojs/components'
import {
  COMPETITOR_CONFIG, COUNTER_STATUS_OPTIONS,
  createDefaultCompetitor, getTodayStr,
  generateDemoDailyReports, generateDemoMonthlyReports,
  formatDateToCN,
} from '@/utils/constants'
import { saveReportSync, getReportSync, getCompetitorConfigSync } from '@/utils/storage'
import { CompetitorData, CounterStatus } from '@/utils/types'

// 页面级同步初始化：确保 Demo 数据在渲染前就存在
generateDemoDailyReports()
generateDemoMonthlyReports()

/** 草稿自动保存间隔 */
const DRAFT_DEBOUNCE_MS = 3000

function DailyPage() {
  const router = useRouter()
  const mode = (router.params.mode as string) || 'new'
  const todayStr = getTodayStr()

  const [date, setDate] = useState(router.params.date || todayStr)
  const [remark, setRemark] = useState('')
  const [competitors, setCompetitors] = useState<CompetitorData[]>(
    () => {
      // 优先从竞品柜台维护页配置读取默认状态（含柜台开关状态）
      try {
        const savedConfig = getCompetitorConfigSync()
        if (savedConfig && savedConfig.length > 0) {
          return savedConfig.map(c => ({
            ...createDefaultCompetitor(c.brand, c.type),
            counterStatus: c.counterStatus || 'normal',
          }))
        }
      } catch {}
      return COMPETITOR_CONFIG.map(c => createDefaultCompetitor(c.brand, c.type))
    }
  )
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialMount = useRef(true)

  const isToday = date === todayStr
  const isEdit = mode === 'edit'

  // 统计：已填写的品牌数（销售额 > 0 或非正常营业状态）
  const normalCompetitors = competitors.filter(c => c.counterStatus === 'normal')
  const filledCount = normalCompetitors.filter(c => c.sales > 0).length
  const totalSales = competitors.reduce((sum, c) => sum + c.sales, 0)

  // ====== 初始化回填已有数据 ======
  useEffect(() => {
    const initialDate = router.params.date || todayStr
    const existing = getReportSync(initialDate)
    if (existing) {
      if (existing.competitors) setCompetitors(existing.competitors)
      if (existing.remark) setRemark(existing.remark)
    }
  }, [])

  // ====== 草稿自动保存 ======
  const saveDraftQuiet = useCallback(() => {
    saveReportSync({
      date,
      status: 'draft',
      submitTime: new Date().toISOString(),
      remark,
      competitors,
    })
  }, [date, remark, competitors])

  useEffect(() => {
    // 首次 mount 不触发自动保存（避免覆盖已有数据）
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current)
    draftTimerRef.current = setTimeout(saveDraftQuiet, DRAFT_DEBOUNCE_MS)
    return () => { if (draftTimerRef.current) clearTimeout(draftTimerRef.current) }
  }, [date, remark, competitors, saveDraftQuiet])

  // ====== 切换日期 ======
  const handleDateChange = useCallback((newDate: string) => {
    setDate(newDate)
    const existing = getReportSync(newDate)
    if (existing && existing.competitors) {
      setCompetitors(existing.competitors)
      setRemark(existing.remark || '')
    } else {
      // 新日期：优先使用竞品柜台维护页配置的默认状态（含柜台开关状态）
      try {
        const savedConfig = getCompetitorConfigSync()
        if (savedConfig && savedConfig.length > 0) {
          setCompetitors(savedConfig.map(c => ({
            ...createDefaultCompetitor(c.brand, c.type),
            counterStatus: c.counterStatus || 'normal',
          })))
        } else {
          setCompetitors(COMPETITOR_CONFIG.map(c => createDefaultCompetitor(c.brand, c.type)))
        }
      } catch {
        setCompetitors(COMPETITOR_CONFIG.map(c => createDefaultCompetitor(c.brand, c.type)))
      }
      setRemark('')
    }
  }, [])

  // ====== 更新竞品字段 ======
  const updateField = useCallback((idx: number, field: keyof CompetitorData, val: number | CounterStatus) => {
    setCompetitors(prev => prev.map((c, i) => {
      if (i !== idx) return c
      // 当切换为非正常营业状态时，清空数值字段
      if (field === 'counterStatus' && val !== 'normal') {
        return { ...c, counterStatus: val as CounterStatus, sales: 0, traffic: 0, bigOrders: 0 }
      }
      return { ...c, [field]: val }
    }))
  }, [])

  // ====== 存草稿（手动） ======
  const handleSaveDraft = useCallback(() => {
    saveReportSync({
      date,
      status: 'draft',
      submitTime: new Date().toISOString(),
      remark,
      competitors,
    })
    Taro.showToast({ title: '草稿已保存', icon: 'success', duration: 1500 })
  }, [date, remark, competitors])

  // ====== 提交上报 ======
  const handleSubmit = useCallback(() => {
    // 校验：至少一个营业中的品牌填写了销售额
    const hasSales = competitors.some(c => c.counterStatus === 'normal' && c.sales > 0)
    if (!hasSales) {
      Taro.showToast({ title: '请至少填写一个竞品的销售额', icon: 'none', duration: 2000 })
      return
    }

    // 校验：负数拦截
    const hasNegative = competitors.some(c => c.sales < 0 || c.traffic < 0 || c.bigOrders < 0)
    if (hasNegative) {
      Taro.showToast({ title: '数据不能为负数', icon: 'none', duration: 2000 })
      return
    }

    saveReportSync({
      date,
      status: 'submitted',
      submitTime: new Date().toISOString(),
      remark,
      competitors,
    })

    Taro.showToast({
      title: isToday ? '今日上报成功！' : '提交成功',
      icon: 'success',
      duration: 1500,
      success: () => setTimeout(() => Taro.navigateBack(), 1600),
    })
  }, [date, remark, competitors, isToday])

  // ====== 日期选择器（Taro Picker） ======
  const handleDatePickerChange = useCallback((e: any) => {
    const picked = e.detail.value
    if (picked && picked !== date) handleDateChange(picked)
  }, [date, handleDateChange])

  return (
    <View className="daily-page">
      {/* ====== 导航头部 ====== */}
      <View className="nav-bar">
        <View className="nav-bar__back" onClick={() => Taro.navigateBack()}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        </View>
        <Text className="nav-bar__title">{isEdit ? '编辑日报' : '每日竞品数据上报'}</Text>
        <View className="nav-bar__placeholder" />
      </View>

      {/* ====== 内容区 ====== */}
      <View className="daily-page__content">

        {/* 日期选择器 */}
        <View className="date-card card">
          <View className="date-card__left">
            <View className="date-card__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </View>
            <Text className="date-card__label">上报日期</Text>
          </View>
          <picker mode="date" value={date} end={todayStr} onChange={handleDatePickerChange}>
            <View className="date-card__right">
              <Text className={`date-card__value ${isToday ? '--today' : ''}`}>
                {formatDateToCN(date)}
              </Text>
              {isToday && <Text className="date-card__badge">今日</Text>}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </View>
          </picker>
        </View>

        {/* 竞品录入区 */}
        <View className="card section-competitors">
          <View className="section-header">
            <Text className="section-header__title">竞品业绩录入</Text>
            <Text className="section-header__progress">已填 {filledCount}/{normalCompetitors.length}</Text>
          </View>

          {competitors.map((comp, idx) => {
            const isDisabled = comp.counterStatus !== 'normal'
            const isCore = comp.type === 'core'

            return (
              <View key={comp.brand} className={`comp-card ${isDisabled ? '--disabled' : ''}`}>
                {/* 品牌头 */}
                <View className="comp-card__header">
                  <View className="comp-card__brand-row">
                    <View className={`comp-card__dot ${isCore ? '--core' : ''}`} />
                    <Text className="comp-card__brand">{comp.brand}</Text>
                  </View>
                  {/* 柜台状态选择 */}
                  <View className="comp-card__status-btn" onClick={() => {
                    Taro.showActionSheet({
                      itemList: COUNTER_STATUS_OPTIONS.map(o => o.label),
                      success: (res) => {
                        updateField(idx, 'counterStatus', COUNTER_STATUS_OPTIONS[res.tapIndex].value)
                      },
                    })
                  }}>
                    <Text className={`comp-card__status-text --${comp.counterStatus}`}>
                      {COUNTER_STATUS_OPTIONS.find(o => o.value === comp.counterStatus)?.label}
                    </Text>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </View>
                </View>

                {/* 销售额输入 */}
                <View className="comp-card__body">
                  <View className="comp-card__row">
                    <Text className="comp-card__label">销售额</Text>
                    <Input
                      className="comp-card__input"
                      type="digit"
                      placeholder="请输入"
                      value={comp.sales > 0 ? String(comp.sales) : ''}
                      disabled={isDisabled}
                      onInput={(e) => updateField(idx, 'sales', e.detail.value === '' ? 0 : parseFloat(e.detail.value) || 0)}
                    />
                    <Text className="comp-card__unit">元</Text>
                  </View>
                </View>

                {/* 非正常状态提示 */}
                {isDisabled && (
                  <View className="comp-card__hint">
                    <Text>{comp.counterStatus === 'renovation' ? '该柜台当前装修中，暂无需录入数据' : '该柜台已撤柜'}</Text>
                  </View>
                )}
              </View>
            )
          })}

          {/* 汇总区 */}
          {totalSales > 0 && (
            <View className="summary-bar">
              <Text className="summary-bar__label">合计销售额</Text>
              <Text className="summary-bar__value">¥ {totalSales.toLocaleString('zh-CN')}</Text>
            </View>
          )}
        </View>

        {/* 备注 */}
        <View className="card section-remark">
          <View className="section-header">
            <Text className="section-header__title">备注说明</Text>
            <Text className="section-header__optional">选填</Text>
          </View>
          <Textarea
            className="remark-textarea"
            placeholder="如有异常情况请在此说明..."
            maxlength={200}
            value={remark}
            onInput={(e) => setRemark(e.detail.value)}
          />
          <Text className="remark-count">{remark.length}/200</Text>
        </View>
      </View>

      {/* ====== 底部操作栏 ====== */}
      <View className="bottom-bar">
        <View className="bottom-bar__btn --draft" onClick={handleSaveDraft}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          <Text className="bottom-bar__btn-text --draft">存草稿</Text>
        </View>
        <View className="bottom-bar__btn --primary" onClick={handleSubmit}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <Text className="bottom-bar__btn-text --primary">提交上报</Text>
        </View>
      </View>
    </View>
  )
}

export default DailyPage
