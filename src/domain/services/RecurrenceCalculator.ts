import { RECURRENCE_TYPES } from '@constants/task';
import type { RecurrenceType, WeekDay } from '@types';
import { formatDateToString, parseDateString } from '@utils/dateParser';

/**
 * Calculates the next occurrence date for recurring tasks
 * Follows Single Responsibility Principle - only handles recurrence calculation
 */
export class RecurrenceCalculator {
  /**
   * Calculates the next date based on recurrence type
   * @param currentDate - Current due date (YYYY-MM-DD format)
   * @param recurrenceType - Type of recurrence
   * @param weekDays - For custom_weekly, which days of week to repeat
   * @returns Next occurrence date (YYYY-MM-DD format)
   */
  static calculateNextDate(
    currentDate: string,
    recurrenceType: RecurrenceType,
    weekDays?: WeekDay[]
  ): string {
    if (recurrenceType === RECURRENCE_TYPES.NONE) {
      return currentDate;
    }

    const date = parseDateString(currentDate);

    switch (recurrenceType) {
      case RECURRENCE_TYPES.DAILY:
        date.setDate(date.getDate() + 1);
        break;
      case RECURRENCE_TYPES.WEEKLY:
        date.setDate(date.getDate() + 7);
        break;
      case RECURRENCE_TYPES.CUSTOM_WEEKLY:
        if (weekDays && weekDays.length > 0) {
          // Find next selected weekday
          const currentDayOfWeek = date.getDay() as WeekDay;
          const sortedDays = [...weekDays].sort((a, b) => a - b);

          // Find next day after current
          let nextDay = sortedDays.find(d => d > currentDayOfWeek);

          if (nextDay !== undefined) {
            // Same week, next selected day
            const daysToAdd = nextDay - currentDayOfWeek;
            date.setDate(date.getDate() + daysToAdd);
          } else {
            // Next week, first selected day
            const daysToNextWeek = 7 - currentDayOfWeek + sortedDays[0];
            date.setDate(date.getDate() + daysToNextWeek);
          }
        } else {
          // Fallback to weekly if no days specified
          date.setDate(date.getDate() + 7);
        }
        break;
      case RECURRENCE_TYPES.MONTHLY:
        date.setMonth(date.getMonth() + 1);
        break;
      case RECURRENCE_TYPES.YEARLY:
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        console.warn(`Unknown recurrence type: ${recurrenceType}`);
        return currentDate;
    }

    return formatDateToString(date);
  }

  /**
   * Checks if a task should recur
   * @param recurrenceType - Type of recurrence
   * @returns True if task should recur
   */
  static shouldRecur(recurrenceType: RecurrenceType): boolean {
    return recurrenceType !== RECURRENCE_TYPES.NONE;
  }
}
