/**
 * Testes para Date Utils
 * 
 * Testa funções de timezone de Brasília
 */
import {
    createBrasiliaDate,
    formatDate,
    isPastDate,
    isToday,
    isTomorrow,
    parseDateLocal,
    secondsUntilDate
} from '@utils/dateUtils';

describe('Date Utils', () => {
    describe('parseDateLocal', () => {
        it('should parse YYYY-MM-DD to local Date', () => {
            const date = parseDateLocal('2024-12-25');

            expect(date.getFullYear()).toBe(2024);
            expect(date.getMonth()).toBe(11); // 0-indexed
            expect(date.getDate()).toBe(25);
        });
    });

    describe('formatDate', () => {
        it('should format string date to pt-BR format', () => {
            const result = formatDate('2024-12-25');

            expect(result).toBe('25/12/2024');
        });

        it('should format Date object to pt-BR format', () => {
            const date = new Date(2024, 11, 25); // December 25, 2024
            const result = formatDate(date);

            expect(result).toBe('25/12/2024');
        });
    });

    describe('isToday', () => {
        it('should return true for today', () => {
            const today = new Date();

            expect(isToday(today)).toBe(true);
        });

        it('should return false for yesterday', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const dateStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

            expect(isToday(dateStr)).toBe(false);
        });
    });

    describe('isTomorrow', () => {
        it('should return true for tomorrow', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            expect(isTomorrow(tomorrow)).toBe(true);
        });

        it('should return false for today', () => {
            const today = new Date();
            const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

            expect(isTomorrow(dateStr)).toBe(false);
        });
    });

    describe('isPastDate', () => {
        it('should return true for past dates', () => {
            expect(isPastDate('2020-01-01')).toBe(true);
        });

        it('should return false for future dates', () => {
            expect(isPastDate('2099-12-31')).toBe(false);
        });
    });

    describe('createBrasiliaDate', () => {
        it('should create date with time from strings', () => {
            const date = createBrasiliaDate('2024-12-25', '14:30');

            expect(date.getFullYear()).toBe(2024);
            expect(date.getMonth()).toBe(11);
            expect(date.getDate()).toBe(25);
            expect(date.getHours()).toBe(14);
            expect(date.getMinutes()).toBe(30);
        });

        it('should default to 9:00 when no time provided', () => {
            const date = createBrasiliaDate('2024-12-25');

            expect(date.getHours()).toBe(9);
            expect(date.getMinutes()).toBe(0);
        });
    });

    describe('secondsUntilDate', () => {
        it('should return positive seconds for future dates', () => {
            const future = new Date();
            future.setHours(future.getHours() + 1);

            const seconds = secondsUntilDate(future);

            expect(seconds).toBeGreaterThan(0);
            expect(seconds).toBeLessThanOrEqual(3600);
        });

        it('should return negative seconds for past dates', () => {
            const past = new Date();
            past.setHours(past.getHours() - 1);

            const seconds = secondsUntilDate(past);

            expect(seconds).toBeLessThan(0);
        });
    });
});
