import { Accessor, Setter } from "solid-js";
import { FiEye, FiEyeOff } from "solid-icons/fi";

import { Dynamic } from "solid-js/web";
import LozierSVG from "../assets/lozier.svg";

const Lozier = (props: {
	onClick: (event: MouseEvent) => void;
	show: Accessor<boolean>;
	setShow: Setter<boolean>;
}) => {
	document.addEventListener("keydown", ({ key, target }) =>
		(key == "s" && !["input", "textarea"].includes((target as HTMLElement).localName)) && props.setShow(current => !current)
	);

	return <div style={ {
		scale: props.show() ? 1 : 0.5,
		bottom: `${ props.show() ? 0.5 : 0 ?? 0.25 }rem`,
		right: `${ props.show() ? 0.75 : 0 ?? 0.375 }rem`
	} } class="absolute transition-all duration-500 flex flex-row select-none gap-x-2 bottom-2 items-center right-3">
		<Dynamic component={ props.show() ? FiEye : FiEyeOff } color="white" stroke-width={ 1.5 } onClick={ () => props.setShow(current => !current) } class="cursor-pointer hover:[scale:1.10] duration-300 hover:animate-pulse [animation-duration:500] transition-[scale] w-9 h-9" />
		<img draggable="false" onClick={ props.onClick } src={ LozierSVG } class="cursor-pointer hover:[scale:1.10] duration-300 animate-spin hover:[animation-play-state:running] [animation-play-state:paused] [animation-duration:1s] transition-[scale] w-12 h-12" />
	</div>;
};

export default Lozier;