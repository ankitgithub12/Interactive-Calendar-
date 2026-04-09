import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isBefore,
  isToday,
  getDay,
} from 'date-fns';
import { HOLIDAYS } from '../data/holidays';

// Week starts on Monday (weekStartsOn: 1), matching the reference image
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// Which day-of-week indices (0=Sun,6=Sat) are weekends
const IS_WEEKEND = (d) => getDay(d) === 0 || getDay(d) === 6;

export default function CalendarGrid({
  currentMonth,
  startDate,
  endDate,
  hoverDate,
  onDateClick,
  onDateHover,
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  // ── Effective range (handles hover preview) ────────────────────────
  const getRange = () => {
    if (startDate && endDate) {
      return isBefore(startDate, endDate)
        ? { start: startDate, end: endDate }
        : { start: endDate, end: startDate };
    }
    if (startDate && hoverDate) {
      return isBefore(startDate, hoverDate)
        ? { start: startDate, end: hoverDate }
        : { start: hoverDate, end: startDate };
    }
    return null;
  };
  const range = getRange();

  const inRange = (d) => range ? isWithinInterval(d, range) : false;
  const isRangeStart = (d) => range ? isSameDay(d, range.start) : false;
  const isRangeEnd = (d) => range ? isSameDay(d, range.end) : false;
  const isSingleSel = range ? isSameDay(range.start, range.end) : false;

  const getHoliday = (d) => HOLIDAYS[format(d, 'yyyy-MM-dd')] || null;

  return (
    <div className="w-full select-none">

      {/* ── Day-of-week headers ── */}
      <div className="grid grid-cols-7 mb-1">
        {WEEK_DAYS.map((label, colIdx) => {
          const isWknd = colIdx >= 5; // Sat=5, Sun=6
          return (
            <div
              key={label}
              className="text-center text-[9.5px] font-bold uppercase tracking-wider py-0.5"
              style={{ color: isWknd ? 'var(--color-primary)' : '#9CA3AF' }}
            >
              {label}
            </div>
          );
        })}
      </div>

      {/* ── Day cells ── */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const inMonth = isSameMonth(day, monthStart);
          const today = isToday(day);
          const weekend = IS_WEEKEND(day);
          const holiday = inMonth ? getHoliday(day) : null;

          const sel = inMonth && (
            (startDate && isSameDay(day, startDate)) ||
            (endDate && isSameDay(day, endDate))
          );
          const inRng = inMonth && inRange(day);
          const rStart = inMonth && isRangeStart(day);
          const rEnd = inMonth && isRangeEnd(day);
          const inMiddle = inRng && !rStart && !rEnd && !isSingleSel;

          // Range strip: half-circle caps at start/end, square in middle
          const stripStyle = inRng && !isSingleSel ? {
            position: 'absolute',
            top: '50%', transform: 'translateY(-50%)',
            height: '24px',
            background: `color-mix(in srgb, var(--color-primary) 18%, transparent)`,
            left: rStart ? '50%' : '0',
            right: rEnd ? '50%' : '0',
            borderRadius: rStart ? '12px 0 0 12px' : rEnd ? '0 12px 12px 0' : '0',
            zIndex: 0,
          } : null;

          // Text color for the day number
          let textColor;
          if (!inMonth) {
            textColor = '#D1D5DB'; // gray-300
          } else if (sel) {
            textColor = '#fff';
          } else if (inRng) {
            textColor = 'var(--color-primary)';
          } else if (weekend) {
            textColor = 'var(--color-primary)';
          } else {
            textColor = undefined; // inherit (dark mode handled by text class)
          }

          return (
            <div
              key={day.toString()}
              role="button"
              tabIndex={inMonth ? 0 : -1}
              aria-label={`${format(day, 'MMMM d yyyy')}${holiday ? ` — ${holiday}` : ''}`}
              title={holiday || undefined}
              className="relative flex items-center justify-center cursor-pointer"
              style={{ height: '26px' }}
              onMouseEnter={() => onDateHover(day)}
              onMouseLeave={() => onDateHover(null)}
              onClick={() => inMonth && onDateClick(day)}
              onKeyDown={(e) => e.key === 'Enter' && inMonth && onDateClick(day)}
            >
              {/* Range background strip */}
              {stripStyle && <div style={stripStyle} />}

              {/* Today indicator ring (pulse) */}
              {today && !sel && inMonth && (
                <span
                  className="today-ring"
                  style={{ color: 'var(--color-primary)' }}
                />
              )}

              {/* Day bubble */}
              <div
                className={[
                  'relative z-10 flex items-center justify-center rounded-full',
                  'text-[11px] font-medium transition-all duration-150',
                  inMonth && !sel && !inRng && 'hover:bg-gray-100 dark:hover:bg-gray-700',
                  sel ? 'w-6 h-6 font-bold scale-110 shadow-md' : 'w-6 h-6',
                ].filter(Boolean).join(' ')}
                style={{
                  backgroundColor: sel ? 'var(--color-primary)' : undefined,
                  color: textColor,
                  fontWeight: today && !sel ? 700 : undefined,
                }}
              >
                {format(day, 'd')}
              </div>

              {/* Holiday dot */}
              {holiday && inMonth && (
                <span
                  className="holiday-dot"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Mini legend ── */}
      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex-wrap">
        <LegendItem color="red" label="Holiday" dot />
        <LegendItem primary label="Weekend / Selected" />
      </div>
    </div>
  );
}

function LegendItem({ color, primary, label, dot }) {
  return (
    <div className="flex items-center gap-1">
      {dot ? (
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block flex-shrink-0" />
      ) : (
        <span
          className="w-3 h-3 rounded-full inline-block flex-shrink-0"
          style={{ background: primary ? 'var(--color-primary)' : color }}
        />
      )}
      <span className="text-[9px] text-gray-400 dark:text-gray-600 whitespace-nowrap">{label}</span>
    </div>
  );
}
