import { useState, useEffect, useRef } from 'react';
import { PenLine, Bookmark, Trash2, ChevronDown } from 'lucide-react';

const MAX_CHARS = 500;

export default function NotesSection({ monthKey, rangeKey }) {
  const [activeTab, setActiveTab] = useState('month');
  const [monthNote, setMonthNote]  = useState('');
  const [rangeNote, setRangeNote]  = useState('');
  const textareaRef = useRef(null);

  // Load month note
  useEffect(() => {
    setMonthNote(localStorage.getItem(`cal-note-month-${monthKey}`) || '');
  }, [monthKey]);

  // Load range note
  useEffect(() => {
    if (rangeKey) {
      setRangeNote(localStorage.getItem(`cal-note-range-${rangeKey}`) || '');
    }
  }, [rangeKey]);

  // Switch to range tab automatically when a range is selected
  useEffect(() => {
    if (rangeKey) setActiveTab('range');
  }, [rangeKey]);

  const handleMonthChange = (e) => {
    const val = e.target.value.slice(0, MAX_CHARS);
    setMonthNote(val);
    localStorage.setItem(`cal-note-month-${monthKey}`, val);
  };

  const handleRangeChange = (e) => {
    const val = e.target.value.slice(0, MAX_CHARS);
    setRangeNote(val);
    if (rangeKey) localStorage.setItem(`cal-note-range-${rangeKey}`, val);
  };

  const clearNote = () => {
    if (activeTab === 'month') {
      setMonthNote('');
      localStorage.removeItem(`cal-note-month-${monthKey}`);
    } else {
      setRangeNote('');
      if (rangeKey) localStorage.removeItem(`cal-note-range-${rangeKey}`);
    }
  };

  const activeNote   = activeTab === 'month' ? monthNote : rangeNote;
  const charCount    = activeNote.length;
  const charPct      = (charCount / MAX_CHARS) * 100;
  const charWarning  = charCount > MAX_CHARS * 0.85;

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/40 shadow-sm overflow-hidden">
      {/* ── Tabs ── */}
      <div className="flex items-center border-b border-gray-100 dark:border-gray-700/60">
        <TabBtn
          id="tab-month-notes"
          active={activeTab === 'month'}
          onClick={() => setActiveTab('month')}
          icon={<PenLine className="w-3.5 h-3.5" />}
          label="Monthly Notes"
        />
        <TabBtn
          id="tab-range-notes"
          active={activeTab === 'range'}
          onClick={() => setActiveTab('range')}
          icon={<Bookmark className="w-3.5 h-3.5" />}
          label="Range Notes"
          disabled={!rangeKey}
          badge={rangeNote.length > 0 && rangeKey ? '●' : null}
        />

        {/* Clear button – far right */}
        {activeNote.length > 0 && (
          <button
            id="clear-note-btn"
            onClick={clearNote}
            className="ml-auto mr-3 p-1.5 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150"
            aria-label="Clear note"
            title="Clear note"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Textarea ── */}
      <div className="relative px-4 pb-3 pt-3">
        {activeTab === 'month' ? (
          <textarea
            id="month-note-textarea"
            ref={textareaRef}
            className="w-full bg-transparent resize-none outline-none text-[13.5px] leading-[32px] text-gray-600 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-600 notebook-lines min-h-[128px]"
            placeholder="Jot down goals, reminders, or highlights for this month…"
            value={monthNote}
            onChange={handleMonthChange}
            maxLength={MAX_CHARS}
            spellCheck={false}
          />
        ) : rangeKey ? (
          <textarea
            id="range-note-textarea"
            ref={textareaRef}
            className="w-full bg-transparent resize-none outline-none text-[13.5px] leading-[32px] text-gray-600 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-600 notebook-lines min-h-[128px]"
            placeholder="Notes for your selected date range…"
            value={rangeNote}
            onChange={handleRangeChange}
            maxLength={MAX_CHARS}
            spellCheck={false}
          />
        ) : (
          <div className="min-h-[128px] flex flex-col items-center justify-center gap-2 text-gray-300 dark:text-gray-600">
            <Bookmark className="w-8 h-8 opacity-40" />
            <p className="text-xs text-center">Select a date range on the calendar<br />to enable range notes.</p>
          </div>
        )}
      </div>

      {/* ── Footer: char counter ── */}
      {(activeTab === 'month' || rangeKey) && (
        <div className="flex items-center gap-2 px-4 pb-3">
          {/* Progress bar */}
          <div className="flex-1 h-1 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${charPct}%`,
                backgroundColor: charWarning ? '#F59E0B' : 'var(--color-primary)',
              }}
            />
          </div>
          <span className={`text-[11px] font-medium tabular-nums ${charWarning ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'}`}>
            {charCount}/{MAX_CHARS}
          </span>
        </div>
      )}
    </div>
  );
}

function TabBtn({ id, active, onClick, icon, label, disabled, badge }) {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={[
        'flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all duration-200',
        active
          ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
          : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      {icon}
      {label}
      {badge && <span className="text-[8px] leading-none ml-0.5" style={{ color: 'var(--color-primary)' }}>{badge}</span>}
    </button>
  );
}
