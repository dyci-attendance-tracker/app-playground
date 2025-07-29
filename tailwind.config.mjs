// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/html/utils/withMT";
export default withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/html/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/html/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#231de3",
        'secondary': "#334155",
        'accent': "#3B82F6",
        'color-secondary': "#9CA3AF",
        'color': "#F3F4F6",
      },
      height: {
        svh: "100svh",
      },
      width: {
        svw: "100svw",
      },
    },
  },
  plugins: [],
});