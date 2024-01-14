import type {Config} from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: colors.slate,
        primary: colors.sky,
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
