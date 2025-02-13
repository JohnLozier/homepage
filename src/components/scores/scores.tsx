import { For, createResource, createSignal, onMount } from "solid-js";

import Score from "./score";
import { getMatches } from "../../lib/soccer";
import { shown } from "~/lib/show";

const INITIAL_SHOWN = 2;

const Scores = () => {

	const [ scores, { refetch } ] = createResource(getMatches, {
		initialValue: [],
		ssrLoadFrom: "initial"
	});

	const [ amountShown, setAmountShown ] = createSignal(INITIAL_SHOWN);

	let container: HTMLDivElement;

	onMount(refetch);

	return <div style={ {
		display: shown() ? undefined : "none"
	} } class="absolute left-10 bottom-5 inset-y-5 flex justify-end items-center flex-col gap-y-1">
		<div ref={ container! } onClick={ ({ target }) => {
			target.scrollTo({
				top: 0,
				behavior: "smooth"
			});

			setAmountShown(amount => amount == -1 ? INITIAL_SHOWN : -1);
		} } style={ {
			"pointer-events": scores()?.length! > INITIAL_SHOWN ? undefined : "none",
			"overflow": amountShown() == -1 ? "scroll" : "hidden"
		} } class="flex-col-reverse w-max select-none cursor-pointer max-h-full [scrollbar-width:none] flex justify-stretch">
			<For each={ scores() }>
				{ (match, index) =>
					<Score match={ match } index={ index } shown={ amountShown } INITIAL_SHOWN={ INITIAL_SHOWN } length={ scores()?.length! } />
				}
			</For>
		</div>
	</div>
};

export default Scores;