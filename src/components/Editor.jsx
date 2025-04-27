import { useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { findParentNodeClosestToPos } from 'prosemirror-utils'

import { BulletList as TiptapBulletList } from '@tiptap/extension-bullet-list'
import { OrderedList as TiptapOrderedList } from '@tiptap/extension-ordered-list'

import './editor.css'

// 表格选择器最大尺寸
const MAX_ROWS = 8
const MAX_COLS = 8

const colors = [
    '#000000', '#262626', '#595959', '#8c8c8c', '#bfbfbf', '#d9d9d9', '#f0f0f0', '#ffffff',
    '#ff4d4f', '#ff7a45', '#ffa940', '#ffc53d', '#ffec3d', '#bae637', '#73d13d', '#36cfc9',
    '#40a9ff', '#597ef7', '#9254de', '#f759ab',
]

const fontFamilies = [
    { label: 'Arial', value: 'Arial' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: '微软雅黑', value: 'Microsoft YaHei' },
    { label: '宋体', value: 'SimSun' },
    { label: '黑体', value: 'SimHei' },
]

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']

// 自定义BulletList扩展
const BulletList = TiptapBulletList.extend({
    addAttributes() {
        return {
            listStyleType: {
                default: 'disc',
                parseHTML: element => element.style.listStyleType || 'disc',
                renderHTML: attributes => {
                    return {
                        style: `list-style-type: ${attributes.listStyleType}`,
                    }
                },
            },
        }
    },
})
// 自定义OrderedList扩展
const OrderedList = TiptapOrderedList.extend({
    addAttributes() {
        return {
            listStyleType: {
                default: 'decimal',
                parseHTML: element => element.style.listStyleType || 'decimal',
                renderHTML: attributes => {
                    return {
                        style: `list-style-type: ${attributes.listStyleType}`,
                    }
                },
            },
        }
    },
})

export default function Editor() {
    const [showTextColor, setShowTextColor] = useState(false)
    const [showBgColor, setShowBgColor] = useState(false)
    const [currentTextColor, setCurrentTextColor] = useState('')
    const [currentBgColor, setCurrentBgColor] = useState('')
    const [currentFontSize, setCurrentFontSize] = useState('16px')
    
    const [currentBulletStyle, setCurrentBulletStyle] = useState('disc')       // 无序列表默认值
    const [currentOrderedStyle, setCurrentOrderedStyle] = useState('decimal')  // 有序列表默认值
    const [showBulletListStyles, setShowBulletListStyles] = useState(false);
    const [showOrderedListStyles, setShowOrderedListStyles] = useState(false);

    const [showTableSelector, setShowTableSelector] = useState(false)
    const [hoverRow, setHoverRow] = useState(0)
    const [hoverCol, setHoverCol] = useState(0)
    const [showContextMenu, setShowContextMenu] = useState(false)
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })
    const [canMergeCells, setCanMergeCells] = useState(false)        //  标记单元格是否可以合并
    const [canSplitCell, setCanSplitCell] = useState(false)       //  标记单元格是否可以拆分

    const toolbarRef = useRef(null)
    const fileInputRef = useRef(null)

    const editor = useEditor({
        extensions: [
        StarterKit.configure({
            bulletList:  false, //{ keepMarks: true, keepAttributes: false },
            orderedList: false, //{ keepMarks: true, keepAttributes: false },
            table: false, 
        }),
        BulletList,
        OrderedList,
        Underline,
        Strike,
        TextStyle,
        Color.configure({ types: ['textStyle'] }),
        Highlight.configure({ multicolor: true }),
        Image,
        TaskList,
        TaskItem.configure({
            nested: true,
        }),
        Table.configure({
            resizable: true,
        }),
        TableRow,
        TableCell,
        TableHeader,
        ],
        content: '<p>Hello ✨ 完整升级版！</p>',
    })

    // 点击页面空白区域自动收起色板或表格选择器，或者关闭右键菜单
    useEffect(() => {
        const handleClickOutside = (event) => { 
            if (event.button === 0) {
                if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
                    setShowTextColor(false)
                    setShowBgColor(false)
                    setShowBulletListStyles(false)
                    setShowOrderedListStyles(false)
                    setShowTableSelector(false)
                }
                const contextMenu = document.querySelector('.context-menu')
                if (contextMenu && !contextMenu.contains(event.target)) {
                    setShowContextMenu(false)
                }
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // 单元格是否可以合并和拆分监听
    useEffect(() => {
        if (!editor) return
        const updateCanMerge = () => {
            const selection = editor.state.selection
            const { from, to } = selection
            const { doc } = editor.state
      
            // 判断能否合并
            setCanMergeCells(from !== to)
            // 判断能否拆分
            const $from = doc.resolve(from)
            // 找到最近的 tableCell 或 tableHeader
            const cellNode = findParentNodeClosestToPos($from, node => node.type.name === 'tableCell' || node.type.name === 'tableHeader')

            if (cellNode && (cellNode.node.attrs.colspan > 1 || cellNode.node.attrs.rowspan > 1)) {
            setCanSplitCell(true)
            } else {
            setCanSplitCell(false)
            }
        }
        editor.on('selectionUpdate', updateCanMerge)
        return () => {
            editor.off('selectionUpdate', updateCanMerge)
        }
    }, [editor])

    // 监听selectionUpdate事件
    useEffect(() => {
        if (!editor) return
        const updateListStyles = () => {
            const { state } = editor
            const { from } = state.selection
            const $from = state.doc.resolve(from)
    
            const nodeTypes = $from.path.map(p => p?.type?.name).filter(Boolean)
    
            if (nodeTypes.includes('bulletList')) {
                const bulletAttrs = editor.getAttributes('bulletList')
                setCurrentBulletStyle(bulletAttrs.listStyleType || 'disc')
            } else if (nodeTypes.includes('orderedList')) {
                const orderedAttrs = editor.getAttributes('orderedList')
                setCurrentOrderedStyle(orderedAttrs.listStyleType || 'decimal')
            }
        }
    
        editor.on('selectionUpdate', updateListStyles)
        return () => {
            editor.off('selectionUpdate', updateListStyles)
        }
    }, [editor])


    const handleBulletListStyle = (style) => {
        const chain = editor.chain().focus()
        if (editor.isActive('orderedList')) {
            chain.toggleOrderedList()
        }
        if (!editor.isActive('bulletList')) {
            chain.toggleBulletList()
        }
        chain.updateAttributes('bulletList', { listStyleType: style }).run()
        setCurrentBulletStyle(style)
        setShowBulletListStyles(false)
    }
      
    const handleOrderedListStyle = (style) => {
        const chain = editor.chain().focus()
        if (editor.isActive('bulletList')) {
            chain.toggleBulletList()
        }
        if (!editor.isActive('orderedList')) {
            chain.toggleOrderedList()
        }
        chain.updateAttributes('orderedList', { listStyleType: style }).run()
        setCurrentOrderedStyle(style)
        setShowOrderedListStyles(false)
    }


    const handleUploadImage = (e) => {
        const file = e.target.files?.[0]
        if (file) {
        const blobUrl = URL.createObjectURL(file)
        editor.chain().focus().setImage({ src: blobUrl }).run()
        }
    }

    const handleInsertTable = () => {
        if (hoverRow > 0 && hoverCol > 0) {
        editor.chain().focus().insertTable({ rows: hoverRow + 1, cols: hoverCol + 1, withHeaderRow: true }).run()
        setShowTableSelector(false)
        setHoverRow(0)
        setHoverCol(0)
        }
    }

    const handleContextMenu = (e) => {
        e.preventDefault()   // 阻止浏览器默认清空选区！
        const cell = e.target.closest('td, th') // 只在表格单元格上触发右键菜单
        if (!cell) {
          setShowContextMenu(false)
          return
        }
        setContextMenuPos({ x: e.clientX, y: e.clientY })
        setShowContextMenu(true)
    }
      
    const insertRowAbove = () => {
        editor.chain().focus().addRowBefore().run()
        setShowContextMenu(false)
    }
    const insertRowBelow = () => {
        editor.chain().focus().addRowAfter().run()
        setShowContextMenu(false)
    }
    const deleteRow = () => {
        editor.chain().focus().deleteRow().run()
        setShowContextMenu(false)
    }
    const insertColumnBefore = () => {
        editor.chain().focus().addColumnBefore().run()
        setShowContextMenu(false)
    }
    const insertColumnAfter = () => {
        editor.chain().focus().addColumnAfter().run()
        setShowContextMenu(false)
    }
    const deleteColumn = () => {
        editor.chain().focus().deleteColumn().run()
        setShowContextMenu(false)
    }
    const mergeCells = () => {
        editor.chain().focus().mergeCells().run()
        setShowContextMenu(false)
    }
      
    const splitCell = () => {
        editor.chain().focus().splitCell().run()
        setShowContextMenu(false)
    }


    if (!editor) {
        return null
    }

    return (
        <div className="editor-container">
            <div className="toolbar" ref={toolbarRef}>
                {/* 块类型选择 */}
                <select
                onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'paragraph') {
                    editor.chain().focus().setParagraph().run();
                    } else if (value === 'blockquote') {
                    editor.chain().focus().toggleBlockquote().run();
                    } else if (value === 'codeBlock') {
                    editor.chain().focus().toggleCodeBlock().run();
                    } else {
                    editor.chain().focus().toggleHeading({ level: Number(value) }).run();
                    }
                }}
                value={
                    editor.isActive('heading', { level: 1 }) ? '1'
                    : editor.isActive('heading', { level: 2 }) ? '2'
                    : editor.isActive('heading', { level: 3 }) ? '3'
                    : editor.isActive('blockquote') ? 'blockquote'
                    : editor.isActive('codeBlock') ? 'codeBlock'
                    : 'paragraph'
                }
                >
                <option value="paragraph">正文</option>
                <option value="1">标题1</option>
                <option value="2">标题2</option>
                <option value="3">标题3</option>
                <option value="blockquote">引用块</option>
                <option value="codeBlock">代码块</option>
                </select>

                {/* 字体类型选择 */}
                <select
                onChange={(e) => {
                    const font = e.target.value
                    editor.chain().focus().setMark('textStyle', { fontFamily: font }).run()
                }}
                >
                {fontFamilies.map(item => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                ))}
                </select>

                {/* 字体大小选择 */}
                <select
                onChange={(e) => {
                    const size = e.target.value;
                    editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
                    setCurrentFontSize(size)
                }}
                value={currentFontSize}
                >
                {fontSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                ))}
                </select>

                {/* 基本格式 */}
                <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>B</button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}><i>I</i></button>
                <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'is-active' : ''}><u>U</u></button>
                <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}><s>S</s></button>

                {/* 文字颜色选择 */}
                <div className="dropdown">
                <button onClick={() => { setShowTextColor(!showTextColor); setShowBgColor(false); }}>
                    <span className="color-preview" style={{ backgroundColor: currentTextColor || '#000' }}></span>
                </button>
                {showTextColor && (
                    <div className="color-palette floating">
                    {colors.map((color) => (
                        <button
                        key={color}
                        style={{ backgroundColor: color }}
                        className={`color-button ${editor.getAttributes('textStyle').color === color ? 'is-active' : ''}`}
                        onClick={() => {
                            editor.chain().focus().setColor(color).run();
                            setCurrentTextColor(color)
                            setShowTextColor(false);
                        }}
                        />
                    ))}
                    </div>
                )}
                </div>

                {/* 背景颜色选择 */}
                <div className="dropdown">
                <button onClick={() => { setShowBgColor(!showBgColor); setShowTextColor(false); }}>
                    <span className="color-preview" style={{ backgroundColor: currentBgColor || '#fff' }}></span> 背景色
                </button>
                {showBgColor && (
                    <div className="color-palette floating">
                    {colors.map((color) => (
                        <button
                        key={color}
                        style={{ backgroundColor: color }}
                        className={`color-button ${editor.isActive('highlight', { color }) ? 'is-active' : ''}`}
                        onClick={() => {
                            editor.chain().focus().setHighlight({ color }).run();
                            setCurrentBgColor(color)
                            setShowBgColor(false);
                        }}
                        />
                    ))}
                    </div>
                )}
                </div>

                {/* 无序列表按钮 */}
                <div className="dropdown">
                    <div className="split-button">
                        <button onClick={() => {
                            const chain = editor.chain().focus()
                            if (!editor.isActive('bulletList')) {
                                editor.chain().focus().toggleBulletList().run(); // 先切换bulletList
                            }
                            editor.chain().focus().updateAttributes('bulletList', { listStyleType: currentBulletStyle }).run()
                        }}>
                            {currentBulletStyle === 'disc' ? '•' : currentBulletStyle === 'circle' ? '○' : '▪'}
                        </button>
                        <button className="split-toggle" 
                            onClick={() => {
                                setShowBulletListStyles(!showBulletListStyles)
                                setShowOrderedListStyles(false)
                            }}
                        >
                        ▼
                        </button>
                    </div>
                    {showBulletListStyles && (
                        <div className="list-style-palette floating">
                        <button onClick={() => handleBulletListStyle('disc')}>•</button>
                        <button onClick={() => handleBulletListStyle('circle')}>○</button>
                        <button onClick={() => handleBulletListStyle('square')}>▪</button>
                        </div>
                    )}
                </div>
                {/* 有序列表按钮 */}
                <div className="dropdown">
                    <div className="split-button">
                        {/* 主按钮 - 点击直接应用默认有序列表 */}
                        <button onClick={() => {
                            const chain = editor.chain().focus();
                            if (!editor.isActive('orderedList')) {
                                editor.chain().focus().toggleOrderedList().run(); // 先切换orderedList
                            }
                            editor.chain().focus().updateAttributes('orderedList', { listStyleType: currentOrderedStyle }).run(); // 再设置样式
                        }}>
                            {
                                currentOrderedStyle === 'decimal' ? '1.' :
                                currentOrderedStyle === 'lower-alpha' ? 'a.' :
                                currentOrderedStyle === 'upper-alpha' ? 'A.' :
                                currentOrderedStyle === 'lower-roman' ? 'i.' :
                                currentOrderedStyle === 'upper-roman' ? 'I.' : '1.'
                            }
                        </button>

                        {/* 小三角按钮 - 点击展开样式选择 */}
                        <button
                        className="split-toggle"
                        onClick={() => {
                            setShowOrderedListStyles(!showOrderedListStyles);
                            setShowBulletListStyles(false);
                        }}
                        >
                        ▼
                        </button>
                    </div>

                    {/* 浮动下拉列表 */}
                    {showOrderedListStyles && (
                        <div className="list-style-palette floating">
                        <button onClick={() => handleOrderedListStyle('decimal')}>1.2.3</button>
                        <button onClick={() => handleOrderedListStyle('lower-alpha')}>a.b.c</button>
                        <button onClick={() => handleOrderedListStyle('upper-alpha')}>A.B.C</button>
                        <button onClick={() => handleOrderedListStyle('lower-roman')}>i.ii.iii</button>
                        <button onClick={() => handleOrderedListStyle('upper-roman')}>I.II.III</button>
                        </div>
                    )}
                </div>
                {/* 
                <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>• List</button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>1. List</button>
                */}

                <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={editor.isActive('taskList') ? 'is-active' : ''}>☑️</button>

                {/* 插入图片 */}
                <button onClick={() => fileInputRef.current.click()}>🖼️</button>
                <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleUploadImage}
                />

                {/* 插入表格按钮 */}
                <div className="dropdown">
                <button onClick={() => setShowTableSelector(!showTableSelector)}>📋</button>
                {showTableSelector && (
                    <div className="table-selector">
                    {[...Array(MAX_ROWS)].map((_, row) => (
                        <div className="table-selector-row" key={row}>
                        {[...Array(MAX_COLS)].map((_, col) => (
                            <div
                            key={col}
                            className={`table-selector-cell ${(row <= hoverRow && col <= hoverCol) ? 'selected' : ''}`}
                            onMouseEnter={() => {
                                setHoverRow(row)
                                setHoverCol(col)
                            }}
                            onClick={handleInsertTable}
                            />
                        ))}
                        </div>
                    ))}
                    {hoverRow >= 0 && hoverCol >= 0 && (
                        <div className="table-size-info">{hoverRow + 1} × {hoverCol + 1}</div>
                    )}
                    </div>
                )}
                </div>


                {/* 撤销重做 */}
                <button onClick={() => editor.chain().focus().undo().run()}>↺</button>
                <button onClick={() => editor.chain().focus().redo().run()}>↻</button>
            </div>
            <EditorContent editor={editor} onContextMenu={handleContextMenu} />
            {showContextMenu && (
                <div
                    className="context-menu"
                    style={{
                        top: contextMenuPos.y,
                        left: contextMenuPos.x,
                        position: 'absolute',
                        background: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        zIndex: 999,
                    }}
                >
                    <button onClick={insertRowAbove}>上方插入行</button>
                    <button onClick={insertRowBelow}>下方插入行</button>
                    <button onClick={deleteRow}>删除行</button>
                    <hr />
                    <button onClick={insertColumnBefore}>左方插入列</button>
                    <button onClick={insertColumnAfter}>右方插入列</button>
                    <button onClick={deleteColumn}>删除列</button>
                    <hr />
                    <button onClick={mergeCells} disabled={!canMergeCells}>合并单元格</button>
                    <button onClick={splitCell} disabled={!canSplitCell}>拆分单元格</button>
                </div>
            )}
        </div>
    )
}
