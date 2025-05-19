import { Mark } from '@tiptap/core'

export const CustomTextStyle = Mark.create({
  name: 'textStyle',

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: element => element.style.color || null,
        renderHTML: attributes => {
          if (!attributes.color) return {}
          return { style: `color: ${attributes.color}` }
        },
      },
      fontFamily: {
        default: null,
        parseHTML: element => element.style.fontFamily || null,
        renderHTML: attributes => {
          if (!attributes.fontFamily) return {}
          return { style: `font-family: ${attributes.fontFamily}` }
        },
      },
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize || null,
        renderHTML: attributes => {
          if (!attributes.fontSize) return {}
          return { style: `font-size: ${attributes.fontSize}` }
        },
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0]
  },
})
