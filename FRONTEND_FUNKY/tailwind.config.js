/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [],
    theme: {
        extend:{
            fontFamily: {
                    Jaro: ['"Jaro"', 'ui-sans-serif', 'system-ui'],
                    Genos: ['"Genos"', 'ui-sans-serif', 'system-ui'],
            },
            colors:{
                p:{
                    50: "rgba(33, 192, 154, 1)", //#21C09A
                },
                n:{
                    50: "rgba(255, 255, 255, 0.5)", // #F7F8F9
                    100: "rgba(255, 255, 255, 1)", // #E7EAEE
                    200: "rgba(217, 217, 217, 0.3)", // #D0D5DD
                    300: "rgba(0, 0, 0, 1)", // #4B5768

                }
            }
        }
    },
    plugins: [],
}