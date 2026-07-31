import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LIGHT, DARK } from '../utils/theme';

export default function AuthScreen({ isDark, onToggleTheme }) {
  const theme = isDark ? DARK : LIGHT;
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(getArabicError(error.message));
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(getArabicError(error.message));
      else setMsg('تم إرسال رسالة تأكيد على بريدك الإلكتروني، تحقق منه ثم سجل دخول.');
    }
    setLoading(false);
  }

  function getArabicError(msg) {
    if (msg.includes('Invalid login')) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    if (msg.includes('Email not confirmed')) return 'يرجى تأكيد بريدك الإلكتروني أولاً';
    if (msg.includes('already registered')) return 'هذا البريد مسجل مسبقاً، جرب تسجيل الدخول';
    if (msg.includes('Password')) return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (msg.includes('valid email')) return 'يرجى إدخال بريد إلكتروني صحيح';
    return 'حدث خطأ، حاول مجدداً';
  }

  return (
    <div dir="rtl" style={{ minHeight: '100dvh', background: theme.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>

      {/* Theme toggle */}
      <div style={{ position: 'absolute', top: 20, left: 16 }}>
        <button
          onClick={onToggleTheme}
          style={{ width: 36, height: 36, borderRadius: 12, background: theme.card, border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 56, marginBottom: 12, lineHeight: 1 }}>🌱</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: theme.t1, margin: 0 }}>تتبع العادات</h1>
          <p style={{ fontSize: 13, color: theme.t2, marginTop: 6 }}>ابنِ عاداتك، غيّر حياتك</p>
        </div>

        {/* Card */}
        <div style={{ background: theme.card, borderRadius: 24, padding: 24, border: `1px solid ${theme.border}`, boxShadow: theme.shadowLg }}>

          {/* Tab toggle */}
          <div style={{ display: 'flex', background: theme.elevated, borderRadius: 14, padding: 4, marginBottom: 20, border: `1px solid ${theme.border}` }}>
            {[['login', 'تسجيل دخول'], ['signup', 'حساب جديد']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setMode(key); setError(''); setMsg(''); }}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  background: mode === key ? '#3b82f6' : 'transparent',
                  color: mode === key ? 'white' : theme.t2,
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: theme.t2, display: 'block', marginBottom: 6 }}>البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@mail.com"
                required
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 14, fontSize: 13,
                  background: theme.input, color: theme.t1, border: `1.5px solid ${theme.borderMd}`,
                  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                  direction: 'ltr', textAlign: 'left',
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: theme.t2, display: 'block', marginBottom: 6 }}>كلمة المرور</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  style={{
                    width: '100%', padding: '12px 14px 12px 44px', borderRadius: 14, fontSize: 13,
                    background: theme.input, color: theme.t1, border: `1.5px solid ${theme.borderMd}`,
                    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                    direction: 'ltr', textAlign: 'left',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                    color: theme.t3, fontSize: 16, lineHeight: 1,
                  }}
                  title={showPw ? 'إخفاء' : 'إظهار'}
                >
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
              {mode === 'signup' && (
                <p style={{ fontSize: 11, color: theme.t3, marginTop: 5 }}>يجب أن تكون 6 أحرف على الأقل</p>
              )}
            </div>

            {/* Error / message */}
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '10px 14px', marginBottom: 16 }}>
                <p style={{ color: '#ef4444', fontSize: 12, margin: 0 }}>{error}</p>
              </div>
            )}
            {msg && (
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '10px 14px', marginBottom: 16 }}>
                <p style={{ color: '#22c55e', fontSize: 12, margin: 0 }}>{msg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: 16, fontSize: 14, fontWeight: 700,
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(59,130,246,0.4)',
                fontFamily: 'inherit', transition: 'all 0.2s',
              }}
            >
              {loading ? '…' : mode === 'login' ? 'دخول' : 'إنشاء الحساب'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: theme.t3, fontSize: 11, marginTop: 20 }}>
          بياناتك محمية ومشفرة بالكامل
        </p>
      </div>
    </div>
  );
}
