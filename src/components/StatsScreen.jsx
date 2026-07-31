import { useState } from 'react';
import { getLast7Days, getArabicShortDay, getToday } from '../utils/dateUtils';

function WeekGrid({ habit, last7, today }) {
  const done = new Set(habit.completedDates || []);
  return (
    <div className="flex gap-1.5 mt-2">
      {last7.map(dateStr => {
        const isPast = dateStr < today;
        const isToday = dateStr === today;
        const completed = done.has(dateStr);
        return (
          <div key={dateStr} className="flex flex-col items-center gap-1 flex-1">
            <span style={{ fontSize: 9, color: '#94a3b8' }}>{getArabicShortDay(dateStr)}</span>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={completed ? {
                background: 'linear-gradient(135deg,#3b82f6,#2563eb)',
                boxShadow: '0 2px 6px rgba(59,130,246,0.4)',
              } : isToday ? {
                border: '2px solid rgba(59,130,246,0.5)',
              } : isPast ? {
                background: 'rgba(148,163,184,0.2)',
              } : { background: 'transparent' }}
            >
              {completed && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function exportData(habits) {
  const data = {
    exportedAt: new Date().toISOString(),
    habits: habits.map(h => ({
      name: h.name,
      icon: h.icon,
      streak: h.streak,
      longestStreak: h.longestStreak,
      totalCompletions: h.completedDates.length,
      completedDates: h.completedDates,
      notes: h.completionNotes,
      frequency: h.frequency,
      createdAt: h.createdAt,
    })),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `عاداتي-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCSV(habits) {
  const today = getToday();
  const rows = [['الاسم', 'الأيقونة', 'السلسلة', 'أطول سلسلة', 'إجمالي الأيام', 'مكتمل اليوم']];
  habits.forEach(h => {
    rows.push([
      h.name, h.icon, h.streak, h.longestStreak,
      h.completedDates.length,
      h.completedDates.includes(today) ? 'نعم' : 'لا',
    ]);
  });
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `عاداتي-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function StatsScreen({ habits, archivedHabits = [], onLoadArchived, onRestoreHabit, onBack, onSignOut, theme }) {
  const last7 = getLast7Days();
  const today = getToday();
  const [showArchived, setShowArchived] = useState(false);
  const [archivedLoaded, setArchivedLoaded] = useState(false);

  async function handleShowArchived() {
    if (!archivedLoaded) {
      await onLoadArchived?.();
      setArchivedLoaded(true);
    }
    setShowArchived(v => !v);
  }

  const totalHabits = habits.length;
  const doneToday = habits.filter(h => (h.completedDates || []).includes(today)).length;
  const pctToday = totalHabits > 0 ? Math.round((doneToday / totalHabits) * 100) : 0;
  const totalCompletions = habits.flatMap(h => h.completedDates || []).length;

  const topHabit = habits.length > 0
    ? habits.reduce((best, h) => (h.streak > best.streak ? h : best), habits[0])
    : null;

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: theme.bg }}>

      {/* Header */}
      <div className="px-5 pt-10 pb-5 shrink-0" style={{ background: theme.headerGrad }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm transition-colors" style={{ color: theme.t2 }}>
            <span className="text-base">›</span>
            <span>رجوع</span>
          </button>
          <button
            onClick={onSignOut}
            className="text-xs px-3 py-1.5 rounded-xl transition-colors"
            style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            خروج
          </button>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ color: theme.t1 }}>الإحصائيات 📊</h1>
          <div className="flex gap-2">
            <button
              onClick={() => exportCSV(habits)}
              className="text-xs px-3 py-1.5 rounded-xl transition-colors"
              style={{ background: theme.card, color: theme.t2, border: `1px solid ${theme.border}` }}
            >
              CSV ↓
            </button>
            <button
              onClick={() => exportData(habits)}
              className="text-xs px-3 py-1.5 rounded-xl transition-colors"
              style={{ background: theme.card, color: theme.t2, border: `1px solid ${theme.border}` }}
            >
              JSON ↓
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6 mt-1">
          {[
            { value: totalHabits, label: 'إجمالي العادات', emoji: '📋' },
            { value: `${pctToday}%`, label: 'إنجاز اليوم', emoji: '✅' },
            { value: totalCompletions, label: 'كل الإنجازات', emoji: '🏆' },
          ].map(({ value, label, emoji }) => (
            <div key={label} className="rounded-2xl p-3 text-center"
              style={{ background: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
              <div className="text-xl font-bold" style={{ color: '#3b82f6' }}>{value}</div>
              <div className="text-xs mt-1 leading-tight" style={{ color: theme.t2 }}>{emoji} {label}</div>
            </div>
          ))}
        </div>

        {/* Top streak */}
        {topHabit && topHabit.streak > 0 && (
          <div className="rounded-2xl p-4 mb-5 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.15),rgba(245,158,11,0.05))', border: '1px solid rgba(245,158,11,0.3)' }}>
            <span className="text-3xl">{topHabit.icon}</span>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#f59e0b' }}>🔥 أطول سلسلة حالية</p>
              <p className="font-bold text-sm mt-0.5" style={{ color: theme.t1 }}>{topHabit.name}</p>
              <p className="text-xs" style={{ color: theme.t2 }}>{topHabit.streak} يوم متتالٍ</p>
            </div>
          </div>
        )}

        {habits.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🌱</p>
            <p style={{ color: theme.t2 }}>لا توجد عادات بعد</p>
          </div>
        )}

        {/* Per-habit rows */}
        {habits.length > 0 && (
          <>
            <p className="text-xs font-semibold mb-3" style={{ color: theme.t3 }}>آخر 7 أيام لكل عادة</p>
            <div className="flex flex-col gap-3">
              {habits.map(habit => {
                const completedSet = new Set(habit.completedDates || []);
                const last7Done = last7.filter(d => completedSet.has(d)).length;
                const pct7 = Math.round((last7Done / 7) * 100);
                return (
                  <div key={habit.id} className="rounded-2xl p-4"
                    style={{ background: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl">{habit.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: theme.t1 }}>{habit.name}</p>
                        <p className="text-xs" style={{ color: theme.t2 }}>
                          {last7Done}/7 هذا الأسبوع · {pct7}%
                          {habit.streak > 0 && <span className="text-amber-500"> · 🔥 {habit.streak}</span>}
                        </p>
                      </div>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          background: pct7 >= 70 ? 'rgba(34,197,94,0.15)' : pct7 >= 40 ? 'rgba(245,158,11,0.15)' : 'rgba(148,163,184,0.1)',
                          color: pct7 >= 70 ? '#22c55e' : pct7 >= 40 ? '#f59e0b' : theme.t3,
                        }}
                      >
                        {pct7}%
                      </div>
                    </div>
                    <WeekGrid habit={habit} last7={last7} today={today} />
                  </div>
                );
              })}
            </div>
          </>
        )}
        {/* Archived habits */}
        <div className="mt-6">
          <button
            onClick={handleShowArchived}
            className="w-full py-3 rounded-2xl text-sm font-semibold transition-all"
            style={{ background: showArchived ? 'rgba(245,158,11,0.1)' : theme.card, color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)', boxShadow: theme.shadow }}
          >
            📦 {showArchived ? 'إخفاء' : 'عرض'} العادات المؤرشفة {archivedLoaded && archivedHabits.length > 0 ? `(${archivedHabits.length})` : ''}
          </button>

          {showArchived && (
            <div className="mt-3 flex flex-col gap-3">
              {archivedHabits.length === 0 ? (
                <p className="text-center py-6 text-sm" style={{ color: theme.t3 }}>لا توجد عادات مؤرشفة</p>
              ) : archivedHabits.map(habit => (
                <div key={habit.id} className="rounded-2xl p-4 flex items-center gap-3"
                  style={{ background: theme.card, border: `1px solid ${theme.border}`, opacity: 0.8 }}>
                  <span className="text-2xl">{habit.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: theme.t1 }}>{habit.name}</p>
                    <p className="text-xs" style={{ color: theme.t2 }}>
                      🔥 {habit.streak} · إجمالي {habit.completedDates?.length ?? 0} يوم
                    </p>
                  </div>
                  <button
                    onClick={() => onRestoreHabit?.(habit.id)}
                    className="text-xs px-3 py-1.5 rounded-xl font-semibold shrink-0"
                    style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}
                  >استعادة</button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
