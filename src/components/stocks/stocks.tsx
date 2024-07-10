import { For, createResource } from "solid-js";

import Stock from "./stock";
import { getStocks } from "../../lib/finance";

const Stocks = () => {

	const [ data ] = createResource(getStocks);

	return <div class="flex flex-col gap-5">
		<For each={ data() }>
			{
				Stock
			}
		</For>
	</div>
};

export default Stocks;