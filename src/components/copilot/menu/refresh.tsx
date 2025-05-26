import { FiRefreshCcw } from "solid-icons/fi";

const Refresh = ({ resetChat }: {
	resetChat: Function;
}) => {
	return <FiRefreshCcw onClick={ () =>
		resetChat()
	} stroke-width={ 2.5 } class="w-7 h-7 z-10 p-1 hover:rotate-[360deg] duration-500 cursor-pointer text-white/80" />
};

export default Refresh;