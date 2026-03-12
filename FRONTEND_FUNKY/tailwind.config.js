/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend:{
            fontFamily: {
                    Jaro: ['"Jaro"', 'ui-sans-serif', 'system-ui'],
                    Genos: ['"Genos"', 'ui-sans-serif', 'system-ui'],
            },
            colors:{
                p:{
                    50: "rgba(33, 192, 154, 1)",
                },
                n:{
                    50: "rgba(255, 255, 255, 0.5)",
                    100: "rgba(255, 255, 255, 1)",
                    200: "rgba(217, 217, 217, 0.3)",
                    300: "rgba(0, 0, 0, 1)",
                },
                bg: {
                    primary: "#020B0A",
                }
            }
        }
    },
    plugins: [],
}