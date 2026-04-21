// CSP竞品情报系统 - 模拟数据

// 当前品牌信息
const currentBrand = {
  id: 'brand_001',
  name: 'Chanel',
  nameEn: 'CHANEL',
  logo: '💄'
};

// 竞品列表
const competitors = [
  { id: 'comp_001', name: 'Dior', nameCn: '迪奥', group: 'LVMH', core: true },
  { id: 'comp_002', name: 'Louis Vuitton', nameCn: '路易威登', group: 'LVMH', core: true },
  { id: 'comp_003', name: 'Gucci', nameCn: '古驰', group: 'Kering', core: false },
  { id: 'comp_004', name: 'Hermès', nameCn: '爱马仕', group: 'Hermès Group', core: true },
  { id: 'comp_005', name: 'Cartier', nameCn: '卡地亚', group: 'Richemont', core: false }
];

// 商场列表
const malls = [
  { id: 'mall_001', name: '上海新天地', city: '上海', region: '华东' },
  { id: 'mall_002', name: '上海恒隆广场', city: '上海', region: '华东' },
  { id: 'mall_003', name: '北京国贸商城', city: '北京', region: '华北' },
  { id: 'mall_004', name: '深圳万象城', city: '深圳', region: '华南' },
  { id: 'mall_005', name: '成都IFS', city: '成都', region: '西南' }
];

// 门店列表
const counters = [
  { id: 'counter_001', mall: 'mall_001', brand: 'brand_001', name: 'Chanel 新天地店', status: 'normal' },
  { id: 'counter_002', mall: 'mall_001', brand: 'comp_001', name: 'Dior 新天地店', status: 'normal' },
  { id: 'counter_003', mall: 'mall_002', brand: 'comp_002', name: 'LV 恒隆广场店', status: 'renovate' },
  { id: 'counter_004', mall: 'mall_003', brand: 'comp_003', name: 'Gucci 国贸店', status: 'normal' },
  { id: 'counter_005', mall: 'mall_003', brand: 'comp_004', name: 'Hermès 国贸店', status: 'closed' }
];

// 模拟用户数据
const baUser = {
  id: 'ba_001',
  name: '李美美',
  brand: currentBrand,
  counter: counters[0],
  role: 'ba'
};

const managerUser = {
  id: 'mgr_001',
  name: '王督导',
  brand: currentBrand,
  region: '华东',
  role: 'manager'
};

const adminUser = {
  id: 'admin_001',
  name: '张经理',
  brand: currentBrand,
  role: 'admin'
};

// 日报数据
const dailyReports = [
  { id: 'daily_001', date: '2026-04-20', counter: counters[0], brand: 'comp_001', sales: 15800, status: 'pending' },
  { id: 'daily_002', date: '2026-04-20', counter: counters[0], brand: 'comp_002', sales: 22300, status: 'pending' },
  { id: 'daily_003', date: '2026-04-19', counter: counters[0], brand: 'comp_001', sales: 18200, status: 'approved' },
  { id: 'daily_004', date: '2026-04-19', counter: counters[0], brand: 'comp_002', sales: 19800, status: 'approved' },
  { id: 'daily_005', date: '2026-04-18', counter: counters[0], brand: 'comp_003', sales: 12500, status: 'approved' },
  { id: 'daily_006', date: '2026-04-17', counter: counters[0], brand: 'comp_004', sales: 35600, status: 'approved' },
  { id: 'daily_007', date: '2026-04-20', counter: counters[0], brand: 'comp_001', sales: 0, status: 'rejected', reason: '数据异常，请核实' }
];

// 周报数据
const weeklyReports = [
  { id: 'weekly_001', week: '2026-W16', startDate: '04-14', endDate: '04-20', counter: counters[0], status: 'pending' },
  { id: 'weekly_002', week: '2026-W15', startDate: '04-07', endDate: '04-13', counter: counters[0], status: 'approved' },
  { id: 'weekly_003', week: '2026-W14', startDate: '03-31', endDate: '04-06', counter: counters[0], status: 'approved' }
];

