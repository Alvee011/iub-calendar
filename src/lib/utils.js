import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function getDarkColorClasses(baseColor, type) {
    if (!baseColor) return '';

    // Enforce consistent Dark Mode colors by Category
    // "Grayish darker" - relying on text color for ID, background becomes neutral/dark
    const commonDarkBg = 'dark:bg-neutral-900/50';
    const commonDarkBorder = 'dark:border-neutral-800';

    switch (type) {
        case 'Registration':
            return `${commonDarkBg} dark:text-cyan-400 ${commonDarkBorder}`;
        case 'Holiday':
            return `${commonDarkBg} dark:text-red-400 ${commonDarkBorder}`;
        case 'Exam':
            return `${commonDarkBg} dark:text-purple-400 ${commonDarkBorder}`;
        case 'Payment':
            return `${commonDarkBg} dark:text-stone-400 ${commonDarkBorder}`;
        case 'Academic':
            return `${commonDarkBg} dark:text-slate-400 ${commonDarkBorder}`;
        default:
            // Fallback to regex matching if no type match (or for other types)
            break;
    }

    // Handle specific hex used for holidays (fallback)
    if (baseColor.includes('[#ffe4e6]')) {
        return 'dark:bg-red-900/40 dark:text-red-200 dark:border-red-800';
    }

    const colorMatch = baseColor.match(/-(cyan|emerald|amber|blue|red|slate|purple|stone|orange|rose|pink|indigo|violet|sky|lime|teal|fuchsia)-/);
    const colorName = colorMatch ? colorMatch[1] : 'slate';

    const isLightBackground = baseColor.includes('-50') || baseColor.includes('-100');

    // Deeper backgrounds for light base colors in dark mode
    // Lighter text for dark mode
    if (isLightBackground) {
        return `dark:bg-neutral-900/50 dark:text-${colorName}-400 dark:border-neutral-800`;
    }

    return `dark:bg-neutral-900/50 dark:text-${colorName}-400 dark:border-neutral-800`;
}
