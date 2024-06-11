import LozierSVG from "../assets/lozier.svg";

const Lozier = ({ onClick }: {
	onClick?: (event: MouseEvent) => void;
}) => {
	return <img draggable="false" onClick={ onClick } src={ LozierSVG } class="absolute select-none cursor-pointer hover:[scale:1.10] duration-300 bottom-2 animate-spin hover:[animation-play-state:running] [animation-play-state:paused] [animation-duration:1s] transition-[scale] right-3 w-12 h-12" />;
};

export default Lozier;