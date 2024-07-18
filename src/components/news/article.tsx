import DayJS from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

DayJS.extend(relativeTime);

const Article = (props: {
	img: string,
	light: boolean
	authorImg: string,
	link: string,
	content?: string,
	author?: string,
	date?: string,
	index: number
}) => {
	return <a draggable="false" style={ {
		"background-color": props.light ? "rgb(255 255 255 / 0.1)" : "rgb(0 0 0 / 0.1)",
		"animation-delay": `${ props.index * 200 }ms`
	} } onFocus={ ({ target }) => (target as HTMLAnchorElement).blur() } href={ props.link } class="flex w-full opacity-0 animate-[fadeIn_1s_ease-out_forwards,up_1s_ease-out] [&:hover>img]:scale-105 backdrop-blur-sm z-10 duration-300 cursor-pointer hover:-translate-y-2 transition-all bg-black/10 p-5 rounded-md h-full items-center flex-col gap-y-2">
		<img draggable="false" class="aspect-video hover:scale-105 select-none object-cover rounded-md transition-transform duration-300 w-full" src={ props.img } />
		<p class="text-white font-mona mb-4 font-semibold">{ props.content }</p>
		<div class="flex flex-row mt-auto items-center w-full gap-x-2 self-start">
			<img draggable="false" class="w-6 h-6 rounded-full select-none" src={ props.authorImg } />
			<span class="text-white font-montserrat overflow-hidden text-ellipsis whitespace-nowrap font-semibold">{ props.author ?? "Unknown" }</span>
			{ props.date &&
				<span class="text-white/70 flex-1 whitespace-nowrap font-mona text-sm ml-auto font-medium">{ DayJS(props.date).fromNow() }</span>
			}
		</div>
	</a>;
};

export default Article;