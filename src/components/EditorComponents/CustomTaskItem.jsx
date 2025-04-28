import TaskItem from '@tiptap/extension-task-item'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { ReactNodeViewRenderer } from '@tiptap/react'

import { Node, mergeAttributes } from '@tiptap/core'

// 自定义React组件
function TaskItemComponent({ node, updateAttributes, editor }) {
  return (
    <NodeViewWrapper as="li" data-checked={node.attrs.checked ? 'true' : 'false'} className="task-item">
      <label contentEditable={false}>
        <input
          type="checkbox"
          checked={node.attrs.checked}
          onChange={event => {
            updateAttributes({ checked: event.target.checked })
          }}
        />
      </label>
      <NodeViewContent as="div" className="content" />
    </NodeViewWrapper>
  )
}

export const CustomTaskItem = TaskItem.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TaskItemComponent, {
      stopEvent: ({ event }) => {
        // 防止React内部触发错误事件
        if (event.target instanceof HTMLInputElement) {
          return true
        }
        return false
      },
    })
  },
})
