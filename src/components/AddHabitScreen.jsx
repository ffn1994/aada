import { useState } from 'react';

const ICONS = [
  { e: '💪', l: 'رياضة' },  { e: '🏃', l: 'جري' },    { e: '🚶', l: 'مشي' },    { e: '🏋️', l: 'وزن' },
  { e: '🚴', l: 'دراجة' },  { e: '🏊', l: 'سباحة' },  { e: '🤸', l: 'جمباز' },  { e: '🧗', l: 'تسلق' },
  { e: '⚽', l: 'كرة' },    { e: '🎾', l: 'تنس' },    { e: '🏆', l: 'إنجاز' },  { e: '🥊', l: 'ملاكمة' },
  { e: '📚', l: 'قراءة' },  { e: '✍️', l: 'كتابة' },  { e: '📝', l: 'ملاحظات' },{ e: '📖', l: 'كتاب' },
  { e: '💻', l: 'تقنية' },  { e: '🧠', l: 'تعلم' },   { e: '🎯', l: 'هدف' },    { e: '💡', l: 'إبداع' },
  { e: '📊', l: 'تحليل' },  { e: '🗓️', l: 'جدول' },   { e: '⏰', l: 'وقت' },    { e: '🔑', l: 'مفتاح' },
  { e: '💧', l: 'ماء' },    { e: '🍎', l: 'تفاح' },   { e: '🥗', l: 'سلطة' },   { e: '🥦', l: 'خضار' },
  { e: '🍵', l: 'شاي' },    { e: '☕', l: 'قهوة' },    { e: '🥤', l: 'عصير' },   { e: '💊', l: 'دواء' },
  { e: '🧘', l: 'تأمل' },   { e: '😴', l: 'نوم' },    { e: '🌿', l: 'طبيعة' },  { e: '🌸', l: 'نضارة' },
  { e: '🌊', l: 'هدوء' },   { e: '🌄', l: 'فجر' },    { e: '☀️', l: 'صباح' },   { e: '🌙', l: 'مساء' },
  { e: '🙏', l: 'عبادة' },  { e: '🤲', l: 'صلاة' },   { e: '❤️', l: 'حب' },     { e: '💬', l: 'تواصل' },
  { e: '🤝', l: 'مساعدة' }, { e: '🌱', l: 'نمو' },    { e: '⭐', l: 'تميز' },   { e: '🦋', l: 'تحول' },
  { e: '💰', l: 'مال' },    { e: '📈', l: 'ادخار' },  { e: '🏠', l: 'بيت' },    { e: '🎨', l: 'فن' },
  { e: '🎵', l: 'موسيقى' }, { e: '🎮', l: 'ترفيه' },  { e: '🎬', l: 'أفلام' },  { e: '🧩', l: 'ألغاز' },
  { e: '🏀', l: 'كرة سلة'},{ e: '🥋', l: 'فنون قتال'},{ e: '🏄', l: 'تزلج' },  { e: '🎿', l: 'تزلج ثلج'},
  { e: '🤿', l: 'غوص' },   { e: '🏇', l: 'فروسية' }, { e: '🛹', l: 'سكيت' },  { e: '🥇', l: 'بطولة' },
  { e: '🍳', l: 'طبخ' },   { e: '🥑', l: 'صحي' },   { e: '🥕', l: 'جزر' },   { e: '🫐', l: 'توت' },
  { e: '🍇', l: 'عنب' },   { e: '🥝', l: 'كيوي' },  { e: '🫖', l: 'شاي' },   { e: '🧂', l: 'تغذية' },
  { e: '🎸', l: 'جيتار' }, { e: '📸', l: 'تصوير' },  { e: '🖌️', l: 'رسم' },   { e: '🎭', l: 'مسرح' },
  { e: '🎺', l: 'بوق' },   { e: '🎻', l: 'كمان' },  { e: '🥁', l: 'طبول' },  { e: '🎤', l: 'غناء' },
  { e: '🌟', l: 'نجمة' },  { e: '💝', l: 'عطاء' },  { e: '🕊️', l: 'سلام' },  { e: '💌', l: 'رسالة' },
  { e: '👂', l: 'استماع' },{ e: '🎁', l: 'هدية' },  { e: '🥂', l: 'احتفال' }, { e: '💎', l: 'قيمة' },
  { e: '🎓', l: 'تعليم' }, { e: '🔬', l: 'بحث' },   { e: '🗂️', l: 'تنظيم' }, { e: '✅', l: 'إنجاز' },
  { e: '🚀', l: 'انطلاق' },{ e: '🏕️', l: 'مخيم' },  { e: '🌈', l: 'تفاؤل' }, { e: '🎊', l: 'احتفاء' },
  { e: '🧠', l: 'تفكير' }, { e: '🔋', l: 'طاقة' },  { e: '⚡', l: 'نشاط' },  { e: '🌠', l: 'أحلام' },
  { e: '🛏️', l: 'نوم' },   { e: '🚿', l: 'استحمام'},{ e: '🌞', l: 'شمس' },   { e: '🦷', l: 'أسنان' },
  { e: '🧴', l: 'عناية' }, { e: '🪴', l: 'نباتات' },{ e: '🍽️', l: 'وجبة' },  { e: '💆', l: 'استرخاء'},
  { e: '🛒', l: 'تخطيط' }, { e: '⚖️', l: 'وزن' },   { e: '🌤️', l: 'هواء' },  { e: '🧺', l: 'نظافة' },
  { e: '🐕', l: 'حيوان' }, { e: '🕯️', l: 'هدوء' },  { e: '📰', l: 'مقالات' },{ e: '🤓', l: 'مراجعة' },
  { e: '🧽', l: 'تنظيف' }, { e: '🏡', l: 'منزل' },  { e: '👟', l: 'خطوات' }, { e: '🎧', l: 'تركيز' },
  { e: '🐸', l: 'مهمة' },  { e: '💼', l: 'عمل' },   { e: '🛍️', l: 'توفير' }, { e: '📱', l: 'جوال' },
  { e: '📵', l: 'بدون جوال'}, { e: '🏦', l: 'بنك' },   { e: '🌅', l: 'شروق' },  { e: '📧', l: 'بريد' },
  { e: '👴', l: 'كبار السن'}, { e: '📋', l: 'قائمة' }, { e: '🌐', l: 'شبكة' },  { e: '🧾', l: 'فاتورة' },
  { e: '🤗', l: 'دفء' },   { e: '🖥️', l: 'شاشة' },  { e: '✏️', l: 'قلم' },   { e: '🔖', l: 'مرجع' },
  { e: '🫂', l: 'عناق' },  { e: '🧭', l: 'توجيه' }, { e: '🏧', l: 'صندوق' }, { e: '📑', l: 'ملف' },
];

