export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function getNotificationTime() {
  return localStorage.getItem('notif-time') || '08:00';
}

export function setNotificationTime(time) {
  localStorage.setItem('notif-time', time);
}

export function isNotificationsEnabled() {
  return localStorage.getItem('notif-enabled') === 'true';
}

export function setNotificationsEnabled(val) {
  localStorage.setItem('notif-enabled', val ? 'true' : 'false');
}

export function scheduleNotification(time, habitCount) {
  if (!('serviceWorker' in navigator)) return;
  const [h, m] = time.split(':').map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  const delay = target.getTime() - now.getTime();
  const msg = habitCount > 0
    ? `لديك ${habitCount} عادة لم تكتملها اليوم`
    : 'حان وقت عاداتك اليومية!';
  setTimeout(() => {
    if (Notification.permission === 'granted' && isNotificationsEnabled()) {
      new Notification('تتبع العادات 🌱', {
        body: msg,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        dir: 'rtl',
        lang: 'ar',
      });
      scheduleNotification(time, habitCount);
    }
  }, delay);
}
