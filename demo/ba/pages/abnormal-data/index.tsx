import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { STATUS_CONFIG, generateDemoMonthlyReports } from '@/utils/constants'

// 立即生成 Demo 数据
generateDemoMonthlyReports()

/** 月报记录类型 */
interface MonthlyRecord {
  month: string
  status: string
  submitTime?: string
  remark?: string
  competitors: {
    brand: string
    type: string
    counterStatus: string
    sales: number
    traffic: number
    bigOrders: number
  }[]
}

/** 需要审批的月报条目（异常数据） */
interface AbnormalItem {
  id: string
  month: string
  monthCN: string
  status: string
  statusInfo: typeof STATUS_CONFIG[string]
  totalSales: number
  competitors: MonthlyRecord['competitors']
  remark: string
  submitTime: string
  level: 'high' | 'medium' | 'low'
}

/**
 * 从 Storage 加载所有月报，筛选需要审批的记录
 */
function loadAbnormalRecords(): AbnormalItem[] {
  try {
    const info = Taro.getStorageInfoSync()
    const monthlyKeys = info.keys.filter(k => k.startsWith('csp_monthly_'))

    const items: AbnormalItem[] = monthlyKeys.map(key => {
      const record: MonthlyRecord = Taro.getStorageSync(key) || {}
      const [y, m] = (record.month || key.replace('csp_monthly_', '')).split('-')
      const monthCN = `${parseInt(y)}年${parseInt(m)}月`
      const totalSales = (record.competitors || []).reduce((s: number, c: any) => s + (c.sales || 0), 0)

      // 风险等级：draft=高(未提交), submitted=中(待审核), 其他=低
      let level: AbnormalItem['level'] = 'low'
      if (record.status === 'draft') level = 'high'
      else if (record.status === 'submitted') level = 'medium'

      return {
        id: key,
        month: record.month || key.replace('csp_monthly_', ''),
        monthCN,
        status: record.status,
        statusInfo: STATUS_CONFIG[record.status] || STATUS_CONFIG['submitted'],
        totalSales,
        competitors: record.competitors || [],
        remark: record.remark || '',
        submitTime: record.submitTime || '',
        level,
      }
    })

    // 只保留需要关注的（非approved）
    return items.filter(i => i.status !== 'approved')
      .sort((a, b) => b.month.localeCompare(a.month)) // 最近月份在前
  } catch (e) {
    console.error('[abnormal-data] load error:', e)
    return []
  }
}

