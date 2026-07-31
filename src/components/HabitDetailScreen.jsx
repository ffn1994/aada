import { useState } from 'react';
import { getToday, getDaysInMonth, getFirstDayOfMonth, formatMonthYear } from '../utils/dateUtils';

const WEEKDAYS = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
const FREQ_OPTIONS = [
  { key: 'daily',    label: 'يومياً',     days: [0,1,2,3,4,5,6] },
  { key: 'weekdays', label: 'أيام العمل', days: [1,2,3,4,5] },
  { key: 'weekend',  label: 'عطلة',       days: [0,6] },
  { key: 'custom',   label: 'مخصص',       days: [] },
];

export default function HabitDetailScreen({ habit, isCompletedToday, onToggle, onSaveNote, onDelete, onArchive, onRename, onUpdateFrequency, onBack, theme }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(habit.name);
  const [noteInput, setNoteInput] = useState(habit.completionNotes?.[getToday()] ?? '');
  const [noteSaved, setNoteSaved] = useState(false);
  const [editingFreq, setEditingFreq] = useState(false);
  const [freqKey, setFreqKey] = useState(habit.frequency ?? 'daily');
  const [freqDays, setFreqDays] = useState(habit.frequencyDays ?? [0,1,2,3,4,5,6]);

  function saveRename() {
    if (nameInput.trim()) onRename(nameInput.trim());
    setEditingName(false);
  }

  function handleSaveNote() {
    onSaveNote(noteInput.trim());
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  }

  function handleFreqChange(key) {
    setFreqKey(key);
    if (key !== 'custom') setFreqDays(FREQ_OPTIONS.find(f => f.key === key).days);
  }

  function toggleFreqDay(d) {
    setFreqDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort((a,b) => a-b));
  }

  function saveFrequency() {
    const days = freqKey === 'custom' ? freqDays : FREQ_OPTIONS.find(f => f.key === freqKey).days;
    onUpdateFrequency(freqKey, days);
    setEditingFreq(false);
  }

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const todayStr = getToday();
  const completedSet = new Set(habit.completedDates || []);
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const totalDone = (habit.completedDates || []).length;

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const STATS = [
    { value: habit.streak,        label: 'السلسلة الحالية', color: '#22c55e', emoji: '🔥' },
    { value: habit.longestStreak, label: 'أطول سلسلة',     color: '#f59e0b', emoji: '🏆' },
    { value: totalDone,           label: 'إجمالي الأيام',   color: '#818cf8', emoji: '📅' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.bg }}>

      {/* Header */}
      <div className="px-5 pt-10 pb-5" style={{ background: theme.headerGrad }}>
        <button onClick={onBack} className="flex items-center gap-1.5 transition-colors text-sm mb-3" style={{ color: theme.t2 }}>
          <span className="text-base">›</span>
          <span>رجوع</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            {habit.icon}
          </div>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveRename()}
                  className="flex-1 rounded-xl px-3 py-1.5 text-sm outline-none"
                  style={{ border: '2px solid rgba(59,130,246,0.5)', background: theme.input, color: theme.t1 }}
                  maxLength={40}
                />
                <button onClick={saveRename} className="text-xs font-bold px-3 py-1.5 rounded-lg text-white shrink-0" style={{ background: '#3b82f6' }}>حفظ</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold leading-tight truncate" style={{ color: theme.t1 }}>{habit.name}</h1>
                <button onClick={() => { setNameInput(habit.name); setEditingName(true); }} className="text-gray-400 hover:text-gray-600 shrink-0 transition-colors" title="تعديل الاسم">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pb-8 overflow-y-auto">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {STATS.map(({ value, label, color, emoji }) => (
            <div key={label} className="rounded-2xl p-3 text-center"
              style={{ background: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
              <div className="text-2xl font-bold" style={{ color }}>{value}</div>
              <div className="text-xs mt-1 leading-tight" style={{ color: theme.t2 }}>{emoji} {label}</div>
            </div>
          ))}
        </div>

        {/* Toggle today */}
        <button
          onClick={onToggle}
          className="w-full py-3.5 rounded-2xl font-bold text-sm mb-4 transition-all active:scale-[0.97]"
          style={isCompletedToday ? {
            background: 'rgba(59,130,246,0.08)', border: '2px solid rgba(59,130,246,0.4)', color: '#3b82f6',
          } : {
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            boxShadow: '0 4px 20px rgba(59,130,246,0.35)', color: 'white', border: '2px solid transparent',
          }}
        >
          {isCompletedToday ? '✓ مكتمل اليوم — اضغط للإلغاء' : '◉ تأشير كمكتمل اليوم'}
        </button>

        {/* Frequency editor */}
        <div className="mb-4 rounded-2xl p-4" style={{ background: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold" style={{ color: theme.t2 }}>🔁 التكرار</p>
            {!editingFreq ? (
              <button
                onClick={() => setEditingFreq(true)}
                className="text-xs px-3 py-1 rounded-lg"
                style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}
              >تعديل</button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditingFreq(false)} className="text-xs px-3 py-1 rounded-lg" style={{ background: theme.elevated, color: theme.t2 }}>إلغاء</button>
                <button onClick={saveFrequency} className="text-xs px-3 py-1 rounded-lg font-bold" style={{ background: '#3b82f6', color: 'white' }}>حفظ</button>
              </div>
            )}
          </div>
          {!editingFreq ? (
            <p className="text-sm font-medium" style={{ color: theme.t1 }}>
              {FREQ_OPTIONS.find(f => f.key === (habit.frequency ?? 'daily'))?.label ?? 'يومياً'}
              {habit.frequency === 'custom' && habit.frequencyDays && (
                <span style={{ color: theme.t2, fontSize: 11 }}> — {habit.frequencyDays.map(d => WEEKDAYS[d]).join(' ')}</span>
              )}
            </p>
          ) : (
            <div>
              <div className="flex gap-2 flex-wrap mb-2">
                {FREQ_OPTIONS.map(({ key, label }) => (
                  <button key={key} onClick={() => handleFreqChange(key)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={freqKey === key ? { background: '#3b82f6', color: 'white' } : { background: theme.elevated, color: theme.t2, border: `1px solid ${theme.border}` }}
                  >{label}</button>
                ))}
              </div>
              {freqKey === 'custom' && (
                <div className="flex gap-2 mt-1">
                  {WEEKDAYS.map((d, i) => (
                    <button key={i} onClick={() => toggleFreqDay(i)}
                      className="w-8 h-8 rounded-full text-xs font-bold transition-all"
                      style={freqDays.includes(i) ? { background: '#3b82f6', color: 'white' } : { background: theme.elevated, color: theme.t2, border: `1px solid ${theme.border}` }}
                    >{d}</button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Note for today */}
        {isCompletedToday && (
          <div className="mb-5 rounded-2xl p-4" style={{ background: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
            <p className="text-xs font-semibold mb-2" style={{ color: theme.t2 }}>📝 ملاحظة اليوم</p>
            <textarea
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              placeholder="كيف كانت التجربة اليوم؟ (اختياري)"
              rows={2}
              maxLength={200}
              className="w-full resize-none rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background: theme.elevated, color: theme.t1, border: `1px solid ${theme.borderMd}`, fontFamily: 'inherit' }}
            />
            <button
              onClick={handleSaveNote}
              className="mt-2 text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95"
              style={{ background: noteSaved ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.1)', color: noteSaved ? '#22c55e' : '#3b82f6', border: `1px solid ${noteSaved ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.2)'}` }}
            >
              {noteSaved ? '✓ تم الحفظ' : 'حفظ الملاحظة'}
            </button>
          </div>
        )}

        {/* Calendar */}
        <div className="rounded-2xl p-4 mb-5" style={{ background: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
          <div className="flex items-center justify-between mb-4" dir="ltr">
            <button onClick={prevMonth} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors text-xl" style={{ background: 'rgba(0,0,0,0.06)' }}>‹</button>
            <span className="font-semibold text-sm" style={{ color: theme.t1 }} dir="rtl">{formatMonthYear(year, month)}</span>
            <button onClick={nextMonth} disabled={isCurrentMonth} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors text-xl disabled:opacity-25" style={{ background: 'rgba(0,0,0,0.06)' }}>›</button>
          </div>
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map(d => <div key={d} className="text-center text-gray-400 text-xs py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-1.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const done = completedSet.has(dateStr);
              const isToday = dateStr === todayStr;
              const note = habit.completionNotes?.[dateStr];
              return (
                <div key={d} className="flex items-center justify-center" title={note || ''}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all relative"
                    style={done ? {
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white', boxShadow: '0 2px 8px rgba(59,130,246,0.4)',
                    } : isToday ? {
                      border: '1.5px solid rgba(59,130,246,0.6)', color: '#3b82f6',
                    } : { color: theme.t3 }}
                  >
                    {d}
                    {note && <span style={{ position: 'absolute', bottom: -2, right: -2, fontSize: 8 }}>💬</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Archive */}
        <button
          onClick={onArchive}
          className="w-full py-3 rounded-2xl text-sm font-medium mb-3 transition-colors active:scale-[0.97]"
          style={{ border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.06)', color: '#f59e0b' }}
        >
          📦 أرشفة هذه العادة (بدون حذف)
        </button>

        {/* Delete */}
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-full py-3 rounded-2xl text-sm font-medium text-red-500 transition-colors active:scale-[0.97]"
            style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}
          >
            حذف هذه العادة نهائياً
          </button>
        ) : (
          <div className="rounded-2xl p-4" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p className="text-red-500 text-sm text-center mb-4">هل أنت متأكد؟ لا يمكن التراجع.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 py-3 rounded-xl text-sm font-medium active:scale-95" style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', color: theme.t2 }}>إلغاء</button>
              <button onClick={onDelete} className="flex-1 py-3 rounded-xl text-white text-sm font-bold active:scale-95" style={{ background: '#dc2626' }}>نعم، احذف</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
