import Icon from "./icon";
import Sidebar from "./sidebar";
import { createSignal } from "solid-js";

const Copilot = (props: {
	light?: boolean;
}) => {

	const [ showSidebar, setShowSidebar ] = createSignal(false);

	return <>
		<Icon setShowSidebar={ setShowSidebar } showSidebar={ showSidebar } />
		<Sidebar light={ props.light } setShowSidebar={ setShowSidebar } showSidebar={ showSidebar } />
	</>;
};

export default Copilot;