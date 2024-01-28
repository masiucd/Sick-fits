import type {Config} from "tailwindcss";
import colors from "tailwindcss/colors";

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
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animated")],
} satisfies Config;
