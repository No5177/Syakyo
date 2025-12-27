/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Noto Serif TC"', '"Microsoft JhengHei"', 'serif'],
                kaitie: ['"KaiTi"', '"BiauKai"', '"DFKai-SB"', 'serif'],
            },
            colors: {
                buddhist: {
                    gold: '#e0b32b',
                    wood: '#8b4513',
                    cream: '#f8f7f5',
                    dark: '#5d3a00',
                }
            },
            writingMode: {
                'vertical-rl': 'vertical-rl',
            },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            const newUtilities = {
                '.writing-vertical-rl': {
                    'writing-mode': 'vertical-rl',
                },
                '.text-upright': {
                    'text-orientation': 'upright',
                },
            }
            addUtilities(newUtilities)
        }
    ],
}
