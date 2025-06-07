  module.exports = {
    darkMode: ['class', 'class'], // or 'media' if you prefer automatic detection
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    // tailwind.config.js
	theme: {
	extend: {
		colors: {
		background: 'hsl(var(--background))',
		foreground: 'hsl(var(--foreground))',
		card: 'hsl(var(--card))',
		'card-foreground': 'hsl(var(--card-foreground))',
		border: 'hsl(var(--border))',
		muted: 'hsl(var(--muted))',
		'muted-foreground': 'hsl(var(--muted-foreground))',
		primary: 'hsl(var(--primary))',
		'primary-foreground': 'hsl(var(--primary-foreground))',
		secondary: 'hsl(var(--secondary))',
		'secondary-foreground': 'hsl(var(--secondary-foreground))',
		},
	},
	},
    plugins: [require("tailwindcss-animate")],
  }
