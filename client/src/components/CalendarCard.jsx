import { useState, useEffect } from 'react';
import { addMonths, subMonths, isBefore, format, isThisMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { monthThemes } from '../data/monthThemes';
import CalendarGrid from './CalendarGrid';
import RangeSummary from './RangeSummary';
import ThemeToggle from './ThemeToggle';

/* ── Simple inline month notes (keyed per month via localStorage) ──────── */
function MonthNotes({ monthKey }) {
  const [note, setNote] = useState('');

  useEffect(() => {
    setNote(localStorage.getItem(`cal-note-month-${monthKey}`) || '');
  }, [monthKey]);

  return (
    <textarea
      id="month-notes-textarea"
      className="flex-1 w-full bg-transparent resize-none outline-none text-[11px] text-gray-500 dark:text-gray-400 notebook-lines"
      placeholder=""
      value={note}
      onChange={(e) => {
        setNote(e.target.value);
        localStorage.setItem(`cal-note-month-${monthKey}`, e.target.value);
      }}
      spellCheck={false}
      style={{ lineHeight: '22px', minHeight: '150px' }}
      aria-label="Monthly notes"
    />
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
export default function CalendarCard() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const [slideDir, setSlideDir] = useState('next');
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const theme = monthThemes[currentMonth.getMonth()];

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [currentMonth]);

  // ── Navigation ──────────────────────────────────────────────────────
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

  // ── Date Range Selection ────────────────────────────────────────────
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
  const RINGS = 17;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-10 relative overflow-hidden transition-colors duration-700"
      style={{ background: 'linear-gradient(145deg, #DCDCDC 0%, #C4C4C4 100%)' }}
    >
      {/* Ambient glow blob */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-1000"
        style={{
          width: '500px', height: '500px',
          background: theme.primary,
          filter: 'blur(120px)',
          opacity: 0.25,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />

      {/* ════════════════════════════════════════════════
          PORTRAIT CALENDAR CARD
          ════════════════════════════════════════════════ */}
      <div
        id="calendar-card"
        className="relative w-full bg-white dark:bg-gray-900 flex flex-col z-10 transition-all duration-700"
        style={{
          maxWidth: '450px',
          borderRadius: '14px',
          overflow: 'hidden',                  /* clips image + wave */
          boxShadow: '0 30px 80px rgba(0,0,0,0.30), 0 8px 24px rgba(0,0,0,0.20)',
          '--color-primary': theme.primary,
          '--color-accent': theme.accent,
        }}
      >

        {/* ── Binding Strip + Spiral Rings ─────────────────────────
            Inside the card's overflow:hidden, at the very top.
            Rings hang DOWN from the strip (borderRadius: 0 0 50% 50%). */}
        <div
          className="w-full flex-shrink-0 relative z-20"
          style={{
            height: '20px',
            background: 'linear-gradient(180deg, #C9CDD4 0%, #E0E3E8 100%)',
            borderBottom: '1px solid #B0B5BE',
          }}
        >
          <div className="absolute inset-x-0 top-0 flex justify-around items-start px-3">
            {Array.from({ length: RINGS }).map((_, i) => (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  width: '14px',
                  height: '22px',
                  borderRadius: '0 0 50% 50%',
                  background: 'linear-gradient(180deg, #E8EAED 0%, #9AA0AB 60%, #6B717C 100%)',
                  border: '1.5px solid #777E8A',
                  borderTop: 'none',
                  boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2), 0 2px 5px rgba(0,0,0,0.35)',
                  marginTop: '0',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Hero Image ─────────────────────────────────────────── */}
        <div className="relative w-full flex-shrink-0" style={{ height: '255px' }}>

          {/* Shimmer skeleton */}
          {!imgLoaded && !imgError && (
            <div
              className="absolute inset-0 img-skeleton"
              style={{ backgroundColor: `${theme.primary}80` }}
            />
          )}

          {/* Gradient fallback when image fails */}
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
            onLoad={() => { setImgLoaded(true); setImgError(false); }}
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

          {/* Bottom vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35) 100%)' }}
          />

          {/* Top-row controls: emoji label + dark-mode toggle */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
            <div
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{ background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(6px)' }}
            >
              <span className="text-sm leading-none">{theme.emoji}</span>
              <span className="text-[10px] font-semibold text-white/80 tracking-wider">
                {theme.label}
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* ── Wave Chevron + Month / Year / Nav ────────────────────
            Negative margin pulls the SVG peaks UP into the image. */}
        <div className="relative flex-shrink-0" style={{ marginTop: '-54px', zIndex: 10 }}>

          {/* SVG double-peak (W-shaped) wave */}
          <svg
            viewBox="0 0 450 76"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{ display: 'block', width: '100%', height: '76px' }}
          >
            {/* Drop-shadow layer */}
            <path
              d="M0,54 L112,12 L225,54 L338,12 L450,54 L450,76 L0,76 Z"
              fill="rgba(0,0,0,0.13)"
              transform="translate(0,4)"
            />
            {/* Main wave */}
            <path
              d="M0,54 L112,12 L225,54 L338,12 L450,54 L450,76 L0,76 Z"
              fill={theme.primary}
            />
          </svg>

          {/* Month + Year + nav — right-aligned over the wave */}
          <div
            className="absolute inset-0 flex items-end justify-end"
            style={{ paddingRight: '20px', paddingBottom: '8px' }}
          >
            <div className="flex flex-col items-end">
              {/* Year */}
              <span className="text-[11px] font-light text-white/70 tracking-[4px] leading-none mb-0.5">
                {format(currentMonth, 'yyyy')}
              </span>
              {/* Month */}
              <span
                className="text-[21px] font-extrabold text-white uppercase leading-tight"
                style={{ letterSpacing: '1px' }}
              >
                {format(currentMonth, 'MMMM')}
              </span>
              {/* Prev / Today / Next */}
              <div className="flex items-center gap-1 mt-1">
                <button
                  id="prev-month-btn"
                  onClick={() => navigateMonth('prev')}
                  className="p-0.5 rounded hover:bg-white/20 active:bg-white/30 transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4 text-white/80" />
                </button>

                {!isThisMonth(currentMonth) && (
                  <button
                    id="today-btn"
                    onClick={handleToday}
                    className="px-2 py-0.5 rounded text-[9px] font-bold text-white/80 hover:bg-white/20 transition-colors uppercase tracking-wider"
                    aria-label="Jump to today"
                  >
                    Today
                  </button>
                )}

                <button
                  id="next-month-btn"
                  onClick={() => navigateMonth('next')}
                  className="p-0.5 rounded hover:bg-white/20 active:bg-white/30 transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4 text-white/80" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Section: Notes (left) + Calendar (right) ──────── */}
        <div className="flex flex-1 bg-white dark:bg-gray-900 px-3 pt-3 pb-3 gap-0">

          {/* Notes column */}
          <div className="flex flex-col flex-shrink-0 pr-3" style={{ width: '31%' }}>
            <p className="text-[9px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[2px] mb-1.5">
              Notes
            </p>
            <MonthNotes monthKey={monthKey} />
          </div>

          {/* Divider */}
          <div className="flex-shrink-0 self-stretch" style={{ width: '1px', background: '#E5E7EB' }} />

          {/* Calendar grid column — animated on month change */}
          <div
            key={animKey}
            className={slideDir === 'next' ? 'animate-slide-right' : 'animate-slide-left'}
            style={{ flex: 1, minWidth: 0, paddingLeft: '10px', overflow: 'hidden' }}
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

        {/* ── Range Summary (shown only when ≥1 date selected) ──────── */}
        {startDate && (
          <div
            className="mx-3 mb-3 rounded-xl overflow-hidden"
            style={{ background: `color-mix(in srgb, ${theme.primary} 12%, white)` }}
          >
            <RangeSummary
              startDate={startDate}
              endDate={endDate}
              onClear={handleClear}
            />
          </div>
        )}

        {/* ── Footer hint ───────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-3 pb-2.5 gap-2"
          style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
        >
          <span className="text-[9.5px] text-gray-300 dark:text-gray-600 italic leading-tight">
            {!startDate
              ? 'Tap a date to start your range'
              : !endDate
                ? 'Now tap an end date'
                : 'Range set — tap any date to restart'}
          </span>
          {startDate && (
            <button
              id="clear-selection-btn"
              onClick={handleClear}
              className="flex items-center gap-1 text-[9.5px] text-gray-400 hover:text-red-400 transition-colors shrink-0"
              aria-label="Clear selection"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              Clear
            </button>
          )}
        </div>

        {/* Decorative page-curl corner */}
        <div className="page-curl-corner" />
      </div>

      {/* Wall pin / hook above card */}
      <div
        aria-hidden="true"
        className="absolute z-30"
        style={{
          top: 'calc(50% - 260px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '10px', height: '28px',
          background: 'linear-gradient(180deg, #888 0%, #555 100%)',
          borderRadius: '50% 50% 2px 2px',
          boxShadow: '0 3px 6px rgba(0,0,0,0.4)',
        }}
      />
    </div>
  );
}
