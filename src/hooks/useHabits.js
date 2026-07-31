import { useState, useEffect } from 'react';
import { getToday, calcStreak } from '../utils/dateUtils';

const KEY = 'habit-tracker-v1';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(habits) {
  localStorage.setItem(KEY, JSON.stringify(habits));
}

function recompute(habit, dates) {
  const streak = calcStreak(dates);
  return {
    ...habit,
    completedDates: dates,
    streak,
    longestStreak: Math.max(streak, habit.longestStreak || 0),
  };
}

export function useHabits() {
  const [habits, setHabits] = useState(load);

  useEffect(() => {
    save(habits);
  }, [habits]);

  function addHabit(name, icon) {
    const h = {
      id: String(Date.now()),
      name,
      icon,
      streak: 0,
      longestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, h]);
  }

  function toggleToday(id) {
    const today = getToday();
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== id) return h;
        const dates = h.completedDates || [];
        const newDates = dates.includes(today)
          ? dates.filter(d => d !== today)
          : [...dates, today].sort();
        return recompute(h, newDates);
      })
    );
  }

  function deleteHabit(id) {
    setHabits(prev => prev.filter(h => h.id !== id));
  }

  function reorderHabits(fromIndex, toIndex) {
    setHabits(prev => {
      const next = [...prev];
      const [removed] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, removed);
      return next;
    });
  }

  function renameHabit(id, newName) {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setHabits(prev => prev.map(h => h.id === id ? { ...h, name: trimmed } : h));
  }

  function isCompletedToday(habit) {
    return (habit.completedDates || []).includes(getToday());
  }

  function getCompletedCount() {
    return habits.filter(isCompletedToday).length;
  }

  return { habits, addHabit, toggleToday, deleteHabit, renameHabit, reorderHabits, isCompletedToday, getCompletedCount };
}
