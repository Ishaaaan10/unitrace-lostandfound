/**
 * Date and Time utilities for UniTrace
 * Ensures human-friendly, accurate, and student-operable date/time formatting.
 */

/**
 * Returns today's date in local YYYY-MM-DD format (prevents UTC timezone shift)
 */
export function getCurrentDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns current local time in HH:MM (24-hour format for input[type="time"])
 */
export function getCurrentTimeString(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Converts 24-hour time string ("14:30") to friendly 12-hour AM/PM string ("2:30 PM")
 */
export function formatTime12Hour(timeStr?: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;

  let hours = parseInt(parts[0], 10);
  const minutes = parts[1].slice(0, 2);
  if (isNaN(hours)) return timeStr;

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12

  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Formats a YYYY-MM-DD date and optional HH:MM time into human-friendly relative or calendar format.
 * E.g., "Today • 10:30 AM", "Yesterday • 4:15 PM", "Nov 21, 2026 • 2:00 PM"
 */
export function formatDisplayDate(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return 'Unknown date';

  const formattedTime = timeStr ? formatTime12Hour(timeStr) : '';

  try {
    const today = getCurrentDateString();
    
    // Check for yesterday
    const now = new Date();
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`;

    if (dateStr === today) {
      return formattedTime ? `Today • ${formattedTime}` : 'Today';
    }

    if (dateStr === yesterdayStr) {
      return formattedTime ? `Yesterday • ${formattedTime}` : 'Yesterday';
    }

    // Parse the date components safely
    const [year, month, day] = dateStr.split('-').map((v) => parseInt(v, 10));
    if (year && month && day) {
      const dateObj = new Date(year, month - 1, day);
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ];
      const monthLabel = monthNames[dateObj.getMonth()] || '';
      const dayLabel = dateObj.getDate();
      const currentYear = now.getFullYear();

      const yearLabel = year === currentYear ? '' : `, ${year}`;
      const baseDate = `${dayLabel} ${monthLabel}${yearLabel}`;

      return formattedTime ? `${baseDate} • ${formattedTime}` : baseDate;
    }

    return formattedTime ? `${dateStr} • ${formattedTime}` : dateStr;
  } catch {
    return formattedTime ? `${dateStr} • ${formattedTime}` : (dateStr || '');
  }
}

/**
 * Formats an ISO timestamp (e.g. 2026-11-23T10:30:00Z) into a relative label:
 * "Just now", "25 mins ago", "2 hours ago", "Yesterday", or "21 Nov 2026"
 */
export function formatRelativeTime(isoString?: string): string {
  if (!isoString) return '';

  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${monthNames[date.getMonth()]}`;
  } catch {
    return isoString;
  }
}
