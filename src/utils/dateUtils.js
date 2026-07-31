export function getToday() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatArabicDate() {
  return new Date().toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calcStreak(completedDates) {
  if (!completedDates || completedDates.length === 0) return 0;

  const sorted = [...completedDates].sort().reverse();
  const todayStr = getToday();
  const yestStr = getYesterday();

  if (sorted[0] !== todayStr && sorted[0] !== yestStr) return 0;

  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = new Date(sorted[i] + 'T12:00:00');
    const b = new Date(sorted[i + 1] + 'T12:00:00');
    const diff = Math.round((a - b) / 86400000);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export function formatMonthYear(year, month) {
  return new Date(year, month, 1).toLocaleDateString('ar-SA', {
    month: 'long',
    year: 'numeric',
  });
}

export function getLast7Days() {
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(
      `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    );
  }
  return days;
}

export function getArabicShortDay(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return ['أح','ن','ث','أر','خ','ج','س'][d.getDay()];
}
