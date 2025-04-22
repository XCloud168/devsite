import type { Config } from "tailwindcss";
import { PluginAPI } from "tailwindcss/types/config";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      clipPath: {
        "inverted-trapezoid": "polygon(0 0, 80px 0, 72px 5px, 8px 5px)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      perspective: {
        "1000": "1000px",
      },
      transformStyle: {
        "3d": "preserve-3d",
      },
      keyframes: {
        rotateY: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        bell: {
          "0%": { transform: "rotate(0deg)" },
          "15%": { transform: "rotate(15deg)" },
          "30%": { transform: "rotate(-10deg)" },
          "45%": { transform: "rotate(10deg)" },
          "60%": { transform: "rotate(-6deg)" },
          "75%": { transform: "rotate(4deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        loadingBar: {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "border-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "slide-in-from-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-to-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "border-spin": "border-spin 4s linear infinite",
        "slide-in-from-left": "slide-in-from-left 0.3s ease-out",
        "slide-out-to-left": "slide-out-to-left 0.3s ease-in",
        "loading-bar": "loadingBar 1.5s ease-in-out infinite",
        bell: "bell 0.8s ease-in-out infinite",
        rotateY: "rotateY 10s linear infinite",
      },
    },
  },
  plugins: [
    ({ addUtilities }: PluginAPI) => {
      const newUtilities = {
        ".clip-inverted-trapezoid": {
          "clip-path": "polygon(0 0, 80px 0, 72px 5px, 8px 5px)",
        },
      };
      addUtilities(newUtilities);
    },
    ({ addUtilities }: PluginAPI) => {
      const borderUtilities = {
        ".border-gradient-green-purple": {
          "border-image": "linear-gradient(to right, #03CC8ACC, #892DAE) 1",
        },
      };
      addUtilities(borderUtilities);
    },
    ({ addUtilities }: PluginAPI) => {
      const gradientUtilities = {
        ".bg-gradient-to-r-50-transparent": {
          "background-image":
            "linear-gradient(to right, #1A5FA4 0%, #0A243E00 60%)",
        },
      };
      addUtilities(gradientUtilities);
    },
    require("tailwindcss-animate"),
    require("tailwind-scrollbar"),
  ],
} satisfies Config;

export default config;