const PRESETS = [
  { cat: '💪 الصحة الجسدية', items: [
    { name: 'نوم 8 ساعات',                    icon: '😴' },
    { name: 'الاستيقاظ مبكراً',               icon: '🌄' },
    { name: 'النوم قبل الـ 11',               icon: '🌙' },
    { name: 'رياضة 30 دقيقة',                 icon: '💪' },
    { name: 'شرب 8 أكواب ماء',                icon: '💧' },
    { name: 'مشي يومي',                       icon: '🚶' },
    { name: 'المشي 10,000 خطوة',              icon: '👟' },
    { name: 'أكل خضار وفواكه',                icon: '🥦' },
    { name: 'تجنب السكر',                     icon: '🚫' },
    { name: 'تجنب المشروبات الغازية',         icon: '🥤' },
    { name: 'تجنب المقليات',                  icon: '🍳' },
    { name: 'أكل وجبة فطور صحية',            icon: '🍳' },
    { name: 'تجنب الأكل المتأخر ليلاً',      icon: '🌙' },
    { name: 'تناول فيتامينات ومكملات',        icon: '💊' },
    { name: 'مضغ الطعام ببطء',               icon: '🍽️' },
    { name: 'تمدد وإطالة يومية',              icon: '🤸' },
    { name: 'تنفس عميق 5 دقائق',             icon: '🌬️' },
    { name: 'وقفة كل ساعة (تجنب الجلوس)',    icon: '⏱️' },
    { name: 'تجنب الكافيين بعد الظهر',       icon: '☕' },
  ]},
  { cat: '🧘 الصحة النفسية', items: [
    { name: 'تأمل 10 دقائق',                  icon: '🧘' },
    { name: 'كتابة يومية (جورنال)',            icon: '✍️' },
    { name: 'قراءة 20 صفحة',                 icon: '📚' },
    { name: 'شكر يومي (3 أشياء)',            icon: '🙏' },
    { name: 'تجنب الجوال قبل النوم',         icon: '🌙' },
    { name: 'تقليل السوشيال ميديا',          icon: '📵' },
    { name: 'الامتنان قبل النوم',             icon: '❤️' },
    { name: 'قضاء وقت في الطبيعة',           icon: '🌿' },
    { name: 'الاستماع لموسيقى هادئة',        icon: '🎵' },
    { name: 'تجنب الأخبار السلبية',          icon: '📰' },
    { name: 'التحدث مع نفسك بإيجابية',      icon: '⭐' },
    { name: 'قضاء وقت وحيداً (Me Time)',     icon: '🕯️' },
    { name: 'مشاهدة شروق الشمس',             icon: '🌄' },
    { name: 'الابتعاد عن الأشخاص السلبيين', icon: '🕊️' },
    { name: 'كتابة أهداف طويلة الأمد',       icon: '🎯' },
  ]},
  { cat: '🚀 الإنتاجية والتطوير', items: [
    { name: 'تعلم مهارة جديدة',               icon: '🧠' },
    { name: 'مراجعة الأهداف',                 icon: '🎯' },
    { name: 'استمع لبودكاست',                 icon: '🎵' },
    { name: 'تعلم لغة 15 دقيقة',            icon: '🗣️' },
    { name: 'Deep Work — ساعة بدون مشتتات', icon: '🎧' },
    { name: 'قائمة مهام الغد قبل النوم',     icon: '📝' },
    { name: 'إنجاز أصعب مهمة أول الصباح',   icon: '🐸' },
    { name: 'مراجعة أسبوعية للأهداف',        icon: '📊' },
    { name: 'ترتيب المساحة يومياً',          icon: '🧹' },
    { name: 'تعلم مهارة قابلة للبيع',        icon: '💼' },
    { name: 'مراجعة ملاحظات اليوم',          icon: '📋' },
    { name: 'كتابة 3 أفكار جديدة',           icon: '💡' },
    { name: 'مشاهدة محاضرة تعليمية',         icon: '🎬' },
    { name: 'حل مسألة أو لغز ذهني',         icon: '🧩' },
    { name: 'تعلم البرمجة',                   icon: '💻' },
    { name: 'تطوير مشروع جانبي',             icon: '🚀' },
    { name: 'إيقاف الإشعارات أثناء العمل',  icon: '📵' },
    { name: 'تحديد 3 أهداف يومية فقط',      icon: '✅' },
    { name: 'مراجعة البريد مرة واحدة يومياً',icon: '📊' },
    { name: 'بناء شبكة علاقات مهنية',        icon: '🤝' },
    { name: 'كتابة ما تعلمته اليوم',         icon: '📝' },
  ]},
  { cat: '🤲 الروح والدين', items: [
    { name: 'صلاة في وقتها',                  icon: '🤲' },
    { name: 'قراءة القرآن يومياً',            icon: '📖' },
    { name: 'الاستغفار صباحاً ومساءً',       icon: '🌅' },
    { name: 'أذكار الصباح والمساء',           icon: '☀️' },
    { name: 'دعاء قبل النوم',                 icon: '🌙' },
    { name: 'حفظ آية قرآنية',                icon: '⭐' },
    { name: 'الصدقة اليومية ولو بالقليل',    icon: '💝' },
    { name: 'صيام نافلة (الاثنين والخميس)',  icon: '🌿' },
    { name: 'تجنب الكلام السلبي عن الناس',  icon: '🕊️' },
    { name: 'زيارة كبار السن والأهل',        icon: '❤️' },
    { name: 'المشاركة في عمل خيري',          icon: '🤝' },
    { name: 'قراءة كتاب ديني أو ثقافي',     icon: '📖' },
  ]},
  { cat: '❤️ العلاقات', items: [
    { name: 'تواصل مع شخص عزيز',            icon: '💬' },
    { name: 'وقت بدون جوال مع العائلة',     icon: '👨‍👩‍👧' },
    { name: 'تطوع أو مساعدة أحد',           icon: '🤝' },
    { name: 'إرسال رسالة شكر لأحد',         icon: '💌' },
    { name: 'الاستماع بانتباه لمن تحب',     icon: '👂' },
    { name: 'إهداء مديح صادق لشخص',        icon: '🌸' },
    { name: 'الاعتذار بسرعة عند الخطأ',    icon: '🕊️' },
    { name: 'تناول وجبة مع الأسرة يومياً', icon: '🍽️' },
    { name: 'تعليم شخص ما شيئاً',           icon: '🎓' },
    { name: 'الحفاظ على صداقات قديمة',      icon: '💬' },
    { name: 'تحديد يوم عائلي أسبوعي',       icon: '🏡' },
  ]},
  { cat: '💰 المال والمستقبل', items: [
    { name: 'تسجيل المصاريف اليومية',        icon: '💰' },
    { name: 'ادخار نسبة ثابتة',              icon: '🏦' },
    { name: 'مراجعة الميزانية الأسبوعية',   icon: '📈' },
    { name: 'قراءة عن الاستثمار 15 دقيقة', icon: '💡' },
    { name: 'تجنب الشراء العاطفي',           icon: '🛍️' },
    { name: 'مراجعة الاشتراكات الشهرية',    icon: '📱' },
    { name: 'قراءة كتاب عن المال',           icon: '📚' },
    { name: 'بناء صندوق طوارئ',              icon: '🏦' },
    { name: 'مراجعة الأهداف المالية شهرياً', icon: '📈' },
    { name: 'تعلم أساسيات الضرائب',          icon: '🎓' },
  ]},
  { cat: '🎨 الإبداع والترفيه', items: [
    { name: 'رسم أو تلوين',                   icon: '🎨' },
    { name: 'كتابة قصة أو مقال',             icon: '📝' },
    { name: 'تعلم آلة موسيقية',              icon: '🎸' },
    { name: 'التصوير الفوتوغرافي',           icon: '📸' },
    { name: 'ممارسة هواية يدوية',            icon: '🛠️' },
    { name: 'مشاهدة فيلم ملهم',              icon: '🎬' },
    { name: 'تعلم التصميم (Canva/Figma)',    icon: '🖌️' },
    { name: 'تعلم الخط العربي',              icon: '✍️' },
    { name: 'بناء مشروع رقمي أو تطبيق',     icon: '💻' },
  ]},
  { cat: '🏡 العناية والروتين', items: [
    { name: 'ترتيب السرير عند الاستيقاظ',    icon: '🛏️' },
    { name: 'استحمام بارد صباحاً',           icon: '🚿' },
    { name: 'التعرض لأشعة الشمس 15 دقيقة', icon: '🌞' },
    { name: 'تنظيف الأسنان بالخيط',          icon: '🦷' },
    { name: 'روتين العناية بالبشرة',          icon: '🧴' },
    { name: 'العناية بالنباتات',              icon: '🪴' },
    { name: 'تحضير وجبة صحية في البيت',     icon: '🍽️' },
    { name: 'جلسة استرخاء عضلي',             icon: '💆' },
    { name: 'التخطيط للمشتريات مسبقاً',      icon: '🛒' },
    { name: 'قياس الوزن الأسبوعي',           icon: '⚖️' },
    { name: 'الخروج للهواء الطلق',           icon: '🌤️' },
    { name: 'تنظيف مكان في البيت يومياً',   icon: '🧽' },
    { name: 'غسيل الملابس',                  icon: '🧺' },
    { name: 'المشي مع الحيوان الأليف',       icon: '🐕' },
    { name: 'لحظة هدوء وشمعة وتأمل',        icon: '🕯️' },
    { name: 'قراءة مقالات مفيدة',            icon: '📰' },
    { name: 'مراجعة المفاهيم الصعبة',        icon: '🤓' },
    { name: 'تجنب الشراء من الجوال عشوائياً',icon: '📱' },
  ]},
];

