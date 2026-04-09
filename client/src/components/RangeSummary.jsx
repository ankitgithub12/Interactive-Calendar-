import { format, differenceInCalendarDays } from 'date-fns';
import { X, ArrowRight } from 'lucide-react';

/**
 * Compact range summary — dark text on the light primary-tinted background card.
 */
export default function RangeSummary({ startDate, endDate, onClear }) {
  if (!startDate) return null;

  const totalDays = endDate
    ? differenceInCalendarDays(endDate, startDate) + 1
    : 1;
  const nights = Math.max(0, totalDays - 1);

  return (
    <div className="flex items-center gap-2 px-4 py-2.5">

      {/* Start */}
      <div className="flex flex-col items-center min-w-[44px]">
        <span
          className="text-[8px] font-bold uppercase tracking-widest opacity-60"
          style={{ color: 'var(--color-primary)' }}
        >
          Start
        </span>
        <span
          className="text-lg font-extrabold leading-tight"
          style={{ color: 'var(--color-primary)' }}
        >
          {format(startDate, 'dd')}
        </span>
        <span className="text-[9px] text-gray-500 dark:text-gray-400">
          {format(startDate, 'MMM')}
        </span>
      </div>

      {/* Arrow + duration */}
      <div className="flex-1 flex flex-col items-center gap-0.5">
        <ArrowRight className="w-3 h-3 opacity-40" style={{ color: 'var(--color-primary)' }} />
        {endDate && totalDays > 1 && (
          <span
            className="text-[9px] font-bold rounded-full px-2 py-0.5 whitespace-nowrap"
            style={{
              color:      'var(--color-primary)',
              background: `color-mix(in srgb, var(--color-primary) 15%, white)`,
            }}
          >
            {totalDays}d{nights > 0 ? ` · ${nights}n` : ''}
          </span>
        )}
      </div>

      {/* End */}
      <div className="flex flex-col items-center min-w-[44px]">
        <span
          className="text-[8px] font-bold uppercase tracking-widest opacity-60"
          style={{ color: 'var(--color-primary)' }}
        >
          End
        </span>
        {endDate ? (
          <>
            <span
              className="text-lg font-extrabold leading-tight"
              style={{ color: 'var(--color-primary)' }}
            >
              {format(endDate, 'dd')}
            </span>
            <span className="text-[9px] text-gray-500 dark:text-gray-400">
              {format(endDate, 'MMM')}
            </span>
          </>
        ) : (
          <span className="text-xs text-gray-300 dark:text-gray-600 italic mt-1">—</span>
        )}
      </div>

      {/* Clear */}
      <button
        id="clear-range-btn"
        onClick={onClear}
        className="ml-auto p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-400 transition-all active:scale-90 shrink-0"
        aria-label="Clear date selection"
        title="Clear selection"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
