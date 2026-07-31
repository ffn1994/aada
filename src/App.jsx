import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useHabits } from './hooks/useHabits';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import AddHabitScreen from './components/AddHabitScreen';
import HabitDetailScreen from './components/HabitDetailScreen';
import StatsScreen from './components/StatsScreen';
import { LIGHT, DARK } from './utils/theme';

export default function App() {
  const [view, setView] = useState('home');
  const [selectedId, setSelectedId] = useState(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('habit-theme') === 'dark');

  const theme = isDark ? DARK : LIGHT;

  function toggleTheme() {
    setIsDark(d => {
      const next = !d;
      localStorage.setItem('habit-theme', next ? 'dark' : 'light');
      return next;
    });
  }

  const { user, authLoading, signOut } = useAuth();
  const { habits, loading, addHabit, toggleToday, saveNote, deleteHabit, archiveHabit, renameHabit, reorderHabits, isCompletedToday, isScheduledToday, getCompletedCount, getScheduledCount } = useHabits(user?.id);

  function handleSave(name, icon, frequency, frequencyDays) {
    addHabit(name, icon, frequency, frequencyDays);
    setView('home');
  }

  function handleSelect(id) {
    setSelectedId(id);
    setView('detail');
  }

  function handleDelete(id) {
    deleteHabit(id);
    setSelectedId(null);
    setView('home');
  }

  function handleArchive(id) {
    archiveHabit(id);
    setSelectedId(null);
    setView('home');
  }

  const selected = habits.find(h => h.id === selectedId);

  if (authLoading) return (
    <div dir="rtl" className="font-cairo min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
      <div className="flex flex-col items-center gap-3">
        <div className="text-4xl animate-pulse">🌱</div>
        <p className="text-sm" style={{ color: theme.t2 }}>جار التحميل…</p>
      </div>
    </div>
  );

  if (!user) return (
    <AuthScreen isDark={isDark} onToggleTheme={toggleTheme} />
  );

  if (loading) return (
    <div dir="rtl" className="font-cairo min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
      <div className="flex flex-col items-center gap-3">
        <div className="text-4xl animate-pulse">🌱</div>
        <p className="text-sm" style={{ color: theme.t2 }}>جار التحميل…</p>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="font-cairo min-h-screen" style={{ background: theme.bg }}>
      <div className="mx-auto w-full" style={{ maxWidth: 480 }}>
        {view === 'home' && (
          <HomeScreen
            habits={habits}
            completedCount={getCompletedCount()}
            scheduledCount={getScheduledCount()}
            onToggle={toggleToday}
            isCompletedToday={isCompletedToday}
            isScheduledToday={isScheduledToday}
            onSelectHabit={handleSelect}
            onAddHabit={() => setView('add')}
            onOpenStats={() => setView('stats')}
            onReorder={reorderHabits}
            theme={theme}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />
        )}
        {view === 'add' && (
          <AddHabitScreen
            onSave={handleSave}
            onBack={() => setView('home')}
            theme={theme}
          />
        )}
        {view === 'detail' && selected && (
          <HabitDetailScreen
            habit={selected}
            isCompletedToday={isCompletedToday(selected)}
            onToggle={() => toggleToday(selected.id)}
            onSaveNote={(note) => saveNote(selected.id, note)}
            onDelete={() => handleDelete(selected.id)}
            onArchive={() => handleArchive(selected.id)}
            onRename={(newName) => renameHabit(selected.id, newName)}
            onBack={() => setView('home')}
            theme={theme}
          />
        )}
        {view === 'stats' && (
          <StatsScreen
            habits={habits}
            onBack={() => setView('home')}
            onSignOut={signOut}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}
