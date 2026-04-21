import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { TodoItem } from '../index'
import { formatMoney } from '@/utils/constants'

interface Props {
  visible: boolean
  item: TodoItem | null
  onClose: () => void
}

const TodoDetailModal: React.FC<Props> = ({ visible, item, onClose }) => {
  if (!visible || !item) return null

  const handleGoEdit = () => {
    onClose()
    if (item.linkedDate) {
      Taro.navigateTo({
        url: `/pages/ba-daily/index?date=${item.linkedDate}&mode=edit`,
      })
    }
  }

  return (
    <View className="modal-mask" onClick={onClose}>
      <View className="modal-body" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <View className="modal-header">
          <Text className="modal-title">详情</Text>
          <View className="modal-close" onClick={onClose}><text>✕</text></View>
        </View>

        {/* 内容 */}
        <View className="modal-content-area">
          <View className="info-block">
            <Text className="info-label">事项标题</Text>
            <Text className="info-val">{item.title}</Text>
          </View>

          <View className="info-block">
            <Text className="info-label">说明</Text>
            <Text className="info-val">{item.desc}</Text>
          </View>

          <View className="info-block">
            <Text className="info-label">时间</Text>
            <Text className="info-val">{item.time}</Text>
          </View>

          {item.linkedRecord?.competitors && (
            <View className="data-preview">
              <Text className="data-preview__title">关联数据预览</Text>
              {item.linkedRecord.competitors.map(c => (
                <View key={c.brand} className="data-row">
                  <Text className="data-brand">{c.brand}</Text>
                  <Text className="data-sales">¥{formatMoney(c.sales)}</Text>
                </View>
              ))}
            </View>
          )}

          {item.linkedRecord?.remark && (
            <View className="info-block">
              <Text className="info-label">备注</Text>
              <Text className="info-val remark-txt">{item.linkedRecord.remark}</Text>
            </View>
          )}
        </View>

        {/* 底部按钮 */}
        {(item.type === 'daily_rejected' || item.type === 'daily_pending') && (
          <View className="modal-footer">
            <View className="modal-btn --primary" onClick={handleGoEdit}>
              <Text className="modal-btn-text">{item.type === 'daily_rejected' ? '去修改重提' : '去查看编辑'}</Text>
            </View>
          </View>
        )}

        {!(item.type === 'daily_rejected' || item.type === 'daily_pending') && (
          <View className="modal-footer">
            <View className="modal-btn" onClick={onClose}>
              <Text className="modal-btn-text">关闭</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export default TodoDetailModal
