import { useState, useEffect, useRef } from 'react';
import { formatArabicDate } from '../utils/dateUtils';
import { requestNotificationPermission, isNotificationsEnabled, setNotificationsEnabled, getNotificationTime, setNotificationTime, scheduleNotification } from '../utils/notifications';
import HabitCard from './HabitCard';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'صباح الخير', emoji: '☀️' };
  if (h < 17) return { text: 'مساء النور', emoji: '🌤️' };
  return { text: 'مساء الخير', emoji: '🌙' };
}

function ProgressRing({ pct, theme }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke={theme.ringTrack} strokeWidth="5" />
      <circle
        cx="36" cy="36" r={r}
        fill="none" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        transform="rotate(-90 36 36)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="36" y="40" textAnchor="middle" fill={theme.t1} fontSize="14" fontWeight="700" fontFamily="Cairo,sans-serif">
        {pct}%
      </text>
    </svg>
  );
}

const CELEBRATE_EMOJIS = ['🎉', '⭐', '✨', '🌟', '🏆', '🎊', '💪', '🔥'];

function CelebrationParticle({ emoji, style }) {
  return (
    <span className="animate-float-up" style={{
      position: 'fixed', pointerEvents: 'none', fontSize: 28, zIndex: 100,
      ...style,
    }}>
      {emoji}
    </span>
  );
}

