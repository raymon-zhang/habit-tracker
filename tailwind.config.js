module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            sans: "Jost, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        },
        extend: {
            boxShadow: {
                "md": "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 0 4px -2px rgb(0 0 0 / 0.07)",
                "lg": "0 7px 15px 0 rgb(0 0 0 / 0.1), 0 2px 6px -4px rgb(0 0 0 / 0.1)",
                "xl": "0 10px 25px 0 rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                "2xl": "0 20px 50px -10px rgb(0 0 0 / 0.25)",
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
