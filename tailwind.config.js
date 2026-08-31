import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                'pd-primary': '#FF6B00',
                'pd-bg': '#121212',
                'pd-surface': '#242424',
                'pd-elevated': '#2D2D2D',
                'pd-text': '#E0E0E0',
                'pd-muted': '#A9A9A9',
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                display: ['Anton', 'Impact', 'sans-serif'],
            },
        },
    },

    plugins: [forms],
};
