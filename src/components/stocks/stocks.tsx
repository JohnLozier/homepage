import { For, createResource, onMount } from "solid-js";

import Stock from "./stock";
import { getStocks } from "../../lib/finance";
import { shown } from "~/lib/show";

const Stocks = () => {

	const [ data, { refetch } ] = createResource(getStocks, {
		initialValue: [],
		ssrLoadFrom: "initial"
	});

	onMount(refetch);

	return <div style={ {
		display: shown() ? undefined : "none"
	} } class="flex flex-col gap-5">
		<For each={ data() }>
			{
				Stock
			}
		</For>
	</div>
};

export default Stocks;