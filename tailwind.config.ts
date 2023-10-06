import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ["var(--font-raleway)", ...defaultTheme.fontFamily.sans],
        vanillaCream: [
          "var(--font-vanillaCream)",
          ...defaultTheme.fontFamily.mono,
        ],
      },
      fontSize: {
        display: ["clamp(2.8rem, 2.55rem + 1.3333vw, 3.75rem)", "140%"],
      },
      spacing: {
        innerPadding: "clamp(32rem, -12.2105rem + 235.7895vw, 200rem)",
      },
      colors: {
        "faded-white": "rgba(0, 0, 0, 0.02)",
        "sidebar-faded-black": "rgba(0, 0, 0, .4)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
