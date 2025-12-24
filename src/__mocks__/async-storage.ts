// Mock for AsyncStorage
export const getItem = jest.fn(() => Promise.resolve(null));
export const setItem = jest.fn(() => Promise.resolve());
export const removeItem = jest.fn(() => Promise.resolve());
export const clear = jest.fn(() => Promise.resolve());

export default {
    getItem,
    setItem,
    removeItem,
    clear,
};
