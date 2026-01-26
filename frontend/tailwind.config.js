
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'dark': {
                    900: '#121212', // Fond principal
                    800: '#1E1E1E', // Cartes
                    700: '#2C2C2C', // Inputs
                },
                'neon': {
                    yellow: '#FFE600', // Snapchat Yellow (Accent)
                    red: '#FF3B30',    // Alert
                    green: '#34C759',  // Success
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Police moderne
            }
        },
    },
    plugins: [],
}
