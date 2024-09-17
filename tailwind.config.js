/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react")

module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    darkMode: "class",
    plugins: [
        nextui({
            prefix: "nextui", // prefix for themes variables
            addCommonColors: true, // override common colors (e.g. "blue", "green", "pink").
            defaultTheme: "light", // default theme from the themes object
            defaultExtendTheme: "light", // default theme to extend on custom themes
            layout: {}, // common layout tokens (applied to all themes)
            themes: {
                light: {
                    layout: {}, // light theme layout tokens
                    colors: {
                        background: "#FFFFFF", // or DEFAULT
                        foreground: "#27272A", // or 50 to 900 DEFAULT
                        primary: {
                            //... 50 to 900
                            foreground: "#FFFFFF",
                            DEFAULT: "#C4841D",
                        },
                    },
                    // light theme colors
                },
                dark: {
                    layout: {}, // dark theme layout tokens
                    colors: {
                        background: "#27272A", // or DEFAULT
                        foreground: "#ffffff", // or 50 to 900 DEFAULT
                        primary: {
                            //... 50 to 900
                            foreground: "#FFFFFF",
                            DEFAULT: "#C4841D",
                        },
                    },
                },
                // ... custom themes
            },
        })],
}
