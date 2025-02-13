import { Accessor, type Setter } from "solid-js";

import GeminiLogo from "../../assets/gemini.svg?url";

const Icon = (props: {
	setShowSidebar: Setter<boolean>;
	showSidebar: Accessor<boolean>;
}) => {
	return <img draggable="false" style={ {
		opacity: props.showSidebar() ? 0 : 100
	} } onClick={ () => props.setShowSidebar(true) } src={ GeminiLogo } class="absolute select-none hover:w-10 hover:h-10 hover:left-1 hover:top-2 animate-fadeIn [animation-fill-mode:unset] transition-all duration-300 left-2 hover:rotate-12 cursor-pointer top-3 w-8 h-8" />
};

export default Icon;