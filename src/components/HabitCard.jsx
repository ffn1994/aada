import { useState } from 'react';

export default function HabitCard({
  habit, isCompleted, onToggle, onPress, theme,
  draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging, isOver,
}) {
  const [popping, setPopping] = useState(false);

  function handleToggle(e) {
    e.stopPropagation();
    if (!isCompleted) {
      setPopping(true);
      setTimeout(() => setPopping(false), 400);
    }
    onToggle();
  }

  const cardStyle = isCompleted ? {
    background: theme.doneBg,
    border: `1px solid ${theme.doneBorder}`,
    boxShadow: '0 2px 16px rgba(59,130,246,0.1)',
  } : {
    background: theme.card,
    border: `1px solid ${isOver ? 'rgba(59,130,246,0.5)' : theme.border}`,
    boxShadow: theme.shadow,
  };

  return (
    <div
      onClick={onPress}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className="rounded-2xl px-4 py-4 flex items-center gap-3 transition-all duration-200 select-none"
      style={{
        ...cardStyle,
        opacity: isDragging ? 0.4 : 1,
        cursor: draggable ? 'grab' : 'pointer',
        borderTopWidth: isOver ? '3px' : '1px',
        borderTopColor: isOver ? '#3b82f6' : undefined,
      }}
    >
      {/* Drag grip */}
      {draggable && (
        <div className="shrink-0 flex flex-col gap-0.5 opacity-30" style={{ cursor: 'grab' }}>
          {[0,1,2].map(i => (
            <div key={i} className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full" style={{ background: theme.t2 }} />
              <div className="w-1 h-1 rounded-full" style={{ background: theme.t2 }} />
            </div>
          ))}
        </div>
      )}

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
        style={{ background: isCompleted ? 'rgba(59,130,246,0.12)' : `rgba(${theme === theme ? '0,0,0' : '255,255,255'},0.04)` }}
      >
        {habit.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-snug truncate" style={{ color: theme.t1 }}>
          {habit.name}
        </p>
        <p className="text-xs mt-0.5">
          {habit.streak > 0
            ? <span className="text-amber-500">🔥 {habit.streak} {habit.streak === 1 ? 'يوم متتالٍ' : 'أيام متتالية'}</span>
            : <span style={{ color: theme.t3 }}>ابدأ اليوم!</span>
          }
        </p>
      </div>

      {/* Check button */}
      <button
        onClick={handleToggle}
        aria-label={isCompleted ? 'إلغاء' : 'تأشير كمكتمل'}
        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border-2 ${popping ? 'animate-pop' : ''}`}
        style={isCompleted ? {
          background: '#3b82f6',
          borderColor: '#3b82f6',
          boxShadow: '0 0 16px rgba(59,130,246,0.45)',
        } : {
          background: 'transparent',
          borderColor: theme.t3,
        }}
      >
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path
            d="M1.5 6L5.5 10.5L14.5 1.5"
            stroke={isCompleted ? 'white' : theme.t3}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
