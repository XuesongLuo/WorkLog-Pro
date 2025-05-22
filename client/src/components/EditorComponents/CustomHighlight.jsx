import { Mark } from '@tiptap/core'

export const CustomHighlight = Mark.create({
  name: 'highlight',

  addOptions() {
    return {
      multicolor: true,
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      color: {
        default: null,
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
        getAttrs: element => {
          const backgroundColor = element.style.backgroundColor
          return backgroundColor ? { color: backgroundColor } : false
        }
      },
      {
        tag: 'mark',
        getAttrs: element => {
          const backgroundColor = element.style.backgroundColor || element.getAttribute('data-color')
          return backgroundColor ? { color: backgroundColor } : false
        }
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { color, ...rest } = HTMLAttributes

    return ['span', { 
      style: color ? `background-color: ${color}` : undefined, 
      ...this.options.HTMLAttributes, 
      ...rest
    }, 0]
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