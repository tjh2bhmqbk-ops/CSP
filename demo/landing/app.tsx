import React from 'react'
import Taro from '@tarojs/taro'
import './app.scss'

// 立即执行 Demo 数据生成（模块加载时）
import { generateACDemoData } from './utils/constants'

class App extends React.Component {
  componentDidMount() {
    // 应用启动时生成 Demo 数据
    try {
      generateACDemoData()
      console.log('[AC App] Demo data generated on mount')
    } catch (e) {
      console.error('[AC App] Demo init failed:', e)
    }
  }

  componentDidShow() {
    // 每次显示时再次确保数据存在
    try {
      generateACDemoData()
    } catch (e) {
      console.warn('[AC App] Demo refresh failed:', e)
    }
  }

  componentDidHide() {}

  render() {
    return this.props.children
  }
}

export default App
