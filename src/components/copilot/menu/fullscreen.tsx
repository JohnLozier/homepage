import { FiMaximize2, FiMinimize2 } from "solid-icons/fi";
import { Setter, Show, createSignal } from "solid-js";

const Fullscreen = ({ setExpanded }: {
	setExpanded: Setter<true | undefined>;
}) => {
	const [ isFullscreen, toggleFullscreen ] = createSignal(false);

	const fullScreenChange = (fullscreen: boolean) => {
		toggleFullscreen(fullscreen);
		setExpanded(fullscreen ? true : undefined);
	};

	return <Show when={ isFullscreen() } fallback={
		<FiMaximize2 onClick={ () => fullScreenChange(true) } stroke-width={ 2.5 } class="w-7 h-7 z-10 p-1 hover:scale-110 transition-transform duration-500 cursor-pointer text-white/80" />
	}>
		<FiMinimize2 onClick={ () => fullScreenChange(false) } stroke-width={ 2.5 } class="w-7 h-7 z-10 p-1 hover:scale-110 transition-transform duration-500 cursor-pointer text-white/80" />
	</Show>;
};

export default Fullscreen;