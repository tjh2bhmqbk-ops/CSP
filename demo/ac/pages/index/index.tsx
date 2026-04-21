import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Picker } from '@tarojs/components'
import { ApprovalTask, ACUserInfo } from '../../utils/types'
import { STATUS_CONFIG, getACUserInfo, APPROVAL_TASKS_KEY, APPROVAL_STATS_KEY } from '../../utils/constants'

type ApprovalTab = 'pending' | 'approved'

const PROVINCES = ['浙江省', '江苏省', '上海市']
const CITIES: Record<string, string[]> = {
  '浙江省': ['杭州市', '宁波市', '温州市'],
  '江苏省': ['南京市', '苏州市', '无锡市'],
  '上海市': ['黄浦区', '静安区', '浦东新区'],
}
const MALLS: Record<string, string[]> = {
  '杭州市': ['万象城购物中心', '湖滨银泰', '西湖银泰', '庆春银泰'],
  '宁波市': ['天一广场', '和义大道'],
  '温州市': ['万象城', '时代广场'],
  '南京市': ['德基广场', '金鹰国际'],
  '苏州市': ['苏州中心', '久光百货'],
  '无锡市': ['恒隆广场', '八佰伴'],
  '黄浦区': ['南京东路', '淮海中路'],
  '静安区': ['静安寺', '南京西路'],
  '浦东新区': ['陆家嘴', '世纪大道'],
}

