import { IconProps } from "solid-icons";

const Icon = (props: IconProps & {
	icon: string;
}) => {
	return <div class="contents" innerHTML={ props.icon } />
};

export default Icon;