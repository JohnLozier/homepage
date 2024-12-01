export default {
	content: [
		"./src/**/*[.tsx, .jsx, .js, .ts]"
	],
	theme: {
		extend: {
			fontFamily: {
				"openSans": "Open Sans",
				"montserrat": "Montserrat",
				"mona": "Mona-Sans"
			},
			animation: {
				"fadeIn": "fadeIn 1s ease-out forwards",
				"up": "up 1s ease-out",
				"grow": "grow 0.7s ease-out",
			},
			keyframes: {
				"fadeIn": {
					"0%": {
						opacity: 0,
						filter: "blur(5px)"
					},
					"100%": {
						opacity: 1,
						filter: "blur(0)"
					}
				},
				"up": {
					"0%": {
						transform: "translateY(3rem)",
					},
					"100%": {
						transform: "translateY(0rem)",
					}
				},
				"grow": {
					"0%": {
						width: 0,
						height: 0,
						"box-shadow": "transparent 0 0 0 0"
					},
					"40%": {
						width: "30rem",
						height: "5rem"
					},
					"100%": {
						width: "40rem",
						height: "5rem",
						"box-shadow": "var(--tw-shadow-color) 0 0 20px 5px"
					}
				}
			}
		}
	}
};