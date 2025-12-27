import { useState, useEffect } from 'react';

function getStorageValue<T>(key: string, defaultValue: T): T {
    // getting stored value
    const saved = localStorage.getItem(key);
    try {
        const initial = saved ? JSON.parse(saved) : null;
        return initial || defaultValue;
    } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        return defaultValue;
    }
}

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
    const [value, setValue] = useState<T>(() => {
        return getStorageValue(key, defaultValue);
    });

    // Update internal state if the key changes (e.g. switching chapters)
    useEffect(() => {
        setValue(getStorageValue(key, defaultValue));
    }, [key, defaultValue]);

    useEffect(() => {
        // storing input whenever it changes
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
};
