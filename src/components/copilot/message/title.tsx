import GeminiLogo from "../../../assets/gemini.svg";
import { TbUserCircle } from "solid-icons/tb";

const Title = ({ from, showAnimation }: {
	from: "model" | "user";
	showAnimation?: boolean;
}) => {
	return <div class="flex flex-row items-center gap-x-2">
		{
			from == "user" ? <TbUserCircle stroke-width={ 2.5 } class="text-white/80 animate-fadeIn h-6 w-6" /> : <img class={ `text-white/80 w-6 h-6 ${ showAnimation ? "animate-fadeIn" : "" }` } src={ GeminiLogo } />
		}
		<h3 style={{
			animation: from == "user" || showAnimation ? "fadeIn 1s ease-out forwards" : undefined
		}} class="font-montserrat font-bold [animation-delay:200ms] text-white/80">{ from == "model" ? "Gemini" : "You" }</h3>
	</div>
};

export default Title;