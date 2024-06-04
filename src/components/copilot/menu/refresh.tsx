import { FiRefreshCcw } from "solid-icons/fi";
import { MessageType } from "../../../types/geminiMessage";
import type { Setter } from "solid-js";

const Refresh = ({ setConversation, resetGemini }: {
	setConversation: Setter<MessageType[]>;
	resetGemini: () => void;
}) => {
	return <FiRefreshCcw onClick={ () => {
		resetGemini();

		setConversation([{
			from: "model",
			message: "Hello! I'm Gemini, your personal AI assistant. How can I help you today?"
		}]);

		localStorage.setItem("copilotHistory", JSON.stringify([{
			from: "model",
			message: "Hello! I'm Gemini, your personal AI assistant. How can I help you today?"
		}]));
	} } stroke-width={ 2.5 } class="w-7 h-7 z-10 p-1 hover:rotate-[360deg] duration-500 cursor-pointer text-white/80" />
};

export default Refresh;