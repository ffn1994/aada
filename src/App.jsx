import { useState } from 'react';
import { useHabits } from './hooks/useHabits';
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

  const { habits, addHabit, toggleToday, deleteHabit, renameHabit, reorderHabits, isCompletedToday, getCompletedCount } = useHabits();

  function handleSave(name, icon) {
    addHabit(name, icon);
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

  const selected = habits.find(h => h.id === selectedId);

  return (
    <div dir="rtl" className="font-cairo min-h-screen" style={{ background: theme.bg }}>
      <div className="mx-auto w-full" style={{ maxWidth: 480 }}>
        {view === 'home' && (
          <HomeScreen
            habits={habits}
            completedCount={getCompletedCount()}
            onToggle={toggleToday}
            isCompletedToday={isCompletedToday}
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
            onDelete={() => handleDelete(selected.id)}
            onRename={(newName) => renameHabit(selected.id, newName)}
            onBack={() => setView('home')}
            theme={theme}
          />
        )}
        {view === 'stats' && (
          <StatsScreen
            habits={habits}
            onBack={() => setView('home')}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}
