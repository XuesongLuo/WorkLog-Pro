import { Mark } from '@tiptap/core'

export const CustomHighlight = Mark.create({
  name: 'highlight',

  addOptions() {
    return {
      multicolor: false,
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: element => element.style.backgroundColor || null,
        renderHTML: attributes => {
          if (!attributes.color) {
            return {}
          }
          return {
            style: `background-color: ${attributes.color}`,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        style: 'background-color',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', { ...this.options.HTMLAttributes, ...HTMLAttributes }, 0]
  },

  addCommands() {
    return {
      setHighlight:
        attributes =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes)
        },
      toggleHighlight:
        attributes =>
        ({ commands }) => {
          return commands.toggleMark(this.name, attributes)
        },
      unsetHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
    }
  },
})
