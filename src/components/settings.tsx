import { FiEye, FiEyeOff } from "solid-icons/fi";
import { backgroundOptions, setBackgroundPattern } from "~/lib/background";
import { setShown, shown } from "~/lib/show";

import { Dynamic } from "solid-js/web";
import LozierSVG from "~/assets/lozier.svg?url";
import { onMount } from "solid-js";

const Lozier = () => {

	onMount(() => document.addEventListener("keydown", ({ key, target }) =>
		(key == "s" && !["input", "textarea"].includes((target as HTMLElement).localName)) && setShown(current => !current)
	));

	return <div style={ {
		scale: shown() ? 1 : 0.5,
		bottom: `${ shown() ? 0.5 : 0 }rem`,
		right: `${ shown() ? 0.75 : 0 }rem`
	} } class="absolute transition-all duration-500 flex flex-row select-none gap-x-2 bottom-2 items-center right-3">
		<Dynamic component={ shown() ? FiEye : FiEyeOff } color="white" stroke-width={ 1.5 } onClick={ () => setShown(current => !current) } class="cursor-pointer hover:[scale:1.10] duration-300 hover:animate-pulse [animation-duration:500] transition-[scale] w-9 h-9" />
		<img draggable="false" onClick={ ({ shiftKey }) =>
			setBackgroundPattern(current =>
				shiftKey ? current : backgroundOptions[(backgroundOptions.indexOf(current) + 1) % backgroundOptions.length]
			)
		} src={ "." + LozierSVG } class="cursor-pointer hover:[scale:1.10] duration-300 animate-spin hover:[animation-play-state:running] [animation-play-state:paused] [animation-duration:1s] transition-[scale] w-12 h-12" />
	</div>;
};

export default Lozier;