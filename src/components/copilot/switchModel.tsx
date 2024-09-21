import { For, Show, createSignal } from "solid-js";

import { TbAlertTriangle } from "solid-icons/tb";

const Models = [
	{
		model: "gemini-1.5-flash",
		name: "Gemini 1.5 Flash",
		experimental: false
	},
	{
		model: "gemini-1.5-pro",
		name: "Gemini 1.5 Pro",
		experimental: false
	},
	{
		model: "gemini-1.0-pro",
		name: "Gemini 1.0 Pro",
		experimental: false
	},
	// {
	// 	model: "text-embedding-004",
	// 	name: "Text Embedding",
	// 	experimental: false
	// },
	// {
	// 	model: "aqa",
	// 	name: "AQA",
	// 	experimental: false
	// },
	{
		model: "gemini-1.5-pro-exp-0827",
		name: "Gemini 1.5 Pro",
		experimental: true
	},
	{
		model: "gemini-1.5-flash-exp-0827",
		name: "Gemini 1.5 Flash",
		experimental: true
	},
	{
		model: "gemini-1.5-flash-8b-exp-0827",
		name: "Gemini 1.5 Flash 8B",
		experimental: true
	}
];

interface SwitchModelProps {
	light?: boolean;
	defaultModel: string;
	changeModel: (model: string) => void;
};

const SwitchModel = ({ light, changeModel, defaultModel }: SwitchModelProps) => {
	const [ focused, setFocused ] = createSignal<boolean>(false);
	const [ selected, setSelected ] = createSignal<string>(defaultModel);

	return <div style={ {
		"border-bottom-left-radius": focused() ? "0" : "0.5rem",
		"border-bottom-right-radius": focused() ? "0" : "0.5rem",
		background: light ? "#ffffff19" : "#0000000C",
	} } onBlur={ console.log } onClick={ () => setFocused(current => !current) } class="text-white/80 backdrop-blur-sm px-3 relative flex justify-center cursor-pointer font-montserrat z-10 text-xs font-semibold py-1 bg-white/10 rounded-lg">
		<span style={ {
			opacity: focused() ? 0.2 : 1
		} } class="absolute self-center duration-500 transition-opacity">{ Models.find(({ model }) => model == selected())?.name }</span>
		<div class="flex flex-col h-5 opacity-0">
			<For each={ Models }>
				{ ({ name, experimental }) =>
					<div class="flex pointer-events-none justify-center gap-x-2 flex-row">
						<span>{ name }</span>
						<Show when={ experimental }>
							<TbAlertTriangle stroke-width={ 2 } />
						</Show>
					</div>
				}
			</For>
		</div>
		<div style={ {
			height: focused() ? `${ Models.length * 2 }rem` : "0rem",
		background: light ? "#ffffff19" : "#0000000C"
		} } class="absolute top-full transition-all overflow-hidden flex flex-col duration-500 ease-in-out right-0 w-full rounded-b-lg bg-white/10 backdrop-blur-sm">
			<For each={ Models }>
				{ ({ name, experimental, model }, index) => (
					<div onClick={ () => {
						setSelected(model);
						changeModel(model);
						localStorage.setItem("model", model);
					} } style={ {
						display: focused() ? "flex" : "none",
						"animation-delay": `${ index() * 200 }ms`
					} } class="flex animate-fadeIn justify-center [animation-duration:500ms] gap-x-2 opacity-0 items-center w-full flex-row hover:bg-black/10 py-2">
						<span style={ {
							opacity: model == selected() ? 1 : 0.6
						} }>{ name }</span>
						<Show when={ experimental }>
							<TbAlertTriangle style={ {
							opacity: model == selected() ? 1 : 0.6
						} } class="text-white" stroke-width={ 3 } />
						</Show>
					</div>
				) }
			</For>
		</div>
	</div>;
};

export default   SwitchModel;