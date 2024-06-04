import { FiMaximize2, FiMinimize2 } from "solid-icons/fi";
import { Setter, createSignal } from "solid-js";

const Fullscreen = (props: {
	setWidth: Setter<string>;
}) => {

	const [ isFullscreen, toggleFullscreen ] = createSignal(false);

	const fullScreenChange = (fullscreen: boolean) => {
		toggleFullscreen(fullscreen);
		props.setWidth(fullscreen ? "100%" : "384px");
	};

	return <>{
		isFullscreen() ?
			<FiMinimize2 onClick={ () => fullScreenChange(false) } stroke-width={ 2.5 } class="w-7 h-7 z-10 p-1 hover:scale-110 transition-transform duration-500 cursor-pointer text-white/80" /> :
			<FiMaximize2 onClick={ () => fullScreenChange(true) } stroke-width={ 2.5 } class="w-7 h-7 z-10 p-1 hover:scale-110 transition-transform duration-500 cursor-pointer text-white/80" />
	}</>;
};

export default Fullscreen;