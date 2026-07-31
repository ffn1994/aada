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

export function calcStreak(completedDates, frequencyDays = [0, 1, 2, 3, 4, 5, 6]) {
  if (!completedDates || completedDates.length === 0) return 0;

  const doneSet = new Set(completedDates);
  const todayStr = getToday();

  let streak = 0;
  const cursor = new Date(todayStr + 'T12:00:00');

  for (let i = 0; i < 1000; i++) {
    const ds = cursor.toISOString().slice(0, 10);
    const dow = cursor.getDay();

    if (frequencyDays.includes(dow)) {
      if (doneSet.has(ds)) {
        streak++;
      } else if (ds === todayStr) {
        // today scheduled but not done yet — don't penalise
      } else {
        break; // missed a scheduled day
      }
    }
    // non-scheduled days are transparent — just skip

    cursor.setDate(cursor.getDate() - 1);
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
