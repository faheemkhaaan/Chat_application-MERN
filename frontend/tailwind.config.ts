import type { Config } from 'tailwindcss';

export default {
    content: [
        './src/**/*.{js,ts,jsx,tsx}', // Adjust paths based on your project structure
    ],
    theme: {
        extend: {
            colors: {
                cordovan: "#904e55",
                wenge: "#564E58",
                ecru: "#BFB48F",
                isabelline: "#f2efe9",
                eerie_black: "#252627",
            },

        },
    },
    plugins: [],
} satisfies Config;