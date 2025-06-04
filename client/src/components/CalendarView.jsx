// CalendarView.jsx
import { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const localizer = momentLocalizer(moment);

// 预设调色板（按需增减）
const PALETTE = [
  '#1e88e5', // blue
  '#ef6c00', // orange
  '#43a047', // green
  '#8e24aa', // purple
  '#f4511e', // deep orange
  '#3949ab', // indigo
  '#00897b', // teal
];

export default function CalendarView({ events, onSelectEvent, style }) {

  const { t } = useTranslation();  // 🌟 直接用t函数
  const [lang, setLang] = useState('zh');
  const messages = {
    today: t('calendar.today'),
    previous: t('calendar.previous'),
    next: t('calendar.next'),
    month: t('calendar.month'),
    week: t('calendar.week'),
    day: t('calendar.day'),
    agenda: t('calendar.agenda'),
    date: t('calendar.date'),
    time: t('calendar.time'),
    event: t('calendar.event'),
    allDay: t('calendar.allDay'),
    noEventsInRange: t('calendar.noEventsInRange'),
  };

  const [currentView, setCurrentView] = useState('month');

  const [viewDate, setViewDate] = useState(new Date());

  // 把 events ➜ coloredEvents：全局扫描线
  const coloredEvents = useMemo(() => {
    const isDev = import.meta.env.DEV && events?.length;
    
    //if (isDev) console.time('coloredEvents');
    if (!events?.length) return [];

    // 克隆，避免直接改 props
    const out = events.map(e => ({ ...e }));

    // 按 start 时间排序
    out.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const active = [];          // 当前重叠集合：存 { end, _colorIdx }
    const used = new Set();     // 当前被占用的颜色 idx

    out.forEach(ev => {
      // 移除已经结束的区间，归还颜色
      for (let i = active.length - 1; i >= 0; i--) {
        if (active[i].end <= ev.start) {
          used.delete(active[i]._colorIdx);
          active.splice(i, 1);
        }
      }

      // 分配新颜色：防止死循环
      let idx = 0, tries = 0;
      while (used.has(idx) && tries < PALETTE.length) {
        idx = (idx + 1) % PALETTE.length;
        tries++;
      }
      // 超出颜色数就默认回到0或者给个透明色
      if (tries >= PALETTE.length) {
        idx = 0; // 或者 ev._colorIdx = -1 代表“透明样式”
      }
      ev._colorIdx = idx;
      used.add(idx);
      active.push(ev);
    });
    //if (isDev) console.time('coloredEvents');
    return out;
  }, [events]);

  /* ---------- ❷ 事件样式 ---------- */
  const eventPropGetter = ev => ({
    style: {
      backgroundColor: PALETTE[ev._colorIdx],
      border: 'none',
      borderRadius: 4,
      color: '#fff',
      paddingLeft: 4,
    },
  });

  return (
    <Box sx={{ 
      width: '100%', 
      height: style?.height || 600,
      '& .rbc-calendar': {
        width: '100%',
        height: '100%'
      },
      '& .rbc-month-view': {
        height: 'auto',
        flex: '1 0 0',
      },
      '& .rbc-month-row': {
        minHeight: '80px', // 增加行高
      },
      '& .rbc-date-cell': {
        padding: '5px',
      },
      '& .rbc-toolbar button': {
        padding: '2px 6px',  // 调小按钮内边距
        fontSize: '0.75rem', // 调小文字大小
        minHeight: '28px',    // 调小按钮高度
      },
    }}>
    <Calendar
      localizer={localizer}
      events={coloredEvents}
      eventPropGetter={eventPropGetter}
      startAccessor="start"
      endAccessor="end"
      style={{ height: '100%', width: '100%' }} // 如果未提供 style，则使用默认高度

      /* ② 把 date 绑定到 state */
      date={viewDate}
      /* ③ 当用户点 next/prev，更新 state */
      onNavigate={(newDate) => setViewDate(newDate)}

      onSelectEvent={onSelectEvent}

      // 启用  week  day  agenda
      views={['month', 'week', 'day', 'agenda']}
      view={currentView}
      onView={(newView) => setCurrentView(newView)}

      messages={messages}
    />
    </Box>
  );
}