// 格式化为中文日期显示
const fmtCN = (iso: string) => {
  const d = new Date(iso + 'T00:00:00')
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

// 格式化为简写日期显示（用于结束日期的简写形式）
const fmtShort = (iso: string) => {
  const d = new Date(iso + 'T00:00:00')
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

export default function IndexPage() {
  const [activeTab, setActiveTab] = useState<ApprovalTab>('pending')
  const [tasks, setTasks] = useState<ApprovalTask[]>([])
  const [stats, setStats] = useState({ pendingCount: 0, approvedCount: 0, rejectedCount: 0, abnormalCount: 0 })
  const [userInfo] = useState<ACUserInfo>(getACUserInfo())

  // 筛选状态
  const [provinceIdx, setProvinceIdx] = useState(0)
  const [cityIdx, setCityIdx] = useState(0)
  const [mallIdx, setMallIdx] = useState(0)

  // 日期筛选 — 使用YYYY-MM-DD格式
  const todayIso = '2026-04-21'
  const weekLaterIso = '2026-04-28'
  const [startDate, setStartDate] = useState(todayIso)
  const [endDate, setEndDate] = useState(weekLaterIso)

  useEffect(() => {
    initMockData()
    loadData()
  }, [])

  // 初始化：把完整的mock任务写入storage，使详情页可用
  const initMockData = () => {
    const mockTasks: ApprovalTask[] = [
      {
        id: '1',
        month: '2026-08',
        counterName: '雅诗兰黛 · 杭州万象城店',
        submitterName: '米晓妮',
        submitterRole: 'BA',
        submitTime: '2026-08-22T10:30:00',
        status: 'pending',
        monthlyReport: {
          month: '2026-08',
          status: 'pending',
          submitTime: '2026-08-22T10:30:00',
          remark: '',
          competitors: [
            { brand: '兰蔻', type: 'core', counterStatus: 'normal', sales: 158000, traffic: 132, bigOrders: 6 },
            { brand: '迪奥', type: 'core', counterStatus: 'normal', sales: 125000, traffic: 98, bigOrders: 4 },
            { brand: '香奈儿', type: 'normal', counterStatus: 'normal', sales: 98000, traffic: 76, bigOrders: 2 },
          ]
        }
      },
      {
        id: '2',
        month: '2026-08',
        counterName: '雅诗兰黛 · 庆春银泰',
        submitterName: 'Amy',
        submitterRole: 'BA',
        submitTime: '2026-08-22T14:15:00',
        status: 'pending',
        monthlyReport: {
          month: '2026-08',
          status: 'pending',
          submitTime: '2026-08-22T14:15:00',
          remark: '',
          competitors: [
            { brand: '兰蔻', type: 'core', counterStatus: 'normal', sales: 92000, traffic: 85, bigOrders: 3 },
            { brand: 'SK-II', type: 'core', counterStatus: 'normal', sales: 78000, traffic: 62, bigOrders: 1 },
          ]
        }
      },
      {
        id: '4',
        month: '2026-08',
        counterName: '雅诗兰黛 · 武林银泰',
        submitterName: '林小婷',
        submitterRole: 'BA',
        submitTime: '2026-08-20T09:00:00',
        status: 'approved',
        monthlyReport: {
          month: '2026-08',
          status: 'approved',
          submitTime: '2026-08-20T09:00:00',
          remark: '',
          competitors: [
            { brand: '兰蔻', type: 'core', counterStatus: 'normal', sales: 135000, traffic: 110, bigOrders: 5 },
            { brand: '迪奥', type: 'core', counterStatus: 'renovation', sales: 0, traffic: 0, bigOrders: 0 },
          ]
        }
      },
      {
        id: '6',
        month: '2026-08',
        counterName: '雅诗兰黛 · 城西银泰',
        submitterName: '陈小燕',
        submitterRole: 'BA',
        submitTime: '2026-08-18T11:20:00',
        status: 'rejected',
        rejectReason: '数据不完整，请补充竞品销售额',
        monthlyReport: {
          month: '2026-08',
          status: 'rejected',
          submitTime: '2026-08-18T11:20:00',
          remark: '',
          competitors: [
            { brand: '兰蔻', type: 'core', counterStatus: 'normal', sales: 89000, traffic: 72, bigOrders: 2 },
          ]
        }
      },
    ]
    try {
      Taro.setStorageSync(APPROVAL_TASKS_KEY, mockTasks)
      Taro.setStorageSync(APPROVAL_STATS_KEY, { pendingCount: 2, approvedCount: 1, rejectedCount: 1, abnormalCount: 2 })
    } catch (e) { console.error('Failed to init mock data:', e) }
  }

  const loadData = () => {
    try {
      const storedTasks = Taro.getStorageSync<ApprovalTask[]>(APPROVAL_TASKS_KEY) || []
      setTasks(storedTasks)
      const storedStats = Taro.getStorageSync(APPROVAL_STATS_KEY)
      if (storedStats) setStats(storedStats)
    } catch (e) { console.error('Failed to load data:', e) }
  }

  const switchTab = (tab: ApprovalTab) => setActiveTab(tab)
  const navigateToDetail = (taskId: string) => Taro.navigateTo({ url: `/pages/approval-detail/index?taskId=${taskId}` })
  const navigateToAbnormal = () => Taro.switchTab({ url: '/pages/abnormal-counter/index' })

  // 显示信息映射
  const displayInfo: Record<string, { type: string; date: string }> = {
    '1': { type: '日数据上报', date: '8月22日' },
    '2': { type: '日数据修改', date: '8月22日' },
    '4': { type: '日数据上报', date: '8月20日' },
    '6': { type: '日数据上报', date: '8月18日' },
  }

  const currentTasks = tasks.filter(t =>
    activeTab === 'pending' ? t.status === 'pending' : t.status !== 'pending'
  )

  const onProvinceChange = (e: any) => { setProvinceIdx(e.detail.value); setCityIdx(0); setMallIdx(0) }
  const onCityChange = (e: any) => { setCityIdx(e.detail.value); setMallIdx(0) }
  const onMallChange = (e: any) => setMallIdx(e.detail.value)

  const onStartDateChange = (e: any) => {
    const val = e.detail.value
    setStartDate(val)
    if (val > endDate) setEndDate(val)
  }
  const onEndDateChange = (e: any) => {
    const val = e.detail.value
    if (val < startDate) {
      Taro.showToast({ title: '结束日期不能早于开始日期', icon: 'none' })
      return
    }
    setEndDate(val)
  }

  const province = PROVINCES[provinceIdx]
  const cities = CITIES[province] || []
  const city = cities[cityIdx] || cities[0] || ''
  const malls = MALLS[city] || []
  const mall = malls[mallIdx] || malls[0] || '全部购物中心'

  const statusMap: Record<string, { text: string; color: string; bg: string }> = {
    pending: { text: '待审批', color: '#FF9800', bg: '#FFF3E0' },
    approved: { text: '已通过', color: '#52C41A', bg: '#F6FFED' },
    rejected: { text: '已驳回', color: '#F5222D', bg: '#FFF2F0' },
  }

  return (
    <View className="ac-home-page">
      {/* 顶部大图背景 */}
      <View className="hero-section">
        <Image className="hero-bg" src="/images/header-bg.png" mode="aspectFill" />
        <View className="hero-overlay">
          <Text className="hero-title">竞品上报系统</Text>
        </View>
      </View>

      {/* 用户信息卡片 */}
      <View className="user-info-section">
        <Image className="user-avatar" src="/images/avatar.png" mode="aspectFill" />
        <View className="user-meta">
          <View className="user-name-row">
            <Text className="user-name">{userInfo.name}</Text>
            <Text className="user-role">雅诗兰黛 · 区域经理</Text>
          </View>
          <Text className="user-location">浙江省 杭州市</Text>
        </View>
      </View>

      {/* 通知条 */}
      <View className="notice-bar" onClick={navigateToAbnormal}>
        <svg className="notice-icon" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <Text className="notice-text">您有{stats.pendingCount}条数据上报等待审批，有{stats.abnormalCount}个上报异常</Text>
      </View>

      {/* Tab切换 */}
      <View className="tab-section">
        <View className={`tab-item ${activeTab === 'pending' ? '--active' : ''}`} onClick={() => switchTab('pending')}>
          <Text className="tab-text">待审批</Text>
        </View>
        <View className={`tab-item ${activeTab === 'approved' ? '--active' : ''}`} onClick={() => switchTab('approved')}>
          <Text className="tab-text">已审批</Text>
        </View>
      </View>

      {/* 筛选栏 */}
      <View className="filter-bar">
        <Picker mode="selector" range={PROVINCES} value={provinceIdx} onChange={onProvinceChange}>
          <View className="filter-item">
            <Text className="filter-text">{province}</Text>
            <svg className="filter-arrow" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </View>
        </Picker>
        <Picker mode="selector" range={cities} value={cityIdx} onChange={onCityChange}>
          <View className="filter-item">
            <Text className="filter-text">{city}</Text>
            <svg className="filter-arrow" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </View>
        </Picker>
        <Picker mode="selector" range={malls.length ? malls : ['全部购物中心']} value={mallIdx} onChange={onMallChange}>
          <View className="filter-item">
            <Text className="filter-text">{mall}</Text>
            <svg className="filter-arrow" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </View>
        </Picker>
      </View>

      {/* 日期筛选 — 可用状态 */}
      <View className="date-filter">
        <View className="date-range">
          <svg className="date-icon" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <Picker mode="date" value={startDate} onChange={onStartDateChange}>
            <Text className="date-text">{fmtCN(startDate)}</Text>
          </Picker>
          <svg className="date-icon" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <Text className="date-separator">-</Text>
          <Picker mode="date" value={endDate} onChange={onEndDateChange}>
            <Text className="date-text">{fmtShort(endDate)}</Text>
          </Picker>
          <svg className="date-icon" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </View>
        <View className="filter-btn" onClick={() => Taro.showToast({ title: '筛选功能开发中', icon: 'none' })}>
          <Text className="filter-btn-text">筛选</Text>
        </View>
      </View>

      {/* 任务列表 */}
      <View className="task-list">
        {currentTasks.map(task => {
          const st = statusMap[task.status]
          const info = displayInfo[task.id] || { type: '日数据上报', date: '8月22日' }
          return (
            <View key={task.id} className="task-card" onClick={() => navigateToDetail(task.id)}>
              <View className="task-header">
                <View className="task-left">
                  <Text className="task-type">{info.type}</Text>
                  <Text className="task-divider">|</Text>
                  <Text className="task-date">{info.date}</Text>
                </View>
                <View className="task-status" style={{ backgroundColor: st.bg }}>
                  <Text className="status-text" style={{ color: st.color }}>{st.text}</Text>
                </View>
              </View>
              <View className="task-info">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <Text className="info-text">{task.counterName}</Text>
              </View>
              <View className="task-info">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <Text className="info-text">{task.submitterName}</Text>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}
