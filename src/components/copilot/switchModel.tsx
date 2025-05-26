import { Accessor, For, Setter, Show, createSignal } from "solid-js";

import { TbAlertTriangle } from "solid-icons/tb";
import { models } from "~/lib/models";

const SwitchModel = ({ light, model, setModel }: {
	light?: boolean;
	model: Accessor<string>;
	setModel: Setter<string>;
}) => {
	const [ focused, setFocused ] = createSignal<boolean>(false);

	return <div style={ {
		"border-bottom-left-radius": focused() ? "0" : "0.5rem",
		"border-bottom-right-radius": focused() ? "0" : "0.5rem",
		background: light ? "#ffffff19" : "#0000000C",
	} } onClick={ () => setFocused(current => !current) } class="text-white/80 backdrop-blur-sm px-3 relative flex justify-center cursor-pointer font-montserrat z-10 text-xs font-semibold py-1 bg-white/10 rounded-lg">
		<div class="absolute self-center flex flex-row duration-500 transition-opacity items-center gap-x-2 justify-center" style={ {
			opacity: focused() ? 0.2 : 1
		} }>
			<span>{ models.get(model())?.name }</span>
			<Show when={ models.get(model())?.experimental }>
				<TbAlertTriangle class="text-white" stroke-width={ 3 } />
			</Show>
		</div>
		<div class="flex flex-col h-5 opacity-0">
			<For each={ Array.from(models.values()) }>
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
			height: focused() ? `${ models.size * 2 }rem` : "0rem",
			background: light ? "#ffffff19" : "#0000000C"
		} } class="absolute top-full transition-all overflow-hidden flex flex-col duration-500 ease-in-out right-0 w-full rounded-b-lg bg-white/10 backdrop-blur-sm">
			<For each={ Array.from(models, ([ key, values ]) => ({
				model: key,
				...values
			})) }>
				{ ({ name, experimental, model: identifier }, index) => (
					<div onClick={ () => {
						setModel(identifier);
					} } style={ {
						display: focused() ? "flex" : "none",
						"animation-delay": `${ index() * 100 }ms`
					} } class="flex animate-fadeIn justify-center [animation-duration:500ms] gap-x-2 opacity-0 items-center w-full flex-row hover:bg-black/10 py-2">
						<span style={ {
							opacity: identifier == model() ? 1 : 0.6
						} }>{ name }</span>
						<Show when={ experimental }>
							<TbAlertTriangle style={ {
								opacity: identifier == model() ? 1 : 0.6
							} } class="text-white" stroke-width={ 3 } />
						</Show>
					</div>
				) }
			</For>
		</div>
	</div>;
};

export default SwitchModel;