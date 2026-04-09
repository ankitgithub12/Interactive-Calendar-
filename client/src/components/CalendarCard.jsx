import { useState, useEffect } from 'react';
import { addMonths, subMonths, isBefore, format, isThisMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { monthThemes } from '../data/monthThemes';
import CalendarGrid   from './CalendarGrid';
import RangeSummary   from './RangeSummary';
import ThemeToggle    from './ThemeToggle';

// Simple inline notes — no tabs, keyed per month, directly in left column
function MonthNotes({ monthKey }) {
  const [note, setNote] = useState('');

  useEffect(() => {
    setNote(localStorage.getItem(`cal-note-month-${monthKey}`) || '');
  }, [monthKey]);

  const handleChange = (e) => {
    const val = e.target.value;
    setNote(val);
    localStorage.setItem(`cal-note-month-${monthKey}`, val);
  };

  return (
    <textarea
      id="month-notes-textarea"
      className="flex-1 w-full bg-transparent resize-none outline-none text-[11px] text-gray-500 dark:text-gray-400 notebook-lines"
      placeholder=""
      value={note}
      onChange={handleChange}
      spellCheck={false}
      style={{ lineHeight: '22px', minHeight: '150px' }}
      aria-label="Monthly notes"
    />
  );
}

export default function CalendarCard() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate,    setStartDate]    = useState(null);
  const [endDate,      setEndDate]      = useState(null);
  const [hoverDate,    setHoverDate]    = useState(null);
  const [animKey,      setAnimKey]      = useState(0);
  const [slideDir,     setSlideDir]     = useState('next');
  const [imgLoaded,    setImgLoaded]    = useState(false);
  const [imgError,     setImgError]     = useState(false);

  const theme = monthThemes[currentMonth.getMonth()];

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [currentMonth]);

  // ── Navigation ────────────────────────────────────────────────────────
  const navigateMonth = (dir) => {
    setSlideDir(dir);
    setAnimKey(k => k + 1);
    setCurrentMonth(m => dir === 'next' ? addMonths(m, 1) : subMonths(m, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setSlideDir(currentMonth < now ? 'next' : 'prev');
    setAnimKey(k => k + 1);
    setCurrentMonth(now);
  };

  // ── Date Selection ─────────────────────────────────────────────────────
  const handleDateClick = (day) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else {
      if (isBefore(day, startDate)) {
        setEndDate(startDate);
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
  };

  const handleDateHover = (day) => {
    setHoverDate(startDate && !endDate ? day : null);
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setHoverDate(null);
  };

  const monthKey = format(currentMonth, 'yyyy-MM');
  const rangeKey = startDate && endDate
    ? `${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}`
    : null;

  // Number of spiral rings
  const RINGS = 17;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 sm:p-10 relative overflow-hidden transition-colors duration-700"
      style={{ background: 'linear-gradient(145deg, #DCDCDC 0%, #C8C8C8 100%)' }}
    >
      {/* Ambient glow behind card */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: theme.primary, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
      />

      {/* ─────────────────────────────────────────────
          PORTRAIT CALENDAR CARD
      ───────────────────────────────────────────── */}
      <div
        id="calendar-card"
        className="relative w-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col overflow-hidden z-10 transition-all duration-700"
        style={{
          maxWidth: '440px',
          borderRadius: '12px',
          '--color-primary': theme.primary,
          '--color-accent':  theme.accent,
          boxShadow: `0 30px 80px rgba(0,0,0,0.28), 0 8px 20px rgba(0,0,0,0.18)`,
        }}
      >

        {/* ══ SPIRAL RINGS ══════════════════════════════════ */}
        {/* Positioned ABOVE the card visually (negative top) */}
        <div
          className="absolute left-0 right-0 flex justify-around items-end px-4 z-30 pointer-events-none"
          style={{ top: '-10px', height: '22px' }}
        >
          {Array.from({ length: RINGS }).map((_, i) => (
            <div
              key={i}
              style={{
                width:  '13px',
                height: '22px',
                borderRadius: '0 0 50% 50% / 0 0 100% 100%',
                background:  'linear-gradient(180deg, #E5E7EB 0%, #9CA3AF 60%, #6B7280 100%)',
                border:       '1.5px solid #6B7280',
                borderTop:    'none',
                boxShadow:    'inset 0 -2px 4px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.3)',
                flexShrink:   0,
              }}
            />
          ))}
        </div>

        {/* Binding strip at top of card */}
        <div
          className="w-full flex-shrink-0"
          style={{
            height: '10px',
            background: 'linear-gradient(180deg, #D1D5DB 0%, #E5E7EB 100%)',
            borderBottom: '1px solid #C0C4CC',
          }}
        />

        {/* ══ HERO IMAGE ════════════════════════════════════ */}
        <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ height: '255px' }}>

          {/* Skeleton */}
          {!imgLoaded && !imgError && (
            <div
              className="absolute inset-0 img-skeleton"
              style={{ backgroundColor: `${theme.primary}70` }}
            />
          )}

          {/* Gradient fallback */}
          {imgError && (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(160deg, ${theme.gradientFrom} 0%, ${theme.primary} 55%, ${theme.accent} 100%)`,
              }}
            />
          )}

          {/* Photo */}
          <img
            key={theme.image}
            src={theme.image}
            alt={`${theme.month} — ${theme.label}`}
            onLoad={()  => { setImgLoaded(true); setImgError(false); }}
            onError={(e) => {
              if (!imgError && theme.fallback && e.target.src !== theme.fallback) {
                e.target.src = theme.fallback;
              } else {
                setImgError(true);
              }
            }}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: imgLoaded ? 1 : 0 }}
            referrerPolicy="no-referrer"
          />

          {/* Subtle vignette at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />

          {/* Top controls overlay */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
            <div
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 backdrop-blur-sm"
              style={{ background: 'rgba(0,0,0,0.30)' }}
            >
              <span className="text-sm leading-none">{theme.emoji}</span>
              <span className="text-white/80 text-[10px] font-medium tracking-wider">
                {theme.label}
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* ══ WAVE DIVIDER + MONTH NAME ══════════════════════ */}
        {/*  Pulled up via negative margin so peaks enter the image */}
        <div className="relative flex-shrink-0" style={{ marginTop: '-56px', zIndex: 20 }}>

          {/* SVG Wave — W-chevron in theme primary color */}
          <svg
            viewBox="0 0 440 74"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{ display: 'block', width: '100%', height: '74px' }}
          >
            {/* Subtle shadow layer */}
            <path
              d="M0,52 L110,10 L220,52 L330,10 L440,52 L440,74 L0,74 Z"
              fill="rgba(0,0,0,0.12)"
              transform="translate(0,3)"
            />
            {/* Main wave */}
            <path
              d="M0,52 L110,10 L220,52 L330,10 L440,52 L440,74 L0,74 Z"
              fill={theme.primary}
            />
          </svg>

          {/* Month + Year + Nav — right side of wave */}
          <div
            className="absolute inset-0 flex items-center justify-end pr-5"
            style={{ paddingBottom: '4px' }}
          >
            <div className="flex flex-col items-end">
              {/* Year */}
              <span
                className="font-light text-white/75 leading-none tracking-[4px] text-[11px]"
              >
                {format(currentMonth, 'yyyy')}
              </span>
              {/* Month */}
              <span
                className="font-extrabold text-white uppercase tracking-wide leading-tight text-[22px]"
                style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '1px' }}
              >
                {format(currentMonth, 'MMMM')}
              </span>
              {/* Navigation */}
              <div className="flex items-center gap-1 mt-1">
                <button
                  id="prev-month-btn"
                  onClick={() => navigateMonth('prev')}
                  className="p-1 rounded hover:bg-white/20 active:bg-white/30 transition-colors"
                  aria-label="Previous month"
                  title="Previous month"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-white/80" />
                </button>

                {!isThisMonth(currentMonth) && (
                  <button
                    id="today-btn"
                    onClick={handleToday}
                    className="px-2 py-0.5 rounded text-[9px] font-bold text-white/80 hover:bg-white/20 transition-colors tracking-wider uppercase"
                    aria-label="Jump to today"
                    title="Today"
                  >
                    Today
                  </button>
                )}

                <button
                  id="next-month-btn"
                  onClick={() => navigateMonth('next')}
                  className="p-1 rounded hover:bg-white/20 active:bg-white/30 transition-colors"
                  aria-label="Next month"
                  title="Next month"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ══ BOTTOM: NOTES (left) + CALENDAR (right) ════════ */}
        <div className="flex flex-1 bg-white dark:bg-gray-900 px-3 pt-3 pb-4 gap-0">

          {/* ── Notes Column ── */}
          <div className="flex flex-col flex-shrink-0 pr-3" style={{ width: '32%' }}>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
              Notes
            </p>
            <MonthNotes monthKey={monthKey} />
          </div>

          {/* Vertical Divider */}
          <div className="w-px bg-gray-100 dark:bg-gray-700 flex-shrink-0 self-stretch" />

          {/* ── Calendar Grid Column ── */}
          <div
            className="flex-1 min-w-0 pl-3 overflow-hidden"
            key={animKey}
            style={{
              animation: `${slideDir === 'next' ? 'slideFromRight' : 'slideFromLeft'} 0.32s cubic-bezier(0.16, 1, 0.3, 1) both`,
            }}
          >
            <CalendarGrid
              currentMonth={currentMonth}
              startDate={startDate}
              endDate={endDate}
              hoverDate={hoverDate}
              onDateClick={handleDateClick}
              onDateHover={handleDateHover}
            />
          </div>
        </div>

        {/* ══ RANGE SUMMARY (conditionally) ══════════════════ */}
        {startDate && (
          <div
            className="mx-3 mb-3 rounded-xl overflow-hidden transition-all duration-300"
            style={{ background: `${theme.primary}15` }}
          >
            <RangeSummary
              startDate={startDate}
              endDate={endDate}
              onClear={handleClear}
            />
          </div>
        )}

        {/* ══ FOOTER HINT ════════════════════════════════════ */}
        <div
          className="flex items-center justify-between px-3 pb-2.5"
          style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
        >
          <span className="text-[10px] text-gray-300 dark:text-gray-600 italic">
            {!startDate
              ? 'Tap a date to start your range'
              : !endDate
              ? 'Now tap an end date'
              : 'Range selected — tap any date to reset'}
          </span>
          {startDate && (
            <button
              id="clear-selection-btn"
              onClick={handleClear}
              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-red-400 transition-colors"
              aria-label="Clear selection"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              Clear
            </button>
          )}
        </div>

        {/* Page-curl corner */}
        <div className="page-curl-corner" />
      </div>
    </div>
  );
}
