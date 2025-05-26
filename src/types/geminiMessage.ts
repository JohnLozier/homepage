export type MessageType = {
	from: "user" | "model";
	text: string;
	grounding?: {
		title: string;
		url: string;
	}[];
	searches?: string[];
	thinking?: string;
	toolCalls?: string[];
};

export interface MessageError {
	error: {
		message: string;
		code: number;
		status: string;
	};
};