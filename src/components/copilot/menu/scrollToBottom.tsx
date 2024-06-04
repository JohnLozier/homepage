import { TbArrowDown } from "solid-icons/tb";

const ScrollToBottom = ({ messageContainer }: {
	messageContainer: HTMLDivElement;
}) => {
	return <TbArrowDown onClick={ () => messageContainer.scroll({
		top: messageContainer.scrollHeight,
		behavior: "smooth"
	}) } stroke-width={ 2.5 } class="w-7 h-7 z-10 p-1 hover:translate-y-1 duration-500 cursor-pointer text-white/80"/>
};

export default ScrollToBottom;