import React, { useState, useEffect, useCallback } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, Input, Textarea, Picker } from '@tarojs/components'
import { COMPETITOR_CONFIG, COUNTER_STATUS_OPTIONS, createDefaultCompetitor, generateDemoMonthlyReports, getMonthlyReportHint } from '@/utils/constants'
import { saveMonthlyReportSync, getMonthlyReportSync } from '@/utils/storage'
import { MonthlyReport, CompetitorData, CounterStatus } from '@/utils/types'

// ====== 页面级同步初始化：确保渲染前 Demo 数据已存在 ======
generateDemoMonthlyReports()

/** 月份列表 */
function generateMonthOptions() {
  const options: { label: string; value: string }[] = []
  const now = new Date()
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    options.push({ label: `${d.getFullYear()}年${d.getMonth() + 1}月`, value: val })
  }
  return options
}

const MONTH_OPTIONS = generateMonthOptions()

function MonthlyPage() {
  const router = useRouter()
  const [month, setMonth] = useState(router.params.month || MONTH_OPTIONS[0].value)
  const [remark, setRemark] = useState('')
  const [competitors, setCompetitors] = useState<CompetitorData[]>(
    () => COMPETITOR_CONFIG.map(c => createDefaultCompetitor(c.brand, c.type))
  )

  const totalSales = competitors.reduce((sum, c) => sum + (c.sales || 0), 0)

  /** 初始化：回填已有数据 */
  useEffect(() => {
    const editMonth = router.params.month || month
    if (editMonth) {
      const existing = getMonthlyReportSync(editMonth)
      if (existing?.competitors) {
        setCompetitors(existing.competitors)
        setRemark(existing.remark || '')
      }
    }
  }, [])

  /** 切换月份 — 回填数据 */
  const handleMonthChange = (newMonth: string) => {
    setMonth(newMonth)
    const existing = getMonthlyReportSync(newMonth)
    if (existing?.competitors) {
      setCompetitors(existing.competitors)
      setRemark(existing.remark || '')
    } else {
      setCompetitors(COMPETITOR_CONFIG.map(c => createDefaultCompetitor(c.brand, c.type)))
      setRemark('')
    }
  }

  const updateField = (idx: number, field: keyof CompetitorData, val: number | CounterStatus) => {
    setCompetitors(prev => prev.map((c, i) => (i === idx ? { ...c, [field]: val } : c)))
  }

  const handleSaveDraft = useCallback(() => {
    saveMonthlyReportSync({
      month, status: 'draft', submitTime: new Date().toISOString(), remark, competitors,
    })
    Taro.showToast({ title: '草稿已保存', icon: 'success' })
  }, [month, remark, competitors])

  const handleSubmit = useCallback(() => {
    const hasData = competitors.some(c => c.sales > 0)
    if (!hasData) { Taro.showToast({ title: '请至少填写一个竞品的销售额', icon: 'none' }); return }

    saveMonthlyReportSync({
      month, status: 'submitted', submitTime: new Date().toISOString(), remark, competitors,
    })
    Taro.showToast({ title: '月报提交成功', icon: 'success', duration: 1500, success: () => setTimeout(() => Taro.navigateBack(), 1600) })
  }, [month, remark, competitors])

  return (
    <View className="monthly-page">
      <View className="nav-bar">
        <Text className="nav-bar__title">每月竞品数据上报</Text>
        <View className="nav-bar__placeholder" />
      </View>

      <View className="monthly-page__content">
        {/* 上报时间提示 */}
        <View className="report-hint-card">
          <Text className="report-hint-text">{getMonthlyReportHint()}</Text>
        </View>

        {/* 月份选择 */}
        <View className="card month-picker-card">
          <Text className="card-title">上报月份</Text>
          <Picker mode="selector" range={MONTH_OPTIONS} rangeKey="label"
            value={MONTH_OPTIONS.findIndex(o => o.value === month)}
            onChange={e => handleMonthChange(MONTH_OPTIONS[Number(e.detail.value)].value)}>
            <View className="picker-row">
              <Text className="picker-value">{MONTH_OPTIONS.find(o => o.value === month)?.label}</Text>
              <Text className="picker-arrow">▼</Text>
            </View>
          </Picker>
        </View>

        {/* 竞品录入 */}
        <View className="card comp-section">
          <View className="section-header">
            <Text className="section-header__title">竞品业绩录入</Text>
            <Text className="section-header__total">合计: ¥{totalSales.toLocaleString()}</Text>
          </View>
          {competitors.map((comp, idx) => {
            const isDisabled = comp.counterStatus !== 'normal'
            const isCore = comp.type === 'core'
            return (
              <View key={comp.brand} className={`comp-row ${isDisabled ? '--disabled' : ''}`}>
                <View className="comp-row__head">
                  <View className="comp-row__brand-wrap">
                    <View className={`comp-row__dot ${isCore ? '--core' : ''}`} />
                    <Text className="comp-row__brand">{comp.brand}</Text>
                  </View>
                  <Picker mode="selector" range={COUNTER_STATUS_OPTIONS} rangeKey="label"
                    value={COUNTER_STATUS_OPTIONS.findIndex(o => o.value === comp.counterStatus)}
                    onChange={e => updateField(idx, 'counterStatus', COUNTER_STATUS_OPTIONS[Number(e.detail.value)].value)}>
                    <View className={`status-tag --${comp.counterStatus}`}>
                      <Text>{COUNTER_STATUS_OPTIONS.find(o => o.value === comp.counterStatus)?.label}</Text>
                      <Text> ▾</Text>
                    </View>
                  </Picker>
                </View>
                <View className="comp-row__input-row">
                  <Text className="input-label">月销售额</Text>
                  <Input className="sales-input" type="digit" placeholder="请输入"
                    value={comp.sales > 0 ? String(comp.sales) : ''}
                    disabled={isDisabled}
                    onInput={(e) => updateField(idx, 'sales', e.detail.value === '' ? 0 : parseFloat(e.detail.value) || 0)} />
                  <Text className="input-unit">元</Text>
                </View>
                {isDisabled && (
                  <Text className="comp-hint">
                    {comp.counterStatus === 'renovation' ? '该柜台当前装修中，暂无需录入数据' : '该柜台已撤柜'}
                  </Text>
                )}
              </View>
            )
          })}
        </View>

        {/* 备注 */}
        <View className="card remark-card">
          <Text className="card-title">备注说明（选填）</Text>
          <Textarea className="remark-area" placeholder="如有异常情况请在此说明..." maxlength={300}
            value={remark} onInput={(e) => setRemark(e.detail.value)} />
          <Text className="remark-len">{remark.length}/300</Text>
        </View>
      </View>

      {/* 底部按钮 */}
      <View className="bottom-bar safe-bottom">
        <View className="bottom-bar__btn --draft" onClick={handleSaveDraft}>
          <Text className="bottom-bar__btn-text --draft">存草稿</Text>
        </View>
        <View className="bottom-bar__btn --primary" onClick={handleSubmit}>
          <Text className="bottom-bar__btn-text --primary">提交上报</Text>
        </View>
      </View>
    </View>
  )
}

export default MonthlyPage