export default function HomeScreen({
  habits, completedCount, onToggle, isCompletedToday,
  onSelectHabit, onAddHabit, onOpenStats, onReorder,
  theme, isDark, onToggleTheme,
}) {
  const total = habits.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const allDone = total > 0 && completedCount === total;
  const { text, emoji } = greeting();

  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [particles, setParticles] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(isNotificationsEnabled());
  const [notifTime, setNotifTimeState] = useState(getNotificationTime());
  const prevAllDone = useRef(false);

  useEffect(() => {
    if (allDone && !prevAllDone.current && total > 0) {
      const newParticles = Array.from({ length: 10 }, (_, i) => ({
        id: Date.now() + i,
        emoji: CELEBRATE_EMOJIS[i % CELEBRATE_EMOJIS.length],
        left: `${10 + Math.random() * 80}%`,
        top: `${30 + Math.random() * 40}%`,
        delay: `${i * 0.1}s`,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 2000);
    }
    prevAllDone.current = allDone;
  }, [allDone, total]);

  async function handleNotifToggle() {
    if (!notifEnabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        alert('يرجى السماح بالإشعارات من إعدادات المتصفح');
        return;
      }
      setNotificationsEnabled(true);
      setNotifEnabled(true);
      scheduleNotification(notifTime, total - completedCount);
    } else {
      setNotificationsEnabled(false);
      setNotifEnabled(false);
    }
  }

  function handleTimeChange(t) {
    setNotifTimeState(t);
    setNotificationTime(t);
    if (notifEnabled) scheduleNotification(t, total - completedCount);
  }

  function handleDragStart(i) { setDragIdx(i); }
  function handleDragOver(e, i) { e.preventDefault(); if (i !== overIdx) setOverIdx(i); }
  function handleDrop(i) {
    if (dragIdx !== null && dragIdx !== i) onReorder(dragIdx, i);
    setDragIdx(null); setOverIdx(null);
  }
  function handleDragEnd() { setDragIdx(null); setOverIdx(null); }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.bg }}>

      {/* Celebration particles */}
      {particles.map(p => (
        <CelebrationParticle key={p.id} emoji={p.emoji} style={{ left: p.left, top: p.top, animationDelay: p.delay }} />
      ))}

      {/* Header */}
      <div className="px-5 pt-10 pb-6" style={{ background: theme.headerGrad }}>
        <div className="flex items-center justify-between mb-1">
          <p style={{ color: theme.t3, fontSize: 11 }}>{formatArabicDate()}</p>
          <div className="flex items-center gap-2">
            {/* Notification button */}
            <button
              onClick={() => setShowNotifPanel(p => !p)}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: notifEnabled ? 'rgba(59,130,246,0.15)' : theme.card, border: `1px solid ${notifEnabled ? 'rgba(59,130,246,0.4)' : theme.border}` }}
              title="الإشعارات"
            >
              <span style={{ fontSize: 14 }}>{notifEnabled ? '🔔' : '🔕'}</span>
            </button>
            {/* Stats button */}
            <button
              onClick={onOpenStats}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: theme.card, border: `1px solid ${theme.border}` }}
              title="الإحصائيات"
            >
              <span style={{ fontSize: 14 }}>📊</span>
            </button>
            {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: theme.card, border: `1px solid ${theme.border}` }}
              title={isDark ? 'وضع النهار' : 'وضع الليل'}
            >
              <span style={{ fontSize: 14 }}>{isDark ? '☀️' : '🌙'}</span>
            </button>
          </div>
        </div>

        {/* Notification panel */}
        {showNotifPanel && (
          <div
            className="mt-3 rounded-2xl p-4"
            style={{ background: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadowLg }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: theme.t1 }}>إشعارات يومية</span>
              <button
                onClick={handleNotifToggle}
                className="w-10 h-6 rounded-full transition-colors relative"
                style={{ background: notifEnabled ? '#3b82f6' : theme.elevated, border: `1px solid ${theme.border}` }}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{ transform: notifEnabled ? 'translateX(-22px)' : 'translateX(-2px)' }}
                />
              </button>
            </div>
            {notifEnabled && (
              <div className="flex items-center gap-3">
                <label className="text-xs" style={{ color: theme.t2 }}>وقت التذكير</label>
                <input
                  type="time"
                  value={notifTime}
                  onChange={e => handleTimeChange(e.target.value)}
                  style={{
                    background: theme.input, color: theme.t1,
                    border: `1px solid ${theme.borderMd}`, borderRadius: 10,
                    padding: '4px 8px', fontSize: 13, fontFamily: 'inherit', outline: 'none',
                    direction: 'ltr',
                  }}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xl">{emoji}</span>
          <h1 className="text-xl font-bold" style={{ color: theme.t1 }}>{text}</h1>
        </div>
      </div>

      {/* Progress card */}
      {total > 0 && (
        <div
          className="mx-5 rounded-2xl p-4 mb-5 flex items-center gap-4"
          style={{
            background: allDone ? theme.doneBg : theme.card,
            border: `1px solid ${allDone ? theme.doneBorder : theme.border}`,
            boxShadow: theme.shadowLg,
          }}
        >
          <ProgressRing pct={pct} theme={theme} />
          <div className="flex-1">
            {allDone ? (
              <>
                <p className="font-bold text-sm" style={{ color: '#3b82f6' }}>أنجزت يومك! 🎉</p>
                <p className="text-xs mt-1" style={{ color: theme.t2 }}>كل العادات مكتملة اليوم</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-sm" style={{ color: theme.t1 }}>{completedCount} من {total} عادات</p>
                <p className="text-xs mt-1" style={{ color: theme.t2 }}>
                  {total - completedCount === 1 ? 'عادة واحدة متبقية' : `${total - completedCount} عادات متبقية`}
                </p>
              </>
            )}
            <div className="w-full rounded-full h-1.5 mt-3 overflow-hidden" style={{ background: theme.barTrack }}>
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: '#3b82f6' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Habits list */}
      <div className="flex-1 px-5">
        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center gap-3 pt-16 pb-8">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-2"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
            >🌱</div>
            <h2 className="text-lg font-bold" style={{ color: theme.t1 }}>ابدأ رحلة التحسين</h2>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: theme.t2 }}>
              أضف أول عادة يومية وابدأ في بناء نسخة أفضل من نفسك
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {habits.map((habit, i) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={isCompletedToday(habit)}
                onToggle={() => onToggle(habit.id)}
                onPress={() => onSelectHabit(habit.id)}
                theme={theme}
                draggable={true}
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDrop={() => handleDrop(i)}
                onDragEnd={handleDragEnd}
                isDragging={dragIdx === i}
                isOver={overIdx === i && dragIdx !== i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add button */}
      <div
        className="sticky bottom-0 px-5 pt-4 pb-6"
        style={{ background: `linear-gradient(to top, ${theme.fadeUp} 55%, transparent)` }}
      >
        <button
          onClick={onAddHabit}
          className="w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 4px 20px rgba(59,130,246,0.4)' }}
        >
          <span className="text-lg leading-none font-light">+</span>
          <span>أضف عادة جديدة</span>
        </button>
      </div>
    </div>
  );
}
