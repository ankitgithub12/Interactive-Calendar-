import { format, differenceInCalendarDays } from 'date-fns';
import { X, ArrowRight } from 'lucide-react';

/**
 * Compact range summary for inside the portrait calendar card.
 * Shown only when at least a start date is selected.
 */
export default function RangeSummary({ startDate, endDate, onClear }) {
  if (!startDate) return null;

  const totalDays = endDate
    ? differenceInCalendarDays(endDate, startDate) + 1
    : 1;
  const nights = Math.max(0, totalDays - 1);

  return (
    <div className="flex items-center gap-3 px-4 py-2.5">

      {/* Start */}
      <div className="flex flex-col items-center min-w-[48px]">
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Start</span>
        <span className="text-base font-extrabold text-white leading-tight">
          {format(startDate, 'dd')}
        </span>
        <span className="text-[9px] text-white/70">{format(startDate, 'MMM')}</span>
      </div>

      {/* Arrow + duration badge */}
      <div className="flex-1 flex flex-col items-center gap-0.5">
        <ArrowRight className="w-3.5 h-3.5 text-white/50" />
        {endDate && totalDays > 1 && (
          <span className="text-[9px] font-semibold text-white/80 bg-white/15 rounded-full px-2 py-0.5 whitespace-nowrap">
            {totalDays}d {nights > 0 ? `/ ${nights}n` : ''}
          </span>
        )}
      </div>

      {/* End */}
      <div className="flex flex-col items-center min-w-[48px]">
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">End</span>
        {endDate ? (
          <>
            <span className="text-base font-extrabold text-white leading-tight">
              {format(endDate, 'dd')}
            </span>
            <span className="text-[9px] text-white/70">{format(endDate, 'MMM')}</span>
          </>
        ) : (
          <span className="text-xs text-white/35 italic mt-1">—</span>
        )}
      </div>

      {/* Clear btn */}
      <button
        id="clear-range-btn"
        onClick={onClear}
        className="ml-auto p-1.5 rounded-full hover:bg-white/20 active:scale-90 transition-all shrink-0"
        aria-label="Clear date selection"
        title="Clear"
      >
        <X className="w-3 h-3 text-white/70" />
      </button>
    </div>
  );
}
