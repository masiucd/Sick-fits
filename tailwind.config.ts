import type {Config} from "tailwindcss";
import colors from "tailwindcss/colors";
import theme from "tailwindcss/defaultTheme";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: colors.slate,
        primary: colors.yellow,
      },
      backgroundImage: {
        anchor: "url('/images/anchor.svg')",
      },
      fontFamily: {
        sans: ["Haymaker", ...theme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animated")],
} satisfies Config;
