import type { RecurrenceType } from '@types';
import { parseDateString, formatDateToString } from '@utils/dateParser';
import { RECURRENCE_TYPES } from '@constants/task';

/**
 * Calculates the next occurrence date for recurring tasks
 * Follows Single Responsibility Principle - only handles recurrence calculation
 */
export class RecurrenceCalculator {
  /**
   * Calculates the next date based on recurrence type
   * @param currentDate - Current due date (YYYY-MM-DD format)
   * @param recurrenceType - Type of recurrence
   * @returns Next occurrence date (YYYY-MM-DD format)
   */
  static calculateNextDate(currentDate: string, recurrenceType: RecurrenceType): string {
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
