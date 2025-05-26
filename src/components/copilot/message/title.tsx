import { Accessor, Show } from "solid-js";

import GeminiLogo from "../../../assets/gemini.svg?raw";
import Icon from "../../icon";
import { TbUserCircle } from "solid-icons/tb";

const Title = ({ from, showAnimation, time }: {
	from: "model" | "user";
	showAnimation?: boolean;
	time?: Accessor<number>;
}) => {
	return <div class="flex flex-row items-center gap-x-2">
		{
			from == "user" ? <TbUserCircle stroke-width={ 2.5 } class="text-white/80 animate-fadeIn h-6 w-6" /> : <Icon icon={ GeminiLogo } fill="#f5ffffcc" viewBox="0 0 28 28" class={ `w-6 h-6 ${ showAnimation ? "animate-fadeIn" : "" }` } />
		}
		<h3 style={{
			animation: from == "user" || showAnimation ? "fadeIn 1s ease-out forwards" : undefined
		}} class="font-montserrat font-bold [animation-delay:200ms] text-white/80">{ from == "model" ? "Gemini" : "You" }</h3>
		<Show when={ time }>
			<span class="text-white/80 ml-auto mr-1 font-mona font-semibold">{ time!() / 10 }s</span>
		</Show>
	</div>
};

export default Title;