// 月报数据
const monthlyReports = [
  { id: 'monthly_001', month: '2026-04', counter: counters[0], status: 'pending' },
  { id: 'monthly_002', month: '2026-03', counter: counters[0], status: 'approved' },
  { id: 'monthly_003', month: '2026-02', counter: counters[0], status: 'approved' }
];

// 竞品柜台维护数据
const counterMaintenance = [
  { id: 'cm_001', date: '2026-04-20', mall: malls[0], competitor: competitors[0], type: 'new', status: 'pending' },
  { id: 'cm_002', date: '2026-04-19', mall: malls[1], competitor: competitors[1], type: 'renovate', status: 'pending' },
  { id: 'cm_003', date: '2026-04-15', mall: malls[2], competitor: competitors[2], type: 'closed', status: 'approved' }
];

// 待审核队列
const pendingReviews = [
  { id: 'review_001', type: 'daily', brand: 'comp_001', sales: 15800, date: '2026-04-20', time: '10:23', status: 'pending' },
  { id: 'review_002', type: 'daily', brand: 'comp_002', sales: 22300, date: '2026-04-20', time: '10:15', status: 'pending' },
  { id: 'review_003', type: 'weekly', brand: 'comp_003', sales: 87500, date: '2026-04-20', time: '09:45', status: 'pending' },
  { id: 'review_004', type: 'monthly', brand: 'comp_004', sales: 320000, date: '2026-04-20', time: '09:12', status: 'pending' },
  { id: 'review_005', type: 'counter', action: 'new', brand: 'comp_001', mall: '上海新天地', date: '2026-04-20', time: '08:30', status: 'pending' },
  { id: 'review_006', type: 'counter', action: 'renovate', brand: 'comp_002', mall: '上海恒隆广场', date: '2026-04-20', time: '08:00', status: 'pending' }
];

// 未上报柜台
const missingReports = [
  { counter: counters[1], lastReport: null, days: 3 },
  { counter: { name: 'Dior 恒隆广场' }, lastReport: null, days: 5 },
  { counter: { name: 'Gucci 国金中心' }, lastReport: null, days: 2 }
];

// 数据异常柜台
const abnormalCounters = [
  { counter: { name: 'LV 恒隆广场' }, issue: '销售额突增200%', suggest: '请核实数据' },
  { counter: { name: 'Hermès 国贸店' }, issue: '数据偏离均值', suggest: '请核实数据' }
];

// KPI数据
const kpiData = {
  todaySales: 2850000,
  competitorAvg: 2340000,
  marketShare: 24.5,
  reportRate: 92.3,
  trends: {
    sales: 12.5,
    competitor: 8.3,
    share: 2.1,
    rate: 5.2
  }
};

// 竞品数据对比
const competitorComparison = [
  { brand: 'Chanel', sales: 2850000, trend: 12.5 },
  { brand: 'Dior', sales: 2680000, trend: 8.2 },
  { brand: 'LV', sales: 2340000, trend: 5.8 },
  { brand: 'Gucci', sales: 2120000, trend: 3.2 },
  { brand: 'Hermès', sales: 1980000, trend: 6.5 }
];

// 竞品促销状态
const promotionStatus = [
  { brand: 'LV', type: '限时8折', startDate: '04-20', status: 'ongoing' },
  { brand: 'Dior', type: '满减活动', startDate: '04-18', status: 'ongoing' },
  { brand: 'Gucci', type: '节日促销', startDate: '04-15', status: 'ended' },
  { brand: 'Hermès', type: 'VIP专场', startDate: '04-12', status: 'ended' }
];

// Toast提示函数
function showToast(message, duration = 2000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), duration);
}

// 格式化金额
function formatMoney(amount) {
  if (amount >= 10000) {
    return '¥' + (amount / 10000).toFixed(1) + '万';
  }
  return '¥' + amount.toLocaleString();
}

// 格式化日期
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}
