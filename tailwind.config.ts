import type { Config } from "tailwindcss";

const config: Config = {
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
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		fontFamily: {
  			display: ['var(--font-comfortaa)', 'system-ui', '-apple-system', 'sans-serif'],
  			body: ['var(--font-comfortaa)', 'system-ui', '-apple-system', 'sans-serif'],
  			sans: ['var(--font-comfortaa)', 'system-ui', '-apple-system', 'sans-serif'],
  		},
  		colors: {
  			// Keep shadcn vars for compatibility
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			
  			// Design system colors
  			warmBg: '#FBF6EE',
  			surface: {
  				DEFAULT: '#FFFFFF',
  				hover: '#FFFBF5',
  			},
  			primary: {
  				50: '#FDF3ED',
  				100: '#FAE3D4',
  				200: '#F5C5A8',
  				300: '#EFA177',
  				400: '#E97E4D',
  				500: '#D96D3A',
  				600: '#B85628',
  				700: '#8F4220',
  				800: '#6B3219',
  				900: '#4A2211',
  				DEFAULT: '#D96D3A',
  				foreground: '#FFFFFF',
  			},
  			secondary: {
  				50: '#F0F7F3',
  				100: '#DCEEE3',
  				200: '#B9DDC7',
  				300: '#95CCAB',
  				400: '#76A98B',
  				500: '#5F8A71',
  				600: '#4C6E5A',
  				700: '#3A5444',
  				800: '#283A2E',
  				900: '#16201A',
  				DEFAULT: '#76A98B',
  				foreground: '#FFFFFF',
  			},
  			accentMuted: {
  				DEFAULT: '#A57C52',
  				light: '#C29B7A',
  				dark: '#85633F',
  			},
  			text: {
  				primary: '#2B2B2B',
  				secondary: '#646464',
  				tertiary: '#8F8F8F',
  				inverse: '#FFFFFF',
  			},
  			success: {
  				DEFAULT: '#76A98B',
  				light: '#E8F5EE',
  			},
  			warning: {
  				DEFAULT: '#E9A853',
  				light: '#FDF3E7',
  			},
  			error: {
  				DEFAULT: '#D95A3A',
  				light: '#FDEBE7',
  			},
  			info: {
  				DEFAULT: '#5BA3C7',
  				light: '#E7F4F9',
  			},
  			borderColor: {
  				DEFAULT: '#E5E0D8',
  				light: '#F0EDE7',
  				dark: '#D0C9BC',
  			},
  			
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			sm: '0.5rem',
  			md: '0.75rem',
  			lg: '1rem',
  			xl: '1.25rem',
  			'2xl': '1.5rem',
  			full: '9999px',
  		},
  		boxShadow: {
  			sm: '0 1px 3px rgba(43, 43, 43, 0.08), 0 1px 2px rgba(43, 43, 43, 0.06)',
  			DEFAULT: '0 4px 8px rgba(43, 43, 43, 0.08), 0 2px 4px rgba(43, 43, 43, 0.06)',
  			md: '0 4px 8px rgba(43, 43, 43, 0.08), 0 2px 4px rgba(43, 43, 43, 0.06)',
  			lg: '0 12px 24px rgba(43, 43, 43, 0.1), 0 4px 8px rgba(43, 43, 43, 0.06)',
  			xl: '0 20px 40px rgba(43, 43, 43, 0.12), 0 8px 16px rgba(43, 43, 43, 0.08)',
  			inner: 'inset 0 2px 4px rgba(43, 43, 43, 0.06)',
  			glow: '0 0 20px rgba(217, 109, 58, 0.25)',
  			'glow-sm': '0 0 10px rgba(217, 109, 58, 0.15)',
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'bubble-rise': {
  				'0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.6' },
  				'50%': { transform: 'translateY(-20px) scale(1.1)', opacity: '1' },
  			},
  			pulse: {
  				'0%, 100%': { opacity: '1' },
  				'50%': { opacity: '0.7' },
  			},
  			'slide-up': {
  				from: { transform: 'translateY(100%)', opacity: '0' },
  				to: { transform: 'translateY(0)', opacity: '1' },
  			},
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'bubble-rise': 'bubble-rise 3s ease-in-out infinite',
  			pulse: 'pulse 2s ease-in-out infinite',
  			'slide-up': 'slide-up 0.3s ease-out',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
