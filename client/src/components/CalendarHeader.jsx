import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { format, isThisMonth } from 'date-fns';

export default function CalendarHeader({ currentMonth, onPrevMonth, onNextMonth, onToday }) {
  const alreadyThisMonth = isThisMonth(currentMonth);

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Month + Year */}
      <div>
        <h2
          className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {format(currentMonth, 'MMMM')}
          <span className="ml-2 text-gray-400 dark:text-gray-500 font-light text-xl">
            {format(currentMonth, 'yyyy')}
          </span>
        </h2>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* Today button — only visible when not on current month */}
        {!alreadyThisMonth && (
          <button
            id="today-btn"
            onClick={onToday}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:scale-105 active:scale-95 mr-1"
            style={{
              color: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
              background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
            }}
            aria-label="Jump to today"
            title="Jump to today"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Today
          </button>
        )}

        {/* Prev month */}
        <button
          id="prev-month-btn"
          onClick={onPrevMonth}
          className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-transparent shadow-sm group transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Previous month"
          title="Previous month"
          style={{ '--tw-shadow-color': 'var(--color-primary)' }}
        >
          <ChevronLeft
            className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400 group-hover:text-[var(--color-primary)] transition-colors"
          />
        </button>

        {/* Next month */}
        <button
          id="next-month-btn"
          onClick={onNextMonth}
          className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-transparent shadow-sm group transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Next month"
          title="Next month"
        >
          <ChevronRight
            className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400 group-hover:text-[var(--color-primary)] transition-colors"
          />
        </button>
      </div>
    </div>
  );
}