export default function AddHabitScreen({ onSave, onBack, theme }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICONS[0].e);
  const [openCats, setOpenCats] = useState(new Set());

  const q = name.trim();
  const filteredPresets = q
    ? PRESETS.map(cat => ({
        ...cat,
        items: cat.items.filter(p => p.name.includes(q)),
      })).filter(cat => cat.items.length > 0)
    : PRESETS;

  function toggleCat(cat) {
    setOpenCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  function pickPreset(preset) {
    setName(preset.name);
    setIcon(preset.icon);
  }

  function handleSave() {
    if (!q) return;
    onSave(q, icon);
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: theme.bg }}>

      {/* Header */}
      <div
        className="px-5 pt-10 pb-4 shrink-0"
        style={{ background: theme.headerGrad }}
      >
        <button
          onClick={onBack}
          type="button"
          className="flex items-center gap-1.5 transition-colors text-sm mb-3"
          style={{ color: theme.t2 }}
        >
          <span className="text-base">›</span>
          <span>رجوع</span>
        </button>
        <h1 className="text-xl font-bold" style={{ color: theme.t1 }}>عادة جديدة</h1>

        {/* أيقونة + حقل البحث */}
        <div className="flex items-center gap-3 mt-3">
          {/* معاينة الأيقونة */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 transition-all duration-200"
            style={{
              background: q ? 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))' : 'rgba(0,0,0,0.05)',
              border: q ? '2px solid rgba(59,130,246,0.35)' : '2px solid rgba(0,0,0,0.08)',
            }}
          >
            {icon}
          </div>

          {/* الحقل + زر المسح */}
          <div className="relative flex-1">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="اكتب اسم العادة أو ابحث…"
              maxLength={40}
              autoFocus
              className="w-full rounded-2xl px-4 py-3.5 outline-none text-sm transition-all"
              style={{
                background: theme.input,
                color: theme.t1,
                border: q ? '2px solid rgba(59,130,246,0.6)' : `2px solid ${theme.borderMd}`,
                boxShadow: q ? '0 0 0 3px rgba(59,130,246,0.08)' : theme.shadow,
                paddingLeft: q ? '2.5rem' : '1rem',
              }}
            />
            {/* زر مسح الاختيار */}
            {q && (
              <button
                type="button"
                onClick={() => { setName(''); setIcon(ICONS[0].e); }}
                className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none"
              >✕</button>
            )}
          </div>
        </div>
      </div>

      {/* المحتوى القابل للسكرول */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">

        {/* اقتراحات */}
        <div className="pt-3">
          <p className="text-xs font-semibold mb-3" style={{ color: theme.t3 }}>
            {q ? `نتائج البحث عن "${q}"` : 'اقتراحات يومية'}
          </p>

          {filteredPresets.length === 0 && (
            <div className="py-6 text-center text-gray-400 text-sm">
              لا توجد اقتراحات — اضغط حفظ لإضافة عادتك المخصصة
            </div>
          )}

          <div className="flex flex-col gap-2">
            {filteredPresets.map(({ cat, items }) => {
              const isOpen = q ? true : openCats.has(cat);
              return (
                <div key={cat}>
                  {/* زر الفئة */}
                  {!q && (
                    <button
                      type="button"
                      onClick={() => toggleCat(cat)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all active:scale-[0.98]"
                      style={isOpen ? {
                        background: theme.catOpen,
                        border: `1.5px solid ${theme.catOpenBorder}`,
                      } : {
                        background: theme.card,
                        border: `1px solid ${theme.border}`,
                        boxShadow: theme.shadow,
                      }}
                    >
                      <span className="text-sm font-semibold" style={{ color: theme.t1 }}>{cat}</span>
                      <span
                        className="text-lg transition-transform duration-200"
                        style={{ color: theme.t3 }}
                        style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                      >›</span>
                    </button>
                  )}

                  {/* عادات الفئة */}
                  {isOpen && (
                    <div className="flex flex-col gap-1.5 mt-1.5 mb-1">
                      {items.map(preset => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => pickPreset(preset)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-right transition-all active:scale-[0.97]"
                          style={name === preset.name ? {
                            background: theme.catOpen,
                            border: `1.5px solid ${theme.catOpenBorder}`,
                          } : {
                            background: theme.preset,
                            border: `1px solid ${theme.border}`,
                          }}
                        >
                          <span className="text-2xl shrink-0">{preset.icon}</span>
                          <span className="text-sm font-medium flex-1" style={{ color: theme.t1 }}>{preset.name}</span>
                          {name === preset.name
                            ? <span style={{ color: '#3b82f6', fontSize: 16 }}>✓</span>
                            : <span className="text-gray-300 text-sm">‹</span>
                          }
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* أيقونة */}
        <div className="mt-2">
          <p className="text-xs font-semibold mb-3" style={{ color: theme.t3 }}>الأيقونة</p>
          <div className="grid grid-cols-4 gap-2">
            {ICONS.map(({ e, l }) => (
              <button
                key={e}
                type="button"
                onClick={() => setIcon(e)}
                className="py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-90"
                style={icon === e ? {
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.05))',
                  border: '2px solid rgba(59,130,246,0.5)',
                } : {
                  background: theme.card,
                  border: `2px solid ${theme.border}`,
                }}
              >
                <span className="text-2xl">{e}</span>
                <span className="text-xs" style={{ color: theme.t2 }}>{l}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* زر الحفظ */}
      <div
        className="px-5 pt-3 pb-6 shrink-0"
        style={{ background: `linear-gradient(to top, ${theme.fadeUp} 70%, transparent)` }}
      >
        <button
          type="button"
          onClick={handleSave}
          disabled={!q}
          className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-40"
          style={q ? {
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
            color: 'white',
          } : {
            background: '#e2e8f0',
            color: '#94a3b8',
          }}
        >
          <span>حفظ العادة</span>
          <span>✓</span>
        </button>
      </div>

    </div>
  );
}
