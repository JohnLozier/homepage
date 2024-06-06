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
				"fadeInUp": "fadeInUp 1s ease-out forwards",
				"grow": "grow 0.7s ease-out"
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
				"fadeInUp": {
					"0%": {
						opacity: 0,
						transform: "translateY(6rem)",
						filter: "blur(5px)"
					},
					"100%": {
						opacity: 1,
						transform: "translateY(0rem)",
						filter: "blur(0)"
					}
				},
				"grow": {
					"0%": {
						width: 0,
						height: 0
					},
					"40%": {
						width: "30rem",
						height: "5rem"
					},
					"100%": {
						width: "40rem",
						height: "5rem"
					}
				}
			}
		}
	}
};