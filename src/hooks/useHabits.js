import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getToday, calcStreak } from '../utils/dateUtils';

function toLocal(row) {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    streak: row.streak ?? 0,
    longestStreak: row.longest_streak ?? 0,
    completedDates: row.completed_dates ?? [],
    createdAt: row.created_at,
    orderIndex: row.order_index ?? 0,
    frequency: row.frequency ?? 'daily',
    frequencyDays: row.frequency_days ?? [0, 1, 2, 3, 4, 5, 6],
    archived: row.archived ?? false,
    completionNotes: row.completion_notes ?? {},
  };
}

export function useHabits(userId) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) load();
    else { setHabits([]); setLoading(false); }
  }, [userId]);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('habits')
      .select('*')
      .eq('archived', false)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true });
    if (data) setHabits(data.map(toLocal));
    setLoading(false);
  }

  async function addHabit(name, icon, frequency = 'daily', frequencyDays = [0, 1, 2, 3, 4, 5, 6]) {
    const { data } = await supabase
      .from('habits')
      .insert({
        name, icon,
        order_index: habits.length,
        user_id: userId,
        frequency,
        frequency_days: frequencyDays,
      })
      .select()
      .single();
    if (data) setHabits(prev => [...prev, toLocal(data)]);
  }

  async function toggleToday(id) {
    const today = getToday();
    const habit = habits.find(h => h.id === id);
    const dates = habit.completedDates ?? [];
    const newDates = dates.includes(today)
      ? dates.filter(d => d !== today)
      : [...dates, today].sort();
    const streak = calcStreak(newDates);
    const longestStreak = Math.max(streak, habit.longestStreak ?? 0);

    setHabits(prev => prev.map(h =>
      h.id === id ? { ...h, completedDates: newDates, streak, longestStreak } : h
    ));

    await supabase.from('habits').update({
      completed_dates: newDates,
      streak,
      longest_streak: longestStreak,
    }).eq('id', id);
  }

  async function saveNote(id, note) {
    const habit = habits.find(h => h.id === id);
    const today = getToday();
    const updatedNotes = { ...habit.completionNotes, [today]: note };
    setHabits(prev => prev.map(h =>
      h.id === id ? { ...h, completionNotes: updatedNotes } : h
    ));
    await supabase.from('habits').update({ completion_notes: updatedNotes }).eq('id', id);
  }

  async function deleteHabit(id) {
    setHabits(prev => prev.filter(h => h.id !== id));
    await supabase.from('habits').delete().eq('id', id);
  }

  async function archiveHabit(id) {
    setHabits(prev => prev.filter(h => h.id !== id));
    await supabase.from('habits').update({ archived: true }).eq('id', id);
  }

  async function renameHabit(id, newName) {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setHabits(prev => prev.map(h => h.id === id ? { ...h, name: trimmed } : h));
    await supabase.from('habits').update({ name: trimmed }).eq('id', id);
  }

  async function reorderHabits(fromIndex, toIndex) {
    const next = [...habits];
    const [removed] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, removed);
    setHabits(next);
    await Promise.all(
      next.map((h, i) => supabase.from('habits').update({ order_index: i }).eq('id', h.id))
    );
  }

  function isCompletedToday(habit) {
    return (habit.completedDates ?? []).includes(getToday());
  }

  function getCompletedCount() {
    return habits.filter(isCompletedToday).length;
  }

  return {
    habits, loading,
    addHabit, toggleToday, saveNote,
    deleteHabit, archiveHabit,
    renameHabit, reorderHabits,
    isCompletedToday, getCompletedCount,
  };
}
