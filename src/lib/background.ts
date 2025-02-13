import { backgroundOption } from "~/types/background";
import { createSignal } from "solid-js";

export const backgroundOptions = [
	"live" as const,
	"image" as const,
	"gradient" as const,
	"animated" as const
] as backgroundOption[];

export const [ backgroundPattern, setBackgroundPattern ] = createSignal<"gradient" | "animated" | "live" | "image">(backgroundOptions[Math.random() * Math.min(backgroundOptions.length - 1, 3) | 0], {
	equals: false
});

export const light = () =>
	[ "live", "image" ].includes(backgroundPattern());