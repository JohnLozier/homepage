import { FiSearch } from "solid-icons/fi";

const Search = (props: {
	light?: boolean;
}) => {
	let input: HTMLInputElement;

	const onSubmit = () => {
		window.location.href= "https://www.google.com/search?q=" + input.value;
	};

	return <div style={ {
		"background-color": props.light ? "rgb(255 255 255 / 0.1)" : "rgb(0 0 0 / 0.1)"
	} } class="bg-black/10 absolute bottom-[15%] ml-[50%] backdrop-blur-sm -translate-x-1/2 focus-within:w-[45rem] focus-within:mb-32 animate-grow transition-all duration-500 h-20 items-center rounded-full flex flex-row w-[40rem]">
		<FiSearch onClick={ onSubmit } class="w-8 animate-fadeIn [animation-delay:0.5s] [animation-duration:0.5s] opacity-0 hover:w-9 cursor-pointer hover:-mr-[0.125rem] hover:ml-[1.125rem] hover:h-9 transition-all h-8 text-white/70 ml-5" />
		<input ref={ input! } type="search" onKeyUp={ ({ key }) => key == "Enter" ? onSubmit() : null } onSubmit={ onSubmit } class="text-white/70 caret-white/70 font-mona flex-1 h-2/3 outline-none bg-transparent text-[1.3rem] m-5 mr-10" />
	</div>
};

export default Search;