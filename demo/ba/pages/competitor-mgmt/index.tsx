import { useState, useEffect, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { getCompetitorConfigSync, saveCompetitorConfigSync, getCompetitorDemoSync, saveCompetitorDemoSync, CompetitorDemoItem } from '@/utils/storage'
import { COUNTER_STATUS_OPTIONS, COMPETITOR_CONFIG, generateDemoCompetitorData } from '@/utils/constants'
import type { CompetitorConfigItem, CounterStatus } from '@/utils/types'

// 所有可选品牌数据（合并所有商场）
const ALL_BRANDS: { id: string; name: string; group: string }[] = [
  { id: 'ysl', name: 'YSL 圣罗兰', group: '欧莱雅集团' },
  { id: 'giorgio', name: 'Giorgio Armani', group: '欧莱雅集团' },
  { id: 'givenchy', name: 'Givenchy 纪梵希', group: 'LVMH集团' },
  { id: 'burberry', name: 'Burberry 巴宝莉', group: '独立品牌' },
  { id: 'prada', name: 'Prada 普拉达', group: 'Prada集团' },
  { id: 'celine', name: 'Celine 赛琳', group: 'LVMH集团' },
  { id: 'fendi', name: 'Fendi 芬迪', group: 'LVMH集团' },
  { id: 'loewe', name: 'Loewe 罗意威', group: 'LVMH集团' },
  { id: 'bottegaveneta', name: 'Bottega Veneta', group: '开云集团' },
  { id: 'valentino', name: 'Valentino 华伦天奴', group: '独立品牌' },
  { id: 'versace', name: 'Versace 范思哲', group: 'Capri集团' },
  { id: 'moschino', name: 'Moschino 莫斯奇诺', group: 'AEFFE集团' },
  { id: 'balenciaga', name: 'Balenciaga 巴黎世家', group: '开云集团' },
  { id: 'alexandermcqueen', name: 'Alexander McQueen', group: '开云集团' },
  { id: 'saintlaurent', name: 'Saint Laurent', group: '开云集团' },
  { id: 'moynat', name: 'Moynat 摩奈', group: 'LVMH集团' },
  { id: 'rimowa', name: 'RIMOWA 日默瓦', group: 'LVMH集团' },
]

// 初始化竞品柜台Demo数据
generateDemoCompetitorData()

/** 默认配置工厂 */
function getDefaultConfig(): CompetitorConfigItem[] {
  return COMPETITOR_CONFIG.map(c => ({
    ...c,
    counterStatus: 'normal' as CounterStatus,
  }))
}

/** 从Demo数据初始化配置 */
function getConfigFromDemo(): CompetitorConfigItem[] {
  const demoData = getCompetitorDemoSync()
  if (demoData.length === 0) return getDefaultConfig()

  return demoData.map(item => ({
    brand: item.brand,
    type: item.type,
    counterStatus: (item.status === 'active' ? 'normal' : item.status === 'renovating' ? 'renovation' : 'closed') as CounterStatus,
  }))
}

export default function CompetitorMgmt() {
  const [config, setConfig] = useState<CompetitorConfigItem[]>(() => {
    // 首次加载：优先从用户配置读取，否则从Demo数据初始化
    const saved = getCompetitorConfigSync()
    if (saved && saved.length > 0) return saved
    return getConfigFromDemo()
  })
  const [saving, setSaving] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // 新增竞品弹窗状态
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  // 初始化从 localStorage 加载（用户配置优先）
  useEffect(() => {
    const saved = getCompetitorConfigSync()
    if (saved && saved.length > 0) {
      setConfig(saved)
    } else {
      // 无用户配置时，使用Demo数据初始化
      const demoConfig = getConfigFromDemo()
      setConfig(demoConfig)
      // 同步保存Demo初始化数据
      saveCompetitorConfigSync(demoConfig)
    }
    setIsInitialized(true)
  }, [])

  // 统计各状态数量
  const stats = {
    normal: config.filter(c => c.counterStatus === 'normal').length,
    renovation: config.filter(c => c.counterStatus === 'renovation').length,
    closed: config.filter(c => c.counterStatus === 'closed').length,
  }

  // 切换单个品牌状态
  const handleStatusChange = useCallback((brand: string, newStatus: CounterStatus) => {
    setConfig(prev =>
      prev.map(c => (c.brand === brand ? { ...c, counterStatus: newStatus } : c))
    )
  }, [])

  // 实时保存
  useEffect(() => {
    if (config.length > 0) {
      setSaving(true)
      saveCompetitorConfigSync(config)
      // 短暂显示保存状态
      const timer = setTimeout(() => setSaving(false), 600)
      return () => clearTimeout(timer)
    }
  }, [config])

  // 重置为默认
  const handleReset = () => {
    Taro.showModal({
      title: '确认重置',
      content: '将所有竞品柜台恢复为"营业中"状态？',
      success(res) {
        if (res.confirm) {
          const reset = getDefaultConfig()
          setConfig(reset)
          saveCompetitorConfigSync(reset)
          Taro.showToast({ title: '已重置', icon: 'success' })
        }
      },
    })
  }

  // 新增竞品弹窗操作
  const openAddModal = () => {
    setShowAddModal(true)
    setSelectedBrands([])
  }

  const closeAddModal = () => {
    setShowAddModal(false)
  }

  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    )
  }

  const confirmAddBrand = () => {
    if (selectedBrands.length === 0) {
      Taro.showToast({ title: '请选择竞品品牌', icon: 'none' })
      return
    }

    // 获取已添加的品牌名
    const addedBrandNames = config.map(c => c.brand)
    const newCompetitors: CompetitorConfigItem[] = []

    selectedBrands.forEach(brandId => {
      const brandInfo = ALL_BRANDS.find(b => b.id === brandId)
      if (brandInfo && !addedBrandNames.includes(brandInfo.name)) {
        newCompetitors.push({
          brand: brandInfo.name,
          type: 'normal',
          counterStatus: 'normal',
        })
      }
    })

    if (newCompetitors.length > 0) {
      const updatedConfig = [...config, ...newCompetitors]
      setConfig(updatedConfig)
      saveCompetitorConfigSync(updatedConfig)
      Taro.showToast({ title: `已添加 ${newCompetitors.length} 个竞品`, icon: 'success' })
    } else {
      Taro.showToast({ title: '品牌已存在', icon: 'none' })
    }

    closeAddModal()
  }

  // 计算可添加的品牌（排除已添加的）
  const availableBrands = ALL_BRANDS.filter(
    b => !config.some(c => c.brand === b.name)
  )

  return (
    <ScrollView scrollY className="competitor-page" enhanced showScrollbar={false}>
      {/* 页面标题 */}
      <View className="competitor-header">
        <Text className="competitor-title">竞品柜台维护</Text>
        <Text className="competitor-subtitle">配置同商城各竞品的当前开关店情况</Text>
        <Text className={`competitor-save-hint ${saving ? 'saving' : ''}`}>
          {saving ? '已自动保存...' : '数据已保存'}
        </Text>
      </View>

      {/* 统计卡片 */}
      <View className="competitor-stats-row">
        {COUNTER_STATUS_OPTIONS.map(opt => (
          <View key={opt.value} className="competitor-stat-card">
            <Text className="competitor-stat-number">{stats[opt.value]}</Text>
            <Text className="competitor-stat-label">{opt.label}</Text>
          </View>
        ))}
      </View>

      {/* 竞品列表 */}
      <View className="competitor-list-section">
        <View className="competitor-list-header">
          <Text className="competitor-list-title">竞品列表</Text>
          <View className="competitor-list-header-right">
            <Text className="competitor-total-count">{config.length} 个品牌</Text>
            <View className="competitor-add-btn" onClick={openAddModal}>
              <Text className="competitor-add-btn-text">+ 新增竞品</Text>
            </View>
          </View>
        </View>

        {config.map(item => (
          <View key={item.brand} className="competitor-card">
            <View className="competitor-brand-info">
              <View className="competitor-brand-name-row">
                <Text className="competitor-brand-name">{item.brand}</Text>
                <View className="competitor-type-tag">
                  <Text className="competitor-type-text">普通竞品</Text>
                </View>
              </View>
              <Text className="competitor-current-status">
                当前：
                {COUNTER_STATUS_OPTIONS.find(o => o.value === item.counterStatus)?.label || '-'}
              </Text>
            </View>

            <View className="competitor-status-actions">
              {COUNTER_STATUS_OPTIONS.map(opt => (
                <View
                  key={opt.value}
                  className={`competitor-status-btn ${opt.value} ${item.counterStatus === opt.value ? 'active' : ''}`}
                  onClick={() => handleStatusChange(item.brand, opt.value)}
                >
                  <Text className={`competitor-status-btn-text ${item.counterStatus === opt.value ? 'active' : ''}`}>
                    {opt.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* 操作按钮区 */}
      <View className="competitor-actions">
        <View className="competitor-reset-btn" onClick={handleReset}>
          <Text className="competitor-reset-btn-text">重置全部为营业中</Text>
        </View>
      </View>

      {/* 底部占位 */}
      <View className="competitor-bottom-space" />

      {/* 新增竞品弹窗 */}
      {showAddModal && (
        <View className="competitor-modal-mask" onClick={closeAddModal}>
          <View className="competitor-modal" catchMove onClick={e => e.stopPropagation()}>
            <View className="competitor-modal-header">
              <Text className="competitor-modal-title">添加竞品柜台</Text>
              <View className="competitor-modal-close" onClick={closeAddModal}>
                <Text>×</Text>
              </View>
            </View>

            <View className="competitor-modal-body">
              {/* 品牌选择 */}
              <View className="competitor-form-group">
                <Text className="competitor-form-label">
                  选择竞品品牌 {selectedBrands.length > 0 && `（已选 ${selectedBrands.length} 个）`}
                </Text>
                {availableBrands.length === 0 ? (
                  <View className="competitor-empty-tip">暂无可添加的竞品品牌</View>
                ) : (
                  <View className="competitor-brand-grid">
                    {availableBrands.map(brand => (
                      <View
                        key={brand.id}
                        className={`competitor-brand-item ${selectedBrands.includes(brand.id) ? 'selected' : ''}`}
                        onClick={() => toggleBrand(brand.id)}
                      >
                        <View className="competitor-brand-checkbox">
                          {selectedBrands.includes(brand.id) && <Text className="competitor-brand-check">✓</Text>}
                        </View>
                        <View className="competitor-brand-info">
                          <Text className="competitor-brand-name-text">{brand.name}</Text>
                          <Text className="competitor-brand-group-text">{brand.group}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View className="competitor-modal-footer">
              <View className="competitor-confirm-btn" onClick={confirmAddBrand}>
                <Text className="competitor-confirm-btn-text">确认添加</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}