function AbnormalDataPage() {
  const router = useRouter()
  const [records, setRecords] = useState<AbnormalItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    // Demo 数据已在模块顶层生成，直接读取
    setRecords(loadAbnormalRecords())
  }, [])

  // 统计各风险数量
  const highCount = records.filter(r => r.level === 'high').length
  const medCount = records.filter(r => r.level === 'medium').length
  const lowCount = records.filter(r => r.level === 'low').length

  /** 跳转编辑月报 */
  const handleEdit = (month: string, e?: any) => {
    if (e) e.stopPropagation()
    Taro.navigateTo({ url: `/pages/monthly/index?month=${month}&mode=edit` })
  }

  /** 标记为已处理 */
  const handleMarkDone = (id: string, e: any) => {
    e.stopPropagation()
    Taro.showModal({
      title: '确认标记',
      content: '确认该月报数据已处理完毕？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已标记', icon: 'success' })
          setActiveId(null)
        }
      },
    })
  }

  /** 格式化金额 */
  const fmt = (n: number) => n ? `¥${n.toLocaleString('zh-CN')}` : '-'
  /** 格式化时间 */
  const fmtTime = (iso?: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (days < 1) return '今天'
    if (days < 2) return '昨天'
    if (days <= 7) return `${days}天前`
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }

  return (
    <View className="abnormal-page">
      {/* 导航头部 */}
      <View className="nav-bar">
        <View className="nav-bar__back" onClick={() => Taro.navigateBack()}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </View>
        <Text className="nav-bar__title">异常数据预警</Text>
        <View className="nav-bar__placeholder" />
      </View>

      {/* 统计概览 — 按审批状态分类 */}
      <View className="overview-bar">
        <View className="ov-item --high"><Text className="ov-val">{highCount}</Text><Text className="ov-label">待提交</Text></View>
        <View className="ov-item --med"><Text className="ov-val">{medCount}</Text><Text className="ov-label">审核中</Text></View>
        <View className="ov-item --low"><Text className="ov-val">{lowCount}</Text><Text className="ov-label">低关注</Text></View>
      </View>

      {/* 异常列表 */}
      <ScrollView scrollY className="ab-scroll">
        {records.length === 0 ? (
          /* 空状态 */
          <View className="empty-state">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="50" fill="#F0F9FF" stroke="#D4ECFF" strokeWidth="2"/>
              <path d="M45 55 L75 55 M60 40 L60 70" stroke="#91C9E8" strokeWidth="3" strokeLinecap="round"/>
              <path d="M42 78 Q60 88 78 78" stroke="#91C9E8" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <Text className="empty-title">暂无异常数据</Text>
            <Text className="empty-desc">所有月报均已审批通过，状态正常</Text>
          </View>
        ) : (
          records.map(item => (
            <View
              key={item.id}
              className={`ab-card --${item.level}`}
              onClick={() => setActiveId(activeId === item.id ? null : item.id)}
            >
              {/* 卡片头部 */}
              <View className="ab-card__head">
                <View className={`ab-level-tag --${item.level}`}>
                  <Text>{item.level === 'high' ? '待提交' : item.level === 'medium' ? '审核中' : '低关注'}</Text>
                </View>
                <Text className="ab-brand">{item.monthCN}月报</Text>
                <Text className="ab-time">{fmtTime(item.submitTime)}</Text>
              </View>

              {/* 标题 + 描述 */}
              <Text className="ab-title">
                {item.level === 'high'
                  ? `${item.monthCN}月报尚未完成，请尽快填写并提交`
                  : `${item.monthCN}月报已提交，等待审批中`}
              </Text>
              <Text className="ab-desc">
                共{item.competitors.length}个竞品品牌，总销售额 {fmt(item.totalSales)}
                {item.remark && ` · ${item.remark}`}
              </Text>

              {/* 各品牌销售额摘要 */}
              <View className="brand-summary">
                {item.competitors.map((comp, idx) => (
                  <View key={idx} className="bs-item">
                    <View className={`bs-dot --${comp.type}`} />
                    <Text className="bs-name">{comp.brand}</Text>
                    <Text className="bs-sales">{fmt(comp.sales)}</Text>
                    <Text className={`bs-status --${comp.counterStatus}`}>
                      {comp.counterStatus === 'renovation' ? '装修' :
                       comp.counterStatus === 'closed' ? '撤柜' : '正常'}
                    </Text>
                  </View>
                ))}
              </View>

              {/* 展开的操作区 */}
              {activeId === item.id && (
                <View className="ab-detail">
                  <Text className="ab-detail__label">操作建议</Text>
                  <Text className="ab-detail__text">
                    {item.level === 'high'
                      ? '该月份报告仍处于草稿状态，请补充完整竞品销售数据后及时提交。截止日为本月25日。'
                      : '该月报已提交至系统等待审批。如需修改数据可点击下方「修改」按钮重新编辑。'}
                  </Text>
                  <View className="ab-actions">
                    <View
                      className={`ab-btn ${item.level === 'high' ? '--primary' : '--outline'}`}
                      onClick={(e) => handleEdit(item.month, e)}
                    >
                      <Text>{item.level === 'high' ? '去填写' : '修改数据'}</Text>
                    </View>
                    {item.level !== 'high' && (
                      <View className="ab-btn --ghost" onClick={(e) => handleMarkDone(item.id, e)}>
                        <Text>标记已读</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default AbnormalDataPage
