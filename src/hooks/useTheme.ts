import { useEffect } from 'react';
import type { ColorTheme } from '../types';

export const useTheme = (theme: ColorTheme | null) => {
    useEffect(() => {
        if (!theme?.colors) return;

        // Apply theme colors as CSS variables
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
    }, [theme]);
};
